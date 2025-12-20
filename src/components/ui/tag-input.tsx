'use client';

import * as React from 'react';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { TagInputProps } from '@/types/ui/tag-input.types';

/**
 * TagInput Component
 *
 * A reusable tag input component for adding and managing tags.
 * Features:
 * - Add tags via Enter key or button click
 * - Pending confirmation on blur (optional)
 * - Case-insensitive duplicate detection
 * - Max tags limit with counter display
 * - Remove tags with X button
 * - Accessible error messaging
 *
 * @example
 * ```tsx
 * <TagInput
 *   value={tags}
 *   onChange={setTags}
 *   placeholder="Add a tag (e.g., Italian, Vegetarian)"
 *   maxTags={20}
 *   helperText="Tags help others discover your recipe."
 * />
 * ```
 */
export function TagInput({
  value,
  onChange,
  placeholder = 'Add a tag...',
  maxTags = 20,
  disabled = false,
  showCount = true,
  showPendingConfirmation = true,
  helperText,
  error,
  className,
  label = 'Tags',
}: TagInputProps) {
  const [newTag, setNewTag] = React.useState('');
  const [pendingTag, setPendingTag] = React.useState<string | null>(null);
  const [tagError, setTagError] = React.useState<string | null>(null);

  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    if (!trimmedTag) {
      return;
    }

    // Case-insensitive duplicate check
    const isDuplicate = value.some(
      tag => tag.toLowerCase() === trimmedTag.toLowerCase()
    );

    if (isDuplicate) {
      setTagError('This tag has already been added');
      return;
    }

    if (value.length >= maxTags) {
      setTagError(`Maximum of ${maxTags} tags allowed`);
      return;
    }

    onChange([...value, trimmedTag]);
    setNewTag('');
    setPendingTag(null);
    setTagError(null);
  };

  const handleInputBlur = () => {
    if (!showPendingConfirmation) {
      return;
    }

    const trimmedTag = newTag.trim();
    const isDuplicate = value.some(
      tag => tag.toLowerCase() === trimmedTag.toLowerCase()
    );
    if (trimmedTag && !isDuplicate && value.length < maxTags) {
      setPendingTag(trimmedTag);
    }
  };

  const handleConfirmPendingTag = () => {
    if (pendingTag) {
      onChange([...value, pendingTag]);
      setNewTag('');
      setPendingTag(null);
    }
  };

  const handleDismissPendingTag = () => {
    setPendingTag(null);
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const displayError = error ?? tagError;
  const isAtMaxCapacity = value.length >= maxTags;

  return (
    <div className={cn('space-y-3', className)}>
      {/* Header with label and count */}
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{label}</h4>
        {showCount && (
          <span className="text-muted-foreground text-xs">
            {value.length}/{maxTags}
          </span>
        )}
      </div>

      {/* Current Tags */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map(tag => (
            <Badge key={tag} variant="secondary" className="pr-1">
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="hover:bg-muted ml-1 rounded-full p-0.5"
                aria-label={`Remove tag ${tag}`}
                disabled={disabled}
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
          onChange={e => {
            setNewTag(e.target.value);
            setTagError(null);
          }}
          onKeyDown={handleKeyDown}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          size="sm"
          className="flex-1"
          disabled={disabled || isAtMaxCapacity}
          state={displayError ? 'error' : 'default'}
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleAddTag}
          disabled={disabled || !newTag.trim() || isAtMaxCapacity}
          aria-label="Add tag"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Error Message */}
      {displayError && (
        <p className="text-destructive text-sm" role="alert">
          {displayError}
        </p>
      )}

      {/* Helper Text */}
      {helperText && !displayError && (
        <p className="text-muted-foreground text-xs">{helperText}</p>
      )}

      {/* Pending Tag Confirmation */}
      {pendingTag && (
        <div className="bg-muted/50 flex items-center justify-between rounded-md px-3 py-2">
          <span className="text-sm">
            Add &ldquo;<strong>{pendingTag}</strong>&rdquo; as a tag?
          </span>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleDismissPendingTag}
            >
              No
            </Button>
            <Button
              type="button"
              size="sm"
              variant="default"
              onClick={handleConfirmPendingTag}
            >
              Yes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

TagInput.displayName = 'TagInput';
