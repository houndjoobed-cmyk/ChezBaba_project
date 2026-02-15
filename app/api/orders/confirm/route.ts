// POST /api/orders/confirm
// Confirmation de livraison par le client
// Crédite le portefeuille vendeur avec 95%

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import { confirmDeliverySchema } from "@/lib/validations/payment";
import { confirmDelivery } from "@/lib/services/payment.service";

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
        const parsed = confirmDeliverySchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Données invalides",
                    details: parsed.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const { commandeId } = parsed.data;

        const result = await confirmDelivery(commandeId, session.user.id);

        return NextResponse.json(
            {
                message: result.message,
                data: { success: result.success },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("API Error [POST /api/orders/confirm]:", error);

        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json(
            { error: ERROR_MESSAGES.INTERNAL_ERROR },
            { status: 500 }
        );
    }
}
