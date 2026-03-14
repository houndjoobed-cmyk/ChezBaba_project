import { z } from "zod";
import { initiatePaymentSchema } from "./payment";

// Delivery address schema
const deliveryAddressSchema = z.object({
  rue: z.string().min(1, "Rue est requise"),
  ville: z.string().default(""),
  quartier: z.string().default(""),
  codePostal: z.string().default(""),
});

// Order line schema
const orderLineSchema = z.object({
  produitId: z.string().min(1, "Product ID is required"),
  quantite: z.number().int().positive("Quantity must be a positive integer"),
  tailleId: z.string().optional(),
  couleurId: z.string().optional(),
});

// Create order schema
export const createOrderSchema = z.object({
  userId: z.string().min(1, "User ID est requis"),
  addresse: deliveryAddressSchema,
  produits: z.array(orderLineSchema).min(1, "Au moins un produit est requis"),
});

// Create order schema
export const prepareOrderSchema = z.object({
  produits: z.array(orderLineSchema).min(1, "Au moins un produit est requis"),
});

// Combine schemas
export const fullOrderWithPaymentSchema = createOrderSchema.extend({
  payment: initiatePaymentSchema,
});
