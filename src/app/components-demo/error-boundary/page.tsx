'use client';

import React, { useState } from 'react';
import { AlertTriangle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import {
  ErrorBoundary,
  InlineErrorBoundary,
  CardErrorBoundary,
  PageErrorBoundary,
  ToastErrorBoundary,
} from '@/components/ui/error-boundary';
import { ErrorBoundaryProvider } from '@/hooks/ui/error-boundary-provider';
import { useErrorBoundary } from '@/hooks/ui/use-error-boundary';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Custom error class for demo purposes
class DemoError extends Error {
  public readonly isDemoError = true;

  constructor(message: string) {
    super(`[DEMO ERROR - INTENTIONAL] ${message}`);
    this.name = 'DemoError';
  }
}

// Component that simulates error states without throwing
const ErrorSimulatorComponent: React.FC<{
  shouldThrow?: boolean;
  message?: string;
  delay?: number;
}> = ({ shouldThrow = false, message = 'Demo error occurred!', delay = 0 }) => {
  const [isErrorState, setIsErrorState] = React.useState(false);

  React.useEffect(() => {
    if (shouldThrow) {
      if (delay > 0) {
        const timer = setTimeout(() => {
          setIsErrorState(true);
        }, delay);
        return () => clearTimeout(timer);
      } else {
        setIsErrorState(true);
      }
    } else {
      setIsErrorState(false);
    }
  }, [shouldThrow, message, delay]);

  // Simulate error state by showing error UI directly
  if (isErrorState) {
    return (
      <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
        <div className="mb-2 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <h3 className="text-sm font-semibold text-red-900">Error Occurred</h3>
        </div>
        <p className="mb-3 text-sm text-red-800">{message}</p>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsErrorState(false)}
            size="sm"
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            <RefreshCw className="mr-1 h-3 w-3" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-900">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
        <span className="font-medium">Component working normally</span>
      </div>
      <p className="mt-1 text-sm text-green-700">
        All systems operational. No errors detected.
      </p>
    </div>
  );
};

// Component that actually throws errors for advanced demos (retry, custom fallback)
const ActualErrorThrowingComponent: React.FC<{
  shouldThrow?: boolean;
  message?: string;
  delay?: number;
}> = ({ shouldThrow = false, message = 'Demo error occurred!', delay = 0 }) => {
  React.useEffect(() => {
    if (shouldThrow && delay > 0) {
      const timer = setTimeout(() => {
        throw new DemoError(message);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [shouldThrow, message, delay]);

  if (shouldThrow && delay === 0) {
    throw new DemoError(message);
  }

  return (
    <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-900">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
        <span className="font-medium">Component working normally</span>
      </div>
      <p className="mt-1 text-sm text-green-700">
        All systems operational. No errors detected.
      </p>
    </div>
  );
};

// Flaky component for retry demos
const FlakyComponent: React.FC<{ successThreshold: number }> = ({
  successThreshold,
}) => {
  const [attemptCount, setAttemptCount] = React.useState(0);

  React.useEffect(() => {
    setAttemptCount(prev => prev + 1);
  }, []);

  if (attemptCount < successThreshold) {
    throw new DemoError(
      `Attempt ${attemptCount}: Service temporarily unavailable. Please try again.`
    );
  }

  return (
    <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-900">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-green-500" />
        <span className="font-medium">
          Success after {attemptCount - 1} retries!
        </span>
      </div>
      <p className="mt-1 text-sm text-green-700">
        Connection established. Service is now available.
      </p>
    </div>
  );
};

// Hook demo component
const HookDemoComponent: React.FC = () => {
  const { errors, reportError, clearAllErrors } = useErrorBoundary();

  const handleReportError = () => {
    const error = new Error(
      `Test error reported at ${new Date().toLocaleTimeString()}`
    );
    reportError(error, { componentStack: 'HookDemoComponent' });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={handleReportError} variant="destructive" size="sm">
          Report Error
        </Button>
        <Button onClick={clearAllErrors} variant="outline" size="sm">
          Clear All Errors
        </Button>
      </div>

      {errors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              Global Errors ({errors.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {errors.slice(0, 3).map(error => (
                <div
                  key={error.id}
                  className="rounded border border-red-200 bg-red-50 p-2 text-xs"
                >
                  <div className="font-medium text-red-900">
                    {error.message}
                  </div>
                  <div className="text-red-700">
                    {new Date(error.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
              {errors.length > 3 && (
                <div className="text-xs text-gray-500">
                  ...and {errors.length - 3} more errors
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const VariantDemo: React.FC<{
  title: string;
  description: string;
  children: React.ReactNode;
  code?: string;
}> = ({ title, description, children, code }) => {
  const [showCode, setShowCode] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {code && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCode(!showCode)}
            >
              {showCode ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              {showCode ? 'Hide' : 'Show'} Code
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border bg-gray-50 p-4">{children}</div>
        {showCode && code && (
          <div className="rounded-lg border bg-gray-900 p-4 text-gray-100">
            <pre className="overflow-x-auto text-xs">
              <code>{code}</code>
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function ErrorBoundaryDemo() {
  const [errorStates, setErrorStates] = useState({
    inline: false,
    card: false,
    page: false,
    toast: false,
    minimal: false,
    retry: false,
    custom: false,
    reset: false,
  });

  const [resetKey, setResetKey] = useState(1);

  // Add a note about demo errors in development
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.info(
        '%c🎭 ErrorBoundary Demo Page',
        'background: #3b82f6; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;',
        '\nThis page intentionally throws errors to demonstrate ErrorBoundary functionality.',
        '\nAny errors you see in the overlay are expected demo behavior.'
      );
    }
  }, []);

  const toggleError = (variant: keyof typeof errorStates) => {
    setErrorStates(prev => ({
      ...prev,
      // eslint-disable-next-line security/detect-object-injection
      [variant]: !prev[variant],
    }));
  };

  const CustomFallback: React.FC<{
    error: { message: string };
    resetErrorBoundary: () => void;
  }> = ({ error, resetErrorBoundary }) => (
    <div className="rounded-lg border border-purple-200 bg-purple-50 p-6">
      <div className="mb-4 flex items-center gap-3">
        <AlertTriangle className="h-6 w-6 text-purple-600" />
        <h3 className="text-lg font-semibold text-purple-900">
          Custom Error Handler
        </h3>
      </div>
      <p className="mb-4 text-purple-800">
        Our custom error handler caught: {error.message}
      </p>
      <div className="flex gap-2">
        <Button
          onClick={resetErrorBoundary}
          size="sm"
          className="bg-purple-600 hover:bg-purple-700"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          size="sm"
        >
          Reload Page
        </Button>
      </div>
    </div>
  );

  return (
    <ErrorBoundaryProvider
      onError={(error, errorInfo) => {
        console.log('Global error caught:', error, errorInfo);
      }}
      enableLogging={true}
      maxGlobalErrors={10}
    >
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                ErrorBoundary
              </h1>
              <p className="text-gray-600">
                Gracefully handle and display errors with comprehensive error
                boundary components
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Error Handling</Badge>
            <Badge variant="secondary">Retry Logic</Badge>
            <Badge variant="secondary">Accessibility</Badge>
            <Badge variant="secondary">TypeScript</Badge>
            <Badge variant="secondary">Multiple Variants</Badge>
            <Badge variant="secondary">Provider Pattern</Badge>
          </div>

          {/* Demo Disclaimer */}
          <div className="mt-6 rounded-lg border-2 border-yellow-300 bg-yellow-50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <div className="h-3 w-3 animate-pulse rounded-full bg-yellow-500" />
              <h3 className="text-lg font-bold text-yellow-900">
                ⚠️ Demo Environment Notice
              </h3>
            </div>
            <div className="space-y-2 text-sm text-yellow-800">
              <p className="font-medium">
                This page intentionally throws errors to demonstrate
                ErrorBoundary functionality.
              </p>
              <p>
                <strong>Expected behavior:</strong> You may see Next.js error
                overlays when clicking &quot;Trigger Error&quot; buttons. This
                is normal in development mode - the ErrorBoundary is still
                catching and handling the errors correctly.
              </p>
              <p className="text-xs">
                ✅ All errors are intentional demo behavior
                <br />
                ✅ ErrorBoundary components are working properly
                <br />✅ No actual application issues exist
              </p>
            </div>
          </div>
        </header>

        <div className="grid gap-8">
          {/* Basic Variants */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">
              Basic Variants
            </h2>
            <div className="grid gap-6">
              {/* Inline Variant */}
              <VariantDemo
                title="Inline ErrorBoundary"
                description="Compact error display for small components and form fields"
                code={`<InlineErrorBoundary>
  <ErrorSimulatorComponent shouldThrow={true} />
</InlineErrorBoundary>`}
              >
                <div className="space-y-4">
                  <Button
                    onClick={() => toggleError('inline')}
                    variant={errorStates.inline ? 'default' : 'destructive'}
                    size="sm"
                  >
                    {errorStates.inline
                      ? 'Show Error State'
                      : 'Show Normal State'}
                  </Button>
                  <div className="rounded-lg border p-1">
                    <ErrorSimulatorComponent
                      shouldThrow={errorStates.inline}
                      message="Inline component error"
                    />
                  </div>
                </div>
              </VariantDemo>

              {/* Card Variant */}
              <VariantDemo
                title="Card ErrorBoundary"
                description="Standard error display with detailed information and error details"
                code={`<CardErrorBoundary showDetails={true}>
  <ErrorSimulatorComponent shouldThrow={true} />
</CardErrorBoundary>`}
              >
                <div className="space-y-4">
                  <Button
                    onClick={() => toggleError('card')}
                    variant={errorStates.card ? 'default' : 'destructive'}
                    size="sm"
                  >
                    {errorStates.card
                      ? 'Show Error State'
                      : 'Show Normal State'}
                  </Button>
                  <ErrorSimulatorComponent
                    shouldThrow={errorStates.card}
                    message="Card component error with detailed information"
                  />
                </div>
              </VariantDemo>

              {/* Minimal Variant */}
              <VariantDemo
                title="Minimal ErrorBoundary"
                description="Ultra-compact error display for tight spaces"
                code={`<InlineErrorBoundary variant="minimal">
  <ErrorSimulatorComponent shouldThrow={true} />
</InlineErrorBoundary>`}
              >
                <div className="space-y-4">
                  <Button
                    onClick={() => toggleError('minimal')}
                    variant={errorStates.minimal ? 'default' : 'destructive'}
                    size="sm"
                  >
                    {errorStates.minimal
                      ? 'Show Error State'
                      : 'Show Normal State'}
                  </Button>
                  <div className="rounded border p-2">
                    <ErrorSimulatorComponent
                      shouldThrow={errorStates.minimal}
                      message="Minimal error"
                    />
                  </div>
                </div>
              </VariantDemo>
            </div>
          </section>

          {/* Page Variant (Full Example) */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">
              Page ErrorBoundary
            </h2>
            <VariantDemo
              title="Full-Page Error Display"
              description="Complete page error with navigation options and support links"
              code={`<PageErrorBoundary
  homeUrl="/"
  contactUrl="/contact"
  title="Page Not Available"
  description="Custom description for page errors"
>
  <ErrorSimulatorComponent shouldThrow={true} />
</PageErrorBoundary>`}
            >
              <div className="space-y-4">
                <Button
                  onClick={() => toggleError('page')}
                  variant={errorStates.page ? 'default' : 'destructive'}
                  size="sm"
                >
                  {errorStates.page ? 'Fix Page' : 'Trigger Page Error'}
                </Button>
                <div className="min-h-[300px] rounded-lg border-2 border-dashed border-gray-300">
                  <PageErrorBoundary
                    homeUrl="/components-demo"
                    contactUrl="/contact"
                    title="Demo Page Error"
                    description="This is a demonstration of how page-level errors are handled with navigation options."
                  >
                    <ErrorSimulatorComponent
                      shouldThrow={errorStates.page}
                      message="Critical page-level error occurred"
                    />
                  </PageErrorBoundary>
                </div>
              </div>
            </VariantDemo>
          </section>

          {/* Toast Variant */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">
              Toast ErrorBoundary
            </h2>
            <VariantDemo
              title="Toast Notification Style"
              description="Positioned error notifications with auto-dismiss"
              code={`<ToastErrorBoundary
  position="top-right"
  duration={5000}
  autoClose={true}
>
  <ErrorSimulatorComponent shouldThrow={true} />
</ToastErrorBoundary>`}
            >
              <div className="space-y-4">
                <Button
                  onClick={() => toggleError('toast')}
                  variant={errorStates.toast ? 'default' : 'destructive'}
                  size="sm"
                >
                  {errorStates.toast ? 'Fix Component' : 'Show Toast Error'}
                </Button>
                <div className="relative h-32 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    Toast will appear in top-right corner
                  </div>
                  <ToastErrorBoundary
                    position="top-right"
                    duration={0} // Disable auto-close for demo
                    autoClose={false}
                  >
                    <ErrorSimulatorComponent
                      shouldThrow={errorStates.toast}
                      message="Toast notification error"
                    />
                  </ToastErrorBoundary>
                </div>
              </div>
            </VariantDemo>
          </section>

          {/* Retry Functionality */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">
              Retry Functionality
            </h2>
            <VariantDemo
              title="Automatic Retry Logic"
              description="Component that fails initially but succeeds after retries"
              code={`<ErrorBoundary
  enableRetry={true}
  maxRetries={3}
  retryDelay={1000}
  onRetry={(error) => console.log('Retrying...', error)}
>
  <FlakyComponent successThreshold={3} />
</ErrorBoundary>`}
            >
              <div className="space-y-4">
                <Button
                  onClick={() => toggleError('retry')}
                  variant={errorStates.retry ? 'default' : 'destructive'}
                  size="sm"
                >
                  {errorStates.retry ? 'Reset Demo' : 'Start Flaky Component'}
                </Button>
                {errorStates.retry && (
                  <ErrorBoundary
                    enableRetry={true}
                    maxRetries={4}
                    retryDelay={1000}
                    onRetry={error =>
                      console.log('Retrying after error:', error)
                    }
                  >
                    <FlakyComponent successThreshold={3} />
                  </ErrorBoundary>
                )}
              </div>
            </VariantDemo>
          </section>

          {/* Custom Fallback */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">
              Custom Fallback
            </h2>
            <VariantDemo
              title="Custom Error Display"
              description="Completely custom error handling component"
              code={`const CustomFallback = ({ error, resetErrorBoundary }) => (
  <div className="custom-error-display">
    <h3>Custom Error Handler</h3>
    <p>{error.message}</p>
    <button onClick={resetErrorBoundary}>Try Again</button>
  </div>
);

<ErrorBoundary fallback={CustomFallback}>
  <ErrorSimulatorComponent shouldThrow={true} />
</ErrorBoundary>`}
            >
              <div className="space-y-4">
                <Button
                  onClick={() => toggleError('custom')}
                  variant={errorStates.custom ? 'default' : 'destructive'}
                  size="sm"
                >
                  {errorStates.custom
                    ? 'Fix Component'
                    : 'Trigger Custom Error'}
                </Button>
                <ErrorBoundary fallback={CustomFallback}>
                  <ActualErrorThrowingComponent
                    shouldThrow={errorStates.custom}
                    message="This error is handled by a custom fallback component"
                  />
                </ErrorBoundary>
              </div>
            </VariantDemo>
          </section>

          {/* Reset Strategies */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">
              Reset Strategies
            </h2>
            <VariantDemo
              title="Reset on Key Changes"
              description="Error boundary resets when resetKeys change"
              code={`<ErrorBoundary
  resetKeys={[resetKey]}
  resetOnPropsChange={true}
>
  <ConditionalErrorComponent />
</ErrorBoundary>`}
            >
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setErrorStates(prev => ({ ...prev, reset: false }));
                      setResetKey(prev => prev + 1);
                    }}
                    variant="default"
                    size="sm"
                  >
                    Fix & Reset (Key: {resetKey})
                  </Button>
                  <Button
                    onClick={() => toggleError('reset')}
                    variant="destructive"
                    size="sm"
                  >
                    Break Component
                  </Button>
                </div>
                <ErrorBoundary resetKeys={[resetKey]} resetOnPropsChange={true}>
                  <ActualErrorThrowingComponent
                    shouldThrow={errorStates.reset}
                    message={`Component error (Reset Key: ${resetKey})`}
                  />
                </ErrorBoundary>
              </div>
            </VariantDemo>
          </section>

          {/* Provider Pattern */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">
              Provider Pattern
            </h2>
            <VariantDemo
              title="Global Error Management"
              description="Global error state management with hooks"
              code={`<ErrorBoundaryProvider
  onError={(error, errorInfo) => console.log('Global error:', error)}
  enableLogging={true}
  maxGlobalErrors={10}
>
  <ComponentWithErrorBoundaryHook />
</ErrorBoundaryProvider>`}
            >
              <HookDemoComponent />
            </VariantDemo>
          </section>

          {/* Recipe-Specific Examples */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">
              Recipe App Examples
            </h2>
            <div className="grid gap-6">
              <VariantDemo
                title="Recipe Card Error (Demo)"
                description="Example: How errors are gracefully handled in recipe cards"
              >
                <CardErrorBoundary className="demo-error-boundary">
                  <div className="rounded-lg border p-4">
                    <h3 className="font-semibold">Chocolate Chip Cookies</h3>
                    <p className="text-sm text-gray-600">
                      Delicious homemade cookies...
                    </p>
                    <div className="mt-2 rounded border border-yellow-200 bg-yellow-50 p-2 text-xs text-yellow-800">
                      ⚠️ This is a demo error - intentionally thrown to show
                      error handling
                    </div>
                    <ErrorSimulatorComponent
                      shouldThrow={true}
                      message="Demo: Failed to load recipe data"
                    />
                  </div>
                </CardErrorBoundary>
              </VariantDemo>

              <VariantDemo
                title="Recipe Form Error"
                description="Inline error handling for recipe forms"
              >
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Recipe Title
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-md border px-3 py-2"
                      placeholder="Enter recipe title"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Ingredients
                    </label>
                    <InlineErrorBoundary>
                      <ErrorSimulatorComponent
                        shouldThrow={true}
                        message="Failed to load ingredient suggestions"
                      />
                    </InlineErrorBoundary>
                  </div>
                </div>
              </VariantDemo>
            </div>
          </section>
        </div>
      </div>
    </ErrorBoundaryProvider>
  );
}
