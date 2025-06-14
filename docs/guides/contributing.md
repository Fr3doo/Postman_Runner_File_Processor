# Contribution

Merci de contribuer à ce projet ! Pour configurer l’environnement de développement :

```bash
npm install
```

Cela installe automatiquement les hooks Git via [husky](https://typicode.github.io/husky).

Avant de soumettre une pull request, veuillez :

1. Lancer le linter

   ```bash
   npm run lint
   ```

2. Lancer les tests

   ```bash
   npm test
   ```

   Les tests du CLI compilent maintenant automatiquement le script.
   Lancez simplement `npm test`.
   Voir [cli-tests.md](cli-tests.md) pour plus de détails.

3. Husky exécute automatiquement `npm run lint && npm run format` à chaque commit.
   Si le hook échoue, corrigez les problèmes signalés puis recommittez.

Le projet utilise React avec TypeScript, Tailwind CSS et des icônes de `lucide-react`.
Veuillez suivre le style de code existant et éviter d’ajouter d’autres bibliothèques d’UI.
