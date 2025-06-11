# Postman Runner File Processor

A small React + TypeScript application for converting Postman Runner `.txt` files into structured JSON. Files are processed entirely in the browser with built‑in validation and sanitisation routines. For a full table of contents see [docs/index.md](docs/index.md).

## Features

- Drag‑and‑drop file uploader with progress display
- Parses Postman Runner output to extract:
  - remaining files count
  - télédémarche number
  - project name
  - dossier number
  - deposit date
- Download a JSON file for each successfully processed input
- Displays success or error state for every file and shows overall statistics
- Client‑side checks for file type, size limits and rate limiting

## Documentation

See [docs/index.md](docs/index.md) for the full documentation index. How‑to guides live in `docs/guides`, API and architecture references are in `docs/reference`, and changelogs and release notes can be found under `docs/releases`.

- [docs/index.md](docs/index.md) – full documentation index.
- [docs/overview/overview.md](docs/overview/overview.md) – project overview.
- [docs/guides/contributing.md](docs/guides/contributing.md) – contribution guidelines.
- [docs/reference/tests-overview.md](docs/reference/tests-overview.md) – running tests.
- [docs/reference/architecture.md](docs/reference/architecture.md) – project architecture.
- [docs/reference/api-reference.md](docs/reference/api-reference.md) – internal API reference.
- [docs/releases/changelog.md](docs/releases/changelog.md) – changelog and release notes.

## Installation

1. Install dependencies
   ```bash
   npm install
   ```
2. Start the development server
   ```bash
   npm run dev
   ```
   The app will be served by Vite and reload on changes.
3. Run the unit tests
   ```bash
   npm test
   ```
4. Create a production build
   ```bash
   npm run build
   ```
5. Preview the build locally
   ```bash
   npm run preview
   ```

## Security considerations and limitations

The project validates and sanitises files before parsing but operates entirely in the browser. Security measures include:

- Maximum file count, size per file and total upload size
- `.txt` extension and MIME type checks
- Removal of dangerous patterns such as script tags from the file content
- Rate limiting to avoid processing an excessive number of files in a short time
- Sanitisation of downloaded file names

Despite these defences, all checks are client‑side and cannot fully protect against malicious input. Do **not** use the tool with untrusted or sensitive data. Its validation rules are tailored for Postman Runner output and may reject other formats or miss edge cases.
