import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FileParserService } from '../../services/FileParserService';
import { FileValidationService } from '../../services/FileValidationService';
import type { FileData } from '../../types';
import type { ValidationResult } from '../securityValidator';

// Mock utility modules used by the services
vi.mock('../parseStrategies', () => ({
  defaultParseStrategy: vi.fn(),
}));

vi.mock('../fileParser', () => ({
  generateJSONContent: vi.fn(),
  downloadJSON: vi.fn(),
}));

vi.mock('../securityValidator', () => ({
  validateFileList: vi.fn(),
  validateRateLimit: vi.fn(),
}));

// Import the mocked functions for assertions
import { defaultParseStrategy } from '../parseStrategies';
import { generateJSONContent, downloadJSON } from '../fileParser';
import { validateFileList, validateRateLimit } from '../securityValidator';

describe('FileParserService', () => {
  const service = new FileParserService();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('parse uses default strategy when none provided', () => {
    (
      defaultParseStrategy as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue(['d']);
    const result = service.parse('content');
    expect(defaultParseStrategy).toHaveBeenCalledWith('content');
    expect(result).toEqual(['d']);
  });

  it('parse uses provided strategy', () => {
    const custom = vi.fn().mockReturnValue(['x']);
    const result = service.parse('custom', custom);
    expect(custom).toHaveBeenCalledWith('custom');
    expect(defaultParseStrategy).not.toHaveBeenCalled();
    expect(result).toEqual(['x']);
  });

  it('toJSON calls generateJSONContent and returns its result', () => {
    (
      generateJSONContent as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue('json');
    const data = {} as unknown as FileData;
    const result = service.toJSON(data);
    expect(generateJSONContent).toHaveBeenCalledWith(data);
    expect(result).toBe('json');
  });

  it('download calls downloadJSON', () => {
    const data = {} as unknown as FileData;
    service.download(data, 'file.txt');
    expect(downloadJSON).toHaveBeenCalledWith(data, 'file.txt');
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
