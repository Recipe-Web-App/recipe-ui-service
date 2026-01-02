import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useUserPreferences,
  useCurrentUserPreferences,
  useUpdateUserPreferences,
  usePreferenceCategory,
  useNotificationPreferences,
  useDisplayPreferences,
  usePrivacyPreferences,
  useAccessibilityPreferences,
  useLanguagePreferences,
  useSecurityPreferences,
  useSocialPreferences,
  useSoundPreferences,
  useThemePreferences,
  useUpdateNotificationPreferences,
  useUpdateDisplayPreferences,
  useUpdatePrivacyPreferences,
  useUpdateAccessibilityPreferences,
  useUpdateLanguagePreferences,
  useUpdateSecurityPreferences,
  useUpdateSocialPreferences,
  useUpdateSoundPreferences,
  useUpdateThemePreferences,
  useResetPreferenceCategory,
  useAllPreferencesFlat,
} from '@/hooks/user-management/usePreferences';
import { preferencesApi } from '@/lib/api/user-management';
import { useAuthStore } from '@/stores/auth-store';
import type {
  UserPreferencesResponse,
  PreferenceCategoryResponse,
} from '@/types/user-management';

// Mock the API
jest.mock('@/lib/api/user-management', () => ({
  preferencesApi: {
    getUserPreferences: jest.fn(),
    updateUserPreferences: jest.fn(),
    getPreferenceCategory: jest.fn(),
    getNotificationPreferences: jest.fn(),
    updateNotificationPreferences: jest.fn(),
    getDisplayPreferences: jest.fn(),
    updateDisplayPreferences: jest.fn(),
    getPrivacyPreferences: jest.fn(),
    updatePrivacyPreferences: jest.fn(),
    getAccessibilityPreferences: jest.fn(),
    updateAccessibilityPreferences: jest.fn(),
    getLanguagePreferences: jest.fn(),
    updateLanguagePreferences: jest.fn(),
    getSecurityPreferences: jest.fn(),
    updateSecurityPreferences: jest.fn(),
    getSocialPreferences: jest.fn(),
    updateSocialPreferences: jest.fn(),
    getSoundPreferences: jest.fn(),
    updateSoundPreferences: jest.fn(),
    getThemePreferences: jest.fn(),
    updateThemePreferences: jest.fn(),
    resetPreferenceCategory: jest.fn(),
    getAllPreferencesFlat: jest.fn(),
  },
}));

// Mock the auth store
jest.mock('@/stores/auth-store', () => ({
  useAuthStore: jest.fn(),
}));

const mockedPreferencesApi = preferencesApi as jest.Mocked<
  typeof preferencesApi
>;
const mockedUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof useAuthStore
>;

