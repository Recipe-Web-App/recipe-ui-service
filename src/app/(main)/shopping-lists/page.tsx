'use client';

import { ComingSoonPage } from '@/components/layout/coming-soon-page';
import {
  ShoppingCart,
  CheckSquare,
  Edit,
  Share2,
  Printer,
  Archive,
} from 'lucide-react';

export default function ShoppingListsPage() {
  return (
    <ComingSoonPage
      title="My Shopping Lists"
      description="Manage all your shopping lists. Track what you need to buy, check off items as you shop, and keep a history of past lists."
      icon={ShoppingCart}
      section="Shopping Lists"
      backHref="/home"
      backLabel="Go Home"
      features={[
        {
          title: 'Active lists',
          description: 'Lists in progress',
          icon: CheckSquare,
        },
        {
          title: 'Progress tracking',
          description: 'See items purchased',
          icon: CheckSquare,
        },
        {
          title: 'Quick edit',
          description: 'Add or remove items',
          icon: Edit,
        },
        {
          title: 'Share lists',
          description: 'Send to shopping partners',
          icon: Share2,
        },
        {
          title: 'Print lists',
          description: 'Export to PDF',
          icon: Printer,
        },
        {
          title: 'Archive completed',
          description: 'Keep history organized',
          icon: Archive,
        },
      ]}
    />
  );
}
