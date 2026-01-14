import React, { useState, useEffect, useRef } from 'react';
import { themePresets, type ThemePresetName, type ThemePreset } from '../ThemePresets';
import styles from './styles.module.css';

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

/**
 * Get a preview color swatch for a theme
 */
function ThemeColorPreview({ theme }: { theme: ThemePreset }) {
  return (
    <div className={styles.colorPreview}>
      <span 
        className={styles.colorSwatch} 
        style={{ backgroundColor: theme.primaryColor }}
      />
      <span 
        className={styles.colorSwatch} 
        style={{ backgroundColor: theme.accentColor }}
      />
    </div>
  );
}

export default function ThemeSwitcher(): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemePresetName>('default');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemePresetName | null;
    if (saved && themePresets[saved]) {
      setCurrentTheme(saved);
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      applyTheme(themePresets[saved], isDark);
    }
  }, []);

  // Watch for color mode changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const theme = themePresets[currentTheme];
      applyTheme(theme, isDark);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, [currentTheme]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeChange = (themeName: ThemePresetName) => {
    setCurrentTheme(themeName);
    localStorage.setItem(THEME_STORAGE_KEY, themeName);
    
    const theme = themePresets[themeName];
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    applyTheme(theme, isDark);
    
    setIsOpen(false);
  };

  const currentThemeData = themePresets[currentTheme];

  return (
    <div className={styles.themeSwitcher} ref={dropdownRef}>
      <button
        className={styles.themeTrigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select color theme"
        title="Color Theme"
      >
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a10 10 0 0 0 0 20" fill="currentColor" opacity="0.3" />
          <circle cx="12" cy="12" r="4" fill="currentColor" />
        </svg>
        <ThemeColorPreview theme={currentThemeData} />
      </button>

      {isOpen && (
        <div className={styles.themeDropdown}>
          <div className={styles.dropdownHeader}>
            <span>Color Theme</span>
          </div>
          <div className={styles.themeList}>
            {(Object.entries(themePresets) as [ThemePresetName, ThemePreset][]).map(([name, theme]) => (
              <button
                key={name}
                className={`${styles.themeOption} ${currentTheme === name ? styles.active : ''}`}
                onClick={() => handleThemeChange(name)}
              >
                <span className={styles.themeName}>{theme.name}</span>
                <ThemeColorPreview theme={theme} />
                {currentTheme === name && (
                  <svg 
                    className={styles.checkIcon}
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
