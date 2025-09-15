'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const components = [
  { name: 'Overview', path: '/components-demo' },
  { name: 'Button', path: '/components-demo/button' },
  { name: 'Input', path: '/components-demo/input' },
  { name: 'Card', path: '/components-demo/card' },
  { name: 'Modal', path: '/components-demo/modal' },
  { name: 'Toast', path: '/components-demo/toast' },
  { name: 'Skeleton', path: '/components-demo/skeleton' },
  { name: 'Badge', path: '/components-demo/badge' },
  { name: 'Dropdown', path: '/components-demo/dropdown' },
  { name: 'Tabs', path: '/components-demo/tabs' },
  { name: 'Select', path: '/components-demo/select' },
  { name: 'Tooltip', path: '/components-demo/tooltip' },
];

export default function ComponentsDemoLayout({
  children,
}: {
  children: React.ReactNode;
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
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
