import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {
  AvatarGroup,
  AvatarGroupOverflow,
  AvatarGroupItem,
  AvatarGroupWithContext,
} from '@/components/ui/avatar-group';
import type { AvatarGroupUser } from '@/types/ui/avatar-group';

// Mock users for testing
const mockUsers: AvatarGroupUser[] = [
  { id: '1', name: 'John Doe', avatar: 'https://example.com/john.jpg' },
  {
    id: '2',
    name: 'Jane Smith',
    avatar: 'https://example.com/jane.jpg',
    role: 'chef',
  },
  { id: '3', name: 'Bob Johnson', verified: true },
  { id: '4', name: 'Alice Brown', role: 'admin', status: 'online' },
  { id: '5', name: 'Charlie Wilson', status: 'away' },
];

describe('AvatarGroup', () => {
  describe('Basic Rendering', () => {
    it('renders with users', () => {
      render(<AvatarGroup users={mockUsers.slice(0, 3)} />);

      expect(screen.getByRole('group')).toBeInTheDocument();
      expect(screen.getByLabelText(/John Doe/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Jane Smith.*chef/)).toBeInTheDocument();
      expect(
        screen.getByLabelText(/Bob Johnson.*verified/)
      ).toBeInTheDocument();
    });

    it('renders empty state gracefully', () => {
      render(<AvatarGroup users={[]} />);

      const group = screen.getByRole('group');
      expect(group).toBeInTheDocument();
      expect(group).toHaveAttribute('aria-label', 'Group of 0 users');
    });

    it('applies custom className', () => {
      render(
        <AvatarGroup users={mockUsers.slice(0, 2)} className="custom-class" />
      );

      const group = screen.getByRole('group');
      expect(group).toHaveClass('custom-class');
    });

    it('applies custom aria-label', () => {
      render(
        <AvatarGroup users={mockUsers} aria-label="Recipe collaborators" />
      );

      const group = screen.getByRole('group');
      expect(group).toHaveAttribute('aria-label', 'Recipe collaborators');
    });
  });

  describe('Overflow Handling', () => {
    it('shows overflow indicator when users exceed max', () => {
      render(<AvatarGroup users={mockUsers} max={3} />);

      expect(screen.getByLabelText('2 more users')).toBeInTheDocument();
      expect(screen.getByText('+2')).toBeInTheDocument();
    });

    it('respects different max values', () => {
      const { rerender } = render(<AvatarGroup users={mockUsers} max={2} />);
      expect(screen.getByText('+3')).toBeInTheDocument();

      rerender(<AvatarGroup users={mockUsers} max={4} />);
      expect(screen.getByText('+1')).toBeInTheDocument();
    });

    it('does not show overflow when all users fit', () => {
      render(<AvatarGroup users={mockUsers.slice(0, 3)} max={5} />);

      expect(screen.queryByText(/^\+/)).not.toBeInTheDocument();
    });

    it('uses custom overflow render function', () => {
      const customRender = jest.fn((count: number) => (
        <div data-testid="custom-overflow">{count} hidden</div>
      ));

      render(
        <AvatarGroup users={mockUsers} max={2} renderOverflow={customRender} />
      );

      expect(customRender).toHaveBeenCalledWith(3);
      expect(screen.getByTestId('custom-overflow')).toHaveTextContent(
        '3 hidden'
      );
    });
  });

  describe('Size Variants', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

    sizes.forEach(size => {
      it(`renders with size ${size}`, () => {
        render(<AvatarGroup users={mockUsers.slice(0, 2)} size={size} />);

        const group = screen.getByRole('group');
        expect(group).toBeInTheDocument();
      });
    });
  });

  describe('Layout Variants', () => {
    it('renders with stacked layout (default)', () => {
      render(<AvatarGroup users={mockUsers.slice(0, 3)} layout="stacked" />);

      const group = screen.getByRole('group');
      expect(group).toHaveClass('-space-x-2');
    });

    it('renders with grid layout', () => {
      render(<AvatarGroup users={mockUsers.slice(0, 3)} layout="grid" />);

      const group = screen.getByRole('group');
      expect(group).toHaveClass('gap-2');
    });

    it('renders with inline layout', () => {
      render(<AvatarGroup users={mockUsers.slice(0, 3)} layout="inline" />);

      const group = screen.getByRole('group');
      expect(group).toHaveClass('gap-2');
    });
  });

  describe('Interactive Features', () => {
    it('handles user click events', async () => {
      const handleUserClick = jest.fn();
      const user = userEvent.setup();

      render(
        <AvatarGroup
          users={mockUsers.slice(0, 2)}
          onUserClick={handleUserClick}
        />
      );

      const firstAvatar = screen.getByLabelText(/John Doe/);
      await user.click(firstAvatar);

      expect(handleUserClick).toHaveBeenCalledWith(mockUsers[0]);
    });

    it('handles overflow click events', async () => {
      const handleOverflowClick = jest.fn();
      const user = userEvent.setup();

      render(
        <AvatarGroup
          users={mockUsers}
          max={2}
          onOverflowClick={handleOverflowClick}
        />
      );

      const overflow = screen.getByText('+3');
      await user.click(overflow);

      expect(handleOverflowClick).toHaveBeenCalled();
    });

    it('supports keyboard navigation for clickable avatars', async () => {
      const handleUserClick = jest.fn();
      const user = userEvent.setup();

      render(
        <AvatarGroup
          users={mockUsers.slice(0, 2)}
          onUserClick={handleUserClick}
        />
      );

      const firstAvatar = screen.getByLabelText(/John Doe/);
      firstAvatar.focus();
      await user.keyboard('{Enter}');

      expect(handleUserClick).toHaveBeenCalledWith(mockUsers[0]);

      handleUserClick.mockClear();
      await user.keyboard(' ');

      expect(handleUserClick).toHaveBeenCalledWith(mockUsers[0]);
    });

    it('supports keyboard navigation for overflow', async () => {
      const handleOverflowClick = jest.fn();
      const user = userEvent.setup();

      render(
        <AvatarGroup
          users={mockUsers}
          max={2}
          onOverflowClick={handleOverflowClick}
        />
      );

      const overflow = screen.getByText('+3');
      overflow.focus();
      await user.keyboard('{Enter}');

      expect(handleOverflowClick).toHaveBeenCalled();
    });
  });

  describe('Tooltips', () => {
    it('shows tooltips on hover when enabled', async () => {
      render(<AvatarGroup users={mockUsers.slice(0, 2)} showTooltip />);

      const firstAvatar = screen.getByLabelText(/John Doe/);
      fireEvent.mouseEnter(firstAvatar);

      await waitFor(() => {
        const tooltips = screen.getAllByRole('tooltip');
        const visibleTooltip = tooltips.find(t =>
          t.textContent?.includes('John Doe')
        );
        expect(visibleTooltip).toBeInTheDocument();
      });

      fireEvent.mouseLeave(firstAvatar);

      await waitFor(() => {
        const tooltips = screen.getAllByRole('tooltip');
        tooltips.forEach(tooltip => {
          expect(tooltip).toHaveClass('opacity-0');
        });
      });
    });

    it('shows role in tooltip when available', async () => {
      render(<AvatarGroup users={[mockUsers[1]]} showTooltip />);

      const avatar = screen.getByLabelText(/Jane Smith/);
      fireEvent.mouseEnter(avatar);

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveTextContent('Jane Smith(chef)');
      });
    });
  });

  describe('Status Indicators', () => {
    it('shows status indicators when enabled', () => {
      render(<AvatarGroup users={[mockUsers[3], mockUsers[4]]} showStatus />);

      expect(screen.getByLabelText('Status: online')).toBeInTheDocument();
      expect(screen.getByLabelText('Status: away')).toBeInTheDocument();
    });

    it('does not show status indicators by default', () => {
      render(<AvatarGroup users={[mockUsers[3]]} />);

      expect(screen.queryByLabelText('Status: online')).not.toBeInTheDocument();
    });
  });

  describe('Animation', () => {
    it('applies animation classes when enabled', () => {
      render(<AvatarGroup users={mockUsers.slice(0, 2)} animated />);

      const group = screen.getByRole('group');
      expect(group).toHaveClass('group');
    });
  });
});

