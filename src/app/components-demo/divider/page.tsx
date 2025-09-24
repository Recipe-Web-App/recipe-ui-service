'use client';

import React, { useState } from 'react';
import {
  Divider,
  DividerWithText,
  DividerWithIcon,
  RecipeDivider,
  SectionDivider,
} from '@/components/ui/divider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Star,
  Heart,
  ChefHat,
  Utensils,
  Clock,
  Leaf,
  Scale,
  Package,
  Info,
  Sparkles,
  Zap,
} from 'lucide-react';

export default function DividerDemo() {
  const [selectedOrientation, setSelectedOrientation] = useState<
    'horizontal' | 'vertical'
  >('horizontal');
  const [selectedStyle, setSelectedStyle] = useState<
    'solid' | 'dashed' | 'dotted' | 'double'
  >('solid');
  const [selectedWeight, setSelectedWeight] = useState<
    'thin' | 'normal' | 'thick'
  >('thin');
  const [selectedColor, setSelectedColor] = useState<
    'default' | 'primary' | 'secondary' | 'accent'
  >('default');
  const [selectedSpacing, setSelectedSpacing] = useState<
    'tight' | 'normal' | 'loose'
  >('normal');
  const [recipeSection, setRecipeSection] = useState<
    'ingredients' | 'instructions' | 'nutrition'
  >('ingredients');
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set()
  );

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <Package className="text-primary h-8 w-8" />
          <h1 className="text-3xl font-bold">Divider Component</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Horizontal and vertical separators with recipe-specific variants and
          decorative options.
        </p>
        <div className="mt-3 flex gap-2">
          <Badge variant="secondary">8 variants</Badge>
          <Badge variant="secondary">Recipe-specific</Badge>
          <Badge variant="secondary">Accessible</Badge>
        </div>
      </div>

      {/* Interactive Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Interactive Divider Playground
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Orientation
              </label>
              <select
                value={selectedOrientation}
                onChange={e =>
                  setSelectedOrientation(
                    e.target.value as 'horizontal' | 'vertical'
                  )
                }
                className="bg-background w-full rounded border px-3 py-2"
              >
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Style</label>
              <select
                value={selectedStyle}
                onChange={e =>
                  setSelectedStyle(
                    e.target.value as 'solid' | 'dashed' | 'dotted' | 'double'
                  )
                }
                className="bg-background w-full rounded border px-3 py-2"
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
                <option value="double">Double</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Weight</label>
              <select
                value={selectedWeight}
                onChange={e =>
                  setSelectedWeight(
                    e.target.value as 'thin' | 'normal' | 'thick'
                  )
                }
                className="bg-background w-full rounded border px-3 py-2"
              >
                <option value="thin">Thin</option>
                <option value="normal">Normal</option>
                <option value="thick">Thick</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Color</label>
              <select
                value={selectedColor}
                onChange={e =>
                  setSelectedColor(
                    e.target.value as
                      | 'default'
                      | 'primary'
                      | 'secondary'
                      | 'accent'
                  )
                }
                className="bg-background w-full rounded border px-3 py-2"
              >
                <option value="default">Default</option>
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="accent">Accent</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Spacing</label>
              <select
                value={selectedSpacing}
                onChange={e =>
                  setSelectedSpacing(
                    e.target.value as 'tight' | 'normal' | 'loose'
                  )
                }
                className="bg-background w-full rounded border px-3 py-2"
              >
                <option value="tight">Tight</option>
                <option value="normal">Normal</option>
                <option value="loose">Loose</option>
              </select>
            </div>
          </div>

          <div className="bg-muted/20 rounded-lg border p-6">
            <p className="text-muted-foreground mb-4 text-sm">Live Preview:</p>
            {selectedOrientation === 'horizontal' ? (
              <div className="space-y-4">
                <p>Content above the divider</p>
                <Divider
                  orientation={selectedOrientation}
                  style={selectedStyle}
                  weight={selectedWeight}
                  color={selectedColor}
                  spacing={selectedSpacing}
                />
                <p>Content below the divider</p>
              </div>
            ) : (
              <div className="flex h-32 items-center gap-4">
                <div>Left Content</div>
                <Divider
                  orientation={selectedOrientation}
                  style={selectedStyle}
                  weight={selectedWeight}
                  color={selectedColor}
                  spacing={selectedSpacing}
                />
                <div>Right Content</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Basic Dividers */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Dividers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Horizontal Dividers</h3>
            <div className="space-y-4">
              <div>
                <p className="text-muted-foreground mb-2 text-sm">
                  Default (Thin)
                </p>
                <Divider />
              </div>

              <div>
                <p className="text-muted-foreground mb-2 text-sm">
                  Normal Weight
                </p>
                <Divider weight="normal" />
              </div>

              <div>
                <p className="text-muted-foreground mb-2 text-sm">Thick</p>
                <Divider weight="thick" />
              </div>

              <div>
                <p className="text-muted-foreground mb-2 text-sm">
                  Primary Color
                </p>
                <Divider color="primary" />
              </div>

              <div>
                <p className="text-muted-foreground mb-2 text-sm">
                  Dashed Style
                </p>
                <Divider style="dashed" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Vertical Dividers</h3>
            <div className="flex h-20 items-center gap-4">
              <div className="text-center">
                <p className="text-sm">Left</p>
              </div>
              <Divider orientation="vertical" />
              <div className="text-center">
                <p className="text-sm">Center</p>
              </div>
              <Divider orientation="vertical" weight="normal" />
              <div className="text-center">
                <p className="text-sm">Right</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dividers with Text */}
      <Card>
        <CardHeader>
          <CardTitle>Dividers with Text</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-6">
            <div>
              <p className="text-muted-foreground mb-2 text-sm">Center Text</p>
              <DividerWithText text="OR" />
            </div>

            <div>
              <p className="text-muted-foreground mb-2 text-sm">
                Start Position
              </p>
              <DividerWithText text="Beginning" textPosition="start" />
            </div>

            <div>
              <p className="text-muted-foreground mb-2 text-sm">End Position</p>
              <DividerWithText text="End" textPosition="end" />
            </div>

            <div>
              <p className="text-muted-foreground mb-2 text-sm">
                Custom Styling
              </p>
              <DividerWithText
                text="FEATURED RECIPES"
                textProps={{
                  size: 'sm',
                  weight: 'semibold',
                  transform: 'uppercase',
                  color: 'primary',
                }}
                dividerProps={{ color: 'primary' }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dividers with Icons */}
      <Card>
        <CardHeader>
          <CardTitle>Dividers with Icons</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-6">
            <div>
              <p className="text-muted-foreground mb-2 text-sm">Star Icon</p>
              <DividerWithIcon icon={<Star className="h-4 w-4" />} />
            </div>

            <div>
              <p className="text-muted-foreground mb-2 text-sm">
                Heart Icon (Start)
              </p>
              <DividerWithIcon
                icon={<Heart className="h-4 w-4" />}
                textPosition="start"
              />
            </div>

            <div>
              <p className="text-muted-foreground mb-2 text-sm">
                Chef Icon (Filled)
              </p>
              <DividerWithIcon
                icon={<ChefHat className="h-5 w-5" />}
                iconProps={{
                  size: 'lg',
                  variant: 'filled',
                }}
              />
            </div>

            <div>
              <p className="text-muted-foreground mb-2 text-sm">
                Sparkles Icon (Outline)
              </p>
              <DividerWithIcon
                icon={<Sparkles className="h-5 w-5" />}
                iconProps={{
                  size: 'lg',
                  variant: 'outline',
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recipe-Specific Dividers */}
      <Card>
        <CardHeader>
          <CardTitle>Recipe-Specific Dividers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Recipe Section
            </label>
            <select
              value={recipeSection}
              onChange={e =>
                setRecipeSection(
                  e.target.value as 'ingredients' | 'instructions' | 'nutrition'
                )
              }
              className="bg-background mb-4 w-full max-w-xs rounded border px-3 py-2"
            >
              <option value="ingredients">Ingredients</option>
              <option value="instructions">Instructions</option>
              <option value="nutrition">Nutrition</option>
            </select>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-muted-foreground mb-2 text-sm">
                Ingredient Group
              </p>
              <RecipeDivider context="ingredient-group" />
            </div>

            <div>
              <p className="text-muted-foreground mb-2 text-sm">
                Instruction Step
              </p>
              <RecipeDivider context="instruction-step" />
            </div>

            <div>
              <p className="text-muted-foreground mb-2 text-sm">
                Nutrition Group
              </p>
              <RecipeDivider context="nutrition-group" />
            </div>

            <div>
              <p className="text-muted-foreground mb-2 text-sm">
                Recipe Section
              </p>
              <RecipeDivider context="recipe-section" />
            </div>

            <div>
              <p className="text-muted-foreground mb-2 text-sm">With Label</p>
              <RecipeDivider
                context="ingredient-group"
                label="Wet Ingredients"
                showLabel
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Dividers */}
      <Card>
        <CardHeader>
          <CardTitle>Section Dividers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-8">
            <SectionDivider
              section="ingredients"
              title="Ingredients"
              subtitle="Everything you need for this recipe"
              icon={<Leaf className="h-4 w-4" />}
              collapsible
              defaultCollapsed={collapsedSections.has('ingredients')}
              onToggleCollapse={collapsed => {
                if (collapsed) {
                  setCollapsedSections(
                    prev => new Set([...prev, 'ingredients'])
                  );
                } else {
                  setCollapsedSections(prev => {
                    const newSet = new Set(prev);
                    newSet.delete('ingredients');
                    return newSet;
                  });
                }
              }}
            />

            <SectionDivider
              section="instructions"
              title="Instructions"
              subtitle="Step-by-step cooking guide"
              icon={<Utensils className="h-4 w-4" />}
              collapsible
              defaultCollapsed={collapsedSections.has('instructions')}
              onToggleCollapse={collapsed => {
                if (collapsed) {
                  setCollapsedSections(
                    prev => new Set([...prev, 'instructions'])
                  );
                } else {
                  setCollapsedSections(prev => {
                    const newSet = new Set(prev);
                    newSet.delete('instructions');
                    return newSet;
                  });
                }
              }}
            />

            <SectionDivider
              section="nutrition"
              title="Nutrition Information"
              subtitle="Per serving"
              icon={<Scale className="h-4 w-4" />}
            />

            <SectionDivider
              section="metadata"
              title="Recipe Details"
              subtitle="Prep time, cook time, and servings"
              icon={<Clock className="h-4 w-4" />}
            />
          </div>
        </CardContent>
      </Card>

      {/* Recipe Layout Example */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Recipe Layout Example</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-2xl space-y-6">
            <h2 className="text-2xl font-bold">Chocolate Chip Cookies</h2>

            <SectionDivider
              section="metadata"
              title="Recipe Info"
              icon={<Info className="h-4 w-4" />}
            />

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <span className="text-muted-foreground text-sm">Prep Time</span>
                <p className="font-semibold">15 min</p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">Cook Time</span>
                <p className="font-semibold">12 min</p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">Servings</span>
                <p className="font-semibold">24</p>
              </div>
            </div>

            <SectionDivider
              section="ingredients"
              title="Ingredients"
              icon={<Leaf className="h-4 w-4" />}
            />

            <div className="space-y-3">
              <p>• 2¼ cups all-purpose flour</p>
              <p>• 1 tsp baking soda</p>
              <p>• 1 tsp salt</p>

              <RecipeDivider
                context="ingredient-group"
                label="Wet Ingredients"
                showLabel
              />

              <p>• 1 cup butter, softened</p>
              <p>• ¾ cup granulated sugar</p>
              <p>• ¾ cup brown sugar, packed</p>
              <p>• 2 large eggs</p>
              <p>• 2 tsp vanilla extract</p>

              <RecipeDivider
                context="ingredient-group"
                label="Mix-ins"
                showLabel
              />

              <p>• 2 cups chocolate chips</p>
              <p>• 1 cup chopped walnuts (optional)</p>
            </div>

            <SectionDivider
              section="instructions"
              title="Instructions"
              icon={<Utensils className="h-4 w-4" />}
            />

            <div className="space-y-4">
              <div>
                <p className="font-medium">1. Preheat and prepare</p>
                <p className="text-muted-foreground">
                  Preheat oven to 375°F (190°C). Line baking sheets with
                  parchment paper.
                </p>
              </div>

              <RecipeDivider context="instruction-step" />

              <div>
                <p className="font-medium">2. Mix dry ingredients</p>
                <p className="text-muted-foreground">
                  In a medium bowl, whisk together flour, baking soda, and salt.
                </p>
              </div>

              <RecipeDivider context="instruction-step" />

              <div>
                <p className="font-medium">3. Cream butter and sugars</p>
                <p className="text-muted-foreground">
                  In a large bowl, cream together butter and both sugars until
                  light and fluffy.
                </p>
              </div>

              <RecipeDivider context="instruction-step" />

              <div>
                <p className="font-medium">4. Add eggs and vanilla</p>
                <p className="text-muted-foreground">
                  Beat in eggs one at a time, then add vanilla extract.
                </p>
              </div>
            </div>

            <SectionDivider
              section="nutrition"
              title="Nutrition"
              subtitle="Per cookie"
              icon={<Scale className="h-4 w-4" />}
            />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span>Calories</span>
                <span className="font-medium">180</span>
              </div>
              <div className="flex justify-between">
                <span>Total Fat</span>
                <span className="font-medium">8g</span>
              </div>

              <RecipeDivider context="nutrition-group" />

              <div className="flex justify-between">
                <span>Total Carbs</span>
                <span className="font-medium">26g</span>
              </div>
              <div className="flex justify-between">
                <span>Protein</span>
                <span className="font-medium">2g</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Code Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted rounded-lg p-4 font-mono text-sm">
            <p className="text-muted-foreground mb-2">Basic divider:</p>
            <code>{`<Divider />`}</code>
          </div>

          <div className="bg-muted rounded-lg p-4 font-mono text-sm">
            <p className="text-muted-foreground mb-2">With text:</p>
            <code>{`<DividerWithText text="OR" />`}</code>
          </div>

          <div className="bg-muted rounded-lg p-4 font-mono text-sm">
            <p className="text-muted-foreground mb-2">Recipe section:</p>
            <code>{`<RecipeDivider context="ingredient-group" label="Wet Ingredients" showLabel />`}</code>
          </div>

          <div className="bg-muted rounded-lg p-4 font-mono text-sm">
            <p className="text-muted-foreground mb-2">Section with icon:</p>
            <code>{`<SectionDivider section="ingredients" title="Ingredients" icon={<Leaf />} />`}</code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
