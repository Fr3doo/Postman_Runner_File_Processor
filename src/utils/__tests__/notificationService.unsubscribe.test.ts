import { describe, it, expect, beforeEach, vi } from 'vitest';
import { notificationService } from '../../services/NotificationService';

describe('notificationService unsubscribe', () => {
  beforeEach(() => {
    notificationService.clearWarnings();
  });

  it('stops notifying after unsubscribe', () => {
    const listener = vi.fn();
    const unsubscribe = notificationService.subscribe(listener);
    expect(listener).toHaveBeenCalledWith([]);
    listener.mockClear();
    notificationService.addWarning('first');
    expect(listener).toHaveBeenCalledWith(['first']);
    listener.mockClear();
    unsubscribe();
    notificationService.addWarning('second');
    expect(listener).not.toHaveBeenCalled();
  });
});
