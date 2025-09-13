export type Theme = 'light' | 'dark' | 'system';
export type FontSize = 'small' | 'medium' | 'large';

export interface ThemeConfig {
  theme: Theme;
  systemTheme: 'light' | 'dark';
  effectiveTheme: 'light' | 'dark';
  fontSize: FontSize;
  reducedMotion: boolean;
  highContrast: boolean;
}
