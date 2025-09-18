'use client';

import * as React from 'react';
import { createContext, useContext } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X, User, Search, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  drawerOverlayVariants,
  drawerContentVariants,
  drawerHeaderVariants,
  drawerBodyVariants,
  drawerFooterVariants,
  drawerCloseVariants,
  navigationDrawerVariants,
  navigationItemVariants,
  recipeDrawerVariants,
} from '@/lib/ui/drawer-variants';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import type {
  DrawerProps,
  DrawerOverlayProps,
  DrawerContentProps,
  DrawerHeaderProps,
  DrawerBodyProps,
  DrawerFooterProps,
  DrawerCloseProps,
  DrawerTitleProps,
  DrawerDescriptionProps,
  NavigationDrawerProps,
  NavigationItemComponentProps,
  RecipeDrawerProps,
  MobileMenuDrawerProps,
} from '@/types/ui/drawer';
import type { IconName } from '@/types/ui/icon';

/**
 * Context to track if close button is present in drawer
 */
const DrawerCloseContext = createContext<boolean>(false);
const useDrawerClose = () => useContext(DrawerCloseContext);

/**
 * Drawer Root Component
 *
 * Container component that manages the drawer state and provides context.
 */
const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      open,
      onOpenChange,
      defaultOpen,
      showOverlay: _showOverlay = true,
      closeOnOverlayClick: _closeOnOverlayClick = true,
      closeOnEscape: _closeOnEscape = true,
      preventScroll: _preventScroll = true,
      children,
      ...props
    },
    _ref
  ) => {
    return (
      <DialogPrimitive.Root
        open={open}
        onOpenChange={onOpenChange}
        defaultOpen={defaultOpen}
        {...props}
      >
        {children}
      </DialogPrimitive.Root>
    );
  }
);

Drawer.displayName = 'Drawer';

/**
 * Drawer Trigger Component
 *
 * Button or element that opens the drawer when clicked.
 */
const DrawerTrigger = DialogPrimitive.Trigger;

/**
 * Drawer Overlay Component
 *
 * Background overlay that appears behind the drawer.
 */
const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  DrawerOverlayProps
>(({ className, variant = 'default', ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(drawerOverlayVariants({ variant }), className)}
    {...props}
  />
));

DrawerOverlay.displayName = 'DrawerOverlay';

/**
 * Drawer Content Component
 *
 * Main container for the drawer content with positioning and animations.
 */
const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DrawerContentProps
>(
  (
    {
      className,
      position = 'left',
      size = 'md',
      variant = 'default',
      showClose = true,
      children,
      ...props
    },
    ref
  ) => (
    <DialogPrimitive.Portal>
      <DrawerOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          drawerContentVariants({ position, size, variant }),
          className
        )}
        {...props}
      >
        <DrawerCloseContext.Provider value={showClose ?? false}>
          {children}
          {showClose && <DrawerClose className="absolute top-3 right-4" />}
        </DrawerCloseContext.Provider>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
);

DrawerContent.displayName = 'DrawerContent';

/**
 * Drawer Header Component
 *
 * Header section with title and optional close button.
 */
