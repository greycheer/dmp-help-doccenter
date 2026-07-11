// @ts-check
const { themes } = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'DMP Help Center',
  tagline: 'DMP Platform Documentation',
  favicon: 'img/favicon.ico',
  url: process.env.DOCUSAURUS_URL || 'https://greycheer.github.io',
  baseUrl: process.env.DOCUSAURUS_BASE_URL || '/dmp-help-doccenter/',
  organizationName: 'greycheer',
  projectName: 'dmp-help-doccenter',
  onBrokenLinks: 'warn',
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
          routeBasePath: '/docs',
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
  clientModules: [
    require.resolve('./src/clientModules/imageLightbox.js'),
  ],
  plugins: [
    // 中文文档实例
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'zh-docs',
        path: 'i18n/zh-CN/docusaurus-plugin-content-docs/current',
        routeBasePath: '/zh-CN/docs',
        sidebarPath: require.resolve('./sidebars.js'),
      },
    ],
    // 搜索（支持中英双语文档）
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['en', 'zh'],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        docsRouteBasePath: ['/docs', '/zh-CN/docs'],
        indexDocs: true,
      },
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'DMP Help Center',
        logo: {
          alt: 'DMP Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            to: '/docs',
            label: 'EN',
            position: 'right',
            activeBaseRegex: '^/docs(?!\/zh-CN)',
          },
          {
            to: '/zh-CN/docs',
            label: '中文',
            position: 'right',
            activeBaseRegex: '^/zh-CN',
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `Copyright © ${new Date().getFullYear()} DMP Platform. Built with Docusaurus.`,
      },
      prism: {
        theme: themes.github,
        darkTheme: themes.dracula,
      },
      // Table of contents defaults
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 4,
      },
    }),
};

module.exports = config;
