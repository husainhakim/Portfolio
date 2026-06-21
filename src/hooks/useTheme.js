import { useState, useEffect, useCallback } from 'react';

const THEMES = ['matrix', 'green', 'amber', 'solarized'];

export function useTheme() {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('portfolio-theme') || 'matrix';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  const setTheme = useCallback((t) => {
    if (THEMES.includes(t)) setThemeState(t);
  }, []);

  const cycleTheme = useCallback(() => {
    setThemeState(prev => {
      const idx = THEMES.indexOf(prev);
      return THEMES[(idx + 1) % THEMES.length];
    });
  }, []);

  return { theme, setTheme, cycleTheme, themes: THEMES };
}
