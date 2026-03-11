import {
  ALLOWED_IMAGE_FORMATS,
  MAX_ID_LENGTH,
  MAX_UPLOAD_SIZE_MB,
} from "@/lib/constants/settings";
import { z } from "zod";

// Définition du schéma de validation Zod pour un produit
export const productSchema = z.object({
  nom: z.string().min(1, "Le nom est requis").max(100, "Le nom est trop long"),
  objet: z.string().max(255, "L'objet est trop long").optional(),
  description: z
    .string()
    .max(1000, "La description est trop longue")
    .optional(),
  prix: z
    .number({ invalid_type_error: "Le prix doit être un nombre" })
    .min(0, "Le prix ne peut pas être négatif"),
  qteStock: z
    .number({ invalid_type_error: "La quantité doit être un entier" })
    .int()
    .min(0, "La quantité ne peut pas être négative"),
  categorieId: z
    .string()
    .max(MAX_ID_LENGTH, "L'ID de la catégorie est invalide")
    .optional(),
  delaiLivraison: z.string().max(50, "Le délai est trop long").optional(),
  prixPromo: z
    .number({ invalid_type_error: "Le prix promo doit être un nombre" })
    .min(0, "Le prix promo ne peut pas être négatif")
    .optional(),
  garantie: z.string().max(50, "La garantie est trop longue").optional(),
  genreId: z
    .string()
    .max(MAX_ID_LENGTH, "L'ID du genre est invalide")
    .optional(),
  couleurs: z
    .array(z.string().max(MAX_ID_LENGTH, "L'ID de la couleur est invalide"))
    .optional(),
  tailles: z
    .array(z.string().max(MAX_ID_LENGTH, "L'ID de la taille est invalide"))
    .optional(),
  fournisseur: z.string().max(255, "Le nom du fournisseur est trop long").optional(),
  images: z
    .array(
      z.instanceof(File).refine((file) => file.type.startsWith("image/"), {
        message: "Le fichier doit être une image",
      })
    )
    .refine(
      (files) =>
        files.every((file) => file.size <= MAX_UPLOAD_SIZE_MB * 1024 * 1024),
      {
        message: `La taille des images ne peut pas dépasser ${MAX_UPLOAD_SIZE_MB} Mo`,
      }
    )
    .refine(
      (files) =>
        files.every((file) => ALLOWED_IMAGE_FORMATS.includes(file.type)),
      {
        message: `Les formats autorisés sont : ${ALLOWED_IMAGE_FORMATS.join(
          ", "
        )}`,
      }
    )
    .refine((files) => files.length >= 1 && files.length <= 4, {
      message: "Vous devez télécharger entre 1 et 4 images",
    }),
  typeProduit: z.enum(["PHYSIQUE", "DIGITAL"]).default("PHYSIQUE"),
  fichierUrl: z.string().url("URL du fichier invalide").optional().or(z.literal("")),
  fichierNom: z.string().max(255, "Le nom du fichier est trop long").optional().or(z.literal("")),
  messageApresAchat: z.string().max(2000, "Le message est trop long").optional().or(z.literal("")),
  video: z
    .instanceof(File)
    .refine((file) => file.type.startsWith("video/"), {
      message: "Le fichier doit être une vidéo",
    })
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "La taille de la vidéo ne peut pas dépasser 10 Mo",
    })
    .optional(),
});

// Définition du schéma de validation Zod pour la mise à jour d'un produit
export const updateProductSchema = z
  .object({
    nom: z
      .string()
      .min(1, "Le nom est requis")
      .max(100, "Le nom est trop long")
      .optional(),
    objet: z.string().max(255, "L'objet est trop long").optional(),
    description: z
      .string()
      .max(1000, "La description est trop longue")
      .optional(),
    prix: z
      .number({ invalid_type_error: "Le prix doit être un nombre" })
      .min(0, "Le prix ne peut pas être négatif")
      .optional(),
    qteStock: z
      .number({ invalid_type_error: "La quantité doit être un entier" })
      .int()
      .min(0, "La quantité ne peut pas être négative")
      .optional(),
    categorieId: z
      .string()
      .max(MAX_ID_LENGTH, "L'ID de la catégorie est invalide")
      .optional(),
    delaiLivraison: z.string().max(50, "Le délai est trop long").optional(),
    prixPromo: z
      .number({ invalid_type_error: "Le prix promo doit être un nombre" })
      .min(0, "Le prix promo ne peut pas être négatif")
      .optional(),
    garantie: z.string().max(50, "La garantie est trop longue").optional(),
    genreId: z
      .string()
      .max(MAX_ID_LENGTH, "L'ID du genre est invalide")
      .optional(),
    couleurs: z
      .array(z.string().max(MAX_ID_LENGTH, "L'ID de la couleur est invalide"))
      .optional(),
    tailles: z
      .array(z.string().max(MAX_ID_LENGTH, "L'ID de la taille est invalide"))
      .optional(),
    fournisseur: z.string().max(255, "Le nom du fournisseur est trop long").optional(),
    typeProduit: z.enum(["PHYSIQUE", "DIGITAL"]).optional(),
    fichierUrl: z.string().url("URL du fichier invalide").optional().or(z.literal("")),
    fichierNom: z.string().max(255, "Le nom du fichier est trop long").optional().or(z.literal("")),
    messageApresAchat: z.string().max(2000, "Le message est trop long").optional().or(z.literal("")),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Au moins un champ doit être renseigné.",
  });
