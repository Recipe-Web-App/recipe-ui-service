'use client';

import * as React from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup } from '@/components/ui/radio';
import { ChipInput } from '@/components/ui/chip';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import type {
  CreateCollectionFormData,
  SectionComponentProps,
} from '@/types/collection/create-collection-form';
import {
  VISIBILITY_OPTIONS,
  COLLABORATION_MODE_OPTIONS,
  CREATE_COLLECTION_LIMITS,
} from '@/types/collection/create-collection-form';

/**
 * Props for the BasicInfoSection component.
 */
export interface BasicInfoSectionProps extends SectionComponentProps {
  /** React Hook Form instance */
  form: UseFormReturn<CreateCollectionFormData>;
}

/**
 * BasicInfoSection Component
 *
 * First section of the create collection form.
 * Captures the collection name, description, visibility, collaboration mode, and tags.
 */
export function BasicInfoSection({
  form,
  isActive = true,
}: BasicInfoSectionProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  if (!isActive) return null;

  // Transform options to match RadioGroup expected format
  const visibilityRadioOptions = VISIBILITY_OPTIONS.map(option => ({
    id: `visibility-${option.value}`,
    value: option.value,
    label: option.label,
    description: option.description,
  }));

  const collaborationModeRadioOptions = COLLABORATION_MODE_OPTIONS.map(
    option => ({
      id: `collaboration-${option.value}`,
      value: option.value,
      label: option.label,
      description: option.description,
    })
  );

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl">Basic Information</CardTitle>
        <CardDescription>
          Give your collection a name and configure its settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-0">
        {/* Collection Name */}
        <div className="space-y-2">
          <Input
            id="name"
            label="Collection Name"
            placeholder="e.g., Quick Weeknight Dinners"
            required
            {...register('name')}
            errorText={errors.name?.message}
            helperText={`A descriptive name helps others find your collection (${CREATE_COLLECTION_LIMITS.NAME_MIN_LENGTH}-${CREATE_COLLECTION_LIMITS.NAME_MAX_LENGTH} characters)`}
          />
        </div>

        {/* Collection Description */}
        <div className="space-y-2">
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea
                id="description"
                label="Description"
                placeholder="Describe what makes this collection special..."
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                errorMessage={errors.description?.message}
                maxLength={CREATE_COLLECTION_LIMITS.DESCRIPTION_MAX_LENGTH}
                showCharacterCount
                rows={3}
                autoResize
                helperText="Optional: Share the theme or purpose of your collection"
              />
            )}
          />
        </div>

        {/* Visibility */}
        <div className="space-y-2">
          <label className="text-sm font-medium" id="visibility-label">
            Visibility
          </label>
          <Controller
            name="visibility"
            control={control}
            render={({ field }) => (
              <RadioGroup
                name="visibility"
                options={visibilityRadioOptions}
                value={field.value}
                onValueChange={field.onChange}
                error={errors.visibility?.message}
                aria-labelledby="visibility-label"
              />
            )}
          />
        </div>

        {/* Collaboration Mode */}
        <div className="space-y-2">
          <label className="text-sm font-medium" id="collaboration-mode-label">
            Collaboration Mode
          </label>
          <Controller
            name="collaborationMode"
            control={control}
            render={({ field }) => (
              <RadioGroup
                name="collaborationMode"
                options={collaborationModeRadioOptions}
                value={field.value}
                onValueChange={field.onChange}
                error={errors.collaborationMode?.message}
                aria-labelledby="collaboration-mode-label"
              />
            )}
          />
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="tags-input">
            Tags
          </label>
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <ChipInput
                value={field.value ?? []}
                onChange={field.onChange}
                placeholder="Add tags (press Enter)..."
                maxChips={CREATE_COLLECTION_LIMITS.MAX_TAGS}
                validate={tag => {
                  if (tag.length > CREATE_COLLECTION_LIMITS.MAX_TAG_LENGTH) {
                    return `Tag must be ${CREATE_COLLECTION_LIMITS.MAX_TAG_LENGTH} characters or less`;
                  }
                  return true;
                }}
              />
            )}
          />
          <p className="text-muted-foreground text-sm">
            Optional: Add up to {CREATE_COLLECTION_LIMITS.MAX_TAGS} tags to help
            categorize your collection
          </p>
          {errors.tags?.message && (
            <p className="text-destructive text-sm" role="alert">
              {errors.tags.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

BasicInfoSection.displayName = 'BasicInfoSection';
