import React, { useEffect } from 'react';
import { themePresets, type ThemePresetName, type ThemePreset } from './ThemePresets';

const THEME_STORAGE_KEY = 'docusaurus.theme.preset';

/**
 * Adjust color brightness
 */
function adjustColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, Math.max(0, (num >> 16) + amt));
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amt));
  const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
}

/**
 * Convert hex to rgba
 */
function hexToRgba(hex: string, alpha: number): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(0, 0, 0, ${alpha})`;
  return `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`;
}

/**
 * Apply theme CSS variables
 */
function applyTheme(theme: ThemePreset, isDark: boolean): void {
  const root = document.documentElement;
  const baseColor = isDark ? theme.primaryColorDark : theme.primaryColor;
  const accentColor = isDark ? theme.accentColorDark : theme.accentColor;
  
  root.style.setProperty('--ifm-color-primary', baseColor);
  root.style.setProperty('--ifm-color-primary-dark', adjustColor(baseColor, -10));
  root.style.setProperty('--ifm-color-primary-darker', adjustColor(baseColor, -15));
  root.style.setProperty('--ifm-color-primary-darkest', adjustColor(baseColor, -25));
  root.style.setProperty('--ifm-color-primary-light', adjustColor(baseColor, 10));
  root.style.setProperty('--ifm-color-primary-lighter', adjustColor(baseColor, 20));
  root.style.setProperty('--ifm-color-primary-lightest', adjustColor(baseColor, 30));
  root.style.setProperty('--accent-color', accentColor);
  root.style.setProperty('--docusaurus-highlighted-code-line-bg', hexToRgba(baseColor, isDark ? 0.2 : 0.1));
}

export default function Root({ children }: { children: React.ReactNode }): React.ReactElement {
  useEffect(() => {
    // Load and apply saved theme on mount
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemePresetName | null;
    if (savedTheme && themePresets[savedTheme]) {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      applyTheme(themePresets[savedTheme], isDark);
    }

    // Watch for color mode changes
    const observer = new MutationObserver(() => {
      const currentTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemePresetName | null;
      if (currentTheme && themePresets[currentTheme]) {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        applyTheme(themePresets[currentTheme], isDark);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
}
