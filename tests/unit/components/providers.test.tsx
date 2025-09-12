import React from 'react';
import { render, screen } from '@testing-library/react';
import { Providers } from '@/components/providers';
import { createQueryClient } from '@/lib/query-client';

// Mock the createQueryClient function
jest.mock('@/lib/query-client');
const mockCreateQueryClient = createQueryClient as jest.MockedFunction<
  typeof createQueryClient
>;

// Mock ReactQueryDevtools
jest.mock('@tanstack/react-query-devtools', () => ({
  ReactQueryDevtools: ({ initialIsOpen }: { initialIsOpen: boolean }) => (
    <div data-testid="react-query-devtools" data-initial-open={initialIsOpen}>
      ReactQueryDevtools
    </div>
  ),
}));

describe('Providers', () => {
  const mockQueryClient = {
    mount: jest.fn(),
    unmount: jest.fn(),
    getQueryData: jest.fn(),
    setQueryData: jest.fn(),
    invalidateQueries: jest.fn(),
    removeQueries: jest.fn(),
    clear: jest.fn(),
    getQueryCache: jest.fn(() => ({
      subscribe: jest.fn(),
      clear: jest.fn(),
    })),
    getMutationCache: jest.fn(() => ({
      subscribe: jest.fn(),
      clear: jest.fn(),
    })),
    getDefaultOptions: jest.fn(() => ({
      queries: {
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        retry: jest.fn(),
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 1,
      },
    })),
    setDefaultOptions: jest.fn(),
    defaultQueryOptions: jest.fn(() => ({
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: jest.fn(),
      refetchOnWindowFocus: false,
    })),
    isMutating: jest.fn(),
    isFetching: jest.fn(),
    fetchQuery: jest.fn(),
    prefetchQuery: jest.fn(),
    ensureQueryData: jest.fn(),
    cancelQueries: jest.fn(),
    resumePausedMutations: jest.fn(),
  };

  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateQueryClient.mockReturnValue(mockQueryClient as any);
  });

  afterEach(() => {
    // Restore original NODE_ENV
    (process.env as any).NODE_ENV = originalEnv;
  });

  describe('Basic rendering', () => {
    test('renders children correctly', () => {
      render(
        <Providers>
          <div data-testid="child-component">Test Child</div>
        </Providers>
      );

      expect(screen.getByTestId('child-component')).toBeInTheDocument();
      expect(screen.getByText('Test Child')).toBeInTheDocument();
    });

    test('creates QueryClient using createQueryClient function', () => {
      render(
        <Providers>
          <div>Test</div>
        </Providers>
      );

      expect(mockCreateQueryClient).toHaveBeenCalledTimes(1);
      expect(mockCreateQueryClient).toHaveBeenCalledWith();
    });

    test('creates QueryClient only once per component instance', () => {
      const { rerender } = render(
        <Providers>
          <div>Test 1</div>
        </Providers>
      );

      // Re-render with different children
      rerender(
        <Providers>
          <div>Test 2</div>
        </Providers>
      );

      // Should only create QueryClient once
      expect(mockCreateQueryClient).toHaveBeenCalledTimes(1);
    });
  });

  describe('Development environment behavior', () => {
    test('renders ReactQueryDevtools in development', () => {
      (process.env as any).NODE_ENV = 'development';

      render(
        <Providers>
          <div>Test</div>
        </Providers>
      );

      const devtools = screen.getByTestId('react-query-devtools');
      expect(devtools).toBeInTheDocument();
      expect(devtools).toHaveAttribute('data-initial-open', 'false');
    });

    test('ReactQueryDevtools has correct initialIsOpen prop', () => {
      (process.env as any).NODE_ENV = 'development';

      render(
        <Providers>
          <div>Test</div>
        </Providers>
      );

      const devtools = screen.getByTestId('react-query-devtools');
      expect(devtools).toHaveAttribute('data-initial-open', 'false');
    });
  });

  describe('Production environment behavior', () => {
    test('does not render ReactQueryDevtools in production', () => {
      (process.env as any).NODE_ENV = 'production';

      render(
        <Providers>
          <div>Test</div>
        </Providers>
      );

      expect(
        screen.queryByTestId('react-query-devtools')
      ).not.toBeInTheDocument();
    });

    test('does not render ReactQueryDevtools in test environment', () => {
      (process.env as any).NODE_ENV = 'test';

      render(
        <Providers>
          <div>Test</div>
        </Providers>
      );

      expect(
        screen.queryByTestId('react-query-devtools')
      ).not.toBeInTheDocument();
    });

    test('does not render ReactQueryDevtools when NODE_ENV is undefined', () => {
      delete (process.env as any).NODE_ENV;

      render(
        <Providers>
          <div>Test</div>
        </Providers>
      );

      expect(
        screen.queryByTestId('react-query-devtools')
      ).not.toBeInTheDocument();
    });
  });

  describe('QueryClient context integration', () => {
    test('provides QueryClientProvider with created QueryClient', () => {
      // Test that the component creates and provides a QueryClient
      render(
        <Providers>
          <div data-testid="test-child">Test Child</div>
        </Providers>
      );

      // Verify QueryClient was created
      expect(mockCreateQueryClient).toHaveBeenCalledTimes(1);

      // Verify children render (they have access to QueryClient context)
      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });

    test('allows multiple children to be rendered within QueryClientProvider', () => {
      render(
        <Providers>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <span data-testid="child-3">Child 3</span>
        </Providers>
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.getByTestId('child-3')).toBeInTheDocument();
    });
  });

  describe('Error handling', () => {
    test('handles createQueryClient throwing an error', () => {
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      mockCreateQueryClient.mockImplementation(() => {
        throw new Error('QueryClient creation failed');
      });

      expect(() => {
        render(
          <Providers>
            <div>Test</div>
          </Providers>
        );
      }).toThrow('QueryClient creation failed');

      consoleError.mockRestore();
    });
  });

  describe('Component structure', () => {
    test('wraps children in QueryClientProvider', () => {
      render(
        <Providers>
          <div data-testid="test-child">Test</div>
        </Providers>
      );

      // Verify the DOM structure - children should be wrapped
      const child = screen.getByTestId('test-child');
      expect(child).toBeInTheDocument();
      expect(child.textContent).toBe('Test');
    });

    test('maintains proper component hierarchy in development', () => {
      (process.env as any).NODE_ENV = 'development';

      render(
        <Providers>
          <div data-testid="main-content">Main Content</div>
        </Providers>
      );

      expect(screen.getByTestId('main-content')).toBeInTheDocument();
      expect(screen.getByTestId('react-query-devtools')).toBeInTheDocument();
    });

    test('renders without devtools in production maintains clean structure', () => {
      (process.env as any).NODE_ENV = 'production';

      render(
        <Providers>
          <div data-testid="main-content">Main Content</div>
        </Providers>
      );

      expect(screen.getByTestId('main-content')).toBeInTheDocument();
      expect(
        screen.queryByTestId('react-query-devtools')
      ).not.toBeInTheDocument();
    });
  });
});
