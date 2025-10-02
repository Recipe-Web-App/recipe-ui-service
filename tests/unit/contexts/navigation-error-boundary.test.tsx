import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  NavigationErrorBoundary,
  NavigationProviderWithErrorBoundary,
} from '@/contexts/navigation-error-boundary';
import { NavigationProvider } from '@/contexts/navigation-context';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useLayoutStore } from '@/stores/ui/layout-store';
import { useNavigationStore } from '@/stores/ui/navigation-store';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));

// Mock stores
jest.mock('@/stores/auth-store');
jest.mock('@/stores/ui/layout-store');
jest.mock('@/stores/ui/navigation-store');

// Mock breadcrumb utilities
jest.mock('@/lib/navigation/breadcrumb-utils');
jest.mock('@/lib/navigation/route-helpers');

// Mock feature flags
jest.mock('@/lib/features/flags', () => ({
  getFeatureFlags: jest.fn(() => ({})),
}));

const mockedUsePathname = usePathname as jest.MockedFunction<
  typeof usePathname
>;
const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockedUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof useAuthStore
>;
const mockedUseLayoutStore = useLayoutStore as jest.MockedFunction<
  typeof useLayoutStore
>;
const mockedUseNavigationStore = useNavigationStore as jest.MockedFunction<
  typeof useNavigationStore
>;

// Component that throws an error
const ThrowError: React.FC<{ shouldThrow?: boolean; message?: string }> = ({
  shouldThrow = true,
  message = 'Test error',
}) => {
  if (shouldThrow) {
    throw new Error(message);
  }
  return <div>No error</div>;
};

describe('NavigationErrorBoundary', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  };

  const mockNavigationStore = {
    setBreadcrumbs: jest.fn(),
    setCurrentPath: jest.fn(),
    clearCustomBreadcrumbs: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Set up default mocks
    mockedUsePathname.mockReturnValue('/');
    mockedUseRouter.mockReturnValue(mockRouter as any);
    mockedUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      user: null,
    } as any);
    mockedUseLayoutStore.mockReturnValue({
      breakpoint: 'desktop',
    } as any);
    mockedUseNavigationStore.mockReturnValue(mockNavigationStore as any);
  });

  describe('Error catching', () => {
    it('should catch errors from children', () => {
      // Suppress console.error for this test
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      render(
        <NavigationErrorBoundary>
          <ThrowError />
        </NavigationErrorBoundary>
      );

      expect(
        screen.getByText(/Navigation temporarily unavailable/i)
      ).toBeInTheDocument();

      consoleError.mockRestore();
    });

    it('should display fallback UI when error occurs', () => {
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      render(
        <NavigationErrorBoundary>
          <ThrowError message="Custom error message" />
        </NavigationErrorBoundary>
      );

      expect(
        screen.getByText(/Navigation temporarily unavailable/i)
      ).toBeInTheDocument();

      consoleError.mockRestore();
    });

    it('should render children when no error occurs', () => {
      render(
        <NavigationErrorBoundary>
          <ThrowError shouldThrow={false} />
        </NavigationErrorBoundary>
      );

      expect(screen.getByText('No error')).toBeInTheDocument();
      expect(
        screen.queryByText(/Navigation temporarily unavailable/i)
      ).not.toBeInTheDocument();
    });
  });

  describe('Custom fallback', () => {
    it('should render custom fallback when provided', () => {
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const customFallback = (
        <div data-testid="custom-fallback">Custom fallback UI</div>
      );

      render(
        <NavigationErrorBoundary fallback={customFallback}>
          <ThrowError message="Fallback test" />
        </NavigationErrorBoundary>
      );

      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
      expect(screen.getByText('Custom fallback UI')).toBeInTheDocument();

      consoleError.mockRestore();
    });

    it('should use custom fallback instead of default', () => {
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const customFallback = (
        <div data-testid="error-details">Custom error message</div>
      );

      render(
        <NavigationErrorBoundary fallback={customFallback}>
          <ThrowError message="Detailed error" />
        </NavigationErrorBoundary>
      );

      expect(screen.getByTestId('error-details')).toBeInTheDocument();
      expect(
        screen.queryByText(/Navigation temporarily unavailable/i)
      ).not.toBeInTheDocument();

      consoleError.mockRestore();
    });
  });

  describe('Default fallback UI', () => {
    it('should display default message in fallback', () => {
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      render(
        <NavigationErrorBoundary>
          <ThrowError />
        </NavigationErrorBoundary>
      );

      expect(
        screen.getByText('Navigation temporarily unavailable')
      ).toBeInTheDocument();

      consoleError.mockRestore();
    });

    it('should have proper styling classes', () => {
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const { container } = render(
        <NavigationErrorBoundary>
          <ThrowError />
        </NavigationErrorBoundary>
      );

      const errorDiv = container.querySelector(
        '.flex.items-center.justify-center'
      );
      expect(errorDiv).toBeInTheDocument();

      consoleError.mockRestore();
    });
  });

  describe('Error boundary lifecycle', () => {
    it('should log error to console', () => {
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      render(
        <NavigationErrorBoundary>
          <ThrowError message="Lifecycle error" />
        </NavigationErrorBoundary>
      );

      // React and error boundary will call console.error
      expect(consoleError).toHaveBeenCalled();

      consoleError.mockRestore();
    });

    it('should render fallback when error is caught', () => {
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      render(
        <NavigationErrorBoundary>
          <ThrowError />
        </NavigationErrorBoundary>
      );

      // Error boundary should be rendering fallback UI
      expect(
        screen.getByText('Navigation temporarily unavailable')
      ).toBeInTheDocument();

      consoleError.mockRestore();
    });
  });
});

