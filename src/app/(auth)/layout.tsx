import { Layout } from '@/components/layout/layout';
import { GuestOnlyRoute } from '@/components/auth/GuestOnlyRoute';

/**
 * Authentication Layout
 *
 * This layout wrapper applies the minimal layout variant to all pages
 * within the (auth) route group. It provides a clean, focused experience
 * for authentication flows by showing:
 *
 * - TopNav only (minimal variant)
 * - No sidebar navigation
 * - No footer
 * - Centered content area
 * - Guest-only access (authenticated users are redirected)
 *
 * Perfect for:
 * - Login pages
 * - Registration forms
 * - Password reset flows
 * - Account verification
 *
 * All pages within this layout are wrapped with GuestOnlyRoute.
 * Authenticated users will be automatically redirected to the home page.
 */
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout variant="minimal" showSidebar={false} showFooter={false}>
      <GuestOnlyRoute>
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </GuestOnlyRoute>
    </Layout>
  );
}
