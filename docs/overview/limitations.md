# Limitations connues

Cette application fonctionne uniquement dans le navigateur et ne possède pas de composant serveur. Les fichiers chargés ne sont jamais envoyés sur un backend.
La page **Locaux** nécessite cependant l'environnement Node.js pour accéder au système de fichiers local.

## Limites de débit

La configuration définit un nombre maximal de fichiers et une taille totale autorisée pour chaque fenêtre temporelle. Ces limites évitent le traitement massif de données. Les valeurs détaillées se trouvent dans [reference/security-config.md](../reference/security-config.md).

## Formats non pris en charge

Seuls les fichiers `.txt` issus de Postman Runner sont acceptés. Les autres extensions ou formats compressés sont refusés.
