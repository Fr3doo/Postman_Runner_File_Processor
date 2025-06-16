# API des composants d'en-tête

Cette page décrit les propriétés des composants utilisés pour l'en-tête de l'application.

## Header

Composant principal de l'en-tête.

- `title? : string` – titre affiché sous le logo.
- `subtitle? : string` – phrase complémentaire.
- `items? : NavItem[]` – liens de navigation personnalisés.
- `githubUrl : string` – lien vers le dépôt GitHub.
- `downloadUrl : string` – URL du bouton de téléchargement.

## Navigation

Affiche la liste de liens horizontaux.

- `className? : string` – classes CSS supplémentaires.
- `items? : NavItem[]` – liste des liens à rendre. Les liens par défaut sont utilisés si la liste est vide.

## MobileMenu

Menu déroulant affiché sur mobile.

- `open : boolean` – indique si le menu est visible.
- `onClose : () => void` – fonction appelée lorsqu'on ferme le menu.
- `items : NavItem[]` – liens de navigation.
- `actions : { githubUrl: string; downloadUrl: string }` – URLs passées au composant `UserActions`.

## UserActions

Boutons pour GitHub et le téléchargement.

- `githubUrl : string` – cible du lien GitHub.
- `downloadUrl : string` – cible du bouton "Télécharger".
- `className? : string` – classes CSS supplémentaires.
