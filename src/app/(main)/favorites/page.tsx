import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground text-3xl font-bold">Favorites</h1>
        <p className="text-muted-foreground">
          Your favorite recipes in one place
        </p>
      </div>

      <div className="py-12 text-center">
        <Heart className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
        <h3 className="mb-2 text-lg font-semibold">No favorites yet</h3>
        <p className="text-muted-foreground mb-6">
          Start adding recipes to your favorites to see them here.
        </p>
        <Button asChild>
          <a href="/recipes">Browse Recipes</a>
        </Button>
      </div>
    </div>
  );
}
