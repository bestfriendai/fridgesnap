import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = '@fridgio_theme_mode';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  background: string;
  backgroundSecondary: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  accent: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  error: string;
  success: string;
  warning: string;
  white: string;
  black: string;
  gray50: string;
  gray100: string;
  gray200: string;
  gray300: string;
  gray400: string;
  gray500: string;
  gray600: string;
  gray700: string;
  gray800: string;
  gray900: string;
}

export const lightColors: ThemeColors = {
  background: '#FFFFFF',
  backgroundSecondary: '#F9FAFB',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  accent: '#22C55E',
  primary: '#22C55E',
  primaryLight: '#4ADE80',
  primaryDark: '#16A34A',
  error: '#EF4444',
  success: '#22C55E',
  warning: '#F59E0B',
  white: '#FFFFFF',
  black: '#1A1A1A',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
};

export const darkColors: ThemeColors = {
  background: '#111827',
  backgroundSecondary: '#1F2937',
  surface: '#1F2937',
  card: '#374151',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  border: '#374151',
  accent: '#4ADE80',
  primary: '#22C55E',
  primaryLight: '#4ADE80',
  primaryDark: '#16A34A',
  error: '#F87171',
  success: '#4ADE80',
  warning: '#FBBF24',
  white: '#FFFFFF',
  black: '#1A1A1A',
  gray50: '#111827',
  gray100: '#1F2937',
  gray200: '#374151',
  gray300: '#4B5563',
  gray400: '#6B7280',
  gray500: '#9CA3AF',
  gray600: '#D1D5DB',
  gray700: '#E5E7EB',
  gray800: '#F3F4F6',
  gray900: '#F9FAFB',
};

interface ThemeContextValue {
  themeMode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  themeMode: 'system',
  isDark: false,
  colors: lightColors,
  setThemeMode: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setThemeModeState(stored);
      }
      setIsLoaded(true);
    });
  }, []);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
  }, []);

  const isDark = themeMode === 'system' ? systemScheme === 'dark' : themeMode === 'dark';
  const themeColors = isDark ? darkColors : lightColors;

  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ themeMode, isDark, colors: themeColors, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeColors(): ThemeColors {
  return useContext(ThemeContext).colors;
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
