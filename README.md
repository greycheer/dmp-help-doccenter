# DMP Help Center

DMP Platform documentation built with [Docusaurus](https://docusaurus.io/).

## Overview

This help center provides comprehensive documentation for the DMP (Device Management Platform):

- **Admin User Manual** — Platform operation, account management, and configuration
- **Developer Manual** — Product development, device interaction, and firmware management

## Setup

```bash
npm install
npm start
```

## Sync from Feishu

Documents are synced from Feishu (Lark) wiki pages. To update:

```bash
npm run sync
```

This fetches the latest content from Feishu and regenerates the documentation files.

## Build & Deploy

```bash
npm run build
npm run deploy
```

The site is automatically deployed to GitHub Pages via GitHub Actions.

## Search

Client-side search is powered by [@easyops-cn/docusaurus-search-local](https://github.com/easyops-cn/docusaurus-search-local).

## Project Structure

```
dmp-help-doccenter/
├── docs/                    # Documentation content
│   ├── admin-manual/        # Admin user manual sections
│   ├── developer-manual/    # Developer manual sections
│   └── index.md             # Homepage
├── static/img/              # Images
│   ├── admin-manual/
│   └── developer-manual/
├── src/css/                 # Custom styles
├── docusaurus.config.js     # Docusaurus configuration
├── sidebars.js              # Sidebar navigation
├── pipeline.js              # Feishu sync pipeline
└── package.json
```
