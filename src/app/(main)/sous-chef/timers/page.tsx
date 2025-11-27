'use client';

import { ComingSoonPage } from '@/components/layout/coming-soon-page';
import { Timer, Plus, Bell, Play, Pause, Clock } from 'lucide-react';

export default function CookingTimersPage() {
  return (
    <ComingSoonPage
      title="Cooking Timers"
      description="Manage multiple cooking timers simultaneously. Perfect for complex recipes with parallel cooking tasks. Get alerts even when the tab is not active."
      icon={Timer}
      section="Sous Chef"
      backHref="/home"
      backLabel="Go Home"
      features={[
        {
          title: 'Multiple timers',
          description: 'Run as many as you need',
          icon: Plus,
        },
        {
          title: 'Audio alerts',
          description: 'Customizable alarm sounds',
          icon: Bell,
        },
        {
          title: 'Play & pause',
          description: 'Full timer control',
          icon: Play,
        },
        {
          title: 'Quick presets',
          description: 'Common cooking times',
          icon: Clock,
        },
        {
          title: 'Background alerts',
          description: 'Notifications when tab inactive',
          icon: Pause,
        },
      ]}
    />
  );
}
