import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions,
  type EmptyStateProps,
  type EmptyStateIconProps,
  type EmptyStateTitleProps,
  type EmptyStateDescriptionProps,
  type EmptyStateActionsProps,
} from '@/components/ui/empty-state';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

/**
 * Helper function to render EmptyState with default props
 */
const renderEmptyState = (props: Partial<EmptyStateProps> = {}) => {
  const defaultProps: EmptyStateProps = {
    children: 'Test Empty State',
    ...props,
  };

  return render(<EmptyState {...defaultProps} />);
};

/**
 * Helper function to render complete EmptyState with all components
 */
const renderCompleteEmptyState = (
  emptyStateProps: Partial<EmptyStateProps> = {},
  iconProps: Partial<EmptyStateIconProps> = {},
  titleProps: Partial<EmptyStateTitleProps> = {},
  descriptionProps: Partial<EmptyStateDescriptionProps> = {},
  actionsProps: Partial<EmptyStateActionsProps> = {}
) => {
  return render(
    <EmptyState {...emptyStateProps}>
      <EmptyStateIcon {...iconProps}>📦</EmptyStateIcon>
      <EmptyStateTitle {...titleProps}>No items found</EmptyStateTitle>
      <EmptyStateDescription {...descriptionProps}>
        There are no items to display at this time.
      </EmptyStateDescription>
      <EmptyStateActions {...actionsProps}>
        <button>Add Item</button>
        <button>Refresh</button>
      </EmptyStateActions>
    </EmptyState>
  );
};

describe('EmptyState', () => {
  describe('Basic Rendering', () => {
    test('renders empty state with children', () => {
      renderEmptyState();
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText('Test Empty State')).toBeInTheDocument();
    });

    test('renders div element by default', () => {
      renderEmptyState();
      const emptyState = screen.getByRole('status');
      expect(emptyState.tagName).toBe('DIV');
    });

    test('applies default classes', () => {
      renderEmptyState();
      const emptyState = screen.getByRole('status');
      expect(emptyState).toHaveClass(
        'flex',
        'flex-col',
        'items-center',
        'justify-center'
      );
    });

    test('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<EmptyState ref={ref}>Test</EmptyState>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    test('includes proper ARIA attributes', () => {
      renderEmptyState();
      const emptyState = screen.getByRole('status');
      expect(emptyState).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Variants', () => {
    test('applies default variant classes', () => {
      renderEmptyState({ variant: 'default' });
      const emptyState = screen.getByRole('status');
      expect(emptyState).toHaveClass('bg-card', 'border', 'border-border');
    });

    test('applies search variant classes', () => {
      renderEmptyState({ variant: 'search' });
      const emptyState = screen.getByRole('status');
      expect(emptyState).toHaveClass(
        'bg-muted/30',
        'border-dashed',
        'text-muted-foreground'
      );
    });

    test('applies minimal variant classes', () => {
      renderEmptyState({ variant: 'minimal' });
      const emptyState = screen.getByRole('status');
      expect(emptyState).toHaveClass('bg-transparent', 'text-muted-foreground');
    });

    test('applies illustrated variant classes', () => {
      renderEmptyState({ variant: 'illustrated' });
      const emptyState = screen.getByRole('status');
      expect(emptyState).toHaveClass(
        'bg-gradient-to-br',
        'from-muted/20',
        'to-muted/10'
      );
    });

    test('applies error variant classes', () => {
      renderEmptyState({ variant: 'error' });
      const emptyState = screen.getByRole('status');
      expect(emptyState).toHaveClass(
        'bg-destructive/5',
        'border-destructive/20',
        'text-destructive-foreground'
      );
    });
  });

  describe('Sizes', () => {
    test('applies small size classes', () => {
      renderEmptyState({ size: 'sm' });
      const emptyState = screen.getByRole('status');
      expect(emptyState).toHaveClass('min-h-48', 'max-w-sm', 'gap-3');
    });

    test('applies medium size classes (default)', () => {
      renderEmptyState({ size: 'md' });
      const emptyState = screen.getByRole('status');
      expect(emptyState).toHaveClass('min-h-64', 'max-w-md', 'gap-4');
    });

    test('applies large size classes', () => {
      renderEmptyState({ size: 'lg' });
      const emptyState = screen.getByRole('status');
      expect(emptyState).toHaveClass('min-h-80', 'max-w-lg', 'gap-6');
    });
  });

  describe('Custom Props', () => {
    test('accepts custom className', () => {
      renderEmptyState({ className: 'custom-class' });
      const emptyState = screen.getByRole('status');
      expect(emptyState).toHaveClass('custom-class');
    });

    test('passes through HTML attributes', () => {
      renderEmptyState({ 'data-testid': 'empty-state-test' } as any);
      const emptyState = screen.getByTestId('empty-state-test');
      expect(emptyState).toBeInTheDocument();
    });

    test('supports asChild prop with Slot', () => {
      render(
        <EmptyState asChild>
          <section data-testid="custom-section">Custom element</section>
        </EmptyState>
      );
      const customElement = screen.getByTestId('custom-section');
      expect(customElement.tagName).toBe('SECTION');
      expect(customElement).toHaveClass('flex', 'flex-col');
    });
  });
});

