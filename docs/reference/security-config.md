# Configuration de sécurité

La constante `SECURITY_CONFIG` dans `src/config/security.ts` définit les règles de validation et de limitation du débit pour le traitement des fichiers.

## Limites de taille de fichier

* `MAX_FILE_SIZE` – taille maximale pour un fichier unique (100 Mo).
* `MAX_TOTAL_SIZE` – taille totale maximale lors du téléversement de plusieurs fichiers (500 Mo).
* `MAX_FILES_COUNT` – nombre de fichiers autorisés par lot (20).

## Validation du contenu

* `MAX_LINE_LENGTH` – nombre maximal de caractères par ligne (50 000).
* `MAX_LINES_COUNT` – nombre maximal de lignes par fichier (100 000).

## Extensions et types autorisés

* `ALLOWED_FILE_EXTENSIONS` – liste des extensions acceptées (`.txt`).
* `ALLOWED_MIME_TYPES` – types MIME autorisés pour le téléversement.

## Assainissement du contenu

* `DANGEROUS_PATTERNS` – expressions régulières supprimées du texte téléversé pour éviter l’exécution de scripts et autres injections.

## Limitation de débit

* `RATE_LIMIT_WINDOW` – fenêtre temporelle en millisecondes utilisée pour limiter les téléversements (60 000 ms).
* `RATE_LIMIT_MAX_FILES` – nombre de fichiers autorisés par fenêtre (100).
