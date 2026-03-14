import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/utils/prisma";
import { CommandeStatut, UserRole, Prisma } from "@prisma/client";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import { z } from "zod";

const updateStatusSchema = z.object({
  status: z.nativeEnum(CommandeStatut),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const session = await auth();
  const { orderId } = await params;

  if (!session) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNAUTHORIZED },
      { status: 401 }
    );
  }

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
      const allowedPreviousStatuses: CommandeStatut[] = [CommandeStatut.PAYEE, CommandeStatut.EN_PREPARATION];

      if (!allowedPreviousStatuses.includes(commande.statut)) {
        return NextResponse.json(
          { error: `Impossible de passer à EXPEDIEE depuis le statut ${commande.statut}` },
          { status: 400 }
        );
      }
    }

    // Générer le texte de la notification en fonction du statut
    let notifText = `Le statut de votre commande #${orderId} a été mis à jour : ${status}.`;
    if (status === CommandeStatut.EN_PREPARATION) {
      notifText = `Bonne nouvelle ! Le vendeur a commencé la préparation de votre commande #${orderId}.`;
    } else if (status === CommandeStatut.EXPEDIEE) {
      notifText = `Votre commande #${orderId} a été expédiée. Cliquez ici pour suivre son avancement.`;
    } else if (status === CommandeStatut.LIVREE) {
      notifText = `Votre commande #${orderId} a été marquée comme livrée.`;
    } else if (status === CommandeStatut.ANNULEE) {
      notifText = `Votre commande #${orderId} a été annulée.`;
    }

    // Préparer les transactions
    const transactions: Prisma.PrismaPromise<unknown>[] = [
      prisma.commande.update({
        where: { id: orderId },
        data: { statut: status },
      }),
    ];

    const clientId = commande.clientId;
    if (clientId) {
      // Pour un remboursement, on personnalise le message et l'URL
      if (status === CommandeStatut.REMBOURSEE) {
        notifText = `Votre commande #${orderId} a été acceptée pour remboursement. Cliquez sur "Voir" pour fournir vos coordonnées de paiement (Mobile Money ou virement) afin de recevoir votre remboursement de ${commande.montant} FCFA.`;
      }
      transactions.push(
        prisma.notification.create({
          data: {
            userId: clientId,
            type: "COMMANDE",
            objet: status === CommandeStatut.REMBOURSEE ? "Remboursement traité" : "Suivi de commande",
            text: notifText,
            urlRedirection: status === CommandeStatut.REMBOURSEE 
              ? `/client/refund?commandeId=${orderId}`
              : `/client/orders?orderId=${orderId}`,
          },
        })
      );
    }

    // Gestion du remboursement : Reprendre les fonds aux vendeurs si on les avait déjà payés
    if (status === CommandeStatut.REMBOURSEE && isAdmin) {
      // Trouver s'il y a eu un CREDIT_VENTE pour cette commande
      const previousCredits = await prisma.transactionPortefeuille.findMany({
        where: {
          commandeId: orderId,
          type: "CREDIT_VENTE"
        }
      });

      if (previousCredits.length > 0) {
        for (const credit of previousCredits) {
          // Debiter le portefeuille vendeur
          transactions.push(
            prisma.portefeuilleVendeur.update({
              where: { id: credit.portefeuilleId },
              data: { solde: { decrement: credit.montant } }
            })
          );

          // Enregistrer la transaction de remboursement (débit)
          transactions.push(
            prisma.transactionPortefeuille.create({
              data: {
                type: "REMBOURSEMENT",
                montant: credit.montant, // Par convention, on le garde positif et on fait un decrement au dessus (ou utiliser un montant -Credit si la logique l'exige), laissons positif comme le crédit
                description: `Annulation crédit (Remboursement commande ${orderId})`,
                commandeId: orderId,
                portefeuilleId: credit.portefeuilleId
              }
            })
          );

          // Récupérer le vendeur pour le notifier
          const portefeuille = await prisma.portefeuilleVendeur.findUnique({
            where: { id: credit.portefeuilleId }
          });

          if (portefeuille) {
            transactions.push(
              prisma.notification.create({
                data: {
                  userId: portefeuille.vendeurId,
                  type: "PAIEMENT", // Ou SIGNALEMENT
                  objet: "Commande remboursée",
                  text: `La commande ${orderId} a été remboursée. Votre portefeuille a été débité de ${credit.montant} FCFA.`,
                  urlRedirection: "/vendor/wallet"
                }
              })
            );
          }
        }
      }

      // Clôturer automatiquement le litige s'il y en a un
      const activeLitige = await prisma.litige.findFirst({
        where: { commandeId: orderId, statut: { in: ["OUVERT", "EN_COURS"] } }
      });

      if (activeLitige) {
        transactions.push(
          prisma.litige.update({
            where: { id: activeLitige.id },
            data: {
              statut: "FERME",
              resolution: "Remboursement de la commande par l'administrateur.",
              dateFerme: new Date()
            }
          })
        );
      }
    }

    // Effectuer la mise à jour et créer la notification
    const resultQuery = await prisma.$transaction(transactions);
    const updatedOrder = resultQuery[0];

    return NextResponse.json(updatedOrder);

  } catch (error) {
    console.error("[PATCH_ORDER_STATUS]", error);
    return NextResponse.json(
      { error: "Erreur interne serveur" },
      { status: 500 }
    );
  }
}
