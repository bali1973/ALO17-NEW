import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { NotificationProvider, useNotifications } from '../NotificationProvider';
import { useAuth } from '../Providers';
import '@testing-library/jest-dom';

// Mock useAuth hook
jest.mock('../Providers', () => ({
  useAuth: jest.fn(),
}));

// Mock notifications service
jest.mock('@/lib/notifications', () => ({
  initNotifications: jest.fn().mockResolvedValue('mock-token'),
  onMessageListener: jest.fn().mockResolvedValue({
    notification: {
      title: 'Test Notification',
      body: 'Test Message',
    },
    data: {
      type: 'TEST',
    },
  }),
}));

// Mock fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ success: true }),
  })
) as jest.Mock;

// Test component that uses notifications
const TestComponent = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  return (
    <div>
      <div data-testid="notification-count">{unreadCount}</div>
      <button onClick={() => markAsRead(notifications[0].id)}>Mark as Read</button>
      <button onClick={markAllAsRead}>Mark All as Read</button>
      {notifications.map((notification) => (
        <div key={notification.id}>
          <h3>{notification.title}</h3>
          <p>{notification.body}</p>
          <span>{notification.read ? 'Read' : 'Unread'}</span>
        </div>
      ))}
    </div>
  );
};

describe('NotificationProvider', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 'test-user' },
      isAuthenticated: true,
    });
    (global.fetch as jest.Mock).mockClear();
  });

  it('initializes notifications when user is logged in', async () => {
    await act(async () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('notification-count')).toHaveTextContent('1');
    });
  });

  it('marks notification as read', async () => {
    await act(async () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('notification-count')).toHaveTextContent('1');
    });

    await act(async () => {
      screen.getByText('Mark as Read').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('notification-count')).toHaveTextContent('0');
      expect(screen.getByText('Read')).toBeInTheDocument();
    });
  });

  it('marks all notifications as read', async () => {
    await act(async () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('notification-count')).toHaveTextContent('1');
    });

    await act(async () => {
      screen.getByText('Mark All as Read').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('notification-count')).toHaveTextContent('0');
      expect(screen.getByText('Read')).toBeInTheDocument();
    });
  });

  it('does not initialize notifications when user is not logged in', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
    });

    await act(async () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('notification-count')).toHaveTextContent('0');
    });
  });
}); 