import * as React from 'react';
import { X } from 'lucide-react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  alertVariants,
  alertTitleVariants,
  alertDescriptionVariants,
  alertActionVariants,
  alertButtonVariants,
  alertCloseVariants,
  recipeAlertVariants,
  toastAlertVariants,
  alertIconVariants,
  bannerAlertVariants,
  inlineAlertVariants,
} from '@/lib/ui/alert-variants';
import type {
  BaseAlertProps,
  RecipeAlertProps,
  ToastAlertProps,
  BannerAlertProps,
  InlineAlertProps,
  AlertProviderProps,
  AlertItem,
  AlertContextType,
  AlertCloseProps,
} from '@/types/ui/alert';

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, size, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant, size }), className)}
    {...props}
  />
));
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> &
    VariantProps<typeof alertTitleVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn(alertTitleVariants({ variant, size }), className)}
    {...props}
  >
    {children}
  </h5>
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> &
    VariantProps<typeof alertDescriptionVariants>
>(({ className, variant, size, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(alertDescriptionVariants({ variant, size }), className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

const AlertIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertIconVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(alertIconVariants({ variant, size }), className)}
    {...props}
  >
    {children}
  </div>
));
AlertIcon.displayName = 'AlertIcon';

const AlertActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof alertActionVariants>
>(({ className, layout, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(alertActionVariants({ layout }), className)}
    {...props}
  />
));
AlertActions.displayName = 'AlertActions';

const AlertButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof alertButtonVariants>
>(({ className, intent, size, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(alertButtonVariants({ intent, size }), className)}
    {...props}
  />
));
AlertButton.displayName = 'AlertButton';

const AlertClose = React.forwardRef<HTMLButtonElement, AlertCloseProps>(
  ({ className, variant, onClose, onClick, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(alertCloseVariants({ variant }), className)}
      onClick={e => {
        onClick?.(e);
        onClose?.();
      }}
      {...props}
    >
      <X className="h-4 w-4" />
      <span className="sr-only">Close alert</span>
    </button>
  )
);
AlertClose.displayName = 'AlertClose';

const BaseAlert = React.forwardRef<HTMLDivElement, BaseAlertProps>(
  (
    {
      variant = 'default',
      size = 'default',
      title,
      description,
      icon,
      children,
      dismissible = false,
      onClose,
      className,
      actions,
      ...props
    },
    ref
  ) => {
    return (
      <Alert
        ref={ref}
        variant={variant}
        size={size}
        className={className}
        {...props}
      >
        {icon && (
          <AlertIcon variant={variant} size={size}>
            {icon}
          </AlertIcon>
        )}
        <div className="flex-1">
          {title && (
            <AlertTitle variant={variant} size={size}>
              {title}
            </AlertTitle>
          )}
          {description && (
            <AlertDescription variant={variant} size={size}>
              {description}
            </AlertDescription>
          )}
          {children}
          {actions && <AlertActions>{actions}</AlertActions>}
        </div>
        {dismissible && <AlertClose variant={variant} onClose={onClose} />}
      </Alert>
    );
  }
);
BaseAlert.displayName = 'BaseAlert';

const RecipeAlert = React.forwardRef<HTMLDivElement, RecipeAlertProps>(
  (
    {
      type = 'recipe-saved',
      recipeName,
      title,
      description,
      className,
      ...props
    },
    ref
  ) => {
    const getRecipeContent = () => {
      const name = recipeName ? ` "${recipeName}"` : '';

      switch (type) {
        case 'recipe-saved':
          return {
            title: title ?? `Recipe Saved${name}`,
            description:
              description ?? `Your recipe${name} has been saved successfully.`,
            icon: '💾',
          };
        case 'recipe-published':
          return {
            title: title ?? `Recipe Published${name}`,
            description:
              description ?? `Your recipe${name} is now public and searchable.`,
            icon: '🌍',
          };
        case 'recipe-shared':
          return {
            title: title ?? `Recipe Shared${name}`,
            description: description ?? `Shareable link created for${name}.`,
            icon: '🔗',
          };
        case 'recipe-imported':
          return {
            title: title ?? `Recipe Imported${name}`,
            description:
              description ?? `Recipe${name} has been imported successfully.`,
            icon: '📥',
          };
        case 'recipe-error':
          return {
            title: title ?? `Recipe Error${name}`,
            description:
              description ??
              `There was an error processing your recipe${name}.`,
            icon: '❌',
          };
        case 'cooking-tip':
          return {
            title: title ?? 'Cooking Tip',
            description: description ?? "Here's a helpful tip for your recipe.",
            icon: '💡',
          };
        case 'nutritional-info':
          return {
            title: title ?? 'Nutritional Information',
            description: description ?? 'Nutritional data has been calculated.',
            icon: '📊',
          };
        case 'seasonal-suggestion':
          return {
            title: title ?? 'Seasonal Suggestion',
            description:
              description ?? 'Consider seasonal ingredients for this recipe.',
            icon: '🌿',
          };
        default:
          return {
            title: title ?? 'Recipe Notification',
            description: description ?? 'Recipe action completed.',
            icon: '🍳',
          };
      }
    };

    const content = getRecipeContent();

    // Extract data-testid from props to apply to outer div
    const { 'data-testid': dataTestId, ...restProps } =
      props as typeof props & { 'data-testid'?: string };

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(recipeAlertVariants({ type }), className)}
        data-testid={dataTestId}
      >
        <BaseAlert
          title={content.title}
          description={content.description}
          icon={<span className="text-lg">{content.icon}</span>}
          {...restProps}
        />
      </div>
    );
  }
);
RecipeAlert.displayName = 'RecipeAlert';

