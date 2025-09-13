import { act } from '@testing-library/react';
import { useToastStore } from '@/stores/ui/toast-store';
import type { ToastOptions } from '@/types/ui/toast';

// Mock setTimeout and clearTimeout
jest.useFakeTimers();

describe('useToastStore', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    // Reset store state
    useToastStore.setState({
      toasts: [],
      maxToasts: 5,
      defaultDuration: 5000,
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useToastStore.getState();

      expect(state.toasts).toEqual([]);
      expect(state.maxToasts).toBe(5);
      expect(state.defaultDuration).toBe(5000);
    });
  });

  describe('addToast', () => {
    it('should add a toast with generated ID and default properties', () => {
      let toastId: string;
      act(() => {
        toastId = useToastStore.getState().addToast('Test message', 'info');
      });

      const state = useToastStore.getState();
      expect(state.toasts).toHaveLength(1);
      expect(toastId!).toBeDefined();
      expect(toastId!).toMatch(/^toast-\d+-[a-z0-9]+$/);

      const toast = state.toasts[0];
      expect(toast).toMatchObject({
        id: toastId!,
        message: 'Test message',
        type: 'info',
        duration: 5000,
        dismissible: true,
      });
      expect(toast.createdAt).toBeGreaterThan(0);
    });

    it('should use custom options when provided', () => {
      const options: ToastOptions = {
        duration: 3000,
        dismissible: false,
        action: {
          label: 'Undo',
          onClick: jest.fn(),
        },
      };

      act(() => {
        useToastStore.getState().addToast('Custom toast', 'success', options);
      });

      const toast = useToastStore.getState().toasts[0];
      expect(toast.duration).toBe(3000);
      expect(toast.dismissible).toBe(false);
      expect(toast.action).toEqual(options.action);
    });

    it('should auto-dismiss toast after duration', () => {
      act(() => {
        useToastStore
          .getState()
          .addToast('Auto dismiss', 'info', { duration: 1000 });
      });

      expect(useToastStore.getState().toasts).toHaveLength(1);

      // Fast-forward time
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(useToastStore.getState().toasts).toHaveLength(0);
    });

    it('should not auto-dismiss when duration is 0', () => {
      act(() => {
        useToastStore
          .getState()
          .addToast('Persistent toast', 'info', { duration: 0 });
      });

      expect(useToastStore.getState().toasts).toHaveLength(1);

      // Fast-forward time
      act(() => {
        jest.advanceTimersByTime(10000);
      });

      expect(useToastStore.getState().toasts).toHaveLength(1);
    });

    it('should enforce max toasts limit (FIFO)', () => {
      // Add more toasts than the limit
      act(() => {
        for (let i = 0; i < 7; i++) {
          useToastStore
            .getState()
            .addToast(`Toast ${i}`, 'info', { duration: 0 });
        }
      });

      const state = useToastStore.getState();
      expect(state.toasts).toHaveLength(5); // Should respect maxToasts

      // Should keep the last 5 toasts (2, 3, 4, 5, 6)
      expect(state.toasts[0].message).toBe('Toast 2');
      expect(state.toasts[4].message).toBe('Toast 6');
    });
  });

  describe('removeToast', () => {
    it('should remove toast by ID', () => {
      let toastId: string;
      act(() => {
        toastId = useToastStore
          .getState()
          .addToast('Remove me', 'info', { duration: 0 });
      });

      expect(useToastStore.getState().toasts).toHaveLength(1);

      act(() => {
        useToastStore.getState().removeToast(toastId!);
      });

      expect(useToastStore.getState().toasts).toHaveLength(0);
    });

    it('should do nothing when removing non-existent toast', () => {
      act(() => {
        useToastStore.getState().addToast('Keep me', 'info', { duration: 0 });
      });

      expect(useToastStore.getState().toasts).toHaveLength(1);

      act(() => {
        useToastStore.getState().removeToast('non-existent-id');
      });

      expect(useToastStore.getState().toasts).toHaveLength(1);
    });
  });

  describe('clearAllToasts', () => {
    it('should remove all toasts', () => {
      act(() => {
        useToastStore.getState().addToast('Toast 1', 'info', { duration: 0 });
        useToastStore
          .getState()
          .addToast('Toast 2', 'success', { duration: 0 });
        useToastStore.getState().addToast('Toast 3', 'error', { duration: 0 });
      });

      expect(useToastStore.getState().toasts).toHaveLength(3);

      act(() => {
        useToastStore.getState().clearAllToasts();
      });

      expect(useToastStore.getState().toasts).toHaveLength(0);
    });
  });

  describe('updateToast', () => {
    it('should update toast properties', () => {
      let toastId: string;
      act(() => {
        toastId = useToastStore
          .getState()
          .addToast('Original message', 'info', { duration: 0 });
      });

      act(() => {
        useToastStore.getState().updateToast(toastId!, {
          message: 'Updated message',
          type: 'success',
          dismissible: false,
        });
      });

      const toast = useToastStore.getState().getToastById(toastId!);
      expect(toast?.message).toBe('Updated message');
      expect(toast?.type).toBe('success');
      expect(toast?.dismissible).toBe(false);
    });

    it('should not affect other toasts', () => {
      let toast1Id: string;
      let toast2Id: string;
      act(() => {
        toast1Id = useToastStore
          .getState()
          .addToast('Toast 1', 'info', { duration: 0 });
        toast2Id = useToastStore
          .getState()
          .addToast('Toast 2', 'warning', { duration: 0 });
      });

      act(() => {
        useToastStore
          .getState()
          .updateToast(toast1Id!, { message: 'Updated Toast 1' });
      });

      const toast1 = useToastStore.getState().getToastById(toast1Id!);
      const toast2 = useToastStore.getState().getToastById(toast2Id!);

      expect(toast1?.message).toBe('Updated Toast 1');
      expect(toast2?.message).toBe('Toast 2');
    });
  });

  describe('convenience methods', () => {
    describe('addSuccessToast', () => {
      it('should add success toast with default settings', () => {
        act(() => {
          useToastStore.getState().addSuccessToast('Success message');
        });

        const toast = useToastStore.getState().toasts[0];
        expect(toast.type).toBe('success');
        expect(toast.message).toBe('Success message');
        expect(toast.duration).toBe(5000);
      });

      it('should accept custom options', () => {
        act(() => {
          useToastStore
            .getState()
            .addSuccessToast('Custom success', { duration: 3000 });
        });

        const toast = useToastStore.getState().toasts[0];
        expect(toast.type).toBe('success');
        expect(toast.duration).toBe(3000);
      });
    });

    describe('addErrorToast', () => {
      it('should add error toast with longer default duration', () => {
        act(() => {
          useToastStore.getState().addErrorToast('Error message');
        });

        const toast = useToastStore.getState().toasts[0];
        expect(toast.type).toBe('error');
        expect(toast.message).toBe('Error message');
        expect(toast.duration).toBe(8000);
      });

      it('should respect custom duration options', () => {
        act(() => {
          useToastStore
            .getState()
            .addErrorToast('Custom error', { duration: 10000 });
        });

        const toast = useToastStore.getState().toasts[0];
        expect(toast.duration).toBe(10000);
      });
    });

    describe('addWarningToast', () => {
      it('should add warning toast with medium duration', () => {
        act(() => {
          useToastStore.getState().addWarningToast('Warning message');
        });

        const toast = useToastStore.getState().toasts[0];
        expect(toast.type).toBe('warning');
        expect(toast.message).toBe('Warning message');
        expect(toast.duration).toBe(6000);
      });
    });

    describe('addInfoToast', () => {
      it('should add info toast with default duration', () => {
        act(() => {
          useToastStore.getState().addInfoToast('Info message');
        });

        const toast = useToastStore.getState().toasts[0];
        expect(toast.type).toBe('info');
        expect(toast.message).toBe('Info message');
        expect(toast.duration).toBe(5000);
      });
    });
  });

  describe('utility methods', () => {
    describe('isToastVisible', () => {
      it('should return true for existing toast', () => {
        let toastId: string;
        act(() => {
          toastId = useToastStore
            .getState()
            .addToast('Visible toast', 'info', { duration: 0 });
        });

        expect(useToastStore.getState().isToastVisible(toastId!)).toBe(true);
      });

      it('should return false for non-existent toast', () => {
        expect(useToastStore.getState().isToastVisible('non-existent')).toBe(
          false
        );
      });

      it('should return false for removed toast', () => {
        let toastId: string;
        act(() => {
          toastId = useToastStore
            .getState()
            .addToast('Remove me', 'info', { duration: 0 });
        });

        expect(useToastStore.getState().isToastVisible(toastId!)).toBe(true);

        act(() => {
          useToastStore.getState().removeToast(toastId!);
        });

        expect(useToastStore.getState().isToastVisible(toastId!)).toBe(false);
      });
    });

    describe('getToastById', () => {
      it('should return toast by ID', () => {
        let toastId: string;
        act(() => {
          toastId = useToastStore
            .getState()
            .addToast('Find me', 'info', { duration: 0 });
        });

        const toast = useToastStore.getState().getToastById(toastId!);
        expect(toast?.id).toBe(toastId!);
        expect(toast?.message).toBe('Find me');
      });

      it('should return undefined for non-existent toast', () => {
        const toast = useToastStore.getState().getToastById('non-existent');
        expect(toast).toBeUndefined();
      });
    });
  });

  describe('integration scenarios', () => {
    it('should handle multiple toasts with different types and durations', () => {
      let successId: string;
      let errorId: string;
      let warningId: string;

      act(() => {
        successId = useToastStore.getState().addSuccessToast('Success!');
        errorId = useToastStore.getState().addErrorToast('Error occurred');
        warningId = useToastStore.getState().addWarningToast('Warning!');
      });

      expect(useToastStore.getState().toasts).toHaveLength(3);

      // Success should auto-dismiss first (5000ms)
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(useToastStore.getState().toasts).toHaveLength(2);
      expect(useToastStore.getState().isToastVisible(successId!)).toBe(false);
      expect(useToastStore.getState().isToastVisible(errorId!)).toBe(true);
      expect(useToastStore.getState().isToastVisible(warningId!)).toBe(true);

      // Warning should auto-dismiss next (6000ms total)
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(useToastStore.getState().toasts).toHaveLength(1);
      expect(useToastStore.getState().isToastVisible(warningId!)).toBe(false);
      expect(useToastStore.getState().isToastVisible(errorId!)).toBe(true);

      // Error should auto-dismiss last (8000ms total)
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(useToastStore.getState().toasts).toHaveLength(0);
      expect(useToastStore.getState().isToastVisible(errorId!)).toBe(false);
    });

    it('should handle toast with action button', () => {
      const actionSpy = jest.fn();

      act(() => {
        useToastStore.getState().addToast('Toast with action', 'info', {
          duration: 0,
          action: {
            label: 'Undo',
            onClick: actionSpy,
          },
        });
      });

      const toast = useToastStore.getState().toasts[0];
      expect(toast.action).toBeDefined();
      expect(toast.action?.label).toBe('Undo');

      // Simulate action click
      toast.action?.onClick();
      expect(actionSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle max toasts overflow correctly', () => {
      // Fill up to max capacity
      act(() => {
        for (let i = 0; i < 5; i++) {
          useToastStore
            .getState()
            .addToast(`Toast ${i}`, 'info', { duration: 0 });
        }
      });

      expect(useToastStore.getState().toasts).toHaveLength(5);

      // Add one more to trigger overflow
      let overflowId: string;
      act(() => {
        overflowId = useToastStore
          .getState()
          .addToast('Overflow toast', 'info', { duration: 0 });
      });

      const state = useToastStore.getState();
      expect(state.toasts).toHaveLength(5);

      // First toast should be removed, overflow toast should be added
      expect(state.toasts.find(t => t.message === 'Toast 0')).toBeUndefined();
      expect(state.toasts.find(t => t.id === overflowId!)).toBeDefined();
      expect(state.toasts[4].message).toBe('Overflow toast');
    });
  });
});
