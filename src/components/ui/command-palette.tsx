import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { filterCommands } from '@/lib/utils/command-palette-utils';
import {
  CommandPaletteContext,
  useCommandPalette,
} from '@/hooks/use-command-palette';
import {
  commandPaletteVariants,
  commandPaletteContentVariants,
  commandPaletteSearchVariants,
  commandPaletteGroupVariants,
  commandPaletteGroupLabelVariants,
  commandPaletteItemVariants,
  commandPaletteItemIconVariants,
  commandPaletteItemContentVariants,
  commandPaletteItemLabelVariants,
  commandPaletteItemDescriptionVariants,
  commandPaletteItemShortcutVariants,
  commandPaletteShortcutKeyVariants,
  commandPaletteEmptyVariants,
  commandPaletteEmptyIconVariants,
  commandPaletteEmptyTextVariants,
  commandPaletteSeparatorVariants,
  commandPaletteContentAreaVariants,
} from '@/lib/ui/command-palette-variants';
import {
  type CommandPaletteProps,
  type CommandGroupProps,
  type CommandItemProps,
  type CommandEmptyProps,
  type CommandSeparatorProps,
  type Command,
  type CommandGroup,
  type SearchResult,
  type NavigationDirection,
  type CommandPaletteContextValue,
} from '@/types/ui/command-palette';

/**
 * CommandSeparator component for visual separation
 */
const CommandSeparator = React.forwardRef<
  HTMLDivElement,
  CommandSeparatorProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(commandPaletteSeparatorVariants(), className)}
      {...props}
    />
  );
});
CommandSeparator.displayName = 'CommandSeparator';

/**
 * CommandEmpty component for empty states
 */
const CommandEmpty = React.forwardRef<HTMLDivElement, CommandEmptyProps>(
  ({ className, message = 'No results found.', icon, ...props }, ref) => {
    const context = useCommandPalette();

    return (
      <div
        ref={ref}
        className={cn(
          commandPaletteEmptyVariants({
            variant: context?.enableFuzzySearch ? 'default' : 'default',
          }),
          className
        )}
        {...props}
      >
        <div className={cn(commandPaletteEmptyIconVariants())}>
          {icon ?? (
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              className="h-full w-full"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
        </div>
        <p className={cn(commandPaletteEmptyTextVariants())}>{message}</p>
      </div>
    );
  }
);
CommandEmpty.displayName = 'CommandEmpty';

/**
 * CommandItem component for individual commands
 */
const CommandItem = React.forwardRef<HTMLDivElement, CommandItemProps>(
  (
    {
      command,
      highlighted = false,
      onSelect,
      showShortcuts = true,
      className,
      iconClassName,
      labelClassName,
      descriptionClassName,
      shortcutClassName,
      ...props
    },
    ref
  ) => {
    const handleClick = React.useCallback(() => {
      if (!command.disabled) {
        onSelect(command);
      }
    }, [command, onSelect]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && !command.disabled) {
          event.preventDefault();
          onSelect(command);
        }
      },
      [command, onSelect]
    );

    return (
      <div
        ref={ref}
        role="option"
        tabIndex={-1}
        data-highlighted={highlighted}
        data-disabled={command.disabled}
        aria-selected={highlighted}
        aria-disabled={command.disabled}
        className={cn(commandPaletteItemVariants(), className)}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {command.icon && (
          <div className={cn(commandPaletteItemIconVariants(), iconClassName)}>
            {command.icon}
          </div>
        )}

        <div className={cn(commandPaletteItemContentVariants())}>
          <div
            className={cn(commandPaletteItemLabelVariants(), labelClassName)}
          >
            {command.label}
          </div>
          {command.description && (
            <div
              className={cn(
                commandPaletteItemDescriptionVariants(),
                descriptionClassName
              )}
            >
              {command.description}
            </div>
          )}
        </div>

        {showShortcuts && command.shortcut && command.shortcut.length > 0 && (
          <div
            className={cn(
              commandPaletteItemShortcutVariants(),
              shortcutClassName
            )}
          >
            {command.shortcut.map((key, index) => (
              <kbd
                key={index}
                className={cn(commandPaletteShortcutKeyVariants())}
              >
                {key}
              </kbd>
            ))}
          </div>
        )}
      </div>
    );
  }
);
CommandItem.displayName = 'CommandItem';

/**
 * CommandGroup component for grouped commands
 */
