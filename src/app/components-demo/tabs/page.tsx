'use client';

import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function TabsDemo() {
  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="space-y-8">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Tabs Component Demo</h1>
          <p className="text-gray-600">
            Interactive examples of the Tabs component for organizing recipe
            sections and user profile interfaces.
          </p>
        </div>

        {/* Basic Tabs Examples */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Basic Tabs</h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-medium">Default Variant</h3>
              <Tabs defaultValue="ingredients" className="w-full">
                <TabsList>
                  <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                  <TabsTrigger value="instructions">Instructions</TabsTrigger>
                  <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                </TabsList>
                <TabsContent value="ingredients">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Recipe Ingredients</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• 2 cups all-purpose flour</li>
                      <li>• 1 cup sugar</li>
                      <li>• 1/2 cup butter</li>
                      <li>• 2 eggs</li>
                    </ul>
                  </div>
                </TabsContent>
                <TabsContent value="instructions">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Cooking Instructions</h4>
                    <ol className="list-inside list-decimal space-y-1 text-sm">
                      <li>Preheat oven to 350°F</li>
                      <li>Mix dry ingredients</li>
                      <li>Add wet ingredients</li>
                      <li>Bake for 25 minutes</li>
                    </ol>
                  </div>
                </TabsContent>
                <TabsContent value="nutrition">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Nutrition Facts</h4>
                    <div className="space-y-1 text-sm">
                      <div>Calories: 250</div>
                      <div>Protein: 4g</div>
                      <div>Carbs: 35g</div>
                      <div>Fat: 10g</div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium">Line Variant</h3>
              <Tabs defaultValue="recipes" className="w-full">
                <TabsList variant="line">
                  <TabsTrigger variant="line" value="recipes">
                    My Recipes
                  </TabsTrigger>
                  <TabsTrigger variant="line" value="collections">
                    Collections
                  </TabsTrigger>
                  <TabsTrigger variant="line" value="activity">
                    Activity
                  </TabsTrigger>
                </TabsList>
                <TabsContent variant="line" value="recipes">
                  <div className="py-4">
                    <h4 className="mb-2 font-semibold">My Recipe Collection</h4>
                    <p className="text-sm text-gray-600">
                      View and manage all your created recipes. You have 24
                      recipes saved.
                    </p>
                  </div>
                </TabsContent>
                <TabsContent variant="line" value="collections">
                  <div className="py-4">
                    <h4 className="mb-2 font-semibold">Recipe Collections</h4>
                    <p className="text-sm text-gray-600">
                      Organize recipes into themed collections like &quot;Quick
                      Dinners&quot; or &quot;Holiday Treats&quot;.
                    </p>
                  </div>
                </TabsContent>
                <TabsContent variant="line" value="activity">
                  <div className="py-4">
                    <h4 className="mb-2 font-semibold">Recent Activity</h4>
                    <p className="text-sm text-gray-600">
                      Track your cooking activity, saved recipes, and community
                      interactions.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Variant Showcase */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Variants</h2>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Pills Variant */}
            <div>
              <h3 className="mb-3 text-lg font-medium">Pills Variant</h3>
              <Tabs defaultValue="breakfast" className="w-full">
                <TabsList variant="pills">
                  <TabsTrigger variant="pills" value="breakfast">
                    Breakfast
                  </TabsTrigger>
                  <TabsTrigger variant="pills" value="lunch">
                    Lunch
                  </TabsTrigger>
                  <TabsTrigger variant="pills" value="dinner">
                    Dinner
                  </TabsTrigger>
                </TabsList>
                <TabsContent variant="pills" value="breakfast">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Breakfast Recipes</h4>
                    <p className="text-sm text-gray-600">
                      Start your day right with these delicious breakfast
                      recipes.
                    </p>
                  </div>
                </TabsContent>
                <TabsContent variant="pills" value="lunch">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Lunch Recipes</h4>
                    <p className="text-sm text-gray-600">
                      Quick and satisfying lunch options for busy days.
                    </p>
                  </div>
                </TabsContent>
                <TabsContent variant="pills" value="dinner">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Dinner Recipes</h4>
                    <p className="text-sm text-gray-600">
                      Hearty dinner recipes for family meals and special
                      occasions.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Card Variant */}
            <div>
              <h3 className="mb-3 text-lg font-medium">Card Variant</h3>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="tips">Tips</TabsTrigger>
                </TabsList>
                <TabsContent variant="card" value="overview">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Recipe Overview</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="font-medium text-gray-600">
                          Prep Time
                        </div>
                        <div>15 minutes</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-600">
                          Cook Time
                        </div>
                        <div>30 minutes</div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent variant="card" value="details">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Recipe Details</h4>
                    <p className="text-sm text-gray-600">
                      A delicious and easy recipe that&apos;s perfect for
                      weeknight dinners.
                    </p>
                  </div>
                </TabsContent>
                <TabsContent variant="card" value="tips">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Pro Tips</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Make sure ingredients are at room temperature</li>
                      <li>• Don&apos;t overmix the batter</li>
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Size Variations */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Size Variations</h2>
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-lg font-medium">Small Size</h3>
              <Tabs defaultValue="tab1" className="w-full max-w-md">
                <TabsList size="sm">
                  <TabsTrigger size="sm" value="tab1">
                    Quick
                  </TabsTrigger>
                  <TabsTrigger size="sm" value="tab2">
                    Easy
                  </TabsTrigger>
                  <TabsTrigger size="sm" value="tab3">
                    Fast
                  </TabsTrigger>
                </TabsList>
                <TabsContent size="sm" value="tab1">
                  Small size content for quick recipes
                </TabsContent>
                <TabsContent size="sm" value="tab2">
                  Small size content for easy recipes
                </TabsContent>
                <TabsContent size="sm" value="tab3">
                  Small size content for fast recipes
                </TabsContent>
              </Tabs>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">Large Size</h3>
              <Tabs defaultValue="tab1" className="w-full max-w-lg">
                <TabsList size="lg">
                  <TabsTrigger size="lg" value="tab1">
                    Featured Recipes
                  </TabsTrigger>
                  <TabsTrigger size="lg" value="tab2">
                    Popular Dishes
                  </TabsTrigger>
                  <TabsTrigger size="lg" value="tab3">
                    New Additions
                  </TabsTrigger>
                </TabsList>
                <TabsContent size="lg" value="tab1">
                  Large size content for featured recipes
                </TabsContent>
                <TabsContent size="lg" value="tab2">
                  Large size content for popular dishes
                </TabsContent>
                <TabsContent size="lg" value="tab3">
                  Large size content for new additions
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Recipe Management Example */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            Recipe Management Interface
          </h2>
          <Tabs defaultValue="details" className="w-full">
            <TabsList variant="line" className="w-full justify-start">
              <TabsTrigger variant="line" value="details">
                Recipe Details
              </TabsTrigger>
              <TabsTrigger variant="line" value="ingredients">
                Ingredients
              </TabsTrigger>
              <TabsTrigger variant="line" value="instructions">
                Instructions
              </TabsTrigger>
              <TabsTrigger variant="line" value="nutrition">
                Nutrition
              </TabsTrigger>
              <TabsTrigger variant="line" value="reviews">
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent variant="line" value="details">
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-lg font-semibold">
                      Recipe Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Prep Time:</span>
                        <span>15 minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cook Time:</span>
                        <span>30 minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Time:</span>
                        <span>45 minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Servings:</span>
                        <span>4 people</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Difficulty:</span>
                        <span>Easy</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-3 text-lg font-semibold">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                        Vegetarian
                      </span>
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                        Quick
                      </span>
                      <span className="rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-800">
                        Comfort Food
                      </span>
                      <span className="rounded-full bg-orange-100 px-2 py-1 text-xs text-orange-800">
                        Family-Friendly
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent variant="line" value="ingredients">
              <div className="py-4">
                <h3 className="mb-4 text-lg font-semibold">Ingredients List</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-600">
                      Dry Ingredients
                    </h4>
                    <ul className="space-y-1 text-sm">
                      <li>• 2 cups all-purpose flour</li>
                      <li>• 1 cup granulated sugar</li>
                      <li>• 1 tsp baking powder</li>
                      <li>• 1/2 tsp salt</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-600">
                      Wet Ingredients
                    </h4>
                    <ul className="space-y-1 text-sm">
                      <li>• 1/2 cup unsalted butter, melted</li>
                      <li>• 2 large eggs</li>
                      <li>• 1 cup milk</li>
                      <li>• 1 tsp vanilla extract</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent variant="line" value="instructions">
              <div className="py-4">
                <h3 className="mb-4 text-lg font-semibold">
                  Cooking Instructions
                </h3>
                <ol className="list-inside list-decimal space-y-3">
                  <li>
                    Preheat oven to 350°F (175°C) and grease a 9x13 inch baking
                    dish
                  </li>
                  <li>
                    In a large bowl, whisk together flour, sugar, baking powder,
                    and salt
                  </li>
                  <li>
                    In another bowl, combine melted butter, eggs, milk, and
                    vanilla
                  </li>
                  <li>
                    Pour wet ingredients into dry ingredients and stir until
                    just combined
                  </li>
                  <li>
                    Pour batter into prepared baking dish and smooth the top
                  </li>
                  <li>
                    Bake for 25-30 minutes until golden brown and a toothpick
                    comes out clean
                  </li>
                  <li>Cool for 10 minutes before serving</li>
                </ol>
              </div>
            </TabsContent>

            <TabsContent variant="line" value="nutrition">
              <div className="py-4">
                <h3 className="mb-4 text-lg font-semibold">
                  Nutrition Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
                  <div className="rounded-lg bg-gray-50 p-3">
                    <div className="text-xl font-bold text-blue-600">250</div>
                    <div className="text-sm text-gray-600">Calories</div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <div className="text-xl font-bold text-green-600">4g</div>
                    <div className="text-sm text-gray-600">Protein</div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <div className="text-xl font-bold text-orange-600">35g</div>
                    <div className="text-sm text-gray-600">Carbs</div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <div className="text-xl font-bold text-red-600">10g</div>
                    <div className="text-sm text-gray-600">Fat</div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent variant="line" value="reviews">
              <div className="py-4">
                <h3 className="mb-4 text-lg font-semibold">User Reviews</h3>
                <div className="space-y-4">
                  <div className="border-b border-gray-200 pb-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="font-medium">Sarah K.</span>
                      <div className="flex text-yellow-400">★★★★★</div>
                    </div>
                    <p className="text-sm text-gray-600">
                      &quot;This recipe is amazing! My family loved it and
                      it&apos;s so easy to make. Will definitely be making this
                      again.&quot;
                    </p>
                  </div>
                  <div className="border-b border-gray-200 pb-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="font-medium">Mike R.</span>
                      <div className="flex text-yellow-400">★★★★☆</div>
                    </div>
                    <p className="text-sm text-gray-600">
                      &quot;Great recipe! I added some chocolate chips and it
                      turned out perfectly. My kids couldn&apos;t get
                      enough.&quot;
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* User Profile Example */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            User Profile Interface
          </h2>
          <Tabs defaultValue="recipes" className="w-full">
            <TabsList variant="pills">
              <TabsTrigger variant="pills" value="recipes">
                My Recipes
              </TabsTrigger>
              <TabsTrigger variant="pills" value="collections">
                Collections
              </TabsTrigger>
              <TabsTrigger variant="pills" value="favorites">
                Favorites
              </TabsTrigger>
              <TabsTrigger variant="pills" value="activity">
                Activity
              </TabsTrigger>
              <TabsTrigger variant="pills" value="settings">
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent variant="pills" value="recipes">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">My Recipes (24)</h3>
                  <button className="rounded-md bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600">
                    Add New Recipe
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div
                      key={i}
                      className="rounded-lg border border-gray-200 p-4"
                    >
                      <div className="mb-3 h-32 rounded-md bg-gray-200"></div>
                      <h4 className="font-medium">Recipe Title {i}</h4>
                      <p className="text-sm text-gray-600">
                        Short description...
                      </p>
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <span>⭐ 4.5</span>
                        <span className="mx-2">•</span>
                        <span>30 min</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent variant="pills" value="collections">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    Recipe Collections (8)
                  </h3>
                  <button className="rounded-md bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-600">
                    Create Collection
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {[
                    'Quick Dinners',
                    'Holiday Treats',
                    'Healthy Options',
                    'Comfort Food',
                  ].map(collection => (
                    <div
                      key={collection}
                      className="rounded-lg border border-gray-200 p-4"
                    >
                      <h4 className="font-medium">{collection}</h4>
                      <p className="mt-1 text-sm text-gray-600">12 recipes</p>
                      <div className="mt-3 flex -space-x-2">
                        {[1, 2, 3].map(i => (
                          <div
                            key={i}
                            className="h-8 w-8 rounded border-2 border-white bg-gray-300"
                          ></div>
                        ))}
                        <div className="flex h-8 w-8 items-center justify-center rounded border-2 border-white bg-gray-100 text-xs">
                          +9
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent variant="pills" value="favorites">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Favorite Recipes (18)</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div
                      key={i}
                      className="rounded-lg border border-gray-200 p-4"
                    >
                      <div className="relative mb-3 h-32 rounded-md bg-gray-200">
                        <div className="absolute top-2 right-2 text-red-500">
                          ♥
                        </div>
                      </div>
                      <h4 className="font-medium">Favorite Recipe {i}</h4>
                      <p className="text-sm text-gray-600">By Chef Name</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent variant="pills" value="activity">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    'Created "Chocolate Chip Cookies" recipe',
                    'Added "Pasta Primavera" to Quick Dinners collection',
                    'Rated "Beef Stew" 5 stars',
                    'Shared "Banana Bread" recipe',
                    'Followed Chef Maria',
                  ].map((activity, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-3 rounded-lg border border-gray-200 p-3"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                        <span className="text-xs text-blue-600">●</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{activity}</p>
                        <p className="text-xs text-gray-500">
                          {2 + i} hours ago
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent variant="pills" value="settings">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Profile Settings</h3>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Display Name
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-md border border-gray-300 p-2"
                      placeholder="Your display name"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Bio
                    </label>
                    <textarea
                      className="w-full rounded-md border border-gray-300 p-2"
                      rows={3}
                      placeholder="Tell us about yourself..."
                    ></textarea>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Dietary Preferences
                    </label>
                    <div className="space-y-2">
                      {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'].map(
                        diet => (
                          <label key={diet} className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm">{diet}</span>
                          </label>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <button className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Usage Guidelines */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Usage Guidelines</h2>
          <div className="rounded-lg bg-gray-50 p-6">
            <h3 className="mb-3 font-medium">Best Practices</h3>
            <ul className="list-inside list-disc space-y-2 text-sm text-gray-700">
              <li>
                Use descriptive, concise tab labels that clearly indicate
                content
              </li>
              <li>Keep the number of tabs manageable (typically 3-7 tabs)</li>
              <li>
                Choose consistent variant styles within the same interface
              </li>
              <li>Use line variant for cleaner, minimal interfaces</li>
              <li>Use pills variant for friendly, approachable interfaces</li>
              <li>
                Use card variant when content needs clear visual separation
              </li>
              <li>
                Consider mobile experience - horizontal scrolling for many tabs
              </li>
              <li>Ensure keyboard navigation works properly</li>
              <li>Place most important/frequently used tabs first</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
