# Rapport du Projet ChezBaba

Ce document fournit une vue d'ensemble détaillée de l'architecture, de la structure des dossiers et des fichiers du projet **ChezBaba**.

## Vue d'ensemble Technique

*   **Framework Principal** : Next.js 15.2 (App Router)
*   **Langage** : TypeScript
*   **Base de Données** : PostgreSQL (avec Prisma ORM)
*   **Authentification** : NextAuth.js (v5 beta) + Gestion personnalisée (TOTP, rôles)
*   **Gestion d'État** : Redux Toolkit
*   **Interface Utilisateur** : Tailwind CSS, Shadcn/UI (Radix Primitives)
*   **Validation** : Zod
*   **Formulaires** : React Hook Form

## Structure des Dossiers

### `root` (Racine)
Fichiers de configuration globaux :
*   `package.json` : Dépendances et scripts du projet.
*   `next.config.ts` : Configuration de Next.js.
*   `tsconfig.json` : Configuration TypeScript.
*   `middleware.ts` : Middleware Next.js pour la protection des routes et l'authentification.
*   `.env` : Variables d'environnement.

### `app/`
Cœur de l'application (Next.js App Router).
*   **`(errors)/`** : Pages d'erreur personnalisées (404, 500).
*   **`(portal)/`** : Espace authentifié avec tableaux de bord.
    *   `admin/` : Dashboard Administrateur (Gestion utilisateurs, produits, analytics).
    *   `vendor/` : Dashboard Vendeur (Gestion boutique, commandes, produits marketplace).
    *   `client/` : Espace Client (Historique commandes, profil).
*   **`(root)/`** : Pages principales publiques (Landing page).
*   **`(store)/`** : La boutique en ligne visible par les clients.
    *   `catalog/` : Navigation produits par catégories.
    *   `product/` : Page détail produit.
    *   `cart/` : Panier d'achat.
    *   `order/` : Processus de commande et paiement.
*   **`api/`** : L'API Backend interne (Route Handlers).
    *   Gestion des ressources : `auth` (connexion), `users`, `products` (CRUD), `orders`, `analytics`, `uploads` (images).

### `components/`
Composants React réutilisables.
*   `ui/` : Composants de base (boutons, inputs, modales) basés sur Shadcn/UI.
*   `auth/` : Formulaires de connexion, inscription, mot de passe oublié.
*   `layout/` : Composants de structure (Header, Footer, Sidebar).
*   `portal/` : Composants spécifiques aux dashboards (Tableaux de données, Graphiques).
*   `store/` : Composants spécifiques à la boutique (Carte produit, Filtres, Panier).
*   `common/` : Composants partagés (Loaders, Alertes).

### `lib/`
Bibliothèques utilitaires et logique métier commune.
*   `prisma/` : Instance du client Prisma.
*   `auth/` : Configuration Auth.js et helpers d'authentification.
*   `validations/` : Schémas Zod pour la validation des données (forms & API).
*   `utils/` : Fonctions utilitaires diverses (formatage dates/prix).
*   `constants/` : Données statiques (menus, listes de choix).
*   `seed/` : Données pour le remplissage de la base de données.

### `prisma/`
Gestion de la base de données.
*   `schema.prisma` : Définition des modèles de données (User, Product, Order, etc.).
*   `seed.ts` : Script pour peupler la base de données avec des données initiales.
*   `migrations/` : Historique des changements de schéma SQL.

### `redux/`
Gestion de l'état global côté client.
*   `store.ts` : Configuration du store Redux.
*   `features/` : "Slices" Redux (ex: gestion du panier, données utilisateur).

### `hooks/`
Hooks React personnalisés.
*   Hooks spécifiques pour charger les données (ex: `useVendorDashboard`).

### `public/`
Fichiers statiques servis directement.
*   Images, icones, favicons.

## Modèles de Données Clés (Prisma)

*   **User** : Utilisateur (Rôles: Admin, Vendeur, Client).
*   **Produit** : Article en vente (peut être "Boutique" ou "Marketplace").
*   **Commande** : Transaction d'achat.
*   **Vendeur** : Profil vendeur avec informations boutique et bancaires.
*   **Signalement** : Système de modération.

Ce rapport est généré automatiquement basé sur l'état actuel du projet.
