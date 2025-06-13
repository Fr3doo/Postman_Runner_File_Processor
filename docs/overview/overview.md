# Project Overview

The Postman Runner File Processor converts Postman Runner `.txt` files into structured JSON. The application runs entirely in the browser using React and TypeScript.

## Key Features

- Drag-and-drop file upload with progress feedback
- Parses each file to extract:
  - remaining files count
  - télédémarche number
  - project name
  - dossier number
  - deposit date
- Downloads a JSON file for every processed input
- Displays processing statistics and errors
- Client-side validation for file type, size and rate limits
- [Security configuration reference](../reference/security-config.md) describes these limits in detail
- Warnings are collected through a notification service
- The UI is wrapped in an ErrorBoundary for graceful failures


# Aperçu du projet

Le Postman Runner File Processor convertit les fichiers `.txt` issus de Postman Runner en JSON structuré. L’application fonctionne entièrement dans le navigateur avec React et TypeScript.

## Fonctionnalités principales

* Téléversement de fichiers par glisser-déposer avec retour de progression
* Analyse de chaque fichier pour extraire :

  * nombre de fichiers restants
  * numéro télédémarche
  * nom du projet
  * numéro de dossier
  * date de dépôt
* Téléchargement d’un fichier JSON pour chaque entrée traitée
* Affichage des statistiques de traitement et des erreurs
* Validation côté client du type, de la taille et du débit des fichiers
* [Référence de configuration de sécurité](../reference/security-config.md) détaillant ces limites
* Les avertissements sont collectés via un service de notification
* L’interface est enveloppée dans un ErrorBoundary pour une gestion d’échec élégante
