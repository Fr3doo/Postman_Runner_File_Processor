# Tests du CLI

Ce guide explique comment exécuter les tests du convertisseur en ligne de commande.

## 1. Lancer les tests

```bash
npm test
```

Vitest compile automatiquement `src/cli/convert.ts` et exécute les tests
unitaires ainsi que les tests d'intégration du CLI.

## 2. Gestion de `import.meta.main`

Le fichier `convert.ts` se termine par :

```ts
if (import.meta.main) {
  start();
}
```

Lors des tests d'intégration, le script compilé est modifié.
La condition `if (import.meta.main)` est remplacée par `start();`.
Quand le module est importé par Vitest, `import.meta.main` vaut `false`.
Le CLI démarre donc grâce à cet appel direct.

Consultez la section [Exclusions de couverture](../reference/tests-overview.md#exclusions-de-couverture) pour connaître les fichiers ignorés lors des tests.
