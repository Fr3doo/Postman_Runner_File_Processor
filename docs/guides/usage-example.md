# Exemple d’utilisation

Ce guide présente un workflow de base pour traiter des fichiers `.txt` Postman Runner.

## 1. Téléversez des fichiers

Glissez un ou plusieurs fichiers `.txt` dans la zone **Téléverser des fichiers Postman Runner** ou cliquez sur **Choisir des fichiers** pour les sélectionner depuis votre ordinateur.
Les erreurs ou avertissements de validation s’affichent sous la zone de dépôt si un fichier est refusé.

## 2. Consultez les résultats

Chaque fichier apparaît dans la grille de résultats avec un badge de statut. Si le traitement réussit, les informations clés sont affichées :

* Nombre de fichiers restants
* Numéro télédémarche
* Nom du projet
* Numéro de dossier
* Date de dépôt

Si un fichier échoue à l’analyse, un message d’erreur s’affiche à la place des détails.

## 3. Téléchargez le JSON généré

Pour chaque fichier traité avec succès, cliquez sur **Télécharger le JSON** pour obtenir un fichier structuré. Exemple :

```json
{
  "nombre_fichiers_restants": 5,
  "numero_teledemarche": "TEST123",
  "nom_projet": "TRA - CODE - Example Project - v1.0",
  "numero_dossier": "123ABC",
  "date_depot": "2024-05-01"
}
```

Utilisez ces fichiers JSON dans vos outils ou scripts selon vos besoins.
