# Project Context

## Purpose
A modern, fully configurable Docusaurus documentation template designed to provide organizations with a ready-to-use documentation site. The template features centralized configuration, multiple color theme presets, dark mode support, and integrated API documentation capabilities.

### Goals
- Provide a reusable documentation template that can be customized through configuration files
- Minimize the need to touch core Docusaurus configuration for common customizations
- Support multiple visual themes with easy switching
- Integrate API documentation seamlessly via Scalar OpenAPI viewer
- Enable rapid deployment to Vercel, GitHub Pages, or Docker environments

## Tech Stack
- **Framework**: Docusaurus 3.9.x (React 19)
- **Language**: TypeScript 5.6
- **Styling**: CSS Modules + CSS Custom Properties
- **Icons**: Lucide React
- **API Docs**: Scalar Docusaurus Plugin
- **Search**: easyops-cn/docusaurus-search-local (local search, no external service)
- **Diagrams**: Mermaid.js (via @docusaurus/theme-mermaid)
- **Build**: npm/bun
- **Deployment**: Vercel, GitHub Pages, Docker

## Project Conventions

### Code Style
- TypeScript for all configuration and components
- React functional components with hooks
- CSS Modules for component-scoped styling
- CSS Custom Properties for theming
- PascalCase for components, camelCase for functions/variables
- Kebab-case for file names in docs/blog folders

### Architecture Patterns
- **Centralized Configuration**: All customizable settings in `site.config.ts` and `landing.config.ts`
- **Swizzled Theme Components**: Custom theme overrides in `src/theme/`
- **Theme Presets Pattern**: Color themes defined as data objects in `ThemePresets/index.ts`
- **Root Provider Pattern**: Theme persistence via `Root.tsx` with MutationObserver
- **CSS Variable Injection**: Dynamic theme application via `style.setProperty()`

### Directory Structure
```
├── site.config.ts       # Main site configuration (navbar, footer, branding)
├── landing.config.ts    # Landing page hero and features config
├── docusaurus.config.ts # Core Docusaurus config (uses site.config.ts)
├── src/
│   ├── theme/           # Swizzled/overridden theme components
│   │   ├── Root.tsx     # Theme persistence provider
│   │   ├── ThemePresets/# Color theme definitions
│   │   ├── ThemeSwitcher/# Theme picker component
│   │   ├── Footer/      # Dynamic footer
│   │   └── Navbar/      # Custom navbar items
│   ├── components/      # Custom page components
│   └── css/custom.css   # Global theme overrides
├── docs/                # Documentation content (MDX/Markdown)
├── blog/                # Blog posts
├── static/openapi/      # OpenAPI specs for API docs
└── openspec/            # Spec-driven development artifacts
```

### Testing Strategy
- TypeScript type checking (`npm run typecheck`)
- Build verification (`npm run build`)
- Manual browser testing for theme switching and responsive design
- Visual regression testing recommended for theme presets

### Git Workflow
- Feature branches for new capabilities
- Conventional commits preferred (feat:, fix:, docs:, refactor:)
- PR-based workflow with build verification

## Domain Context
This is a **template project** meant to be cloned and customized. Key concepts:

- **Theme Presets**: Predefined color schemes (Slack, Teams, Discord, etc.) users can switch between
- **Swizzling**: Docusaurus pattern for overriding default theme components
- **Configuration-driven**: Most customization happens in `.ts` config files, not code
- **Scalar Integration**: API Reference auto-added to navbar via plugin

## Important Constraints
- Must maintain compatibility with Docusaurus 3.x and future v4
- Theme switching must persist across page navigations (localStorage)
- API Reference route is auto-injected by Scalar plugin—avoid manual navbar entries
- Search must work without external services (local search)
- Template must work "out of the box" after cloning

## External Dependencies
- **Docusaurus**: Core framework and presets
- **Scalar**: API documentation rendering (reads `/openapi/openapi.json`)
- **Lucide**: Icon library for landing page and UI elements
- **Vercel/GitHub Pages**: Primary deployment targets
