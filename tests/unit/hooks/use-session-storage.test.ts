import { renderHook, act } from '@testing-library/react';
import {
  useSessionStorage,
  useRemoveSessionStorage,
} from '@/hooks/use-session-storage';

// Mock sessionStorage at module level
const mockStorage: Record<string, string> = {};

const mockGetItem = jest.fn();
const mockSetItem = jest.fn();
const mockRemoveItem = jest.fn();
const mockClear = jest.fn();

// Setup sessionStorage mock before any tests run
Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: mockGetItem,
    setItem: mockSetItem,
    removeItem: mockRemoveItem,
    clear: mockClear,
  },
  writable: true,
});

describe('useSessionStorage', () => {
  beforeEach(() => {
    // Clear mock sessionStorage before each test
    Object.keys(mockStorage).forEach(key => {
      delete mockStorage[key];
    });

    // Reset mock implementations
    mockGetItem.mockReset();
    mockSetItem.mockReset();
    mockRemoveItem.mockReset();
    mockClear.mockReset();

    // Setup default implementations
    mockGetItem.mockImplementation((key: string) => mockStorage[key] ?? null);
    mockSetItem.mockImplementation((key: string, value: string) => {
      mockStorage[key] = value;
    });
    mockRemoveItem.mockImplementation((key: string) => {
      delete mockStorage[key];
    });
    mockClear.mockImplementation(() => {
      Object.keys(mockStorage).forEach(key => {
        delete mockStorage[key];
      });
    });
  });

  describe('initialization', () => {
    it('returns initial value when sessionStorage is empty', () => {
      const { result } = renderHook(() =>
        useSessionStorage<string>('test-key', 'default')
      );

      expect(result.current[0]).toBe('default');
    });

    it('returns stored value from sessionStorage if exists', () => {
      mockStorage['test-key'] = JSON.stringify('stored-value');

      const { result } = renderHook(() =>
        useSessionStorage<string>('test-key', 'default')
      );

      // With lazy initialization, value is read immediately
      expect(result.current[0]).toBe('stored-value');
    });

    it('handles array values', () => {
      mockStorage['array-key'] = JSON.stringify([1, 2, 3]);

      const { result } = renderHook(() =>
        useSessionStorage<number[]>('array-key', [])
      );

      expect(result.current[0]).toEqual([1, 2, 3]);
    });

    it('handles object values', () => {
      mockStorage['object-key'] = JSON.stringify({ foo: 'bar' });

      const { result } = renderHook(() =>
        useSessionStorage<{ foo: string }>('object-key', { foo: 'default' })
      );

      expect(result.current[0]).toEqual({ foo: 'bar' });
    });
  });

  describe('setValue', () => {
    it('updates state with new value', () => {
      const { result } = renderHook(() =>
        useSessionStorage<string>('test-key', 'initial')
      );

      act(() => {
        result.current[1]('new-value');
      });

      expect(result.current[0]).toBe('new-value');
    });

    it('persists value to sessionStorage', () => {
      const { result } = renderHook(() =>
        useSessionStorage<string>('test-key', 'initial')
      );

      act(() => {
        result.current[1]('persisted-value');
      });

      expect(window.sessionStorage.setItem).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify('persisted-value')
      );
    });

    it('accepts function updater', () => {
      const { result } = renderHook(() =>
        useSessionStorage<number>('counter-key', 0)
      );

      act(() => {
        result.current[1](prev => prev + 1);
      });

      expect(result.current[0]).toBe(1);

      act(() => {
        result.current[1](prev => prev + 10);
      });

      expect(result.current[0]).toBe(11);
    });

    it('handles array modifications', () => {
      const { result } = renderHook(() =>
        useSessionStorage<number[]>('array-key', [1, 2])
      );

      act(() => {
        result.current[1](prev => [...prev, 3]);
      });

      expect(result.current[0]).toEqual([1, 2, 3]);
      expect(window.sessionStorage.setItem).toHaveBeenCalledWith(
        'array-key',
        JSON.stringify([1, 2, 3])
      );
    });
  });

  describe('error handling', () => {
    it('handles sessionStorage.getItem throwing an error', () => {
      const consoleWarnSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      // Make getItem throw
      mockGetItem.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });

      const { result } = renderHook(() =>
        useSessionStorage<string>('error-key', 'default')
      );

      // Should fall back to initial value
      expect(result.current[0]).toBe('default');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Error reading sessionStorage key:',
        'error-key',
        expect.any(Error)
      );

      consoleWarnSpy.mockRestore();
    });

    it('handles sessionStorage.setItem throwing an error', () => {
      const consoleWarnSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      // Make setItem throw
      mockSetItem.mockImplementationOnce(() => {
        throw new Error('Storage full');
      });

      const { result } = renderHook(() =>
        useSessionStorage<string>('error-key', 'default')
      );

      act(() => {
        result.current[1]('new-value');
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Error setting sessionStorage key:',
        'error-key',
        expect.any(Error)
      );

      consoleWarnSpy.mockRestore();
    });

    it('handles invalid JSON in sessionStorage', () => {
      const consoleWarnSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      mockStorage['invalid-json'] = 'not valid json';

      const { result } = renderHook(() =>
        useSessionStorage<string>('invalid-json', 'default')
      );

      // Should fall back to initial value
      expect(result.current[0]).toBe('default');
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });
  });

  describe('key changes', () => {
    it('reads new value when key changes', async () => {
      mockStorage['key-1'] = JSON.stringify('value-1');
      mockStorage['key-2'] = JSON.stringify('value-2');

      const { result, rerender } = renderHook(
        ({ key }: { key: string }) => useSessionStorage<string>(key, 'default'),
        { initialProps: { key: 'key-1' } }
      );

      // Initial value is read immediately
      expect(result.current[0]).toBe('value-1');

      // Change key
      rerender({ key: 'key-2' });

      // Wait for effect to run
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current[0]).toBe('value-2');
    });
  });
});

describe('useRemoveSessionStorage', () => {
  beforeEach(() => {
    // Clear mock storage before each test (reuse top-level mockStorage)
    Object.keys(mockStorage).forEach(key => {
      delete mockStorage[key];
    });
    jest.clearAllMocks();
  });

  it('returns a function to remove the item', () => {
    const { result } = renderHook(() => useRemoveSessionStorage('test-key'));

    expect(typeof result.current).toBe('function');
  });

  it('removes item from sessionStorage when called', () => {
    mockStorage['remove-key'] = JSON.stringify('value');

    const { result } = renderHook(() => useRemoveSessionStorage('remove-key'));

    act(() => {
      result.current();
    });

    expect(window.sessionStorage.removeItem).toHaveBeenCalledWith('remove-key');
  });

  it('handles removeItem throwing an error', () => {
    const consoleWarnSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    mockRemoveItem.mockImplementationOnce(() => {
      throw new Error('Storage error');
    });

    const { result } = renderHook(() => useRemoveSessionStorage('error-key'));

    act(() => {
      result.current();
    });

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Error removing sessionStorage key:',
      'error-key',
      expect.any(Error)
    );

    consoleWarnSpy.mockRestore();
  });

  it('returns stable function reference', () => {
    const { result, rerender } = renderHook(() =>
      useRemoveSessionStorage('test-key')
    );

    const firstRef = result.current;

    rerender();

    expect(result.current).toBe(firstRef);
  });
});
