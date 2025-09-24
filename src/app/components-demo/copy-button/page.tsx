'use client';

import React, { useState } from 'react';
import {
  CopyButton,
  RecipeCopyButton,
  CopyButtonGroup,
} from '@/components/ui/copy-button';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

export default function CopyButtonDemo() {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customContent, setCustomContent] = useState('Custom text to copy');
  const [asyncLoading, setAsyncLoading] = useState(false);

  const sampleRecipe = {
    id: 'chocolate-chip-cookies-123',
    title: 'Perfect Chocolate Chip Cookies',
    url: 'https://example.com/recipes/chocolate-chip-cookies',
    ingredients: [
      { name: 'all-purpose flour', amount: '2¼', unit: 'cups' },
      { name: 'baking soda', amount: '1', unit: 'teaspoon' },
      { name: 'salt', amount: '1', unit: 'teaspoon' },
      { name: 'butter, softened', amount: '1', unit: 'cup' },
      { name: 'granulated sugar', amount: '¾', unit: 'cup' },
      { name: 'brown sugar, packed', amount: '¾', unit: 'cup' },
      { name: 'vanilla extract', amount: '2', unit: 'teaspoons' },
      { name: 'large eggs', amount: '2' },
      { name: 'chocolate chips', amount: '2', unit: 'cups' },
    ],
    instructions: [
      { step: 1, instruction: 'Preheat oven to 375°F (190°C).' },
      {
        step: 2,
        instruction: 'In a bowl, combine flour, baking soda, and salt.',
      },
      {
        step: 3,
        instruction:
          'In a large bowl, beat butter and both sugars until creamy.',
      },
      { step: 4, instruction: 'Beat in vanilla and eggs one at a time.' },
      { step: 5, instruction: 'Gradually add flour mixture and mix well.' },
      { step: 6, instruction: 'Stir in chocolate chips.' },
      {
        step: 7,
        instruction: 'Drop rounded tablespoons onto ungreased cookie sheets.',
      },
      { step: 8, instruction: 'Bake 9-11 minutes or until golden brown.' },
      {
        step: 9,
        instruction:
          'Cool on baking sheets for 2 minutes; remove to wire rack.',
      },
    ],
    nutrition: {
      calories: 180,
      protein: '2g',
      carbs: '25g',
      fat: '8g',
      fiber: '1g',
      sugar: '16g',
    },
    metadata: {
      servings: 48,
      prepTime: '15 min',
      cookTime: '11 min',
      difficulty: 'Easy',
      tags: ['dessert', 'cookies', 'baking', 'family-friendly'],
    },
  };

  const handleAsyncContent = async () => {
    setAsyncLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setAsyncLoading(false);
    return `Generated content at ${new Date().toLocaleTimeString()}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-foreground mb-2 text-3xl font-bold">
          CopyButton Component
        </h1>
        <p className="text-muted-foreground text-lg">
          One-click copy functionality for sharing recipes and content with
          visual feedback and accessibility features.
        </p>
      </div>

      <div className="space-y-8">
        {/* Interactive Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Interactive Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex flex-wrap gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showAdvanced}
                  onChange={e => setShowAdvanced(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Show Advanced Examples</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customContent}
                  onChange={e => setCustomContent(e.target.value)}
                  className="rounded border px-3 py-1 text-sm"
                  placeholder="Custom content to copy"
                />
                <CopyButton content={customContent} size="sm" variant="outline">
                  Copy Custom
                </CopyButton>
              </div>
            </div>

            <div className="space-y-6">
              {/* Basic Variants */}
              <div>
                <h4 className="mb-3 font-medium">Button Variants</h4>
                <div className="flex flex-wrap gap-3">
                  <CopyButton
                    content="Default variant content"
                    variant="default"
                  >
                    Default
                  </CopyButton>
                  <CopyButton
                    content="Secondary variant content"
                    variant="secondary"
                  >
                    Secondary
                  </CopyButton>
                  <CopyButton
                    content="Outline variant content"
                    variant="outline"
                  >
                    Outline
                  </CopyButton>
                  <CopyButton content="Ghost variant content" variant="ghost">
                    Ghost
                  </CopyButton>
                  <CopyButton content="Link variant content" variant="link">
                    Link
                  </CopyButton>
                  <CopyButton
                    content="Success variant content"
                    variant="success"
                  >
                    Success
                  </CopyButton>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h4 className="mb-3 font-medium">Sizes</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <CopyButton content="Small size content" size="sm">
                    Small
                  </CopyButton>
                  <CopyButton content="Default size content" size="default">
                    Default
                  </CopyButton>
                  <CopyButton content="Large size content" size="lg">
                    Large
                  </CopyButton>
                  <CopyButton
                    content="Icon only content"
                    size="icon"
                    iconOnly
                    copyLabel="Copy icon content"
                  />
                </div>
              </div>

              {/* Recipe Variants */}
              <div>
                <h4 className="mb-3 font-medium">Recipe-Specific Variants</h4>
                <div className="flex flex-wrap gap-3">
                  <CopyButton
                    content="2 cups flour\n1 cup sugar\n3 eggs"
                    recipe="ingredient"
                    variant="outline"
                  >
                    Ingredients
                  </CopyButton>
                  <CopyButton
                    content="1. Preheat oven\n2. Mix ingredients\n3. Bake"
                    recipe="instruction"
                    variant="outline"
                  >
                    Instructions
                  </CopyButton>
                  <CopyButton
                    content="https://example.com/recipe/123"
                    recipe="url"
                    variant="outline"
                  >
                    Recipe URL
                  </CopyButton>
                  <CopyButton
                    content="Calories: 250\nProtein: 12g\nCarbs: 35g"
                    recipe="nutrition"
                    variant="outline"
                  >
                    Nutrition
                  </CopyButton>
                </div>
              </div>

              {/* Icon Variants */}
              <div>
                <h4 className="mb-3 font-medium">Custom Icons</h4>
                <div className="flex flex-wrap gap-3">
                  <CopyButton
                    content="Share this recipe with friends!"
                    icon="share"
                    variant="outline"
                  >
                    Share Recipe
                  </CopyButton>
                  <CopyButton
                    content="https://example.com/recipe-link"
                    icon="external-link"
                    variant="outline"
                  >
                    Copy Link
                  </CopyButton>
                  <CopyButton
                    content="Save this for later"
                    icon="bookmark"
                    variant="outline"
                  >
                    Save Recipe
                  </CopyButton>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recipe Copy Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Recipe Copy Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Individual Recipe Components */}
              <div>
                <h4 className="mb-3 font-medium">Copy Recipe Components</h4>
                <CopyButtonGroup spacing="default" orientation="horizontal">
                  <RecipeCopyButton
                    recipe={sampleRecipe}
                    copyType="ingredients"
                    variant="outline"
                    size="sm"
                  >
                    📝 Ingredients
                  </RecipeCopyButton>
                  <RecipeCopyButton
                    recipe={sampleRecipe}
                    copyType="instructions"
                    variant="outline"
                    size="sm"
                  >
                    👩‍🍳 Instructions
                  </RecipeCopyButton>
                  <RecipeCopyButton
                    recipe={sampleRecipe}
                    copyType="nutrition"
                    variant="outline"
                    size="sm"
                  >
                    🏷️ Nutrition
                  </RecipeCopyButton>
                  <RecipeCopyButton
                    recipe={sampleRecipe}
                    copyType="recipe-url"
                    variant="outline"
                    size="sm"
                  >
                    🔗 Share URL
                  </RecipeCopyButton>
                </CopyButtonGroup>
              </div>

              {/* Complete Recipe */}
              <div>
                <h4 className="mb-3 font-medium">Copy Complete Recipe</h4>
                <RecipeCopyButton
                  recipe={sampleRecipe}
                  copyType="formatted-recipe"
                  variant="default"
                  successMessage="Complete recipe copied!"
                >
                  📄 Copy Full Recipe
                </RecipeCopyButton>
              </div>

              {/* Recipe Card Example */}
              <div className="bg-muted/50 rounded-lg border p-4">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h5 className="font-semibold">{sampleRecipe.title}</h5>
                    <p className="text-muted-foreground text-sm">
                      Serves {sampleRecipe.metadata?.servings} •{' '}
                      {sampleRecipe.metadata?.prepTime} prep •{' '}
                      {sampleRecipe.metadata?.cookTime} cook
                    </p>
                  </div>
                  <CopyButtonGroup spacing="sm">
                    <RecipeCopyButton
                      recipe={sampleRecipe}
                      copyType="recipe-url"
                      size="sm"
                      variant="ghost"
                      iconOnly
                      copyLabel="Share recipe URL"
                    />
                    <RecipeCopyButton
                      recipe={sampleRecipe}
                      copyType="formatted-recipe"
                      size="sm"
                      variant="outline"
                    >
                      Copy Recipe
                    </RecipeCopyButton>
                  </CopyButtonGroup>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Features */}
        {showAdvanced && (
          <Card>
            <CardHeader>
              <CardTitle>Advanced Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Async Content */}
                <div>
                  <h4 className="mb-3 font-medium">Async Content Loading</h4>
                  <CopyButton
                    content={handleAsyncContent}
                    loading={asyncLoading}
                    variant="outline"
                    onCopyStart={() => console.log('Copy started')}
                    onCopySuccess={content => console.log('Copied:', content)}
                    onCopyError={error => console.error('Copy failed:', error)}
                  >
                    {asyncLoading ? 'Generating...' : 'Copy Generated Content'}
                  </CopyButton>
                </div>

                {/* Custom Messages */}
                <div>
                  <h4 className="mb-3 font-medium">Custom Feedback Messages</h4>
                  <div className="flex flex-wrap gap-3">
                    <CopyButton
                      content="Recipe saved to clipboard!"
                      successMessage="Recipe copied! 🍪"
                      errorMessage="Oops! Copy failed 😞"
                      variant="outline"
                    >
                      Custom Success Message
                    </CopyButton>
                  </div>
                </div>

                {/* Content Transformation */}
                <div>
                  <h4 className="mb-3 font-medium">Content Transformation</h4>
                  <div className="flex flex-wrap gap-3">
                    <CopyButton
                      content="chocolate chip cookies recipe"
                      transformContent={content => content.toUpperCase()}
                      variant="outline"
                    >
                      Copy as UPPERCASE
                    </CopyButton>
                    <CopyButton
                      content="This is a very long recipe description that will be truncated to show only the first part..."
                      maxLength={30}
                      variant="outline"
                    >
                      Copy Truncated (30 chars)
                    </CopyButton>
                  </div>
                </div>

                {/* Custom Accessibility */}
                <div>
                  <h4 className="mb-3 font-medium">
                    Accessibility Customization
                  </h4>
                  <CopyButton
                    content="Accessibility enhanced content"
                    copyLabel="Copy this recipe content to your clipboard"
                    copyingLabel="Copying recipe content..."
                    successLabel="Recipe content successfully copied to clipboard"
                    errorLabel="Failed to copy recipe content"
                    variant="outline"
                  >
                    Enhanced A11y Labels
                  </CopyButton>
                </div>

                {/* Grouped Vertical */}
                <div>
                  <h4 className="mb-3 font-medium">Vertical Button Group</h4>
                  <CopyButtonGroup spacing="sm" orientation="vertical">
                    <CopyButton
                      content="Shopping list item 1"
                      variant="ghost"
                      size="sm"
                    >
                      📝 Shopping List
                    </CopyButton>
                    <CopyButton
                      content="Meal prep instructions"
                      variant="ghost"
                      size="sm"
                    >
                      🥘 Meal Prep Guide
                    </CopyButton>
                    <CopyButton
                      content="Recipe modifications"
                      variant="ghost"
                      size="sm"
                    >
                      ✏️ Recipe Notes
                    </CopyButton>
                  </CopyButtonGroup>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Usage Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Common Usage Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Shopping List Generator */}
              <div className="bg-muted/50 rounded-lg border p-4">
                <h4 className="mb-3 font-medium">Shopping List Generator</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">
                      Generate a shopping list from recipe ingredients
                    </p>
                  </div>
                  <RecipeCopyButton
                    recipe={sampleRecipe}
                    copyType="ingredients"
                    transformContent={ingredients =>
                      `🛒 Shopping List for ${sampleRecipe.title}\n\n${ingredients}\n\n✅ Generated from recipe app`
                    }
                    variant="outline"
                    size="sm"
                  >
                    Generate List
                  </RecipeCopyButton>
                </div>
              </div>

              {/* Social Sharing */}
              <div className="bg-muted/50 rounded-lg border p-4">
                <h4 className="mb-3 font-medium">Social Sharing</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">
                      Share recipe with friends and family
                    </p>
                  </div>
                  <CopyButton
                    content={`🍪 Just found this amazing ${sampleRecipe.title} recipe! Perfect for ${sampleRecipe.metadata?.difficulty?.toLowerCase()} baking. Check it out: ${sampleRecipe.url} #recipe #baking #homemade`}
                    icon="share"
                    variant="outline"
                    size="sm"
                    successMessage="Ready to share!"
                  >
                    Copy Share Text
                  </CopyButton>
                </div>
              </div>

              {/* Recipe Card Actions */}
              <div className="bg-muted/50 rounded-lg border p-4">
                <h4 className="mb-3 font-medium">Recipe Card Actions</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium">{sampleRecipe.title}</h5>
                    <p className="text-muted-foreground text-sm">
                      {sampleRecipe.metadata?.difficulty} •{' '}
                      {sampleRecipe.metadata?.prepTime} +{' '}
                      {sampleRecipe.metadata?.cookTime}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Save
                    </Button>
                    <RecipeCopyButton
                      recipe={sampleRecipe}
                      copyType="recipe-url"
                      size="sm"
                      variant="ghost"
                      iconOnly
                      copyLabel="Copy recipe URL"
                    />
                    <Button size="sm">View Recipe</Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Code Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Code Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
                <div className="text-muted-foreground mb-2">{`// Basic copy button`}</div>
                <div>{`<CopyButton content="Text to copy">`}</div>
                <div>{`  Copy Text`}</div>
                <div>{`</CopyButton>`}</div>
              </div>

              <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
                <div className="text-muted-foreground mb-2">{`// Recipe-specific copy`}</div>
                <div>{`<CopyButton.Recipe`}</div>
                <div>{`  recipe={recipeData}`}</div>
                <div>{`  copyType="ingredients"`}</div>
                <div>{`  variant="outline"`}</div>
                <div>{`  recipe="ingredient"`}</div>
                <div>{`>`}</div>
                <div>{`  Copy Ingredients`}</div>
                <div>{`</CopyButton.Recipe>`}</div>
              </div>

              <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
                <div className="text-muted-foreground mb-2">{`// Async content with callbacks`}</div>
                <div>{`<CopyButton`}</div>
                <div>{`  content={async () => await generateContent()}`}</div>
                <div>{`  onCopySuccess={(content) => toast.success('Copied!')}`}</div>
                <div>{`  onCopyError={(error) => toast.error('Failed!')}`}</div>
                <div>{`>`}</div>
                <div>{`  Copy Generated Content`}</div>
                <div>{`</CopyButton>`}</div>
              </div>

              <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
                <div className="text-muted-foreground mb-2">{`// Grouped copy buttons`}</div>
                <div>{`<CopyButton.Group spacing="default">`}</div>
                <div>{`  <CopyButton content="text1">Copy 1</CopyButton>`}</div>
                <div>{`  <CopyButton content="text2">Copy 2</CopyButton>`}</div>
                <div>{`  <CopyButton content="text3">Copy 3</CopyButton>`}</div>
                <div>{`</CopyButton.Group>`}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