const DrawerHeader = React.forwardRef<HTMLDivElement, DrawerHeaderProps>(
  ({ className, variant = 'default', layout, children, ...props }, ref) => {
    const hasCloseButton = useDrawerClose();
    const finalLayout = layout ?? (hasCloseButton ? 'withClose' : 'default');

    return (
      <div
        ref={ref}
        className={cn(
          drawerHeaderVariants({ variant, layout: finalLayout }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DrawerHeader.displayName = 'DrawerHeader';

/**
 * Drawer Body Component
 *
 * Scrollable content area of the drawer.
 */
const DrawerBody = React.forwardRef<HTMLDivElement, DrawerBodyProps>(
  (
    { className, variant = 'default', scrollable = true, children, ...props },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(drawerBodyVariants({ variant, scrollable }), className)}
      {...props}
    >
      {children}
    </div>
  )
);

DrawerBody.displayName = 'DrawerBody';

/**
 * Drawer Footer Component
 *
 * Footer section for action buttons and controls.
 */
const DrawerFooter = React.forwardRef<HTMLDivElement, DrawerFooterProps>(
  (
    { className, variant = 'default', size = 'default', children, ...props },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(drawerFooterVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </div>
  )
);

DrawerFooter.displayName = 'DrawerFooter';

/**
 * Drawer Close Component
 *
 * Close button that closes the drawer when clicked.
 */
const DrawerClose = React.forwardRef<HTMLButtonElement, DrawerCloseProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      icon,
      children,
      ...props
    },
    ref
  ) => (
    <DialogPrimitive.Close asChild>
      <button
        ref={ref}
        className={cn(drawerCloseVariants({ variant, size }), className)}
        {...props}
      >
        {icon ?? <X className="h-4 w-4" />}
        {children}
      </button>
    </DialogPrimitive.Close>
  )
);

DrawerClose.displayName = 'DrawerClose';

/**
 * Drawer Title Component
 *
 * Title heading for the drawer.
 */
const DrawerTitle = React.forwardRef<HTMLHeadingElement, DrawerTitleProps>(
  ({ className, as: Component = 'h2', children, ...props }, ref) => (
    <DialogPrimitive.Title asChild>
      <Component
        ref={ref}
        className={cn(
          'text-lg leading-none font-semibold tracking-tight',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    </DialogPrimitive.Title>
  )
);

DrawerTitle.displayName = 'DrawerTitle';

/**
 * Drawer Description Component
 *
 * Description text for the drawer.
 */
const DrawerDescription = React.forwardRef<
  HTMLParagraphElement,
  DrawerDescriptionProps
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-muted-foreground text-sm', className)}
    {...props}
  >
    {children}
  </DialogPrimitive.Description>
));

DrawerDescription.displayName = 'DrawerDescription';

/**
 * Navigation Item Component
 *
 * Individual navigation item for drawer menus.
 */
const NavigationItemComponent = React.forwardRef<
  HTMLDivElement,
  NavigationItemComponentProps
>(
  (
    {
      className,
      item,
      isActive = false,
      state: _state,
      variant = 'default',
      onClick,
      ...props
    },
    ref
  ) => {
    const handleClick = () => {
      if (item.isDisabled) return;
      if (item.onClick) {
        item.onClick();
      }
      if (onClick) {
        onClick(item);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          navigationItemVariants({
            state: item.isDisabled
              ? 'disabled'
              : isActive
                ? 'active'
                : 'default',
            variant,
          }),
          className
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={item.isDisabled ? -1 : 0}
        role="menuitem"
        aria-disabled={item.isDisabled}
        {...props}
      >
        {item.icon && typeof item.icon === 'string' && (
          <Icon
            name={item.icon as IconName}
            className="h-4 w-4 flex-shrink-0"
          />
        )}
        <span className="flex-1 truncate">{item.label}</span>
        {item.badge && (
          <span className="bg-primary/10 ml-auto rounded-full px-2 py-0.5 text-xs font-medium">
            {item.badge}
          </span>
        )}
      </div>
    );
  }
);

NavigationItemComponent.displayName = 'NavigationItem';

/**
 * Navigation Drawer Component
 *
 * Specialized drawer for app navigation with menu items.
 */
interface NavigationDrawerComponentProps extends NavigationDrawerProps {
  showClose?: boolean;
}

const NavigationDrawer = React.forwardRef<
  HTMLDivElement,
  NavigationDrawerComponentProps
>(
  (
    {
      className,
      theme = 'default',
      items,
      activeItemId,
      showProfile = false,
      userProfile,
      header,
      footer,
      onItemClick,
      position = 'left',
      size = 'md',
      showClose = false,
      ...drawerProps
    },
    ref
  ) => {
    return (
      <Drawer {...drawerProps}>
        <DrawerContent
          position={position}
          size={size}
          showClose={showClose}
          ref={ref}
        >
          <div className={cn(navigationDrawerVariants({ theme }), className)}>
            {/* Header */}
            <DrawerHeader>
              {header ?? <DrawerTitle>Navigation</DrawerTitle>}
            </DrawerHeader>

            {/* Navigation Items */}
            <DrawerBody>
              <nav role="menu" className="space-y-1">
                {items.map(item => (
                  <NavigationItemComponent
                    key={item.id}
                    item={item}
                    isActive={item.id === activeItemId}
                    onClick={onItemClick}
                  />
                ))}
              </nav>

              {/* User Profile Section */}
              {showProfile && userProfile && (
                <div className="border-border mt-auto border-t pt-4">
                  <div className="flex items-center gap-3 p-3">
                    <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {userProfile.name}
                      </p>
                      <p className="text-muted-foreground truncate text-xs">
                        {userProfile.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </DrawerBody>

            {/* Footer */}
            {footer && <DrawerFooter>{footer}</DrawerFooter>}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }
);

NavigationDrawer.displayName = 'NavigationDrawer';

/**
 * Recipe Drawer Component
 *
 * Specialized drawer for recipe-related content.
 */
interface RecipeDrawerComponentProps extends RecipeDrawerProps {
  showClose?: boolean;
}

const RecipeDrawer = React.forwardRef<
  HTMLDivElement,
  RecipeDrawerComponentProps
>(
  (
    {
      className,
      type = 'ingredients',
      recipeId: _recipeId,
      recipeTitle,
      ingredients = [],
      instructions = [],
      shoppingList = [],
      showIngredientChecklist = true,
      showInstructionProgress = true,
      onIngredientCheck,
      onInstructionComplete,
      onShoppingItemCheck,
      position = 'right',
      size = 'md',
      showClose = false,
      ...drawerProps
    },
    ref
  ) => {
    const renderIngredients = () => (
      <div className="space-y-3">
        <h3 className="font-medium">Ingredients</h3>
        <div className="space-y-2">
          {ingredients.map(ingredient => (
            <label
              key={ingredient.id}
              className="flex items-center gap-3 text-sm"
            >
              {showIngredientChecklist && (
                <input
                  type="checkbox"
                  checked={ingredient.isChecked}
                  onChange={e =>
                    onIngredientCheck?.(ingredient.id, e.target.checked)
                  }
                  className="border-border rounded"
                />
              )}
              <span className="flex-1">
                {ingredient.amount && ingredient.unit && (
                  <span className="text-muted-foreground mr-2">
                    {ingredient.amount} {ingredient.unit}
                  </span>
                )}
                {ingredient.name}
                {ingredient.notes && (
                  <span className="text-muted-foreground ml-1">
                    ({ingredient.notes})
                  </span>
                )}
              </span>
            </label>
          ))}
        </div>
      </div>
    );

    const renderInstructions = () => (
      <div className="space-y-4">
        <h3 className="font-medium">Instructions</h3>
        <div className="space-y-3">
          {instructions.map(instruction => (
            <div key={instruction.id} className="space-y-2">
              <div className="flex items-start gap-3">
                {showInstructionProgress && (
                  <input
                    type="checkbox"
                    checked={instruction.isCompleted}
                    onChange={e =>
                      onInstructionComplete?.(instruction.id, e.target.checked)
                    }
                    className="border-border mt-1 rounded"
                  />
                )}
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-sm font-medium">
                      Step {instruction.stepNumber}
                    </span>
                    {instruction.duration && (
                      <span className="text-muted-foreground text-xs">
                        {instruction.duration} min
                      </span>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed">
                    {instruction.instruction}
                  </p>
                  {instruction.notes && (
                    <p className="text-muted-foreground mt-1 text-xs">
                      {instruction.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    const renderShoppingList = () => (
      <div className="space-y-3">
        <h3 className="font-medium">Shopping List</h3>
        <div className="space-y-2">
          {shoppingList.map(item => (
            <label key={item.id} className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={item.isChecked}
                onChange={e => onShoppingItemCheck?.(item.id, e.target.checked)}
                className="border-border rounded"
              />
              <span className="flex-1">
                {item.quantity && item.unit && (
                  <span className="text-muted-foreground mr-2">
                    {item.quantity} {item.unit}
                  </span>
                )}
                {item.name}
                {item.recipeName && (
                  <span className="text-muted-foreground ml-1">
                    ({item.recipeName})
                  </span>
                )}
              </span>
            </label>
          ))}
        </div>
      </div>
    );

    return (
      <Drawer {...drawerProps}>
        <DrawerContent
          position={position}
          size={size}
          showClose={showClose}
          ref={ref}
        >
          <div className={cn(recipeDrawerVariants({ type }), className)}>
            {/* Header */}
            <DrawerHeader>
              <DrawerTitle>{recipeTitle ?? 'Recipe Details'}</DrawerTitle>
            </DrawerHeader>

            {/* Content */}
            <DrawerBody>
              {type === 'ingredients' && renderIngredients()}
              {type === 'instructions' && renderInstructions()}
              {type === 'shopping' && renderShoppingList()}
            </DrawerBody>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }
);

RecipeDrawer.displayName = 'RecipeDrawer';

/**
 * Mobile Menu Drawer Component
 *
 * Specialized drawer for mobile navigation menus.
 */
interface MobileMenuDrawerComponentProps extends MobileMenuDrawerProps {
  showClose?: boolean;
}

const MobileMenuDrawer = React.forwardRef<
  HTMLDivElement,
  MobileMenuDrawerComponentProps
>(
  (
    {
      className,
      showSearch = true,
      searchPlaceholder = 'Search...',
      searchValue,
      onSearchChange,
      showNotifications = false,
      notificationCount,
      showClose = false,
      ...navigationProps
    },
    ref
  ) => {
    return (
      <NavigationDrawer
        {...navigationProps}
        position="left"
        size="sm"
        showClose={showClose}
        ref={ref}
        className={className}
        header={
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <DrawerTitle>Menu</DrawerTitle>
              {showNotifications && (
                <button className="relative p-2">
                  <Bell className="h-4 w-4" />
                  {notificationCount && notificationCount > 0 && (
                    <span className="bg-destructive text-destructive-foreground absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-xs">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  )}
                </button>
              )}
            </div>
            {showSearch && (
              <div className="relative">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={e => onSearchChange?.(e.target.value)}
                  className="pl-9"
                />
              </div>
            )}
          </div>
        }
      />
    );
  }
);

MobileMenuDrawer.displayName = 'MobileMenuDrawer';

export {
  Drawer,
  DrawerTrigger,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerClose,
  DrawerTitle,
  DrawerDescription,
  NavigationDrawer,
  RecipeDrawer,
  MobileMenuDrawer,
  NavigationItemComponent,
};

export type {
  DrawerProps,
  DrawerOverlayProps,
  DrawerContentProps,
  DrawerHeaderProps,
  DrawerBodyProps,
  DrawerFooterProps,
  DrawerCloseProps,
  DrawerTitleProps,
  DrawerDescriptionProps,
  NavigationDrawerProps,
  RecipeDrawerProps,
  MobileMenuDrawerProps,
  NavigationItemComponentProps,
};
