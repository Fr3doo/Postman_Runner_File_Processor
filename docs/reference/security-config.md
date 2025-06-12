# Security Configuration

The `SECURITY_CONFIG` constant in `src/config/security.ts` defines validation and rate limiting rules for file processing.

## File Size Limits

- `MAX_FILE_SIZE` – maximum size for a single file (100MB).
- `MAX_TOTAL_SIZE` – maximum combined size when uploading multiple files (500MB).
- `MAX_FILES_COUNT` – number of files allowed in one batch (20).

## Content Validation

- `MAX_LINE_LENGTH` – maximum characters allowed per line (50000).
- `MAX_LINES_COUNT` – maximum lines allowed in each file (100000).

## Allowed Extensions and Types

- `ALLOWED_FILE_EXTENSIONS` – list of accepted file extensions (`.txt`).
- `ALLOWED_MIME_TYPES` – accepted MIME types for upload.

## Content Sanitization

- `DANGEROUS_PATTERNS` – regular expressions removed from uploaded text to prevent script execution and other injections.

## Rate Limiting

- `RATE_LIMIT_WINDOW` – time window in milliseconds used to throttle uploads (60,000ms).
- `RATE_LIMIT_MAX_FILES` – number of files permitted per window (100).
