'use client';

import React, { useState } from 'react';
import {
  TooltipProvider,
  SimpleTooltip,
  CookingTermTooltip,
  HelpTooltip,
  InfoTooltip,
  KeyboardTooltip,
  MetricTooltip,
} from '@/components/ui/tooltip';

export default function TooltipDemo() {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <TooltipProvider>
      <div className="container mx-auto max-w-4xl p-6">
        <div className="space-y-8">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Tooltip Component Demo</h1>
            <p className="text-gray-600">
              Interactive examples of the Tooltip component for contextual help,
              cooking terms, and UI guidance in the Recipe App.
            </p>
          </div>

          {/* Basic Tooltips */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold">Basic Tooltips</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <SimpleTooltip content="This is a default tooltip">
                <div className="cursor-help rounded border p-3 text-center hover:bg-gray-50">
                  Default
                </div>
              </SimpleTooltip>

              <SimpleTooltip
                content="Light theme tooltip with white background"
                variant="light"
              >
                <div className="cursor-help rounded border p-3 text-center hover:bg-gray-50">
                  Light
                </div>
              </SimpleTooltip>

              <SimpleTooltip
                content="Accent colored tooltip for emphasis"
                variant="accent"
              >
                <div className="cursor-help rounded border p-3 text-center hover:bg-gray-50">
                  Accent
                </div>
              </SimpleTooltip>

              <SimpleTooltip
                content="Success message tooltip"
                variant="success"
              >
                <div className="cursor-help rounded border p-3 text-center hover:bg-gray-50">
                  Success
                </div>
              </SimpleTooltip>

              <SimpleTooltip
                content="Warning notification tooltip"
                variant="warning"
              >
                <div className="cursor-help rounded border p-3 text-center hover:bg-gray-50">
                  Warning
                </div>
              </SimpleTooltip>

              <SimpleTooltip content="Error message tooltip" variant="error">
                <div className="cursor-help rounded border p-3 text-center hover:bg-gray-50">
                  Error
                </div>
              </SimpleTooltip>

              <SimpleTooltip content="Information tooltip" variant="info">
                <div className="cursor-help rounded border p-3 text-center hover:bg-gray-50">
                  Info
                </div>
              </SimpleTooltip>

              <SimpleTooltip content="Tooltip without arrow" showArrow={false}>
                <div className="cursor-help rounded border p-3 text-center hover:bg-gray-50">
                  No Arrow
                </div>
              </SimpleTooltip>
            </div>
          </section>

          {/* Tooltip Sizes */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold">Tooltip Sizes</h2>
            <div className="flex flex-wrap items-center gap-6">
              <SimpleTooltip content="Small tooltip" size="sm">
                <button className="rounded bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600">
                  Small
                </button>
              </SimpleTooltip>

              <SimpleTooltip
                content="Default size tooltip with moderate content"
                size="default"
              >
                <button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                  Default
                </button>
              </SimpleTooltip>

              <SimpleTooltip
                content="Large tooltip that can contain more detailed information and explanations"
                size="lg"
              >
                <button className="rounded bg-blue-500 px-4 py-2 text-lg text-white hover:bg-blue-600">
                  Large
                </button>
              </SimpleTooltip>

              <SimpleTooltip
                content="Extra large tooltip for comprehensive information, detailed explanations, and complex content that requires more space to display properly"
                size="xl"
              >
                <button className="rounded bg-blue-500 px-5 py-3 text-lg text-white hover:bg-blue-600">
                  Extra Large
                </button>
              </SimpleTooltip>
            </div>
          </section>

          {/* Positioning */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold">Tooltip Positioning</h2>
            <div className="flex justify-center">
              <div className="grid grid-cols-3 place-items-center gap-8">
                <div></div>
                <SimpleTooltip content="Tooltip appears above" side="top">
                  <div className="cursor-help rounded border p-3 text-center hover:bg-gray-50">
                    Top
                  </div>
                </SimpleTooltip>
                <div></div>

                <SimpleTooltip
                  content="Tooltip appears to the left"
                  side="left"
                >
                  <div className="cursor-help rounded border p-3 text-center hover:bg-gray-50">
                    Left
                  </div>
                </SimpleTooltip>

                <div className="rounded border border-dashed p-3 text-center text-gray-400">
                  Center
                </div>

                <SimpleTooltip
                  content="Tooltip appears to the right"
                  side="right"
                >
                  <div className="cursor-help rounded border p-3 text-center hover:bg-gray-50">
                    Right
                  </div>
                </SimpleTooltip>

                <div></div>
                <SimpleTooltip content="Tooltip appears below" side="bottom">
                  <div className="cursor-help rounded border p-3 text-center hover:bg-gray-50">
                    Bottom
                  </div>
                </SimpleTooltip>
                <div></div>
              </div>
            </div>
          </section>

          {/* Cooking Terms */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              Cooking Terms & Techniques
            </h2>
            <div className="space-y-6">
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-3 text-lg font-medium">
                  Recipe Instructions
                </h3>
                <div className="space-y-2 text-sm leading-relaxed">
                  <span className="block">
                    Begin by preparing your{' '}
                    <CookingTermTooltip
                      term="mise en place"
                      definition="A French culinary term meaning 'everything in its place' - having all ingredients prepped and ready before cooking"
                      pronunciation="MEES ahn plahs"
                      category="general"
                    />
                    .
                  </span>
                  <span className="block">
                    <CookingTermTooltip
                      term="Julienne"
                      definition="To cut vegetables into thin, matchstick-like strips, typically 2-3mm wide and 4-5cm long"
                      pronunciation="zhool-ee-EHN"
                      category="technique"
                    />{' '}
                    the carrots and celery for even cooking.
                  </span>
                  <span className="block">
                    Heat oil in a large pan and{' '}
                    <CookingTermTooltip
                      term="sauté"
                      definition="To cook quickly in a small amount of fat over high heat, stirring frequently"
                      pronunciation="saw-TAY"
                      category="technique"
                    />{' '}
                    the vegetables until they begin to soften.
                  </span>
                  <span className="block">
                    Add the{' '}
                    <CookingTermTooltip
                      term="aromatics"
                      definition="Vegetables and herbs that provide a flavor base for dishes, typically onions, carrots, celery, garlic, and herbs"
                      category="ingredient"
                    />{' '}
                    and cook until fragrant.
                  </span>
                  <span className="block">
                    <CookingTermTooltip
                      term="Deglaze"
                      definition="To add liquid to a pan to dissolve the browned bits stuck to the bottom, creating a flavorful base"
                      category="technique"
                    />{' '}
                    the pan with white wine to capture all the fond.
                  </span>
                </div>
              </div>

              <div className="rounded-lg bg-blue-50 p-4">
                <h3 className="mb-3 text-lg font-medium">
                  Equipment & Ingredients
                </h3>
                <div className="space-y-2 text-sm leading-relaxed">
                  <span className="block">
                    Use a{' '}
                    <CookingTermTooltip
                      term="mandoline"
                      definition="A kitchen tool with an adjustable blade for slicing vegetables uniformly and precisely"
                      category="equipment"
                    />{' '}
                    for consistently thin slices.
                  </span>
                  <span className="block">
                    Season with{' '}
                    <CookingTermTooltip
                      term="kosher salt"
                      definition="A coarse-grained salt with large, flaky crystals that dissolves easily and provides clean, pure flavor"
                      category="ingredient"
                    />{' '}
                    to taste.
                  </span>
                  <span className="block">
                    Measure{' '}
                    <CookingTermTooltip
                      term="1 cup"
                      definition="A standard unit of volume measurement equal to 8 fluid ounces or 240 milliliters"
                      category="measurement"
                    />{' '}
                    of chicken stock.
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Help Icons */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold">Help & Info Icons</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-medium">Recipe Form Fields</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">
                        Difficulty Level
                      </label>
                      <HelpTooltip helpText="Easy: 30 min or less, basic techniques. Medium: 30-60 min, some skill required. Hard: 60+ min, advanced techniques." />
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">
                        Serving Size
                      </label>
                      <InfoTooltip infoText="Number of people this recipe serves as a main course. Adjust quantities proportionally for different serving sizes." />
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">Prep Time</label>
                      <HelpTooltip
                        helpText="Active preparation time including chopping, mixing, and initial cooking. Does not include passive time like marinating or rising."
                        iconVariant="subtle"
                        iconSize="sm"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">
                        Dietary Tags
                      </label>
                      <InfoTooltip
                        infoText="Add tags like 'vegetarian', 'gluten-free', 'dairy-free' to help users filter recipes by dietary needs."
                        iconVariant="accent"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Icon Variants</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Default</span>
                      <HelpTooltip helpText="Default help icon styling" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Subtle</span>
                      <HelpTooltip
                        helpText="Subtle help icon for secondary information"
                        iconVariant="subtle"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Accent</span>
                      <InfoTooltip
                        infoText="Accent info icon for important details"
                        iconVariant="accent"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Success</span>
                      <SimpleTooltip
                        content="Success info icon for positive feedback"
                        variant="success"
                      >
                        <button
                          type="button"
                          className="inline-flex h-5 w-5 items-center justify-center rounded-full p-1 text-green-500 transition-all duration-200 hover:bg-green-50 hover:text-green-700 focus-visible:bg-green-50 focus-visible:text-green-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          aria-label="Success Information"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-full w-full"
                          >
                            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z" />
                            <path d="m9 12 2 2 4-4" />
                          </svg>
                        </button>
                      </SimpleTooltip>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Warning</span>
                      <SimpleTooltip
                        content="Warning info icon for important notices"
                        variant="warning"
                      >
                        <button
                          type="button"
                          className="inline-flex h-5 w-5 items-center justify-center rounded-full p-1 text-yellow-500 transition-all duration-200 hover:bg-yellow-50 hover:text-yellow-700 focus-visible:bg-yellow-50 focus-visible:text-yellow-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          aria-label="Warning Information"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-full w-full"
                          >
                            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                            <path d="M12 9v4" />
                            <path d="M12 17h.01" />
                          </svg>
                        </button>
                      </SimpleTooltip>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Error</span>
                      <SimpleTooltip
                        content="Error info icon for critical information"
                        variant="error"
                      >
                        <button
                          type="button"
                          className="inline-flex h-5 w-5 items-center justify-center rounded-full p-1 text-red-500 transition-all duration-200 hover:bg-red-50 hover:text-red-700 focus-visible:bg-red-50 focus-visible:text-red-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          aria-label="Error Information"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-full w-full"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="m15 9-6 6" />
                            <path d="m9 9 6 6" />
                          </svg>
                        </button>
                      </SimpleTooltip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Keyboard Shortcuts */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold">Keyboard Shortcuts</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="font-medium">Recipe Actions</h3>
                  <div className="space-y-2">
                    <KeyboardTooltip
                      shortcut={['Ctrl', 'S']}
                      description="Save current recipe"
                    >
                      <button className="w-full rounded bg-green-500 px-4 py-2 text-left text-sm text-white hover:bg-green-600">
                        💾 Save Recipe
                      </button>
                    </KeyboardTooltip>

                    <KeyboardTooltip
                      shortcut={['Ctrl', 'N']}
                      description="Create new recipe"
                    >
                      <button className="w-full rounded bg-blue-500 px-4 py-2 text-left text-sm text-white hover:bg-blue-600">
                        ➕ New Recipe
                      </button>
                    </KeyboardTooltip>

                    <KeyboardTooltip
                      shortcut={['Ctrl', 'P']}
                      description="Print recipe"
                    >
                      <button className="w-full rounded bg-gray-500 px-4 py-2 text-left text-sm text-white hover:bg-gray-600">
                        🖨️ Print Recipe
                      </button>
                    </KeyboardTooltip>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium">Navigation</h3>
                  <div className="space-y-2">
                    <KeyboardTooltip
                      shortcut="/"
                      description="Focus search field"
                    >
                      <input
                        type="text"
                        placeholder="Search recipes... (press / to focus)"
                        className="w-full rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </KeyboardTooltip>

                    <KeyboardTooltip
                      shortcut="?"
                      description="Show all keyboard shortcuts"
                    >
                      <button className="w-full rounded bg-gray-200 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-300">
                        ❓ Show Shortcuts
                      </button>
                    </KeyboardTooltip>

                    <KeyboardTooltip
                      shortcut="Esc"
                      description="Close modal or cancel current action"
                    >
                      <button className="w-full rounded bg-red-500 px-4 py-2 text-left text-sm text-white hover:bg-red-600">
                        ✖️ Cancel/Close
                      </button>
                    </KeyboardTooltip>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Metric Conversions */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              Measurement Conversions
            </h2>
            <div className="space-y-6">
              <div className="rounded-lg bg-orange-50 p-4">
                <h3 className="mb-3 text-lg font-medium">Recipe Ingredients</h3>
                <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                  <div className="space-y-1">
                    <div>
                      <MetricTooltip
                        metric="All-purpose flour"
                        value={2}
                        unit="cups"
                        conversion={{ value: 240, unit: 'g', system: 'metric' }}
                      />
                    </div>
                    <div>
                      <MetricTooltip
                        metric="Granulated sugar"
                        value={1}
                        unit="cup"
                        conversion={{ value: 200, unit: 'g', system: 'metric' }}
                      />
                    </div>
                    <div>
                      <MetricTooltip
                        metric="Butter"
                        value={8}
                        unit="tablespoons"
                        conversion={{ value: 115, unit: 'g', system: 'metric' }}
                      />
                    </div>
                    <div>
                      <MetricTooltip
                        metric="Whole milk"
                        value={1}
                        unit="cup"
                        conversion={{
                          value: 240,
                          unit: 'ml',
                          system: 'metric',
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div>
                      <MetricTooltip
                        metric="Chicken breast"
                        value={1}
                        unit="lb"
                        conversion={{ value: 454, unit: 'g', system: 'metric' }}
                      />
                    </div>
                    <div>
                      <MetricTooltip
                        metric="Olive oil"
                        value={4}
                        unit="tablespoons"
                        conversion={{ value: 60, unit: 'ml', system: 'metric' }}
                      />
                    </div>
                    <div>
                      <MetricTooltip
                        metric="Heavy cream"
                        value={8}
                        unit="fl oz"
                        conversion={{
                          value: 240,
                          unit: 'ml',
                          system: 'metric',
                        }}
                      />
                    </div>
                    <div>
                      <MetricTooltip
                        metric="Oven temperature"
                        value={375}
                        unit="°F"
                        conversion={{
                          value: 190,
                          unit: '°C',
                          system: 'metric',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-green-50 p-4">
                <h3 className="mb-3 text-lg font-medium">
                  Baking Measurements
                </h3>
                <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                  <div className="space-y-1">
                    <div>
                      <MetricTooltip
                        metric="Bread flour"
                        value={3}
                        unit="cups"
                        conversion={{ value: 360, unit: 'g', system: 'metric' }}
                      />
                    </div>
                    <div>
                      <MetricTooltip
                        metric="Active dry yeast"
                        value={1}
                        unit="packet"
                        conversion={{ value: 7, unit: 'g', system: 'metric' }}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div>
                      <MetricTooltip
                        metric="Warm water"
                        value={12}
                        unit="fl oz"
                        conversion={{
                          value: 355,
                          unit: 'ml',
                          system: 'metric',
                        }}
                      />
                    </div>
                    <div>
                      <MetricTooltip
                        metric="Salt"
                        value={2}
                        unit="teaspoons"
                        conversion={{ value: 12, unit: 'g', system: 'metric' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Advanced Examples */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold">Advanced Usage</h2>
            <div className="space-y-6">
              <div className="rounded-lg border p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-medium">Complex Recipe Card</h3>
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {showAdvanced ? 'Hide' : 'Show'} Advanced Features
                  </button>
                </div>

                {showAdvanced && (
                  <div className="space-y-4">
                    <div className="rounded bg-gray-50 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <h4 className="font-semibold">Beef Bourguignon</h4>
                        <InfoTooltip infoText="A traditional French stew braised in red wine, originating from the Burgundy region of France." />
                      </div>

                      <div className="mb-4 grid grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <span>Prep: 30 min</span>
                          <HelpTooltip
                            helpText="Active preparation time for chopping vegetables and browning meat"
                            iconSize="sm"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <span>Cook: 2.5 hours</span>
                          <HelpTooltip
                            helpText="Slow braising time for tender meat and rich flavor development"
                            iconSize="sm"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <span>Difficulty: Medium</span>
                          <HelpTooltip
                            helpText="Requires basic knife skills and understanding of braising technique"
                            iconSize="sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <span className="block">
                          Cut{' '}
                          <MetricTooltip
                            metric="beef chuck roast"
                            value={3}
                            unit="lbs"
                            conversion={{
                              value: 1350,
                              unit: 'g',
                              system: 'metric',
                            }}
                          />{' '}
                          into 2-inch cubes and{' '}
                          <CookingTermTooltip
                            term="dredge"
                            definition="To lightly coat food in flour, breadcrumbs, or other dry ingredients before cooking"
                            category="technique"
                          />{' '}
                          in seasoned flour.
                        </span>
                        <span className="block">
                          <CookingTermTooltip
                            term="Brown"
                            definition="To cook the surface of food at high heat until it develops a brown color and rich flavor"
                            category="technique"
                          />{' '}
                          the beef in batches to avoid overcrowding the pan.
                        </span>
                        <span className="block">
                          <CookingTermTooltip
                            term="Deglaze"
                            definition="To add liquid to a pan to dissolve the browned bits stuck to the bottom, creating a flavorful base"
                            category="technique"
                          />{' '}
                          with{' '}
                          <MetricTooltip
                            metric="red wine"
                            value={2}
                            unit="cups"
                            conversion={{
                              value: 480,
                              unit: 'ml',
                              system: 'metric',
                            }}
                          />{' '}
                          and scrape up all the fond.
                        </span>
                      </div>

                      <div className="mt-4 flex gap-4 border-t pt-4">
                        <KeyboardTooltip
                          shortcut={['Ctrl', 'P']}
                          description="Print this recipe"
                        >
                          <button className="text-sm text-blue-600 hover:underline">
                            Print
                          </button>
                        </KeyboardTooltip>
                        <KeyboardTooltip
                          shortcut={['Ctrl', 'D']}
                          description="Save to favorites"
                        >
                          <button className="text-sm text-blue-600 hover:underline">
                            Save
                          </button>
                        </KeyboardTooltip>
                        <KeyboardTooltip
                          shortcut={['Ctrl', 'E']}
                          description="Edit recipe"
                        >
                          <button className="text-sm text-blue-600 hover:underline">
                            Edit
                          </button>
                        </KeyboardTooltip>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Delayed Tooltips</h3>
                <div className="flex gap-4">
                  <SimpleTooltip
                    content="This tooltip appears immediately"
                    delayDuration={0}
                  >
                    <button className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600">
                      No Delay
                    </button>
                  </SimpleTooltip>

                  <SimpleTooltip
                    content="This tooltip appears after a longer delay"
                    delayDuration={1000}
                  >
                    <button className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600">
                      1s Delay
                    </button>
                  </SimpleTooltip>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Rich Content Tooltips</h3>
                <SimpleTooltip
                  content={
                    <div className="space-y-2">
                      <div className="font-semibold">Cooking Tips</div>
                      <ul className="space-y-1 text-sm">
                        <li>
                          • Use room temperature ingredients for better mixing
                        </li>
                        <li>• Preheat your oven for at least 15 minutes</li>
                        <li>• Taste and adjust seasoning throughout cooking</li>
                        <li>
                          • Let meat rest after cooking for juicier results
                        </li>
                      </ul>
                      <div className="border-t pt-2 text-xs opacity-75">
                        💡 Click for comprehensive cooking guide
                      </div>
                    </div>
                  }
                  size="xl"
                  variant="light"
                >
                  <button className="rounded bg-orange-500 px-6 py-3 text-white hover:bg-orange-600">
                    🍳 Pro Cooking Tips
                  </button>
                </SimpleTooltip>
              </div>
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
                  <li>• Use for cooking terms that might be unfamiliar</li>
                  <li>• Provide unit conversions for international users</li>
                  <li>• Keep tooltip content concise and focused</li>
                  <li>• Include pronunciation for foreign culinary terms</li>
                  <li>• Use consistent placement and behavior</li>
                  <li>• Test with keyboard navigation</li>
                  <li>
                    • Ensure tooltips don&apos;t hide critical information
                  </li>
                </ul>
              </div>

              <div className="rounded-lg bg-red-50 p-4">
                <h3 className="mb-2 font-medium text-red-800">❌ Avoid</h3>
                <ul className="space-y-1 text-sm text-red-700">
                  <li>• Overusing tooltips for obvious information</li>
                  <li>• Making essential information tooltip-only</li>
                  <li>• Using long delays for critical help text</li>
                  <li>• Crowding interface with too many help icons</li>
                  <li>• Forgetting mobile/touch device users</li>
                  <li>• Using tooltips for primary navigation</li>
                  <li>• Inconsistent terminology or definitions</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </TooltipProvider>
  );
}
