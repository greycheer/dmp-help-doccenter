/**
 * pipeline.js — Complete pipeline: sync feishu -> split -> generate docs
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const DOCS_DIR = path.join(__dirname, 'docs');
const STATIC_DIR = path.join(__dirname, 'static', 'img');

const APP_ID = 'cli_a944f3bde3b89bce';
const APP_SECRET = 'vfdmNKgwYQApJhMnjX2vUhtEL2vgQZ85';

const DOC_CONFIGS = [
  {
    key: 'admin',
    docToken: 'P9yTddX2RoalLFxCHnbcPX5QnOb',
    title: 'DMP Platform Manual for Admin User',
    slug: 'admin-manual',
  },
  {
    key: 'developer',
    docToken: 'XFzWdutGcoS0Ngxg1pWc9T1cnDg',
    title: 'DMP Platform Manual for Developer',
    slug: 'developer-manual',
  },
];

// Block type map (numeric -> string)
const BT = { 1:'page', 2:'text', 3:'heading1', 4:'heading2', 5:'heading3', 6:'heading4', 7:'heading5', 8:'heading6', 12:'bullet', 13:'ordered', 14:'code', 15:'quote', 16:'divider', 17:'todo', 22:'table', 27:'image', 28:'callout', 30:'sheet' };

// ── HTTP ──
function httpRequest(method, url, headers, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const payload = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: u.hostname, path: u.pathname + u.search, method,
      headers: Object.assign({ 'Content-Type': 'application/json' }, headers),
    };
    if (payload) opts.headers['Content-Length'] = Buffer.byteLength(payload);
    const req = https.request(opts, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const raw = Buffer.concat(chunks).toString('utf8');
        try { resolve(JSON.parse(raw)); } catch { resolve(raw); }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function getToken() {
  const r = await httpRequest('POST', 'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {}, { app_id: APP_ID, app_secret: APP_SECRET });
  if (r.code !== 0) throw new Error('Token failed');
  return r.tenant_access_token;
}

async function getAllBlocks(token, docToken) {
  let blocks = [], pageToken = '';
  while (true) {
    let url = 'https://open.feishu.cn/open-apis/docx/v1/documents/' + docToken + '/blocks?document_revision_id=-1&page_size=500';
    if (pageToken) url += '&page_token=' + encodeURIComponent(pageToken);
    const r = await httpRequest('GET', url, { 'Authorization': 'Bearer ' + token });
    if (r.code !== 0) throw new Error('Blocks fetch failed');
    blocks = blocks.concat(r.data.items || []);
    if (!r.data.has_more || !r.data.page_token) break;
    pageToken = r.data.page_token;
  }
  return blocks;
}

function extractRichText(elements) {
  if (!elements) return '';
  return elements.map(el => {
    if (el.text_run) {
      let t = el.text_run.content || '';
      const s = el.text_run.text_element_style || {};
      // Escape special MDX characters inside text runs
      // But be careful not to double-escape markdown syntax
      if (s.bold) t = '**' + t + '**';
      if (s.italic) t = '*' + t + '*';
      if (s.strikethrough) t = '~~' + t + '~~';
      // Skip underline in MDX - use bold instead to avoid <u> conflicts
      if (s.underline) t = '**' + t + '**';
      if (s.inline_code) t = '`' + t + '`';
      if (el.text_run.link) t = '[' + t + '](' + el.text_run.link.url + ')';
      return t;
    }
    if (el.mention_user) return '@' + (el.mention_user.name || '');
    if (el.mention_doc) return '[Doc]';
    return '';
  }).join('');
}

function blocksToMarkdown(blocks, imgBaseRelPath) {
  const lines = [];
  const imageTokens = [];

  for (const block of blocks) {
    const btNum = block.block_type;
    const typeStr = BT[btNum];
    if (!typeStr) continue;
    if (btNum === 1) continue; // page

    const data = block[typeStr];
    if (!data) continue;

    const elements = data.elements || [];

    if (typeStr.startsWith('heading')) {
      const level = typeStr.replace('heading', '');
      lines.push('#'.repeat(parseInt(level)) + ' ' + extractRichText(elements));
      lines.push('');
    } else if (typeStr === 'text') {
      const text = extractRichText(elements);
      if (text.trim()) { lines.push(text); lines.push(''); }
    } else if (typeStr === 'bullet') {
      lines.push('- ' + extractRichText(elements));
      lines.push('');
    } else if (typeStr === 'ordered') {
      const seq = (data.style && data.style.sequence) || '1';
      lines.push(seq + '. ' + extractRichText(elements));
      lines.push('');
    } else if (typeStr === 'table' || typeStr === 'sheet') {
      if (data.property) {
        const rows = data.property.rows || 0;
        const cols = data.property.columns || 0;
        const cells = data.cells || {};
        const tLines = [];
        const hdr = [];
        for (let c = 0; c < cols; c++) {
          const cell = cells['0-' + c];
          hdr.push(cell ? extractRichText(cell.elements || []) : '');
        }
        tLines.push('| ' + hdr.join(' | ') + ' |');
        tLines.push('| ' + hdr.map(() => '---').join(' | ') + ' |');
        for (let r = 1; r < rows; r++) {
          const row = [];
          for (let c = 0; c < cols; c++) {
            const cell = cells[r + '-' + c];
            row.push(cell ? extractRichText(cell.elements || []) : '');
          }
          tLines.push('| ' + row.join(' | ') + ' |');
        }
        lines.push(tLines.join('\n'));
        lines.push('');
      }
    } else if (typeStr === 'quote') {
      lines.push('> ' + extractRichText(elements).split('\n').join('\n> '));
      lines.push('');
    } else if (typeStr === 'code') {
      const lang = (data.style && data.style.language) || '';
      lines.push('```' + lang);
      lines.push(extractRichText(elements));
      lines.push('```');
      lines.push('');
    } else if (typeStr === 'divider') {
      lines.push('---');
      lines.push('');
    } else if (typeStr === 'image') {
      if (data.token) {
        lines.push('![image](' + imgBaseRelPath + '/' + data.token + '.png)');
        lines.push('');
        imageTokens.push(data.token);
      }
    } else if (typeStr === 'todo') {
      const checked = data.style && data.style.done;
      lines.push('- [' + (checked ? 'x' : ' ') + '] ' + extractRichText(elements));
      lines.push('');
    } else if (typeStr === 'callout') {
      const emoji = (data.style && data.style.icon && data.style.icon.emoji) || '';
      lines.push('> ' + (emoji ? emoji + ' ' : '') + extractRichText(elements));
      lines.push('');
    }
  }

  let md = lines.join('\n');
  
  // Post-process: escape < > that could be confused with HTML/JSX tags in MDX
  // Pattern: < followed by content that doesn't look like a valid HTML tag
  md = md.replace(/(?<!=)<(?![\/!a-zA-Z])/g, '\\<');
  
  return { markdown: md, imageTokens };
}

// ── Split & Build ──

function slugify(text) {
  // Remove leading numbering like "2. " or "2.1 " etc.
  let clean = text.replace(/^\d+(\.\d+)*\s*/, '');
  return clean.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80) || 'untitled';
}

