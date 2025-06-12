# Configuration Guide

This guide explains how to adjust runtime limits and processing options.

## Security limits

`ConfigService` reads the security limits from environment variables or falls back to `src/config/security.ts` defaults. Use the following variable names to adjust the rules:

- `MAX_FILE_SIZE` sets the largest allowed file.
- `MAX_TOTAL_SIZE` controls the combined size of all uploads.
- `MAX_FILES_COUNT` limits how many files can be processed at once.
- `MAX_LINE_LENGTH` and `MAX_LINES_COUNT` guard against extremely long files.
- `ALLOWED_FILE_EXTENSIONS` and `ALLOWED_MIME_TYPES` restrict accepted file types.
- `DANGEROUS_PATTERNS` strips unwanted scripts and HTML.
- `RATE_LIMIT_WINDOW` and `RATE_LIMIT_MAX_FILES` control rate limiting.

## Application constants

`ConfigService` also exposes application constants:

- `CONCURRENCY_LIMIT` sets how many files are parsed in parallel.
- `FILE_READ_TIMEOUT` specifies the time in milliseconds allowed to read each file.

Define these variables in your `.env` file (prefix each with `VITE_` when running in the browser) to override the defaults. This allows different limits per environment.
