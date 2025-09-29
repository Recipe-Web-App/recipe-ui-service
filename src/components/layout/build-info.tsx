'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Code2, GitBranch, Package } from 'lucide-react';

// Import package.json at build time
const packageInfo = {
  version: process.env.NEXT_PUBLIC_APP_VERSION ?? '0.1.0',
};

export interface BuildInfoProps {
  className?: string;
  showVersion?: boolean;
  showEnvironment?: boolean;
  showBranch?: boolean;
  compact?: boolean;
}

/**
 * BuildInfo Component
 *
 * Displays build and version information for the application.
 * Shows version number, environment, and optional git branch.
 *
 * @param className - Additional CSS classes
 * @param showVersion - Whether to show version number (default: true)
 * @param showEnvironment - Whether to show environment (default: true)
 * @param showBranch - Whether to show git branch (default: false)
 * @param compact - Whether to use compact layout (default: false)
 */
export const BuildInfo = React.forwardRef<HTMLDivElement, BuildInfoProps>(
  (
    {
      className,
      showVersion = true,
      showEnvironment = true,
      showBranch = false,
      compact = false,
    },
    ref
  ) => {
    const environment = process.env.NODE_ENV;
    const branch = process.env.NEXT_PUBLIC_GIT_BRANCH;

    const items: Array<{
      show: boolean;
      icon: React.ElementType;
      label: string;
      value: string;
    }> = [
      {
        show: showVersion,
        icon: Package,
        label: 'Version',
        value: `v${packageInfo.version}`,
      },
      {
        show: showEnvironment,
        icon: Code2,
        label: 'Environment',
        value: environment === 'production' ? 'prod' : (environment ?? 'dev'),
      },
      {
        show: showBranch && Boolean(branch),
        icon: GitBranch,
        label: 'Branch',
        value: branch ?? 'main',
      },
    ];

    const visibleItems = items.filter(item => item.show);

    if (visibleItems.length === 0) {
      return null;
    }

    if (compact) {
      return (
        <div
          ref={ref}
          className={cn(
            'text-muted-foreground flex items-center gap-2 text-xs',
            className
          )}
        >
          {visibleItems.map((item, index) => (
            <React.Fragment key={item.label}>
              {index > 0 && <span aria-hidden="true">·</span>}
              <span>{item.value}</span>
            </React.Fragment>
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          'text-muted-foreground flex items-center gap-4 text-xs',
          className
        )}
        aria-label="Build information"
      >
        {visibleItems.map(item => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-center gap-1"
              title={`${item.label}: ${item.value}`}
            >
              <Icon className="h-3 w-3 opacity-50" aria-hidden="true" />
              <span className="sr-only">{item.label}:</span>
              <span>{item.value}</span>
            </div>
          );
        })}
      </div>
    );
  }
);

BuildInfo.displayName = 'BuildInfo';
