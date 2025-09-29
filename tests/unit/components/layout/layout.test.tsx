import React from 'react';
import { render, screen } from '@testing-library/react';
import { Layout, LayoutWithoutProvider } from '@/components/layout/layout';
import {
  DefaultLayout,
  FocusedLayout,
  MinimalLayout,
} from '@/components/layout/layout-variants';
import {
  withDefaultLayout,
  withFocusedLayout,
  withMinimalLayout,
} from '@/components/layout/layout-hocs';
import { LayoutProvider } from '@/components/layout/layout-provider';
import { useSubNavigation } from '@/hooks/use-sub-navigation';
import { useNavigationStore } from '@/stores/ui/navigation-store';
import type { NavItem } from '@/types/navigation';

// Mock dependencies
jest.mock('@/hooks/use-sub-navigation');
const mockUseSubNavigation = useSubNavigation as jest.MockedFunction<
  typeof useSubNavigation
>;

jest.mock('@/stores/ui/navigation-store');
const mockUseNavigationStore = useNavigationStore as jest.MockedFunction<
  typeof useNavigationStore
>;

// Mock layout components
jest.mock('@/components/layout/top-nav', () => ({
  TopNav: ({ variant, ...props }: any) => (
    <header data-testid="top-nav" data-variant={variant} {...props}>
      TopNav
    </header>
  ),
}));

jest.mock('@/components/layout/sidebar', () => ({
  Sidebar: ({ items, variant, ...props }: any) => (
    <aside
      data-testid="sidebar"
      data-variant={variant}
      data-items-count={items?.length || 0}
      {...props}
    >
      Sidebar
    </aside>
  ),
}));

jest.mock('@/components/layout/footer', () => ({
  Footer: ({ showBuildInfo, showSocialLinks, ...props }: any) => (
    <footer
      data-testid="footer"
      data-show-build-info={showBuildInfo}
      data-show-social-links={showSocialLinks}
      {...props}
    >
      Footer
    </footer>
  ),
}));

jest.mock('@/components/ui/content', () => ({
  ContentPane: ({ children, viewMode, contentWidth, ...props }: any) => (
    <main
      data-testid="content-pane"
      data-view-mode={viewMode}
      data-content-width={contentWidth}
      {...props}
    >
      {children}
    </main>
  ),
}));

jest.mock('@/components/ui/toast', () => ({
  Toaster: () => <div data-testid="toaster">Toaster</div>,
}));