function splitMarkdownByH2(content) {
  const lines = content.split('\n');
  const sections = [];
  let current = { title: 'Introduction', lines: [] };

  for (const line of lines) {
    const h2Match = line.match(/^##\s+(.*\S)\s*$/);
    if (h2Match && !line.match(/^###/)) {
      sections.push(current);
      current = { title: h2Match[1].trim(), lines: [] };
    } else {
      current.lines.push(line);
    }
  }
  sections.push(current);
  return sections.filter(s => s.lines.join('').trim().length > 0);
}

function makeFrontmatter(title, position) {
  return '---\nsidebar_position: ' + position + '\ntitle: "' + title.replace(/"/g, '\\"') + '"\ntoc: true\ntoc_max_heading_level: 6\ntoc_min_heading_level: 2\n---';
}

function buildDocFiles(docDir, slug, markdown) {
  fs.mkdirSync(docDir, { recursive: true });

  // Clean old md files
  for (const f of fs.readdirSync(docDir)) {
    if (f.endsWith('.md')) fs.unlinkSync(path.join(docDir, f));
  }

  const sections = splitMarkdownByH2(markdown);
  console.log('  Sections: ' + sections.length);

  // Write _category_.json
  fs.writeFileSync(
    path.join(docDir, '_category_.json'),
    JSON.stringify({ label: slug.includes('admin') ? 'DMP Platform Manual for Admin User' : 'DMP Platform Manual for Developer', link: { type: 'generated-index' } }, null, 2),
    'utf8'
  );

  sections.forEach((sec, idx) => {
    const pos = idx + 1;
    const slg = slugify(sec.title);
    const filename = String(pos).padStart(2, '0') + '-' + slg + '.md';
    const content = makeFrontmatter(sec.title, pos) + '\n' + sec.lines.join('\n');
    fs.writeFileSync(path.join(docDir, filename), content, 'utf8');
    console.log('  Wrote: ' + filename + ' -> ' + sec.title);
  });

  return sections.map(s => ({ title: s.title, slug: slugify(s.title) }));
}

function generateSidebars(adminSections, devSections) {
  const adminItems = adminSections.map((s, i) => ({
    type: 'doc',
    id: 'admin-manual/' + s.slug,
    label: s.title
  }));
  const devItems = devSections.map((s, i) => ({
    type: 'doc',
    id: 'developer-manual/' + s.slug,
    label: s.title
  }));

    const sidebars = {
    tutorialSidebar: [
      {
        type: 'category',
        label: 'DMP Platform Manual for Admin User',
        link: { type: 'generated-index', title: 'DMP Platform Manual for Admin User' },
        items: adminItems
      },
      {
        type: 'category',
        label: 'DMP Platform Manual for Developer',
        link: { type: 'generated-index', title: 'DMP Platform Manual for Developer' },
        items: devItems
      }
    ]
  };

  const content = '/** @type {import(\'@docusaurus/plugin-content-docs\').SidebarsConfig} */\nconst sidebars = ' + JSON.stringify(sidebars, null, 2) + ';\n\nmodule.exports = sidebars;\n';
  fs.writeFileSync(path.join(__dirname, 'sidebars.js'), content, 'utf8');
  console.log('Generated: sidebars.js');
}

// ── Main ──

async function main() {
  console.log('DMP Help Center Pipeline');
  console.log('Time: ' + new Date().toLocaleString('zh-CN'));

  console.log('\nGetting Feishu Token...');
  const token = await getToken();
  console.log('Token OK');

  let adminSections = [];
  let devSections = [];

  for (const doc of DOC_CONFIGS) {
    console.log('\nSyncing: ' + doc.title);
    const blocks = await getAllBlocks(token, doc.docToken);
    console.log('  Blocks: ' + blocks.length);

    const imgBaseRelPath = '/img/' + doc.slug;
    const result = blocksToMarkdown(blocks, imgBaseRelPath);
    console.log('  Markdown: ' + result.markdown.length + ' chars');
    console.log('  Image refs: ' + result.imageTokens.length);

    const docDir = path.join(DOCS_DIR, doc.slug);
    const sections = buildDocFiles(docDir, doc.slug, result.markdown);

    if (doc.key === 'admin') adminSections = sections;
    else devSections = sections;
  }

  generateSidebars(adminSections, devSections);

  // Generate index.md
  const indexContent = '---\nslug: /\ntitle: DMP Help Center\n---\n\n# DMP Help Center\n\nWelcome to the DMP Platform Help Center.\n\n## Documentation\n\n- **Admin User Manual** — For platform owners and administrators\n- **Developer Manual** — For hardware developers\n\n---\n\n*Last updated: ' + new Date().toISOString().split('T')[0] + '*\n';
  fs.writeFileSync(path.join(DOCS_DIR, 'index.md'), indexContent, 'utf8');
  console.log('Generated: docs/index.md');

  console.log('\nPipeline Complete!');
}

main().catch(err => {
  console.error('Pipeline failed:', err.message);
  console.error(err.stack);
  process.exit(1);
});
