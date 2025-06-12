import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  notificationService,
  type INotificationService,
} from '../services/NotificationService';

/* eslint-disable react-refresh/only-export-components */

interface NotificationContextValue {
  warnings: string[];
  addWarning: (warning: string) => void;
  clearWarnings: () => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined,
);

export const NotificationProvider: React.FC<{
  children: React.ReactNode;
  service?: INotificationService;
}> = ({ children, service = notificationService }) => {
  const [warnings, setWarnings] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = service.subscribe(setWarnings);
    return () => unsubscribe();
  }, [service]);

  return (
    <NotificationContext.Provider
      value={{
        warnings,
        addWarning: service.addWarning.bind(service),
        clearWarnings: service.clearWarnings.bind(service),
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextValue => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider',
    );
  }
  return context;
};
