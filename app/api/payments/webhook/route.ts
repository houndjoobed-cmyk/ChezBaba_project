// POST /api/payments/webhook
// Webhook KKiaPay — traitement des notifications de paiement
// Pas d'authentification utilisateur (webhook externe)
// Sécurisé par vérification de signature HMAC

import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/services/kkiapay.service";
import { processWebhookPayment } from "@/lib/services/payment.service";
import { kkiapayWebhookSchema } from "@/lib/validations/payment";

export async function POST(req: NextRequest) {
    try {
        // Lire le body brut pour la vérification de signature
        const rawBody = await req.text();
        const signature = req.headers.get("x-kkiapay-signature") ?? "";

        // Vérification de signature OBLIGATOIRE
        if (!process.env.KKIAPAY_SECRET) {
            console.error("[Webhook] KKIAPAY_SECRET non configuré");
            return NextResponse.json(
                { error: "Configuration serveur invalide" },
                { status: 500 }
            );
        }

        if (!signature) {
            console.error("[Webhook] Signature manquante");
            return NextResponse.json(
                { error: "Signature manquante" },
                { status: 401 }
            );
        }

        const isValid = verifyWebhookSignature(rawBody, signature);
        if (!isValid) {
            console.error("[Webhook] Signature invalide");
            return NextResponse.json(
                { error: "Signature invalide" },
                { status: 401 }
            );
        }

        // Parser et valider le payload
        let body: unknown;
        try {
            body = JSON.parse(rawBody);
        } catch {
            return NextResponse.json(
                { error: "Payload JSON invalide" },
                { status: 400 }
            );
        }

        const parsed = kkiapayWebhookSchema.safeParse(body);

        if (!parsed.success) {
            console.error("[Webhook] Payload invalide:", parsed.error.flatten());
            return NextResponse.json(
                { error: "Payload webhook invalide" },
                { status: 400 }
            );
        }

        // Traitement du paiement
        const result = await processWebhookPayment(parsed.data);

        if (!result.success) {
            console.error("[Webhook] Échec du traitement:", result.message);
            // On retourne quand même 200 pour éviter les retentatives inutiles de KKiaPay
            // sauf si c'est un problème temporaire
            return NextResponse.json(
                { success: false, message: result.message },
                { status: 200 }
            );
        }


        return NextResponse.json(
            { success: true, message: result.message },
            { status: 200 }
        );
    } catch (error) {
        console.error("API Error [POST /api/payments/webhook]:", error);
        return NextResponse.json(
            { error: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}
