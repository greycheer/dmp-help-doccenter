/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'DMP Platform Manual for Admin User',
      position: 1,
      link: { type: 'generated-index', title: 'DMP Platform Manual for Admin User' },
      items: [
        {
          type: 'doc',
          id: 'admin-manual/01-introduction',
          label: 'Introduction',
        },
        {
          type: 'doc',
          id: 'admin-manual/02-product-development-on-dmp-platform',
          label: 'Product Development on DMP Platform',
        },
        {
          type: 'doc',
          id: 'admin-manual/03-appendix',
          label: 'Appendix',
        },
      ],
    },
    {
      type: 'category',
      label: 'DMP Platform Manual for Developer',
      position: 2,
      link: { type: 'generated-index', title: 'DMP Platform Manual for Developer' },
      items: [
        {
          type: 'doc',
          id: 'developer-manual/01-introduction',
          label: 'Introduction',
        },
        {
          type: 'doc',
          id: 'developer-manual/02-product-development-on-dmp-platform',
          label: 'Product Development on DMP Platform',
        },
        {
          type: 'doc',
          id: 'developer-manual/03-appendix',
          label: 'Appendix',
        },
      ],
    },
  ],
};
module.exports = sidebars;
