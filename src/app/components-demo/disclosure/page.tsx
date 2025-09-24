'use client';

import React, { useState } from 'react';
import {
  Disclosure,
  DisclosureTrigger,
  DisclosureContent,
  RecipeDisclosure,
  KitchenTipsDisclosure,
  FAQDisclosure,
  DisclosureGroup,
} from '@/components/ui/disclosure';
import { Button } from '@/components/ui/button';
import { HelpCircle, Lightbulb } from 'lucide-react';

export default function DisclosureDemo() {
  const [controlledOpen, setControlledOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-foreground mb-2 text-3xl font-bold">
          Disclosure Component
        </h1>
        <p className="text-muted-foreground text-lg">
          Simple toggle for showing/hiding single sections of content. Perfect
          for FAQ items, recipe notes, cooking tips, and other collapsible
          content.
        </p>
      </div>

      <div className="space-y-8">
        {/* Basic Usage */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Basic Usage</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Simple question and answer format with smooth expand/collapse
            animation.
          </p>
          <div className="space-y-4">
            <Disclosure>
              <DisclosureTrigger>
                What ingredients do I need for this recipe?
              </DisclosureTrigger>
              <DisclosureContent>
                <p className="text-sm text-gray-600">
                  This recipe requires: flour, eggs, milk, butter, salt, and
                  sugar. You can find detailed measurements in the recipe card
                  above. All ingredients should be at room temperature for best
                  results.
                </p>
              </DisclosureContent>
            </Disclosure>

            <Disclosure defaultOpen>
              <DisclosureTrigger>
                How long does this recipe take? (Open by default)
              </DisclosureTrigger>
              <DisclosureContent>
                <p className="text-sm text-gray-600">
                  Total time is approximately 45 minutes including prep and
                  cooking. Active cooking time is about 20 minutes, with 25
                  minutes of passive time.
                </p>
              </DisclosureContent>
            </Disclosure>
          </div>
        </div>

        {/* Variants */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Visual Variants</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Different visual styles for various contexts and design needs.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-medium">Default</p>
              <Disclosure variant="default">
                <DisclosureTrigger>Standard disclosure style</DisclosureTrigger>
                <DisclosureContent>
                  <p className="text-sm text-gray-600">
                    Clean white background with subtle border and shadow.
                  </p>
                </DisclosureContent>
              </Disclosure>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Outlined</p>
              <Disclosure variant="outlined">
                <DisclosureTrigger>Outlined border style</DisclosureTrigger>
                <DisclosureContent>
                  <p className="text-sm text-gray-600">
                    Transparent background with defined border.
                  </p>
                </DisclosureContent>
              </Disclosure>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Minimal</p>
              <Disclosure variant="minimal">
                <DisclosureTrigger>Clean minimal style</DisclosureTrigger>
                <DisclosureContent>
                  <p className="text-sm text-gray-600">
                    No borders or background - just content.
                  </p>
                </DisclosureContent>
              </Disclosure>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Elevated</p>
              <Disclosure variant="elevated">
                <DisclosureTrigger>Elevated shadow style</DisclosureTrigger>
                <DisclosureContent>
                  <p className="text-sm text-gray-600">
                    Enhanced shadow for prominent sections.
                  </p>
                </DisclosureContent>
              </Disclosure>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Card</p>
              <Disclosure variant="card">
                <DisclosureTrigger>Card background style</DisclosureTrigger>
                <DisclosureContent>
                  <p className="text-sm text-gray-600">
                    Subtle gray background for grouped content.
                  </p>
                </DisclosureContent>
              </Disclosure>
            </div>
          </div>
        </div>

        {/* Sizes */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Component Sizes</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Three sizes to fit different content hierarchies and layouts.
          </p>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium">Small</p>
              <Disclosure size="sm">
                <DisclosureTrigger>Quick tip for beginners</DisclosureTrigger>
                <DisclosureContent>
                  <p className="text-xs text-gray-600">
                    Always taste as you cook and adjust seasonings gradually.
                  </p>
                </DisclosureContent>
              </Disclosure>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Medium (Default)</p>
              <Disclosure size="md">
                <DisclosureTrigger>
                  Standard cooking instructions
                </DisclosureTrigger>
                <DisclosureContent>
                  <p className="text-sm text-gray-600">
                    Heat the pan over medium heat and add oil before adding
                    ingredients. This ensures even cooking and prevents
                    sticking.
                  </p>
                </DisclosureContent>
              </Disclosure>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Large</p>
              <Disclosure size="lg">
                <DisclosureTrigger>
                  Detailed technique explanation
                </DisclosureTrigger>
                <DisclosureContent>
                  <p className="text-base text-gray-600">
                    This advanced technique requires careful attention to
                    temperature and timing. Follow each step precisely and use
                    visual cues to determine doneness. Practice makes perfect
                    with this method.
                  </p>
                </DisclosureContent>
              </Disclosure>
            </div>
          </div>
        </div>

        {/* Icons and Positioning */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Icons and Positioning</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Customize icons and their positions to match your design needs.
          </p>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium">
                Default Chevron (Right)
              </p>
              <Disclosure>
                <DisclosureTrigger>Standard chevron position</DisclosureTrigger>
                <DisclosureContent>
                  <p className="text-sm text-gray-600">
                    The default chevron appears on the right and rotates when
                    opened.
                  </p>
                </DisclosureContent>
              </Disclosure>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Custom Icon (Right)</p>
              <Disclosure>
                <DisclosureTrigger icon={<HelpCircle />}>
                  Need help with this step?
                </DisclosureTrigger>
                <DisclosureContent>
                  <p className="text-sm text-gray-600">
                    Don&apos;t worry! This is a common question. Take your time
                    and follow the visual cues in the recipe.
                  </p>
                </DisclosureContent>
              </Disclosure>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Icon on Left</p>
              <Disclosure>
                <DisclosureTrigger icon={<Lightbulb />} iconPosition="left">
                  Pro cooking tip
                </DisclosureTrigger>
                <DisclosureContent>
                  <p className="text-sm text-gray-600">
                    Always let meat rest after cooking to redistribute juices
                    evenly throughout.
                  </p>
                </DisclosureContent>
              </Disclosure>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">No Icon</p>
              <Disclosure>
                <DisclosureTrigger showIcon={false}>
                  Clean disclosure without any icon
                </DisclosureTrigger>
                <DisclosureContent>
                  <p className="text-sm text-gray-600">
                    Sometimes a minimal approach without icons creates a cleaner
                    look.
                  </p>
                </DisclosureContent>
              </Disclosure>
            </div>
          </div>
        </div>

        {/* Recipe-Specific Examples */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">
            Recipe-Specific Components
          </h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Pre-configured components optimized for common recipe use cases.
          </p>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium">Cooking Tips</p>
              <RecipeDisclosure context="tips" badge="Pro Tip">
                <DisclosureTrigger>
                  How to achieve the perfect sear?
                </DisclosureTrigger>
                <DisclosureContent>
                  <p className="text-sm text-gray-600">
                    Make sure your pan is smoking hot before adding the protein.
                    You should hear an immediate sizzle when the food hits the
                    pan. Don&apos;t move it for the first 2-3 minutes to develop
                    a proper crust.
                  </p>
                </DisclosureContent>
              </RecipeDisclosure>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Ingredient Notes</p>
              <RecipeDisclosure context="notes">
                <DisclosureTrigger>
                  About the flour choice in this recipe
                </DisclosureTrigger>
                <DisclosureContent>
                  <p className="text-sm text-gray-600">
                    All-purpose flour works best for this recipe, providing the
                    right protein content for proper gluten development. Bread
                    flour will make it too chewy, while cake flour will make it
                    too tender.
                  </p>
                </DisclosureContent>
              </RecipeDisclosure>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Substitutions</p>
              <RecipeDisclosure context="substitutions">
                <DisclosureTrigger>Dairy-free alternatives</DisclosureTrigger>
                <DisclosureContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <strong>Butter:</strong> Use coconut oil (solid) or vegan
                      butter
                    </p>
                    <p>
                      <strong>Milk:</strong> Oat milk or unsweetened almond milk
                      work best
                    </p>
                    <p>
                      <strong>Cheese:</strong> Nutritional yeast or cashew-based
                      alternatives
                    </p>
                  </div>
                </DisclosureContent>
              </RecipeDisclosure>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">
                Nutritional Information
              </p>
              <RecipeDisclosure context="nutrition">
                <DisclosureTrigger>
                  Detailed nutritional breakdown
                </DisclosureTrigger>
                <DisclosureContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <strong>Per serving:</strong> 280 calories
                    </p>
                    <p>
                      <strong>Protein:</strong> 12g | <strong>Fat:</strong> 8g |{' '}
                      <strong>Carbs:</strong> 35g
                    </p>
                    <p>
                      <strong>Fiber:</strong> 3g | <strong>Sugar:</strong> 6g |{' '}
                      <strong>Sodium:</strong> 450mg
                    </p>
                  </div>
                </DisclosureContent>
              </RecipeDisclosure>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Equipment Alternatives</p>
              <RecipeDisclosure context="equipment">
                <DisclosureTrigger>
                  Don&apos;t have a stand mixer?
                </DisclosureTrigger>
                <DisclosureContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      You can use a hand mixer or even mix by hand with a whisk.
                    </p>
                    <p>
                      Hand mixing will take about 2-3 minutes longer, but the
                      results will be similar.
                    </p>
                    <p>
                      Make sure all ingredients are at room temperature for
                      easier mixing.
                    </p>
                  </div>
                </DisclosureContent>
              </RecipeDisclosure>
            </div>
          </div>
        </div>

        {/* Kitchen Tips with Difficulty Levels */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">
            Kitchen Tips with Difficulty Levels
          </h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Cooking tips organized by difficulty level with time estimates.
          </p>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium">Beginner Tip</p>
              <KitchenTipsDisclosure
                tipType="cooking"
                difficulty="beginner"
                estimatedTime="2 min"
              >
                <DisclosureTrigger>
                  How to tell when oil is hot enough
                </DisclosureTrigger>
                <DisclosureContent>
                  <p className="text-sm text-gray-600">
                    Drop a small piece of bread or a droplet of water into the
                    oil. If it sizzles immediately and vigorously, the oil is
                    ready for frying. The bread should brown in about 60
                    seconds.
                  </p>
                </DisclosureContent>
              </KitchenTipsDisclosure>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Intermediate Technique</p>
              <KitchenTipsDisclosure
                tipType="prep"
                difficulty="intermediate"
                estimatedTime="5 min"
              >
                <DisclosureTrigger>
                  Proper knife grip for precision cuts
                </DisclosureTrigger>
                <DisclosureContent>
                  <p className="text-sm text-gray-600">
                    Hold the knife with a firm grip, thumb and forefinger on
                    opposite sides of the blade. Use a claw grip with your other
                    hand to guide and protect your fingers. Rock the knife
                    forward while keeping the tip on the cutting board.
                  </p>
                </DisclosureContent>
              </KitchenTipsDisclosure>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Advanced Technique</p>
              <KitchenTipsDisclosure
                tipType="technique"
                difficulty="advanced"
                estimatedTime="15 min"
              >
                <DisclosureTrigger>
                  Mastering emulsification for perfect sauces
                </DisclosureTrigger>
                <DisclosureContent>
                  <p className="text-sm text-gray-600">
                    Start with egg yolks at room temperature. Add oil drop by
                    drop initially, whisking constantly. Once the emulsion
                    forms, you can add oil in a thin stream. If it breaks, start
                    over with a fresh yolk and slowly whisk in the broken sauce.
                  </p>
                </DisclosureContent>
              </KitchenTipsDisclosure>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Food Safety</p>
              <KitchenTipsDisclosure tipType="safety" difficulty="beginner">
                <DisclosureTrigger>
                  Safe internal temperatures for proteins
                </DisclosureTrigger>
                <DisclosureContent>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <strong>Chicken/Turkey:</strong> 165°F (74°C)
                    </p>
                    <p>
                      <strong>Beef/Lamb (medium-rare):</strong> 135°F (57°C)
                    </p>
                    <p>
                      <strong>Pork:</strong> 145°F (63°C)
                    </p>
                    <p>
                      <strong>Fish:</strong> 145°F (63°C)
                    </p>
                    <p>
                      <strong>Ground meats:</strong> 160°F (71°C)
                    </p>
                  </div>
                </DisclosureContent>
              </KitchenTipsDisclosure>
            </div>
          </div>
        </div>

        {/* FAQ Examples */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">FAQ-Style Disclosures</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Formatted for frequently asked questions with categories and
            featured items.
          </p>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium">Featured FAQ</p>
              <FAQDisclosure
                question="How do I store leftover ingredients properly?"
                category="storage"
                featured
              >
                <DisclosureContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      Store dry ingredients in airtight containers in a cool,
                      dry place.
                    </p>
                    <p>
                      Refrigerate perishables within 2 hours of cooking or
                      preparation.
                    </p>
                    <p>
                      Label containers with dates and use within recommended
                      timeframes.
                    </p>
                  </div>
                </DisclosureContent>
              </FAQDisclosure>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Cooking FAQ</p>
              <FAQDisclosure
                question="What if I don't have a specific cooking tool?"
                category="cooking"
              >
                <DisclosureContent>
                  <p className="text-sm text-gray-600">
                    Most cooking tools have suitable substitutes. Check our
                    equipment alternatives section for specific suggestions.
                    Often, basic tools can achieve similar results with slight
                    technique adjustments.
                  </p>
                </DisclosureContent>
              </FAQDisclosure>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Ingredients FAQ</p>
              <FAQDisclosure
                question="Can I substitute ingredients in recipes?"
                category="ingredients"
              >
                <DisclosureContent>
                  <p className="text-sm text-gray-600">
                    Yes! Most recipes include substitution guides in the notes
                    section. Common substitutions include dairy alternatives,
                    gluten-free options, and seasonal ingredient swaps. Always
                    consider flavor and texture impacts.
                  </p>
                </DisclosureContent>
              </FAQDisclosure>
            </div>
          </div>
        </div>

        {/* Interactive States */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Interactive States</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Controlled states, disabled interactions, and special behaviors.
          </p>
          <div className="space-y-6">
            <div>
              <p className="mb-2 text-sm font-medium">Controlled Disclosure</p>
              <div className="mb-3 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setControlledOpen(!controlledOpen)}
                >
                  {controlledOpen ? 'Close' : 'Open'} Externally
                </Button>
                <span className="flex items-center text-sm text-gray-500">
                  Current state: {controlledOpen ? 'Open' : 'Closed'}
                </span>
              </div>
              <Disclosure
                open={controlledOpen}
                onOpenChange={setControlledOpen}
              >
                <DisclosureTrigger>
                  Controlled by external state
                </DisclosureTrigger>
                <DisclosureContent>
                  <p className="text-sm text-gray-600">
                    This disclosure is controlled by the buttons above. You can
                    also click this trigger to toggle the state.
                  </p>
                </DisclosureContent>
              </Disclosure>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Disabled State</p>
              <Disclosure disabled>
                <DisclosureTrigger>
                  This disclosure is disabled
                </DisclosureTrigger>
                <DisclosureContent>
                  <p className="text-sm text-gray-600">
                    This content won&apos;t be accessible because the entire
                    disclosure is disabled.
                  </p>
                </DisclosureContent>
              </Disclosure>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">
                Non-collapsible (Opens but doesn&apos;t close)
              </p>
              <Disclosure defaultOpen collapsible={false}>
                <DisclosureTrigger>
                  One-way disclosure - can&apos;t be closed
                </DisclosureTrigger>
                <DisclosureContent>
                  <p className="text-sm text-gray-600">
                    Once opened, this disclosure cannot be collapsed by clicking
                    the trigger. Useful for revealing important information that
                    shouldn&apos;t be hidden again.
                  </p>
                </DisclosureContent>
              </Disclosure>
            </div>
          </div>
        </div>

        {/* Grouped Disclosures */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Grouped Disclosures</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Multiple related disclosures with consistent spacing and
            organization.
          </p>

          <div className="space-y-6">
            <div>
              <h4 className="mb-3 font-medium">Recipe FAQ Collection</h4>
              <DisclosureGroup spacing="normal">
                <FAQDisclosure
                  question="How long does this recipe take to make?"
                  category="general"
                >
                  <DisclosureContent>
                    <p className="text-sm text-gray-600">
                      Total time is about 45 minutes: 15 minutes prep, 30
                      minutes cooking. Most of the cooking time is hands-off, so
                      you can prepare other dishes.
                    </p>
                  </DisclosureContent>
                </FAQDisclosure>

                <FAQDisclosure
                  question="Can I make this recipe vegan?"
                  category="ingredients"
                >
                  <DisclosureContent>
                    <p className="text-sm text-gray-600">
                      Absolutely! Replace dairy with plant-based alternatives
                      and eggs with flax eggs (1 tbsp ground flaxseed + 3 tbsp
                      water per egg).
                    </p>
                  </DisclosureContent>
                </FAQDisclosure>

                <FAQDisclosure
                  question="What equipment do I absolutely need?"
                  category="equipment"
                >
                  <DisclosureContent>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>
                        <strong>Essential:</strong> Large skillet, wooden spoon,
                        measuring cups
                      </p>
                      <p>
                        <strong>Helpful:</strong> Food processor, kitchen scale
                      </p>
                      <p>
                        <strong>Optional:</strong> Stand mixer, mandoline slicer
                      </p>
                    </div>
                  </DisclosureContent>
                </FAQDisclosure>

                <FAQDisclosure
                  question="How should I store leftovers?"
                  category="storage"
                  featured
                >
                  <DisclosureContent>
                    <p className="text-sm text-gray-600">
                      Store in the refrigerator for up to 3 days in an airtight
                      container. Reheat gently on the stove or in the microwave.
                      Freezes well for up to 3 months.
                    </p>
                  </DisclosureContent>
                </FAQDisclosure>

                <FAQDisclosure
                  question="Can I double or halve this recipe?"
                  category="general"
                >
                  <DisclosureContent>
                    <p className="text-sm text-gray-600">
                      Yes! This recipe scales well. When doubling, you may need
                      to cook in batches or use a larger pan. Cooking times may
                      need slight adjustments.
                    </p>
                  </DisclosureContent>
                </FAQDisclosure>
              </DisclosureGroup>
            </div>
          </div>
        </div>

        {/* Accessibility Features */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Accessibility Features</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Built-in accessibility support including ARIA attributes and
            keyboard navigation.
          </p>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium">Keyboard Navigation</p>
              <Disclosure>
                <DisclosureTrigger ariaLabel="Press Enter or Space to toggle">
                  Try using Tab, Enter, and Space keys
                </DisclosureTrigger>
                <DisclosureContent>
                  <p className="text-sm text-gray-600">
                    This disclosure supports full keyboard navigation:
                  </p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
                    <li>
                      <strong>Tab:</strong> Focus the trigger button
                    </li>
                    <li>
                      <strong>Enter/Space:</strong> Toggle open/closed state
                    </li>
                    <li>
                      <strong>ARIA attributes:</strong> Proper screen reader
                      support
                    </li>
                  </ul>
                </DisclosureContent>
              </Disclosure>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Screen Reader Support</p>
              <Disclosure>
                <DisclosureTrigger>
                  Content with proper ARIA labeling
                </DisclosureTrigger>
                <DisclosureContent>
                  <p className="text-sm text-gray-600">
                    Screen readers will announce the button state
                    (expanded/collapsed) and properly associate the trigger with
                    its content region.
                  </p>
                </DisclosureContent>
              </Disclosure>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
