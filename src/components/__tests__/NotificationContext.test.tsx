import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NotificationProvider, useNotifications } from '../NotificationContext';
import type { WarningListener, INotificationService } from '../../services/NotificationService';

const createMockService = (): INotificationService & { getListenerCount(): number } => {
  let warnings: string[] = [];
  let listeners: WarningListener[] = [];
  return {
    addWarning(w: string) {
      warnings.push(w);
      listeners.forEach((l) => l([...warnings]));
    },
    clearWarnings() {
      warnings = [];
      listeners.forEach((l) => l([...warnings]));
    },
    getWarnings() {
      return [...warnings];
    },
    subscribe(listener: WarningListener) {
      listeners.push(listener);
      listener([...warnings]);
      return () => {
        listeners = listeners.filter((l) => l !== listener);
      };
    },
    getListenerCount() {
      return listeners.length;
    },
  };
};

describe('NotificationProvider', () => {
  it('updates warnings when service emits changes and cleans subscription on unmount', () => {
    const service = createMockService();
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <NotificationProvider service={service}>{children}</NotificationProvider>
    );

    const { result, unmount } = renderHook(() => useNotifications(), { wrapper });

    expect(result.current.warnings).toEqual([]);

    act(() => {
      service.addWarning('first');
    });
    expect(result.current.warnings).toEqual(['first']);

    act(() => {
      service.addWarning('second');
    });
    expect(result.current.warnings).toEqual(['first', 'second']);

    expect(service.getListenerCount()).toBe(1);
    unmount();
    expect(service.getListenerCount()).toBe(0);

    act(() => {
      service.addWarning('third');
    });
    expect(result.current.warnings).toEqual(['first', 'second']);
  });
});
