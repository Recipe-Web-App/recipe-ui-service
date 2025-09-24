import * as React from 'react';
import {
  AlertTriangle,
  RefreshCw,
  Home,
  Mail,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  errorBoundaryVariants,
  errorBoundaryIconVariants,
  errorBoundaryTitleVariants,
  errorBoundaryDescriptionVariants,
  errorBoundaryActionVariants,
  errorBoundaryButtonVariants,
  errorBoundaryContentVariants,
  errorBoundaryDetailsVariants,
} from '@/lib/ui/error-boundary-variants';
import type {
  BaseErrorBoundaryProps,
  InlineErrorBoundaryProps,
  CardErrorBoundaryProps,
  PageErrorBoundaryProps,
  ToastErrorBoundaryProps,
  ErrorBoundaryState,
  ErrorBoundaryError,
  ErrorFallbackProps,
  ErrorBoundaryButtonProps,
  ErrorBoundaryIconProps,
  ErrorBoundaryContentProps,
  ErrorBoundaryActionsProps,
} from '@/types/ui/error-boundary';
import type { ErrorInfo } from 'react';

const ErrorBoundaryIcon = React.forwardRef<
  HTMLDivElement,
  ErrorBoundaryIconProps
>(({ className, variant, size, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(errorBoundaryIconVariants({ variant, size }), className)}
    {...props}
  >
    {children}
  </div>
));
ErrorBoundaryIcon.displayName = 'ErrorBoundaryIcon';

const ErrorBoundaryTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> &
    VariantProps<typeof errorBoundaryTitleVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(errorBoundaryTitleVariants({ variant, size }), className)}
    {...props}
  >
    {children}
  </h3>
));
ErrorBoundaryTitle.displayName = 'ErrorBoundaryTitle';

const ErrorBoundaryDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> &
    VariantProps<typeof errorBoundaryDescriptionVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      errorBoundaryDescriptionVariants({ variant, size }),
      className
    )}
    {...props}
  >
    {children}
  </p>
));
ErrorBoundaryDescription.displayName = 'ErrorBoundaryDescription';

const ErrorBoundaryContent = React.forwardRef<
  HTMLDivElement,
  ErrorBoundaryContentProps
>(({ className, variant, withIcon, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      errorBoundaryContentVariants({ variant, withIcon }),
      className
    )}
    {...props}
  >
    {children}
  </div>
));
ErrorBoundaryContent.displayName = 'ErrorBoundaryContent';

const ErrorBoundaryActions = React.forwardRef<
  HTMLDivElement,
  ErrorBoundaryActionsProps
>(({ className, layout, variant, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(errorBoundaryActionVariants({ layout, variant }), className)}
    {...props}
  >
    {children}
  </div>
));
ErrorBoundaryActions.displayName = 'ErrorBoundaryActions';

const ErrorBoundaryButton = React.forwardRef<
  HTMLButtonElement,
  ErrorBoundaryButtonProps
>(
  (
    {
      className,
      intent,
      size,
      variant,
      loading,
      loadingText,
      children,
      disabled,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      className={cn(
        errorBoundaryButtonVariants({ intent, size, variant }),
        className
      )}
      disabled={Boolean(disabled) || Boolean(loading)}
      {...props}
    >
      {loading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
      {loading ? (loadingText ?? 'Loading...') : children}
    </button>
  )
);
ErrorBoundaryButton.displayName = 'ErrorBoundaryButton';

const ErrorBoundaryDetails: React.FC<{
  error: ErrorBoundaryError;
  variant?: VariantProps<typeof errorBoundaryDetailsVariants>['variant'];
  className?: string;
}> = ({ error, variant, className }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const errorDetails = React.useMemo(() => {
    const details = [];

    if (error.message) {
      details.push(`Message: ${error.message}`);
    }

    if (error.name) {
      details.push(`Type: ${error.name}`);
    }

    details.push(`Time: ${new Date(error.timestamp).toLocaleString()}`);
    details.push(`Retry Count: ${error.retryCount}`);
    details.push(`Error ID: ${error.id}`);

    if (error.stack) {
      details.push(`\nStack Trace:\n${error.stack}`);
    }

    if (error.componentStack) {
      details.push(`\nComponent Stack:\n${error.componentStack}`);
    }

    return details.join('\n');
  }, [error]);

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="inline-flex items-center gap-1 text-xs text-red-700 hover:text-red-900 focus:outline-none"
        type="button"
      >
        {isExpanded ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )}
        {isExpanded ? 'Hide' : 'Show'} Error Details
      </button>

      {isExpanded && (
        <pre
          className={cn(errorBoundaryDetailsVariants({ variant }), className)}
        >
          {errorDetails}
        </pre>
      )}
    </div>
  );
};

