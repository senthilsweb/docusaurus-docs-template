import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'getting-started',
    'mcp-api-reference',
    'query-flow',
    'deployment',
    'model-generator',
    'architecture',
    {
      type: 'link',
      label: 'API Reference (OpenAPI)',
      href: '/api-reference',
    },
    {
      type: 'category',
      label: 'Resources',
      items: [
        'faq',
        'glossary',
      ],
    },
  ],
};

export default sidebars;
