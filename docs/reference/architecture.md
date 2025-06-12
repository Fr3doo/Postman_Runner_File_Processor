# Architecture

The project is a Vite powered React application written in TypeScript.

```
src/
├─ components/          React UI components
├─ config/              Configuration constants
├─ hooks/               Custom React hooks
├─ services/            Helper services
├─ utils/               Parsing and validation logic
└─ types/               Shared TypeScript types
```

Unit tests reside in `src/utils/__tests__` and are executed with Vitest. Styling is done with Tailwind CSS and icons come from `lucide-react`.

## Key services

### LoggingService

Keeps a list of log entries with a level (`info` or `error`), a message and a timestamp. Use `logInfo` or `logError` to add entries and `getLogs` to inspect them.

### ConfigService

Reads environment variables and exposes runtime constants. Access it via `configService` to retrieve limits such as `concurrencyLimit` or the nested `security` settings.

### ErrorHandler

Transforms unknown errors into short user-friendly strings. Call `errorHandler.handle(value)` before displaying an error message to the user.
