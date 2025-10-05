import { Suspense } from 'react';
import { Layout } from '@/components/layout/layout';
import { GuestOnlyRoute } from '@/components/auth/GuestOnlyRoute';
import { Spinner } from '@/components/ui/spinner';

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
 *
 * Note: GuestOnlyRoute is wrapped in Suspense because it uses useSearchParams()
 * which requires a Suspense boundary during server-side rendering in Next.js 15.
 */
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout variant="minimal" showSidebar={false} showFooter={false}>
      <Suspense
        fallback={
          <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
            <Spinner size="lg" />
          </div>
        }
      >
        <GuestOnlyRoute>
          <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">{children}</div>
          </div>
        </GuestOnlyRoute>
      </Suspense>
    </Layout>
  );
}
