// ==========================================
// Service Portefeuille Vendeur
// ==========================================

import { prisma } from "@/lib/utils/prisma";
import { MethodePaiement, StatutRetrait } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import type { WalletBalanceResponse } from "@/lib/types/payment.types";

// ---- Récupération ou création du portefeuille ----

/**
 * Récupère le portefeuille d'un vendeur, le crée s'il n'existe pas.
 */
export async function getOrCreateWallet(vendeurId: string) {
    return prisma.portefeuilleVendeur.upsert({
        where: { vendeurId },
        create: { vendeurId, solde: new Decimal(0) },
        update: {},
    });
}

// ---- Solde du portefeuille ----

/**
 * Récupère le solde et les informations du portefeuille.
 */
export async function getWalletBalance(
    vendeurId: string
): Promise<WalletBalanceResponse> {
    const wallet = await getOrCreateWallet(vendeurId);

    const totalTransactions = await prisma.transactionPortefeuille.count({
        where: { portefeuilleId: wallet.id },
    });

    return {
        vendeurId,
        solde: wallet.solde.toNumber(),
        totalTransactions,
    };
}

// ---- Historique des transactions ----

/**
 * Récupère l'historique des transactions du portefeuille.
 */
export async function getWalletTransactions(
    vendeurId: string,
    page: number = 1,
    pageSize: number = 20
) {
    const wallet = await getOrCreateWallet(vendeurId);

    const [transactions, total] = await Promise.all([
        prisma.transactionPortefeuille.findMany({
            where: { portefeuilleId: wallet.id },
            orderBy: { date: "desc" },
            take: pageSize,
            skip: (page - 1) * pageSize,
        }),
        prisma.transactionPortefeuille.count({
            where: { portefeuilleId: wallet.id },
        }),
    ]);

    return {
        transactions: transactions.map((t) => ({
            id: t.id,
            type: t.type,
            montant: t.montant.toNumber(),
            description: t.description,
            date: t.date,
            commandeId: t.commandeId,
        })),
        pagination: {
            totalItems: total,
            totalPages: Math.ceil(total / pageSize),
            currentPage: page,
            pageSize,
        },
    };
}

// ---- Demande de retrait ----

/**
 * Crée une demande de retrait pour un vendeur.
 * Vérifie le solde disponible et déduit le montant atomiquement.
 */
export async function requestWithdrawal(
    vendeurId: string,
    montant: number,
    methode: MethodePaiement,
    details: string
) {
    const wallet = await getOrCreateWallet(vendeurId);

    if (wallet.solde.toNumber() < montant) {
        throw new Error(
            `Solde insuffisant. Solde actuel : ${wallet.solde.toNumber()} FCFA, montant demandé : ${montant} FCFA`
        );
    }

    // Transaction atomique : déduire le solde + créer le retrait + enregistrer la transaction
    const retrait = await prisma.$transaction(async (tx) => {
        // Déduire du portefeuille
        await tx.portefeuilleVendeur.update({
            where: { id: wallet.id },
            data: { solde: { decrement: montant } },
        });

        // Créer le retrait
        const newRetrait = await tx.retrait.create({
            data: {
                montant: new Decimal(montant),
                methode,
                detailsDestination: details,
                portefeuilleId: wallet.id,
            },
        });

        // Enregistrer la transaction de débit
        await tx.transactionPortefeuille.create({
            data: {
                type: "DEBIT_RETRAIT",
                montant: new Decimal(montant),
                description: `Demande de retrait ${methode} de ${montant} FCFA`,
                portefeuilleId: wallet.id,
            },
        });

        // Notification Vendeur
        await tx.notification.create({
            data: {
                userId: vendeurId,
                type: "PAIEMENT",
                objet: "Demande de retrait soumise",
                text: `Votre demande de retrait de ${montant} FCFA par ${methode === "MOBILE_MONEY" ? "Mobile Money" : "Carte Bancaire"} a été soumise et est en cours de traitement.`,
                urlRedirection: "/vendor/wallet",
            },
        });

        // Notification Admin
        const adminUsers = await tx.user.findMany({
            where: { role: 'ADMIN' },
            select: { id: true }
        });

        if (adminUsers.length > 0) {
            const vendeurInfo = await tx.vendeur.findUnique({
                where: { id: vendeurId },
                select: { nomBoutique: true }
            });
            const nomBoutique = vendeurInfo?.nomBoutique || "Un vendeur";

            await tx.notification.createMany({
                data: adminUsers.map((admin) => ({
                    userId: admin.id,
                    type: "PAIEMENT",
                    objet: "Nouvelle demande de retrait",
                    text: `La boutique ${nomBoutique} a demandé un retrait de ${montant} FCFA par ${methode === "MOBILE_MONEY" ? "Mobile Money" : "Carte Bancaire"}.`,
                    urlRedirection: "/admin/wallet",
                })),
            });
        }

        return newRetrait;
    });

    return {
        retraitId: retrait.id,
        montant: retrait.montant.toNumber(),
        statut: retrait.statut,
        methode: retrait.methode,
        dateDemande: retrait.dateDemande,
    };
}

