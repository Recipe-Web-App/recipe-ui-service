'use client';

import React, { useState } from 'react';
import { ErrorPage } from '@/components/error/ErrorPage';
import { PageErrorType } from '@/types/error/page-errors';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ErrorPageDemo() {
  const [selectedStatusCode, setSelectedStatusCode] = useState<number>(404);
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customDescription, setCustomDescription] = useState<string>('');
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [includeMaintenanceMessage, setIncludeMaintenanceMessage] =
    useState<boolean>(false);

  const statusCodes = [
    { value: 400, label: '400 - Bad Request', description: 'Invalid request' },
    {
      value: 401,
      label: '401 - Unauthorized',
      description: 'Authentication required',
    },
    { value: 403, label: '403 - Forbidden', description: 'Access denied' },
    { value: 404, label: '404 - Not Found', description: 'Page not found' },
    { value: 408, label: '408 - Timeout', description: 'Request timeout' },
    { value: 410, label: '410 - Gone', description: 'Resource removed' },
    {
      value: 500,
      label: '500 - Server Error',
      description: 'Internal error',
    },
    {
      value: 503,
      label: '503 - Service Unavailable',
      description: 'Service down',
    },
  ];

  const errorTypes = [
    {
      value: PageErrorType.NOT_FOUND,
      label: 'Not Found',
      description: 'Page/resource missing',
    },
    {
      value: PageErrorType.UNAUTHORIZED,
      label: 'Unauthorized',
      description: 'Auth required',
    },
    {
      value: PageErrorType.FORBIDDEN,
      label: 'Forbidden',
      description: 'Access denied',
    },
    {
      value: PageErrorType.SERVER_ERROR,
      label: 'Server Error',
      description: 'Internal error',
    },
    {
      value: PageErrorType.SERVICE_UNAVAILABLE,
      label: 'Service Unavailable',
      description: 'Service down',
    },
    {
      value: PageErrorType.MAINTENANCE,
      label: 'Maintenance',
      description: 'Maintenance mode',
    },
    {
      value: PageErrorType.TIMEOUT,
      label: 'Timeout',
      description: 'Request timeout',
    },
    {
      value: PageErrorType.GONE,
      label: 'Gone',
      description: 'Resource removed',
    },
    {
      value: PageErrorType.BAD_REQUEST,
      label: 'Bad Request',
      description: 'Invalid request',
    },
  ];

  const handleErrorCallback = (metadata: {
    errorType: PageErrorType;
    statusCode: number;
  }) => {
    console.log('Error displayed:', metadata);
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
                  ErrorPage Component
                </h1>
                <p className="text-muted-foreground mt-2">
                  Standalone error page display for HTTP status codes
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
              {/* Status Code Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Status Code</CardTitle>
                  <CardDescription>
                    Select an HTTP status code to display
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Status Code
                    </label>
                    <select
                      value={selectedStatusCode}
                      onChange={e =>
                        setSelectedStatusCode(Number(e.target.value))
                      }
                      className="border-input focus:ring-ring w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                    >
                      {statusCodes.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {
                        statusCodes.find(s => s.value === selectedStatusCode)
                          ?.description
                      }
                    </p>
                  </div>

                  <div className="border-border border-t pt-4">
                    <h4 className="mb-3 text-sm font-medium">Quick Select</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedStatusCode(404)}
                      >
                        404
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedStatusCode(401)}
                      >
                        401
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedStatusCode(403)}
                      >
                        403
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedStatusCode(500)}
                      >
                        500
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customization */}
              <Card>
                <CardHeader>
                  <CardTitle>Customization</CardTitle>
                  <CardDescription>
                    Customize error message and appearance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Custom Title
                    </label>
                    <input
                      type="text"
                      value={customTitle}
                      onChange={e => setCustomTitle(e.target.value)}
                      placeholder="Leave empty for default"
                      className="border-input focus:ring-ring w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Custom Description
                    </label>
                    <textarea
                      value={customDescription}
                      onChange={e => setCustomDescription(e.target.value)}
                      placeholder="Leave empty for default"
                      rows={3}
                      className="border-input focus:ring-ring w-full resize-none rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={showDetails}
                        onChange={e => setShowDetails(e.target.checked)}
                        className="rounded"
                      />
                      Show Error Details
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

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={includeMaintenanceMessage}
                        onChange={e =>
                          setIncludeMaintenanceMessage(e.target.checked)
                        }
                        className="rounded"
                      />
                      Include Maintenance Message
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Error Types Reference */}
              <Card>
                <CardHeader>
                  <CardTitle>Error Types</CardTitle>
                  <CardDescription>All supported error types</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {errorTypes.map(type => (
                      <div
                        key={type.value}
                        className="hover:bg-muted flex cursor-pointer items-center justify-between rounded-md p-2"
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          // Map error type to status code
                          const statusMap: Record<PageErrorType, number> = {
                            [PageErrorType.NOT_FOUND]: 404,
                            [PageErrorType.UNAUTHORIZED]: 401,
                            [PageErrorType.FORBIDDEN]: 403,
                            [PageErrorType.SERVER_ERROR]: 500,
                            [PageErrorType.SERVICE_UNAVAILABLE]: 503,
                            [PageErrorType.MAINTENANCE]: 503,
                            [PageErrorType.TIMEOUT]: 408,
                            [PageErrorType.GONE]: 410,
                            [PageErrorType.BAD_REQUEST]: 400,
                            [PageErrorType.UNKNOWN]: 500,
                          };
                          setSelectedStatusCode(statusMap[type.value]);
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            const statusMap: Record<PageErrorType, number> = {
                              [PageErrorType.NOT_FOUND]: 404,
                              [PageErrorType.UNAUTHORIZED]: 401,
                              [PageErrorType.FORBIDDEN]: 403,
                              [PageErrorType.SERVER_ERROR]: 500,
                              [PageErrorType.SERVICE_UNAVAILABLE]: 503,
                              [PageErrorType.MAINTENANCE]: 503,
                              [PageErrorType.TIMEOUT]: 408,
                              [PageErrorType.GONE]: 410,
                              [PageErrorType.BAD_REQUEST]: 400,
                              [PageErrorType.UNKNOWN]: 500,
                            };
                            setSelectedStatusCode(statusMap[type.value]);
                          }
                        }}
                      >
                        <div>
                          <div className="text-sm font-medium">
                            {type.label}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            {type.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview */}
            <div className="lg:col-span-2">
              <Card className="min-h-[600px]">
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>
                    Live preview of the ErrorPage component
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="border-border border-t">
                    <ErrorPage
                      key={`${selectedStatusCode}-${customTitle}-${customDescription}-${showDetails}-${includeMaintenanceMessage}`}
                      statusCode={selectedStatusCode}
                      title={customTitle || undefined}
                      description={customDescription || undefined}
                      showDetails={showDetails}
                      errorDetails={
                        showDetails
                          ? `Error: Sample error details
  at ErrorPage (error-page.tsx:123:45)
  at render (react-dom.js:456:78)
  at mountComponent (react-dom.js:789:12)`
                          : undefined
                      }
                      homeUrl="/"
                      loginUrl="/login"
                      contactEmail="support@example.com"
                      statusPageUrl="https://status.example.com"
                      maintenanceMessage={
                        includeMaintenanceMessage
                          ? 'We are performing scheduled maintenance to improve our services. We will be back shortly!'
                          : undefined
                      }
                      estimatedRecoveryTime={
                        includeMaintenanceMessage
                          ? new Date(Date.now() + 3600000)
                          : undefined
                      }
                      onError={handleErrorCallback}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Usage Examples */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Usage Examples</CardTitle>
                  <CardDescription>
                    Common use cases for ErrorPage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">
                      Next.js not-found.tsx
                    </h4>
                    <pre className="bg-muted overflow-x-auto rounded-md p-3 text-xs">
                      <code>{`export default function NotFound() {
  return <ErrorPage statusCode={404} homeUrl="/" />;
}`}</code>
                    </pre>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">
                      Custom Unauthorized Page
                    </h4>
                    <pre className="bg-muted overflow-x-auto rounded-md p-3 text-xs">
                      <code>{`<ErrorPage
  statusCode={401}
  title="Please Sign In"
  description="You need authentication to view this page."
  homeUrl="/"
  loginUrl="/auth/signin"
/>`}</code>
                    </pre>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Maintenance Mode</h4>
                    <pre className="bg-muted overflow-x-auto rounded-md p-3 text-xs">
                      <code>{`<ErrorPage
  errorType={PageErrorType.MAINTENANCE}
  maintenanceMessage="System upgrade in progress"
  estimatedRecoveryTime={new Date('2025-01-01T10:00')}
  statusPageUrl="https://status.example.com"
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
