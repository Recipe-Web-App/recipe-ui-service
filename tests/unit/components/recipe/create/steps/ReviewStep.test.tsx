// Mock crypto before importing modules that use it
let mockUuidCounter = 700;
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
import { ReviewStep } from '@/components/recipe/create/steps/ReviewStep';
import { createRecipeWizardFormSchema } from '@/lib/validation/create-recipe-wizard-schemas';
import {
  CreateRecipeWizardStep,
  type CreateRecipeFormData,
} from '@/types/recipe/create-recipe-wizard';
import { DifficultyLevel } from '@/types/recipe-management/common';

// Complete valid form data for testing
const validFormData: CreateRecipeFormData = {
  title: 'Test Recipe',
  description: 'A delicious test recipe',
  servings: 4,
  prepTime: 15,
  cookTime: 30,
  difficulty: DifficultyLevel.MEDIUM,
  ingredients: [
    { id: 'ing-1', name: 'Flour', quantity: 2, unit: 'CUP', notes: 'sifted' },
    { id: 'ing-2', name: 'Sugar', quantity: 1, unit: 'CUP' },
  ],
  steps: [
    {
      id: 'step-1',
      stepNumber: 1,
      instruction: 'Mix the dry ingredients together in a large bowl',
      duration: 5,
    },
    {
      id: 'step-2',
      stepNumber: 2,
      instruction: 'Add wet ingredients and stir until combined',
      duration: 3,
    },
  ],
  tags: ['dessert', 'baking'],
};

