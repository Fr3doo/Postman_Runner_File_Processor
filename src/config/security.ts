// Security configuration constants
export const SECURITY_CONFIG = {
  // File size limits
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB per file
  MAX_TOTAL_SIZE: 50 * 1024 * 1024, // 50MB total
  MAX_FILES_COUNT: 20, // Maximum number of files
  
  // Content validation
  MAX_LINE_LENGTH: 1000, // Maximum characters per line
  MAX_LINES_COUNT: 10000, // Maximum lines per file
  
  // Allowed patterns
  ALLOWED_FILE_EXTENSIONS: ['.txt'],
  ALLOWED_MIME_TYPES: ['text/plain', 'text/txt', ''],
  
  // Content sanitization
  DANGEROUS_PATTERNS: [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /javascript:/gi,
    /data:text\/html/gi,
    /vbscript:/gi,
    /on\w+\s*=/gi, // Event handlers like onclick, onload, etc.
  ],
  
  // Rate limiting (files per minute)
  RATE_LIMIT_WINDOW: 60 * 1000, // 1 minute
  RATE_LIMIT_MAX_FILES: 100,
} as const;