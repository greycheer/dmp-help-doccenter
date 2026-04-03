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
          type: 'category',
          label: 'Introduction',
          items: [
            { type: 'doc', id: 'admin-manual/01-01-purpose-of-the-manual', label: 'Purpose of the Manual' },
            { type: 'doc', id: 'admin-manual/01-02-platform-overview', label: 'Platform Overview' },
            { type: 'doc', id: 'admin-manual/01-03-terminology-explanation', label: 'Terminology Explanation' },
            { type: 'doc', id: 'admin-manual/01-04-quick-guide', label: 'Quick Guide' },
          ],
        },
        {
          type: 'category',
          label: 'Product Development on DMP Platform',
          items: [
            { type: 'doc', id: 'admin-manual/02-01-how-to-access-to-the-platform', label: 'How to Access to the Platform' },
            { type: 'doc', id: 'admin-manual/02-02-platform-account-and-role-management', label: 'Platform Account and Role Management' },
            { type: 'doc', id: 'admin-manual/02-03-product-development-management', label: 'Product Development Management' },
            { type: 'doc', id: 'admin-manual/02-04-app-management', label: 'APP Management' },
            { type: 'doc', id: 'admin-manual/02-05-customer-relationship-management', label: 'Customer Relationship Management' },
          ],
        },
        {
          type: 'category',
          label: 'Appendix',
          items: [
            { type: 'doc', id: 'admin-manual/03-01-history', label: 'History' },
          ],
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
          type: 'category',
          label: 'Introduction',
          items: [
            { type: 'doc', id: 'developer-manual/01-01-purpose-of-the-manual', label: 'Purpose of the Manual' },
            { type: 'doc', id: 'developer-manual/01-02-platform-overview', label: 'Platform Overview' },
            { type: 'doc', id: 'developer-manual/01-03-terminology-explanation', label: 'Terminology Explanation' },
            { type: 'doc', id: 'developer-manual/01-04-quick-guide-to-access-to-dmp-platform', label: 'Quick Guide to Access to DMP Platform' },
          ],
        },
        {
          type: 'category',
          label: 'Product Development on DMP Platform',
          items: [
            { type: 'doc', id: 'developer-manual/02-01-product-development', label: 'Product Development' },
            { type: 'doc', id: 'developer-manual/02-02-device-interaction', label: 'Device Interaction' },
            { type: 'doc', id: 'developer-manual/02-03-firmware-management', label: 'Firmware Management' },
          ],
        },
        {
          type: 'category',
          label: 'Appendix',
          items: [
            { type: 'doc', id: 'developer-manual/03-01-faq', label: 'FAQ' },
            { type: 'doc', id: 'developer-manual/03-02-history', label: 'History' },
          ],
        },
      ],
    },
  ],
};
module.exports = sidebars;
