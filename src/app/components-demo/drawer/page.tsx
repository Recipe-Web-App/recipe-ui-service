'use client';

import React, { useState } from 'react';
import {
  Drawer,
  DrawerTrigger,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  NavigationDrawer,
  RecipeDrawer,
  MobileMenuDrawer,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/ui/icon';
import type {
  NavigationItem,
  DrawerIngredient,
  DrawerInstruction,
  ShoppingListItem,
} from '@/types/ui/drawer';

export default function DrawerDemoPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [basicDrawerOpen, setBasicDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [recipeDrawerOpen, setRecipeDrawerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Copy to clipboard function
  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Navigation items for demo
  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'home',
      href: '/dashboard',
      isActive: true,
    },
    {
      id: 'recipes',
      label: 'My Recipes',
      icon: 'book-open',
      href: '/recipes',
      badge: '24',
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: 'heart',
      href: '/favorites',
    },
    {
      id: 'meal-plans',
      label: 'Meal Plans',
      icon: 'calendar',
      href: '/meal-plans',
      children: [
        {
          id: 'weekly',
          label: 'Weekly Plans',
          href: '/meal-plans/weekly',
        },
        {
          id: 'monthly',
          label: 'Monthly Plans',
          href: '/meal-plans/monthly',
        },
      ],
    },
    {
      id: 'shopping',
      label: 'Shopping Lists',
      icon: 'shopping-cart',
      href: '/shopping',
      badge: '3',
    },
    {
      id: 'collections',
      label: 'Collections',
      icon: 'folder',
      href: '/collections',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'settings',
      href: '/settings',
    },
  ];

  // Sample recipe ingredients
  const recipeIngredients: DrawerIngredient[] = [
    {
      id: '1',
      name: 'Spaghetti pasta',
      amount: 1,
      unit: 'lb',
      category: 'Pantry',
      isChecked: true,
    },
    {
      id: '2',
      name: 'Pancetta',
      amount: 6,
      unit: 'oz',
      notes: 'diced',
      category: 'Meat',
      isChecked: false,
    },
    {
      id: '3',
      name: 'Large eggs',
      amount: 4,
      unit: 'whole',
      notes: 'room temperature',
      category: 'Dairy',
      isChecked: false,
    },
    {
      id: '4',
      name: 'Parmesan cheese',
      amount: 1,
      unit: 'cup',
      notes: 'freshly grated',
      category: 'Dairy',
      isChecked: false,
    },
    {
      id: '5',
      name: 'Black pepper',
      amount: 1,
      unit: 'tsp',
      notes: 'freshly cracked',
      category: 'Spices',
      isChecked: true,
    },
  ];

  // Sample cooking instructions
  const cookingInstructions: DrawerInstruction[] = [
    {
      id: 'step1',
      stepNumber: 1,
      instruction:
        'Heat a large pot of salted water over high heat. While water is heating, prepare your ingredients.',
      duration: 5,
      isCompleted: true,
    },
    {
      id: 'step2',
      stepNumber: 2,
      instruction:
        'Add pasta to the boiling water and cook according to package directions until al dente.',
      duration: 10,
      isCompleted: false,
      notes: 'Reserve 1 cup of pasta water before draining',
    },
    {
      id: 'step3',
      stepNumber: 3,
      instruction:
        'While pasta cooks, heat a large skillet over medium heat. Add pancetta and cook until crispy.',
      duration: 7,
      isCompleted: false,
    },
    {
      id: 'step4',
      stepNumber: 4,
      instruction:
        'In a large bowl, whisk together egg yolks, grated Parmesan, and black pepper.',
      duration: 3,
      isCompleted: false,
    },
  ];

  // Sample shopping list
  const shoppingList: ShoppingListItem[] = [
    {
      id: '1',
      name: 'Ground beef',
      quantity: 2,
      unit: 'lbs',
      category: 'Meat',
      isChecked: false,
      recipeId: 'bolognese',
      recipeName: 'Classic Bolognese',
    },
    {
      id: '2',
      name: 'Heavy cream',
      quantity: 1,
      unit: 'cup',
      category: 'Dairy',
      isChecked: true,
      recipeId: 'carbonara',
      recipeName: 'Pasta Carbonara',
    },
    {
      id: '3',
      name: 'Basil leaves',
      quantity: 1,
      unit: 'bunch',
      category: 'Produce',
      isChecked: false,
      recipeId: 'margherita',
      recipeName: 'Margherita Pizza',
    },
  ];

  const handleIngredientCheck = (ingredientId: string, checked: boolean) => {
    console.log(`Ingredient ${ingredientId} checked: ${checked}`);
  };

  const handleInstructionComplete = (
    instructionId: string,
    completed: boolean
  ) => {
    console.log(`Instruction ${instructionId} completed: ${completed}`);
  };

  const handleShoppingItemCheck = (itemId: string, checked: boolean) => {
    console.log(`Shopping item ${itemId} checked: ${checked}`);
  };

  const handleNavigationItemClick = (item: NavigationItem) => {
    console.log('Navigation item clicked:', item);
  };

  return (
    <div className="w-full max-w-none space-y-12 px-4 py-8">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-4xl font-bold">Drawer System</h1>
        <p className="text-muted-foreground text-lg">
          Off-canvas panels for navigation, content display, and recipe
          management
        </p>
      </div>

      {/* Quick Start Examples */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Quick Start Examples</h2>
        <div className="bg-card rounded-lg border p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Basic Drawer */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Drawer</h3>
              <Drawer open={basicDrawerOpen} onOpenChange={setBasicDrawerOpen}>
                <DrawerTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Open Basic Drawer
                  </Button>
                </DrawerTrigger>
                <DrawerOverlay />
                <DrawerContent position="right" size="md" showClose>
                  <DrawerHeader>
                    <DrawerTitle>Basic Drawer</DrawerTitle>
                    <DrawerDescription>
                      A simple drawer with header, body, and footer
                    </DrawerDescription>
                  </DrawerHeader>
                  <DrawerBody>
                    <div className="space-y-4">
                      <p>
                        This is a basic drawer example with standard content
                        layout.
                      </p>
                      <Input placeholder="Enter some text..." />
                      <p className="text-muted-foreground text-sm">
                        You can include any content here - forms, lists, or
                        other components.
                      </p>
                    </div>
                  </DrawerBody>
                  <DrawerFooter>
                    <Button onClick={() => setBasicDrawerOpen(false)}>
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setBasicDrawerOpen(false)}
                    >
                      Cancel
                    </Button>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>

              <pre
                className="bg-muted hover:bg-muted/80 cursor-pointer rounded p-2 text-xs"
                onClick={() =>
                  copyToClipboard(`<Drawer open={open} onOpenChange={setOpen}>
  <DrawerTrigger asChild>
    <Button>Open Drawer</Button>
  </DrawerTrigger>
  <DrawerOverlay />
  <DrawerContent position="right" size="md">
    <DrawerHeader>
      <DrawerTitle>Title</DrawerTitle>
    </DrawerHeader>
    <DrawerBody>
      {/* Content */}
    </DrawerBody>
  </DrawerContent>
</Drawer>`)
                }
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    copyToClipboard(`<Drawer open={open} onOpenChange={setOpen}>
  <DrawerTrigger asChild>
    <Button>Open Drawer</Button>
  </DrawerTrigger>
  <DrawerOverlay />
  <DrawerContent position="right" size="md">
    <DrawerHeader>
      <DrawerTitle>Title</DrawerTitle>
    </DrawerHeader>
    <DrawerBody>
      {/* Content */}
    </DrawerBody>
  </DrawerContent>
</Drawer>`);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label="Copy basic drawer code"
              >
                {`<Drawer open={open} onOpenChange={setOpen}>
  <DrawerTrigger asChild>
    <Button>Open Drawer</Button>
  </DrawerTrigger>
  <DrawerOverlay />
  <DrawerContent position="right" size="md">
    <DrawerHeader>
      <DrawerTitle>Title</DrawerTitle>
    </DrawerHeader>
    <DrawerBody>
      {/* Content */}
    </DrawerBody>
  </DrawerContent>
</Drawer>`}
              </pre>
            </div>

            {/* Navigation Drawer */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Navigation Drawer</h3>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setNavDrawerOpen(true)}
              >
                Open Navigation
              </Button>
              <NavigationDrawer
                open={navDrawerOpen}
                onOpenChange={setNavDrawerOpen}
                items={navigationItems}
                activeItemId="dashboard"
                showProfile
                showClose
                userProfile={{
                  name: 'John Chef',
                  email: 'john@example.com',
                  avatar: '/avatar.jpg',
                }}
                onItemClick={handleNavigationItemClick}
              />

              <pre
                className="bg-muted hover:bg-muted/80 cursor-pointer rounded p-2 text-xs"
                onClick={() =>
                  copyToClipboard(`<NavigationDrawer
  open={open}
  onOpenChange={setOpen}
  items={navigationItems}
  activeItemId="dashboard"
  showProfile
  userProfile={userProfile}
  onItemClick={handleItemClick}
>
  <DrawerTrigger asChild>
    <Button>Menu</Button>
  </DrawerTrigger>
</NavigationDrawer>`)
                }
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    copyToClipboard(`<NavigationDrawer
  open={open}
  onOpenChange={setOpen}
  items={navigationItems}
  activeItemId="dashboard"
  showProfile
  userProfile={userProfile}
  onItemClick={handleItemClick}
>
  <DrawerTrigger asChild>
    <Button>Menu</Button>
  </DrawerTrigger>
</NavigationDrawer>`);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label="Copy navigation drawer code"
              >
                {`<NavigationDrawer
  open={open}
  onOpenChange={setOpen}
  items={navigationItems}
  activeItemId="dashboard"
  showProfile
  userProfile={userProfile}
  onItemClick={handleItemClick}
>
  <DrawerTrigger asChild>
    <Button>Menu</Button>
  </DrawerTrigger>
</NavigationDrawer>`}
              </pre>
            </div>

            {/* Recipe Drawer */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Recipe Drawer</h3>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setRecipeDrawerOpen(true)}
              >
                Recipe Details
              </Button>
              <RecipeDrawer
                open={recipeDrawerOpen}
                onOpenChange={setRecipeDrawerOpen}
                position="right"
                size="lg"
                recipeTitle="Pasta Carbonara"
                ingredients={recipeIngredients}
                instructions={cookingInstructions}
                showIngredientChecklist
                showInstructionProgress
                showClose
                onIngredientCheck={handleIngredientCheck}
                onInstructionComplete={handleInstructionComplete}
              />

              <pre
                className="bg-muted hover:bg-muted/80 cursor-pointer rounded p-2 text-xs"
                onClick={() =>
                  copyToClipboard(`<RecipeDrawer
  open={open}
  onOpenChange={setOpen}
  recipeTitle="Pasta Carbonara"
  ingredients={ingredients}
  instructions={instructions}
  showIngredientChecklist
  onIngredientCheck={handleCheck}
>
  <DrawerTrigger asChild>
    <Button>Recipe</Button>
  </DrawerTrigger>
</RecipeDrawer>`)
                }
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    copyToClipboard(`<RecipeDrawer
  open={open}
  onOpenChange={setOpen}
  recipeTitle="Pasta Carbonara"
  ingredients={ingredients}
  instructions={instructions}
  showIngredientChecklist
  onIngredientCheck={handleCheck}
>
  <DrawerTrigger asChild>
    <Button>Recipe</Button>
  </DrawerTrigger>
</RecipeDrawer>`);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label="Copy recipe drawer code"
              >
                {`<RecipeDrawer
  open={open}
  onOpenChange={setOpen}
  recipeTitle="Pasta Carbonara"
  ingredients={ingredients}
  instructions={instructions}
  showIngredientChecklist
  onIngredientCheck={handleCheck}
>
  <DrawerTrigger asChild>
    <Button>Recipe</Button>
  </DrawerTrigger>
</RecipeDrawer>`}
              </pre>
            </div>

            {/* Mobile Menu Drawer */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Mobile Menu</h3>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setMobileMenuOpen(true)}
              >
                Mobile Menu
              </Button>
              <MobileMenuDrawer
                open={mobileMenuOpen}
                onOpenChange={setMobileMenuOpen}
                items={navigationItems}
                showSearch
                searchPlaceholder="Search recipes..."
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                showNotifications
                notificationCount={5}
                showProfile
                showClose
                userProfile={{
                  name: 'John Chef',
                  email: 'john@example.com',
                }}
                onItemClick={handleNavigationItemClick}
              />

              <pre
                className="bg-muted hover:bg-muted/80 cursor-pointer rounded p-2 text-xs"
                onClick={() =>
                  copyToClipboard(`<MobileMenuDrawer
  open={open}
  onOpenChange={setOpen}
  items={navigationItems}
  showSearch
  showNotifications
  notificationCount={5}
  onItemClick={handleItemClick}
>
  <DrawerTrigger asChild>
    <Button>Menu</Button>
  </DrawerTrigger>
</MobileMenuDrawer>`)
                }
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    copyToClipboard(`<MobileMenuDrawer
  open={open}
  onOpenChange={setOpen}
  items={navigationItems}
  showSearch
  showNotifications
  notificationCount={5}
  onItemClick={handleItemClick}
>
  <DrawerTrigger asChild>
    <Button>Menu</Button>
  </DrawerTrigger>
</MobileMenuDrawer>`);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label="Copy mobile menu drawer code"
              >
                {`<MobileMenuDrawer
  open={open}
  onOpenChange={setOpen}
  items={navigationItems}
  showSearch
  showNotifications
  notificationCount={5}
  onItemClick={handleItemClick}
>
  <DrawerTrigger asChild>
    <Button>Menu</Button>
  </DrawerTrigger>
</MobileMenuDrawer>`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Position Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Position Variants</h2>
        <div className="bg-card rounded-lg border p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {(['left', 'right', 'top', 'bottom'] as const).map(position => (
              <div key={position} className="space-y-2">
                <h3 className="font-medium capitalize">{position} Drawer</h3>
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant="outline" className="w-full">
                      Open {position}
                    </Button>
                  </DrawerTrigger>
                  <DrawerOverlay />
                  <DrawerContent position={position} size="sm" showClose>
                    <DrawerHeader>
                      <DrawerTitle>{position} Drawer</DrawerTitle>
                      <DrawerDescription>
                        Drawer positioned on the {position}
                      </DrawerDescription>
                    </DrawerHeader>
                    <DrawerBody>
                      <p>
                        This drawer slides in from the {position} side of the
                        screen.
                      </p>
                    </DrawerBody>
                  </DrawerContent>
                </Drawer>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Size Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Size Variants</h2>
        <div className="bg-card rounded-lg border p-6">
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            {(['xs', 'sm', 'md', 'lg', 'xl', 'full'] as const).map(size => (
              <div key={size} className="space-y-2">
                <h3 className="font-medium">{size.toUpperCase()}</h3>
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full">
                      {size.toUpperCase()}
                    </Button>
                  </DrawerTrigger>
                  <DrawerOverlay />
                  <DrawerContent position="right" size={size} showClose>
                    <DrawerHeader>
                      <DrawerTitle>{size.toUpperCase()} Drawer</DrawerTitle>
                      <DrawerDescription>
                        Size variant: {size}
                      </DrawerDescription>
                    </DrawerHeader>
                    <DrawerBody>
                      <p>This drawer uses the {size} size variant.</p>
                    </DrawerBody>
                  </DrawerContent>
                </Drawer>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recipe-Specific Examples */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Recipe-Specific Examples</h2>
        <div className="bg-card rounded-lg border p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Ingredients Checklist */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Ingredients Checklist</h3>
              <RecipeDrawer
                recipeTitle="Pasta Carbonara"
                ingredients={recipeIngredients}
                showIngredientChecklist
                onIngredientCheck={handleIngredientCheck}
                type="ingredients"
              >
                <DrawerTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Icon name="shopping-cart" className="mr-2 h-4 w-4" />
                    View Ingredients
                  </Button>
                </DrawerTrigger>
              </RecipeDrawer>

              <pre
                className="bg-muted hover:bg-muted/80 cursor-pointer rounded p-2 text-xs"
                onClick={() =>
                  copyToClipboard(`<RecipeDrawer
  recipeTitle="Pasta Carbonara"
  ingredients={ingredients}
  showIngredientChecklist
  onIngredientCheck={handleCheck}
  type="ingredients"
>
  <DrawerTrigger asChild>
    <Button variant="outline">
      <Icon name="shopping-cart" />
      View Ingredients
    </Button>
  </DrawerTrigger>
</RecipeDrawer>`)
                }
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    copyToClipboard(`<RecipeDrawer
  recipeTitle="Pasta Carbonara"
  ingredients={ingredients}
  showIngredientChecklist
  onIngredientCheck={handleCheck}
  type="ingredients"
>
  <DrawerTrigger asChild>
    <Button variant="outline">
      <Icon name="shopping-cart" />
      View Ingredients
    </Button>
  </DrawerTrigger>
</RecipeDrawer>`);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label="Copy ingredients drawer code"
              >
                {`<RecipeDrawer
  recipeTitle="Pasta Carbonara"
  ingredients={ingredients}
  showIngredientChecklist
  onIngredientCheck={handleCheck}
  type="ingredients"
>
  <DrawerTrigger asChild>
    <Button variant="outline">
      <Icon name="shopping-cart" />
      View Ingredients
    </Button>
  </DrawerTrigger>
</RecipeDrawer>`}
              </pre>
            </div>

            {/* Cooking Instructions */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Cooking Instructions</h3>
              <RecipeDrawer
                recipeTitle="Pasta Carbonara"
                instructions={cookingInstructions}
                showInstructionProgress
                onInstructionComplete={handleInstructionComplete}
                type="instructions"
              >
                <DrawerTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Icon name="list" className="mr-2 h-4 w-4" />
                    View Instructions
                  </Button>
                </DrawerTrigger>
              </RecipeDrawer>

              <pre
                className="bg-muted hover:bg-muted/80 cursor-pointer rounded p-2 text-xs"
                onClick={() =>
                  copyToClipboard(`<RecipeDrawer
  recipeTitle="Pasta Carbonara"
  instructions={instructions}
  showInstructionProgress
  onInstructionComplete={handleComplete}
  type="instructions"
>
  <DrawerTrigger asChild>
    <Button variant="outline">
      <Icon name="list" />
      View Instructions
    </Button>
  </DrawerTrigger>
</RecipeDrawer>`)
                }
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    copyToClipboard(`<RecipeDrawer
  recipeTitle="Pasta Carbonara"
  instructions={instructions}
  showInstructionProgress
  onInstructionComplete={handleComplete}
  type="instructions"
>
  <DrawerTrigger asChild>
    <Button variant="outline">
      <Icon name="list" />
      View Instructions
    </Button>
  </DrawerTrigger>
</RecipeDrawer>`);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label="Copy instructions drawer code"
              >
                {`<RecipeDrawer
  recipeTitle="Pasta Carbonara"
  instructions={instructions}
  showInstructionProgress
  onInstructionComplete={handleComplete}
  type="instructions"
>
  <DrawerTrigger asChild>
    <Button variant="outline">
      <Icon name="list" />
      View Instructions
    </Button>
  </DrawerTrigger>
</RecipeDrawer>`}
              </pre>
            </div>

            {/* Shopping List */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Shopping List</h3>
              <RecipeDrawer
                shoppingList={shoppingList}
                onShoppingItemCheck={handleShoppingItemCheck}
                type="shopping"
              >
                <DrawerTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Icon name="check" className="mr-2 h-4 w-4" />
                    Shopping List
                  </Button>
                </DrawerTrigger>
              </RecipeDrawer>

              <pre
                className="bg-muted hover:bg-muted/80 cursor-pointer rounded p-2 text-xs"
                onClick={() =>
                  copyToClipboard(`<RecipeDrawer
  shoppingList={shoppingList}
  onShoppingItemCheck={handleCheck}
  type="shopping"
>
  <DrawerTrigger asChild>
    <Button variant="outline">
      <Icon name="check-square" />
      Shopping List
    </Button>
  </DrawerTrigger>
</RecipeDrawer>`)
                }
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    copyToClipboard(`<RecipeDrawer
  shoppingList={shoppingList}
  onShoppingItemCheck={handleCheck}
  type="shopping"
>
  <DrawerTrigger asChild>
    <Button variant="outline">
      <Icon name="check-square" />
      Shopping List
    </Button>
  </DrawerTrigger>
</RecipeDrawer>`);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label="Copy shopping list drawer code"
              >
                {`<RecipeDrawer
  shoppingList={shoppingList}
  onShoppingItemCheck={handleCheck}
  type="shopping"
>
  <DrawerTrigger asChild>
    <Button variant="outline">
      <Icon name="check-square" />
      Shopping List
    </Button>
  </DrawerTrigger>
</RecipeDrawer>`}
              </pre>
            </div>

            {/* Recipe Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Recipe Notes</h3>
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Icon name="file-text" className="mr-2 h-4 w-4" />
                    Recipe Notes
                  </Button>
                </DrawerTrigger>
                <DrawerOverlay />
                <DrawerContent position="right" size="md" showClose>
                  <DrawerHeader>
                    <DrawerTitle>Recipe Notes & Tips</DrawerTitle>
                    <DrawerDescription>
                      Personal notes and cooking tips for Pasta Carbonara
                    </DrawerDescription>
                  </DrawerHeader>
                  <DrawerBody variant="padded">
                    <div className="space-y-4">
                      <div className="rounded-lg border p-4">
                        <h4 className="mb-2 font-medium">Chef&apos;s Tips</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Use room temperature eggs for best results</li>
                          <li>• Don&apos;t add oil to the pancetta</li>
                          <li>• Work quickly when combining ingredients</li>
                        </ul>
                      </div>
                      <div className="rounded-lg border p-4">
                        <h4 className="mb-2 font-medium">Personal Notes</h4>
                        <p className="text-muted-foreground text-sm">
                          Add your personal notes and modifications here...
                        </p>
                      </div>
                    </div>
                  </DrawerBody>
                  <DrawerFooter>
                    <Button size="sm">Save Notes</Button>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </div>
      </section>

      {/* Copy Feedback */}
      {copiedCode && (
        <div className="fixed right-4 bottom-4 rounded-lg bg-green-600 px-4 py-2 text-white shadow-lg">
          Code copied to clipboard!
        </div>
      )}

      {/* Usage Guidelines */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Usage Guidelines</h2>
        <div className="bg-card rounded-lg border p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-lg font-medium">Best Practices</h3>
              <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                <li>Use appropriate drawer positions for content type</li>
                <li>Keep drawer content focused and scannable</li>
                <li>Provide clear close mechanisms</li>
                <li>Use overlay for modal-like behavior</li>
                <li>Support keyboard navigation and escape key</li>
                <li>Consider mobile responsive behavior</li>
                <li>Use consistent sizing across similar drawers</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-medium">Recipe App Patterns</h3>
              <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                <li>NavigationDrawer for main app navigation</li>
                <li>RecipeDrawer for ingredient lists and instructions</li>
                <li>MobileMenuDrawer for responsive navigation</li>
                <li>Use shopping list patterns for ingredient tracking</li>
                <li>Include progress indicators for cooking steps</li>
                <li>Support offline functionality for cooking mode</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* API Reference */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">API Reference</h2>
        <div className="bg-card rounded-lg border p-6">
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-medium">Drawer Props</h3>
              <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                <li>
                  <code>open</code> - Controls drawer open state
                </li>
                <li>
                  <code>onOpenChange</code> - Callback when open state changes
                </li>
                <li>
                  <code>showOverlay</code> - Whether to show background overlay
                </li>
                <li>
                  <code>closeOnOverlayClick</code> - Close when overlay clicked
                </li>
                <li>
                  <code>closeOnEscape</code> - Close when escape key pressed
                </li>
                <li>
                  <code>preventScroll</code> - Prevent body scrolling when open
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 font-medium">DrawerContent Props</h3>
              <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                <li>
                  <code>position</code> - left, right, top, bottom
                </li>
                <li>
                  <code>size</code> - xs, sm, md, lg, xl, full
                </li>
                <li>
                  <code>variant</code> - default, elevated, minimal, overlay
                </li>
                <li>
                  <code>showClose</code> - Show close button in header
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 font-medium">NavigationDrawer Props</h3>
              <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                <li>
                  <code>items</code> - Array of navigation items
                </li>
                <li>
                  <code>activeItemId</code> - Currently active item ID
                </li>
                <li>
                  <code>showProfile</code> - Show user profile section
                </li>
                <li>
                  <code>userProfile</code> - User profile data
                </li>
                <li>
                  <code>onItemClick</code> - Navigation item click handler
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 font-medium">RecipeDrawer Props</h3>
              <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                <li>
                  <code>recipeTitle</code> - Recipe title to display
                </li>
                <li>
                  <code>ingredients</code> - Array of recipe ingredients
                </li>
                <li>
                  <code>instructions</code> - Array of cooking instructions
                </li>
                <li>
                  <code>shoppingList</code> - Array of shopping list items
                </li>
                <li>
                  <code>showIngredientChecklist</code> - Enable ingredient
                  checking
                </li>
                <li>
                  <code>showInstructionProgress</code> - Show instruction
                  progress
                </li>
                <li>
                  <code>type</code> - ingredients, instructions, shopping, notes
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
