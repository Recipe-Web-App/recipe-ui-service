// Mock crypto before importing modules that use it
let mockUuidCounter = 500;
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => `mock-uuid-${mockUuidCounter++}`,
    getRandomValues: (arr: Uint8Array) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    },
    subtle: {
      digest: () => Promise.resolve(new ArrayBuffer(32)),
    },
  },
  writable: true,
  configurable: true,
});

import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IngredientsStep } from '@/components/recipe/create/steps/IngredientsStep';
import { createRecipeWizardFormSchema } from '@/lib/validation/create-recipe-wizard-schemas';
import {
  CREATE_RECIPE_DEFAULT_VALUES,
  type CreateRecipeFormData,
} from '@/types/recipe/create-recipe-wizard';

// Wrapper component that provides form context
function TestWrapper({
  children,
  defaultValues = CREATE_RECIPE_DEFAULT_VALUES,
}: {
  children: (
    form: ReturnType<typeof useForm<CreateRecipeFormData>>
  ) => React.ReactNode;
  defaultValues?: CreateRecipeFormData;
}) {
  const form = useForm<CreateRecipeFormData>({
    resolver: zodResolver(createRecipeWizardFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  return <>{children(form)}</>;
}

describe('IngredientsStep', () => {
  describe('Rendering', () => {
    it('should render when active', () => {
      render(
        <TestWrapper>
          {form => (
            <IngredientsStep
              form={form}
              isActive={true}
              stepIndex={2}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      expect(screen.getByText('Ingredients')).toBeInTheDocument();
      expect(screen.getByText(/add all the ingredients/i)).toBeInTheDocument();
    });

    it('should not render when inactive', () => {
      render(
        <TestWrapper>
          {form => (
            <IngredientsStep
              form={form}
              isActive={false}
              stepIndex={2}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      expect(screen.queryByText('Ingredients')).not.toBeInTheDocument();
    });

    it('should render one default ingredient', () => {
      render(
        <TestWrapper>
          {form => (
            <IngredientsStep
              form={form}
              isActive={true}
              stepIndex={2}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      // Should have at least one ingredient name input
      expect(screen.getByLabelText(/ingredient 1 name/i)).toBeInTheDocument();
    });

    it('should show Add Ingredient button', () => {
      render(
        <TestWrapper>
          {form => (
            <IngredientsStep
              form={form}
              isActive={true}
              stepIndex={2}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      expect(
        screen.getByRole('button', { name: /add ingredient/i })
      ).toBeInTheDocument();
    });
  });

  describe('Adding ingredients', () => {
    it('should add new ingredient when Add Ingredient button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <IngredientsStep
              form={form}
              isActive={true}
              stepIndex={2}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      // Initially should have 1 ingredient
      expect(screen.getByLabelText(/ingredient 1 name/i)).toBeInTheDocument();
      expect(
        screen.queryByLabelText(/ingredient 2 name/i)
      ).not.toBeInTheDocument();

      // Click add button
      await user.click(screen.getByRole('button', { name: /add ingredient/i }));

      // Should now have 2 ingredients
      expect(screen.getByLabelText(/ingredient 1 name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/ingredient 2 name/i)).toBeInTheDocument();
    });
  });

  describe('Removing ingredients', () => {
    it('should disable remove button when only one ingredient exists', () => {
      render(
        <TestWrapper>
          {form => (
            <IngredientsStep
              form={form}
              isActive={true}
              stepIndex={2}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      const removeButton = screen.getByLabelText(/remove ingredient 1/i);
      expect(removeButton).toBeDisabled();
    });

    it('should enable remove button when multiple ingredients exist', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <IngredientsStep
              form={form}
              isActive={true}
              stepIndex={2}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      // Add second ingredient
      await user.click(screen.getByRole('button', { name: /add ingredient/i }));

      // Both remove buttons should be enabled
      const removeButton1 = screen.getByLabelText(/remove ingredient 1/i);
      const removeButton2 = screen.getByLabelText(/remove ingredient 2/i);

      expect(removeButton1).not.toBeDisabled();
      expect(removeButton2).not.toBeDisabled();
    });

    it('should remove ingredient when remove button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <IngredientsStep
              form={form}
              isActive={true}
              stepIndex={2}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      // Add second ingredient
      await user.click(screen.getByRole('button', { name: /add ingredient/i }));

      // Should have 2 ingredients
      expect(screen.getByLabelText(/ingredient 1 name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/ingredient 2 name/i)).toBeInTheDocument();

      // Remove the second ingredient
      await user.click(screen.getByLabelText(/remove ingredient 2/i));

      // Should now have only 1 ingredient
      expect(screen.getByLabelText(/ingredient 1 name/i)).toBeInTheDocument();
      expect(
        screen.queryByLabelText(/ingredient 2 name/i)
      ).not.toBeInTheDocument();
    });
  });

  describe('Input fields', () => {
    it('should allow entering ingredient name', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <IngredientsStep
              form={form}
              isActive={true}
              stepIndex={2}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      const nameInput = screen.getByLabelText(/ingredient 1 name/i);
      await user.type(nameInput, 'Flour');

      expect(nameInput).toHaveValue('Flour');
    });

    it('should allow entering ingredient quantity', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <IngredientsStep
              form={form}
              isActive={true}
              stepIndex={2}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      const qtyInput = screen.getByLabelText(/ingredient 1 quantity/i);
      await user.clear(qtyInput);
      await user.type(qtyInput, '2.5');

      expect(qtyInput).toHaveValue(2.5);
    });

    it('should display unit select with default value', () => {
      render(
        <TestWrapper>
          {form => (
            <IngredientsStep
              form={form}
              isActive={true}
              stepIndex={2}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      const unitSelect = screen.getByLabelText(/ingredient 1 unit/i);
      expect(unitSelect).toBeInTheDocument();
    });
  });

  describe('Helper text', () => {
    it('should display tip about being specific', () => {
      render(
        <TestWrapper>
          {form => (
            <IngredientsStep
              form={form}
              isActive={true}
              stepIndex={2}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      expect(
        screen.getByText(/tip: be specific with quantities/i)
      ).toBeInTheDocument();
    });
  });

  describe('Quantity input smart stepping', () => {
    it('should render quantity input with increment/decrement buttons', () => {
      render(
        <TestWrapper>
          {form => (
            <IngredientsStep
              form={form}
              isActive={true}
              stepIndex={2}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      // Should have +/- buttons for the quantity input
      const quantityContainer = screen
        .getByLabelText(/ingredient 1 quantity/i)
        .closest('div')?.parentElement;

      expect(quantityContainer).toBeInTheDocument();
      expect(
        within(quantityContainer!).getByLabelText('Decrease quantity')
      ).toBeInTheDocument();
      expect(
        within(quantityContainer!).getByLabelText('Increase quantity')
      ).toBeInTheDocument();
    });

    it('should increment quantity by 0.25 for small values', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <IngredientsStep
              form={form}
              isActive={true}
              stepIndex={2}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      const qtyInput = screen.getByLabelText(/ingredient 1 quantity/i);

      // Set initial value to 1
      await user.clear(qtyInput);
      await user.type(qtyInput, '1');

      // Click increment button
      const quantityContainer = qtyInput.closest('div')?.parentElement;
      const incrementBtn = within(quantityContainer!).getByLabelText(
        'Increase quantity'
      );
      await user.click(incrementBtn);

      // Should be 1.25 (smart step of 0.25 for values < 10)
      expect(qtyInput).toHaveValue(1.25);
    });

    it('should increment quantity by 0.5 for medium values', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <IngredientsStep
              form={form}
              isActive={true}
              stepIndex={2}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      const qtyInput = screen.getByLabelText(/ingredient 1 quantity/i);

      // Set initial value to 10
      await user.clear(qtyInput);
      await user.type(qtyInput, '10');

      // Click increment button
      const quantityContainer = qtyInput.closest('div')?.parentElement;
      const incrementBtn = within(quantityContainer!).getByLabelText(
        'Increase quantity'
      );
      await user.click(incrementBtn);

      // Should be 10.5 (smart step of 0.5 for values 10-100)
      expect(qtyInput).toHaveValue(10.5);
    });

    it('should increment quantity by 1 for large values', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <IngredientsStep
              form={form}
              isActive={true}
              stepIndex={2}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      const qtyInput = screen.getByLabelText(/ingredient 1 quantity/i);

      // Set initial value to 100
      await user.clear(qtyInput);
      await user.type(qtyInput, '100');

      // Click increment button
      const quantityContainer = qtyInput.closest('div')?.parentElement;
      const incrementBtn = within(quantityContainer!).getByLabelText(
        'Increase quantity'
      );
      await user.click(incrementBtn);

      // Should be 101 (smart step of 1 for values >= 100)
      expect(qtyInput).toHaveValue(101);
    });

    it('should start from 1 when empty and increment is clicked', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <IngredientsStep
              form={form}
              isActive={true}
              stepIndex={2}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      const qtyInput = screen.getByLabelText(/ingredient 1 quantity/i);

      // Clear the input
      await user.clear(qtyInput);

      // Click increment button
      const quantityContainer = qtyInput.closest('div')?.parentElement;
      const incrementBtn = within(quantityContainer!).getByLabelText(
        'Increase quantity'
      );
      await user.click(incrementBtn);

      // Should start from default value of 1 and increment by 0.25
      expect(qtyInput).toHaveValue(1.25);
    });

    it('should decrement quantity correctly', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <IngredientsStep
              form={form}
              isActive={true}
              stepIndex={2}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      const qtyInput = screen.getByLabelText(/ingredient 1 quantity/i);

      // Set initial value to 2
      await user.clear(qtyInput);
      await user.type(qtyInput, '2');

      // Click decrement button
      const quantityContainer = qtyInput.closest('div')?.parentElement;
      const decrementBtn = within(quantityContainer!).getByLabelText(
        'Decrease quantity'
      );
      await user.click(decrementBtn);

      // Should be 1.75 (smart step of 0.25 for values < 10)
      expect(qtyInput).toHaveValue(1.75);
    });

    it('should not decrement below minimum value', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <IngredientsStep
              form={form}
              isActive={true}
              stepIndex={2}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      const qtyInput = screen.getByLabelText(/ingredient 1 quantity/i);

      // Set initial value close to min
      await user.clear(qtyInput);
      await user.type(qtyInput, '0.1');

      // Click decrement button
      const quantityContainer = qtyInput.closest('div')?.parentElement;
      const decrementBtn = within(quantityContainer!).getByLabelText(
        'Decrease quantity'
      );
      await user.click(decrementBtn);

      // Should be at minimum (0.01)
      expect(qtyInput).toHaveValue(0.01);
    });

    it('should support keyboard increment with ArrowUp', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <IngredientsStep
              form={form}
              isActive={true}
              stepIndex={2}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      const qtyInput = screen.getByLabelText(/ingredient 1 quantity/i);

      // Set initial value
      await user.clear(qtyInput);
      await user.type(qtyInput, '5');

      // Press ArrowUp
      await user.keyboard('{ArrowUp}');

      // Should increment by 0.25
      expect(qtyInput).toHaveValue(5.25);
    });

    it('should support keyboard decrement with ArrowDown', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <IngredientsStep
              form={form}
              isActive={true}
              stepIndex={2}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      const qtyInput = screen.getByLabelText(/ingredient 1 quantity/i);

      // Set initial value
      await user.clear(qtyInput);
      await user.type(qtyInput, '5');

      // Press ArrowDown
      await user.keyboard('{ArrowDown}');

      // Should decrement by 0.25
      expect(qtyInput).toHaveValue(4.75);
    });

    it('should snap odd values to nearest step on increment', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <IngredientsStep
              form={form}
              isActive={true}
              stepIndex={2}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      const qtyInput = screen.getByLabelText(/ingredient 1 quantity/i);

      // Set a value not on step boundary (0.01)
      await user.clear(qtyInput);
      await user.type(qtyInput, '0.01');

      // Click increment button
      const quantityContainer = qtyInput.closest('div')?.parentElement;
      const incrementBtn = within(quantityContainer!).getByLabelText(
        'Increase quantity'
      );
      await user.click(incrementBtn);

      // Should snap to 0.25 instead of adding 0.25 to get 0.26
      expect(qtyInput).toHaveValue(0.25);
    });

    it('should snap odd values to nearest step on decrement', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <IngredientsStep
              form={form}
              isActive={true}
              stepIndex={2}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      const qtyInput = screen.getByLabelText(/ingredient 1 quantity/i);

      // Set a value not on step boundary (0.26)
      await user.clear(qtyInput);
      await user.type(qtyInput, '0.26');

      // Click decrement button
      const quantityContainer = qtyInput.closest('div')?.parentElement;
      const decrementBtn = within(quantityContainer!).getByLabelText(
        'Decrease quantity'
      );
      await user.click(decrementBtn);

      // Should snap to 0.25 instead of subtracting 0.25 to get 0.01
      expect(qtyInput).toHaveValue(0.25);
    });
  });
});
