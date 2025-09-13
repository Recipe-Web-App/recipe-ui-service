import type { FontSize } from './theme';

export interface AccessibilityPreferences {
  screenReader: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: FontSize;
  keyboardNavigation: boolean;
  focusVisible: boolean;
  announcementsEnabled: boolean;
}

export interface AccessibilityState extends AccessibilityPreferences {
  announcements: string[];
  skipLinksVisible: boolean;
  contrastMode: 'normal' | 'high';
}

// Store interface with all actions
export interface AccessibilityStoreState extends AccessibilityState {
  // Preference actions
  updatePreferences: (prefs: Partial<AccessibilityPreferences>) => void;
  setScreenReader: (enabled: boolean) => void;
  setHighContrast: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
  setFontSize: (size: FontSize) => void;
  setKeyboardNavigation: (enabled: boolean) => void;
  setFocusVisible: (visible: boolean) => void;
  setAnnouncementsEnabled: (enabled: boolean) => void;

  // Announcement actions
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
  clearAnnouncements: () => void;
  removeAnnouncement: (index: number) => void;

  // Navigation actions
  toggleSkipLinks: () => void;
  setSkipLinksVisible: (visible: boolean) => void;
  setContrastMode: (mode: 'normal' | 'high') => void;

  // System detection
  initializeFromSystem: () => void;
  detectSystemPreferences: () => Partial<AccessibilityPreferences>;

  // Utility methods
  getLatestAnnouncement: () => string | null;
  hasAnnouncements: () => boolean;
  isUsingAssistiveTechnology: () => boolean;
}
