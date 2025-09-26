'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Github, Twitter, Youtube, Linkedin, Facebook } from 'lucide-react';

export interface SocialLink {
  platform: 'github' | 'twitter' | 'youtube' | 'linkedin' | 'facebook';
  href: string;
  label?: string;
}

export interface SocialLinksProps {
  links?: SocialLink[];
  className?: string;
  iconSize?: 'sm' | 'md' | 'lg';
}

const defaultLinks: SocialLink[] = [
  { platform: 'github', href: 'https://github.com', label: 'GitHub' },
  { platform: 'twitter', href: 'https://twitter.com', label: 'Twitter' },
];

const iconMap = {
  github: Github,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
  facebook: Facebook,
} as const;

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
} as const;

/**
 * SocialLinks Component
 *
 * Displays a row of social media icon links.
 * Includes accessibility labels and hover effects.
 *
 * @param links - Array of social media links to display
 * @param className - Additional CSS classes
 * @param iconSize - Size of the icons (sm, md, lg)
 */
export const SocialLinks = React.forwardRef<HTMLDivElement, SocialLinksProps>(
  ({ links = defaultLinks, className, iconSize = 'sm' }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-4', className)}
        role="navigation"
        aria-label="Social media links"
      >
        {links.map(link => {
          // Safe platform check to prevent object injection
          const Icon = iconMap[link.platform as keyof typeof iconMap];
          if (!Icon) {
            return null;
          }
          const label = link.label ?? link.platform;

          return (
            <a
              key={link.platform}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'text-muted-foreground transition-colors',
                'hover:text-foreground focus:text-foreground',
                'focus:ring-ring focus:ring-offset-background focus:ring-2 focus:ring-offset-2 focus:outline-none',
                'rounded-sm'
              )}
              aria-label={`Visit us on ${label}`}
              title={label}
            >
              <Icon
                className={cn(
                  iconSize === 'sm'
                    ? sizeClasses.sm
                    : iconSize === 'md'
                      ? sizeClasses.md
                      : sizeClasses.lg,
                  'transition-transform hover:scale-110'
                )}
                aria-hidden="true"
              />
            </a>
          );
        })}
      </div>
    );
  }
);

SocialLinks.displayName = 'SocialLinks';
