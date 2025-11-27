/**
 * 403 Forbidden Page
 *
 * Displays when a user attempts to access a resource they don't have
 * permission for (e.g., non-admin trying to access admin routes).
 */

import { ErrorPage } from '@/components/error/ErrorPage';
import { PageErrorType } from '@/types/error/page-errors';
import type { Metadata } from 'next';

export function generateMetadata(): Metadata {
  return {
    title: '403 - Access Denied',
    description: 'You do not have permission to access this resource',
  };
}

export default function ForbiddenPage() {
  return (
    <ErrorPage
      errorType={PageErrorType.FORBIDDEN}
      title="Access Denied"
      description="You do not have the required permissions to access this page. This area is restricted to users with specific roles or privileges. Required role: ADMIN"
      homeUrl="/"
    />
  );
}
