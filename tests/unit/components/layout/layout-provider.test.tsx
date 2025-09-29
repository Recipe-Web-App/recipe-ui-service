import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import {
  LayoutProvider,
  useLayoutContext,
  LayoutErrorBoundary,
  LayoutProviderWithErrorBoundary,
} from '@/components/layout/layout-provider';
import {
  useLayoutVariant,
  useSidebarVisibility,
  useFooterVisibility,
  useLayoutSubNavigation,
} from '@/components/layout/layout-hooks';
import { withLayoutProvider } from '@/components/layout/layout-hocs';
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

// Test component that uses layout context
const TestComponent: React.FC = () => {
  const {
    variant,
    showSidebar,
    showFooter,
    subNavigation,
    setVariant,
    toggleSidebar,
    toggleFooter,
  } = useLayoutContext();

  return (
    <div>
      <div data-testid="variant">{variant}</div>
      <div data-testid="show-sidebar">{showSidebar.toString()}</div>
      <div data-testid="show-footer">{showFooter.toString()}</div>
      <div data-testid="sub-nav-count">{subNavigation.length}</div>
      <button data-testid="set-minimal" onClick={() => setVariant('minimal')}>
        Set Minimal
      </button>
      <button data-testid="set-focused" onClick={() => setVariant('focused')}>
        Set Focused
      </button>
      <button data-testid="set-default" onClick={() => setVariant('default')}>
        Set Default
      </button>
      <button data-testid="toggle-sidebar" onClick={toggleSidebar}>
        Toggle Sidebar
      </button>
      <button data-testid="toggle-footer" onClick={toggleFooter}>
        Toggle Footer
      </button>
    </div>
  );
};

// Test component for hooks
const HookTestComponent: React.FC = () => {
  const variant = useLayoutVariant();
  const showSidebar = useSidebarVisibility();
  const showFooter = useFooterVisibility();
  const subNavigation = useLayoutSubNavigation();

  return (
    <div>
      <div data-testid="hook-variant">{variant}</div>
      <div data-testid="hook-sidebar">{showSidebar.toString()}</div>
      <div data-testid="hook-footer">{showFooter.toString()}</div>
      <div data-testid="hook-subnav">{subNavigation.length}</div>
    </div>
  );
};

// Test component that throws an error
const ErrorComponent: React.FC<{ shouldThrow?: boolean }> = ({
  shouldThrow = false,
}) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div data-testid="error-component">No error</div>;
};

describe('LayoutProvider', () => {
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

  it('provides default layout context', () => {
    render(
      <LayoutProvider>
        <TestComponent />
      </LayoutProvider>
    );

    expect(screen.getByTestId('variant')).toHaveTextContent('default');
    expect(screen.getByTestId('show-sidebar')).toHaveTextContent('true');
    expect(screen.getByTestId('show-footer')).toHaveTextContent('true');
    expect(screen.getByTestId('sub-nav-count')).toHaveTextContent('2');
  });

  it('accepts custom default props', () => {
    render(
      <LayoutProvider
        variant="focused"
        defaultShowSidebar={false}
        defaultShowFooter={false}
      >
        <TestComponent />
      </LayoutProvider>
    );

    expect(screen.getByTestId('variant')).toHaveTextContent('focused');
    // Focused variant overrides the default props - sidebar should be false, footer should be true for focused
    expect(screen.getByTestId('show-sidebar')).toHaveTextContent('false');
    expect(screen.getByTestId('show-footer')).toHaveTextContent('true');
  });

  it('syncs sub-navigation with navigation store', () => {
    render(
      <LayoutProvider>
        <TestComponent />
      </LayoutProvider>
    );

    expect(mockNavigationStore.setCurrentSubNavigation).toHaveBeenCalledWith(
      mockSubNavigation
    );
  });

  describe('variant behavior', () => {
    it('changes to minimal variant correctly', () => {
      render(
        <LayoutProvider>
          <TestComponent />
        </LayoutProvider>
      );

      act(() => {
        fireEvent.click(screen.getByTestId('set-minimal'));
      });

      expect(screen.getByTestId('variant')).toHaveTextContent('minimal');
      expect(screen.getByTestId('show-sidebar')).toHaveTextContent('false');
      expect(screen.getByTestId('show-footer')).toHaveTextContent('false');
    });

    it('changes to focused variant correctly', () => {
      render(
        <LayoutProvider>
          <TestComponent />
        </LayoutProvider>
      );

      act(() => {
        fireEvent.click(screen.getByTestId('set-focused'));
      });

      expect(screen.getByTestId('variant')).toHaveTextContent('focused');
      expect(screen.getByTestId('show-sidebar')).toHaveTextContent('false');
      expect(screen.getByTestId('show-footer')).toHaveTextContent('true');
    });

    it('changes to default variant correctly', () => {
      render(
        <LayoutProvider variant="minimal">
          <TestComponent />
        </LayoutProvider>
      );

      act(() => {
        fireEvent.click(screen.getByTestId('set-default'));
      });

      expect(screen.getByTestId('variant')).toHaveTextContent('default');
      expect(screen.getByTestId('show-sidebar')).toHaveTextContent('true');
      expect(screen.getByTestId('show-footer')).toHaveTextContent('true');
    });
  });

  describe('toggle functions', () => {
    it('toggles sidebar visibility', () => {
      render(
        <LayoutProvider>
          <TestComponent />
        </LayoutProvider>
      );

      expect(screen.getByTestId('show-sidebar')).toHaveTextContent('true');

      act(() => {
        fireEvent.click(screen.getByTestId('toggle-sidebar'));
      });

      expect(screen.getByTestId('show-sidebar')).toHaveTextContent('false');

      act(() => {
        fireEvent.click(screen.getByTestId('toggle-sidebar'));
      });

      expect(screen.getByTestId('show-sidebar')).toHaveTextContent('true');
    });

    it('toggles footer visibility', () => {
      render(
        <LayoutProvider>
          <TestComponent />
        </LayoutProvider>
      );

      expect(screen.getByTestId('show-footer')).toHaveTextContent('true');

      act(() => {
        fireEvent.click(screen.getByTestId('toggle-footer'));
      });

      expect(screen.getByTestId('show-footer')).toHaveTextContent('false');

      act(() => {
        fireEvent.click(screen.getByTestId('toggle-footer'));
      });

      expect(screen.getByTestId('show-footer')).toHaveTextContent('true');
    });
  });

  describe('sub-navigation updates', () => {
    it('updates when sub-navigation changes', () => {
      const { rerender } = render(
        <LayoutProvider>
          <TestComponent />
        </LayoutProvider>
      );

      expect(screen.getByTestId('sub-nav-count')).toHaveTextContent('2');

      const newSubNav: NavItem[] = [
        { id: 'nav3', label: 'Nav 3', href: '/nav3' },
      ];
      mockUseSubNavigation.mockReturnValue(newSubNav);

      rerender(
        <LayoutProvider>
          <TestComponent />
        </LayoutProvider>
      );

      expect(screen.getByTestId('sub-nav-count')).toHaveTextContent('1');
      expect(mockNavigationStore.setCurrentSubNavigation).toHaveBeenCalledWith(
        newSubNav
      );
    });
  });
});

