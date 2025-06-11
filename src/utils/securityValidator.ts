import { SECURITY_CONFIG } from '../config/security';
import { formatFileSize } from './format';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface FileValidationResult extends ValidationResult {
  sanitizedContent?: string;
}

/**
 * Validates file properties before processing
 */
export const validateFile = (file: File): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check file size
  if (file.size > SECURITY_CONFIG.MAX_FILE_SIZE) {
    errors.push(
      `File "${file.name}" is too large (${formatFileSize(file.size)}). ` +
      `Maximum allowed size is ${formatFileSize(SECURITY_CONFIG.MAX_FILE_SIZE)}.`
    );
  }

  // Check file extension
  const hasValidExtension = SECURITY_CONFIG.ALLOWED_FILE_EXTENSIONS.some(ext =>
    file.name.toLowerCase().endsWith(ext)
  );
  
  if (!hasValidExtension) {
    errors.push(
      `File "${file.name}" has an invalid extension. ` +
      `Allowed extensions: ${SECURITY_CONFIG.ALLOWED_FILE_EXTENSIONS.join(', ')}`
    );
  }

  // Check MIME type if available
  if (file.type && !SECURITY_CONFIG.ALLOWED_MIME_TYPES.includes(file.type)) {
    warnings.push(
      `File "${file.name}" has unexpected MIME type: ${file.type}. ` +
      `Expected: ${SECURITY_CONFIG.ALLOWED_MIME_TYPES.filter(t => t).join(', ')}`
    );
  }

  // Check for suspicious file names
  if (containsSuspiciousPatterns(file.name)) {
    errors.push(`File "${file.name}" contains suspicious characters or patterns.`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Validates multiple files collectively
 */
export const validateFileList = (files: FileList | File[]): ValidationResult => {
  const fileArray = Array.from(files);
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check file count
  if (fileArray.length > SECURITY_CONFIG.MAX_FILES_COUNT) {
    errors.push(
      `Too many files selected (${fileArray.length}). ` +
      `Maximum allowed: ${SECURITY_CONFIG.MAX_FILES_COUNT}`
    );
  }

  // Check total size
  const totalSize = fileArray.reduce((sum, file) => sum + file.size, 0);
  if (totalSize > SECURITY_CONFIG.MAX_TOTAL_SIZE) {
    errors.push(
      `Total file size too large (${formatFileSize(totalSize)}). ` +
      `Maximum allowed: ${formatFileSize(SECURITY_CONFIG.MAX_TOTAL_SIZE)}`
    );
  }

  // Validate each file individually
  fileArray.forEach(file => {
    const fileValidation = validateFile(file);
    errors.push(...fileValidation.errors);
    warnings.push(...fileValidation.warnings);
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Validates and sanitizes file content
 */
export const validateAndSanitizeContent = (
  content: string,
  filename: string
): FileValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check content length
  if (content.length === 0) {
    errors.push(`File "${filename}" is empty.`);
    return { isValid: false, errors, warnings };
  }

  // Split into lines for validation
  const lines = content.split('\n');

  // Check line count
  if (lines.length > SECURITY_CONFIG.MAX_LINES_COUNT) {
    errors.push(
      `File "${filename}" has too many lines (${lines.length}). ` +
      `Maximum allowed: ${SECURITY_CONFIG.MAX_LINES_COUNT}`
    );
  }

  // Check line length
  const longLines = lines.filter(line => line.length > SECURITY_CONFIG.MAX_LINE_LENGTH);
  if (longLines.length > 0) {
    warnings.push(
      `File "${filename}" contains ${longLines.length} lines longer than ` +
      `${SECURITY_CONFIG.MAX_LINE_LENGTH} characters.`
    );
  }

  // Sanitize content
  let sanitizedContent = content;
  
  // Remove dangerous patterns
  SECURITY_CONFIG.DANGEROUS_PATTERNS.forEach(pattern => {
    if (pattern.test(sanitizedContent)) {
      warnings.push(`File "${filename}" contained potentially dangerous content that was removed.`);
      sanitizedContent = sanitizedContent.replace(pattern, '[REMOVED_SUSPICIOUS_CONTENT]');
    }
  });

  // Additional sanitization
  sanitizedContent = sanitizeTextContent(sanitizedContent);

  // Check if content was significantly modified
  if (sanitizedContent.length < content.length * 0.8) {
    errors.push(
      `File "${filename}" content was heavily modified during sanitization. ` +
      `This may indicate malicious content.`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    sanitizedContent,
  };
};

/**
 * Rate limiting validation
 */
class RateLimiter {
  private requests: number[] = [];

  isAllowed(): boolean {
    const now = Date.now();
    
    // Remove old requests outside the window
    this.requests = this.requests.filter(
      time => now - time < SECURITY_CONFIG.RATE_LIMIT_WINDOW
    );

    // Check if under limit
    if (this.requests.length >= SECURITY_CONFIG.RATE_LIMIT_MAX_FILES) {
      return false;
    }

    // Add current request
    this.requests.push(now);
    return true;
  }

  getTimeUntilReset(): number {
    if (this.requests.length === 0) return 0;
    
    const oldestRequest = Math.min(...this.requests);
    const timeUntilReset = SECURITY_CONFIG.RATE_LIMIT_WINDOW - (Date.now() - oldestRequest);
    
    return Math.max(0, timeUntilReset);
  }
}

export const rateLimiter = new RateLimiter();

/**
 * Helper functions
 */

const containsSuspiciousPatterns = (filename: string): boolean => {
  const suspiciousPatterns = [
    /\.\./,  // Directory traversal
    /[<>:"|?*]/,  // Invalid filename characters
    /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i,  // Windows reserved names
    /^\./,  // Hidden files
  ];

  return suspiciousPatterns.some(pattern => pattern.test(filename));
};

const sanitizeTextContent = (content: string): string => {
  // Remove null bytes and other control characters (except newlines and tabs)
  return content.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
};

/**
 * Validates file processing rate limits
 */
export const validateRateLimit = (): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!rateLimiter.isAllowed()) {
    const timeUntilReset = rateLimiter.getTimeUntilReset();
    const minutes = Math.ceil(timeUntilReset / (60 * 1000));
    
    errors.push(
      `Rate limit exceeded. You can process more files in ${minutes} minute(s). ` +
      `Maximum: ${SECURITY_CONFIG.RATE_LIMIT_MAX_FILES} files per ${SECURITY_CONFIG.RATE_LIMIT_WINDOW / 60000} minutes.`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};