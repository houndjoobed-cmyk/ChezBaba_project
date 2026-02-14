// POST /api/withdrawals/request
// Demande de retrait vendeur

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import { UserRole } from "@prisma/client";
import { requestWithdrawalSchema } from "@/lib/validations/payment";
import { requestWithdrawal } from "@/lib/services/wallet.service";

export async function POST(req: NextRequest) {
    const session = await auth();

    // Authentification
    if (!session) {
        return NextResponse.json(
            { error: ERROR_MESSAGES.UNAUTHORIZED },
            { status: 401 }
        );
    }

    // Autorisation : VENDEUR uniquement
    if (session.user.role !== UserRole.VENDEUR) {
        return NextResponse.json(
            { error: ERROR_MESSAGES.FORBIDDEN },
            { status: 403 }
        );
    }

    try {
        const body = await req.json();
        const parsed = requestWithdrawalSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Données invalides",
                    details: parsed.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const { montant, methode } = parsed.data;

        const result = await requestWithdrawal(session.user.id, montant, methode);

        return NextResponse.json(
            {
                message: "Demande de retrait soumise avec succès",
                data: result,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("API Error [POST /api/withdrawals/request]:", error);

        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json(
            { error: ERROR_MESSAGES.INTERNAL_ERROR },
            { status: 500 }
        );
    }
}
