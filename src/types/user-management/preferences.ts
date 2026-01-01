import type {
  FontSizeEnum,
  ColorSchemeEnum,
  LayoutDensityEnum,
  ProfileVisibilityEnum,
  LanguageEnum,
  ThemeEnum,
  PreferenceCategory,
} from './common';

// ============================================================================
// Notification Preferences
// ============================================================================
export interface NotificationPreferences {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  smsNotifications?: boolean;
  marketingEmails?: boolean;
  securityAlerts?: boolean;
  activitySummaries?: boolean;
  recipeRecommendations?: boolean;
  socialInteractions?: boolean;
  updatedAt?: string;
}

export interface NotificationPreferencesUpdate {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  smsNotifications?: boolean;
  marketingEmails?: boolean;
  securityAlerts?: boolean;
  activitySummaries?: boolean;
  recipeRecommendations?: boolean;
  socialInteractions?: boolean;
}

// ============================================================================
// Display Preferences
// ============================================================================
export interface DisplayPreferences {
  fontSize?: FontSizeEnum;
  colorScheme?: ColorSchemeEnum;
  layoutDensity?: LayoutDensityEnum;
  showImages?: boolean;
  compactMode?: boolean;
  updatedAt?: string;
}

export interface DisplayPreferencesUpdate {
  fontSize?: FontSizeEnum;
  colorScheme?: ColorSchemeEnum;
  layoutDensity?: LayoutDensityEnum;
  showImages?: boolean;
  compactMode?: boolean;
}

// ============================================================================
// Privacy Preferences
// ============================================================================
export interface PrivacyPreferences {
  profileVisibility?: ProfileVisibilityEnum;
  recipeVisibility?: ProfileVisibilityEnum;
  activityVisibility?: ProfileVisibilityEnum;
  contactInfoVisibility?: ProfileVisibilityEnum;
  dataSharing?: boolean;
  analyticsTracking?: boolean;
  updatedAt?: string;
}

export interface PrivacyPreferencesUpdate {
  profileVisibility?: ProfileVisibilityEnum;
  recipeVisibility?: ProfileVisibilityEnum;
  activityVisibility?: ProfileVisibilityEnum;
  contactInfoVisibility?: ProfileVisibilityEnum;
  dataSharing?: boolean;
  analyticsTracking?: boolean;
}

// ============================================================================
// Accessibility Preferences
// ============================================================================
export interface AccessibilityPreferences {
  screenReader?: boolean;
  highContrast?: boolean;
  reducedMotion?: boolean;
  largeText?: boolean;
  keyboardNavigation?: boolean;
  updatedAt?: string;
}

export interface AccessibilityPreferencesUpdate {
  screenReader?: boolean;
  highContrast?: boolean;
  reducedMotion?: boolean;
  largeText?: boolean;
  keyboardNavigation?: boolean;
}

// ============================================================================
// Language Preferences
// ============================================================================
export interface LanguagePreferences {
  primaryLanguage?: LanguageEnum;
  secondaryLanguage?: LanguageEnum;
  translationEnabled?: boolean;
  updatedAt?: string;
}

export interface LanguagePreferencesUpdate {
  primaryLanguage?: LanguageEnum;
  secondaryLanguage?: LanguageEnum;
  translationEnabled?: boolean;
}

// ============================================================================
// Security Preferences
// ============================================================================
export interface SecurityPreferences {
  twoFactorAuth?: boolean;
  loginNotifications?: boolean;
  sessionTimeout?: boolean;
  passwordRequirements?: boolean;
  updatedAt?: string;
}

export interface SecurityPreferencesUpdate {
  twoFactorAuth?: boolean;
  loginNotifications?: boolean;
  sessionTimeout?: boolean;
  passwordRequirements?: boolean;
}

