'use client';

import { ComingSoonPage } from '@/components/layout/coming-soon-page';
import {
  User,
  BookOpen,
  FolderHeart,
  Users,
  BarChart3,
  Share2,
} from 'lucide-react';

export default function ViewProfilePage() {
  return (
    <ComingSoonPage
      title="View Profile"
      description="See how your profile appears to others. View your published recipes, collections, followers, and cooking stats all in one place."
      icon={User}
      section="Account"
      backHref="/home"
      backLabel="Go Home"
      features={[
        {
          title: 'Public recipes',
          description: 'Your published recipes',
          icon: BookOpen,
        },
        {
          title: 'Collections',
          description: 'Your curated collections',
          icon: FolderHeart,
        },
        {
          title: 'Followers & following',
          description: 'Your culinary community',
          icon: Users,
        },
        {
          title: 'Activity stats',
          description: 'Your cooking journey',
          icon: BarChart3,
        },
        {
          title: 'Share profile',
          description: 'Share your profile link',
          icon: Share2,
        },
      ]}
    />
  );
}
