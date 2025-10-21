'use client';

import * as React from 'react';
import { QuickActions } from '@/components/ui/quick-actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Share2, Plus, Eye, Download, Edit, Trash2 } from 'lucide-react';
import type { QuickAction } from '@/types/ui/quick-actions';

export default function QuickActionsDemoPage() {
  const [position, setPosition] = React.useState<
    'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  >('top-right');
  const [size, setSize] = React.useState<'sm' | 'md' | 'lg'>('md');
  const [maxVisible, setMaxVisible] = React.useState(3);
  const [favorited, setFavorited] = React.useState(false);

  const basicActions: QuickAction[] = [
    {
      id: 'favorite',
      icon: Heart,
      label: 'Favorite',
      onClick: () => console.log('Favorited'),
    },
    {
      id: 'share',
      icon: Share2,
      label: 'Share',
      onClick: () => console.log('Shared'),
    },
    {
      id: 'add',
      icon: Plus,
      label: 'Add to collection',
      onClick: () => console.log('Added to collection'),
    },
  ];

  const manyActions: QuickAction[] = [
    {
      id: 'favorite',
      icon: Heart,
      label: favorited ? 'Unfavorite' : 'Favorite',
      onClick: () => setFavorited(!favorited),
    },
    {
      id: 'share',
      icon: Share2,
      label: 'Share',
      onClick: () => console.log('Shared'),
    },
    {
      id: 'add',
      icon: Plus,
      label: 'Add to collection',
      onClick: () => console.log('Added'),
    },
    {
      id: 'view',
      icon: Eye,
      label: 'Quick view',
      onClick: () => console.log('Quick view'),
    },
    {
      id: 'download',
      icon: Download,
      label: 'Download',
      onClick: () => console.log('Downloaded'),
    },
  ];

  const variantActions: QuickAction[] = [
    {
      id: 'favorite',
      icon: Heart,
      label: 'Favorite',
      variant: 'default',
      onClick: () => console.log('Favorited'),
    },
    {
      id: 'edit',
      icon: Edit,
      label: 'Edit',
      variant: 'ghost',
      onClick: () => console.log('Edited'),
    },
    {
      id: 'delete',
      icon: Trash2,
      label: 'Delete',
      variant: 'destructive',
      onClick: () => console.log('Deleted'),
    },
  ];

  return (
    <div className="container mx-auto space-y-12 py-8">
      {/* Page Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-bold">QuickActions Component</h1>
            <p className="text-muted-foreground text-lg">
              Quick action buttons that appear on hover/focus, positioned in a
              corner of cards with overflow menu support.
            </p>
          </div>
          <Badge variant="default" className="text-sm">
            Overlay Component
          </Badge>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold">Hover Activation</h3>
                <p className="text-muted-foreground text-sm">
                  Appears on hover/focus
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold">Overflow Menu</h3>
                <p className="text-muted-foreground text-sm">
                  3 visible + dropdown
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold">Touch-Friendly</h3>
                <p className="text-muted-foreground text-sm">
                  Tap to reveal on mobile
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold">Accessible</h3>
                <p className="text-muted-foreground text-sm">
                  WCAG 2.1 AA compliant
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Section 1: Basic Usage */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-2 text-2xl font-bold">Basic Usage</h2>
          <p className="text-muted-foreground">
            Hover over the card to see quick actions appear in the top-right
            corner.
          </p>
        </div>

        <div className="group relative mx-auto w-full max-w-md cursor-pointer">
          <Card className="overflow-hidden transition-shadow hover:shadow-lg">
            <div className="relative h-48 bg-gradient-to-br from-orange-200 to-red-300 dark:from-orange-600 dark:to-red-700">
              <div className="absolute inset-0 flex items-center justify-center text-5xl">
                🍝
              </div>
            </div>
            <CardContent className="p-6">
              <CardTitle className="mb-2">
                Classic Spaghetti Carbonara
              </CardTitle>
              <CardDescription>
                Creamy Italian pasta with bacon, eggs, and parmesan cheese.
              </CardDescription>
              <div className="text-muted-foreground mt-4 flex items-center gap-3 text-xs">
                <span>⏱️ 30 min</span>
                <span>👨‍🍳 Medium</span>
                <span>⭐ 4.8</span>
              </div>
            </CardContent>
          </Card>
          <QuickActions actions={basicActions} />
        </div>
      </section>

      {/* Section 2: With Overflow Menu */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-2 text-2xl font-bold">With Overflow Menu</h2>
          <p className="text-muted-foreground">
            When there are more than 3 actions, additional actions appear in an
            overflow dropdown menu.
          </p>
        </div>

        <div className="group relative mx-auto w-full max-w-md cursor-pointer">
          <Card className="overflow-hidden transition-shadow hover:shadow-lg">
            <div className="relative h-48 bg-gradient-to-br from-blue-200 to-purple-300 dark:from-blue-700 dark:to-purple-800">
              <div className="absolute inset-0 flex items-center justify-center text-5xl">
                🍕
              </div>
              {favorited && (
                <Badge
                  className="absolute right-2 bottom-2"
                  variant="secondary"
                >
                  Favorited
                </Badge>
              )}
            </div>
            <CardContent className="p-6">
              <CardTitle className="mb-2">Margherita Pizza</CardTitle>
              <CardDescription>
                Traditional Italian pizza with fresh basil and mozzarella.
              </CardDescription>
              <div className="text-muted-foreground mt-4 flex items-center gap-3 text-xs">
                <span>⏱️ 25 min</span>
                <span>👨‍🍳 Easy</span>
                <span>⭐ 4.9</span>
              </div>
            </CardContent>
          </Card>
          <QuickActions actions={manyActions} maxVisible={3} />
        </div>
      </section>

      {/* Section 3: All Positions */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-2 text-2xl font-bold">All Positions</h2>
          <p className="text-muted-foreground">
            QuickActions can be positioned in any of the four corners.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {(
            ['top-right', 'top-left', 'bottom-right', 'bottom-left'] as const
          ).map(pos => (
            <div key={pos}>
              <p className="mb-2 text-sm font-medium capitalize">
                {pos.replace('-', ' ')}
              </p>
              <div className="group relative cursor-pointer">
                <Card className="overflow-hidden">
                  <div className="relative h-32 bg-gradient-to-br from-green-200 to-blue-300 dark:from-green-700 dark:to-blue-800">
                    <div className="absolute inset-0 flex items-center justify-center text-4xl">
                      🥗
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm font-medium">Caesar Salad</p>
                    <p className="text-muted-foreground text-xs">
                      Hover to see actions
                    </p>
                  </CardContent>
                </Card>
                <QuickActions actions={basicActions} position={pos} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: Size Variants */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-2 text-2xl font-bold">Size Variants</h2>
          <p className="text-muted-foreground">
            Available in small, medium (default), and large sizes.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {(['sm', 'md', 'lg'] as const).map(s => (
            <div key={s}>
              <p className="mb-2 text-sm font-medium capitalize">{s}</p>
              <div className="group relative cursor-pointer">
                <Card className="overflow-hidden">
                  <div className="relative h-32 bg-gradient-to-br from-yellow-200 to-orange-300 dark:from-yellow-700 dark:to-orange-800">
                    <div className="absolute inset-0 flex items-center justify-center text-4xl">
                      🍜
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm font-medium">Ramen Bowl</p>
                    <p className="text-muted-foreground text-xs">Size: {s}</p>
                  </CardContent>
                </Card>
                <QuickActions actions={basicActions} size={s} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 5: Action Variants */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-2 text-2xl font-bold">Action Variants</h2>
          <p className="text-muted-foreground">
            Actions support default, ghost, and destructive variants.
          </p>
        </div>

        <div className="group relative mx-auto w-full max-w-md cursor-pointer">
          <Card className="overflow-hidden transition-shadow hover:shadow-lg">
            <div className="relative h-48 bg-gradient-to-br from-red-200 to-pink-300 dark:from-red-700 dark:to-pink-800">
              <div className="absolute inset-0 flex items-center justify-center text-5xl">
                🍔
              </div>
            </div>
            <CardContent className="p-6">
              <CardTitle className="mb-2">Classic Burger</CardTitle>
              <CardDescription>
                Juicy beef patty with lettuce, tomato, and special sauce.
              </CardDescription>
              <div className="text-muted-foreground mt-4 flex items-center gap-3 text-xs">
                <span>⏱️ 20 min</span>
                <span>👨‍🍳 Easy</span>
                <span>⭐ 4.7</span>
              </div>
            </CardContent>
          </Card>
          <QuickActions actions={variantActions} />
        </div>
      </section>

      {/* Section 6: Interactive Playground */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-2 text-2xl font-bold">Interactive Playground</h2>
          <p className="text-muted-foreground">
            Try different configurations with the controls below.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>
              Adjust the settings to see how QuickActions behaves
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Max Visible Actions
                </label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={maxVisible}
                  onChange={e => setMaxVisible(Number(e.target.value))}
                  className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Position
                </label>
                <select
                  value={position}
                  onChange={e =>
                    setPosition(
                      e.target.value as
                        | 'top-right'
                        | 'top-left'
                        | 'bottom-right'
                        | 'bottom-left'
                    )
                  }
                  className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                >
                  <option value="top-right">Top Right</option>
                  <option value="top-left">Top Left</option>
                  <option value="bottom-right">Bottom Right</option>
                  <option value="bottom-left">Bottom Left</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Size</label>
                <select
                  value={size}
                  onChange={e => setSize(e.target.value as 'sm' | 'md' | 'lg')}
                  className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                >
                  <option value="sm">Small</option>
                  <option value="md">Medium</option>
                  <option value="lg">Large</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="group relative mx-auto w-full max-w-md cursor-pointer">
          <Card className="overflow-hidden transition-shadow hover:shadow-lg">
            <div className="relative h-48 bg-gradient-to-br from-cyan-200 to-blue-300 dark:from-cyan-700 dark:to-blue-800">
              <div className="absolute inset-0 flex items-center justify-center text-5xl">
                🎨
              </div>
            </div>
            <CardContent className="p-6">
              <CardTitle className="mb-2">Interactive Demo</CardTitle>
              <CardDescription>
                Hover to see quick actions with your selected configuration
              </CardDescription>
              <div className="text-muted-foreground mt-4 flex items-center gap-3 text-xs">
                <span>Position: {position}</span>
                <span>Size: {size}</span>
                <span>Max: {maxVisible}</span>
              </div>
            </CardContent>
          </Card>
          <QuickActions
            actions={manyActions}
            position={position}
            size={size}
            maxVisible={maxVisible}
          />
        </div>
      </section>

      {/* Usage Code Example */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-2 text-2xl font-bold">Usage Code</h2>
          <p className="text-muted-foreground">Basic implementation example.</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-sm">
              <code>{`import { QuickActions } from '@/components/ui/quick-actions';
import { Heart, Share2, Plus } from 'lucide-react';

const actions = [
  {
    id: 'favorite',
    icon: Heart,
    label: 'Favorite',
    onClick: () => handleFavorite(),
  },
  {
    id: 'share',
    icon: Share2,
    label: 'Share',
    onClick: () => handleShare(),
  },
  {
    id: 'add',
    icon: Plus,
    label: 'Add to collection',
    onClick: () => handleAdd(),
  },
];

// Wrap your card with a group class
<div className="group relative">
  <YourCard />
  <QuickActions actions={actions} />
</div>`}</code>
            </pre>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
