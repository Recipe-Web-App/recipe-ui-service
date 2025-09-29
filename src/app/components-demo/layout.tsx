import React from 'react';
import { Layout } from '@/components/layout/layout';

/**
 * Components Demo Layout
 *
 * Uses the standard layout system with sidebar auto-populated
 * from the components-demo sub-navigation configuration.
 */
export default function ComponentsDemoLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <Layout variant="default" showSidebar={true} showFooter={true}>
      {children}
    </Layout>
  );
}
