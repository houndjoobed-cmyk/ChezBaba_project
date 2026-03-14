// PATCH /api/admin/refunds/[refundId] — Traiter une demande de remboursement

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/utils/prisma";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import { UserRole } from "@prisma/client";
import { z } from "zod";

const updateRefundSchema = z.object({
    statut: z.enum(["TRAITE", "REJETE"]),
});

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ refundId: string }> }
) {
    const session = await auth();

    if (!session) {
        return NextResponse.json({ error: ERROR_MESSAGES.UNAUTHORIZED }, { status: 401 });
    }

    if (session.user.role !== UserRole.ADMIN) {
        return NextResponse.json({ error: ERROR_MESSAGES.FORBIDDEN }, { status: 403 });
    }

    const { refundId } = await params;

    try {
        const body = await req.json();
        const parsed = updateRefundSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Statut invalide", details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const { statut } = parsed.data;

        const demande = await prisma.demandeRemboursement.findUnique({
            where: { id: refundId },
            include: {
                commande: { select: { id: true, montant: true } },
                client: {
                    select: {
                        id: true,
                        user: { select: { id: true, nom: true, prenom: true } },
                    },
                },
            },
        });

        if (!demande) {
            return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });
        }

        if (demande.statut !== "EN_ATTENTE") {
            return NextResponse.json(
                { error: "Cette demande a déjà été traitée" },
                { status: 409 }
            );
        }

        // Utiliser une transaction pour garantir la cohérence des données
        const updated = await prisma.$transaction(async (tx) => {
            // 1. Mettre à jour la demande de remboursement
            const upd = await tx.demandeRemboursement.update({
                where: { id: refundId },
                data: {
                    statut,
                    dateTraitement: new Date(),
                },
            });

            // 2. Si traité, mettre à jour la commande et le paiement
            if (statut === "TRAITE") {
                await tx.commande.update({
                    where: { id: demande.commandeId },
                    data: { statut: "REMBOURSEE" },
                });

                await tx.paiement.updateMany({
                    where: { commandeId: demande.commandeId },
                    data: { statut: "REMBOURSE" },
                });
            }

            return upd;
        });

        // Envoyer notification au client
        const clientUserId = demande.client.user.id;
        const montantFormate = new Intl.NumberFormat("fr-BJ", {
            style: "currency",
            currency: "XOF",
            maximumFractionDigits: 0,
        }).format(Number(demande.montant));

        if (statut === "TRAITE") {
            await prisma.notification.create({
                data: {
                    userId: clientUserId,
                    type: "PAIEMENT",
                    objet: "Remboursement effectué ✅",
                    text: `Votre remboursement de ${montantFormate} pour la commande #${demande.commandeId} a été traité. Veuillez vérifier votre compte ${demande.methode === "MOBILE_MONEY" ? "Mobile Money" : "bancaire"} et confirmer la réception.`,
                    urlRedirection: `/client/orders?orderId=${demande.commandeId}`,
                },
            });
        } else {
            await prisma.notification.create({
                data: {
                    userId: clientUserId,
                    type: "PAIEMENT",
                    objet: "Demande de remboursement refusée",
                    text: `Votre demande de remboursement pour la commande #${demande.commandeId} a été refusée. Contactez le support pour plus d'informations.`,
                    urlRedirection: `/client/orders?orderId=${demande.commandeId}`,
                },
            });
        }

        return NextResponse.json({
            message: `Demande ${statut === "TRAITE" ? "traitée" : "rejetée"} avec succès`,
            data: updated,
        });
    } catch (error) {
        console.error("API Error [PATCH /api/admin/refunds/[refundId]]:", error);
        return NextResponse.json({ error: ERROR_MESSAGES.INTERNAL_ERROR }, { status: 500 });
    }
}
