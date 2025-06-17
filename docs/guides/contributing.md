# Contribution

Merci de contribuer à ce projet ! 🙌  
Voici les étapes et conventions à respecter avant de proposer une Pull Request (PR).

---

## 🔧 Configuration de l’environnement

Installe les dépendances et les hooks Git :

```bash
npm install
```

Cela installe automatiquement les hooks Git via [Husky](https://typicode.github.io/husky).

---

## 🧪 Avant de proposer une Pull Request

1. **Vérifie la qualité du code :**

   ```bash
   npm run lint
   ```

2. **Lance les tests :**

   ```bash
   npm test
   ```

   > Les tests CLI compilent automatiquement le script.
   > Voir [cli-tests.md](cli-tests.md) pour plus de détails.

3. **Respecte les hooks Husky :**

   Husky exécute automatiquement :

   ```bash
   npm run lint && npm run format
   ```

   à chaque commit.  
   Si le hook échoue, corrige les erreurs signalées avant de recommitter.

---

## 🌱 Nommage PR

### ➕ Création de branche

Utilise **une branche par fonctionnalité ou correctif**, selon la convention suivante :

| Type de branche | Préfixe recommandé     | Exemple                                  |
|-----------------|------------------------|------------------------------------------|
| Fonctionnalité  | `feature/` ou `feat/`  | `feature/inscription-utilisateur`        |
| Nouvelles règles métier  | `feature/` ou `feat/`  | `feature/gestion-rg-metier-x`        |
| Correctif       | `bugfix/` ou `fix/`    | `bugfix/correction-affichage-date`       |
| Refactorisation | `refactor/`            | `refactor/simplification-formulaires`    |
| Documentation   | `docs/`                | `docs/ajout-guide-installation`          |
| Hotfix          | `hotfix/`              | `hotfix/patch-urgent-en-prod`            |
| Environnement   | `release/`             | `release/staging` ou `release/1.2.0`     |


### 📦 Fusion des branches

- Crée une **Pull Request vers `main`** (ou `develop` selon le flux).
- Garde ta branche **courte et ciblée** : fusion rapide, moins de conflits.
- Décris clairement dans la PR :
  - le besoin fonctionnel
  - les changements apportés
  - le lien vers l’issue ou ticket associé

---

## 💡 Stack technique

Ce projet utilise :

- **React** + **TypeScript**
- **Tailwind CSS**
- Icônes via `lucide-react`

### ⚠️ Conventions à respecter

- Ne pas ajouter d’autres bibliothèques UI (Material, Antd, etc.).
- Respecter le style de code existant.
- Utiliser les composants réutilisables lorsqu’ils existent.

---

## 📂 Tests du LocalFileService et des métriques d’historique

### LocalFileService

1. Lance l’application en mode développement :

   ```bash
   npm run dev
   ```

2. Ouvre l’onglet **Locaux** pour voir la liste des fichiers `.json` présents dans le dossier courant.
   Cette page utilise l'API `fs` de Node.js et ne fonctionne pas dans un build navigateur standard.
3. Les tests unitaires du service se trouvent dans `src/services/__tests__/LocalFileService.test.ts` :

   ```bash
   npm test -- src/services/__tests__/LocalFileService.test.ts
   ```

### Métriques de l’historique

Les fichiers traités sont stockés dans `FileHistoryService`. Les métriques affichées (taille, nombre d’enregistrements, durée et date de traitement) sont vérifiées dans :

- `src/services/__tests__/FileHistoryService.test.ts`
- `src/services/__tests__/ProcessFileCommand.test.ts`

Pour exécuter ces tests uniquement :

```bash
npm test -- src/services/__tests__/FileHistoryService.test.ts
npm test -- src/services/__tests__/ProcessFileCommand.test.ts
```

La taille maximale de l’historique peut être ajustée via la variable d’environnement `VITE_FILE_HISTORY_MAX_ENTRIES` (ou `FILE_HISTORY_MAX_ENTRIES` pour l’outil CLI).

---

Merci pour ta contribution ! 🚀