// Wrapper component that provides form context
function TestWrapper({
  children,
  defaultValues = validFormData,
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

describe('ReviewStep', () => {
  const mockOnEditStep = jest.fn();
  const mockOnSaveDraft = jest.fn();
  const mockOnPublish = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render when active', () => {
      render(
        <TestWrapper>
          {form => (
            <ReviewStep
              form={form}
              isActive={true}
              stepIndex={4}
              totalSteps={5}
              onEditStep={mockOnEditStep}
              isSubmitting={false}
              onSaveDraft={mockOnSaveDraft}
              onPublish={mockOnPublish}
              isSavingDraft={false}
            />
          )}
        </TestWrapper>
      );

      expect(screen.getByText('Review & Publish')).toBeInTheDocument();
    });

    it('should not render when inactive', () => {
      render(
        <TestWrapper>
          {form => (
            <ReviewStep
              form={form}
              isActive={false}
              stepIndex={4}
              totalSteps={5}
              onEditStep={mockOnEditStep}
              isSubmitting={false}
              onSaveDraft={mockOnSaveDraft}
              onPublish={mockOnPublish}
              isSavingDraft={false}
            />
          )}
        </TestWrapper>
      );

      expect(screen.queryByText('Review & Publish')).not.toBeInTheDocument();
    });
  });

  describe('Summary sections', () => {
    it('should display recipe title', () => {
      render(
        <TestWrapper>
          {form => (
            <ReviewStep
              form={form}
              isActive={true}
              stepIndex={4}
              totalSteps={5}
              onEditStep={mockOnEditStep}
              isSubmitting={false}
              onSaveDraft={mockOnSaveDraft}
              onPublish={mockOnPublish}
              isSavingDraft={false}
            />
          )}
        </TestWrapper>
      );

      expect(screen.getByText('Test Recipe')).toBeInTheDocument();
    });

    it('should display recipe description', () => {
      render(
        <TestWrapper>
          {form => (
            <ReviewStep
              form={form}
              isActive={true}
              stepIndex={4}
              totalSteps={5}
              onEditStep={mockOnEditStep}
              isSubmitting={false}
              onSaveDraft={mockOnSaveDraft}
              onPublish={mockOnPublish}
              isSavingDraft={false}
            />
          )}
        </TestWrapper>
      );

      expect(screen.getByText('A delicious test recipe')).toBeInTheDocument();
    });

    it('should display servings', () => {
      render(
        <TestWrapper>
          {form => (
            <ReviewStep
              form={form}
              isActive={true}
              stepIndex={4}
              totalSteps={5}
              onEditStep={mockOnEditStep}
              isSubmitting={false}
              onSaveDraft={mockOnSaveDraft}
              onPublish={mockOnPublish}
              isSavingDraft={false}
            />
          )}
        </TestWrapper>
      );

      expect(screen.getByText('Servings:')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
    });

    it('should display ingredients count', () => {
      render(
        <TestWrapper>
          {form => (
            <ReviewStep
              form={form}
              isActive={true}
              stepIndex={4}
              totalSteps={5}
              onEditStep={mockOnEditStep}
              isSubmitting={false}
              onSaveDraft={mockOnSaveDraft}
              onPublish={mockOnPublish}
              isSavingDraft={false}
            />
          )}
        </TestWrapper>
      );

      expect(screen.getByText('Ingredients (2)')).toBeInTheDocument();
    });

    it('should display instructions count', () => {
      render(
        <TestWrapper>
          {form => (
            <ReviewStep
              form={form}
              isActive={true}
              stepIndex={4}
              totalSteps={5}
              onEditStep={mockOnEditStep}
              isSubmitting={false}
              onSaveDraft={mockOnSaveDraft}
              onPublish={mockOnPublish}
              isSavingDraft={false}
            />
          )}
        </TestWrapper>
      );

      expect(screen.getByText('Instructions (2 steps)')).toBeInTheDocument();
    });
  });

  describe('Edit buttons', () => {
    it('should call onEditStep with BASIC_INFO when basic info edit is clicked', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <ReviewStep
              form={form}
              isActive={true}
              stepIndex={4}
              totalSteps={5}
              onEditStep={mockOnEditStep}
              isSubmitting={false}
              onSaveDraft={mockOnSaveDraft}
              onPublish={mockOnPublish}
              isSavingDraft={false}
            />
          )}
        </TestWrapper>
      );

      // Find the edit buttons
      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      // First edit button should be for Basic Information
      await user.click(editButtons[0]);

      expect(mockOnEditStep).toHaveBeenCalledWith(
        CreateRecipeWizardStep.BASIC_INFO
      );
    });
  });

  describe('Tags management', () => {
    it('should display existing tags', () => {
      render(
        <TestWrapper>
          {form => (
            <ReviewStep
              form={form}
              isActive={true}
              stepIndex={4}
              totalSteps={5}
              onEditStep={mockOnEditStep}
              isSubmitting={false}
              onSaveDraft={mockOnSaveDraft}
              onPublish={mockOnPublish}
              isSavingDraft={false}
            />
          )}
        </TestWrapper>
      );

      expect(screen.getByText('dessert')).toBeInTheDocument();
      expect(screen.getByText('baking')).toBeInTheDocument();
    });

    it('should show tags counter', () => {
      render(
        <TestWrapper>
          {form => (
            <ReviewStep
              form={form}
              isActive={true}
              stepIndex={4}
              totalSteps={5}
              onEditStep={mockOnEditStep}
              isSubmitting={false}
              onSaveDraft={mockOnSaveDraft}
              onPublish={mockOnPublish}
              isSavingDraft={false}
            />
          )}
        </TestWrapper>
      );

      expect(screen.getByText('2/20')).toBeInTheDocument();
    });

    it('should add new tag when add button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <ReviewStep
              form={form}
              isActive={true}
              stepIndex={4}
              totalSteps={5}
              onEditStep={mockOnEditStep}
              isSubmitting={false}
              onSaveDraft={mockOnSaveDraft}
              onPublish={mockOnPublish}
              isSavingDraft={false}
            />
          )}
        </TestWrapper>
      );

      const tagInput = screen.getByPlaceholderText(/add a tag/i);
      await user.type(tagInput, 'vegetarian');

      // Find the add button (the plus button next to the input)
      const addButtons = screen.getAllByRole('button');
      const addTagButton = addButtons.find(btn =>
        btn.querySelector('svg.lucide-plus')
      );

      if (addTagButton) {
        await user.click(addTagButton);
      }

      // Tag should be added
      expect(screen.getByText('vegetarian')).toBeInTheDocument();
    });
  });

  describe('Tag confirmation prompt', () => {
    it('should show confirmation prompt when input loses focus with text', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <ReviewStep
              form={form}
              isActive={true}
              stepIndex={4}
              totalSteps={5}
              onEditStep={mockOnEditStep}
              isSubmitting={false}
              onSaveDraft={mockOnSaveDraft}
              onPublish={mockOnPublish}
              isSavingDraft={false}
            />
          )}
        </TestWrapper>
      );

      const tagInput = screen.getByPlaceholderText(/add a tag/i);
      await user.type(tagInput, 'vegetarian');
      await user.tab(); // Trigger blur

      expect(screen.getByText(/as a tag\?/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /^yes$/i })
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^no$/i })).toBeInTheDocument();
    });

    it('should add tag when clicking Yes on confirmation', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <ReviewStep
              form={form}
              isActive={true}
              stepIndex={4}
              totalSteps={5}
              onEditStep={mockOnEditStep}
              isSubmitting={false}
              onSaveDraft={mockOnSaveDraft}
              onPublish={mockOnPublish}
              isSavingDraft={false}
            />
          )}
        </TestWrapper>
      );

      const tagInput = screen.getByPlaceholderText(/add a tag/i);
      await user.type(tagInput, 'vegetarian');
      await user.tab();

      await user.click(screen.getByRole('button', { name: /^yes$/i }));

      expect(screen.getByText('vegetarian')).toBeInTheDocument();
      expect(screen.queryByText(/as a tag\?/i)).not.toBeInTheDocument();
    });

    it('should dismiss prompt and clear input when clicking No', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <ReviewStep
              form={form}
              isActive={true}
              stepIndex={4}
              totalSteps={5}
              onEditStep={mockOnEditStep}
              isSubmitting={false}
              onSaveDraft={mockOnSaveDraft}
              onPublish={mockOnPublish}
              isSavingDraft={false}
            />
          )}
        </TestWrapper>
      );

      const tagInput = screen.getByPlaceholderText(/add a tag/i);
      await user.type(tagInput, 'vegetarian');
      await user.tab();

      await user.click(screen.getByRole('button', { name: /^no$/i }));

      expect(screen.queryByText(/as a tag\?/i)).not.toBeInTheDocument();
      expect(tagInput).toHaveValue('');
    });

    it('should not show prompt for empty input on blur', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <ReviewStep
              form={form}
              isActive={true}
              stepIndex={4}
              totalSteps={5}
              onEditStep={mockOnEditStep}
              isSubmitting={false}
              onSaveDraft={mockOnSaveDraft}
              onPublish={mockOnPublish}
              isSavingDraft={false}
            />
          )}
        </TestWrapper>
      );

      const tagInput = screen.getByPlaceholderText(/add a tag/i);
      await user.click(tagInput);
      await user.tab();

      expect(screen.queryByText(/as a tag\?/i)).not.toBeInTheDocument();
    });

    it('should not show prompt for duplicate tag on blur', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <ReviewStep
              form={form}
              isActive={true}
              stepIndex={4}
              totalSteps={5}
              onEditStep={mockOnEditStep}
              isSubmitting={false}
              onSaveDraft={mockOnSaveDraft}
              onPublish={mockOnPublish}
              isSavingDraft={false}
            />
          )}
        </TestWrapper>
      );

      const tagInput = screen.getByPlaceholderText(/add a tag/i);
      // 'dessert' is already in validFormData tags
      await user.type(tagInput, 'dessert');
      await user.tab();

      expect(screen.queryByText(/as a tag\?/i)).not.toBeInTheDocument();
    });
  });

  describe('Action buttons', () => {
    it('should display Save as Draft and Publish buttons', () => {
      render(
        <TestWrapper>
          {form => (
            <ReviewStep
              form={form}
              isActive={true}
              stepIndex={4}
              totalSteps={5}
              onEditStep={mockOnEditStep}
              isSubmitting={false}
              onSaveDraft={mockOnSaveDraft}
              onPublish={mockOnPublish}
              isSavingDraft={false}
            />
          )}
        </TestWrapper>
      );

      expect(
        screen.getByRole('button', { name: /save as draft/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /publish recipe/i })
      ).toBeInTheDocument();
    });

    it('should call onSaveDraft when Save as Draft is clicked', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <ReviewStep
              form={form}
              isActive={true}
              stepIndex={4}
              totalSteps={5}
              onEditStep={mockOnEditStep}
              isSubmitting={false}
              onSaveDraft={mockOnSaveDraft}
              onPublish={mockOnPublish}
              isSavingDraft={false}
            />
          )}
        </TestWrapper>
      );

      await user.click(screen.getByRole('button', { name: /save as draft/i }));

      expect(mockOnSaveDraft).toHaveBeenCalled();
    });

    it('should call onPublish when Publish is clicked', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <ReviewStep
              form={form}
              isActive={true}
              stepIndex={4}
              totalSteps={5}
              onEditStep={mockOnEditStep}
              isSubmitting={false}
              onSaveDraft={mockOnSaveDraft}
              onPublish={mockOnPublish}
              isSavingDraft={false}
            />
          )}
        </TestWrapper>
      );

      await user.click(screen.getByRole('button', { name: /publish recipe/i }));

      expect(mockOnPublish).toHaveBeenCalled();
    });

    it('should show loading state when saving draft', () => {
      render(
        <TestWrapper>
          {form => (
            <ReviewStep
              form={form}
              isActive={true}
              stepIndex={4}
              totalSteps={5}
              onEditStep={mockOnEditStep}
              isSubmitting={false}
              onSaveDraft={mockOnSaveDraft}
              onPublish={mockOnPublish}
              isSavingDraft={true}
            />
          )}
        </TestWrapper>
      );

      expect(screen.getByText('Saving...')).toBeInTheDocument();
    });

    it('should show loading state when publishing', () => {
      render(
        <TestWrapper>
          {form => (
            <ReviewStep
              form={form}
              isActive={true}
              stepIndex={4}
              totalSteps={5}
              onEditStep={mockOnEditStep}
              isSubmitting={true}
              onSaveDraft={mockOnSaveDraft}
              onPublish={mockOnPublish}
              isSavingDraft={false}
            />
          )}
        </TestWrapper>
      );

      expect(screen.getByText('Publishing...')).toBeInTheDocument();
    });
  });

  describe('Helper text', () => {
    it('should display tag helper text', () => {
      render(
        <TestWrapper>
          {form => (
            <ReviewStep
              form={form}
              isActive={true}
              stepIndex={4}
              totalSteps={5}
              onEditStep={mockOnEditStep}
              isSubmitting={false}
              onSaveDraft={mockOnSaveDraft}
              onPublish={mockOnPublish}
              isSavingDraft={false}
            />
          )}
        </TestWrapper>
      );

      expect(
        screen.getByText(/tags help others discover your recipe/i)
      ).toBeInTheDocument();
    });
  });
});
