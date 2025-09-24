'use client';

import React, { useState } from 'react';
import {
  Collapse,
  CollapseTrigger,
  CollapseContent,
  RecipeCollapse,
  KitchenTipsCollapse,
  FAQCollapse,
  IngredientNotesCollapse,
  CollapseGroup,
} from '@/components/ui/collapse';
import { Button } from '@/components/ui/button';
import {
  ChefHat,
  Clock,
  Users,
  Scale,
  Thermometer,
  Timer,
  AlertTriangle,
  Utensils,
  BookOpen,
  Heart,
} from 'lucide-react';

export default function CollapseDemo() {
  const [basicOpen, setBasicOpen] = useState(false);
  const [controlledOpen, setControlledOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(
    'ingredients'
  );
  const [groupOpenItems, setGroupOpenItems] = useState<number[]>([0]);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-foreground mb-2 text-3xl font-bold">
          Collapse Component
        </h1>
        <p className="text-muted-foreground text-lg">
          Utility component for expanding/collapsing content with smooth
          animation. Perfect for recipe sections, FAQ items, cooking tips, and
          other collapsible content with full accessibility support.
        </p>
      </div>

      <div className="space-y-8">
        {/* Basic Usage */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Basic Collapse</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Simple collapse with trigger and content components.
          </p>
          <div className="space-y-4">
            <Collapse>
              <CollapseTrigger>What ingredients do I need?</CollapseTrigger>
              <CollapseContent>
                <div className="space-y-2">
                  <p>
                    You&apos;ll need the following ingredients for this recipe:
                  </p>
                  <ul className="ml-4 list-inside list-disc space-y-1">
                    <li>2 cups all-purpose flour</li>
                    <li>1 teaspoon salt</li>
                    <li>1/2 cup cold butter, cubed</li>
                    <li>4-6 tablespoons ice water</li>
                  </ul>
                </div>
              </CollapseContent>
            </Collapse>

            <Collapse trigger="How long does this take to make?">
              <CollapseContent>
                <div className="space-y-2">
                  <p>
                    <strong>Total time:</strong> 45 minutes
                  </p>
                  <p>
                    <strong>Prep time:</strong> 15 minutes
                  </p>
                  <p>
                    <strong>Cook time:</strong> 30 minutes
                  </p>
                  <p>
                    <strong>Difficulty:</strong> Intermediate
                  </p>
                </div>
              </CollapseContent>
            </Collapse>

            <Collapse defaultOpen>
              <CollapseTrigger>Open by default</CollapseTrigger>
              <CollapseContent>
                <p>
                  This collapse is open by default. You can set any collapse to
                  be initially expanded using the <code>defaultOpen</code> prop.
                </p>
              </CollapseContent>
            </Collapse>
          </div>
        </div>

        {/* Variants */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Collapse Variants</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Different visual styles for various contexts and layouts.
          </p>
          <div className="space-y-4">
            <Collapse variant="default">
              <CollapseTrigger>Default Variant</CollapseTrigger>
              <CollapseContent>
                <p>
                  Default variant with standard styling and white background.
                </p>
              </CollapseContent>
            </Collapse>

            <Collapse variant="outlined">
              <CollapseTrigger>Outlined Variant</CollapseTrigger>
              <CollapseContent>
                <p>
                  Outlined variant with a more prominent border and transparent
                  background.
                </p>
              </CollapseContent>
            </Collapse>

            <Collapse variant="elevated">
              <CollapseTrigger>Elevated Variant</CollapseTrigger>
              <CollapseContent>
                <p>
                  Elevated variant with shadow for added depth and visual
                  hierarchy.
                </p>
              </CollapseContent>
            </Collapse>

            <Collapse variant="minimal">
              <CollapseTrigger>Minimal Variant</CollapseTrigger>
              <CollapseContent>
                <p>
                  Minimal variant with no borders or background - perfect for
                  simple layouts.
                </p>
              </CollapseContent>
            </Collapse>

            <Collapse variant="card">
              <CollapseTrigger>Card Variant</CollapseTrigger>
              <CollapseContent>
                <p>
                  Card variant with subtle background color for better content
                  separation.
                </p>
              </CollapseContent>
            </Collapse>
          </div>
        </div>

        {/* Sizes */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Collapse Sizes</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Three sizes with different spacing and typography scales.
          </p>
          <div className="space-y-4">
            <Collapse size="sm" variant="outlined">
              <CollapseTrigger>Small Size</CollapseTrigger>
              <CollapseContent>
                <p>
                  Small size with compact spacing - ideal for sidebar content or
                  tight layouts.
                </p>
              </CollapseContent>
            </Collapse>

            <Collapse size="default" variant="outlined">
              <CollapseTrigger>Default Size</CollapseTrigger>
              <CollapseContent>
                <p>
                  Default size with standard spacing - perfect for most use
                  cases.
                </p>
              </CollapseContent>
            </Collapse>

            <Collapse size="lg" variant="outlined">
              <CollapseTrigger>Large Size</CollapseTrigger>
              <CollapseContent>
                <p>
                  Large size with generous spacing - great for prominent content
                  sections.
                </p>
              </CollapseContent>
            </Collapse>
          </div>
        </div>

        {/* Controlled State */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Controlled Collapse</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Control collapse state externally with buttons or other components.
          </p>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                onClick={() => setBasicOpen(!basicOpen)}
                variant="outline"
                size="sm"
              >
                {basicOpen ? 'Hide' : 'Show'} Basic Info
              </Button>
              <Button
                onClick={() => setControlledOpen(!controlledOpen)}
                variant="outline"
                size="sm"
              >
                {controlledOpen ? 'Hide' : 'Show'} Advanced Info
              </Button>
            </div>

            <Collapse
              open={basicOpen}
              onOpenChange={setBasicOpen}
              variant="outlined"
            >
              <CollapseTrigger>Basic Recipe Information</CollapseTrigger>
              <CollapseContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Servings:</strong> 8 portions
                  </div>
                  <div>
                    <strong>Prep Time:</strong> 15 minutes
                  </div>
                  <div>
                    <strong>Cook Time:</strong> 25 minutes
                  </div>
                  <div>
                    <strong>Difficulty:</strong> Easy
                  </div>
                </div>
              </CollapseContent>
            </Collapse>

            <Collapse
              open={controlledOpen}
              onOpenChange={setControlledOpen}
              variant="outlined"
            >
              <CollapseTrigger>Advanced Recipe Details</CollapseTrigger>
              <CollapseContent>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Equipment needed:</strong> Large mixing bowl, whisk,
                    measuring cups
                  </p>
                  <p>
                    <strong>Make-ahead:</strong> Can be prepared up to 2 days in
                    advance
                  </p>
                  <p>
                    <strong>Storage:</strong> Store covered in refrigerator for
                    up to 5 days
                  </p>
                  <p>
                    <strong>Variations:</strong> Add herbs, cheese, or
                    vegetables for different flavors
                  </p>
                </div>
              </CollapseContent>
            </Collapse>
          </div>
        </div>

        {/* Custom Icons and Triggers */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Custom Icons & Triggers</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Customize triggers with different icons, positions, and animations.
          </p>
          <div className="space-y-4">
            <Collapse variant="outlined">
              <CollapseTrigger
                icon={<ChefHat className="h-4 w-4" />}
                iconPosition="left"
                showIcon={false}
              >
                <div className="flex items-center gap-2">
                  <ChefHat className="h-4 w-4" />
                  <span>Chef&apos;s Special Techniques</span>
                </div>
              </CollapseTrigger>
              <CollapseContent>
                <p>
                  Learn professional techniques from experienced chefs to
                  elevate your cooking.
                </p>
              </CollapseContent>
            </Collapse>

            <Collapse variant="outlined">
              <CollapseTrigger
                icon={<Clock className="h-4 w-4" />}
                animationSpeed="fast"
              >
                Quick Timing Tips (Fast Animation)
              </CollapseTrigger>
              <CollapseContent animationSpeed="fast">
                <p>
                  Time-saving tips and techniques for efficient cooking. This
                  content animates quickly.
                </p>
              </CollapseContent>
            </Collapse>

            <Collapse variant="outlined">
              <CollapseTrigger
                icon={<Users className="h-4 w-4" />}
                animationSpeed="slow"
              >
                Serving Suggestions (Slow Animation)
              </CollapseTrigger>
              <CollapseContent animationSpeed="slow">
                <p>
                  Ideas for presenting and serving your finished dish. This
                  content animates slowly.
                </p>
              </CollapseContent>
            </Collapse>

            <Collapse variant="outlined">
              <CollapseTrigger showIcon={false}>
                No Icon Example
              </CollapseTrigger>
              <CollapseContent>
                <p>
                  This collapse has no icon for a cleaner, minimalist
                  appearance.
                </p>
              </CollapseContent>
            </Collapse>
          </div>
        </div>

        {/* Recipe-Specific Components */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">
            Recipe-Specific Collapses
          </h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Pre-configured collapses for common recipe sections with automatic
            styling.
          </p>
          <div className="space-y-4">
            <RecipeCollapse
              section="ingredients"
              count={8}
              estimatedTime="5 min prep"
              open={activeSection === 'ingredients'}
              onOpenChange={open =>
                open ? setActiveSection('ingredients') : setActiveSection(null)
              }
            >
              <CollapseTrigger>Ingredients</CollapseTrigger>
              <CollapseContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>2 cups all-purpose flour</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>1 teaspoon salt</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>1/2 cup cold butter, cubed</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>4-6 tablespoons ice water</span>
                  </li>
                </ul>
              </CollapseContent>
            </RecipeCollapse>

            <RecipeCollapse
              section="instructions"
              count={6}
              estimatedTime="20 min"
              open={activeSection === 'instructions'}
              onOpenChange={open =>
                open ? setActiveSection('instructions') : setActiveSection(null)
              }
            >
              <CollapseTrigger>Instructions</CollapseTrigger>
              <CollapseContent>
                <ol className="space-y-3">
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white">
                      1
                    </span>
                    <span>Mix flour and salt in a large bowl.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white">
                      2
                    </span>
                    <span>
                      Cut in cold butter until mixture resembles coarse crumbs.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white">
                      3
                    </span>
                    <span>
                      Gradually add ice water, mixing until dough forms.
                    </span>
                  </li>
                </ol>
              </CollapseContent>
            </RecipeCollapse>

            <RecipeCollapse
              section="equipment"
              count={4}
              open={activeSection === 'equipment'}
              onOpenChange={open =>
                open ? setActiveSection('equipment') : setActiveSection(null)
              }
            >
              <CollapseTrigger>Required Equipment</CollapseTrigger>
              <CollapseContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Scale className="h-4 w-4 text-gray-500" />
                    <span>Large mixing bowl</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Utensils className="h-4 w-4 text-gray-500" />
                    <span>Pastry cutter or two knives</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-gray-500" />
                    <span>Rolling pin</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-gray-500" />
                    <span>9-inch pie pan</span>
                  </li>
                </ul>
              </CollapseContent>
            </RecipeCollapse>

            <RecipeCollapse
              section="nutrition"
              count={8}
              open={activeSection === 'nutrition'}
              onOpenChange={open =>
                open ? setActiveSection('nutrition') : setActiveSection(null)
              }
            >
              <CollapseTrigger>Nutrition Information</CollapseTrigger>
              <CollapseContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Calories</span>
                      <span className="font-medium">220</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Fat</span>
                      <span className="font-medium">12g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturated Fat</span>
                      <span className="font-medium">7g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cholesterol</span>
                      <span className="font-medium">30mg</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Sodium</span>
                      <span className="font-medium">400mg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Carbs</span>
                      <span className="font-medium">24g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dietary Fiber</span>
                      <span className="font-medium">1g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Protein</span>
                      <span className="font-medium">3g</span>
                    </div>
                  </div>
                </div>
              </CollapseContent>
            </RecipeCollapse>
          </div>
        </div>

        {/* Kitchen Tips */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Kitchen Tips Collapse</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Specialized collapses for cooking tips with difficulty indicators
            and time estimates.
          </p>
          <div className="space-y-4">
            <KitchenTipsCollapse
              tipType="technique"
              difficulty="beginner"
              estimatedTime="2 min"
            >
              <CollapseTrigger>How to measure flour correctly</CollapseTrigger>
              <CollapseContent>
                <p className="text-sm">
                  Spoon flour into your measuring cup and level off with a
                  knife. Don&apos;t pack it down or scoop directly from the
                  container, as this can result in too much flour and a dense
                  final product.
                </p>
              </CollapseContent>
            </KitchenTipsCollapse>

            <KitchenTipsCollapse
              tipType="technique"
              difficulty="intermediate"
              estimatedTime="5 min"
              proTip
            >
              <CollapseTrigger>Creating the perfect pie crust</CollapseTrigger>
              <CollapseContent>
                <div className="space-y-3 text-sm">
                  <p>
                    The secret to flaky pie crust is keeping everything cold and
                    not overworking the dough.
                  </p>
                  <ul className="ml-4 list-inside list-disc space-y-1">
                    <li>Chill your bowl and utensils beforehand</li>
                    <li>Use very cold butter or even freeze it briefly</li>
                    <li>Add ice water gradually - you might not need it all</li>
                    <li>Stop mixing as soon as the dough comes together</li>
                  </ul>
                </div>
              </CollapseContent>
            </KitchenTipsCollapse>

            <KitchenTipsCollapse
              tipType="safety"
              difficulty="beginner"
              estimatedTime="1 min"
            >
              <CollapseTrigger>Oven safety reminder</CollapseTrigger>
              <CollapseContent>
                <div className="rounded border-l-4 border-red-400 bg-red-50 p-3 text-sm">
                  <p className="mb-1 font-medium text-red-800">
                    <AlertTriangle className="mr-1 inline h-4 w-4" />
                    Safety First
                  </p>
                  <p className="text-red-700">
                    Always use oven mitts when handling hot pans and
                    double-check that your oven is turned off when finished
                    baking.
                  </p>
                </div>
              </CollapseContent>
            </KitchenTipsCollapse>
          </div>
        </div>

        {/* FAQ Examples */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">FAQ Collapse</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Specialized collapses for frequently asked questions with featured
            highlighting.
          </p>
          <div className="space-y-4">
            <FAQCollapse
              question="How long can I store this pie crust?"
              category="storage"
              featured
            >
              <CollapseContent>
                <p className="text-sm">
                  Unbaked pie crust dough can be stored in the refrigerator for
                  up to 3 days or frozen for up to 3 months. Wrap tightly in
                  plastic wrap to prevent drying out.
                </p>
              </CollapseContent>
            </FAQCollapse>

            <FAQCollapse
              question="Can I make this gluten-free?"
              category="substitutions"
            >
              <CollapseContent>
                <p className="text-sm">
                  Yes! You can substitute the all-purpose flour with a 1:1
                  gluten-free flour blend. The texture may be slightly
                  different, but it will still taste great. Add an extra
                  tablespoon of ice water if needed.
                </p>
              </CollapseContent>
            </FAQCollapse>

            <FAQCollapse
              question="Why is my pie crust tough?"
              category="cooking"
            >
              <CollapseContent>
                <div className="space-y-2 text-sm">
                  <p>
                    A tough pie crust usually results from one of these issues:
                  </p>
                  <ul className="ml-4 list-inside list-disc space-y-1">
                    <li>Overworking the dough (develops too much gluten)</li>
                    <li>Using too much water</li>
                    <li>Not keeping ingredients cold enough</li>
                    <li>Rolling the dough too aggressively</li>
                  </ul>
                  <p>
                    Remember: gentle handling is key to tender, flaky pastry!
                  </p>
                </div>
              </CollapseContent>
            </FAQCollapse>
          </div>
        </div>

        {/* Ingredient Notes */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">
            Ingredient Notes Collapse
          </h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Specialized collapses for ingredient substitutions and important
            notes.
          </p>
          <div className="space-y-4">
            <IngredientNotesCollapse
              ingredient="Butter"
              noteType="substitution"
              importance="high"
            >
              <CollapseTrigger>Butter substitutions</CollapseTrigger>
              <CollapseContent>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Best substitutes for butter in pie crust:</strong>
                  </p>
                  <ul className="ml-4 list-inside list-disc space-y-1">
                    <li>
                      <strong>Shortening:</strong> Creates very flaky crust (use
                      same amount)
                    </li>
                    <li>
                      <strong>Cold lard:</strong> Traditional choice, excellent
                      flavor (1:1 ratio)
                    </li>
                    <li>
                      <strong>Vegan butter:</strong> Good plant-based option
                      (use same amount)
                    </li>
                  </ul>
                  <div className="mt-2 rounded bg-amber-50 p-2 text-amber-700">
                    <strong>Note:</strong> Avoid regular margarine as it
                    contains too much water.
                  </div>
                </div>
              </CollapseContent>
            </IngredientNotesCollapse>

            <IngredientNotesCollapse
              ingredient="All-purpose flour"
              noteType="quality"
              importance="medium"
            >
              <CollapseTrigger>Flour quality tips</CollapseTrigger>
              <CollapseContent>
                <p className="text-sm">
                  For best results, use unbleached all-purpose flour. The
                  protein content should be around 10-12% for optimal texture.
                  Store flour in an airtight container and use within 6-8 months
                  for freshest flavor.
                </p>
              </CollapseContent>
            </IngredientNotesCollapse>

            <IngredientNotesCollapse
              ingredient="Eggs"
              noteType="allergen"
              importance="high"
              allergenWarning
            >
              <CollapseTrigger>Egg allergy information</CollapseTrigger>
              <CollapseContent>
                <div className="text-sm">
                  <div className="mb-3 border-l-4 border-red-400 bg-red-50 p-3">
                    <p className="font-medium text-red-800">
                      <AlertTriangle className="mr-1 inline h-4 w-4" />
                      Contains Eggs
                    </p>
                    <p className="text-red-700">
                      This recipe contains eggs. Please inform anyone with egg
                      allergies.
                    </p>
                  </div>
                  <p>
                    <strong>Egg-free substitutes:</strong>
                  </p>
                  <ul className="ml-4 list-inside list-disc space-y-1">
                    <li>1 egg = 1/4 cup unsweetened applesauce</li>
                    <li>
                      1 egg = 1 tbsp ground flaxseed + 3 tbsp water (let sit 5
                      min)
                    </li>
                    <li>1 egg = 1/4 cup mashed banana</li>
                  </ul>
                </div>
              </CollapseContent>
            </IngredientNotesCollapse>
          </div>
        </div>

        {/* Collapse Groups */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Collapse Groups</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Manage multiple related collapses with accordion-style behavior or
            allow multiple open.
          </p>

          <div className="space-y-8">
            <div>
              <h4 className="mb-3 font-medium">
                Allow Multiple Open (Default)
              </h4>
              <CollapseGroup spacing="normal" allowMultiple>
                <Collapse variant="outlined">
                  <CollapseTrigger>Recipe Overview</CollapseTrigger>
                  <CollapseContent>
                    <p className="text-sm">
                      This classic pie crust recipe creates a tender, flaky base
                      perfect for both sweet and savory pies.
                    </p>
                  </CollapseContent>
                </Collapse>
                <Collapse variant="outlined">
                  <CollapseTrigger>Preparation Tips</CollapseTrigger>
                  <CollapseContent>
                    <p className="text-sm">
                      Keep all ingredients cold, work quickly, and don&apos;t
                      overwork the dough for best results.
                    </p>
                  </CollapseContent>
                </Collapse>
                <Collapse variant="outlined">
                  <CollapseTrigger>Storage Instructions</CollapseTrigger>
                  <CollapseContent>
                    <p className="text-sm">
                      Wrapped dough keeps in the fridge for 3 days or freezer
                      for 3 months.
                    </p>
                  </CollapseContent>
                </Collapse>
              </CollapseGroup>
            </div>

            <div>
              <h4 className="mb-3 font-medium">
                Accordion Style (Single Open)
              </h4>
              <CollapseGroup
                spacing="tight"
                allowMultiple={false}
                openItems={groupOpenItems}
                onOpenItemsChange={setGroupOpenItems}
              >
                <Collapse variant="outlined">
                  <CollapseTrigger>Beginner Level</CollapseTrigger>
                  <CollapseContent>
                    <p className="text-sm">
                      Perfect for first-time pie makers. Includes detailed
                      step-by-step instructions and helpful tips.
                    </p>
                  </CollapseContent>
                </Collapse>
                <Collapse variant="outlined">
                  <CollapseTrigger>Intermediate Level</CollapseTrigger>
                  <CollapseContent>
                    <p className="text-sm">
                      For those comfortable with basic techniques. Includes
                      variations and advanced tips for perfect results.
                    </p>
                  </CollapseContent>
                </Collapse>
                <Collapse variant="outlined">
                  <CollapseTrigger>Advanced Level</CollapseTrigger>
                  <CollapseContent>
                    <p className="text-sm">
                      Professional techniques including decorative edges,
                      lattice work, and troubleshooting common issues.
                    </p>
                  </CollapseContent>
                </Collapse>
              </CollapseGroup>
            </div>
          </div>
        </div>

        {/* Animation & Customization */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">
            Animation & Customization
          </h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Customize animation speeds, durations, and disable smooth
            transitions.
          </p>
          <div className="space-y-4">
            <Collapse variant="outlined" animationDuration={150}>
              <CollapseTrigger animationSpeed="fast">
                Fast Animation (150ms)
              </CollapseTrigger>
              <CollapseContent animationSpeed="fast">
                <p>This collapse animates quickly for snappy interactions.</p>
              </CollapseContent>
            </Collapse>

            <Collapse variant="outlined" animationDuration={300}>
              <CollapseTrigger animationSpeed="normal">
                Normal Animation (300ms)
              </CollapseTrigger>
              <CollapseContent animationSpeed="normal">
                <p>This collapse uses the default animation speed.</p>
              </CollapseContent>
            </Collapse>

            <Collapse variant="outlined" animationDuration={500}>
              <CollapseTrigger animationSpeed="slow">
                Slow Animation (500ms)
              </CollapseTrigger>
              <CollapseContent animationSpeed="slow">
                <p>This collapse animates slowly for a more dramatic effect.</p>
              </CollapseContent>
            </Collapse>

            <Collapse variant="outlined" smoothTransitions={false}>
              <CollapseTrigger>No Smooth Transitions</CollapseTrigger>
              <CollapseContent>
                <p>
                  This collapse has smooth transitions disabled for instant
                  show/hide.
                </p>
              </CollapseContent>
            </Collapse>
          </div>
        </div>

        {/* States */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Component States</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Different states for various use cases and user feedback.
          </p>
          <div className="space-y-4">
            <Collapse disabled variant="outlined">
              <CollapseTrigger>Disabled Collapse</CollapseTrigger>
              <CollapseContent>
                <p>
                  This content cannot be accessed because the collapse is
                  disabled.
                </p>
              </CollapseContent>
            </Collapse>

            <Collapse variant="outlined">
              <CollapseTrigger disabled>Disabled Trigger Only</CollapseTrigger>
              <CollapseContent>
                <p>The trigger is disabled but the collapse itself is not.</p>
              </CollapseContent>
            </Collapse>

            <Collapse variant="outlined">
              <CollapseTrigger>Force Mounted Content</CollapseTrigger>
              <CollapseContent forceMount>
                <p>
                  This content is always in the DOM even when collapsed (useful
                  for SEO).
                </p>
              </CollapseContent>
            </Collapse>
          </div>
        </div>

        {/* Interactive Example */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">
            Interactive Recipe Builder
          </h3>
          <p className="text-muted-foreground mb-6 text-sm">
            A practical example showing how collapse components work together in
            a real recipe interface.
          </p>
          <div className="space-y-4">
            <div className="mb-4 flex gap-2">
              <Button
                onClick={() => toggleSection('ingredients')}
                variant={
                  activeSection === 'ingredients' ? 'default' : 'outline'
                }
                size="sm"
              >
                <BookOpen className="mr-1 h-4 w-4" />
                Ingredients
              </Button>
              <Button
                onClick={() => toggleSection('instructions')}
                variant={
                  activeSection === 'instructions' ? 'default' : 'outline'
                }
                size="sm"
              >
                <Timer className="mr-1 h-4 w-4" />
                Instructions
              </Button>
              <Button
                onClick={() => toggleSection('nutrition')}
                variant={activeSection === 'nutrition' ? 'default' : 'outline'}
                size="sm"
              >
                <Heart className="mr-1 h-4 w-4" />
                Nutrition
              </Button>
            </div>

            <RecipeCollapse
              section="ingredients"
              count={4}
              open={activeSection === 'ingredients'}
              onOpenChange={open =>
                open ? setActiveSection('ingredients') : setActiveSection(null)
              }
            >
              <CollapseTrigger>Shopping List</CollapseTrigger>
              <CollapseContent>
                <div className="space-y-2">
                  {[
                    '2 cups flour',
                    '1 tsp salt',
                    '1/2 cup butter',
                    '4-6 tbsp ice water',
                  ].map((ingredient, index) => (
                    <label
                      key={index}
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">{ingredient}</span>
                    </label>
                  ))}
                </div>
              </CollapseContent>
            </RecipeCollapse>

            <RecipeCollapse
              section="instructions"
              count={6}
              open={activeSection === 'instructions'}
              onOpenChange={open =>
                open ? setActiveSection('instructions') : setActiveSection(null)
              }
            >
              <CollapseTrigger>Cooking Steps</CollapseTrigger>
              <CollapseContent>
                <div className="space-y-3">
                  {[
                    'Mix dry ingredients',
                    'Cut in cold butter',
                    'Add ice water gradually',
                    'Form dough gently',
                    'Wrap and chill',
                    'Roll out when ready',
                  ].map((instruction, index) => (
                    <div key={index} className="flex gap-3">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white">
                        {index + 1}
                      </span>
                      <span className="text-sm">{instruction}</span>
                    </div>
                  ))}
                </div>
              </CollapseContent>
            </RecipeCollapse>

            <RecipeCollapse
              section="nutrition"
              count={8}
              open={activeSection === 'nutrition'}
              onOpenChange={open =>
                open ? setActiveSection('nutrition') : setActiveSection(null)
              }
            >
              <CollapseTrigger>Nutritional Information</CollapseTrigger>
              <CollapseContent>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Calories</span>
                    <span className="font-medium">220</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fat</span>
                    <span className="font-medium">12g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Carbs</span>
                    <span className="font-medium">24g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Protein</span>
                    <span className="font-medium">3g</span>
                  </div>
                </div>
              </CollapseContent>
            </RecipeCollapse>
          </div>
        </div>
      </div>
    </div>
  );
}
