'use client';

import { CreateRecipeWizard } from '@/components/recipe/create';

export default function CreateRecipePage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create Recipe</h1>
        <p className="text-muted-foreground mt-2">
          Share your culinary creations with the world. Fill in the details
          below to create your recipe.
        </p>
      </div>
      <CreateRecipeWizard />
    </div>
  );
}