// ---- Historique des retraits ----

/**
 * Récupère l'historique des retraits d'un vendeur.
 */
export async function getWithdrawalHistory(
    vendeurId: string,
    page: number = 1,
    pageSize: number = 20
) {
    const wallet = await getOrCreateWallet(vendeurId);

    const [retraits, total] = await Promise.all([
        prisma.retrait.findMany({
            where: { portefeuilleId: wallet.id },
            orderBy: { dateDemande: "desc" },
            take: pageSize,
            skip: (page - 1) * pageSize,
        }),
        prisma.retrait.count({
            where: { portefeuilleId: wallet.id },
        }),
    ]);

    return {
        retraits: retraits.map((r) => ({
            id: r.id,
            montant: r.montant.toNumber(),
            statut: r.statut,
            methode: r.methode,
            dateDemande: r.dateDemande,
            dateTraitement: r.dateTraitement,
            reference: r.reference,
        })),
        pagination: {
            totalItems: total,
            totalPages: Math.ceil(total / pageSize),
            currentPage: page,
            pageSize,
        },
    };
}// ---- Admin : Gestion des retraits ----

/**
 * Récupère toutes les demandes de retrait (pour l'admin).
 */
export async function getAllWithdrawals(
    page: number = 1,
    pageSize: number = 20,
    statut?: StatutRetrait
) {
    const where = statut ? { statut } : {};

    const [retraits, total] = await Promise.all([
        prisma.retrait.findMany({
            where,
            orderBy: { dateDemande: "desc" },
            include: {
                portefeuille: {
                    include: {
                        vendeur: {
                            select: {
                                nomBoutique: true,
                                client: {
                                    select: {
                                        user: {
                                            select: {
                                                nom: true,
                                                prenom: true,
                                                email: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            take: pageSize,
            skip: (page - 1) * pageSize,
        }),
        prisma.retrait.count({ where }),
    ]);

    return {
        retraits: retraits.map((r) => ({
            id: r.id,
            montant: r.montant.toNumber(),
            statut: r.statut,
            methode: r.methode,
            details: r.detailsDestination,
            dateDemande: r.dateDemande,
            vendeur: {
                nomBoutique: r.portefeuille.vendeur.nomBoutique,
                nomComplet: `${r.portefeuille.vendeur.client.user.prenom} ${r.portefeuille.vendeur.client.user.nom}`,
                email: r.portefeuille.vendeur.client.user.email,
            },
        })),
        pagination: {
            totalItems: total,
            totalPages: Math.ceil(total / pageSize),
            currentPage: page,
            pageSize,
        },
    };
}

/**
 * Met à jour le statut d'une demande de retrait.
 * Si REJETE -> Rembourse le vendeur.
 */
export async function updateWithdrawalStatus(
    retraitId: string,
    nouveauStatut: StatutRetrait,
    _adminId: string
) {
    const retrait = await prisma.retrait.findUnique({
        where: { id: retraitId },
        include: { portefeuille: true },
    });

    if (!retrait) throw new Error("Retrait introuvable");
    if (retrait.statut !== "EN_ATTENTE") throw new Error("Ce retrait a déjà été traité");

    await prisma.$transaction(async (tx) => {
        // Mise à jour du statut
        await tx.retrait.update({
            where: { id: retraitId },
            data: {
                statut: nouveauStatut,
                dateTraitement: new Date(),
            },
        });

        const vendeurId = retrait.portefeuille.vendeurId;

        if (nouveauStatut === "REJETE") {
            // Remboursement du portefeuille
            await tx.portefeuilleVendeur.update({
                where: { id: retrait.portefeuilleId },
                data: { solde: { increment: retrait.montant } },
            });

            // Transaction de crédit (remboursement)
            await tx.transactionPortefeuille.create({
                data: {
                    type: "CREDIT_VENTE", // Ou un nouveau type CREDIT_REMBOURSEMENT si dispo
                    montant: retrait.montant,
                    description: `Remboursement retrait rejeté ${retraitId}`,
                    portefeuilleId: retrait.portefeuilleId,
                },
            });

            // Notification Rejet
            await tx.notification.create({
                data: {
                    userId: vendeurId,
                    type: "PAIEMENT",
                    objet: "Demande de retrait rejetée",
                    text: `Votre demande de retrait de ${retrait.montant} FCFA a été rejetée. Les fonds ont été reversés sur votre portefeuille.`,
                    urlRedirection: "/vendor/wallet",
                },
            });
        } else if (nouveauStatut === "TRAITE") {
            // Notification Succès
            await tx.notification.create({
                data: {
                    userId: vendeurId,
                    type: "PAIEMENT",
                    objet: "Retrait effectué",
                    text: `Votre retrait de ${retrait.montant} FCFA a été traité avec succès.`,
                    urlRedirection: "/vendor/wallet",
                },
            });
        }
    });
}
