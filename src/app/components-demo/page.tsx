'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalTitle,
  ModalDescription,
} from '@/components/ui/modal';
import {
  Toast,
  ToastRoot,
  ToastIcon,
  ToastContent,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
} from '@/components/ui/toast';
import * as DialogPrimitive from '@radix-ui/react-dialog';

/**
 * Component Demo Page
 *
 * Interactive playground for testing and showcasing UI components.
 * This page will grow as we add more components to the design system.
 */
export default function ComponentsDemo() {
  // Button demo state
  const [buttonLoading, setButtonLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  // Input demo state
  const [inputValue, setInputValue] = useState('');
  const [inputDisabled, setInputDisabled] = useState(false);
  const [inputLoading, setInputLoading] = useState(false);
  const [inputFloating, setInputFloating] = useState(false);
  const [inputClearable, setInputClearable] = useState(false);
  const [inputShowCount, setInputShowCount] = useState(false);
  const [inputError, setInputError] = useState(false);

  // Card demo state
  const [cardInteractive, setCardInteractive] = useState(false);
  const [cardClickCount, setCardClickCount] = useState(0);

  // Modal demo state
  const [modalVariant, setModalVariant] = useState<
    'default' | 'fullscreen' | 'drawer' | 'sheet'
  >('default');
  const [modalSize, setModalSize] = useState<
    'sm' | 'default' | 'lg' | 'xl' | '2xl' | 'full'
  >('default');

  // Toast demo state
  const [toasts, setToasts] = useState<
    Array<{
      id: string;
      variant: 'default' | 'success' | 'error' | 'warning' | 'info';
      size: 'sm' | 'default' | 'lg';
      title: string;
      description?: string;
      autoDismiss: boolean;
      showProgress: boolean;
      dismissible: boolean;
      showIcon: boolean;
      action?: string;
    }>
  >([]);
  const [toastVariant, setToastVariant] = useState<
    'default' | 'success' | 'error' | 'warning' | 'info'
  >('default');
  const [toastSize, setToastSize] = useState<'sm' | 'default' | 'lg'>(
    'default'
  );
  const [toastTitle, setToastTitle] = useState('Toast Notification');
  const [toastDescription, setToastDescription] = useState(
    'This is a sample toast message.'
  );
  const [toastAutoDismiss, setToastAutoDismiss] = useState(true);
  const [toastShowProgress, setToastShowProgress] = useState(false);
  const [toastDismissible, setToastDismissible] = useState(true);
  const [toastShowIcon, setToastShowIcon] = useState(true);
  const [toastAction, setToastAction] = useState('');

  const addToast = (
    toastConfig?: Partial<{
      variant: 'default' | 'success' | 'error' | 'warning' | 'info';
      size: 'sm' | 'default' | 'lg';
      title: string;
      description?: string;
      autoDismiss: boolean;
      showProgress: boolean;
      dismissible: boolean;
      showIcon: boolean;
      action?: string;
    }>
  ) => {
    const newToast = {
      id: `toast-${Date.now()}-${Math.random()}`,
      variant: toastConfig?.variant ?? toastVariant,
      size: toastConfig?.size ?? toastSize,
      title: toastConfig?.title ?? toastTitle,
      description: toastConfig?.description ?? toastDescription,
      autoDismiss: toastConfig?.autoDismiss ?? toastAutoDismiss,
      showProgress: toastConfig?.showProgress ?? toastShowProgress,
      dismissible: toastConfig?.dismissible ?? toastDismissible,
      showIcon: toastConfig?.showIcon ?? toastShowIcon,
      action: toastConfig?.action ?? (toastAction || undefined),
    };
    setToasts(prev => [...prev, newToast]);

    // Auto-remove after duration if auto-dismiss is enabled
    if (newToast.autoDismiss) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id));
      }, 5000);
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleAsyncAction = async () => {
    setButtonLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setButtonLoading(false);
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-foreground text-3xl font-bold">
                Components Demo
              </h1>
              <p className="text-muted-foreground mt-1">
                Interactive playground for UI components
              </p>
            </div>
            <div className="text-muted-foreground text-sm">
              Recipe UI Service Design System
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card size="sm">
            <CardContent>
              <div className="text-primary text-2xl font-bold">5</div>
              <div className="text-muted-foreground text-sm">Components</div>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardContent>
              <div className="text-primary text-2xl font-bold">18</div>
              <div className="text-muted-foreground text-sm">Variants</div>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardContent>
              <div className="text-primary text-2xl font-bold">5</div>
              <div className="text-muted-foreground text-sm">Sizes</div>
            </CardContent>
          </Card>
        </div>

        {/* Button Component Section */}
        <section className="space-y-8">
          <div>
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              Button Component
            </h2>
            <p className="text-muted-foreground mb-6">
              Flexible, accessible button component with multiple variants,
              sizes, and states.
            </p>
          </div>

          {/* Interactive Controls */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="mb-4 text-lg font-medium">Interactive Controls</h3>
            <div className="mb-6 flex flex-wrap gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={buttonDisabled}
                  onChange={e => setButtonDisabled(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Disabled</span>
              </label>
              <Button
                size="sm"
                variant="outline"
                loading={buttonLoading}
                onClick={handleAsyncAction}
              >
                {buttonLoading ? 'Loading...' : 'Test Loading State'}
              </Button>
            </div>

            <div className="space-y-6">
              {/* Variants */}
              <div>
                <h4 className="mb-3 font-medium">Variants</h4>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="default"
                    disabled={buttonDisabled}
                    loading={buttonLoading}
                  >
                    Default
                  </Button>
                  <Button
                    variant="destructive"
                    disabled={buttonDisabled}
                    loading={buttonLoading}
                  >
                    Destructive
                  </Button>
                  <Button
                    variant="outline"
                    disabled={buttonDisabled}
                    loading={buttonLoading}
                  >
                    Outline
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={buttonDisabled}
                    loading={buttonLoading}
                  >
                    Secondary
                  </Button>
                  <Button
                    variant="ghost"
                    disabled={buttonDisabled}
                    loading={buttonLoading}
                  >
                    Ghost
                  </Button>
                  <Button
                    variant="link"
                    disabled={buttonDisabled}
                    loading={buttonLoading}
                  >
                    Link
                  </Button>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h4 className="mb-3 font-medium">Sizes</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    size="sm"
                    disabled={buttonDisabled}
                    loading={buttonLoading}
                  >
                    Small
                  </Button>
                  <Button
                    size="default"
                    disabled={buttonDisabled}
                    loading={buttonLoading}
                  >
                    Default
                  </Button>
                  <Button
                    size="lg"
                    disabled={buttonDisabled}
                    loading={buttonLoading}
                  >
                    Large
                  </Button>
                  <Button
                    size="icon"
                    disabled={buttonDisabled}
                    loading={buttonLoading}
                  >
                    🚀
                  </Button>
                </div>
              </div>

              {/* Polymorphic Usage */}
              <div>
                <h4 className="mb-3 font-medium">Polymorphic (asChild)</h4>
                <div className="flex flex-wrap gap-3">
                  <Button asChild>
                    <a href="#demo" className="no-underline">
                      Link Button
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <button type="button" className="cursor-pointer">
                      Custom Element
                    </button>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Examples */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="mb-4 text-lg font-medium">Common Usage Patterns</h3>

            <div className="space-y-6">
              {/* Form Actions */}
              <div className="bg-muted/50 rounded-lg border p-4">
                <h4 className="mb-3 font-medium">Form Actions</h4>
                <div className="flex gap-2">
                  <Button type="submit">Save Recipe</Button>
                  <Button type="button" variant="outline">
                    Save as Draft
                  </Button>
                  <Button type="button" variant="ghost">
                    Cancel
                  </Button>
                </div>
              </div>

              {/* Card Actions */}
              <div className="bg-muted/50 rounded-lg border p-4">
                <h4 className="mb-3 font-medium">Recipe Card Actions</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium">Chocolate Chip Cookies</h5>
                    <p className="text-muted-foreground text-sm">
                      Ready in 25 minutes
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Save
                    </Button>
                    <Button size="sm">View Recipe</Button>
                  </div>
                </div>
              </div>

              {/* Destructive Actions */}
              <div className="bg-muted/50 rounded-lg border p-4">
                <h4 className="mb-3 font-medium">Destructive Actions</h4>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost">Cancel</Button>
                  <Button variant="destructive">Delete Recipe</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Code Examples */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="mb-4 text-lg font-medium">Code Examples</h3>
            <div className="space-y-4">
              <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
                <div className="text-muted-foreground mb-2">{`// Basic usage`}</div>
                <div>{`<Button>Click me</Button>`}</div>
              </div>
              <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
                <div className="text-muted-foreground mb-2">
                  {`// With variants and states`}
                </div>
                <div>{`<Button variant="destructive" loading={isLoading}>`}</div>
                <div>{`  {isLoading ? 'Deleting...' : 'Delete Recipe'}`}</div>
                <div>{`</Button>`}</div>
              </div>
              <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
                <div className="text-muted-foreground mb-2">
                  {`// Polymorphic usage`}
                </div>
                <div>{`<Button asChild>`}</div>
                <div>{`  <a href="/recipes">View All Recipes</a>`}</div>
                <div>{`</Button>`}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Input Component Section */}
        <section className="mt-12 space-y-8">
          <div>
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              Input Component
            </h2>
            <p className="text-muted-foreground mb-6">
              Comprehensive input component with multiple variants, states, and
              advanced features like floating labels, icons, and validation.
            </p>
          </div>

          {/* Interactive Controls */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="mb-4 text-lg font-medium">Interactive Controls</h3>
            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={inputDisabled}
                  onChange={e => setInputDisabled(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Disabled</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={inputLoading}
                  onChange={e => setInputLoading(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Loading</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={inputFloating}
                  onChange={e => setInputFloating(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Floating Label</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={inputClearable}
                  onChange={e => setInputClearable(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Clearable</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={inputShowCount}
                  onChange={e => setInputShowCount(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Character Count</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={inputError}
                  onChange={e => setInputError(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Error State</span>
              </label>
            </div>

            <div className="space-y-8">
              {/* Live Example */}
              <div>
                <h4 className="mb-3 font-medium">Live Example</h4>
                <div className="max-w-md">
                  <Input
                    label="Recipe Name"
                    placeholder={inputFloating ? '' : 'Enter recipe name...'}
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    disabled={inputDisabled}
                    loading={inputLoading}
                    clearable={inputClearable}
                    floatingLabel={inputFloating}
                    showCharacterCount={inputShowCount}
                    characterLimit={inputShowCount ? 50 : undefined}
                    errorText={
                      inputError ? 'Recipe name is required' : undefined
                    }
                    helperText={
                      !inputError
                        ? 'Give your recipe a descriptive name'
                        : undefined
                    }
                    leftIcon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-4 w-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25A8.966 8.966 0 0118 3.75c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                        />
                      </svg>
                    }
                    onClear={() => setInputValue('')}
                  />
                </div>
              </div>

              {/* Variants */}
              <div>
                <h4 className="mb-3 font-medium">Variants</h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <Input
                    variant="default"
                    placeholder="Default variant"
                    disabled={inputDisabled}
                    loading={inputLoading}
                  />
                  <Input
                    variant="filled"
                    placeholder="Filled variant"
                    disabled={inputDisabled}
                    loading={inputLoading}
                  />
                  <Input
                    variant="outlined"
                    placeholder="Outlined variant"
                    disabled={inputDisabled}
                    loading={inputLoading}
                  />
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h4 className="mb-3 font-medium">Sizes</h4>
                <div className="space-y-3">
                  <Input
                    size="sm"
                    placeholder="Small input"
                    disabled={inputDisabled}
                    loading={inputLoading}
                  />
                  <Input
                    size="default"
                    placeholder="Default input"
                    disabled={inputDisabled}
                    loading={inputLoading}
                  />
                  <Input
                    size="lg"
                    placeholder="Large input"
                    disabled={inputDisabled}
                    loading={inputLoading}
                  />
                </div>
              </div>

              {/* States */}
              <div>
                <h4 className="mb-3 font-medium">States</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    placeholder="Default state"
                    helperText="This is a helper message"
                  />
                  <Input
                    placeholder="Success state"
                    state="success"
                    helperText="Input is valid!"
                  />
                  <Input
                    placeholder="Warning state"
                    state="warning"
                    helperText="Please check this field"
                  />
                  <Input
                    placeholder="Error state"
                    errorText="This field is required"
                  />
                </div>
              </div>

              {/* Input Types */}
              <div>
                <h4 className="mb-3 font-medium">Input Types</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    type="text"
                    label="Text Input"
                    placeholder="Enter text..."
                  />
                  <Input
                    type="email"
                    label="Email Input"
                    placeholder="Enter email..."
                  />
                  <Input
                    type="password"
                    label="Password Input"
                    placeholder="Enter password..."
                  />
                  <Input
                    type="number"
                    label="Number Input"
                    placeholder="Enter number..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Usage Examples */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="mb-4 text-lg font-medium">
              Recipe App Usage Examples
            </h3>

            <div className="space-y-6">
              {/* Recipe Form */}
              <div className="bg-muted/50 rounded-lg border p-4">
                <h4 className="mb-3 font-medium">Recipe Creation Form</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Recipe Name"
                    placeholder="Chocolate Chip Cookies"
                    showCharacterCount
                    characterLimit={50}
                    required
                  />
                  <Input
                    label="Preparation Time"
                    type="number"
                    placeholder="30"
                    rightIcon={
                      <span className="text-muted-foreground text-sm">min</span>
                    }
                  />
                  <Input
                    label="Servings"
                    type="number"
                    placeholder="4"
                    rightIcon={
                      <span className="text-muted-foreground text-sm">
                        people
                      </span>
                    }
                  />
                  <Input
                    label="Difficulty"
                    placeholder="Easy"
                    helperText="Rate from Easy to Hard"
                  />
                </div>
              </div>

              {/* Search */}
              <div className="bg-muted/50 rounded-lg border p-4">
                <h4 className="mb-3 font-medium">Recipe Search</h4>
                <Input
                  size="lg"
                  placeholder="Search for recipes..."
                  clearable
                  leftIcon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                      />
                    </svg>
                  }
                />
              </div>

              {/* User Profile */}
              <div className="bg-muted/50 rounded-lg border p-4">
                <h4 className="mb-3 font-medium">User Profile Settings</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Display Name"
                    placeholder="Chef Sarah"
                    floatingLabel
                    showCharacterCount
                    characterLimit={30}
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="sarah@example.com"
                    floatingLabel
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Code Examples */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="mb-4 text-lg font-medium">Code Examples</h3>
            <div className="space-y-4">
              <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
                <div className="text-muted-foreground mb-2">{`// Basic usage`}</div>
                <div>{`<Input placeholder="Enter text..." />`}</div>
              </div>
              <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
                <div className="text-muted-foreground mb-2">
                  {`// With label and validation`}
                </div>
                <div>{`<Input`}</div>
                <div>{`  label="Recipe Name"`}</div>
                <div>{`  required`}</div>
                <div>{`  errorText="Name is required"`}</div>
                <div>{`  showCharacterCount`}</div>
                <div>{`  characterLimit={50}`}</div>
                <div>{`/>`}</div>
              </div>
              <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
                <div className="text-muted-foreground mb-2">
                  {`// Advanced features`}
                </div>
                <div>{`<Input`}</div>
                <div>{`  floatingLabel`}</div>
                <div>{`  label="Search Recipes"`}</div>
                <div>{`  clearable`}</div>
                <div>{`  leftIcon={<SearchIcon />}`}</div>
                <div>{`  loading={isSearching}`}</div>
                <div>{`/>`}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Card Component Section */}
        <section className="mt-12 space-y-8">
          <div>
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              Card Component
            </h2>
            <p className="text-muted-foreground mb-6">
              Flexible card component with multiple variants and compound
              pattern. Perfect for recipe cards, info panels, and stat displays.
            </p>
          </div>

          {/* Interactive Controls */}
          <Card size="lg">
            <CardHeader>
              <CardTitle>Interactive Controls</CardTitle>
              <CardDescription>
                Test different card features and states
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex flex-wrap gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={cardInteractive}
                    onChange={e => setCardInteractive(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Interactive</span>
                </label>
              </div>

              <div className="space-y-8">
                {/* Live Example */}
                <div>
                  <h4 className="mb-3 font-medium">Live Example</h4>
                  <div className="max-w-md">
                    <Card
                      variant="elevated"
                      interactive={cardInteractive}
                      onClick={() => {
                        if (cardInteractive) {
                          setCardClickCount(prev => prev + 1);
                        }
                      }}
                    >
                      <CardHeader>
                        <CardTitle>Sample Recipe Card</CardTitle>
                        <CardDescription>
                          {cardInteractive
                            ? `Clicked ${cardClickCount} times`
                            : 'Recipe description'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          This is a sample recipe card content area.
                        </p>
                        <div className="text-muted-foreground mt-2 flex gap-2 text-xs">
                          <span>⏱️ 30 mins</span>
                          <span>👨‍🍳 Easy</span>
                          <span>🍽️ 4 servings</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="flex w-full items-center justify-between">
                          <span className="text-muted-foreground text-sm">
                            ★★★★★
                          </span>
                          <Button size="sm" variant="outline">
                            View Recipe
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </div>
                </div>

                {/* Variants */}
                <div>
                  <h4 className="mb-3 font-medium">Variants</h4>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card variant="default">
                      <CardContent>
                        <CardTitle className="mb-2">Default</CardTitle>
                        <CardDescription>
                          Clean minimal style with subtle border
                        </CardDescription>
                      </CardContent>
                    </Card>
                    <Card variant="elevated">
                      <CardContent>
                        <CardTitle className="mb-2">Elevated</CardTitle>
                        <CardDescription>
                          Enhanced shadow for prominence
                        </CardDescription>
                      </CardContent>
                    </Card>
                    <Card variant="outlined">
                      <CardContent>
                        <CardTitle className="mb-2">Outlined</CardTitle>
                        <CardDescription>
                          Stronger border, no background
                        </CardDescription>
                      </CardContent>
                    </Card>
                    <Card variant="ghost">
                      <CardContent>
                        <CardTitle className="mb-2">Ghost</CardTitle>
                        <CardDescription>
                          Minimal styling, no background
                        </CardDescription>
                      </CardContent>
                    </Card>
                    <Card
                      variant="interactive"
                      onClick={() => alert('Interactive card clicked!')}
                    >
                      <CardContent>
                        <CardTitle className="mb-2">Interactive</CardTitle>
                        <CardDescription>
                          Hover effects and click handling
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <h4 className="mb-3 font-medium">Sizes</h4>
                  <div className="space-y-4">
                    <Card size="sm" variant="outlined">
                      <CardContent>
                        <CardTitle className="text-lg">Small Card</CardTitle>
                        <CardDescription>Compact padding (p-3)</CardDescription>
                      </CardContent>
                    </Card>
                    <Card size="default" variant="outlined">
                      <CardContent>
                        <CardTitle>Default Card</CardTitle>
                        <CardDescription>
                          Standard padding (p-4)
                        </CardDescription>
                      </CardContent>
                    </Card>
                    <Card size="lg" variant="outlined">
                      <CardContent>
                        <CardTitle className="text-2xl">Large Card</CardTitle>
                        <CardDescription>
                          Spacious padding (p-6)
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Examples */}
          <Card size="lg">
            <CardHeader>
              <CardTitle>Recipe App Usage Examples</CardTitle>
              <CardDescription>
                Real-world card implementations for the recipe app
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Recipe Cards */}
                <div>
                  <h4 className="mb-3 font-medium">Recipe Cards</h4>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card variant="elevated" interactive>
                      <CardContent className="relative aspect-square">
                        <div className="text-muted-foreground mb-3 flex h-32 items-center justify-center rounded-md bg-gradient-to-br from-orange-100 to-red-100 text-sm">
                          Recipe Image
                        </div>
                        <CardTitle className="mb-1">
                          Chocolate Chip Cookies
                        </CardTitle>
                        <CardDescription className="mb-2">
                          Classic homemade cookies
                        </CardDescription>
                        <div className="text-muted-foreground flex gap-2 text-xs">
                          <span>⏱️ 30m</span>
                          <span>👨‍🍳 Easy</span>
                          <span>⭐ 4.8</span>
                        </div>
                      </CardContent>
                    </Card>
                    <Card variant="elevated" interactive>
                      <CardContent className="relative aspect-square">
                        <div className="text-muted-foreground mb-3 flex h-32 items-center justify-center rounded-md bg-gradient-to-br from-green-100 to-blue-100 text-sm">
                          Recipe Image
                        </div>
                        <CardTitle className="mb-1">Caesar Salad</CardTitle>
                        <CardDescription className="mb-2">
                          Fresh and crispy salad
                        </CardDescription>
                        <div className="text-muted-foreground flex gap-2 text-xs">
                          <span>⏱️ 15m</span>
                          <span>👨‍🍳 Easy</span>
                          <span>⭐ 4.6</span>
                        </div>
                      </CardContent>
                    </Card>
                    <Card variant="elevated" interactive>
                      <CardContent className="relative aspect-square">
                        <div className="text-muted-foreground mb-3 flex h-32 items-center justify-center rounded-md bg-gradient-to-br from-purple-100 to-pink-100 text-sm">
                          Recipe Image
                        </div>
                        <CardTitle className="mb-1">Beef Stir Fry</CardTitle>
                        <CardDescription className="mb-2">
                          Quick and healthy dinner
                        </CardDescription>
                        <div className="text-muted-foreground flex gap-2 text-xs">
                          <span>⏱️ 25m</span>
                          <span>👨‍🍳 Medium</span>
                          <span>⭐ 4.9</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Stat Cards */}
                <div>
                  <h4 className="mb-3 font-medium">Dashboard Stats</h4>
                  <div className="grid gap-4 md:grid-cols-4">
                    <Card size="sm">
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                          142
                        </div>
                        <p className="text-muted-foreground text-xs">
                          Total Recipes
                        </p>
                      </CardContent>
                    </Card>
                    <Card size="sm">
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                          38
                        </div>
                        <p className="text-muted-foreground text-xs">
                          Favorites
                        </p>
                      </CardContent>
                    </Card>
                    <Card size="sm">
                      <CardContent>
                        <div className="text-2xl font-bold text-orange-600">
                          24
                        </div>
                        <p className="text-muted-foreground text-xs">
                          This Week
                        </p>
                      </CardContent>
                    </Card>
                    <Card size="sm">
                      <CardContent>
                        <div className="text-2xl font-bold text-purple-600">
                          4.8
                        </div>
                        <p className="text-muted-foreground text-xs">
                          Avg Rating
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Info Cards */}
                <div>
                  <h4 className="mb-3 font-medium">Info Cards</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card variant="outlined">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          💡 Pro Tip
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          Always preheat your oven to ensure even baking and
                          optimal results.
                        </p>
                      </CardContent>
                    </Card>
                    <Card variant="ghost">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          🏆 Achievement
                        </CardTitle>
                        <CardDescription>Recipe Master</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          You&apos;ve successfully completed 50 recipes!
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Code Examples */}
          <Card size="lg">
            <CardHeader>
              <CardTitle>Code Examples</CardTitle>
              <CardDescription>
                Implementation examples for different card patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
                  <div className="text-muted-foreground mb-2">{`// Basic card`}</div>
                  <div>{`<Card>`}</div>
                  <div>{`  <CardContent>Simple card content</CardContent>`}</div>
                  <div>{`</Card>`}</div>
                </div>
                <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
                  <div className="text-muted-foreground mb-2">{`// Recipe card with full structure`}</div>
                  <div>{`<Card variant="elevated" interactive>`}</div>
                  <div>{`  <CardHeader>`}</div>
                  <div>{`    <CardTitle>Recipe Name</CardTitle>`}</div>
                  <div>{`    <CardDescription>Brief description</CardDescription>`}</div>
                  <div>{`  </CardHeader>`}</div>
                  <div>{`  <CardContent>`}</div>
                  <div>{`    <p>Recipe details...</p>`}</div>
                  <div>{`  </CardContent>`}</div>
                  <div>{`  <CardFooter>`}</div>
                  <div>{`    <Button>View Recipe</Button>`}</div>
                  <div>{`  </CardFooter>`}</div>
                  <div>{`</Card>`}</div>
                </div>
                <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
                  <div className="text-muted-foreground mb-2">{`// Stat card`}</div>
                  <div>{`<Card size="sm">`}</div>
                  <div>{`  <CardContent>`}</div>
                  <div>{`    <div className="text-2xl font-bold">42</div>`}</div>
                  <div>{`    <p className="text-sm text-muted-foreground">`}</div>
                  <div>{`      Total Recipes`}</div>
                  <div>{`    </p>`}</div>
                  <div>{`  </CardContent>`}</div>
                  <div>{`</Card>`}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Modal Component Section */}
        <section className="mt-12 space-y-8">
          <div>
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              Modal Component
            </h2>
            <p className="text-muted-foreground mb-6">
              Accessible modal dialogs with multiple variants and compound
              pattern. Perfect for confirmations, detailed views, and settings.
            </p>
          </div>

          {/* Interactive Controls */}
          <Card size="lg">
            <CardHeader>
              <CardTitle>Interactive Modal Demo</CardTitle>
              <CardDescription>
                Try different modal variants and sizes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Variant
                    </label>
                    <select
                      value={modalVariant}
                      onChange={e =>
                        setModalVariant(
                          e.target.value as
                            | 'default'
                            | 'fullscreen'
                            | 'drawer'
                            | 'sheet'
                        )
                      }
                      className="border-border bg-background w-full rounded-md border px-3 py-2 text-sm"
                    >
                      <option value="default">Default</option>
                      <option value="fullscreen">Fullscreen</option>
                      <option value="drawer">Drawer</option>
                      <option value="sheet">Sheet</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Size
                    </label>
                    <select
                      value={modalSize}
                      onChange={e =>
                        setModalSize(
                          e.target.value as
                            | 'sm'
                            | 'default'
                            | 'lg'
                            | 'xl'
                            | '2xl'
                            | 'full'
                        )
                      }
                      className="border-border bg-background w-full rounded-md border px-3 py-2 text-sm"
                    >
                      <option value="sm">Small</option>
                      <option value="default">Default</option>
                      <option value="lg">Large</option>
                      <option value="xl">Extra Large</option>
                      <option value="2xl">2X Large</option>
                      <option value="full">Full</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="mb-3 font-medium">Live Demo</h4>
                  <Modal>
                    <ModalTrigger asChild>
                      <Button>{`Open ${modalVariant} Modal (${modalSize})`}</Button>
                    </ModalTrigger>
                    <ModalContent
                      variant={modalVariant}
                      size={modalSize}
                      showClose
                    >
                      <ModalHeader>
                        <ModalTitle>Sample Recipe Modal</ModalTitle>
                        <ModalDescription>
                          This is a {modalVariant} modal with {modalSize} size.
                        </ModalDescription>
                      </ModalHeader>
                      <ModalBody scrollable>
                        <div className="space-y-4">
                          <p>
                            This modal demonstrates the {modalVariant} variant
                            with scrollable content.
                          </p>
                          <div className="space-y-2">
                            <h5 className="font-medium">Ingredients:</h5>
                            <ul className="list-inside list-disc space-y-1 text-sm">
                              <li>2 cups all-purpose flour</li>
                              <li>1 cup sugar</li>
                              <li>1/2 cup butter</li>
                              <li>2 eggs</li>
                              <li>1 tsp vanilla extract</li>
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <h5 className="font-medium">Instructions:</h5>
                            <ol className="list-inside list-decimal space-y-1 text-sm">
                              <li>Preheat oven to 350°F</li>
                              <li>Mix dry ingredients in a bowl</li>
                              <li>Add wet ingredients and mix well</li>
                              <li>Bake for 25-30 minutes</li>
                            </ol>
                          </div>
                        </div>
                      </ModalBody>
                      <ModalFooter>
                        <DialogPrimitive.Close asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogPrimitive.Close>
                        <DialogPrimitive.Close asChild>
                          <Button>Save Recipe</Button>
                        </DialogPrimitive.Close>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                </div>

                <div>
                  <h4 className="mb-3 font-medium">Modal Examples</h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    {/* Confirmation Modal */}
                    <Modal>
                      <ModalTrigger asChild>
                        <Button variant="destructive" size="sm">
                          Delete Recipe
                        </Button>
                      </ModalTrigger>
                      <ModalContent size="sm">
                        <ModalHeader>
                          <ModalTitle>Delete Recipe</ModalTitle>
                          <ModalDescription>
                            Are you sure you want to delete this recipe? This
                            action cannot be undone.
                          </ModalDescription>
                        </ModalHeader>
                        <ModalFooter>
                          <DialogPrimitive.Close asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogPrimitive.Close>
                          <DialogPrimitive.Close asChild>
                            <Button variant="destructive">Delete</Button>
                          </DialogPrimitive.Close>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>

                    {/* Recipe Details Modal */}
                    <Modal>
                      <ModalTrigger asChild>
                        <Button variant="outline" size="sm">
                          Recipe Details
                        </Button>
                      </ModalTrigger>
                      <ModalContent size="lg">
                        <ModalHeader>
                          <ModalTitle>Chocolate Chip Cookies</ModalTitle>
                          <ModalDescription>
                            Classic homemade cookies - 30 mins • Easy • 24
                            cookies
                          </ModalDescription>
                        </ModalHeader>
                        <ModalBody scrollable>
                          <div className="space-y-6">
                            <div className="flex h-32 items-center justify-center rounded-lg bg-gradient-to-br from-orange-100 to-red-100">
                              <span className="text-muted-foreground text-sm">
                                Recipe Image
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-center">
                              <div>
                                <div className="text-2xl font-bold">30</div>
                                <div className="text-muted-foreground text-xs">
                                  Minutes
                                </div>
                              </div>
                              <div>
                                <div className="text-2xl font-bold">24</div>
                                <div className="text-muted-foreground text-xs">
                                  Cookies
                                </div>
                              </div>
                              <div>
                                <div className="text-2xl font-bold">
                                  ⭐⭐⭐⭐⭐
                                </div>
                                <div className="text-muted-foreground text-xs">
                                  Rating
                                </div>
                              </div>
                            </div>
                          </div>
                        </ModalBody>
                        <ModalFooter>
                          <DialogPrimitive.Close asChild>
                            <Button variant="outline">❤️ Save</Button>
                          </DialogPrimitive.Close>
                          <DialogPrimitive.Close asChild>
                            <Button>Start Cooking</Button>
                          </DialogPrimitive.Close>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>

                    {/* Settings Modal */}
                    <Modal>
                      <ModalTrigger asChild>
                        <Button variant="outline" size="sm">
                          User Settings
                        </Button>
                      </ModalTrigger>
                      <ModalContent size="xl">
                        <ModalHeader>
                          <ModalTitle>Account Settings</ModalTitle>
                          <ModalDescription>
                            Manage your account preferences and settings
                          </ModalDescription>
                        </ModalHeader>
                        <ModalBody scrollable>
                          <div className="space-y-6">
                            <div>
                              <h5 className="mb-3 font-medium">
                                Profile Information
                              </h5>
                              <div className="grid gap-4 md:grid-cols-2">
                                <Input
                                  label="Display Name"
                                  defaultValue="Chef Sarah"
                                />
                                <Input
                                  label="Email"
                                  type="email"
                                  defaultValue="sarah@example.com"
                                />
                              </div>
                            </div>
                            <div>
                              <h5 className="mb-3 font-medium">Preferences</h5>
                              <div className="space-y-3">
                                <label className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    defaultChecked
                                    className="rounded"
                                  />
                                  <span className="text-sm">
                                    Email notifications for new recipes
                                  </span>
                                </label>
                                <label className="flex items-center gap-2">
                                  <input type="checkbox" className="rounded" />
                                  <span className="text-sm">
                                    Weekly meal plan suggestions
                                  </span>
                                </label>
                                <label className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    defaultChecked
                                    className="rounded"
                                  />
                                  <span className="text-sm">
                                    Share recipes publicly
                                  </span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </ModalBody>
                        <ModalFooter>
                          <DialogPrimitive.Close asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogPrimitive.Close>
                          <DialogPrimitive.Close asChild>
                            <Button>Save Changes</Button>
                          </DialogPrimitive.Close>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Code Examples */}
          <Card size="lg">
            <CardHeader>
              <CardTitle>Code Examples</CardTitle>
              <CardDescription>
                Implementation examples for different modal patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
                  <div className="text-muted-foreground mb-2">{`// Basic modal`}</div>
                  <div>{`<Modal>`}</div>
                  <div>{`  <ModalTrigger>Open</ModalTrigger>`}</div>
                  <div>{`  <ModalContent>`}</div>
                  <div>{`    <ModalHeader>`}</div>
                  <div>{`      <ModalTitle>Title</ModalTitle>`}</div>
                  <div>{`    </ModalHeader>`}</div>
                  <div>{`    <ModalBody>Content</ModalBody>`}</div>
                  <div>{`  </ModalContent>`}</div>
                  <div>{`</Modal>`}</div>
                </div>
                <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
                  <div className="text-muted-foreground mb-2">{`// Confirmation modal`}</div>
                  <div>{`<Modal>`}</div>
                  <div>{`  <ModalTrigger asChild>`}</div>
                  <div>{`    <Button variant="destructive">Delete</Button>`}</div>
                  <div>{`  </ModalTrigger>`}</div>
                  <div>{`  <ModalContent size="sm">`}</div>
                  <div>{`    <ModalHeader>`}</div>
                  <div>{`      <ModalTitle>Confirm Deletion</ModalTitle>`}</div>
                  <div>{`      <ModalDescription>`}</div>
                  <div>{`        This action cannot be undone.`}</div>
                  <div>{`      </ModalDescription>`}</div>
                  <div>{`    </ModalHeader>`}</div>
                  <div>{`    <ModalFooter>`}</div>
                  <div>{`      <ModalClose>Cancel</ModalClose>`}</div>
                  <div>{`      <ModalClose>Delete</ModalClose>`}</div>
                  <div>{`    </ModalFooter>`}</div>
                  <div>{`  </ModalContent>`}</div>
                  <div>{`</Modal>`}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Toast Component Section */}
        <section className="mt-12 space-y-8">
          <div>
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              Toast Component
            </h2>
            <p className="text-muted-foreground mb-6">
              Flexible, accessible toast notification component with
              auto-dismiss, progress indicators, and multiple variants. Perfect
              for user feedback and status updates.
            </p>
          </div>

          {/* Toast Container - Fixed position for demo toasts */}
          <div className="fixed top-4 right-4 z-50 flex max-w-sm flex-col gap-2">
            {toasts.map(toast => (
              <Toast
                key={toast.id}
                variant={toast.variant}
                size={toast.size}
                title={toast.title}
                description={toast.description}
                autoDismiss={toast.autoDismiss}
                showProgress={toast.showProgress}
                dismissible={toast.dismissible}
                showIcon={toast.showIcon}
                action={toast.action}
                onDismiss={() => removeToast(toast.id)}
                onAction={() => {
                  console.log(`Toast action clicked: ${toast.title}`);
                  removeToast(toast.id);
                }}
              />
            ))}
          </div>

          {/* Interactive Controls */}
          <Card size="lg">
            <CardHeader>
              <CardTitle>Interactive Toast Demo</CardTitle>
              <CardDescription>
                Configure and test different toast variants and features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Controls Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Variant
                    </label>
                    <select
                      value={toastVariant}
                      onChange={e =>
                        setToastVariant(
                          e.target.value as
                            | 'default'
                            | 'success'
                            | 'error'
                            | 'warning'
                            | 'info'
                        )
                      }
                      className="border-border bg-background w-full rounded-md border px-3 py-2 text-sm"
                    >
                      <option value="default">Default</option>
                      <option value="success">Success</option>
                      <option value="error">Error</option>
                      <option value="warning">Warning</option>
                      <option value="info">Info</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Size
                    </label>
                    <select
                      value={toastSize}
                      onChange={e =>
                        setToastSize(e.target.value as 'sm' | 'default' | 'lg')
                      }
                      className="border-border bg-background w-full rounded-md border px-3 py-2 text-sm"
                    >
                      <option value="sm">Small</option>
                      <option value="default">Default</option>
                      <option value="lg">Large</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Title
                    </label>
                    <Input
                      value={toastTitle}
                      onChange={e => setToastTitle(e.target.value)}
                      placeholder="Toast title..."
                      size="sm"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Description
                    </label>
                    <Input
                      value={toastDescription}
                      onChange={e => setToastDescription(e.target.value)}
                      placeholder="Toast description..."
                      size="sm"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Action Button Text
                    </label>
                    <Input
                      value={toastAction}
                      onChange={e => setToastAction(e.target.value)}
                      placeholder="Action text (optional)"
                      size="sm"
                    />
                  </div>
                </div>

                {/* Feature Toggles */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={toastAutoDismiss}
                      onChange={e => setToastAutoDismiss(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Auto-dismiss</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={toastShowProgress}
                      onChange={e => setToastShowProgress(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Show Progress</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={toastDismissible}
                      onChange={e => setToastDismissible(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Dismissible</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={toastShowIcon}
                      onChange={e => setToastShowIcon(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Show Icon</span>
                  </label>
                </div>

                {/* Launch Button */}
                <div>
                  <Button
                    onClick={() => addToast()}
                    size="lg"
                    className="w-full md:w-auto"
                  >
                    Show Toast ({toastVariant} - {toastSize})
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Examples */}
          <Card size="lg">
            <CardHeader>
              <CardTitle>Quick Examples</CardTitle>
              <CardDescription>
                Common toast scenarios with pre-configured settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                <Button
                  onClick={() =>
                    addToast({
                      variant: 'success',
                      title: 'Recipe Saved!',
                      description:
                        'Your chocolate chip cookies recipe has been saved.',
                      showProgress: true,
                    })
                  }
                  variant="outline"
                  size="sm"
                  className="justify-start"
                >
                  ✅ Success Example
                </Button>
                <Button
                  onClick={() =>
                    addToast({
                      variant: 'error',
                      title: 'Upload Failed',
                      description: 'Could not save recipe. Please try again.',
                      autoDismiss: false,
                      action: 'Retry',
                    })
                  }
                  variant="outline"
                  size="sm"
                  className="justify-start"
                >
                  ❌ Error Example
                </Button>
                <Button
                  onClick={() =>
                    addToast({
                      variant: 'warning',
                      title: 'Session Expiring',
                      description: 'You will be logged out in 5 minutes.',
                      showProgress: true,
                      action: 'Extend',
                    })
                  }
                  variant="outline"
                  size="sm"
                  className="justify-start"
                >
                  ⚠️ Warning Example
                </Button>
                <Button
                  onClick={() =>
                    addToast({
                      variant: 'info',
                      title: 'Pro Tip',
                      description: 'You can drag ingredients to reorder them.',
                      size: 'lg',
                    })
                  }
                  variant="outline"
                  size="sm"
                  className="justify-start"
                >
                  ℹ️ Info Example
                </Button>
                <Button
                  onClick={() =>
                    addToast({
                      variant: 'default',
                      title: 'Update Available',
                      description: 'Version 2.1 is now available.',
                      action: 'Update',
                    })
                  }
                  variant="outline"
                  size="sm"
                  className="justify-start"
                >
                  📦 Update Example
                </Button>
                <Button
                  onClick={() =>
                    addToast({
                      variant: 'success',
                      title: 'Import Complete',
                      description: 'Successfully imported 15 recipes.',
                      size: 'sm',
                      showIcon: false,
                    })
                  }
                  variant="outline"
                  size="sm"
                  className="justify-start"
                >
                  📤 Batch Example
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Variants Showcase */}
          <Card size="lg">
            <CardHeader>
              <CardTitle>Toast Variants</CardTitle>
              <CardDescription>
                All available toast variants with their default styling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="font-medium">Default Toast</h4>
                    <div className="rounded-lg border p-4">
                      <Toast
                        variant="default"
                        title="Default Notification"
                        description="This is a standard notification message."
                        autoDismiss={false}
                        dismissible={false}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">Success Toast</h4>
                    <div className="rounded-lg border p-4">
                      <Toast
                        variant="success"
                        title="Success!"
                        description="Your recipe has been saved successfully."
                        autoDismiss={false}
                        dismissible={false}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">Error Toast</h4>
                    <div className="rounded-lg border p-4">
                      <Toast
                        variant="error"
                        title="Error"
                        description="Failed to save your changes. Please try again."
                        autoDismiss={false}
                        dismissible={false}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">Warning Toast</h4>
                    <div className="rounded-lg border p-4">
                      <Toast
                        variant="warning"
                        title="Warning"
                        description="Your session will expire in 5 minutes."
                        autoDismiss={false}
                        dismissible={false}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">Info Toast</h4>
                    <div className="rounded-lg border p-4">
                      <Toast
                        variant="info"
                        title="Tip"
                        description="You can press Ctrl+S to save quickly."
                        autoDismiss={false}
                        dismissible={false}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">With Progress Bar</h4>
                    <div className="rounded-lg border p-4">
                      <Toast
                        variant="success"
                        title="Auto-dismiss"
                        description="This toast shows progress."
                        autoDismiss={false}
                        dismissible={false}
                        showProgress={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sizes Showcase */}
          <Card size="lg">
            <CardHeader>
              <CardTitle>Toast Sizes</CardTitle>
              <CardDescription>
                Available size variants for different use cases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Small (sm)</h4>
                  <div className="rounded-lg border p-4">
                    <Toast
                      size="sm"
                      variant="info"
                      title="Small Toast"
                      description="Compact size for less important notifications."
                      autoDismiss={false}
                      dismissible={false}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Default</h4>
                  <div className="rounded-lg border p-4">
                    <Toast
                      size="default"
                      variant="default"
                      title="Default Toast"
                      description="Standard size for most notifications."
                      autoDismiss={false}
                      dismissible={false}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Large (lg)</h4>
                  <div className="rounded-lg border p-4">
                    <Toast
                      size="lg"
                      variant="success"
                      title="Large Toast"
                      description="Prominent size for important notifications."
                      autoDismiss={false}
                      dismissible={false}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Features */}
          <Card size="lg">
            <CardHeader>
              <CardTitle>Advanced Features</CardTitle>
              <CardDescription>
                Compound components and custom implementations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="mb-3 font-medium">
                    Compound Components Usage
                  </h4>
                  <div className="rounded-lg border p-4">
                    <ToastRoot variant="success" size="lg">
                      <ToastIcon variant="success" />
                      <ToastContent size="lg">
                        <ToastTitle variant="success" size="lg">
                          Recipe Published!
                        </ToastTitle>
                        <ToastDescription variant="success" size="lg">
                          Your recipe &quot;Chocolate Chip Cookies&quot; is now
                          live.
                        </ToastDescription>
                        <div className="mt-3 flex items-center gap-2">
                          <ToastAction
                            variant="success"
                            onClick={() => console.log('View clicked')}
                          >
                            View Recipe
                          </ToastAction>
                          <ToastAction
                            variant="success"
                            onClick={() => console.log('Share clicked')}
                          >
                            Share
                          </ToastAction>
                        </div>
                      </ToastContent>
                      <ToastClose
                        variant="success"
                        onClick={() => console.log('Closed')}
                      />
                    </ToastRoot>
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 font-medium">Custom Icon Toast</h4>
                  <div className="rounded-lg border p-4">
                    <Toast
                      variant="info"
                      title="Custom Icon"
                      description="This toast has a custom emoji icon."
                      icon={<span className="text-2xl">🎉</span>}
                      autoDismiss={false}
                      dismissible={false}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 font-medium">Without Icon</h4>
                  <div className="rounded-lg border p-4">
                    <Toast
                      variant="default"
                      title="No Icon"
                      description="This toast doesn't show an icon."
                      showIcon={false}
                      autoDismiss={false}
                      dismissible={false}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Code Examples */}
          <Card size="lg">
            <CardHeader>
              <CardTitle>Code Examples</CardTitle>
              <CardDescription>
                Implementation examples for different toast patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
                  <div className="text-muted-foreground mb-2">{`// Basic toast`}</div>
                  <div>{`<Toast`}</div>
                  <div>{`  title="Success!"`}</div>
                  <div>{`  description="Your changes have been saved."`}</div>
                  <div>{`  variant="success"`}</div>
                  <div>{`/>`}</div>
                </div>
                <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
                  <div className="text-muted-foreground mb-2">
                    {`// Toast with action button`}
                  </div>
                  <div>{`<Toast`}</div>
                  <div>{`  title="Update Available"`}</div>
                  <div>{`  description="A new version is available."`}</div>
                  <div>{`  variant="info"`}</div>
                  <div>{`  action="Update Now"`}</div>
                  <div>{`  onAction={() => window.location.reload()}`}</div>
                  <div>{`  showProgress={true}`}</div>
                  <div>{`/>`}</div>
                </div>
                <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
                  <div className="text-muted-foreground mb-2">
                    {`// Compound components for flexibility`}
                  </div>
                  <div>{`<ToastRoot variant="error">`}</div>
                  <div>{`  <ToastIcon variant="error" />`}</div>
                  <div>{`  <ToastContent>`}</div>
                  <div>{`    <ToastTitle variant="error">`}</div>
                  <div>{`      Connection Failed`}</div>
                  <div>{`    </ToastTitle>`}</div>
                  <div>{`    <ToastDescription variant="error">`}</div>
                  <div>{`      Unable to connect to server.`}</div>
                  <div>{`    </ToastDescription>`}</div>
                  <div>{`    <ToastAction variant="error" onClick={retry}>`}</div>
                  <div>{`      Retry`}</div>
                  <div>{`    </ToastAction>`}</div>
                  <div>{`  </ToastContent>`}</div>
                  <div>{`  <ToastClose variant="error" />`}</div>
                  <div>{`</ToastRoot>`}</div>
                </div>
                <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
                  <div className="text-muted-foreground mb-2">
                    {`// Custom icon and styling`}
                  </div>
                  <div>{`<Toast`}</div>
                  <div>{`  title="Custom Icon"`}</div>
                  <div>{`  description="This toast has a custom icon."`}</div>
                  <div>{`  variant="info"`}</div>
                  <div>{`  icon={<span className="text-2xl">🎉</span>}`}</div>
                  <div>{`  className="border-2 border-purple-500"`}</div>
                  <div>{`/>`}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recipe App Examples */}
          <Card size="lg">
            <CardHeader>
              <CardTitle>Recipe App Usage Examples</CardTitle>
              <CardDescription>
                Real-world toast implementations for the recipe application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="mb-3 font-medium">
                    Common Recipe App Scenarios
                  </h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Button
                      onClick={() =>
                        addToast({
                          variant: 'success',
                          title: 'Recipe Saved',
                          description:
                            'Your chocolate chip cookies recipe has been saved to your cookbook.',
                          action: 'View Recipe',
                        })
                      }
                      variant="outline"
                      size="sm"
                      className="justify-start"
                    >
                      Save Confirmation
                    </Button>
                    <Button
                      onClick={() =>
                        addToast({
                          variant: 'error',
                          title: 'Upload Failed',
                          description:
                            'Could not upload recipe image. Please check your connection.',
                          action: 'Retry Upload',
                          autoDismiss: false,
                        })
                      }
                      variant="outline"
                      size="sm"
                      className="justify-start"
                    >
                      Error Handling
                    </Button>
                    <Button
                      onClick={() =>
                        addToast({
                          variant: 'info',
                          title: 'Pro Tip',
                          description:
                            'You can drag ingredients to reorder them in your recipe.',
                          showProgress: true,
                        })
                      }
                      variant="outline"
                      size="sm"
                      className="justify-start"
                    >
                      Feature Tips
                    </Button>
                    <Button
                      onClick={() =>
                        addToast({
                          variant: 'success',
                          title: 'Bulk Import Complete',
                          description:
                            'Successfully imported 15 recipes from your backup file.',
                          action: 'View Imported',
                        })
                      }
                      variant="outline"
                      size="sm"
                      className="justify-start"
                    >
                      Batch Operations
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 font-medium">User Workflow Examples</h4>
                  <div className="space-y-3">
                    <div className="bg-muted/50 rounded-lg border p-4">
                      <h5 className="mb-2 font-medium">
                        Recipe Creation Workflow
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          onClick={() =>
                            addToast({
                              variant: 'info',
                              title: 'Saving Draft...',
                              description: 'Auto-saving your recipe progress.',
                              size: 'sm',
                              showProgress: true,
                            })
                          }
                          size="sm"
                          variant="ghost"
                        >
                          Auto-save
                        </Button>
                        <Button
                          onClick={() =>
                            addToast({
                              variant: 'warning',
                              title: 'Missing Ingredients',
                              description:
                                'Please add at least one ingredient.',
                              size: 'sm',
                            })
                          }
                          size="sm"
                          variant="ghost"
                        >
                          Validation
                        </Button>
                        <Button
                          onClick={() =>
                            addToast({
                              variant: 'success',
                              title: 'Recipe Published',
                              description:
                                'Your recipe is now visible to other users.',
                              action: 'Share',
                              size: 'sm',
                            })
                          }
                          size="sm"
                          variant="ghost"
                        >
                          Publish
                        </Button>
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-lg border p-4">
                      <h5 className="mb-2 font-medium">
                        Meal Planning Workflow
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          onClick={() =>
                            addToast({
                              variant: 'info',
                              title: 'Recipe Added',
                              description: 'Added to Monday dinner.',
                              size: 'sm',
                            })
                          }
                          size="sm"
                          variant="ghost"
                        >
                          Add to Plan
                        </Button>
                        <Button
                          onClick={() =>
                            addToast({
                              variant: 'success',
                              title: 'Shopping List Updated',
                              description:
                                'Ingredients added to your shopping list.',
                              action: 'View List',
                              size: 'sm',
                            })
                          }
                          size="sm"
                          variant="ghost"
                        >
                          Generate List
                        </Button>
                        <Button
                          onClick={() =>
                            addToast({
                              variant: 'warning',
                              title: 'Meal Plan Conflict',
                              description:
                                'You already have a recipe for Tuesday dinner.',
                              action: 'Replace',
                              size: 'sm',
                            })
                          }
                          size="sm"
                          variant="ghost"
                        >
                          Conflict
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Future Components Section */}
        <section className="mt-12 space-y-4">
          <h2 className="text-foreground text-2xl font-semibold">
            Coming Soon
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {['Skeleton', 'Badge', 'Dropdown', 'Tabs', 'Accordion'].map(
              component => (
                <Card key={component} variant="ghost" className="opacity-60">
                  <CardContent>
                    <CardTitle className="text-base">{component}</CardTitle>
                    <CardDescription className="mt-1">
                      Component in development
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
