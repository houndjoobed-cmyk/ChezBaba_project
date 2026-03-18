// V10 — Helper d'authentification centralisé pour les API routes
// Évite les oublis d'auth() dans les nouvelles routes

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import { UserRole } from "@prisma/client";

import {
  checkRateLimit,
  getClientIp,
  RATE_LIMIT_CONFIGS,
} from "@/lib/security/rate-limiter";

type RateLimitType = keyof typeof RATE_LIMIT_CONFIGS;

import { type Session } from "next-auth";

interface AuthResult {
  session: Session;
  user: NonNullable<Session["user"]>;
}

/**
 * Vérifie l'authentification et retourne la session.
 * Retourne une NextResponse prête à envoyer si l'auth échoue.
 */
export async function requireAuth(): Promise<AuthResult | NextResponse> {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNAUTHORIZED },
      { status: 401 }
    );
  }
  return { session, user: session.user };
}

/**
 * Vérifie l'authentification ET le rôle requis.
 */
export async function requireRole(
  ...roles: UserRole[]
): Promise<AuthResult | NextResponse> {
  const result = await requireAuth();
  if (result instanceof NextResponse) return result;

  if (!roles.includes(result.user.role as UserRole)) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.FORBIDDEN },
      { status: 403 }
    );
  }
  return result;
}

/**
 * Vérifie l'authentification ET que l'utilisateur accède à ses propres ressources.
 */
export async function requireOwnership(
  resourceUserId: string
): Promise<AuthResult | NextResponse> {
  const result = await requireAuth();
  if (result instanceof NextResponse) return result;

  if (result.user.id !== resourceUserId && result.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: ERROR_MESSAGES.FORBIDDEN },
      { status: 403 }
    );
  }
  return result;
}

/**
 * Applique le rate limiting à une requête.
 * Retourne null si OK, une NextResponse si limité.
 */
export function applyRateLimit(
  headers: Headers,
  endpoint: string,
  type: RateLimitType = "API"
): NextResponse | null {
  const ip = getClientIp(headers);
  const config = RATE_LIMIT_CONFIGS[type];
  const limited = checkRateLimit(ip, endpoint, config);

  if (limited) {
    const retryAfterSeconds = Math.ceil(limited.retryAfterMs / 1000);
    return NextResponse.json(
      {
        error: "Trop de requêtes. Veuillez réessayer plus tard.",
        retryAfter: retryAfterSeconds,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSeconds),
        },
      }
    );
  }
  return null;
}
