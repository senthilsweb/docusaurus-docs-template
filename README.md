# Docusaurus Docs Template

> A customizable Docusaurus template for documentation sites, personal websites, and product landing pages.

A modern, fully-featured Docusaurus documentation template with a clean design, dark mode support, 13 color theme presets, and easy customization through centralized configuration files. Perfect for technical documentation, personal blogs, or product websites.

## Features

- 🎨 **Fully Configurable Theme** - Change colors, branding, and navigation from a single config file
- 🎨 **13 Color Theme Presets** - Choose from Slack, Teams, Discord, WhatsApp, and more
- 🌙 **Dark Mode Support** - Automatic dark mode with customizable color schemes
- 📱 **Responsive Design** - Works great on desktop, tablet, and mobile
- 🔍 **Local Search** - Built-in search functionality (no external service needed)
- 📖 **API Documentation** - Integrated Scalar API reference viewer (auto-added to navbar)
- 🎯 **Mermaid Diagrams** - Built-in support for Mermaid.js diagrams
- 💻 **Live Code Blocks** - Interactive code examples with live preview
- 📝 **Blog Support** - Full blog functionality with RSS/Atom feeds
- 🚀 **Optimized for Performance** - Fast build times and optimized output
- 🏠 **Landing Page** - Customizable hero section and feature cards

## Quick Start

### 1. Clone this template

```bash
git clone https://github.com/senthilsweb/docusaurus-docs-template.git my-docs
cd my-docs
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
bun install
```

### 3. Configure your site

Edit these configuration files:

- **`site.config.ts`** - Site title, logo, navbar, footer, theme colors
- **`landing.config.ts`** - Landing page hero and features

### 4. Start development server

```bash
npm start
# or
yarn start
```

## Configuration Files

### Site Configuration (`site.config.ts`)

The main configuration file for site-wide settings:

```typescript
const siteConfig: SiteConfig = {
  // Basic Information
  title: 'My Documentation',
  tagline: 'Your project tagline',
  url: 'https://docs.example.com',
  
  // Branding
  logo: {
    alt: 'Logo',
    src: 'img/logo.svg',
    srcDark: 'img/logo-dark.svg',
  },
  
  // Theme Colors
  theme: {
    light: {
      primary: '#2e8555',
    },
    dark: {
      primary: '#25c2a0',
    },
  },
  
  // Navigation (API Reference is auto-added by Scalar - don't add manually)
  navbar: {
    items: [
      { label: 'Documentation', to: '/docs' },
      { label: 'Blog', to: '/blog' },
    ],
  },
  
  // Footer
  footer: {
    copyright: '© 2024 Your Company',
    links: [...],
    socialLinks: [...],
  },
};
```

> **Note:** The API Reference link is automatically added to the navbar by the Scalar plugin. Do not add it manually to avoid duplicates.

### Landing Page Configuration (`landing.config.ts`)

Customize the landing page hero and features:

```typescript
const landingConfig = {
  hero: {
    title: 'My Project',
    tagline: 'Build better documentation with ease',
    description: 'A modern documentation framework...',
    
    // Call-to-action buttons
    buttons: [
      { label: 'Get Started', href: '/docs/intro', variant: 'primary' },
      { label: 'View on GitHub', href: 'https://github.com', variant: 'secondary' },
    ],
    
    // Highlight badges below buttons
    highlights: [
      { icon: '⚡', label: 'Fast' },
      { icon: '🎨', label: 'Customizable' },
    ],
  },
  
  features: {
    sectionTitle: 'Why Choose Us',
    items: [
      {
        icon: '📚',
        iconColor: '#4f46e5',      // Icon text color
        iconBackground: '#eef2ff', // Icon background color
        title: 'Rich Documentation',
        description: 'Write documentation in Markdown...',
      },
      // ... more features
    ],
  },
};
```

### Color Theme Presets

The template includes 13 color theme presets that users can switch between:

| Theme | Description |
|-------|-------------|
| Default | Classic green documentation theme |
| Slack | Aubergine and teal |
| Teams | Microsoft purple and gradient |
| Discord | Blurple |
| WhatsApp | Green chat app style |
| Telegram | Blue messaging theme |
| iMessage | Apple blue |
| Zendesk | Customer service green |
| Intercom | Chat widget blue |
| Ocean | Deep blue gradients |
| Sunset | Warm orange and pink |
| Forest | Nature green tones |
| Rose | Pink and mauve |

The theme switcher is automatically included in the navbar.
};
```

### Theme Colors (`src/css/custom.css`)

For advanced theming beyond the presets, edit the CSS custom properties:

```css
:root {
  --ifm-color-primary: #2e8555;
  --accent-color: #e94560;
  /* ... more variables */
}

[data-theme='dark'] {
  --ifm-color-primary: #25c2a0;
  /* ... dark mode overrides */
}
```

### Adding Your Logo

Replace the placeholder logos in `static/img/`:

1. `logo.svg` - Light mode logo (also shown in hero section)
2. `logo-dark.svg` - Dark mode logo (optional)
3. `favicon.svg` - Browser favicon
4. `social-card.svg` - Social media preview image

## Project Structure

```
├── docs/                 # Documentation pages (MDX/Markdown)
├── blog/                 # Blog posts
├── src/
│   ├── css/
│   │   └── custom.css   # Theme customizations
│   ├── pages/           # Custom pages (index.tsx = landing page)
│   └── theme/           # Theme overrides
│       ├── ThemePresets/    # Color theme definitions
│       ├── ThemeSwitcher/   # Theme picker component
│       ├── Footer/          # Dynamic footer
│       └── Root.tsx         # Theme persistence
├── static/
│   ├── img/             # Images and logos
│   └── openapi/         # OpenAPI specs for API docs
├── site.config.ts       # Main site configuration
├── landing.config.ts    # Landing page configuration
├── docusaurus.config.ts # Docusaurus configuration (uses site.config.ts)
└── sidebars.ts          # Sidebar navigation
```

## Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run build` | Build for production |
| `npm run serve` | Serve production build locally |
| `npm run clear` | Clear Docusaurus cache |
| `npm run typecheck` | Run TypeScript type checking |

## Deployment

### Vercel (Recommended)

1. Push your repo to GitHub
2. Import to Vercel
3. It will auto-detect Docusaurus and deploy

### GitHub Pages

```bash
GIT_USER=<your-username> npm run deploy
```

### Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
```

## Customization Guide

### Adding New Documentation Pages

Create `.md` or `.mdx` files in the `docs/` folder:

```markdown
---
sidebar_position: 1
title: My Page Title
---

# Welcome

Your content here...
```

### Adding Blog Posts

Create files in `blog/` with date prefixes:

```markdown
---
slug: my-first-post
title: My First Post
authors: [your-name]
tags: [welcome]
---

Blog content here...
```

### Adding API Documentation

1. Place your OpenAPI spec in `static/openapi/openapi.json`
2. The API reference will be available at `/api-reference`

## License

MIT License - feel free to use this template for any project!
