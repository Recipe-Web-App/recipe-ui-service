'use client';

import React, { useState } from 'react';
import { ServiceErrorBoundary } from '@/components/error/ServiceErrorBoundary';
import {
  ServiceType,
  SERVICE_DISPLAY_NAMES,
  type ServiceErrorFallbackProps,
} from '@/types/error/service-errors';

// Mock error classes matching the real service errors
class AuthApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'AuthApiError';
    this.status = status;
    Object.setPrototypeOf(this, AuthApiError.prototype);
  }
}

class RecipeManagementApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'RecipeManagementApiError';
    this.status = status;
    Object.setPrototypeOf(this, RecipeManagementApiError.prototype);
  }
}

class RecipeScraperApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'RecipeScraperApiError';
    this.status = status;
    Object.setPrototypeOf(this, RecipeScraperApiError.prototype);
  }
}

class MediaManagementApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'MediaManagementApiError';
    this.status = status;
    Object.setPrototypeOf(this, MediaManagementApiError.prototype);
  }
}

class UserManagementApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'UserManagementApiError';
    this.status = status;
    Object.setPrototypeOf(this, UserManagementApiError.prototype);
  }
}

class MealPlanManagementApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'MealPlanManagementApiError';
    this.status = status;
    Object.setPrototypeOf(this, MealPlanManagementApiError.prototype);
  }
}

