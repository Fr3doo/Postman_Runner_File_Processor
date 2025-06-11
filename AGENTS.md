All code and documentation changes must pass linting and tests by running:

```
npm run lint
npm test
```

This project is built with React and TypeScript. UI components should use Tailwind CSS for styling and icons from `lucide-react`. Avoid adding other UI or icon libraries unless specifically requested.

When implementing interfaces, produce polished, production-ready designs as described in `.bolt/prompt`.

Unit tests live in `src/utils/__tests__`. Update or add tests there whenever modifying utility code.

## Documentation

Project docs are stored in the `docs/` directory with the following structure:

- `docs/overview` – project overview
- `docs/guides` – how‑to guides and contribution info
- `docs/reference` – API and architecture references
- `docs/releases` – changelog and release notes

Start from [docs/index.md](docs/index.md) and see
[docs/guides/contributing.md](docs/guides/contributing.md) for contributor guidelines.
Refer to [docs/guides/documentation-style.md](docs/guides/documentation-style.md) for documentation conventions.
