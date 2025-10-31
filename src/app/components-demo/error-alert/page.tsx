'use client';

import React, { useState, useMemo } from 'react';
import { ErrorAlert } from '@/components/error/ErrorAlert';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ServiceType,
  ErrorSeverity,
  type ServiceErrorMetadata,
} from '@/types/error/service-errors';
import {
  ComponentErrorType,
  ComponentErrorSeverity,
  type ComponentErrorMetadata,
} from '@/types/error/component-errors';
import {
  PageErrorType,
  PageErrorSeverity,
  RecoveryActionType,
  HttpStatusCode,
  type PageErrorMetadata,
} from '@/types/error/page-errors';
import { ErrorAlertSeverity } from '@/types/error/error-alert';

export default function ErrorAlertDemo() {
  const [selectedVariant, setSelectedVariant] = useState<
    'inline' | 'banner' | 'toast' | 'card'
  >('inline');
  const [selectedSeverity, setSelectedSeverity] = useState<ErrorAlertSeverity>(
    ErrorAlertSeverity.ERROR
  );
  const [selectedSize, setSelectedSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [selectedErrorType, setSelectedErrorType] = useState<
    'simple' | 'validation' | 'service' | 'component' | 'page' | 'network'
  >('simple');
  const [showIcon, setShowIcon] = useState(true);
  const [showClose, setShowClose] = useState(true);
  const [withRetry, setWithRetry] = useState(true);
  const [withHint, setWithHint] = useState(false);
  const [autoDismiss, setAutoDismiss] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Memoize timestamp to avoid impure Date.now() calls in render
  // eslint-disable-next-line react-hooks/purity
  const stableTimestamp = useMemo(() => Date.now(), []);

  // Sample errors
  const simpleError = 'Failed to save recipe. Please try again.';

  const validationErrors = [
    { field: 'title', message: 'Title is required' },
    { field: 'servings', message: 'Servings must be at least 1' },
    { field: 'prepTime', message: 'Prep time cannot be negative' },
  ];

  const serviceError: ServiceErrorMetadata = useMemo(
    () => ({
      serviceType: ServiceType.RECIPE_MANAGEMENT,
      serviceName: 'Recipe Service',
      endpoint: '/api/recipes',
      statusCode: 500,
      timestamp: stableTimestamp,
      retryable: true,
      severity: ErrorSeverity.ERROR,
    }),
    [stableTimestamp]
  );

  const componentError: ComponentErrorMetadata = useMemo(
    () => ({
      errorType: ComponentErrorType.RENDER_ERROR,
      severity: ComponentErrorSeverity.ERROR,
      componentName: 'RecipeCard',
      componentDisplayName: 'Recipe Card',
      message: 'Failed to render component',
      timestamp: stableTimestamp,
      fingerprint: 'recipe-card-error',
      retryable: true,
      retryCount: 0,
    }),
    [stableTimestamp]
  );

  const pageError: PageErrorMetadata = useMemo(
    () => ({
      errorType: PageErrorType.NOT_FOUND,
      statusCode: HttpStatusCode.NOT_FOUND,
      severity: PageErrorSeverity.ERROR,
      title: 'Page Not Found',
      description: 'The page you are looking for does not exist',
      recoveryActions: [RecoveryActionType.GO_HOME],
      seoTitle: '404 - Not Found',
      seoDescription: 'Page not found',
      retryable: false,
      timestamp: stableTimestamp,
    }),
    [stableTimestamp]
  );

  const networkError =
    'Network error: Failed to fetch data. Check your connection.';

  const getErrorProps = () => {
    switch (selectedErrorType) {
      case 'simple':
        return { error: simpleError };
      case 'validation':
        return { validationErrors };
      case 'service':
        return { serviceError };
      case 'component':
        return { componentError };
      case 'page':
        return { pageError };
      case 'network':
        return { error: networkError };
      default:
        return { error: simpleError };
    }
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="bg-background min-h-screen">
        {/* Header */}
        <div className="border-border bg-card border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-foreground text-3xl font-bold">
                  ErrorAlert Component
                </h1>
                <p className="text-muted-foreground mt-2">
                  Inline error messages for all error scenarios
                </p>
              </div>
              <Badge variant="default">Error Handling</Badge>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Configuration Panel */}
            <div className="space-y-6 lg:col-span-1">
              {/* Variant Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Variant</CardTitle>
                  <CardDescription>Select visual variant</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Variant
                    </label>
                    <select
                      value={selectedVariant}
                      onChange={e =>
                        setSelectedVariant(
                          e.target.value as
                            | 'inline'
                            | 'banner'
                            | 'toast'
                            | 'card'
                        )
                      }
                      className="border-input focus:ring-ring w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                    >
                      <option value="inline">Inline</option>
                      <option value="banner">Banner</option>
                      <option value="toast">Toast</option>
                      <option value="card">Card</option>
                    </select>
                  </div>

                  <div className="border-border border-t pt-4">
                    <h4 className="mb-3 text-sm font-medium">Quick Select</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedVariant('inline')}
                      >
                        Inline
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedVariant('banner')}
                      >
                        Banner
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedVariant('toast')}
                      >
                        Toast
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedVariant('card')}
                      >
                        Card
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Severity & Size */}
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Severity and size</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Severity
                    </label>
                    <select
                      value={selectedSeverity}
                      onChange={e =>
                        setSelectedSeverity(
                          e.target.value as ErrorAlertSeverity
                        )
                      }
                      className="border-input focus:ring-ring w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                    >
                      <option value={ErrorAlertSeverity.ERROR}>Error</option>
                      <option value={ErrorAlertSeverity.WARNING}>
                        Warning
                      </option>
                      <option value={ErrorAlertSeverity.INFO}>Info</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Size
                    </label>
                    <select
                      value={selectedSize}
                      onChange={e =>
                        setSelectedSize(e.target.value as 'sm' | 'md' | 'lg')
                      }
                      className="border-input focus:ring-ring w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                    >
                      <option value="sm">Small</option>
                      <option value="md">Medium</option>
                      <option value="lg">Large</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Error Type */}
              <Card>
                <CardHeader>
                  <CardTitle>Error Source</CardTitle>
                  <CardDescription>Select error type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Error Type
                    </label>
                    <select
                      value={selectedErrorType}
                      onChange={e =>
                        setSelectedErrorType(
                          e.target.value as
                            | 'simple'
                            | 'validation'
                            | 'service'
                            | 'component'
                            | 'page'
                            | 'network'
                        )
                      }
                      className="border-input focus:ring-ring w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                    >
                      <option value="simple">Simple Error</option>
                      <option value="validation">Validation Errors</option>
                      <option value="service">Service Error</option>
                      <option value="component">Component Error</option>
                      <option value="page">Page Error</option>
                      <option value="network">Network Error</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Options */}
              <Card>
                <CardHeader>
                  <CardTitle>Options</CardTitle>
                  <CardDescription>Configure features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={showIcon}
                      onChange={e => setShowIcon(e.target.checked)}
                      className="rounded"
                    />
                    Show Icon
                  </label>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={showClose}
                      onChange={e => setShowClose(e.target.checked)}
                      className="rounded"
                    />
                    Show Close Button
                  </label>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={withRetry}
                      onChange={e => setWithRetry(e.target.checked)}
                      className="rounded"
                    />
                    With Retry Action
                  </label>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={withHint}
                      onChange={e => setWithHint(e.target.checked)}
                      className="rounded"
                    />
                    Show Hint
                  </label>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={autoDismiss}
                      onChange={e => setAutoDismiss(e.target.checked)}
                      className="rounded"
                    />
                    Auto-Dismiss (3s)
                  </label>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={isDarkMode}
                      onChange={e => setIsDarkMode(e.target.checked)}
                      className="rounded"
                    />
                    Dark Mode
                  </label>
                </CardContent>
              </Card>
            </div>

            {/* Preview */}
            <div className="space-y-6 lg:col-span-2">
              <Card className="min-h-[400px]">
                <CardHeader>
                  <CardTitle>Live Preview</CardTitle>
                  <CardDescription>
                    Interactive preview of ErrorAlert component
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {selectedVariant === 'toast' ? (
                    <div>
                      <Button onClick={() => setShowToast(true)}>
                        Show Toast Alert
                      </Button>
                      {showToast && (
                        <ErrorAlert
                          key={stableTimestamp}
                          {...getErrorProps()}
                          variant="toast"
                          severity={selectedSeverity}
                          size={selectedSize}
                          showIcon={showIcon}
                          showClose={showClose}
                          onRetry={
                            withRetry ? () => console.log('Retry') : undefined
                          }
                          hint={
                            withHint
                              ? 'This is a helpful hint for recovery'
                              : undefined
                          }
                          autoDismiss={autoDismiss ? 3000 : false}
                          onDismiss={() => setShowToast(false)}
                        />
                      )}
                    </div>
                  ) : (
                    <ErrorAlert
                      key={`${selectedVariant}-${selectedErrorType}-${selectedSeverity}`}
                      {...getErrorProps()}
                      variant={selectedVariant}
                      severity={selectedSeverity}
                      size={selectedSize}
                      showIcon={showIcon}
                      showClose={showClose}
                      onRetry={
                        withRetry ? () => console.log('Retry') : undefined
                      }
                      hint={
                        withHint
                          ? 'This is a helpful hint for recovery'
                          : undefined
                      }
                      autoDismiss={autoDismiss ? 3000 : false}
                    />
                  )}
                </CardContent>
              </Card>

              {/* Usage Examples */}
              <Card>
                <CardHeader>
                  <CardTitle>Usage Examples</CardTitle>
                  <CardDescription>
                    Common use cases for ErrorAlert
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Form Validation</h4>
                    <pre className="bg-muted overflow-x-auto rounded-md p-3 text-xs">
                      <code>{`const { errors } = useForm({ resolver: zodResolver(schema) });

<ErrorAlert zodError={errors} variant="inline" />`}</code>
                    </pre>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">
                      API Error with Retry
                    </h4>
                    <pre className="bg-muted overflow-x-auto rounded-md p-3 text-xs">
                      <code>{`const { error, refetch } = useQuery({ ... });

<ErrorAlert
  error={error}
  onRetry={refetch}
  variant="banner"
/>`}</code>
                    </pre>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Service Error</h4>
                    <pre className="bg-muted overflow-x-auto rounded-md p-3 text-xs">
                      <code>{`<ErrorAlert
  serviceError={serviceError}
  onRetry={() => refetch()}
  variant="card"
/>`}</code>
                    </pre>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">
                      Success with Auto-Dismiss
                    </h4>
                    <pre className="bg-muted overflow-x-auto rounded-md p-3 text-xs">
                      <code>{`<ErrorAlert
  error="Recipe saved successfully!"
  severity="info"
  variant="toast"
  autoDismiss={3000}
  onDismiss={() => clearMessage()}
/>`}</code>
                    </pre>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">
                      Multiple Validation Errors
                    </h4>
                    <pre className="bg-muted overflow-x-auto rounded-md p-3 text-xs">
                      <code>{`<ErrorAlert
  validationErrors={errors}
  maxErrors={5}
  collapsible
  variant="card"
/>`}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
