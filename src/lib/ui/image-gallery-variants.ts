import { cva } from 'class-variance-authority';

/**
 * Image gallery container variants using class-variance-authority
 *
 * Provides different grid layouts and spacing options for the gallery.
 */
export const imageGalleryVariants = cva(['w-full'], {
  variants: {
    variant: {
      'grid-2': ['grid', 'grid-cols-1', 'sm:grid-cols-2'],
      'grid-3': ['grid', 'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3'],
      'grid-4': [
        'grid',
        'grid-cols-1',
        'sm:grid-cols-2',
        'lg:grid-cols-3',
        'xl:grid-cols-4',
      ],
      masonry: ['columns-1', 'sm:columns-2', 'lg:columns-3', 'xl:columns-4'],
    },
    spacing: {
      tight: ['gap-1'],
      normal: ['gap-2'],
      loose: ['gap-4'],
    },
  },
  compoundVariants: [
    {
      variant: 'masonry',
      spacing: 'tight',
      class: ['gap-1', 'column-gap-1'],
    },
    {
      variant: 'masonry',
      spacing: 'normal',
      class: ['gap-2', 'column-gap-2'],
    },
    {
      variant: 'masonry',
      spacing: 'loose',
      class: ['gap-4', 'column-gap-4'],
    },
  ],
  defaultVariants: {
    variant: 'grid-3',
    spacing: 'normal',
  },
});

/**
 * Individual gallery image variants
 *
 * Controls the appearance and sizing of individual images in the gallery.
 */
export const galleryImageVariants = cva(
  [
    'relative',
    'overflow-hidden',
    'cursor-pointer',
    'transition-all',
    'duration-200',
    'hover:scale-105',
    'hover:shadow-lg',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-ring',
    'focus:ring-offset-2',
    'group',
  ],
  {
    variants: {
      aspectRatio: {
        square: ['aspect-square'],
        landscape: ['aspect-[4/3]'],
        portrait: ['aspect-[3/4]'],
        auto: ['aspect-auto'],
      },
      size: {
        sm: ['rounded-sm'],
        md: ['rounded-md'],
        lg: ['rounded-lg'],
        xl: ['rounded-xl'],
      },
      variant: {
        'grid-2': [],
        'grid-3': [],
        'grid-4': [],
        masonry: ['break-inside-avoid', 'mb-1', 'sm:mb-2', 'lg:mb-4'],
      },
    },
    compoundVariants: [
      {
        aspectRatio: 'auto',
        variant: 'masonry',
        class: ['aspect-auto'],
      },
    ],
    defaultVariants: {
      aspectRatio: 'auto',
      size: 'md',
      variant: 'grid-3',
    },
  }
);

/**
 * Image element variants for the actual img tag
 */
export const imageElementVariants = cva([
  'w-full',
  'h-full',
  'object-cover',
  'transition-transform',
  'duration-200',
  'group-hover:scale-110',
]);

/**
 * Image caption variants
 */
export const imageCaptionVariants = cva([
  'absolute',
  'bottom-0',
  'left-0',
  'right-0',
  'bg-black/60',
  'text-white',
  'p-2',
  'text-sm',
  'opacity-0',
  'group-hover:opacity-100',
  'transition-opacity',
  'duration-200',
  'backdrop-blur-sm',
]);

/**
 * Lightbox overlay variants
 */
export const lightboxOverlayVariants = cva([
  'fixed',
  'inset-0',
  'z-50',
  'bg-black/90',
  'backdrop-blur-sm',
  'flex',
  'items-center',
  'justify-center',
  'p-4',
]);

/**
 * Lightbox content variants
 */
export const lightboxContentVariants = cva([
  'relative',
  'max-w-full',
  'max-h-full',
  'flex',
  'items-center',
  'justify-center',
]);

/**
 * Lightbox image variants
 */
export const lightboxImageVariants = cva([
  'max-w-full',
  'max-h-full',
  'object-contain',
  'rounded-lg',
  'shadow-2xl',
]);

/**
 * Lightbox controls variants
 */
export const lightboxControlsVariants = cva([
  'absolute',
  'top-4',
  'right-4',
  'flex',
  'items-center',
  'gap-2',
  'z-10',
]);

/**
 * Lightbox navigation button variants
 */
export const lightboxNavButtonVariants = cva(
  [
    'absolute',
    'top-1/2',
    'transform',
    '-translate-y-1/2',
    'bg-black/60',
    'hover:bg-black/80',
    'text-white',
    'p-3',
    'rounded-full',
    'transition-all',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-white',
    'focus:ring-offset-2',
    'focus:ring-offset-black',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'backdrop-blur-sm',
  ],
  {
    variants: {
      direction: {
        previous: ['left-4'],
        next: ['right-4'],
      },
    },
  }
);

/**
 * Lightbox close button variants
 */
export const lightboxCloseButtonVariants = cva([
  'bg-black/60',
  'hover:bg-black/80',
  'text-white',
  'p-2',
  'rounded-full',
  'transition-all',
  'duration-200',
  'focus:outline-none',
  'focus:ring-2',
  'focus:ring-white',
  'focus:ring-offset-2',
  'focus:ring-offset-black',
  'backdrop-blur-sm',
]);

/**
 * Lightbox counter variants
 */
export const lightboxCounterVariants = cva([
  'bg-black/60',
  'text-white',
  'px-3',
  'py-1',
  'rounded-full',
  'text-sm',
  'font-medium',
  'backdrop-blur-sm',
]);

/**
 * Lightbox caption variants
 */
export const lightboxCaptionVariants = cva([
  'absolute',
  'bottom-4',
  'left-4',
  'right-4',
  'bg-black/60',
  'text-white',
  'p-4',
  'rounded-lg',
  'text-center',
  'backdrop-blur-sm',
]);

/**
 * Loading spinner variants for lazy-loaded images
 */
export const imageLoadingVariants = cva([
  'absolute',
  'inset-0',
  'flex',
  'items-center',
  'justify-center',
  'bg-muted',
  'animate-pulse',
]);

/**
 * Error state variants for failed image loads
 */
export const imageErrorVariants = cva([
  'absolute',
  'inset-0',
  'flex',
  'flex-col',
  'items-center',
  'justify-center',
  'bg-muted',
  'text-muted-foreground',
  'gap-2',
]);
