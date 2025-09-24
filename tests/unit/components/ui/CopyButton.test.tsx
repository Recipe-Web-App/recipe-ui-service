import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  CopyButton,
  RecipeCopyButton,
  CopyButtonGroup,
  type CopyButtonProps,
  type RecipeCopyButtonProps,
} from '@/components/ui/copy-button';
import { useCopyButton } from '@/hooks/components/ui/copy-button-hooks';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock the clipboard API
const mockWriteText = jest.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

// Mock window.isSecureContext
Object.defineProperty(window, 'isSecureContext', {
  writable: true,
  value: true,
});

/**
 * Helper function to render CopyButton with default props
 */
const renderCopyButton = (props: Partial<CopyButtonProps> = {}) => {
  const defaultProps: CopyButtonProps = {
    content: 'Test content to copy',
    children: 'Copy',
    ...props,
  };

  return render(<CopyButton {...defaultProps} />);
};

/**
 * Helper function to render RecipeCopyButton with default props
 */
const renderRecipeCopyButton = (props: Partial<RecipeCopyButtonProps> = {}) => {
  const defaultRecipe = {
    id: '123',
    title: 'Test Recipe',
    url: 'https://example.com/recipe/123',
    ingredients: [
      { name: 'flour', amount: '2', unit: 'cups' },
      { name: 'sugar', amount: '1', unit: 'cup' },
    ],
    instructions: [
      { step: 1, instruction: 'Mix ingredients' },
      { step: 2, instruction: 'Bake for 30 minutes' },
    ],
    nutrition: { calories: 250, fat: '10g' },
    metadata: { servings: 8, prepTime: '15 min' },
  };

  const defaultProps: RecipeCopyButtonProps = {
    recipe: defaultRecipe,
    copyType: 'ingredients',
    children: 'Copy Ingredients',
    ...props,
  };

  return render(<RecipeCopyButton {...defaultProps} />);
};

/**
 * Test hook component
 */
const TestHookComponent: React.FC<{ content?: string }> = ({
  content = 'test',
}) => {
  const { status, isSupported, resetStatus } = useCopyButton();

  return (
    <div>
      <div data-testid="status">{status}</div>
      <div data-testid="supported">{isSupported.toString()}</div>
      <button onClick={resetStatus}>Reset</button>
    </div>
  );
};

