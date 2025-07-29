// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const {themes} = require('prism-react-renderer');
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'BLGV Ecosystem Documentation',
  tagline: 'Comprehensive Bitcoin-Native Financial Infrastructure',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://docs.blgvbtc.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/',

  // GitHub pages deployment config
  organizationName: 'BlockSavvy',
  projectName: 'blgv-docs',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          editUrl: 'https://github.com/BlockSavvy/Unified-Treasury-System/tree/main/docs/',
        },
        blog: false, // Disable blog
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/blgv-social-card.jpg',
      navbar: {
        title: 'BLGV Docs',
        logo: {
          alt: 'BLGV Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'mainSidebar',
            position: 'left',
            label: 'Documentation',
          },
          {
            href: 'https://github.com/BlockSavvy/Unified-Treasury-System',
            label: 'GitHub',
            position: 'right',
          },
          {
            href: 'https://blgvbtc.com',
            label: 'BLGV.com',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Platforms',
            items: [
              {
                label: 'Treasury',
                href: 'https://blgvbtc.com',
              },
              {
                label: 'DEX',
                href: 'https://dex.blgvbtc.com',
              },
              {
                label: 'Pool',
                href: 'https://pool.blgvbtc.com',
              },
              {
                label: 'API',
                href: 'https://api.blgvbtc.com',
              },
            ],
          },
          {
            title: 'Resources',
            items: [
              {
                label: 'SDK Documentation',
                to: '/sdk',
              },
              {
                label: 'Environment Setup',
                to: '/ENVIRONMENT_SECRETS',
              },
              {
                label: 'Architecture',
                to: '/architecture-overview',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Twitter',
                href: 'https://twitter.com/blgvbtc',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/BlockSavvy/Unified-Treasury-System',
              },
              {
                label: 'Discord',
                href: 'https://discord.gg/blgv',
              },
            ],
          },
          {
            title: 'Legal',
            items: [
              {
                label: 'Terms of Service',
                href: 'https://blgvbtc.com/terms',
              },
              {
                label: 'Privacy Policy',
                href: 'https://blgvbtc.com/privacy',
              },
              {
                label: 'Contact',
                href: 'https://blgvbtc.com/contact',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Belgravia Hartford (BLGV). Built with Bitcoin ₿`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['bash', 'diff', 'json', 'typescript', 'python', 'swift'],
      },
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      algolia: {
        // The application ID provided by Algolia
        appId: 'YOUR_ALGOLIA_APP_ID',
        // Public API key: it is safe to commit it
        apiKey: 'YOUR_ALGOLIA_SEARCH_API_KEY',
        indexName: 'blgv-docs',
        // Optional: see doc section below
        contextualSearch: true,
        // Optional: Specify domains where the navigation should occur through window.location instead on history.push
        externalUrlRegex: 'external\\.com|domain\\.com',
        // Optional: Replace parts of the item URLs from Algolia
        replaceSearchResultPathname: {
          from: '/docs/', // or as RegExp: /\/docs\//
          to: '/',
        },
        // Optional: Algolia search parameters
        searchParameters: {},
        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: 'search',
      },
    }),

  plugins: [],
  
  themes: ['@docusaurus/theme-mermaid'],
  
  markdown: {
    mermaid: true,
  },
};

module.exports = config; 