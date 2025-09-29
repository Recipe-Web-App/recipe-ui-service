import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus } from 'lucide-react';

export default function ShoppingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground text-3xl font-bold">Shopping Lists</h1>
        <p className="text-muted-foreground">Manage your grocery shopping</p>
      </div>

      <div className="py-12 text-center">
        <ShoppingCart className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
        <h3 className="mb-2 text-lg font-semibold">No shopping lists</h3>
        <p className="text-muted-foreground mb-6">
          Create your first shopping list to get started.
        </p>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Shopping List
        </Button>
      </div>
    </div>
  );
}
