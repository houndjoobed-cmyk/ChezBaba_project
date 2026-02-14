// ==========================================
// Service Paiement — Logique métier du paiement escrow
// ==========================================

import { prisma } from "@/lib/utils/prisma";
import {
    calculateFees,
    verifyTransaction,
    getWidgetConfig,
} from "@/lib/services/kkiapay.service";
import { PAYMENT_CONSTANTS } from "@/lib/types/payment.types";
import type {
    PaymentInitiationResponse,
    KKiaPyWebhookPayload,
} from "@/lib/types/payment.types";
import { MethodePaiement, PaiementStatut, CommandeStatut } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

// ---- Initiation du paiement ----

/**
 * Initie un paiement pour une commande existante.
 * 1. Vérifie que la commande existe et appartient au client
 * 2. Vérifie que la commande est en attente de paiement
 * 3. Calcule les frais selon la méthode
 * 4. Crée l'enregistrement Paiement avec statut INITIE
 * 5. Retourne la config pour le widget KKiaPay
 */
export async function initiatePayment(
    commandeId: string,
    methode: MethodePaiement,
    userId: string
): Promise<PaymentInitiationResponse> {
    // Vérifier la commande
    const commande = await prisma.commande.findUnique({
        where: { id: commandeId },
        include: { paiement: true },
    });

    if (!commande) {
        throw new Error("Commande introuvable");
    }

    if (commande.clientId !== userId) {
        throw new Error("Cette commande ne vous appartient pas");
    }

    if (commande.statut !== CommandeStatut.EN_ATTENTE_PAIEMENT) {
        throw new Error("Cette commande n'est pas en attente de paiement");
    }

    // Empêcher le double paiement
    if (commande.paiement && commande.paiement.statut === PaiementStatut.REUSSI) {
        throw new Error("Cette commande a déjà été payée");
    }

    // Récupérer les infos utilisateur pour pré-remplir le widget
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, nom: true, prenom: true, tel: true },
    });

    const montantBrut = commande.montant.toNumber();
    const fees = calculateFees(montantBrut, methode);

    // Créer ou mettre à jour l'enregistrement paiement
    const paiement = await prisma.paiement.upsert({
        where: { commandeId },
        update: {
            methode,
            statut: PaiementStatut.INITIE,
            montantBrut: new Decimal(fees.montantBrut),
            commissionPlateforme: new Decimal(fees.commissionPlateforme),
            montantNetVendeur: new Decimal(fees.montantNetVendeur),
            fraisTransaction: new Decimal(fees.fraisTransaction),
            supporteurFrais: fees.supporteurFrais,
        },
        create: {
            commandeId,
            methode,
            statut: PaiementStatut.INITIE,
            montantBrut: new Decimal(fees.montantBrut),
            commissionPlateforme: new Decimal(fees.commissionPlateforme),
            montantNetVendeur: new Decimal(fees.montantNetVendeur),
            fraisTransaction: new Decimal(fees.fraisTransaction),
            supporteurFrais: fees.supporteurFrais,
            fournisseur: PAYMENT_CONSTANTS.PROVIDER,
        },
    });

    // Configuration widget KKiaPay
    const kkiapayConfig = getWidgetConfig(
        fees.montantTotalClient,
        methode,
        `Paiement commande #${commandeId}`,
        {
            email: user?.email,
            phone: user?.tel || undefined,
            name: user ? `${user.prenom} ${user.nom}` : undefined,
            reference: commandeId,
            metadata: {
                orderId: commandeId,
                paiementId: paiement.id,
            },
        }
    );

    return {
        paiementId: paiement.id,
        montantBrut: fees.montantBrut,
        montantTotalClient: fees.montantTotalClient,
        fraisTransaction: fees.fraisTransaction,
        supporteurFrais: fees.supporteurFrais,
        methode,
        kkiapayConfig,
    };
}

// ---- Traitement du webhook ----

/**
 * Traite le webhook de paiement KKiaPay.
 * Idempotent : vérifie si la transaction a déjà été traitée.
 *
 * Flux :
 * 1. Vérifier l'idempotence via referenceProvider
 * 2. Vérifier la transaction auprès de KKiaPay
 * 3. Vérifier que le montant correspond
 * 4. Mettre à jour Paiement → REUSSI
 * 5. Mettre à jour Commande → PAYEE
 * 6. Enregistrer la commission dans le grand livre
 * 7. Notifier le vendeur et le client
 */
