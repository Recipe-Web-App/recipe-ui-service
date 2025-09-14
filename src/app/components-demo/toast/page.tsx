'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Toast } from '@/components/ui/toast';

export default function ToastDemo() {
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

    if (newToast.autoDismiss) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id));
      }, 5000);
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-foreground mb-2 text-3xl font-bold">
          Toast Component
        </h1>
        <p className="text-muted-foreground text-lg">
          Flexible, accessible toast notification component with auto-dismiss,
          progress indicators, and multiple variants.
        </p>
      </div>

      {/* Toast Container */}
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

      <div className="space-y-8">
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
                  <label className="mb-2 block text-sm font-medium">Size</label>
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

        {/* Code Examples */}
        <Card size="lg">
          <CardHeader>
            <CardTitle>Code Examples</CardTitle>
            <CardDescription>
              Implementation examples for toast notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
                <div className="text-muted-foreground mb-2">{`// Basic toast`}</div>
                <div>{`<Toast`}</div>
                <div>{`  variant="success"`}</div>
                <div>{`  title="Success!"`}</div>
                <div>{`  description="Operation completed."`}</div>
                <div>{`/>`}</div>
              </div>
              <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
                <div className="text-muted-foreground mb-2">
                  {`// With action and progress`}
                </div>
                <div>{`<Toast`}</div>
                <div>{`  variant="warning"`}</div>
                <div>{`  title="Session Expiring"`}</div>
                <div>{`  description="5 minutes remaining"`}</div>
                <div>{`  action="Extend"`}</div>
                <div>{`  showProgress`}</div>
                <div>{`  onAction={handleExtend}`}</div>
                <div>{`/>`}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
