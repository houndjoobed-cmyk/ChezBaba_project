import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/utils/prisma";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import { UserRole } from "@prisma/client";

export async function GET(req: NextRequest) {
    const session = await auth();

    // Authentication Check
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

    const vendeurId = session.user.id;

    try {
        const portefeuille = await prisma.portefeuilleVendeur.findUnique({
            where: { vendeurId },
            select: { id: true },
        });

        if (!portefeuille) {
            return NextResponse.json(
                { data: [] },
                { status: 200 }
            );
        }

        const withdrawals = await prisma.retrait.findMany({
            where: { portefeuilleId: portefeuille.id },
            orderBy: { dateDemande: "desc" },
            take: 10, // Récupérer les 10 derniers mouvements
        });

        return NextResponse.json(
            {
                message: "Historique des retraits récupéré avec succès",
                data: withdrawals,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("API Error [GET /api/withdrawals/history]:", error);
        return NextResponse.json(
            { error: ERROR_MESSAGES.INTERNAL_ERROR },
            { status: 500 }
        );
    }
}
