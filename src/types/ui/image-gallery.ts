// ImageGallery Types
export type ImageGalleryVariant = 'grid-2' | 'grid-3' | 'grid-4' | 'masonry';
export type ImageGalleryAspectRatio =
  | 'square'
  | 'landscape'
  | 'portrait'
  | 'auto';
export type ImageGallerySize = 'sm' | 'md' | 'lg' | 'xl';
export type ImageGallerySpacing = 'tight' | 'normal' | 'loose';

export interface ImageItem {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  placeholder?: string;
  thumbnailSrc?: string;
}

export interface ImageGalleryProps {
  images: ImageItem[];
  variant?: ImageGalleryVariant;
  aspectRatio?: ImageGalleryAspectRatio;
  size?: ImageGallerySize;
  spacing?: ImageGallerySpacing;
  showLightbox?: boolean;
  showCaptions?: boolean;
  lazyLoad?: boolean;
  onImageClick?: (image: ImageItem, index: number) => void;
  onImageLoad?: (image: ImageItem, index: number) => void;
  onImageError?: (image: ImageItem, index: number) => void;
  className?: string;
  testId?: string;
}

export interface LightboxProps {
  images: ImageItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onIndexChange: (index: number) => void;
  showCaptions?: boolean;
  className?: string;
  testId?: string;
}

export interface GalleryGridProps {
  images: ImageItem[];
  variant: ImageGalleryVariant;
  aspectRatio: ImageGalleryAspectRatio;
  size: ImageGallerySize;
  spacing: ImageGallerySpacing;
  showCaptions: boolean;
  lazyLoad: boolean;
  onImageClick: (image: ImageItem, index: number) => void;
  onImageLoad?: (image: ImageItem, index: number) => void;
  onImageError?: (image: ImageItem, index: number) => void;
  className?: string;
  testId?: string;
}

export interface GalleryImageProps {
  image: ImageItem;
  index: number;
  aspectRatio: ImageGalleryAspectRatio;
  size: ImageGallerySize;
  showCaption: boolean;
  lazyLoad: boolean;
  onClick: (image: ImageItem, index: number) => void;
  onLoad?: (image: ImageItem, index: number) => void;
  onError?: (image: ImageItem, index: number) => void;
  className?: string;
  testId?: string;
}

export interface LightboxControlsProps {
  currentIndex: number;
  totalImages: number;
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  className?: string;
  testId?: string;
}

export interface ImageGalleryState {
  lightboxOpen: boolean;
  currentImageIndex: number;
  loadedImages: Set<string>;
  failedImages: Set<string>;
}

// Store interface for image gallery state management
export interface ImageGalleryStoreState extends ImageGalleryState {
  // Lightbox actions
  openLightbox: (index: number) => void;
  closeLightbox: () => void;
  nextImage: () => void;
  previousImage: () => void;
  setCurrentIndex: (index: number) => void;

  // Image loading state
  markImageLoaded: (imageId: string) => void;
  markImageFailed: (imageId: string) => void;
  isImageLoaded: (imageId: string) => boolean;
  isImageFailed: (imageId: string) => boolean;

  // Utility methods
  hasNext: (totalImages: number) => boolean;
  hasPrevious: () => boolean;
  reset: () => void;
}
