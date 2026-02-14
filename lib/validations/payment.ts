import { z } from "zod";

// ---- Initiation de paiement ----

export const initiatePaymentSchema = z.object({
  commandeId: z.string().min(1, "L'identifiant de commande est requis"),
  methode: z.enum(["MOBILE_MONEY", "CARTE_BANCAIRE"], {
    errorMap: () => ({
      message: "Méthode de paiement invalide. Choisissez MOBILE_MONEY ou CARTE_BANCAIRE",
    }),
  }),
});

// ---- Confirmation de livraison ----

export const confirmDeliverySchema = z.object({
  commandeId: z.string().min(1, "L'identifiant de commande est requis"),
});

// ---- Demande de retrait vendeur ----

export const requestWithdrawalSchema = z.object({
  montant: z
    .number()
    .positive("Le montant doit être positif")
    .min(500, "Le montant minimum de retrait est 500 FCFA"),
  methode: z.enum(["MOBILE_MONEY", "CARTE_BANCAIRE"], {
    errorMap: () => ({
      message: "Méthode de retrait invalide",
    }),
  }),
  details: z.string().min(5, "Les détails (numéro ou RIB) sont requis"),
});

// ---- Création de litige ----

export const createDisputeSchema = z.object({
  commandeId: z.string().min(1, "L'identifiant de commande est requis"),
  motif: z
    .string()
    .min(10, "Le motif doit contenir au moins 10 caractères")
    .max(500, "Le motif ne peut pas dépasser 500 caractères"),
  description: z
    .string()
    .max(1000, "La description ne peut pas dépasser 1000 caractères")
    .optional(),
});

// ---- Webhook KKiaPay (validation entrante) ----

export const kkiapayWebhookSchema = z.object({
  transactionId: z.string().min(1),
  status: z.enum(["SUCCESS", "FAILED", "PENDING"]),
  amount: z.number().positive(),
  fees: z.number().optional(),
  phone_number: z.string().optional(),
  operator: z.string().optional(),
}).passthrough(); // Autoriser les champs supplémentaires de KKiaPay