describe('CopyButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWriteText.mockResolvedValue(undefined);
  });

  describe('Basic Rendering', () => {
    test('renders button with content', () => {
      renderCopyButton();
      expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
      expect(screen.getByText('Copy')).toBeInTheDocument();
    });

    test('renders with custom children', () => {
      renderCopyButton({ children: 'Copy Recipe' });
      expect(screen.getByText('Copy Recipe')).toBeInTheDocument();
    });

    test('renders button element by default', () => {
      renderCopyButton();
      const button = screen.getByRole('button');
      expect(button.tagName).toBe('BUTTON');
    });

    test('applies base classes', () => {
      renderCopyButton();
      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'inline-flex',
        'items-center',
        'justify-center',
        'gap-2'
      );
    });

    test('forwards ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(
        <CopyButton ref={ref} content="test">
          Copy
        </CopyButton>
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('Variants', () => {
    test('applies default variant classes', () => {
      renderCopyButton({ variant: 'default' });
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-primary');
    });

    test('applies secondary variant classes', () => {
      renderCopyButton({ variant: 'secondary' });
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-secondary');
    });

    test('applies outline variant classes', () => {
      renderCopyButton({ variant: 'outline' });
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border', 'border-input');
    });

    test('applies ghost variant classes', () => {
      renderCopyButton({ variant: 'ghost' });
      const button = screen.getByRole('button');
      expect(button.className).toMatch(/hover:bg-accent/);
    });

    test('applies success variant classes', () => {
      renderCopyButton({ variant: 'success' });
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-green-600');
    });
  });

  describe('Sizes', () => {
    test('applies small size classes', () => {
      renderCopyButton({ size: 'sm' });
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-8', 'px-3', 'text-xs');
    });

    test('applies default size classes', () => {
      renderCopyButton({ size: 'default' });
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-9', 'px-4', 'py-2', 'text-sm');
    });

    test('applies large size classes', () => {
      renderCopyButton({ size: 'lg' });
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10', 'px-6', 'text-base');
    });

    test('applies icon size classes', () => {
      renderCopyButton({ size: 'icon', iconOnly: true });
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-9', 'w-9', 'p-0');
    });
  });

  describe('Recipe Variants', () => {
    test('applies ingredient recipe variant', () => {
      renderCopyButton({ recipe: 'ingredient' });
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border-l-4', 'border-l-green-500');
    });

    test('applies instruction recipe variant', () => {
      renderCopyButton({ recipe: 'instruction' });
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border-l-4', 'border-l-blue-500');
    });

    test('applies url recipe variant', () => {
      renderCopyButton({ recipe: 'url' });
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border-l-4', 'border-l-purple-500');
    });

    test('applies nutrition recipe variant', () => {
      renderCopyButton({ recipe: 'nutrition' });
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border-l-4', 'border-l-orange-500');
    });
  });

  describe('Icon Functionality', () => {
    test('shows default copy icon', () => {
      renderCopyButton();
      const button = screen.getByRole('button');
      expect(button.querySelector('svg')).toBeInTheDocument();
    });

    test('shows icon only when iconOnly is true', () => {
      renderCopyButton({ iconOnly: true });
      const button = screen.getByRole('button');
      expect(button.querySelector('svg')).toBeInTheDocument();
      expect(screen.queryByText('Copy')).not.toBeInTheDocument();
    });
  });

  describe('States', () => {
    test('handles disabled state', async () => {
      const user = userEvent.setup();
      renderCopyButton({ disabled: true });

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();

      await user.click(button);
      expect(mockWriteText).not.toHaveBeenCalled();
    });

    test('handles loading state', async () => {
      const user = userEvent.setup();
      renderCopyButton({ loading: true });

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();

      await user.click(button);
      expect(mockWriteText).not.toHaveBeenCalled();
    });

    test('shows success state after successful copy', async () => {
      const user = userEvent.setup();
      renderCopyButton({ resetDelay: 100 });

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('Copied!')).toBeInTheDocument();
      });
    });

    test('resets to idle state after timeout', async () => {
      const user = userEvent.setup();
      renderCopyButton({ resetDelay: 100 });

      const button = screen.getByRole('button');
      await user.click(button);

      // Wait for success message
      await waitFor(() => {
        expect(screen.getByText('Copied!')).toBeInTheDocument();
      });

      // Wait for reset
      await waitFor(
        () => {
          expect(screen.queryByText('Copied!')).not.toBeInTheDocument();
        },
        { timeout: 200 }
      );
    });
  });

  describe('Event Callbacks', () => {
    test('calls onCopyStart when copy begins', async () => {
      const onCopyStart = jest.fn();
      const user = userEvent.setup();
      renderCopyButton({ onCopyStart });

      const button = screen.getByRole('button');
      await user.click(button);

      expect(onCopyStart).toHaveBeenCalled();
    });

    test('calls onStatusChange when status changes', async () => {
      const onStatusChange = jest.fn();
      const user = userEvent.setup();
      renderCopyButton({ onStatusChange });

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(onStatusChange).toHaveBeenCalledWith('success');
      });
    });
  });

  describe('Polymorphic Behavior', () => {
    test('renders as child element when asChild is true', () => {
      const { container } = render(
        <CopyButton asChild content="test">
          <a href="/test">Copy Link</a>
        </CopyButton>
      );

      const link = container.querySelector('a');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
      expect(link).toHaveTextContent('Copy Link');
    });

    test('applies copy button classes to child element', () => {
      render(
        <CopyButton asChild content="test" variant="outline">
          <div data-testid="custom-element">Copy Custom</div>
        </CopyButton>
      );

      const customElement = screen.getByTestId('custom-element');
      expect(customElement).toHaveClass('border', 'border-input');
    });
  });
});

