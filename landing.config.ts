/**
 * Landing Page Configuration
 * 
 * This file controls all content on the landing page including:
 * - Hero section (title, tagline, buttons, highlights)
 * - Features section (feature cards with icons)
 * 
 * Icons: Use Lucide icon names (e.g., 'Zap', 'Palette', 'Search')
 * See https://lucide.dev/icons for available icons
 * 
 * To customize the landing page, modify the values below.
 */

export interface HeroButton {
  label: string;
  href: string;
  variant: 'primary' | 'secondary';
  icon?: string; // Lucide icon name (optional)
}

export interface HeroHighlight {
  icon: string; // Lucide icon name (e.g., 'Zap', 'Palette')
  label: string;
}

export interface HeroConfig {
  title: string;
  tagline: string;
  description?: string;
  buttons: HeroButton[];
  highlights: HeroHighlight[];
  heroImage?: string; // Optional: URL or path to hero image (enables two-column layout)
  heroImageAlt?: string; // Alt text for hero image
}

export interface Feature {
  icon: string; // Lucide icon name (e.g., 'BookOpen', 'Search')
  iconColor: string; // CSS color value (hex, rgb, etc.)
  iconBackground: string; // Background color for the icon container
  title: string;
  description: string;
}

export interface FeaturesConfig {
  sectionTitle?: string;
  items: Feature[];
}

export interface LandingConfig {
  hero: HeroConfig;
  features: FeaturesConfig;
}

// ============================================================================
// LANDING PAGE CONFIGURATION
// Modify the values below to customize your landing page
// 
// Icon Reference: https://lucide.dev/icons
// Common icons: Zap, Palette, Package, BookOpen, Search, Code, Moon, Rocket,
//               Settings, Shield, Globe, Terminal, Database, Cloud, Lock
// ============================================================================

const landingConfig: LandingConfig = {
  hero: {
    // Main title displayed next to the logo
    title: 'My Project',
    
    // Tagline displayed below the title
    tagline: 'Build better documentation with ease',
    
    // Optional longer description (set to empty string to hide)
    description: 'A modern, fast, and flexible documentation framework designed to help you create beautiful documentation sites.',
    
    // Call-to-action buttons
    buttons: [
      {
        label: 'Get Started',
        href: '/docs/getting-started',
        variant: 'primary',
        icon: 'ArrowRight',
      },
      {
        label: 'View on GitHub',
        href: 'https://github.com',
        variant: 'secondary',
        icon: 'Github',
      },
    ],
    
    // Highlight badges shown below buttons (use Lucide icon names)
    highlights: [
      { icon: 'Zap', label: 'Fast' },
      { icon: 'Palette', label: 'Customizable' },
      { icon: 'Package', label: 'Easy Setup' },
    ],
    
    // Hero image for two-column layout (optional - leave empty for centered layout)
    // Set to a URL or path like '/img/hero-image.png'
    heroImage: '/img/hero-placeholder.svg',
    heroImageAlt: 'Platform Architecture',
  },
  
  features: {
    // Optional section title (set to empty string to hide)
    sectionTitle: 'Key Features',
    
    // Feature cards (use Lucide icon names)
    items: [
      {
        icon: 'BookOpen',
        iconColor: '#4f46e5',
        iconBackground: '#eef2ff',
        title: 'Rich Documentation',
        description: 'Write documentation in Markdown with support for MDX, code highlighting, and interactive components.',
      },
      {
        icon: 'Palette',
        iconColor: '#7c3aed',
        iconBackground: '#f5f3ff',
        title: 'Theme Presets',
        description: 'Choose from 13 beautiful color themes inspired by popular chat applications and customize to match your brand.',
      },
      {
        icon: 'Search',
        iconColor: '#0891b2',
        iconBackground: '#ecfeff',
        title: 'Full-Text Search',
        description: 'Built-in local search functionality to help users find content quickly without external services.',
      },
      {
        icon: 'Code',
        iconColor: '#059669',
        iconBackground: '#ecfdf5',
        title: 'API Reference',
        description: 'Beautiful API documentation powered by Scalar with support for OpenAPI/Swagger specifications.',
      },
      {
        icon: 'Moon',
        iconColor: '#6366f1',
        iconBackground: '#eef2ff',
        title: 'Dark Mode',
        description: 'Automatic dark mode support that respects user preferences and works with all color themes.',
      },
      {
        icon: 'Rocket',
        iconColor: '#dc2626',
        iconBackground: '#fef2f2',
        title: 'Easy Deployment',
        description: 'Deploy to Vercel, Netlify, GitHub Pages, or any static hosting with zero configuration.',
      },
    ],
  },
};

export default landingConfig;
