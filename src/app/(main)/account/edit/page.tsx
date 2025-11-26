'use client';

import { ComingSoonPage } from '@/components/layout/coming-soon-page';
import { UserCog, Camera, AtSign, Globe, Utensils, Shield } from 'lucide-react';

export default function EditProfilePage() {
  return (
    <ComingSoonPage
      title="Edit Profile"
      description="Update your profile information, avatar, and preferences. Customize how you appear to other users in the community."
      icon={UserCog}
      section="Account"
      backHref="/account/profile"
      backLabel="View Profile"
      features={[
        {
          title: 'Profile photo',
          description: 'Upload and crop your avatar',
          icon: Camera,
        },
        {
          title: 'Username',
          description: 'Set your unique @handle',
          icon: AtSign,
        },
        {
          title: 'Social links',
          description: 'Connect your other profiles',
          icon: Globe,
        },
        {
          title: 'Dietary preferences',
          description: 'Set your food preferences',
          icon: Utensils,
        },
        {
          title: 'Privacy settings',
          description: 'Control profile visibility',
          icon: Shield,
        },
      ]}
    />
  );
}
