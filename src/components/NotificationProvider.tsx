import React, { createContext, useContext, useEffect, useState } from 'react';
import { initNotifications, onMessageListener } from '@/lib/notifications';
import { useAuth } from './Providers';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  data: any;
  read: boolean;
  createdAt: Date;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
  markAllAsRead: () => {},
});

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const setupNotifications = async () => {
      try {
        const token = await initNotifications();
        if (token) {
          // Token'ı backend'e kaydet
          await fetch('/api/users/update-fcm-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, token }),
          });
        }
      } catch (error) {
        console.error('Error initializing notifications:', error);
      }
    };

    setupNotifications();

    const unsubscribe = onMessageListener().then((payload: any) => {
      if (payload) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          title: payload.notification.title,
          body: payload.notification.body,
          type: payload.data.type,
          data: payload.data,
          read: false,
          createdAt: new Date(),
        };

        setNotifications((prev) => [newNotification, ...prev]);
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [user, isAuthenticated]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}; 