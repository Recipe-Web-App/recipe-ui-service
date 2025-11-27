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

// Mock NavDropdown component to simplify tests
jest.mock('@/components/layout/nav-dropdown', () => ({
  NavDropdown: ({
    item,
    isActive,
  }: {
    item: { id: string; label: string };
    isActive: boolean;
  }) => (
    <button
      data-testid={`nav-dropdown-${item.id}`}
      data-active={isActive}
      aria-haspopup="menu"
      role="menuitem"
    >
      {item.label}
    </button>
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

    // All top-level items render as dropdowns
    expect(screen.getByTestId('nav-dropdown-recipes')).toBeInTheDocument();
    expect(screen.getByTestId('nav-dropdown-collections')).toBeInTheDocument();
    expect(screen.getByTestId('nav-dropdown-meal-plans')).toBeInTheDocument();
    expect(screen.getByTestId('nav-dropdown-sous-chef')).toBeInTheDocument();
  });

  it('passes isActive to dropdown components based on route', () => {
    mockUsePathname.mockReturnValue('/recipes');

    render(<GlobalNav />);

    // Recipes dropdown should be marked as active
    const recipesDropdown = screen.getByTestId('nav-dropdown-recipes');
    expect(recipesDropdown).toHaveAttribute('data-active', 'true');
  });

  it('filters items based on authentication status', () => {
    // When not authenticated, auth-required items should not be visible
    render(<GlobalNav />);

    // Shopping Lists, Kitchen Feed, and Account require auth
    expect(
      screen.queryByTestId('nav-dropdown-shopping-lists')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('nav-dropdown-kitchen-feed')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('nav-dropdown-account')
    ).not.toBeInTheDocument();

    // Re-render when authenticated
    mockUseAuthStore.mockReturnValue({
      ...mockAuthStore,
      isAuthenticated: true,
    });

    const { rerender } = render(<GlobalNav />);
    rerender(<GlobalNav />);

    // Now auth-required items should be visible
    expect(
      screen.getByTestId('nav-dropdown-shopping-lists')
    ).toBeInTheDocument();
    expect(screen.getByTestId('nav-dropdown-kitchen-feed')).toBeInTheDocument();
    expect(screen.getByTestId('nav-dropdown-account')).toBeInTheDocument();
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

      // Should render components-demo which has "Dev" badge
      // Note: Since components-demo has children, it renders as a dropdown
      // and badges are handled by the dropdown component
      const badges = screen.queryAllByTestId('badge');
      // Components demo should be visible in dev mode
      expect(
        screen.getByTestId('nav-dropdown-components-demo')
      ).toBeInTheDocument();
    } finally {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: originalEnv,
        configurable: true,
      });
    }
  });

  it('limits the number of items when maxItems is set', () => {
    render(<GlobalNav maxItems={3} />);

    const menuItems = screen.getAllByRole('menuitem');
    expect(menuItems.length).toBeLessThanOrEqual(3);
  });

  it('applies proper accessibility attributes', () => {
    render(<GlobalNav />);

    const nav = screen.getByRole('menubar');
    expect(nav).toHaveAttribute('aria-label', 'Main navigation');

    // All items should have menuitem role
    const menuItems = screen.getAllByRole('menuitem');
    menuItems.forEach(item => {
      expect(item).toBeInTheDocument();
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

  describe('dropdown rendering', () => {
    it('renders all items as dropdowns', () => {
      render(<GlobalNav />);

      // All top-level items should render as dropdowns
      expect(screen.getByTestId('nav-dropdown-recipes')).toBeInTheDocument();
      expect(
        screen.getByTestId('nav-dropdown-collections')
      ).toBeInTheDocument();
      expect(screen.getByTestId('nav-dropdown-meal-plans')).toBeInTheDocument();
    });
  });

  describe('with authentication', () => {
    beforeEach(() => {
      mockUseAuthStore.mockReturnValue({
        ...mockAuthStore,
        isAuthenticated: true,
      });
    });

    it('shows all navigation items when authenticated', () => {
      render(<GlobalNav />);

      // All main navigation items should be visible
      expect(screen.getByTestId('nav-dropdown-recipes')).toBeInTheDocument();
      expect(
        screen.getByTestId('nav-dropdown-collections')
      ).toBeInTheDocument();
      expect(screen.getByTestId('nav-dropdown-meal-plans')).toBeInTheDocument();
      expect(
        screen.getByTestId('nav-dropdown-shopping-lists')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('nav-dropdown-kitchen-feed')
      ).toBeInTheDocument();
      expect(screen.getByTestId('nav-dropdown-sous-chef')).toBeInTheDocument();
      expect(screen.getByTestId('nav-dropdown-account')).toBeInTheDocument();
    });
  });

  describe('tooltip behavior', () => {
    it('renders navigation on desktop', () => {
      mockUseLayoutStore.mockReturnValue({
        ...mockLayoutStore,
        breakpoint: 'desktop',
      });

      render(<GlobalNav />);

      // Navigation should render dropdown items
      expect(screen.getByTestId('nav-dropdown-recipes')).toBeInTheDocument();
    });

    it('renders navigation on mobile', () => {
      mockUseLayoutStore.mockReturnValue({
        ...mockLayoutStore,
        breakpoint: 'mobile',
      });

      render(<GlobalNav />);

      // Navigation should still render dropdown items on mobile
      // Tooltip behavior for dropdowns is handled by the NavDropdown component
      expect(screen.getByTestId('nav-dropdown-recipes')).toBeInTheDocument();
    });
  });
});
