'use client';

import React, { useState, useEffect } from 'react';
import { CommandPalette } from '@/components/ui/command-palette';
import { Button } from '@/components/ui/button';
import type { Command, CommandGroup } from '@/types/ui/command-palette';

export default function CommandPaletteDemo() {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [recentCommands, setRecentCommands] = useState<Command[]>([]);

  // Sample commands for the demo
  const sampleCommands: CommandGroup[] = [
    {
      id: 'navigation',
      label: 'Navigation',
      commands: [
        {
          id: 'recipes',
          label: 'View All Recipes',
          description: 'Browse the complete recipe collection',
          icon: (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          ),
          shortcut: ['⌘', 'R'],
          action: () => alert('Navigate to recipes'),
          keywords: ['browse', 'list', 'collection', 'cookbook'],
        },
        {
          id: 'meal-plans',
          label: 'Meal Plans',
          description: 'Plan your weekly meals',
          icon: (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          ),
          shortcut: ['⌘', 'M'],
          action: () => alert('Navigate to meal plans'),
          keywords: ['plan', 'weekly', 'schedule', 'calendar'],
        },
        {
          id: 'shopping-list',
          label: 'Shopping List',
          description: 'Manage your grocery shopping',
          icon: (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6.5-5v5a2 2 0 01-2 2H9a2 2 0 01-2-2v-5m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
              />
            </svg>
          ),
          shortcut: ['⌘', 'S'],
          action: () => alert('Navigate to shopping list'),
          keywords: ['grocery', 'ingredients', 'buy', 'shop'],
        },
        {
          id: 'favorites',
          label: 'Favorite Recipes',
          description: 'View your saved favorite recipes',
          icon: (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          ),
          shortcut: ['⌘', 'F'],
          action: () => alert('Navigate to favorites'),
          keywords: ['saved', 'liked', 'bookmarked'],
        },
      ],
    },
    {
      id: 'actions',
      label: 'Quick Actions',
      commands: [
        {
          id: 'create-recipe',
          label: 'Create New Recipe',
          description: 'Start creating a new recipe',
          icon: (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          ),
          shortcut: ['⌘', 'N'],
          action: () => alert('Create new recipe'),
          keywords: ['new', 'add', 'create', 'recipe'],
        },
        {
          id: 'import-recipe',
          label: 'Import Recipe',
          description: 'Import recipe from URL or file',
          icon: (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
              />
            </svg>
          ),
          shortcut: ['⌘', 'I'],
          action: () => alert('Import recipe'),
          keywords: ['import', 'upload', 'url', 'file'],
        },
        {
          id: 'random-recipe',
          label: 'Random Recipe',
          description: 'Discover a random recipe',
          icon: (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          ),
          action: () => alert('Show random recipe'),
          keywords: ['random', 'discover', 'surprise', 'explore'],
        },
        {
          id: 'add-to-meal-plan',
          label: 'Add to Meal Plan',
          description: 'Add current recipe to meal plan',
          icon: (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          ),
          shortcut: ['⌘', 'A'],
          action: () => alert('Add to meal plan'),
          keywords: ['meal', 'plan', 'schedule', 'add'],
        },
      ],
    },
    {
      id: 'settings',
      label: 'Settings',
      commands: [
        {
          id: 'preferences',
          label: 'Preferences',
          description: 'Manage your app preferences',
          icon: (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          ),
          shortcut: ['⌘', ','],
          action: () => alert('Open preferences'),
          keywords: ['settings', 'config', 'options'],
        },
        {
          id: 'theme-toggle',
          label: 'Toggle Theme',
          description: 'Switch between light and dark mode',
          icon: (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          ),
          shortcut: ['⌘', 'T'],
          action: () => alert('Toggle theme'),
          keywords: ['theme', 'dark', 'light', 'mode'],
        },
        {
          id: 'help',
          label: 'Help & Support',
          description: 'Get help and support',
          icon: (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          shortcut: ['⌘', '?'],
          action: () => alert('Open help'),
          keywords: ['help', 'support', 'docs', 'documentation'],
        },
      ],
    },
  ];

  // Handle command selection and track recent commands
  const handleCommandSelect = (command: Command) => {
    command.action();

    // Track as recent (remove duplicates, limit to 5)
    setRecentCommands(prev => {
      const filtered = prev.filter(c => c.id !== command.id);
      return [command, ...filtered].slice(0, 5);
    });

    setOpen(false);
  };

  // Global keyboard shortcut for opening command palette
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-foreground mb-2 text-3xl font-bold">
          Command Palette Component
        </h1>
        <p className="text-muted-foreground text-lg">
          Quick navigation and actions with Cmd+K style interface.
          Keyboard-first design with fuzzy search and command grouping.
        </p>
      </div>

      {/* Global Shortcut Info */}
      <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/50">
        <div className="mb-2 flex items-center gap-2">
          <kbd className="bg-muted text-muted-foreground inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded border px-1 font-mono text-xs font-medium">
            ⌘
          </kbd>
          <span className="text-sm font-medium">+</span>
          <kbd className="bg-muted text-muted-foreground inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded border px-1 font-mono text-xs font-medium">
            K
          </kbd>
          <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
            Press Cmd+K (or Ctrl+K) anywhere to open the command palette
          </span>
        </div>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Try searching for commands like &quot;recipe&quot;, &quot;plan&quot;,
          &quot;create&quot;, or use arrow keys to navigate.
        </p>
      </div>

      <div className="space-y-8">
        {/* Interactive Controls */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Interactive Demo</h3>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Button onClick={() => setOpen(true)} className="justify-start">
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Open Command Palette
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setOpen(true);
                setSearchValue('recipe');
              }}
              className="justify-start"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2m3 0H6a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2z"
                />
              </svg>
              Search &quot;recipe&quot;
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setOpen(true);
                setSearchValue('create');
              }}
              className="justify-start"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Search &quot;create&quot;
            </Button>
          </div>

          <div className="mt-6">
            <h4 className="mb-3 font-medium">Recent Commands</h4>
            {recentCommands.length > 0 ? (
              <div className="grid gap-2 md:grid-cols-2">
                {recentCommands.map(command => (
                  <div
                    key={command.id}
                    className="bg-muted/50 flex items-center gap-2 rounded border p-2 text-sm"
                  >
                    {command.icon && (
                      <div className="text-muted-foreground">
                        {command.icon}
                      </div>
                    )}
                    <span>{command.label}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                No recent commands yet. Try opening the command palette and
                selecting a command.
              </p>
            )}
          </div>
        </div>

        {/* Variants Demo */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Variants Demo</h3>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h4 className="mb-2 font-medium">Sizes</h4>
              <div className="space-y-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setOpen(true)}
                  className="w-full justify-start"
                >
                  Default (md)
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setOpen(true)}
                  className="w-full justify-start"
                >
                  Small (sm)
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setOpen(true)}
                  className="w-full justify-start"
                >
                  Large (lg)
                </Button>
              </div>
            </div>

            <div>
              <h4 className="mb-2 font-medium">Positions</h4>
              <div className="space-y-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setOpen(true)}
                  className="w-full justify-start"
                >
                  Center
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setOpen(true)}
                  className="w-full justify-start"
                >
                  Top
                </Button>
              </div>
            </div>

            <div>
              <h4 className="mb-2 font-medium">Themes</h4>
              <div className="space-y-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setOpen(true)}
                  className="w-full justify-start"
                >
                  Default
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setOpen(true)}
                  className="w-full justify-start"
                >
                  Compact
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setOpen(true)}
                  className="w-full justify-start"
                >
                  Spotlight
                </Button>
              </div>
            </div>

            <div>
              <h4 className="mb-2 font-medium">Features</h4>
              <div className="space-y-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setOpen(true)}
                  className="w-full justify-start"
                >
                  With Recent
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setOpen(true)}
                  className="w-full justify-start"
                >
                  No Shortcuts
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setOpen(true)}
                  className="w-full justify-start"
                >
                  Simple Search
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Command Examples */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Available Commands</h3>

          <div className="grid gap-6 md:grid-cols-3">
            {sampleCommands.map(group => (
              <div key={group.id}>
                <h4 className="text-muted-foreground mb-3 text-sm font-medium tracking-wider uppercase">
                  {group.label}
                </h4>
                <div className="space-y-2">
                  {group.commands.map(command => (
                    <div
                      key={command.id}
                      className="bg-muted/30 flex items-center justify-between rounded border p-2"
                    >
                      <div className="flex items-center gap-2">
                        {command.icon && (
                          <div className="text-muted-foreground">
                            {command.icon}
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium">
                            {command.label}
                          </div>
                          {command.description && (
                            <div className="text-muted-foreground text-xs">
                              {command.description}
                            </div>
                          )}
                        </div>
                      </div>
                      {command.shortcut && (
                        <div className="flex items-center gap-0.5">
                          {command.shortcut.map((key, index) => (
                            <kbd
                              key={index}
                              className="bg-muted text-muted-foreground inline-flex h-4 min-w-[1rem] items-center justify-center rounded border px-1 font-mono text-xs font-medium"
                            >
                              {key}
                            </kbd>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Examples */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Usage Examples</h3>

          <div className="space-y-4">
            <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
              <div className="text-muted-foreground mb-2">
                {/* Basic usage */}
              </div>
              <div>{`<CommandPalette`}</div>
              <div>{`  open={open}`}</div>
              <div>{`  onOpenChange={setOpen}`}</div>
              <div>{`  commands={commands}`}</div>
              <div>{`  onCommandSelect={handleCommandSelect}`}</div>
              <div> placeholder=&quot;Type a command or search...&quot;</div>
              <div>{`/>`}</div>
            </div>

            <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
              <div className="text-muted-foreground mb-2">
                {/* With recent commands and custom styling */}
              </div>
              <div>{`<CommandPalette`}</div>
              <div>{`  open={open}`}</div>
              <div>{`  onOpenChange={setOpen}`}</div>
              <div>{`  commands={commands}`}</div>
              <div>{`  onCommandSelect={handleCommandSelect}`}</div>
              <div>{`  showRecentCommands={true}`}</div>
              <div>{`  recentCommands={recentCommands}`}</div>
              <div> size=&quot;lg&quot;</div>
              <div> variant=&quot;spotlight&quot;</div>
              <div>{`  enableFuzzySearch={true}`}</div>
              <div>{`/>`}</div>
            </div>

            <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
              <div className="text-muted-foreground mb-2">
                {/* Global keyboard shortcut */}
              </div>
              <div>{`useEffect(() => {`}</div>
              <div>{`  const handleKeyDown = (event: KeyboardEvent) => {`}</div>
              <div>
                {' '}
                if (event.key === &apos;k&apos; && (event.metaKey ||
                event.ctrlKey)) &#123;
              </div>
              <div>{`      event.preventDefault();`}</div>
              <div>{`      setOpen(true);`}</div>
              <div>{`    }`}</div>
              <div>{`  };`}</div>
              <div>{``}</div>
              <div>
                {' '}
                document.addEventListener(&apos;keydown&apos;, handleKeyDown);
              </div>
              <div>
                {' '}
                return () =&gt;
                document.removeEventListener(&apos;keydown&apos;,
                handleKeyDown);
              </div>
              <div>{`}, []);`}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Command Palette Instance */}
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        commands={sampleCommands}
        onCommandSelect={handleCommandSelect}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        showRecentCommands={true}
        recentCommands={recentCommands}
        showShortcuts={true}
        enableFuzzySearch={true}
        placeholder="Type a command or search..."
        size="md"
        position="center"
        variant="default"
      />
    </div>
  );
}
