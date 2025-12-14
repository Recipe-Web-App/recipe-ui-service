import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ServingsScaler } from '@/components/recipe/view/ServingsScaler';

describe('ServingsScaler', () => {
  const defaultProps = {
    value: 4,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the component', () => {
      render(<ServingsScaler {...defaultProps} />);

      expect(screen.getByTestId('servings-scaler')).toBeInTheDocument();
      expect(screen.getByText('Servings')).toBeInTheDocument();
      expect(screen.getByTestId('servings-value')).toHaveTextContent('4');
    });

    it('should render with custom className', () => {
      render(<ServingsScaler {...defaultProps} className="custom-class" />);

      expect(screen.getByTestId('servings-scaler')).toHaveClass('custom-class');
    });

    it('should forward ref to container', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<ServingsScaler {...defaultProps} ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should display decrease and increase buttons', () => {
      render(<ServingsScaler {...defaultProps} />);

      expect(screen.getByTestId('decrease-button')).toBeInTheDocument();
      expect(screen.getByTestId('increase-button')).toBeInTheDocument();
    });
  });

  describe('Decrease Button', () => {
    it('should call onChange with decremented value when clicked', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();

      render(<ServingsScaler value={4} onChange={onChange} />);

      await user.click(screen.getByTestId('decrease-button'));
      expect(onChange).toHaveBeenCalledWith(3);
    });

    it('should be disabled when value equals min', () => {
      render(<ServingsScaler value={1} onChange={jest.fn()} min={1} />);

      expect(screen.getByTestId('decrease-button')).toBeDisabled();
    });

    it('should be disabled when value is below min', () => {
      render(<ServingsScaler value={0} onChange={jest.fn()} min={1} />);

      expect(screen.getByTestId('decrease-button')).toBeDisabled();
    });

    it('should not call onChange when disabled', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();

      render(<ServingsScaler value={1} onChange={onChange} min={1} />);

      await user.click(screen.getByTestId('decrease-button'));
      expect(onChange).not.toHaveBeenCalled();
    });

    it('should have correct aria-label', () => {
      render(<ServingsScaler {...defaultProps} />);

      expect(screen.getByTestId('decrease-button')).toHaveAttribute(
        'aria-label',
        'Decrease servings'
      );
    });
  });

  describe('Increase Button', () => {
    it('should call onChange with incremented value when clicked', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();

      render(<ServingsScaler value={4} onChange={onChange} />);

      await user.click(screen.getByTestId('increase-button'));
      expect(onChange).toHaveBeenCalledWith(5);
    });

    it('should be disabled when value equals max', () => {
      render(<ServingsScaler value={100} onChange={jest.fn()} max={100} />);

      expect(screen.getByTestId('increase-button')).toBeDisabled();
    });

    it('should be disabled when value is above max', () => {
      render(<ServingsScaler value={101} onChange={jest.fn()} max={100} />);

      expect(screen.getByTestId('increase-button')).toBeDisabled();
    });

    it('should not call onChange when disabled', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();

      render(<ServingsScaler value={100} onChange={onChange} max={100} />);

      await user.click(screen.getByTestId('increase-button'));
      expect(onChange).not.toHaveBeenCalled();
    });

    it('should have correct aria-label', () => {
      render(<ServingsScaler {...defaultProps} />);

      expect(screen.getByTestId('increase-button')).toHaveAttribute(
        'aria-label',
        'Increase servings'
      );
    });
  });

  describe('Value Display', () => {
    it('should display the current value', () => {
      render(<ServingsScaler value={8} onChange={jest.fn()} />);

      expect(screen.getByTestId('servings-value')).toHaveTextContent('8');
    });

    it('should update display when value prop changes', () => {
      const { rerender } = render(
        <ServingsScaler value={4} onChange={jest.fn()} />
      );

      expect(screen.getByTestId('servings-value')).toHaveTextContent('4');

      rerender(<ServingsScaler value={6} onChange={jest.fn()} />);

      expect(screen.getByTestId('servings-value')).toHaveTextContent('6');
    });

    it('should handle large values', () => {
      render(<ServingsScaler value={999} onChange={jest.fn()} max={1000} />);

      expect(screen.getByTestId('servings-value')).toHaveTextContent('999');
    });
  });

  describe('Min/Max Boundaries', () => {
    it('should use default min of 1', () => {
      render(<ServingsScaler value={1} onChange={jest.fn()} />);

      expect(screen.getByTestId('decrease-button')).toBeDisabled();
    });

    it('should use default max of 100', () => {
      render(<ServingsScaler value={100} onChange={jest.fn()} />);

      expect(screen.getByTestId('increase-button')).toBeDisabled();
    });

    it('should respect custom min', () => {
      render(<ServingsScaler value={5} onChange={jest.fn()} min={5} />);

      expect(screen.getByTestId('decrease-button')).toBeDisabled();
    });

    it('should respect custom max', () => {
      render(<ServingsScaler value={10} onChange={jest.fn()} max={10} />);

      expect(screen.getByTestId('increase-button')).toBeDisabled();
    });

    it('should allow increment when below max', () => {
      render(<ServingsScaler value={9} onChange={jest.fn()} max={10} />);

      expect(screen.getByTestId('increase-button')).not.toBeDisabled();
    });

    it('should allow decrement when above min', () => {
      render(<ServingsScaler value={6} onChange={jest.fn()} min={5} />);

      expect(screen.getByTestId('decrease-button')).not.toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have aria-hidden on icons', () => {
      render(<ServingsScaler {...defaultProps} />);

      const icons = document.querySelectorAll('[aria-hidden="true"]');
      expect(icons.length).toBe(3); // Users, Minus, Plus
    });

    it('should have aria-live on value display', () => {
      render(<ServingsScaler {...defaultProps} />);

      expect(screen.getByTestId('servings-value')).toHaveAttribute(
        'aria-live',
        'polite'
      );
    });

    it('should have aria-labelledby on value display', () => {
      render(<ServingsScaler {...defaultProps} />);

      expect(screen.getByTestId('servings-value')).toHaveAttribute(
        'aria-labelledby',
        'servings-label'
      );
    });

    it('should have id on label for association', () => {
      render(<ServingsScaler {...defaultProps} />);

      expect(screen.getByText('Servings')).toHaveAttribute(
        'id',
        'servings-label'
      );
    });
  });

  describe('Styling', () => {
    it('should have border and padding', () => {
      render(<ServingsScaler {...defaultProps} />);

      const container = screen.getByTestId('servings-scaler');
      expect(container).toHaveClass('rounded-lg', 'border', 'p-3');
    });

    it('should have flex layout', () => {
      render(<ServingsScaler {...defaultProps} />);

      const container = screen.getByTestId('servings-scaler');
      expect(container).toHaveClass('flex', 'items-center', 'gap-3');
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid clicking', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();

      render(<ServingsScaler value={5} onChange={onChange} />);

      const increaseBtn = screen.getByTestId('increase-button');
      await user.click(increaseBtn);
      await user.click(increaseBtn);
      await user.click(increaseBtn);

      expect(onChange).toHaveBeenCalledTimes(3);
    });

    it('should handle value of 0 with min of 0', () => {
      render(<ServingsScaler value={0} onChange={jest.fn()} min={0} />);

      expect(screen.getByTestId('servings-value')).toHaveTextContent('0');
      expect(screen.getByTestId('decrease-button')).toBeDisabled();
    });
  });
});
