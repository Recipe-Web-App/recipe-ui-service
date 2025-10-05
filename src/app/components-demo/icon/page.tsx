'use client';

import React, { useState, useMemo } from 'react';
import {
  Icon,
  RecipeIcon,
  LoadingIcon,
  CloseIcon,
  SearchIcon,
  MenuIcon,
  ChevronIcon,
  StatusIcon,
} from '@/components/ui/icon';
import {
  getIconCategories,
  getIconsByCategory,
  getIconNames,
} from '@/lib/ui/icon-registry';
import type { IconName, IconCategory } from '@/types/ui/icon';

const getIconNameFontSize = (nameLength: number): string => {
  if (nameLength > 12) return '10px';
  if (nameLength > 8) return '11px';
  return '12px';
};

const getIconNameLineHeight = (nameLength: number): string => {
  return nameLength > 8 ? '1.1' : '1.2';
};

export default function IconDemoPage() {
  const [selectedCategory, setSelectedCategory] = useState<
    IconCategory | 'all'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSize, setSelectedSize] = useState<
    'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl'
  >('default');
  const [selectedColor, setSelectedColor] = useState<
    | 'default'
    | 'muted'
    | 'accent'
    | 'primary'
    | 'destructive'
    | 'success'
    | 'warning'
    | 'info'
  >('default');
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);

  const categories = getIconCategories();
  const allIconNames = getIconNames();

  // Filter icons based on category and search
  const filteredIcons = useMemo(() => {
    let icons: string[] = [];

    if (selectedCategory === 'all') {
      icons = allIconNames;
    } else {
      icons = Object.keys(getIconsByCategory(selectedCategory));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      icons = icons.filter(
        icon =>
          icon.toLowerCase().includes(query) ||
          icon.replace(/-/g, ' ').toLowerCase().includes(query)
      );
    }

    return icons;
  }, [selectedCategory, searchQuery, allIconNames]);

  const handleIconClick = async (iconName: string) => {
    const code = `<Icon name="${iconName}" />`;
    await navigator.clipboard.writeText(code);
    setCopiedIcon(iconName);
    setTimeout(() => setCopiedIcon(null), 2000);
  };

  const sizeOptions = [
    { value: 'xs' as const, label: 'XS (12px)' },
    { value: 'sm' as const, label: 'SM (16px)' },
    { value: 'default' as const, label: 'Default (20px)' },
    { value: 'lg' as const, label: 'LG (24px)' },
    { value: 'xl' as const, label: 'XL (32px)' },
    { value: '2xl' as const, label: '2XL (40px)' },
  ];

  const colorOptions = [
    { value: 'default' as const, label: 'Default' },
    { value: 'muted' as const, label: 'Muted' },
    { value: 'accent' as const, label: 'Accent' },
    { value: 'primary' as const, label: 'Primary' },
    { value: 'destructive' as const, label: 'Destructive' },
    { value: 'success' as const, label: 'Success' },
    { value: 'warning' as const, label: 'Warning' },
    { value: 'info' as const, label: 'Info' },
  ];

  const animationExamples = [
    { name: 'loading', animation: 'spin' as const },
    { name: 'heart', animation: 'pulse' as const },
    { name: 'bell', animation: 'bounce' as const },
    { name: 'wifi', animation: 'ping' as const },
  ];

  return (
    <div className="container mx-auto space-y-12 p-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Icon System</h1>
        <p className="text-muted-foreground text-lg">
          Comprehensive icon system with {allIconNames.length} icons across{' '}
          {categories.length} categories
        </p>
      </div>

      {/* Quick Start Examples */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Quick Start Examples</h2>
        <div className="bg-card rounded-lg border p-6">
          <div className="space-y-6">
            {/* Basic Usage */}
            <div>
              <h3 className="mb-3 text-lg font-medium">Basic Usage</h3>
              <div className="flex items-center gap-4">
                <Icon name="search" />
                <Icon name="heart" />
                <Icon name="star" />
                <Icon name="user" />
                <Icon name="settings" />
              </div>
              <pre className="bg-muted mt-2 rounded p-2 text-xs">
                {`<Icon name="search" />
<Icon name="heart" />
<Icon name="star" />`}
              </pre>
            </div>

            {/* Size Variants */}
            <div>
              <h3 className="mb-3 text-lg font-medium">Size Variants</h3>
              <div className="flex items-center gap-4">
                <Icon name="star" size="xs" />
                <Icon name="star" size="sm" />
                <Icon name="star" size="default" />
                <Icon name="star" size="lg" />
                <Icon name="star" size="xl" />
                <Icon name="star" size="2xl" />
              </div>
              <pre className="bg-muted mt-2 rounded p-2 text-xs">
                {`<Icon name="star" size="xs" />     // 12px
<Icon name="star" size="sm" />     // 16px
<Icon name="star" size="default" />// 20px
<Icon name="star" size="lg" />     // 24px
<Icon name="star" size="xl" />     // 32px
<Icon name="star" size="2xl" />    // 40px`}
              </pre>
            </div>

            {/* Color Variants */}
            <div>
              <h3 className="mb-3 text-lg font-medium">Color Variants</h3>
              <div className="flex items-center gap-4">
                <Icon name="heart" color="default" />
                <Icon name="heart" color="muted" />
                <Icon name="heart" color="accent" />
                <Icon name="heart" color="primary" />
                <Icon name="heart" color="destructive" />
                <Icon name="heart" color="success" />
                <Icon name="heart" color="warning" />
                <Icon name="heart" color="info" />
              </div>
            </div>

            {/* Animations */}
            <div>
              <h3 className="mb-3 text-lg font-medium">Animations</h3>
              <div className="flex items-center gap-4">
                {animationExamples.map(({ name, animation }) => (
                  <Icon
                    key={name}
                    name={name as IconName}
                    animation={animation}
                    size="lg"
                  />
                ))}
              </div>
              <pre className="bg-muted mt-2 rounded p-2 text-xs">
                {`<Icon name="loading" animation="spin" />
<Icon name="heart" animation="pulse" />
<Icon name="bell" animation="bounce" />
<Icon name="wifi" animation="ping" />`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Convenience Components */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Convenience Components</h2>
        <div className="bg-card rounded-lg border p-6">
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-lg font-medium">Common Patterns</h3>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <LoadingIcon />
                  <span className="text-sm">Loading</span>
                </div>
                <div className="flex items-center gap-2">
                  <CloseIcon onClick={() => alert('Close clicked')} />
                  <span className="text-sm">Close</span>
                </div>
                <div className="flex items-center gap-2">
                  <SearchIcon />
                  <span className="text-sm">Search</span>
                </div>
                <div className="flex items-center gap-2">
                  <MenuIcon onClick={() => alert('Menu clicked')} />
                  <span className="text-sm">Menu</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">Status Icons</h3>
              <div className="flex items-center gap-6">
                <StatusIcon status="success" />
                <StatusIcon status="error" />
                <StatusIcon status="warning" />
                <StatusIcon status="info" />
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">Chevron Directions</h3>
              <div className="flex items-center gap-4">
                <ChevronIcon direction="left" onClick={() => {}} />
                <ChevronIcon direction="right" onClick={() => {}} />
                <ChevronIcon direction="up" onClick={() => {}} />
                <ChevronIcon direction="down" onClick={() => {}} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recipe Icons */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Recipe-Specific Icons</h2>
        <div className="bg-card rounded-lg border p-6">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="text-center">
              <RecipeIcon name="cooking-pot" category="cooking" size="xl" />
              <p className="mt-2 text-sm">Cooking</p>
            </div>
            <div className="text-center">
              <RecipeIcon name="timer" category="time" size="xl" />
              <p className="mt-2 text-sm">Time</p>
            </div>
            <div className="text-center">
              <RecipeIcon name="thermometer" category="temperature" size="xl" />
              <p className="mt-2 text-sm">Temperature</p>
            </div>
            <div className="text-center">
              <RecipeIcon name="star" category="rating" size="xl" />
              <p className="mt-2 text-sm">Rating</p>
            </div>
            <div className="text-center">
              <RecipeIcon name="users" category="serving" size="xl" />
              <p className="mt-2 text-sm">Serving</p>
            </div>
            <div className="text-center">
              <RecipeIcon name="target" category="difficulty" size="xl" />
              <p className="mt-2 text-sm">Difficulty</p>
            </div>
            <div className="text-center">
              <RecipeIcon name="scale" category="nutrition" size="xl" />
              <p className="mt-2 text-sm">Nutrition</p>
            </div>
            <div className="text-center">
              <RecipeIcon name="wheat" category="diet" size="xl" />
              <p className="mt-2 text-sm">Diet</p>
            </div>
          </div>
        </div>
      </section>

      {/* Icon Browser */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Icon Browser</h2>

        {/* Filters */}
        <div className="bg-card rounded-lg border p-4">
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="min-w-64 flex-1">
              <div className="relative">
                <SearchIcon
                  className="absolute top-1/2 left-3 -translate-y-1/2"
                  size="sm"
                />
                <input
                  type="text"
                  placeholder="Search icons..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="border-input bg-background w-full rounded-md border px-10 py-2 text-sm"
                />
                {searchQuery && (
                  <CloseIcon
                    size="sm"
                    onClick={() => setSearchQuery('')}
                    className="absolute top-1/2 right-3 -translate-y-1/2"
                  />
                )}
              </div>
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={e =>
                setSelectedCategory(e.target.value as IconCategory | 'all')
              }
              className="border-input bg-background rounded-md border px-3 py-2 text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            {/* Size Filter */}
            <select
              value={selectedSize}
              onChange={e =>
                setSelectedSize(
                  e.target.value as
                    | 'xs'
                    | 'sm'
                    | 'default'
                    | 'lg'
                    | 'xl'
                    | '2xl'
                )
              }
              className="border-input bg-background rounded-md border px-3 py-2 text-sm"
            >
              {sizeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Color Filter */}
            <select
              value={selectedColor}
              onChange={e =>
                setSelectedColor(
                  e.target.value as
                    | 'default'
                    | 'muted'
                    | 'accent'
                    | 'primary'
                    | 'destructive'
                    | 'success'
                    | 'warning'
                    | 'info'
                )
              }
              className="border-input bg-background rounded-md border px-3 py-2 text-sm"
            >
              {colorOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              Showing {filteredIcons.length} of {allIconNames.length} icons
            </p>
            {copiedIcon && (
              <p className="text-success text-sm">
                Copied {copiedIcon} to clipboard!
              </p>
            )}
          </div>
        </div>

        {/* Icon Grid */}
        <div className="bg-card rounded-lg border p-6">
          <div className="grid grid-cols-3 gap-8 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
            {filteredIcons.map(iconName => (
              <div
                key={iconName}
                className="group hover:bg-muted flex h-28 min-w-0 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg p-5 transition-colors"
                onClick={() => handleIconClick(iconName)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleIconClick(iconName);
                  }
                }}
                tabIndex={0}
                role="button"
                title={`Click to copy: <Icon name="${iconName}" />`}
              >
                <Icon
                  name={iconName as IconName}
                  size={selectedSize}
                  color={selectedColor}
                  className="flex-shrink-0 transition-transform group-hover:scale-110"
                />
                <span
                  className={`text-muted-foreground group-hover:text-foreground w-full text-center leading-tight break-words hyphens-auto [font-size:${getIconNameFontSize(iconName.length)}] [line-height:${getIconNameLineHeight(iconName.length)}]`}
                >
                  {iconName}
                </span>
              </div>
            ))}
          </div>

          {filteredIcons.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Icon name="search" size="xl" color="muted" />
              <h3 className="mt-4 text-lg font-medium">No icons found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or category filter
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Usage Guidelines */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Usage Guidelines</h2>
        <div className="bg-card rounded-lg border p-6">
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-lg font-medium">Accessibility</h3>
              <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                <li>Icons automatically include appropriate ARIA labels</li>
                <li>Decorative icons are hidden from screen readers</li>
                <li>Interactive icons are keyboard accessible</li>
                <li>Use meaningful labels for context-specific icons</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-medium">Best Practices</h3>
              <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                <li>Use consistent icon sizes within the same context</li>
                <li>Choose colors that align with your content hierarchy</li>
                <li>Limit animations to essential feedback only</li>
                <li>Provide text labels for important actions</li>
                <li>Use recipe-specific icons for cooking-related content</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-medium">Performance</h3>
              <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                <li>Icons are tree-shakeable - only used icons are bundled</li>
                <li>SVG icons scale perfectly at any size</li>
                <li>Animations use CSS transforms for optimal performance</li>
                <li>
                  Components are memoized to prevent unnecessary re-renders
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* API Reference */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">API Reference</h2>
        <div className="bg-card rounded-lg border p-6">
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-medium">Icon Component Props</h3>
              <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                <li>
                  <code>name</code> - Icon name from registry (required)
                </li>
                <li>
                  <code>size</code> - xs, sm, default, lg, xl, 2xl
                </li>
                <li>
                  <code>color</code> - default, muted, accent, primary,
                  destructive, success, warning, info
                </li>
                <li>
                  <code>animation</code> - none, spin, pulse, bounce, ping
                </li>
                <li>
                  <code>state</code> - default, hover, interactive, disabled
                </li>
                <li>
                  <code>onClick</code> - Click handler function
                </li>
                <li>
                  <code>aria-label</code> - Custom accessibility label
                </li>
                <li>
                  <code>className</code> - Additional CSS classes
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
