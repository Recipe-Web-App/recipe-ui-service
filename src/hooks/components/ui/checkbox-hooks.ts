import * as React from 'react';
import type {
  CheckboxContextValue,
  CheckboxGroupContextValue,
} from '@/types/ui/checkbox';

// Checkbox Context definitions
export const CheckboxContext = React.createContext<
  CheckboxContextValue | undefined
>(undefined);

export const CheckboxGroupContext = React.createContext<
  CheckboxGroupContextValue | undefined
>(undefined);

/**
 * Hook to access Checkbox context for compound components
 * Must be used within a CheckboxRoot component
 */
export const useCheckboxContext = (): CheckboxContextValue => {
  const context = React.useContext(CheckboxContext);
  if (!context) {
    throw new Error(
      'Checkbox compound components must be used within a CheckboxRoot'
    );
  }
  return context;
};

/**
 * Hook to access CheckboxGroup context for managing grouped checkboxes
 * Must be used within a FilterCheckboxGroup component
 */
export const useCheckboxGroupContext = (): CheckboxGroupContextValue => {
  const context = React.useContext(CheckboxGroupContext);
  if (!context) {
    throw new Error(
      'CheckboxGroupContext must be used within a FilterCheckboxGroup'
    );
  }
  return context;
};
