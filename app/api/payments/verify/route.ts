import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import { verifyTransaction } from "@/lib/services/kkiapay.service";
import { processWebhookPayment } from "@/lib/services/payment.service";
import { z } from "zod";

const verifySchema = z.object({
    transactionId: z.string().min(1, "ID de transaction requis"),
});

/**
 * POST /api/payments/verify
 * Permet au client de forcer la vérification d'un paiement après redirection.
 * Utile surtout en développement local (localhost) où le webhook ne peut pas atteindre le serveur.
 */
export async function POST(req: NextRequest) {
    const session = await auth();

    if (!session) {
        return NextResponse.json(
            { error: ERROR_MESSAGES.UNAUTHORIZED },
            { status: 401 }
        );
    }

    try {
        const body = await req.json();
        const parsed = verifySchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "ID de transaction absent ou invalide" },
                { status: 400 }
            );
        }

        const { transactionId } = parsed.data;
        console.log(`[VerifyAPI] Demande de vérification pour transactionId: ${transactionId}`);

        // 1. Demander à KKiaPay le statut réel de cette transaction
        const verifiedData = await verifyTransaction(transactionId);

        // 2. Lancer le même traitement que le webhook
        // (Vérification du montant, mise à jour CMD, notification, etc.)
        const result = await processWebhookPayment(verifiedData);

        if (!result.success) {
            return NextResponse.json(
                { error: result.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Paiement vérifié et validé avec succès" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("API Error [POST /api/payments/verify]:", error);
        return NextResponse.json(
            { error: error.message || "Erreur lors de la vérification du paiement" },
            { status: 500 }
        );
    }
}
