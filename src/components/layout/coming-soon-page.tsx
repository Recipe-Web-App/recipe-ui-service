'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions,
} from '@/components/ui/empty-state';

export interface ComingSoonFeature {
  /** Feature title */
  title: string;
  /** Feature description */
  description: string;
  /** Optional icon for the feature */
  icon?: LucideIcon;
}

export interface ComingSoonPageProps {
  /** Page title displayed as heading */
  title: string;
  /** Description of what the page will contain */
  description?: string;
  /** Optional icon to display */
  icon?: LucideIcon;
  /** List of expected features to preview */
  features?: ComingSoonFeature[];
  /** Custom back button href (defaults to browser back) */
  backHref?: string;
  /** Custom back button label */
  backLabel?: string;
  /** Whether to show the back button */
  showBackButton?: boolean;
  /** Additional action buttons */
  actions?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Section name for breadcrumb context */
  section?: string;
}

/**
 * ComingSoonPage Component
 *
 * A reusable placeholder page component for features that are not yet implemented.
 * Displays a friendly "Coming Soon" message with optional feature previews.
 *
 * @example
 * ```tsx
 * <ComingSoonPage
 *   title="Create Recipe"
 *   description="Build your culinary masterpieces with our recipe creator."
 *   icon={ChefHat}
 *   section="Recipes"
 *   features={[
 *     { title: 'Multi-step wizard', description: 'Guided recipe creation process' },
 *     { title: 'Image upload', description: 'Add photos to your recipes' },
 *   ]}
 * />
 * ```
 */
export function ComingSoonPage({
  title,
  description,
  icon: Icon = Clock,
  features,
  backHref,
  backLabel = 'Go Back',
  showBackButton = true,
  actions,
  className,
  section,
}: ComingSoonPageProps) {
  const router = useRouter();

  const handleBack = React.useCallback(() => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  }, [backHref, router]);

  return (
    <div className={cn('space-y-8', className)}>
      {/* Main Coming Soon Section */}
      <EmptyState variant="illustrated" size="lg" className="py-12">
        <EmptyStateIcon>
          <div className="bg-primary/10 flex h-20 w-20 items-center justify-center rounded-full">
            <Icon className="text-primary h-10 w-10" aria-hidden="true" />
          </div>
        </EmptyStateIcon>

        <div className="space-y-2">
          {section && (
            <Badge variant="secondary" className="mb-2">
              {section}
            </Badge>
          )}
          <EmptyStateTitle className="text-3xl">{title}</EmptyStateTitle>
        </div>

        <EmptyStateDescription className="max-w-md text-base">
          {description ??
            'This feature is currently under development. Check back soon!'}
        </EmptyStateDescription>

        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4" aria-hidden="true" />
          <span>Coming Soon</span>
        </div>

        <EmptyStateActions layout="horizontal">
          {showBackButton && (
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              {backLabel}
            </Button>
          )}
          {backHref && (
            <Button asChild>
              <Link href="/home">Go to Home</Link>
            </Button>
          )}
          {actions}
        </EmptyStateActions>
      </EmptyState>

      {/* Features Preview Section */}
      {features && features.length > 0 && (
        <section className="mx-auto max-w-2xl">
          <h2 className="mb-6 text-center text-xl font-semibold">
            What to Expect
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <Card key={index} className="p-4">
                  <div className="flex items-start gap-3">
                    {FeatureIcon && (
                      <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-md">
                        <FeatureIcon
                          className="text-muted-foreground h-4 w-4"
                          aria-hidden="true"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

ComingSoonPage.displayName = 'ComingSoonPage';

export default ComingSoonPage;
