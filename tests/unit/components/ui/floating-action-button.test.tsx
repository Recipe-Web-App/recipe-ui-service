import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {
  FloatingActionButton,
  SpeedDial,
  FABGroup,
} from '@/components/ui/floating-action-button';
import type { SpeedDialAction } from '@/types/ui/floating-action-button';

// Mock createPortal for testing
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node: React.ReactNode) => node,
}));

describe('FloatingActionButton', () => {
  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(
        <FloatingActionButton icon={<span>+</span>} ariaLabel="Add item" />
      );
      const button = screen.getByRole('button', { name: 'Add item' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('bg-primary');
      expect(button).toHaveClass('h-14', 'w-14'); // medium size
    });

    it('renders with custom className', () => {
      render(
        <FloatingActionButton
          icon={<span>+</span>}
          className="custom-class"
          ariaLabel="Add"
        />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('renders icon content', () => {
      render(
        <FloatingActionButton
          icon={<span data-testid="icon">+</span>}
          ariaLabel="Add"
        />
      );
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('renders children when provided', () => {
      render(
        <FloatingActionButton ariaLabel="Custom">
          <span data-testid="child">Custom Content</span>
        </FloatingActionButton>
      );
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('renders primary variant', () => {
      render(
        <FloatingActionButton
          icon={<span>+</span>}
          variant="primary"
          ariaLabel="Primary"
        />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-primary');
    });

    it('renders secondary variant', () => {
      render(
        <FloatingActionButton
          icon={<span>+</span>}
          variant="secondary"
          ariaLabel="Secondary"
        />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-secondary');
    });

    it('renders destructive variant', () => {
      render(
        <FloatingActionButton
          icon={<span>×</span>}
          variant="destructive"
          ariaLabel="Delete"
        />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-destructive');
    });

    it('renders success variant', () => {
      render(
        <FloatingActionButton
          icon={<span>✓</span>}
          variant="success"
          ariaLabel="Success"
        />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-green-600');
    });

    it('renders outline variant', () => {
      render(
        <FloatingActionButton
          icon={<span>+</span>}
          variant="outline"
          ariaLabel="Outline"
        />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border-2');
    });

    it('renders surface variant', () => {
      render(
        <FloatingActionButton
          icon={<span>+</span>}
          variant="surface"
          ariaLabel="Surface"
        />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-surface');
    });
  });

  describe('Sizes', () => {
    it('renders small size', () => {
      render(
        <FloatingActionButton
          icon={<span>+</span>}
          size="sm"
          ariaLabel="Small"
        />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10', 'w-10');
    });

    it('renders medium size', () => {
      render(
        <FloatingActionButton
          icon={<span>+</span>}
          size="md"
          ariaLabel="Medium"
        />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-14', 'w-14');
    });

    it('renders large size', () => {
      render(
        <FloatingActionButton
          icon={<span>+</span>}
          size="lg"
          ariaLabel="Large"
        />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-16', 'w-16');
    });
  });

  describe('Extended FAB', () => {
    it('renders extended FAB with label', () => {
      render(
        <FloatingActionButton
          icon={<span>+</span>}
          label="Add Recipe"
          extended
          ariaLabel="Add Recipe"
        />
      );
      expect(screen.getByText('Add Recipe')).toBeInTheDocument();
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-4', 'gap-2');
    });

    it('does not show label when extended is false', () => {
      render(
        <FloatingActionButton
          icon={<span>+</span>}
          label="Add Recipe"
          extended={false}
          ariaLabel="Add Recipe"
        />
      );
      expect(screen.queryByText('Add Recipe')).not.toBeInTheDocument();
    });

    it('does not extend without label', () => {
      render(
        <FloatingActionButton icon={<span>+</span>} extended ariaLabel="Add" />
      );
      const button = screen.getByRole('button');
      expect(button).not.toHaveClass('px-4');
    });
  });

  describe('Positioning', () => {
    it('renders at bottom-right by default', () => {
      render(
        <FloatingActionButton icon={<span>+</span>} ariaLabel="Default" />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bottom-0', 'right-0');
    });

    it('renders at bottom-left', () => {
      render(
        <FloatingActionButton
          icon={<span>+</span>}
          position="bottom-left"
          ariaLabel="Bottom Left"
        />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bottom-0', 'left-0');
    });

    it('renders at top-right', () => {
      render(
        <FloatingActionButton
          icon={<span>+</span>}
          position="top-right"
          ariaLabel="Top Right"
        />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('top-0', 'right-0');
    });

    it('renders at top-left', () => {
      render(
        <FloatingActionButton
          icon={<span>+</span>}
          position="top-left"
          ariaLabel="Top Left"
        />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('top-0', 'left-0');
    });

    it('applies custom offset', () => {
      render(
        <FloatingActionButton
          icon={<span>+</span>}
          offset={24}
          ariaLabel="Custom Offset"
        />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({ bottom: '24px', right: '24px' });
    });

    it('applies custom z-index', () => {
      render(
        <FloatingActionButton
          icon={<span>+</span>}
          zIndex={100}
          ariaLabel="Custom Z-Index"
        />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({ zIndex: 100 });
    });
  });

  describe('States', () => {
    it('handles disabled state', () => {
      render(
        <FloatingActionButton
          icon={<span>+</span>}
          disabled
          ariaLabel="Disabled"
        />
      );
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('handles loading state', () => {
      render(
        <FloatingActionButton
          icon={<span>+</span>}
          loading
          ariaLabel="Loading"
        />
      );
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button.querySelector('svg.animate-spin')).toBeInTheDocument();
    });

    it('shows loading spinner with correct size', () => {
      const { rerender } = render(
        <FloatingActionButton
          icon={<span>+</span>}
          loading
          size="sm"
          ariaLabel="Loading"
        />
      );
      let spinner = screen
        .getByRole('button')
        .querySelector('svg.animate-spin');
      expect(spinner).toHaveClass('h-4', 'w-4');

      rerender(
        <FloatingActionButton
          icon={<span>+</span>}
          loading
          size="lg"
          ariaLabel="Loading"
        />
      );
      spinner = screen.getByRole('button').querySelector('svg.animate-spin');
      expect(spinner).toHaveClass('h-6', 'w-6');
    });
  });

  describe('Interactions', () => {
    it('handles click events', () => {
      const handleClick = jest.fn();
      render(
        <FloatingActionButton
          icon={<span>+</span>}
          onClick={handleClick}
          ariaLabel="Clickable"
        />
      );
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not trigger click when disabled', () => {
      const handleClick = jest.fn();
      render(
        <FloatingActionButton
          icon={<span>+</span>}
          onClick={handleClick}
          disabled
          ariaLabel="Disabled"
        />
      );
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not trigger click when loading', () => {
      const handleClick = jest.fn();
      render(
        <FloatingActionButton
          icon={<span>+</span>}
          onClick={handleClick}
          loading
          ariaLabel="Loading"
        />
      );
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('handles keyboard events', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      render(
        <FloatingActionButton
          icon={<span>+</span>}
          onClick={handleClick}
          ariaLabel="Keyboard"
        />
      );
      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('has correct aria-label', () => {
      render(
        <FloatingActionButton icon={<span>+</span>} ariaLabel="Add new item" />
      );
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Add new item'
      );
    });

    it('uses label as aria-label when ariaLabel not provided', () => {
      render(
        <FloatingActionButton
          icon={<span>+</span>}
          label="Add Recipe"
          extended
        />
      );
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Add Recipe'
      );
    });

    it('uses tooltipLabel as aria-label when others not provided', () => {
      render(
        <FloatingActionButton
          icon={<span>+</span>}
          tooltipLabel="Add something"
        />
      );
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Add something'
      );
    });

    it('shows tooltip title', () => {
      render(
        <FloatingActionButton
          icon={<span>+</span>}
          tooltipLabel="Quick add"
          ariaLabel="Add"
        />
      );
      expect(screen.getByRole('button')).toHaveAttribute('title', 'Quick add');
    });
  });

  describe('Portal Rendering', () => {
    it('renders without portal when usePortal is false', () => {
      const { container } = render(
        <div data-testid="parent">
          <FloatingActionButton
            icon={<span>+</span>}
            usePortal={false}
            ariaLabel="No Portal"
          />
        </div>
      );
      const parent = container.querySelector('[data-testid="parent"]');
      const button = screen.getByRole('button');
      expect(parent).toContainElement(button);
    });

    it('applies custom styles', () => {
      render(
        <FloatingActionButton
          icon={<span>+</span>}
          style={{ marginTop: '10px' }}
          ariaLabel="Styled"
        />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('style');
    });
  });
});

describe('SpeedDial', () => {
  const mockActions: SpeedDialAction[] = [
    { id: '1', icon: <span>📝</span>, label: 'Edit', onClick: jest.fn() },
    { id: '2', icon: <span>📋</span>, label: 'Copy', onClick: jest.fn() },
    { id: '3', icon: <span>🗑️</span>, label: 'Delete', onClick: jest.fn() },
  ];

  beforeEach(() => {
    mockActions.forEach(action => jest.clearAllMocks());
  });

  describe('Basic Rendering', () => {
    it('renders closed by default', () => {
      render(<SpeedDial actions={mockActions} ariaLabel="Actions" />);
      const button = screen.getByRole('button', { name: 'Actions' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('renders with custom icon', () => {
      render(
        <SpeedDial
          actions={mockActions}
          icon={<span data-testid="custom-icon">⚙️</span>}
          ariaLabel="Settings"
        />
      );
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('renders default plus icon when no icon provided', () => {
      render(<SpeedDial actions={mockActions} ariaLabel="Actions" />);
      const button = screen.getByRole('button');
      expect(button.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('Open/Close Behavior', () => {
    it('toggles open state on click', () => {
      render(<SpeedDial actions={mockActions} ariaLabel="Actions" />);
      const button = screen.getByRole('button', { name: 'Actions' });

      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('menu')).toBeInTheDocument();

      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('renders actions when open', () => {
      render(<SpeedDial actions={mockActions} ariaLabel="Actions" />);
      fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

      expect(
        screen.getByRole('menuitem', { name: 'Edit' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('menuitem', { name: 'Copy' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('menuitem', { name: 'Delete' })
      ).toBeInTheDocument();
    });

    it('handles controlled open state', () => {
      const onOpenChange = jest.fn();
      const { rerender } = render(
        <SpeedDial
          actions={mockActions}
          open={false}
          onOpenChange={onOpenChange}
          ariaLabel="Controlled"
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(button);
      expect(onOpenChange).toHaveBeenCalledWith(true);

      rerender(
        <SpeedDial
          actions={mockActions}
          open={true}
          onOpenChange={onOpenChange}
          ariaLabel="Controlled"
        />
      );

      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('rotates icon when open', () => {
      render(<SpeedDial actions={mockActions} ariaLabel="Actions" />);
      const button = screen.getByRole('button');

      expect(button).not.toHaveClass('rotate-45');

      fireEvent.click(button);
      expect(button).toHaveClass('rotate-45');
    });
  });

  describe('Action Interactions', () => {
    it('calls action onClick handler', () => {
      render(<SpeedDial actions={mockActions} ariaLabel="Actions" />);
      fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

      fireEvent.click(screen.getByRole('menuitem', { name: 'Edit' }));
      expect(mockActions[0].onClick).toHaveBeenCalledTimes(1);
    });

    it('closes after action click', () => {
      render(<SpeedDial actions={mockActions} ariaLabel="Actions" />);
      const mainButton = screen.getByRole('button', { name: 'Actions' });

      fireEvent.click(mainButton);
      expect(screen.getByRole('menu')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('menuitem', { name: 'Edit' }));
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('handles disabled actions', () => {
      const disabledActions = [
        ...mockActions,
        {
          id: '4',
          icon: <span>🚫</span>,
          label: 'Disabled',
          onClick: jest.fn(),
          disabled: true,
        },
      ];

      render(<SpeedDial actions={disabledActions} ariaLabel="Actions" />);
      fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

      const disabledButton = screen.getByRole('menuitem', { name: 'Disabled' });
      expect(disabledButton).toBeDisabled();

      fireEvent.click(disabledButton);
      expect(disabledActions[3].onClick).not.toHaveBeenCalled();
    });
  });

  describe('Labels', () => {
    it('shows labels by default', () => {
      render(<SpeedDial actions={mockActions} ariaLabel="Actions" />);
      fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Copy')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('hides labels when showLabels is false', () => {
      render(
        <SpeedDial
          actions={mockActions}
          showLabels={false}
          ariaLabel="Actions"
        />
      );
      fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

      expect(screen.queryByText('Edit')).not.toBeInTheDocument();
      expect(screen.queryByText('Copy')).not.toBeInTheDocument();
      expect(screen.queryByText('Delete')).not.toBeInTheDocument();
    });
  });

  describe('Backdrop', () => {
    it('shows backdrop when open by default', () => {
      render(<SpeedDial actions={mockActions} ariaLabel="Actions" />);
      fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

      const backdrop = document.querySelector('.bg-black\\/20');
      expect(backdrop).toBeInTheDocument();
    });

    it('hides backdrop when showBackdrop is false', () => {
      render(
        <SpeedDial
          actions={mockActions}
          showBackdrop={false}
          ariaLabel="Actions"
        />
      );
      fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

      const backdrop = document.querySelector('.bg-black\\/20');
      expect(backdrop).not.toBeInTheDocument();
    });

    it('closes on backdrop click', () => {
      render(<SpeedDial actions={mockActions} ariaLabel="Actions" />);
      const button = screen.getByRole('button', { name: 'Actions' });

      fireEvent.click(button);
      expect(screen.getByRole('menu')).toBeInTheDocument();

      const backdrop = document.querySelector('.bg-black\\/20') as HTMLElement;
      fireEvent.click(backdrop);
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('calls onBackdropClick handler', () => {
      const onBackdropClick = jest.fn();
      render(
        <SpeedDial
          actions={mockActions}
          onBackdropClick={onBackdropClick}
          ariaLabel="Actions"
        />
      );

      fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
      const backdrop = document.querySelector('.bg-black\\/20') as HTMLElement;
      fireEvent.click(backdrop);

      expect(onBackdropClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Direction', () => {
    it('renders actions upward by default', () => {
      render(<SpeedDial actions={mockActions} ariaLabel="Actions" />);
      fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

      const menu = screen.getByRole('menu');
      expect(menu).toHaveClass('bottom-full', 'flex-col-reverse');
    });

    it('renders actions downward', () => {
      render(
        <SpeedDial actions={mockActions} direction="down" ariaLabel="Actions" />
      );
      fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

      const menu = screen.getByRole('menu');
      expect(menu).toHaveClass('top-full', 'flex-col');
    });

    it('renders actions to the left', () => {
      render(
        <SpeedDial actions={mockActions} direction="left" ariaLabel="Actions" />
      );
      fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

      const menu = screen.getByRole('menu');
      expect(menu).toHaveClass('right-full', 'flex-row-reverse');
    });

    it('renders actions to the right', () => {
      render(
        <SpeedDial
          actions={mockActions}
          direction="right"
          ariaLabel="Actions"
        />
      );
      fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

      const menu = screen.getByRole('menu');
      expect(menu).toHaveClass('left-full', 'flex-row');
    });
  });

  describe('Keyboard Navigation', () => {
    it('closes on Escape key', () => {
      render(<SpeedDial actions={mockActions} ariaLabel="Actions" />);
      const button = screen.getByRole('button', { name: 'Actions' });

      fireEvent.click(button);
      expect(screen.getByRole('menu')).toBeInTheDocument();

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('does not close on other keys', () => {
      render(<SpeedDial actions={mockActions} ariaLabel="Actions" />);
      const button = screen.getByRole('button', { name: 'Actions' });

      fireEvent.click(button);
      expect(screen.getByRole('menu')).toBeInTheDocument();

      fireEvent.keyDown(document, { key: 'Enter' });
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(<SpeedDial actions={mockActions} ariaLabel="Quick actions" />);
      const button = screen.getByRole('button');

      expect(button).toHaveAttribute('aria-label', 'Quick actions');
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(button).toHaveAttribute('aria-haspopup', 'menu');
    });

    it('uses action aria-label when provided', () => {
      const actionsWithAriaLabel = [
        { ...mockActions[0], ariaLabel: 'Edit the recipe' },
      ];

      render(<SpeedDial actions={actionsWithAriaLabel} ariaLabel="Actions" />);
      fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

      expect(
        screen.getByRole('menuitem', { name: 'Edit the recipe' })
      ).toBeInTheDocument();
    });

    it('sets correct aria-orientation on menu', () => {
      const { rerender } = render(
        <SpeedDial actions={mockActions} direction="up" ariaLabel="Actions" />
      );
      fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

      let menu = screen.getByRole('menu');
      expect(menu).toHaveAttribute('aria-orientation', 'vertical');

      rerender(
        <SpeedDial actions={mockActions} direction="left" ariaLabel="Actions" />
      );

      menu = screen.getByRole('menu');
      expect(menu).toHaveAttribute('aria-orientation', 'horizontal');
    });
  });
});

describe('FABGroup', () => {
  it('renders children', () => {
    render(
      <FABGroup>
        <FloatingActionButton icon={<span>1</span>} ariaLabel="First" />
        <FloatingActionButton icon={<span>2</span>} ariaLabel="Second" />
      </FABGroup>
    );

    expect(screen.getByRole('button', { name: 'First' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Second' })).toBeInTheDocument();
  });

  it('positions group correctly', () => {
    const { container } = render(
      <FABGroup position="top-left">
        <FloatingActionButton icon={<span>1</span>} ariaLabel="First" />
      </FABGroup>
    );

    const group = container.querySelector('.fixed');
    expect(group).toHaveClass('top-0', 'left-0');
  });

  it('stacks vertically by default', () => {
    const { container } = render(
      <FABGroup>
        <FloatingActionButton icon={<span>1</span>} ariaLabel="First" />
        <FloatingActionButton icon={<span>2</span>} ariaLabel="Second" />
      </FABGroup>
    );

    const group = container.querySelector('.fixed');
    expect(group).toHaveClass('flex-col');
  });

  it('stacks horizontally when specified', () => {
    const { container } = render(
      <FABGroup direction="horizontal">
        <FloatingActionButton icon={<span>1</span>} ariaLabel="First" />
        <FloatingActionButton icon={<span>2</span>} ariaLabel="Second" />
      </FABGroup>
    );

    const group = container.querySelector('.fixed');
    expect(group).toHaveClass('flex-row');
  });

  it('applies custom spacing', () => {
    const { container } = render(
      <FABGroup spacing={24}>
        <FloatingActionButton icon={<span>1</span>} ariaLabel="First" />
        <FloatingActionButton icon={<span>2</span>} ariaLabel="Second" />
      </FABGroup>
    );

    const group = container.querySelector('.fixed');
    expect(group).toHaveStyle({ gap: '24px' });
  });

  it('applies custom offset', () => {
    const { container } = render(
      <FABGroup offset={32} position="bottom-right">
        <FloatingActionButton icon={<span>1</span>} ariaLabel="First" />
      </FABGroup>
    );

    const group = container.querySelector('.fixed');
    expect(group).toHaveStyle({ bottom: '32px', right: '32px' });
  });

  it('handles all positions', () => {
    const positions: Array<
      'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
    > = ['bottom-right', 'bottom-left', 'top-right', 'top-left'];

    positions.forEach(position => {
      const { container } = render(
        <FABGroup position={position}>
          <FloatingActionButton icon={<span>+</span>} ariaLabel="Test" />
        </FABGroup>
      );

      const group = container.querySelector('.fixed');
      if (position.includes('bottom')) {
        expect(group).toHaveClass('bottom-0');
      }
      if (position.includes('top')) {
        expect(group).toHaveClass('top-0');
      }
      if (position.includes('right')) {
        expect(group).toHaveClass('right-0');
      }
      if (position.includes('left')) {
        expect(group).toHaveClass('left-0');
      }
    });
  });
});
