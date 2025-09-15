'use client';

import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from '@/components/ui/dropdown';

export default function DropdownDemo() {
  const [bookmarked, setBookmarked] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [selectedDiet, setSelectedDiet] = useState('');

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="space-y-8">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Dropdown Component Demo</h1>
          <p className="text-gray-600">
            Interactive examples of the Dropdown component in various
            configurations for the Recipe App.
          </p>
        </div>

        {/* Basic Dropdown Examples */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Basic Dropdowns</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="mb-2 text-sm font-medium">Default Trigger</h3>
              <DropdownMenu>
                <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>View Recipe</DropdownMenuItem>
                  <DropdownMenuItem>Edit Recipe</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">
                    Delete Recipe
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium">Secondary Trigger</h3>
              <DropdownMenu>
                <DropdownMenuTrigger variant="secondary">
                  Actions
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Duplicate Recipe</DropdownMenuItem>
                  <DropdownMenuItem>Share Recipe</DropdownMenuItem>
                  <DropdownMenuItem>Add to Collection</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium">Outline Trigger</h3>
              <DropdownMenu>
                <DropdownMenuTrigger variant="outline">
                  Filter Options
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>By Cuisine</DropdownMenuItem>
                  <DropdownMenuItem>By Cook Time</DropdownMenuItem>
                  <DropdownMenuItem>By Difficulty</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium">Ghost Trigger</h3>
              <DropdownMenu>
                <DropdownMenuTrigger variant="ghost">
                  Sort By
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Newest First</DropdownMenuItem>
                  <DropdownMenuItem>Oldest First</DropdownMenuItem>
                  <DropdownMenuItem>Most Popular</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </section>

        {/* Size Variations */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Size Variations</h2>
          <div className="flex flex-wrap items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger size="sm">Small</DropdownMenuTrigger>
              <DropdownMenuContent size="sm">
                <DropdownMenuItem>Quick Action</DropdownMenuItem>
                <DropdownMenuItem>Another Action</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger size="default">Default</DropdownMenuTrigger>
              <DropdownMenuContent size="default">
                <DropdownMenuItem>Standard Action</DropdownMenuItem>
                <DropdownMenuItem>Another Action</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger size="lg">Large</DropdownMenuTrigger>
              <DropdownMenuContent size="lg">
                <DropdownMenuItem>Large Action</DropdownMenuItem>
                <DropdownMenuItem>Another Action</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </section>

        {/* Recipe App Examples */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Recipe App Examples</h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Recipe Actions */}
            <div>
              <h3 className="mb-3 text-lg font-medium">Recipe Actions Menu</h3>
              <DropdownMenu>
                <DropdownMenuTrigger variant="outline">
                  Recipe Actions
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Recipe Options</DropdownMenuLabel>
                  <DropdownMenuItem>
                    View Details
                    <DropdownMenuShortcut>⌘V</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Edit Recipe
                    <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Duplicate Recipe</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Share</DropdownMenuLabel>
                    <DropdownMenuItem>Copy Link</DropdownMenuItem>
                    <DropdownMenuItem>Share via Email</DropdownMenuItem>
                    <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">
                    Delete Recipe
                    <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* User Profile Menu */}
            <div>
              <h3 className="mb-3 text-lg font-medium">User Profile Menu</h3>
              <DropdownMenu>
                <DropdownMenuTrigger variant="ghost">
                  Chef John
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                  <DropdownMenuItem>My Recipes</DropdownMenuItem>
                  <DropdownMenuItem>My Collections</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Meal Plans</DropdownMenuItem>
                  <DropdownMenuItem>Shopping Lists</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Help & Support</DropdownMenuItem>
                  <DropdownMenuItem>Log Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </section>

        {/* Interactive Examples */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Interactive Examples</h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Checkbox Items */}
            <div>
              <h3 className="mb-3 text-lg font-medium">Recipe Preferences</h3>
              <DropdownMenu>
                <DropdownMenuTrigger variant="outline">
                  Recipe Options
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Display Options</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={bookmarked}
                    onCheckedChange={setBookmarked}
                  >
                    Show Only Bookmarked
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={showPanel}
                    onCheckedChange={setShowPanel}
                  >
                    Show Nutrition Panel
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>View Options</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem checked={true}>
                    Show Recipe Images
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={false}>
                    Show Cook Time
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="mt-2 text-sm text-gray-600">
                Bookmarked: {bookmarked ? 'Yes' : 'No'} | Panel:{' '}
                {showPanel ? 'Visible' : 'Hidden'}
              </div>
            </div>

            {/* Radio Items */}
            <div>
              <h3 className="mb-3 text-lg font-medium">Dietary Preferences</h3>
              <DropdownMenu>
                <DropdownMenuTrigger variant="outline">
                  Diet Filter: {selectedDiet || 'All'}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Dietary Restrictions</DropdownMenuLabel>
                  <DropdownMenuRadioGroup
                    value={selectedDiet}
                    onValueChange={setSelectedDiet}
                  >
                    <DropdownMenuRadioItem value="">
                      All Recipes
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="vegetarian">
                      Vegetarian
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="vegan">
                      Vegan
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="gluten-free">
                      Gluten-Free
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="keto">
                      Keto
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="paleo">
                      Paleo
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="mt-2 text-sm text-gray-600">
                Selected: {selectedDiet || 'All recipes shown'}
              </div>
            </div>
          </div>
        </section>

        {/* Sub-menus */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Sub-menus</h2>

          <div className="flex flex-wrap gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger variant="outline">
                Recipe Categories
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>All Recipes</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>By Meal Type</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>Breakfast</DropdownMenuItem>
                    <DropdownMenuItem>Lunch</DropdownMenuItem>
                    <DropdownMenuItem>Dinner</DropdownMenuItem>
                    <DropdownMenuItem>Snacks</DropdownMenuItem>
                    <DropdownMenuItem>Desserts</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>By Cuisine</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>Italian</DropdownMenuItem>
                    <DropdownMenuItem>Mexican</DropdownMenuItem>
                    <DropdownMenuItem>Asian</DropdownMenuItem>
                    <DropdownMenuItem>Mediterranean</DropdownMenuItem>
                    <DropdownMenuItem>American</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>By Cook Time</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>Under 15 minutes</DropdownMenuItem>
                    <DropdownMenuItem>15-30 minutes</DropdownMenuItem>
                    <DropdownMenuItem>30-60 minutes</DropdownMenuItem>
                    <DropdownMenuItem>Over 1 hour</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger variant="outline">
                Export Options
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Export Recipe</DropdownMenuLabel>
                <DropdownMenuItem>Copy to Clipboard</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    Export as File
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>PDF Document</DropdownMenuItem>
                    <DropdownMenuItem>Text File</DropdownMenuItem>
                    <DropdownMenuItem>Recipe Card (PNG)</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Share Online</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>Email Link</DropdownMenuItem>
                    <DropdownMenuItem>Social Media</DropdownMenuItem>
                    <DropdownMenuItem>Generate QR Code</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </section>

        {/* Content Variants */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Content Variants</h2>

          <div className="flex flex-wrap gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger variant="outline">
                Default Content
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Standard styling</DropdownMenuItem>
                <DropdownMenuItem>Default appearance</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger variant="outline">
                Secondary Content
              </DropdownMenuTrigger>
              <DropdownMenuContent variant="secondary">
                <DropdownMenuItem>Secondary styling</DropdownMenuItem>
                <DropdownMenuItem>Alternative appearance</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Usage Guidelines</h2>
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-2 font-medium">Best Practices</h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-gray-700">
              <li>Use clear, action-oriented labels for menu items</li>
              <li>Group related actions with separators and labels</li>
              <li>
                Place destructive actions at the bottom with visual distinction
              </li>
              <li>Use keyboard shortcuts for frequently used actions</li>
              <li>
                Keep menu depth minimal - avoid more than 2 levels of nesting
              </li>
              <li>Use checkbox items for toggleable options</li>
              <li>Use radio items for mutually exclusive selections</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
