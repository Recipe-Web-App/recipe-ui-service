import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChefHat,
  Calendar,
  BookOpen,
  Users,
  TrendingUp,
  Clock,
  Heart,
  Star,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Recipe App Homepage
 *
 * The main landing page showcasing the recipe management application.
 * Features quick access to key functionality and highlights recent activity.
 */
export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="py-12 text-center">
        <div className="mb-6 flex flex-col items-center justify-center">
          <h1 className="text-foreground flex items-center gap-3 text-4xl font-bold">
            <ChefHat className="text-primary h-8 w-8" />
            Sous Chef
            <ChefHat className="text-primary h-8 w-8" />
          </h1>
          <Image
            src="/site-logo.webp"
            alt="Sous Chef Logo"
            width={280}
            height={150}
            className="mb-4"
            unoptimized
          />
        </div>
        <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl">
          Discover, create, and organize your favorite recipes. Plan meals,
          generate shopping lists, and connect with fellow food enthusiasts.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/recipes">
              <BookOpen className="mr-2 h-5 w-5" />
              Browse Recipes
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/recipes/create">
              <ChefHat className="mr-2 h-5 w-5" />
              Create Recipe
            </Link>
          </Button>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="mb-6 text-2xl font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6 transition-shadow hover:shadow-lg">
            <div className="mb-4 flex items-center">
              <BookOpen className="text-primary mr-3 h-8 w-8" />
              <h3 className="font-semibold">Recipes</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Browse and manage your recipe collection
            </p>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href="/recipes">Explore Recipes</Link>
            </Button>
          </Card>

          <Card className="p-6 transition-shadow hover:shadow-lg">
            <div className="mb-4 flex items-center">
              <Calendar className="text-primary mr-3 h-8 w-8" />
              <h3 className="font-semibold">Meal Plans</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Plan your meals for the week ahead
            </p>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href="/meal-plans">Plan Meals</Link>
            </Button>
          </Card>

          <Card className="p-6 transition-shadow hover:shadow-lg">
            <div className="mb-4 flex items-center">
              <Heart className="text-primary mr-3 h-8 w-8" />
              <h3 className="font-semibold">Favorites</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Quick access to your favorite recipes
            </p>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href="/recipes/favorites">View Favorites</Link>
            </Button>
          </Card>

          <Card className="p-6 transition-shadow hover:shadow-lg">
            <div className="mb-4 flex items-center">
              <Users className="text-primary mr-3 h-8 w-8" />
              <h3 className="font-semibold">Discover Cooks</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Find and follow other food enthusiasts
            </p>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href="/feed/discover">Explore</Link>
            </Button>
          </Card>
        </div>
      </section>

      {/* Featured Content */}
      <section>
        <h2 className="mb-6 text-2xl font-semibold">Featured Content</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Trending Recipes */}
          <Card className="p-6">
            <div className="mb-4 flex items-center">
              <TrendingUp className="text-primary mr-2 h-6 w-6" />
              <h3 className="font-semibold">Trending Recipes</h3>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Classic Chocolate Chip Cookies', rating: 4.8 },
                { name: 'Mediterranean Pasta Salad', rating: 4.6 },
                { name: 'Spicy Thai Curry', rating: 4.9 },
              ].map((recipe, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{recipe.name}</span>
                  <div className="flex items-center">
                    <Star className="text-rating mr-1 h-4 w-4" />
                    <span className="text-sm">{recipe.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="p-6">
            <div className="mb-4 flex items-center">
              <Clock className="text-primary mr-2 h-6 w-6" />
              <h3 className="font-semibold">Your Activity</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Recipes Saved</span>
                <Badge variant="secondary">24</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Meals Planned</span>
                <Badge variant="secondary">8</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Friends Connected</span>
                <Badge variant="secondary">12</Badge>
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <div className="mb-4 flex items-center">
              <Users className="text-primary mr-2 h-6 w-6" />
              <h3 className="font-semibold">Recent Activity</h3>
            </div>
            <div className="text-muted-foreground space-y-3 text-sm">
              <p>Sarah shared &ldquo;Homemade Pizza Dough&rdquo;</p>
              <p>You saved &ldquo;Lemon Garlic Chicken&rdquo;</p>
              <p>Mike liked your &ldquo;Chocolate Brownies&rdquo;</p>
            </div>
          </Card>
        </div>
      </section>

      {/* Getting Started */}
      <section className="bg-muted/50 rounded-lg p-8">
        <h2 className="mb-4 text-2xl font-semibold">
          New to Recipe Management?
        </h2>
        <p className="text-muted-foreground mb-6">
          Get started with these simple steps to make the most of your culinary
          journey.
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="text-center">
            <div className="bg-primary/10 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full">
              <span className="text-primary font-semibold">1</span>
            </div>
            <h3 className="mb-2 font-medium">Create Your Profile</h3>
            <p className="text-muted-foreground text-sm">
              Set up your preferences and dietary restrictions
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full">
              <span className="text-primary font-semibold">2</span>
            </div>
            <h3 className="mb-2 font-medium">Add Your First Recipe</h3>
            <p className="text-muted-foreground text-sm">
              Import from a URL or create from scratch
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full">
              <span className="text-primary font-semibold">3</span>
            </div>
            <h3 className="mb-2 font-medium">Plan Your Week</h3>
            <p className="text-muted-foreground text-sm">
              Create meal plans and shopping lists
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
