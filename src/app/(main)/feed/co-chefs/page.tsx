'use client';

import { ComingSoonPage } from '@/components/layout/coming-soon-page';
import {
  Users,
  Heart,
  MessageSquare,
  Share2,
  Bell,
  BookOpen,
} from 'lucide-react';

export default function CoChefActivityPage() {
  return (
    <ComingSoonPage
      title="Co-Chef Recent Activity"
      description="Stay connected with your culinary community. See what chefs you follow are cooking, creating, and sharing."
      icon={Users}
      section="Kitchen Feed"
      backHref="/home"
      backLabel="Go Home"
      features={[
        {
          title: 'Activity stream',
          description: 'Real-time updates from co-chefs',
          icon: Bell,
        },
        {
          title: 'New recipes',
          description: 'See when co-chefs publish',
          icon: BookOpen,
        },
        {
          title: 'Like activity',
          description: 'Heart posts you enjoy',
          icon: Heart,
        },
        {
          title: 'Comment',
          description: 'Engage with your community',
          icon: MessageSquare,
        },
        {
          title: 'Share posts',
          description: 'Spread great content',
          icon: Share2,
        },
      ]}
    />
  );
}
