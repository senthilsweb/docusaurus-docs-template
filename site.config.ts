/**
 * Site Configuration
 * 
 * This file contains all the customizable settings for your documentation site.
 * Modify these values to personalize your site without touching the main docusaurus.config.ts
 */

export interface SiteConfig {
  // Basic Site Information
  title: string;
  tagline: string;
  url: string;
  baseUrl: string;
  
  // Organization/Project
  organizationName: string;
  projectName: string;
  
  // Branding
  logo: {
    alt: string;
    src: string;
    srcDark?: string;
  };
  favicon: string;
  socialCard: string;
  
  // Navbar
  navbar: {
    title: string; // Text next to logo (leave empty to show only logo)
    items: NavbarItem[];
  };
  
  // Footer
  footer: {
    style: 'dark' | 'light';
    copyright: string;
    links: FooterLinkSection[];
    socialLinks?: SocialLink[];
  };
  
  // External Links
  githubUrl?: string;
  editUrl?: string;
  
  // Theme Colors (CSS custom properties)
  theme: {
    light: ThemeColors;
    dark: ThemeColors;
  };
}

export interface NavbarItem {
  type?: 'docSidebar' | 'dropdown' | 'search' | 'localeDropdown' | 'docsVersionDropdown';
  sidebarId?: string;
  label: string;
  to?: string;
  href?: string;
  position: 'left' | 'right';
  className?: string;
  'aria-label'?: string;
}

export interface FooterLinkSection {
  title: string;
  items: FooterLink[];
}

export interface FooterLink {
  label?: string;
  to?: string;
  href?: string;
  html?: string;
}

export interface SocialLink {
  platform: 'github' | 'linkedin' | 'twitter' | 'youtube' | 'discord' | 'slack';
  url: string;
}

export interface ThemeColors {
  primary: string;
  primaryDark: string;
  primaryDarker: string;
  primaryDarkest: string;
  primaryLight: string;
  primaryLighter: string;
  primaryLightest: string;
  accentColor?: string;
  backgroundColor?: string;
  surfaceColor?: string;
}

// ============================================
// YOUR SITE CONFIGURATION - EDIT BELOW
// ============================================

const siteConfig: SiteConfig = {
  // Basic Site Information
  title: 'My Documentation',
  tagline: 'Your project tagline goes here',
  url: 'https://docs.example.com',
  baseUrl: '/',
  
  // Organization/Project (for GitHub Pages deployment)
  organizationName: 'your-org', // Your GitHub org/user name
  projectName: 'your-project', // Your repo name
  
  // Branding
  logo: {
    alt: 'Logo',
    src: 'img/logo.svg',
    srcDark: 'img/logo-dark.svg', // Optional: different logo for dark mode
  },
  favicon: 'img/favicon.svg',
  socialCard: 'img/social-card.svg',
  
  // Navbar Configuration
  // Note: API Reference is automatically added by the Scalar plugin - no need to add manually
  navbar: {
    title: 'My Project', // Text next to logo (leave empty for logo only)
    items: [
      {
        type: 'docSidebar',
        sidebarId: 'tutorialSidebar',
        position: 'left',
        label: 'Documentation',
      },
      {
        to: '/blog',
        label: 'Blog',
        position: 'left',
      },
      {
        to: '/releases',
        label: 'Releases',
        position: 'left',
      },
      // Theme Switcher (color theme picker)
      {
        type: 'custom-themeSwitcher',
        position: 'right',
      },
      // GitHub link (optional - remove if not needed)
      // {
      //   href: 'https://github.com/your-org/your-project',
      //   position: 'right',
      //   className: 'header-github-link',
      //   'aria-label': 'GitHub repository',
      // },
    ],
  },
  
  // Footer Configuration
  footer: {
    style: 'light',
    copyright: `© ${new Date().getFullYear()} My Project Contributors. Released under MIT License.`,
    links: [
      {
        title: 'Documentation',
        items: [
          { label: 'Getting Started', to: '/docs/getting-started' },
          { label: 'API Reference', to: '/api-reference' },
          { label: 'Blog', to: '/blog' },
        ],
      },
      {
        title: 'Community',
        items: [
          { label: 'GitHub Discussions', href: 'https://github.com/your-org/your-project/discussions' },
          { label: 'Contributing', to: '/docs/contributing' },
          { label: 'Changelog', to: '/releases' },
        ],
      },
    ],
    socialLinks: [
      { platform: 'github', url: 'https://github.com/your-org/your-project' },
      // { platform: 'discord', url: 'https://discord.gg/your-server' },
      // { platform: 'twitter', url: 'https://twitter.com/your-handle' },
    ],
  },
  
  // External Links
  githubUrl: 'https://github.com/your-org/your-project',
  editUrl: 'https://github.com/your-org/your-project/tree/main/',
  
  // Theme Colors
  // Use a color palette generator like https://docusaurus.io/docs/styling-layout#styling-your-site-with-infima
  theme: {
    light: {
      primary: '#2e8555',           // Main brand color
      primaryDark: '#277148',
      primaryDarker: '#236642',
      primaryDarkest: '#1c5135',
      primaryLight: '#3a9d6a',
      primaryLighter: '#4db37b',
      primaryLightest: '#68c990',
      accentColor: '#e94560',       // Accent for CTAs and highlights
    },
    dark: {
      primary: '#25c2a0',           // Lighter version for dark mode
      primaryDark: '#21af90',
      primaryDarker: '#1fa588',
      primaryDarkest: '#1a8870',
      primaryLight: '#29d5b0',
      primaryLighter: '#32d8b4',
      primaryLightest: '#4fddbf',
      accentColor: '#ff6b7a',
      backgroundColor: '#1b1b1d',   // Dark mode background
      surfaceColor: '#242526',      // Dark mode surface/card color
    },
  },
};

export default siteConfig;
