import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FileParserService } from '../../services/FileParserService';
import { FileValidationService } from '../../services/FileValidationService';
import type { FileData } from '../../types';
import type { ValidationResult } from '../securityValidator';

// Mock utility modules used by the services
vi.mock('../parseStrategyRegistry', () => ({
  getParseStrategy: vi.fn(),
}));

vi.mock('../fileParser', () => ({
  generateJSONContent: vi.fn(),
  downloadJSON: vi.fn(),
  sanitizeFileData: vi.fn((d) => d),
}));

vi.mock('../securityValidator', () => ({
  validateFileList: vi.fn(),
  validateRateLimit: vi.fn(),
}));

// Import the mocked functions for assertions
import { getParseStrategy } from '../parseStrategyRegistry';
import { generateJSONContent, downloadJSON, sanitizeFileData } from '../fileParser';
import { validateFileList, validateRateLimit } from '../securityValidator';

describe('FileParserService', () => {
  const service = new FileParserService();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('parse uses strategy from registry with default key', () => {
    const strategy = vi.fn().mockReturnValue(['d']);
    (getParseStrategy as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      strategy,
    );
    const result = service.parse('content');
    expect(getParseStrategy).toHaveBeenCalledWith('default');
    expect(strategy).toHaveBeenCalledWith('content');
    expect(result).toEqual(['d']);
  });

  it('parse uses strategy from registry with custom key', () => {
    const strategy = vi.fn().mockReturnValue(['x']);
    (getParseStrategy as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      strategy,
    );
    const result = service.parse('content', 'csv');
    expect(getParseStrategy).toHaveBeenCalledWith('csv');
    expect(strategy).toHaveBeenCalledWith('content');
    expect(result).toEqual(['x']);
  });

  it('toJSON sanitizes data then calls generateJSONContent', () => {
    const sanitized = {} as unknown as FileData;
    (
      sanitizeFileData as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue(sanitized);
    (
      generateJSONContent as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue('json');
    const data = {} as unknown as FileData;
    const result = service.toJSON(data);
    expect(sanitizeFileData).toHaveBeenCalledWith(data);
    expect(generateJSONContent).toHaveBeenCalledWith(sanitized);
    expect(result).toBe('json');
  });

  it('download sanitizes data then calls downloadJSON', () => {
    const sanitized = {} as unknown as FileData;
    (
      sanitizeFileData as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue(sanitized);
    const data = {} as unknown as FileData;
    service.download(data, 'file.txt');
    expect(sanitizeFileData).toHaveBeenCalledWith(data);
    expect(downloadJSON).toHaveBeenCalledWith(sanitized, 'file.txt');
  });
});

describe('FileValidationService', () => {
  const service = new FileValidationService();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('validateFiles calls validateFileList and returns its result', () => {
    const resultMock: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
    };
    (validateFileList as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      resultMock,
    );
    const files = [] as unknown as FileList;
    const result = service.validateFiles(files);
    expect(validateFileList).toHaveBeenCalledWith(files);
    expect(result).toBe(resultMock);
  });

  it('validateRateLimit calls validateRateLimit util and returns its result', () => {
    const resultMock: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
    };
    (validateRateLimit as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      resultMock,
    );
    const result = service.validateRateLimit();
    expect(validateRateLimit).toHaveBeenCalled();
    expect(result).toBe(resultMock);
  });
});