const ToastErrorBoundaryContent: React.FC<{
  fallbackProps: ErrorFallbackProps;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  variant: string;
  autoClose: boolean;
  duration: number;
  onClose?: () => void;
  positionClasses: Record<string, string>;
}> = ({
  fallbackProps,
  position,
  variant,
  autoClose,
  duration,
  onClose,
  positionClasses,
}) => {
  React.useEffect(() => {
    if (autoClose && duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
        fallbackProps.resetErrorBoundary();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose, fallbackProps]);

  return (
    <div
      className={
        position in positionClasses
          ? // eslint-disable-next-line security/detect-object-injection
            positionClasses[position]
          : 'fixed top-4 right-4 z-50'
      }
    >
      <DefaultErrorFallback
        {...fallbackProps}
        variant={variant as 'inline' | 'card' | 'page' | 'toast' | 'minimal'}
        showDetails={false}
        showRetry={true}
        retryText="Dismiss"
      />
    </div>
  );
};

const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  variant = 'card',
  size = 'default',
  showDetails = false,
  showRetry = true,
  retryText = 'Try Again',
  className,
}) => {
  const handleRetry = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    resetErrorBoundary();
  };

  const getDefaultContent = () => {
    switch (variant) {
      case 'page':
        return {
          title: 'Something went wrong',
          description:
            'We apologize for the inconvenience. Please try refreshing the page or contact support if the problem persists.',
        };
      case 'toast':
        return {
          title: 'Error',
          description: 'An unexpected error occurred.',
        };
      case 'minimal':
        return {
          title: 'Error',
          description: 'Something went wrong.',
        };
      case 'inline':
        return {
          title: 'Error',
          description: 'Unable to load this content.',
        };
      default:
        return {
          title: 'Oops! Something went wrong',
          description:
            'An unexpected error occurred. You can try again or refresh the page.',
        };
    }
  };

  const defaultContent = getDefaultContent();

  return (
    <div
      className={cn(errorBoundaryVariants({ variant, size }), className)}
      role="alert"
      aria-live="polite"
    >
      <ErrorBoundaryContent variant={variant} withIcon={true}>
        <ErrorBoundaryIcon variant={variant}>
          <AlertTriangle />
        </ErrorBoundaryIcon>

        <div className="flex-1">
          <ErrorBoundaryTitle variant={variant} size={size}>
            {defaultContent.title}
          </ErrorBoundaryTitle>

          <ErrorBoundaryDescription variant={variant} size={size}>
            {defaultContent.description}
          </ErrorBoundaryDescription>

          {showDetails && (
            <ErrorBoundaryDetails error={error} variant={variant} />
          )}

          {showRetry && (
            <ErrorBoundaryActions variant={variant}>
              <ErrorBoundaryButton
                variant={variant}
                intent="primary"
                onClick={handleRetry}
                loading={false}
                loadingText="Retrying..."
              >
                {retryText}
              </ErrorBoundaryButton>
            </ErrorBoundaryActions>
          )}
        </div>
      </ErrorBoundaryContent>
    </div>
  );
};

class BaseErrorBoundaryClass extends React.Component<
  BaseErrorBoundaryProps,
  ErrorBoundaryState