describe('AvatarGroupOverflow', () => {
  it('renders count correctly', () => {
    render(<AvatarGroupOverflow count={5} />);

    expect(screen.getByText('+5')).toBeInTheDocument();
    expect(screen.getByLabelText('5 more users')).toBeInTheDocument();
  });

  it('handles singular/plural correctly', () => {
    const { rerender } = render(<AvatarGroupOverflow count={1} />);
    expect(screen.getByLabelText('1 more user')).toBeInTheDocument();

    rerender(<AvatarGroupOverflow count={2} />);
    expect(screen.getByLabelText('2 more users')).toBeInTheDocument();
  });

  it('applies size variants', () => {
    const { container } = render(<AvatarGroupOverflow count={3} size="lg" />);

    const overflow = container.firstChild;
    expect(overflow).toHaveClass('h-12', 'w-12');
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(<AvatarGroupOverflow count={3} onClick={handleClick} />);

    const overflow = screen.getByText('+3');
    await user.click(overflow);

    expect(handleClick).toHaveBeenCalled();
  });
});

describe('AvatarGroupItem', () => {
  const mockUser: AvatarGroupUser = {
    id: '1',
    name: 'Test User',
    avatar: 'https://example.com/avatar.jpg',
    role: 'chef',
    status: 'online',
    verified: true,
  };

  it('renders user information correctly', () => {
    render(<AvatarGroupItem user={mockUser} />);

    expect(
      screen.getByLabelText(/Test User.*chef.*verified/)
    ).toBeInTheDocument();
  });

  it('renders without avatar', () => {
    const userWithoutAvatar = { ...mockUser, avatar: undefined };
    render(<AvatarGroupItem user={userWithoutAvatar} />);

    // Just verify the component renders with the correct aria label
    expect(
      screen.getByLabelText(/Test User.*chef.*verified/)
    ).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(<AvatarGroupItem user={mockUser} onClick={handleClick} />);

    const avatar = screen.getByLabelText(/Test User/);
    await user.click(avatar);

    expect(handleClick).toHaveBeenCalledWith(mockUser);
  });

  it('shows status indicator when provided', () => {
    render(<AvatarGroupItem user={mockUser} showStatus />);

    expect(screen.getByLabelText('Status: online')).toBeInTheDocument();
  });
});

