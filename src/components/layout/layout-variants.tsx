import * as React from 'react';
import { Layout } from './layout';
import type { LayoutProps } from './layout';

/**
 * Pre-configured layout variants for common use cases
 */
export const DefaultLayout: React.FC<Omit<LayoutProps, 'variant'>> = props => (
  <Layout variant="default" {...props} />
);

export const FocusedLayout: React.FC<Omit<LayoutProps, 'variant'>> = props => (
  <Layout variant="focused" {...props} />
);

export const MinimalLayout: React.FC<Omit<LayoutProps, 'variant'>> = props => (
  <Layout variant="minimal" {...props} />
);