describe('EmptyStateIcon', () => {
  describe('Basic Rendering', () => {
    test('renders icon container with children', () => {
      render(<EmptyStateIcon>📦</EmptyStateIcon>);
      expect(screen.getByText('📦')).toBeInTheDocument();
    });

    test('renders div element by default', () => {
      render(<EmptyStateIcon data-testid="icon">📦</EmptyStateIcon>);
      const icon = screen.getByTestId('icon');
      expect(icon.tagName).toBe('DIV');
    });

    test('applies default classes', () => {
      render(<EmptyStateIcon data-testid="icon">📦</EmptyStateIcon>);
      const icon = screen.getByTestId('icon');
      expect(icon).toHaveClass(
        'flex',
        'items-center',
        'justify-center',
        'text-muted-foreground'
      );
    });

    test('includes aria-hidden attribute', () => {
      render(<EmptyStateIcon data-testid="icon">📦</EmptyStateIcon>);
      const icon = screen.getByTestId('icon');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    test('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<EmptyStateIcon ref={ref}>📦</EmptyStateIcon>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Variants and Sizes', () => {
    test('applies variant-specific classes', () => {
      render(
        <EmptyStateIcon variant="error" data-testid="icon">
          ❌
        </EmptyStateIcon>
      );
      const icon = screen.getByTestId('icon');
      expect(icon).toHaveClass('text-destructive');
    });

    test('applies size-specific classes', () => {
      render(
        <EmptyStateIcon size="lg" data-testid="icon">
          📦
        </EmptyStateIcon>
      );
      const icon = screen.getByTestId('icon');
      expect(icon).toHaveClass('text-6xl', 'mb-4');
    });
  });
});

describe('EmptyStateTitle', () => {
  describe('Basic Rendering', () => {
    test('renders title with children', () => {
      render(<EmptyStateTitle>No items found</EmptyStateTitle>);
      expect(
        screen.getByRole('heading', { name: 'No items found' })
      ).toBeInTheDocument();
    });

    test('renders h3 element by default', () => {
      render(<EmptyStateTitle>No items found</EmptyStateTitle>);
      const title = screen.getByRole('heading');
      expect(title.tagName).toBe('H3');
    });

    test('applies default classes', () => {
      render(<EmptyStateTitle>No items found</EmptyStateTitle>);
      const title = screen.getByRole('heading');
      expect(title).toHaveClass(
        'font-semibold',
        'tracking-tight',
        'text-center'
      );
    });

    test('forwards ref correctly', () => {
      const ref = React.createRef<HTMLHeadingElement>();
      render(<EmptyStateTitle ref={ref}>Title</EmptyStateTitle>);
      expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
    });
  });

  describe('Variants and Sizes', () => {
    test('applies variant-specific classes', () => {
      render(<EmptyStateTitle variant="error">Error title</EmptyStateTitle>);
      const title = screen.getByRole('heading');
      expect(title).toHaveClass('text-destructive');
    });

    test('applies size-specific classes', () => {
      render(<EmptyStateTitle size="lg">Large title</EmptyStateTitle>);
      const title = screen.getByRole('heading');
      expect(title).toHaveClass('text-2xl', 'leading-tight');
    });
  });
});

describe('EmptyStateDescription', () => {
  describe('Basic Rendering', () => {
    test('renders description with children', () => {
      render(
        <EmptyStateDescription>
          No items to display at this time.
        </EmptyStateDescription>
      );
      expect(
        screen.getByText('No items to display at this time.')
      ).toBeInTheDocument();
    });

    test('renders p element by default', () => {
      render(
        <EmptyStateDescription data-testid="description">
          Description text
        </EmptyStateDescription>
      );
      const description = screen.getByTestId('description');
      expect(description.tagName).toBe('P');
    });

    test('applies default classes', () => {
      render(
        <EmptyStateDescription data-testid="description">
          Description text
        </EmptyStateDescription>
      );
      const description = screen.getByTestId('description');
      expect(description).toHaveClass(
        'text-center',
        'max-w-prose',
        'transition-colors',
        'duration-200'
      );
    });

    test('forwards ref correctly', () => {
      const ref = React.createRef<HTMLParagraphElement>();
      render(
        <EmptyStateDescription ref={ref}>Description</EmptyStateDescription>
      );
      expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
    });
  });

  describe('Variants and Sizes', () => {
    test('applies variant-specific classes', () => {
      render(
        <EmptyStateDescription variant="error" data-testid="description">
          Error description
        </EmptyStateDescription>
      );
      const description = screen.getByTestId('description');
      expect(description).toHaveClass('text-destructive/80');
    });

    test('applies size-specific classes', () => {
      render(
        <EmptyStateDescription size="lg" data-testid="description">
          Large description
        </EmptyStateDescription>
      );
      const description = screen.getByTestId('description');
      expect(description).toHaveClass('text-lg');
    });
  });
});

describe('EmptyStateActions', () => {
  describe('Basic Rendering', () => {
    test('renders actions container with children', () => {
      render(
        <EmptyStateActions>
          <button>Action 1</button>
          <button>Action 2</button>
        </EmptyStateActions>
      );
      expect(
        screen.getByRole('button', { name: 'Action 1' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Action 2' })
      ).toBeInTheDocument();
    });

    test('renders div element by default', () => {
      render(
        <EmptyStateActions data-testid="actions">
          <button>Action</button>
        </EmptyStateActions>
      );
      const actions = screen.getByTestId('actions');
      expect(actions.tagName).toBe('DIV');
    });

    test('applies default classes', () => {
      render(
        <EmptyStateActions data-testid="actions">
          <button>Action</button>
        </EmptyStateActions>
      );
      const actions = screen.getByTestId('actions');
      expect(actions).toHaveClass(
        'flex',
        'items-center',
        'justify-center',
        'gap-3'
      );
    });

    test('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <EmptyStateActions ref={ref}>
          <button>Action</button>
        </EmptyStateActions>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Layout Options', () => {
    test('applies horizontal layout classes', () => {
      render(
        <EmptyStateActions layout="horizontal" data-testid="actions">
          <button>Action</button>
        </EmptyStateActions>
      );
      const actions = screen.getByTestId('actions');
      expect(actions).toHaveClass('flex-row', 'flex-wrap');
    });

    test('applies vertical layout classes', () => {
      render(
        <EmptyStateActions layout="vertical" data-testid="actions">
          <button>Action</button>
        </EmptyStateActions>
      );
      const actions = screen.getByTestId('actions');
      expect(actions).toHaveClass('flex-col', 'items-stretch');
    });

    test('applies stacked layout classes', () => {
      render(
        <EmptyStateActions layout="stacked" data-testid="actions">
          <button>Action</button>
        </EmptyStateActions>
      );
      const actions = screen.getByTestId('actions');
      expect(actions).toHaveClass('flex-col', 'items-center');
      // Note: gap-2 from stacked layout gets overridden by gap-3 from default size (md)
    });
  });

  describe('Size Variants', () => {
    test('applies size-specific gap classes', () => {
      render(
        <EmptyStateActions size="lg" data-testid="actions">
          <button>Action</button>
        </EmptyStateActions>
      );
      const actions = screen.getByTestId('actions');
      expect(actions).toHaveClass('gap-4');
    });
  });
});

describe('Complete EmptyState Integration', () => {
  test('renders complete empty state with all components', () => {
    renderCompleteEmptyState();

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('📦')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'No items found' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('There are no items to display at this time.')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Add Item' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Refresh' })).toBeInTheDocument();
  });

  test('handles user interactions correctly', async () => {
    const user = userEvent.setup();
    const addItemMock = jest.fn();
    const refreshMock = jest.fn();

    render(
      <EmptyState>
        <EmptyStateTitle>No items found</EmptyStateTitle>
        <EmptyStateActions>
          <button onClick={addItemMock}>Add Item</button>
          <button onClick={refreshMock}>Refresh</button>
        </EmptyStateActions>
      </EmptyState>
    );

    await user.click(screen.getByRole('button', { name: 'Add Item' }));
    await user.click(screen.getByRole('button', { name: 'Refresh' }));

    expect(addItemMock).toHaveBeenCalledTimes(1);
    expect(refreshMock).toHaveBeenCalledTimes(1);
  });

  test('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    const actionMock = jest.fn();

    render(
      <EmptyState>
        <EmptyStateTitle>No items found</EmptyStateTitle>
        <EmptyStateActions>
          <button onClick={actionMock}>Action</button>
        </EmptyStateActions>
      </EmptyState>
    );

    const button = screen.getByRole('button', { name: 'Action' });

    await user.tab();
    expect(button).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(actionMock).toHaveBeenCalledTimes(1);
  });

  test('applies consistent styling across all components', () => {
    renderCompleteEmptyState(
      { variant: 'search', size: 'lg' },
      { variant: 'search', size: 'lg' },
      { variant: 'search', size: 'lg' },
      { variant: 'search', size: 'lg' },
      { layout: 'vertical', size: 'lg' }
    );

    const emptyState = screen.getByRole('status');
    const icon = screen.getByText('📦');
    const title = screen.getByRole('heading');
    const description = screen.getByText(
      'There are no items to display at this time.'
    );

    expect(emptyState).toHaveClass('bg-muted/30', 'min-h-80', 'gap-6');
    expect(icon).toHaveClass('text-muted-foreground/80', 'text-6xl');
    expect(title).toHaveClass('text-foreground', 'text-2xl');
    expect(description).toHaveClass('text-muted-foreground/80', 'text-lg');
  });
});

describe('Accessibility', () => {
  test('has no accessibility violations', async () => {
    const { container } = renderCompleteEmptyState();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('provides proper semantic structure', () => {
    renderCompleteEmptyState();

    const emptyState = screen.getByRole('status');
    const heading = screen.getByRole('heading');

    expect(emptyState).toHaveAttribute('aria-live', 'polite');
    expect(heading.tagName).toBe('H3');
  });

  test('icons are hidden from screen readers', () => {
    render(<EmptyStateIcon data-testid="icon">📦</EmptyStateIcon>);
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  test('supports custom ARIA attributes', () => {
    render(
      <EmptyState aria-label="Empty recipe list">
        <EmptyStateTitle>No recipes</EmptyStateTitle>
      </EmptyState>
    );

    const emptyState = screen.getByRole('status');
    expect(emptyState).toHaveAttribute('aria-label', 'Empty recipe list');
  });

  test('maintains focus management', async () => {
    const user = userEvent.setup();

    render(
      <EmptyState>
        <EmptyStateActions>
          <button>First Action</button>
          <button>Second Action</button>
        </EmptyStateActions>
      </EmptyState>
    );

    await user.tab();
    expect(screen.getByRole('button', { name: 'First Action' })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('button', { name: 'Second Action' })).toHaveFocus();
  });
});

describe('Edge Cases', () => {
  test('handles empty children gracefully', () => {
    render(<EmptyState />);
    const emptyState = screen.getByRole('status');
    expect(emptyState).toBeInTheDocument();
    expect(emptyState).toBeEmptyDOMElement();
  });

  test('handles long text content appropriately', () => {
    const longTitle =
      'This is a very long title that might wrap to multiple lines in certain viewport sizes';
    const longDescription =
      'This is a very long description that definitely should wrap to multiple lines and test how the component handles extensive text content that exceeds typical length expectations.';

    render(
      <EmptyState>
        <EmptyStateTitle>{longTitle}</EmptyStateTitle>
        <EmptyStateDescription>{longDescription}</EmptyStateDescription>
      </EmptyState>
    );

    expect(screen.getByText(longTitle)).toBeInTheDocument();
    expect(screen.getByText(longDescription)).toBeInTheDocument();
  });

  test('handles multiple action buttons', () => {
    render(
      <EmptyState>
        <EmptyStateActions>
          <button>Action 1</button>
          <button>Action 2</button>
          <button>Action 3</button>
          <button>Action 4</button>
        </EmptyStateActions>
      </EmptyState>
    );

    expect(
      screen.getByRole('button', { name: 'Action 1' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Action 2' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Action 3' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Action 4' })
    ).toBeInTheDocument();
  });

  test('works without actions', () => {
    render(
      <EmptyState>
        <EmptyStateIcon>📦</EmptyStateIcon>
        <EmptyStateTitle>No items</EmptyStateTitle>
        <EmptyStateDescription>No actions available</EmptyStateDescription>
      </EmptyState>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('supports complex icon content', () => {
    render(
      <EmptyStateIcon>
        <div data-testid="complex-icon">
          <span>🔍</span>
          <span>➕</span>
        </div>
      </EmptyStateIcon>
    );

    const complexIcon = screen.getByTestId('complex-icon');
    expect(complexIcon).toBeInTheDocument();
    expect(screen.getByText('🔍')).toBeInTheDocument();
    expect(screen.getByText('➕')).toBeInTheDocument();
  });
});
