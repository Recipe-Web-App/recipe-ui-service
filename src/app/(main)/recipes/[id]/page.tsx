'use client';

import { use } from 'react';
import { useSearchParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import { RecipeViewPage } from '@/components/recipe/view';

interface RecipePageProps {
  params: Promise<{ id: string }>;
}

export default function RecipePage({ params }: RecipePageProps) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const sourcePage = searchParams.get('from') ?? undefined;
  const recipeId = parseInt(id, 10);

  // Validate the ID is a valid number
  if (isNaN(recipeId) || recipeId <= 0) {
    notFound();
  }

  return (
    <div className="container py-8">
      <RecipeViewPage recipeId={recipeId} sourcePage={sourcePage} />
    </div>
  );
}
