import { useNotificationPanelStore } from '@/stores/ui/notification-panel-store';
import { renderHook, act } from '@testing-library/react';

describe('Notification Panel Store', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the store state completely
    useNotificationPanelStore.setState({
      isPanelOpen: false,
      filter: 'all',
      lastCheckTime: null,
    });
  });

  describe('Panel Open/Close', () => {
    it('should open the panel and update last check time', () => {
      const { result } = renderHook(() => useNotificationPanelStore());

      expect(result.current.isPanelOpen).toBe(false);
      expect(result.current.lastCheckTime).toBeNull();

      act(() => {
        result.current.openPanel();
      });

      expect(result.current.isPanelOpen).toBe(true);
      expect(result.current.lastCheckTime).toBeInstanceOf(Date);
    });

    it('should close the panel', () => {
      const { result } = renderHook(() => useNotificationPanelStore());

      act(() => {
        result.current.openPanel();
      });

      expect(result.current.isPanelOpen).toBe(true);

      act(() => {
        result.current.closePanel();
      });

      expect(result.current.isPanelOpen).toBe(false);
    });

    it('should toggle the panel open', () => {
      const { result } = renderHook(() => useNotificationPanelStore());

      expect(result.current.isPanelOpen).toBe(false);

      act(() => {
        result.current.togglePanel();
      });

      expect(result.current.isPanelOpen).toBe(true);

      act(() => {
        result.current.togglePanel();
      });

      expect(result.current.isPanelOpen).toBe(false);
    });
  });

  describe('Filter Management', () => {
    it('should set filter to all', () => {
      const { result } = renderHook(() => useNotificationPanelStore());

      act(() => {
        result.current.setFilter('all');
      });

      expect(result.current.filter).toBe('all');
    });

    it('should set filter to social', () => {
      const { result } = renderHook(() => useNotificationPanelStore());

      act(() => {
        result.current.setFilter('social');
      });

      expect(result.current.filter).toBe('social');
    });

    it('should set filter to activity', () => {
      const { result } = renderHook(() => useNotificationPanelStore());

      act(() => {
        result.current.setFilter('activity');
      });

      expect(result.current.filter).toBe('activity');
    });

    it('should set filter to system', () => {
      const { result } = renderHook(() => useNotificationPanelStore());

      act(() => {
        result.current.setFilter('system');
      });

      expect(result.current.filter).toBe('system');
    });

    it('should check if filter is active', () => {
      const { result } = renderHook(() => useNotificationPanelStore());

      act(() => {
        result.current.setFilter('social');
      });

      expect(result.current.isFilterActive('social')).toBe(true);
      expect(result.current.isFilterActive('all')).toBe(false);
      expect(result.current.isFilterActive('activity')).toBe(false);
      expect(result.current.isFilterActive('system')).toBe(false);
    });
  });

  describe('Last Check Time', () => {
    it('should update last check time', () => {
      const { result } = renderHook(() => useNotificationPanelStore());

      expect(result.current.lastCheckTime).toBeNull();

      act(() => {
        result.current.updateLastCheckTime();
      });

      expect(result.current.lastCheckTime).toBeInstanceOf(Date);
    });

    it('should reset last check time', () => {
      const { result } = renderHook(() => useNotificationPanelStore());

      act(() => {
        result.current.updateLastCheckTime();
      });

      expect(result.current.lastCheckTime).toBeInstanceOf(Date);

      act(() => {
        result.current.resetLastCheckTime();
      });

      expect(result.current.lastCheckTime).toBeNull();
    });

    it('should update last check time when opening panel', () => {
      const { result } = renderHook(() => useNotificationPanelStore());

      const beforeOpen = result.current.lastCheckTime;
      expect(beforeOpen).toBeNull();

      act(() => {
        result.current.openPanel();
      });

      const afterOpen = result.current.lastCheckTime;
      expect(afterOpen).toBeInstanceOf(Date);
    });
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useNotificationPanelStore());

      expect(result.current.isPanelOpen).toBe(false);
      expect(result.current.filter).toBe('all');
      expect(result.current.lastCheckTime).toBeNull();
    });
  });

  describe('Combined Actions', () => {
    it('should open panel, set filter, and update last check time', () => {
      const { result } = renderHook(() => useNotificationPanelStore());

      act(() => {
        result.current.openPanel();
        result.current.setFilter('social');
      });

      expect(result.current.isPanelOpen).toBe(true);
      expect(result.current.filter).toBe('social');
      expect(result.current.lastCheckTime).toBeInstanceOf(Date);
    });

    it('should persist filter when closing and reopening panel', () => {
      const { result } = renderHook(() => useNotificationPanelStore());

      act(() => {
        result.current.openPanel();
        result.current.setFilter('activity');
      });

      expect(result.current.filter).toBe('activity');

      act(() => {
        result.current.closePanel();
      });

      expect(result.current.isPanelOpen).toBe(false);
      expect(result.current.filter).toBe('activity'); // Filter persists

      act(() => {
        result.current.openPanel();
      });

      expect(result.current.isPanelOpen).toBe(true);
      expect(result.current.filter).toBe('activity'); // Still the same filter
    });
  });
});
