import * as React from 'react';
import type { CommandPaletteContextValue } from '@/types/ui/command-palette';

// Create context for command palette state
export const CommandPaletteContext =
  React.createContext<CommandPaletteContextValue | null>(null);

/**
 * Hook to access command palette context
 */
export const useCommandPalette = () => {
  const context = React.useContext(CommandPaletteContext);
  if (!context) {
    throw new Error('useCommandPalette must be used within a CommandPalette');
  }
  return context;
};
