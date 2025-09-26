import { render, screen } from '@testing-library/react';
import { Footer } from '@/components/layout/footer';
import { useLayoutStore } from '@/stores/ui/layout-store';

// Mock the layout store
jest.mock('@/stores/ui/layout-store');
const mockUseLayoutStore = useLayoutStore as jest.MockedFunction<
  typeof useLayoutStore
>;

// Mock sub-components to simplify testing
jest.mock('@/components/ui/divider', () => ({
  Divider: ({ className }: { className?: string }) => (
    <hr className={className} data-testid="divider" />
  ),
}));

jest.mock('@/components/layout/footer-section', () => ({
  FooterSection: ({
    title,
    children,
  }: {
    title?: string;
    children: React.ReactNode;
  }) => (
    <div data-testid={`footer-section-${title?.toLowerCase()}`}>
      {title && <h3>{title}</h3>}
      {children}
    </div>
  ),
}));

jest.mock('@/components/layout/footer-link', () => ({
  FooterLink: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} data-testid="footer-link">
      {children}
    </a>
  ),
}));

jest.mock('@/components/layout/build-info', () => ({
  BuildInfo: () => <div data-testid="build-info">Build Info</div>,
}));

jest.mock('@/components/layout/social-links', () => ({
  SocialLinks: () => <div data-testid="social-links">Social Links</div>,
}));

describe('Footer', () => {
  const mockLayoutStore = {
    breakpoint: 'desktop' as const,
  };

  beforeEach(() => {
    mockUseLayoutStore.mockReturnValue(mockLayoutStore);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders all footer sections', () => {
    render(<Footer />);

    expect(screen.getByTestId('footer-section-product')).toBeInTheDocument();
    expect(screen.getByTestId('footer-section-resources')).toBeInTheDocument();
    expect(screen.getByTestId('footer-section-community')).toBeInTheDocument();
    expect(screen.getByTestId('footer-section-legal')).toBeInTheDocument();
  });

  it('renders copyright with current year', () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear();
    const copyright = screen.getByText(
      new RegExp(`© ${currentYear} Recipe App. All rights reserved.`)
    );
    expect(copyright).toBeInTheDocument();
  });

  it('renders build info by default', () => {
    render(<Footer />);

    expect(screen.getByTestId('build-info')).toBeInTheDocument();
  });

  it('renders social links by default', () => {
    render(<Footer />);

    expect(screen.getByTestId('social-links')).toBeInTheDocument();
  });

  it('hides build info when showBuildInfo is false', () => {
    render(<Footer showBuildInfo={false} />);

    expect(screen.queryByTestId('build-info')).not.toBeInTheDocument();
  });

  it('hides social links when showSocialLinks is false', () => {
    render(<Footer showSocialLinks={false} />);

    expect(screen.queryByTestId('social-links')).not.toBeInTheDocument();
  });

  it('renders divider between sections', () => {
    render(<Footer />);

    expect(screen.getByTestId('divider')).toBeInTheDocument();
    expect(screen.getByTestId('divider')).toHaveClass('my-8');
  });

  it('applies custom className', () => {
    render(<Footer className="custom-footer" />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('custom-footer');
  });

  it('has correct base styling', () => {
    render(<Footer />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('border-t');
    expect(footer).toHaveClass('bg-background');
    expect(footer).toHaveClass('mt-auto');
  });

  it('renders correct links in each section', () => {
    render(<Footer />);

    // Check that footer links are rendered
    const links = screen.getAllByTestId('footer-link');
    expect(links.length).toBeGreaterThan(10); // Should have many links

    // Check for specific links
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Documentation')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Discord')).toBeInTheDocument();
  });

  describe('Responsive Layout', () => {
    it('applies mobile layout when breakpoint is mobile', () => {
      mockUseLayoutStore.mockReturnValue({ breakpoint: 'mobile' });

      const { container } = render(<Footer />);

      // Check grid layout
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-1');

      // Check bottom section layout
      const bottomSection = container.querySelectorAll('.flex-col');
      expect(bottomSection.length).toBeGreaterThan(0);
    });

    it('applies tablet layout when breakpoint is tablet', () => {
      mockUseLayoutStore.mockReturnValue({ breakpoint: 'tablet' });

      const { container } = render(<Footer />);

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-2');
    });

    it('applies desktop layout when breakpoint is desktop', () => {
      mockUseLayoutStore.mockReturnValue({ breakpoint: 'desktop' });

      const { container } = render(<Footer />);

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('lg:grid-cols-4');
    });
  });

  it('forwards ref correctly', () => {
    const ref = jest.fn();
    render(<Footer ref={ref} />);

    expect(ref).toHaveBeenCalled();
  });

  it('has correct accessibility role', () => {
    render(<Footer />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('renders container with correct padding', () => {
    const { container } = render(<Footer />);

    const containerDiv = container.querySelector('.container');
    expect(containerDiv).toHaveClass('py-8');
    expect(containerDiv).toHaveClass('px-4');
    expect(containerDiv).toHaveClass('md:px-6');
    expect(containerDiv).toHaveClass('lg:px-8');
  });

  it('includes all product links', () => {
    render(<Footer />);

    const productSection = screen.getByTestId('footer-section-product');
    expect(productSection).toBeInTheDocument();

    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
    expect(screen.getByText('Changelog')).toBeInTheDocument();
  });

  it('includes all resource links', () => {
    render(<Footer />);

    const resourcesSection = screen.getByTestId('footer-section-resources');
    expect(resourcesSection).toBeInTheDocument();

    expect(screen.getByText('Documentation')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
    expect(screen.getByText('API Reference')).toBeInTheDocument();
  });

  it('includes all legal links', () => {
    render(<Footer />);

    const legalSection = screen.getByTestId('footer-section-legal');
    expect(legalSection).toBeInTheDocument();

    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    expect(screen.getByText('Cookie Policy')).toBeInTheDocument();
    expect(screen.getByText('License')).toBeInTheDocument();
  });
});
