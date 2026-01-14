# Architecture Decision Record: Docusaurus Documentation Template

## ADR-001: Centralized Configuration Pattern

### Status
**Accepted** - January 2026

### Context
Docusaurus provides excellent documentation capabilities but requires users to understand its complex `docusaurus.config.ts` structure. Template users want to customize their documentation sites quickly without deep framework knowledge.

### Decision
We adopt a **centralized configuration pattern** with two user-facing configuration files:
- `site.config.ts` - All site-wide settings (branding, navbar, footer, theme colors)
- `landing.config.ts` - Landing page specific content (hero, features)

The main `docusaurus.config.ts` imports and spreads these configurations, remaining largely untouched by users.

### Rationale
1. **Separation of concerns**: Users modify simple, well-documented config files
2. **Type safety**: TypeScript interfaces provide autocomplete and validation
3. **Reduced complexity**: Users don't need to understand Docusaurus internals
4. **Template stability**: Core config remains stable across template updates

### Consequences
- **Positive**: Lower barrier to customization; template updates don't break user changes
- **Negative**: Additional abstraction layer; some advanced Docusaurus features require config understanding

---

## ADR-002: Swizzled Theme Components Architecture

### Status
**Accepted** - January 2026

### Context
Docusaurus supports "swizzling" (ejecting and customizing) theme components. We need custom behaviors for theming, footer, and navbar that aren't available in the base theme.

### Decision
We maintain swizzled components in `src/theme/` for:
- `Root.tsx` - Theme persistence and observation
- `ThemePresets/` - Color theme definitions
- `ThemeSwitcher/` - Theme picker UI
- `Footer/` - Dynamic footer with social icons
- `Navbar/` - Custom navbar item types

### Rationale
1. **Minimal swizzling**: Only swizzle what's necessary for custom features
2. **Upgrade path**: Swizzled components are isolated; base theme updates flow through
3. **Clear boundaries**: Theme overrides are clearly separated from content

### Consequences
- **Positive**: Custom features without forking Docusaurus
- **Negative**: Swizzled components may need updates for major Docusaurus versions

---

## ADR-003: CSS Custom Properties for Dynamic Theming

### Status
**Accepted** - January 2026

### Context
We need to support multiple color themes with real-time switching without page reload. The theme must integrate with Docusaurus's existing Infima CSS framework.

### Decision
We use **CSS Custom Properties** (CSS variables) injected via JavaScript:
- Theme colors modify `--ifm-color-primary-*` and custom `--accent-color` variables
- Color variants (dark, light, etc.) are calculated algorithmically from the base color
- Changes are applied via `document.documentElement.style.setProperty()`

### Rationale
1. **Real-time updates**: CSS variables cascade immediately without re-render
2. **Infima compatibility**: Infima already uses CSS variables; we leverage existing patterns
3. **No build-time dependency**: Themes work without rebuilding the site
4. **Dark mode integration**: Easy to swap color sets based on `data-theme` attribute

### Consequences
- **Positive**: Instant theme switching; works with Infima ecosystem
- **Negative**: Limited to color changes; structural theme changes require different approach

### Technical Details
```typescript
// Color adjustment algorithm
function adjustColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, Math.max(0, (num >> 16) + amt));
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amt));
  const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
}
```

---

## ADR-004: Theme Persistence via Root Provider

### Status
**Accepted** - January 2026

### Context
Selected color themes must persist across page navigations. Docusaurus is a React application with client-side routing.

### Decision
Implement a `Root.tsx` component that:
1. Loads saved theme from `localStorage` on mount
2. Applies theme CSS variables before first paint
3. Observes `data-theme` attribute changes via `MutationObserver`
4. Re-applies theme when dark/light mode toggles

### Rationale
1. **Early application**: Root component runs before visible content, avoiding flash
2. **Attribute observation**: MutationObserver detects dark mode toggle without prop drilling
3. **localStorage**: Standard, persistent, synchronous storage

### Consequences
- **Positive**: Consistent theme across navigations; integrates with dark mode toggle
- **Negative**: MutationObserver is relatively heavy; adds slight overhead

---

## ADR-005: Local Search Implementation

### Status
**Accepted** - January 2026

### Context
Many documentation solutions require external search services (Algolia). We want zero-dependency search that works immediately.

### Decision
Use `@easyops-cn/docusaurus-search-local` plugin for:
- Build-time search index generation
- Client-side search without external API calls
- Highlighted search terms on result pages

### Rationale
1. **No external dependency**: Works offline and in air-gapped environments
2. **Privacy**: No search queries sent to third parties
3. **Simplicity**: No API keys or service configuration needed

### Consequences
- **Positive**: Works immediately; no ongoing service costs
- **Negative**: Search quality may be lower than Algolia for large sites; index size grows with content

---

## ADR-006: Scalar for API Documentation

### Status
**Accepted** - January 2026

### Context
Documentation sites often need interactive API reference documentation. Traditional options include Swagger UI, Redoc, or docusaurus-openapi-docs.

### Decision
Integrate `@scalar/docusaurus` plugin for OpenAPI documentation:
- Reads spec from `static/openapi/openapi.json`
- Auto-injects "API Reference" link into navbar
- Provides modern, interactive API explorer

### Rationale
1. **Modern UI**: Scalar provides contemporary design matching our template aesthetic
2. **Auto-integration**: Plugin handles navbar injection without manual config
3. **Interactive**: Supports try-it-now API calls directly from docs
4. **Minimal config**: Works with single spec file path

### Consequences
- **Positive**: Professional API docs with minimal setup
- **Negative**: Users must not manually add API Reference to navbar (causes duplicates)

---

## ADR-007: Lucide Icons for UI Elements

### Status
**Accepted** - January 2026

### Context
The template needs icons for landing page features, buttons, and UI elements. We need a consistent, tree-shakeable icon library.

### Decision
Use `lucide-react` as the primary icon library:
- Icons specified by name in configuration
- Dynamic icon rendering via component lookup
- Tree-shaking eliminates unused icons from bundle

### Rationale
1. **Comprehensive**: 1000+ icons covering common use cases
2. **Consistent style**: All icons share design language
3. **React-native**: First-class React component support
4. **MIT licensed**: No usage restrictions

### Consequences
- **Positive**: Consistent iconography; easy to configure via names
- **Negative**: Bundle includes icon mapping logic; custom icons require additional work

---

## Summary

| Decision | Key Technology | Primary Benefit |
|----------|---------------|-----------------|
| ADR-001 | TypeScript configs | User-friendly customization |
| ADR-002 | Swizzled components | Custom features without forking |
| ADR-003 | CSS Custom Properties | Real-time theme switching |
| ADR-004 | Root Provider | Persistent theme across navigations |
| ADR-005 | Local search plugin | Zero-dependency search |
| ADR-006 | Scalar plugin | Modern API documentation |
| ADR-007 | Lucide icons | Consistent, configurable icons |
