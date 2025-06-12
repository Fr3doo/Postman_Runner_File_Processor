import {
  ValidationResult,
  validateFileList,
  validateRateLimit,
} from '../utils/securityValidator';

export class FileValidationService {
  validateFiles(files: FileList): ValidationResult {
    return validateFileList(files);
  }

  validateRateLimit(): ValidationResult {
    return validateRateLimit();
  }
}
