import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Textarea,
  RecipeTextarea,
  AutoTextarea,
} from '@/components/ui/textarea';

describe('Textarea', () => {
  it('renders correctly with default props', () => {
    render(<Textarea />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveClass('w-full', 'rounded-md', 'border');
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(<Textarea variant="destructive" />);
    let textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('border-destructive', 'bg-destructive/10');

    rerender(<Textarea variant="success" />);
    textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('border-success', 'bg-success/10');

    rerender(<Textarea variant="warning" />);
    textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('border-warning', 'bg-warning/10');

    rerender(<Textarea variant="ghost" />);
    textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('border-transparent', 'bg-transparent');
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(<Textarea size="sm" />);
    let textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('text-xs', 'px-2', 'py-1');

    rerender(<Textarea size="lg" />);
    textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('text-base', 'px-4', 'py-3');
  });

  it('renders with label', () => {
    render(<Textarea label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
  });

  it('renders with required indicator', () => {
    render(<Textarea label="Required Field" required />);
    const label = screen.getByText('Required Field');
    expect(label).toHaveClass('after:content-["*"]', 'after:text-destructive');
  });

  it('handles controlled value correctly', () => {
    const handleChange = jest.fn();
    render(<Textarea value="test value" onChange={handleChange} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue('test value');

    fireEvent.change(textarea, { target: { value: 'new value' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('handles uncontrolled value correctly', () => {
    render(<Textarea defaultValue="default value" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue('default value');
  });

  it('displays helper text', () => {
    render(<Textarea helperText="This is helper text" />);
    expect(screen.getByText('This is helper text')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<Textarea errorMessage="This is an error" />);
    expect(screen.getByText('This is an error')).toBeInTheDocument();
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea).toHaveClass('border-destructive');
  });

  it('displays success message', () => {
    render(<Textarea successMessage="This is success" />);
    expect(screen.getByText('This is success')).toBeInTheDocument();
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('border-success');
  });

  it('displays warning message', () => {
    render(<Textarea warningMessage="This is a warning" />);
    expect(screen.getByText('This is a warning')).toBeInTheDocument();
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('border-warning');
  });

  it('shows character count when enabled', () => {
    render(<Textarea showCharacterCount defaultValue="test" />);
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('shows character count with max length', () => {
    render(<Textarea maxLength={100} showCharacterCount defaultValue="test" />);
    expect(screen.getByText('4 / 100')).toBeInTheDocument();
  });

  it('prevents typing beyond max length', async () => {
    const user = userEvent.setup();
    render(<Textarea maxLength={5} />);

    const textarea = screen.getByRole('textbox');
    await user.type(textarea, '123456789');

    expect(textarea).toHaveValue('12345');
  });

  it('handles disabled state', () => {
    render(<Textarea disabled label="Disabled Field" />);
    const textarea = screen.getByRole('textbox');
    const label = screen.getByText('Disabled Field');

    expect(textarea).toBeDisabled();
    expect(textarea).toHaveClass(
      'disabled:cursor-not-allowed',
      'disabled:opacity-50'
    );
    expect(label).toHaveClass('text-muted-foreground', 'cursor-not-allowed');
  });

  it('supports resize variants', () => {
    const { rerender } = render(<Textarea resize="none" />);
    let textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('resize-none');

    rerender(<Textarea resize="vertical" />);
    textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('resize-y');

    rerender(<Textarea resize="horizontal" />);
    textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('resize-x');

    rerender(<Textarea resize="both" />);
    textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('resize');
  });

  it('handles auto-resize correctly', () => {
    const { container } = render(<Textarea autoResize />);
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveClass('resize-none');
  });

  it('has proper accessibility attributes', () => {
    render(
      <Textarea label="Accessible Textarea" helperText="Helper text" required />
    );

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('aria-required', 'true');
    expect(textarea).toHaveAttribute('aria-describedby');
  });
});

describe('RecipeTextarea', () => {
  it('renders correctly with recipe type', () => {
    render(<RecipeTextarea type="description" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('border-primary/20', 'bg-primary/5');
  });

  it('applies correct styling for different recipe types', () => {
    const { rerender } = render(<RecipeTextarea type="instructions" />);
    let textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('border-basil/20', 'bg-basil/5');

    rerender(<RecipeTextarea type="notes" />);
    textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('border-citrus/30', 'bg-citrus/10');

    rerender(<RecipeTextarea type="tips" />);
    textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('border-secondary/20', 'bg-secondary/5');

    rerender(<RecipeTextarea type="review" />);
    textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('border-accent/30', 'bg-accent/10');
  });

  it('shows appropriate placeholder for recipe types', () => {
    const { rerender } = render(<RecipeTextarea type="description" />);
    let textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute(
      'placeholder',
      expect.stringContaining('Describe your recipe')
    );

    rerender(<RecipeTextarea type="instructions" />);
    textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute(
      'placeholder',
      expect.stringContaining('step-by-step instructions')
    );
  });

  it('shows word count when enabled', () => {
    render(
      <RecipeTextarea
        type="instructions"
        showWordCount
        defaultValue="This is a test with five words"
      />
    );
    expect(screen.getByText('7 words')).toBeInTheDocument();
  });

  it('validates minimum word count', () => {
    render(
      <RecipeTextarea
        type="instructions"
        minWords={10}
        showWordCount
        defaultValue="Short text"
      />
    );
    expect(screen.getByText(/Minimum 10 words required/)).toBeInTheDocument();
  });

  it('validates maximum word count', () => {
    render(
      <RecipeTextarea
        type="instructions"
        maxWords={5}
        showWordCount
        defaultValue="This text has more than five words total"
      />
    );
    expect(screen.getByText(/Maximum 5 words allowed/)).toBeInTheDocument();
  });

  it('prevents exceeding maximum word count', async () => {
    const handleChange = jest.fn();
    render(
      <RecipeTextarea
        type="instructions"
        maxWords={3}
        onChange={handleChange}
      />
    );

    const textarea = screen.getByRole('textbox');

    // Type exactly 3 words
    await userEvent.type(textarea, 'word1 word2 word3');
    expect(textarea).toHaveValue('word1 word2 word3');

    // Clear the mock to track new calls
    handleChange.mockClear();

    // Try to add a 4th word - the space is allowed but the word should be prevented
    await userEvent.type(textarea, ' word4');

    // The space character will be typed but "word4" should be prevented
    // So we expect "word1 word2 word3 " (note the trailing space)
    expect(textarea).toHaveValue('word1 word2 word3 ');

    // The onChange should have been called for the space character
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('shows character and word count together', () => {
    render(
      <RecipeTextarea
        type="instructions"
        showCharacterCount
        showWordCount
        maxLength={100}
        defaultValue="test content"
      />
    );
    expect(screen.getByText('2 words')).toBeInTheDocument();
    expect(screen.getByText('12 / 100')).toBeInTheDocument();
  });

  it('handles auto-resize for recipe textarea', () => {
    const { container } = render(
      <RecipeTextarea type="instructions" autoResize />
    );
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveClass('resize-none', 'overflow-hidden');
  });

  it('shows error state for validation failures', () => {
    render(
      <RecipeTextarea type="instructions" minWords={10} defaultValue="short" />
    );
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('border-destructive/40', 'bg-destructive/5');
  });

  it('shows success state for validation success', () => {
    render(
      <RecipeTextarea
        type="instructions"
        successMessage="Looks good!"
        defaultValue="This content is valid"
      />
    );
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('border-basil/40', 'bg-basil/5');
  });
});

describe('AutoTextarea', () => {
  it('renders correctly with auto-expand behavior', () => {
    render(<AutoTextarea />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('resize-none', 'overflow-hidden');
  });

  it('handles controlled value changes', async () => {
    const handleChange = jest.fn();
    render(<AutoTextarea value="initial value" onChange={handleChange} />);

    const textarea = screen.getByRole('textbox');
    await userEvent.type(textarea, ' more text');

    expect(handleChange).toHaveBeenCalled();
  });

  it('handles uncontrolled value changes', async () => {
    render(<AutoTextarea defaultValue="initial" />);
    const textarea = screen.getByRole('textbox');

    await userEvent.type(textarea, ' more text');
    expect(textarea).toHaveValue('initial more text');
  });

  it('supports min and max rows configuration', () => {
    render(<AutoTextarea minRows={5} maxRows={15} />);
    // Component should respect these props in height calculations
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('passes through Textarea props correctly', () => {
    render(
      <AutoTextarea
        label="Auto Textarea"
        helperText="This expands automatically"
        maxLength={200}
        showCharacterCount
      />
    );

    expect(screen.getByText('Auto Textarea')).toBeInTheDocument();
    expect(screen.getByText('This expands automatically')).toBeInTheDocument();
    expect(screen.getByText('0 / 200')).toBeInTheDocument();
  });
});

describe('Textarea Accessibility', () => {
  it('has proper ARIA attributes', () => {
    render(
      <Textarea
        label="Accessible Textarea"
        helperText="Helper text"
        required
        errorMessage="Error message"
      />
    );

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('aria-required', 'true');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea).toHaveAttribute('aria-describedby');
  });

  it('associates label with textarea correctly', () => {
    render(<Textarea label="Associated Label" />);
    const textarea = screen.getByLabelText('Associated Label');
    expect(textarea).toBeInTheDocument();
  });

  it('provides meaningful error messages to screen readers', () => {
    render(
      <Textarea label="Test Field" errorMessage="This field is required" />
    );

    const textarea = screen.getByRole('textbox');
    const errorElement = screen.getByText('This field is required');

    expect(textarea).toHaveAttribute(
      'aria-describedby',
      expect.stringContaining(errorElement.id)
    );
  });

  it('supports keyboard navigation', () => {
    render(<Textarea label="Keyboard Test" />);
    const textarea = screen.getByRole('textbox');

    textarea.focus();
    expect(textarea).toHaveFocus();
  });

  it('handles focus states correctly', async () => {
    const user = userEvent.setup();
    render(<Textarea label="Focus Test" />);
    const textarea = screen.getByRole('textbox');

    await user.click(textarea);
    expect(textarea).toHaveFocus();

    await user.tab();
    expect(textarea).not.toHaveFocus();
  });
});

describe('Textarea Integration', () => {
  it('works in form context', () => {
    const handleSubmit = jest.fn();

    render(
      <form onSubmit={handleSubmit}>
        <Textarea name="description" label="Description" required />
        <button type="submit">Submit</button>
      </form>
    );

    const textarea = screen.getByRole('textbox');
    const submitButton = screen.getByRole('button');

    expect(textarea).toHaveAttribute('name', 'description');
    expect(submitButton).toBeInTheDocument();
  });

  it('integrates with validation libraries', () => {
    const mockRegister = jest.fn();

    render(<Textarea label="Validated Field" {...mockRegister('field')} />);

    // Should accept ref and other form library props
    expect(screen.getByLabelText('Validated Field')).toBeInTheDocument();
  });

  it('handles complex recipe form scenario', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <RecipeTextarea
          type="description"
          label="Description"
          maxLength={100}
          showCharacterCount
        />
        <RecipeTextarea
          type="instructions"
          label="Instructions"
          minWords={5}
          showWordCount
        />
      </div>
    );

    const descriptionTextarea = screen.getByLabelText('Description');
    const instructionsTextarea = screen.getByLabelText('Instructions');

    await user.type(descriptionTextarea, 'A delicious recipe');
    await user.type(
      instructionsTextarea,
      'Mix ingredients and cook for ten minutes'
    );

    expect(descriptionTextarea).toHaveValue('A delicious recipe');
    expect(instructionsTextarea).toHaveValue(
      'Mix ingredients and cook for ten minutes'
    );
  });
});
