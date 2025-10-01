'use client';

/**
 * ErrorPage Component
 *
 * A standalone full-page error display component for common HTTP status codes.
 * Unlike PageErrorBoundary, this component doesn't catch errors - it renders
 * error pages directly based on props.
 *
 * Features:
 * - HTTP status code displays (404, 401, 403, 500, 503, etc.)
 * - Context-aware recovery actions
 * - Responsive design with dark mode support
 * - SEO-friendly error messages
 * - Reuses PageErrorBoundary infrastructure
 *
 * @example
 * ```tsx
 * <ErrorPage statusCode={404} homeUrl="/" />
 * <ErrorPage errorType={PageErrorType.UNAUTHORIZED} loginUrl="/login" />
 * ```
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Home,
  ArrowLeft,
  RefreshCw,
  RotateCw,
  LogIn,
  Mail,
  Activity,
  AlertTriangle,
  XCircle,
  ShieldAlert,
  ServerCrash,
  WifiOff,
  Construction,
  Clock,
  FileX,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  pageErrorBoundaryVariants,
  pageErrorContentVariants,
  pageErrorStatusCodeVariants,
  pageErrorTitleVariants,
  pageErrorDescriptionVariants,
  pageErrorIconVariants,
  pageErrorActionsVariants,
  pageErrorButtonVariants,
  pageErrorDetailsVariants,
  pageErrorDetailsTitleVariants,
  pageErrorDetailsTextVariants,
} from '@/lib/ui/page-error-boundary-variants';
import {
  generatePageErrorMetadata,
  getRecoveryActions,
} from '@/lib/error/page-error-utils';
import {
  PageErrorType,
  RecoveryActionType,
  HttpStatusCode,
  type PageErrorMetadata,
  type RecoveryAction,
} from '@/types/error/page-errors';

/**
 * Error icon mapping
 */
const ERROR_TYPE_ICONS: Record<PageErrorType, React.ComponentType> = {
  [PageErrorType.NOT_FOUND]: FileX,
  [PageErrorType.UNAUTHORIZED]: ShieldAlert,
  [PageErrorType.FORBIDDEN]: XCircle,
  [PageErrorType.SERVER_ERROR]: ServerCrash,
  [PageErrorType.SERVICE_UNAVAILABLE]: WifiOff,
  [PageErrorType.MAINTENANCE]: Construction,
  [PageErrorType.TIMEOUT]: Clock,
  [PageErrorType.GONE]: FileX,
  [PageErrorType.BAD_REQUEST]: AlertCircle,
  [PageErrorType.UNKNOWN]: AlertTriangle,
};

/**
 * Recovery action icon mapping
 */
const RECOVERY_ACTION_ICON_MAP: Record<
  RecoveryActionType,
  React.ComponentType
> = {
  [RecoveryActionType.GO_HOME]: Home,
  [RecoveryActionType.GO_BACK]: ArrowLeft,
  [RecoveryActionType.RETRY]: RefreshCw,
  [RecoveryActionType.REFRESH]: RotateCw,
  [RecoveryActionType.LOGIN]: LogIn,
  [RecoveryActionType.CONTACT_SUPPORT]: Mail,
  [RecoveryActionType.VIEW_STATUS]: Activity,
};

/**
 * ErrorPage component props
 */
export interface ErrorPageProps {
  /** HTTP status code (e.g., 404, 500) */
  statusCode?: HttpStatusCode | number;

  /** Error type (alternative to statusCode) */
  errorType?: PageErrorType;

  /** Custom error title */
  title?: string;

  /** Custom error description */
  description?: string;

  /** Show detailed error information (development mode) */
  showDetails?: boolean;

  /** Error details/message to display when showDetails is true */
  errorDetails?: string;

  /** Custom recovery actions */
  recoveryActions?: RecoveryAction[];

  /** Home page URL for "Go Home" action */
  homeUrl?: string;

  /** Login page URL for "Login" action */
  loginUrl?: string;

  /** Contact email for support */
  contactEmail?: string;

  /** Status page URL */
  statusPageUrl?: string;

  /** Maintenance message (for maintenance mode) */
  maintenanceMessage?: string;

  /** Estimated recovery time (for maintenance/service unavailable) */
  estimatedRecoveryTime?: Date;

  /** Callback when error is displayed */
  onError?: (metadata: PageErrorMetadata) => void;

  /** Additional CSS classes */
  className?: string;

  /** Test ID for testing */
  'data-testid'?: string;
}

/**
 * ErrorPage component
 */
