'use client';

import { ComingSoonPage } from '@/components/layout/coming-soon-page';
import { Settings, Bell, Shield, Palette, Database, Key } from 'lucide-react';

export default function AccountSettingsPage() {
  return (
    <ComingSoonPage
      title="Account Settings"
      description="Manage your account security, notifications, privacy, and preferences. Control every aspect of your Recipe App experience."
      icon={Settings}
      section="Account"
      backHref="/account/profile"
      backLabel="View Profile"
      features={[
        {
          title: 'Notifications',
          description: 'Email and push settings',
          icon: Bell,
        },
        {
          title: 'Privacy',
          description: 'Control who sees your data',
          icon: Shield,
        },
        {
          title: 'Appearance',
          description: 'Theme and display preferences',
          icon: Palette,
        },
        {
          title: 'Data management',
          description: 'Export or delete your data',
          icon: Database,
        },
        {
          title: 'Security',
          description: 'Password and 2FA settings',
          icon: Key,
        },
      ]}
    />
  );
}
