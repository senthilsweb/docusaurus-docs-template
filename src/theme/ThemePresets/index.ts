/**
 * Documentation Theme Presets
 * 
 * Pre-configured color themes for quick styling.
 * Inspired by popular platforms and tools.
 */

export interface ThemePreset {
  name: string;
  primaryColor: string;
  primaryColorDark: string;  // For dark mode
  accentColor: string;
  accentColorDark: string;   // For dark mode
  description?: string;
}

/**
 * Slack-inspired theme with purple tones
 */
export const slackTheme: ThemePreset = {
  name: 'Slack',
  primaryColor: '#4A154B',
  primaryColorDark: '#9B59B6',
  accentColor: '#611f69',
  accentColorDark: '#A855F7',
  description: 'Slack-inspired purple theme',
};

/**
 * Microsoft Teams-inspired theme
 */
export const teamsTheme: ThemePreset = {
  name: 'Teams',
  primaryColor: '#5B5FC7',
  primaryColorDark: '#818CF8',
  accentColor: '#464EB8',
  accentColorDark: '#6366F1',
  description: 'Microsoft Teams-inspired theme',
};

/**
 * Discord-inspired dark theme
 */
export const discordTheme: ThemePreset = {
  name: 'Discord',
  primaryColor: '#5865F2',
  primaryColorDark: '#7C85F4',
  accentColor: '#4752C4',
  accentColorDark: '#5865F2',
  description: 'Discord-inspired blurple theme',
};

/**
 * WhatsApp-inspired green theme
 */
export const whatsappTheme: ThemePreset = {
  name: 'WhatsApp',
  primaryColor: '#075E54',
  primaryColorDark: '#25D366',
  accentColor: '#25D366',
  accentColorDark: '#34D058',
  description: 'WhatsApp-inspired green theme',
};

/**
 * Telegram-inspired blue theme
 */
export const telegramTheme: ThemePreset = {
  name: 'Telegram',
  primaryColor: '#0088cc',
  primaryColorDark: '#229ED9',
  accentColor: '#229ED9',
  accentColorDark: '#54AEE3',
  description: 'Telegram-inspired blue theme',
};

/**
 * iMessage-inspired theme
 */
export const imessageTheme: ThemePreset = {
  name: 'iMessage',
  primaryColor: '#007AFF',
  primaryColorDark: '#0A84FF',
  accentColor: '#34C759',
  accentColorDark: '#30D158',
  description: 'Apple iMessage-inspired theme',
};

/**
 * Zendesk-inspired theme
 */
export const zendeskTheme: ThemePreset = {
  name: 'Zendesk',
  primaryColor: '#03363D',
  primaryColorDark: '#17494D',
  accentColor: '#17494D',
  accentColorDark: '#228B9D',
  description: 'Zendesk-inspired teal theme',
};

/**
 * Intercom-inspired theme
 */
export const intercomTheme: ThemePreset = {
  name: 'Intercom',
  primaryColor: '#286EFA',
  primaryColorDark: '#4D8DFF',
  accentColor: '#1F59C7',
  accentColorDark: '#286EFA',
  description: 'Intercom-inspired blue theme',
};

/**
 * Default green theme (current)
 */
export const defaultTheme: ThemePreset = {
  name: 'Default',
  primaryColor: '#2e8555',
  primaryColorDark: '#25c2a0',
  accentColor: '#e94560',
  accentColorDark: '#ff6b7a',
  description: 'Default documentation green theme',
};

/**
 * Ocean blue theme
 */
export const oceanTheme: ThemePreset = {
  name: 'Ocean',
  primaryColor: '#0369a1',
  primaryColorDark: '#38bdf8',
  accentColor: '#0284c7',
  accentColorDark: '#22d3ee',
  description: 'Deep ocean blue theme',
};

/**
 * Sunset orange theme
 */
export const sunsetTheme: ThemePreset = {
  name: 'Sunset',
  primaryColor: '#c2410c',
  primaryColorDark: '#fb923c',
  accentColor: '#ea580c',
  accentColorDark: '#f97316',
  description: 'Warm sunset orange theme',
};

/**
 * Forest green theme
 */
export const forestTheme: ThemePreset = {
  name: 'Forest',
  primaryColor: '#166534',
  primaryColorDark: '#4ade80',
  accentColor: '#15803d',
  accentColorDark: '#22c55e',
  description: 'Deep forest green theme',
};

/**
 * Rose theme
 */
export const roseTheme: ThemePreset = {
  name: 'Rose',
  primaryColor: '#be123c',
  primaryColorDark: '#fb7185',
  accentColor: '#e11d48',
  accentColorDark: '#f43f5e',
  description: 'Elegant rose theme',
};

/**
 * All available theme presets
 */
export const themePresets = {
  default: defaultTheme,
  slack: slackTheme,
  teams: teamsTheme,
  discord: discordTheme,
  whatsapp: whatsappTheme,
  telegram: telegramTheme,
  imessage: imessageTheme,
  zendesk: zendeskTheme,
  intercom: intercomTheme,
  ocean: oceanTheme,
  sunset: sunsetTheme,
  forest: forestTheme,
  rose: roseTheme,
} as const;

export type ThemePresetName = keyof typeof themePresets;

/**
 * Get a theme preset by name
 */
export function getTheme(name: ThemePresetName): ThemePreset {
  return themePresets[name];
}

/**
 * Get all theme names
 */
export function getThemeNames(): ThemePresetName[] {
  return Object.keys(themePresets) as ThemePresetName[];
}

/**
 * Generate color variations for a base color
 */
export function generateColorPalette(baseColor: string): {
  base: string;
  dark: string;
  darker: string;
  darkest: string;
  light: string;
  lighter: string;
  lightest: string;
} {
  return {
    base: baseColor,
    dark: baseColor,
    darker: baseColor,
    darkest: baseColor,
    light: baseColor,
    lighter: baseColor,
    lightest: baseColor,
  };
}
