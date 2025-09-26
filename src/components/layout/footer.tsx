'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useLayoutStore } from '@/stores/ui/layout-store';
import { Divider } from '@/components/ui/divider';
import { FooterSection } from './footer-section';
import { FooterLink } from './footer-link';
import { BuildInfo } from './build-info';
import { SocialLinks } from './social-links';

export interface FooterProps {
  className?: string;
  showBuildInfo?: boolean;
  showSocialLinks?: boolean;
}

/**
 * Footer Component
 *
 * Main footer component that provides navigation links, company information,
 * build details, and social media links. Responsive across all device sizes.
 *
 * @param className - Additional CSS classes
 * @param showBuildInfo - Whether to show build/version info (default: true)
 * @param showSocialLinks - Whether to show social media links (default: true)
 */
export const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({ className, showBuildInfo = true, showSocialLinks = true }, ref) => {
    const { breakpoint } = useLayoutStore();
    const isMobile = breakpoint === 'mobile';
    const isTablet = breakpoint === 'tablet';

    return (
      <footer
        ref={ref}
        className={cn(
          'bg-background border-t',
          'mt-auto', // Push footer to bottom
          className
        )}
        role="contentinfo"
      >
        <div className="container px-4 py-8 md:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div
            className={cn(
              'grid gap-8',
              isMobile ? 'grid-cols-1' : '',
              isTablet ? 'grid-cols-2' : '',
              !isMobile && !isTablet ? 'lg:grid-cols-4' : ''
            )}
          >
            {/* Product Section */}
            <FooterSection title="Product">
              <FooterLink href="/about">About</FooterLink>
              <FooterLink href="/features">Features</FooterLink>
              <FooterLink href="/pricing">Pricing</FooterLink>
              <FooterLink href="/changelog">Changelog</FooterLink>
            </FooterSection>

            {/* Resources Section */}
            <FooterSection title="Resources">
              <FooterLink href="/docs">Documentation</FooterLink>
              <FooterLink href="/blog">Blog</FooterLink>
              <FooterLink href="/support">Support</FooterLink>
              <FooterLink href="/api">API Reference</FooterLink>
            </FooterSection>

            {/* Community Section */}
            <FooterSection title="Community">
              <FooterLink href="/forum">Forum</FooterLink>
              <FooterLink href="https://discord.gg/example" external>
                Discord
              </FooterLink>
              <FooterLink href="/contribute">Contribute</FooterLink>
              <FooterLink href="/events">Events</FooterLink>
            </FooterSection>

            {/* Legal Section */}
            <FooterSection title="Legal">
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/terms">Terms of Service</FooterLink>
              <FooterLink href="/cookies">Cookie Policy</FooterLink>
              <FooterLink href="/license">License</FooterLink>
            </FooterSection>
          </div>

          {/* Divider */}
          <Divider className="my-8" />

          {/* Bottom Section */}
          <div
            className={cn(
              'flex items-center',
              isMobile ? 'flex-col space-y-4' : 'flex-row justify-between'
            )}
          >
            {/* Copyright */}
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Recipe App. All rights reserved.
            </p>

            {/* Right Section: Build Info and Social Links */}
            <div
              className={cn(
                'flex items-center',
                isMobile ? 'flex-col space-y-4' : 'space-x-6'
              )}
            >
              {showBuildInfo && <BuildInfo />}
              {showSocialLinks && (
                <SocialLinks
                  links={[
                    {
                      platform: 'github',
                      href: 'https://github.com/recipeapp',
                    },
                    {
                      platform: 'twitter',
                      href: 'https://twitter.com/recipeapp',
                    },
                    {
                      platform: 'linkedin',
                      href: 'https://linkedin.com/company/recipeapp',
                    },
                  ]}
                />
              )}
            </div>
          </div>
        </div>
      </footer>
    );
  }
);

Footer.displayName = 'Footer';
