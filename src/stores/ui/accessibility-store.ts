import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AccessibilityStoreState,
  AccessibilityPreferences,
} from '@/types/ui/accessibility';
import type { FontSize } from '@/types/ui/theme';

const detectScreenReader = (): boolean => {
  if (typeof window === 'undefined') return false;

  // Check for common screen reader indicators
  return !!(
    window.navigator.userAgent.includes('NVDA') ||
    window.navigator.userAgent.includes('JAWS') ||
    window.speechSynthesis ||
    (window as Window & { speechSynthesis?: unknown }).speechSynthesis ||
    document.querySelector('[role="application"]') ||
    document.querySelector('[aria-live]')
  );
};

const detectHighContrast = (): boolean => {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(prefers-contrast: high)').matches;
};

const detectReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const detectKeyboardNavigation = (): boolean => {
  if (typeof window === 'undefined') return false;

  // Simple heuristic: check if user is using keyboard navigation
  let keyboardUser = false;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      keyboardUser = true;
      document.removeEventListener('keydown', handleKeyDown);
    }
  };

  const handleMouseDown = () => {
    keyboardUser = false;
    document.removeEventListener('mousedown', handleMouseDown);
  };

  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('mousedown', handleMouseDown);

  return keyboardUser;
};

const updateAccessibilityStyles = (state: AccessibilityStoreState) => {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;

  // High contrast
  if (state.highContrast || state.contrastMode === 'high') {
    root.classList.add('high-contrast');
  } else {
    root.classList.remove('high-contrast');
  }

  // Reduced motion
  root.style.setProperty(
    '--motion-duration',
    state.reducedMotion ? '0s' : '0.2s'
  );
  root.style.setProperty('--motion-scale', state.reducedMotion ? '1' : '1.05');

  // Font size
  const fontSizeMap = {
    small: '14px',
    medium: '16px',
    large: '18px',
  };
  root.style.setProperty('--base-font-size', fontSizeMap[state.fontSize]);

  // Focus visible
  if (state.focusVisible || state.keyboardNavigation) {
    root.classList.add('focus-visible');
  } else {
    root.classList.remove('focus-visible');
  }

  // Screen reader optimizations
  if (state.screenReader) {
    root.classList.add('screen-reader-optimized');
  } else {
    root.classList.remove('screen-reader-optimized');
  }
};

