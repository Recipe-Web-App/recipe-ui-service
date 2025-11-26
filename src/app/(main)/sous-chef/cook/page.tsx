'use client';

import { ComingSoonPage } from '@/components/layout/coming-soon-page';
import {
  PlayCircle,
  ChevronRight,
  Timer,
  Mic,
  CheckSquare,
  Maximize,
} from 'lucide-react';

export default function InteractiveCookingPage() {
  return (
    <ComingSoonPage
      title="Interactive Cooking Mode"
      description="Hands-free, step-by-step cooking guidance. Navigate through recipes with voice commands while your screen stays clean and readable."
      icon={PlayCircle}
      section="Sous Chef"
      backHref="/sous-chef"
      backLabel="Sous Chef"
      features={[
        {
          title: 'Step-by-step view',
          description: 'Large, readable instructions',
          icon: ChevronRight,
        },
        {
          title: 'Built-in timers',
          description: 'Automatic timing for each step',
          icon: Timer,
        },
        {
          title: 'Voice control',
          description: 'Navigate hands-free',
          icon: Mic,
        },
        {
          title: 'Ingredient checklist',
          description: 'Track as you cook',
          icon: CheckSquare,
        },
        {
          title: 'Full-screen mode',
          description: 'Minimal distraction cooking',
          icon: Maximize,
        },
      ]}
    />
  );
}
