import type { NextAuthConfig } from "next-auth";
import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

// Configuration minimale pour le middleware (Edge Runtime compatible)
// Ne pas utiliser PrismaAdapter ici car il n'est pas compatible avec Edge Runtime
export const authConfig = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            // La vraie autorisation se fait dans lib/auth/index.ts
            // Ici on retourne null car le middleware n'a besoin que de vérifier la session
            async authorize() {
                return null;
            },
        }),
    ],
    session: {
        strategy: "jwt" as const,
    },
    callbacks: {
        async session({ session, token }: { session: Session; token: JWT }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.nom = (token.nom as string) || "";
                session.user.prenom = (token.prenom as string) || "";
                session.user.role = token.role as "ADMIN" | "VENDEUR" | "CLIENT";
                session.user.emailVerifie = token.emailVerifie as boolean;
                session.user.imagePublicId = (token.imagePublicId as string) || null;
                session.user.tel = (token.tel as string) || null;
            }
            return session;
        },
        async jwt({ token, user, trigger }: { token: JWT; user?: User; trigger?: string }) {
            if (trigger === "signIn" && user) {
                token.id = user.id!;
                token.email = user.email!;
                token.nom = (user as { nom?: string }).nom || "";
                token.prenom = (user as { prenom?: string }).prenom || "";
                token.role = (user as { role?: "ADMIN" | "VENDEUR" | "CLIENT" }).role || "CLIENT";
                token.emailVerifie = (user as { emailVerifie?: boolean }).emailVerifie || false;
                token.imagePublicId = (user as { imagePublicId?: string }).imagePublicId || null;
                token.tel = (user as { tel?: string }).tel || null;
            }
            return token;
        },
    },
    // V13 — Protection CSRF via cookies sécurisés
    cookies: {
        sessionToken: {
            name: process.env.NODE_ENV === "production"
                ? "__Secure-authjs.session-token"
                : "authjs.session-token",
            options: {
                httpOnly: true,
                sameSite: "lax" as const,
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
    },
} satisfies NextAuthConfig;
