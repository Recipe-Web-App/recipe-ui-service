'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  RecipeTable,
  IngredientsTable,
  NutritionTable,
} from '@/components/ui/table';
import { ArrowLeft, Trash2, Edit3 } from 'lucide-react';
import Link from 'next/link';

export default function TableDemo() {
  const [selectedSize, setSelectedSize] = useState<'sm' | 'default' | 'lg'>(
    'default'
  );
  const [selectedVariant, setSelectedVariant] = useState<
    'default' | 'simple' | 'lined'
  >('default');
  const [striped, setStriped] = useState(false);
  const [hover, setHover] = useState(true);
  const [bordered, setBordered] = useState(false);

  // Sample data for basic table
  const basicData = [
    {
      id: 1,
      name: 'Chocolate Chip Cookies',
      category: 'Dessert',
      difficulty: 'Easy',
      time: '30 min',
    },
    {
      id: 2,
      name: 'Beef Stroganoff',
      category: 'Main Course',
      difficulty: 'Medium',
      time: '45 min',
    },
    {
      id: 3,
      name: 'Caesar Salad',
      category: 'Salad',
      difficulty: 'Easy',
      time: '15 min',
    },
    {
      id: 4,
      name: 'Chocolate Soufflé',
      category: 'Dessert',
      difficulty: 'Hard',
      time: '60 min',
    },
  ];

  const basicColumns = [
    { key: 'name' as const, header: 'Recipe Name', align: 'left' as const },
    { key: 'category' as const, header: 'Category', align: 'center' as const },
    {
      key: 'difficulty' as const,
      header: 'Difficulty',
      align: 'center' as const,
      render: (value: unknown) => (
        <Badge
          variant={
            value === 'Easy'
              ? 'success'
              : value === 'Medium'
                ? 'warning'
                : 'destructive'
          }
        >
          {String(value)}
        </Badge>
      ),
    },
    { key: 'time' as const, header: 'Cook Time', align: 'right' as const },
  ];

  // Sample ingredients data
  const ingredientsData = [
    {
      id: 1,
      name: 'All-purpose flour',
      amount: 2,
      unit: 'cups',
      category: 'Baking',
      notes: 'Sifted',
    },
    {
      id: 2,
      name: 'Vanilla extract',
      amount: 1,
      unit: 'tsp',
      category: 'Flavoring',
      optional: true,
    },
    {
      id: 3,
      name: 'Chocolate chips',
      amount: 1,
      unit: 'cup',
      category: 'Add-ins',
      notes: 'Semi-sweet preferred',
    },
    {
      id: 4,
      name: 'Salt',
      amount: 0.5,
      unit: 'tsp',
      category: 'Seasoning',
    },
  ];

  // Sample nutrition data
  const nutritionData = [
    {
      nutrient: 'Calories',
      amount: 250,
      unit: 'kcal',
      dailyValue: 12,
      category: 'macronutrient' as const,
    },
    {
      nutrient: 'Total Fat',
      amount: 12,
      unit: 'g',
      dailyValue: 15,
      category: 'macronutrient' as const,
    },
    {
      nutrient: 'Vitamin C',
      amount: 60,
      unit: 'mg',
      dailyValue: 67,
      category: 'vitamin' as const,
    },
    {
      nutrient: 'Iron',
      amount: 2.1,
      unit: 'mg',
      category: 'mineral' as const,
    },
  ];

  return (
    <div className="container mx-auto space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/components-demo">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Components
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Table Components</h1>
          <p className="mt-1 text-gray-600">
            Data tables with recipe-specific variants and configurations
          </p>
        </div>
      </div>

      {/* Configuration Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Table Configuration</CardTitle>
          <CardDescription>
            Customize the table appearance and behavior
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Size Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Size</label>
              <div className="flex gap-2">
                {(['sm', 'default', 'lg'] as const).map(size => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Variant Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Variant</label>
              <div className="flex gap-2">
                {(['default', 'simple', 'lined'] as const).map(variant => (
                  <Button
                    key={variant}
                    variant={
                      selectedVariant === variant ? 'default' : 'outline'
                    }
                    size="sm"
                    onClick={() => setSelectedVariant(variant)}
                  >
                    {variant}
                  </Button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Options</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="striped"
                    checked={striped}
                    onChange={e => setStriped(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="striped" className="text-sm">
                    Striped rows
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="hover"
                    checked={hover}
                    onChange={e => setHover(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="hover" className="text-sm">
                    Hover effects
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="bordered"
                    checked={bordered}
                    onChange={e => setBordered(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="bordered" className="text-sm">
                    Bordered
                  </label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Table Example */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Table</CardTitle>
          <CardDescription>
            Standard table with configurable variants and styles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table
            variant={selectedVariant}
            size={selectedSize}
            striped={striped}
            hover={hover}
            bordered={bordered}
          >
            <TableCaption>A list of sample recipes</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead align="left">Recipe Name</TableHead>
                <TableHead align="center">Category</TableHead>
                <TableHead align="center">Difficulty</TableHead>
                <TableHead align="right">Cook Time</TableHead>
                <TableHead align="center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {basicData.map(recipe => (
                <TableRow key={recipe.id}>
                  <TableCell variant="emphasized">{recipe.name}</TableCell>
                  <TableCell align="center">{recipe.category}</TableCell>
                  <TableCell align="center">
                    <Badge
                      variant={
                        recipe.difficulty === 'Easy'
                          ? 'success'
                          : recipe.difficulty === 'Medium'
                            ? 'warning'
                            : 'destructive'
                      }
                    >
                      {recipe.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell align="right" variant="numeric">
                    {recipe.time}
                  </TableCell>
                  <TableCell align="center">
                    <div className="flex justify-center gap-1">
                      <Button size="sm" variant="ghost">
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4}>Total Recipes</TableCell>
                <TableCell align="center">{basicData.length}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>

      {/* RecipeTable Component */}
      <Card>
        <CardHeader>
          <CardTitle>Recipe Table</CardTitle>
          <CardDescription>
            Specialized table component for displaying recipe data with
            interactive features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecipeTable
            data={basicData}
            columns={basicColumns}
            caption="Recipe collection with interactive rows"
            onRowClick={(recipe: Record<string, unknown>, index: number) => {
              alert(
                `Clicked on recipe: ${String(recipe.name)} (row ${index + 1})`
              );
            }}
          />
        </CardContent>
      </Card>

      {/* Ingredients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Ingredients Table</CardTitle>
          <CardDescription>
            Specialized table for displaying recipe ingredients with categories
            and notes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <h4 className="mb-2 font-medium">Basic Ingredients View</h4>
              <IngredientsTable ingredients={ingredientsData} />
            </div>

            <hr className="border-gray-200" />

            <div>
              <h4 className="mb-2 font-medium">With Categories and Notes</h4>
              <IngredientsTable
                ingredients={ingredientsData}
                showCategory={true}
                showNotes={true}
                onIngredientClick={(
                  ingredient: Record<string, unknown>,
                  index: number
                ) => {
                  alert(
                    `Clicked on ingredient: ${String(ingredient.name)} (row ${index + 1})`
                  );
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nutrition Table */}
      <Card>
        <CardHeader>
          <CardTitle>Nutrition Table</CardTitle>
          <CardDescription>
            Specialized table for displaying nutrition information with daily
            values and categories
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <h4 className="mb-2 font-medium">Basic Nutrition View</h4>
              <NutritionTable nutrition={nutritionData} />
            </div>

            <hr className="border-gray-200" />

            <div>
              <h4 className="mb-2 font-medium">With Categories</h4>
              <NutritionTable
                nutrition={nutritionData}
                showCategory={true}
                showDailyValue={true}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Variants Showcase */}
      <Card>
        <CardHeader>
          <CardTitle>Table Variants</CardTitle>
          <CardDescription>
            Different table styles and configurations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Simple Variant */}
          <div>
            <h4 className="mb-2 font-medium">Simple Variant</h4>
            <Table variant="simple">
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead align="right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Organic Flour</TableCell>
                  <TableCell align="right" variant="numeric">
                    $4.99
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Pure Vanilla</TableCell>
                  <TableCell align="right" variant="numeric">
                    $8.50
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <hr className="border-gray-200" />

          {/* Lined Variant */}
          <div>
            <h4 className="mb-2 font-medium">Lined Variant</h4>
            <Table variant="lined" bordered>
              <TableHeader>
                <TableRow>
                  <TableHead>Nutrient</TableHead>
                  <TableHead align="center">Amount</TableHead>
                  <TableHead align="center">% DV</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Protein</TableCell>
                  <TableCell align="center" variant="numeric">
                    8g
                  </TableCell>
                  <TableCell align="center" variant="numeric">
                    16%
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Fiber</TableCell>
                  <TableCell align="center" variant="numeric">
                    3g
                  </TableCell>
                  <TableCell align="center" variant="numeric">
                    11%
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Empty States */}
      <Card>
        <CardHeader>
          <CardTitle>Empty States</CardTitle>
          <CardDescription>
            How tables handle empty data gracefully
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="mb-2 font-medium">Empty Recipe Table</h4>
            <RecipeTable
              data={[]}
              columns={basicColumns}
              emptyMessage="No recipes found. Add your first recipe to get started!"
            />
          </div>

          <div>
            <h4 className="mb-2 font-medium">Empty Ingredients</h4>
            <IngredientsTable ingredients={[]} />
          </div>

          <div>
            <h4 className="mb-2 font-medium">Empty Nutrition Data</h4>
            <NutritionTable nutrition={[]} />
          </div>
        </CardContent>
      </Card>

      {/* Implementation Code Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Examples</CardTitle>
          <CardDescription>
            Code examples for using the table components
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <h4 className="mb-2 font-medium">Basic Table</h4>
            <pre className="overflow-x-auto text-sm text-gray-700">
              {`<Table variant="default" size="default" hover>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead align="right">Value</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Item 1</TableCell>
      <TableCell align="right">$10.00</TableCell>
    </TableRow>
  </TableBody>
</Table>`}
            </pre>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <h4 className="mb-2 font-medium">Recipe Table</h4>
            <pre className="overflow-x-auto text-sm text-gray-700">
              {`<RecipeTable
  data={recipes}
  columns={[
    { key: 'name', header: 'Recipe Name' },
    { key: 'category', header: 'Category', align: 'center' },
    {
      key: 'difficulty',
      header: 'Difficulty',
      render: (value) => <Badge>{value}</Badge>
    }
  ]}
  onRowClick={(recipe) => console.log(recipe)}
/>`}
            </pre>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <h4 className="mb-2 font-medium">Ingredients Table</h4>
            <pre className="overflow-x-auto text-sm text-gray-700">
              {`<IngredientsTable
  ingredients={ingredients}
  showCategory={true}
  showNotes={true}
  onIngredientClick={(ingredient) => editIngredient(ingredient)}
/>`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
