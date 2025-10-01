'use client';

import React, { useState } from 'react';
import { ComponentErrorBoundary } from '@/components/error/ComponentErrorBoundary';
import {
  FallbackMode,
  type ComponentErrorFallbackProps,
} from '@/types/error/component-errors';

// Component that can throw errors on demand
const ErrorTrigger: React.FC<{
  errorMessage: string;
  shouldThrow: boolean;
}> = ({ errorMessage, shouldThrow }) => {
  if (shouldThrow) {
    throw new Error(errorMessage);
  }

  return (
    <div className="rounded-md border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
      <p className="text-sm text-green-800 dark:text-green-200">
        ✓ Component loaded successfully. Click &quot;Trigger Error&quot; to
        simulate an error.
      </p>
    </div>
  );
};

// Demo container component
const DemoContainer: React.FC<{
  title: string;
  description: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => (
  <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
      {title}
    </h3>
    <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
      {description}
    </p>
    {children}
  </div>
);

export default function ComponentErrorBoundaryDemo() {
  // State for different demos
  const [skeletonError, setSkeletonError] = useState(false);
  const [placeholderError, setPlaceholderError] = useState(false);
  const [hiddenError, setHiddenError] = useState(false);
  const [minimalError, setMinimalError] = useState(false);
  const [detailedError, setDetailedError] = useState(false);
  const [customError, setCustomError] = useState(false);
  const [retryableError, setRetryableError] = useState(false);

  // Custom fallback component
  const CustomFallback: React.FC<ComponentErrorFallbackProps> = ({
    metadata,
    resetErrorBoundary,
  }) => (
    <div className="rounded-lg border-2 border-purple-300 bg-purple-50 p-6 dark:border-purple-700 dark:bg-purple-950">
      <h4 className="mb-2 text-lg font-bold text-purple-900 dark:text-purple-100">
        Custom Fallback UI
      </h4>
      <p className="mb-2 text-sm text-purple-700 dark:text-purple-300">
        <strong>Component:</strong> {metadata.componentName}
      </p>
      <p className="mb-4 text-sm text-purple-700 dark:text-purple-300">
        <strong>Error:</strong> {metadata.message}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="rounded-md bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-700"
      >
        Reset
      </button>
    </div>
  );

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
          ComponentErrorBoundary Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Component-level error boundaries with granular fallback modes and
          recovery strategies. Wrap individual components to prevent cascading
          failures and provide graceful degradation.
        </p>
      </div>

      {/* Demo 1: Skeleton Mode */}
      <DemoContainer
        title="1. Skeleton Mode"
        description="Shows a loading skeleton when the component errors. Perfect for maintaining layout and UX continuity."
      >
        <div className="space-y-4">
          <ComponentErrorBoundary
            componentName="SkeletonDemo"
            fallbackMode={FallbackMode.SKELETON}
            config={{
              componentName: 'SkeletonDemo',
              skeletonConfig: {
                height: '100px',
                width: '100%',
                variant: 'rectangular',
                animation: 'pulse',
              },
            }}
          >
            <ErrorTrigger
              shouldThrow={skeletonError}
              errorMessage="Skeleton mode component crashed"
            />
          </ComponentErrorBoundary>
          <button
            onClick={() => setSkeletonError(!skeletonError)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            {skeletonError ? 'Reset' : 'Trigger Error'}
          </button>
        </div>
      </DemoContainer>

      {/* Demo 2: Placeholder Mode */}
      <DemoContainer
        title="2. Placeholder Mode"
        description="Displays a placeholder with custom icon, title, and description. Ideal for non-critical components."
      >
        <div className="space-y-4">
          <ComponentErrorBoundary
            componentName="PlaceholderDemo"
            fallbackMode={FallbackMode.PLACEHOLDER}
            config={{
              componentName: 'PlaceholderDemo',
              placeholderConfig: {
                title: 'Component Unavailable',
                description: 'This component is temporarily unavailable.',
                showRetry: false,
              },
            }}
          >
            <ErrorTrigger
              shouldThrow={placeholderError}
              errorMessage="Placeholder mode component crashed"
            />
          </ComponentErrorBoundary>
          <button
            onClick={() => setPlaceholderError(!placeholderError)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            {placeholderError ? 'Reset' : 'Trigger Error'}
          </button>
        </div>
      </DemoContainer>

      {/* Demo 3: Hidden Mode */}
      <DemoContainer
        title="3. Hidden Mode"
        description="Completely hides the component when it errors. Use for optional UI elements that can be safely omitted."
      >
        <div className="space-y-4">
          {!hiddenError && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              When you trigger the error, the component will completely
              disappear.
            </p>
          )}
          <ComponentErrorBoundary
            componentName="HiddenDemo"
            fallbackMode={FallbackMode.HIDDEN}
          >
            <ErrorTrigger
              shouldThrow={hiddenError}
              errorMessage="Hidden mode component crashed"
            />
          </ComponentErrorBoundary>
          {hiddenError && (
            <p className="text-sm text-gray-500 italic dark:text-gray-500">
              (Component is hidden due to error)
            </p>
          )}
          <button
            onClick={() => setHiddenError(!hiddenError)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            {hiddenError ? 'Reset' : 'Trigger Error'}
          </button>
        </div>
      </DemoContainer>

      {/* Demo 4: Minimal Mode */}
      <DemoContainer
        title="4. Minimal Mode"
        description="Shows a compact error message with minimal visual impact. Good for tight layouts."
      >
        <div className="space-y-4">
          <ComponentErrorBoundary
            componentName="MinimalDemo"
            fallbackMode={FallbackMode.MINIMAL}
          >
            <ErrorTrigger
              shouldThrow={minimalError}
              errorMessage="Minimal mode component crashed"
            />
          </ComponentErrorBoundary>
          <button
            onClick={() => setMinimalError(!minimalError)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            {minimalError ? 'Reset' : 'Trigger Error'}
          </button>
        </div>
      </DemoContainer>

      {/* Demo 5: Detailed Mode */}
      <DemoContainer
        title="5. Detailed Mode"
        description="Provides comprehensive error information with retry/reset options and expandable details. Best for development and debugging."
      >
        <div className="space-y-4">
          <ComponentErrorBoundary
            componentName="DetailedDemo"
            fallbackMode={FallbackMode.DETAILED}
            config={{
              componentName: 'DetailedDemo',
              maxRetries: 3,
              enableLogging: true,
            }}
          >
            <ErrorTrigger
              shouldThrow={detailedError}
              errorMessage="Detailed mode component crashed with stack trace"
            />
          </ComponentErrorBoundary>
          <button
            onClick={() => setDetailedError(!detailedError)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            {detailedError ? 'Reset' : 'Trigger Error'}
          </button>
        </div>
      </DemoContainer>

      {/* Demo 6: Custom Fallback */}
      <DemoContainer
        title="6. Custom Fallback Component"
        description="Use a custom fallback component for complete control over error UI. Perfect for brand-specific error experiences."
      >
        <div className="space-y-4">
          <ComponentErrorBoundary
            componentName="CustomDemo"
            fallback={CustomFallback}
          >
            <ErrorTrigger
              shouldThrow={customError}
              errorMessage="Custom fallback component crashed"
            />
          </ComponentErrorBoundary>
          <button
            onClick={() => setCustomError(!customError)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            {customError ? 'Reset' : 'Trigger Error'}
          </button>
        </div>
      </DemoContainer>

      {/* Demo 7: Retryable Errors */}
      <DemoContainer
        title="7. Retryable Errors (Data/Network)"
        description="Demonstrates automatic retry for data and network errors with exponential backoff."
      >
        <div className="space-y-4">
          <ComponentErrorBoundary
            componentName="RetryableDemo"
            fallbackMode={FallbackMode.DETAILED}
            config={{
              componentName: 'RetryableDemo',
              maxRetries: 3,
              retryDelay: 1000,
              enableAutoRetry: false, // Manual retry only
              enableLogging: true,
            }}
          >
            <ErrorTrigger
              shouldThrow={retryableError}
              errorMessage="Failed to fetch data from network"
            />
          </ComponentErrorBoundary>
          <button
            onClick={() => setRetryableError(!retryableError)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            {retryableError ? 'Reset' : 'Trigger Error'}
          </button>
        </div>
      </DemoContainer>

      {/* Usage Examples */}
      <div className="mt-12 rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-950">
        <h2 className="mb-4 text-xl font-bold text-blue-900 dark:text-blue-100">
          Usage Examples
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-blue-800 dark:text-blue-200">
              Basic Usage (Skeleton Mode)
            </h3>
            <pre className="overflow-x-auto rounded-md bg-blue-100 p-4 text-xs dark:bg-blue-900">
              <code>{`<ComponentErrorBoundary
  componentName="MyComponent"
  fallbackMode={FallbackMode.SKELETON}
>
  <MyComponent />
</ComponentErrorBoundary>`}</code>
            </pre>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-blue-800 dark:text-blue-200">
              With Custom Configuration
            </h3>
            <pre className="overflow-x-auto rounded-md bg-blue-100 p-4 text-xs dark:bg-blue-900">
              <code>{`<ComponentErrorBoundary
  componentName="DataComponent"
  fallbackMode={FallbackMode.DETAILED}
  config={{
    componentName: 'DataComponent',
    maxRetries: 3,
    retryDelay: 1000,
    enableLogging: true,
    enableAnalytics: true,
    onError: (error, metadata) => {
      console.error('Component error:', error, metadata);
    },
  }}
>
  <DataComponent />
</ComponentErrorBoundary>`}</code>
            </pre>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-blue-800 dark:text-blue-200">
              Props Validation
            </h3>
            <pre className="overflow-x-auto rounded-md bg-blue-100 p-4 text-xs dark:bg-blue-900">
              <code>{`<ComponentErrorBoundary
  componentName="FormComponent"
  config={{
    componentName: 'FormComponent',
    validateProps: (props) => {
      if (!props.data) {
        return 'Missing required prop: data';
      }
      return true;
    },
  }}
>
  <FormComponent data={formData} />
</ComponentErrorBoundary>`}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Features Overview */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
          Key Features
        </h2>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>
            ✓ <strong>5 Fallback Modes:</strong> Skeleton, Placeholder, Hidden,
            Minimal, Detailed
          </li>
          <li>
            ✓ <strong>Error Classification:</strong> Automatic detection of
            render, props, data, lifecycle, and event errors
          </li>
          <li>
            ✓ <strong>Smart Recovery:</strong> Configurable retry strategies
            with exponential backoff
          </li>
          <li>
            ✓ <strong>Props Validation:</strong> Runtime validation with custom
            validator functions
          </li>
          <li>
            ✓ <strong>Error Deduplication:</strong> Fingerprinting to prevent
            duplicate error logs
          </li>
          <li>
            ✓ <strong>Analytics Integration:</strong> Track error events with
            custom callbacks
          </li>
          <li>
            ✓ <strong>Graceful Degradation:</strong> Prevent cascading failures
            across the app
          </li>
          <li>
            ✓ <strong>Development Tools:</strong> Detailed error information
            with stack traces
          </li>
          <li>
            ✓ <strong>Accessible:</strong> Full ARIA support in all fallback
            modes
          </li>
        </ul>
      </div>
    </div>
  );
}
