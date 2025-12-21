'use client';

import * as React from 'react';
import Image from 'next/image';
import { Eye, Lock, Globe, Users, UtensilsCrossed } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CollectionVisibility,
  CollaborationMode,
} from '@/types/recipe-management/common';
import type { CollectionRecipeFormData } from '@/types/collection/create-collection-form';
import { cn } from '@/lib/utils';

/**
 * Props for the CollectionPreview component.
 */
export interface CollectionPreviewProps {
  /** Collection name */
  name: string;
  /** Collection description */
  description?: string;
  /** Visibility setting */
  visibility: CollectionVisibility;
  /** Collaboration mode */
  collaborationMode: CollaborationMode;
  /** Selected recipes */
  recipes: CollectionRecipeFormData[];
  /** Number of collaborators */
  collaboratorCount?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Get visibility badge variant and label
 */
function getVisibilityInfo(visibility: CollectionVisibility) {
  switch (visibility) {
    case CollectionVisibility.PUBLIC:
      return { icon: Globe, label: 'Public', variant: 'default' as const };
    case CollectionVisibility.PRIVATE:
      return { icon: Lock, label: 'Private', variant: 'secondary' as const };
    case CollectionVisibility.FRIENDS_ONLY:
      return {
        icon: Users,
        label: 'Friends Only',
        variant: 'outline' as const,
      };
    default:
      return { icon: Lock, label: 'Private', variant: 'secondary' as const };
  }
}

/**
 * Get collaboration mode label
 */
function getCollaborationLabel(mode: CollaborationMode) {
  switch (mode) {
    case CollaborationMode.OWNER_ONLY:
      return 'Owner only';
    case CollaborationMode.SPECIFIC_USERS:
      return 'Specific users';
    case CollaborationMode.ALL_USERS:
      return 'All users can edit';
    default:
      return 'Owner only';
  }
}

/**
 * CollectionPreview Component
 *
 * Shows a preview of how the collection will look once created.
 * Used in the create collection form to give users a visual preview.
 */
export function CollectionPreview({
  name,
  description,
  visibility,
  collaborationMode,
  recipes,
  collaboratorCount = 0,
  className,
}: CollectionPreviewProps) {
  const visibilityInfo = getVisibilityInfo(visibility);
  const VisibilityIcon = visibilityInfo.icon;

  // Get up to 4 recipe images for the mosaic
  const displayImages = React.useMemo(() => {
    const images = recipes
      .slice(0, 4)
      .map(r => r.recipeImageUrl)
      .filter((url): url is string => !!url);
    return images;
  }, [recipes]);

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Eye className="text-muted-foreground h-4 w-4" />
          <CardTitle className="text-sm font-medium">Preview</CardTitle>
        </div>
        <CardDescription className="text-xs">
          This is how your collection will appear
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Mosaic Image Grid */}
        <div className="bg-muted relative aspect-[4/3] w-full overflow-hidden rounded-lg">
          {displayImages.length > 0 ? (
            <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-0.5">
              {Array.from({ length: 4 }).map((_, index) => {
                const imageUrl = displayImages.at(index);
                return (
                  <div
                    key={index}
                    className="bg-muted relative h-full w-full overflow-hidden"
                  >
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={`Recipe ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="100px"
                      />
                    ) : (
                      <div className="bg-muted-foreground/10 flex h-full w-full items-center justify-center">
                        <UtensilsCrossed
                          className="text-muted-foreground/40 h-6 w-6"
                          aria-hidden="true"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2">
              <UtensilsCrossed
                className="text-muted-foreground/40 h-12 w-12"
                aria-hidden="true"
              />
              <span className="text-muted-foreground text-xs">
                No recipes added yet
              </span>
            </div>
          )}
        </div>

        {/* Collection Info */}
        <div className="space-y-2">
          {/* Name */}
          <h3
            className={cn(
              'truncate font-semibold',
              name ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            {name || 'Untitled Collection'}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-muted-foreground line-clamp-2 text-sm">
              {description}
            </p>
          )}

          {/* Stats */}
          <div className="text-muted-foreground flex items-center gap-3 text-xs">
            <span>{recipes.length} recipes</span>
            {collaboratorCount > 0 && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" aria-hidden="true" />
                  {collaboratorCount} collaborators
                </span>
              </>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={visibilityInfo.variant} className="gap-1 text-xs">
              <VisibilityIcon className="h-3 w-3" aria-hidden="true" />
              {visibilityInfo.label}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {getCollaborationLabel(collaborationMode)}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

CollectionPreview.displayName = 'CollectionPreview';
