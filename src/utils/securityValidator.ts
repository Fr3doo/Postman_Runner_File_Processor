import { SECURITY_CONFIG } from '../config/security';
import { formatFileSize } from './format';
import { ValidationError, RateLimitError } from './errors';

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
      `Fichier trop volumineux (${formatFileSize(file.size)}). ` +
      `Taille maximale autorisée : ${formatFileSize(SECURITY_CONFIG.MAX_FILE_SIZE)}.`
    );
  }

  // Check file extension
  const hasValidExtension = SECURITY_CONFIG.ALLOWED_FILE_EXTENSIONS.some(ext =>
    file.name.toLowerCase().endsWith(ext)
  );
  
  if (!hasValidExtension) {
    errors.push(
      `Extension de fichier invalide. ` +
      `Extensions autorisées : ${SECURITY_CONFIG.ALLOWED_FILE_EXTENSIONS.join(', ')}`
    );
  }

  // Check MIME type if available
  if (file.type && !SECURITY_CONFIG.ALLOWED_MIME_TYPES.includes(file.type)) {
    warnings.push(
      `Type MIME inattendu : ${file.type}. ` +
      `Type(s) attendu(s) : ${SECURITY_CONFIG.ALLOWED_MIME_TYPES.filter(t => t).join(', ')}`
    );
  }

  // Check for suspicious file names
  if (containsSuspiciousPatterns(file.name)) {
    errors.push('Le nom du fichier contient des caractères ou motifs suspects.');
  }

  const result = {
    isValid: errors.length === 0,
    errors,
    warnings,
  };

  if (!result.isValid) {
    throw new ValidationError(result.errors.join(', '));
  }

  return result;
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
        `Trop de fichiers sélectionnés (${fileArray.length}). ` +
        `Maximum autorisé : ${SECURITY_CONFIG.MAX_FILES_COUNT}`
    );
  }

  // Check total size
  const totalSize = fileArray.reduce((sum, file) => sum + file.size, 0);
  if (totalSize > SECURITY_CONFIG.MAX_TOTAL_SIZE) {
    errors.push(
        `Taille totale des fichiers trop grande (${formatFileSize(totalSize)}). ` +
        `Maximum autorisé : ${formatFileSize(SECURITY_CONFIG.MAX_TOTAL_SIZE)}`
    );
  }

  // Validate each file individually
  fileArray.forEach(file => {
    const fileValidation = validateFile(file);
    errors.push(...fileValidation.errors);
    warnings.push(...fileValidation.warnings);
  });

  const result = {
    isValid: errors.length === 0,
    errors,
    warnings,
  };

  if (!result.isValid) {
    throw new ValidationError(result.errors.join(', '));
  }

  return result;
};

/**
 * Validates and sanitizes file content
 */
export const validateAndSanitizeContent = (
  content: string
): FileValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check content length
  if (content.length === 0) {
    errors.push('Le fichier est vide.');
    const result = { isValid: false, errors, warnings };
    throw new ValidationError(result.errors.join(', '));
  }

  // Split into lines for validation
  const lines = content.split('\n');

  // Check line count
  if (lines.length > SECURITY_CONFIG.MAX_LINES_COUNT) {
    errors.push(
      `Le fichier contient trop de lignes (${lines.length}). ` +
      `Maximum autorisé : ${SECURITY_CONFIG.MAX_LINES_COUNT}`
    );
  }

  // Check line length
  const longLines = lines.filter(line => line.length > SECURITY_CONFIG.MAX_LINE_LENGTH);
  if (longLines.length > 0) {
    warnings.push(
      `Le fichier contient ${longLines.length} ligne(s) dépassant ` +
      `${SECURITY_CONFIG.MAX_LINE_LENGTH} caractères.`
    );
  }

  // Sanitize content
  let sanitizedContent = content;
  
  // Remove dangerous patterns
  SECURITY_CONFIG.DANGEROUS_PATTERNS.forEach(pattern => {
    if (pattern.test(sanitizedContent)) {
      warnings.push('Le fichier contenait du contenu potentiellement dangereux qui a été supprimé.');
      sanitizedContent = sanitizedContent.replace(pattern, '[REMOVED_SUSPICIOUS_CONTENT]');
    }
  });

  // Additional sanitization
  sanitizedContent = sanitizeTextContent(sanitizedContent);

  // Check if content was significantly modified
  if (sanitizedContent.length < content.length * 0.8) {
    errors.push(
        'Le contenu du fichier a été fortement modifié lors de la sanitisation. ' +
        'Cela peut indiquer un contenu malveillant.'
    );
  }

  const result = {
    isValid: errors.length === 0,
    errors,
    warnings,
    sanitizedContent,
  };

  if (!result.isValid) {
    throw new ValidationError(result.errors.join(', '));
  }

  return result;
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
  // eslint-disable-next-line no-control-regex
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
        `Limite de débit dépassée. Vous pourrez traiter d'autres fichiers dans ${minutes} minute(s). ` +
        `Maximum : ${SECURITY_CONFIG.RATE_LIMIT_MAX_FILES} fichiers par ${SECURITY_CONFIG.RATE_LIMIT_WINDOW / 60000} minutes.`
    );
  }

  const result = {
    isValid: errors.length === 0,
    errors,
    warnings,
  };

  if (!result.isValid) {
    throw new RateLimitError(result.errors.join(', '));
  }

  return result;
};