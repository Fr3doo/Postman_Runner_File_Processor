import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {
  NotificationProvider,
  useNotifications,
} from '../../components/NotificationContext';

const Consumer: React.FC = () => {
  const { warnings, addWarning, clearWarnings } = useNotifications();
  return (
    <div>
      <button onClick={() => addWarning('warn')}>add</button>
      <button onClick={clearWarnings}>clear</button>
      <ul data-testid="warnings">
        {warnings.map((w, i) => (
          <li key={i}>{w}</li>
        ))}
      </ul>
    </div>
  );
};

describe('NotificationContext', () => {
  it('provides warnings and allows clearing', () => {
    render(
      <NotificationProvider>
        <Consumer />
      </NotificationProvider>,
    );

    expect(screen.getByTestId('warnings').children.length).toBe(0);
    fireEvent.click(screen.getByText('add'));
    expect(screen.getByText('warn')).toBeTruthy();
    fireEvent.click(screen.getByText('clear'));
    expect(screen.queryByText('warn')).toBeNull();
  });
});
