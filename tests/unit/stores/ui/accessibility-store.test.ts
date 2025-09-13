import { useAccessibilityStore } from '@/stores/ui/accessibility-store';

// Mock zustand persist
jest.mock('zustand/middleware', () => ({
  persist: (fn: any) => fn,
}));

// Mock window.matchMedia
const mockMatchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
});

// Mock window.speechSynthesis
Object.defineProperty(window, 'speechSynthesis', {
  writable: true,
  value: {},
});

// Mock document
const mockDocumentElement = {
  style: { setProperty: jest.fn() },
  classList: { add: jest.fn(), remove: jest.fn() },
};

Object.defineProperty(document, 'documentElement', {
  value: mockDocumentElement,
  configurable: true,
});

describe('useAccessibilityStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset store state
    useAccessibilityStore.setState({
      screenReader: false,
      highContrast: false,
      reducedMotion: false,
      fontSize: 'medium',
      keyboardNavigation: false,
      focusVisible: false,
      announcementsEnabled: true,
      announcements: [],
      skipLinksVisible: false,
      contrastMode: 'normal',
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useAccessibilityStore.getState();

      expect(state.screenReader).toBe(false);
      expect(state.highContrast).toBe(false);
      expect(state.reducedMotion).toBe(false);
      expect(state.fontSize).toBe('medium');
      expect(state.keyboardNavigation).toBe(false);
      expect(state.focusVisible).toBe(false);
      expect(state.announcementsEnabled).toBe(true);
      expect(state.announcements).toEqual([]);
      expect(state.skipLinksVisible).toBe(false);
      expect(state.contrastMode).toBe('normal');
    });
  });

  describe('accessibility settings', () => {
    it('should set screen reader mode', () => {
      useAccessibilityStore.getState().setScreenReader(true);
      expect(useAccessibilityStore.getState().screenReader).toBe(true);
    });

    it('should set high contrast mode', () => {
      useAccessibilityStore.getState().setHighContrast(true);
      const state = useAccessibilityStore.getState();
      expect(state.highContrast).toBe(true);
      expect(state.contrastMode).toBe('high');
    });

    it('should set reduced motion', () => {
      useAccessibilityStore.getState().setReducedMotion(true);
      expect(useAccessibilityStore.getState().reducedMotion).toBe(true);
    });

    it('should set font size', () => {
      useAccessibilityStore.getState().setFontSize('large');
      expect(useAccessibilityStore.getState().fontSize).toBe('large');
    });

    it('should set keyboard navigation', () => {
      useAccessibilityStore.getState().setKeyboardNavigation(true);
      const state = useAccessibilityStore.getState();
      expect(state.keyboardNavigation).toBe(true);
      expect(state.focusVisible).toBe(true);
    });

    it('should set focus visible', () => {
      useAccessibilityStore.getState().setFocusVisible(true);
      expect(useAccessibilityStore.getState().focusVisible).toBe(true);
    });

    it('should toggle announcements', () => {
      useAccessibilityStore.getState().setAnnouncementsEnabled(false);
      expect(useAccessibilityStore.getState().announcementsEnabled).toBe(false);
    });
  });

  describe('announcements', () => {
    it('should add announcement', () => {
      useAccessibilityStore.getState().announce('Test message');
      expect(useAccessibilityStore.getState().announcements).toContain(
        'Test message'
      );
    });

    it('should not add empty announcements', () => {
      useAccessibilityStore.getState().announce('   ');
      expect(useAccessibilityStore.getState().announcements).toEqual([]);
    });

    it('should not add announcements when disabled', () => {
      useAccessibilityStore.getState().setAnnouncementsEnabled(false);
      useAccessibilityStore.getState().announce('Test message');
      expect(useAccessibilityStore.getState().announcements).toEqual([]);
    });

    it('should clear announcements', () => {
      useAccessibilityStore.getState().announce('Test message');
      useAccessibilityStore.getState().clearAnnouncements();
      expect(useAccessibilityStore.getState().announcements).toEqual([]);
    });

    it('should remove specific announcement', () => {
      useAccessibilityStore.getState().announce('Message 1');
      useAccessibilityStore.getState().announce('Message 2');
      useAccessibilityStore.getState().removeAnnouncement(0);
      expect(useAccessibilityStore.getState().announcements).toEqual([
        'Message 2',
      ]);
    });
  });

  describe('skip links', () => {
    it('should toggle skip links visibility', () => {
      useAccessibilityStore.getState().toggleSkipLinks();
      expect(useAccessibilityStore.getState().skipLinksVisible).toBe(true);

      useAccessibilityStore.getState().toggleSkipLinks();
      expect(useAccessibilityStore.getState().skipLinksVisible).toBe(false);
    });

    it('should set skip links visibility', () => {
      useAccessibilityStore.getState().setSkipLinksVisible(true);
      expect(useAccessibilityStore.getState().skipLinksVisible).toBe(true);
    });
  });

  describe('contrast mode', () => {
    it('should set contrast mode', () => {
      useAccessibilityStore.getState().setContrastMode('high');
      const state = useAccessibilityStore.getState();
      expect(state.contrastMode).toBe('high');
      expect(state.highContrast).toBe(true);
    });
  });

  describe('preference updates', () => {
    it('should update multiple preferences at once', () => {
      useAccessibilityStore.getState().updatePreferences({
        screenReader: true,
        fontSize: 'large',
        reducedMotion: true,
      });

      const state = useAccessibilityStore.getState();
      expect(state.screenReader).toBe(true);
      expect(state.fontSize).toBe('large');
      expect(state.reducedMotion).toBe(true);
    });
  });

  describe('system detection', () => {
    it('should detect system preferences', () => {
      // Mock matchMedia to return proper values
      mockMatchMedia.mockReturnValue({
        matches: false,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      });

      const preferences = useAccessibilityStore
        .getState()
        .detectSystemPreferences();

      expect(typeof preferences.screenReader).toBe('boolean');
      expect(typeof preferences.highContrast).toBe('boolean');
      expect(typeof preferences.reducedMotion).toBe('boolean');
      expect(typeof preferences.keyboardNavigation).toBe('boolean');
    });

    it('should initialize from system', () => {
      // Mock matchMedia to return proper values for initialization
      mockMatchMedia.mockReturnValue({
        matches: false,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      });

      // This method sets up event listeners and detects system preferences
      expect(() => {
        useAccessibilityStore.getState().initializeFromSystem();
      }).not.toThrow();
    });
  });

  describe('announcement management', () => {
    it('should announce with priority', () => {
      useAccessibilityStore
        .getState()
        .announce('Important message', 'assertive');

      const announcements = useAccessibilityStore.getState().announcements;
      expect(announcements).toContain('Important message');
    });

    it('should limit announcements to 10', () => {
      // Add 15 announcements
      for (let i = 1; i <= 15; i++) {
        useAccessibilityStore.getState().announce(`Message ${i}`);
      }

      const announcements = useAccessibilityStore.getState().announcements;
      expect(announcements).toHaveLength(10);
      expect(announcements[0]).toBe('Message 6'); // Should start from 6th message
      expect(announcements[9]).toBe('Message 15'); // Should end with 15th message
    });

    it('should create live region in DOM', () => {
      // Mock document.createElement and appendChild
      const mockElement = {
        setAttribute: jest.fn(),
        textContent: '',
        className: '',
      };
      const mockAppendChild = jest.fn();
      const mockRemoveChild = jest.fn();

      jest.spyOn(document, 'createElement').mockReturnValue(mockElement as any);
      jest
        .spyOn(document.body, 'appendChild')
        .mockImplementation(mockAppendChild);
      jest
        .spyOn(document.body, 'removeChild')
        .mockImplementation(mockRemoveChild);

      useAccessibilityStore.getState().announce('Test message');

      expect(document.createElement).toHaveBeenCalledWith('div');
      expect(mockElement.setAttribute).toHaveBeenCalledWith(
        'aria-live',
        'polite'
      );
      expect(mockElement.setAttribute).toHaveBeenCalledWith(
        'aria-atomic',
        'true'
      );
      expect(mockElement.className).toBe('sr-only');
      expect(mockElement.textContent).toBe('Test message');
      expect(mockAppendChild).toHaveBeenCalledWith(mockElement);

      // Cleanup mocks
      jest.restoreAllMocks();
    });
  });

  describe('utility methods', () => {
    it('should get latest announcement', () => {
      useAccessibilityStore.getState().announce('First');
      useAccessibilityStore.getState().announce('Latest');
      expect(useAccessibilityStore.getState().getLatestAnnouncement()).toBe(
        'Latest'
      );
    });

    it('should return null when no announcements', () => {
      expect(
        useAccessibilityStore.getState().getLatestAnnouncement()
      ).toBeNull();
    });

    it('should check if has announcements', () => {
      expect(useAccessibilityStore.getState().hasAnnouncements()).toBe(false);
      useAccessibilityStore.getState().announce('Test');
      expect(useAccessibilityStore.getState().hasAnnouncements()).toBe(true);
    });

    it('should check if using assistive technology', () => {
      expect(
        useAccessibilityStore.getState().isUsingAssistiveTechnology()
      ).toBe(false);

      useAccessibilityStore.getState().setScreenReader(true);
      expect(
        useAccessibilityStore.getState().isUsingAssistiveTechnology()
      ).toBe(true);
    });

    it('should detect assistive technology via keyboard navigation', () => {
      useAccessibilityStore.getState().setKeyboardNavigation(true);
      expect(
        useAccessibilityStore.getState().isUsingAssistiveTechnology()
      ).toBe(true);
    });

    it('should detect assistive technology via high contrast', () => {
      useAccessibilityStore.getState().setHighContrast(true);
      expect(
        useAccessibilityStore.getState().isUsingAssistiveTechnology()
      ).toBe(true);
    });
  });

  describe('DOM updates', () => {
    it('should update DOM styles when setting high contrast', () => {
      useAccessibilityStore.getState().setHighContrast(true);

      expect(mockDocumentElement.classList.add).toHaveBeenCalledWith(
        'high-contrast'
      );
    });

    it('should update DOM styles when setting reduced motion', () => {
      useAccessibilityStore.getState().setReducedMotion(true);

      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
        '--motion-duration',
        '0s'
      );
      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
        '--motion-scale',
        '1'
      );
    });

    it('should update font size in DOM', () => {
      useAccessibilityStore.getState().setFontSize('large');

      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
        '--base-font-size',
        '18px'
      );
    });

    it('should update focus visible in DOM', () => {
      useAccessibilityStore.getState().setFocusVisible(true);

      expect(mockDocumentElement.classList.add).toHaveBeenCalledWith(
        'focus-visible'
      );
    });

    it('should update screen reader optimization in DOM', () => {
      useAccessibilityStore.getState().setScreenReader(true);

      expect(mockDocumentElement.classList.add).toHaveBeenCalledWith(
        'screen-reader-optimized'
      );
    });
  });
});
