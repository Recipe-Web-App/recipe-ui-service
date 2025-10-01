import * as React from 'react';
import {
  AlertTriangle,
  RefreshCw,
  Wifi,
  WifiOff,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  serviceErrorBoundaryVariants,
  serviceErrorHeaderVariants,
  serviceErrorTitleVariants,
  serviceErrorDescriptionVariants,
  serviceStatusIndicatorVariants,
  serviceStatusDotVariants,
  retryInfoVariants,
  serviceErrorActionsVariants,
  serviceErrorButtonVariants,
  networkStatusIndicatorVariants,
} from '@/lib/ui/service-error-boundary-variants';
import {
  type ServiceErrorBoundaryProps,
  type ServiceErrorBoundaryState,
  type ServiceErrorMetadata,
  type ServiceErrorFallbackProps,
  ServiceHealthStatus,
  ErrorSeverity,
  DEFAULT_RETRYABLE_STATUS_CODES,
  DEFAULT_NON_RETRYABLE_STATUS_CODES,
} from '@/types/error/service-errors';
import {
  detectServiceError,
  determineHealthStatus,
} from '@/lib/error/service-error-utils';
import type { ErrorInfo } from 'react';

/**
 * Default fallback component for service errors
 */
const DefaultServiceErrorFallback: React.FC<ServiceErrorFallbackProps> = ({
  error,
  metadata,
  healthStatus,
  isOnline,
  resetErrorBoundary,
  onRetry,
}) => {
  const variant = 'card';
  const [isRetrying, setIsRetrying] = React.useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      onRetry?.();
      await new Promise(resolve => setTimeout(resolve, 500));
      resetErrorBoundary();
    } finally {
      setIsRetrying(false);
    }
  };

  const getErrorTitle = () => {
    if (!isOnline) {
      return 'Connection Lost';
    }

    if (healthStatus === ServiceHealthStatus.MAINTENANCE) {
      return 'Service Under Maintenance';
    }

    if (metadata.statusCode === 401 || metadata.statusCode === 403) {
      return 'Access Denied';
    }

    if (metadata.statusCode === 404) {
      return 'Resource Not Found';
    }

    return `${metadata.serviceName} Error`;
  };

  const getErrorDescription = () => {
    if (!isOnline) {
      return 'Please check your internet connection and try again.';
    }

    if (healthStatus === ServiceHealthStatus.MAINTENANCE) {
      return 'The service is currently undergoing maintenance. Please try again later.';
    }

    if (metadata.statusCode === 401) {
      return 'You need to be authenticated to access this resource. Please sign in and try again.';
    }

    if (metadata.statusCode === 403) {
      return 'You do not have permission to access this resource.';
    }

    if (metadata.statusCode === 404) {
      return 'The requested resource could not be found.';
    }

    if (metadata.retryable) {
      return `We encountered an issue while communicating with the ${metadata.serviceName.toLowerCase()}. This is usually temporary and retrying may help.`;
    }

    return (
      error.message ||
      'An unexpected error occurred. Please try again or contact support if the problem persists.'
    );
  };

  return (
    <div
      className={cn(
        serviceErrorBoundaryVariants({
          variant,
          severity: metadata.severity,
          healthStatus,
        })
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className={serviceErrorHeaderVariants({ variant })}>
        <div className="flex items-start gap-3">
          <AlertTriangle
            className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400"
            aria-hidden="true"
          />
          <div className="flex-1">
            <h3
              className={serviceErrorTitleVariants({
                variant,
                severity: metadata.severity,
              })}
            >
              {getErrorTitle()}
            </h3>
            <p
              className={serviceErrorDescriptionVariants({
                variant,
                severity: metadata.severity,
              })}
            >
              {getErrorDescription()}
            </p>
          </div>
        </div>
      </div>

      {/* Service Status Indicator */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <div
          className={serviceStatusIndicatorVariants({ status: healthStatus })}
        >
          <span
            className={serviceStatusDotVariants({ status: healthStatus })}
          />
          <span>
            {healthStatus === ServiceHealthStatus.HEALTHY &&
              'Service Operational'}
            {healthStatus === ServiceHealthStatus.DEGRADED &&
              'Service Degraded'}
            {healthStatus === ServiceHealthStatus.UNHEALTHY &&
              'Service Unavailable'}
            {healthStatus === ServiceHealthStatus.OFFLINE && 'Service Offline'}
            {healthStatus === ServiceHealthStatus.MAINTENANCE &&
              'Under Maintenance'}
          </span>
        </div>

        <div className={networkStatusIndicatorVariants({ online: isOnline })}>
          {isOnline ? (
            <>
              <Wifi className="h-3 w-3" aria-hidden="true" />
              <span>Online</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3" aria-hidden="true" />
              <span>Offline</span>
            </>
          )}
        </div>
      </div>

      {/* Retry Information */}
      {metadata.retryable && (
        <div
          className={retryInfoVariants({
            variant,
            retryable: metadata.retryable,
          })}
        >
          <div className="flex items-start gap-2">
            <Activity className="h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
            <div className="text-xs text-blue-700 dark:text-blue-300">
              <p className="font-medium">This error is retryable</p>
              {metadata.statusCode && (
                <p className="mt-1 text-blue-600 dark:text-blue-400">
                  Status Code: {metadata.statusCode}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className={serviceErrorActionsVariants({ variant })}>
        {metadata.retryable && isOnline && (
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className={serviceErrorButtonVariants({
              variant,
              intent: 'primary',
            })}
            type="button"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </>
            )}
          </button>
        )}

        {!isOnline && (
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className={serviceErrorButtonVariants({
              variant,
              intent: 'primary',
            })}
            type="button"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Check Connection
          </button>
        )}

        <button
          onClick={() => window.location.reload()}
          className={serviceErrorButtonVariants({
            variant,
            intent: 'secondary',
          })}
          type="button"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
};

/**
 * Service Error Boundary Component
 *
 * Wraps sections of the UI that interact with microservices and provides
 * service-specific error handling with intelligent retry logic.
 */
class ServiceErrorBoundaryClass extends React.Component<
  ServiceErrorBoundaryProps,
  ServiceErrorBoundaryState
> {
  private retryTimeoutId: NodeJS.Timeout | null = null;
  private healthCheckIntervalId: NodeJS.Timeout | null = null;
  private onlineCheckIntervalId: NodeJS.Timeout | null = null;

  constructor(props: ServiceErrorBoundaryProps) {
    super(props);

    const { config } = props;
    this.state = {
      hasError: false,
      error: null,
      errorMetadata: null,
      healthStatus: ServiceHealthStatus.HEALTHY,
      networkStatus: {
        isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
        lastChecked: Date.now(),
      },
      retryConfig: {
        maxRetries: config.maxRetries ?? 3,
        currentRetry: 0,
        retryDelay: config.retryDelay ?? 1000,
        backoffMultiplier: 1.5,
        retryable: false,
      },
      lastErrorTime: null,
    };
  }

  static getDerivedStateFromError(
    error: Error
  ): Partial<ServiceErrorBoundaryState> {
    return {
      hasError: true,
      error,
      lastErrorTime: Date.now(),
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { config } = this.props;
    const detection = detectServiceError(error, config.serviceType);

    // Extract status code from error
    const statusCode = (error as { status?: number }).status;
    const endpoint = (error as { endpoint?: string }).endpoint;

    // Determine if error is retryable
    const retryableStatusCodes =
      config.retryableStatusCodes ?? DEFAULT_RETRYABLE_STATUS_CODES;
    const nonRetryableStatusCodes =
      config.nonRetryableStatusCodes ?? DEFAULT_NON_RETRYABLE_STATUS_CODES;

    let retryable = detection.retryable;
    if (statusCode) {
      if (nonRetryableStatusCodes.includes(statusCode)) {
        retryable = false;
      } else if (retryableStatusCodes.includes(statusCode)) {
        retryable = true;
      }
    }

    const metadata: ServiceErrorMetadata = {
      serviceType: config.serviceType,
      serviceName: config.serviceName,
      endpoint,
      statusCode,
      timestamp: Date.now(),
      requestId: (error as { requestId?: string }).requestId,
      retryable,
      severity: detection.severity,
    };

    const healthStatus = determineHealthStatus(
      true,
      this.state.networkStatus.isOnline,
      statusCode
    );

    this.setState(prev => ({
      errorMetadata: metadata,
      healthStatus,
      retryConfig: {
        ...prev.retryConfig,
        retryable,
      },
    }));

    // Call error callback
    config.onServiceError?.({
      error,
      errorInfo,
      metadata,
      healthStatus,
      isOnline: this.state.networkStatus.isOnline,
    });

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ServiceErrorBoundary caught an error:', {
        error,
        errorInfo,
        metadata,
        healthStatus,
      });
    }
  }

  componentDidMount() {
    const { config } = this.props;

    // Set up online/offline listeners
    if (
      config.enableOfflineDetection !== false &&
      typeof window !== 'undefined'
    ) {
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);
    }

    // Set up periodic online check
    if (config.enableOfflineDetection !== false) {
      this.onlineCheckIntervalId = setInterval(() => {
        this.checkOnlineStatus();
      }, 5000); // Check every 5 seconds
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }

    if (this.healthCheckIntervalId) {
      clearInterval(this.healthCheckIntervalId);
    }

    if (this.onlineCheckIntervalId) {
      clearInterval(this.onlineCheckIntervalId);
    }

    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleOnline);
      window.removeEventListener('offline', this.handleOffline);
    }
  }

  handleOnline = () => {
    this.setState(prev => ({
      networkStatus: {
        ...prev.networkStatus,
        isOnline: true,
        lastChecked: Date.now(),
      },
      healthStatus: prev.hasError
        ? determineHealthStatus(true, true, prev.errorMetadata?.statusCode)
        : ServiceHealthStatus.HEALTHY,
    }));
  };

  handleOffline = () => {
    this.setState(prev => ({
      networkStatus: {
        ...prev.networkStatus,
        isOnline: false,
        lastChecked: Date.now(),
        downtime: Date.now(),
      },
      healthStatus: ServiceHealthStatus.OFFLINE,
    }));
  };

  checkOnlineStatus = () => {
    if (typeof navigator !== 'undefined') {
      const isOnline = navigator.onLine;
      if (isOnline !== this.state.networkStatus.isOnline) {
        if (isOnline) {
          this.handleOnline();
        } else {
          this.handleOffline();
        }
      }
    }
  };

  resetErrorBoundary = () => {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }

    this.setState({
      hasError: false,
      error: null,
      errorMetadata: null,
      healthStatus: ServiceHealthStatus.HEALTHY,
      retryConfig: {
        ...this.state.retryConfig,
        currentRetry: 0,
        retryable: false,
      },
      lastErrorTime: null,
    });
  };

  handleRetry = () => {
    const { retryConfig } = this.state;

    if (retryConfig.currentRetry >= retryConfig.maxRetries) {
      console.warn('Max retries reached for ServiceErrorBoundary');
      return;
    }

    if (!retryConfig.retryable) {
      console.warn('Error is not retryable');
      return;
    }

    // Calculate backoff delay
    const delay =
      retryConfig.retryDelay *
      Math.pow(retryConfig.backoffMultiplier, retryConfig.currentRetry);

    this.retryTimeoutId = setTimeout(() => {
      this.setState(prev => ({
        hasError: false,
        error: null,
        errorMetadata: null,
        healthStatus: ServiceHealthStatus.HEALTHY,
        retryConfig: {
          ...prev.retryConfig,
          currentRetry: prev.retryConfig.currentRetry + 1,
        },
      }));
    }, delay);
  };

  render() {
    const { children, config, customFallback } = this.props;
    const { hasError, error, errorMetadata, healthStatus, networkStatus } =
      this.state;

    if (hasError && error) {
      const FallbackComponent =
        customFallback ??
        config.fallbackComponent ??
        DefaultServiceErrorFallback;

      // If errorMetadata hasn't been set by componentDidCatch yet, create temporary metadata
      // componentDidCatch will update it with more complete information
      const statusCode = (error as { status?: number }).status;
      const effectiveMetadata: ServiceErrorMetadata = errorMetadata ?? {
        serviceType: config.serviceType,
        serviceName: config.serviceName,
        statusCode,
        timestamp: Date.now(),
        retryable: statusCode ? statusCode >= 500 : true,
        severity:
          statusCode && statusCode >= 500
            ? ErrorSeverity.CRITICAL
            : ErrorSeverity.ERROR,
      };

      const fallbackProps: ServiceErrorFallbackProps = {
        error,
        metadata: effectiveMetadata,
        healthStatus,
        isOnline: networkStatus.isOnline,
        resetErrorBoundary: this.resetErrorBoundary,
        onRetry: this.handleRetry,
        onRedirect: config.redirectUrl
          ? () => {
              window.location.href = config.redirectUrl!;
            }
          : undefined,
      };

      return <FallbackComponent {...fallbackProps} />;
    }

    return children;
  }
}

/**
 * ServiceErrorBoundary Component
 *
 * Provides service-specific error handling with intelligent retry logic,
 * health status indicators, and network state awareness.
 *
 * @example
 * ```tsx
 * <ServiceErrorBoundary
 *   config={{
 *     serviceType: ServiceType.RECIPE_MANAGEMENT,
 *     serviceName: SERVICE_DISPLAY_NAMES[ServiceType.RECIPE_MANAGEMENT],
 *     maxRetries: 3,
 *     retryDelay: 1000,
 *   }}
 * >
 *   <RecipeList />
 * </ServiceErrorBoundary>
 * ```
 */
export const ServiceErrorBoundary: React.FC<
  ServiceErrorBoundaryProps
> = props => <ServiceErrorBoundaryClass {...props} />;

ServiceErrorBoundary.displayName = 'ServiceErrorBoundary';

export { DefaultServiceErrorFallback };
