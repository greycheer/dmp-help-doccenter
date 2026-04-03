/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  "tutorialSidebar": [
    {
      "type": "category",
      "label": "DMP Platform Manual for Admin User",
      "link": {
        "type": "generated-index",
        "title": "DMP Platform Manual for Admin User"
      },
      "items": [
        {
          "type": "doc",
          "id": "admin-manual/introduction",
          "label": "Introduction"
        },
        {
          "type": "doc",
          "id": "admin-manual/product-development-on-dmp-platform",
          "label": "Product Development on DMP Platform"
        },
        {
          "type": "doc",
          "id": "admin-manual/appendix",
          "label": "Appendix"
        }
      ]
    },
    {
      "type": "category",
      "label": "DMP Platform Manual for Developer",
      "link": {
        "type": "generated-index",
        "title": "DMP Platform Manual for Developer"
      },
      "items": [
        {
          "type": "doc",
          "id": "developer-manual/introduction",
          "label": "Introduction"
        },
        {
          "type": "doc",
          "id": "developer-manual/product-development-on-dmp-platform",
          "label": "2. Product Development on DMP Platform"
        },
        {
          "type": "doc",
          "id": "developer-manual/appendix",
          "label": "Appendix"
        }
      ]
    }
  ]
};

module.exports = sidebars;