export const useAccessibilityStore = create<AccessibilityStoreState>()(
  persist(
    (set, get) => ({
      screenReader: false,
      highContrast: false,
      reducedMotion: false,
      fontSize: 'medium',
      keyboardNavigation: false,
      focusVisible: false,
      announcementsEnabled: true,

      // State
      announcements: [],
      skipLinksVisible: false,
      contrastMode: 'normal',

      updatePreferences: (prefs: Partial<AccessibilityPreferences>) => {
        const newState = { ...get(), ...prefs };
        set(newState);
        updateAccessibilityStyles(newState);
      },

      setScreenReader: (enabled: boolean) => {
        const newState = { ...get(), screenReader: enabled };
        set(newState);
        updateAccessibilityStyles(newState);
      },

      setHighContrast: (enabled: boolean) => {
        const newState = {
          ...get(),
          highContrast: enabled,
          contrastMode: enabled ? ('high' as const) : ('normal' as const),
        };
        set(newState);
        updateAccessibilityStyles(newState);
      },

      setReducedMotion: (enabled: boolean) => {
        const newState = { ...get(), reducedMotion: enabled };
        set(newState);
        updateAccessibilityStyles(newState);
      },

      setFontSize: (size: FontSize) => {
        const newState = { ...get(), fontSize: size };
        set(newState);
        updateAccessibilityStyles(newState);
      },

      setKeyboardNavigation: (enabled: boolean) => {
        const newState = {
          ...get(),
          keyboardNavigation: enabled,
          focusVisible: enabled || get().focusVisible,
        };
        set(newState);
        updateAccessibilityStyles(newState);
      },

      setFocusVisible: (visible: boolean) => {
        const newState = { ...get(), focusVisible: visible };
        set(newState);
        updateAccessibilityStyles(newState);
      },

      setAnnouncementsEnabled: (enabled: boolean) => {
        set({ announcementsEnabled: enabled });
      },

      announce: (
        message: string,
        priority: 'polite' | 'assertive' = 'polite'
      ) => {
        if (!get().announcementsEnabled || !message.trim()) return;

        set(state => ({
          announcements: [...state.announcements, message.trim()].slice(-10), // Keep last 10 announcements
        }));

        // Create live region for screen readers
        if (typeof window !== 'undefined') {
          const liveRegion = document.createElement('div');
          liveRegion.setAttribute('aria-live', priority);
          liveRegion.setAttribute('aria-atomic', 'true');
          liveRegion.className = 'sr-only';
          liveRegion.textContent = message;

          document.body.appendChild(liveRegion);

          // Remove after announcement
          setTimeout(() => {
            document.body.removeChild(liveRegion);
          }, 1000);
        }
      },

      clearAnnouncements: () => {
        set({ announcements: [] });
      },

      removeAnnouncement: (index: number) => {
        set(state => ({
          announcements: state.announcements.filter((_, i) => i !== index),
        }));
      },

      toggleSkipLinks: () => {
        set(state => ({ skipLinksVisible: !state.skipLinksVisible }));
      },

      setSkipLinksVisible: (visible: boolean) => {
        set({ skipLinksVisible: visible });
      },

      setContrastMode: (mode: 'normal' | 'high') => {
        const newState = {
          ...get(),
          contrastMode: mode,
          highContrast: mode === 'high',
        };
        set(newState);
        updateAccessibilityStyles(newState);
      },

      initializeFromSystem: () => {
        if (typeof window === 'undefined') return;

        const systemPrefs = get().detectSystemPreferences();
        const newState = { ...get(), ...systemPrefs };
        set(newState);
        updateAccessibilityStyles(newState);

        // Set up media query listeners
        const contrastQuery = window.matchMedia('(prefers-contrast: high)');
        const motionQuery = window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        );

        const handleContrastChange = (e: MediaQueryListEvent) => {
          get().setHighContrast(e.matches);
        };

        const handleMotionChange = (e: MediaQueryListEvent) => {
          get().setReducedMotion(e.matches);
        };

        contrastQuery.addEventListener('change', handleContrastChange);
        motionQuery.addEventListener('change', handleMotionChange);

        // Set up keyboard navigation detection
        const handleFirstTab = (e: KeyboardEvent) => {
          if (e.key === 'Tab') {
            get().setKeyboardNavigation(true);
            document.removeEventListener('keydown', handleFirstTab);
          }
        };

        document.addEventListener('keydown', handleFirstTab);
      },

      detectSystemPreferences: () => {
        const prefs: Partial<AccessibilityPreferences> = {};

        prefs.screenReader = detectScreenReader();
        prefs.highContrast = detectHighContrast();
        prefs.reducedMotion = detectReducedMotion();
        prefs.keyboardNavigation = detectKeyboardNavigation();

        return prefs;
      },

      getLatestAnnouncement: () => {
        const announcements = get().announcements;
        return announcements.length > 0
          ? announcements[announcements.length - 1]
          : null;
      },

      hasAnnouncements: () => {
        return get().announcements.length > 0;
      },

      isUsingAssistiveTechnology: () => {
        const state = get();
        return (
          state.screenReader || state.keyboardNavigation || state.highContrast
        );
      },
    }),
    {
      name: 'accessibility-storage',
      partialize: state => ({
        screenReader: state.screenReader,
        highContrast: state.highContrast,
        reducedMotion: state.reducedMotion,
        fontSize: state.fontSize,
        keyboardNavigation: state.keyboardNavigation,
        focusVisible: state.focusVisible,
        announcementsEnabled: state.announcementsEnabled,
        contrastMode: state.contrastMode,
      }),
    }
  )
);
