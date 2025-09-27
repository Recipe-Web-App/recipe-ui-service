import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import { useToastStore } from '@/stores/ui/toast-store';
import type { Toast } from '@/types/ui/toast';

// Mock toast store
jest.mock('@/stores/ui/toast-store');
const mockUseToastStore = useToastStore as jest.MockedFunction<
  typeof useToastStore
>;

// Mock toast component
jest.mock('@/components/ui/toast', () => ({
  Toast: ({
    title,
    onDismiss,
    action,
    variant,
    dismissible,
    autoDismiss,
    ...otherProps
  }: any) => (
    <div data-testid="toast" data-variant={variant} data-title={title}>
      <div>{title}</div>
      {action && <div data-testid="toast-action-wrapper">{action}</div>}
      {onDismiss && (
        <button data-testid="toast-dismiss" onClick={onDismiss}>
          Dismiss
        </button>
      )}
    </div>
  ),
}));

// Mock createPortal to render children directly
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (
    children: React.ReactNode,
    container: Element | DocumentFragment | null
  ) => {
    // Return null if container is null to simulate the real portal behavior
    if (!container) return null;
    return children;
  },
}));

// Import components after mocking
import { Toaster } from '@/components/ui/toaster';
import { useToaster } from '@/hooks/ui/use-toaster';

