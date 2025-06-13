# Guide de configuration

Ce guide explique comment ajuster les limites d’exécution et les options de traitement.

## Limites de sécurité

`ConfigService` lit les limites de sécurité à partir des variables d’environnement ou utilise les valeurs par défaut de `src/config/security.ts`. Utilisez les noms de variables suivants pour modifier les règles :

* `MAX_FILE_SIZE` définit la taille maximale autorisée pour un fichier.
* `MAX_TOTAL_SIZE` contrôle la taille combinée de tous les fichiers téléchargés.
* `MAX_FILES_COUNT` limite le nombre de fichiers pouvant être traités simultanément.
* `MAX_LINE_LENGTH` et `MAX_LINES_COUNT` protègent contre les fichiers extrêmement longs.
* `ALLOWED_FILE_EXTENSIONS` et `ALLOWED_MIME_TYPES` restreignent les types de fichiers acceptés.
* `DANGEROUS_PATTERNS` supprime les scripts et HTML indésirables.
* `RATE_LIMIT_WINDOW` et `RATE_LIMIT_MAX_FILES` contrôlent la limitation du débit.

## Constantes d’application

`ConfigService` expose également des constantes applicatives :

* `CONCURRENCY_LIMIT` définit combien de fichiers sont analysés en parallèle.
* `FILE_READ_TIMEOUT` spécifie le temps (en millisecondes) autorisé pour lire chaque fichier.

Définissez ces variables dans votre fichier `.env` (ajoutez le préfixe `VITE_` pour une utilisation côté navigateur) pour remplacer les valeurs par défaut. Ceci permet d’appliquer des limites différentes selon l’environnement.

