import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Dispatch, SetStateAction } from 'react';
import { ProcessFileCommand } from '../ProcessFileCommand';
import type { FileParserService } from '../FileParserService';
import { ErrorHandler } from '../ErrorHandler';
import type { ILoggingService } from '../LoggingService';
import type { IFileHistoryService } from '../FileHistoryService';
import type { ProcessedFile, FileData } from '../../types';

const createFile = (name: string): File => new File(['dummy'], name, { type: 'text/plain' });

describe('ProcessFileCommand with history', () => {
  let parseMock: ReturnType<typeof vi.fn>;
  let readMock: ReturnType<typeof vi.fn>;
  let processed: ProcessedFile[];
  let setProcessed: Dispatch<SetStateAction<ProcessedFile[]>>;
  let command: ProcessFileCommand;
  let logService: ILoggingService;
  let historyService: IFileHistoryService;

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
    historyService = {
      addFile: vi.fn(),
      getHistory: vi.fn(() => []),
      removeFile: vi.fn(),
      clearHistory: vi.fn(),
      load: vi.fn(),
      save: vi.fn(),
    };
    command = new ProcessFileCommand(
      createFile('a.txt'),
      '1',
      { parse: parseMock } as unknown as FileParserService,
      readMock,
      setProcessed,
      new ErrorHandler(),
      logService,
      historyService,
    );
  });

  it('adds successful file to history', async () => {
    await command.execute();
    expect(historyService.addFile).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'success', filename: 'a.txt' }),
    );
    expect(historyService.save).toHaveBeenCalled();
    expect(processed[0]?.status).toBe('success');
  });

  it('adds error file to history', async () => {
    readMock.mockRejectedValue(new Error('fail'));
    await command.execute();
    expect(historyService.addFile).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'error', error: expect.stringContaining('fail') }),
    );
    expect(historyService.save).toHaveBeenCalled();
    expect(processed[0]?.status).toBe('error');
  });
});
