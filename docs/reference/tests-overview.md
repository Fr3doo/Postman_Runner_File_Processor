## 🧪 Aperçu des tests

Les tests unitaires se trouvent principalement dans le dossier `src/utils/__tests__` et sont exécutés avec [Vitest](https://vitest.dev/).

Pour lancer la suite complète de tests :

```bash
npm test
```

La suite couvre en priorité les **utilitaires de parsing** et la **validation de sécurité**. Lors de toute mise à jour sur ces modules, veillez à **ajouter ou ajuster les tests** pour maintenir une couverture élevée et fiable.

---

## 🛡️ Exclusions de couverture

Certains fichiers ou portions de code sont **exclus des rapports de couverture**, car ils ne contiennent pas de logique testable ou relèvent de comportements techniques spécifiques. Ces exclusions garantissent des rapports **clairs, pertinents et orientés métier**.

### 🗂️ Fichiers et dossiers exclus des tests et de la couverture

| Chemin                             | Justification                                                                                                           |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `src/main.tsx`                     | Point d’entrée React (`createRoot`) sans logique métier.                                                                |
| `src/cli/**`                       | Scripts CLI qui orchestrent des fonctions testées ailleurs. Le bloc `import.meta.main` ne fait que lancer le programme. |
| `src/config/**`                    | Fichiers de configuration applicative sans logique exécutable.                                                          |
| `src/types/**`, `**/*.d.ts`        | Déclarations de types uniquement, sans comportement à tester.                                                           |
| `src/vite-env.d.ts`                | Fichier généré automatiquement par Vite.                                                                                |
| `vite.config.ts`                   | Configuration Vite non exécutable dans les tests.                                                                       |
| `tailwind.config.js`               | Configuration Tailwind CSS.                                                                                             |
| `postcss.config.js`                | Configuration PostCSS.                                                                                                  |
| `eslint.config.js`                 | Configuration ESLint sans logique testable.                                                                             |
| `tsconfig.json`, `tsconfig.*.json` | Fichiers de configuration TypeScript (ajoutés pour documentation, non mesurés par la couverture).                       |


#### Les tests unitaires et les rapports de couverture omettent plusieurs fichiers sans logique métier :

- **Entrées CLI** : `src/cli/convert.ts` (et `src/cli/index.ts` s'il existe) servent uniquement à lancer la ligne de commande.
- **Dictionnaires de traduction** : le dossier `src/i18n/**` contient les chaînes localisées et est annoté `/* c8 ignore file */`.
- **Déclarations de types** : `src/types/**`, `src/vite-env.d.ts` et tous les fichiers `*.d.ts`.
- **Fichiers de configuration** : `src/config/**`, `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, `eslint.config.js`, `tsconfig.json` et ses variantes.

Ces éléments sont volontairement ignorés afin de concentrer la couverture sur la logique applicative réellement testable.


### 🌐 Cas spécifiques

- Des utilitaires très dépendants du **DOM** (ex. : fonctions déclenchant des téléchargements via `<a>` ou `URL.createObjectURL`) sont exclus des tests unitaires. Leur comportement dépend de l’environnement navigateur et sera validé via des **tests end-to-end (E2E)** dans un second temps.


