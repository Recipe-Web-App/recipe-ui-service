import { redirect } from 'next/navigation';

/**
 * Root Page - Redirect to Home
 *
 * This page exists solely to redirect users from the root URL (/)
 * to the authenticated home page (/home).
 *
 * Flow:
 * - Unauthenticated users: / → /home → middleware redirects to /login?returnUrl=/home
 * - Authenticated users: / → /home → renders protected homepage
 *
 * This approach ensures:
 * - Clean separation between redirect logic and actual content
 * - Middleware handles authentication checks consistently
 * - No race conditions between server and client-side auth checks
 */
export default function RootPage() {
  redirect('/home');
}
