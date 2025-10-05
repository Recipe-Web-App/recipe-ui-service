import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  Skeleton,
  SkeletonContainer,
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton,
  RecipeCardSkeleton,
  RecipeListSkeleton,
  RecipeDetailSkeleton,
  ProfileSkeleton,
  type SkeletonProps,
} from '@/components/ui/skeleton';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

/**
 * Helper function to render Skeleton with default props
 */
const renderSkeleton = (props: Partial<SkeletonProps> = {}) => {
  return render(<Skeleton {...props} />);
};

describe('Skeleton', () => {
  describe('Basic Rendering', () => {
    test('renders skeleton element', () => {
      renderSkeleton();
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    test('renders with default classes', () => {
      renderSkeleton();
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('relative', 'overflow-hidden', 'bg-muted');
    });

    test('includes screen reader text', () => {
      renderSkeleton();
      expect(screen.getByText('Loading...')).toHaveClass('sr-only');
    });

    test('renders with custom aria-label', () => {
      renderSkeleton({ 'aria-label': 'Loading content...' });
      expect(screen.getByRole('status')).toHaveAttribute(
        'aria-label',
        'Loading content...'
      );
      expect(screen.getByText('Loading content...')).toHaveClass('sr-only');
    });

    test('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Skeleton ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Variants', () => {
    test('renders default variant', () => {
      renderSkeleton({ variant: 'default' });
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('bg-muted');
    });

    test('renders text variant', () => {
      renderSkeleton({ variant: 'text' });
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('h-4', 'bg-muted');
    });

    test('renders circular variant', () => {
      renderSkeleton({ variant: 'circular' });
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('rounded-full', 'bg-muted');
    });

    test('renders card variant', () => {
      renderSkeleton({ variant: 'card' });
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('rounded-lg', 'bg-muted');
    });

    test('renders image variant', () => {
      renderSkeleton({ variant: 'image' });
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('aspect-square', 'bg-muted');
    });

    test('renders button variant', () => {
      renderSkeleton({ variant: 'button' });
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('h-10', 'px-4', 'rounded-md', 'bg-muted');
    });

    test('circle prop overrides variant to circular', () => {
      renderSkeleton({ variant: 'default', circle: true });
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('rounded-full');
    });
  });

  describe('Sizes', () => {
    test('renders small size', () => {
      renderSkeleton({ variant: 'text', size: 'sm' });
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('h-3');
    });

    test('renders default size', () => {
      renderSkeleton({ variant: 'text', size: 'default' });
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('h-4');
    });

    test('renders large size', () => {
      renderSkeleton({ variant: 'text', size: 'lg' });
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('h-6');
    });

    test('renders full width', () => {
      renderSkeleton({ size: 'full' });
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('w-full');
    });
  });

  describe('Animation', () => {
    test('renders with pulse animation by default', () => {
      renderSkeleton();
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('animate-skeleton-pulse');
    });

    test('renders with wave animation', () => {
      renderSkeleton({ animation: 'wave' });
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('animate-skeleton-wave');
    });

    test('renders with no animation', () => {
      renderSkeleton({ animation: 'none' });
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('animate-none');
    });
  });

  describe('Custom Dimensions', () => {
    test('applies custom width as number', () => {
      renderSkeleton({ width: 200 });
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveStyle({ width: '200px' });
    });

    test('applies custom width as string', () => {
      renderSkeleton({ width: '50%' });
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveStyle({ width: '50%' });
    });

    test('applies custom height as number', () => {
      renderSkeleton({ height: 100 });
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveStyle({ height: '100px' });
    });

    test('applies custom height as string', () => {
      renderSkeleton({ height: '2rem' });
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveStyle({ height: '2rem' });
    });

    test('applies both width and height', () => {
      renderSkeleton({ width: 300, height: 50 });
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveStyle({ width: '300px', height: '50px' });
    });
  });

  describe('Multiple Skeletons (count)', () => {
    test('renders single skeleton by default', () => {
      renderSkeleton();
      const skeletons = screen.getAllByRole('status');
      expect(skeletons).toHaveLength(1);
    });

    test('renders multiple skeletons with count', () => {
      renderSkeleton({ count: 3 });
      const container = screen.getByRole('status');
      const skeletons = container.querySelectorAll('[aria-hidden="true"]');
      expect(skeletons).toHaveLength(3);
    });

    test('last skeleton has reduced width', () => {
      renderSkeleton({ count: 3 });
      const container = screen.getByRole('status');
      const skeletons = container.querySelectorAll('[aria-hidden="true"]');
      expect(skeletons[2].className).toContain('[width:80%]');
    });

    test('maintains aria-label for multiple skeletons', () => {
      renderSkeleton({ count: 3, 'aria-label': 'Loading items...' });
      expect(screen.getByRole('status')).toHaveAttribute(
        'aria-label',
        'Loading items...'
      );
    });
  });

  describe('Rounded Corners', () => {
    test('applies no rounded corners', () => {
      renderSkeleton({ rounded: 'none' });
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('rounded-none');
    });

    test('applies small rounded corners', () => {
      renderSkeleton({ rounded: 'sm' });
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('rounded-sm');
    });

    test('applies default rounded corners', () => {
      renderSkeleton({ rounded: 'default' });
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('rounded-md');
    });

    test('applies large rounded corners', () => {
      renderSkeleton({ rounded: 'lg' });
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('rounded-lg');
    });

    test('applies full rounded corners', () => {
      renderSkeleton({ rounded: 'full' });
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('rounded-full');
    });
  });

  describe('Intensity', () => {
    test('applies light intensity', () => {
      renderSkeleton({ intensity: 'light' });
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('opacity-50');
    });

    test('applies default intensity', () => {
      renderSkeleton({ intensity: 'default' });
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('opacity-100');
    });

    test('applies strong intensity', () => {
      renderSkeleton({ intensity: 'strong' });
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('opacity-100', 'dark:opacity-90');
    });
  });

  describe('Custom Props', () => {
    test('applies custom className', () => {
      renderSkeleton({ className: 'custom-class' });
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('custom-class');
    });

    test('passes through HTML attributes', () => {
      render(<Skeleton data-testid="skeleton-test" />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveAttribute('data-testid', 'skeleton-test');
    });
  });

  describe('Accessibility', () => {
    test('has no accessibility violations', async () => {
      const { container } = renderSkeleton();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('includes role="status"', () => {
      renderSkeleton();
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    test('includes screen reader only text', () => {
      renderSkeleton();
      const srText = screen.getByText('Loading...');
      expect(srText).toHaveClass('sr-only');
    });

    test('respects custom aria-label', () => {
      renderSkeleton({ 'aria-label': 'Custom loading message' });
      expect(screen.getByRole('status')).toHaveAttribute(
        'aria-label',
        'Custom loading message'
      );
      expect(screen.getByText('Custom loading message')).toBeInTheDocument();
    });
  });
});

describe('SkeletonContainer', () => {
  test('renders children', () => {
    render(
      <SkeletonContainer>
        <div>Child 1</div>
        <div>Child 2</div>
      </SkeletonContainer>
    );
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });

  test('applies default spacing', () => {
    const { container } = render(
      <SkeletonContainer>
        <div>Test</div>
      </SkeletonContainer>
    );
    expect(container.firstChild).toHaveClass('space-y-3');
  });

  test('applies tight spacing', () => {
    const { container } = render(
      <SkeletonContainer spacing="tight">
        <div>Test</div>
      </SkeletonContainer>
    );
    expect(container.firstChild).toHaveClass('space-y-1');
  });

  test('applies loose spacing', () => {
    const { container } = render(
      <SkeletonContainer spacing="loose">
        <div>Test</div>
      </SkeletonContainer>
    );
    expect(container.firstChild).toHaveClass('space-y-4');
  });

  test('applies horizontal direction', () => {
    const { container } = render(
      <SkeletonContainer direction="horizontal">
        <div>Test</div>
      </SkeletonContainer>
    );
    expect(container.firstChild).toHaveClass(
      'flex',
      'flex-row',
      'space-x-3',
      'space-y-0'
    );
  });

  test('applies custom className', () => {
    const { container } = render(
      <SkeletonContainer className="custom-container">
        <div>Test</div>
      </SkeletonContainer>
    );
    expect(container.firstChild).toHaveClass('custom-container');
  });
});

describe('SkeletonText', () => {
  test('renders three lines by default', () => {
    render(<SkeletonText />);
    const skeletons = screen.getAllByRole('status');
    expect(skeletons).toHaveLength(3);
  });

  test('renders single line', () => {
    render(<SkeletonText lines="single" />);
    const skeletons = screen.getAllByRole('status');
    expect(skeletons).toHaveLength(1);
  });

  test('renders two lines', () => {
    render(<SkeletonText lines="two" />);
    const skeletons = screen.getAllByRole('status');
    expect(skeletons).toHaveLength(2);
  });

  test('renders paragraph (5 lines)', () => {
    render(<SkeletonText lines="paragraph" />);
    const skeletons = screen.getAllByRole('status');
    expect(skeletons).toHaveLength(5);
  });

  test('renders custom line count', () => {
    render(<SkeletonText lineCount={7} />);
    const skeletons = screen.getAllByRole('status');
    expect(skeletons).toHaveLength(7);
  });

  test('applies varied widths to lines', () => {
    render(<SkeletonText lines="three" />);
    const skeletons = screen.getAllByRole('status');
    expect(skeletons[0].className).toContain('[width:100%]');
    expect(skeletons[1].className).toContain('[width:100%]');
    expect(skeletons[2].className).toContain('[width:80%]');
  });

  test('applies custom animation', () => {
    render(<SkeletonText animation="wave" />);
    const skeletons = screen.getAllByRole('status');
    skeletons.forEach(skeleton => {
      expect(skeleton).toHaveClass('animate-skeleton-wave');
    });
  });
});

describe('SkeletonAvatar', () => {
  test('renders circular skeleton', () => {
    render(<SkeletonAvatar />);
    const avatar = screen.getByRole('status');
    expect(avatar).toHaveClass('rounded-full');
  });

  test('renders with default size', () => {
    render(<SkeletonAvatar />);
    const avatar = screen.getByRole('status');
    expect(avatar).toHaveClass('h-10', 'w-10');
  });

  test('renders with xs size', () => {
    render(<SkeletonAvatar size="xs" />);
    const avatar = screen.getByRole('status');
    expect(avatar).toHaveClass('h-6', 'w-6');
  });

  test('renders with sm size', () => {
    render(<SkeletonAvatar size="sm" />);
    const avatar = screen.getByRole('status');
    expect(avatar).toHaveClass('h-8', 'w-8');
  });

  test('renders with lg size', () => {
    render(<SkeletonAvatar size="lg" />);
    const avatar = screen.getByRole('status');
    expect(avatar).toHaveClass('h-12', 'w-12');
  });

  test('renders with xl size', () => {
    render(<SkeletonAvatar size="xl" />);
    const avatar = screen.getByRole('status');
    expect(avatar).toHaveClass('h-16', 'w-16');
  });

  test('includes avatar-specific aria-label', () => {
    render(<SkeletonAvatar />);
    expect(screen.getByRole('status')).toHaveAttribute(
      'aria-label',
      'Loading avatar...'
    );
  });

  test('applies custom animation', () => {
    render(<SkeletonAvatar animation="none" />);
    const avatar = screen.getByRole('status');
    expect(avatar).toHaveClass('animate-none');
  });
});

describe('SkeletonButton', () => {
  test('renders button skeleton', () => {
    render(<SkeletonButton />);
    const button = screen.getByRole('status');
    expect(button).toHaveClass('h-10', 'px-4', 'rounded-md');
  });

  test('renders small size', () => {
    render(<SkeletonButton size="sm" />);
    const button = screen.getByRole('status');
    expect(button).toHaveClass('h-8', 'px-3');
  });

  test('renders large size', () => {
    render(<SkeletonButton size="lg" />);
    const button = screen.getByRole('status');
    expect(button).toHaveClass('h-12', 'px-6');
  });

  test('applies custom className', () => {
    render(<SkeletonButton className="custom-button" />);
    const button = screen.getByRole('status');
    expect(button).toHaveClass('custom-button');
  });
});

describe('RecipeCardSkeleton', () => {
  test('renders recipe card structure', () => {
    const { container } = render(<RecipeCardSkeleton />);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass(
      'rounded-lg',
      'border',
      'bg-card',
      'p-4',
      'space-y-3'
    );
  });

  test('includes image placeholder', () => {
    render(<RecipeCardSkeleton />);
    const skeletons = screen.getAllByRole('status');
    const imageSkeleton = skeletons.find(s => s.classList.contains('h-48'));
    expect(imageSkeleton).toBeInTheDocument();
  });

  test('includes title skeleton', () => {
    render(<RecipeCardSkeleton />);
    const skeletons = screen.getAllByRole('status');
    const titleSkeleton = skeletons.find(s => s.classList.contains('h-6'));
    expect(titleSkeleton).toBeInTheDocument();
  });

  test('includes text lines', () => {
    render(<RecipeCardSkeleton />);
    const skeletons = screen.getAllByRole('status');
    // Should have image, title, 2 text lines, and 3 meta info items
    expect(skeletons.length).toBeGreaterThanOrEqual(7);
  });
});

describe('RecipeListSkeleton', () => {
  test('renders default 3 items', () => {
    const { container } = render(<RecipeListSkeleton />);
    const items = container.querySelectorAll(
      '.flex.gap-4.p-4.border.rounded-lg'
    );
    expect(items).toHaveLength(3);
  });

  test('renders custom count', () => {
    const { container } = render(<RecipeListSkeleton count={5} />);
    const items = container.querySelectorAll(
      '.flex.gap-4.p-4.border.rounded-lg'
    );
    expect(items).toHaveLength(5);
  });

  test('each item has thumbnail and content', () => {
    const { container } = render(<RecipeListSkeleton count={1} />);
    const item = container.querySelector('.flex.gap-4.p-4.border.rounded-lg');
    expect(item).toBeInTheDocument();

    // Check for thumbnail
    const thumbnail = item?.querySelector('.h-24.w-24');
    expect(thumbnail).toBeInTheDocument();

    // Check for content area
    const content = item?.querySelector('.flex-1.space-y-2');
    expect(content).toBeInTheDocument();
  });
});

describe('RecipeDetailSkeleton', () => {
  test('renders full recipe detail structure', () => {
    const { container } = render(<RecipeDetailSkeleton />);
    const detail = container.firstChild as HTMLElement;
    expect(detail).toHaveClass('space-y-6');
  });

  test('includes hero image skeleton', () => {
    render(<RecipeDetailSkeleton />);
    const skeletons = screen.getAllByRole('status');
    const heroSkeleton = skeletons.find(
      s => s.classList.contains('h-64') || s.classList.contains('md:h-96')
    );
    expect(heroSkeleton).toBeInTheDocument();
  });

  test('includes ingredients section', () => {
    const { container } = render(<RecipeDetailSkeleton />);
    const circularSkeletons = container.querySelectorAll(
      '.h-6.w-6.rounded-full'
    );
    expect(circularSkeletons.length).toBeGreaterThan(0);
  });

  test('includes instructions section', () => {
    render(<RecipeDetailSkeleton />);
    const skeletons = screen.getAllByRole('status');
    // Should have multiple sections with various skeletons
    expect(skeletons.length).toBeGreaterThan(10);
  });
});

describe('ProfileSkeleton', () => {
  test('renders profile structure', () => {
    const { container } = render(<ProfileSkeleton />);
    const profile = container.firstChild as HTMLElement;
    expect(profile).toHaveClass('flex', 'items-center', 'gap-3');
  });

  test('includes avatar skeleton', () => {
    render(<ProfileSkeleton />);
    const avatar = screen.getByLabelText('Loading avatar...');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveClass('h-12', 'w-12', 'rounded-full');
  });

  test('includes text skeletons for user info', () => {
    render(<ProfileSkeleton />);
    const skeletons = screen.getAllByRole('status');
    // Should have avatar + 2 text lines
    expect(skeletons).toHaveLength(3);
  });

  test('applies custom className', () => {
    const { container } = render(
      <ProfileSkeleton className="custom-profile" />
    );
    const profile = container.firstChild as HTMLElement;
    expect(profile).toHaveClass('custom-profile');
  });
});
