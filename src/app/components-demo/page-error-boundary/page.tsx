'use client';

/**
 * PageErrorBoundary Demo Page
 *
 * Interactive demonstrations of the PageErrorBoundary component
 * showcasing different HTTP error types and recovery strategies.
 */

import React from 'react';
import Link from 'next/link';
import { PageErrorBoundary } from '@/components/error/PageErrorBoundary';
import {
  HttpStatusCode,
  type PageErrorBoundaryConfig,
} from '@/types/error/page-errors';

/**
 * Error throwing component for demos
 */
const ErrorDemo: React.FC<{
  statusCode: HttpStatusCode;
  message: string;
}> = ({ statusCode, message }) => {
  const error = new Error(message) as Error & { status?: number };
  error.status = statusCode;
  throw error;
};

/**
 * Demo scenario component
 */
const DemoScenario: React.FC<{
  title: string;
  description: string;
  statusCode: HttpStatusCode;
  message: string;
  config?: PageErrorBoundaryConfig;
}> = ({ title, description, statusCode, message, config }) => {
  const [showError, setShowError] = React.useState(false);
  const [resetKey, setResetKey] = React.useState(0);

  const handleToggleError = () => {
    if (showError) {
      // Reset the error boundary by changing the key
      setResetKey(prev => prev + 1);
    }
    setShowError(!showError);
  };

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>

      <button
        onClick={handleToggleError}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:outline-none dark:bg-blue-700 dark:hover:bg-blue-600"
      >
        {showError ? 'Reset Demo' : 'Trigger Error'}
      </button>

      {showError && (
        <div className="mt-4 min-h-[400px]">
          <PageErrorBoundary key={resetKey} config={config}>
            <ErrorDemo statusCode={statusCode} message={message} />
          </PageErrorBoundary>
        </div>
      )}
    </div>
  );
};

/**
 * PageErrorBoundary demo page
 */
