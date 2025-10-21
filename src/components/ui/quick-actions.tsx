import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  quickActionsVariants,
  quickActionsOverlayVariants,
  quickActionsGridVariants,
  quickActionButtonVariants,
  overflowMenuTriggerVariants,
  overflowMenuContentVariants,
  overflowMenuItemVariants,
  actionTooltipVariants,
} from '@/lib/ui/quick-actions-variants';
import {
  type QuickActionsProps,
  type QuickActionButtonProps,
  type OverflowMenuProps,
  splitActions,
  getGridLayout,
} from '@/types/ui/quick-actions';

/**
 * QuickActionButton - Individual action button with tooltip
 */
const QuickActionButton = React.forwardRef<
  HTMLButtonElement,
  QuickActionButtonProps
>(({ action, size = 'md', className, onClick }, ref) => {
  const IconComponent = action.icon;

  return (
    <TooltipPrimitive.Provider delayDuration={200}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          <button
            ref={ref}
            type="button"
            disabled={action.disabled}
            onClick={() => onClick(action)}
            className={cn(
              quickActionButtonVariants({
                variant: action.variant ?? 'default',
                size,
              }),
              className
            )}
            aria-label={action.label}
            aria-describedby={action['aria-describedby']}
          >
            <IconComponent aria-hidden="true" />
          </button>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side="bottom"
            align="center"
            sideOffset={4}
            className={cn(actionTooltipVariants({ size }))}
          >
            {action.label}
            <TooltipPrimitive.Arrow className="fill-gray-900 dark:fill-gray-700" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
});
QuickActionButton.displayName = 'QuickActionButton';

/**
 * OverflowMenu - Dropdown menu for additional actions
 */
const OverflowMenu = React.forwardRef<HTMLButtonElement, OverflowMenuProps>(
  ({ actions, size = 'md', className, onActionClick, onOpenChange }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleOpenChange = (open: boolean) => {
      setIsOpen(open);
      onOpenChange?.(open);
    };

    const handleActionClick = (
      action: QuickActionsProps['actions'][number]
    ) => {
      if (action.disabled) return;
      onActionClick(action);
      setIsOpen(false);
    };

    return (
      <TooltipPrimitive.Provider delayDuration={200}>
        <TooltipPrimitive.Root open={isOpen ? false : undefined}>
          <DropdownMenuPrimitive.Root
            open={isOpen}
            onOpenChange={handleOpenChange}
          >
            <TooltipPrimitive.Trigger asChild>
              <DropdownMenuPrimitive.Trigger asChild>
                <button
                  ref={ref}
                  type="button"
                  className={cn(
                    overflowMenuTriggerVariants({
                      size,
                      state: isOpen ? 'open' : 'default',
                    }),
                    className
                  )}
                  aria-label="More actions"
                  aria-expanded={isOpen}
                >
                  <MoreVertical aria-hidden="true" />
                </button>
              </DropdownMenuPrimitive.Trigger>
            </TooltipPrimitive.Trigger>

            <DropdownMenuPrimitive.Portal>
              <DropdownMenuPrimitive.Content
                align="end"
                sideOffset={4}
                className={cn(overflowMenuContentVariants({ size }))}
              >
                {actions.map(action => {
                  const IconComponent = action.icon;
                  return (
                    <DropdownMenuPrimitive.Item
                      key={action.id}
                      disabled={action.disabled}
                      onSelect={() => handleActionClick(action)}
                      className={cn(
                        overflowMenuItemVariants({
                          variant: action.variant ?? 'default',
                          size,
                        })
                      )}
                    >
                      <IconComponent aria-hidden="true" />
                      <span>{action.label}</span>
                    </DropdownMenuPrimitive.Item>
                  );
                })}
              </DropdownMenuPrimitive.Content>
            </DropdownMenuPrimitive.Portal>
          </DropdownMenuPrimitive.Root>

          <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
              side="bottom"
              align="center"
              sideOffset={4}
              className={cn(actionTooltipVariants({ size }))}
            >
              More actions
              <TooltipPrimitive.Arrow className="fill-gray-900 dark:fill-gray-700" />
            </TooltipPrimitive.Content>
          </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
      </TooltipPrimitive.Provider>
    );
  }
);
OverflowMenu.displayName = 'OverflowMenu';

/**
 * QuickActions - Main component
 *
 * Displays a set of quick action buttons positioned in a corner of the parent card.
 * Shows up to `maxVisible` actions (default: 3) with additional actions in an overflow menu.
 * Appears on hover/focus by default.
 *
 * @example
 * ```tsx
 * import { Heart, Share2, Plus, Eye } from 'lucide-react';
 *
 * const actions = [
 *   { id: '1', icon: Heart, label: 'Favorite', onClick: () => {} },
 *   { id: '2', icon: Share2, label: 'Share', onClick: () => {} },
 *   { id: '3', icon: Plus, label: 'Add to collection', onClick: () => {} },
 *   { id: '4', icon: Eye, label: 'Quick view', onClick: () => {} },
 * ];
 *
 * <div className="group relative">
 *   <YourCardContent />
 *   <QuickActions actions={actions} />
 * </div>
 * ```
 */
export const QuickActions = React.forwardRef<HTMLDivElement, QuickActionsProps>(
  (
    {
      actions,
      maxVisible = 3,
      position = 'top-right',
      size = 'md',
      showOnHover: _showOnHover = true,
      showOnFocus: _showOnFocus = true,
      animationDuration = 150,
      className,
      overlayClassName,
      actionClassName,
      onOverflowOpen,
      onOverflowClose,
      onActionClick,
      'aria-label': ariaLabel = 'Quick actions',
      'aria-describedby': ariaDescribedby,
      style,
      ...props
    },
    ref
  ) => {
    // Split actions into visible and overflow
    const { visible, overflow } = React.useMemo(
      () => splitActions(actions, maxVisible),
      [actions, maxVisible]
    );

    // Calculate grid layout based on visible action count + overflow
    const totalDisplayed = visible.length + (overflow.length > 0 ? 1 : 0);
    const gridLayout = getGridLayout(totalDisplayed);

    // Handle action click
    const handleActionClick = (
      action: QuickActionsProps['actions'][number]
    ) => {
      if (action.disabled) return;
      onActionClick?.(action);
      action.onClick();
    };

    // Handle overflow menu state
    const handleOverflowOpenChange = (open: boolean) => {
      if (open) {
        onOverflowOpen?.();
      } else {
        onOverflowClose?.();
      }
    };

    // If no actions, don't render
    if (actions.length === 0) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(quickActionsVariants({ position, size }), className)}
        style={{
          ...style,
          transitionDuration: `${animationDuration}ms`,
        }}
        role="toolbar"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedby}
        {...props}
      >
        <div
          className={cn(
            quickActionsOverlayVariants({ size }),
            overlayClassName
          )}
        >
          <div
            className={cn(
              quickActionsGridVariants({ layout: gridLayout, size })
            )}
          >
            {/* Render visible actions */}
            {visible.map(action => (
              <QuickActionButton
                key={action.id}
                action={action}
                size={size}
                className={actionClassName}
                onClick={handleActionClick}
              />
            ))}

            {/* Render overflow menu if needed */}
            {overflow.length > 0 && (
              <OverflowMenu
                actions={overflow}
                size={size}
                className={actionClassName}
                onActionClick={handleActionClick}
                onOpenChange={handleOverflowOpenChange}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
);
QuickActions.displayName = 'QuickActions';

export { QuickActionButton, OverflowMenu };
