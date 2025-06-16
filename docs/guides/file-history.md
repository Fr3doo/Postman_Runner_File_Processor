# Historique des fichiers traités

Ce guide explique comment l'application conserve en local les fichiers déjà traités et comment les récupérer ou les supprimer.

## 1. Stockage local

`FileHistoryService` maintient une liste de `ProcessedFile` en mémoire. Cette liste est sauvegardée dans `localStorage` sous la clé `fileHistory` quand vous quittez l'application puis restaurée au chargement suivant.

Aucune donnée n'est envoyée sur un serveur. Vous pouvez inspecter ou vider ce stockage via les outils du navigateur si besoin.

## 2. Retélécharger un fichier

Depuis la page **Historique des fichiers**, chaque carte affiche un bouton **Télécharger à nouveau**. Il génère à partir des données enregistrées un fichier JSON identique à celui obtenu lors du traitement initial.

## 3. Supprimer l'historique

Deux options existent :

- Cliquez sur **Supprimer** sur une carte pour retirer uniquement ce fichier.
- Utilisez **Effacer l'historique** en haut de la page pour tout réinitialiser. Cette action vide aussi `localStorage`.

Vous pouvez ensuite importer de nouveaux fichiers et redémarrer un historique propre.
