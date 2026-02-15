// ==========================================
// Types pour le système de paiement escrow KKiaPay
// ==========================================

import { MethodePaiement, SupporteurFrais } from "@prisma/client";

// ---- Calcul des frais ----

export interface FeeCalculation {
    /** Montant brut de la commande */
    montantBrut: number;
    /** Commission plateforme (5%) */
    commissionPlateforme: number;
    /** Frais de transaction du PSP */
    fraisTransaction: number;
    /** Qui supporte les frais : CLIENT ou PLATEFORME */
    supporteurFrais: SupporteurFrais;
    /** Montant net pour le vendeur (95% du brut) */
    montantNetVendeur: number;
    /** Montant total que le client paie (brut + frais si Mobile Money) */
    montantTotalClient: number;
}

// ---- Initiation de paiement ----

export interface PaymentInitiationRequest {
    commandeId: string;
    methode: MethodePaiement;
}

export interface PaymentInitiationResponse {
    paiementId: string;
    montantBrut: number;
    montantTotalClient: number;
    fraisTransaction: number;
    supporteurFrais: SupporteurFrais;
    methode: MethodePaiement;
    kkiapayConfig: {
        amount: number;
        publicKey: string;
        sandbox: boolean;
        reason: string;
        channels: string[];
        email?: string;
        phone?: string;
        name?: string;
        reference: string;
        metadata?: Record<string, unknown>;
    };
}

// ---- Webhook KKiaPay ----

export interface KKiaPyWebhookPayload {
    transactionId: string;
    status: "SUCCESS" | "FAILED" | "PENDING";
    amount: number;
    fees?: number;
    phone_number?: string;
    operator?: string;
    [key: string]: unknown;
}

// ---- Portefeuille vendeur ----

export interface WalletCreditRequest {
    vendeurId: string;
    montant: number;
    commandeId: string;
    description: string;
}

export interface WalletBalanceResponse {
    vendeurId: string;
    solde: number;
    totalTransactions: number;
}

export interface WithdrawalRequest {
    montant: number;
    methode: MethodePaiement;
}

// ---- Grand Livre Plateforme ----

export type LedgerEntryType = "COMMISSION" | "FRAIS_CARTE" | "FRAIS_REVERSEMENT";

export interface LedgerSummary {
    totalCommissions: number;
    totalFraisCarte: number;
    totalFraisReversement: number;
    soldeNet: number;
}

// ---- Constantes métier ----

export const PAYMENT_CONSTANTS = {
    /** Commission plateforme : 5% */
    PLATFORM_COMMISSION_RATE: 0.05,
    /** Frais Mobile Money : 1,9% (supporté par le client) */
    MOBILE_MONEY_FEE_RATE: 0.019,
    /** Frais Carte Bancaire : 4% (supporté par la plateforme) */
    CARD_FEE_RATE: 0.04,
    /** Frais fixes reversement bancaire */
    BANK_WITHDRAWAL_FEE: 7000,
    /** Fournisseur de paiement */
    PROVIDER: "KKIAPAY" as const,
} as const;
