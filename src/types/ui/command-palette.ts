import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import {
  commandPaletteVariants,
  commandPaletteContentVariants,
} from '@/lib/ui/command-palette-variants';

/**
 * Individual command definition
 */
export interface Command {
  /** Unique identifier for the command */
  id: string;
  /** Display label for the command */
  label: string;
  /** Optional description for additional context */
  description?: string;
  /** Optional icon to display with the command */
  icon?: React.ReactNode;
  /** Keyboard shortcut display (e.g., ['⌘', 'K']) */
  shortcut?: string[];
  /** Function to execute when command is selected */
  action: () => void;
  /** Keywords for improved search matching */
  keywords?: string[];
  /** Whether the command is disabled */
  disabled?: boolean;
}

/**
 * Command group definition for organizing commands
 */
export interface CommandGroup {
  /** Unique identifier for the group */
  id: string;
  /** Display label for the group */
  label: string;
  /** Commands within this group */
  commands: Command[];
  /** Whether the group should be hidden */
  hidden?: boolean;
}

/**
 * Main CommandPalette component props
 */
export interface CommandPaletteProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof commandPaletteVariants>,
    VariantProps<typeof commandPaletteContentVariants> {
  /** Whether the command palette is open */
  open: boolean;
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void;

  /** Array of command groups to display */
  commands: CommandGroup[];
  /** Callback when a command is selected */
  onCommandSelect: (command: Command) => void;

  /** Placeholder text for search input */
  placeholder?: string;
  /** Controlled search value */
  searchValue?: string;
  /** Callback when search value changes */
  onSearchChange?: (value: string) => void;

  /** Whether to show recent commands section */
  showRecentCommands?: boolean;
  /** Array of recent commands to display */
  recentCommands?: Command[];
  /** Whether to show keyboard shortcuts */
  showShortcuts?: boolean;
  /** Whether to enable fuzzy search matching */
  enableFuzzySearch?: boolean;

  /** Custom className for the modal overlay */
  overlayClassName?: string;
  /** Custom className for the content container */
  contentClassName?: string;
  /** Custom className for the search input */
  searchClassName?: string;
  /** Custom className for command groups */
  groupClassName?: string;

  /** ARIA label for accessibility */
  'aria-label'?: string;
  /** ARIA labelledby for accessibility */
  'aria-labelledby'?: string;
}

/**
 * CommandGroup component props
 */
export interface CommandGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Group data */
  group: CommandGroup;
  /** Whether to show the group label */
  showLabel?: boolean;
  /** Custom className for the group container */
  className?: string;
  /** Custom className for the group label */
  labelClassName?: string;
  /** Callback when a command in this group is selected */
  onCommandSelect: (command: Command) => void;
  /** Currently highlighted command index */
  highlightedIndex?: number;
  /** Starting index for this group's commands */
  startIndex: number;
  /** Whether to show keyboard shortcuts */
  showShortcuts?: boolean;
}

/**
 * CommandItem component props
 */
export interface CommandItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Command data */
  command: Command;
  /** Whether this item is highlighted/focused */
  highlighted?: boolean;
  /** Callback when command is selected */
  onSelect: (command: Command) => void;
  /** Whether to show keyboard shortcuts */
  showShortcuts?: boolean;
  /** Custom className for the item */
  className?: string;
  /** Custom className for the icon */
  iconClassName?: string;
  /** Custom className for the label */
  labelClassName?: string;
  /** Custom className for the description */
  descriptionClassName?: string;
  /** Custom className for the shortcut */
  shortcutClassName?: string;
}

/**
 * CommandEmpty component props
 */
export interface CommandEmptyProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Custom empty state message */
  message?: string;
  /** Custom icon for empty state */
  icon?: React.ReactNode;
  /** Custom className */
  className?: string;
}

/**
 * CommandSeparator component props
 */
export interface CommandSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Custom className */
  className?: string;
}

/**
 * Search result type for filtering
 */
export interface SearchResult {
  /** The command that matched */
  command: Command;
  /** The group containing the command */
  group: CommandGroup;
  /** Match score for fuzzy search (0-1, higher is better) */
  score: number;
  /** Highlighted text ranges for displaying matches */
  highlights?: Array<{ start: number; end: number }>;
}

/**
 * Keyboard navigation directions
 */
export type NavigationDirection = 'up' | 'down' | 'first' | 'last';

/**
 * Command palette context value
 */
export interface CommandPaletteContextValue {
  /** Whether the palette is open */
  open: boolean;
  /** Current search value */
  searchValue: string;
  /** Set search value */
  setSearchValue: (value: string) => void;
  /** Currently highlighted command index */
  highlightedIndex: number;
  /** Set highlighted index */
  setHighlightedIndex: (index: number) => void;
  /** Navigate through commands */
  navigate: (direction: NavigationDirection) => void;
  /** Select the currently highlighted command */
  selectHighlighted: () => void;
  /** Close the palette */
  close: () => void;
  /** All filtered commands in flat array */
  filteredCommands: SearchResult[];
  /** Whether to show shortcuts */
  showShortcuts?: boolean;
  /** Whether to enable fuzzy search */
  enableFuzzySearch?: boolean;
}
