# Journal des modifications

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

## Non publié

- Ajout de la documentation initiale du projet.
- Refactor complet de l'en-tête : introduction des sous-composants (`Logo`, `Navigation`, `UserActions`, `MobileMenu`) et centralisation des liens par défaut via `DEFAULT_NAV_ITEMS`. Les props `githubUrl` et `downloadUrl` deviennent obligatoires et `className` est supprimée.

## 1.1.0 - 2025-06-17

- Persistance automatique de l'historique des fichiers.
- Mise à jour de l'interface : affichage d'un message lorsque l'historique est vide et ajout d'un bouton de rafraîchissement.
