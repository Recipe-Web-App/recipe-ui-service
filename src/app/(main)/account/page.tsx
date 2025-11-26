import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export function generateMetadata(): Metadata {
  return {
    title: 'Account | Recipe App',
    description: 'Manage your account and profile.',
  };
}

export default function AccountIndexPage() {
  redirect('/account/profile');
}
