// POST /api/refunds — Client soumet ses infos de remboursement

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/utils/prisma";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import { UserRole, CommandeStatut } from "@prisma/client";
import { z } from "zod";

const submitRefundSchema = z.object({
    commandeId: z.string().min(1, "L'identifiant de commande est requis"),
    methode: z.enum(["MOBILE_MONEY", "CARTE_BANCAIRE"], {
        errorMap: () => ({ message: "Méthode invalide. Choisissez MOBILE_MONEY ou CARTE_BANCAIRE" }),
    }),
    detailsDestination: z
        .string()
        .min(5, "Les coordonnées (numéro ou RIB) sont requises")
        .max(255),
});

export async function POST(req: NextRequest) {
    const session = await auth();

    if (!session) {
        return NextResponse.json({ error: ERROR_MESSAGES.UNAUTHORIZED }, { status: 401 });
    }

    if (session.user.role !== UserRole.CLIENT) {
        return NextResponse.json({ error: ERROR_MESSAGES.FORBIDDEN }, { status: 403 });
    }

    try {
        const body = await req.json();
        const parsed = submitRefundSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Données invalides", details: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { commandeId, methode, detailsDestination } = parsed.data;

        // Vérifier la commande
        const commande = await prisma.commande.findUnique({
            where: { id: commandeId },
            include: { demandeRemboursement: true },
        });

        if (!commande) {
            return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
        }

        if (commande.clientId !== session.user.id) {
            return NextResponse.json(
                { error: "Cette commande ne vous appartient pas" },
                { status: 403 }
            );
        }

        // Vérifier que la commande est bien remboursée
        if (commande.statut !== CommandeStatut.REMBOURSEE) {
            return NextResponse.json(
                { error: "Cette commande n'est pas en statut remboursée" },
                { status: 400 }
            );
        }

        // Vérifier qu'une demande n'existe pas déjà
        if (commande.demandeRemboursement) {
            return NextResponse.json(
                { error: "Une demande de remboursement existe déjà pour cette commande" },
                { status: 409 }
            );
        }

        // Créer la demande
        const demande = await prisma.demandeRemboursement.create({
            data: {
                commandeId,
                clientId: session.user.id,
                methode,
                detailsDestination,
                montant: commande.montant,
            },
        });

        // Notification admin
        const admins = await prisma.admin.findMany({ select: { userId: true } });
        await prisma.notification.createMany({
            data: admins.map((admin) => ({
                userId: admin.userId,
                type: "PAIEMENT" as const,
                objet: "Nouvelle demande de remboursement",
                text: `Le client a soumis ses coordonnées pour le remboursement de la commande #${commandeId}.`,
                urlRedirection: "/admin/refunds",
            })),
        });

        return NextResponse.json(
            { message: "Demande de remboursement soumise avec succès", data: { id: demande.id } },
            { status: 201 }
        );
    } catch (error) {
        console.error("API Error [POST /api/refunds]:", error);
        return NextResponse.json({ error: ERROR_MESSAGES.INTERNAL_ERROR }, { status: 500 });
    }
}