> {
  private retryTimeoutId: NodeJS.Timeout | null = null;
  private resetTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: BaseErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      retryCount: 0,
      isRetrying: false,
      lastResetTime: Date.now(),
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const errorId = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return {
      hasError: true,
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name,
        timestamp: Date.now(),
        retryCount: 0,
        id: errorId,
      },
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorBoundaryError: ErrorBoundaryError = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      componentStack: errorInfo.componentStack ?? undefined,
      timestamp: Date.now(),
      retryCount: this.state.retryCount,
      id: this.state.errorId ?? `error-${Date.now()}`,
    };

    this.props.onError?.(error, errorInfo);

    // Only log errors in development when not demo errors
    const isDemoError = error.name === 'DemoError' || 'isDemoError' in error;
    const isDemoMode =
      this.props.className?.includes('demo-error-boundary') ??
      (typeof window !== 'undefined' &&
        window.location.pathname.includes('/components-demo/'));

    if (process.env.NODE_ENV === 'development' && !isDemoError && !isDemoMode) {
      console.error('ErrorBoundary caught an error:', {
        error: errorBoundaryError,
        errorInfo,
        props: this.props,
      });
    } else if (isDemoError) {
      // Minimal logging for demo errors
      console.info('Demo error caught (intentional):', error.message);
    }
  }

  componentDidUpdate(prevProps: BaseErrorBoundaryProps) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    if (hasError && prevProps.resetKeys !== resetKeys) {
      if (
        resetKeys?.some(
          (key, idx) =>
            // eslint-disable-next-line security/detect-object-injection
            prevProps.resetKeys?.[idx] !== key
        )
      ) {
        this.resetErrorBoundary();
      }
    }

    if (
      hasError &&
      resetOnPropsChange &&
      prevProps.children !== this.props.children
    ) {
      this.resetErrorBoundary();
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  resetErrorBoundary = () => {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }

    this.setState({
      hasError: false,
      error: null,
      retryCount: 0,
      isRetrying: false,
      lastResetTime: Date.now(),
      errorId: null,
    });
  };

  handleRetry = () => {
    const { maxRetries = 3, retryDelay = 1000 } = this.props;
    const { retryCount, error } = this.state;

    if (retryCount >= maxRetries) {
      console.warn('Max retries reached for ErrorBoundary');
      return;
    }

    this.setState({ isRetrying: true });

    if (error) {
      this.props.onRetry?.(error);
    }

    this.retryTimeoutId = setTimeout(() => {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        retryCount: prevState.retryCount + 1,
        isRetrying: false,
        lastResetTime: Date.now(),
      }));
    }, retryDelay);
  };

  render() {
    const { hasError, error } = this.state;
    const {
      children,
      fallback: FallbackComponent,
      fallbackRender,
      variant = 'card',
      size = 'default',
      enableRetry = true,
      isolate = false,
      className,
    } = this.props;

    if (hasError && error) {
      const fallbackProps: ErrorFallbackProps = {
        error,
        resetErrorBoundary: enableRetry
          ? this.handleRetry
          : this.resetErrorBoundary,
        variant,
        size,
        showRetry: enableRetry,
        className,
      };

      if (FallbackComponent) {
        return <FallbackComponent {...fallbackProps} />;
      }

      if (fallbackRender) {
        return fallbackRender(fallbackProps);
      }

      return <DefaultErrorFallback {...fallbackProps} />;
    }

    if (isolate) {
      return <div className="error-boundary-isolation">{children}</div>;
    }

    return children;
  }
}

const BaseErrorBoundary: React.FC<BaseErrorBoundaryProps> = props => (
  <BaseErrorBoundaryClass {...props} />
);
BaseErrorBoundary.displayName = 'BaseErrorBoundary';

const InlineErrorBoundary = React.forwardRef<
  HTMLDivElement,
  InlineErrorBoundaryProps
>(
  (
    { variant = 'inline', showDetails = false, fallbackRender, ...props },
    _ref
  ) => {
    const customFallbackRender = React.useCallback(
      (fallbackProps: ErrorFallbackProps) => (
        <DefaultErrorFallback
          {...fallbackProps}
          variant={variant}
          showDetails={showDetails}
        />
      ),
      [variant, showDetails]
    );

    return (
      <BaseErrorBoundary
        {...props}
        variant={variant}
        fallbackRender={fallbackRender ?? customFallbackRender}
      />
    );
  }
);
InlineErrorBoundary.displayName = 'InlineErrorBoundary';

const CardErrorBoundary = React.forwardRef<
  HTMLDivElement,
  CardErrorBoundaryProps
>(
  (
    { variant = 'card', showDetails = true, fallbackRender, ...props },
    _ref
  ) => {
    const customFallbackRender = React.useCallback(
      (fallbackProps: ErrorFallbackProps) => (
        <DefaultErrorFallback
          {...fallbackProps}
          variant={variant}
          showDetails={showDetails}
        />
      ),
      [variant, showDetails]
    );

    return (
      <BaseErrorBoundary
        {...props}
        variant={variant}
        fallbackRender={fallbackRender ?? customFallbackRender}
      />
    );
  }
);
CardErrorBoundary.displayName = 'CardErrorBoundary';

