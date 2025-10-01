import { Layout } from '@/components/layout/layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

/**
 * Main Layout for the Recipe Application
 *
 * This layout wrapper applies the default layout variant to all pages
 * within the (main) route group. It provides:
 *
 * - TopNav with global navigation
 * - Sidebar with contextual sub-navigation
 * - ContentPane for page content
 * - Footer with standard links and info
 * - Route protection (requires authentication)
 *
 * The layout automatically adapts to:
 * - Desktop: Full layout with expanded sidebar
 * - Tablet: Collapsible sidebar
 * - Mobile: TopNav + Mobile drawer + ContentPane + Footer
 *
 * All pages within this layout require authentication.
 * Unauthenticated users will be redirected to the login page.
 */
export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout variant="default" showSidebar showFooter>
      <ProtectedRoute>{children}</ProtectedRoute>
    </Layout>
  );
}
