# API Reference

The application runs entirely in the browser and exposes utility functions for parsing and validating files. Key exported functions include:

## `parseFileContent(content: string): FileData`
Parses sanitized file content and returns a structured object. Throws an error when required fields are missing or invalid.

## `validateFile(file: File): ValidationResult`
Checks a single file's size, extension and basic properties before processing.

## `validateFileList(files: FileList | File[]): ValidationResult`
Validates multiple files collectively and ensures limits on count and total size.

## `validateAndSanitizeContent(content: string, filename: string): FileValidationResult`
Validates text content and removes dangerous patterns. Returns sanitized content on success.

## `validateRateLimit(): ValidationResult`
Ensures that file processing does not exceed the configured rate limits.
