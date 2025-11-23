'use client';

import * as React from 'react';
import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { cn } from '@/lib/utils';
import {
  getCollectionMenuActions,
  collectionActionIcons,
} from './collection-card-utils';
import type { CollectionMenuActionHandlers } from '@/types/collection/menu';

export interface CollectionMenuProps {
  /** Collection ID */
  collectionId: number;
  /** Whether the current user owns this collection */
  isOwner?: boolean;
  /** Whether the current user is a collaborator */
  isCollaborator?: boolean;
  /** Action handlers */
  handlers: CollectionMenuActionHandlers;
  /** Custom class name */
  className?: string;
  /** Button size */
  size?: 'sm' | 'default' | 'lg' | 'icon';
  /** Button variant */
  variant?: 'default' | 'outline' | 'ghost' | 'link';
}

/**
 * CollectionMenu - Three-dot dropdown menu for collection actions
 */
export const CollectionMenu = React.forwardRef<
  HTMLButtonElement,
  CollectionMenuProps
>(
  (
    {
      collectionId,
      isOwner = false,
      isCollaborator = false,
      handlers,
      className,
      size = 'icon',
      variant = 'ghost',
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);

    const menuActions = React.useMemo(
      () =>
        getCollectionMenuActions(
          collectionId,
          handlers,
          isOwner,
          isCollaborator
        ),
      [collectionId, handlers, isOwner, isCollaborator]
    );

    const handleActionClick = React.useCallback(
      (handler: ((id: number) => void) | undefined) => {
        if (handler) {
          handler(collectionId);
          setOpen(false);
        }
      },
      [collectionId]
    );

    if (menuActions.length === 0) {
      return null;
    }

    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            ref={ref}
            variant={variant}
            size={size}
            className={cn('h-8 w-8', className)}
            aria-label="Collection menu"
            onClick={e => {
              e.stopPropagation();
            }}
            {...props}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {menuActions.map((action, index) => {
            const IconComponent =
              collectionActionIcons[
                action.icon as keyof typeof collectionActionIcons
              ];
            const showSeparator =
              action.separator && index < menuActions.length - 1;

            return (
              <React.Fragment key={action.type}>
                <DropdownMenuItem
                  onClick={e => {
                    e.stopPropagation();
                    handleActionClick(action.handler);
                  }}
                  className={cn(
                    'cursor-pointer',
                    action.variant === 'destructive' &&
                      'text-destructive focus:text-destructive'
                  )}
                >
                  {IconComponent && <IconComponent className="mr-2 h-4 w-4" />}
                  <span>{action.label}</span>
                </DropdownMenuItem>
                {showSeparator && <DropdownMenuSeparator />}
              </React.Fragment>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);

CollectionMenu.displayName = 'CollectionMenu';
