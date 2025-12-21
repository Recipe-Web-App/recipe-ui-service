import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { TagInput } from '@/components/ui/tag-input';
import type { TagInputProps } from '@/types/ui/tag-input.types';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

/**
 * Helper function to render TagInput with default props
 */
const renderTagInput = (props: Partial<TagInputProps> = {}) => {
  const defaultProps: TagInputProps = {
    value: [],
    onChange: jest.fn(),
    ...props,
  };

  return render(<TagInput {...defaultProps} />);
};

describe('TagInput', () => {
  describe('Basic Rendering', () => {
    test('renders with default label', () => {
      renderTagInput();
      expect(screen.getByText('Tags')).toBeInTheDocument();
    });

    test('renders with custom label', () => {
      renderTagInput({ label: 'Custom Tags' });
      expect(screen.getByText('Custom Tags')).toBeInTheDocument();
    });

    test('renders input field with placeholder', () => {
      renderTagInput({ placeholder: 'Add a tag...' });
      expect(screen.getByPlaceholderText('Add a tag...')).toBeInTheDocument();
    });

    test('renders add button', () => {
      renderTagInput();
      const addButton = screen.getByRole('button');
      expect(addButton).toBeInTheDocument();
    });

    test('displays tag count when showCount is true', () => {
      renderTagInput({ value: ['Tag1', 'Tag2'], maxTags: 20 });
      expect(screen.getByText('2/20')).toBeInTheDocument();
    });

    test('hides tag count when showCount is false', () => {
      renderTagInput({ value: ['Tag1'], maxTags: 20, showCount: false });
      expect(screen.queryByText('1/20')).not.toBeInTheDocument();
    });

    test('displays helper text', () => {
      renderTagInput({ helperText: 'Add up to 20 tags' });
      expect(screen.getByText('Add up to 20 tags')).toBeInTheDocument();
    });
  });

  describe('Displaying Tags', () => {
    test('displays existing tags as badges', () => {
      renderTagInput({ value: ['Italian', 'Vegetarian', 'Quick'] });

      expect(screen.getByText('Italian')).toBeInTheDocument();
      expect(screen.getByText('Vegetarian')).toBeInTheDocument();
      expect(screen.getByText('Quick')).toBeInTheDocument();
    });

    test('each tag has a remove button', () => {
      renderTagInput({ value: ['Tag1', 'Tag2'] });

      const removeButtons = screen.getAllByRole('button', {
        name: /Remove tag/,
      });
      expect(removeButtons).toHaveLength(2);
    });
  });

  describe('Adding Tags', () => {
    test('adds tag on Enter key press', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      renderTagInput({ onChange: handleChange });

      const input = screen.getByRole('textbox');
      await user.type(input, 'NewTag{Enter}');

      expect(handleChange).toHaveBeenCalledWith(['NewTag']);
    });

    test('adds tag on button click', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      renderTagInput({ onChange: handleChange });

      const input = screen.getByRole('textbox');
      await user.type(input, 'NewTag');

      // Find the add button (the one without "Remove tag" in its name)
      const buttons = screen.getAllByRole('button');
      const addButton = buttons.find(
        btn => !btn.getAttribute('aria-label')?.includes('Remove')
      );
      await user.click(addButton!);

      expect(handleChange).toHaveBeenCalledWith(['NewTag']);
    });

    test('trims whitespace from tag', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      renderTagInput({ onChange: handleChange });

      const input = screen.getByRole('textbox');
      await user.type(input, '  Trimmed Tag  {Enter}');

      expect(handleChange).toHaveBeenCalledWith(['Trimmed Tag']);
    });

    test('does not add empty tag', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      renderTagInput({ onChange: handleChange });

      const input = screen.getByRole('textbox');
      await user.type(input, '   {Enter}');

      expect(handleChange).not.toHaveBeenCalled();
    });

    test('clears input after adding tag', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      renderTagInput({ onChange: handleChange });

      const input = screen.getByRole('textbox');
      await user.type(input, 'NewTag{Enter}');

      expect(input).toHaveValue('');
    });
  });

  describe('Removing Tags', () => {
    test('removes tag when X button is clicked', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      renderTagInput({
        value: ['Tag1', 'Tag2', 'Tag3'],
        onChange: handleChange,
      });

      const removeButton = screen.getByRole('button', {
        name: 'Remove tag Tag2',
      });
      await user.click(removeButton);

      expect(handleChange).toHaveBeenCalledWith(['Tag1', 'Tag3']);
    });
  });

  describe('Duplicate Detection', () => {
    test('prevents duplicate tags (case-insensitive)', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      renderTagInput({
        value: ['Italian'],
        onChange: handleChange,
      });

      const input = screen.getByRole('textbox');
      await user.type(input, 'italian{Enter}');

      expect(
        await screen.findByText('This tag has already been added')
      ).toBeInTheDocument();
      expect(handleChange).not.toHaveBeenCalled();
    });

    test('clears error when typing', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      renderTagInput({
        value: ['Italian'],
        onChange: handleChange,
      });

      const input = screen.getByRole('textbox');
      await user.type(input, 'italian{Enter}');

      expect(
        await screen.findByText('This tag has already been added')
      ).toBeInTheDocument();

      // Type something new
      await user.clear(input);
      await user.type(input, 'French');

      expect(
        screen.queryByText('This tag has already been added')
      ).not.toBeInTheDocument();
    });
  });

  describe('Max Tags Limit', () => {
    test('disables input when at max capacity', () => {
      renderTagInput({
        value: ['Tag1', 'Tag2'],
        maxTags: 2,
      });

      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    test('disables add button when at max capacity', () => {
      renderTagInput({
        value: ['Tag1', 'Tag2'],
        maxTags: 2,
      });

      const addButton = screen.getByRole('button', { name: 'Add tag' });
      expect(addButton).toBeDisabled();
    });

    test('shows correct count at max capacity', () => {
      renderTagInput({
        value: ['Tag1', 'Tag2'],
        maxTags: 2,
      });

      expect(screen.getByText('2/2')).toBeInTheDocument();
    });

    test('allows adding tags when under limit', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      renderTagInput({
        value: ['Tag1'],
        onChange: handleChange,
        maxTags: 2,
      });

      const input = screen.getByRole('textbox');
      await user.type(input, 'Tag2{Enter}');

      expect(handleChange).toHaveBeenCalledWith(['Tag1', 'Tag2']);
    });
  });

  describe('Pending Tag Confirmation', () => {
    test('shows pending confirmation on blur when enabled', async () => {
      const user = userEvent.setup();

      renderTagInput({ showPendingConfirmation: true });

      const input = screen.getByRole('textbox');
      await user.type(input, 'PendingTag');
      await user.tab(); // Blur the input

      await waitFor(() => {
        expect(screen.getByText(/Add/)).toBeInTheDocument();
        expect(screen.getByText('PendingTag')).toBeInTheDocument();
      });
    });

    test('does not show pending confirmation when disabled', async () => {
      const user = userEvent.setup();

      renderTagInput({ showPendingConfirmation: false });

      const input = screen.getByRole('textbox');
      await user.type(input, 'PendingTag');
      await user.tab(); // Blur the input

      await waitFor(() => {
        expect(screen.queryByText(/Add.*as a tag/)).not.toBeInTheDocument();
      });
    });

    test('confirms pending tag on Yes click', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      renderTagInput({
        onChange: handleChange,
        showPendingConfirmation: true,
      });

      const input = screen.getByRole('textbox');
      await user.type(input, 'PendingTag');
      await user.tab(); // Blur the input

      await waitFor(() => {
        expect(screen.getByText('Yes')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Yes'));

      expect(handleChange).toHaveBeenCalledWith(['PendingTag']);
    });

    test('dismisses pending tag on No click', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      renderTagInput({
        onChange: handleChange,
        showPendingConfirmation: true,
      });

      const input = screen.getByRole('textbox');
      await user.type(input, 'PendingTag');
      await user.tab(); // Blur the input

      await waitFor(() => {
        expect(screen.getByText('No')).toBeInTheDocument();
      });

      await user.click(screen.getByText('No'));

      expect(handleChange).not.toHaveBeenCalled();
      expect(screen.queryByText(/Add.*as a tag/)).not.toBeInTheDocument();
    });

    test('does not show pending confirmation for duplicates', async () => {
      const user = userEvent.setup();

      renderTagInput({
        value: ['ExistingTag'],
        showPendingConfirmation: true,
      });

      const input = screen.getByRole('textbox');
      await user.type(input, 'existingtag');
      await user.tab(); // Blur the input

      await waitFor(() => {
        expect(screen.queryByText(/Add.*as a tag/)).not.toBeInTheDocument();
      });
    });
  });

  describe('Disabled State', () => {
    test('disables input when disabled prop is true', () => {
      renderTagInput({ disabled: true });

      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    test('disables add button when disabled', () => {
      renderTagInput({ disabled: true });

      const buttons = screen.getAllByRole('button');
      const addButton = buttons.find(
        btn => !btn.getAttribute('aria-label')?.includes('Remove')
      );
      expect(addButton).toBeDisabled();
    });

    test('disables remove buttons when disabled', () => {
      renderTagInput({
        value: ['Tag1'],
        disabled: true,
      });

      const removeButton = screen.getByRole('button', {
        name: 'Remove tag Tag1',
      });
      expect(removeButton).toBeDisabled();
    });
  });

  describe('Error Handling', () => {
    test('displays error prop', () => {
      renderTagInput({ error: 'Invalid tag format' });

      expect(screen.getByText('Invalid tag format')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    test('hides helper text when error is displayed', () => {
      renderTagInput({
        error: 'Error message',
        helperText: 'Helper text',
      });

      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    });

    test('shows helper text when no error', () => {
      renderTagInput({
        helperText: 'Helper text',
      });

      expect(screen.getByText('Helper text')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has no accessibility violations', async () => {
      const { container } = renderTagInput();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('has no violations with tags', async () => {
      const { container } = renderTagInput({
        value: ['Tag1', 'Tag2'],
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('has no violations with error', async () => {
      const { container } = renderTagInput({
        error: 'Error message',
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('remove buttons have accessible labels', () => {
      renderTagInput({ value: ['Italian', 'Vegetarian'] });

      expect(
        screen.getByRole('button', { name: 'Remove tag Italian' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Remove tag Vegetarian' })
      ).toBeInTheDocument();
    });

    test('error message has alert role', () => {
      renderTagInput({ error: 'Error message' });

      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent('Error message');
    });
  });

  describe('Component Display Name', () => {
    test('TagInput has correct display name', () => {
      expect(TagInput.displayName).toBe('TagInput');
    });
  });
});
