import { renderHook, act } from '@testing-library/react';
import { useAutoSave, formatLastSaved } from '@/hooks/forms/useAutoSave';

describe('useAutoSave', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should initialize with correct default values', () => {
      const mockOnSave = jest.fn();
      const { result } = renderHook(() =>
        useAutoSave({
          data: { test: 'value' },
          onSave: mockOnSave,
        })
      );

      expect(result.current.isSaving).toBe(false);
      expect(result.current.lastSaved).toBeNull();
      // hasUnsavedChanges is true initially since lastSavedDataRef is null
      expect(result.current.hasUnsavedChanges).toBe(true);
    });

    it('should provide saveNow and markAsSaved functions', () => {
      const mockOnSave = jest.fn();
      const { result } = renderHook(() =>
        useAutoSave({
          data: { test: 'value' },
          onSave: mockOnSave,
        })
      );

      expect(typeof result.current.saveNow).toBe('function');
      expect(typeof result.current.markAsSaved).toBe('function');
    });
  });

  describe('saveNow', () => {
    it('should trigger immediate save and update state', async () => {
      const mockOnSave = jest.fn().mockResolvedValue(undefined);
      const { result } = renderHook(() =>
        useAutoSave({
          data: { test: 'value' },
          onSave: mockOnSave,
        })
      );

      await act(async () => {
        await result.current.saveNow();
      });

      expect(mockOnSave).toHaveBeenCalledWith({ test: 'value' });
      expect(result.current.lastSaved).not.toBeNull();
      expect(result.current.hasUnsavedChanges).toBe(false);
    });

    it('should call onSaveComplete callback on success', async () => {
      const mockOnSave = jest.fn().mockResolvedValue(undefined);
      const mockOnSaveComplete = jest.fn();
      const { result } = renderHook(() =>
        useAutoSave({
          data: { test: 'value' },
          onSave: mockOnSave,
          onSaveComplete: mockOnSaveComplete,
        })
      );

      await act(async () => {
        await result.current.saveNow();
      });

      expect(mockOnSaveComplete).toHaveBeenCalled();
    });

    it('should not save if data has not changed from last saved', async () => {
      const mockOnSave = jest.fn().mockResolvedValue(undefined);
      const { result } = renderHook(() =>
        useAutoSave({
          data: { test: 'value' },
          onSave: mockOnSave,
        })
      );

      // First save
      await act(async () => {
        await result.current.saveNow();
      });

      mockOnSave.mockClear();

      // Second save with same data should not call onSave
      await act(async () => {
        await result.current.saveNow();
      });

      expect(mockOnSave).not.toHaveBeenCalled();
    });
  });

  describe('markAsSaved', () => {
    it('should mark current state as saved', () => {
      const mockOnSave = jest.fn();
      const { result } = renderHook(() =>
        useAutoSave({
          data: { test: 'value' },
          onSave: mockOnSave,
        })
      );

      expect(result.current.lastSaved).toBeNull();

      act(() => {
        result.current.markAsSaved();
      });

      expect(result.current.lastSaved).not.toBeNull();
      expect(result.current.hasUnsavedChanges).toBe(false);
    });
  });

  describe('hasUnsavedChanges', () => {
    it('should be true initially', () => {
      const mockOnSave = jest.fn();
      const { result } = renderHook(() =>
        useAutoSave({
          data: { test: 'initial' },
          onSave: mockOnSave,
        })
      );

      expect(result.current.hasUnsavedChanges).toBe(true);
    });

    it('should be false after markAsSaved', () => {
      const mockOnSave = jest.fn();
      const { result } = renderHook(() =>
        useAutoSave({
          data: { test: 'initial' },
          onSave: mockOnSave,
        })
      );

      act(() => {
        result.current.markAsSaved();
      });

      expect(result.current.hasUnsavedChanges).toBe(false);
    });

    it('should be true after data changes', () => {
      const mockOnSave = jest.fn();
      const { result, rerender } = renderHook(
        ({ data }) =>
          useAutoSave({
            data,
            onSave: mockOnSave,
          }),
        { initialProps: { data: { test: 'initial' } } }
      );

      act(() => {
        result.current.markAsSaved();
      });

      expect(result.current.hasUnsavedChanges).toBe(false);

      rerender({ data: { test: 'changed' } });

      expect(result.current.hasUnsavedChanges).toBe(true);
    });
  });

  describe('disabled state', () => {
    it('should not auto-save when disabled', () => {
      const mockOnSave = jest.fn();
      renderHook(() =>
        useAutoSave({
          data: { test: 'value' },
          onSave: mockOnSave,
          enabled: false,
          interval: 1000,
        })
      );

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('should not save on saveNow when disabled', async () => {
      const mockOnSave = jest.fn();
      const { result } = renderHook(() =>
        useAutoSave({
          data: { test: 'value' },
          onSave: mockOnSave,
          enabled: false,
        })
      );

      await act(async () => {
        await result.current.saveNow();
      });

      expect(mockOnSave).not.toHaveBeenCalled();
    });
  });

  describe('isSaving state', () => {
    it('should be false after save completes', async () => {
      const mockOnSave = jest.fn().mockResolvedValue(undefined);
      const { result } = renderHook(() =>
        useAutoSave({
          data: { test: 'value' },
          onSave: mockOnSave,
        })
      );

      expect(result.current.isSaving).toBe(false);

      await act(async () => {
        await result.current.saveNow();
      });

      expect(result.current.isSaving).toBe(false);
    });
  });
});

describe('formatLastSaved', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-01-15T12:00:00'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return "Not saved yet" for null', () => {
    expect(formatLastSaved(null)).toBe('Not saved yet');
  });

  it('should return "Just saved" for saves within 10 seconds', () => {
    const recentDate = new Date('2025-01-15T11:59:55');
    expect(formatLastSaved(recentDate)).toBe('Just saved');
  });

  it('should return seconds ago for saves under 1 minute', () => {
    const date = new Date('2025-01-15T11:59:30');
    expect(formatLastSaved(date)).toBe('Saved 30 seconds ago');
  });

  it('should return "1 minute ago" for saves around 1 minute', () => {
    const date = new Date('2025-01-15T11:59:00');
    expect(formatLastSaved(date)).toBe('Saved 1 minute ago');
  });

  it('should return minutes ago for saves under 1 hour', () => {
    const date = new Date('2025-01-15T11:30:00');
    expect(formatLastSaved(date)).toBe('Saved 30 minutes ago');
  });

  it('should return formatted time for saves over 1 hour', () => {
    const date = new Date('2025-01-15T10:00:00');
    const result = formatLastSaved(date);
    expect(result).toMatch(/Saved at \d{1,2}:\d{2}/);
  });
});
