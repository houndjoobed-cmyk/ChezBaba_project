import bcrypt from "bcryptjs";
import type { JWT } from "next-auth/jwt";
import NextAuth, { type Session, type User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { prisma } from "@/lib/utils/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { authConfig } from "./auth.config";

// V16 — Verrouillage de compte après échecs de connexion
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

interface LoginAttempt {
  count: number;
  lockedUntil: number | null;
}

const loginAttempts = new Map<string, LoginAttempt>();

// Nettoyage périodique
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of loginAttempts.entries()) {
    if (entry.lockedUntil && now > entry.lockedUntil) {
      loginAttempts.delete(key);
    }
  }
}, 10 * 60 * 1000);

function checkAccountLock(email: string): string | null {
  const attempt = loginAttempts.get(email);
  if (!attempt) return null;
  if (attempt.lockedUntil && Date.now() < attempt.lockedUntil) {
    const minutesLeft = Math.ceil((attempt.lockedUntil - Date.now()) / 60000);
    return `Compte verrouillé. Réessayez dans ${minutesLeft} minute(s).`;
  }
  if (attempt.lockedUntil && Date.now() >= attempt.lockedUntil) {
    loginAttempts.delete(email);
  }
  return null;
}

function recordFailedAttempt(email: string): void {
  const attempt = loginAttempts.get(email) || { count: 0, lockedUntil: null };
  attempt.count++;
  if (attempt.count >= MAX_LOGIN_ATTEMPTS) {
    attempt.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
    attempt.count = 0;
  }
  loginAttempts.set(email, attempt);
}

function clearAttempts(email: string): void {
  loginAttempts.delete(email);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as import("next-auth/adapters").Adapter,
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        const email = (credentials.email as string).toLowerCase();

        // V16 — Vérifier le verrouillage du compte
        const lockMessage = checkAccountLock(email);
        if (lockMessage) throw new Error(lockMessage);

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          recordFailedAttempt(email);
          throw new Error("Identifiants invalides.");
        }

        // Check password
        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!isValid) {
          recordFailedAttempt(email);
          throw new Error("Identifiants invalides.");
        }

        // Succès — réinitialiser le compteur
        clearAttempts(email);

        // Return user object (NextAuth creates session)
        return {
          id: user.id,
          email: user.email,
          nom: user.nom,
          prenom: user.prenom,
          role: user.role,
          emailVerifie: user.emailVerifie,
          imagePublicId: user.imagePublicId,
          tel: user.tel,
        };
      },
    }),
  ],

  callbacks: {
    ...authConfig.callbacks,
    async jwt({
      token,
      user,
      session,
      trigger,
    }: {
      token: JWT;
      user?: User;
      session?: Session;
      trigger?: "signIn" | "signUp" | "update";
    }): Promise<JWT> {
      // Initial sign in
      if (trigger === "signIn" && user) {
        token.id = user.id!;
        token.email = user.email!;
        token.nom = user.nom;
        token.prenom = user.prenom;
        token.role = user.role;
        token.emailVerifie = user.emailVerifie;
        token.imagePublicId = user.imagePublicId;
        token.tel = user.tel;
      }

      // If the user is updating their session, fetch the latest user data
      if (trigger === "update" && session?.user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: {
            id: true,
            email: true,
            nom: true,
            prenom: true,
            role: true,
            emailVerifie: true,
            imagePublicId: true,
            tel: true,
          },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.email = dbUser.email;
          token.nom = dbUser.nom;
          token.prenom = dbUser.prenom;
          token.role = dbUser.role;
          token.emailVerifie = dbUser.emailVerifie;
          token.imagePublicId = dbUser.imagePublicId;
          token.tel = dbUser.tel;
        }
      }

      return token;
    },
  },
});
