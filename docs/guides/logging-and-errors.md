# Logging and Error Handling

This guide explains how to record actions and display safe error messages.

## LoggingService

Import `loggingService` to add log entries:

```ts
import { loggingService } from '../services/LoggingService';

loggingService.logInfo('Start processing');
```

Use `logError` for errors and call `getLogs()` to review the history. Use `clear()` to reset the log list.

## ErrorHandler

Convert unknown errors into readable messages:

```ts
import { errorHandler } from '../services/ErrorHandler';

try {
  // ...
} catch (e) {
  const msg = errorHandler.handle(e);
  console.error(msg);
}
```

The `handle` method returns a sanitized string that you can show to the user.
