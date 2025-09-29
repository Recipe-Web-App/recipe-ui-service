import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  tooltipContentVariants,
  tooltipArrowVariants,
  tooltipTriggerVariants,
  iconTooltipVariants,
} from '@/lib/ui/tooltip-variants';

/**
 * Tooltip provider component
 *
 * Must wrap your app or components that use tooltips.
 */
const TooltipProvider = TooltipPrimitive.Provider;

/**
 * Tooltip root component
 */
const Tooltip = TooltipPrimitive.Root;

/**
 * Tooltip trigger component
 */
const TooltipTrigger = TooltipPrimitive.Trigger;

/**
 * Tooltip content component props interface
 */
export interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
    VariantProps<typeof tooltipContentVariants> {
  showArrow?: boolean;
}

/**
 * Tooltip content component
 */
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(
  (
    {
      className,
      variant,
      size,
      showArrow = true,
      sideOffset = 4,
      children,
      ...props
    },
    ref
  ) => (
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(tooltipContentVariants({ variant, size, className }))}
      {...props}
    >
      {children}
      {showArrow && (
        <TooltipPrimitive.Arrow
          className={cn(tooltipArrowVariants({ variant }))}
          width={8}
          height={4}
        />
      )}
    </TooltipPrimitive.Content>
  )
);
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

/**
 * Simple tooltip wrapper component props interface
 */
