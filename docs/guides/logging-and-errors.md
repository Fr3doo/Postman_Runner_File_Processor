# Journalisation et gestion des erreurs

Ce guide explique comment enregistrer des actions et afficher des messages d’erreur sûrs.

## LoggingService

Importer `loggingService` pour ajouter des entrées au journal :

```ts
import { loggingService } from '../services/LoggingService';

loggingService.logInfo('Start processing');
```

Utiliser `logError` pour les erreurs et appeler `getLogs()` pour consulter l’historique. Utiliser `clear()` pour réinitialiser la liste des journaux.

Vous pouvez sauvegarder le journal dans `localStorage` avec `save()` et le restaurer plus tard avec `load()`. La méthode `exportLogs()` télécharge un fichier `logs.json` contenant toutes les entrées.

## ErrorHandler

Convertir les erreurs inconnues en messages lisibles :

```ts
import { errorHandler } from '../services/ErrorHandler';

try {
  // ...
} catch (e) {
  const msg = errorHandler.handle(e);
  console.error(msg);
}
```

La méthode `handle` renvoie une chaîne de caractères nettoyée que vous pouvez afficher à l’utilisateur.
