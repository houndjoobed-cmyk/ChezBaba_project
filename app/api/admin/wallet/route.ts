import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { auth } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { ERROR_MESSAGES } from "@/lib/constants/settings";

export async function GET(req: NextRequest) {
  const session = await auth();

  // Check if user is authenticated and has admin role
  if (!session) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNAUTHORIZED },
      { status: 401 }
    );
  }
  if (session.user.role !== UserRole.ADMIN) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.FORBIDDEN },
      { status: 403 }
    );
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    const typeFiltre = searchParams.get("type");
    const startDateStr = searchParams.get("startDate");
    const endDateStr = searchParams.get("endDate");

    // Conditions pour les filtres de date (partagées par toutes les tables)
    const dateCondition: { gte?: Date; lte?: Date } = {};
    if (startDateStr) {
      dateCondition.gte = new Date(startDateStr);
    }
    if (endDateStr) {
      const endDate = new Date(endDateStr);
      endDate.setHours(23, 59, 59, 999);
      dateCondition.lte = endDate;
    }

    const hasDateFilter = Object.keys(dateCondition).length > 0;

    // Calcul du solde total GLOBAL (Revenus plateforme, ne dépend pas des filtres date/type)
    const globalAggregation = await prisma.grandLivrePlateforme.aggregate({
      _sum: {
        montant: true,
      },
    });
    const soldeTotal = globalAggregation._sum.montant ? globalAggregation._sum.montant.toNumber() : 0;

    let transactions: Array<{id: string, type: string, montant: number, description: string | null, date: string, commandeId: string | null, status: string}> = [];
    const fetchAll = !typeFiltre || typeFiltre === "ALL";

    // 1. GrandLivrePlateforme (COMMISSION & FRAIS)
    if (fetchAll || typeFiltre === "COMMISSION" || typeFiltre === "FRAIS") {
      const glCondition: { date?: typeof dateCondition; type?: string | { in: string[] } } = {};
      if (hasDateFilter) glCondition.date = dateCondition;
      if (typeFiltre === "COMMISSION") glCondition.type = "COMMISSION";
      if (typeFiltre === "FRAIS") glCondition.type = { in: ["FRAIS_CARTE", "FRAIS_REVERSEMENT"] };

      const glData = await prisma.grandLivrePlateforme.findMany({
        where: glCondition,
        take: 500,
        include: { commande: { select: { id: true } } }
      });
      
      transactions.push(...glData.map(t => ({
        id: t.id,
        type: t.type, // COMMISSION, FRAIS_CARTE, FRAIS_REVERSEMENT
        montant: t.montant.toNumber(),
        description: t.description,
        date: t.date.toISOString(),
        commandeId: t.commandeId,
        status: "N/A"
      })));
    }

    // 2. Paiement (VENTE)
    if (fetchAll || typeFiltre === "VENTE") {
      const pCondition: { date?: typeof dateCondition } = {};
      if (hasDateFilter) pCondition.date = dateCondition;

      const pData = await prisma.paiement.findMany({
        where: pCondition,
        take: 500,
        include: { commande: { select: { id: true } } }
      });

      transactions.push(...pData.map(t => ({
        id: t.id,
        type: "VENTE",
        montant: t.montantBrut.toNumber(),
        description: `Vente #${t.commandeId.substring(0, 8).toUpperCase()}`,
        date: t.date.toISOString(),
        commandeId: t.commandeId,
        status: t.statut, 
      })));
    }

    // 3. Retrait (RETRAIT)
    if (fetchAll || typeFiltre === "RETRAIT") {
      const rCondition: { dateDemande?: typeof dateCondition } = {};
      if (hasDateFilter) rCondition.dateDemande = dateCondition;

      const rData = await prisma.retrait.findMany({
        where: rCondition,
        take: 500,
        include: { portefeuille: { include: { vendeur: { select: { nomBoutique: true } } } } }
      });

      transactions.push(...rData.map(t => ({
        id: t.id,
        type: "RETRAIT",
        montant: t.montant.toNumber(),
        description: `Retrait - ${t.portefeuille?.vendeur?.nomBoutique || "Vendeur inconnu"}`,
        date: t.dateDemande.toISOString(),
        status: t.statut,
        commandeId: null,
      })));
    }

    // 4. DemandeRemboursement (REMBOURSEMENT)
    if (fetchAll || typeFiltre === "REMBOURSEMENT") {
      const drCondition: { dateDemande?: typeof dateCondition } = {};
      if (hasDateFilter) drCondition.dateDemande = dateCondition;

      const drData = await prisma.demandeRemboursement.findMany({
        where: drCondition,
        take: 500,
        include: { commande: { select: { id: true } } }
      });

      transactions.push(...drData.map(t => ({
        id: t.id,
        type: "REMBOURSEMENT",
        montant: t.montant.toNumber(),
        description: `Remboursement #${t.commandeId.substring(0, 8).toUpperCase()}`,
        date: t.dateDemande.toISOString(),
        status: t.statut,
        commandeId: t.commandeId,
      })));
    }

    // Mélanger et trier toutes les opérations par date décroissante
    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Limiter le nombre total à renvoyer pour éviter de surcharger
    transactions = transactions.slice(0, 500);

    // Calcul du solde FILTRÉ
    let soldeFiltre = 0;
    if (fetchAll || typeFiltre === "COMMISSION" || typeFiltre === "FRAIS") {
      // Pour la vue globale ou liée aux revenus directs, on recalcule depuis le GrandLivre
      const fbCondition: { date?: typeof dateCondition; type?: string | { in: string[] } } = {};
      if (hasDateFilter) fbCondition.date = dateCondition;
      if (typeFiltre === "COMMISSION") fbCondition.type = "COMMISSION";
      if (typeFiltre === "FRAIS") fbCondition.type = { in: ["FRAIS_CARTE", "FRAIS_REVERSEMENT"] };
      
      const filtreAggregation = await prisma.grandLivrePlateforme.aggregate({
        where: fbCondition,
        _sum: { montant: true },
      });
      soldeFiltre = filtreAggregation._sum.montant ? filtreAggregation._sum.montant.toNumber() : 0;
    } else {
      // Pour les vues VENTE, RETRAIT, REMBOURSEMENT, le solde filtré représente le volume de ce sous-ensemble
      soldeFiltre = transactions.reduce((sum, tx) => sum + tx.montant, 0);
    }

    return NextResponse.json({
      soldeTotal,
      soldeFiltre,
      transactions,
    });
  } catch (error) {
    console.error("Erreur dans /api/admin/wallet:", error);
    return NextResponse.json({ error: "Erreur serveur lors de la récupération du portefeuille" }, { status: 500 });
  }
}
