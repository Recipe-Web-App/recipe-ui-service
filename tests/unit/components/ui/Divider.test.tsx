import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  Divider,
  DividerWithText,
  DividerWithIcon,
  RecipeDivider,
  SectionDivider,
} from '@/components/ui/divider';
import type {
  DividerProps,
  DividerWithTextProps,
  DividerWithIconProps,
  RecipeDividerProps,
  SectionDividerProps,
} from '@/types/ui/divider';
import { Star, Heart, ChefHat } from 'lucide-react';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

/**
 * Helper function to render Divider with default props
 */
const renderDivider = (props: Partial<DividerProps> = {}) => {
  const defaultProps: DividerProps = {
    ...props,
  };

  return render(<Divider {...defaultProps} />);
};

/**
 * Helper function to render DividerWithText with default props
 */
const renderDividerWithText = (props: Partial<DividerWithTextProps> = {}) => {
  const defaultProps: DividerWithTextProps = {
    text: 'Test Text',
    ...props,
  };

  return render(<DividerWithText {...defaultProps} />);
};

/**
 * Helper function to render DividerWithIcon with default props
 */
const renderDividerWithIcon = (props: Partial<DividerWithIconProps> = {}) => {
  const defaultProps: DividerWithIconProps = {
    icon: <Star data-testid="test-icon" />,
    ...props,
  };

  return render(<DividerWithIcon {...defaultProps} />);
};

/**
 * Helper function to render RecipeDivider with default props
 */
const renderRecipeDivider = (props: Partial<RecipeDividerProps> = {}) => {
  const defaultProps: RecipeDividerProps = {
    ...props,
  };

  return render(<RecipeDivider {...defaultProps} />);
};

/**
 * Helper function to render SectionDivider with default props
 */
const renderSectionDivider = (props: Partial<SectionDividerProps> = {}) => {
  const defaultProps: SectionDividerProps = {
    section: 'ingredients',
    ...props,
  };

  return render(<SectionDivider {...defaultProps} />);
};

