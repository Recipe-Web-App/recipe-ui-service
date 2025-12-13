import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TimingStep } from '@/components/recipe/create/steps/TimingStep';
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

describe('TimingStep', () => {
  describe('Rendering', () => {
    it('should render when active', () => {
      render(
        <TestWrapper>
          {form => (
            <TimingStep
              form={form}
              isActive={true}
              stepIndex={1}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      expect(screen.getByText('Timing & Servings')).toBeInTheDocument();
      expect(screen.getByText('Servings')).toBeInTheDocument();
      expect(screen.getByText('Prep Time')).toBeInTheDocument();
      expect(screen.getByText('Cook Time')).toBeInTheDocument();
      expect(screen.getByText('Difficulty Level')).toBeInTheDocument();
    });

    it('should not render when inactive', () => {
      render(
        <TestWrapper>
          {form => (
            <TimingStep
              form={form}
              isActive={false}
              stepIndex={1}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      expect(screen.queryByText('Timing & Servings')).not.toBeInTheDocument();
    });

    it('should show default servings value of 4', () => {
      render(
        <TestWrapper>
          {form => (
            <TimingStep
              form={form}
              isActive={true}
              stepIndex={1}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      const servingsInput = screen.getByLabelText(/servings/i);
      expect(servingsInput).toHaveValue(4);
    });
  });

  describe('Servings control', () => {
    it('should allow direct input of servings value', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <TimingStep
              form={form}
              isActive={true}
              stepIndex={1}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      const servingsInput = screen.getByLabelText(/servings/i);
      expect(servingsInput).toHaveValue(4);

      // Triple-click to select all, then type new value
      await user.tripleClick(servingsInput);
      await user.keyboard('8');
      expect(servingsInput).toHaveValue(8);
    });

    it('should allow clearing the field completely', async () => {
      const user = userEvent.setup();
      let formRef: ReturnType<typeof useForm<CreateRecipeFormData>> | undefined;

      render(
        <TestWrapper>
          {form => {
            formRef = form;
            return (
              <TimingStep
                form={form}
                isActive={true}
                stepIndex={1}
                totalSteps={5}
              />
            );
          }}
        </TestWrapper>
      );

      const servingsInput = screen.getByLabelText(
        /servings/i
      ) as HTMLInputElement;
      expect(servingsInput).toHaveValue(4);

      // Clear the input using user.clear()
      await user.clear(servingsInput);

      // Wait for form state to update
      await waitFor(() => {
        expect(formRef?.getValues('servings')).toBeUndefined();
      });

      // Blur should not auto-fill the value
      fireEvent.blur(servingsInput);

      // Check form value is still undefined after blur (no clamping/auto-fill)
      expect(formRef?.getValues('servings')).toBeUndefined();
    });

    it('should allow typing values outside range for editing purposes', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <TimingStep
              form={form}
              isActive={true}
              stepIndex={1}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      const servingsInput = screen.getByLabelText(/servings/i);
      // Triple-click to select all, then type 150
      await user.tripleClick(servingsInput);
      await user.keyboard('150');

      // Value should be what user typed (validation happens on form submit)
      expect(servingsInput).toHaveValue(150);
    });
  });

  describe('Time inputs', () => {
    it('should allow entering prep time in hours and minutes', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <TimingStep
              form={form}
              isActive={true}
              stepIndex={1}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      const prepHoursInput = screen.getByLabelText(/prep time hours/i);
      const prepMinutesInput = screen.getByLabelText(/prep time minutes/i);

      await user.type(prepHoursInput, '1');
      await user.type(prepMinutesInput, '30');

      expect(prepHoursInput).toHaveValue(1);
      expect(prepMinutesInput).toHaveValue(30);
    });

    it('should allow entering cook time in hours and minutes', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <TimingStep
              form={form}
              isActive={true}
              stepIndex={1}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      const cookHoursInput = screen.getByLabelText(/cook time hours/i);
      const cookMinutesInput = screen.getByLabelText(/cook time minutes/i);

      await user.type(cookHoursInput, '2');
      await user.type(cookMinutesInput, '45');

      expect(cookHoursInput).toHaveValue(2);
      expect(cookMinutesInput).toHaveValue(45);
    });

    it('should display existing prep time in hours and minutes', () => {
      render(
        <TestWrapper
          defaultValues={{
            ...CREATE_RECIPE_DEFAULT_VALUES,
            prepTime: 90, // 1 hour 30 minutes
          }}
        >
          {form => (
            <TimingStep
              form={form}
              isActive={true}
              stepIndex={1}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      const prepHoursInput = screen.getByLabelText(/prep time hours/i);
      const prepMinutesInput = screen.getByLabelText(/prep time minutes/i);

      expect(prepHoursInput).toHaveValue(1);
      expect(prepMinutesInput).toHaveValue(30);
    });

    it('should display existing cook time in hours and minutes', () => {
      render(
        <TestWrapper
          defaultValues={{
            ...CREATE_RECIPE_DEFAULT_VALUES,
            cookTime: 150, // 2 hours 30 minutes
          }}
        >
          {form => (
            <TimingStep
              form={form}
              isActive={true}
              stepIndex={1}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      const cookHoursInput = screen.getByLabelText(/cook time hours/i);
      const cookMinutesInput = screen.getByLabelText(/cook time minutes/i);

      expect(cookHoursInput).toHaveValue(2);
      expect(cookMinutesInput).toHaveValue(30);
    });

    it('should handle minutes-only input correctly', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <TimingStep
              form={form}
              isActive={true}
              stepIndex={1}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      const prepMinutesInput = screen.getByLabelText(/prep time minutes/i);
      await user.type(prepMinutesInput, '45');

      expect(prepMinutesInput).toHaveValue(45);
    });

    it('should handle hours-only input correctly', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <TimingStep
              form={form}
              isActive={true}
              stepIndex={1}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      const cookHoursInput = screen.getByLabelText(/cook time hours/i);
      await user.type(cookHoursInput, '2');

      expect(cookHoursInput).toHaveValue(2);
    });
  });

  describe('Difficulty selection', () => {
    it('should display all difficulty options as segmented control', () => {
      render(
        <TestWrapper>
          {form => (
            <TimingStep
              form={form}
              isActive={true}
              stepIndex={1}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      // All options should be visible as radio buttons in a segmented control
      expect(
        screen.getByRole('radio', { name: 'Beginner' })
      ).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: 'Easy' })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: 'Medium' })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: 'Hard' })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: 'Expert' })).toBeInTheDocument();
    });

    it('should show required indicator for difficulty level', () => {
      render(
        <TestWrapper>
          {form => (
            <TimingStep
              form={form}
              isActive={true}
              stepIndex={1}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      // The label should contain a required indicator (*)
      const difficultyLabel = screen.getByText(/difficulty level/i);
      expect(difficultyLabel.textContent).toContain('*');
    });

    it('should select difficulty when clicked', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <TimingStep
              form={form}
              isActive={true}
              stepIndex={1}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      // Medium is selected by default now, so let's test clicking on Easy
      const easyOption = screen.getByRole('radio', { name: 'Easy' });
      const mediumOption = screen.getByRole('radio', { name: 'Medium' });

      // Medium should be selected by default (MEDIUM is the default difficulty)
      expect(mediumOption).toHaveAttribute('aria-checked', 'true');
      expect(easyOption).toHaveAttribute('aria-checked', 'false');

      await user.click(easyOption);

      expect(easyOption).toHaveAttribute('aria-checked', 'true');
      expect(mediumOption).toHaveAttribute('aria-checked', 'false');
    });

    it('should have proper radiogroup accessibility', () => {
      render(
        <TestWrapper>
          {form => (
            <TimingStep
              form={form}
              isActive={true}
              stepIndex={1}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      const radiogroup = screen.getByRole('radiogroup', {
        name: /difficulty level/i,
      });
      expect(radiogroup).toBeInTheDocument();
    });
  });

  describe('Total time display', () => {
    it('should show total time when prep and cook times are entered', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper
          defaultValues={{
            ...CREATE_RECIPE_DEFAULT_VALUES,
            prepTime: 15,
            cookTime: 30,
          }}
        >
          {form => (
            <TimingStep
              form={form}
              isActive={true}
              stepIndex={1}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      expect(screen.getByText(/total time/i)).toBeInTheDocument();
      expect(screen.getByText(/45 minutes/i)).toBeInTheDocument();
    });
  });
});
