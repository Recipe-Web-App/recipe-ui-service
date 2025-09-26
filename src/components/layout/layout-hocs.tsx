import * as React from 'react';
import { Layout } from './layout';
import { LayoutProvider } from './layout-provider';
import type { LayoutVariant, LayoutProviderProps } from './layout-provider';

/**
 * HOC to wrap pages with a specific layout variant
 */
export const withLayout =
  (variant: LayoutVariant = 'default') =>
  <P extends object>(Component: React.ComponentType<P>) => {
    const WrappedComponent = React.forwardRef<unknown, P>((props, ref) => (
      <Layout variant={variant}>
        <Component {...(props as P)} ref={ref} />
      </Layout>
    ));

    WrappedComponent.displayName = `withLayout(${variant})(${
      Component.displayName ?? Component.name ?? 'Component'
    })`;

    return WrappedComponent;
  };

/**
 * Pre-configured HOCs for common layout variants
 */
export const withDefaultLayout = withLayout('default');
export const withFocusedLayout = withLayout('focused');
export const withMinimalLayout = withLayout('minimal');

/**
 * HOC to wrap components with layout provider
 *
 * @param Component - Component to wrap
 * @param options - Layout provider options
 * @returns Wrapped component
 */
export const withLayoutProvider = <P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<LayoutProviderProps, 'children'> = {}
) => {
  const WrappedComponent = React.forwardRef<unknown, P>((props, ref) => (
    <LayoutProvider {...options}>
      <Component {...(props as P)} ref={ref} />
    </LayoutProvider>
  ));

  WrappedComponent.displayName = `withLayoutProvider(${
    Component.displayName ?? Component.name ?? 'Component'
  })`;

  return WrappedComponent;
};
