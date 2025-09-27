import { render, screen } from '@testing-library/react';
import { TopNav } from '@/components/layout/top-nav';
import { useLayoutStore } from '@/stores/ui/layout-store';

// Mock the layout store
jest.mock('@/stores/ui/layout-store');
const mockUseLayoutStore = useLayoutStore as jest.MockedFunction<
  typeof useLayoutStore
>;

// Mock child components
jest.mock('@/components/layout/global-nav', () => ({
  GlobalNav: () => <div data-testid="global-nav">GlobalNav</div>,
}));

jest.mock('@/components/layout/search-bar', () => ({
  SearchBar: ({ compact }: { compact?: boolean }) => (
    <div data-testid="search-bar" data-compact={compact}>
      SearchBar
    </div>
  ),
}));

jest.mock('@/components/layout/theme-toggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">ThemeToggle</div>,
}));

jest.mock('@/components/layout/user-menu', () => ({
  UserMenu: ({ compact }: { compact?: boolean }) => (
    <div data-testid="user-menu" data-compact={compact}>
      UserMenu
    </div>
  ),
}));

jest.mock('@/components/layout/mobile-menu-button', () => ({
  MobileMenuButton: () => (
    <div data-testid="mobile-menu-button">MobileMenuButton</div>
  ),
}));

jest.mock('@/components/layout/mobile-nav-drawer', () => ({
  MobileNavDrawer: () => (
    <div data-testid="mobile-nav-drawer">MobileNavDrawer</div>
  ),
}));

describe('TopNav', () => {
  const mockLayoutStore = {
    breakpoint: 'desktop' as const,
  };

  beforeEach(() => {
    mockUseLayoutStore.mockReturnValue(mockLayoutStore);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the logo and brand name', () => {
    render(<TopNav />);

    const logoLink = screen.getByRole('link', { name: /recipe app home/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '/');

    expect(screen.getByText('Recipe App')).toBeInTheDocument();
  });

  it('renders desktop layout by default', () => {
    render(<TopNav />);

    expect(screen.getByTestId('global-nav')).toBeInTheDocument();
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('user-menu')).toBeInTheDocument();
    expect(screen.queryByTestId('mobile-menu-button')).not.toBeInTheDocument();
  });

  it('renders tablet layout correctly', () => {
    mockUseLayoutStore.mockReturnValue({
      ...mockLayoutStore,
      breakpoint: 'tablet',
    });

    render(<TopNav />);

    expect(screen.getByTestId('global-nav')).toBeInTheDocument();
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('user-menu')).toBeInTheDocument();

    // Check if search bar is compact for tablet
    const searchBar = screen.getByTestId('search-bar');
    expect(searchBar).toHaveAttribute('data-compact', 'true');
  });

  it('renders mobile layout correctly', () => {
    mockUseLayoutStore.mockReturnValue({
      ...mockLayoutStore,
      breakpoint: 'mobile',
    });

    render(<TopNav />);

    expect(screen.queryByTestId('global-nav')).not.toBeInTheDocument();
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('user-menu')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-menu-button')).toBeInTheDocument();

    // Check if search bar and user menu are compact for mobile
    const searchBar = screen.getByTestId('search-bar');
    const userMenu = screen.getByTestId('user-menu');
    expect(searchBar).toHaveAttribute('data-compact', 'true');
    expect(userMenu).toHaveAttribute('data-compact', 'true');
  });

  it('renders minimal variant correctly', () => {
    render(<TopNav variant="minimal" />);

    expect(screen.queryByTestId('global-nav')).not.toBeInTheDocument();
    expect(screen.queryByTestId('search-bar')).not.toBeInTheDocument();
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('user-menu')).toBeInTheDocument();
    expect(screen.queryByTestId('mobile-menu-button')).not.toBeInTheDocument();
  });

  it('renders transparent variant with correct classes', () => {
    render(<TopNav variant="transparent" />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('bg-transparent');
  });

  it('applies sticky position by default', () => {
    render(<TopNav />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('sticky', 'top-0');
  });

  it('applies fixed position when specified', () => {
    render(<TopNav position="fixed" />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('fixed', 'top-0', 'left-0', 'right-0');
  });

  it('applies static position when specified', () => {
    render(<TopNav position="static" />);

    const header = screen.getByRole('banner');
    expect(header).not.toHaveClass('sticky', 'fixed');
  });

  it('applies custom className', () => {
    render(<TopNav className="custom-class" />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('custom-class');
  });

  it('renders mobile navigation drawer on mobile', () => {
    // Set breakpoint to mobile so the drawer renders
    mockUseLayoutStore.mockReturnValue({
      ...mockLayoutStore,
      breakpoint: 'mobile',
    });

    render(<TopNav />);

    expect(screen.getByTestId('mobile-nav-drawer')).toBeInTheDocument();
  });

  it('has proper semantic structure', () => {
    render(<TopNav />);

    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();

    const nav = screen.getByRole('navigation', { name: /main navigation/i });
    expect(nav).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = jest.fn();
    render(<TopNav ref={ref} />);

    expect(ref).toHaveBeenCalledWith(expect.any(HTMLElement));
  });

  describe('responsive behavior', () => {
    it('hides search bar on tablet in minimal variant', () => {
      mockUseLayoutStore.mockReturnValue({
        ...mockLayoutStore,
        breakpoint: 'tablet',
      });

      render(<TopNav variant="minimal" />);

      expect(screen.queryByTestId('search-bar')).not.toBeInTheDocument();
    });

    it('shows search bar on mobile in default variant', () => {
      mockUseLayoutStore.mockReturnValue({
        ...mockLayoutStore,
        breakpoint: 'mobile',
      });

      render(<TopNav />);

      expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    });

    it('adapts navigation components based on breakpoint', () => {
      // Test desktop
      mockUseLayoutStore.mockReturnValue({
        ...mockLayoutStore,
        breakpoint: 'desktop',
      });

      const { rerender } = render(<TopNav />);
      expect(screen.getByTestId('global-nav')).toBeInTheDocument();

      // Test mobile
      mockUseLayoutStore.mockReturnValue({
        ...mockLayoutStore,
        breakpoint: 'mobile',
      });

      rerender(<TopNav />);
      expect(screen.queryByTestId('global-nav')).not.toBeInTheDocument();
      expect(screen.getByTestId('mobile-menu-button')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<TopNav />);

      const logoLink = screen.getByRole('link', { name: /recipe app home/i });
      expect(logoLink).toBeInTheDocument();

      const nav = screen.getByRole('navigation', { name: /main navigation/i });
      expect(nav).toBeInTheDocument();
    });

    it('uses semantic HTML elements', () => {
      render(<TopNav />);

      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });
});
