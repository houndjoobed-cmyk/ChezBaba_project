// General limits and constants for the application
export const MAX_ID_LENGTH = 25;
export const MAX_PRODUCT_DESCRIPTION_LENGTH = 1000;
export const MAX_VENDOR_DESCRIPTION_LENGTH = 1000;

// Pagination Defaults
export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 12;
export const DEFAULT_SHOP_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 100;

// Stock Alerts
export const LOW_STOCK_THRESHOLD = 5;

// Cloud folder names
export const ALLOWED_FOLDERS = ["products", "avatars"];

// File Upload Limits
export const MAX_UPLOAD_SIZE_MB = 1;
export const ALLOWED_IMAGE_FORMATS = ["image/jpeg", "image/png", "image/webp"];
export const ALLOWED_VIDEO_FORMATS = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
export const MAX_VIDEO_SIZE_MB = 10;

// Error Messages
export const ERROR_MESSAGES = {
  // 400
  BAD_REQUEST:
    "La requête est invalide. Veuillez vérifier les données envoyées.",
  BAD_REQUEST_ID:
    "Un ou plusieurs IDs fournis sont invalides ou introuvables.",
  // 401
  UNAUTHORIZED: "Vous devez être authentifié pour accéder à cette ressource.",
  // 403
  FORBIDDEN: "Vous n'avez pas la permission d'accéder à cette ressource.",
  // 404
  NOT_FOUND: "La ressource demandée n'a pas été trouvée.",
  // 500
  INTERNAL_ERROR: "Une erreur est survenue. Veuillez réessayer plus tard.",
};
export const DELIVERY_OPTIONS = [
  "24h",
  "48h",
  "3 à 5 jours",
  "1 semaine",
  "2 semaines",
  "3 semaines",
  "4 semaines",
  "1 mois",
];

export const WARRANTY_OPTIONS = [
  "Aucune",
  "1 mois",
  "3 mois",
  "6 mois",
  "1 an",
];

// Payment Commissions
export const MOMO_COMMISSION = 0.019;
export const CREDIT_CARD_COMMISSION = 0;
