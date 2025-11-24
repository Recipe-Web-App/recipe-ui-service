import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  NotificationBell,
  type NotificationBellProps,
} from '@/components/notification';

expect.extend(toHaveNoViolations);

const renderNotificationBell = (props: Partial<NotificationBellProps> = {}) => {
  const defaultProps: NotificationBellProps = {
    unreadCount: 0,
    ...props,
  };

  return render(<NotificationBell {...defaultProps} />);
};

describe('NotificationBell', () => {
  describe('Basic Rendering', () => {
    test('renders bell icon', () => {
      renderNotificationBell();
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    test('renders as button element', () => {
      renderNotificationBell();
      const button = screen.getByRole('button');
      expect(button.tagName).toBe('BUTTON');
    });

    test('has correct default aria-label with zero unread', () => {
      renderNotificationBell({ unreadCount: 0 });
      const button = screen.getByRole('button');
      expect(button).toHaveAccessibleName('No unread notifications');
    });

    test('has correct aria-label with one unread', () => {
      renderNotificationBell({ unreadCount: 1 });
      const button = screen.getByRole('button');
      expect(button).toHaveAccessibleName('1 unread notification');
    });

    test('has correct aria-label with multiple unread', () => {
      renderNotificationBell({ unreadCount: 5 });
      const button = screen.getByRole('button');
      expect(button).toHaveAccessibleName('5 unread notifications');
    });
  });

  describe('Unread Count Badge', () => {
    test('does not show badge when unread count is 0', () => {
      renderNotificationBell({ unreadCount: 0 });
      const button = screen.getByRole('button');
      expect(button.querySelector('span')).toBeNull();
    });

    test('shows badge when unread count is greater than 0', () => {
      renderNotificationBell({ unreadCount: 5 });
      const badge = screen.getByText('5');
      expect(badge).toBeInTheDocument();
    });

    test('displays correct count for small numbers', () => {
      renderNotificationBell({ unreadCount: 3 });
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    test('displays 99+ for counts over max', () => {
      renderNotificationBell({ unreadCount: 150 });
      expect(screen.getByText('99+')).toBeInTheDocument();
    });

    test('respects custom maxBadgeCount', () => {
      renderNotificationBell({ unreadCount: 60, maxBadgeCount: 50 });
      expect(screen.getByText('50+')).toBeInTheDocument();
    });

    test('badge has aria-hidden attribute', () => {
      renderNotificationBell({ unreadCount: 5 });
      const badge = screen.getByText('5');
      expect(badge).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Sizes', () => {
    test('applies small size classes', () => {
      renderNotificationBell({ size: 'sm' });
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-8', 'w-8');
    });

    test('applies default size classes', () => {
      renderNotificationBell({ size: 'default' });
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-9', 'w-9');
    });

    test('applies large size classes', () => {
      renderNotificationBell({ size: 'lg' });
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10', 'w-10');
    });
  });

  describe('Variants', () => {
    test('applies default variant when no unread', () => {
      renderNotificationBell({ unreadCount: 0 });
      const button = screen.getByRole('button');
      expect(button).toHaveClass('text-muted-foreground');
    });

    test('applies has-unread variant when there are unread notifications', () => {
      renderNotificationBell({ unreadCount: 5 });
      const button = screen.getByRole('button');
      expect(button).toHaveClass('text-primary');
    });

    test('applies animate-pulse when unread and animateWhenUnread is true', () => {
      renderNotificationBell({ unreadCount: 5, animateWhenUnread: true });
      const button = screen.getByRole('button');
      expect(button).toHaveClass('animate-pulse');
    });

    test('does not animate when animateWhenUnread is false', () => {
      renderNotificationBell({ unreadCount: 5, animateWhenUnread: false });
      const button = screen.getByRole('button');
      expect(button).not.toHaveClass('animate-pulse');
    });
  });

  describe('Interactions', () => {
    test('calls onClick when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      renderNotificationBell({ onClick: handleClick });

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('can be disabled', () => {
      renderNotificationBell({ disabled: true });
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Custom Props', () => {
    test('applies custom className', () => {
      renderNotificationBell({ className: 'custom-class' });
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    test('applies custom badgeClassName', () => {
      renderNotificationBell({
        unreadCount: 5,
        badgeClassName: 'custom-badge',
      });
      const badge = screen.getByText('5');
      expect(badge).toHaveClass('custom-badge');
    });

    test('forwards ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<NotificationBell ref={ref} unreadCount={0} />);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('Accessibility', () => {
    test('has no accessibility violations with no unread', async () => {
      const { container } = renderNotificationBell({ unreadCount: 0 });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('has no accessibility violations with unread notifications', async () => {
      const { container } = renderNotificationBell({ unreadCount: 5 });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('is keyboard accessible', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      renderNotificationBell({ onClick: handleClick });

      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();

      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalled();
    });
  });
});
