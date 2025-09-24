'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

export default function ComponentsDemoLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-background min-h-screen">
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <div className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/60">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-lg font-semibold">Component Demos</h1>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              aria-label="Toggle menu"
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
            <div className="border-t bg-white dark:bg-gray-900">
              <nav className="px-4 py-2">
                {components.map(component => (
                  <Link
                    key={component.path}
                    href={component.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      pathname === component.path
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100'
                    }`}
                  >
                    {component.name}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:w-64 lg:flex-shrink-0">
          <div className="sticky top-0 h-screen overflow-y-auto border-r bg-white dark:bg-gray-900">
            <div className="p-6">
              <h1 className="text-foreground mb-6 text-xl font-bold">
                Component Demos
              </h1>
              <nav className="space-y-1">
                {components.map(component => (
                  <Link
                    key={component.path}
                    href={component.path}
                    className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      pathname === component.path
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100'
                    }`}
                  >
                    {component.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-h-0 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
