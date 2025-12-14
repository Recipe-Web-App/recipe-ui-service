import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InstructionStep } from '@/components/recipe/view/InstructionStep';

describe('InstructionStep', () => {
  const defaultProps = {
    stepNumber: 1,
    instruction: 'Mix the flour and sugar together.',
  };

  describe('Rendering', () => {
    it('should render the component', () => {
      render(<InstructionStep {...defaultProps} />);

      expect(screen.getByTestId('instruction-step')).toBeInTheDocument();
      expect(screen.getByTestId('step-toggle')).toBeInTheDocument();
      expect(screen.getByTestId('step-instruction')).toBeInTheDocument();
    });

    it('should display the step number when not completed', () => {
      render(<InstructionStep {...defaultProps} isCompleted={false} />);

      expect(screen.getByTestId('step-toggle')).toHaveTextContent('1');
    });

    it('should display instruction text', () => {
      render(<InstructionStep {...defaultProps} />);

      expect(screen.getByTestId('step-instruction')).toHaveTextContent(
        'Mix the flour and sugar together.'
      );
    });

    it('should render with custom className', () => {
      render(<InstructionStep {...defaultProps} className="custom-class" />);

      expect(screen.getByTestId('instruction-step')).toHaveClass(
        'custom-class'
      );
    });

    it('should forward ref to li element', () => {
      const ref = React.createRef<HTMLLIElement>();
      render(<InstructionStep {...defaultProps} ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLLIElement);
    });
  });

  describe('Completed State', () => {
    it('should show check icon when completed', () => {
      render(<InstructionStep {...defaultProps} isCompleted={true} />);

      const toggle = screen.getByTestId('step-toggle');
      expect(toggle.querySelector('svg')).toBeInTheDocument();
      expect(toggle).not.toHaveTextContent('1');
    });

    it('should apply line-through to instruction when completed', () => {
      render(<InstructionStep {...defaultProps} isCompleted={true} />);

      expect(screen.getByTestId('step-instruction')).toHaveClass(
        'line-through',
        'text-muted-foreground'
      );
    });

    it('should apply background color when completed', () => {
      render(<InstructionStep {...defaultProps} isCompleted={true} />);

      expect(screen.getByTestId('instruction-step')).toHaveClass('bg-muted/50');
    });

    it('should not have line-through when not completed', () => {
      render(<InstructionStep {...defaultProps} isCompleted={false} />);

      expect(screen.getByTestId('step-instruction')).not.toHaveClass(
        'line-through'
      );
    });

    it('should set aria-pressed based on completion', () => {
      const { rerender } = render(
        <InstructionStep {...defaultProps} isCompleted={false} />
      );

      expect(screen.getByTestId('step-toggle')).toHaveAttribute(
        'aria-pressed',
        'false'
      );

      rerender(<InstructionStep {...defaultProps} isCompleted={true} />);

      expect(screen.getByTestId('step-toggle')).toHaveAttribute(
        'aria-pressed',
        'true'
      );
    });
  });

  describe('Toggle Interaction', () => {
    it('should call onToggle with stepNumber when clicked', async () => {
      const user = userEvent.setup();
      const onToggle = jest.fn();

      render(<InstructionStep {...defaultProps} onToggle={onToggle} />);

      await user.click(screen.getByTestId('step-toggle'));
      expect(onToggle).toHaveBeenCalledWith(1);
    });

    it('should pass correct stepNumber to onToggle', async () => {
      const user = userEvent.setup();
      const onToggle = jest.fn();

      render(
        <InstructionStep {...defaultProps} stepNumber={5} onToggle={onToggle} />
      );

      await user.click(screen.getByTestId('step-toggle'));
      expect(onToggle).toHaveBeenCalledWith(5);
    });

    it('should not throw when onToggle is undefined', async () => {
      const user = userEvent.setup();

      render(<InstructionStep {...defaultProps} />);

      await user.click(screen.getByTestId('step-toggle'));
      // Should not throw
    });
  });

  describe('Timer Display', () => {
    it('should show timer when timerSeconds is provided', () => {
      render(<InstructionStep {...defaultProps} timerSeconds={180} />);

      expect(screen.getByTestId('step-timer')).toBeInTheDocument();
    });

    it('should hide timer when timerSeconds is null', () => {
      render(<InstructionStep {...defaultProps} timerSeconds={null} />);

      expect(screen.queryByTestId('step-timer')).not.toBeInTheDocument();
    });

    it('should hide timer when timerSeconds is undefined', () => {
      render(<InstructionStep {...defaultProps} />);

      expect(screen.queryByTestId('step-timer')).not.toBeInTheDocument();
    });

    it('should hide timer when timerSeconds is 0', () => {
      render(<InstructionStep {...defaultProps} timerSeconds={0} />);

      expect(screen.queryByTestId('step-timer')).not.toBeInTheDocument();
    });

    it('should format minutes only correctly', () => {
      render(<InstructionStep {...defaultProps} timerSeconds={300} />);

      expect(screen.getByTestId('step-timer')).toHaveTextContent('5 min');
    });

    it('should format seconds only correctly', () => {
      render(<InstructionStep {...defaultProps} timerSeconds={45} />);

      expect(screen.getByTestId('step-timer')).toHaveTextContent('45 sec');
    });

    it('should format minutes and seconds correctly', () => {
      render(<InstructionStep {...defaultProps} timerSeconds={150} />);

      expect(screen.getByTestId('step-timer')).toHaveTextContent(
        '2 min 30 sec'
      );
    });
  });

  describe('Accessibility', () => {
    it('should have correct aria-label when not completed', () => {
      render(
        <InstructionStep {...defaultProps} stepNumber={3} isCompleted={false} />
      );

      expect(screen.getByTestId('step-toggle')).toHaveAttribute(
        'aria-label',
        'Mark step 3 as complete'
      );
    });

    it('should have correct aria-label when completed', () => {
      render(
        <InstructionStep {...defaultProps} stepNumber={3} isCompleted={true} />
      );

      expect(screen.getByTestId('step-toggle')).toHaveAttribute(
        'aria-label',
        'Mark step 3 as incomplete'
      );
    });

    it('should have button type attribute', () => {
      render(<InstructionStep {...defaultProps} />);

      expect(screen.getByTestId('step-toggle')).toHaveAttribute(
        'type',
        'button'
      );
    });

    it('should have aria-hidden on timer icon', () => {
      render(<InstructionStep {...defaultProps} timerSeconds={60} />);

      const icon = screen.getByTestId('step-timer').querySelector('svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Styling', () => {
    it('should have border and padding', () => {
      render(<InstructionStep {...defaultProps} />);

      expect(screen.getByTestId('instruction-step')).toHaveClass(
        'rounded-lg',
        'border',
        'p-4'
      );
    });

    it('should have flex layout', () => {
      render(<InstructionStep {...defaultProps} />);

      expect(screen.getByTestId('instruction-step')).toHaveClass(
        'flex',
        'gap-4'
      );
    });

    it('should have transition on container', () => {
      render(<InstructionStep {...defaultProps} />);

      expect(screen.getByTestId('instruction-step')).toHaveClass(
        'transition-colors'
      );
    });

    it('should have hover effect on toggle button', () => {
      render(<InstructionStep {...defaultProps} />);

      expect(screen.getByTestId('step-toggle')).toHaveClass(
        'hover:border-primary',
        'hover:text-primary'
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long instructions', () => {
      const longInstruction =
        'This is a very long instruction that describes in detail all the steps needed to properly mix the ingredients together making sure everything is well combined and there are no lumps remaining in the batter.';

      render(
        <InstructionStep {...defaultProps} instruction={longInstruction} />
      );

      expect(screen.getByTestId('step-instruction')).toHaveTextContent(
        longInstruction
      );
    });

    it('should handle large step numbers', () => {
      render(<InstructionStep {...defaultProps} stepNumber={99} />);

      expect(screen.getByTestId('step-toggle')).toHaveTextContent('99');
    });

    it('should handle large timer values', () => {
      render(<InstructionStep {...defaultProps} timerSeconds={7200} />);

      expect(screen.getByTestId('step-timer')).toHaveTextContent('120 min');
    });
  });
});
