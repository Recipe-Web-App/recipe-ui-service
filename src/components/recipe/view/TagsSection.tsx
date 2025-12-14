'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * Tag data structure
 */
export interface TagData {
  tagId: number;
  name: string;
}

/**
 * TagsSection Props
 */
export interface TagsSectionProps {
  /** Array of tags to display */
  tags: TagData[];
  /** Additional CSS classes */
  className?: string;
}

/**
 * TagsSection Component
 *
 * Displays a list of recipe tags as clickable chips
 * that link to filtered recipe search.
 */
export const TagsSection = React.forwardRef<HTMLDivElement, TagsSectionProps>(
  function TagsSection({ tags, className }, ref) {
    if (tags.length === 0) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn('space-y-3', className)}
        data-testid="tags-section"
      >
        <h2 className="text-lg font-semibold">Tags</h2>
        <div className="flex flex-wrap gap-2" data-testid="tags-container">
          {tags.map(tag => (
            <Link
              key={tag.tagId}
              href={`/recipes?tag=${encodeURIComponent(tag.name)}`}
              className="bg-muted hover:bg-muted/80 rounded-full px-3 py-1 text-sm transition-colors"
              data-testid={`tag-${tag.tagId}`}
            >
              {tag.name}
            </Link>
          ))}
        </div>
      </div>
    );
  }
);

TagsSection.displayName = 'TagsSection';
