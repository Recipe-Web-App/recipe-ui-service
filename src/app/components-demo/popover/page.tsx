'use client';

import React, { useState } from 'react';
import {
  SimplePopover,
  MenuPopover,
  FormPopover,
  ConfirmPopover,
} from '@/components/ui/popover';

export default function PopoverDemo() {
  const [controlledOpen, setControlledOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="space-y-8">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Popover Component Demo</h1>
          <p className="text-gray-600">
            Floating content container for contextual information, actions, and
            forms in the Recipe App.
          </p>
        </div>

        {/* Basic Popovers */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Basic Popovers</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <SimplePopover
              content="Default popover with standard styling"
              variant="default"
            >
              <button className="w-full rounded border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50">
                Default
              </button>
            </SimplePopover>

            <SimplePopover
              content="Light themed popover with enhanced shadow for better contrast"
              variant="light"
            >
              <button className="w-full rounded border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50">
                Light
              </button>
            </SimplePopover>

            <SimplePopover
              content="Accent colored popover for important information"
              variant="accent"
            >
              <button className="w-full rounded border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50">
                Accent
              </button>
            </SimplePopover>

            <SimplePopover
              content="Success message for positive feedback"
              variant="success"
            >
              <button className="w-full rounded border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50">
                Success
              </button>
            </SimplePopover>

            <SimplePopover
              content="Warning notification for important notices"
              variant="warning"
            >
              <button className="w-full rounded border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50">
                Warning
              </button>
            </SimplePopover>

            <SimplePopover
              content="Error message for critical information"
              variant="error"
            >
              <button className="w-full rounded border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50">
                Error
              </button>
            </SimplePopover>

            <SimplePopover
              content="Informational popover for additional details"
              variant="info"
            >
              <button className="w-full rounded border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50">
                Info
              </button>
            </SimplePopover>

            <SimplePopover content="Popover without arrow" showArrow={false}>
              <button className="w-full rounded border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50">
                No Arrow
              </button>
            </SimplePopover>
          </div>
        </section>

        {/* Popover Sizes */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Popover Sizes</h2>
          <div className="flex flex-wrap items-center gap-4">
            <SimplePopover content="Small popover content" size="sm">
              <button className="rounded bg-blue-500 px-3 py-1.5 text-sm text-white hover:bg-blue-600">
                Small
              </button>
            </SimplePopover>

            <SimplePopover
              content="Default size popover with standard content area"
              size="default"
            >
              <button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                Default
              </button>
            </SimplePopover>

            <SimplePopover
              content={
                <div className="space-y-2">
                  <h3 className="font-semibold">Large Popover</h3>
                  <p>
                    This size accommodates more detailed information and complex
                    layouts while maintaining readability.
                  </p>
                </div>
              }
              size="lg"
            >
              <button className="rounded bg-blue-500 px-5 py-2.5 text-lg text-white hover:bg-blue-600">
                Large
              </button>
            </SimplePopover>

            <SimplePopover
              content={
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Extra Large Popover</h3>
                  <p>
                    Perfect for comprehensive information, detailed forms, and
                    complex content that requires significant space. This size
                    provides ample room for structured layouts.
                  </p>
                  <ul className="list-disc space-y-1 pl-5 text-sm">
                    <li>Detailed explanations</li>
                    <li>Form layouts</li>
                    <li>Multiple sections</li>
                  </ul>
                </div>
              }
              size="xl"
            >
              <button className="rounded bg-blue-500 px-6 py-3 text-lg text-white hover:bg-blue-600">
                Extra Large
              </button>
            </SimplePopover>

            <SimplePopover
              content={
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Full Width Popover</h3>
                  <p>
                    Expands to use available width while maintaining maximum
                    constraints. Ideal for detailed forms and comprehensive
                    content displays.
                  </p>
                </div>
              }
              size="full"
            >
              <button className="rounded bg-blue-500 px-7 py-3 text-lg text-white hover:bg-blue-600">
                Full Width
              </button>
            </SimplePopover>
          </div>
        </section>

        {/* Positioning */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Positioning Options</h2>
          <div className="flex justify-center">
            <div className="grid grid-cols-3 place-items-center gap-8">
              <div></div>
              <SimplePopover content="Top positioned popover" side="top">
                <button className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-50">
                  Top
                </button>
              </SimplePopover>
              <div></div>

              <SimplePopover content="Left positioned popover" side="left">
                <button className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-50">
                  Left
                </button>
              </SimplePopover>

              <div className="rounded border border-dashed border-gray-300 px-4 py-2 text-gray-400">
                Center
              </div>

              <SimplePopover content="Right positioned popover" side="right">
                <button className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-50">
                  Right
                </button>
              </SimplePopover>

              <div></div>
              <SimplePopover content="Bottom positioned popover" side="bottom">
                <button className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-50">
                  Bottom
                </button>
              </SimplePopover>
              <div></div>
            </div>
          </div>
        </section>

        {/* Menu Popovers */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Menu Popovers</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-3">
              <h3 className="font-medium">Recipe Actions</h3>
              <MenuPopover
                items={[
                  {
                    label: 'Edit Recipe',
                    icon: '✏️',
                    onClick: () => console.log('Edit'),
                    shortcut: 'Ctrl+E',
                  },
                  {
                    label: 'Duplicate',
                    icon: '📋',
                    onClick: () => console.log('Duplicate'),
                    shortcut: 'Ctrl+D',
                  },
                  { divider: true },
                  {
                    label: 'Share',
                    icon: '📤',
                    onClick: () => console.log('Share'),
                    shortcut: 'Ctrl+S',
                  },
                  {
                    label: 'Print',
                    icon: '🖨️',
                    onClick: () => console.log('Print'),
                    shortcut: 'Ctrl+P',
                  },
                  { divider: true },
                  {
                    label: 'Archive',
                    icon: '📁',
                    onClick: () => console.log('Archive'),
                  },
                  {
                    label: 'Delete',
                    icon: '🗑️',
                    onClick: () => console.log('Delete'),
                    shortcut: 'Del',
                  },
                ]}
              >
                <button className="w-full rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700">
                  Recipe Menu
                </button>
              </MenuPopover>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Categories</h3>
              <MenuPopover
                variant="accent"
                items={[
                  {
                    label: 'Breakfast',
                    onClick: () => console.log('Breakfast'),
                  },
                  { label: 'Lunch', onClick: () => console.log('Lunch') },
                  { label: 'Dinner', onClick: () => console.log('Dinner') },
                  { label: 'Snacks', onClick: () => console.log('Snacks') },
                  { label: 'Desserts', onClick: () => console.log('Desserts') },
                  { divider: true },
                  {
                    label: 'Beverages',
                    onClick: () => console.log('Beverages'),
                  },
                  {
                    label: 'Appetizers',
                    onClick: () => console.log('Appetizers'),
                  },
                ]}
              >
                <button className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                  Categories
                </button>
              </MenuPopover>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">User Menu</h3>
              <MenuPopover
                variant="light"
                items={[
                  {
                    label: 'Profile',
                    icon: '👤',
                    onClick: () => console.log('Profile'),
                  },
                  {
                    label: 'Settings',
                    icon: '⚙️',
                    onClick: () => console.log('Settings'),
                    shortcut: 'Ctrl+,',
                  },
                  {
                    label: 'Help',
                    icon: '❓',
                    onClick: () => console.log('Help'),
                    shortcut: 'F1',
                  },
                  { divider: true },
                  {
                    label: 'Sign Out',
                    icon: '🚪',
                    onClick: () => console.log('Sign Out'),
                  },
                ]}
              >
                <button className="w-full rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
                  User Menu
                </button>
              </MenuPopover>
            </div>
          </div>
        </section>

        {/* Form Popovers */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Form Popovers</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="font-medium">Edit Recipe</h3>
              <FormPopover
                title="Edit Recipe Details"
                description="Update the recipe name and description"
                form={
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Recipe name..."
                      className="w-full rounded border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      defaultValue="Classic Beef Stew"
                    />
                    <textarea
                      placeholder="Description..."
                      className="w-full rounded border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      rows={3}
                      defaultValue="A hearty and warming beef stew with tender meat and vegetables"
                    />
                    <select className="w-full rounded border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                      <option>Main Course</option>
                      <option>Appetizer</option>
                      <option>Dessert</option>
                      <option>Side Dish</option>
                    </select>
                  </div>
                }
                onSubmit={e => {
                  e.preventDefault();
                  console.log('Recipe updated');
                }}
              >
                <button className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                  Edit Recipe
                </button>
              </FormPopover>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Add Ingredient</h3>
              <FormPopover
                title="Add New Ingredient"
                form={
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Ingredient name..."
                      className="w-full rounded border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Amount"
                        className="flex-1 rounded border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      />
                      <select className="flex-1 rounded border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                        <option>cups</option>
                        <option>tablespoons</option>
                        <option>teaspoons</option>
                        <option>ounces</option>
                        <option>pounds</option>
                        <option>grams</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      placeholder="Notes (optional)"
                      className="w-full rounded border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                }
                submitLabel="Add Ingredient"
                onSubmit={e => {
                  e.preventDefault();
                  console.log('Ingredient added');
                }}
              >
                <button className="w-full rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
                  Add Ingredient
                </button>
              </FormPopover>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Recipe Notes</h3>
              <FormPopover
                title="Add Recipe Note"
                description="Add cooking tips or personal notes"
                form={
                  <div className="space-y-3">
                    <select className="w-full rounded border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                      <option>Cooking Tip</option>
                      <option>Ingredient Substitution</option>
                      <option>Personal Note</option>
                      <option>Warning</option>
                    </select>
                    <textarea
                      placeholder="Enter your note..."
                      className="w-full rounded border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      rows={4}
                    />
                  </div>
                }
                submitLabel="Add Note"
                onSubmit={e => {
                  e.preventDefault();
                  console.log('Note added');
                }}
              >
                <button className="w-full rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
                  Add Note
                </button>
              </FormPopover>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Quick Rating</h3>
              <FormPopover
                title="Rate This Recipe"
                description="How would you rate this recipe?"
                form={
                  <div className="space-y-3">
                    <div className="flex justify-center gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          className="text-2xl text-gray-300 hover:text-yellow-500"
                        >
                          ⭐
                        </button>
                      ))}
                    </div>
                    <textarea
                      placeholder="Share your thoughts..."
                      className="w-full rounded border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      rows={3}
                    />
                  </div>
                }
                submitLabel="Submit Rating"
                onSubmit={e => {
                  e.preventDefault();
                  console.log('Rating submitted');
                }}
              >
                <button className="w-full rounded bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700">
                  Rate Recipe
                </button>
              </FormPopover>
            </div>
          </div>
        </section>

        {/* Confirmation Popovers */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Confirmation Popovers</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <ConfirmPopover
              title="Delete Recipe?"
              description="This action cannot be undone. The recipe will be permanently deleted from your collection."
              confirmLabel="Delete Recipe"
              confirmVariant="danger"
              onConfirm={() => setConfirmMessage('Recipe deleted!')}
            >
              <button className="w-full rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700">
                Delete Recipe
              </button>
            </ConfirmPopover>

            <ConfirmPopover
              title="Clear Shopping List?"
              description="Remove all items from your shopping list. You can add them back later."
              confirmLabel="Clear All"
              confirmVariant="warning"
              onConfirm={() => setConfirmMessage('Shopping list cleared!')}
            >
              <button className="w-full rounded bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700">
                Clear List
              </button>
            </ConfirmPopover>

            <ConfirmPopover
              description="Save changes to your meal plan?"
              confirmLabel="Save Changes"
              onConfirm={() => setConfirmMessage('Changes saved!')}
            >
              <button className="w-full rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
                Save Meal Plan
              </button>
            </ConfirmPopover>
          </div>

          {confirmMessage && (
            <div className="mt-4 rounded bg-green-100 p-3 text-center text-green-800">
              {confirmMessage}
            </div>
          )}
        </section>

        {/* Recipe-Specific Examples */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            Recipe-Specific Examples
          </h2>

          {/* Recipe Card with Actions */}
          <div className="mb-6">
            <h3 className="mb-3 font-medium">Recipe Card with Actions</h3>
            <div className="max-w-md rounded-lg border p-4">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h4 className="font-semibold">Mediterranean Quinoa Bowl</h4>
                  <p className="text-sm text-gray-600">
                    Prep: 15 min • Cook: 20 min
                  </p>
                </div>
                <MenuPopover
                  variant="light"
                  size="sm"
                  items={[
                    { label: 'View Recipe', icon: '👁️' },
                    { label: 'Add to Meal Plan', icon: '📅' },
                    { label: 'Add to Favorites', icon: '❤️' },
                    { divider: true },
                    { label: 'Edit', icon: '✏️' },
                    { label: 'Share', icon: '📤' },
                    { label: 'Print', icon: '🖨️' },
                    { divider: true },
                    { label: 'Delete', icon: '🗑️' },
                  ]}
                >
                  <button className="rounded p-1 hover:bg-gray-100">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </button>
                </MenuPopover>
              </div>

              <p className="mb-4 text-sm text-gray-700">
                A healthy and delicious quinoa bowl packed with Mediterranean
                flavors.
              </p>

              <div className="flex gap-2">
                <SimplePopover
                  content={
                    <div className="space-y-2">
                      <h4 className="font-semibold">Nutrition per serving</h4>
                      <div className="text-sm">
                        <div>Calories: 420</div>
                        <div>Protein: 18g</div>
                        <div>Carbs: 52g</div>
                        <div>Fat: 16g</div>
                        <div>Fiber: 8g</div>
                      </div>
                    </div>
                  }
                  variant="info"
                  size="sm"
                >
                  <button className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700 hover:bg-blue-200">
                    Nutrition Info
                  </button>
                </SimplePopover>

                <SimplePopover
                  content={
                    <div className="space-y-2">
                      <h4 className="font-semibold">Dietary Information</h4>
                      <div className="flex flex-wrap gap-1">
                        <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-700">
                          Vegetarian
                        </span>
                        <span className="rounded bg-orange-100 px-2 py-1 text-xs text-orange-700">
                          Gluten-Free
                        </span>
                        <span className="rounded bg-purple-100 px-2 py-1 text-xs text-purple-700">
                          High Protein
                        </span>
                        <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700">
                          Heart Healthy
                        </span>
                      </div>
                    </div>
                  }
                  variant="light"
                  size="sm"
                >
                  <button className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 hover:bg-gray-200">
                    Dietary Tags
                  </button>
                </SimplePopover>

                <SimplePopover
                  content={
                    <div className="space-y-2">
                      <h4 className="font-semibold">Quick Actions</h4>
                      <div className="space-y-1">
                        <button className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-gray-100">
                          🛒 Add ingredients to shopping list
                        </button>
                        <button className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-gray-100">
                          ⏱️ Start cooking timer
                        </button>
                        <button className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-gray-100">
                          📱 Send to mobile
                        </button>
                      </div>
                    </div>
                  }
                  variant="light"
                >
                  <button className="rounded bg-green-100 px-2 py-1 text-xs text-green-700 hover:bg-green-200">
                    Quick Actions
                  </button>
                </SimplePopover>
              </div>
            </div>
          </div>

          {/* Ingredient with Substitutions */}
          <div className="mb-6">
            <h3 className="mb-3 font-medium">Ingredient Substitutions</h3>
            <div className="rounded-lg bg-gray-50 p-4">
              <h4 className="mb-3 font-semibold">Recipe Ingredients</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center justify-between">
                  <span>2 cups quinoa</span>
                  <SimplePopover
                    content={
                      <div className="space-y-2">
                        <h4 className="font-semibold">Quinoa</h4>
                        <p className="text-sm">
                          A gluten-free grain that&apos;s high in protein and
                          fiber.
                        </p>
                        <div className="space-y-1 text-sm">
                          <div className="font-medium">Substitutions:</div>
                          <ul className="ml-4 list-disc">
                            <li>Brown rice</li>
                            <li>Cauliflower rice (low-carb)</li>
                            <li>Bulgur wheat</li>
                            <li>Farro</li>
                          </ul>
                        </div>
                      </div>
                    }
                    variant="light"
                  >
                    <button className="text-blue-600 hover:text-blue-800">
                      ⓘ
                    </button>
                  </SimplePopover>
                </li>
                <li className="flex items-center justify-between">
                  <span>1 cup cherry tomatoes</span>
                  <SimplePopover
                    content={
                      <div className="space-y-2">
                        <h4 className="font-semibold">Cherry Tomatoes</h4>
                        <p className="text-sm">
                          Sweet, bite-sized tomatoes that add freshness.
                        </p>
                        <div className="space-y-1 text-sm">
                          <div className="font-medium">Substitutions:</div>
                          <ul className="ml-4 list-disc">
                            <li>Regular tomatoes, diced</li>
                            <li>Sun-dried tomatoes</li>
                            <li>Grape tomatoes</li>
                            <li>Roasted red peppers</li>
                          </ul>
                        </div>
                      </div>
                    }
                    variant="light"
                  >
                    <button className="text-blue-600 hover:text-blue-800">
                      ⓘ
                    </button>
                  </SimplePopover>
                </li>
                <li className="flex items-center justify-between">
                  <span>1/2 cup feta cheese</span>
                  <SimplePopover
                    content={
                      <div className="space-y-2">
                        <h4 className="font-semibold">Feta Cheese</h4>
                        <p className="text-sm">
                          Tangy Greek cheese that adds saltiness and creaminess.
                        </p>
                        <div className="space-y-1 text-sm">
                          <div className="font-medium">Substitutions:</div>
                          <ul className="ml-4 list-disc">
                            <li>Goat cheese</li>
                            <li>Ricotta salata</li>
                            <li>Cotija cheese</li>
                            <li>Tofu feta (vegan)</li>
                          </ul>
                        </div>
                      </div>
                    }
                    variant="light"
                  >
                    <button className="text-blue-600 hover:text-blue-800">
                      ⓘ
                    </button>
                  </SimplePopover>
                </li>
              </ul>
            </div>
          </div>

          {/* Cooking Timer */}
          <div>
            <h3 className="mb-3 font-medium">Interactive Cooking Timer</h3>
            <SimplePopover
              content={
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">
                      Recipe Timers
                    </h3>
                    <p className="text-sm text-gray-600">
                      Set timers for each cooking step
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded bg-gray-50 p-2">
                      <span className="text-sm">Cook quinoa</span>
                      <button className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700">
                        15 min
                      </button>
                    </div>
                    <div className="flex items-center justify-between rounded bg-gray-50 p-2">
                      <span className="text-sm">Roast vegetables</span>
                      <button className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700">
                        20 min
                      </button>
                    </div>
                    <div className="flex items-center justify-between rounded bg-gray-50 p-2">
                      <span className="text-sm">Rest before serving</span>
                      <button className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700">
                        5 min
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2 border-t pt-3">
                    <button className="flex-1 rounded bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700">
                      Start All
                    </button>
                    <button className="flex-1 rounded border px-3 py-1.5 text-sm hover:bg-gray-50">
                      Clear All
                    </button>
                  </div>
                </div>
              }
              size="lg"
              variant="light"
            >
              <button className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
                ⏱️ Cooking Timers
              </button>
            </SimplePopover>
          </div>
        </section>

        {/* Controlled State Example */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Controlled State</h2>
          <div className="rounded-lg bg-gray-50 p-6">
            <div className="mb-4 flex gap-3">
              <button
                onClick={() => setControlledOpen(true)}
                className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                Open Popover
              </button>
              <button
                onClick={() => setControlledOpen(false)}
                className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Close Popover
              </button>
            </div>

            <SimplePopover
              content={
                <div className="space-y-2">
                  <h3 className="font-semibold">Controlled Popover</h3>
                  <p>This popover is controlled by external state.</p>
                  <p className="text-sm text-gray-600">
                    Use the buttons above to open/close me!
                  </p>
                </div>
              }
              open={controlledOpen}
              onOpenChange={setControlledOpen}
              variant="accent"
            >
              <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                Controlled Trigger
              </button>
            </SimplePopover>

            <p className="mt-4 text-sm text-gray-600">
              Popover state:{' '}
              <strong>{controlledOpen ? 'Open' : 'Closed'}</strong>
            </p>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Usage Guidelines</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-green-50 p-4">
              <h3 className="mb-2 font-medium text-green-800">
                ✅ Best Practices
              </h3>
              <ul className="space-y-1 text-sm text-green-700">
                <li>• Use for secondary actions and information</li>
                <li>• Keep content focused and concise</li>
                <li>• Provide keyboard shortcuts for common actions</li>
                <li>• Use appropriate variants for context</li>
                <li>• Test positioning on different screen sizes</li>
                <li>• Include close buttons for complex content</li>
                <li>• Confirm destructive actions</li>
              </ul>
            </div>

            <div className="rounded-lg bg-red-50 p-4">
              <h3 className="mb-2 font-medium text-red-800">❌ Avoid</h3>
              <ul className="space-y-1 text-sm text-red-700">
                <li>• Overloading popovers with too much content</li>
                <li>• Using for primary navigation</li>
                <li>• Nesting multiple popovers</li>
                <li>• Auto-opening without user interaction</li>
                <li>• Blocking essential content</li>
                <li>• Forgetting mobile/touch considerations</li>
                <li>• Using for critical alerts</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