// Component that can throw errors on demand
const ErrorTrigger: React.FC<{
  errorType: ServiceType;
  statusCode: number;
  message: string;
  shouldThrow: boolean;
}> = ({ errorType, statusCode, message, shouldThrow }) => {
  if (shouldThrow) {
    switch (errorType) {
      case ServiceType.AUTH:
        throw new AuthApiError(message, statusCode);
      case ServiceType.RECIPE_MANAGEMENT:
        throw new RecipeManagementApiError(message, statusCode);
      case ServiceType.RECIPE_SCRAPER:
        throw new RecipeScraperApiError(message, statusCode);
      case ServiceType.MEDIA_MANAGEMENT:
        throw new MediaManagementApiError(message, statusCode);
      case ServiceType.USER_MANAGEMENT:
        throw new UserManagementApiError(message, statusCode);
      case ServiceType.MEAL_PLAN_MANAGEMENT:
        throw new MealPlanManagementApiError(message, statusCode);
    }
  }

  return (
    <div className="rounded-md border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
      <p className="text-sm text-green-800 dark:text-green-200">
        ✓ Component loaded successfully. Click &quot;Trigger Error&quot; to
        simulate a service error.
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

export default function ServiceErrorBoundaryDemo() {
  // State for different demos
  const [demo1Error, setDemo1Error] = useState(false);
  const [demo2Error, setDemo2Error] = useState(false);
  const [demo3Error, setDemo3Error] = useState(false);
  const [demo4Error, setDemo4Error] = useState(false);
  const [demo5Error, setDemo5Error] = useState(false);
  const [demo6Error, setDemo6Error] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceType>(
    ServiceType.RECIPE_MANAGEMENT
  );
  const [selectedStatusCode, setSelectedStatusCode] = useState<number>(500);

  // Custom fallback component
  const CustomFallback: React.FC<ServiceErrorFallbackProps> = ({
    metadata,
    resetErrorBoundary,
  }) => (
    <div className="rounded-lg border-2 border-purple-300 bg-purple-50 p-6 dark:border-purple-700 dark:bg-purple-950">
      <h4 className="mb-2 text-lg font-bold text-purple-900 dark:text-purple-100">
        Custom Fallback UI
      </h4>
      <p className="mb-4 text-sm text-purple-700 dark:text-purple-300">
        This is a custom error fallback for {metadata.serviceName}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
        type="button"
      >
        Custom Reset Button
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
          Service Error Boundary
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Service-specific error boundaries with intelligent retry logic, health
          status indicators, and network state awareness.
        </p>
      </div>

      {/* Demo 1: All Services */}
      <DemoContainer
        title="All Service Types"
        description="Demonstrates error handling for all 6 microservices with different status codes."
      >
        <div className="mb-4 space-y-4">
          <div>
            <label
              htmlFor="service-select"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Select Service:
            </label>
            <select
              id="service-select"
              value={selectedService}
              onChange={e => setSelectedService(e.target.value as ServiceType)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
            >
              {Object.values(ServiceType).map(service => (
                <option key={service} value={service}>
                  {/* eslint-disable-next-line security/detect-object-injection */}
                  {SERVICE_DISPLAY_NAMES[service]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="status-select"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Select Status Code:
            </label>
            <select
              id="status-select"
              value={selectedStatusCode}
              onChange={e => setSelectedStatusCode(Number(e.target.value))}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
            >
              <option value={500}>
                500 - Internal Server Error (Retryable)
              </option>
              <option value={502}>502 - Bad Gateway (Retryable)</option>
              <option value={503}>
                503 - Service Unavailable (Maintenance)
              </option>
              <option value={504}>504 - Gateway Timeout (Retryable)</option>
              <option value={400}>400 - Bad Request (Non-retryable)</option>
              <option value={401}>401 - Unauthorized (Non-retryable)</option>
              <option value={403}>403 - Forbidden (Non-retryable)</option>
              <option value={404}>404 - Not Found (Non-retryable)</option>
            </select>
          </div>

          <button
            onClick={() => setDemo1Error(true)}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            type="button"
          >
            Trigger Error
          </button>
        </div>

        <ServiceErrorBoundary
          key={`${selectedService}-${selectedStatusCode}-${demo1Error}`}
          config={{
            serviceType: selectedService,
            // eslint-disable-next-line security/detect-object-injection
            serviceName: SERVICE_DISPLAY_NAMES[selectedService],
            maxRetries: 3,
            retryDelay: 1000,
          }}
        >
          <ErrorTrigger
            errorType={selectedService}
            statusCode={selectedStatusCode}
            message={`Simulated ${selectedStatusCode} error`}
            shouldThrow={demo1Error}
          />
        </ServiceErrorBoundary>
      </DemoContainer>

      {/* Demo 2: Retryable Error (5xx) */}
      <DemoContainer
        title="Retryable Server Error (500)"
        description="Shows a retryable 5xx error with retry button and status information."
      >
        <button
          onClick={() => setDemo2Error(true)}
          className="mb-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          type="button"
        >
          Trigger 500 Error
        </button>

        <ServiceErrorBoundary
          key={`demo2-${demo2Error}`}
          config={{
            serviceType: ServiceType.RECIPE_MANAGEMENT,
            serviceName: SERVICE_DISPLAY_NAMES[ServiceType.RECIPE_MANAGEMENT],
            maxRetries: 3,
            retryDelay: 1000,
          }}
        >
          <ErrorTrigger
            errorType={ServiceType.RECIPE_MANAGEMENT}
            statusCode={500}
            message="Internal server error occurred"
            shouldThrow={demo2Error}
          />
        </ServiceErrorBoundary>
      </DemoContainer>

      {/* Demo 3: Non-retryable Error (401) */}
      <DemoContainer
        title="Non-retryable Client Error (401)"
        description="Shows a non-retryable 4xx error with appropriate messaging."
      >
        <button
          onClick={() => setDemo3Error(true)}
          className="mb-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          type="button"
        >
          Trigger 401 Error
        </button>

        <ServiceErrorBoundary
          key={`demo3-${demo3Error}`}
          config={{
            serviceType: ServiceType.AUTH,
            serviceName: SERVICE_DISPLAY_NAMES[ServiceType.AUTH],
          }}
        >
          <ErrorTrigger
            errorType={ServiceType.AUTH}
            statusCode={401}
            message="Authentication required"
            shouldThrow={demo3Error}
          />
        </ServiceErrorBoundary>
      </DemoContainer>

      {/* Demo 4: Maintenance Mode (503) */}
      <DemoContainer
        title="Service Maintenance (503)"
        description="Shows maintenance mode with special messaging and status indicator."
      >
        <button
          onClick={() => setDemo4Error(true)}
          className="mb-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          type="button"
        >
          Trigger 503 Error
        </button>

        <ServiceErrorBoundary
          key={`demo4-${demo4Error}`}
          config={{
            serviceType: ServiceType.MEDIA_MANAGEMENT,
            serviceName: SERVICE_DISPLAY_NAMES[ServiceType.MEDIA_MANAGEMENT],
          }}
        >
          <ErrorTrigger
            errorType={ServiceType.MEDIA_MANAGEMENT}
            statusCode={503}
            message="Service is under maintenance"
            shouldThrow={demo4Error}
          />
        </ServiceErrorBoundary>
      </DemoContainer>

      {/* Demo 5: Custom Fallback */}
      <DemoContainer
        title="Custom Fallback Component"
        description="Demonstrates using a custom fallback component instead of the default."
      >
        <button
          onClick={() => setDemo5Error(true)}
          className="mb-4 rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
          type="button"
        >
          Trigger Error with Custom Fallback
        </button>

        <ServiceErrorBoundary
          key={`demo5-${demo5Error}`}
          config={{
            serviceType: ServiceType.USER_MANAGEMENT,
            serviceName: SERVICE_DISPLAY_NAMES[ServiceType.USER_MANAGEMENT],
            fallbackComponent: CustomFallback,
          }}
        >
          <ErrorTrigger
            errorType={ServiceType.USER_MANAGEMENT}
            statusCode={500}
            message="Error with custom fallback"
            shouldThrow={demo5Error}
          />
        </ServiceErrorBoundary>
      </DemoContainer>

      {/* Demo 6: Multiple Services Side-by-Side */}
      <DemoContainer
        title="Multiple Services Simultaneously"
        description="Shows how different service boundaries can work independently."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Recipe Management Service
            </h4>
            <button
              onClick={() => setDemo6Error(true)}
              className="mb-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              type="button"
            >
              Trigger Error
            </button>
            <ServiceErrorBoundary
              key={`demo6a-${demo6Error}`}
              config={{
                serviceType: ServiceType.RECIPE_MANAGEMENT,
                serviceName:
                  SERVICE_DISPLAY_NAMES[ServiceType.RECIPE_MANAGEMENT],
              }}
              variant="card"
            >
              <ErrorTrigger
                errorType={ServiceType.RECIPE_MANAGEMENT}
                statusCode={500}
                message="Recipe service error"
                shouldThrow={demo6Error}
              />
            </ServiceErrorBoundary>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Meal Plan Management Service
            </h4>
            <ServiceErrorBoundary
              config={{
                serviceType: ServiceType.MEAL_PLAN_MANAGEMENT,
                serviceName:
                  SERVICE_DISPLAY_NAMES[ServiceType.MEAL_PLAN_MANAGEMENT],
              }}
              variant="card"
            >
              <div className="rounded-md border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
                <p className="text-sm text-green-800 dark:text-green-200">
                  ✓ This service is working fine while the other has an error.
                </p>
              </div>
            </ServiceErrorBoundary>
          </div>
        </div>
      </DemoContainer>

      {/* Features Overview */}
      <DemoContainer
        title="Key Features"
        description="Overview of ServiceErrorBoundary capabilities."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-md border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
            <h4 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
              Intelligent Retry Logic
            </h4>
            <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
              <li>• Automatically retries 5xx errors</li>
              <li>• Exponential backoff with configurable delays</li>
              <li>• Respects max retry limits</li>
              <li>• Skips retry for 4xx client errors</li>
            </ul>
          </div>

          <div className="rounded-md border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-950">
            <h4 className="mb-2 font-semibold text-purple-900 dark:text-purple-100">
              Service Health Status
            </h4>
            <ul className="space-y-1 text-sm text-purple-700 dark:text-purple-300">
              <li>• Real-time health indicators</li>
              <li>• Maintenance mode detection (503)</li>
              <li>• Degraded service states</li>
              <li>• Offline/online network status</li>
            </ul>
          </div>

          <div className="rounded-md border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
            <h4 className="mb-2 font-semibold text-green-900 dark:text-green-100">
              All Microservices Supported
            </h4>
            <ul className="space-y-1 text-sm text-green-700 dark:text-green-300">
              <li>• Authentication Service</li>
              <li>• Recipe Management Service</li>
              <li>• Recipe Scraper Service</li>
              <li>• Media Management Service</li>
              <li>• User Management Service</li>
              <li>• Meal Plan Management Service</li>
            </ul>
          </div>

          <div className="rounded-md border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-950">
            <h4 className="mb-2 font-semibold text-orange-900 dark:text-orange-100">
              Customizable UI
            </h4>
            <ul className="space-y-1 text-sm text-orange-700 dark:text-orange-300">
              <li>• Custom fallback components</li>
              <li>• Multiple variant styles (inline, card, page)</li>
              <li>• Configurable retry behavior</li>
              <li>• Redirect and callback support</li>
            </ul>
          </div>
        </div>
      </DemoContainer>
    </div>
  );
}
