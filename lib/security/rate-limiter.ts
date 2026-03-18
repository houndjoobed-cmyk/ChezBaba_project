// V6 — Rate Limiter in-memory pour les API sensibles
// Limite les requêtes par IP pour prévenir les attaques brute-force et le spam

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Nettoyage périodique des entrées expirées (toutes les 5 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

interface RateLimitConfig {
  /** Nombre max de requêtes autorisées dans la fenêtre */
  maxRequests: number;
  /** Durée de la fenêtre en millisecondes */
  windowMs: number;
}

// Configurations prédéfinies par type d'endpoint
export const RATE_LIMIT_CONFIGS = {
  /** Login/Register : 10 tentatives / 15 min */
  AUTH: { maxRequests: 10, windowMs: 15 * 60 * 1000 },
  /** API générale : 100 requêtes / minute */
  API: { maxRequests: 100, windowMs: 60 * 1000 },
  /** Paiements : 20 requêtes / 5 min */
  PAYMENT: { maxRequests: 20, windowMs: 5 * 60 * 1000 },
  /** Contact/Newsletter : 5 requêtes / heure */
  CONTACT: { maxRequests: 5, windowMs: 60 * 60 * 1000 },
  /** Upload fichiers : 30 requêtes / 10 min */
  UPLOAD: { maxRequests: 30, windowMs: 10 * 60 * 1000 },
} as const;

/**
 * Vérifie si l'IP a dépassé la limite de requêtes.
 * @returns `null` si OK, ou un objet avec les détails si la limite est atteinte
 */
export function checkRateLimit(
  ip: string,
  endpoint: string,
  config: RateLimitConfig
): { limited: true; retryAfterMs: number } | null {
  const key = `${ip}:${endpoint}`;
  const now = Date.now();

  const entry = rateLimitMap.get(key);

  // Première requête ou fenêtre expirée
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + config.windowMs });
    return null;
  }

  // Incrémenter le compteur
  entry.count++;

  // Vérifier la limite
  if (entry.count > config.maxRequests) {
    return {
      limited: true,
      retryAfterMs: entry.resetTime - now,
    };
  }

  return null;
}

/**
 * Extrait l'adresse IP du client depuis les headers de la requête.
 */
export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}
