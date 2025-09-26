'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';

export interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
  'aria-label'?: string;
}

/**
 * FooterLink Component
 *
 * A styled link component for use in the footer.
 * Supports both internal and external links with appropriate styling and accessibility.
 *
 * @param href - The URL the link points to
 * @param children - The link text/content
 * @param external - Whether this is an external link (opens in new tab)
 * @param className - Additional CSS classes
 * @param aria-label - Accessible label for screen readers
 */
export const FooterLink = React.forwardRef<HTMLAnchorElement, FooterLinkProps>(
  (
    { href, children, external = false, className, 'aria-label': ariaLabel },
    ref
  ) => {
    const isExternal = external || href.startsWith('http');

    const linkClasses = cn(
      'text-sm text-muted-foreground transition-colors',
      'hover:text-foreground focus:text-foreground',
      'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background',
      'rounded-sm inline-flex items-center gap-1',
      className
    );

    const linkProps = {
      ref,
      className: linkClasses,
      'aria-label': ariaLabel,
    };

    const linkContent = (
      <>
        {children}
        {isExternal && (
          <ExternalLink className="h-3 w-3 opacity-50" aria-hidden="true" />
        )}
      </>
    );

    if (isExternal) {
      return (
        <a {...linkProps} href={href} target="_blank" rel="noopener noreferrer">
          {linkContent}
        </a>
      );
    }

    return (
      <Link {...linkProps} href={href}>
        {linkContent}
      </Link>
    );
  }
);

FooterLink.displayName = 'FooterLink';
