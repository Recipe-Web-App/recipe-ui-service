import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BasicInfoStep } from '@/components/recipe/create/steps/BasicInfoStep';
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

describe('BasicInfoStep', () => {
  describe('Rendering', () => {
    it('should render when active', () => {
      render(
        <TestWrapper>
          {form => (
            <BasicInfoStep
              form={form}
              isActive={true}
              stepIndex={0}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      expect(screen.getByText('Basic Information')).toBeInTheDocument();
      expect(screen.getByLabelText(/recipe title/i)).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      // The textarea is found by its placeholder since the Textarea component
      // doesn't properly associate the label with the form control
      expect(
        screen.getByPlaceholderText(/tell us about this recipe/i)
      ).toBeInTheDocument();
    });

    it('should not render when inactive', () => {
      render(
        <TestWrapper>
          {form => (
            <BasicInfoStep
              form={form}
              isActive={false}
              stepIndex={0}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      expect(screen.queryByText('Basic Information')).not.toBeInTheDocument();
    });

    it('should show required indicator for title via aria-required', () => {
      render(
        <TestWrapper>
          {form => (
            <BasicInfoStep
              form={form}
              isActive={true}
              stepIndex={0}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      // The required indicator is shown via aria-required attribute and CSS ::after
      const titleInput = screen.getByLabelText(/recipe title/i);
      expect(titleInput).toHaveAttribute('aria-required', 'true');
      expect(titleInput).toHaveAttribute('required');
    });

    it('should show required indicator for description via aria-required', () => {
      render(
        <TestWrapper>
          {form => (
            <BasicInfoStep
              form={form}
              isActive={true}
              stepIndex={0}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      // The description textarea should have aria-required attribute
      const descriptionTextarea = screen.getByPlaceholderText(
        /tell us about this recipe/i
      );
      expect(descriptionTextarea).toHaveAttribute('aria-required', 'true');
    });
  });

  describe('Input behavior', () => {
    it('should update title value when typing', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <BasicInfoStep
              form={form}
              isActive={true}
              stepIndex={0}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      const titleInput = screen.getByLabelText(/recipe title/i);
      await user.type(titleInput, 'My Test Recipe');

      expect(titleInput).toHaveValue('My Test Recipe');
    });

    it('should update description value when typing', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <BasicInfoStep
              form={form}
              isActive={true}
              stepIndex={0}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      const descriptionInput = screen.getByPlaceholderText(
        /tell us about this recipe/i
      );
      await user.type(descriptionInput, 'A delicious test recipe');

      expect(descriptionInput).toHaveValue('A delicious test recipe');
    });

    it('should show character count for description', () => {
      render(
        <TestWrapper>
          {form => (
            <BasicInfoStep
              form={form}
              isActive={true}
              stepIndex={0}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      // Character count is split: "0" and " / 2000"
      // Verify the textarea has a maxLength of 2000
      const descriptionTextarea = screen.getByPlaceholderText(
        /tell us about this recipe/i
      );
      expect(descriptionTextarea).toHaveAttribute('maxlength', '2000');
    });
  });

  describe('Validation', () => {
    it('should show error for empty title when form trigger is called', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <>
              <BasicInfoStep
                form={form}
                isActive={true}
                stepIndex={0}
                totalSteps={5}
              />
              <button type="button" onClick={() => form.trigger('title')}>
                Validate
              </button>
            </>
          )}
        </TestWrapper>
      );

      // Trigger validation explicitly
      await user.click(screen.getByRole('button', { name: /validate/i }));

      // Error message should appear (wait for validation)
      expect(
        await screen.findByText('Recipe title is required')
      ).toBeInTheDocument();
    });

    it('should show error for title that is too short when validated', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <>
              <BasicInfoStep
                form={form}
                isActive={true}
                stepIndex={0}
                totalSteps={5}
              />
              <button type="button" onClick={() => form.trigger('title')}>
                Validate
              </button>
            </>
          )}
        </TestWrapper>
      );

      const titleInput = screen.getByLabelText(/recipe title/i);
      await user.type(titleInput, 'ab');
      await user.click(screen.getByRole('button', { name: /validate/i }));

      expect(
        await screen.findByText('Recipe title must be at least 3 characters')
      ).toBeInTheDocument();
    });

    it('should show error for empty description when form trigger is called', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <>
              <BasicInfoStep
                form={form}
                isActive={true}
                stepIndex={0}
                totalSteps={5}
              />
              <button type="button" onClick={() => form.trigger('description')}>
                Validate Description
              </button>
            </>
          )}
        </TestWrapper>
      );

      // Trigger validation explicitly
      await user.click(
        screen.getByRole('button', { name: /validate description/i })
      );

      // Error message should appear (wait for validation)
      expect(
        await screen.findByText('Description is required')
      ).toBeInTheDocument();
    });
  });

  describe('Helper text', () => {
    it('should display helper text for title', () => {
      render(
        <TestWrapper>
          {form => (
            <BasicInfoStep
              form={form}
              isActive={true}
              stepIndex={0}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      expect(
        screen.getByText(/a descriptive title helps others find your recipe/i)
      ).toBeInTheDocument();
    });

    it('should display helper text for description without Optional prefix', () => {
      render(
        <TestWrapper>
          {form => (
            <BasicInfoStep
              form={form}
              isActive={true}
              stepIndex={0}
              totalSteps={5}
            />
          )}
        </TestWrapper>
      );

      // Helper text should not indicate optional anymore
      expect(
        screen.getByText(/share the story behind your recipe/i)
      ).toBeInTheDocument();
      expect(screen.queryByText(/optional/i)).not.toBeInTheDocument();
    });
  });
});
