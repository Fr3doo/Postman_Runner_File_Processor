# Structure détaillée du projet

Cette page décrit en profondeur l’organisation des dossiers et fichiers principaux.

```
root/
├─ src/                  # Code source principal
│  ├─ cli/               # Script CLI et tests associés
│  ├─ components/        # Composants React et contextes
│  ├─ config/            # Valeurs de configuration
│  ├─ hooks/             # Hooks personnalisés
│  ├─ i18n/              # Gestion de la traduction
│  ├─ services/          # Logique métier et accès aux utilitaires
│  │  └─ __tests__/      # Tests unitaires des services
│  ├─ types/             # Types TypeScript partagés
│  └─ utils/             # Fonctions d’aide et leurs tests
├─ docs/                 # Documentation structurée
│  ├─ guides/            # Guides pratiques
│  ├─ overview/          # Aperçus généraux
│  ├─ reference/         # Références techniques
│  └─ releases/          # Notes de versions
├─ .github/              # Workflows CI et configuration GitHub
├─ index.html            # Point d’entrée HTML pour l’application
├─ package.json          # Dépendances et scripts npm
├─ vite.config.ts        # Configuration Vite
└─ tsconfig.json         # Configuration TypeScript
```

Chaque dossier suit la philosophie « un rôle clair ». Les tests unitaires se trouvent généralement à côté du code qu’ils vérifient.
