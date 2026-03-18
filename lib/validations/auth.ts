import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string()
    .email("Veuillez entrer une adresse e-mail valide.")
    .transform((email) => email.toLowerCase()), // email en minuscules
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule.")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre.")
    .regex(/[^A-Za-z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial."),
  nom: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .transform(
      (nom) => nom.charAt(0).toUpperCase() + nom.slice(1).toLowerCase()
    ), // Capitaliser le nom
  prenom: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères.")
    .transform(
      (prenom) => prenom.charAt(0).toUpperCase() + prenom.slice(1).toLowerCase()
    ), // Capitaliser le prénom
  tel: z
    .string({ required_error: "Le numéro de téléphone est requis." })
    .min(7, "Numéro de téléphone invalide.")
    .regex(/^[0-9+\-().\s]{7,20}$/, "Numéro de téléphone invalide."),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("Veuillez entrer une adresse e-mail valide.")
    .transform((email) => email.toLowerCase()),
  password: z.string().min(1, "Le mot de passe est requis."),
});

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .email("Veuillez entrer une adresse e-mail valide.")
    .transform((email) => email.toLowerCase()),
  newPassword: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule.")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre.")
    .regex(/[^A-Za-z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial."),
  code: z
    .string()
    .regex(/^\d{6}$/, "Le code doit contenir exactement 6 chiffres."),
});
