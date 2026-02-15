# CHEZ BABA 🛍️

CHEZ BABA © 2025 – Plateforme e‑commerce moderne et performante, combinant marketplace multi‑vendeurs, suivi avancé des commandes et administration complète, avec une architecture full-stack professionnelle.

## ✨ Fonctionnalités

### 🛒 Pour les clients

- **Catalogue de produits**: Parcourir les produits avec filtres avancés et recherche
- **Panier**: Panier persistant avec mises à jour en temps réel
- **Gestion des commandes**: Suivi des commandes avec mises à jour en temps réel
- **Avis produits**: Évaluer et commenter les produits avec téléchargements de photos
- **Liste de souhaits**: Sauvegarder les produits préférés pour plus tard
- **Chat en temps réel**: Obtenir un support instantané des vendeurs
- **Email de vérification**: Création de compte sécurisée avec vérification par email
- **Réinitialisation du mot de passe**: Système de récupération de mot de passe sécurisé

### 🏪 Pour les vendeurs

- **Gestion des boutiques**: Créer et gérer sa propre boutique
- **Gestion des produits**: Ajouter, modifier et gérer l'inventaire des produits
- **Gestion des commandes**: Gérer les commandes des clients avec mises à jour de statut
- **Analyse des ventes**: Suivre les performances de vente et les revenus
- **Suivi des paiements**: Surveiller le statut des paiements et l'historique
- **Support client**: Chatter avec les clients en temps réel

### 👨‍💼 Pour les administrateurs

- **Gestion des utilisateurs**: Gérer les clients, les vendeurs et les administrateurs
- **Surveillance des boutiques**: Surveiller et gérer toutes les boutiques des vendeurs
- **Gestion des commandes**: Superviser toutes les commandes de la plateforme
- **Tableau de bord analytique**: Analyses complètes de la plateforme
- **Gestion des signalements**: Gérer les signalements des utilisateurs et les litiges
- **Notifications système**: Envoyer des annonces à toute la plateforme

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - Framework React avec routeur d'application
- **TypeScript** - JavaScript sécurisé par type
- **Tailwind CSS** - Framework CSS utilitaire
- **Framer Motion** - Bibliothèque d'animation
- **Redux Toolkit** - Gestion d'état
- **React Hook Form** - Gestion de formulaires
- **Zod** - Validation de schémas

### Backend

- **Next.js API Routes** - Endpoints API côté serveur
- **Prisma** - ORM de base de données
- **PostgreSQL** - Base de données principale
- **NextAuth.js** - Système d'authentification
- **Nodemailer** - Service d'email

### Services externes

- **Cloudinary** - Stockage d'images et de fichiers
<!-- - **OpenRouter AI** - Support de chat alimenté par l'IA -->
- **Supabase** - Hébergement de base de données

## 📋 Prerequisites

Avant de commencer, assurez-vous d'avoir installé les éléments suivants :

- **Node.js** (v18 ou supérieur)
- **npm** ou **yarn**
- **PostgreSQL** database
- **Git**

## 🚀 Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Chezbaba/chezbaba_project.git
   cd chezbaba_project
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configurer la base de données**

   ```bash
   # Générer le client Prisma
   npx prisma generate

   # Exécuter les migrations de base de données
   npx prisma migrate dev

   # Pré-remplir la base de données avec les données initiales
   npx prisma db seed
   ```

4. **Lancer le serveur de développement**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Schéma de base de données

L'application utilise PostgreSQL avec les entités principales suivantes :