describe('Divider Component', () => {
  describe('Basic Rendering', () => {
    test('renders a div element by default', () => {
      renderDivider();
      const divider = screen.getByRole('presentation', { hidden: true });
      expect(divider).toBeInTheDocument();
      expect(divider.tagName).toBe('DIV');
    });

    test('applies default classes', () => {
      renderDivider();
      const divider = screen.getByRole('presentation', { hidden: true });
      expect(divider).toHaveClass(
        'flex-shrink-0',
        'w-full',
        'h-px',
        'border-t'
      );
    });

    test('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Divider ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Orientation Variants', () => {
    test('applies horizontal orientation classes', () => {
      renderDivider({ orientation: 'horizontal' });
      const divider = screen.getByRole('presentation', { hidden: true });
      expect(divider).toHaveClass('w-full', 'h-px', 'border-t');
    });

    test('applies vertical orientation classes', () => {
      renderDivider({ orientation: 'vertical' });
      const divider = screen.getByRole('presentation', { hidden: true });
      expect(divider).toHaveClass('h-full', 'w-px', 'border-l');
    });
  });

  describe('Style Variants', () => {
    test('applies solid style classes', () => {
      renderDivider({ style: 'solid' });
      const divider = screen.getByRole('presentation', { hidden: true });
      expect(divider).toHaveClass('border-solid');
    });

    test('applies dashed style classes', () => {
      renderDivider({ style: 'dashed' });
      const divider = screen.getByRole('presentation', { hidden: true });
      expect(divider).toHaveClass('border-dashed');
    });

    test('applies dotted style classes', () => {
      renderDivider({ style: 'dotted' });
      const divider = screen.getByRole('presentation', { hidden: true });
      expect(divider).toHaveClass('border-dotted');
    });

    test('applies double style classes', () => {
      renderDivider({ style: 'double' });
      const divider = screen.getByRole('presentation', { hidden: true });
      expect(divider).toHaveClass('border-double', 'border-t-[3px]');
    });
  });

  describe('Weight Variants', () => {
    test('applies thin weight classes (default)', () => {
      renderDivider({ weight: 'thin' });
      const divider = screen.getByRole('presentation', { hidden: true });
      expect(divider).not.toHaveClass('border-t-[1.5px]', 'border-t-2');
    });

    test('applies normal weight classes', () => {
      renderDivider({ weight: 'normal' });
      const divider = screen.getByRole('presentation', { hidden: true });
      expect(divider).toHaveClass('border-t-[1.5px]');
    });

    test('applies thick weight classes', () => {
      renderDivider({ weight: 'thick' });
      const divider = screen.getByRole('presentation', { hidden: true });
      expect(divider).toHaveClass('border-t-2');
    });
  });

  describe('Length Variants', () => {
    test('applies short length classes', () => {
      renderDivider({ length: 'short' });
      const divider = screen.getByRole('presentation', { hidden: true });
      expect(divider).toHaveClass('max-w-16');
    });

    test('applies normal length classes', () => {
      renderDivider({ length: 'normal' });
      const divider = screen.getByRole('presentation', { hidden: true });
      expect(divider).not.toHaveClass('max-w-16', 'min-w-32', 'w-full');
    });

    test('applies long length classes', () => {
      renderDivider({ length: 'long' });
      const divider = screen.getByRole('presentation', { hidden: true });
      expect(divider).toHaveClass('min-w-32');
    });

    test('applies full length classes', () => {
      renderDivider({ length: 'full' });
      const divider = screen.getByRole('presentation', { hidden: true });
      expect(divider).toHaveClass('w-full');
    });
  });

  describe('Spacing Variants', () => {
    test('applies tight spacing classes', () => {
      renderDivider({ spacing: 'tight' });
      const divider = screen.getByRole('presentation', { hidden: true });
      expect(divider).toHaveClass('my-1');
    });

    test('applies normal spacing classes', () => {
      renderDivider({ spacing: 'normal' });
      const divider = screen.getByRole('presentation', { hidden: true });
      expect(divider).toHaveClass('my-3');
    });

    test('applies loose spacing classes', () => {
      renderDivider({ spacing: 'loose' });
      const divider = screen.getByRole('presentation', { hidden: true });
      expect(divider).toHaveClass('my-6');
    });
  });

  describe('Color Variants', () => {
    test('applies default color classes', () => {
      renderDivider({ color: 'default' });
      const divider = screen.getByRole('presentation', { hidden: true });
      expect(divider).toHaveClass('border-border');
    });

    test('applies primary color classes', () => {
      renderDivider({ color: 'primary' });
      const divider = screen.getByRole('presentation', { hidden: true });
      expect(divider).toHaveClass('border-primary');
    });

    test('applies secondary color classes', () => {
      renderDivider({ color: 'secondary' });
      const divider = screen.getByRole('presentation', { hidden: true });
      expect(divider).toHaveClass('border-secondary');
    });
  });

  describe('Custom Props', () => {
    test('applies custom className', () => {
      renderDivider({ className: 'custom-class' });
      const divider = screen.getByRole('presentation', { hidden: true });
      expect(divider).toHaveClass('custom-class');
    });

    test('applies custom data attributes', () => {
      const { container } = renderDivider();
      const divider = container.firstChild as HTMLElement;
      divider.setAttribute('data-testid', 'custom-divider');
      expect(divider).toHaveAttribute('data-testid', 'custom-divider');
    });
  });

  describe('Accessibility', () => {
    test('has presentation role when decorative', () => {
      renderDivider({ decorative: true });
      const divider = screen.getByRole('presentation', { hidden: true });
      expect(divider).toHaveAttribute('aria-hidden', 'true');
    });

    test('has separator role when not decorative', () => {
      renderDivider({ decorative: false });
      const divider = screen.getByRole('separator');
      expect(divider).not.toHaveAttribute('aria-hidden');
    });

    test('applies aria-orientation for semantic dividers', () => {
      renderDivider({ decorative: false, orientation: 'vertical' });
      const divider = screen.getByRole('separator');
      expect(divider).toHaveAttribute('aria-orientation', 'vertical');
    });

    test('applies custom aria-label', () => {
      renderDivider({ decorative: false, 'aria-label': 'Section separator' });
      const divider = screen.getByRole('separator');
      expect(divider).toHaveAttribute('aria-label', 'Section separator');
    });

    test('has no accessibility violations', async () => {
      const { container } = renderDivider();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});

describe('DividerWithText Component', () => {
  describe('Basic Rendering', () => {
    test('renders text content', () => {
      renderDividerWithText({ text: 'OR' });
      expect(screen.getByText('OR')).toBeInTheDocument();
    });

    test('renders with divider elements', () => {
      const { container } = renderDividerWithText({ text: 'OR' });
      const dividers = container.querySelectorAll('[role="presentation"]');
      expect(dividers.length).toBeGreaterThanOrEqual(2); // At least one on each side
    });

    test('applies correct container classes', () => {
      renderDividerWithText({ text: 'OR' });
      const container = screen.getByText('OR').parentElement;
      expect(container).toHaveClass('relative', 'flex', 'items-center');
    });
  });

  describe('Text Position', () => {
    test('centers text by default', () => {
      renderDividerWithText({ text: 'OR' });
      const container = screen.getByText('OR').parentElement;
      expect(container).toHaveClass('justify-center');
    });

    test('positions text at start', () => {
      renderDividerWithText({ text: 'Beginning', textPosition: 'start' });
      const container = screen.getByText('Beginning').parentElement;
      expect(container).toHaveClass('justify-start');
    });

    test('positions text at end', () => {
      renderDividerWithText({ text: 'End', textPosition: 'end' });
      const container = screen.getByText('End').parentElement;
      expect(container).toHaveClass('justify-end');
    });
  });

  describe('Text Styling', () => {
    test('applies custom text styling', () => {
      renderDividerWithText({
        text: 'INGREDIENTS',
        textProps: {
          size: 'lg',
          weight: 'semibold',
          transform: 'uppercase',
          color: 'primary',
        },
      });

      const text = screen.getByText('INGREDIENTS');
      expect(text).toHaveClass(
        'text-base',
        'font-semibold',
        'uppercase',
        'text-primary'
      );
    });
  });

  describe('Accessibility', () => {
    test('has correct ARIA attributes when decorative', () => {
      renderDividerWithText({ text: 'OR', decorative: true });
      const containers = screen.getAllByRole('presentation', { hidden: true });
      const mainContainer = containers.find(el =>
        el.classList.contains('relative')
      );
      expect(mainContainer).toHaveAttribute('aria-hidden', 'true');
      expect(mainContainer).toHaveAttribute('role', 'presentation');
    });

    test('has correct ARIA attributes when semantic', () => {
      renderDividerWithText({ text: 'Section Break', decorative: false });
      const separators = screen.getAllByRole('separator');
      const mainSeparator = separators[0]; // The container
      expect(mainSeparator).toHaveAttribute('aria-label', 'Section Break');
    });

    test('has no accessibility violations', async () => {
      const { container } = renderDividerWithText({ text: 'Test' });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});

describe('DividerWithIcon Component', () => {
  describe('Basic Rendering', () => {
    test('renders icon content', () => {
      renderDividerWithIcon();
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    test('renders with divider elements', () => {
      const { container } = renderDividerWithIcon();
      const dividers = container.querySelectorAll('[role="presentation"]');
      expect(dividers.length).toBeGreaterThanOrEqual(2);
    });

    test('applies icon container classes', () => {
      renderDividerWithIcon();
      const icon = screen.getByTestId('test-icon');
      const iconContainer = icon.parentElement;
      expect(iconContainer).toHaveClass(
        'flex-shrink-0',
        'bg-background',
        'flex',
        'items-center'
      );
    });
  });

  describe('Icon Position', () => {
    test('centers icon by default', () => {
      renderDividerWithIcon();
      const icon = screen.getByTestId('test-icon');
      const container = icon.closest('.relative');
      expect(container).toHaveClass('justify-center');
    });

    test('positions icon at start', () => {
      renderDividerWithIcon({ textPosition: 'start' });
      const icon = screen.getByTestId('test-icon');
      const container = icon.closest('.relative');
      expect(container).toHaveClass('justify-start');
    });
  });

  describe('Icon Styling', () => {
    test('applies custom icon styling', () => {
      renderDividerWithIcon({
        iconProps: {
          size: 'lg',
          variant: 'filled',
        },
      });

      const icon = screen.getByTestId('test-icon');
      const iconContainer = icon.parentElement;
      expect(iconContainer).toHaveClass(
        'h-10',
        'w-10',
        'bg-primary',
        'text-primary-foreground'
      );
    });
  });

  describe('Custom Icons', () => {
    test('renders custom icon elements', () => {
      renderDividerWithIcon({
        icon: <Heart data-testid="heart-icon" className="h-4 w-4" />,
      });
      expect(screen.getByTestId('heart-icon')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has correct ARIA attributes', () => {
      renderDividerWithIcon({ 'aria-label': 'Decorative separator' });
      const separators = screen.getAllByRole('presentation', { hidden: true });
      const mainContainer = separators.find(el =>
        el.classList.contains('relative')
      );
      expect(mainContainer).toHaveAttribute('aria-hidden', 'true');
    });

    test('has no accessibility violations', async () => {
      const { container } = renderDividerWithIcon();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});

describe('RecipeDivider Component', () => {
  describe('Basic Rendering', () => {
    test('renders with default recipe context', () => {
      renderRecipeDivider();
      const divider = screen.getByRole('presentation', { hidden: true });
      expect(divider).toBeInTheDocument();
    });

    test('applies recipe-specific classes', () => {
      renderRecipeDivider({ context: 'ingredient-group' });
      const divider = screen.getByRole('presentation', { hidden: true });
      expect(divider).toHaveClass('my-4', 'border-primary/20');
    });
  });

  describe('Context Variants', () => {
    test('applies ingredient-group context classes', () => {
      renderRecipeDivider({ context: 'ingredient-group' });
      const divider = screen.getByRole('presentation', { hidden: true });
      expect(divider).toHaveClass('border-primary/20', 'before:bg-primary/40');
    });

    test('applies instruction-step context classes', () => {
      renderRecipeDivider({ context: 'instruction-step' });
      const divider = screen.getByRole('presentation', { hidden: true });
      expect(divider).toHaveClass('my-6', 'border-secondary/30');
    });

    test('applies nutrition-group context classes', () => {
      renderRecipeDivider({ context: 'nutrition-group' });
      const divider = screen.getByRole('presentation', { hidden: true });
      expect(divider).toHaveClass('my-3', 'border-accent/25');
    });

    test('applies recipe-section context classes', () => {
      renderRecipeDivider({ context: 'recipe-section' });
      const divider = screen.getByRole('presentation', { hidden: true });
      expect(divider).toHaveClass('my-8', 'border-border');
    });
  });

  describe('Emphasis Variants', () => {
    test('applies subtle emphasis', () => {
      renderRecipeDivider({ emphasis: 'subtle' });
      const divider = screen.getByRole('presentation', { hidden: true });
      expect(divider).toHaveClass('opacity-40');
    });

    test('applies normal emphasis', () => {
      renderRecipeDivider({ emphasis: 'normal' });
      const divider = screen.getByRole('presentation', { hidden: true });
      expect(divider).toHaveClass('opacity-100');
    });

    test('applies strong emphasis', () => {
      renderRecipeDivider({ emphasis: 'strong' });
      const divider = screen.getByRole('presentation', { hidden: true });
      expect(divider).toHaveClass('opacity-100', 'border-2');
    });
  });

  describe('With Label', () => {
    test('renders with label when showLabel is true', () => {
      renderRecipeDivider({
        label: 'Wet Ingredients',
        showLabel: true,
      });
      expect(screen.getByText('Wet Ingredients')).toBeInTheDocument();
    });

    test('does not render label when showLabel is false', () => {
      renderRecipeDivider({
        label: 'Wet Ingredients',
        showLabel: false,
      });
      expect(screen.queryByText('Wet Ingredients')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has no accessibility violations', async () => {
      const { container } = renderRecipeDivider();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});

describe('SectionDivider Component', () => {
  describe('Basic Rendering', () => {
    test('renders simple section divider', () => {
      renderSectionDivider({ section: 'ingredients' });
      const divider = screen.getByRole('presentation', { hidden: true });
      expect(divider).toBeInTheDocument();
    });

    test('renders with title and subtitle', () => {
      renderSectionDivider({
        section: 'ingredients',
        title: 'Ingredients',
        subtitle: 'Everything you need',
      });
      expect(screen.getByText('Ingredients')).toBeInTheDocument();
      expect(screen.getByText('Everything you need')).toBeInTheDocument();
    });

    test('renders with icon', () => {
      renderSectionDivider({
        section: 'ingredients',
        title: 'Ingredients',
        icon: <ChefHat data-testid="chef-icon" />,
      });
      expect(screen.getByTestId('chef-icon')).toBeInTheDocument();
    });
  });

  describe('Collapsible Functionality', () => {
    test('renders collapse button when collapsible', () => {
      renderSectionDivider({
        section: 'ingredients',
        title: 'Ingredients',
        collapsible: true,
      });
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    test('starts collapsed when defaultCollapsed is true', () => {
      renderSectionDivider({
        section: 'ingredients',
        title: 'Ingredients',
        collapsible: true,
        defaultCollapsed: true,
      });
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    test('toggles collapsed state on button click', async () => {
      const user = userEvent.setup();
      renderSectionDivider({
        section: 'ingredients',
        title: 'Ingredients',
        collapsible: true,
      });

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-expanded', 'true');

      await user.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'false');

      await user.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    test('calls onToggleCollapse callback', async () => {
      const user = userEvent.setup();
      const handleToggle = jest.fn();
      renderSectionDivider({
        section: 'ingredients',
        title: 'Ingredients',
        collapsible: true,
        onToggleCollapse: handleToggle,
      });

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleToggle).toHaveBeenCalledWith(true);
    });
  });

  describe('Section Types', () => {
    test('maps section to correct context', () => {
      renderSectionDivider({ section: 'nutrition' });
      const divider = screen.getByRole('presentation', { hidden: true });
      expect(divider).toHaveClass('my-8'); // recipe-section context spacing (default fallback)
    });
  });

  describe('Accessibility', () => {
    test('has proper button accessibility', () => {
      renderSectionDivider({
        section: 'ingredients',
        title: 'Ingredients',
        collapsible: true,
      });
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute(
        'aria-label',
        'Collapse ingredients section'
      );
    });

    test('has no accessibility violations', async () => {
      const { container } = renderSectionDivider({
        section: 'ingredients',
        title: 'Ingredients',
        subtitle: 'Test subtitle',
        collapsible: true,
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});

describe('Compound Variants', () => {
  test('vertical orientation with different weights', () => {
    renderDivider({ orientation: 'vertical', weight: 'thick' });
    const divider = screen.getByRole('presentation', { hidden: true });
    expect(divider).toHaveClass('border-l-2', 'h-full', 'w-px');
    expect(divider).not.toHaveClass('border-t-2');
  });

  test('vertical orientation with different spacing', () => {
    renderDivider({ orientation: 'vertical', spacing: 'loose' });
    const divider = screen.getByRole('presentation', { hidden: true });
    expect(divider).toHaveClass('mx-6', 'my-0');
  });

  test('combines multiple variants correctly', () => {
    renderDivider({
      orientation: 'horizontal',
      style: 'dashed',
      weight: 'thick',
      color: 'primary',
      spacing: 'loose',
    });
    const divider = screen.getByRole('presentation', { hidden: true });
    expect(divider).toHaveClass(
      'border-dashed',
      'border-t-2',
      'border-primary',
      'my-6'
    );
  });
});