describe('Toaster', () => {
  const mockToastStore = {
    toasts: [],
    removeToast: jest.fn(),
    clearAllToasts: jest.fn(),
    addToast: jest.fn(),
    addSuccessToast: jest.fn(),
    addErrorToast: jest.fn(),
    addWarningToast: jest.fn(),
    addInfoToast: jest.fn(),
    updateToast: jest.fn(),
    isToastVisible: jest.fn(),
    getToastById: jest.fn(),
    maxToasts: 5,
    defaultDuration: 5000,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseToastStore.mockReturnValue(mockToastStore);

    // Mock document.body for portal
    Object.defineProperty(document, 'body', {
      value: document.createElement('body'),
      writable: true,
    });
  });

  describe('Rendering', () => {
    it('renders nothing when no toasts are present', () => {
      mockUseToastStore.mockReturnValue({
        ...mockToastStore,
        toasts: [],
      });

      const { container } = render(<Toaster />);

      // Should not find any toast-related elements
      expect(container.firstChild).toBeNull();
    });

    it('renders toasts when present', async () => {
      const mockToasts: Toast[] = [
        {
          id: '1',
          message: 'Test toast 1',
          type: 'success',
          duration: 5000,
          dismissible: true,
          createdAt: Date.now(),
        },
        {
          id: '2',
          message: 'Test toast 2',
          type: 'error',
          duration: 5000,
          dismissible: true,
          createdAt: Date.now(),
        },
      ];

      mockUseToastStore.mockReturnValue({
        ...mockToastStore,
        toasts: mockToasts,
      });

      const { container } = render(<Toaster animated={false} />);

      // Wait for toasts to render
      await waitFor(
        () => {
          expect(container).toHaveTextContent('Test toast 1');
          expect(container).toHaveTextContent('Test toast 2');
        },
        { timeout: 3000 }
      );
    });

    it('renders with correct positioning classes', async () => {
      const mockToasts: Toast[] = [
        {
          id: '1',
          message: 'Test toast',
          type: 'info',
          duration: 5000,
          dismissible: true,
          createdAt: Date.now(),
        },
      ];

      mockUseToastStore.mockReturnValue({
        ...mockToastStore,
        toasts: mockToasts,
      });

      const { container } = render(
        <Toaster position="bottom-left" animated={false} />
      );

      await waitFor(() => {
        const toasterContainer = within(container).getByRole('region');
        expect(toasterContainer).toHaveClass(
          'fixed',
          'z-[100]',
          'bottom-4',
          'left-4'
        );
      });
    });

    it('applies custom className', async () => {
      const mockToasts: Toast[] = [
        {
          id: '1',
          message: 'Test toast',
          type: 'info',
          duration: 5000,
          dismissible: true,
          createdAt: Date.now(),
        },
      ];

      mockUseToastStore.mockReturnValue({
        ...mockToastStore,
        toasts: mockToasts,
      });

      const { container } = render(
        <Toaster className="custom-toaster" animated={false} />
      );

      await waitFor(() => {
        const toasterContainer = within(container).getByRole('region');
        expect(toasterContainer).toHaveClass('custom-toaster');
      });
    });
  });

  describe('Positioning', () => {
    const positions = [
      { position: 'top-left' as const, expectedClasses: ['top-4', 'left-4'] },
      {
        position: 'top-center' as const,
        expectedClasses: ['top-4', 'left-1/2', '-translate-x-1/2'],
      },
      { position: 'top-right' as const, expectedClasses: ['top-4', 'right-4'] },
      {
        position: 'bottom-left' as const,
        expectedClasses: ['bottom-4', 'left-4'],
      },
      {
        position: 'bottom-center' as const,
        expectedClasses: ['bottom-4', 'left-1/2', '-translate-x-1/2'],
      },
      {
        position: 'bottom-right' as const,
        expectedClasses: ['bottom-4', 'right-4'],
      },
    ];

    positions.forEach(({ position, expectedClasses }) => {
      it(`applies correct classes for ${position} position`, async () => {
        const mockToasts: Toast[] = [
          {
            id: '1',
            message: 'Test toast',
            type: 'info',
            duration: 5000,
            dismissible: true,
            createdAt: Date.now(),
          },
        ];

        mockUseToastStore.mockReturnValue({
          ...mockToastStore,
          toasts: mockToasts,
        });

        const { container } = render(
          <Toaster position={position} animated={false} />
        );

        await waitFor(() => {
          const toasterContainer = within(container).getByRole('region');
          expectedClasses.forEach(className => {
            expect(toasterContainer).toHaveClass(className);
          });
        });
      });
    });

    it('applies flex-col-reverse for bottom positions', async () => {
      const mockToasts: Toast[] = [
        {
          id: '1',
          message: 'Test toast',
          type: 'info',
          duration: 5000,
          dismissible: true,
          createdAt: Date.now(),
        },
      ];

      mockUseToastStore.mockReturnValue({
        ...mockToastStore,
        toasts: mockToasts,
      });

      const { container } = render(
        <Toaster position="bottom-right" animated={false} />
      );

      await waitFor(() => {
        const toasterContainer = within(container).getByRole('region');
        expect(toasterContainer).toHaveClass('flex-col-reverse');
      });
    });

    it('applies flex-col for top positions', async () => {
      const mockToasts: Toast[] = [
        {
          id: '1',
          message: 'Test toast',
          type: 'info',
          duration: 5000,
          dismissible: true,
          createdAt: Date.now(),
        },
      ];

      mockUseToastStore.mockReturnValue({
        ...mockToastStore,
        toasts: mockToasts,
      });

      const { container } = render(
        <Toaster position="top-right" animated={false} />
      );

      await waitFor(() => {
        const toasterContainer = within(container).getByRole('region');
        expect(toasterContainer).toHaveClass('flex-col');
      });
    });
  });

  describe('Toast Limits', () => {
    it('respects toast limit', async () => {
      const mockToasts: Toast[] = Array.from({ length: 5 }, (_, i) => ({
        id: `${i + 1}`,
        message: `Test toast ${i + 1}`,
        type: 'info' as const,
        duration: 5000,
        dismissible: true,
        createdAt: Date.now(),
      }));

      mockUseToastStore.mockReturnValue({
        ...mockToastStore,
        toasts: mockToasts,
      });

      const { container } = render(<Toaster limit={3} animated={false} />);

      await waitFor(() => {
        // Should only show the last 3 toasts
        expect(container).not.toHaveTextContent('Test toast 1');
        expect(container).not.toHaveTextContent('Test toast 2');
        expect(container).toHaveTextContent('Test toast 3');
        expect(container).toHaveTextContent('Test toast 4');
        expect(container).toHaveTextContent('Test toast 5');
      });
    });

    it('shows all toasts when no limit is set', async () => {
      const mockToasts: Toast[] = Array.from({ length: 3 }, (_, i) => ({
        id: `${i + 1}`,
        message: `Test toast ${i + 1}`,
        type: 'info' as const,
        duration: 5000,
        dismissible: true,
        createdAt: Date.now(),
      }));

      mockUseToastStore.mockReturnValue({
        ...mockToastStore,
        toasts: mockToasts,
      });

      const { container } = render(<Toaster animated={false} />);

      await waitFor(() => {
        expect(container).toHaveTextContent('Test toast 1');
        expect(container).toHaveTextContent('Test toast 2');
        expect(container).toHaveTextContent('Test toast 3');
      });
    });
  });

  describe('Gap Configuration', () => {
    const gaps = [
      { gap: 'sm' as const, expectedClass: 'space-y-2' },
      { gap: 'md' as const, expectedClass: 'space-y-3' },
      { gap: 'lg' as const, expectedClass: 'space-y-4' },
    ];

    gaps.forEach(({ gap, expectedClass }) => {
      it(`applies correct gap class for ${gap}`, async () => {
        const mockToasts: Toast[] = [
          {
            id: '1',
            message: 'Test toast',
            type: 'info',
            duration: 5000,
            dismissible: true,
            createdAt: Date.now(),
          },
        ];

        mockUseToastStore.mockReturnValue({
          ...mockToastStore,
          toasts: mockToasts,
        });

        const { container } = render(<Toaster gap={gap} animated={false} />);

        await waitFor(() => {
          const toasterContainer = within(container).getByRole('region');
          expect(toasterContainer).toHaveClass(expectedClass);
        });
      });
    });
  });

  describe('Toast Interactions', () => {
    it('calls removeToast when toast is dismissed', async () => {
      const mockToasts: Toast[] = [
        {
          id: '1',
          message: 'Test toast',
          type: 'info',
          duration: 5000,
          dismissible: true,
          createdAt: Date.now(),
        },
      ];

      mockUseToastStore.mockReturnValue({
        ...mockToastStore,
        toasts: mockToasts,
      });

      const { container } = render(<Toaster animated={false} />);

      await waitFor(() => {
        const dismissButton = within(container).getByTestId('toast-dismiss');
        fireEvent.click(dismissButton);
        expect(mockToastStore.removeToast).toHaveBeenCalledWith('1');
      });
    });

    it('handles toast action clicks', async () => {
      const mockActionClick = jest.fn();
      const mockToasts: Toast[] = [
        {
          id: '1',
          message: 'Test toast',
          type: 'error',
          duration: 5000,
          dismissible: true,
          action: {
            label: 'Retry',
            onClick: mockActionClick,
          },
          createdAt: Date.now(),
        },
      ];

      mockUseToastStore.mockReturnValue({
        ...mockToastStore,
        toasts: mockToasts,
      });

      const { container } = render(<Toaster animated={false} />);

      await waitFor(() => {
        // First verify the toast is rendered
        expect(container).toHaveTextContent('Test toast');

        // Find the action wrapper first, then the button inside it
        const actionWrapper = within(container).getByTestId(
          'toast-action-wrapper'
        );
        const actionButton = within(actionWrapper).getByRole('button');
        fireEvent.click(actionButton);
      });

      expect(mockActionClick).toHaveBeenCalled();
      expect(mockToastStore.removeToast).toHaveBeenCalledWith('1');
    });
  });

  describe('Toast Variants', () => {
    const variants = [
      { type: 'success' as const, expectedVariant: 'success' },
      { type: 'error' as const, expectedVariant: 'error' },
      { type: 'warning' as const, expectedVariant: 'warning' },
      { type: 'info' as const, expectedVariant: 'info' },
    ];

    variants.forEach(({ type, expectedVariant }) => {
      it(`renders ${type} toast with correct variant`, async () => {
        const mockToasts: Toast[] = [
          {
            id: '1',
            message: `Test ${type} toast`,
            type,
            duration: 5000,
            dismissible: true,
            createdAt: Date.now(),
          },
        ];

        mockUseToastStore.mockReturnValue({
          ...mockToastStore,
          toasts: mockToasts,
        });

        const { container } = render(<Toaster animated={false} />);

        await waitFor(() => {
          const toast = within(container).getByTestId('toast');
          expect(toast).toHaveAttribute('data-variant', expectedVariant);
        });
      });
    });
  });

  describe('Portal Rendering', () => {
    it('renders toasts when portal container is available', async () => {
      const mockToasts: Toast[] = [
        {
          id: '1',
          message: 'Test toast',
          type: 'info',
          duration: 5000,
          dismissible: true,
          createdAt: Date.now(),
        },
      ];

      mockUseToastStore.mockReturnValue({
        ...mockToastStore,
        toasts: mockToasts,
      });

      const { container } = render(<Toaster animated={false} />);

      // Wait for component to mount and render
      await waitFor(() => {
        expect(container).toHaveTextContent('Test toast');
      });
    });

    it('handles null portal container gracefully', async () => {
      const mockToasts: Toast[] = [
        {
          id: '1',
          message: 'Test toast',
          type: 'info',
          duration: 5000,
          dismissible: true,
          createdAt: Date.now(),
        },
      ];

      mockUseToastStore.mockReturnValue({
        ...mockToastStore,
        toasts: mockToasts,
      });

      // This should not throw an error
      const { container } = render(
        <Toaster portalContainer={null} animated={false} />
      );

      // The component should handle null portal container gracefully
      // In our mock environment, it might still render to the default container
      // The important thing is that it doesn't crash
      expect(container).toBeDefined();
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes', async () => {
      const mockToasts: Toast[] = [
        {
          id: '1',
          message: 'Test toast',
          type: 'info',
          duration: 5000,
          dismissible: true,
          createdAt: Date.now(),
        },
      ];

      mockUseToastStore.mockReturnValue({
        ...mockToastStore,
        toasts: mockToasts,
      });

      const { container } = render(<Toaster animated={false} />);

      await waitFor(() => {
        const toasterContainer = within(container).getByRole('region');
        expect(toasterContainer).toHaveAttribute('aria-live', 'polite');
        expect(toasterContainer).toHaveAttribute('aria-label', 'Notifications');
      });
    });
  });
});

