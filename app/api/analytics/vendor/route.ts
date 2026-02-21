import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { auth } from "@/lib/auth";
import { UserRole, CommandeStatut } from "@prisma/client";
import { ERROR_MESSAGES } from "@/lib/constants/settings";

export async function GET(_req: NextRequest) {
  const session = await auth();

  // Check if user is authenticated and has vendor role
  if (!session) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNAUTHORIZED },
      { status: 401 }
    );
  }
  if (session.user.role !== UserRole.VENDEUR) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.FORBIDDEN },
      { status: 403 }
    );
  }

  const statutsValides = [
    CommandeStatut.PAYEE,
    CommandeStatut.EN_PREPARATION,
    CommandeStatut.EXPEDIEE,
    CommandeStatut.LIVREE,
    CommandeStatut.LIVRAISON_CONFIRMEE
  ];

  try {
    const [
      totalProduits,
      meilleurProduit,
      pireProduit,
      commandes,
    ] = await Promise.all([
      prisma.produit.count({
        where: {
          produitMarketplace: {
            vendeurId: session.user.id,
          },
        },
      }),
      prisma.produit.findFirst({
        orderBy: { noteMoyenne: "desc" },
        where: {
          produitMarketplace: {
            vendeurId: session.user.id,
          },
          noteMoyenne: { not: 0 },
        },
        select: {
          id: true,
          nom: true,
          noteMoyenne: true,
          totalEvaluations: true
        },
      }),
      prisma.produit.findFirst({
        orderBy: { noteMoyenne: "asc" },
        where: {
          produitMarketplace: {
            vendeurId: session.user.id,
          },
          noteMoyenne: { gt: 0 },
        },
        select: {
          id: true,
          nom: true,
          noteMoyenne: true,
          totalEvaluations: true
        },
      }),
      prisma.commande.findMany({
        where: {
          statut: { in: statutsValides },
          lignesCommande: {
            some: {
              produit: {
                produitMarketplace: {
                  vendeurId: session.user.id,
                },
              },
            },
          },
        },
        include: {
          lignesCommande: {
            where: {
              produit: {
                produitMarketplace: {
                  vendeurId: session.user.id,
                },
              },
            },
          },
        },
      }),
    ]);

    // Compute vendor-specific sales stats from valid orders
    let totalVentes = 0;
    let produitsVendus = 0;

    // Pour trouver le produit générant le plus de revenus
    const productRevenuMap = new Map<string, { totalRevenu: number; quantite: number }>();

    for (const cmd of commandes) {
      for (const line of cmd.lignesCommande) {
        const itemRevenue = line.quantite * Number(line.prixUnit);
        totalVentes += itemRevenue;
        produitsVendus += line.quantite;

        if (line.produitId) {
          const pData = productRevenuMap.get(line.produitId) || { totalRevenu: 0, quantite: 0 };
          productRevenuMap.set(line.produitId, {
            totalRevenu: pData.totalRevenu + itemRevenue,
            quantite: pData.quantite + line.quantite,
          });
        }
      }
    }

    let topProductInfo = null;
    let maxRevenu = -1;
    for (const [pId, data] of Array.from(productRevenuMap.entries())) {
      if (data.totalRevenu > maxRevenu) {
        maxRevenu = data.totalRevenu;
        topProductInfo = { id: pId, ...data };
      }
    }

    const produitPlusRevenuDetails = topProductInfo?.id
      ? await prisma.produit.findUnique({
        where: { id: topProductInfo.id },
        select: {
          id: true,
          nom: true,
          prix: true,
        },
      })
      : null;

    // WeekData
    const weekDataMap = new Map();
    const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    for (const cmd of commandes) {
      const day = days[new Date(cmd.date).getDay()];
      const prev = weekDataMap.get(day) || { sales: 0, itemsSold: 0 };

      let cmdVentes = 0;
      let cmdItems = 0;
      for (const line of cmd.lignesCommande) {
        cmdItems += line.quantite;
        cmdVentes += line.quantite * Number(line.prixUnit);
      }

      weekDataMap.set(day, {
        sales: prev.sales + cmdVentes,
        itemsSold: prev.itemsSold + cmdItems,
      });
    }
    const weekData = days.map((day) => ({
      day,
      sales: weekDataMap.get(day)?.sales || 0,
      itemsSold: weekDataMap.get(day)?.itemsSold || 0,
    }));

    // MonthData (tranches 1-5, 6-10, ...)
    const getRangeLabel = (day: number) => {
      const start = Math.floor((day - 1) / 5) * 5 + 1;
      const end = Math.min(start + 4, 30);
      return `${start}-${end}`;
    };

    const monthDataMap = new Map();
    for (const cmd of commandes) {
      const day = new Date(cmd.date).getDate();
      const range = getRangeLabel(day);
      const prev = monthDataMap.get(range) || { sales: 0, itemsSold: 0 };

      let cmdVentes = 0;
      let cmdItems = 0;
      for (const line of cmd.lignesCommande) {
        cmdItems += line.quantite;
        cmdVentes += line.quantite * Number(line.prixUnit);
      }

      monthDataMap.set(range, {
        sales: prev.sales + cmdVentes,
        itemsSold: prev.itemsSold + cmdItems,
      });
    }
    const monthData = Array.from(monthDataMap.entries())
      .sort()
      .map(([day, data]) => ({
        day,
        ...data,
      }));

    // YearData (mois en abrégé français)
    const months = [
      "Jan",
      "Fév",
      "Mar",
      "Avr",
      "Mai",
      "Juin",
      "Juil",
      "Août",
      "Sept",
      "Oct",
      "Nov",
      "Déc",
    ];
    const yearDataMap = new Map();
    for (const cmd of commandes) {
      const monthIndex = new Date(cmd.date).getMonth();
      const label = months[monthIndex];
      const prev = yearDataMap.get(label) || { sales: 0, itemsSold: 0 };

      let cmdVentes = 0;
      let cmdItems = 0;
      for (const line of cmd.lignesCommande) {
        cmdItems += line.quantite;
        cmdVentes += line.quantite * Number(line.prixUnit);
      }

      yearDataMap.set(label, {
        sales: prev.sales + cmdVentes,
        itemsSold: prev.itemsSold + cmdItems,
      });
    }
    const yearData = months.map((month) => ({
      month,
      sales: yearDataMap.get(month)?.sales || 0,
      itemsSold: yearDataMap.get(month)?.itemsSold || 0,
    }));

    return NextResponse.json({
      totalVentes,
      totalProduits,
      produitsVendus,
      meilleurProduit: meilleurProduit ? {
        id: meilleurProduit.id,
        nom: meilleurProduit.nom,
        noteMoyenne: meilleurProduit.noteMoyenne,
        totalEvaluations: meilleurProduit.totalEvaluations
      } : null,
      pireProduit: pireProduit ? {
        id: pireProduit.id,
        nom: pireProduit.nom,
        noteMoyenne: pireProduit.noteMoyenne,
        totalEvaluations: pireProduit.totalEvaluations
      } : null,
      produitPlusRevenu: produitPlusRevenuDetails && topProductInfo
        ? {
          ...produitPlusRevenuDetails,
          totalRevenu: topProductInfo.totalRevenu,
          quantiteVendue: topProductInfo.quantite,
        }
        : null,
      weekData,
      monthData,
      yearData,
    });
  } catch (error) {
    console.error("Erreur dans /api/analytics/vendor:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
