# Postman Runner File Processor

Petite application React + TypeScript pour convertir les fichiers `.txt` Postman Runner en JSON structuré. Le traitement se fait entièrement dans le navigateur avec validation et assainissement intégrés. Pour la table des matières complète, voir [docs/index.md](docs/index.md).

## Fonctionnalités

* Téléversement par glisser-déposer avec affichage de progression
* Analyse des fichiers pour extraire :

  * nombre de fichiers restants
  * numéro télédémarche
  * nom du projet
  * numéro de dossier
  * date de dépôt
* Téléchargement d’un fichier JSON pour chaque entrée traitée avec succès
* Affichage du succès ou de l’erreur pour chaque fichier et des statistiques globales
* Vérifications côté client : type, taille et limitation du débit

## Documentation

Voir [docs/index.md](docs/index.md) pour l’index complet de la documentation.
Les guides sont dans `docs/guides`, les références API et architecture dans `docs/reference`, les notes de version dans `docs/releases`.

* [docs/index.md](docs/index.md) – index de la documentation complète.
* [docs/overview/overview.md](docs/overview/overview.md) – aperçu du projet.
* [docs/overview/limitations.md](docs/overview/limitations.md) – limites connues de l’application.
* [docs/guides/contributing.md](docs/guides/contributing.md) – guide de contribution.
* [docs/reference/tests-overview.md](docs/reference/tests-overview.md) – exécution des tests.
* [docs/reference/architecture.md](docs/reference/architecture.md) – architecture du projet.
* [docs/reference/api-reference.md](docs/reference/api-reference.md) – référence API interne.
* [docs/releases/changelog.md](docs/releases/changelog.md) – journal des modifications.

Consultez aussi [AGENTS.md](AGENTS.md) pour les conventions de contribution.
Avant toute contribution, exécutez `npm run lint` puis `npm test`.

## Installation

1. Vérifiez que Node.js 18 ou plus est installé

   ```bash
   node -v
   ```
2. Installez les dépendances

   ```bash
   npm install
   ```

   Lancez cette commande avant `npm run lint` ou `npm test`.
3. Démarrez le serveur de développement

   ```bash
   npm run dev
   ```

   L’application sera servie par Vite et rechargée à chaque modification.
4. Exécutez les tests unitaires

   ```bash
   npm test
   ```
5. Générez la version production

   ```bash
   npm run build
   ```
6. Prévisualisez la build en local

   ```bash
   npm run preview
   ```

## Sécurité et limitations

Le projet valide et assainit les fichiers avant analyse, mais fonctionne entièrement côté navigateur. Mesures de sécurité :

* Nombre maximal de fichiers, taille par fichier et taille totale des téléversements
* Contrôle de l’extension `.txt` et du type MIME
* Suppression des motifs dangereux (ex. : balises `<script>`) du contenu
* Limitation du débit pour éviter le traitement massif
* Assainissement des noms de fichiers téléchargés

Malgré ces protections, tout contrôle reste côté client et ne peut garantir une sécurité totale. N’utilisez **jamais** cet outil avec des données sensibles ou non fiables. Les règles de validation sont adaptées à la sortie Postman Runner et peuvent rejeter d’autres formats ou manquer certains cas limites.

## Personnalisation de l’écran d’erreur

L’application utilise un composant `ErrorBoundary`. Par défaut, un écran simple s’affiche en cas d’erreur non gérée.
Vous pouvez personnaliser ce comportement en passant un élément React au prop `fallback` :

```tsx
<ErrorBoundary fallback={<MyErrorScreen />}>
  <App />
</ErrorBoundary>
```

Utilisez ceci pour ajouter des actions supplémentaires, comme le rapport d’erreur ou des liens de navigation.