describe('Layout hooks', () => {
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

  it('throws error when used outside provider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useLayoutContext must be used within a LayoutProvider');

    console.error = originalError;
  });

  it('provides correct values through individual hooks', () => {
    render(
      <LayoutProvider variant="focused">
        <HookTestComponent />
      </LayoutProvider>
    );

    expect(screen.getByTestId('hook-variant')).toHaveTextContent('focused');
    expect(screen.getByTestId('hook-sidebar')).toHaveTextContent('false');
    expect(screen.getByTestId('hook-footer')).toHaveTextContent('true');
    expect(screen.getByTestId('hook-subnav')).toHaveTextContent('1');
  });
});

describe('withLayoutProvider HOC', () => {
  const TestComponentForHOC: React.FC<{ testProp?: string }> = ({
    testProp,
  }) => <div data-testid="hoc-component">{testProp}</div>;

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

  it('wraps component with layout provider', () => {
    const WrappedComponent = withLayoutProvider(TestComponentForHOC, {
      variant: 'minimal',
    });

    render(<WrappedComponent testProp="test value" />);

    expect(screen.getByTestId('hoc-component')).toHaveTextContent('test value');
  });

  it('sets correct display name', () => {
    const WrappedComponent = withLayoutProvider(TestComponentForHOC);

    expect(WrappedComponent.displayName).toBe(
      'withLayoutProvider(TestComponentForHOC)'
    );
  });
});

describe('LayoutErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <LayoutErrorBoundary>
        <ErrorComponent shouldThrow={false} />
      </LayoutErrorBoundary>
    );

    expect(screen.getByTestId('error-component')).toHaveTextContent('No error');
  });

  it('renders error UI when error occurs', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    render(
      <LayoutErrorBoundary>
        <ErrorComponent shouldThrow={true} />
      </LayoutErrorBoundary>
    );

    expect(screen.getByText('Layout Error')).toBeInTheDocument();
    expect(
      screen.getByText('Something went wrong with the page layout.')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Reload Page' })
    ).toBeInTheDocument();

    console.error = originalError;
  });

  it('has a reload button in error state', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    render(
      <LayoutErrorBoundary>
        <ErrorComponent shouldThrow={true} />
      </LayoutErrorBoundary>
    );

    expect(
      screen.getByRole('button', { name: 'Reload Page' })
    ).toBeInTheDocument();

    console.error = originalError;
  });
});

describe('LayoutProviderWithErrorBoundary', () => {
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

  it('provides layout context with error boundary protection', () => {
    render(
      <LayoutProviderWithErrorBoundary variant="focused">
        <HookTestComponent />
      </LayoutProviderWithErrorBoundary>
    );

    expect(screen.getByTestId('hook-variant')).toHaveTextContent('focused');
  });

  it('catches errors and shows error UI', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    render(
      <LayoutProviderWithErrorBoundary>
        <ErrorComponent shouldThrow={true} />
      </LayoutProviderWithErrorBoundary>
    );

    expect(screen.getByText('Layout Error')).toBeInTheDocument();

    console.error = originalError;
  });
});
