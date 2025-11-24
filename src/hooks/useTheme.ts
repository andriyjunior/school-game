import { useState, useEffect, useCallback } from 'react';
import { themes, defaultTheme, getTheme, Theme } from '../themes';

const THEME_STORAGE_KEY = 'app-theme';

export function useTheme() {
  const [themeName, setThemeName] = useState<string>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved && themes[saved] ? saved : defaultTheme;
  });

  const theme = getTheme(themeName);

  // Apply theme CSS variables to document
  const applyTheme = useCallback((theme: Theme) => {
    const root = document.documentElement;

    // Colors
    root.style.setProperty('--theme-primary', theme.colors.primary);
    root.style.setProperty('--theme-primary-dark', theme.colors.primaryDark);
    root.style.setProperty('--theme-secondary', theme.colors.secondary);
    root.style.setProperty('--theme-accent', theme.colors.accent);
    root.style.setProperty('--theme-success', theme.colors.success);
    root.style.setProperty('--theme-danger', theme.colors.danger);
    root.style.setProperty('--theme-warning', theme.colors.warning);
    root.style.setProperty('--theme-background', theme.colors.background);
    root.style.setProperty('--theme-background-gradient', theme.colors.backgroundGradient);
    root.style.setProperty('--theme-card-bg', theme.colors.cardBg);
    root.style.setProperty('--theme-text', theme.colors.text);
    root.style.setProperty('--theme-text-muted', theme.colors.textMuted);

    // Gradients
    root.style.setProperty('--theme-gradient-primary', theme.gradients.primary);
    root.style.setProperty('--theme-gradient-secondary', theme.gradients.secondary);
    root.style.setProperty('--theme-gradient-success', theme.gradients.success);
    root.style.setProperty('--theme-gradient-danger', theme.gradients.danger);
    root.style.setProperty('--theme-gradient-button1', theme.gradients.button1);
    root.style.setProperty('--theme-gradient-button2', theme.gradients.button2);
    root.style.setProperty('--theme-gradient-button3', theme.gradients.button3);
    root.style.setProperty('--theme-gradient-button4', theme.gradients.button4);
  }, []);

  // Apply theme on mount and when it changes
  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_STORAGE_KEY, themeName);
  }, [theme, themeName, applyTheme]);

  const changeTheme = useCallback((newTheme: string) => {
    if (themes[newTheme]) {
      setThemeName(newTheme);
    }
  }, []);

  return {
    theme,
    themeName,
    changeTheme,
    availableThemes: Object.entries(themes).map(([key, value]) => ({
      key,
      name: value.name,
      emoji: value.emoji,
    })),
  };
}

export default useTheme;
