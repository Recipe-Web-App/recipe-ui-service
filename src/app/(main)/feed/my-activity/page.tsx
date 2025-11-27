'use client';

import { ComingSoonPage } from '@/components/layout/coming-soon-page';
import {
  Activity,
  Heart,
  MessageSquare,
  UserPlus,
  BarChart3,
  Clock,
} from 'lucide-react';

export default function MyActivityPage() {
  return (
    <ComingSoonPage
      title="My Recent Activity"
      description="Track your culinary journey. See your recent recipes, engagement received, and interactions with the community."
      icon={Activity}
      section="Kitchen Feed"
      backHref="/feed"
      backLabel="Kitchen Feed"
      features={[
        {
          title: 'Activity timeline',
          description: 'Your recent actions',
          icon: Clock,
        },
        {
          title: 'Engagement stats',
          description: 'Likes and favorites received',
          icon: Heart,
        },
        {
          title: 'Comments',
          description: 'Discussions on your recipes',
          icon: MessageSquare,
        },
        {
          title: 'New followers',
          description: 'Who started following you',
          icon: UserPlus,
        },
        {
          title: 'Activity summary',
          description: 'Stats and insights',
          icon: BarChart3,
        },
      ]}
    />
  );
}
