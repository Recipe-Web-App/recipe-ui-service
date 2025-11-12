'use client';

import * as React from 'react';
import { Heart, Share2, Plus, Eye } from 'lucide-react';
import { QuickActions } from '@/components/ui/quick-actions';
import { getCollectionQuickActionsList } from './collection-card-utils';
import type { CollectionQuickActionHandlers } from '@/types/collection/quick-actions';

export interface CollectionQuickActionsProps {
  /** Collection ID */
  collectionId: number;
  /** Whether the current user owns this collection */
  isOwner?: boolean;
  /** Whether the current user is a collaborator */
  isCollaborator?: boolean;
  /** Action handlers */
  handlers: CollectionQuickActionHandlers;
  /** Custom class name */
  className?: string;
}

// Icon mapping
const iconMap = {
  Heart,
  Share2,
  Plus,
  Eye,
};

/**
 * CollectionQuickActions - Hover overlay with quick action buttons for collections
 */
export const CollectionQuickActions = React.forwardRef<
  HTMLDivElement,
  CollectionQuickActionsProps
>(
  (
    {
      collectionId,
      isOwner = false,
      isCollaborator = false,
      handlers,
      className,
      ...props
    },
    ref
  ) => {
    const quickActions = React.useMemo(
      () =>
        getCollectionQuickActionsList(
          collectionId,
          handlers,
          isOwner,
          isCollaborator
        ),
      [collectionId, handlers, isOwner, isCollaborator]
    );

    const handleActionClick = React.useCallback(
      (actionType: string) => {
        const action = quickActions.find(a => a.type === actionType);
        if (action?.handler) {
          action.handler(collectionId);
        }
      },
      [collectionId, quickActions]
    );

    // Map actions to QuickActions format
    const mappedActions = React.useMemo(
      () =>
        quickActions.map(action => {
          const IconComponent = iconMap[action.icon as keyof typeof iconMap];
          return {
            id: action.type,
            icon: IconComponent,
            label: action.label,
            onClick: () => handleActionClick(action.type),
          };
        }),
      [quickActions, handleActionClick]
    );

    if (mappedActions.length === 0) {
      return null;
    }

    return (
      <QuickActions
        ref={ref}
        actions={mappedActions}
        className={className}
        {...props}
      />
    );
  }
);

CollectionQuickActions.displayName = 'CollectionQuickActions';
