export type LogLevel = 'info' | 'error';
export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
}

class LoggingService {
  private logs: LogEntry[] = [];

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

  private addLog(level: LogLevel, message: string): void {
    this.logs.push({ level, message, timestamp: new Date() });
  }
}

export const loggingService = new LoggingService();
