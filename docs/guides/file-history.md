# Historique des fichiers traités

Ce guide décrit pas à pas comment l’application stocke les fichiers traités, comment les télécharger de nouveau et comment nettoyer l’historique.

## 1. Stockage local

1. Après chaque traitement, `FileHistoryService` ajoute un objet `ProcessedFile` à une liste en mémoire.
2. Avant de fermer ou de recharger la page, cette liste est sauvegardée dans `localStorage` sous la clé `fileHistory`.
3. Au prochain démarrage, la liste est restaurée à partir de cette clé.
4. Le service charge ainsi l'historique automatiquement et sauvegarde chaque modification sans action supplémentaire.

Aucune donnée n’est envoyée sur un serveur. Vous pouvez inspecter ou vider ce stockage via les outils du navigateur.

## 2. Retélécharger un fichier

1. Ouvrez la page **Historique des fichiers** de l’application.
2. Chaque carte contient un bouton **Télécharger à nouveau**.
3. Cliquez dessus pour récupérer un fichier JSON identique au fichier d’origine.

## 3. Supprimer l’historique

1. Pour retirer un fichier isolé, cliquez sur **Supprimer** sur sa carte.
2. Pour tout effacer, utilisez **Effacer l’historique** en haut de la page. L’entrée `fileHistory` est alors supprimée de `localStorage`.
3. Vous pouvez ensuite importer de nouveaux fichiers et recommencer avec un historique vide.

## 4. Chargement automatique et état vide

L'historique se charge dès l'ouverture de l'application et se sauvegarde après chaque action. Lorsque la liste est vide, une phrase *Aucun fichier dans l'historique.* s'affiche pour indiquer l'état actuel.
