'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import { RecipeViewPage } from '@/components/recipe/view';

interface RecipePageProps {
  params: Promise<{ id: string }>;
}

export default function RecipePage({ params }: RecipePageProps) {
  const { id } = use(params);
  const recipeId = parseInt(id, 10);

  // Validate the ID is a valid number
  if (isNaN(recipeId) || recipeId <= 0) {
    notFound();
  }

  return (
    <div className="container py-8">
      <RecipeViewPage recipeId={recipeId} />
    </div>
  );
}
