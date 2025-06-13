export interface SecurityConfig {
  MAX_FILE_SIZE: number;
  MAX_TOTAL_SIZE: number;
  MAX_FILES_COUNT: number;
  MAX_LINE_LENGTH: number;
  MAX_LINES_COUNT: number;
  ALLOWED_FILE_EXTENSIONS: string[];
  ALLOWED_MIME_TYPES: string[];
  DANGEROUS_PATTERNS: RegExp[];
  RATE_LIMIT_WINDOW: number;
  RATE_LIMIT_MAX_FILES: number;
}

import { SECURITY_CONFIG } from '../config/security';
import { CONCURRENCY_LIMIT, FILE_READ_TIMEOUT } from '../config/app';

const metaEnv: ImportMetaEnv | undefined =
  typeof import.meta !== 'undefined'
    ? (import.meta as ImportMeta).env
    : undefined;
const defaultEnv = metaEnv ?? process.env;

class ConfigService {
  constructor(private readonly env: Record<string, unknown> = defaultEnv) {}

  private getNumber(key: string, fallback: number): number {
    const value = this.env[`VITE_${key}`] ?? this.env[key];
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
  }

  private getStringArray(key: string, fallback: string[]): string[] {
    const value = this.env[`VITE_${key}`] ?? this.env[key];
    if (typeof value !== 'string') return fallback;
    return value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
  }

  get concurrencyLimit(): number {
    return this.getNumber('CONCURRENCY_LIMIT', CONCURRENCY_LIMIT);
  }

  get fileReadTimeout(): number {
    return this.getNumber('FILE_READ_TIMEOUT', FILE_READ_TIMEOUT);
  }

  get security(): SecurityConfig {
    return {
      MAX_FILE_SIZE: this.getNumber(
        'MAX_FILE_SIZE',
        SECURITY_CONFIG.MAX_FILE_SIZE,
      ),
      MAX_TOTAL_SIZE: this.getNumber(
        'MAX_TOTAL_SIZE',
        SECURITY_CONFIG.MAX_TOTAL_SIZE,
      ),
      MAX_FILES_COUNT: this.getNumber(
        'MAX_FILES_COUNT',
        SECURITY_CONFIG.MAX_FILES_COUNT,
      ),
      MAX_LINE_LENGTH: this.getNumber(
        'MAX_LINE_LENGTH',
        SECURITY_CONFIG.MAX_LINE_LENGTH,
      ),
      MAX_LINES_COUNT: this.getNumber(
        'MAX_LINES_COUNT',
        SECURITY_CONFIG.MAX_LINES_COUNT,
      ),
      ALLOWED_FILE_EXTENSIONS: this.getStringArray(
        'ALLOWED_FILE_EXTENSIONS',
        SECURITY_CONFIG.ALLOWED_FILE_EXTENSIONS,
      ),
      ALLOWED_MIME_TYPES: this.getStringArray(
        'ALLOWED_MIME_TYPES',
        SECURITY_CONFIG.ALLOWED_MIME_TYPES,
      ),
      DANGEROUS_PATTERNS: SECURITY_CONFIG.DANGEROUS_PATTERNS,
      RATE_LIMIT_WINDOW: this.getNumber(
        'RATE_LIMIT_WINDOW',
        SECURITY_CONFIG.RATE_LIMIT_WINDOW,
      ),
      RATE_LIMIT_MAX_FILES: this.getNumber(
        'RATE_LIMIT_MAX_FILES',
        SECURITY_CONFIG.RATE_LIMIT_MAX_FILES,
      ),
    };
  }
}

export const configService = new ConfigService();
export type IConfigService = ConfigService;
export { ConfigService };
