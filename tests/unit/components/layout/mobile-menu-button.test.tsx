import { render, screen, fireEvent } from '@testing-library/react';
import { MobileMenuButton } from '@/components/layout/mobile-menu-button';
import { useNavigationStore } from '@/stores/ui/navigation-store';

// Mock the navigation store
jest.mock('@/stores/ui/navigation-store');

// Mock UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

const mockUseNavigationStore = useNavigationStore as jest.MockedFunction<
  typeof useNavigationStore
>;

describe('MobileMenuButton', () => {
  const mockToggleMobileMenu = jest.fn();

  const mockNavigationStore = {
    isMobileMenuOpen: false,
    toggleMobileMenu: mockToggleMobileMenu,
  };

  beforeEach(() => {
    mockUseNavigationStore.mockReturnValue(mockNavigationStore);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders mobile menu button', () => {
    render(<MobileMenuButton />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('calls toggleMobileMenu when clicked', () => {
    render(<MobileMenuButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockToggleMobileMenu).toHaveBeenCalledTimes(1);
  });

  it('displays correct aria-label when menu is closed', () => {
    render(<MobileMenuButton />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Open mobile menu');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('displays correct aria-label when menu is open', () => {
    mockUseNavigationStore.mockReturnValue({
      ...mockNavigationStore,
      isMobileMenuOpen: true,
    });

    render(<MobileMenuButton />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Close mobile menu');
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('has proper accessibility attributes', () => {
    render(<MobileMenuButton />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-haspopup', 'menu');
    expect(button).toHaveAttribute('aria-controls', 'mobile-menu');
  });

  it('applies different sizes correctly', () => {
    const { rerender } = render(<MobileMenuButton size="sm" />);
    let button = screen.getByRole('button');
    expect(button).toHaveClass('h-8', 'w-8');

    rerender(<MobileMenuButton size="default" />);
    button = screen.getByRole('button');
    expect(button).toHaveClass('h-9', 'w-9');

    rerender(<MobileMenuButton size="lg" />);
    button = screen.getByRole('button');
    expect(button).toHaveClass('h-10', 'w-10');
  });

  it('applies custom className', () => {
    render(<MobileMenuButton className="custom-button-class" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-button-class');
  });

  it('has minimum touch target for accessibility', () => {
    render(<MobileMenuButton />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('min-h-[44px]', 'min-w-[44px]');
  });

  it('forwards ref correctly', () => {
    const ref = jest.fn();
    render(<MobileMenuButton ref={ref} />);

    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });

  describe('animation states', () => {
    it('shows hamburger lines when menu is closed', () => {
      const { container } = render(<MobileMenuButton />);

      const lines = container.querySelectorAll('span[aria-hidden="true"]');
      expect(lines).toHaveLength(3);

      // Check for hamburger state classes
      expect(lines[0]).toHaveClass('-translate-y-1.5', 'rotate-0');
      expect(lines[1]).toHaveClass('opacity-100', 'scale-100');
      expect(lines[2]).toHaveClass('translate-y-1.5', 'rotate-0');
    });

    it('shows X formation when menu is open', () => {
      mockUseNavigationStore.mockReturnValue({
        ...mockNavigationStore,
        isMobileMenuOpen: true,
      });

      const { container } = render(<MobileMenuButton />);

      const lines = container.querySelectorAll('span[aria-hidden="true"]');
      expect(lines).toHaveLength(3);

      // Check for X state classes
      expect(lines[0]).toHaveClass('rotate-45', 'translate-y-0');
      expect(lines[1]).toHaveClass('opacity-0', 'scale-0');
      expect(lines[2]).toHaveClass('-rotate-45', 'translate-y-0');
    });
  });

  describe('screen reader support', () => {
    it('includes screen reader text for closed state', () => {
      render(<MobileMenuButton />);

      expect(screen.getByText('Open navigation menu')).toHaveClass('sr-only');
    });

    it('includes screen reader text for open state', () => {
      mockUseNavigationStore.mockReturnValue({
        ...mockNavigationStore,
        isMobileMenuOpen: true,
      });

      render(<MobileMenuButton />);

      expect(screen.getByText('Close navigation menu')).toHaveClass('sr-only');
    });

    it('marks animation lines as aria-hidden', () => {
      const { container } = render(<MobileMenuButton />);

      const lines = container.querySelectorAll('span[aria-hidden="true"]');
      lines.forEach((line: Element) => {
        expect(line).toHaveAttribute('aria-hidden', 'true');
      });
    });
  });

  describe('styling', () => {
    it('applies hover and focus styles', () => {
      render(<MobileMenuButton />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'hover:bg-accent',
        'hover:text-accent-foreground',
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-ring'
      );
    });

    it('applies transition classes', () => {
      const { container } = render(<MobileMenuButton />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('transition-all', 'duration-200');

      const lines = container.querySelectorAll('span[aria-hidden="true"]');
      lines.forEach((line: Element) => {
        expect(line).toHaveClass(
          'transition-all',
          'duration-300',
          'ease-in-out'
        );
      });
    });
  });
});
