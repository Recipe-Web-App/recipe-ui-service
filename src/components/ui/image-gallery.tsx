import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  imageGalleryVariants,
  galleryImageVariants,
  imageElementVariants,
  imageCaptionVariants,
  lightboxOverlayVariants,
  lightboxContentVariants,
  lightboxImageVariants,
  lightboxControlsVariants,
  lightboxNavButtonVariants,
  lightboxCloseButtonVariants,
  lightboxCounterVariants,
  lightboxCaptionVariants,
  imageLoadingVariants,
  imageErrorVariants,
} from '@/lib/ui/image-gallery-variants';
import type {
  ImageGalleryProps,
  ImageItem,
  LightboxProps,
  GalleryGridProps,
  GalleryImageProps,
  LightboxControlsProps,
} from '@/types/ui/image-gallery';

/**
 * Individual Gallery Image Component
 *
 * Renders a single image with lazy loading, error handling, and click interaction.
 */
const GalleryImage = React.forwardRef<HTMLButtonElement, GalleryImageProps>(
  (
    {
      image,
      index,
      aspectRatio,
      size,
      showCaption,
      lazyLoad,
      onClick,
      onLoad,
      onError,
      className,
      testId,
      ...props
    },
    ref
  ) => {
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [hasError, setHasError] = React.useState(false);
    const [isInView, setIsInView] = React.useState(!lazyLoad);
    const imageRef = React.useRef<HTMLDivElement>(null);

    // Intersection Observer for lazy loading
    React.useEffect(() => {
      if (!lazyLoad || isInView) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      if (imageRef.current) {
        observer.observe(imageRef.current);
      }

      return () => observer.disconnect();
    }, [lazyLoad, isInView]);

    const handleImageLoad = React.useCallback(() => {
      setIsLoaded(true);
      onLoad?.(image, index);
    }, [image, index, onLoad]);

    const handleImageError = React.useCallback(() => {
      setHasError(true);
      onError?.(image, index);
    }, [image, index, onError]);

    const handleClick = React.useCallback(() => {
      onClick(image, index);
    }, [image, index, onClick]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick(image, index);
        }
      },
      [image, index, onClick]
    );

    return (
      <div
        ref={imageRef}
        className={cn(
          galleryImageVariants({ aspectRatio, size, variant: 'grid-3' }),
          className
        )}
      >
        <button
          ref={ref}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          className="h-full w-full focus:outline-none"
          aria-label={`View image: ${image.alt}`}
          data-testid={testId ? `${testId}-image-${index}` : undefined}
          {...props}
        >
          {!isInView && lazyLoad && (
            <div className={imageLoadingVariants()}>
              <div className="border-muted-foreground h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
            </div>
          )}

          {isInView && !hasError && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.thumbnailSrc ?? image.src}
                alt={image.alt}
                onLoad={handleImageLoad}
                onError={handleImageError}
                className={cn(imageElementVariants(), !isLoaded && 'opacity-0')}
                loading={lazyLoad ? 'lazy' : 'eager'}
                width={image.width}
                height={image.height}
              />
              {!isLoaded && (
                <div className={imageLoadingVariants()}>
                  <div className="border-muted-foreground h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
                </div>
              )}
            </>
          )}

          {hasError && (
            <div className={imageErrorVariants()}>
              <svg
                className="text-muted-foreground h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-xs">Failed to load</span>
            </div>
          )}

          {showCaption && image.caption && isLoaded && (
            <div className={imageCaptionVariants()}>
              <p className="truncate">{image.caption}</p>
            </div>
          )}
        </button>
      </div>
    );
  }
);
GalleryImage.displayName = 'GalleryImage';

/**
 * Gallery Grid Component
 *
 * Renders the grid layout for images with responsive columns.
 */
const GalleryGrid = React.forwardRef<HTMLDivElement, GalleryGridProps>(
  (
    {
      images,
      variant,
      aspectRatio,
      size,
      spacing,
      showCaptions,
      lazyLoad,
      onImageClick,
      onImageLoad,
      onImageError,
      className,
      testId,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(imageGalleryVariants({ variant, spacing }), className)}
      data-testid={testId ? `${testId}-grid` : undefined}
      {...props}
    >
      {images.map((image, index) => (
        <GalleryImage
          key={image.id}
          image={image}
          index={index}
          aspectRatio={aspectRatio}
          size={size}
          showCaption={showCaptions}
          lazyLoad={lazyLoad}
          onClick={onImageClick}
          onLoad={onImageLoad}
          onError={onImageError}
          testId={testId}
        />
      ))}
    </div>
  )
);
GalleryGrid.displayName = 'GalleryGrid';

/**
 * Lightbox Controls Component
 *
 * Navigation and close controls for the lightbox.
 */
const LightboxControls: React.FC<LightboxControlsProps> = ({
  currentIndex,
  totalImages,
  onNext: _onNext,
  onPrevious: _onPrevious,
  onClose,
  hasPrevious: _hasPrevious,
  hasNext: _hasNext,
  className,
  testId,
}) => (
  <div
    className={cn(lightboxControlsVariants(), className)}
    data-testid={testId ? `${testId}-controls` : undefined}
  >
    <div className={lightboxCounterVariants()}>
      {currentIndex + 1} / {totalImages}
    </div>
    <button
      onClick={onClose}
      className={lightboxCloseButtonVariants()}
      aria-label="Close lightbox"
      data-testid={testId ? `${testId}-close` : undefined}
    >
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
);

