import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Dispatch, SetStateAction } from 'react';
import { ProcessFileCommand } from '../../services/ProcessFileCommand';
import type { FileParserService } from '../../services/FileParserService';
import type { ProcessedFile, FileData } from '../../types';
import { ErrorHandler } from '../../services/ErrorHandler';
import type { ILoggingService } from '../../services/LoggingService';

const createFile = (name: string): File =>
  new File(['dummy'], name, { type: 'text/plain' });

describe('ProcessFileCommand', () => {
  let parseMock: ReturnType<typeof vi.fn>;
  let readMock: ReturnType<typeof vi.fn>;
  let processed: ProcessedFile[];
  let setProcessed: Dispatch<SetStateAction<ProcessedFile[]>>;
  let command: ProcessFileCommand;
  let logService: ILoggingService;

  beforeEach(() => {
    parseMock = vi.fn(() => [{} as FileData]);
    readMock = vi.fn(async () => 'content');
    processed = [{ id: '1', filename: 'a.txt', status: 'processing' }];
    setProcessed = (update) => {
      processed = typeof update === 'function' ? update(processed) : update;
    };
    logService = {
      logInfo: vi.fn(),
      logError: vi.fn(),
      getLogs: vi.fn(() => []),
      clear: vi.fn(),
    };
    command = new ProcessFileCommand(
      createFile('a.txt'),
      '1',
      { parse: parseMock } as unknown as FileParserService,
      readMock,
      setProcessed,
      new ErrorHandler(),
      logService,
    );
  });

  it('marks file as success when parsing succeeds', async () => {
    await command.execute();
    expect(parseMock).toHaveBeenCalled();
    expect(processed[0]?.status).toBe('success');
    expect(processed[0]?.summaries?.length).toBe(1);
  });

  it('marks file as error when reading fails', async () => {
    readMock.mockRejectedValue(new Error('fail'));
    await command.execute();
    expect(processed[0]?.status).toBe('error');
    expect(processed[0]?.error).toMatch(/fail/);
  });
});