export async function processWebhookPayment(
    webhookData: KKiaPyWebhookPayload
): Promise<{ success: boolean; message: string }> {
    const { transactionId, amount } = webhookData;

    // 1. Vérification d'idempotence
    const existingPayment = await prisma.paiement.findUnique({
        where: { referenceProvider: transactionId },
    });

    if (existingPayment && existingPayment.statut === PaiementStatut.REUSSI) {
        console.log(
            `[Webhook] Transaction ${transactionId} déjà traitée, ignorée`
        );
        return { success: true, message: "Transaction déjà traitée" };
    }

    // 2. Vérification auprès de KKiaPay
    const verifiedTransaction = await verifyTransaction(transactionId);

    if (verifiedTransaction.status !== "SUCCESS") {
        console.error(
            `[Webhook] Transaction ${transactionId} non réussie:`,
            verifiedTransaction.status
        );

        // Mettre à jour en ECHOUE si on a un paiement en cours
        if (existingPayment) {
            await prisma.paiement.update({
                where: { id: existingPayment.id },
                data: {
                    statut: PaiementStatut.ECHOUE,
                    referenceProvider: transactionId,
                    webhookPayload: webhookData as object,
                },
            });
        }

        return { success: false, message: "Transaction échouée" };
    }

    // 3. Trouver le paiement correspondant
    // Priorité 1: referenceProvider existante (idempotence)
    // Priorité 2: orderId dans les métadonnées KKiaPay (le plus fiable)
    // Priorité 3: Recherche par montant (fallback)
    let paiement = existingPayment;

    if (!paiement) {
        // Essayer de trouver via le metadata passé au widget
        // NOTE: 'data' peut être un objet ou une string JSON selon l'API
        // NOTE 2: Le SDK retourne souvent 'state' au lieu de 'metadata' ou 'data'
        let metadata = webhookData.state || webhookData.data || webhookData.metadata;

        if (typeof metadata === 'string') {
            try {
                metadata = JSON.parse(metadata);
            } catch (e) {
                console.error("[Webhook] Erreur parsing metadata JSON:", e);
            }
        }

        const orderId = metadata?.orderId || webhookData.orderId;
        console.log(`[Webhook] Extraction OrderId: ${orderId} (Metadata: ${JSON.stringify(metadata)})`);

        if (orderId) {
            paiement = await prisma.paiement.findUnique({
                where: { commandeId: orderId },
                include: { commande: true },
            });
        }
    }

    if (!paiement) {
        // Fallback: Chercher un paiement INITIE dont le montant correspond
        const paiements = await prisma.paiement.findMany({
            where: {
                statut: PaiementStatut.INITIE,
                referenceProvider: null,
            },
            include: { commande: true },
            orderBy: { date: "desc" },
        });

        // Trouver celui dont le montant brut ou total client correspond
        paiement = paiements.find((p) => {
            const montantTotal = p.montantBrut.toNumber() + (p.supporteurFrais === "CLIENT" ? p.fraisTransaction.toNumber() : 0);
            return Math.abs(montantTotal - amount) < 1; // Tolérance 1 FCFA
        }) ?? null;

        if (paiement) {
            console.log(`[Webhook] Paiement retrouvé par montant (${amount}) pour commande ${paiement.commandeId}`);
        }
    }

    if (!paiement) {
        console.error(
            `[Webhook] ECHEC TOTAL: Aucun paiement trouvé pour la transaction ${transactionId}. Payload:`,
            JSON.stringify(webhookData)
        );
        return {
            success: false,
            message: "Aucun paiement correspondant trouvé",
        };
    }

    // 4. Vérification stricte du montant
    const montantBrut = paiement.montantBrut.toNumber();
    const frais = paiement.fraisTransaction.toNumber();
    const montantAttendu =
        montantBrut + (paiement.supporteurFrais === "CLIENT" ? frais : 0);

    if (Math.abs(montantAttendu - amount) > 1) {
        console.error(
            `[Webhook] Montant incohérent pour ${transactionId}: attendu ${montantAttendu}, reçu ${amount}`
        );
        return {
            success: false,
            message: "Montant de la transaction incohérent",
        };
    }

    // 5. Transaction atomique : mise à jour paiement + commande + grand livre
    await prisma.$transaction(async (tx) => {
        // Mise à jour du paiement
        await tx.paiement.update({
            where: { id: paiement!.id },
            data: {
                statut: PaiementStatut.REUSSI,
                referenceProvider: transactionId,
                webhookPayload: webhookData as object,
            },
        });

        // Mise à jour de la commande
        await tx.commande.update({
            where: { id: paiement!.commandeId },
            data: { statut: CommandeStatut.PAYEE },
        });

        // Enregistrement de la commission dans le grand livre
        await tx.grandLivrePlateforme.create({
            data: {
                type: "COMMISSION",
                montant: paiement!.commissionPlateforme,
                description: `Commission 5% sur commande ${paiement!.commandeId}`,
                commandeId: paiement!.commandeId,
            },
        });

        // Si carte bancaire, enregistrer les frais supportés par la plateforme
        if (paiement!.supporteurFrais === "PLATEFORME") {
            await tx.grandLivrePlateforme.create({
                data: {
                    type: "FRAIS_CARTE",
                    montant: new Decimal(-paiement!.fraisTransaction.toNumber()), // Négatif = coût
                    description: `Frais carte 4% sur commande ${paiement!.commandeId}`,
                    commandeId: paiement!.commandeId,
                },
            });
        }

        // Notification au client
        const commande = await tx.commande.findUnique({
            where: { id: paiement!.commandeId },
            select: { clientId: true, montant: true },
        });

        if (commande?.clientId) {
            await tx.notification.create({
                data: {
                    userId: commande.clientId,
                    type: "PAIEMENT",
                    objet: "Paiement confirmé !",
                    text: `Le paiement de ${commande.montant} FCFA pour votre commande ${paiement!.commandeId} a été reçu avec succès.`,
                    urlRedirection: "/client/orders",
                },
            });
        }

        // Notification aux vendeurs
        const lignesCommande = await tx.ligneCommande.findMany({
            where: { commandeId: paiement!.commandeId },
            select: { produitId: true },
        });

        const produitIds = lignesCommande
            .map((l) => l.produitId)
            .filter((id): id is string => id !== null);

        const vendeurs = await tx.produitMarketplace.findMany({
            where: { produitId: { in: produitIds } },
            select: { vendeurId: true },
        });

        const vendeurIds = [...new Set(vendeurs.map((v) => v.vendeurId))];

        for (const vendeurId of vendeurIds) {
            await tx.notification.create({
                data: {
                    userId: vendeurId,
                    type: "PAIEMENT",
                    objet: "Nouvelle vente payée !",
                    text: `Un client a payé une commande contenant vos produits. Le paiement est sécurisé en escrow.`,
                    urlRedirection: "/vendor/orders",
                },
            });
        }
    });

    console.log(
        `[Webhook] Transaction ${transactionId} traitée avec succès pour commande ${paiement.commandeId}`
    );

    return { success: true, message: "Paiement traité avec succès" };
}

