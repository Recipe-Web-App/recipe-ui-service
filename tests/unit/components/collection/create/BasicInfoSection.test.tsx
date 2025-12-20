import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BasicInfoSection } from '@/components/collection/create/BasicInfoSection';
import { createCollectionFormSchema } from '@/lib/validation/create-collection-schemas';
import {
  CREATE_COLLECTION_DEFAULT_VALUES,
  CREATE_COLLECTION_LIMITS,
  type CreateCollectionFormData,
} from '@/types/collection/create-collection-form';
import {
  CollectionVisibility,
  CollaborationMode,
} from '@/types/recipe-management/common';

// Wrapper component that provides form context
function TestWrapper({
  children,
  defaultValues = CREATE_COLLECTION_DEFAULT_VALUES,
}: {
  children: (
    form: ReturnType<typeof useForm<CreateCollectionFormData>>
  ) => React.ReactNode;
  defaultValues?: CreateCollectionFormData;
}) {
  const form = useForm<CreateCollectionFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Schema output type differs from form type but is compatible at runtime
    resolver: zodResolver(createCollectionFormSchema) as any,
    defaultValues,
    mode: 'onChange',
  });

  return <>{children(form)}</>;
}

describe('BasicInfoSection', () => {
  describe('Rendering', () => {
    it('should render when active', () => {
      render(
        <TestWrapper>
          {form => <BasicInfoSection form={form} isActive={true} />}
        </TestWrapper>
      );

      expect(screen.getByText('Basic Information')).toBeInTheDocument();
      expect(screen.getByLabelText(/collection name/i)).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Visibility')).toBeInTheDocument();
      expect(screen.getByText('Collaboration Mode')).toBeInTheDocument();
      expect(screen.getByText('Tags')).toBeInTheDocument();
    });

    it('should not render when inactive', () => {
      render(
        <TestWrapper>
          {form => <BasicInfoSection form={form} isActive={false} />}
        </TestWrapper>
      );

      expect(screen.queryByText('Basic Information')).not.toBeInTheDocument();
    });

    it('should render with isActive defaulting to true', () => {
      render(
        <TestWrapper>{form => <BasicInfoSection form={form} />}</TestWrapper>
      );

      expect(screen.getByText('Basic Information')).toBeInTheDocument();
    });

    it('should show required indicator for name field', () => {
      render(
        <TestWrapper>
          {form => <BasicInfoSection form={form} isActive={true} />}
        </TestWrapper>
      );

      const nameInput = screen.getByLabelText(/collection name/i);
      expect(nameInput).toHaveAttribute('required');
    });

    it('should display helper text for name field', () => {
      render(
        <TestWrapper>
          {form => <BasicInfoSection form={form} isActive={true} />}
        </TestWrapper>
      );

      expect(
        screen.getByText(
          /a descriptive name helps others find your collection/i
        )
      ).toBeInTheDocument();
    });

    it('should display helper text for tags field', () => {
      render(
        <TestWrapper>
          {form => <BasicInfoSection form={form} isActive={true} />}
        </TestWrapper>
      );

      expect(
        screen.getByText(/add up to 20 tags to help categorize/i)
      ).toBeInTheDocument();
    });
  });

  describe('Name Input', () => {
    it('should update name value when typing', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => <BasicInfoSection form={form} isActive={true} />}
        </TestWrapper>
      );

      const nameInput = screen.getByLabelText(/collection name/i);
      await user.type(nameInput, 'My Test Collection');

      expect(nameInput).toHaveValue('My Test Collection');
    });

    it('should show error for empty name when validated', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <>
              <BasicInfoSection form={form} isActive={true} />
              <button type="button" onClick={() => form.trigger('name')}>
                Validate
              </button>
            </>
          )}
        </TestWrapper>
      );

      await user.click(screen.getByRole('button', { name: /validate/i }));

      expect(
        await screen.findByText('Collection name is required')
      ).toBeInTheDocument();
    });

    it('should show error for name that is too short', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => (
            <>
              <BasicInfoSection form={form} isActive={true} />
              <button type="button" onClick={() => form.trigger('name')}>
                Validate
              </button>
            </>
          )}
        </TestWrapper>
      );

      const nameInput = screen.getByLabelText(/collection name/i);
      await user.type(nameInput, 'ab');
      await user.click(screen.getByRole('button', { name: /validate/i }));

      expect(
        await screen.findByText(
          `Collection name must be at least ${CREATE_COLLECTION_LIMITS.NAME_MIN_LENGTH} characters`
        )
      ).toBeInTheDocument();
    });

    it('should show error for name that is too long', async () => {
      // Start with pre-populated long name since typing is slow
      const longName = 'a'.repeat(CREATE_COLLECTION_LIMITS.NAME_MAX_LENGTH + 1);
      const defaultValues: CreateCollectionFormData = {
        ...CREATE_COLLECTION_DEFAULT_VALUES,
        name: longName,
      };

      render(
        <TestWrapper defaultValues={defaultValues}>
          {form => (
            <>
              <BasicInfoSection form={form} isActive={true} />
              <button type="button" onClick={() => form.trigger('name')}>
                Validate
              </button>
            </>
          )}
        </TestWrapper>
      );

      const user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: /validate/i }));

      expect(
        await screen.findByText(
          `Collection name must not exceed ${CREATE_COLLECTION_LIMITS.NAME_MAX_LENGTH} characters`
        )
      ).toBeInTheDocument();
    });
  });

  describe('Description Textarea', () => {
    it('should update description value when typing', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => <BasicInfoSection form={form} isActive={true} />}
        </TestWrapper>
      );

      const descriptionTextarea = screen.getByPlaceholderText(
        /describe what makes this collection special/i
      );
      await user.type(descriptionTextarea, 'A great collection');

      expect(descriptionTextarea).toHaveValue('A great collection');
    });

    it('should show character count', () => {
      render(
        <TestWrapper>
          {form => <BasicInfoSection form={form} isActive={true} />}
        </TestWrapper>
      );

      const descriptionTextarea = screen.getByPlaceholderText(
        /describe what makes this collection special/i
      );
      expect(descriptionTextarea).toHaveAttribute(
        'maxlength',
        String(CREATE_COLLECTION_LIMITS.DESCRIPTION_MAX_LENGTH)
      );
    });
  });

  describe('Visibility Segmented Control', () => {
    it('should render all visibility options', () => {
      render(
        <TestWrapper>
          {form => <BasicInfoSection form={form} isActive={true} />}
        </TestWrapper>
      );

      expect(
        screen.getByRole('radio', { name: 'Private' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('radio', { name: 'Friends Only' })
      ).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: 'Public' })).toBeInTheDocument();
    });

    it('should have Private selected by default', () => {
      render(
        <TestWrapper>
          {form => <BasicInfoSection form={form} isActive={true} />}
        </TestWrapper>
      );

      const privateRadio = screen.getByRole('radio', { name: 'Private' });
      expect(privateRadio).toHaveAttribute('aria-checked', 'true');
    });

    it('should allow changing visibility', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => <BasicInfoSection form={form} isActive={true} />}
        </TestWrapper>
      );

      const publicRadio = screen.getByRole('radio', { name: 'Public' });
      await user.click(publicRadio);

      expect(publicRadio).toHaveAttribute('aria-checked', 'true');
      expect(screen.getByRole('radio', { name: 'Private' })).toHaveAttribute(
        'aria-checked',
        'false'
      );
    });
  });

  describe('Collaboration Mode Segmented Control', () => {
    it('should render all collaboration mode options', () => {
      render(
        <TestWrapper>
          {form => <BasicInfoSection form={form} isActive={true} />}
        </TestWrapper>
      );

      expect(
        screen.getByRole('radio', { name: 'Owner Only' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('radio', { name: 'Specific Users' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('radio', { name: 'All Users' })
      ).toBeInTheDocument();
    });

    it('should have Owner Only selected by default', () => {
      render(
        <TestWrapper>
          {form => <BasicInfoSection form={form} isActive={true} />}
        </TestWrapper>
      );

      const ownerOnlyRadio = screen.getByRole('radio', { name: 'Owner Only' });
      expect(ownerOnlyRadio).toHaveAttribute('aria-checked', 'true');
    });

    it('should allow changing collaboration mode', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => <BasicInfoSection form={form} isActive={true} />}
        </TestWrapper>
      );

      const specificUsersRadio = screen.getByRole('radio', {
        name: 'Specific Users',
      });
      await user.click(specificUsersRadio);

      expect(specificUsersRadio).toHaveAttribute('aria-checked', 'true');
      expect(screen.getByRole('radio', { name: 'Owner Only' })).toHaveAttribute(
        'aria-checked',
        'false'
      );
    });
  });

  describe('Tags TagInput', () => {
    it('should render tags input', () => {
      render(
        <TestWrapper>
          {form => <BasicInfoSection form={form} isActive={true} />}
        </TestWrapper>
      );

      expect(screen.getByPlaceholderText(/add a tag/i)).toBeInTheDocument();
    });

    it('should render tag count', () => {
      render(
        <TestWrapper>
          {form => <BasicInfoSection form={form} isActive={true} />}
        </TestWrapper>
      );

      expect(screen.getByText('0/20')).toBeInTheDocument();
    });

    it('should allow adding tags', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => <BasicInfoSection form={form} isActive={true} />}
        </TestWrapper>
      );

      const tagsInput = screen.getByPlaceholderText(/add a tag/i);
      await user.type(tagsInput, 'vegetarian{enter}');

      expect(screen.getByText('vegetarian')).toBeInTheDocument();
    });

    it('should allow adding multiple tags', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => <BasicInfoSection form={form} isActive={true} />}
        </TestWrapper>
      );

      const tagsInput = screen.getByPlaceholderText(/add a tag/i);
      await user.type(tagsInput, 'vegetarian{enter}');
      await user.type(tagsInput, 'quick{enter}');
      await user.type(tagsInput, 'healthy{enter}');

      expect(screen.getByText('vegetarian')).toBeInTheDocument();
      expect(screen.getByText('quick')).toBeInTheDocument();
      expect(screen.getByText('healthy')).toBeInTheDocument();
    });

    it('should not allow duplicate tags', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => <BasicInfoSection form={form} isActive={true} />}
        </TestWrapper>
      );

      const tagsInput = screen.getByPlaceholderText(/add a tag/i);
      await user.type(tagsInput, 'vegetarian{enter}');
      await user.type(tagsInput, 'vegetarian{enter}');

      // Should only have one 'vegetarian' badge and show duplicate error
      const vegetarianBadges = screen.getAllByText('vegetarian');
      expect(vegetarianBadges).toHaveLength(1);
      expect(
        screen.getByText('This tag has already been added')
      ).toBeInTheDocument();
    });

    it('should allow removing tags', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => <BasicInfoSection form={form} isActive={true} />}
        </TestWrapper>
      );

      const tagsInput = screen.getByPlaceholderText(/add a tag/i);
      await user.type(tagsInput, 'vegetarian{enter}');

      const removeButton = screen.getByRole('button', {
        name: /remove tag vegetarian/i,
      });
      await user.click(removeButton);

      expect(screen.queryByText('vegetarian')).not.toBeInTheDocument();
    });
  });

  describe('Pre-populated values', () => {
    it('should render with pre-populated values', () => {
      const defaultValues: CreateCollectionFormData = {
        ...CREATE_COLLECTION_DEFAULT_VALUES,
        name: 'My Collection',
        description: 'A test collection',
        visibility: CollectionVisibility.PUBLIC,
        collaborationMode: CollaborationMode.ALL_USERS,
        tags: ['tag1', 'tag2'],
      };

      render(
        <TestWrapper defaultValues={defaultValues}>
          {form => <BasicInfoSection form={form} isActive={true} />}
        </TestWrapper>
      );

      expect(screen.getByLabelText(/collection name/i)).toHaveValue(
        'My Collection'
      );
      expect(
        screen.getByPlaceholderText(
          /describe what makes this collection special/i
        )
      ).toHaveValue('A test collection');
      expect(screen.getByRole('radio', { name: 'Public' })).toHaveAttribute(
        'aria-checked',
        'true'
      );
      expect(screen.getByRole('radio', { name: 'All Users' })).toHaveAttribute(
        'aria-checked',
        'true'
      );
      expect(screen.getByText('tag1')).toBeInTheDocument();
      expect(screen.getByText('tag2')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-labelledby for visibility', () => {
      render(
        <TestWrapper>
          {form => <BasicInfoSection form={form} isActive={true} />}
        </TestWrapper>
      );

      expect(screen.getByLabelText('Visibility')).toBeInTheDocument();
    });

    it('should have proper aria-labelledby for collaboration mode', () => {
      render(
        <TestWrapper>
          {form => <BasicInfoSection form={form} isActive={true} />}
        </TestWrapper>
      );

      expect(screen.getByLabelText('Collaboration Mode')).toBeInTheDocument();
    });
  });
});
