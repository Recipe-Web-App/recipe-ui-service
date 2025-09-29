import { Button } from '@/components/ui/button';
import { Users, Plus } from 'lucide-react';

export default function SocialPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground text-3xl font-bold">Community</h1>
        <p className="text-muted-foreground">
          Connect with fellow food enthusiasts
        </p>
      </div>

      <div className="py-12 text-center">
        <Users className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
        <h3 className="mb-2 text-lg font-semibold">Welcome to the community</h3>
        <p className="text-muted-foreground mb-6">
          Follow other cooks and discover amazing recipes.
        </p>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Find People to Follow
        </Button>
      </div>
    </div>
  );
}
