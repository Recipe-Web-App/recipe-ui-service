'use client';

import React from 'react';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

const components = [
  {
    name: 'Button',
    path: '/components-demo/button',
    description: 'Flexible, accessible button component',
    variants: 6,
    status: 'ready',
  },
  {
    name: 'Input',
    path: '/components-demo/input',
    description: 'Comprehensive input with validation and features',
    variants: 3,
    status: 'ready',
  },
  {
    name: 'Card',
    path: '/components-demo/card',
    description: 'Container component with multiple variants',
    variants: 5,
    status: 'ready',
  },
  {
    name: 'Modal',
    path: '/components-demo/modal',
    description: 'Accessible modal dialogs and overlays',
    variants: 4,
    status: 'ready',
  },
  {
    name: 'Toast',
    path: '/components-demo/toast',
    description: 'Notification system with auto-dismiss',
    variants: 5,
    status: 'ready',
  },
  {
    name: 'Skeleton',
    path: '/components-demo/skeleton',
    description: 'Loading state placeholders',
    variants: 6,
    status: 'ready',
  },
  {
    name: 'Badge',
    path: '/components-demo/badge',
    description: 'Tags, categories, and status indicators',
    variants: 7,
    status: 'ready',
  },
  {
    name: 'Dropdown',
    path: '/components-demo/dropdown',
    description: 'Menus, select options, and action lists',
    variants: 8,
    status: 'ready',
  },
  {
    name: 'Tabs',
    path: '/components-demo/tabs',
    description: 'Organized content in tabbed interface',
    variants: 9,
    status: 'ready',
  },
  {
    name: 'Select',
    path: '/components-demo/select',
    description: 'Category selection, filters, and form controls',
    variants: 4,
    status: 'ready',
  },
  {
    name: 'Tooltip',
    path: '/components-demo/tooltip',
    description: 'Contextual help for cooking terms and UI elements',
    variants: 6,
    status: 'ready',
  },
  {
    name: 'Dialog',
    path: '/components-demo/dialog',
    description: 'Confirmations, alerts, and recipe-specific actions',
    variants: 8,
    status: 'ready',
  },
  {
    name: 'Alert',
    path: '/components-demo/alert',
    description: 'Notifications, status messages, and user feedback',
    variants: 10,
    status: 'ready',
  },
  {
    name: 'Switch',
    path: '/components-demo/switch',
    description: 'Toggle switches for settings and preferences',
    variants: 11,
    status: 'ready',
  },
  {
    name: 'Checkbox',
    path: '/components-demo/checkbox',
    description: 'Multi-select filters and form controls',
    variants: 12,
    status: 'ready',
  },
  {
    name: 'Radio',
    path: '/components-demo/radio',
    description: 'Exclusive selection for preferences and options',
    variants: 10,
    status: 'ready',
  },
  {
    name: 'Avatar',
    path: '/components-demo/avatar',
    description: 'User profile images and chef avatars',
    variants: 8,
    status: 'ready',
  },
  {
    name: 'Progress',
    path: '/components-demo/progress',
    description: 'Progress bars for cooking and upload states',
    variants: 8,
    status: 'ready',
  },
  {
    name: 'Accordion',
    path: '/components-demo/accordion',
    description: 'Collapsible content for recipes and FAQs',
    variants: 5,
    status: 'ready',
  },
  {
    name: 'Textarea',
    path: '/components-demo/textarea',
    description: 'Multi-line text input for recipes and reviews',
    variants: 5,
    status: 'ready',
  },
  {
    name: 'Popover',
    path: '/components-demo/popover',
    description: 'Floating content container for actions and information',
    variants: 7,
    status: 'ready',
  },
  {
    name: 'Table',
    path: '/components-demo/table',
    description: 'Data tables with recipe-specific variants',
    variants: 12,
    status: 'ready',
  },
  {
    name: 'Slider',
    path: '/components-demo/slider',
    description: 'Range and value sliders for interactive input',
    variants: 15,
    status: 'ready',
  },
  {
    name: 'DatePicker',
    path: '/components-demo/datepicker',
    description: 'Date and time selection with recipe-specific variants',
    variants: 7,
    status: 'ready',
  },
];

const upcomingComponents = [
  { name: 'Pagination', description: 'Page navigation controls' },
];

export default function ComponentsDemoOverview() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-foreground mb-2 text-4xl font-bold">
          Component Library
        </h1>
        <p className="text-muted-foreground text-lg">
          Recipe UI Service Design System Components
        </p>
      </header>

      {/* Stats */}
      <div className="mb-12 grid gap-4 md:grid-cols-4">
        <Card size="sm">
          <CardContent>
            <div className="text-primary text-3xl font-bold">24</div>
            <div className="text-muted-foreground text-sm">
              Ready Components
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent>
            <div className="text-primary text-3xl font-bold">166</div>
            <div className="text-muted-foreground text-sm">Total Variants</div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent>
            <div className="text-primary text-3xl font-bold">1</div>
            <div className="text-muted-foreground text-sm">Coming Soon</div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent>
            <div className="text-primary text-3xl font-bold">100%</div>
            <div className="text-muted-foreground text-sm">TypeScript</div>
          </CardContent>
        </Card>
      </div>

      {/* Available Components */}
      <section className="mb-12">
        <h2 className="text-foreground mb-6 text-2xl font-semibold">
          Available Components
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {components.map(component => (
            <Link key={component.path} href={component.path}>
              <Card
                variant="interactive"
                className="h-full transition-transform hover:scale-[1.02]"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{component.name}</CardTitle>
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Ready
                    </span>
                  </div>
                  <CardDescription className="mt-2">
                    {component.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground flex items-center gap-4 text-sm">
                    <span>{component.variants} variants</span>
                    <span>•</span>
                    <span>View demo →</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Coming Soon */}
      <section>
        <h2 className="text-foreground mb-6 text-2xl font-semibold">
          Coming Soon
        </h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {upcomingComponents.map(component => (
            <Card key={component.name} variant="outlined" size="sm">
              <CardContent>
                <h3 className="text-foreground mb-1 font-medium">
                  {component.name}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {component.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
