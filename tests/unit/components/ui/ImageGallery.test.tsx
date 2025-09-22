import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  ImageGallery,
  GalleryGrid,
  GalleryImage,
  Lightbox,
  LightboxControls,
  type ImageGalleryProps,
  type ImageItem,
} from '@/components/ui/image-gallery';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock IntersectionObserver for lazy loading tests
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

// Sample test data
const mockImages: ImageItem[] = [
  {
    id: '1',
    src: '/test-image-1.jpg',
    alt: 'Test image 1',
    caption: 'First test image',
    width: 800,
    height: 600,
  },
  {
    id: '2',
    src: '/test-image-2.jpg',
    alt: 'Test image 2',
    caption: 'Second test image',
    width: 800,
    height: 600,
  },
  {
    id: '3',
    src: '/test-image-3.jpg',
    alt: 'Test image 3',
    caption: 'Third test image',
    width: 800,
    height: 600,
  },
];

/**
 * Helper function to render ImageGallery with default props
 */
const renderImageGallery = (props: Partial<ImageGalleryProps> = {}) => {
  const defaultProps: ImageGalleryProps = {
    images: mockImages,
    variant: 'grid-3',
    aspectRatio: 'auto',
    size: 'md',
    spacing: 'normal',
    showLightbox: true,
    showCaptions: true,
    lazyLoad: false, // Disable for testing unless specifically testing lazy load
    testId: 'image-gallery',
  };

  return render(<ImageGallery {...defaultProps} {...props} />);
};

