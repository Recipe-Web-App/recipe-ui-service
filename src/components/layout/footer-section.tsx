'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface FooterSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * FooterSection Component
 *
 * A container component for grouping related footer links.
 * Provides a title and consistent spacing for footer content sections.
 *
 * @param title - Optional section heading
 * @param children - Section content (typically FooterLink components)
 * @param className - Additional CSS classes
 */
export const FooterSection = React.forwardRef<
  HTMLDivElement,
  FooterSectionProps
>(({ title, children, className }, ref) => {
  return (
    <div ref={ref} className={cn('space-y-3', className)}>
      {title && (
        <h3 className="text-sm font-semibold tracking-wider uppercase">
          {title}
        </h3>
      )}
      <nav
        className="flex flex-col space-y-2"
        aria-label={title ? `${title} links` : 'Footer links'}
      >
        {children}
      </nav>
    </div>
  );
});

FooterSection.displayName = 'FooterSection';
