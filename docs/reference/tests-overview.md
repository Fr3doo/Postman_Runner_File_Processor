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

### 🗂️ Fichiers et dossiers exclus

* `src/main.tsx` : se limite au montage initial de l’application React via `createRoot()`.
* `src/cli/**` : contient les scripts CLI, comme `convert.ts`, qui orchestrent des fonctions déjà testées. Le bloc `import.meta.main` y sert uniquement d’entrée CLI.
* `src/config/**` : fichiers de configuration applicative, statiques ou constants.
* `src/types/**` et tous les fichiers `*.d.ts` : définitions de types TypeScript sans comportement exécutable.
* `src/vite-env.d.ts` : généré automatiquement par Vite.
* Fichiers de configuration à la racine :

  * `vite.config.ts`
  * `tailwind.config.js`
  * `postcss.config.js`
  * `eslint.config.js`

### 🌐 Cas spécifiques

* Des utilitaires très dépendants du **DOM** (ex. : fonctions déclenchant des téléchargements via `<a>` ou `URL.createObjectURL`) sont exclus des tests unitaires. Leur comportement dépend de l’environnement navigateur et sera validé via des **tests end-to-end (E2E)** dans un second temps.
