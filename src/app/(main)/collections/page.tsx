import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export function generateMetadata(): Metadata {
  return {
    title: 'Collections | Recipe App',
    description: 'Browse and manage your recipe collections.',
  };
}

export default function CollectionsIndexPage() {
  redirect('/collections/my-collections');
}
