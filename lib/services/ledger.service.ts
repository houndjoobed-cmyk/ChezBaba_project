// ==========================================
// Service Grand Livre Plateforme
// ==========================================

import { prisma } from "@/lib/utils/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { PAYMENT_CONSTANTS } from "@/lib/types/payment.types";
import type { LedgerSummary, LedgerEntryType } from "@/lib/types/payment.types";

// ---- Enregistrement d'entrée ----

/**
 * Enregistre une entrée dans le grand livre de la plateforme.
 */
export async function recordLedgerEntry(
    type: LedgerEntryType,
    montant: number,
    description: string,
    commandeId?: string
) {
    return prisma.grandLivrePlateforme.create({
        data: {
            type,
            montant: new Decimal(montant),
            description,
            commandeId: commandeId ?? null,
        },
    });
}

// ---- Enregistrement de commission ----

/**
 * Enregistre une commission de la plateforme.
 */
export async function recordCommission(
    commandeId: string,
    montant: number
) {
    return recordLedgerEntry(
        "COMMISSION",
        montant,
        `Commission 5% sur commande ${commandeId}`,
        commandeId
    );
}

// ---- Enregistrement de frais carte ----

/**
 * Enregistre les frais de carte bancaire supportés par la plateforme.
 */
export async function recordCardFee(
    commandeId: string,
    montant: number
) {
    return recordLedgerEntry(
        "FRAIS_CARTE",
        -montant, // Négatif car c'est un coût
        `Frais carte bancaire 4% sur commande ${commandeId}`,
        commandeId
    );
}

// ---- Enregistrement de frais de reversement ----

/**
 * Enregistre les frais fixes de reversement bancaire (7 000 FCFA).
 */
export async function recordWithdrawalFee() {
    return recordLedgerEntry(
        "FRAIS_REVERSEMENT",
        -PAYMENT_CONSTANTS.BANK_WITHDRAWAL_FEE,
        `Frais reversement bancaire fixe : ${PAYMENT_CONSTANTS.BANK_WITHDRAWAL_FEE} FCFA`
    );
}

// ---- Résumé du grand livre ----

/**
 * Calcule le résumé agrégé du grand livre pour le tableau de bord admin.
 */
export async function getLedgerSummary(): Promise<LedgerSummary> {
    const [commissions, fraisCarte, fraisReversement] = await Promise.all([
        prisma.grandLivrePlateforme.aggregate({
            where: { type: "COMMISSION" },
            _sum: { montant: true },
        }),
        prisma.grandLivrePlateforme.aggregate({
            where: { type: "FRAIS_CARTE" },
            _sum: { montant: true },
        }),
        prisma.grandLivrePlateforme.aggregate({
            where: { type: "FRAIS_REVERSEMENT" },
            _sum: { montant: true },
        }),
    ]);

    const totalCommissions = commissions._sum.montant?.toNumber() ?? 0;
    const totalFraisCarte = Math.abs(fraisCarte._sum.montant?.toNumber() ?? 0);
    const totalFraisReversement = Math.abs(
        fraisReversement._sum.montant?.toNumber() ?? 0
    );

    return {
        totalCommissions,
        totalFraisCarte,
        totalFraisReversement,
        soldeNet: totalCommissions - totalFraisCarte - totalFraisReversement,
    };
}

// ---- Historique des entrées ----

/**
 * Récupère les entrées du grand livre avec pagination.
 */
export async function getLedgerEntries(
    page: number = 1,
    pageSize: number = 50,
    type?: LedgerEntryType
) {
    const where = type ? { type } : {};

    const [entries, total] = await Promise.all([
        prisma.grandLivrePlateforme.findMany({
            where,
            orderBy: { date: "desc" },
            take: pageSize,
            skip: (page - 1) * pageSize,
            include: {
                commande: {
                    select: { id: true, montant: true, date: true },
                },
            },
        }),
        prisma.grandLivrePlateforme.count({ where }),
    ]);

    return {
        entries: entries.map((e) => ({
            id: e.id,
            type: e.type,
            montant: e.montant.toNumber(),
            description: e.description,
            date: e.date,
            commande: e.commande
                ? {
                    id: e.commande.id,
                    montant: e.commande.montant.toNumber(),
                    date: e.commande.date,
                }
                : null,
        })),
        pagination: {
            totalItems: total,
            totalPages: Math.ceil(total / pageSize),
            currentPage: page,
            pageSize,
        },
    };
}