export default function PageErrorBoundaryDemo() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/components-demo"
            className="mb-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to Components
          </Link>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            PageErrorBoundary
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Full-page error handling with HTTP status awareness, SEO
            optimization, and intelligent recovery strategies.
          </p>
        </div>

        {/* Features */}
        <div className="mb-12 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
            Features
          </h2>
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <li className="flex items-start">
              <span className="mr-2 text-blue-600 dark:text-blue-400">✓</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                HTTP status code detection (404, 403, 500, 503, etc.)
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-blue-600 dark:text-blue-400">✓</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                SEO-friendly error pages with proper meta tags
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-blue-600 dark:text-blue-400">✓</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Context-aware recovery actions
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-blue-600 dark:text-blue-400">✓</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Analytics/monitoring integration
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-blue-600 dark:text-blue-400">✓</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Automatic retry for server errors
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-blue-600 dark:text-blue-400">✓</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Responsive design with dark mode support
              </span>
            </li>
          </ul>
        </div>

        {/* Demo Scenarios */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Demo Scenarios
          </h2>

          {/* 404 Not Found */}
          <DemoScenario
            title="404 - Page Not Found"
            description="Common client error when a requested page does not exist. Shows navigation actions to go home or go back."
            statusCode={HttpStatusCode.NOT_FOUND}
            message="The requested page could not be found"
            config={{ homeUrl: '/', enableSeo: true }}
          />

          {/* 401 Unauthorized */}
          <DemoScenario
            title="401 - Unauthorized"
            description="Authentication required error. Shows sign-in action to direct users to login."
            statusCode={HttpStatusCode.UNAUTHORIZED}
            message="You must be authenticated to access this resource"
            config={{ loginUrl: '/login', homeUrl: '/' }}
          />

          {/* 403 Forbidden */}
          <DemoScenario
            title="403 - Forbidden"
            description="Permission denied error. Shows contact support action for users who believe they should have access."
            statusCode={HttpStatusCode.FORBIDDEN}
            message="You do not have permission to access this resource"
            config={{ contactUrl: '/contact', homeUrl: '/' }}
          />

          {/* 500 Server Error */}
          <DemoScenario
            title="500 - Internal Server Error"
            description="Critical server error. Shows retry, go home, and contact support actions."
            statusCode={HttpStatusCode.INTERNAL_SERVER_ERROR}
            message="The server encountered an unexpected error"
            config={{
              enableAnalytics: true,
              homeUrl: '/',
              contactUrl: '/contact',
            }}
          />

          {/* 503 Service Unavailable */}
          <DemoScenario
            title="503 - Service Unavailable"
            description="Temporary service unavailability. Shows retry and view status actions."
            statusCode={HttpStatusCode.SERVICE_UNAVAILABLE}
            message="The service is temporarily unavailable"
            config={{ statusPageUrl: '/status', enableAutoRetry: false }}
          />

          {/* 503 with Auto-Retry */}
          <DemoScenario
            title="503 - Service Unavailable (Auto-Retry)"
            description="Service unavailable with automatic retry enabled. Shows countdown and automatically retries after delay."
            statusCode={HttpStatusCode.SERVICE_UNAVAILABLE}
            message="The service is temporarily unavailable"
            config={{
              enableAutoRetry: true,
              retryDelay: 3000,
              maxRetries: 3,
              statusPageUrl: '/status',
            }}
          />

          {/* 408 Request Timeout */}
          <DemoScenario
            title="408 - Request Timeout"
            description="Request took too long to complete. Shows retry and refresh actions."
            statusCode={HttpStatusCode.REQUEST_TIMEOUT}
            message="The request timed out"
            config={{ homeUrl: '/' }}
          />

          {/* 410 Gone */}
          <DemoScenario
            title="410 - Gone"
            description="Resource permanently removed. Shows go home and go back actions."
            statusCode={HttpStatusCode.GONE}
            message="This resource has been permanently removed"
            config={{ homeUrl: '/' }}
          />
        </div>

        {/* Usage Example */}
        <div className="mt-12 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
            Usage Example
          </h2>
          <pre className="overflow-x-auto rounded-md bg-gray-900 p-4 text-sm text-gray-100">
            <code>{`import { PageErrorBoundary } from '@/components/error/PageErrorBoundary';

// Basic usage
<PageErrorBoundary>
  <YourPageContent />
</PageErrorBoundary>

// With configuration
<PageErrorBoundary
  config={{
    homeUrl: '/',
    loginUrl: '/auth/login',
    contactUrl: '/support',
    statusPageUrl: '/system-status',
    enableSeo: true,
    enableAnalytics: true,
    enableAutoRetry: true,
    maxRetries: 3,
    retryDelay: 2000,
    onError: (error, errorInfo) => {
      // Log to error tracking service
      console.error('Page error:', error, errorInfo);
    },
    onAnalyticsEvent: (event) => {
      // Track in analytics
      console.log('Analytics event:', event);
    },
  }}
>
  <YourPageContent />
</PageErrorBoundary>

// With custom fallback
<PageErrorBoundary
  fallbackRender={({ error, metadata, recoveryActions, resetErrorBoundary }) => (
    <div>
      <h1>Custom Error Page</h1>
      <p>{metadata.title}</p>
      <p>{metadata.description}</p>
      <button onClick={resetErrorBoundary}>Try Again</button>
    </div>
  )}
>
  <YourPageContent />
</PageErrorBoundary>`}</code>
          </pre>
        </div>

        {/* Configuration Options */}
        <div className="mt-12 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
            Configuration Options
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Option
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Default
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-4 py-3 font-mono text-sm whitespace-nowrap text-gray-900 dark:text-gray-100">
                    homeUrl
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-600 dark:text-gray-400">
                    string
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-600 dark:text-gray-400">
                    &quot;/&quot;
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    URL for the &quot;Go Home&quot; action
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-sm whitespace-nowrap text-gray-900 dark:text-gray-100">
                    loginUrl
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-600 dark:text-gray-400">
                    string
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-600 dark:text-gray-400">
                    &quot;/login&quot;
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    URL for the &quot;Sign In&quot; action
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-sm whitespace-nowrap text-gray-900 dark:text-gray-100">
                    enableSeo
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-600 dark:text-gray-400">
                    boolean
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-600 dark:text-gray-400">
                    true
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    Enable SEO optimization (sets document title)
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-sm whitespace-nowrap text-gray-900 dark:text-gray-100">
                    enableAutoRetry
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-600 dark:text-gray-400">
                    boolean
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-600 dark:text-gray-400">
                    false
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    Automatically retry retryable errors
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-sm whitespace-nowrap text-gray-900 dark:text-gray-100">
                    maxRetries
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-600 dark:text-gray-400">
                    number
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-600 dark:text-gray-400">
                    3
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    Maximum number of automatic retry attempts
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-sm whitespace-nowrap text-gray-900 dark:text-gray-100">
                    retryDelay
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-600 dark:text-gray-400">
                    number
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-600 dark:text-gray-400">
                    2000
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    Delay in milliseconds before retry
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