| Table                      | Description                                       | Colonnes |
| -------------------------- | ------------------------------------------------- | -------- |
| **account**                | Comptes utilisateurs (détails login, rôles, etc.) | 12       |
| **admin**                  | Administrateurs de la plateforme                  | 1        |
| **adresse**                | Adresses clients et expéditions                   | 5        |
| **categorie**              | Catégories de produits                            | 5        |
| **client**                 | Informations clients                              | 1        |
| **commande**               | Gestion des commandes                             | 7        |
| **couleur**                | Couleurs disponibles pour les produits            | 3        |
| **_ProduitCouleurs**       | Association produits ↔ couleurs                   | 2        |
| **_ProduitTailles**        | Association produits ↔ tailles                    | 2        |
| **evaluation**             | Avis et notes produits                            | 6        |
| **favori**                 | Produits favoris des clients                      | 4        |
| **genre**                  | Genres ou types de produits                       | 2        |
| **grand_livre_plateforme** | Historique complet des transactions               | 6        |
| **ligne_commande**         | Détails des commandes (produits, quantité, prix)  | 9        |
| **ligne_panier**           | Détails du panier client                          | 9        |
| **litige**                 | Litiges ou conflits                               | 9        |
| **newsletter**             | Abonnés à la newsletter                           | 3        |
| **notification**           | Notifications système                             | 8        |
| **paiement**               | Paiements clients                                 | 13       |
| **paiement_vendeur**       | Paiements effectués aux vendeurs                  | 5        |
| **panier**                 | Panier des clients                                | 5        |
| **portefeuille_vendeur**   | Solde et transactions du vendeur                  | 3        |
| **produit**                | Produits                                          | 15       |
| **produit_boutique**       | Produits spécifiques aux boutiques                | 2        |
| **produit_image**          | Images des produits                               | 3        |
| **produit_marketplace**    | Produits disponibles sur la marketplace           | 2        |
| **produit_video**          | Vidéos des produits                               | 3        |
| **reponse_evaluation**     | Réponses aux avis clients                         | 5        |
| **retrait**                | Retraits de fonds des vendeurs                    | 9        |


## 🏗️ Structure du projet

```text
Chezbaba_project/
├── app/ # Routeur de l'application Next.js
│ ├── (errors)/ # Pages de gestion des erreurs
│ ├── (portal)/ # Portails pour admin, vendeur et client
│ ├── (root)/ # Pages principales / landing pages
│ ├── (store)/ # Pages publiques de la boutique
│ ├── api/ # Routes API
│ └── auth/ # Pages d'authentification
├── composants/ # Composants UI réutilisables
│ ├── auth/ # Composants d'authentification
│ ├── checkout/ # Composants du processus de paiement
│ ├── common/ # Composants partagés
│ ├── layout/ # Mise en page et navigation
│ ├── commandes/ # Composants liés aux commandes
│ ├── portal/ # Modules spécifiques aux portails
│ ├── shop/ # Composants de gestion de la boutique
│ ├── store/ # Composants de la vitrine
│ └── ui/ # Composants UI de base (shadcn/ui)
├── docs/ # Documentation et diagrammes
├── hooks/ # Hooks React personnalisés
├── lib/ # Logique centrale et utilitaires
│ ├── auth/ # Configurations d'authentification
│ ├── constants/ # Constantes de l'application
│ ├── helpers/ # Fonctions utilitaires
│ ├── services/ # Intégrations de services externes
│ ├── types/ # Définitions TypeScript
│ ├── utils/ # Fonctions utilitaires générales
│ └── validations/ # Schémas de validation Zod
├── prisma/ # Schéma et migrations de la base de données
├── public/ # Assets statics (images, icônes)
├── redux/ # Store de gestion d'état
├── scripts/ # Scripts utilitaires et de maintenance
└── styles/ # Styles et thèmes globaux
```

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio
- `npx prisma migrate dev` - Run database migrations
- `npx prisma db seed` - Seed database with initial data

## 🔐 Authentification

L'application utilise NextAuth.js avec les méthodes d'authentification suivantes :

- Email/Mot de passe
- Vérification d'email
- Fonctionnalité de réinitialisation de mot de passe
- Contrôle d'accès basé sur les rôles (Client, Vendeur, Admin)

## 🚀 Déploiement

### Vercel recommandé

1. Poussez votre code vers GitHub
2. Connectez votre dépôt à Vercel
3. Configurez les variables d'environnement dans le tableau de bord Vercel
4. Déployez automatiquement sur push


## 📚 À propos de ce projet

CHEZ BABA © 2025 – Plateforme e-commerce professionnelle conçue pour offrir une expérience d'achat en ligne complète et moderne. Ce projet illustre des pratiques concrètes de développement web, une architecture full-stack et des compétences professionnelles en développement d'applications.

**👥 Equipe:** 2 développeurs  
**📅 Année:** 2026  


## 👨‍💻 Equipe de développement

- **HOUNDJO Obed** - Développeur Backend [@HoundjoObed](https://github.com/houndjoobed-cmyk)
- **ADANNOU Emmanuel** - Développeur Frontend [@AdannouEmmanuel](https://github.com/BigCadors)



**CHEZ BABA** - Votre plateforme e-commerce complète! 🛍️✨
