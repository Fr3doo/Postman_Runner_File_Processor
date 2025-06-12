import { describe, it, expect, beforeEach, vi } from 'vitest';
import { notificationService } from '../../services/NotificationService';

describe('notificationService', () => {
  beforeEach(() => {
    notificationService.clearWarnings();
  });

  it('stores warnings', () => {
    notificationService.addWarning('hello');
    expect(notificationService.getWarnings()).toEqual(['hello']);
  });

  it('clears warnings', () => {
    notificationService.addWarning('a');
    notificationService.clearWarnings();
    expect(notificationService.getWarnings()).toEqual([]);
  });

  it('notifies subscribers', () => {
    const listener = vi.fn();
    const unsubscribe = notificationService.subscribe(listener);
    notificationService.addWarning('x');
    expect(listener).toHaveBeenCalledWith(['x']);
    unsubscribe();
  });
});
