import React, { createContext, useContext, useEffect, useState } from 'react';
import { notificationService } from '../services/NotificationService';

/* eslint-disable react-refresh/only-export-components */

interface NotificationContextValue {
  warnings: string[];
  addWarning: (warning: string) => void;
  clearWarnings: () => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [warnings, setWarnings] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = notificationService.subscribe(setWarnings);
    return () => unsubscribe();
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        warnings,
        addWarning: notificationService.addWarning.bind(notificationService),
        clearWarnings: notificationService.clearWarnings.bind(notificationService),
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextValue => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
