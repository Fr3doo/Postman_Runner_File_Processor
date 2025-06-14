# Tests avancés

Ce guide explique comment atteindre les branches difficiles des utilitaires en
mockant la configuration et en simulant les APIs du DOM.

## Mocker la configuration

Les services lisent leurs limites à partir des variables d’environnement.
Pour tester des cas spécifiques, instanciez `ConfigService` avec un objet
personnalisé ou espionnez le singleton `configService`.

```ts
import { ConfigService, configService } from '../../services/ConfigService';
import { SECURITY_CONFIG } from '../../config/security';

const service = new ConfigService({
  VITE_MAX_FILES_COUNT: '5',
  VITE_FILE_READ_TIMEOUT: '100',
});

vi.spyOn(configService, 'security', 'get').mockReturnValue(SECURITY_CONFIG);
```

Sauvegardez `process.env` dans `beforeEach` et restaurez‑le dans `afterEach` pour
éviter les effets de bord.

## Simuler les APIs DOM

Les fonctions `downloadJSON` ou `FileReaderService` utilisent le navigateur. Pour
les tester, remplacez les APIs globales fournies par JSDOM.

```ts
class MockReader {
  onload: ((e: ProgressEvent<FileReader>) => void) | null = null;
  readAsText() {
    if (this.onload) this.onload(new ProgressEvent('load'));
  }
}
// @ts-expect-error: override FileReader
global.FileReader = MockReader;

declare const document: Document;
vi.spyOn(document, 'createElement');
vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:url');
```

Restaurez les méthodes modifiées dans `afterEach`.

## Atteindre les branches difficiles

Certaines validations utilisent des comportements rares. Pour les couvrir :

1. Retournez des valeurs inattendues depuis vos mocks.
2. Surchargez temporairement des fonctions globales comme `parseInt`.
3. Contrôlez le temps avec `vi.useFakeTimers()` dans le limiteur de requêtes.

Ces techniques assurent une couverture élevée sans dépendre de l’environnement
réel.
