export type WarningListener = (warnings: string[]) => void;

export interface INotificationService {
  addWarning(warning: string): void;
  clearWarnings(): void;
  getWarnings(): string[];
  subscribe(listener: WarningListener): () => void;
}

class NotificationService implements INotificationService {
  private warnings: string[] = [];
  private listeners: WarningListener[] = [];

  addWarning(warning: string): void {
    this.warnings.push(warning);
    this.notify();
  }

  clearWarnings(): void {
    this.warnings = [];
    this.notify();
  }

  getWarnings(): string[] {
    return [...this.warnings];
  }

  subscribe(listener: WarningListener): () => void {
    this.listeners.push(listener);
    listener(this.getWarnings());
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    const warningsCopy = this.getWarnings();
    this.listeners.forEach(listener => listener(warningsCopy));
  }
}

export const notificationService: INotificationService = new NotificationService();