// ============================================================================
// Social Preferences
// ============================================================================
export interface SocialPreferences {
  friendRequests?: boolean;
  messageNotifications?: boolean;
  groupInvites?: boolean;
  shareActivity?: boolean;
  updatedAt?: string;
}

export interface SocialPreferencesUpdate {
  friendRequests?: boolean;
  messageNotifications?: boolean;
  groupInvites?: boolean;
  shareActivity?: boolean;
}

// ============================================================================
// Sound Preferences
// ============================================================================
export interface SoundPreferences {
  notificationSounds?: boolean;
  systemSounds?: boolean;
  volumeLevel?: boolean;
  muteNotifications?: boolean;
  updatedAt?: string;
}

export interface SoundPreferencesUpdate {
  notificationSounds?: boolean;
  systemSounds?: boolean;
  volumeLevel?: boolean;
  muteNotifications?: boolean;
}

// ============================================================================
// Theme Preferences
// ============================================================================
export interface ThemePreferences {
  darkMode?: boolean;
  lightMode?: boolean;
  autoTheme?: boolean;
  customTheme?: ThemeEnum;
  updatedAt?: string;
}

export interface ThemePreferencesUpdate {
  darkMode?: boolean;
  lightMode?: boolean;
  autoTheme?: boolean;
  customTheme?: ThemeEnum;
}

// ============================================================================
// Combined User Preferences Response
// ============================================================================
export interface UserPreferencesResponse {
  userId: string;
  notification?: NotificationPreferences;
  display?: DisplayPreferences;
  privacy?: PrivacyPreferences;
  accessibility?: AccessibilityPreferences;
  language?: LanguagePreferences;
  security?: SecurityPreferences;
  social?: SocialPreferences;
  sound?: SoundPreferences;
  theme?: ThemePreferences;
}

// ============================================================================
// Bulk Update Request
// ============================================================================
export interface UserPreferencesUpdateRequest {
  notification?: NotificationPreferencesUpdate;
  display?: DisplayPreferencesUpdate;
  privacy?: PrivacyPreferencesUpdate;
  accessibility?: AccessibilityPreferencesUpdate;
  language?: LanguagePreferencesUpdate;
  security?: SecurityPreferencesUpdate;
  social?: SocialPreferencesUpdate;
  sound?: SoundPreferencesUpdate;
  theme?: ThemePreferencesUpdate;
}

// ============================================================================
// Single Category Response
// ============================================================================
export interface PreferenceCategoryResponse {
  userId: string;
  category: PreferenceCategory;
  preferences: Record<string, unknown>;
  updatedAt: string;
}

// ============================================================================
// Preference Update Union Type
// ============================================================================
export type PreferenceCategoryUpdate =
  | NotificationPreferencesUpdate
  | DisplayPreferencesUpdate
  | PrivacyPreferencesUpdate
  | AccessibilityPreferencesUpdate
  | LanguagePreferencesUpdate
  | SecurityPreferencesUpdate
  | SocialPreferencesUpdate
  | SoundPreferencesUpdate
  | ThemePreferencesUpdate;

// ============================================================================
// Category to Type Mapping (for type-safe access)
// ============================================================================
export interface PreferenceCategoryMap {
  notification: NotificationPreferences;
  display: DisplayPreferences;
  privacy: PrivacyPreferences;
  accessibility: AccessibilityPreferences;
  language: LanguagePreferences;
  security: SecurityPreferences;
  social: SocialPreferences;
  sound: SoundPreferences;
  theme: ThemePreferences;
}

export interface PreferenceCategoryUpdateMap {
  notification: NotificationPreferencesUpdate;
  display: DisplayPreferencesUpdate;
  privacy: PrivacyPreferencesUpdate;
  accessibility: AccessibilityPreferencesUpdate;
  language: LanguagePreferencesUpdate;
  security: SecurityPreferencesUpdate;
  social: SocialPreferencesUpdate;
  sound: SoundPreferencesUpdate;
  theme: ThemePreferencesUpdate;
}
