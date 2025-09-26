import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { GlobalNav } from '@/components/layout/global-nav';
import { useAuthStore } from '@/stores/auth-store';
import { useLayoutStore } from '@/stores/ui/layout-store';

// Mock Next.js hooks
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock stores
jest.mock('@/stores/auth-store');
jest.mock('@/stores/ui/layout-store');

// Mock UI components
jest.mock('@/components/ui/badge', () => ({
  Badge: ({
    children,
    variant,
  }: {
    children: React.ReactNode;
    variant?: string;
  }) => (
    <span data-testid="badge" data-variant={variant}>
      {children}
    </span>
  ),
}));

jest.mock('@/components/ui/tooltip', () => ({
  SimpleTooltip: ({
    children,
    content,
  }: {
    children: React.ReactNode;
    content: string;
  }) => (
    <div data-testid="tooltip" data-content={content}>
      {children}
    </div>
  ),
}));

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;
const mockUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof useAuthStore
>;
const mockUseLayoutStore = useLayoutStore as jest.MockedFunction<
  typeof useLayoutStore
>;

describe('GlobalNav', () => {
  const mockAuthStore = {
    isAuthenticated: false,
  };

  const mockLayoutStore = {
    breakpoint: 'desktop' as const,
  };

  beforeEach(() => {
    mockUsePathname.mockReturnValue('/');
    mockUseAuthStore.mockReturnValue(mockAuthStore);
    mockUseLayoutStore.mockReturnValue(mockLayoutStore);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders navigation items', () => {
    render(<GlobalNav />);

    // Should render non-auth navigation items from topLevelNavigation
    // (when isAuthenticated: false from mock)
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Recipes')).toBeInTheDocument();
    expect(screen.getByText('Meal Plans')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();

    // Favorites requires auth, should not be visible when not authenticated
    expect(screen.queryByText('Favorites')).not.toBeInTheDocument();
  });

  it('highlights active navigation item', () => {
    mockUsePathname.mockReturnValue('/recipes');

    render(<GlobalNav />);

    const recipesLink = screen.getByText('Recipes').closest('a');
    expect(recipesLink).toHaveClass('bg-accent', 'text-accent-foreground');
    expect(recipesLink).toHaveAttribute('aria-current', 'page');
  });

  it('filters items based on authentication status', () => {
    // First render when not authenticated
    render(<GlobalNav />);

    // Favorites requires auth, should not be visible
    expect(screen.queryByText('Favorites')).not.toBeInTheDocument();

    // Re-render when authenticated
    mockUseAuthStore.mockReturnValue({
      ...mockAuthStore,
      isAuthenticated: true,
    });

    const { rerender } = render(<GlobalNav />);
    rerender(<GlobalNav />);

    // Now favorites should be visible
    expect(screen.getByText('Favorites')).toBeInTheDocument();
  });

  it('renders badges when showBadges is true', () => {
    // Mock NODE_ENV to development to make components-demo visible with its badge
    const originalEnv = process.env.NODE_ENV;
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'development',
      configurable: true,
    });

    try {
      render(<GlobalNav showBadges />);

      // Should render badges for items that have them (components-demo has "Dev" badge)
      const badges = screen.queryAllByTestId('badge');
      expect(badges.length).toBeGreaterThan(0);

      // Check that the specific badge is rendered
      const devBadge = screen.getByText('Dev');
      expect(devBadge).toBeInTheDocument();
    } finally {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: originalEnv,
        configurable: true,
      });
    }
  });

  it('does not render badges when showBadges is false', () => {
    render(<GlobalNav showBadges={false} />);

    const badges = screen.queryAllByTestId('badge');
    expect(badges).toHaveLength(0);
  });

  it('renders icons when showIcons is true', () => {
    const { container } = render(<GlobalNav showIcons />);

    // Check for presence of icon elements (SVG elements)
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('limits the number of items when maxItems is set', () => {
    render(<GlobalNav maxItems={2} />);

    const menuItems = screen.getAllByRole('menuitem');
    expect(menuItems.length).toBeLessThanOrEqual(2);
  });

  it('handles external links correctly', () => {
    const { container } = render(<GlobalNav />);

    // Look for external link indicators
    const externalLinks = container.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach((link: Element) => {
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('renders tooltips for items with tooltip metadata', () => {
    mockUseLayoutStore.mockReturnValue({
      ...mockLayoutStore,
      breakpoint: 'desktop', // Tooltips only on desktop
    });

    render(<GlobalNav />);

    const tooltips = screen.queryAllByTestId('tooltip');
    // Should have tooltips for items with tooltip metadata
    expect(tooltips.length).toBeGreaterThan(0);
  });

  it('does not render tooltips on mobile', () => {
    mockUseLayoutStore.mockReturnValue({
      ...mockLayoutStore,
      breakpoint: 'mobile',
    });

    render(<GlobalNav />);

    const tooltips = screen.queryAllByTestId('tooltip');
    expect(tooltips).toHaveLength(0);
  });

  it('applies proper accessibility attributes', () => {
    render(<GlobalNav />);

    const nav = screen.getByRole('menubar');
    expect(nav).toHaveAttribute('aria-label', 'Main navigation');

    const menuItems = screen.getAllByRole('menuitem');
    menuItems.forEach(item => {
      expect(item).toBeInTheDocument();
    });
  });

  it('handles disabled items correctly', () => {
    const { container } = render(<GlobalNav />);

    // Look for disabled items and check their attributes
    const disabledItems = container.querySelectorAll('.pointer-events-none');
    disabledItems.forEach((item: Element) => {
      expect(item).toHaveClass('opacity-50');
      expect(item).toHaveAttribute('tabIndex', '-1');
    });
  });

  it('applies custom className', () => {
    render(<GlobalNav className="custom-nav-class" />);

    const nav = screen.getByRole('menubar');
    expect(nav).toHaveClass('custom-nav-class');
  });

  it('forwards ref correctly', () => {
    const ref = jest.fn();
    render(<GlobalNav ref={ref} />);

    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  describe('navigation item states', () => {
    it('applies hover styles', () => {
      render(<GlobalNav />);

      const links = screen.getAllByRole('menuitem');
      links.forEach(link => {
        expect(link).toHaveClass(
          'hover:bg-accent',
          'hover:text-accent-foreground'
        );
      });
    });

    it('applies focus styles', () => {
      render(<GlobalNav />);

      const links = screen.getAllByRole('menuitem');
      links.forEach(link => {
        expect(link).toHaveClass(
          'focus-visible:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-ring'
        );
      });
    });

    it('applies transition styles', () => {
      render(<GlobalNav />);

      const links = screen.getAllByRole('menuitem');
      links.forEach(link => {
        expect(link).toHaveClass('transition-all', 'duration-200');
      });
    });
  });

  describe('responsive behavior', () => {
    it('adjusts spacing based on screen size', () => {
      render(<GlobalNav />);

      const nav = screen.getByRole('menubar');
      expect(nav).toHaveClass('space-x-1', 'md:space-x-2');
    });
  });
});