const PageErrorBoundary = React.forwardRef<
  HTMLDivElement,
  PageErrorBoundaryProps
>(
  (
    {
      variant = 'page',
      title,
      description,
      icon,
      showDetails = true,
      homeUrl = '/',
      contactUrl,
      fallbackRender,
      ...props
    },
    _ref
  ) => {
    const customFallbackRender = React.useCallback(
      (fallbackProps: ErrorFallbackProps) => (
        <div
          className={cn(
            errorBoundaryVariants({ variant }),
            fallbackProps.className
          )}
          role="alert"
          aria-live="polite"
        >
          <ErrorBoundaryIcon variant={variant}>
            {icon ?? <AlertTriangle />}
          </ErrorBoundaryIcon>

          <ErrorBoundaryTitle variant={variant}>
            {title ?? 'Page Not Found'}
          </ErrorBoundaryTitle>

          <ErrorBoundaryDescription variant={variant}>
            {description ??
              'The page you are looking for might have been removed or is temporarily unavailable.'}
          </ErrorBoundaryDescription>

          {showDetails && (
            <ErrorBoundaryDetails
              error={fallbackProps.error}
              variant={variant}
            />
          )}

          <ErrorBoundaryActions variant={variant}>
            <ErrorBoundaryButton
              variant={variant}
              intent="primary"
              onClick={fallbackProps.resetErrorBoundary}
            >
              Try Again
            </ErrorBoundaryButton>

            <ErrorBoundaryButton
              variant={variant}
              intent="secondary"
              onClick={() => (window.location.href = homeUrl)}
            >
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </ErrorBoundaryButton>

            {contactUrl && (
              <ErrorBoundaryButton
                variant={variant}
                intent="ghost"
                onClick={() => (window.location.href = contactUrl)}
              >
                <Mail className="mr-2 h-4 w-4" />
                Contact Support
              </ErrorBoundaryButton>
            )}
          </ErrorBoundaryActions>
        </div>
      ),
      [variant, title, description, icon, showDetails, homeUrl, contactUrl]
    );

    return (
      <BaseErrorBoundary
        {...props}
        variant={variant}
        fallbackRender={fallbackRender ?? customFallbackRender}
      />
    );
  }
);
PageErrorBoundary.displayName = 'PageErrorBoundary';

const ToastErrorBoundary = React.forwardRef<
  HTMLDivElement,
  ToastErrorBoundaryProps
>(
  (
    {
      variant = 'toast',
      position = 'top-right',
      duration = 5000,
      autoClose = true,
      onClose,
      fallbackRender,
      ...props
    },
    _ref
  ) => {
    const customFallbackRender = React.useCallback(
      (fallbackProps: ErrorFallbackProps) => {
        const positionClasses = {
          'top-left': 'fixed top-4 left-4 z-50',
          'top-right': 'fixed top-4 right-4 z-50',
          'bottom-left': 'fixed bottom-4 left-4 z-50',
          'bottom-right': 'fixed bottom-4 right-4 z-50',
        } as const;

        return (
          <ToastErrorBoundaryContent
            fallbackProps={fallbackProps}
            position={position}
            variant={variant}
            autoClose={autoClose}
            duration={duration}
            onClose={onClose}
            positionClasses={positionClasses}
          />
        );
      },
      [variant, position, autoClose, duration, onClose]
    );

    return (
      <BaseErrorBoundary
        {...props}
        variant={variant}
        fallbackRender={fallbackRender ?? customFallbackRender}
      />
    );
  }
);
ToastErrorBoundary.displayName = 'ToastErrorBoundary';

export {
  BaseErrorBoundary as ErrorBoundary,
  InlineErrorBoundary,
  CardErrorBoundary,
  PageErrorBoundary,
  ToastErrorBoundary,
  ErrorBoundaryIcon,
  ErrorBoundaryTitle,
  ErrorBoundaryDescription,
  ErrorBoundaryContent,
  ErrorBoundaryActions,
  ErrorBoundaryButton,
  ErrorBoundaryDetails,
  DefaultErrorFallback,
};