export interface SimpleTooltipProps
  extends Omit<TooltipContentProps, 'children' | 'content'> {
  content: React.ReactNode;
  children: React.ReactNode;
  delayDuration?: number;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Simple tooltip wrapper for easy usage
 */
const SimpleTooltip = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  SimpleTooltipProps
>(
  (
    {
      content,
      children,
      delayDuration = 200,
      side = 'top',
      align = 'center',
      variant,
      size,
      showArrow,
      open,
      defaultOpen,
      onOpenChange,
      ...props
    },
    ref
  ) => (
    <Tooltip
      delayDuration={delayDuration}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        ref={ref}
        side={side}
        align={align}
        variant={variant}
        size={size}
        showArrow={showArrow}
        {...props}
      >
        {content}
      </TooltipContent>
    </Tooltip>
  )
);
SimpleTooltip.displayName = 'SimpleTooltip';

/**
 * Cooking term tooltip props interface
 */
export interface CookingTermTooltipProps
  extends Omit<SimpleTooltipProps, 'variant' | 'content' | 'children'> {
  term: string;
  definition: string;
  pronunciation?: string;
  category?:
    | 'technique'
    | 'ingredient'
    | 'equipment'
    | 'measurement'
    | 'general';
  children?: React.ReactNode;
}

/**
 * Specialized tooltip for cooking terms with enhanced formatting
 */
const CookingTermTooltip = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  CookingTermTooltipProps
>(
  (
    {
      term,
      definition,
      pronunciation,
      category = 'general',
      children,
      size = 'lg',
      ...props
    },
    ref
  ) => {
    const content = (
      <div className="space-y-2">
        <span className="flex items-center gap-2">
          <span className="text-lg" role="img" aria-label={category}>
            {category === 'technique' && '👨‍🍳'}
            {category === 'ingredient' && '🥗'}
            {category === 'equipment' && '🔪'}
            {category === 'measurement' && '⚖️'}
            {category === 'general' && '📖'}
          </span>
          <span>
            <span className="font-semibold">{term}</span>
            {pronunciation && (
              <span className="block text-xs italic opacity-75">
                /{pronunciation}/
              </span>
            )}
          </span>
        </span>
        <div className="text-sm leading-relaxed">{definition}</div>
        <div
          className={`inline-block rounded-full px-2 py-1 text-xs ${
            category === 'technique'
              ? 'bg-warning-light text-warning'
              : category === 'ingredient'
                ? 'bg-success-light text-success'
                : category === 'equipment'
                  ? 'bg-info-light text-info'
                  : category === 'measurement'
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-muted text-text-secondary'
          }`}
        >
          {category}
        </div>
      </div>
    );

    return (
      <SimpleTooltip
        ref={ref}
        content={content}
        variant="light"
        size={size}
        {...props}
      >
        <span className={cn(tooltipTriggerVariants({ variant: 'cooking' }))}>
          {children ?? term}
        </span>
      </SimpleTooltip>
    );
  }
);
CookingTermTooltip.displayName = 'CookingTermTooltip';

/**
 * Help icon tooltip props interface
 */
export interface HelpTooltipProps
  extends Omit<SimpleTooltipProps, 'children' | 'content'> {
  helpText: React.ReactNode;
  iconVariant?: VariantProps<typeof iconTooltipVariants>['variant'];
  iconSize?: VariantProps<typeof iconTooltipVariants>['size'];
  'aria-label'?: string;
}

/**
 * Help icon tooltip for UI assistance
 */
const HelpTooltip = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  HelpTooltipProps
>(
  (
    {
      helpText,
      iconVariant = 'default',
      iconSize = 'default',
      'aria-label': ariaLabel = 'Help',
      ...props
    },
    ref
  ) => (
    <SimpleTooltip ref={ref} content={helpText} {...props}>
      <button
        type="button"
        className={cn(
          iconTooltipVariants({ variant: iconVariant, size: iconSize })
        )}
        aria-label={ariaLabel}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-full w-full"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <circle cx="12" cy="17" r=".01" />
        </svg>
      </button>
    </SimpleTooltip>
  )
);
HelpTooltip.displayName = 'HelpTooltip';

/**
 * Info icon tooltip props interface
 */
export interface InfoTooltipProps
  extends Omit<SimpleTooltipProps, 'children' | 'content'> {
  infoText: React.ReactNode;
  iconVariant?: VariantProps<typeof iconTooltipVariants>['variant'];
  iconSize?: VariantProps<typeof iconTooltipVariants>['size'];
  'aria-label'?: string;
}

/**
 * Info icon tooltip for additional information
 */
const InfoTooltip = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  InfoTooltipProps
>(
  (
    {
      infoText,
      iconVariant = 'accent',
      iconSize = 'default',
      'aria-label': ariaLabel = 'Information',
      ...props
    },
    ref
  ) => (
    <SimpleTooltip ref={ref} content={infoText} variant="info" {...props}>
      <button
        type="button"
        className={cn(
          iconTooltipVariants({ variant: iconVariant, size: iconSize })
        )}
        aria-label={ariaLabel}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-full w-full"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      </button>
    </SimpleTooltip>
  )
);
InfoTooltip.displayName = 'InfoTooltip';

/**
 * Keyboard shortcut tooltip props interface
 */
export interface KeyboardTooltipProps
  extends Omit<SimpleTooltipProps, 'content'> {
  shortcut: string | string[];
  description?: string;
}

/**
 * Keyboard shortcut tooltip for displaying shortcuts
 */
const KeyboardTooltip = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  KeyboardTooltipProps
>(({ shortcut, description, children, side = 'bottom', ...props }, ref) => {
  const shortcuts = Array.isArray(shortcut) ? shortcut : [shortcut];

  const content = (
    <div className="space-y-1">
      {description && <div className="text-sm">{description}</div>}
      <div className="flex items-center gap-1">
        {shortcuts.map((key, index) => (
          <React.Fragment key={key}>
            {index > 0 && <span className="text-xs">+</span>}
            <kbd className="border-code-border bg-code text-code-text rounded border px-1.5 py-0.5 text-xs font-semibold">
              {key}
            </kbd>
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  return (
    <SimpleTooltip
      ref={ref}
      content={content}
      variant="light"
      side={side}
      {...props}
    >
      {children}
    </SimpleTooltip>
  );
});
KeyboardTooltip.displayName = 'KeyboardTooltip';

/**
 * Recipe metric tooltip props interface
 */
export interface MetricTooltipProps
  extends Omit<SimpleTooltipProps, 'content' | 'children'> {
  metric: string;
  value: number;
  unit: string;
  conversion?: {
    value: number;
    unit: string;
    system: 'metric' | 'imperial';
  };
  children?: React.ReactNode;
}

/**
 * Recipe metric tooltip for unit conversions
 */
const MetricTooltip = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  MetricTooltipProps
>(({ metric, value, unit, conversion, children, ...props }, ref) => {
  const content = (
    <div className="space-y-2">
      <div className="font-semibold">{metric}</div>
      <div className="text-sm">
        <div>
          {value} {unit}
        </div>
        {conversion && (
          <div className="mt-1 text-xs opacity-75">
            ≈ {conversion.value} {conversion.unit} ({conversion.system})
          </div>
        )}
      </div>
    </div>
  );

  return (
    <SimpleTooltip ref={ref} content={content} variant="accent" {...props}>
      <span className={cn(tooltipTriggerVariants({ variant: 'term' }))}>
        {children ?? `${value} ${unit}`}
      </span>
    </SimpleTooltip>
  );
});
MetricTooltip.displayName = 'MetricTooltip';

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  SimpleTooltip,
  CookingTermTooltip,
  HelpTooltip,
  InfoTooltip,
  KeyboardTooltip,
  MetricTooltip,
};
