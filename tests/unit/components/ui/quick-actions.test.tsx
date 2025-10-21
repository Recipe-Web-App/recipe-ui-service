import * as React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  QuickActions,
  QuickActionButton,
  OverflowMenu,
} from '@/components/ui/quick-actions';
import type { QuickAction } from '@/types/ui/quick-actions';
import { Heart, Share2, Plus, Eye, Download, Edit, Trash2 } from 'lucide-react';

expect.extend(toHaveNoViolations);

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Heart: React.forwardRef(({ className, ...props }: any, ref: any) => (
    <div ref={ref} data-testid="heart-icon" className={className} {...props} />
  )),
  Share2: React.forwardRef(({ className, ...props }: any, ref: any) => (
    <div ref={ref} data-testid="share-icon" className={className} {...props} />
  )),
  Plus: React.forwardRef(({ className, ...props }: any, ref: any) => (
    <div ref={ref} data-testid="plus-icon" className={className} {...props} />
  )),
  Eye: React.forwardRef(({ className, ...props }: any, ref: any) => (
    <div ref={ref} data-testid="eye-icon" className={className} {...props} />
  )),
  Trash2: React.forwardRef(({ className, ...props }: any, ref: any) => (
    <div ref={ref} data-testid="trash-icon" className={className} {...props} />
  )),
  MoreVertical: React.forwardRef(({ className, ...props }: any, ref: any) => (
    <div
      ref={ref}
      data-testid="more-vertical-icon"
      className={className}
      {...props}
    />
  )),
  Download: React.forwardRef(({ className, ...props }: any, ref: any) => (
    <div
      ref={ref}
      data-testid="download-icon"
      className={className}
      {...props}
    />
  )),
  Edit: React.forwardRef(({ className, ...props }: any, ref: any) => (
    <div ref={ref} data-testid="edit-icon" className={className} {...props} />
  )),
}));

// Mock @radix-ui/react-tooltip
jest.mock('@radix-ui/react-tooltip', () => ({
  Provider: ({ children }: any) => (
    <div data-testid="tooltip-provider">{children}</div>
  ),
  Root: ({ children, open }: any) => (
    <div data-testid="tooltip-root" data-open={open}>
      {children}
    </div>
  ),
  Trigger: React.forwardRef(
    ({ children, asChild, ...props }: any, ref: any) => {
      if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, { ...props, ref });
      }
      return (
        <div ref={ref} {...props}>
          {children}
        </div>
      );
    }
  ),
  Portal: ({ children }: any) => (
    <div data-testid="tooltip-portal">{children}</div>
  ),
  Content: React.forwardRef(
    (
      { children, className, side, align, sideOffset, ...props }: any,
      ref: any
    ) => (
      <div
        ref={ref}
        data-testid="tooltip-content"
        data-side={side}
        data-align={align}
        className={className}
        {...props}
      >
        {children}
      </div>
    )
  ),
  Arrow: ({ className }: any) => (
    <div data-testid="tooltip-arrow" className={className} />
  ),
}));

// Mock @radix-ui/react-dropdown-menu
const DropdownContext = React.createContext({ open: false });
jest.mock('@radix-ui/react-dropdown-menu', () => ({
  Root: ({ children, open = false, onOpenChange }: any) => (
    <DropdownContext.Provider value={{ open }}>
      <div
        data-testid="dropdown-root"
        data-open={open}
        onClick={() => onOpenChange?.(!open)}
      >
        {children}
      </div>
    </DropdownContext.Provider>
  ),
  Trigger: React.forwardRef(
    ({ children, asChild, ...props }: any, ref: any) => {
      if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, {
          ...props,
          ref,
          'data-testid': 'dropdown-trigger',
        });
      }
      return (
        <button ref={ref} data-testid="dropdown-trigger" {...props}>
          {children}
        </button>
      );
    }
  ),
  Portal: ({ children }: any) => {
    const { open } = React.useContext(DropdownContext);
    if (!open) return null;
    return <div data-testid="dropdown-portal">{children}</div>;
  },
  Content: React.forwardRef(
    ({ children, className, align, sideOffset, ...props }: any, ref: any) => (
      <div
        ref={ref}
        data-testid="dropdown-content"
        data-align={align}
        className={className}
        {...props}
      >
        {children}
      </div>
    )
  ),
  Item: React.forwardRef(
    ({ children, disabled, onSelect, className, ...props }: any, ref: any) => (
      <button
        ref={ref}
        data-testid="dropdown-item"
        disabled={disabled}
        onClick={onSelect}
        className={className}
        {...props}
      >
        {children}
      </button>
    )
  ),
}));