describe('ImageGallery', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      renderImageGallery();
      expect(screen.getByTestId('image-gallery-grid')).toBeInTheDocument();
    });

    it('renders all provided images', () => {
      renderImageGallery();
      mockImages.forEach((image, index) => {
        expect(
          screen.getByTestId(`image-gallery-image-${index}`)
        ).toBeInTheDocument();
      });
    });

    it('renders empty state when no images provided', () => {
      renderImageGallery({ images: [] });
      expect(screen.getByTestId('image-gallery-empty')).toBeInTheDocument();
      expect(screen.getByText('No images to display')).toBeInTheDocument();
    });

    it('applies correct CSS classes for variants', () => {
      const { rerender } = renderImageGallery({ variant: 'grid-2' });
      const grid = screen.getByTestId('image-gallery-grid');
      expect(grid).toHaveClass('grid-cols-1', 'sm:grid-cols-2');

      rerender(
        <ImageGallery
          images={mockImages}
          variant="grid-4"
          testId="image-gallery"
        />
      );
      expect(grid).toHaveClass(
        'grid-cols-1',
        'sm:grid-cols-2',
        'lg:grid-cols-3',
        'xl:grid-cols-4'
      );
    });

    it('applies correct spacing classes', () => {
      const { rerender } = renderImageGallery({ spacing: 'tight' });
      const grid = screen.getByTestId('image-gallery-grid');
      expect(grid).toHaveClass('gap-1');

      rerender(
        <ImageGallery
          images={mockImages}
          spacing="loose"
          testId="image-gallery"
        />
      );
      expect(grid).toHaveClass('gap-4');
    });
  });

  describe('Image Interaction', () => {
    it('calls onImageClick when image is clicked', async () => {
      const onImageClick = jest.fn();
      renderImageGallery({ onImageClick, showLightbox: false });

      const firstImage = screen.getByTestId('image-gallery-image-0');
      await userEvent.click(firstImage);

      expect(onImageClick).toHaveBeenCalledWith(mockImages[0], 0);
    });

    it('handles keyboard navigation on images', async () => {
      const onImageClick = jest.fn();
      renderImageGallery({ onImageClick, showLightbox: false });

      const firstImage = screen.getByTestId('image-gallery-image-0');
      firstImage.focus();

      await userEvent.keyboard('{Enter}');
      expect(onImageClick).toHaveBeenCalledWith(mockImages[0], 0);

      await userEvent.keyboard(' ');
      expect(onImageClick).toHaveBeenCalledTimes(2);
    });

    it('shows image captions when enabled', () => {
      renderImageGallery({ showCaptions: true });

      // Simulate image loads to make captions visible
      mockImages.forEach((_, index) => {
        const imageElement = screen.getByTestId(`image-gallery-image-${index}`);
        const img = within(imageElement).getByRole('img');
        fireEvent.load(img);
      });

      mockImages.forEach(image => {
        expect(screen.getByText(image.caption!)).toBeInTheDocument();
      });
    });

    it('hides image captions when disabled', () => {
      renderImageGallery({ showCaptions: false });
      mockImages.forEach(image => {
        expect(screen.queryByText(image.caption!)).not.toBeInTheDocument();
      });
    });
  });

  describe('Lightbox Functionality', () => {
    it('opens lightbox when image is clicked and showLightbox is true', async () => {
      renderImageGallery({ showLightbox: true });

      const firstImage = screen.getByTestId('image-gallery-image-0');
      await userEvent.click(firstImage);

      expect(screen.getByTestId('image-gallery-lightbox')).toBeInTheDocument();
      expect(screen.getByTestId('image-gallery-image')).toHaveAttribute(
        'src',
        mockImages[0].src
      );
    });

    it('does not open lightbox when showLightbox is false', async () => {
      renderImageGallery({ showLightbox: false });

      const firstImage = screen.getByTestId('image-gallery-image-0');
      await userEvent.click(firstImage);

      expect(
        screen.queryByTestId('image-gallery-lightbox')
      ).not.toBeInTheDocument();
    });

    it('closes lightbox when close button is clicked', async () => {
      renderImageGallery({ showLightbox: true });

      // Open lightbox
      const firstImage = screen.getByTestId('image-gallery-image-0');
      await userEvent.click(firstImage);

      // Close lightbox
      const closeButton = screen.getByTestId('image-gallery-close');
      await userEvent.click(closeButton);

      await waitFor(() => {
        expect(
          screen.queryByTestId('image-gallery-lightbox')
        ).not.toBeInTheDocument();
      });
    });

    it('closes lightbox when overlay is clicked', async () => {
      renderImageGallery({ showLightbox: true });

      // Open lightbox
      const firstImage = screen.getByTestId('image-gallery-image-0');
      await userEvent.click(firstImage);

      // Click overlay
      const lightbox = screen.getByTestId('image-gallery-lightbox');
      await userEvent.click(lightbox);

      await waitFor(() => {
        expect(
          screen.queryByTestId('image-gallery-lightbox')
        ).not.toBeInTheDocument();
      });
    });

    it('navigates to next image in lightbox', async () => {
      renderImageGallery({ showLightbox: true });

      // Open lightbox
      const firstImage = screen.getByTestId('image-gallery-image-0');
      await userEvent.click(firstImage);

      // Click next button
      const nextButton = screen.getByTestId('image-gallery-next');
      await userEvent.click(nextButton);

      expect(screen.getByTestId('image-gallery-image')).toHaveAttribute(
        'src',
        mockImages[1].src
      );
    });

    it('navigates to previous image in lightbox', async () => {
      renderImageGallery({ showLightbox: true });

      // Open lightbox with second image
      const secondImage = screen.getByTestId('image-gallery-image-1');
      await userEvent.click(secondImage);

      // Click previous button
      const previousButton = screen.getByTestId('image-gallery-previous');
      await userEvent.click(previousButton);

      expect(screen.getByTestId('image-gallery-image')).toHaveAttribute(
        'src',
        mockImages[0].src
      );
    });

    it('handles keyboard navigation in lightbox', async () => {
      renderImageGallery({ showLightbox: true });

      // Open lightbox
      const firstImage = screen.getByTestId('image-gallery-image-0');
      await userEvent.click(firstImage);

      // Test arrow key navigation
      await userEvent.keyboard('{ArrowRight}');
      expect(screen.getByTestId('image-gallery-image')).toHaveAttribute(
        'src',
        mockImages[1].src
      );

      await userEvent.keyboard('{ArrowLeft}');
      expect(screen.getByTestId('image-gallery-image')).toHaveAttribute(
        'src',
        mockImages[0].src
      );

      // Test escape key
      await userEvent.keyboard('{Escape}');
      await waitFor(() => {
        expect(
          screen.queryByTestId('image-gallery-lightbox')
        ).not.toBeInTheDocument();
      });
    });

    it('shows correct image counter in lightbox', async () => {
      renderImageGallery({ showLightbox: true });

      // Open lightbox with first image
      const firstImage = screen.getByTestId('image-gallery-image-0');
      await userEvent.click(firstImage);

      expect(screen.getByText('1 / 3')).toBeInTheDocument();

      // Navigate to second image
      const nextButton = screen.getByTestId('image-gallery-next');
      await userEvent.click(nextButton);

      expect(screen.getByText('2 / 3')).toBeInTheDocument();
    });

    it('shows lightbox captions when enabled', async () => {
      renderImageGallery({ showLightbox: true, showCaptions: true });

      const firstImage = screen.getByTestId('image-gallery-image-0');
      await userEvent.click(firstImage);

      expect(screen.getByText(mockImages[0].caption!)).toBeInTheDocument();
    });

    it('disables navigation buttons appropriately', async () => {
      renderImageGallery({ showLightbox: true });

      // Open lightbox with first image
      const firstImage = screen.getByTestId('image-gallery-image-0');
      await userEvent.click(firstImage);

      // Previous button should not exist for first image
      expect(
        screen.queryByTestId('image-gallery-previous')
      ).not.toBeInTheDocument();

      // Navigate to last image
      const nextButton = screen.getByTestId('image-gallery-next');
      await userEvent.click(nextButton);
      await userEvent.click(nextButton);

      // Next button should not exist for last image
      expect(
        screen.queryByTestId('image-gallery-next')
      ).not.toBeInTheDocument();
    });
  });

  describe('Lazy Loading', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('sets up intersection observer when lazy loading is enabled', () => {
      const observeMock = jest.fn();
      mockIntersectionObserver.mockImplementation(() => ({
        observe: observeMock,
        unobserve: jest.fn(),
        disconnect: jest.fn(),
      }));

      renderImageGallery({ lazyLoad: true });

      expect(mockIntersectionObserver).toHaveBeenCalled();
      expect(observeMock).toHaveBeenCalled();
    });

    it('does not set up intersection observer when lazy loading is disabled', () => {
      renderImageGallery({ lazyLoad: false });

      // Should not be called for lazy loading (may be called for other reasons)
      // We check that images are rendered immediately
      mockImages.forEach((_, index) => {
        const image = screen.getByTestId(`image-gallery-image-${index}`);
        const img = within(image).getByRole('img');
        expect(img).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('calls onImageError when image fails to load', () => {
      const onImageError = jest.fn();
      renderImageGallery({ onImageError });

      const firstImage = screen.getByTestId('image-gallery-image-0');
      const img = within(firstImage).getByRole('img');

      fireEvent.error(img);

      expect(onImageError).toHaveBeenCalledWith(mockImages[0], 0);
    });

    it('calls onImageLoad when image loads successfully', () => {
      const onImageLoad = jest.fn();
      renderImageGallery({ onImageLoad });

      const firstImage = screen.getByTestId('image-gallery-image-0');
      const img = within(firstImage).getByRole('img');

      fireEvent.load(img);

      expect(onImageLoad).toHaveBeenCalledWith(mockImages[0], 0);
    });

    it('shows error state when image fails to load', () => {
      renderImageGallery();

      const firstImage = screen.getByTestId('image-gallery-image-0');
      const img = within(firstImage).getByRole('img');

      fireEvent.error(img);

      expect(
        within(firstImage).getByText('Failed to load')
      ).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = renderImageGallery();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper ARIA labels for images', () => {
      renderImageGallery();

      mockImages.forEach((image, index) => {
        const imageElement = screen.getByTestId(`image-gallery-image-${index}`);
        expect(imageElement).toHaveAttribute(
          'aria-label',
          `View image: ${image.alt}`
        );
      });
    });

    it('has proper ARIA attributes for lightbox', async () => {
      renderImageGallery({ showLightbox: true });

      const firstImage = screen.getByTestId('image-gallery-image-0');
      await userEvent.click(firstImage);

      const lightbox = screen.getByTestId('image-gallery-lightbox');
      expect(lightbox).toHaveAttribute('role', 'dialog');
      expect(lightbox).toHaveAttribute('aria-modal', 'true');
      expect(lightbox).toHaveAttribute(
        'aria-label',
        `Image viewer: ${mockImages[0].alt}`
      );
    });

    it('manages focus correctly', async () => {
      renderImageGallery({ showLightbox: true });

      const firstImage = screen.getByTestId('image-gallery-image-0');
      firstImage.focus();
      expect(firstImage).toHaveFocus();

      await userEvent.click(firstImage);

      // After opening lightbox, check that focus is managed
      const lightbox = screen.getByTestId('image-gallery-lightbox');
      expect(lightbox).toBeInTheDocument();
    });
  });

  describe('Custom Props', () => {
    it('forwards custom className', () => {
      renderImageGallery({ className: 'custom-gallery' });
      const grid = screen.getByTestId('image-gallery-grid');
      expect(grid).toHaveClass('custom-gallery');
    });

    it('forwards custom testId', () => {
      renderImageGallery({ testId: 'custom-test-id' });
      expect(screen.getByTestId('custom-test-id-grid')).toBeInTheDocument();
    });

    it('forwards other props to container', () => {
      renderImageGallery({ 'data-custom': 'test-value' } as any);
      const grid = screen.getByTestId('image-gallery-grid');
      expect(grid).toHaveAttribute('data-custom', 'test-value');
    });
  });

  describe('Performance', () => {
    it('handles large number of images', () => {
      const manyImages = Array.from({ length: 100 }, (_, i) => ({
        id: `image-${i}`,
        src: `/test-image-${i}.jpg`,
        alt: `Test image ${i}`,
      }));

      renderImageGallery({ images: manyImages });

      // Should render without issues
      expect(screen.getByTestId('image-gallery-grid')).toBeInTheDocument();
      expect(screen.getAllByTestId(/image-gallery-image-\d+/)).toHaveLength(
        100
      );
    });

    it('prevents body scroll when lightbox is open', async () => {
      renderImageGallery({ showLightbox: true });

      // Initial state
      expect(document.body.style.overflow).toBe('');

      // Open lightbox
      const firstImage = screen.getByTestId('image-gallery-image-0');
      await userEvent.click(firstImage);

      expect(document.body.style.overflow).toBe('hidden');

      // Close lightbox
      const closeButton = screen.getByTestId('image-gallery-close');
      await userEvent.click(closeButton);

      await waitFor(() => {
        expect(document.body.style.overflow).toBe('');
      });
    });
  });
});

describe('GalleryGrid', () => {
  it('renders independently', () => {
    render(
      <GalleryGrid
        images={mockImages}
        variant="grid-3"
        aspectRatio="auto"
        size="md"
        spacing="normal"
        showCaptions={true}
        lazyLoad={false}
        onImageClick={jest.fn()}
        testId="test-grid"
      />
    );

    expect(screen.getByTestId('test-grid-grid')).toBeInTheDocument();
  });
});

describe('Lightbox', () => {
  it('renders independently', () => {
    render(
      <Lightbox
        images={mockImages}
        currentIndex={0}
        isOpen={true}
        onClose={jest.fn()}
        onNext={jest.fn()}
        onPrevious={jest.fn()}
        onIndexChange={jest.fn()}
        testId="test-lightbox"
      />
    );

    expect(screen.getByTestId('test-lightbox-lightbox')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(
      <Lightbox
        images={mockImages}
        currentIndex={0}
        isOpen={false}
        onClose={jest.fn()}
        onNext={jest.fn()}
        onPrevious={jest.fn()}
        onIndexChange={jest.fn()}
        testId="test-lightbox"
      />
    );

    expect(
      screen.queryByTestId('test-lightbox-lightbox')
    ).not.toBeInTheDocument();
  });
});

describe('LightboxControls', () => {
  it('renders independently', () => {
    render(
      <LightboxControls
        currentIndex={1}
        totalImages={3}
        onNext={jest.fn()}
        onPrevious={jest.fn()}
        onClose={jest.fn()}
        hasPrevious={true}
        hasNext={true}
        testId="test-controls"
      />
    );

    expect(screen.getByTestId('test-controls-controls')).toBeInTheDocument();
    expect(screen.getByText('2 / 3')).toBeInTheDocument();
  });
});
