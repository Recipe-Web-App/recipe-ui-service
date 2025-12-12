'use client';

import * as React from 'react';
import {
  Pencil,
  Clock,
  Users,
  ChefHat,
  Plus,
  X,
  Check,
  Loader2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import { DifficultyLevel } from '@/types/recipe-management/common';
import {
  CreateRecipeWizardStep,
  type ReviewStepProps,
} from '@/types/recipe/create-recipe-wizard';

/**
 * Format difficulty level for display
 */
function formatDifficulty(level?: DifficultyLevel): string {
  if (!level) return 'Not set';
  const labels: Record<DifficultyLevel, string> = {
    [DifficultyLevel.BEGINNER]: 'Beginner',
    [DifficultyLevel.EASY]: 'Easy',
    [DifficultyLevel.MEDIUM]: 'Medium',
    [DifficultyLevel.HARD]: 'Hard',
    [DifficultyLevel.EXPERT]: 'Expert',
  };
  // eslint-disable-next-line security/detect-object-injection
  return labels[level];
}

/**
 * Format minutes to a readable time string
 */
function formatTime(minutes?: number): string {
  if (!minutes || minutes === 0) return 'Not set';
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

/**
 * ReviewStep Component
 *
 * Final step of the recipe creation wizard.
 * Displays a summary of the recipe and allows publishing or saving as draft.
 */
export function ReviewStep({
  form,
  isActive,
  onEditStep,
  isSubmitting,
  onSaveDraft,
  onPublish,
  isSavingDraft,
}: ReviewStepProps) {
  const [newTag, setNewTag] = React.useState('');
  const {
    watch,
    setValue,
    formState: { errors, isValid },
  } = form;

  const formData = watch();
  const tags = watch('tags') ?? [];

  if (!isActive) return null;

  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 20) {
      setValue('tags', [...tags, trimmedTag], { shouldValidate: true });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue(
      'tags',
      tags.filter(tag => tag !== tagToRemove),
      { shouldValidate: true }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const totalTime = (formData.prepTime ?? 0) + (formData.cookTime ?? 0);

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl">Review & Publish</CardTitle>
        <CardDescription>
          Review your recipe details and add tags before publishing.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-0">
        {/* Basic Info Section */}
        <SummarySection
          title="Basic Information"
          onEdit={() => onEditStep(CreateRecipeWizardStep.BASIC_INFO)}
        >
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              {formData.title || 'Untitled Recipe'}
            </h3>
            {formData.description && (
              <p className="text-muted-foreground text-sm">
                {formData.description}
              </p>
            )}
          </div>
        </SummarySection>

        <Divider />

        {/* Timing Section */}
        <SummarySection
          title="Timing & Servings"
          onEdit={() => onEditStep(CreateRecipeWizardStep.TIMING)}
        >
          <div className="flex flex-wrap gap-4">
            <MetricBadge
              icon={<Users className="h-4 w-4" />}
              label="Servings"
              value={String(formData.servings)}
            />
            <MetricBadge
              icon={<Clock className="h-4 w-4" />}
              label="Prep"
              value={formatTime(formData.prepTime)}
            />
            <MetricBadge
              icon={<Clock className="h-4 w-4" />}
              label="Cook"
              value={formatTime(formData.cookTime)}
            />
            {totalTime > 0 && (
              <MetricBadge
                icon={<Clock className="h-4 w-4" />}
                label="Total"
                value={formatTime(totalTime)}
              />
            )}
            <MetricBadge
              icon={<ChefHat className="h-4 w-4" />}
              label="Difficulty"
              value={formatDifficulty(formData.difficulty)}
            />
          </div>
        </SummarySection>

        <Divider />

        {/* Ingredients Section */}
        <SummarySection
          title={`Ingredients (${formData.ingredients?.length ?? 0})`}
          onEdit={() => onEditStep(CreateRecipeWizardStep.INGREDIENTS)}
        >
          <ul className="space-y-1 text-sm">
            {formData.ingredients?.map((ingredient, index) => (
              <li
                key={ingredient.id || index}
                className="flex items-start gap-2"
              >
                <span className="text-primary">•</span>
                <span>
                  {ingredient.quantity} {ingredient.unit.toLowerCase()}{' '}
                  {ingredient.name}
                  {ingredient.notes && (
                    <span className="text-muted-foreground">
                      {' '}
                      ({ingredient.notes})
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </SummarySection>

        <Divider />

        {/* Instructions Section */}
        <SummarySection
          title={`Instructions (${formData.steps?.length ?? 0} steps)`}
          onEdit={() => onEditStep(CreateRecipeWizardStep.INSTRUCTIONS)}
        >
          <ol className="space-y-3 text-sm">
            {formData.steps?.map((step, index) => (
              <li key={step.id || index} className="flex gap-3">
                <Badge
                  variant="outline"
                  className="flex h-6 w-6 shrink-0 items-center justify-center p-0"
                >
                  {index + 1}
                </Badge>
                <div className="flex-1">
                  <p>{step.instruction}</p>
                  {step.duration && (
                    <p className="text-muted-foreground mt-1 text-xs">
                      <Clock className="mr-1 inline h-3 w-3" />
                      {step.duration} min
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </SummarySection>

        <Divider />

        {/* Tags Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Tags</h4>
            <span className="text-muted-foreground text-xs">
              {tags.length}/20
            </span>
          </div>

          {/* Current Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary" className="pr-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:bg-muted ml-1 rounded-full p-0.5"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Add Tag Input */}
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a tag (e.g., Italian, Vegetarian)"
              size="sm"
              className="flex-1"
              disabled={tags.length >= 20}
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleAddTag}
              disabled={!newTag.trim() || tags.length >= 20}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-muted-foreground text-xs">
            Tags help others discover your recipe. Press Enter to add a tag.
          </p>
        </div>

        <Divider />

        {/* Validation Summary */}
        {!isValid && Object.keys(errors).length > 0 && (
          <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-4">
            <h4 className="text-destructive mb-2 font-medium">
              Please fix the following:
            </h4>
            <ul className="text-destructive space-y-1 text-sm">
              {errors.title && <li>• Title: {errors.title.message}</li>}
              {errors.servings && (
                <li>• Servings: {errors.servings.message}</li>
              )}
              {errors.ingredients && (
                <li>• Ingredients: {errors.ingredients.message}</li>
              )}
              {errors.steps && <li>• Instructions: {errors.steps.message}</li>}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={onSaveDraft}
            disabled={isSavingDraft || isSubmitting}
            className="flex-1"
          >
            {isSavingDraft ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save as Draft'
            )}
          </Button>
          <Button
            type="button"
            onClick={onPublish}
            disabled={!isValid || isSubmitting || isSavingDraft}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Publish Recipe
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Summary Section Component
 */
interface SummarySectionProps {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}

function SummarySection({ title, onEdit, children }: SummarySectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{title}</h4>
        <Button type="button" variant="ghost" size="sm" onClick={onEdit}>
          <Pencil className="mr-1 h-3 w-3" />
          Edit
        </Button>
      </div>
      {children}
    </div>
  );
}

/**
 * Metric Badge Component
 */
interface MetricBadgeProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function MetricBadge({ icon, label, value }: MetricBadgeProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

ReviewStep.displayName = 'ReviewStep';
