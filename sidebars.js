/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check
const sidebars = {
  // Main documentation sidebar
  mainSidebar: [
    'README',
    {
      type: 'category',
      label: '🚀 Getting Started',
      items: [
        'quick-start',
        'installation',
        'architecture-overview',
      ],
    },
    {
      type: 'category',
      label: '📚 Guides',
      items: [
        'guides/development-setup',
        'guides/deployment-guide',
        'guides/testing-strategy',
        'guides/best-practices',
      ],
    },
    {
      type: 'category',
      label: '⚙️ Deployment',
      items: [
        'deployment/DEPLOYMENT',
        'deployment/environment-setup',
        'deployment/production-checklist',
        'deployment/monitoring',
      ],
    },
    {
      type: 'category',
      label: '🔧 Development',
      items: [
        'development/coding-standards',
        'development/git-workflow',
        'development/testing',
        'development/debugging',
      ],
    },
    {
      type: 'category',
      label: '🔐 Security',
      items: [
        'security/overview',
        'security/authentication',
        'security/api-security',
        'security/best-practices',
      ],
    },
    {
      type: 'category',
      label: '🚀 Platforms',
      items: [
        'platforms/treasury',
        'platforms/dex',
        'platforms/pool',
        'platforms/lsp',
        'platforms/mobile',
      ],
    },
    {
      type: 'category',
      label: '📊 Strategic',
      items: [
        'strategic/BLGV-Strategic-White-Book',
        'strategic/BLGV-Executive-Deck',
        'strategic/BLGV_DESIGN_SPECIFICATIONS',
        'strategic/AUTHENTICATION_INTEGRATION_PLAN',
      ],
    },
    {
      type: 'category',
      label: '🏛️ Legacy',
      items: [
        'legacy/migration-notes',
        'legacy/deprecated-features',
        'legacy/changelog',
      ],
    },
  ],
};

module.exports = sidebars; 