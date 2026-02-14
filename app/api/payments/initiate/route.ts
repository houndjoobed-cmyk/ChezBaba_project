// POST /api/payments/initiate
// Initie un paiement KKiaPay pour une commande en attente

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import { UserRole } from "@prisma/client";
import { initiatePaymentSchema } from "@/lib/validations/payment";
import { initiatePayment } from "@/lib/services/payment.service";

export async function POST(req: NextRequest) {
    const session = await auth();

    // Authentification
    if (!session) {
        return NextResponse.json(
            { error: ERROR_MESSAGES.UNAUTHORIZED },
            { status: 401 }
        );
    }

    try {
        const body = await req.json();
        const parsed = initiatePaymentSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Données invalides",
                    details: parsed.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const { commandeId, methode } = parsed.data;

        const result = await initiatePayment(commandeId, methode, session.user.id);

        return NextResponse.json(
            {
                message: "Paiement initié avec succès",
                data: result,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("API Error [POST /api/payments/initiate]:", error);

        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json(
            { error: ERROR_MESSAGES.INTERNAL_ERROR },
            { status: 500 }
        );
    }
}
