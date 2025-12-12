// Mock crypto before importing modules that use it
let mockUuidCounter = 600;
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
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InstructionsStep } from '@/components/recipe/create/steps/InstructionsStep';
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

describe('InstructionsStep', () => {
  describe('Rendering', () => {
    it('should render when active', () => {
      render(
        <TestWrapper>
          {form => (
            <InstructionsStep
              form={form}
              isActive={true}
              stepIndex={3}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      expect(screen.getByText('Instructions')).toBeInTheDocument();
      expect(
        screen.getByText(/add step-by-step instructions/i)
      ).toBeInTheDocument();
    });

    it('should not render when inactive', () => {
      render(
        <TestWrapper>
          {form => (
            <InstructionsStep
              form={form}
              isActive={false}
              stepIndex={3}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      expect(screen.queryByText('Instructions')).not.toBeInTheDocument();
    });

    it('should render one default step', () => {
      render(
        <TestWrapper>
          {form => (
            <InstructionsStep
              form={form}
              isActive={true}
              stepIndex={3}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      expect(screen.getByText('Step 1')).toBeInTheDocument();
      expect(screen.getByLabelText(/step 1 instruction/i)).toBeInTheDocument();
    });

    it('should show Add Step button', () => {
      render(
        <TestWrapper>
          {form => (
            <InstructionsStep
              form={form}
              isActive={true}
              stepIndex={3}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      expect(
        screen.getByRole('button', { name: /add step/i })
      ).toBeInTheDocument();
    });
  });

  describe('Adding steps', () => {
    it('should add new step when Add Step button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <InstructionsStep
              form={form}
              isActive={true}
              stepIndex={3}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      // Initially should have 1 step
      expect(screen.getByText('Step 1')).toBeInTheDocument();
      expect(screen.queryByText('Step 2')).not.toBeInTheDocument();

      // Click add button
      await user.click(screen.getByRole('button', { name: /add step/i }));

      // Should now have 2 steps
      expect(screen.getByText('Step 1')).toBeInTheDocument();
      expect(screen.getByText('Step 2')).toBeInTheDocument();
    });
  });

  describe('Removing steps', () => {
    it('should disable remove button when only one step exists', () => {
      render(
        <TestWrapper>
          {form => (
            <InstructionsStep
              form={form}
              isActive={true}
              stepIndex={3}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      const removeButton = screen.getByLabelText(/remove step 1/i);
      expect(removeButton).toBeDisabled();
    });

    it('should enable remove button when multiple steps exist', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <InstructionsStep
              form={form}
              isActive={true}
              stepIndex={3}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      // Add second step
      await user.click(screen.getByRole('button', { name: /add step/i }));

      // Both remove buttons should be enabled
      const removeButton1 = screen.getByLabelText(/remove step 1/i);
      const removeButton2 = screen.getByLabelText(/remove step 2/i);

      expect(removeButton1).not.toBeDisabled();
      expect(removeButton2).not.toBeDisabled();
    });

    it('should remove step when remove button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <InstructionsStep
              form={form}
              isActive={true}
              stepIndex={3}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      // Add second step
      await user.click(screen.getByRole('button', { name: /add step/i }));

      // Should have 2 steps
      expect(screen.getByText('Step 1')).toBeInTheDocument();
      expect(screen.getByText('Step 2')).toBeInTheDocument();

      // Remove the second step
      await user.click(screen.getByLabelText(/remove step 2/i));

      // Should now have only 1 step
      expect(screen.getByText('Step 1')).toBeInTheDocument();
      expect(screen.queryByText('Step 2')).not.toBeInTheDocument();
    });
  });

  describe('Input fields', () => {
    it('should allow entering instruction text', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <InstructionsStep
              form={form}
              isActive={true}
              stepIndex={3}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      const instructionInput = screen.getByLabelText(/step 1 instruction/i);
      await user.type(instructionInput, 'Preheat the oven to 350F');

      expect(instructionInput).toHaveValue('Preheat the oven to 350F');
    });

    it('should display duration input', () => {
      render(
        <TestWrapper>
          {form => (
            <InstructionsStep
              form={form}
              isActive={true}
              stepIndex={3}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      const durationInput = screen.getByLabelText(/step 1 duration/i);
      expect(durationInput).toBeInTheDocument();
    });

    it('should allow entering duration', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <InstructionsStep
              form={form}
              isActive={true}
              stepIndex={3}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      const durationInput = screen.getByLabelText(/step 1 duration/i);
      await user.type(durationInput, '15');

      expect(durationInput).toHaveValue(15);
    });
  });

  describe('Helper text', () => {
    it('should display tip about clear instructions', () => {
      render(
        <TestWrapper>
          {form => (
            <InstructionsStep
              form={form}
              isActive={true}
              stepIndex={3}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      expect(
        screen.getByText(/tip: write clear, concise instructions/i)
      ).toBeInTheDocument();
    });
  });
});