describe('AvatarGroupWithContext', () => {
  const contextUsers: AvatarGroupUser[] = [
    { id: '1', name: 'User One' },
    { id: '2', name: 'User Two' },
  ];

  it('renders with recipe context', () => {
    render(
      <AvatarGroupWithContext
        users={contextUsers}
        context={{
          type: 'recipe',
          title: 'Test Recipe',
          isPublic: false,
        }}
      />
    );

    expect(
      screen.getByText('Collaborators on Test Recipe:')
    ).toBeInTheDocument();
  });

  it('renders with meal plan context', () => {
    render(
      <AvatarGroupWithContext
        users={contextUsers}
        context={{
          type: 'meal-plan',
          title: 'Weekly Plan',
          isPublic: true,
        }}
      />
    );

    expect(
      screen.getByText('Collaborators on Weekly Plan:')
    ).toBeInTheDocument();
  });

  it('renders with generic context when no title', () => {
    render(
      <AvatarGroupWithContext
        users={contextUsers}
        context={{
          type: 'collection',
          isPublic: true,
        }}
      />
    );

    expect(screen.getByText('Shared collection (public):')).toBeInTheDocument();
  });

  it('renders without context label when no context provided', () => {
    render(<AvatarGroupWithContext users={contextUsers} />);

    expect(screen.queryByText(/Collaborators/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Shared/)).not.toBeInTheDocument();
  });
});

describe('Accessibility', () => {
  it('provides proper ARIA attributes', () => {
    render(<AvatarGroup users={mockUsers.slice(0, 3)} />);

    const group = screen.getByRole('group');
    expect(group).toHaveAttribute('aria-label');
  });

  it('marks clickable elements as buttons', () => {
    render(
      <AvatarGroup users={mockUsers.slice(0, 2)} onUserClick={jest.fn()} />
    );

    const avatars = screen.getAllByRole('button');
    expect(avatars).toHaveLength(2);
  });

  it('provides proper tab indices for keyboard navigation', () => {
    render(
      <AvatarGroup users={mockUsers.slice(0, 2)} onUserClick={jest.fn()} />
    );

    const avatars = screen.getAllByRole('button');
    avatars.forEach(avatar => {
      expect(avatar).toHaveAttribute('tabIndex', '0');
    });
  });
});
