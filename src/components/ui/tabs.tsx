'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  tabsListVariants,
  tabsTriggerVariants,
  tabsContentVariants,
} from '@/lib/ui/tabs-variants';

// ============================================================================
// Tabs Root Component
// ============================================================================

/**
 * Props for the Tabs root component
 */
export interface TabsProps extends React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.Root
> {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Tabs root component - wrapper for the entire tabs widget
 */
const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  TabsProps
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Root
    ref={ref}
    className={cn('w-full', className)}
    {...props}
  />
));
Tabs.displayName = TabsPrimitive.Root.displayName;

// ============================================================================
// Tabs List Component
// ============================================================================

/**
 * Props for the TabsList component
 */
export interface TabsListProps
  extends
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {
  /** Additional CSS classes */
  className?: string;
}

/**
 * TabsList component - container for tab triggers
 */
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant, size, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(tabsListVariants({ variant, size }), className)}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

// ============================================================================
// Tabs Trigger Component
// ============================================================================

/**
 * Props for the TabsTrigger component
 */
export interface TabsTriggerProps
  extends
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {
  /** Additional CSS classes */
  className?: string;
}

/**
 * TabsTrigger component - individual tab button
 */
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant, size, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ variant, size }), className)}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

// ============================================================================
// Tabs Content Component
// ============================================================================

/**
 * Props for the TabsContent component
 */
export interface TabsContentProps
  extends
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>,
    VariantProps<typeof tabsContentVariants> {
  /** Additional CSS classes */
  className?: string;
}

/**
 * TabsContent component - content panel for each tab
 */
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>(({ className, variant, size, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(tabsContentVariants({ variant, size }), className)}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

// ============================================================================
// Exports
// ============================================================================

export { Tabs, TabsList, TabsTrigger, TabsContent };

// Export types for external use
export type {
  TabsProps as TabsComponentProps,
  TabsListProps as TabsListComponentProps,
  TabsTriggerProps as TabsTriggerComponentProps,
  TabsContentProps as TabsContentComponentProps,
};
