# Aperçu des tests

Les tests unitaires se trouvent dans `src/utils/__tests__` et sont exécutés avec [Vitest](https://vitest.dev/).

Pour lancer la suite de tests :

```bash
npm test
```

Les tests couvrent les utilitaires d’analyse (parsing) et de validation de sécurité. Lors de la mise à jour de ces utilitaires, ajoutez ou modifiez les tests pour maintenir une couverture élevée.

## Exclusions de couverture

Certaines parties du code ne sont pas soumises aux tests unitaires :

- `src/main.tsx` qui se contente de monter l’application React ;
- le bloc `import.meta.main` à la fin de `src/cli/convert.ts` ;
- les utilitaires très dépendants du DOM, comme ceux qui déclenchent des téléchargements.
