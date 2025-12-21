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
import { useCollectionStore } from '@/stores/collection-store';

export interface CollectionDraftBannerProps {
  /** Callback when user clicks "Continue Editing" */
  onContinue?: () => void;
  /** Callback when user clicks "Discard" */
  onDiscard?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * CollectionDraftBanner Component
 *
 * Displays a banner when the user has an unsaved draft collection in the local store.
 * Provides options to continue editing or discard the draft.
 *
 * @example
 * ```tsx
 * <CollectionDraftBanner
 *   onContinue={() => router.push('/collections/create')}
 *   onDiscard={() => clearDraft()}
 * />
 * ```
 */
export const CollectionDraftBanner = React.forwardRef<
  HTMLDivElement,
  CollectionDraftBannerProps
>(({ onContinue, onDiscard, className }, ref) => {
  const {
    hasUnsavedDraft,
    draftCollection,
    draftLastModified,
    clearDraftCollection,
  } = useCollectionStore();

  const hasDraft = hasUnsavedDraft();

  const handleDiscard = React.useCallback(() => {
    clearDraftCollection();
    onDiscard?.();
  }, [clearDraftCollection, onDiscard]);

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

  // Get draft name if available
  const draftName = draftCollection?.name;

  return (
    <div
      ref={ref}
      className={cn('w-full', className)}
      data-testid="collection-draft-banner"
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
              You have an unsaved draft collection
            </AlertTitle>
            <AlertDescription className="mt-1 text-sm text-blue-700">
              {draftName ? (
                <>
                  &ldquo;{draftName}&rdquo;
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
            data-testid="collection-draft-banner-discard"
          >
            <Trash2 className="mr-1.5 h-4 w-4" aria-hidden="true" />
            Discard
          </Button>
          <Button
            variant="default"
            size="sm"
            asChild
            onClick={onContinue}
            data-testid="collection-draft-banner-continue"
          >
            <Link href="/collections/create">
              <FileEdit className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Continue Editing
            </Link>
          </Button>
        </AlertActions>
      </Alert>
    </div>
  );
});

CollectionDraftBanner.displayName = 'CollectionDraftBanner';

export default CollectionDraftBanner;
