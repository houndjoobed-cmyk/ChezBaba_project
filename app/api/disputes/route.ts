// POST /api/disputes — Créer un litige
// GET /api/disputes — Lister les litiges

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/utils/prisma";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import { CommandeStatut, UserRole } from "@prisma/client";
import { createDisputeSchema } from "@/lib/validations/payment";

// POST : Créer un litige
export async function POST(req: NextRequest) {
    const session = await auth();

    if (!session) {
        return NextResponse.json(
            { error: ERROR_MESSAGES.UNAUTHORIZED },
            { status: 401 }
        );
    }

    // Seuls les clients peuvent ouvrir un litige
    if (session.user.role !== UserRole.CLIENT) {
        return NextResponse.json(
            { error: ERROR_MESSAGES.FORBIDDEN },
            { status: 403 }
        );
    }

    try {
        const body = await req.json();
        const parsed = createDisputeSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Données invalides",
                    details: parsed.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const { commandeId, motif, description } = parsed.data;

        // Vérifier la commande
        const commande = await prisma.commande.findUnique({
            where: { id: commandeId },
            include: { litige: true },
        });

        if (!commande) {
            return NextResponse.json(
                { error: "Commande introuvable" },
                { status: 404 }
            );
        }

        if (commande.clientId !== session.user.id) {
            return NextResponse.json(
                { error: "Cette commande ne vous appartient pas" },
                { status: 403 }
            );
        }

        // Vérifier qu'il n'y a pas déjà un litige
        if (commande.litige) {
            return NextResponse.json(
                { error: "Un litige existe déjà pour cette commande" },
                { status: 409 }
            );
        }

        // Vérifier le statut — litige pour demande de retour/remboursement
        const forbiddenStatuses: CommandeStatut[] = [
            CommandeStatut.ANNULEE,
            CommandeStatut.REMBOURSEE,
            CommandeStatut.EN_ATTENTE_PAIEMENT,
        ];

        if (forbiddenStatuses.includes(commande.statut)) {
            return NextResponse.json(
                {
                    error: `Impossible d'ouvrir un litige pour une commande en statut "${commande.statut}"`,
                },
                { status: 400 }
            );
        }

        // Créer le litige et mettre à jour le statut de la commande
        const litige = await prisma.$transaction(async (tx) => {
            const newLitige = await tx.litige.create({
                data: {
                    motif,
                    description: description ?? null,
                    commandeId,
                    clientId: session.user.id,
                },
            });

            await tx.commande.update({
                where: { id: commandeId },
                data: { statut: CommandeStatut.EN_LITIGE },
            });

            // Notification aux vendeurs concernés
            const lignesCommande = await tx.ligneCommande.findMany({
                where: { commandeId },
                select: { produitId: true },
            });

            const produitIds = lignesCommande
                .map((l) => l.produitId)
                .filter((id): id is string => id !== null);

            const vendeurs = await tx.produitMarketplace.findMany({
                where: { produitId: { in: produitIds } },
                select: { vendeurId: true },
            });

            const vendeurIds = [...new Set(vendeurs.map((v) => v.vendeurId))];

            for (const vendeurId of vendeurIds) {
                await tx.notification.create({
                    data: {
                        userId: vendeurId,
                        type: "SIGNALEMENT",
                        objet: "Litige ouvert",
                        text: `Un client a ouvert un litige pour la commande ${commandeId}: "${motif}"`,
                        urlRedirection: "/vendor/orders",
                    },
                });
            }

            return newLitige;
        });

        return NextResponse.json(
            {
                message: "Litige créé avec succès",
                data: {
                    id: litige.id,
                    motif: litige.motif,
                    statut: litige.statut,
                    dateOuvert: litige.dateOuvert,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("API Error [POST /api/disputes]:", error);
        return NextResponse.json(
            { error: ERROR_MESSAGES.INTERNAL_ERROR },
            { status: 500 }
        );
    }
}

// GET : Lister les litiges (admin ou vendeur)
export async function GET(request: NextRequest) {
    const session = await auth();

    if (!session) {
        return NextResponse.json(
            { error: ERROR_MESSAGES.UNAUTHORIZED },
            { status: 401 }
        );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const pageSize = parseInt(searchParams.get("pageSize") ?? "20");
    const skip = (page - 1) * pageSize;

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let where: any = {};

        if (session.user.role === UserRole.CLIENT) {
            where = { clientId: session.user.id };
        } else if (session.user.role === UserRole.VENDEUR) {
            // Litiges liés aux produits du vendeur
            const vendeurProduits = await prisma.produitMarketplace.findMany({
                where: { vendeurId: session.user.id },
                select: { produitId: true },
            });

            const produitIds = vendeurProduits.map((vp) => vp.produitId);

            where = {
                commande: {
                    lignesCommande: {
                        some: { produitId: { in: produitIds } },
                    },
                },
            };
        }
        // ADMIN voit tout (where reste vide)

        const [litiges, total] = await Promise.all([
            prisma.litige.findMany({
                where,
                orderBy: { dateOuvert: "desc" },
                take: pageSize,
                skip,
                include: {
                    commande: {
                        select: { id: true, montant: true, date: true, statut: true },
                    },
                    client: {
                        select: {
                            user: {
                                select: { nom: true, prenom: true, email: true },
                            },
                        },
                    },
                },
            }),
            prisma.litige.count({ where }),
        ]);

        return NextResponse.json(
            {
                message: "Litiges récupérés avec succès",
                data: litiges.map((l) => ({
                    id: l.id,
                    motif: l.motif,
                    description: l.description,
                    statut: l.statut,
                    resolution: l.resolution,
                    dateOuvert: l.dateOuvert,
                    dateFerme: l.dateFerme,
                    commande: l.commande,
                    client: l.client,
                })),
                pagination: {
                    totalItems: total,
                    totalPages: Math.ceil(total / pageSize),
                    currentPage: page,
                    pageSize,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("API Error [GET /api/disputes]:", error);
        return NextResponse.json(
            { error: ERROR_MESSAGES.INTERNAL_ERROR },
            { status: 500 }
        );
    }
}
