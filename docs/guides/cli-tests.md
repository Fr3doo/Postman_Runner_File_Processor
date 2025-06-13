# Tests du CLI

Ce guide explique comment exécuter les tests du convertisseur en ligne de commande.

## 1. Construire le script

```bash
npm run build:cli
```

La commande crée `dist/convert.js` à partir de `src/cli/convert.ts`.

## 2. Lancer les tests

```bash
npm test
```

Vitest exécute alors les tests unitaires et les tests d'intégration du CLI.

## 3. Gestion de `import.meta.main`

Le fichier `convert.ts` se termine par :

```ts
if (import.meta.main) {
  start();
}
```

Lors des tests, l'intégration modifie le fichier compilé pour appeler `start()` directement.
Quand le module est importé par Vitest, `import.meta.main` vaut `false` et le CLI ne démarre pas.

Consultez la section [Exclusions de couverture](../reference/tests-overview.md#exclusions-de-couverture) pour connaître les fichiers ignorés lors des tests.
