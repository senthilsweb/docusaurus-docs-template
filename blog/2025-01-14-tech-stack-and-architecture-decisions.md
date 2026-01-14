---
slug: tech-stack-and-architecture-decisions
title: "Tech Stack & Key Architecture Decisions"
authors: [default]
tags: [Architecture, ADR, Tech Stack, Docusaurus]
---

An overview of the technologies powering this documentation template and the key architecture decisions that shaped its design.

<!-- truncate -->

## Tech Stack Overview

This documentation template is built on a modern, performant stack designed for developer experience and maintainability.

### Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| **Docusaurus** | 3.9.x | Static site generator optimized for documentation |
| **React** | 19.x | UI component library |
| **TypeScript** | 5.x | Type-safe configuration and components |
| **MDX** | 3.x | Markdown with JSX support |

### Key Plugins & Integrations

| Plugin | Purpose |
|--------|---------|
| **@scalar/docusaurus** | Beautiful OpenAPI/Swagger documentation |
| **@easyops-cn/docusaurus-search-local** | Offline-first full-text search |
| **@docusaurus/theme-mermaid** | Diagram support (flowcharts, sequence diagrams, etc.) |
| **lucide-react** | Consistent, customizable icons |

### Styling

- **CSS Modules** - Scoped component styling
- **CSS Custom Properties** - Theme variables for dynamic theming
- **13 Color Presets** - Pre-built themes inspired by popular apps

---

## Architecture Decision Records (ADRs)

### ADR-001: Centralized Configuration

**Status:** Accepted  
**Context:** Documentation sites often require customization across multiple files, making maintenance difficult.

**Decision:** Create two centralized configuration files:
- `site.config.ts` - Site-wide settings (title, logo, navbar, footer, theme)
- `landing.config.ts` - Landing page content (hero, features)

**Consequences:**
- ✅ Single source of truth for branding
- ✅ Non-developers can modify content without touching React code
- ✅ TypeScript interfaces provide autocomplete and validation
- ⚠️ Some advanced customizations still require component edits

---

### ADR-002: Theme Preset System

**Status:** Accepted  
**Context:** Users want to quickly apply professional color schemes without CSS expertise.

**Decision:** Implement a theme preset system with:
- 13 pre-built color themes (Slack, Teams, Discord, etc.)
- Theme switcher component in navbar
- LocalStorage persistence
- CSS custom property-based implementation

**Consequences:**
- ✅ Instant visual customization
- ✅ Themes work with both light and dark modes
- ✅ No build step required to switch themes
- ⚠️ Custom themes require editing `ThemePresets/index.ts`

---

### ADR-003: Scalar for API Documentation

**Status:** Accepted  
**Context:** Need beautiful, interactive API documentation from OpenAPI specs.

**Decision:** Use Scalar plugin instead of Swagger UI or Redoc.

**Alternatives Considered:**
- Swagger UI - Functional but dated design
- Redoc - Good design but less interactive
- Stoplight Elements - Requires more setup

**Consequences:**
- ✅ Modern, beautiful API docs
- ✅ Auto-adds `/api-reference` route
- ✅ Supports try-it-out functionality
- ⚠️ Don't manually add API Reference to navbar (causes duplicates)

---

### ADR-004: Lucide Icons Over Emojis

**Status:** Accepted  
**Context:** Landing page icons should be professional and consistent.

**Decision:** Use Lucide React icons instead of emojis.

**Consequences:**
- ✅ Consistent visual style across icons
- ✅ Customizable colors and sizes
- ✅ Better accessibility
- ⚠️ Slightly larger bundle size (~50KB tree-shaken)

---

### ADR-005: Static Site Generation

**Status:** Accepted  
**Context:** Documentation should be fast, cacheable, and deployable anywhere.

**Decision:** Use Docusaurus SSG (Static Site Generation) mode exclusively.

**Consequences:**
- ✅ Deploy to any static host (Vercel, Netlify, GitHub Pages)
- ✅ Excellent performance and SEO
- ✅ No server required
- ⚠️ Dynamic features require client-side JavaScript

---

## File Structure

```
├── site.config.ts          # Site-wide configuration
├── landing.config.ts       # Landing page content
├── docusaurus.config.ts    # Docusaurus settings (consumes site.config)
├── src/
│   ├── pages/
│   │   └── index.tsx       # Landing page component
│   ├── theme/
│   │   ├── ThemePresets/   # Color theme definitions
│   │   ├── ThemeSwitcher/  # Theme picker component
│   │   ├── BlogPostItems/  # Custom blog card layout
│   │   └── Footer/         # Dynamic footer
│   └── css/
│       └── custom.css      # Global CSS variables
├── docs/                   # Documentation markdown
├── blog/                   # Blog posts
└── static/
    ├── img/                # Logos and images
    └── openapi/            # OpenAPI specifications
```

---

## Performance Considerations

1. **Tree-shaking** - Only imported icons are bundled
2. **CSS Variables** - Theme changes don't require re-render
3. **Local Search** - No external API calls for search
4. **Lazy Loading** - Images and heavy components load on demand

---

## Future Considerations

- [ ] Add more theme presets based on user feedback
- [ ] Implement i18n (internationalization) support
- [ ] Add analytics integration options
- [ ] Create CLI tool for project scaffolding
