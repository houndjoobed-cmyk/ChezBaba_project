// ==========================================
// Service KKiaPay — Interactions avec l'API KKiaPay
// ==========================================

import crypto from "crypto";
import {
    FeeCalculation,
    KKiaPyWebhookPayload,
    PAYMENT_CONSTANTS,
} from "@/lib/types/payment.types";
import { MethodePaiement, SupporteurFrais } from "@prisma/client";

const KKIAPAY_PRIVATE_KEY = process.env.KKIAPAY_PRIVATE_KEY!;
const KKIAPAY_SECRET = process.env.KKIAPAY_SECRET!;
const KKIAPAY_PUBLIC_KEY = process.env.KKIAPAY_PUBLIC_KEY!;

// @ts-ignore
import { kkiapay } from "@kkiapay-org/nodejs-sdk";

// Initialisation du SDK KKiaPay
// @ts-ignore
const k = kkiapay({
    publickey: KKIAPAY_PUBLIC_KEY,
    privatekey: KKIAPAY_PRIVATE_KEY,
    secretkey: KKIAPAY_SECRET, // Utiliser 'secretkey' !
    sandbox: true, // Toujours à true en dev local
});

// ---- Vérification de transaction ----

/**
 * Vérifie une transaction auprès de l'API KKiaPay.
 * Appelle l'endpoint de vérification KKiaPay pour confirmer le statut réel.
 */
export async function verifyTransaction(
    transactionId: string
): Promise<KKiaPyWebhookPayload> {
    console.log(`[KKiaPay] Tentative de vérification transaction (SDK): ${transactionId}`);

    try {
        // Petite pause pour laisser le temps à KKiaPay de propager la transaction
        await new Promise(resolve => setTimeout(resolve, 2000));

        // @ts-ignore
        const transaction = await k.verify(transactionId);

        console.log(`[KKiaPay] Réponse SDK:`, JSON.stringify(transaction));

        if (!transaction || transaction.status !== "SUCCESS") {
            console.error(`[KKiaPay] Transaction non trouvée ou échouée via SDK: ${transaction?.status}`);
            throw new Error("Transaction introuvable ou échouée");
        }

        return transaction as KKiaPyWebhookPayload;
    } catch (error: any) {
        console.error(`[KKiaPay] Erreur SDK Verify:`, error);
        throw new Error(`Échec de la vérification SDK: ${error.message}`);
    }
}

// ---- Calcul des frais ----

/**
 * Calcule les frais selon la méthode de paiement.
 *
 * Mobile Money :
 *   - KKiaPay prélève 1,9% au client
 *   - Le client paie montant + 1,9%
 *   - La plateforme reçoit 100% du montant
 *   - Commission plateforme : 5%
 *   - Vendeur reçoit 95%
 *
 * Carte Bancaire :
 *   - KKiaPay prélève 4% au marchand (plateforme)
 *   - Le client paie le montant exact
 *   - La plateforme reçoit montant - 4%
 *   - Commission plateforme : 5% sur le montant brut
 *   - Vendeur reçoit 95% du montant brut
 *   - Les 4% sont supportés par la plateforme
 */
export function calculateFees(
    montantBrut: number,
    methode: MethodePaiement
): FeeCalculation {
    const {
        PLATFORM_COMMISSION_RATE,
        MOBILE_MONEY_FEE_RATE,
        CARD_FEE_RATE,
    } = PAYMENT_CONSTANTS;

    const commissionPlateforme = roundCFA(montantBrut * PLATFORM_COMMISSION_RATE);
    const montantNetVendeur = roundCFA(
        montantBrut * (1 - PLATFORM_COMMISSION_RATE)
    );

    if (methode === "MOBILE_MONEY") {
        const fraisTransaction = roundCFA(montantBrut * MOBILE_MONEY_FEE_RATE);
        const montantTotalClient = roundCFA(montantBrut + fraisTransaction);

        return {
            montantBrut,
            commissionPlateforme,
            fraisTransaction,
            supporteurFrais: SupporteurFrais.CLIENT,
            montantNetVendeur,
            montantTotalClient,
        };
    }

    // Carte Bancaire
    const fraisTransaction = roundCFA(montantBrut * CARD_FEE_RATE);
    const montantTotalClient = montantBrut; // Le client ne paie pas de frais

    return {
        montantBrut,
        commissionPlateforme,
        fraisTransaction,
        supporteurFrais: SupporteurFrais.PLATEFORME,
        montantNetVendeur,
        montantTotalClient,
    };
}

// ---- Vérification de signature webhook ----

/**
 * Vérifie la signature HMAC du webhook KKiaPay.
 * Protège contre les requêtes frauduleuses.
 */
export function verifyWebhookSignature(
    payload: string,
    signature: string
): boolean {
    if (!KKIAPAY_SECRET) {
        console.error("[KKiaPay] KKIAPAY_SECRET non configuré");
        return false;
    }

    const computedSignature = crypto
        .createHmac("sha256", KKIAPAY_SECRET)
        .update(payload)
        .digest("hex");

    return crypto.timingSafeEqual(
        Buffer.from(computedSignature),
        Buffer.from(signature)
    );
}

// ---- Configuration du widget frontend ----

/**
 * Génère la configuration pour le widget KKiaPay côté frontend.
 */
export function getWidgetConfig(
    amount: number,
    methode: MethodePaiement,
    reason: string,
    extra: {
        email?: string;
        phone?: string;
        name?: string;
        reference: string;
        metadata?: any;
    }
) {
    const channels =
        methode === "MOBILE_MONEY"
            ? ["momo"]
            : ["card"];

    return {
        amount,
        publicKey: KKIAPAY_PUBLIC_KEY,
        sandbox: process.env.NODE_ENV !== "production",
        reason,
        channels,
        email: extra.email,
        phone: extra.phone,
        name: extra.name,
        reference: extra.reference,
        metadata: extra.metadata,
    };
}

// ---- Utilitaire ----

/**
 * Arrondit un montant au franc CFA (pas de centimes).
 */
function roundCFA(amount: number): number {
    return Math.round(amount);
}
