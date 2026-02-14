import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/utils/prisma";
import { CommandeStatut, UserRole } from "@prisma/client";
import { z } from "zod";

const updateStatusSchema = z.object({
  status: z.nativeEnum(CommandeStatut),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { orderId } = params;

  try {
    const body = await req.json();
    const result = updateStatusSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Statut invalide", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { status } = result.data;

    // Récupérer la commande avec ses lignes pour vérifier l'appartenance
    const commande = await prisma.commande.findUnique({
      where: { id: orderId },
      include: {
        lignesCommande: true,
      },
    });

    if (!commande) {
      return NextResponse.json(
        { error: "Commande introuvable" },
        { status: 404 }
      );
    }

    // Vérifier les droits
    const isAdmin = session.user.role === UserRole.ADMIN;
    let isVendorInvolved = false;

    if (session.user.role === UserRole.VENDEUR) {
      // Vérifier si le vendeur vend un produit de cette commande via ProduitMarketplace
      // On doit récupérer les produitIds de la commande
      const produitIds = commande.lignesCommande.map((l) => l.produitId);

      // Vérifier si le vendeur possède un de ces produits
      const vendorProductsCount = await prisma.produitMarketplace.count({
        where: {
          vendeurId: session.user.id,
          produitId: { in: produitIds.filter((id): id is string => id !== null) },
        },
      });

      isVendorInvolved = vendorProductsCount > 0;
    }

    const canUpdate = isAdmin || (session.user.role === UserRole.VENDEUR && isVendorInvolved);

    if (!canUpdate) {
      return NextResponse.json(
        { error: "Vous n'avez pas les droits pour modifier cette commande" },
        { status: 403 }
      );
    }

    // Logique de transition d'état
    // On autorise le passage à EXPEDIEE si c'est PAYEE (ou EN_PREPARATION si on l'utilise)
    if (status === CommandeStatut.EXPEDIEE) {
      // Note: "statuses" typo fix in array variable name
      const allowedPreviousStatuses = [CommandeStatut.PAYEE, CommandeStatut.EN_PREPARATION];

      if (!allowedPreviousStatuses.includes(commande.statut)) {
        return NextResponse.json(
          { error: `Impossible de passer à EXPEDIEE depuis le statut ${commande.statut}` },
          { status: 400 }
        );
      }
    }

    // Effectuer la mise à jour
    const updatedOrder = await prisma.commande.update({
      where: { id: orderId },
      data: { statut: status },
    });

    return NextResponse.json(updatedOrder);

  } catch (error) {
    console.error("[PATCH_ORDER_STATUS]", error);
    return NextResponse.json(
      { error: "Erreur interne serveu" },
      { status: 500 }
    );
  }
}
