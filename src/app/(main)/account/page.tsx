import type { Metadata } from 'next';
import { SectionHubPage } from '@/components/layout/section-hub-page';

export function generateMetadata(): Metadata {
  return {
    title: 'Account | Recipe App',
    description: 'Manage your account and profile.',
  };
}

/**
 * Account Hub Page
 *
 * Landing page for the Account section. Displays a card grid
 * of sub-page navigation options for account management.
 */
export default function AccountPage() {
  return (
    <SectionHubPage
      sectionId="account"
      title="Account"
      description="Manage your account and profile"
    />
  );
}
