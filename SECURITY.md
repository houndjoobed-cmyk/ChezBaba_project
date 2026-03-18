# ⚠️ Notes de Sécurité — ChezBaba

## NextAuth v5 Beta (V15)

Ce projet utilise **next-auth@5.0.0-beta.25**, une version **beta** du framework d'authentification.

### Risques

- Les API et le comportement peuvent changer sans préavis entre les versions beta.
- Des bugs non corrigés peuvent exister dans les versions beta.
- La documentation officielle peut ne pas couvrir toutes les fonctionnalités beta.
- Le support communautaire est limité pour les versions pré-release.

### Recommandations

1. **Surveiller les mises à jour** : Vérifier régulièrement les changelogs de [next-auth](https://github.com/nextauthjs/next-auth/releases).
2. **Migrer vers la version stable** dès sa sortie officielle.
3. **Tester minutieusement** après chaque mise à jour de next-auth.
4. **Ne pas exposer** les détails de version dans les en-têtes HTTP ou les réponses d'erreur.

### Verrouiller la version

Dans `package.json`, la version est fixée à `5.0.0-beta.25`. **Ne pas utiliser de range** (`^5.0.0-beta`) pour éviter les mises à jour automatiques qui pourraient casser le build.