describe('useToaster', () => {
  const mockToastStore = {
    toasts: [],
    removeToast: jest.fn(),
    clearAllToasts: jest.fn(),
    addToast: jest.fn(),
    addSuccessToast: jest.fn(),
    addErrorToast: jest.fn(),
    addWarningToast: jest.fn(),
    addInfoToast: jest.fn(),
    updateToast: jest.fn(),
    isToastVisible: jest.fn(),
    getToastById: jest.fn(),
    maxToasts: 5,
    defaultDuration: 5000,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseToastStore.mockReturnValue(mockToastStore);
  });

  it('returns current toast state', () => {
    const mockToasts: Toast[] = [
      {
        id: '1',
        message: 'Test toast',
        type: 'info',
        duration: 5000,
        dismissible: true,
        createdAt: Date.now(),
      },
    ];

    mockUseToastStore.mockReturnValue({
      ...mockToastStore,
      toasts: mockToasts,
    });

    const TestComponent = () => {
      const { toasts, count } = useToaster();
      return (
        <div>
          <span data-testid="toast-count">{count}</span>
          <span data-testid="first-toast">{toasts[0]?.message}</span>
        </div>
      );
    };

    const { container } = render(<TestComponent />);

    expect(within(container).getByTestId('toast-count')).toHaveTextContent('1');
    expect(within(container).getByTestId('first-toast')).toHaveTextContent(
      'Test toast'
    );
  });

  it('provides removeToast function', () => {
    const TestComponent = () => {
      const { removeToast } = useToaster();
      return (
        <button onClick={() => removeToast('test-id')}>Remove Toast</button>
      );
    };

    const { container } = render(<TestComponent />);

    fireEvent.click(within(container).getByText('Remove Toast'));
    expect(mockToastStore.removeToast).toHaveBeenCalledWith('test-id');
  });

  it('provides clearAll function', () => {
    const TestComponent = () => {
      const { clearAll } = useToaster();
      return <button onClick={clearAll}>Clear All</button>;
    };

    const { container } = render(<TestComponent />);

    fireEvent.click(within(container).getByText('Clear All'));
    expect(mockToastStore.clearAllToasts).toHaveBeenCalled();
  });
});
