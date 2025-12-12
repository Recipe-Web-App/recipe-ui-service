import React from 'react';
import { render, screen, within } from '@testing-library/react';
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

      const servingsInput = screen.getByLabelText(/number of servings/i);
      expect(servingsInput).toHaveValue(4);
    });
  });

  describe('Servings control', () => {
    it('should increment servings when plus button is clicked', async () => {
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

      const incrementButton = screen.getByLabelText(/increase servings/i);
      const servingsInput = screen.getByLabelText(/number of servings/i);

      expect(servingsInput).toHaveValue(4);
      await user.click(incrementButton);
      expect(servingsInput).toHaveValue(5);
    });

    it('should decrement servings when minus button is clicked', async () => {
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

      const decrementButton = screen.getByLabelText(/decrease servings/i);
      const servingsInput = screen.getByLabelText(/number of servings/i);

      expect(servingsInput).toHaveValue(4);
      await user.click(decrementButton);
      expect(servingsInput).toHaveValue(3);
    });

    it('should not go below 1 serving', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper
          defaultValues={{
            ...CREATE_RECIPE_DEFAULT_VALUES,
            servings: 1,
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

      const decrementButton = screen.getByLabelText(/decrease servings/i);
      expect(decrementButton).toBeDisabled();
    });

    it('should not go above 100 servings', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper
          defaultValues={{
            ...CREATE_RECIPE_DEFAULT_VALUES,
            servings: 100,
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

      const incrementButton = screen.getByLabelText(/increase servings/i);
      expect(incrementButton).toBeDisabled();
    });
  });

  describe('Time inputs', () => {
    it('should allow entering prep time', async () => {
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

      const prepTimeInput = screen.getByPlaceholderText(/e\.g\., 15/i);
      await user.type(prepTimeInput, '20');

      expect(prepTimeInput).toHaveValue(20);
    });

    it('should allow entering cook time', async () => {
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

      const cookTimeInput = screen.getByPlaceholderText(/e\.g\., 30/i);
      await user.type(cookTimeInput, '45');

      expect(cookTimeInput).toHaveValue(45);
    });
  });

  describe('Difficulty selection', () => {
    it('should display all difficulty options', () => {
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

      expect(screen.getByText('Beginner')).toBeInTheDocument();
      expect(screen.getByText('Easy')).toBeInTheDocument();
      expect(screen.getByText('Medium')).toBeInTheDocument();
      expect(screen.getByText('Hard')).toBeInTheDocument();
      expect(screen.getByText('Expert')).toBeInTheDocument();
    });

    it('should show descriptions for difficulty levels', () => {
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

      expect(
        screen.getByText(/perfect for first-time cooks/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/simple recipes with few steps/i)
      ).toBeInTheDocument();
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
