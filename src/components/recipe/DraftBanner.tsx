'use client';

import * as React from 'react';
import Link from 'next/link';
import { FileEdit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertActions,
} from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useRecipeStore } from '@/stores/recipe-store';

export interface DraftBannerProps {
  /** Callback when user clicks "Continue Editing" */
  onContinue?: () => void;
  /** Callback when user clicks "Discard" */
  onDiscard?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * DraftBanner Component
 *
 * Displays a banner when the user has an unsaved draft recipe in the local store.
 * Provides options to continue editing or discard the draft.
 *
 * @example
 * ```tsx
 * <DraftBanner
 *   onContinue={() => router.push('/recipes/create')}
 *   onDiscard={() => clearDraft()}
 * />
 * ```
 */
export const DraftBanner = React.forwardRef<HTMLDivElement, DraftBannerProps>(
  ({ onContinue, onDiscard, className }, ref) => {
    const {
      hasUnsavedDraft,
      draftRecipe,
      draftLastModified,
      clearDraftRecipe,
    } = useRecipeStore();

    const hasDraft = hasUnsavedDraft();

    const handleDiscard = React.useCallback(() => {
      clearDraftRecipe();
      onDiscard?.();
    }, [clearDraftRecipe, onDiscard]);

    // Don't render if no draft exists
    if (!hasDraft) {
      return null;
    }

    // Format the last modified date
    const formattedDate = draftLastModified
      ? new Intl.DateTimeFormat('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(new Date(draftLastModified))
      : null;

    // Get draft title if available
    const draftTitle = draftRecipe?.title;

    return (
      <div
        ref={ref}
        className={cn('w-full', className)}
        data-testid="draft-banner"
      >
        <Alert
          variant="info"
          size="default"
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <FileEdit
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600"
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <AlertTitle className="text-sm font-medium text-blue-900">
                You have an unsaved draft recipe
              </AlertTitle>
              <AlertDescription className="mt-1 text-sm text-blue-700">
                {draftTitle ? (
                  <>
                    &ldquo;{draftTitle}&rdquo;
                    {formattedDate && (
                      <span className="text-blue-600">
                        {' '}
                        &middot; Last edited {formattedDate}
                      </span>
                    )}
                  </>
                ) : (
                  formattedDate && <>Last edited {formattedDate}</>
                )}
              </AlertDescription>
            </div>
          </div>
          <AlertActions className="flex flex-shrink-0 gap-2 sm:ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDiscard}
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
              data-testid="draft-banner-discard"
            >
              <Trash2 className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Discard
            </Button>
            <Button
              variant="default"
              size="sm"
              asChild
              onClick={onContinue}
              data-testid="draft-banner-continue"
            >
              <Link href="/recipes/create">
                <FileEdit className="mr-1.5 h-4 w-4" aria-hidden="true" />
                Continue Editing
              </Link>
            </Button>
          </AlertActions>
        </Alert>
      </div>
    );
  }
);

DraftBanner.displayName = 'DraftBanner';

export default DraftBanner;
