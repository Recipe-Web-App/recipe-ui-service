'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Slider,
  RangeSlider,
  TemperatureSlider,
  TimeSlider,
  ServingSizeSlider,
  DifficultySlider,
} from '@/components/ui/slider';
import { Settings, Thermometer, Clock, Users, Star, Zap } from 'lucide-react';

export default function SliderDemoPage() {
  // State for interactive examples
  const [basicValue, setBasicValue] = useState([50]);
  const [rangeValue, setRangeValue] = useState<[number, number]>([25, 75]);
  const [tempValue, setTempValue] = useState([180]);
  const [timeValue, setTimeValue] = useState([30]);
  const [servingsValue, setServingsValue] = useState([4]);
  const [difficultyValue, setDifficultyValue] = useState([2]);

  const ComponentCard = ({
    title,
    description,
    children,
    icon: Icon,
  }: {
    title: string;
    description: string;
    children: React.ReactNode;
    icon: React.ComponentType<{ className?: string }>;
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-muted/40 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl">
            <h1 className="mb-4 text-4xl font-bold tracking-tight">
              Slider Components
            </h1>
            <p className="text-muted-foreground mb-6 text-xl">
              Range and value sliders for interactive number input. Built on
              Radix UI with comprehensive styling options and recipe-specific
              variants.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Interactive</Badge>
              <Badge variant="secondary">Accessible</Badge>
              <Badge variant="secondary">Recipe-Optimized</Badge>
              <Badge variant="secondary">Multi-format</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="examples" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="examples">Examples</TabsTrigger>
            <TabsTrigger value="variants">Variants</TabsTrigger>
            <TabsTrigger value="recipe">Recipe Sliders</TabsTrigger>
            <TabsTrigger value="interactive">Interactive</TabsTrigger>
          </TabsList>

          <TabsContent value="examples" className="space-y-8">
            <div className="grid gap-8 md:grid-cols-2">
              <ComponentCard
                title="Basic Slider"
                description="Single value selection with customizable display options"
                icon={Settings}
              >
                <div className="space-y-6">
                  <Slider
                    defaultValue={[30]}
                    label="Volume Level"
                    showValue
                    valuePosition="inline"
                    unit="%"
                  />
                  <Slider
                    defaultValue={[70]}
                    label="Progress"
                    variant="success"
                    showValue
                    valuePosition="bottom"
                    unit="%"
                    gradient
                  />
                  <div className="px-4 pb-4">
                    <Slider
                      defaultValue={[2]}
                      min={0}
                      max={4}
                      step={1}
                      label="Quality Rating"
                      variant="warning"
                      showValue
                      showTicks
                      showStepLabels
                      stepLabels={[
                        'Poor',
                        'Fair',
                        'Good',
                        'Great',
                        'Excellent',
                      ]}
                    />
                  </div>
                </div>
              </ComponentCard>

              <ComponentCard
                title="Range Slider"
                description="Select a range between two values with minimum distance control"
                icon={Settings}
              >
                <div className="space-y-6">
                  <RangeSlider
                    defaultValue={[20, 80]}
                    label="Price Range"
                    showValue
                    valuePosition="inline"
                    unit="$"
                    variant="info"
                  />
                  <RangeSlider
                    defaultValue={[25, 75]}
                    label="Age Range"
                    showValue
                    valuePosition="bottom"
                    minDistance={5}
                    variant="success"
                  />
                  <RangeSlider
                    defaultValue={[40, 60]}
                    label="Temperature Range"
                    showValue
                    unit="°C"
                    variant="warning"
                    gradient
                  />
                </div>
              </ComponentCard>
            </div>
          </TabsContent>

          <TabsContent value="variants" className="space-y-8">
            <div className="grid gap-8 md:grid-cols-2">
              <ComponentCard
                title="Size Variants"
                description="Different sizes for various interface needs"
                icon={Settings}
              >
                <div className="space-y-6">
                  <Slider
                    size="sm"
                    defaultValue={[25]}
                    label="Small"
                    showValue
                  />
                  <Slider
                    size="default"
                    defaultValue={[50]}
                    label="Default"
                    showValue
                  />
                  <Slider
                    size="lg"
                    defaultValue={[75]}
                    label="Large"
                    showValue
                  />
                </div>
              </ComponentCard>

              <ComponentCard
                title="Color Variants"
                description="Semantic color variants for different contexts"
                icon={Settings}
              >
                <div className="space-y-6">
                  <Slider
                    variant="default"
                    defaultValue={[20]}
                    label="Default"
                    showValue
                  />
                  <Slider
                    variant="success"
                    defaultValue={[40]}
                    label="Success"
                    showValue
                  />
                  <Slider
                    variant="warning"
                    defaultValue={[60]}
                    label="Warning"
                    showValue
                  />
                  <Slider
                    variant="danger"
                    defaultValue={[80]}
                    label="Danger"
                    showValue
                  />
                  <Slider
                    variant="info"
                    defaultValue={[100]}
                    label="Info"
                    showValue
                  />
                </div>
              </ComponentCard>

              <ComponentCard
                title="Gradient Effects"
                description="Add visual depth with gradient styling"
                icon={Zap}
              >
                <div className="space-y-6">
                  <Slider
                    variant="success"
                    gradient
                    defaultValue={[30]}
                    label="Success Gradient"
                    showValue
                  />
                  <Slider
                    variant="warning"
                    gradient
                    defaultValue={[60]}
                    label="Warning Gradient"
                    showValue
                  />
                  <Slider
                    variant="info"
                    gradient
                    defaultValue={[90]}
                    label="Info Gradient"
                    showValue
                  />
                </div>
              </ComponentCard>

              <ComponentCard
                title="Orientation"
                description="Horizontal and vertical orientations"
                icon={Settings}
              >
                <div className="flex h-64 items-start justify-around pt-8">
                  <div className="flex h-full flex-col items-center space-y-2">
                    <span className="text-sm font-medium">Volume</span>
                    <div className="flex justify-center">
                      <Slider
                        orientation="vertical"
                        defaultValue={[60]}
                        showValue
                        valuePosition="bottom"
                        variant="info"
                        className="h-40"
                      />
                    </div>
                  </div>
                  <div className="flex h-full flex-col items-center space-y-2">
                    <span className="text-sm font-medium">Heat</span>
                    <div className="flex justify-center">
                      <Slider
                        orientation="vertical"
                        defaultValue={[80]}
                        showValue
                        valuePosition="bottom"
                        variant="danger"
                        gradient
                        className="h-40"
                      />
                    </div>
                  </div>
                  <div className="flex h-full flex-col items-center space-y-2">
                    <span className="text-sm font-medium">Bass</span>
                    <div className="flex justify-center">
                      <Slider
                        orientation="vertical"
                        defaultValue={[40]}
                        showValue
                        valuePosition="bottom"
                        variant="success"
                        className="h-40"
                      />
                    </div>
                  </div>
                </div>
              </ComponentCard>
            </div>
          </TabsContent>

          <TabsContent value="recipe" className="space-y-8">
            <div className="grid gap-8 md:grid-cols-2">
              <ComponentCard
                title="Temperature Slider"
                description="Cooking temperature control with unit formatting"
                icon={Thermometer}
              >
                <div className="space-y-6">
                  <TemperatureSlider
                    defaultValue={[180]}
                    temperatureUnit="C"
                    label="Oven Temperature (Celsius)"
                    showValue
                    valuePosition="inline"
                  />
                  <TemperatureSlider
                    defaultValue={[350]}
                    temperatureUnit="F"
                    label="Oven Temperature (Fahrenheit)"
                    showValue
                    valuePosition="inline"
                  />
                  <TemperatureSlider
                    defaultValue={[220]}
                    temperatureUnit="C"
                    min={100}
                    max={250}
                    label="High Heat Cooking"
                    showValue
                    showTicks
                    tickPosition="below"
                  />
                </div>
              </ComponentCard>

              <ComponentCard
                title="Time Slider"
                description="Cooking time with smart time formatting"
                icon={Clock}
              >
                <div className="space-y-6">
                  <TimeSlider
                    defaultValue={[30]}
                    timeUnit="minutes"
                    maxTime={120}
                    label="Prep Time"
                    showValue
                    valuePosition="inline"
                  />
                  <TimeSlider
                    defaultValue={[2.5]}
                    timeUnit="hours"
                    maxTime={6}
                    label="Slow Cook Time"
                    showValue
                    valuePosition="inline"
                  />
                  <TimeSlider
                    defaultValue={[15]}
                    timeUnit="minutes"
                    maxTime={60}
                    label="Baking Time"
                    showValue
                    showTicks
                  />
                </div>
              </ComponentCard>

              <ComponentCard
                title="Serving Size Slider"
                description="Recipe portion control with serving formatting"
                icon={Users}
              >
                <div className="space-y-6">
                  <ServingSizeSlider
                    defaultValue={[4]}
                    maxServings={12}
                    label="Family Dinner"
                    showValue
                    valuePosition="inline"
                  />
                  <ServingSizeSlider
                    defaultValue={[8]}
                    maxServings={20}
                    label="Party Size"
                    showValue
                    valuePosition="inline"
                  />
                  <ServingSizeSlider
                    defaultValue={[2]}
                    maxServings={8}
                    label="Date Night"
                    showValue
                    showTicks
                  />
                </div>
              </ComponentCard>

              <ComponentCard
                title="Difficulty Slider"
                description="Recipe complexity with skill level labels"
                icon={Star}
              >
                <div className="space-y-8">
                  <DifficultySlider
                    defaultValue={[2]}
                    label="Recipe Difficulty"
                    showValue
                    valuePosition="inline"
                    showLabels={true}
                  />
                  <DifficultySlider
                    defaultValue={[3]}
                    label="Technique Required"
                    showValue
                    valuePosition="bottom"
                    showLabels={true}
                  />
                  <DifficultySlider
                    defaultValue={[1]}
                    label="Beginner Friendly"
                    showValue
                    valuePosition="inline"
                    showLabels={false}
                  />
                </div>
              </ComponentCard>
            </div>
          </TabsContent>

          <TabsContent value="interactive" className="space-y-8">
            <div className="grid gap-8 md:grid-cols-2">
              <ComponentCard
                title="Recipe Configuration"
                description="Build a recipe with interactive sliders"
                icon={Settings}
              >
                <div className="space-y-6">
                  <ServingSizeSlider
                    value={servingsValue}
                    onValueChange={setServingsValue}
                    maxServings={12}
                    label="Servings"
                    showValue
                    valuePosition="inline"
                  />
                  <TemperatureSlider
                    value={tempValue}
                    onValueChange={setTempValue}
                    temperatureUnit="C"
                    label="Cooking Temperature"
                    showValue
                    valuePosition="inline"
                  />
                  <TimeSlider
                    value={timeValue}
                    onValueChange={setTimeValue}
                    timeUnit="minutes"
                    maxTime={120}
                    label="Cook Time"
                    showValue
                    valuePosition="inline"
                  />
                  <DifficultySlider
                    value={difficultyValue}
                    onValueChange={setDifficultyValue}
                    label="Difficulty Level"
                    showValue
                    valuePosition="inline"
                    showLabels={true}
                  />

                  <div className="bg-muted mt-6 rounded-lg p-4">
                    <h4 className="mb-2 font-semibold">Recipe Summary:</h4>
                    <p className="text-muted-foreground text-sm">
                      Serves {servingsValue[0]} people • Cook at {tempValue[0]}
                      °C for {timeValue[0]} minutes • Difficulty:{' '}
                      {
                        ['Easy', 'Medium', 'Hard', 'Expert'][
                          difficultyValue[0] - 1
                        ]
                      }
                    </p>
                  </div>
                </div>
              </ComponentCard>

              <ComponentCard
                title="Interactive Controls"
                description="Test all slider features with live controls"
                icon={Settings}
              >
                <div className="space-y-6">
                  <Slider
                    value={basicValue}
                    onValueChange={setBasicValue}
                    label="Basic Control"
                    showValue
                    valuePosition="inline"
                    variant="info"
                    gradient
                  />

                  <RangeSlider
                    value={rangeValue}
                    onValueChange={setRangeValue}
                    label="Range Control"
                    showValue
                    valuePosition="inline"
                    variant="success"
                    unit="%"
                  />

                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setBasicValue([Math.floor(Math.random() * 100)])
                      }
                    >
                      Random Basic Value
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const min = Math.floor(Math.random() * 50);
                        const max = min + 20 + Math.floor(Math.random() * 30);
                        setRangeValue([min, max]);
                      }}
                    >
                      Random Range Values
                    </Button>
                  </div>

                  <div className="bg-muted mt-6 rounded-lg p-4">
                    <h4 className="mb-2 font-semibold">Current Values:</h4>
                    <p className="text-muted-foreground text-sm">
                      Basic: {basicValue[0]} • Range: {rangeValue[0]} -{' '}
                      {rangeValue[1]}
                    </p>
                  </div>
                </div>
              </ComponentCard>
            </div>
          </TabsContent>
        </Tabs>

        {/* Usage Guidelines */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Usage Guidelines</CardTitle>
            <CardDescription>
              Best practices for implementing slider components in your recipes
              application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-2 font-semibold text-green-600">✓ Do</h4>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>
                    • Use appropriate size variants for your design hierarchy
                  </li>
                  <li>• Show values when precision is important</li>
                  <li>• Use recipe-specific sliders for cooking contexts</li>
                  <li>• Provide clear labels and units</li>
                  <li>• Use semantic color variants appropriately</li>
                  <li>• Test with keyboard navigation</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2 font-semibold text-red-600">
                  ✗ Don&apos;t
                </h4>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>• Use too many gradient effects in one interface</li>
                  <li>• Make steps too small for touch interfaces</li>
                  <li>• Forget to provide accessible labels</li>
                  <li>• Use color variants without semantic meaning</li>
                  <li>• Create overly complex range constraints</li>
                  <li>• Ignore mobile responsiveness</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