/**
 * Lightbox Component
 *
 * Full-screen modal for viewing images with navigation controls.
 */
const Lightbox: React.FC<LightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrevious,
  onIndexChange: _onIndexChange,
  showCaptions = true,
  className,
  testId,
}) => {
  const currentImage = images.at(currentIndex);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  // Keyboard navigation
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowLeft') {
        if (hasPrevious) onPrevious();
      } else if (event.key === 'ArrowRight') {
        if (hasNext) onNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hasPrevious, hasNext, onClose, onNext, onPrevious]);

  // Body scroll lock
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !currentImage) return null;

  return (
    <div
      className={cn(lightboxOverlayVariants(), className)}
      onClick={onClose}
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClose();
        }
      }}
      data-testid={testId ? `${testId}-lightbox` : undefined}
      role="dialog"
      aria-modal="true"
      aria-label={`Image viewer: ${currentImage.alt}`}
      tabIndex={0}
    >
      <div
        className={lightboxContentVariants()}
        onClick={e => e.stopPropagation()}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.stopPropagation();
          }
        }}
        role="img"
        tabIndex={-1}
      >
        {/* Navigation buttons */}
        {hasPrevious && (
          <button
            onClick={onPrevious}
            className={lightboxNavButtonVariants({ direction: 'previous' })}
            aria-label="Previous image"
            data-testid={testId ? `${testId}-previous` : undefined}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        {hasNext && (
          <button
            onClick={onNext}
            className={lightboxNavButtonVariants({ direction: 'next' })}
            aria-label="Next image"
            data-testid={testId ? `${testId}-next` : undefined}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}

        {/* Main image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentImage.src}
          alt={currentImage.alt}
          className={lightboxImageVariants()}
          data-testid={testId ? `${testId}-image` : undefined}
        />

        {/* Controls */}
        <LightboxControls
          currentIndex={currentIndex}
          totalImages={images.length}
          onNext={onNext}
          onPrevious={onPrevious}
          onClose={onClose}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
          testId={testId}
        />

        {/* Caption */}
        {showCaptions && currentImage.caption && (
          <div className={lightboxCaptionVariants()}>
            <p>{currentImage.caption}</p>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * ImageGallery Root Component
 *
 * A responsive image gallery with grid layouts and optional lightbox functionality.
 * Supports lazy loading, multiple aspect ratios, and keyboard navigation.
 *
 * @example
 * ```tsx
 * const images = [
 *   {
 *     id: '1',
 *     src: '/images/recipe1.jpg',
 *     alt: 'Delicious pasta dish',
 *     caption: 'Fresh pasta with tomato sauce',
 *   },
 * ];
 *
 * <ImageGallery
 *   images={images}
 *   variant="grid-3"
 *   aspectRatio="square"
 *   showLightbox
 *   showCaptions
 * />
 * ```
 */
const ImageGallery = React.forwardRef<HTMLDivElement, ImageGalleryProps>(
  (
    {
      images,
      variant = 'grid-3',
      aspectRatio = 'auto',
      size = 'md',
      spacing = 'normal',
      showLightbox = true,
      showCaptions = true,
      lazyLoad = true,
      onImageClick,
      onImageLoad,
      onImageError,
      className,
      testId,
      ...props
    },
    ref
  ) => {
    const [lightboxOpen, setLightboxOpen] = React.useState(false);
    const [currentIndex, setCurrentIndex] = React.useState(0);

    const handleImageClick = React.useCallback(
      (image: ImageItem, index: number) => {
        if (onImageClick) {
          onImageClick(image, index);
        }

        if (showLightbox) {
          setCurrentIndex(index);
          setLightboxOpen(true);
        }
      },
      [onImageClick, showLightbox]
    );

    const handleLightboxClose = React.useCallback(() => {
      setLightboxOpen(false);
    }, []);

    const handleLightboxNext = React.useCallback(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, [images.length]);

    const handleLightboxPrevious = React.useCallback(() => {
      setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    const handleIndexChange = React.useCallback((index: number) => {
      setCurrentIndex(index);
    }, []);

    if (!images.length) {
      return (
        <div
          ref={ref}
          className={cn('flex items-center justify-center p-8', className)}
          data-testid={testId ? `${testId}-empty` : undefined}
          {...props}
        >
          <div className="text-muted-foreground text-center">
            <svg
              className="mx-auto mb-4 h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p>No images to display</p>
          </div>
        </div>
      );
    }

    return (
      <>
        <GalleryGrid
          ref={ref}
          images={images}
          variant={variant}
          aspectRatio={aspectRatio}
          size={size}
          spacing={spacing}
          showCaptions={showCaptions}
          lazyLoad={lazyLoad}
          onImageClick={handleImageClick}
          onImageLoad={onImageLoad}
          onImageError={onImageError}
          className={className}
          testId={testId}
          {...props}
        />

        {showLightbox && (
          <Lightbox
            images={images}
            currentIndex={currentIndex}
            isOpen={lightboxOpen}
            onClose={handleLightboxClose}
            onNext={handleLightboxNext}
            onPrevious={handleLightboxPrevious}
            onIndexChange={handleIndexChange}
            showCaptions={showCaptions}
            testId={testId}
          />
        )}
      </>
    );
  }
);
ImageGallery.displayName = 'ImageGallery';

export { ImageGallery, GalleryGrid, GalleryImage, Lightbox, LightboxControls };

export type {
  ImageGalleryProps,
  ImageItem,
  LightboxProps,
  GalleryGridProps,
  GalleryImageProps,
  LightboxControlsProps,
};
