// GET /api/admin/refunds — Lister les demandes de remboursement (admin)

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/utils/prisma";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import { UserRole } from "@prisma/client";

export async function GET(req: NextRequest) {
    const session = await auth();

    if (!session) {
        return NextResponse.json({ error: ERROR_MESSAGES.UNAUTHORIZED }, { status: 401 });
    }

    if (session.user.role !== UserRole.ADMIN) {
        return NextResponse.json({ error: ERROR_MESSAGES.FORBIDDEN }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const pageSize = parseInt(searchParams.get("pageSize") ?? "20");
    const skip = (page - 1) * pageSize;

    try {
        const [demandes, total] = await Promise.all([
            prisma.demandeRemboursement.findMany({
                orderBy: { dateDemande: "desc" },
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
            prisma.demandeRemboursement.count(),
        ]);

        return NextResponse.json({
            demandes: demandes.map((d) => ({
                id: d.id,
                commandeId: d.commandeId,
                montant: Number(d.montant),
                methode: d.methode,
                detailsDestination: d.detailsDestination,
                statut: d.statut,
                dateDemande: d.dateDemande,
                dateTraitement: d.dateTraitement,
                commande: d.commande,
                client: {
                    nomComplet: `${d.client.user.prenom} ${d.client.user.nom}`,
                    email: d.client.user.email,
                },
            })),
            pagination: {
                totalItems: total,
                totalPages: Math.ceil(total / pageSize),
                currentPage: page,
                pageSize,
            },
        });
    } catch (error) {
        console.error("API Error [GET /api/admin/refunds]:", error);
        return NextResponse.json({ error: ERROR_MESSAGES.INTERNAL_ERROR }, { status: 500 });
    }
}