describe('NavigationProviderWithErrorBoundary', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  };

  const mockNavigationStore = {
    setBreadcrumbs: jest.fn(),
    setCurrentPath: jest.fn(),
    clearCustomBreadcrumbs: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockedUsePathname.mockReturnValue('/');
    mockedUseRouter.mockReturnValue(mockRouter as any);
    mockedUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      user: null,
    } as any);
    mockedUseLayoutStore.mockReturnValue({
      breakpoint: 'desktop',
    } as any);
    mockedUseNavigationStore.mockReturnValue(mockNavigationStore as any);
  });

  describe('Integration', () => {
    it('should wrap NavigationProvider with error boundary', () => {
      render(
        <NavigationProviderWithErrorBoundary>
          <div data-testid="test-child">Test content</div>
        </NavigationProviderWithErrorBoundary>
      );

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });

    it('should catch errors from children', () => {
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      render(
        <NavigationProviderWithErrorBoundary>
          <ThrowError message="Provider error" />
        </NavigationProviderWithErrorBoundary>
      );

      // Should show error fallback
      expect(
        screen.getByText(/Navigation temporarily unavailable/i)
      ).toBeInTheDocument();

      consoleError.mockRestore();
    });

    it('should pass custom fallback to error boundary', () => {
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const customFallback = (
        <div data-testid="custom">Custom fallback message</div>
      );

      render(
        <NavigationProviderWithErrorBoundary fallback={customFallback}>
          <ThrowError message="Integration error" />
        </NavigationProviderWithErrorBoundary>
      );

      expect(screen.getByTestId('custom')).toBeInTheDocument();
      expect(screen.getByText('Custom fallback message')).toBeInTheDocument();

      consoleError.mockRestore();
    });
  });

  describe('Children rendering', () => {
    it('should render multiple children', () => {
      render(
        <NavigationProviderWithErrorBoundary>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
        </NavigationProviderWithErrorBoundary>
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });

    it('should provide navigation context to children', () => {
      const TestComponent = () => {
        const context = React.useContext(
          require('@/contexts/navigation-context').NavigationContext
        );
        return (
          <div data-testid="has-context">
            {context ? 'Has context' : 'No context'}
          </div>
        );
      };

      render(
        <NavigationProviderWithErrorBoundary>
          <TestComponent />
        </NavigationProviderWithErrorBoundary>
      );

      expect(screen.getByTestId('has-context')).toHaveTextContent(
        'Has context'
      );
    });
  });
});
