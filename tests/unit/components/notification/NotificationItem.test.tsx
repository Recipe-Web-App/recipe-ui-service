import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  NotificationItem,
  type NotificationItemProps,
} from '@/components/notification';
import type { Notification } from '@/types/user-management/notifications';

expect.extend(toHaveNoViolations);

const mockNotification: Notification = {
  notificationId: '1',
  userId: 'user-1',
  title: 'Test Notification',
  message: 'This is a test notification message',
  notificationType: 'follow',
  isRead: false,
  isDeleted: false,
  createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
  updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
};

const renderNotificationItem = (props: Partial<NotificationItemProps> = {}) => {
  const defaultProps: NotificationItemProps = {
    notification: mockNotification,
    ...props,
  };

  return render(<NotificationItem {...defaultProps} />);
};

describe('NotificationItem', () => {
  describe('Basic Rendering', () => {
    test('renders notification title', () => {
      renderNotificationItem();
      expect(screen.getByText('Test Notification')).toBeInTheDocument();
    });

    test('renders notification message', () => {
      renderNotificationItem();
      expect(
        screen.getByText('This is a test notification message')
      ).toBeInTheDocument();
    });

    test('renders relative timestamp', () => {
      renderNotificationItem();
      expect(screen.getByText(/ago$/)).toBeInTheDocument();
    });

    test('has role button', () => {
      renderNotificationItem();
      const item = screen.getByRole('button');
      expect(item).toBeInTheDocument();
    });

    test('has proper aria-label', () => {
      renderNotificationItem();
      const item = screen.getByRole('button');
      expect(item).toHaveAccessibleName(/Test Notification.*Unread/);
    });
  });

  describe('Unread/Read States', () => {
    test('shows unread indicator for unread notifications', () => {
      renderNotificationItem({
        notification: { ...mockNotification, isRead: false },
      });
      const item = screen.getByRole('button');
      const indicator = item.querySelector('[aria-hidden="true"]');
      expect(indicator).toBeInTheDocument();
    });

    test('does not show unread indicator for read notifications', () => {
      renderNotificationItem({
        notification: { ...mockNotification, isRead: true },
      });
      const item = screen.getByRole('button');
      expect(item.querySelector('[aria-hidden="true"]')).toBeNull();
    });

    test('applies bold font to unread title', () => {
      renderNotificationItem({
        notification: { ...mockNotification, isRead: false },
      });
      const title = screen.getByText('Test Notification');
      expect(title).toHaveClass('font-semibold');
    });

    test('applies normal font to read title', () => {
      renderNotificationItem({
        notification: { ...mockNotification, isRead: true },
      });
      const title = screen.getByText('Test Notification');
      expect(title).toHaveClass('font-normal');
    });
  });

  describe('Notification Types', () => {
    test('applies social type styling (blue border)', () => {
      renderNotificationItem({
        notification: { ...mockNotification, notificationType: 'follow' },
      });
      const item = screen.getByRole('button');
      expect(item).toHaveClass('border-l-blue-500');
    });

    test('applies activity type styling (green border)', () => {
      renderNotificationItem({
        notification: { ...mockNotification, notificationType: 'like' },
      });
      const item = screen.getByRole('button');
      expect(item).toHaveClass('border-l-green-500');
    });

    test('applies system type styling (orange border)', () => {
      renderNotificationItem({
        notification: { ...mockNotification, notificationType: 'update' },
      });
      const item = screen.getByRole('button');
      expect(item).toHaveClass('border-l-orange-500');
    });
  });

  describe('Action Buttons', () => {
    test('shows mark as read button for unread notifications', () => {
      renderNotificationItem({
        notification: { ...mockNotification, isRead: false },
        onMarkAsRead: jest.fn(),
      });
      expect(screen.getByLabelText('Mark as read')).toBeInTheDocument();
    });

    test('does not show mark as read button for read notifications', () => {
      renderNotificationItem({
        notification: { ...mockNotification, isRead: true },
        onMarkAsRead: jest.fn(),
      });
      expect(screen.queryByLabelText('Mark as read')).not.toBeInTheDocument();
    });

    test('shows delete button when onDelete is provided', () => {
      renderNotificationItem({ onDelete: jest.fn() });
      expect(screen.getByLabelText('Delete notification')).toBeInTheDocument();
    });

    test('calls onMarkAsRead when mark as read is clicked', async () => {
      const user = userEvent.setup();
      const handleMarkAsRead = jest.fn();
      renderNotificationItem({
        notification: { ...mockNotification, isRead: false },
        onMarkAsRead: handleMarkAsRead,
      });

      const button = screen.getByLabelText('Mark as read');
      await user.click(button);

      expect(handleMarkAsRead).toHaveBeenCalledWith('1');
    });

    test('calls onDelete when delete is clicked', async () => {
      const user = userEvent.setup();
      const handleDelete = jest.fn();
      renderNotificationItem({ onDelete: handleDelete });

      const button = screen.getByLabelText('Delete notification');
      await user.click(button);

      expect(handleDelete).toHaveBeenCalledWith('1');
    });

    test('stops propagation on action button clicks', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      const handleMarkAsRead = jest.fn();
      renderNotificationItem({
        notification: { ...mockNotification, isRead: false },
        onClick: handleClick,
        onMarkAsRead: handleMarkAsRead,
      });

      const markReadButton = screen.getByLabelText('Mark as read');
      await user.click(markReadButton);

      expect(handleMarkAsRead).toHaveBeenCalled();
      expect(handleClick).not.toHaveBeenCalled();
    });

    test('hides action buttons when showActions is false', () => {
      renderNotificationItem({
        notification: { ...mockNotification, isRead: false },
        onMarkAsRead: jest.fn(),
        onDelete: jest.fn(),
        showActions: false,
      });

      expect(screen.queryByLabelText('Mark as read')).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText('Delete notification')
      ).not.toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    test('calls onClick when notification is clicked', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      renderNotificationItem({ onClick: handleClick });

      const item = screen.getByRole('button');
      await user.click(item);

      expect(handleClick).toHaveBeenCalledWith(mockNotification);
    });

    test('calls onMarkAsRead when clicked and notification is unread', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      const handleMarkAsRead = jest.fn();
      renderNotificationItem({
        notification: { ...mockNotification, isRead: false },
        onClick: handleClick,
        onMarkAsRead: handleMarkAsRead,
      });

      // Get the main notification item button (first button in the list)
      const item = screen.getAllByRole('button')[0];
      await user.click(item);

      expect(handleMarkAsRead).toHaveBeenCalledWith('1');
    });

    test('does not call onMarkAsRead when clicked and notification is read', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      const handleMarkAsRead = jest.fn();
      renderNotificationItem({
        notification: { ...mockNotification, isRead: true },
        onClick: handleClick,
        onMarkAsRead: handleMarkAsRead,
      });

      // Get the main notification item button (first button in the list)
      const item = screen.getAllByRole('button')[0];
      await user.click(item);

      expect(handleMarkAsRead).not.toHaveBeenCalled();
    });

    test('supports keyboard interaction (Enter)', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      renderNotificationItem({ onClick: handleClick });

      const item = screen.getByRole('button');
      item.focus();
      await user.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalledWith(mockNotification);
    });

    test('supports keyboard interaction (Space)', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      renderNotificationItem({ onClick: handleClick });

      const item = screen.getByRole('button');
      item.focus();
      await user.keyboard(' ');

      expect(handleClick).toHaveBeenCalledWith(mockNotification);
    });
  });

  describe('Accessibility', () => {
    test('has no accessibility violations', async () => {
      const { container } = renderNotificationItem();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('has proper time element with datetime attribute', () => {
      renderNotificationItem();
      const time = screen.getByText(/ago$/);
      expect(time.tagName).toBe('TIME');
      expect(time).toHaveAttribute('datetime');
    });

    test('is keyboard navigable', async () => {
      const handleClick = jest.fn();
      renderNotificationItem({ onClick: handleClick });

      const item = screen.getByRole('button');
      item.focus();
      expect(item).toHaveFocus();
      expect(item).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Custom Props', () => {
    test('applies custom className', () => {
      renderNotificationItem({ className: 'custom-class' });
      const item = screen.getByRole('button');
      expect(item).toHaveClass('custom-class');
    });

    test('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<NotificationItem ref={ref} notification={mockNotification} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