// Create wrapper component
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('usePreferences hooks', () => {
  const userId = 'user-123';

  const mockFullPreferences: UserPreferencesResponse = {
    userId,
    notification: {
      emailNotifications: true,
      pushNotifications: true,
    },
    display: {
      fontSize: 'MEDIUM',
      compactMode: false,
    },
    privacy: {
      profileVisibility: 'PUBLIC',
    },
    accessibility: {
      highContrast: false,
    },
    language: {
      primaryLanguage: 'EN',
    },
    security: {
      twoFactorAuth: true,
    },
    social: {
      friendRequests: true,
    },
    sound: {
      muteNotifications: false,
    },
    theme: {
      darkMode: false,
    },
  };

  const mockCategoryResponse: PreferenceCategoryResponse = {
    userId,
    category: 'notification',
    preferences: { emailNotifications: true },
    updatedAt: '2024-01-01T00:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { id: userId, name: 'Test User', email: 'test@example.com' },
      authUser: null,
      token: 'mock-token',
      setAuthUser: jest.fn(),
      setToken: jest.fn(),
      clearAuth: jest.fn(),
    });
  });

  describe('useUserPreferences', () => {
    it('should fetch user preferences', async () => {
      mockedPreferencesApi.getUserPreferences.mockResolvedValue(
        mockFullPreferences
      );

      const { result } = renderHook(() => useUserPreferences(userId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedPreferencesApi.getUserPreferences).toHaveBeenCalledWith(
        userId,
        { categories: undefined }
      );
      expect(result.current.data).toEqual(mockFullPreferences);
    });

    it('should fetch preferences with category filter', async () => {
      mockedPreferencesApi.getUserPreferences.mockResolvedValue(
        mockFullPreferences
      );

      const { result } = renderHook(
        () => useUserPreferences(userId, ['notification', 'display']),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedPreferencesApi.getUserPreferences).toHaveBeenCalledWith(
        userId,
        { categories: ['notification', 'display'] }
      );
    });

    it('should not fetch when userId is empty', () => {
      const { result } = renderHook(() => useUserPreferences(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedPreferencesApi.getUserPreferences).not.toHaveBeenCalled();
    });
  });

  describe('useCurrentUserPreferences', () => {
    it('should fetch current user preferences using user.id from auth store', async () => {
      mockedPreferencesApi.getUserPreferences.mockResolvedValue(
        mockFullPreferences
      );

      const { result } = renderHook(() => useCurrentUserPreferences(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedPreferencesApi.getUserPreferences).toHaveBeenCalledWith(
        userId,
        { categories: undefined }
      );
      expect(result.current.data).toEqual(mockFullPreferences);
    });

    it('should not fetch when not authenticated', () => {
      mockedUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        user: null,
        authUser: null,
        token: null,
        setAuthUser: jest.fn(),
        setToken: jest.fn(),
        clearAuth: jest.fn(),
      });

      const { result } = renderHook(() => useCurrentUserPreferences(), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedPreferencesApi.getUserPreferences).not.toHaveBeenCalled();
    });

    it('should not fetch when user.id is not available', () => {
      mockedUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        user: null,
        authUser: null,
        token: 'mock-token',
        setAuthUser: jest.fn(),
        setToken: jest.fn(),
        clearAuth: jest.fn(),
      });

      const { result } = renderHook(() => useCurrentUserPreferences(), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedPreferencesApi.getUserPreferences).not.toHaveBeenCalled();
    });
  });

  describe('useUpdateUserPreferences', () => {
    it('should update user preferences', async () => {
      mockedPreferencesApi.updateUserPreferences.mockResolvedValue(
        mockFullPreferences
      );

      const { result } = renderHook(() => useUpdateUserPreferences(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        userId,
        data: { notification: { emailNotifications: false } },
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedPreferencesApi.updateUserPreferences).toHaveBeenCalledWith(
        userId,
        { notification: { emailNotifications: false } }
      );
    });
  });

  describe('usePreferenceCategory', () => {
    it('should fetch a specific preference category', async () => {
      mockedPreferencesApi.getPreferenceCategory.mockResolvedValue(
        mockCategoryResponse
      );

      const { result } = renderHook(
        () => usePreferenceCategory(userId, 'notification'),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedPreferencesApi.getPreferenceCategory).toHaveBeenCalledWith(
        userId,
        'notification'
      );
      expect(result.current.data).toEqual(mockCategoryResponse);
    });

    it('should not fetch when userId is empty', () => {
      const { result } = renderHook(
        () => usePreferenceCategory('', 'notification'),
        {
          wrapper: createWrapper(),
        }
      );

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedPreferencesApi.getPreferenceCategory).not.toHaveBeenCalled();
    });
  });

  describe('category-specific query hooks', () => {
    it('useNotificationPreferences should fetch notification preferences', async () => {
      mockedPreferencesApi.getNotificationPreferences.mockResolvedValue(
        mockCategoryResponse
      );

      const { result } = renderHook(() => useNotificationPreferences(userId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(
        mockedPreferencesApi.getNotificationPreferences
      ).toHaveBeenCalledWith(userId);
    });

    it('useDisplayPreferences should fetch display preferences', async () => {
      mockedPreferencesApi.getDisplayPreferences.mockResolvedValue({
        ...mockCategoryResponse,
        category: 'display',
      });

      const { result } = renderHook(() => useDisplayPreferences(userId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockedPreferencesApi.getDisplayPreferences).toHaveBeenCalledWith(
        userId
      );
    });

    it('usePrivacyPreferences should fetch privacy preferences', async () => {
      mockedPreferencesApi.getPrivacyPreferences.mockResolvedValue({
        ...mockCategoryResponse,
        category: 'privacy',
      });

      const { result } = renderHook(() => usePrivacyPreferences(userId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockedPreferencesApi.getPrivacyPreferences).toHaveBeenCalledWith(
        userId
      );
    });

    it('useAccessibilityPreferences should fetch accessibility preferences', async () => {
      mockedPreferencesApi.getAccessibilityPreferences.mockResolvedValue({
        ...mockCategoryResponse,
        category: 'accessibility',
      });

      const { result } = renderHook(() => useAccessibilityPreferences(userId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(
        mockedPreferencesApi.getAccessibilityPreferences
      ).toHaveBeenCalledWith(userId);
    });

    it('useLanguagePreferences should fetch language preferences', async () => {
      mockedPreferencesApi.getLanguagePreferences.mockResolvedValue({
        ...mockCategoryResponse,
        category: 'language',
      });

      const { result } = renderHook(() => useLanguagePreferences(userId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockedPreferencesApi.getLanguagePreferences).toHaveBeenCalledWith(
        userId
      );
    });

    it('useSecurityPreferences should fetch security preferences', async () => {
      mockedPreferencesApi.getSecurityPreferences.mockResolvedValue({
        ...mockCategoryResponse,
        category: 'security',
      });

      const { result } = renderHook(() => useSecurityPreferences(userId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockedPreferencesApi.getSecurityPreferences).toHaveBeenCalledWith(
        userId
      );
    });

    it('useSocialPreferences should fetch social preferences', async () => {
      mockedPreferencesApi.getSocialPreferences.mockResolvedValue({
        ...mockCategoryResponse,
        category: 'social',
      });

      const { result } = renderHook(() => useSocialPreferences(userId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockedPreferencesApi.getSocialPreferences).toHaveBeenCalledWith(
        userId
      );
    });

    it('useSoundPreferences should fetch sound preferences', async () => {
      mockedPreferencesApi.getSoundPreferences.mockResolvedValue({
        ...mockCategoryResponse,
        category: 'sound',
      });

      const { result } = renderHook(() => useSoundPreferences(userId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockedPreferencesApi.getSoundPreferences).toHaveBeenCalledWith(
        userId
      );
    });

    it('useThemePreferences should fetch theme preferences', async () => {
      mockedPreferencesApi.getThemePreferences.mockResolvedValue({
        ...mockCategoryResponse,
        category: 'theme',
      });

      const { result } = renderHook(() => useThemePreferences(userId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockedPreferencesApi.getThemePreferences).toHaveBeenCalledWith(
        userId
      );
    });
  });

  describe('category-specific mutation hooks', () => {
    it('useUpdateNotificationPreferences should update notification preferences', async () => {
      mockedPreferencesApi.updateNotificationPreferences.mockResolvedValue(
        mockCategoryResponse
      );

      const { result } = renderHook(() => useUpdateNotificationPreferences(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        userId,
        data: { emailNotifications: false },
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(
        mockedPreferencesApi.updateNotificationPreferences
      ).toHaveBeenCalledWith(userId, { emailNotifications: false });
    });

    it('useUpdateDisplayPreferences should update display preferences', async () => {
      mockedPreferencesApi.updateDisplayPreferences.mockResolvedValue({
        ...mockCategoryResponse,
        category: 'display',
      });

      const { result } = renderHook(() => useUpdateDisplayPreferences(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        userId,
        data: { fontSize: 'LARGE' },
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(
        mockedPreferencesApi.updateDisplayPreferences
      ).toHaveBeenCalledWith(userId, { fontSize: 'LARGE' });
    });

    it('useUpdatePrivacyPreferences should update privacy preferences', async () => {
      mockedPreferencesApi.updatePrivacyPreferences.mockResolvedValue({
        ...mockCategoryResponse,
        category: 'privacy',
      });

      const { result } = renderHook(() => useUpdatePrivacyPreferences(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        userId,
        data: { profileVisibility: 'PRIVATE' },
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(
        mockedPreferencesApi.updatePrivacyPreferences
      ).toHaveBeenCalledWith(userId, { profileVisibility: 'PRIVATE' });
    });

    it('useUpdateAccessibilityPreferences should update accessibility preferences', async () => {
      mockedPreferencesApi.updateAccessibilityPreferences.mockResolvedValue({
        ...mockCategoryResponse,
        category: 'accessibility',
      });

      const { result } = renderHook(() => useUpdateAccessibilityPreferences(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        userId,
        data: { highContrast: true },
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(
        mockedPreferencesApi.updateAccessibilityPreferences
      ).toHaveBeenCalledWith(userId, { highContrast: true });
    });

    it('useUpdateLanguagePreferences should update language preferences', async () => {
      mockedPreferencesApi.updateLanguagePreferences.mockResolvedValue({
        ...mockCategoryResponse,
        category: 'language',
      });

      const { result } = renderHook(() => useUpdateLanguagePreferences(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        userId,
        data: { primaryLanguage: 'ES' },
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(
        mockedPreferencesApi.updateLanguagePreferences
      ).toHaveBeenCalledWith(userId, { primaryLanguage: 'ES' });
    });

    it('useUpdateSecurityPreferences should update security preferences', async () => {
      mockedPreferencesApi.updateSecurityPreferences.mockResolvedValue({
        ...mockCategoryResponse,
        category: 'security',
      });

      const { result } = renderHook(() => useUpdateSecurityPreferences(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        userId,
        data: { twoFactorAuth: true },
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(
        mockedPreferencesApi.updateSecurityPreferences
      ).toHaveBeenCalledWith(userId, { twoFactorAuth: true });
    });

    it('useUpdateSocialPreferences should update social preferences', async () => {
      mockedPreferencesApi.updateSocialPreferences.mockResolvedValue({
        ...mockCategoryResponse,
        category: 'social',
      });

      const { result } = renderHook(() => useUpdateSocialPreferences(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        userId,
        data: { friendRequests: false },
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockedPreferencesApi.updateSocialPreferences).toHaveBeenCalledWith(
        userId,
        { friendRequests: false }
      );
    });

    it('useUpdateSoundPreferences should update sound preferences', async () => {
      mockedPreferencesApi.updateSoundPreferences.mockResolvedValue({
        ...mockCategoryResponse,
        category: 'sound',
      });

      const { result } = renderHook(() => useUpdateSoundPreferences(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        userId,
        data: { muteNotifications: true },
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockedPreferencesApi.updateSoundPreferences).toHaveBeenCalledWith(
        userId,
        { muteNotifications: true }
      );
    });

    it('useUpdateThemePreferences should update theme preferences', async () => {
      mockedPreferencesApi.updateThemePreferences.mockResolvedValue({
        ...mockCategoryResponse,
        category: 'theme',
      });

      const { result } = renderHook(() => useUpdateThemePreferences(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        userId,
        data: { darkMode: true },
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockedPreferencesApi.updateThemePreferences).toHaveBeenCalledWith(
        userId,
        { darkMode: true }
      );
    });
  });

  describe('useResetPreferenceCategory', () => {
    it('should reset a preference category', async () => {
      mockedPreferencesApi.resetPreferenceCategory.mockResolvedValue(
        mockCategoryResponse
      );

      const { result } = renderHook(() => useResetPreferenceCategory(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        userId,
        category: 'notification',
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockedPreferencesApi.resetPreferenceCategory).toHaveBeenCalledWith(
        userId,
        'notification'
      );
    });
  });

  describe('useAllPreferencesFlat', () => {
    it('should fetch all preferences in flat format', async () => {
      const flatPreferences = {
        emailNotifications: true,
        darkMode: false,
        fontSize: 'medium',
      };

      mockedPreferencesApi.getAllPreferencesFlat.mockResolvedValue(
        flatPreferences
      );

      const { result } = renderHook(() => useAllPreferencesFlat(userId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockedPreferencesApi.getAllPreferencesFlat).toHaveBeenCalledWith(
        userId
      );
      expect(result.current.data).toEqual(flatPreferences);
    });

    it('should not fetch when userId is empty', () => {
      const { result } = renderHook(() => useAllPreferencesFlat(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedPreferencesApi.getAllPreferencesFlat).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle fetch error in useUserPreferences', async () => {
      const error = new Error('Fetch failed');
      mockedPreferencesApi.getUserPreferences.mockRejectedValue(error);

      const { result } = renderHook(() => useUserPreferences(userId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBe(error);
    });

    it('should handle mutation error in useUpdateUserPreferences', async () => {
      const error = new Error('Update failed');
      mockedPreferencesApi.updateUserPreferences.mockRejectedValue(error);

      const { result } = renderHook(() => useUpdateUserPreferences(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        userId,
        data: { notification: { emailNotifications: false } },
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBe(error);
    });
  });
});
