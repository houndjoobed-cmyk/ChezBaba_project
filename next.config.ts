import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  // V5 — En-têtes de sécurité HTTP
  // V14 — CORS : restreint aux origines autorisées
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Anti-clickjacking
          { key: "X-Frame-Options", value: "DENY" },
          // Empêche le MIME sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Force HTTPS pendant 2 ans
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // Politique de référent
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Désactive les API sensibles du navigateur
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // Protection XSS legacy
          { key: "X-XSS-Protection", value: "1; mode=block" },
          // Content Security Policy
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.kkiapay.me",
              "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://fonts.googleapis.com",
              "font-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://res.cloudinary.com https://flagcdn.com https://images.unsplash.com",
              "connect-src 'self' https://res.cloudinary.com https://api.cloudinary.com https://*.kkiapay.me https://openrouter.ai https://*.supabase.co https://www.google-analytics.com",
              "frame-src https://cdn.kkiapay.me",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
      // V14 — En-têtes CORS pour les routes API
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.NEXTAUTH_URL || "http://localhost:3000",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization, X-Requested-With",
          },
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