const CommandGroup = React.forwardRef<HTMLDivElement, CommandGroupProps>(
  (
    {
      group,
      showLabel = true,
      className,
      labelClassName,
      onCommandSelect,
      highlightedIndex = -1,
      startIndex,
      showShortcuts = true,
      ...props
    },
    ref
  ) => {
    if (group.hidden || group.commands.length === 0) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(commandPaletteGroupVariants(), className)}
        {...props}
      >
        {showLabel && (
          <div
            className={cn(commandPaletteGroupLabelVariants(), labelClassName)}
          >
            {group.label}
          </div>
        )}
        <div
          role="group"
          aria-labelledby={showLabel ? `group-${group.id}` : undefined}
        >
          {group.commands.map((command, index) => {
            const globalIndex = startIndex + index;
            return (
              <CommandItem
                key={command.id}
                command={command}
                highlighted={globalIndex === highlightedIndex}
                onSelect={onCommandSelect}
                showShortcuts={showShortcuts}
              />
            );
          })}
        </div>
      </div>
    );
  }
);
CommandGroup.displayName = 'CommandGroup';

/**
 * Main CommandPalette component
 */
const CommandPalette = React.forwardRef<HTMLDivElement, CommandPaletteProps>(
  (
    {
      open,
      onOpenChange,
      commands,
      onCommandSelect,
      placeholder = 'Type a command or search...',
      searchValue: controlledSearchValue,
      onSearchChange,
      showRecentCommands = false,
      recentCommands = [],
      showShortcuts = true,
      enableFuzzySearch = true,
      size = 'md',
      position = 'center',
      variant = 'default',
      className,
      overlayClassName,
      contentClassName,
      searchClassName,
      groupClassName,
      'aria-label': ariaLabel = 'Command palette',
      'aria-labelledby': ariaLabelledBy,
      ...props
    },
    ref
  ) => {
    const [internalSearchValue, setInternalSearchValue] = React.useState('');
    const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
    const [mounted, setMounted] = React.useState(false);

    const searchValue = controlledSearchValue ?? internalSearchValue;
    const setSearchValue = onSearchChange ?? setInternalSearchValue;

    const inputRef = React.useRef<HTMLInputElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);

    // Mount effect for portal
    React.useEffect(() => {
      setMounted(true);
    }, []);

    // Focus management
    React.useEffect(() => {
      if (open && inputRef.current) {
        inputRef.current.focus();
      }
    }, [open]);

    // Filter commands based on search
    const filteredCommands = React.useMemo(() => {
      const allCommands = [...commands];

      // Add recent commands if enabled and search is empty
      if (
        showRecentCommands &&
        recentCommands.length > 0 &&
        !searchValue.trim()
      ) {
        const recentGroup: CommandGroup = {
          id: 'recent',
          label: 'Recent',
          commands: recentCommands,
        };
        allCommands.unshift(recentGroup);
      }

      return filterCommands(allCommands, searchValue, enableFuzzySearch);
    }, [
      commands,
      recentCommands,
      searchValue,
      enableFuzzySearch,
      showRecentCommands,
    ]);

    // Reset highlighted index when search changes
    React.useEffect(() => {
      setHighlightedIndex(-1);
    }, [searchValue]);

    // Navigation functions
    const navigate = React.useCallback(
      (direction: NavigationDirection) => {
        const maxIndex = filteredCommands.length - 1;

        if (maxIndex < 0) return;

        switch (direction) {
          case 'up':
            setHighlightedIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
            break;
          case 'down':
            setHighlightedIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
            break;
          case 'first':
            setHighlightedIndex(0);
            break;
          case 'last':
            setHighlightedIndex(maxIndex);
            break;
        }
      },
      [filteredCommands.length]
    );

    const selectHighlighted = React.useCallback(() => {
      if (highlightedIndex >= 0 && highlightedIndex < filteredCommands.length) {
        // Safe array access - bounds checked above
        // eslint-disable-next-line security/detect-object-injection
        const result = filteredCommands[highlightedIndex];
        if (result && !result.command.disabled) {
          onCommandSelect(result.command);
          onOpenChange(false);
        }
      }
    }, [highlightedIndex, filteredCommands, onCommandSelect, onOpenChange]);

    const close = React.useCallback(() => {
      onOpenChange(false);
    }, [onOpenChange]);

    // Keyboard event handling
    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent) => {
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            navigate('down');
            break;
          case 'ArrowUp':
            event.preventDefault();
            navigate('up');
            break;
          case 'Home':
            event.preventDefault();
            navigate('first');
            break;
          case 'End':
            event.preventDefault();
            navigate('last');
            break;
          case 'Enter':
            event.preventDefault();
            selectHighlighted();
            break;
          case 'Escape':
            event.preventDefault();
            close();
            break;
        }
      },
      [navigate, selectHighlighted, close]
    );

    // Handle backdrop click
    const handleBackdropClick = React.useCallback(
      (event: React.MouseEvent) => {
        if (event.target === event.currentTarget) {
          close();
        }
      },
      [close]
    );

    // Handle search input change
    const handleSearchChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
      },
      [setSearchValue]
    );

    // Handle command selection
    const handleCommandSelect = React.useCallback(
      (command: Command) => {
        onCommandSelect(command);
        close();
      },
      [onCommandSelect, close]
    );

    // Group filtered commands by their original groups
    const groupedResults = React.useMemo(() => {
      const groups = new Map<
        string,
        { group: CommandGroup; commands: Command[] }
      >();

      filteredCommands.forEach(result => {
        const groupId = result.group.id;
        if (!groups.has(groupId)) {
          groups.set(groupId, {
            group: result.group,
            commands: [],
          });
        }
        groups.get(groupId)!.commands.push(result.command);
      });

      return Array.from(groups.values());
    }, [filteredCommands]);

    // Context value
    const contextValue: CommandPaletteContextValue = React.useMemo(
      () => ({
        open,
        searchValue,
        setSearchValue,
        highlightedIndex,
        setHighlightedIndex,
        navigate,
        selectHighlighted,
        close,
        filteredCommands,
        showShortcuts,
        enableFuzzySearch,
      }),
      [
        open,
        searchValue,
        setSearchValue,
        highlightedIndex,
        setHighlightedIndex,
        navigate,
        selectHighlighted,
        close,
        filteredCommands,
        showShortcuts,
        enableFuzzySearch,
      ]
    );

    if (!mounted || !open) {
      return null;
    }

    const content = (
      <CommandPaletteContext.Provider value={contextValue}>
        <div
          className={cn(commandPaletteVariants({ position }), overlayClassName)}
          onClick={handleBackdropClick}
          onKeyDown={handleKeyDown}
        >
          <div
            ref={ref}
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-controls="command-listbox"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            className={cn(
              commandPaletteContentVariants({ size, variant }),
              className,
              contentClassName
            )}
            {...props}
          >
            {/* Search Input */}
            <input
              ref={inputRef}
              type="text"
              role="searchbox"
              placeholder={placeholder}
              value={searchValue}
              onChange={handleSearchChange}
              className={cn(
                commandPaletteSearchVariants({ variant }),
                searchClassName
              )}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />

            {/* Command List */}
            <div
              ref={contentRef}
              id="command-listbox"
              role="listbox"
              aria-label="Available commands"
              className={cn(commandPaletteContentAreaVariants({ variant }))}
            >
              {groupedResults.length === 0 ? (
                <CommandEmpty />
              ) : (
                groupedResults.map((groupData, groupIndex) => {
                  // Calculate start index for this group
                  const startIndex = groupedResults
                    .slice(0, groupIndex)
                    .reduce((acc, g) => acc + g.commands.length, 0);

                  return (
                    <React.Fragment key={groupData.group.id}>
                      {groupIndex > 0 && <CommandSeparator />}
                      <CommandGroup
                        group={{
                          ...groupData.group,
                          commands: groupData.commands,
                        }}
                        onCommandSelect={handleCommandSelect}
                        highlightedIndex={highlightedIndex}
                        startIndex={startIndex}
                        showShortcuts={showShortcuts}
                        className={groupClassName}
                      />
                    </React.Fragment>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </CommandPaletteContext.Provider>
    );

    return createPortal(content, document.body);
  }
);
CommandPalette.displayName = 'CommandPalette';

export {
  CommandPalette,
  CommandGroup,
  CommandItem,
  CommandEmpty,
  CommandSeparator,
};

export type {
  CommandPaletteProps,
  CommandGroupProps,
  CommandItemProps,
  CommandEmptyProps,
  CommandSeparatorProps,
  Command,
  CommandGroup as CommandGroupType,
  SearchResult,
  NavigationDirection,
  CommandPaletteContextValue,
};