// ---- Confirmation de livraison ----

/**
 * Confirme la réception de la commande par le client.
 * Crédite le portefeuille vendeur avec 95% du montant brut.
 */
export async function confirmDelivery(
    commandeId: string,
    userId: string
): Promise<{ success: boolean; message: string }> {
    const commande = await prisma.commande.findUnique({
        where: { id: commandeId },
        include: {
            paiement: true,
            lignesCommande: {
                select: { produitId: true },
            },
        },
    });

    if (!commande) {
        throw new Error("Commande introuvable");
    }

    if (commande.clientId !== userId) {
        throw new Error("Cette commande ne vous appartient pas");
    }

    // Protection double confirmation
    if (commande.statut === CommandeStatut.LIVRAISON_CONFIRMEE) {
        throw new Error("La livraison a déjà été confirmée pour cette commande");
    }

    // Vérifier que la commande peut être confirmée
    const allowedStatuses: CommandeStatut[] = [CommandeStatut.EXPEDIEE, CommandeStatut.LIVREE];
    if (!allowedStatuses.includes(commande.statut)) {
        throw new Error(
            `La commande ne peut pas être confirmée dans son statut actuel: ${commande.statut}`
        );
    }

    if (!commande.paiement || commande.paiement.statut !== PaiementStatut.REUSSI) {
        throw new Error("Cette commande n'a pas de paiement validé");
    }

    // Récupérer les vendeurs de cette commande
    const produitIds = commande.lignesCommande
        .map((l) => l.produitId)
        .filter((id): id is string => id !== null);

    const vendeurs = await prisma.produitMarketplace.findMany({
        where: { produitId: { in: produitIds } },
        select: { vendeurId: true },
    });

    const vendeurIds = [...new Set(vendeurs.map((v) => v.vendeurId))];

    // Transaction atomique : confirmer + créditer vendeurs
    await prisma.$transaction(async (tx) => {
        // Mise à jour du statut
        await tx.commande.update({
            where: { id: commandeId },
            data: { statut: CommandeStatut.LIVRAISON_CONFIRMEE },
        });

        // Créditer chaque vendeur
        const montantNetVendeur = commande.paiement!.montantNetVendeur.toNumber();
        const montantParVendeur = Math.round(montantNetVendeur / vendeurIds.length);

        for (const vendeurId of vendeurIds) {
            // Créer ou récupérer le portefeuille
            const portefeuille = await tx.portefeuilleVendeur.upsert({
                where: { vendeurId },
                create: {
                    vendeurId,
                    solde: new Decimal(montantParVendeur),
                },
                update: {
                    solde: { increment: montantParVendeur },
                },
            });

            // Enregistrer la transaction
            await tx.transactionPortefeuille.create({
                data: {
                    type: "CREDIT_VENTE",
                    montant: new Decimal(montantParVendeur),
                    description: `Crédit vente commande ${commandeId} (95% de ${commande.paiement!.montantBrut} FCFA)`,
                    commandeId,
                    portefeuilleId: portefeuille.id,
                },
            });

            // Notification vendeur
            await tx.notification.create({
                data: {
                    userId: vendeurId,
                    type: "PAIEMENT",
                    objet: "Fonds crédités !",
                    text: `${montantParVendeur} FCFA ont été crédités sur votre portefeuille pour la commande ${commandeId}.`,
                    urlRedirection: "/vendor/wallet",
                },
            });
        }
    });

    return {
        success: true,
        message: "Livraison confirmée et fonds crédités aux vendeurs",
    };
}
