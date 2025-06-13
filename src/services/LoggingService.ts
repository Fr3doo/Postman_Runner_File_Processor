export type LogLevel = 'info' | 'error';
export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
}

export interface ILoggingService {
  logInfo(message: string): void;
  logError(message: string): void;
  getLogs(): LogEntry[];
  clear(): void;
}

class LoggingService implements ILoggingService {
  private logs: LogEntry[] = [];
  private readonly storageKey = 'logs';

  logInfo(message: string): void {
    this.addLog('info', message);
  }

  logError(message: string): void {
    this.addLog('error', message);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clear(): void {
    this.logs = [];
  }

  load(): void {
    if (typeof localStorage === 'undefined') return;
    const data = localStorage.getItem(this.storageKey);
    if (!data) return;
    try {
      const parsed: LogEntry[] = JSON.parse(data);
      this.logs = parsed.map((l) => ({
        ...l,
        timestamp: new Date(l.timestamp),
      }));
    } catch {
      this.logs = [];
    }
  }

  save(): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(this.storageKey, JSON.stringify(this.logs));
  }

  exportLogs(): string {
    const data = JSON.stringify(this.logs, null, 2);
    if (
      typeof document !== 'undefined' &&
      typeof URL !== 'undefined' &&
      typeof URL.createObjectURL === 'function'
    ) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'logs.json';
      link.click();
      URL.revokeObjectURL(url);
    }
    return data;
  }

  private addLog(level: LogLevel, message: string): void {
    this.logs.push({ level, message, timestamp: new Date() });
  }
}

export const loggingService = new LoggingService();
