# Référence API

L’application fonctionne entièrement dans le navigateur et expose des fonctions utilitaires pour l’analyse et la validation des fichiers. Les fonctions exportées principales sont :

## `parseFileContent(content: string): FileData`

Analyse le contenu d’un fichier déjà assaini et retourne un objet structuré. Lève une erreur si des champs obligatoires sont absents ou invalides.

## `parseAllSummaryBlocks(content: string): FileData[]`

Retourne un tableau de tous les blocs de synthèse trouvés dans le texte. Chaque élément a la même structure que `parseFileContent`.

## `validateFile(file: File): ValidationResult`

Vérifie la taille, l’extension et les propriétés de base d’un fichier avant traitement.

## `validateFileList(files: FileList | File[]): ValidationResult`

Valide un ensemble de fichiers et assure le respect des limites de nombre et de taille totale.

## `validateAndSanitizeContent(content: string, filename: string): FileValidationResult`

Valide le contenu textuel et supprime les motifs dangereux. Retourne le contenu assaini en cas de succès.

## `validateRateLimit(): ValidationResult`

Vérifie que le traitement des fichiers ne dépasse pas les limites de débit configurées.

## Enregistrer une stratégie de parsing

Les stratégies d'analyse sont stockées dans un registre. Utilisez `registerParseStrategy('csv', maFonction)` pour ajouter une nouvelle stratégie. Appelez ensuite `FileParserService.parse(contenu, 'csv')` pour l'utiliser.
