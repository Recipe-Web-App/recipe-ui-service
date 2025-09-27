import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchInput } from '@/components/ui/search-input';
import {
  Clock,
  Users,
  ChefHat,
  Heart,
  Star,
  Plus,
  Filter,
  Grid,
  List,
} from 'lucide-react';
import Link from 'next/link';

/**
 * Recipes Page
 *
 * Main page for browsing and managing recipes. Features search,
 * filtering, and different view modes for recipe discovery.
 */
export default function RecipesPage() {
  // Mock recipe data for demonstration
  const recipes = [
    {
      id: 1,
      title: 'Classic Chocolate Chip Cookies',
      description:
        'Soft, chewy cookies with the perfect balance of chocolate chips',
      prepTime: 20,
      cookTime: 12,
      servings: 24,
      difficulty: 'Easy',
      rating: 4.8,
      image: '/placeholder-recipe.jpg',
      tags: ['dessert', 'cookies', 'chocolate'],
      isFavorite: true,
    },
    {
      id: 2,
      title: 'Mediterranean Pasta Salad',
      description:
        'Fresh and vibrant pasta salad with olives, tomatoes, and feta',
      prepTime: 15,
      cookTime: 10,
      servings: 6,
      difficulty: 'Easy',
      rating: 4.6,
      image: '/placeholder-recipe.jpg',
      tags: ['pasta', 'salad', 'mediterranean'],
      isFavorite: false,
    },
    {
      id: 3,
      title: 'Spicy Thai Curry',
      description:
        'Aromatic coconut curry with vegetables and your choice of protein',
      prepTime: 25,
      cookTime: 30,
      servings: 4,
      difficulty: 'Medium',
      rating: 4.9,
      image: '/placeholder-recipe.jpg',
      tags: ['curry', 'thai', 'spicy'],
      isFavorite: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-foreground text-3xl font-bold">Recipes</h1>
          <p className="text-muted-foreground">
            Discover and manage your recipe collection
          </p>
        </div>
        <Button asChild>
          <Link href="/recipes/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Recipe
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex-1">
          <SearchInput placeholder="Search recipes..." className="w-full" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Grid className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recipes.map(recipe => (
          <Card
            key={recipe.id}
            className="overflow-hidden transition-shadow hover:shadow-lg"
          >
            {/* Recipe Image */}
            <div className="bg-muted relative aspect-video">
              <div className="absolute top-2 right-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 bg-white/80 p-0 hover:bg-white"
                >
                  <Heart
                    className={`h-4 w-4 ${
                      recipe.isFavorite
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-600'
                    }`}
                  />
                </Button>
              </div>
              <div className="absolute bottom-2 left-2">
                <Badge variant="secondary" className="text-xs">
                  {recipe.difficulty}
                </Badge>
              </div>
            </div>

            {/* Recipe Content */}
            <div className="p-4">
              <div className="mb-2 flex items-start justify-between">
                <h3 className="line-clamp-1 font-semibold">{recipe.title}</h3>
                <div className="ml-2 flex items-center">
                  <Star className="mr-1 h-4 w-4 text-yellow-500" />
                  <span className="text-sm">{recipe.rating}</span>
                </div>
              </div>

              <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
                {recipe.description}
              </p>

              {/* Recipe Meta */}
              <div className="text-muted-foreground mb-3 flex items-center gap-4 text-sm">
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  {recipe.prepTime + recipe.cookTime}m
                </div>
                <div className="flex items-center">
                  <Users className="mr-1 h-4 w-4" />
                  {recipe.servings}
                </div>
                <div className="flex items-center">
                  <ChefHat className="mr-1 h-4 w-4" />
                  {recipe.difficulty}
                </div>
              </div>

              {/* Tags */}
              <div className="mb-3 flex flex-wrap gap-1">
                {recipe.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Recipe
                </Button>
                <Button variant="ghost" size="sm">
                  <ChefHat className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="py-8 text-center">
        <Button variant="outline">Load More Recipes</Button>
      </div>

      {/* Empty State (when no recipes) */}
      {recipes.length === 0 && (
        <div className="py-12 text-center">
          <ChefHat className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
          <h3 className="mb-2 text-lg font-semibold">No recipes found</h3>
          <p className="text-muted-foreground mb-6">
            Start building your recipe collection by creating your first recipe.
          </p>
          <Button asChild>
            <Link href="/recipes/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Recipe
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