export const ErrorPage: React.FC<ErrorPageProps> = ({
  statusCode,
  errorType,
  title,
  description,
  showDetails = false,
  errorDetails,
  recoveryActions: customRecoveryActions,
  homeUrl = '/',
  loginUrl = '/login',
  contactEmail,
  statusPageUrl,
  maintenanceMessage,
  estimatedRecoveryTime,
  onError,
  className,
  'data-testid': testId = 'error-page',
}) => {
  const router = useRouter();
  const [detailsExpanded, setDetailsExpanded] = React.useState(false);

  // Generate error metadata
  const metadata = React.useMemo(() => {
    // Determine status code based on error type or provided statusCode
    let effectiveStatusCode = statusCode;
    if (!effectiveStatusCode && errorType) {
      // Map error type to status code
      const typeToStatusMap: Record<PageErrorType, HttpStatusCode> = {
        [PageErrorType.NOT_FOUND]: HttpStatusCode.NOT_FOUND,
        [PageErrorType.UNAUTHORIZED]: HttpStatusCode.UNAUTHORIZED,
        [PageErrorType.FORBIDDEN]: HttpStatusCode.FORBIDDEN,
        [PageErrorType.SERVER_ERROR]: HttpStatusCode.INTERNAL_SERVER_ERROR,
        [PageErrorType.SERVICE_UNAVAILABLE]: HttpStatusCode.SERVICE_UNAVAILABLE,
        [PageErrorType.MAINTENANCE]: HttpStatusCode.SERVICE_UNAVAILABLE,
        [PageErrorType.TIMEOUT]: HttpStatusCode.REQUEST_TIMEOUT,
        [PageErrorType.GONE]: HttpStatusCode.GONE,
        [PageErrorType.BAD_REQUEST]: HttpStatusCode.BAD_REQUEST,
        [PageErrorType.UNKNOWN]: HttpStatusCode.INTERNAL_SERVER_ERROR,
      };
      // eslint-disable-next-line security/detect-object-injection
      effectiveStatusCode = typeToStatusMap[errorType];
    }

    const error = new Error('Page error') as Error & {
      statusCode?: number;
      type?: PageErrorType;
    };
    if (effectiveStatusCode) {
      error.statusCode = effectiveStatusCode;
    }
    if (errorType) {
      error.type = errorType;
    }

    const meta = generatePageErrorMetadata(error, {
      url: '/',
    });

    // Override errorType if explicitly provided (e.g., MAINTENANCE vs SERVICE_UNAVAILABLE)
    if (errorType && meta.errorType !== errorType) {
      return {
        ...meta,
        errorType,
      };
    }

    return meta;
  }, [statusCode, errorType]);

  // Get recovery actions
  const defaultRecoveryActions = React.useMemo(() => {
    return getRecoveryActions(metadata.errorType, {
      homeUrl,
      loginUrl,
      contactUrl: contactEmail ? `mailto:${contactEmail}` : undefined,
      statusPageUrl,
    });
  }, [metadata.errorType, homeUrl, loginUrl, contactEmail, statusPageUrl]);

  const recoveryActions = customRecoveryActions ?? defaultRecoveryActions;

  // Call onError callback
  React.useEffect(() => {
    if (onError) {
      onError(metadata);
    }
  }, [onError, metadata]);

  // Get error icon
  const IconComponent = ERROR_TYPE_ICONS[metadata.errorType] ?? AlertTriangle;

  // Handle recovery action click
  const handleActionClick = (action: RecoveryAction) => {
    if (action.handler) {
      action.handler();
    } else if (action.url) {
      router.push(action.url);
    }
  };

  // Display title and description
  const displayTitle = title ?? metadata.title;
  const displayDescription = description ?? metadata.description;

  // Format estimated recovery time
  const formattedEstimatedTime = estimatedRecoveryTime
    ? new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(estimatedRecoveryTime)
    : null;

  return (
    <div
      className={cn(pageErrorBoundaryVariants(), className)}
      data-testid={testId}
      role="alert"
      aria-live="polite"
    >
      <div className={cn(pageErrorContentVariants())}>
        {/* Status Code */}
        <div className={cn(pageErrorStatusCodeVariants())}>
          {metadata.statusCode}
        </div>

        {/* Icon */}
        <div className={cn(pageErrorIconVariants())} aria-hidden="true">
          <IconComponent />
        </div>

        {/* Title */}
        <h1 className={cn(pageErrorTitleVariants())}>{displayTitle}</h1>

        {/* Description */}
        <p className={cn(pageErrorDescriptionVariants())}>
          {displayDescription}
        </p>

        {/* Maintenance message */}
        {metadata.errorType === PageErrorType.MAINTENANCE &&
          maintenanceMessage && (
            <div className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-950">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                {maintenanceMessage}
              </p>
              {formattedEstimatedTime && (
                <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                  Expected to be back by: {formattedEstimatedTime}
                </p>
              )}
            </div>
          )}

        {/* Recovery Actions */}
        {recoveryActions.length > 0 && (
          <div
            className={cn(pageErrorActionsVariants())}
            role="group"
            aria-label="Recovery actions"
          >
            {recoveryActions.map((action, index) => {
              const ActionIcon =
                RECOVERY_ACTION_ICON_MAP[action.type] ?? RefreshCw;
              const buttonIntent = action.isPrimary ? 'primary' : 'secondary';

              return (
                <button
                  key={index}
                  onClick={() => handleActionClick(action)}
                  className={cn(
                    pageErrorButtonVariants({ intent: buttonIntent })
                  )}
                  aria-label={action.label}
                  disabled={action.disabled}
                >
                  <ActionIcon aria-hidden="true" />
                  {action.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Error Details (Development) */}
        {showDetails && errorDetails && (
          <div className={cn(pageErrorDetailsVariants())}>
            <button
              onClick={() => setDetailsExpanded(!detailsExpanded)}
              className="flex w-full items-center justify-between text-left"
              aria-expanded={detailsExpanded}
              aria-controls="error-details-content"
            >
              <span className={cn(pageErrorDetailsTitleVariants())}>
                Error Details
              </span>
              {detailsExpanded ? (
                <ChevronUp className="h-4 w-4" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              )}
            </button>

            {detailsExpanded && (
              <div id="error-details-content" className="mt-2">
                <pre
                  className={cn(
                    pageErrorDetailsTextVariants(),
                    'break-words whitespace-pre-wrap'
                  )}
                >
                  {errorDetails}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

ErrorPage.displayName = 'ErrorPage';
