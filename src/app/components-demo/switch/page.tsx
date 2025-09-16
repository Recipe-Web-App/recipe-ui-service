'use client';

import React, { useState } from 'react';
import {
  Switch,
  SwitchField,
  RecipeSwitchGroup,
  AnimatedSwitch,
  SettingsSwitch,
} from '@/components/ui/switch';
import type { RecipeSwitchItemProps } from '@/components/ui/switch.types';
import {
  Bell,
  Moon,
  Sun,
  Globe,
  Save,
  Wifi,
  Volume2,
  Shield,
  Zap,
} from 'lucide-react';

interface DemoSettings {
  darkMode: boolean;
  notifications: boolean;
  publicProfile: boolean;
  autoSave: boolean;
  sound: boolean;
  wifi: boolean;
  privacy: boolean;
  analytics: boolean;
}

interface FormData {
  terms: boolean;
  marketing: boolean;
  newsletter: boolean;
  cookies: boolean;
}

export default function SwitchDemo() {
  const [basicSwitch, setBasicSwitch] = useState(false);
  const [settings, setSettings] = useState<DemoSettings>({
    darkMode: false,
    notifications: true,
    publicProfile: false,
    autoSave: true,
    sound: true,
    wifi: true,
    privacy: false,
    analytics: true,
  });
  const [formData, setFormData] = useState<FormData>({
    terms: false,
    marketing: true,
    newsletter: false,
    cookies: true,
  });
  const [groupValues, setGroupValues] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Simulate async operation
  const handleAsyncChange = async (
    key: keyof DemoSettings,
    value: boolean
  ): Promise<void> => {
    setIsLoading(true);
    return new Promise(resolve => {
      setTimeout(() => {
        setSettings(prev => ({ ...prev, [key]: value }));
        setIsLoading(false);
        resolve();
      }, 1500);
    });
  };

  // Recipe switches data
  const preferencesSwitches: RecipeSwitchItemProps[] = [
    {
      id: 'auto-save',
      label: 'Auto-save recipes',
      description: 'Automatically save your changes as you edit',
      context: 'auto-save' as const,
      defaultChecked: true,
    },
    {
      id: 'metric',
      label: 'Use metric units',
      description: 'Display measurements in metric (grams, ml)',
      context: 'metric-units' as const,
      defaultChecked: false,
    },
    {
      id: 'nutrition',
      label: 'Show nutritional info',
      description: 'Display calories and nutrition facts',
      context: 'show-nutrition' as const,
      defaultChecked: true,
    },
    {
      id: 'shopping',
      label: 'Shopping list integration',
      description: 'Add ingredients to shopping list',
      context: 'shopping-list' as const,
      defaultChecked: false,
    },
  ];

  const notificationSwitches: RecipeSwitchItemProps[] = [
    {
      id: 'email-notifications',
      label: 'Email notifications',
      description: 'Receive recipe updates via email',
      context: 'email-notifications' as const,
      defaultChecked: true,
    },
    {
      id: 'weekly-meal-plan',
      label: 'Weekly meal plans',
      description: 'Get weekly meal plan suggestions',
      context: 'weekly-meal-plan' as const,
      defaultChecked: false,
    },
    {
      id: 'recipe-suggestions',
      label: 'Recipe recommendations',
      description: 'Personalized recipe suggestions',
      context: 'recipe-suggestions' as const,
      defaultChecked: true,
    },
  ];

  const dietarySwitches: RecipeSwitchItemProps[] = [
    {
      id: 'vegetarian',
      label: 'Vegetarian',
      description: 'Show only vegetarian recipes',
      context: 'dietary-restrictions' as const,
      defaultChecked: false,
    },
    {
      id: 'vegan',
      label: 'Vegan',
      description: 'Show only vegan recipes',
      context: 'dietary-restrictions' as const,
      defaultChecked: false,
    },
    {
      id: 'gluten-free',
      label: 'Gluten-free',
      description: 'Show only gluten-free recipes',
      context: 'dietary-restrictions' as const,
      defaultChecked: false,
    },
  ];

  return (
    <div className="container mx-auto max-w-6xl p-8">
      <h1 className="mb-2 text-4xl font-bold">Switch Component</h1>
      <p className="text-muted-foreground mb-8">
        Toggle switches for settings and preferences with various styles and
        configurations.
      </p>

      {/* Basic Examples */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">Basic Examples</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-card space-y-4 rounded-lg border p-6">
            <h3 className="mb-4 font-medium">Sizes</h3>
            <Switch size="sm" label="Small" defaultChecked />
            <Switch size="md" label="Medium (default)" defaultChecked />
            <Switch size="lg" label="Large" defaultChecked />
            <Switch size="xl" label="Extra Large" defaultChecked />
          </div>

          <div className="bg-card space-y-4 rounded-lg border p-6">
            <h3 className="mb-4 font-medium">Variants</h3>
            <Switch variant="default" label="Default" defaultChecked />
            <Switch variant="success" label="Success" defaultChecked />
            <Switch variant="warning" label="Warning" defaultChecked />
            <Switch variant="danger" label="Danger" defaultChecked />
            <Switch variant="info" label="Info" defaultChecked />
            <Switch variant="subtle" label="Subtle" defaultChecked />
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">Interactive Demo</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-card rounded-lg border p-6">
            <h3 className="mb-4 font-medium">With Icons</h3>
            <div className="space-y-4">
              <Switch
                checked={settings.darkMode}
                onCheckedChange={v => setSettings({ ...settings, darkMode: v })}
                checkedIcon={<Moon className="h-3 w-3" />}
                uncheckedIcon={<Sun className="h-3 w-3" />}
                label="Theme"
                description={
                  settings.darkMode ? 'Dark mode enabled' : 'Light mode enabled'
                }
              />
              <Switch
                checked={settings.sound}
                onCheckedChange={v => setSettings({ ...settings, sound: v })}
                checkedIcon={<Volume2 className="h-3 w-3" />}
                uncheckedIcon={<Volume2 className="h-3 w-3 opacity-50" />}
                label="Sound"
                description={settings.sound ? 'Audio enabled' : 'Muted'}
                variant="info"
              />
              <Switch
                checked={settings.wifi}
                onCheckedChange={v => setSettings({ ...settings, wifi: v })}
                checkedIcon={<Wifi className="h-3 w-3" />}
                uncheckedIcon={<Wifi className="h-3 w-3 opacity-50" />}
                label="Wi-Fi"
                description={settings.wifi ? 'Connected' : 'Disconnected'}
                variant={settings.wifi ? 'success' : 'danger'}
              />
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <h3 className="mb-4 font-medium">States</h3>
            <div className="space-y-4">
              <Switch
                label="Interactive switch"
                description="Click to toggle"
                checked={basicSwitch}
                onCheckedChange={setBasicSwitch}
              />
              <Switch
                label="Disabled"
                description="Cannot be toggled"
                disabled
              />
              <Switch
                label="Disabled checked"
                description="Cannot be toggled"
                disabled
                defaultChecked
              />
              <Switch label="Loading" description="Processing..." loading />
              <Switch
                label="Required field"
                description="Must be enabled to continue"
                required
              />
            </div>
          </div>
        </div>
      </section>

      {/* Form Fields */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">Form Integration</h2>
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 font-medium">Agreement Form</h3>
          <div className="space-y-4">
            <SwitchField
              label="Terms and Conditions"
              helperText="I agree to the terms and conditions"
              required
              checked={formData.terms}
              onCheckedChange={v => setFormData({ ...formData, terms: v })}
              error={!formData.terms ? 'You must accept the terms' : undefined}
            />
            <SwitchField
              label="Marketing Communications"
              helperText="Receive promotional emails and offers"
              checked={formData.marketing}
              onCheckedChange={v => setFormData({ ...formData, marketing: v })}
            />
            <SwitchField
              label="Newsletter Subscription"
              helperText="Weekly recipe digest and cooking tips"
              checked={formData.newsletter}
              onCheckedChange={v => setFormData({ ...formData, newsletter: v })}
            />
            <SwitchField
              label="Cookie Preferences"
              helperText="Allow cookies for personalized experience"
              checked={formData.cookies}
              onCheckedChange={v => setFormData({ ...formData, cookies: v })}
            />
          </div>
        </div>
      </section>

      {/* Recipe Switch Groups */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">Recipe Settings Groups</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <RecipeSwitchGroup
            variant="preferences"
            title="Preferences"
            switches={preferencesSwitches}
            onBatchChange={values => {
              console.log('Preferences updated:', values);
              setGroupValues({ ...groupValues, ...values });
            }}
          />
          <RecipeSwitchGroup
            variant="notifications"
            title="Notifications"
            switches={notificationSwitches}
            onBatchChange={values => {
              console.log('Notifications updated:', values);
              setGroupValues({ ...groupValues, ...values });
            }}
          />
          <RecipeSwitchGroup
            variant="dietary"
            title="Dietary Restrictions"
            switches={dietarySwitches}
            onBatchChange={values => {
              console.log('Dietary updated:', values);
              setGroupValues({ ...groupValues, ...values });
            }}
          />
        </div>
      </section>

      {/* Settings Switches */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">Settings Panel</h2>
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 font-medium">Application Settings</h3>
          <div className="space-y-4">
            <SettingsSwitch
              icon={<Bell />}
              label="Push Notifications"
              description="Receive notifications on your device"
              checked={settings.notifications}
              onChange={v => handleAsyncChange('notifications', v)}
              badge={
                <span className="rounded bg-blue-100 px-2 py-1 text-xs">
                  Beta
                </span>
              }
              optimisticUpdate
            />
            <SettingsSwitch
              icon={<Globe />}
              label="Public Profile"
              description="Make your recipes visible to everyone"
              checked={settings.publicProfile}
              onChange={v => handleAsyncChange('publicProfile', v)}
              variant="info"
              optimisticUpdate
            />
            <SettingsSwitch
              icon={<Save />}
              label="Auto-save"
              description="Automatically save your work"
              checked={settings.autoSave}
              onChange={v => handleAsyncChange('autoSave', v)}
              variant="success"
              optimisticUpdate
            />
            <SettingsSwitch
              icon={<Shield />}
              label="Privacy Mode"
              description="Enhanced privacy protection"
              checked={settings.privacy}
              onChange={v => handleAsyncChange('privacy', v)}
              variant="warning"
              optimisticUpdate
            />
          </div>
        </div>
      </section>

      {/* Animated Switches */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">Animated Switches</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-card rounded-lg border p-6">
            <h3 className="mb-4 font-medium">Slide (Default)</h3>
            <AnimatedSwitch
              label="Slide animation"
              description="200ms transition"
              animationType="slide"
              animationDuration={200}
              defaultChecked
            />
          </div>
          <div className="bg-card rounded-lg border p-6">
            <h3 className="mb-4 font-medium">Fade</h3>
            <AnimatedSwitch
              label="Fade animation"
              description="300ms transition"
              animationType="fade"
              animationDuration={300}
              defaultChecked
            />
          </div>
          <div className="bg-card rounded-lg border p-6">
            <h3 className="mb-4 font-medium">Scale</h3>
            <AnimatedSwitch
              label="Scale animation"
              description="150ms transition"
              animationType="scale"
              animationDuration={150}
              defaultChecked
            />
          </div>
        </div>
      </section>

      {/* Orientations */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">Layout Orientations</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-card rounded-lg border p-6">
            <h3 className="mb-4 font-medium">Horizontal Layouts</h3>
            <div className="space-y-6">
              <Switch
                orientation="horizontal"
                label="Horizontal (default)"
                description="Switch on the left"
                defaultChecked
              />
              <Switch
                orientation="reverse-horizontal"
                label="Reverse horizontal"
                description="Switch on the right"
                defaultChecked
              />
            </div>
          </div>
          <div className="bg-card rounded-lg border p-6">
            <h3 className="mb-4 font-medium">Vertical Layouts</h3>
            <div className="space-y-6">
              <Switch
                orientation="vertical"
                label="Vertical"
                description="Switch on top"
                defaultChecked
              />
              <Switch
                orientation="reverse-vertical"
                label="Reverse vertical"
                description="Switch on bottom"
                defaultChecked
              />
            </div>
          </div>
        </div>
      </section>

      {/* Current State Display */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">State Monitor</h2>
        <div className="bg-muted rounded-lg p-6">
          <h3 className="mb-4 font-medium">Current Settings</h3>
          <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
            <div>
              <span className="text-muted-foreground">Dark Mode:</span>{' '}
              <span className="font-medium">
                {settings.darkMode ? 'On' : 'Off'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Notifications:</span>{' '}
              <span className="font-medium">
                {settings.notifications ? 'On' : 'Off'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Auto-save:</span>{' '}
              <span className="font-medium">
                {settings.autoSave ? 'On' : 'Off'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Public Profile:</span>{' '}
              <span className="font-medium">
                {settings.publicProfile ? 'On' : 'Off'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Sound:</span>{' '}
              <span className="font-medium">
                {settings.sound ? 'On' : 'Off'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Wi-Fi:</span>{' '}
              <span className="font-medium">
                {settings.wifi ? 'On' : 'Off'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Privacy:</span>{' '}
              <span className="font-medium">
                {settings.privacy ? 'On' : 'Off'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Analytics:</span>{' '}
              <span className="font-medium">
                {settings.analytics ? 'On' : 'Off'}
              </span>
            </div>
          </div>
          {isLoading && (
            <div className="text-muted-foreground mt-4 text-sm">
              <Zap className="mr-2 inline-block h-4 w-4 animate-pulse" />
              Saving settings...
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
