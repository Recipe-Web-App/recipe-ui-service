import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme, FontSize, ThemeConfig } from '@/types/ui/theme';

interface ThemeState extends ThemeConfig {
  // Actions
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setFontSize: (fontSize: FontSize) => void;
  setReducedMotion: (reducedMotion: boolean) => void;
  setHighContrast: (highContrast: boolean) => void;
  initializeFromSystem: () => void;

  // Utility methods
  isDarkMode: () => boolean;
  isLightMode: () => boolean;
  isSystemMode: () => boolean;
}

const detectSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

const detectSystemReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const detectSystemHighContrast = (): boolean => {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(prefers-contrast: high)').matches;
};

const calculateEffectiveTheme = (
  theme: Theme,
  systemTheme: 'light' | 'dark'
): 'light' | 'dark' => {
  return theme === 'system' ? systemTheme : theme;
};

const updateCSSCustomProperties = (config: ThemeConfig) => {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;

  // Theme colors
  root.setAttribute('data-theme', config.effectiveTheme);

  // Font size
  const fontSizeMap = {
    small: '14px',
    medium: '16px',
    large: '18px',
  };
  root.style.setProperty('--base-font-size', fontSizeMap[config.fontSize]);

  // Motion preference
  root.style.setProperty(
    '--motion-duration',
    config.reducedMotion ? '0s' : '0.2s'
  );
  root.style.setProperty('--motion-scale', config.reducedMotion ? '1' : '1.05');

  // Contrast
  if (config.highContrast) {
    root.classList.add('high-contrast');
  } else {
    root.classList.remove('high-contrast');
  }
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      systemTheme: 'light',
      effectiveTheme: 'light',
      fontSize: 'medium',
      reducedMotion: false,
      highContrast: false,

      setTheme: (theme: Theme) => {
        const systemTheme = get().systemTheme;
        const effectiveTheme = calculateEffectiveTheme(theme, systemTheme);

        const newConfig = {
          ...get(),
          theme,
          effectiveTheme,
        };

        set(newConfig);
        updateCSSCustomProperties(newConfig);
      },

      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme: Theme = currentTheme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },

      setFontSize: (fontSize: FontSize) => {
        const newConfig = { ...get(), fontSize };
        set(newConfig);
        updateCSSCustomProperties(newConfig);
      },

      setReducedMotion: (reducedMotion: boolean) => {
        const newConfig = { ...get(), reducedMotion };
        set(newConfig);
        updateCSSCustomProperties(newConfig);
      },

      setHighContrast: (highContrast: boolean) => {
        const newConfig = { ...get(), highContrast };
        set(newConfig);
        updateCSSCustomProperties(newConfig);
      },

      initializeFromSystem: () => {
        if (typeof window === 'undefined') return;

        const systemTheme = detectSystemTheme();
        const systemReducedMotion = detectSystemReducedMotion();
        const systemHighContrast = detectSystemHighContrast();

        const currentTheme = get().theme;
        const effectiveTheme = calculateEffectiveTheme(
          currentTheme,
          systemTheme
        );

        const newConfig = {
          ...get(),
          systemTheme,
          effectiveTheme,
          reducedMotion: get().reducedMotion || systemReducedMotion,
          highContrast: get().highContrast || systemHighContrast,
        };

        set(newConfig);
        updateCSSCustomProperties(newConfig);

        // Set up system theme change listener
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
          const newSystemTheme: 'light' | 'dark' = e.matches ? 'dark' : 'light';
          const currentState = get();
          const newEffectiveTheme = calculateEffectiveTheme(
            currentState.theme,
            newSystemTheme
          );

          const updatedConfig = {
            ...currentState,
            systemTheme: newSystemTheme,
            effectiveTheme: newEffectiveTheme,
          };

          set(updatedConfig);
          updateCSSCustomProperties(updatedConfig);
        };

        mediaQuery.addEventListener('change', handleSystemThemeChange);

        // Set up reduced motion listener
        const motionQuery = window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        );
        const handleMotionChange = (e: MediaQueryListEvent) => {
          const newReducedMotion = e.matches;
          const updatedConfig = { ...get(), reducedMotion: newReducedMotion };
          set(updatedConfig);
          updateCSSCustomProperties(updatedConfig);
        };

        motionQuery.addEventListener('change', handleMotionChange);

        // Set up high contrast listener
        const contrastQuery = window.matchMedia('(prefers-contrast: high)');
        const handleContrastChange = (e: MediaQueryListEvent) => {
          const newHighContrast = e.matches;
          const updatedConfig = { ...get(), highContrast: newHighContrast };
          set(updatedConfig);
          updateCSSCustomProperties(updatedConfig);
        };

        contrastQuery.addEventListener('change', handleContrastChange);
      },

      isDarkMode: () => get().effectiveTheme === 'dark',
      isLightMode: () => get().effectiveTheme === 'light',
      isSystemMode: () => get().theme === 'system',
    }),
    {
      name: 'theme-storage',
      partialize: state => ({
        theme: state.theme,
        fontSize: state.fontSize,
        reducedMotion: state.reducedMotion,
        highContrast: state.highContrast,
      }),
    }
  )
);
