'use client';

import * as React from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TagInput } from '@/components/ui/tag-input';
import { cn } from '@/lib/utils';
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
        <div className="space-y-3">
          <label
            className="mb-2 block text-sm font-medium"
            id="visibility-label"
          >
            Visibility
          </label>
          <Controller
            name="visibility"
            control={control}
            render={({ field }) => (
              <div
                role="radiogroup"
                aria-labelledby="visibility-label"
                className="border-border mt-2 inline-flex rounded-md border"
              >
                {VISIBILITY_OPTIONS.map((option, index) => (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={field.value === option.value}
                    onClick={() => field.onChange(option.value)}
                    className={cn(
                      'px-6 py-2 text-sm font-medium transition-colors',
                      'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                      index === 0 && 'rounded-l-md',
                      index === VISIBILITY_OPTIONS.length - 1 && 'rounded-r-md',
                      index !== VISIBILITY_OPTIONS.length - 1 &&
                        'border-border border-r',
                      field.value === option.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background hover:bg-muted'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          />
          {errors.visibility && (
            <p className="text-destructive text-sm">
              {errors.visibility.message}
            </p>
          )}
        </div>

        {/* Collaboration Mode */}
        <div className="space-y-3">
          <label
            className="mb-2 block text-sm font-medium"
            id="collaboration-mode-label"
          >
            Collaboration Mode
          </label>
          <Controller
            name="collaborationMode"
            control={control}
            render={({ field }) => (
              <div
                role="radiogroup"
                aria-labelledby="collaboration-mode-label"
                className="border-border mt-2 inline-flex rounded-md border"
              >
                {COLLABORATION_MODE_OPTIONS.map((option, index) => (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={field.value === option.value}
                    onClick={() => field.onChange(option.value)}
                    className={cn(
                      'px-6 py-2 text-sm font-medium transition-colors',
                      'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                      index === 0 && 'rounded-l-md',
                      index === COLLABORATION_MODE_OPTIONS.length - 1 &&
                        'rounded-r-md',
                      index !== COLLABORATION_MODE_OPTIONS.length - 1 &&
                        'border-border border-r',
                      field.value === option.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background hover:bg-muted'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          />
          {errors.collaborationMode && (
            <p className="text-destructive text-sm">
              {errors.collaborationMode.message}
            </p>
          )}
        </div>

        {/* Tags */}
        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <TagInput
              value={field.value ?? []}
              onChange={field.onChange}
              placeholder="Add a tag (e.g., Family Favorites, Quick Meals)"
              maxTags={CREATE_COLLECTION_LIMITS.MAX_TAGS}
              helperText={`Optional: Add up to ${CREATE_COLLECTION_LIMITS.MAX_TAGS} tags to help categorize your collection`}
              error={errors.tags?.message}
            />
          )}
        />
      </CardContent>
    </Card>
  );
}

BasicInfoSection.displayName = 'BasicInfoSection';
