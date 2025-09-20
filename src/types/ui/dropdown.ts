import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { type VariantProps } from 'class-variance-authority';
import {
  dropdownTriggerVariants,
  dropdownContentVariants,
  dropdownItemVariants,
} from '@/lib/ui/dropdown-variants';

/**
 * Dropdown Menu trigger component props interface
 */
export interface DropdownMenuTriggerProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger>,
    VariantProps<typeof dropdownTriggerVariants> {
  asChild?: boolean;
}

/**
 * Dropdown Menu content component props interface
 */
export interface DropdownMenuContentProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>,
    VariantProps<typeof dropdownContentVariants> {}

/**
 * Dropdown Menu item component props interface
 */
export interface DropdownMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>,
    VariantProps<typeof dropdownItemVariants> {}
