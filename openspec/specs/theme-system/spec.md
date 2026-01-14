# Capability: Theme System

## Overview
The theme system provides dynamic color theming with multiple preset themes, dark mode support, and persistent theme selection across page navigations.

## Requirements

### Requirement: Theme Preset Definitions
The system SHALL provide a collection of predefined color theme presets that users can switch between.

#### Scenario: Theme presets availability
- **WHEN** the theme switcher is opened
- **THEN** at least 13 theme presets are available for selection
- **AND** presets include: Default, Slack, Teams, Discord, WhatsApp, Telegram, iMessage, Zendesk, Intercom, Ocean, Sunset, Forest, Rose

#### Scenario: Theme preset structure
- **WHEN** a theme preset is defined
- **THEN** it includes a name, emoji icon, primary color (light), primary color (dark), accent color (light), and accent color (dark)

---

### Requirement: Theme Switcher Component
The system SHALL provide a navbar-integrated theme switcher component for selecting color themes.

#### Scenario: Theme switcher rendering
- **WHEN** the navbar renders
- **THEN** a theme switcher button/dropdown is displayed in the configured position

#### Scenario: Theme selection interaction
- **WHEN** a user clicks the theme switcher
- **THEN** a dropdown displays available theme presets with visual indicators
- **AND** the current theme is highlighted

---

### Requirement: Dynamic CSS Variable Application
The system SHALL apply theme colors dynamically by setting CSS custom properties on the document root.

#### Scenario: Theme application
- **WHEN** a theme preset is selected
- **THEN** CSS variables are updated including:
  - `--ifm-color-primary` and its variants (dark, darker, darkest, light, lighter, lightest)
  - `--accent-color`
  - `--docusaurus-highlighted-code-line-bg`

#### Scenario: Color variants generation
- **WHEN** a primary color is applied
- **THEN** darker and lighter variants are automatically calculated using brightness adjustment

---

### Requirement: Theme Persistence
The system SHALL persist the selected theme across page navigations and browser sessions.

#### Scenario: Theme storage
- **WHEN** a user selects a theme
- **THEN** the selection is stored in localStorage under key `docusaurus.theme.preset`

#### Scenario: Theme restoration
- **WHEN** a page loads
- **THEN** the previously selected theme is restored from localStorage
- **AND** CSS variables are applied before visible render

---

### Requirement: Dark Mode Integration
The system SHALL integrate with Docusaurus dark mode and apply theme-appropriate colors based on the current color mode.

#### Scenario: Dark mode color switching
- **WHEN** the user toggles dark mode
- **THEN** the current theme's dark-mode colors are applied
- **AND** CSS variables update to use `primaryColorDark` and `accentColorDark`

#### Scenario: Color mode observation
- **WHEN** the `data-theme` attribute changes on the document root
- **THEN** the theme system re-applies colors appropriate to the new mode

---

### Requirement: Root Provider Pattern
The system SHALL use a Root component provider to manage theme lifecycle and observation.

#### Scenario: Root component initialization
- **WHEN** the React application mounts
- **THEN** the Root component loads saved theme and applies it
- **AND** sets up a MutationObserver to watch for color mode changes

#### Scenario: Cleanup on unmount
- **WHEN** the Root component unmounts
- **THEN** the MutationObserver is disconnected to prevent memory leaks

---

### Requirement: Respect System Preferences
The system SHALL respect the user's system color scheme preference for initial dark/light mode selection.

#### Scenario: System preference detection
- **WHEN** no user preference is stored
- **THEN** the site uses the system's preferred color scheme (via `prefers-color-scheme`)

---

### Requirement: Custom CSS Override Support
The system SHALL support additional CSS customization through `src/css/custom.css` for advanced theming.

#### Scenario: CSS override application
- **WHEN** custom CSS rules are defined in `custom.css`
- **THEN** they are applied on top of theme preset colors
- **AND** can override any CSS custom property
