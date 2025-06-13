# Exemple d’utilisation

Ce guide présente un workflow de base pour traiter des fichiers `.txt` Postman Runner.

## 1. Téléversez des fichiers

Glissez un ou plusieurs fichiers `.txt` dans la zone **Téléverser des fichiers Postman Runner** ou cliquez sur **Choisir des fichiers** pour les sélectionner depuis votre ordinateur.
Les erreurs ou avertissements de validation s’affichent sous la zone de dépôt si un fichier est refusé.

## 2. Consultez les résultats

Chaque fichier apparaît dans la grille de résultats avec un badge de statut. Si le traitement réussit, les informations clés sont affichées :

- Nombre de fichiers restants
- Numéro télédémarche
- Nom du projet
- Numéro de dossier
- Date de dépôt

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

## 4. Traiter plusieurs fichiers simultanément

Vous pouvez déposer plusieurs fichiers en une seule action. Le traitement s’effe
ctue fichier par fichier. La grille se met à jour au fur et à mesure et affiche
un badge pour chaque résultat.

## 5. Interpréter les avertissements et les messages d’erreur

Les avertissements s’affichent sous la zone de dépôt lorsqu’un fichier n’est pa
s valide ou dépasse la limite de taille. Un message explicite est aussi visible
dans la carte du fichier concerné. Exemple :

```
Fichier trop volumineux : fichier1.txt
```

En cas d’erreur d’analyse, le détail apparaît directement dans la grille.

## 6. Exemple de grille de résultats

Voici un extrait simplifié du code JSX générant la grille :

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {files.map((file) => (
    <ResultCard key={file.id} file={file} />
  ))}
</div>
```

Chaque carte contient les informations résumées du fichier et un bouton pour té
lécharger le JSON.

## 7. Changer la langue de l'interface

La langue par défaut est le français. Pour afficher l'application en anglais, importez la fonction `setLanguage` depuis `src/i18n` et appelez :

```ts
import { setLanguage } from '../src/i18n';

setLanguage('en');
```

Toutes les étiquettes et messages s'afficheront alors en anglais.
