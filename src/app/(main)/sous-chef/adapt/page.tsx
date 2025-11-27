'use client';

import { ComingSoonPage } from '@/components/layout/coming-soon-page';
import { Wand2, Scale, RefreshCw, Leaf, Sparkles, Save } from 'lucide-react';

export default function SmartAdaptationPage() {
  return (
    <ComingSoonPage
      title="Smart Adaptation"
      description="Intelligently adapt recipes for different servings, dietary needs, or ingredient substitutions. Our AI suggests smart alternatives that maintain flavor."
      icon={Wand2}
      section="Sous Chef"
      backHref="/sous-chef"
      backLabel="Sous Chef"
      features={[
        {
          title: 'Serving scaling',
          description: 'Adjust quantities automatically',
          icon: Scale,
        },
        {
          title: 'Smart substitutions',
          description: 'AI-powered alternatives',
          icon: RefreshCw,
        },
        {
          title: 'Dietary modifications',
          description: 'Make recipes vegan, gluten-free, etc.',
          icon: Leaf,
        },
        {
          title: 'Flavor preservation',
          description: 'Maintain taste with swaps',
          icon: Sparkles,
        },
        {
          title: 'Save adaptations',
          description: 'Keep customized versions',
          icon: Save,
        },
      ]}
    />
  );
}
