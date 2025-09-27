'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layout } from '@/components/layout/layout';

const components = [
  { name: 'Accordion', path: '/components-demo/accordion' },
  { name: 'Alert', path: '/components-demo/alert' },
  { name: 'Avatar', path: '/components-demo/avatar' },
  { name: 'Avatar Group', path: '/components-demo/avatar-group' },
  { name: 'Badge', path: '/components-demo/badge' },
  { name: 'Breadcrumb', path: '/components-demo/breadcrumb' },
  { name: 'Button', path: '/components-demo/button' },
  { name: 'Card', path: '/components-demo/card' },
  { name: 'Checkbox', path: '/components-demo/checkbox' },
  { name: 'Chip', path: '/components-demo/chip' },
  { name: 'Collapse', path: '/components-demo/collapse' },
  { name: 'Command Palette', path: '/components-demo/command-palette' },
  { name: 'Content', path: '/components-demo/content' },
  { name: 'Copy Button', path: '/components-demo/copy-button' },
  { name: 'Date Picker', path: '/components-demo/datepicker' },
  { name: 'Dialog', path: '/components-demo/dialog' },
  { name: 'Disclosure', path: '/components-demo/disclosure' },
  { name: 'Divider', path: '/components-demo/divider' },
  { name: 'Drawer', path: '/components-demo/drawer' },
  { name: 'Dropdown', path: '/components-demo/dropdown' },
  { name: 'Empty State', path: '/components-demo/empty-state' },
  { name: 'Error Boundary', path: '/components-demo/error-boundary' },
  { name: 'FAB', path: '/components-demo/fab' },
  { name: 'File Upload', path: '/components-demo/file-upload' },
  { name: 'Icon', path: '/components-demo/icon' },
  { name: 'Image Gallery', path: '/components-demo/image-gallery' },
  { name: 'Infinite Scroll', path: '/components-demo/infinite-scroll' },
  { name: 'Input', path: '/components-demo/input' },
  { name: 'List', path: '/components-demo/list' },
  { name: 'Modal', path: '/components-demo/modal' },
  { name: 'Overview', path: '/components-demo' },
  { name: 'Pagination', path: '/components-demo/pagination' },
  { name: 'Popover', path: '/components-demo/popover' },
  { name: 'Progress', path: '/components-demo/progress' },
  { name: 'Radio Group', path: '/components-demo/radio' },
  { name: 'Rating', path: '/components-demo/rating' },
  { name: 'Search Input', path: '/components-demo/search-input' },
  { name: 'Select', path: '/components-demo/select' },
  { name: 'Sidebar', path: '/components-demo/sidebar' },
  { name: 'Skeleton', path: '/components-demo/skeleton' },
  { name: 'Slider', path: '/components-demo/slider' },
  { name: 'Spinner', path: '/components-demo/spinner' },
  { name: 'Stepper', path: '/components-demo/stepper' },
  { name: 'Switch', path: '/components-demo/switch' },
  { name: 'Table', path: '/components-demo/table' },
  { name: 'Tabs', path: '/components-demo/tabs' },
  { name: 'Text Area', path: '/components-demo/textarea' },
  { name: 'Toast', path: '/components-demo/toast' },
  { name: 'Tooltip', path: '/components-demo/tooltip' },
];

/**
 * Components Demo Navigation Component
 *
 * This component provides the sidebar navigation for component demos
 * and integrates with the main layout system.
 */
function ComponentsNavigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Navigation */}
      <div className="border-b lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <h2 className="text-lg font-semibold">Component Demos</h2>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-muted-foreground hover:text-foreground p-2"
            aria-label="Toggle component menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="bg-background border-t">
            <nav className="max-h-64 overflow-y-auto px-4 py-2">
              {components.map(component => (
                <Link
                  key={component.path}
                  href={component.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === component.path
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {component.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Desktop Sidebar Content */}
      <div className="hidden lg:block">
        <div className="p-6">
          <h2 className="text-foreground mb-6 text-lg font-semibold">
            Component Demos
          </h2>
          <nav className="space-y-1">
            {components.map(component => (
              <Link
                key={component.path}
                href={component.path}
                className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === component.path
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {component.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}

export default function ComponentsDemoLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <Layout
      variant="focused"
      showSidebar={true}
      showFooter={false}
      contentProps={{
        viewMode: 'grid',
        contentWidth: 'full',
        padding: false,
      }}
    >
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Custom Sidebar for Components */}
        <aside className="bg-background w-64 flex-shrink-0 border-r">
          <ComponentsNavigation />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <ComponentsNavigation />
          <div className="p-6">{children}</div>
        </main>
      </div>
    </Layout>
  );
}
