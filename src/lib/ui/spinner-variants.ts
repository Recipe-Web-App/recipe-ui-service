import { cva } from 'class-variance-authority';

export const spinnerVariants = cva(
  ['inline-flex', 'items-center', 'justify-center', 'shrink-0'],
  {
    variants: {
      variant: {
        spinner: ['animate-spin', '[&>svg]:h-full', '[&>svg]:w-full'],
        dots: [
          'gap-1',
          '[&>span]:inline-block',
          '[&>span]:rounded-full',
          '[&>span]:bg-current',
          '[&>span]:animate-pulse',
          '[&>span:nth-child(1)]:[animation-delay:0ms]',
          '[&>span:nth-child(2)]:[animation-delay:150ms]',
          '[&>span:nth-child(3)]:[animation-delay:300ms]',
        ],
        pulse: [
          '[&>span]:inline-block',
          '[&>span]:h-full',
          '[&>span]:w-full',
          '[&>span]:rounded-full',
          '[&>span]:bg-current',
          '[&>span]:animate-ping',
        ],
        bars: [
          'gap-1',
          '[&>span]:inline-block',
          '[&>span]:bg-current',
          '[&>span]:animate-pulse',
          '[&>span:nth-child(1)]:[animation-delay:0ms]',
          '[&>span:nth-child(2)]:[animation-delay:100ms]',
          '[&>span:nth-child(3)]:[animation-delay:200ms]',
        ],
      },
      size: {
        xs: 'h-4 w-4',
        sm: 'h-5 w-5',
        default: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12',
      },
      color: {
        default: 'text-foreground',
        primary: 'text-primary',
        secondary: 'text-secondary',
        muted: 'text-muted-foreground',
        destructive: 'text-destructive',
        success: 'text-green-600 dark:text-green-400',
        warning: 'text-yellow-600 dark:text-yellow-400',
        info: 'text-blue-600 dark:text-blue-400',
      },
      speed: {
        slow: '',
        default: '',
        fast: '',
      },
    },
    defaultVariants: {
      variant: 'spinner',
      size: 'default',
      color: 'default',
      speed: 'default',
    },
    compoundVariants: [
      // Speed adjustments for spinner variant
      {
        variant: 'spinner',
        speed: 'slow',
        class: '[animation-duration:1.5s]',
      },
      {
        variant: 'spinner',
        speed: 'default',
        class: '[animation-duration:1s]',
      },
      {
        variant: 'spinner',
        speed: 'fast',
        class: '[animation-duration:0.6s]',
      },
      // Speed adjustments for dots variant
      {
        variant: 'dots',
        speed: 'slow',
        class: '[&>span]:[animation-duration:1.8s]',
      },
      {
        variant: 'dots',
        speed: 'default',
        class: '[&>span]:[animation-duration:1.4s]',
      },
      {
        variant: 'dots',
        speed: 'fast',
        class: '[&>span]:[animation-duration:0.8s]',
      },
      // Speed adjustments for pulse variant
      {
        variant: 'pulse',
        speed: 'slow',
        class: '[&>span]:[animation-duration:1.5s]',
      },
      {
        variant: 'pulse',
        speed: 'default',
        class: '[&>span]:[animation-duration:1s]',
      },
      {
        variant: 'pulse',
        speed: 'fast',
        class: '[&>span]:[animation-duration:0.6s]',
      },
      // Speed adjustments for bars variant
      {
        variant: 'bars',
        speed: 'slow',
        class: '[&>span]:[animation-duration:1.8s]',
      },
      {
        variant: 'bars',
        speed: 'default',
        class: '[&>span]:[animation-duration:1.4s]',
      },
      {
        variant: 'bars',
        speed: 'fast',
        class: '[&>span]:[animation-duration:0.8s]',
      },
      // Size adjustments for dots variant
      {
        variant: 'dots',
        size: 'xs',
        class: '[&>span]:h-1 [&>span]:w-1',
      },
      {
        variant: 'dots',
        size: 'sm',
        class: '[&>span]:h-1.5 [&>span]:w-1.5',
      },
      {
        variant: 'dots',
        size: 'default',
        class: '[&>span]:h-2 [&>span]:w-2',
      },
      {
        variant: 'dots',
        size: 'lg',
        class: '[&>span]:h-2.5 [&>span]:w-2.5',
      },
      {
        variant: 'dots',
        size: 'xl',
        class: '[&>span]:h-3 [&>span]:w-3',
      },
      // Size adjustments for bars variant
      {
        variant: 'bars',
        size: 'xs',
        class: '[&>span]:h-3 [&>span]:w-1',
      },
      {
        variant: 'bars',
        size: 'sm',
        class: '[&>span]:h-4 [&>span]:w-1',
      },
      {
        variant: 'bars',
        size: 'default',
        class: '[&>span]:h-5 [&>span]:w-1.5',
      },
      {
        variant: 'bars',
        size: 'lg',
        class: '[&>span]:h-6 [&>span]:w-2',
      },
      {
        variant: 'bars',
        size: 'xl',
        class: '[&>span]:h-8 [&>span]:w-2.5',
      },
    ],
  }
);

export const spinnerWrapperVariants = cva([], {
  variants: {
    overlay: {
      true: [
        'fixed',
        'inset-0',
        'z-50',
        'flex',
        'items-center',
        'justify-center',
        'bg-background/80',
        'backdrop-blur-sm',
      ],
      false: 'inline-flex',
    },
    centered: {
      true: [
        'flex',
        'items-center',
        'justify-center',
        'w-full',
        'h-full',
        'min-h-[100px]',
      ],
      false: '',
    },
  },
  defaultVariants: {
    overlay: false,
    centered: false,
  },
});