describe('RecipeCopyButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWriteText.mockResolvedValue(undefined);
  });

  describe('Recipe Variants', () => {
    test('applies ingredient variant for ingredients copy type', () => {
      renderRecipeCopyButton({ copyType: 'ingredients' });
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border-l-green-500');
    });

    test('applies instruction variant for instructions copy type', () => {
      renderRecipeCopyButton({ copyType: 'instructions' });
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border-l-blue-500');
    });

    test('applies url variant for url copy type', () => {
      renderRecipeCopyButton({ copyType: 'recipe-url' });
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border-l-purple-500');
    });
  });

  describe('Edge Cases', () => {
    test('handles recipe without ingredients', () => {
      const recipeWithoutIngredients = {
        id: '123',
        title: 'Test Recipe',
        ingredients: [],
      };

      render(
        <RecipeCopyButton
          recipe={recipeWithoutIngredients}
          copyType="ingredients"
        >
          Copy
        </RecipeCopyButton>
      );

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    test('handles recipe without instructions', () => {
      const recipeWithoutInstructions = {
        id: '123',
        title: 'Test Recipe',
        instructions: [],
      };

      render(
        <RecipeCopyButton
          recipe={recipeWithoutInstructions}
          copyType="instructions"
        >
          Copy
        </RecipeCopyButton>
      );

      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });
});

describe('CopyButtonGroup', () => {
  test('renders children correctly', () => {
    render(
      <CopyButtonGroup>
        <CopyButton content="test1">Copy 1</CopyButton>
        <CopyButton content="test2">Copy 2</CopyButton>
      </CopyButtonGroup>
    );

    expect(screen.getByText('Copy 1')).toBeInTheDocument();
    expect(screen.getByText('Copy 2')).toBeInTheDocument();
  });

  test('applies horizontal orientation by default', () => {
    const { container } = render(
      <CopyButtonGroup>
        <CopyButton content="test">Copy</CopyButton>
      </CopyButtonGroup>
    );

    const group = container.firstChild;
    expect(group).toHaveClass('flex-row', 'items-center');
  });

  test('applies vertical orientation', () => {
    const { container } = render(
      <CopyButtonGroup orientation="vertical">
        <CopyButton content="test">Copy</CopyButton>
      </CopyButtonGroup>
    );

    const group = container.firstChild;
    expect(group).toHaveClass('flex-col', 'items-start');
  });

  test('applies spacing classes', () => {
    const { container } = render(
      <CopyButtonGroup spacing="lg">
        <CopyButton content="test">Copy</CopyButton>
      </CopyButtonGroup>
    );

    const group = container.firstChild;
    expect(group).toHaveClass('gap-4');
  });
});

describe('useCopyButton Hook', () => {
  test('provides basic functionality', () => {
    render(<TestHookComponent />);

    expect(screen.getByTestId('status')).toHaveTextContent('idle');
    expect(screen.getByTestId('supported')).toHaveTextContent('true');
  });

  test('provides reset functionality', async () => {
    render(<TestHookComponent />);

    const resetButton = screen.getByText('Reset');
    await userEvent.click(resetButton);

    expect(screen.getByTestId('status')).toHaveTextContent('idle');
  });
});

describe('Accessibility', () => {
  test('has no accessibility violations', async () => {
    const { container } = renderCopyButton();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations when disabled', async () => {
    const { container } = renderCopyButton({ disabled: true });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has proper ARIA labels', () => {
    renderCopyButton({ copyLabel: 'Copy this content' });
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Copy this content');
  });

  test('has proper focus management', () => {
    renderCopyButton();
    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'focus-visible:outline-none',
      'focus-visible:ring-2'
    );
  });
});

describe('Component Display Names', () => {
  test('CopyButton has correct display name', () => {
    expect(CopyButton.displayName).toBe('CopyButton');
  });

  test('RecipeCopyButton has correct display name', () => {
    expect(RecipeCopyButton.displayName).toBe('RecipeCopyButton');
  });

  test('CopyButtonGroup has correct display name', () => {
    expect(CopyButtonGroup.displayName).toBe('CopyButtonGroup');
  });
});
