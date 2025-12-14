import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IngredientItem } from '@/components/recipe/view/IngredientItem';

describe('IngredientItem', () => {
  const defaultProps = {
    ingredientId: 1,
    name: 'Flour',
    quantity: '250',
    unit: 'g',
  };

  describe('Rendering', () => {
    it('should render the component', () => {
      render(<IngredientItem {...defaultProps} />);

      expect(screen.getByTestId('ingredient-item')).toBeInTheDocument();
      expect(screen.getByTestId('ingredient-button')).toBeInTheDocument();
      expect(screen.getByTestId('ingredient-checkbox')).toBeInTheDocument();
    });

    it('should display ingredient text', () => {
      render(<IngredientItem {...defaultProps} />);

      expect(screen.getByTestId('ingredient-text')).toHaveTextContent(
        '250 g Flour'
      );
    });

    it('should display quantity in bold', () => {
      render(<IngredientItem {...defaultProps} />);

      const strong = screen
        .getByTestId('ingredient-text')
        .querySelector('strong');
      expect(strong).toHaveTextContent('250');
    });

    it('should render with custom className', () => {
      render(<IngredientItem {...defaultProps} className="custom-class" />);

      expect(screen.getByTestId('ingredient-item')).toHaveClass('custom-class');
    });

    it('should forward ref to li element', () => {
      const ref = React.createRef<HTMLLIElement>();
      render(<IngredientItem {...defaultProps} ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLLIElement);
    });
  });

  describe('Optional Marker', () => {
    it('should show optional marker when isOptional is true', () => {
      render(<IngredientItem {...defaultProps} isOptional={true} />);

      expect(screen.getByTestId('optional-marker')).toBeInTheDocument();
      expect(screen.getByTestId('optional-marker')).toHaveTextContent(
        '(optional)'
      );
    });

    it('should hide optional marker when isOptional is false', () => {
      render(<IngredientItem {...defaultProps} isOptional={false} />);

      expect(screen.queryByTestId('optional-marker')).not.toBeInTheDocument();
    });

    it('should hide optional marker by default', () => {
      render(<IngredientItem {...defaultProps} />);

      expect(screen.queryByTestId('optional-marker')).not.toBeInTheDocument();
    });
  });

  describe('Checked State', () => {
    it('should display unchecked state by default', () => {
      render(<IngredientItem {...defaultProps} />);

      const checkbox = screen.getByTestId('ingredient-checkbox');
      expect(checkbox).toHaveClass('border-input');
      expect(checkbox).not.toHaveClass('bg-primary');
      expect(checkbox.querySelector('svg')).not.toBeInTheDocument();
    });

    it('should display checked state when isChecked is true', () => {
      render(<IngredientItem {...defaultProps} isChecked={true} />);

      const checkbox = screen.getByTestId('ingredient-checkbox');
      expect(checkbox).toHaveClass('border-primary', 'bg-primary');
      expect(checkbox.querySelector('svg')).toBeInTheDocument();
    });

    it('should apply line-through when checked', () => {
      render(<IngredientItem {...defaultProps} isChecked={true} />);

      const button = screen.getByTestId('ingredient-button');
      expect(button).toHaveClass('line-through', 'text-muted-foreground');
    });

    it('should not apply line-through when unchecked', () => {
      render(<IngredientItem {...defaultProps} isChecked={false} />);

      const button = screen.getByTestId('ingredient-button');
      expect(button).not.toHaveClass('line-through');
    });

    it('should set aria-pressed based on isChecked', () => {
      const { rerender } = render(
        <IngredientItem {...defaultProps} isChecked={false} />
      );

      expect(screen.getByTestId('ingredient-button')).toHaveAttribute(
        'aria-pressed',
        'false'
      );

      rerender(<IngredientItem {...defaultProps} isChecked={true} />);

      expect(screen.getByTestId('ingredient-button')).toHaveAttribute(
        'aria-pressed',
        'true'
      );
    });
  });

  describe('Toggle Interaction', () => {
    it('should call onToggle with ingredientId when clicked', async () => {
      const user = userEvent.setup();
      const onToggle = jest.fn();

      render(<IngredientItem {...defaultProps} onToggle={onToggle} />);

      await user.click(screen.getByTestId('ingredient-button'));
      expect(onToggle).toHaveBeenCalledWith(1);
    });

    it('should not throw when onToggle is undefined', async () => {
      const user = userEvent.setup();

      render(<IngredientItem {...defaultProps} />);

      await user.click(screen.getByTestId('ingredient-button'));
      // Should not throw
    });

    it('should pass correct ingredientId to onToggle', async () => {
      const user = userEvent.setup();
      const onToggle = jest.fn();

      render(
        <IngredientItem
          {...defaultProps}
          ingredientId={42}
          onToggle={onToggle}
        />
      );

      await user.click(screen.getByTestId('ingredient-button'));
      expect(onToggle).toHaveBeenCalledWith(42);
    });
  });

  describe('Accessibility', () => {
    it('should have button type attribute', () => {
      render(<IngredientItem {...defaultProps} />);

      expect(screen.getByTestId('ingredient-button')).toHaveAttribute(
        'type',
        'button'
      );
    });

    it('should have aria-hidden on checkbox visual', () => {
      render(<IngredientItem {...defaultProps} />);

      expect(screen.getByTestId('ingredient-checkbox')).toHaveAttribute(
        'aria-hidden',
        'true'
      );
    });
  });

  describe('Styling', () => {
    it('should have hover effect class', () => {
      render(<IngredientItem {...defaultProps} />);

      const button = screen.getByTestId('ingredient-button');
      expect(button).toHaveClass('hover:bg-muted/50');
    });

    it('should have transition class', () => {
      render(<IngredientItem {...defaultProps} />);

      const button = screen.getByTestId('ingredient-button');
      expect(button).toHaveClass('transition-colors');
    });

    it('should have flex layout', () => {
      render(<IngredientItem {...defaultProps} />);

      const button = screen.getByTestId('ingredient-button');
      expect(button).toHaveClass('flex', 'items-center', 'gap-3');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty unit', () => {
      render(<IngredientItem {...defaultProps} unit="" />);

      // With empty unit, text content normalizes spaces
      const text = screen.getByTestId('ingredient-text');
      expect(text).toHaveTextContent('250');
      expect(text).toHaveTextContent('Flour');
    });

    it('should handle decimal quantity', () => {
      render(<IngredientItem {...defaultProps} quantity="1.5" />);

      expect(screen.getByTestId('ingredient-text')).toHaveTextContent('1.5');
    });

    it('should handle long ingredient names', () => {
      render(
        <IngredientItem
          {...defaultProps}
          name="Extra Virgin Olive Oil Cold Pressed First Harvest"
        />
      );

      expect(screen.getByTestId('ingredient-text')).toHaveTextContent(
        'Extra Virgin Olive Oil Cold Pressed First Harvest'
      );
    });
  });
});