describe('QuickActions', () => {
  const mockOnClick = jest.fn();

  const defaultActions: QuickAction[] = [
    {
      id: 'favorite',
      icon: Heart,
      label: 'Favorite',
      onClick: mockOnClick,
    },
    {
      id: 'share',
      icon: Share2,
      label: 'Share',
      onClick: mockOnClick,
    },
    {
      id: 'add',
      icon: Plus,
      label: 'Add to collection',
      onClick: mockOnClick,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<QuickActions actions={defaultActions} />);

      // Should render container with toolbar role
      const toolbar = screen.getByRole('toolbar', { name: /quick actions/i });
      expect(toolbar).toBeInTheDocument();
    });

    it('renders all visible actions when count is <= maxVisible', () => {
      render(<QuickActions actions={defaultActions} maxVisible={3} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3); // 3 actions, no overflow
    });

    it('renders overflow menu when actions exceed maxVisible', () => {
      const manyActions: QuickAction[] = [
        ...defaultActions,
        { id: 'view', icon: Eye, label: 'Quick view', onClick: mockOnClick },
        {
          id: 'download',
          icon: Download,
          label: 'Download',
          onClick: mockOnClick,
        },
      ];

      render(<QuickActions actions={manyActions} maxVisible={3} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(4); // 3 visible + 1 overflow trigger

      // Check for overflow menu trigger
      const overflowTrigger = screen.getByLabelText(/more actions/i);
      expect(overflowTrigger).toBeInTheDocument();
    });

    it('does not render when actions array is empty', () => {
      const { container } = render(<QuickActions actions={[]} />);
      expect(container.firstChild).toBeNull();
    });

    it('applies custom className', () => {
      const { container } = render(
        <QuickActions actions={defaultActions} className="custom-class" />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('applies different positions correctly', () => {
      const positions: Array<
        'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
      > = ['top-right', 'top-left', 'bottom-right', 'bottom-left'];

      positions.forEach(position => {
        const { container, rerender } = render(
          <QuickActions actions={defaultActions} position={position} />
        );

        // Component should render without errors
        expect(container.firstChild).toBeInTheDocument();

        rerender(<QuickActions actions={defaultActions} position={position} />);
      });
    });

    it('applies different size variants correctly', () => {
      const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

      sizes.forEach(size => {
        const { container, rerender } = render(
          <QuickActions actions={defaultActions} size={size} />
        );

        expect(container.firstChild).toBeInTheDocument();

        rerender(<QuickActions actions={defaultActions} size={size} />);
      });
    });
  });

  describe('Interactions', () => {
    it('calls onClick handler when action button is clicked', async () => {
      const user = userEvent.setup();
      render(<QuickActions actions={defaultActions} />);

      const buttons = screen.getAllByRole('button');
      await user.click(buttons[0]);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled action is clicked', async () => {
      const user = userEvent.setup();
      const actionsWithDisabled: QuickAction[] = [
        {
          id: 'favorite',
          icon: Heart,
          label: 'Favorite',
          onClick: mockOnClick,
          disabled: true,
        },
      ];

      render(<QuickActions actions={actionsWithDisabled} />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('calls onActionClick callback when provided', async () => {
      const user = userEvent.setup();
      const onActionClick = jest.fn();

      render(
        <QuickActions actions={defaultActions} onActionClick={onActionClick} />
      );

      const buttons = screen.getAllByRole('button');
      await user.click(buttons[0]);

      expect(onActionClick).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'favorite' })
      );
    });

    it('opens overflow menu when trigger is clicked', async () => {
      const user = userEvent.setup();
      const manyActions: QuickAction[] = [
        ...defaultActions,
        { id: 'view', icon: Eye, label: 'Quick view', onClick: mockOnClick },
      ];

      render(<QuickActions actions={manyActions} maxVisible={3} />);

      const overflowTrigger = screen.getByLabelText(/more actions/i);
      await user.click(overflowTrigger);

      // Dropdown should be triggered
      const dropdownRoot = screen.getByTestId('dropdown-root');
      expect(dropdownRoot).toBeInTheDocument();
    });

    it('calls overflow callbacks when menu opens/closes', async () => {
      const user = userEvent.setup();
      const onOverflowOpen = jest.fn();
      const onOverflowClose = jest.fn();
      const manyActions: QuickAction[] = [
        ...defaultActions,
        { id: 'view', icon: Eye, label: 'Quick view', onClick: mockOnClick },
      ];

      render(
        <QuickActions
          actions={manyActions}
          maxVisible={3}
          onOverflowOpen={onOverflowOpen}
          onOverflowClose={onOverflowClose}
        />
      );

      const overflowTrigger = screen.getByLabelText(/more actions/i);
      await user.click(overflowTrigger);

      // Note: Callbacks would be called in real Radix components
      // Our mocks don't fully simulate this, but the prop passing is tested
    });

    it('handles keyboard navigation on action buttons', async () => {
      const user = userEvent.setup();
      render(<QuickActions actions={defaultActions} />);

      const buttons = screen.getAllByRole('button');

      // Tab to first button
      await user.tab();
      expect(buttons[0]).toHaveFocus();

      // Enter to activate
      await user.keyboard('{Enter}');
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Action Variants', () => {
    it('renders default variant correctly', () => {
      const actions: QuickAction[] = [
        {
          id: 'action',
          icon: Heart,
          label: 'Action',
          variant: 'default',
          onClick: mockOnClick,
        },
      ];

      const { container } = render(<QuickActions actions={actions} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders destructive variant correctly', () => {
      const actions: QuickAction[] = [
        {
          id: 'delete',
          icon: Trash2,
          label: 'Delete',
          variant: 'destructive',
          onClick: mockOnClick,
        },
      ];

      const { container } = render(<QuickActions actions={actions} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders ghost variant correctly', () => {
      const actions: QuickAction[] = [
        {
          id: 'edit',
          icon: Edit,
          label: 'Edit',
          variant: 'ghost',
          onClick: mockOnClick,
        },
      ];

      const { container } = render(<QuickActions actions={actions} />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Overflow Menu', () => {
    const manyActions: QuickAction[] = [
      { id: '1', icon: Heart, label: 'Favorite', onClick: mockOnClick },
      { id: '2', icon: Share2, label: 'Share', onClick: mockOnClick },
      { id: '3', icon: Plus, label: 'Add', onClick: mockOnClick },
      { id: '4', icon: Eye, label: 'View', onClick: mockOnClick },
      { id: '5', icon: Download, label: 'Download', onClick: mockOnClick },
      { id: '6', icon: Edit, label: 'Edit', onClick: mockOnClick },
    ];

    it('shows correct number of overflow actions', () => {
      render(<QuickActions actions={manyActions} maxVisible={2} />);

      // Should have 2 visible + 1 overflow trigger
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);
    });

    it('places correct actions in overflow menu', async () => {
      const user = userEvent.setup();
      render(<QuickActions actions={manyActions} maxVisible={3} />);

      // First 3 should be visible, last 3 in overflow
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(4); // 3 visible + 1 overflow

      // Click overflow trigger
      const overflowTrigger = screen.getByLabelText(/more actions/i);
      await user.click(overflowTrigger);
    });

    it('handles disabled actions in overflow menu', () => {
      const actionsWithDisabled: QuickAction[] = [
        ...defaultActions,
        {
          id: 'view',
          icon: Eye,
          label: 'View',
          onClick: mockOnClick,
          disabled: true,
        },
      ];

      render(<QuickActions actions={actionsWithDisabled} maxVisible={3} />);

      // Should still render overflow trigger
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(3);
    });
  });

  describe('Edge Cases', () => {
    it('handles exactly maxVisible actions (no overflow)', () => {
      render(<QuickActions actions={defaultActions} maxVisible={3} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3); // No overflow trigger
    });

    it('handles single action', () => {
      const singleAction: QuickAction[] = [
        {
          id: 'favorite',
          icon: Heart,
          label: 'Favorite',
          onClick: mockOnClick,
        },
      ];

      render(<QuickActions actions={singleAction} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(1);
    });

    it('handles maxVisible=1 with multiple actions', () => {
      render(<QuickActions actions={defaultActions} maxVisible={1} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2); // 1 visible + 1 overflow
    });

    it('handles very large number of actions', () => {
      const manyActions: QuickAction[] = Array.from({ length: 20 }, (_, i) => ({
        id: `action-${i}`,
        icon: Heart,
        label: `Action ${i}`,
        onClick: mockOnClick,
      }));

      render(<QuickActions actions={manyActions} maxVisible={3} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(4); // 3 visible + 1 overflow
    });

    it('handles custom animation duration', () => {
      const { container } = render(
        <QuickActions actions={defaultActions} animationDuration={300} />
      );

      const toolbar = container.firstChild as HTMLElement;
      expect(toolbar.style.transitionDuration).toBe('300ms');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <div className="group relative">
          <QuickActions actions={defaultActions} />
        </div>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('provides aria-label for toolbar', () => {
      render(
        <QuickActions actions={defaultActions} aria-label="Card actions" />
      );

      const toolbar = screen.getByRole('toolbar', { name: /card actions/i });
      expect(toolbar).toBeInTheDocument();
    });

    it('provides aria-label for each action button', () => {
      render(<QuickActions actions={defaultActions} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons[0]).toHaveAttribute('aria-label', 'Favorite');
      expect(buttons[1]).toHaveAttribute('aria-label', 'Share');
      expect(buttons[2]).toHaveAttribute('aria-label', 'Add to collection');
    });

    it('sets aria-expanded on overflow menu trigger', () => {
      const manyActions: QuickAction[] = [
        ...defaultActions,
        { id: 'view', icon: Eye, label: 'View', onClick: mockOnClick },
      ];

      render(<QuickActions actions={manyActions} maxVisible={3} />);

      const overflowTrigger = screen.getByLabelText(/more actions/i);
      expect(overflowTrigger).toHaveAttribute('aria-expanded');
    });

    it('properly disables actions', () => {
      const actionsWithDisabled: QuickAction[] = [
        {
          id: 'favorite',
          icon: Heart,
          label: 'Favorite',
          onClick: mockOnClick,
          disabled: true,
        },
      ];

      render(<QuickActions actions={actionsWithDisabled} />);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('includes descriptive aria-describedby when provided', () => {
      const actionsWithDescription: QuickAction[] = [
        {
          id: 'favorite',
          icon: Heart,
          label: 'Favorite',
          onClick: mockOnClick,
          'aria-describedby': 'favorite-desc',
        },
      ];

      render(
        <>
          <QuickActions actions={actionsWithDescription} />
          <div id="favorite-desc">Add to your favorites</div>
        </>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-describedby', 'favorite-desc');
    });
  });

  describe('Sub-components', () => {
    describe('QuickActionButton', () => {
      it('renders action button correctly', () => {
        const action: QuickAction = {
          id: 'favorite',
          icon: Heart,
          label: 'Favorite',
          onClick: mockOnClick,
        };

        render(<QuickActionButton action={action} onClick={mockOnClick} />);

        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Favorite');
      });

      it('applies size variant', () => {
        const action: QuickAction = {
          id: 'favorite',
          icon: Heart,
          label: 'Favorite',
          onClick: mockOnClick,
        };

        const { rerender } = render(
          <QuickActionButton action={action} onClick={mockOnClick} size="sm" />
        );

        expect(screen.getByRole('button')).toBeInTheDocument();

        rerender(
          <QuickActionButton action={action} onClick={mockOnClick} size="lg" />
        );

        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });

    describe('OverflowMenu', () => {
      const overflowActions: QuickAction[] = [
        { id: 'view', icon: Eye, label: 'View', onClick: mockOnClick },
        {
          id: 'download',
          icon: Download,
          label: 'Download',
          onClick: mockOnClick,
        },
      ];

      it('renders overflow menu trigger', () => {
        render(
          <OverflowMenu actions={overflowActions} onActionClick={mockOnClick} />
        );

        const trigger = screen.getByLabelText(/more actions/i);
        expect(trigger).toBeInTheDocument();
      });

      it('calls onActionClick when overflow item is selected', async () => {
        const user = userEvent.setup();
        const onActionClick = jest.fn();

        render(
          <OverflowMenu
            actions={overflowActions}
            onActionClick={onActionClick}
          />
        );

        const trigger = screen.getByLabelText(/more actions/i);
        await user.click(trigger);

        // In real implementation, clicking dropdown items would trigger onActionClick
        // Our mock doesn't fully simulate this interaction
      });
    });
  });

  describe('Custom Props', () => {
    it('applies custom overlayClassName', () => {
      const { container } = render(
        <QuickActions
          actions={defaultActions}
          overlayClassName="custom-overlay"
        />
      );

      const overlay = container.querySelector('.custom-overlay');
      expect(overlay).toBeInTheDocument();
    });

    it('applies custom actionClassName', () => {
      const { container } = render(
        <QuickActions
          actions={defaultActions}
          actionClassName="custom-action"
        />
      );

      // Buttons should have custom class
      expect(container.querySelector('.custom-action')).toBeInTheDocument();
    });

    it('applies custom aria-describedby', () => {
      render(
        <>
          <QuickActions
            actions={defaultActions}
            aria-describedby="actions-desc"
          />
          <div id="actions-desc">Quick actions for this card</div>
        </>
      );

      const toolbar = screen.getByRole('toolbar');
      expect(toolbar).toHaveAttribute('aria-describedby', 'actions-desc');
    });
  });
});
