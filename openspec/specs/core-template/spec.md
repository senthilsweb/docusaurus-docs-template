# Capability: Core Template

## Overview
The core documentation template capability provides the foundational structure and configuration system that enables users to create customized documentation sites through centralized configuration files without modifying core framework code.

## Requirements

### Requirement: Centralized Site Configuration
The template SHALL provide a single `site.config.ts` file that controls all site-wide settings including title, tagline, URL, branding, navbar, footer, and theme colors.

#### Scenario: User customizes site branding
- **WHEN** a user modifies values in `site.config.ts`
- **THEN** the changes are reflected across the entire documentation site
- **AND** no modifications to `docusaurus.config.ts` are required

#### Scenario: Configuration type safety
- **WHEN** a user edits configuration values
- **THEN** TypeScript provides autocomplete and type checking for valid options

---

### Requirement: Landing Page Configuration
The template SHALL provide a separate `landing.config.ts` file that controls hero section content, call-to-action buttons, highlight badges, and feature cards.

#### Scenario: User customizes hero section
- **WHEN** a user modifies the hero configuration
- **THEN** the landing page displays the updated title, tagline, and description
- **AND** buttons and highlights render according to configuration

#### Scenario: User configures feature cards
- **WHEN** a user defines feature items with icons, colors, and descriptions
- **THEN** the landing page displays feature cards matching the configuration

---

### Requirement: Navbar Configuration
The template SHALL support configurable navbar items including documentation links, blog links, custom links, and component slots.

#### Scenario: Navbar renders configured items
- **WHEN** navbar items are defined in `site.config.ts`
- **THEN** the navbar displays all items in the specified positions (left/right)

#### Scenario: API Reference auto-injection
- **WHEN** the Scalar plugin is enabled
- **THEN** an "API Reference" link is automatically added to the navbar
- **AND** users do not need to manually configure this item

---

### Requirement: Footer Configuration
The template SHALL support configurable footer with link sections, copyright text, and social media icons.

#### Scenario: Footer renders link sections
- **WHEN** footer link sections are defined in configuration
- **THEN** the footer displays organized columns of links

#### Scenario: Social icons rendering
- **WHEN** social links are configured with platform identifiers
- **THEN** the footer displays SVG icons for each platform with links

---

### Requirement: Documentation Content Structure
The template SHALL support Markdown and MDX files in the `docs/` directory with frontmatter for metadata.

#### Scenario: Markdown file rendering
- **WHEN** a `.md` or `.mdx` file is placed in `docs/`
- **THEN** the file is rendered as a documentation page
- **AND** frontmatter controls sidebar position and title

#### Scenario: Sidebar auto-generation
- **WHEN** documentation files exist with proper frontmatter
- **THEN** the sidebar reflects the document hierarchy and ordering

---

### Requirement: Blog Support
The template SHALL support blog posts in the `blog/` directory with RSS/Atom feed generation.

#### Scenario: Blog post creation
- **WHEN** a Markdown file with date prefix is added to `blog/`
- **THEN** the post appears in the blog listing with metadata

#### Scenario: Feed generation
- **WHEN** the site is built
- **THEN** RSS and Atom feeds are generated for blog content

---

### Requirement: Local Search
The template SHALL provide local search functionality without requiring external services.

#### Scenario: Search index generation
- **WHEN** the site is built
- **THEN** a local search index is generated for documentation content

#### Scenario: Search results display
- **WHEN** a user searches for content
- **THEN** relevant documentation pages are displayed with highlighted matches

---

### Requirement: API Documentation Integration
The template SHALL integrate Scalar for OpenAPI documentation rendering.

#### Scenario: OpenAPI spec rendering
- **WHEN** an OpenAPI spec is placed at `static/openapi/openapi.json`
- **THEN** the API Reference page renders the interactive documentation

#### Scenario: API route accessibility
- **WHEN** the site is running
- **THEN** the API Reference is accessible at `/api-reference`

---

### Requirement: Mermaid Diagram Support
The template SHALL support Mermaid.js diagrams in documentation content.

#### Scenario: Diagram rendering
- **WHEN** a Mermaid code block is included in documentation
- **THEN** the diagram is rendered as an interactive SVG

#### Scenario: Dark mode diagram adaptation
- **WHEN** the site is in dark mode
- **THEN** Mermaid diagrams use dark-appropriate colors

---

### Requirement: Live Code Blocks
The template SHALL support interactive code examples with live preview.

#### Scenario: Code block execution
- **WHEN** a live code block is included in documentation
- **THEN** users can edit and see real-time output

---

### Requirement: Deployment Targets
The template SHALL support deployment to Vercel, GitHub Pages, and Docker environments.

#### Scenario: Vercel deployment
- **WHEN** the project is imported to Vercel
- **THEN** Docusaurus is auto-detected and the site deploys successfully

#### Scenario: Static build generation
- **WHEN** `npm run build` is executed
- **THEN** a static site is generated in the `build/` directory