describe('Layout', () => {
  const mockSubNavigation: NavItem[] = [
    { id: 'nav1', label: 'Nav 1', href: '/nav1' },
    { id: 'nav2', label: 'Nav 2', href: '/nav2' },
  ];

  const mockNavigationStore = {
    setCurrentSubNavigation: jest.fn(),
  };

  beforeEach(() => {
    mockUseSubNavigation.mockReturnValue(mockSubNavigation);
    mockUseNavigationStore.mockReturnValue(mockNavigationStore);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Layout variants', () => {
    it('renders default layout with all components', () => {
      render(
        <Layout variant="default">
          <div data-testid="content">Test Content</div>
        </Layout>
      );

      expect(screen.getByTestId('top-nav')).toBeInTheDocument();
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('content-pane')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
      expect(screen.getByTestId('content')).toHaveTextContent('Test Content');
    });

    it('renders focused layout without sidebar but with footer', () => {
      render(
        <Layout variant="focused">
          <div data-testid="content">Test Content</div>
        </Layout>
      );

      expect(screen.getByTestId('top-nav')).toBeInTheDocument();
      expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
      expect(screen.getByTestId('content-pane')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('renders minimal layout with only TopNav and ContentPane', () => {
      render(
        <Layout variant="minimal">
          <div data-testid="content">Test Content</div>
        </Layout>
      );

      expect(screen.getByTestId('top-nav')).toBeInTheDocument();
      expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
      expect(screen.getByTestId('content-pane')).toBeInTheDocument();
      expect(screen.queryByTestId('footer')).not.toBeInTheDocument();
    });
  });

  describe('component props', () => {
    it('passes correct variant to TopNav', () => {
      render(
        <Layout variant="minimal">
          <div>Content</div>
        </Layout>
      );

      expect(screen.getByTestId('top-nav')).toHaveAttribute(
        'data-variant',
        'minimal'
      );
    });

    it('passes correct variant to Sidebar', () => {
      render(
        <Layout variant="focused">
          <div>Content</div>
        </Layout>
      );

      // Focused layout doesn't show sidebar, so test with default
      render(
        <Layout variant="default">
          <div>Content</div>
        </Layout>
      );

      expect(screen.getByTestId('sidebar')).toHaveAttribute(
        'data-variant',
        'default'
      );
    });

    it('passes sub-navigation items to Sidebar', () => {
      render(
        <Layout variant="default">
          <div>Content</div>
        </Layout>
      );

      expect(screen.getByTestId('sidebar')).toHaveAttribute(
        'data-items-count',
        '2'
      );
    });

    it('passes footer props based on variant', () => {
      render(
        <Layout variant="focused">
          <div>Content</div>
        </Layout>
      );

      const footer = screen.getByTestId('footer');
      expect(footer).toHaveAttribute('data-show-build-info', 'false');
      expect(footer).toHaveAttribute('data-show-social-links', 'false');
    });

    it('passes custom contentProps to ContentPane', () => {
      render(
        <Layout
          variant="default"
          contentProps={{
            viewMode: 'list',
            contentWidth: 'full',
          }}
        >
          <div>Content</div>
        </Layout>
      );

      const contentPane = screen.getByTestId('content-pane');
      expect(contentPane).toHaveAttribute('data-view-mode', 'list');
      expect(contentPane).toHaveAttribute('data-content-width', 'full');
    });
  });

  describe('custom props', () => {
    it('applies custom className to root container', () => {
      const { container } = render(
        <Layout className="custom-layout-class">
          <div>Content</div>
        </Layout>
      );

      const layoutRoot = container.firstChild as HTMLElement;
      expect(layoutRoot).toHaveClass('custom-layout-class');
    });

    it('sets data-layout-variant attribute', () => {
      const { container } = render(
        <Layout variant="focused">
          <div>Content</div>
        </Layout>
      );

      const layoutRoot = container.firstChild as HTMLElement;
      expect(layoutRoot).toHaveAttribute('data-layout-variant', 'focused');
    });
  });

  describe('responsive behavior', () => {
    it('has correct base styling classes', () => {
      const { container } = render(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      const layoutRoot = container.firstChild as HTMLElement;
      expect(layoutRoot).toHaveClass('flex', 'min-h-screen', 'flex-col');
    });
  });
});

describe('LayoutWithoutProvider', () => {
  const mockSubNavigation: NavItem[] = [
    { id: 'nav1', label: 'Nav 1', href: '/nav1' },
  ];

  const mockNavigationStore = {
    setCurrentSubNavigation: jest.fn(),
  };

  beforeEach(() => {
    mockUseSubNavigation.mockReturnValue(mockSubNavigation);
    mockUseNavigationStore.mockReturnValue(mockNavigationStore);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders within existing LayoutProvider', () => {
    render(
      <LayoutProvider variant="focused">
        <LayoutWithoutProvider>
          <div data-testid="content">Test Content</div>
        </LayoutWithoutProvider>
      </LayoutProvider>
    );

    expect(screen.getByTestId('top-nav')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toHaveTextContent('Test Content');
  });

  it('throws error when used outside LayoutProvider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(
        <LayoutWithoutProvider>
          <div>Content</div>
        </LayoutWithoutProvider>
      );
    }).toThrow('useLayoutContext must be used within a LayoutProvider');

    console.error = originalError;
  });
});

describe('Pre-configured layout variants', () => {
  const mockSubNavigation: NavItem[] = [];
  const mockNavigationStore = {
    setCurrentSubNavigation: jest.fn(),
  };

  beforeEach(() => {
    mockUseSubNavigation.mockReturnValue(mockSubNavigation);
    mockUseNavigationStore.mockReturnValue(mockNavigationStore);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('DefaultLayout renders with default variant', () => {
    const { container } = render(
      <DefaultLayout>
        <div>Content</div>
      </DefaultLayout>
    );

    const layoutRoot = container.firstChild as HTMLElement;
    expect(layoutRoot).toHaveAttribute('data-layout-variant', 'default');
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('FocusedLayout renders with focused variant', () => {
    const { container } = render(
      <FocusedLayout>
        <div>Content</div>
      </FocusedLayout>
    );

    const layoutRoot = container.firstChild as HTMLElement;
    expect(layoutRoot).toHaveAttribute('data-layout-variant', 'focused');
    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('MinimalLayout renders with minimal variant', () => {
    const { container } = render(
      <MinimalLayout>
        <div>Content</div>
      </MinimalLayout>
    );

    const layoutRoot = container.firstChild as HTMLElement;
    expect(layoutRoot).toHaveAttribute('data-layout-variant', 'minimal');
    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
    expect(screen.queryByTestId('footer')).not.toBeInTheDocument();
  });
});

describe('Layout HOCs', () => {
  const TestComponent: React.FC<{ testProp?: string }> = ({ testProp }) => (
    <div data-testid="hoc-content">{testProp}</div>
  );

  const mockSubNavigation: NavItem[] = [];
  const mockNavigationStore = {
    setCurrentSubNavigation: jest.fn(),
  };

  beforeEach(() => {
    mockUseSubNavigation.mockReturnValue(mockSubNavigation);
    mockUseNavigationStore.mockReturnValue(mockNavigationStore);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('withDefaultLayout wraps component with default layout', () => {
    const WrappedComponent = withDefaultLayout(TestComponent);
    const { container } = render(<WrappedComponent testProp="test value" />);

    const layoutRoot = container.firstChild as HTMLElement;
    expect(layoutRoot).toHaveAttribute('data-layout-variant', 'default');
    expect(screen.getByTestId('hoc-content')).toHaveTextContent('test value');
  });

  it('withFocusedLayout wraps component with focused layout', () => {
    const WrappedComponent = withFocusedLayout(TestComponent);
    const { container } = render(<WrappedComponent testProp="test value" />);

    const layoutRoot = container.firstChild as HTMLElement;
    expect(layoutRoot).toHaveAttribute('data-layout-variant', 'focused');
  });

  it('withMinimalLayout wraps component with minimal layout', () => {
    const WrappedComponent = withMinimalLayout(TestComponent);
    const { container } = render(<WrappedComponent testProp="test value" />);

    const layoutRoot = container.firstChild as HTMLElement;
    expect(layoutRoot).toHaveAttribute('data-layout-variant', 'minimal');
  });

  it('sets correct display name for HOC', () => {
    const WrappedComponent = withDefaultLayout(TestComponent);
    expect(WrappedComponent.displayName).toBe(
      'withLayout(default)(TestComponent)'
    );
  });
});

describe('Layout integration', () => {
  const mockSubNavigation: NavItem[] = [
    { id: 'nav1', label: 'Nav 1', href: '/nav1' },
    { id: 'nav2', label: 'Nav 2', href: '/nav2' },
  ];

  const mockNavigationStore = {
    setCurrentSubNavigation: jest.fn(),
  };

  beforeEach(() => {
    mockUseSubNavigation.mockReturnValue(mockSubNavigation);
    mockUseNavigationStore.mockReturnValue(mockNavigationStore);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('integrates with navigation store', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    expect(mockNavigationStore.setCurrentSubNavigation).toHaveBeenCalledWith(
      mockSubNavigation
    );
  });

  it('updates when sub-navigation changes', () => {
    const { rerender } = render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    const newSubNav: NavItem[] = [
      { id: 'nav3', label: 'Nav 3', href: '/nav3' },
    ];
    mockUseSubNavigation.mockReturnValue(newSubNav);

    rerender(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    expect(mockNavigationStore.setCurrentSubNavigation).toHaveBeenCalledWith(
      newSubNav
    );
  });
});