const ToastAlert = React.forwardRef<HTMLDivElement, ToastAlertProps>(
  (
    {
      variant = 'default',
      position = 'top-right',
      duration = 5000,
      autoClose = true,
      onClose,
      className,
      ...props
    },
    ref
  ) => {
    React.useEffect(() => {
      if (autoClose && duration > 0) {
        const timer = setTimeout(() => {
          onClose?.();
        }, duration);

        return () => clearTimeout(timer);
      }
    }, [autoClose, duration, onClose]);

    // Extract data-testid from props to apply to outer div
    const { 'data-testid': dataTestId, ...restProps } =
      props as typeof props & { 'data-testid'?: string };

    return (
      <div
        ref={ref}
        role="alert"
        aria-live="polite"
        className={cn(toastAlertVariants({ variant, position }), className)}
        data-state="open"
        data-testid={dataTestId}
      >
        <BaseAlert
          variant={variant}
          dismissible={true}
          onClose={onClose}
          {...restProps}
        />
      </div>
    );
  }
);
ToastAlert.displayName = 'ToastAlert';

const BannerAlert = React.forwardRef<HTMLDivElement, BannerAlertProps>(
  (
    {
      variant = 'default',
      position = 'middle',
      dismissible = true,
      className,
      ...props
    },
    ref
  ) => {
    // Map banner variants to BaseAlert variants
    const baseVariant = variant === 'maintenance' ? 'warning' : variant;

    // Extract data-testid from props to apply to outer div
    const { 'data-testid': dataTestId, ...restProps } =
      props as typeof props & { 'data-testid'?: string };

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(bannerAlertVariants({ variant, position }), className)}
        data-testid={dataTestId}
      >
        <div className="container mx-auto flex items-center justify-between px-4">
          <div className="flex-1">
            <BaseAlert
              variant={baseVariant}
              dismissible={false}
              {...restProps}
            />
          </div>
          {dismissible && (
            <AlertClose
              variant={baseVariant}
              onClose={props.onClose}
              className="relative top-auto right-auto"
            />
          )}
        </div>
      </div>
    );
  }
);
BannerAlert.displayName = 'BannerAlert';

const InlineAlert = React.forwardRef<HTMLDivElement, InlineAlertProps>(
  (
    { variant = 'default', icon, title, description, className, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(inlineAlertVariants({ variant }), className)}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <div className="min-w-0 flex-1">
          {title ? (
            <span className="font-medium">{title}</span>
          ) : (
            description && <span>{description}</span>
          )}
          {title && description && (
            <span className="ml-1 opacity-90">{description}</span>
          )}
        </div>
      </div>
    );
  }
);
InlineAlert.displayName = 'InlineAlert';

const AlertContext = React.createContext<AlertContextType | undefined>(
  undefined
);

export const AlertProvider: React.FC<AlertProviderProps> = ({
  children,
  maxAlerts = 5,
}) => {
  const [alerts, setAlerts] = React.useState<AlertItem[]>([]);

  const addAlert = React.useCallback(
    (type: AlertItem['type'], props: AlertItem['props']): string => {
      const id = `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newAlert: AlertItem = {
        id,
        type,
        props,
        timestamp: Date.now(),
      };

      setAlerts(prev => {
        const updated = [newAlert, ...prev];
        return updated.slice(0, maxAlerts);
      });

      return id;
    },
    [maxAlerts]
  );

  const showAlert = React.useCallback(
    (props: BaseAlertProps) => addAlert('alert', props),
    [addAlert]
  );

  const showToast = React.useCallback(
    (props: ToastAlertProps) => addAlert('toast', props),
    [addAlert]
  );

  const showBanner = React.useCallback(
    (props: BannerAlertProps) => addAlert('banner', props),
    [addAlert]
  );

  const hideAlert = React.useCallback((id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const clearAlerts = React.useCallback(() => {
    setAlerts([]);
  }, []);

  const contextValue = React.useMemo(
    () => ({
      alerts,
      showAlert,
      showToast,
      showBanner,
      hideAlert,
      clearAlerts,
    }),
    [alerts, showAlert, showToast, showBanner, hideAlert, clearAlerts]
  );

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      <div className="pointer-events-none fixed inset-0 z-50 flex flex-col space-y-2 p-4">
        {alerts.map(alert => {
          const commonProps = {
            onClose: () => hideAlert(alert.id),
            className: 'pointer-events-auto',
          };

          switch (alert.type) {
            case 'toast':
              return (
                <ToastAlert
                  key={alert.id}
                  {...commonProps}
                  {...(alert.props as ToastAlertProps)}
                />
              );
            case 'banner':
              return (
                <BannerAlert
                  key={alert.id}
                  {...commonProps}
                  {...(alert.props as BannerAlertProps)}
                />
              );
            default:
              return (
                <BaseAlert
                  key={alert.id}
                  {...commonProps}
                  {...(alert.props as BaseAlertProps)}
                />
              );
          }
        })}
      </div>
    </AlertContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAlert = (): AlertContextType => {
  const context = React.useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertIcon,
  AlertActions,
  AlertButton,
  AlertClose,
  BaseAlert,
  RecipeAlert,
  ToastAlert,
  BannerAlert,
  InlineAlert,
};
