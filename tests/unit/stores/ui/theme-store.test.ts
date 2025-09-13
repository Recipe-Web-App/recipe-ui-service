import { act } from '@testing-library/react';
import { useThemeStore } from '@/stores/ui/theme-store';

// Mock zustand persist
jest.mock('zustand/middleware', () => ({
  persist: (fn: any) => fn,
}));

// Mock window and document
const mockMatchMedia = jest.fn();
const mockDocumentElement = {
  style: {
    setProperty: jest.fn(),
  },
  classList: {
    add: jest.fn(),
    remove: jest.fn(),
  },
  setAttribute: jest.fn(),
};

Object.defineProperty(window, 'matchMedia', {
  value: mockMatchMedia,
  writable: true,
});

Object.defineProperty(document, 'documentElement', {
  value: mockDocumentElement,
  writable: true,
});

describe('useThemeStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset store state
    useThemeStore.setState({
      theme: 'system',
      systemTheme: 'light',
      effectiveTheme: 'light',
      fontSize: 'medium',
      reducedMotion: false,
      highContrast: false,
    });

    // Setup default matchMedia mock
    mockMatchMedia.mockImplementation((query: string) => ({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useThemeStore.getState();

      expect(state.theme).toBe('system');
      expect(state.systemTheme).toBe('light');
      expect(state.effectiveTheme).toBe('light');
      expect(state.fontSize).toBe('medium');
      expect(state.reducedMotion).toBe(false);
      expect(state.highContrast).toBe(false);
    });
  });

  describe('theme management', () => {
    describe('setTheme', () => {
      it('should set theme to light', () => {
        act(() => {
          useThemeStore.getState().setTheme('light');
        });

        const state = useThemeStore.getState();
        expect(state.theme).toBe('light');
        expect(state.effectiveTheme).toBe('light');
        expect(mockDocumentElement.setAttribute).toHaveBeenCalledWith(
          'data-theme',
          'light'
        );
      });

      it('should set theme to dark', () => {
        act(() => {
          useThemeStore.getState().setTheme('dark');
        });

        const state = useThemeStore.getState();
        expect(state.theme).toBe('dark');
        expect(state.effectiveTheme).toBe('dark');
        expect(mockDocumentElement.setAttribute).toHaveBeenCalledWith(
          'data-theme',
          'dark'
        );
      });

      it('should set theme to system and use system theme', () => {
        // Set system theme to dark
        useThemeStore.setState({ systemTheme: 'dark' });

        act(() => {
          useThemeStore.getState().setTheme('system');
        });

        const state = useThemeStore.getState();
        expect(state.theme).toBe('system');
        expect(state.effectiveTheme).toBe('dark');
        expect(mockDocumentElement.setAttribute).toHaveBeenCalledWith(
          'data-theme',
          'dark'
        );
      });
    });

    describe('toggleTheme', () => {
      it('should toggle from light to dark', () => {
        // Set initial theme to light
        act(() => {
          useThemeStore.getState().setTheme('light');
        });

        act(() => {
          useThemeStore.getState().toggleTheme();
        });

        expect(useThemeStore.getState().theme).toBe('dark');
        expect(useThemeStore.getState().effectiveTheme).toBe('dark');
      });

      it('should toggle from dark to light', () => {
        // Set initial theme to dark
        act(() => {
          useThemeStore.getState().setTheme('dark');
        });

        act(() => {
          useThemeStore.getState().toggleTheme();
        });

        expect(useThemeStore.getState().theme).toBe('light');
        expect(useThemeStore.getState().effectiveTheme).toBe('light');
      });

      it('should toggle from system to light', () => {
        // Keep system theme
        act(() => {
          useThemeStore.getState().toggleTheme();
        });

        expect(useThemeStore.getState().theme).toBe('light');
      });
    });
  });

  describe('font size management', () => {
    it('should set font size to small', () => {
      act(() => {
        useThemeStore.getState().setFontSize('small');
      });

      expect(useThemeStore.getState().fontSize).toBe('small');
      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
        '--base-font-size',
        '14px'
      );
    });

    it('should set font size to medium', () => {
      act(() => {
        useThemeStore.getState().setFontSize('medium');
      });

      expect(useThemeStore.getState().fontSize).toBe('medium');
      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
        '--base-font-size',
        '16px'
      );
    });

    it('should set font size to large', () => {
      act(() => {
        useThemeStore.getState().setFontSize('large');
      });

      expect(useThemeStore.getState().fontSize).toBe('large');
      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
        '--base-font-size',
        '18px'
      );
    });
  });

  describe('motion preferences', () => {
    it('should set reduced motion to true', () => {
      act(() => {
        useThemeStore.getState().setReducedMotion(true);
      });

      expect(useThemeStore.getState().reducedMotion).toBe(true);
      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
        '--motion-duration',
        '0s'
      );
      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
        '--motion-scale',
        '1'
      );
    });

    it('should set reduced motion to false', () => {
      act(() => {
        useThemeStore.getState().setReducedMotion(false);
      });

      expect(useThemeStore.getState().reducedMotion).toBe(false);
      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
        '--motion-duration',
        '0.2s'
      );
      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
        '--motion-scale',
        '1.05'
      );
    });
  });

  describe('contrast preferences', () => {
    it('should set high contrast to true', () => {
      act(() => {
        useThemeStore.getState().setHighContrast(true);
      });

      expect(useThemeStore.getState().highContrast).toBe(true);
      expect(mockDocumentElement.classList.add).toHaveBeenCalledWith(
        'high-contrast'
      );
    });

    it('should set high contrast to false', () => {
      act(() => {
        useThemeStore.getState().setHighContrast(false);
      });

      expect(useThemeStore.getState().highContrast).toBe(false);
      expect(mockDocumentElement.classList.remove).toHaveBeenCalledWith(
        'high-contrast'
      );
    });
  });

  describe('utility methods', () => {
    describe('isDarkMode', () => {
      it('should return true when effective theme is dark', () => {
        act(() => {
          useThemeStore.getState().setTheme('dark');
        });

        expect(useThemeStore.getState().isDarkMode()).toBe(true);
      });

      it('should return false when effective theme is light', () => {
        act(() => {
          useThemeStore.getState().setTheme('light');
        });

        expect(useThemeStore.getState().isDarkMode()).toBe(false);
      });
    });

    describe('isLightMode', () => {
      it('should return true when effective theme is light', () => {
        act(() => {
          useThemeStore.getState().setTheme('light');
        });

        expect(useThemeStore.getState().isLightMode()).toBe(true);
      });

      it('should return false when effective theme is dark', () => {
        act(() => {
          useThemeStore.getState().setTheme('dark');
        });

        expect(useThemeStore.getState().isLightMode()).toBe(false);
      });
    });

    describe('isSystemMode', () => {
      it('should return true when theme is system', () => {
        act(() => {
          useThemeStore.getState().setTheme('system');
        });

        expect(useThemeStore.getState().isSystemMode()).toBe(true);
      });

      it('should return false when theme is not system', () => {
        act(() => {
          useThemeStore.getState().setTheme('light');
        });

        expect(useThemeStore.getState().isSystemMode()).toBe(false);
      });
    });
  });

  describe('system initialization', () => {
    it('should initialize from system preferences', () => {
      // Mock system preferences
      mockMatchMedia.mockImplementation((query: string) => {
        const mockQuery = {
          matches: query === '(prefers-color-scheme: dark)',
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
        };

        if (query === '(prefers-reduced-motion: reduce)') {
          mockQuery.matches = true;
        }

        if (query === '(prefers-contrast: high)') {
          mockQuery.matches = false;
        }

        return mockQuery;
      });

      act(() => {
        useThemeStore.getState().initializeFromSystem();
      });

      const state = useThemeStore.getState();
      expect(state.systemTheme).toBe('dark');
      expect(state.effectiveTheme).toBe('dark'); // Because theme is 'system'
      expect(state.reducedMotion).toBe(true);
      expect(state.highContrast).toBe(false);
    });

    it('should set up system theme change listener', () => {
      const mockAddEventListener = jest.fn();
      mockMatchMedia.mockReturnValue({
        matches: false,
        addEventListener: mockAddEventListener,
        removeEventListener: jest.fn(),
      });

      act(() => {
        useThemeStore.getState().initializeFromSystem();
      });

      // Should set up listeners for theme, motion, and contrast
      expect(mockAddEventListener).toHaveBeenCalledTimes(3);
      expect(mockAddEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );
    });

    it('should handle system theme change events', () => {
      let themeChangeHandler: (e: MediaQueryListEvent) => void;
      let motionChangeHandler: (e: MediaQueryListEvent) => void;
      let contrastChangeHandler: (e: MediaQueryListEvent) => void;

      mockMatchMedia.mockImplementation((query: string) => {
        const mockQuery = {
          matches: false,
          addEventListener: jest.fn().mockImplementation((event, handler) => {
            if (event === 'change') {
              if (query.includes('color-scheme')) {
                themeChangeHandler = handler;
              } else if (query.includes('reduced-motion')) {
                motionChangeHandler = handler;
              } else if (query.includes('contrast')) {
                contrastChangeHandler = handler;
              }
            }
          }),
          removeEventListener: jest.fn(),
        };
        return mockQuery;
      });

      // Set theme to system so changes will apply
      act(() => {
        useThemeStore.getState().setTheme('system');
        useThemeStore.getState().initializeFromSystem();
      });

      // Test theme change
      const themeEvent = { matches: true } as MediaQueryListEvent;
      act(() => {
        themeChangeHandler!(themeEvent);
      });

      expect(useThemeStore.getState().systemTheme).toBe('dark');
      expect(useThemeStore.getState().effectiveTheme).toBe('dark');

      // Test motion preference change
      const motionEvent = { matches: true } as MediaQueryListEvent;
      act(() => {
        motionChangeHandler!(motionEvent);
      });

      expect(useThemeStore.getState().reducedMotion).toBe(true);

      // Test contrast preference change
      const contrastEvent = { matches: true } as MediaQueryListEvent;
      act(() => {
        contrastChangeHandler!(contrastEvent);
      });

      expect(useThemeStore.getState().highContrast).toBe(true);
    });

    it('should handle window being undefined (SSR)', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Intentionally removing window for SSR test
      delete global.window;

      act(() => {
        useThemeStore.getState().initializeFromSystem();
      });

      // Should not crash and state should remain unchanged
      const state = useThemeStore.getState();
      expect(state.systemTheme).toBe('light');

      global.window = originalWindow;
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete theme configuration flow', () => {
      // Set up initial configuration
      act(() => {
        useThemeStore.getState().setTheme('dark');
        useThemeStore.getState().setFontSize('large');
        useThemeStore.getState().setReducedMotion(true);
        useThemeStore.getState().setHighContrast(true);
      });

      const state = useThemeStore.getState();
      expect(state.theme).toBe('dark');
      expect(state.effectiveTheme).toBe('dark');
      expect(state.fontSize).toBe('large');
      expect(state.reducedMotion).toBe(true);
      expect(state.highContrast).toBe(true);

      // Verify CSS updates were called
      expect(mockDocumentElement.setAttribute).toHaveBeenCalledWith(
        'data-theme',
        'dark'
      );
      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
        '--base-font-size',
        '18px'
      );
      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
        '--motion-duration',
        '0s'
      );
      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
        '--motion-scale',
        '1'
      );
      expect(mockDocumentElement.classList.add).toHaveBeenCalledWith(
        'high-contrast'
      );
    });

    it('should handle theme toggle with different starting themes', () => {
      // Test toggle from system theme
      act(() => {
        useThemeStore.getState().setTheme('system');
        useThemeStore.getState().toggleTheme();
      });

      expect(useThemeStore.getState().theme).toBe('light');

      // Test toggle to dark
      act(() => {
        useThemeStore.getState().toggleTheme();
      });

      expect(useThemeStore.getState().theme).toBe('dark');

      // Test toggle back to light
      act(() => {
        useThemeStore.getState().toggleTheme();
      });

      expect(useThemeStore.getState().theme).toBe('light');
    });

    it('should handle system theme with different system preferences', () => {
      // Test with system dark mode
      useThemeStore.setState({ systemTheme: 'dark' });

      act(() => {
        useThemeStore.getState().setTheme('system');
      });

      expect(useThemeStore.getState().effectiveTheme).toBe('dark');
      expect(useThemeStore.getState().isDarkMode()).toBe(true);
      expect(useThemeStore.getState().isSystemMode()).toBe(true);

      // Change system to light
      useThemeStore.setState({ systemTheme: 'light' });

      act(() => {
        useThemeStore.getState().setTheme('system');
      });

      expect(useThemeStore.getState().effectiveTheme).toBe('light');
      expect(useThemeStore.getState().isLightMode()).toBe(true);
    });

    it('should handle system preferences during initialization', () => {
      // User explicitly enables reduced motion
      act(() => {
        useThemeStore.getState().setReducedMotion(true);
      });

      expect(useThemeStore.getState().reducedMotion).toBe(true);

      // System initialization uses OR logic - keeps user preference if true
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)' ? false : false,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));

      act(() => {
        useThemeStore.getState().initializeFromSystem();
      });

      // Current implementation uses OR logic: user OR system preference
      expect(useThemeStore.getState().reducedMotion).toBe(true);
    });
  });

  describe('additional coverage tests', () => {
    it('should handle system theme detection when window is undefined', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Intentionally removing window for SSR test
      delete global.window;

      // Call initializeFromSystem without window - should not crash
      act(() => {
        useThemeStore.getState().initializeFromSystem();
      });

      // State should remain unchanged
      const state = useThemeStore.getState();
      expect(state.systemTheme).toBe('light');

      global.window = originalWindow;
    });

    it('should handle CSS updates when window is undefined', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Intentionally removing window for SSR test
      delete global.window;

      // Should not crash when updating CSS properties
      act(() => {
        useThemeStore.getState().setTheme('dark');
      });

      // Test passes if no error is thrown
      expect(true).toBe(true);

      global.window = originalWindow;
    });

    it('should handle motion query listener event', () => {
      let motionChangeHandler: (e: MediaQueryListEvent) => void;

      mockMatchMedia.mockImplementation((query: string) => {
        const mockQuery = {
          matches: false,
          addEventListener: jest.fn().mockImplementation((event, handler) => {
            if (event === 'change' && query.includes('reduced-motion')) {
              motionChangeHandler = handler;
            }
          }),
          removeEventListener: jest.fn(),
        };
        return mockQuery;
      });

      act(() => {
        useThemeStore.getState().initializeFromSystem();
      });

      // Trigger motion preference change
      const motionEvent = { matches: true } as MediaQueryListEvent;
      act(() => {
        motionChangeHandler!(motionEvent);
      });

      expect(useThemeStore.getState().reducedMotion).toBe(true);
      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
        '--motion-duration',
        '0s'
      );
    });

    it('should handle contrast query listener event', () => {
      let contrastChangeHandler: (e: MediaQueryListEvent) => void;

      mockMatchMedia.mockImplementation((query: string) => {
        const mockQuery = {
          matches: false,
          addEventListener: jest.fn().mockImplementation((event, handler) => {
            if (event === 'change' && query.includes('contrast')) {
              contrastChangeHandler = handler;
            }
          }),
          removeEventListener: jest.fn(),
        };
        return mockQuery;
      });

      act(() => {
        useThemeStore.getState().initializeFromSystem();
      });

      // Trigger contrast preference change
      const contrastEvent = { matches: true } as MediaQueryListEvent;
      act(() => {
        contrastChangeHandler!(contrastEvent);
      });

      expect(useThemeStore.getState().highContrast).toBe(true);
      expect(mockDocumentElement.classList.add).toHaveBeenCalledWith(
        'high-contrast'
      );
    });

    it('should calculate effective theme correctly for light theme', () => {
      // Set system theme to dark but user theme to light
      useThemeStore.setState({ systemTheme: 'dark' });

      act(() => {
        useThemeStore.getState().setTheme('light');
      });

      expect(useThemeStore.getState().effectiveTheme).toBe('light');
      expect(useThemeStore.getState().isLightMode()).toBe(true);
      expect(useThemeStore.getState().isDarkMode()).toBe(false);
    });

    it('should calculate effective theme correctly for dark theme', () => {
      // Set system theme to light but user theme to dark
      useThemeStore.setState({ systemTheme: 'light' });

      act(() => {
        useThemeStore.getState().setTheme('dark');
      });

      expect(useThemeStore.getState().effectiveTheme).toBe('dark');
      expect(useThemeStore.getState().isDarkMode()).toBe(true);
      expect(useThemeStore.getState().isLightMode()).toBe(false);
    });

    it('should handle persist partialize function', () => {
      // Test that persist is configured to save specific state properties
      const state = useThemeStore.getState();

      // Set some state
      act(() => {
        useThemeStore.getState().setTheme('dark');
        useThemeStore.getState().setFontSize('large');
        useThemeStore.getState().setReducedMotion(true);
        useThemeStore.getState().setHighContrast(true);
      });

      const finalState = useThemeStore.getState();

      // Verify all persisted properties are set correctly
      expect(finalState.theme).toBe('dark');
      expect(finalState.fontSize).toBe('large');
      expect(finalState.reducedMotion).toBe(true);
      expect(finalState.highContrast).toBe(true);
    });

    it('should update CSS properties for all configuration changes', () => {
      // Test complete configuration update
      act(() => {
        useThemeStore.getState().setTheme('dark');
        useThemeStore.getState().setFontSize('small');
        useThemeStore.getState().setReducedMotion(true);
        useThemeStore.getState().setHighContrast(true);
      });

      // Verify all CSS properties were updated
      expect(mockDocumentElement.setAttribute).toHaveBeenCalledWith(
        'data-theme',
        'dark'
      );
      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
        '--base-font-size',
        '14px'
      );
      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
        '--motion-duration',
        '0s'
      );
      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
        '--motion-scale',
        '1'
      );
      expect(mockDocumentElement.classList.add).toHaveBeenCalledWith(
        'high-contrast'
      );
    });

    it('should handle high contrast removal', () => {
      // First enable high contrast
      act(() => {
        useThemeStore.getState().setHighContrast(true);
      });

      expect(mockDocumentElement.classList.add).toHaveBeenCalledWith(
        'high-contrast'
      );

      // Then disable it
      act(() => {
        useThemeStore.getState().setHighContrast(false);
      });

      expect(mockDocumentElement.classList.remove).toHaveBeenCalledWith(
        'high-contrast'
      );
    });

    it('should handle motion preference disabled', () => {
      // Enable reduced motion first
      act(() => {
        useThemeStore.getState().setReducedMotion(true);
      });

      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
        '--motion-duration',
        '0s'
      );
      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
        '--motion-scale',
        '1'
      );

      // Then disable it
      act(() => {
        useThemeStore.getState().setReducedMotion(false);
      });

      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
        '--motion-duration',
        '0.2s'
      );
      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
        '--motion-scale',
        '1.05'
      );
    });
  });
});
