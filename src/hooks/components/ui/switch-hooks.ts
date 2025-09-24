import * as React from 'react';
import type {
  SwitchContextValue,
  SwitchGroupContextValue,
} from '@/types/ui/switch';

// Switch Context definitions
export const SwitchContext = React.createContext<
  SwitchContextValue | undefined
>(undefined);
export const SwitchGroupContext = React.createContext<
  SwitchGroupContextValue | undefined
>(undefined);

/**
 * Hook to access Switch context for compound components
 * Must be used within a SwitchRoot component
 */
export const useSwitchContext = (): SwitchContextValue => {
  const context = React.useContext(SwitchContext);
  if (!context) {
    throw new Error(
      'Switch compound components must be used within a SwitchRoot'
    );
  }
  return context;
};

/**
 * Hook to access SwitchGroup context for managing grouped switches
 * Must be used within a RecipeSwitchGroup component
 */
export const useSwitchGroupContext = (): SwitchGroupContextValue => {
  const context = React.useContext(SwitchGroupContext);
  if (!context) {
    throw new Error(
      'SwitchGroupContext must be used within a RecipeSwitchGroup'
    );
  }
  return context;
};
