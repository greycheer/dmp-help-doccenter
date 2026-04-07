/**
 * pipeline.js — DMP Help Center sync pipeline (v2)
 * Feishu doc → heading tree → multi-level directory + files
 * 
 * Changes from v1:
 *   - buildHeadingTree(): recursive tree with level-skip tolerance + empty heading filter
 *   - writeTreeToDocs(): nested dirs + _category_.json + frontmatter
 *   - syncImages(): incremental image download with cleanup
 *   - blocksToMarkdown() enhancements: underline fix, bare-URL images, list depth,
 *     callout→admonition, code block plain text, remove < > escaping
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const DOCS_DIR = path.join(__dirname, 'docs');
const STATIC_DIR = path.join(__dirname, 'static', 'img');

const APP_ID = process.env.FEISHU_APP_ID || 'cli_a944f3bde3b89bce';
const APP_SECRET = process.env.FEISHU_APP_SECRET || 'vfdmNKgwYQApJhMnjX2vUhtEL2vgQZ85';

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
const BT = {
  1: 'page', 2: 'text', 3: 'heading1', 4: 'heading2', 5: 'heading3',
  6: 'heading4', 7: 'heading5', 8: 'heading6', 12: 'bullet', 13: 'ordered',
  14: 'code', 15: 'quote', 16: 'divider', 17: 'todo', 22: 'table',
  27: 'image', 28: 'callout', 30: 'sheet'
};

// CDN domains for bare-URL image detection
const IMAGE_CDN_DOMAINS = ['qpic.cn', 'feishu.cn', 'larksuite.com', 'lf-cdn-tos.bytescm.com', 'pstatp.com'];

// ── HTTP helpers ──

function httpRequest(method, url, headers, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const payload = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: u.hostname, path: u.pathname + u.search, method,
      headers: Object.assign({ 'Content-Type': 'application/json' }, headers),
    };
    if (payload) opts.headers['Content-Length'] = Buffer.byteLength(payload);
    const mod = u.protocol === 'https:' ? https : http;
    const req = mod.request(opts, res => {
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

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ── Feishu API ──

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

function getImageDownloadUrl(token, imageToken) {
  return 'https://open.feishu.cn/open-apis/drive/v1/medias/' + imageToken + '/download?type=image';
}

// ── Text extraction (enhanced) ──

function extractRichText(elements) {
  if (!elements) return '';
  return elements.map(el => {
    if (el.text_run) {
      let t = el.text_run.content || '';
      const s = el.text_run.text_element_style || {};

      // Bold
      if (s.bold) t = '**' + t + '**';
      // Italic
      if (s.italic) t = '*' + t + '*';
      // Strikethrough
      if (s.strikethrough) t = '~~' + t + '~~';

      // [4.5c] Underline fix: ignore underline, don't insert any markdown
      // Old behavior: if (s.underline) t = '**' + t + '**';

      // Inline code
      if (s.inline_code) t = '`' + t + '`';
      // Link
      if (el.text_run.link) t = '[' + t + '](' + el.text_run.link.url + ')';

      return t;
    }
    if (el.mention_user) return '@' + (el.mention_user.name || '');
    if (el.mention_doc) return '[Doc]';
    return '';
  }).join('');
}

/**
 * [4.5b] Detect bare image URLs in text and convert to markdown image syntax.
 */
function enhanceTextWithImages(text) {
  // Match URLs containing known Feishu CDN domains
  const urlPattern = new RegExp(
    '(https?://[^\\s<>"\'()]+(?:' + IMAGE_CDN_DOMAINS.map(d => d.replace('.', '\\.')).join('|') + ')[^\\s<>"\'()]*)',
    'gi'
  );
  return text.replace(urlPattern, '![]( $1 )'.replace(' ', ''));
}

// ── Block → Markdown (enhanced) ──

function blocksToMarkdown(blocks, imgBaseRelPath) {
  const lines = [];
  const imageTokens = [];

  for (const block of blocks) {
    const btNum = block.block_type;
    const typeStr = BT[btNum];
    if (!typeStr) continue;
    if (btNum === 1) continue; // page block

    const data = block[typeStr];
    if (!data) continue;

    const elements = data.elements || [];

    if (typeStr.startsWith('heading')) {
      // [4.5a] Skip empty headings
      const headingText = extractRichText(elements).trim();
      if (!headingText) continue;

      const level = typeStr.replace('heading', '');
      lines.push('#'.repeat(parseInt(level)) + ' ' + headingText);
      lines.push('');
    } else if (typeStr === 'text') {
      let text = extractRichText(elements);
      // [4.5b] Detect bare image URLs
      text = enhanceTextWithImages(text);
      if (text.trim()) { lines.push(text); lines.push(''); }
    } else if (typeStr === 'bullet') {
      // [4.5d] List depth support
      const depth = (data.depth != null) ? data.depth : 0;
      const indent = '  '.repeat(depth);
      lines.push(indent + '- ' + extractRichText(elements));
      lines.push('');
    } else if (typeStr === 'ordered') {
      // [4.5d] List depth support
      const depth = (data.depth != null) ? data.depth : 0;
      const indent = '  '.repeat(depth);
      const seq = (data.style && data.style.sequence) || '1';
      lines.push(indent + seq + '. ' + extractRichText(elements));
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
      // [4.5f] Code block: extract plain text, not rich text
      lines.push(extractPlainText(elements));
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
      // [4.5e] callout → Docusaurus admonition
      const admonitionType = mapCalloutToAdmonition(data);
      const emoji = (data.style && data.style.icon && data.style.icon.emoji) || '';
      const content = extractRichText(elements);
      lines.push(':::' + admonitionType);
      if (emoji) lines.push(emoji + ' ' + content);
      else lines.push(content);
      lines.push(':::');
      lines.push('');
    }
  }

  // [4.5g] Escape bare < that could trigger MDX JSX parse errors.
  // MDX treats < as JSX tag start. We escape < only when it's NOT followed
  // by a valid tag name character (letter, /, !, ?).
  // We skip code fences and admonition markers entirely.
  const rawMd = lines.join('\n');
  const mdLines = rawMd.split('\n');
  const escapedLines = mdLines.map(line => {
    // Skip code fences, admonition markers, table dividers
    if (/^(```|:::)/.test(line)) return line;
    // Escape < that is NOT followed by a letter, /, !, ? (i.e., not a valid tag start)
    return line.replace(/<(?![a-zA-Z\/\!?\#])/g, '\\<');
  });
  const md = escapedLines.join('\n');
  return { markdown: md, imageTokens };
}

/**
 * [4.5f] Extract plain text from code block elements without markdown formatting.
 */
function extractPlainText(elements) {
  if (!elements) return '';
  return elements.map(el => {
    if (el.text_run) return el.text_run.content || '';
    return '';
  }).join('');
}

/**
 * [4.5e] Map Feishu callout background color to Docusaurus admonition type.
 */
function mapCalloutToAdmonition(data) {
  const bg = (data.style && data.style.background) || '';
  const bgLower = bg.toLowerCase();

  if (bgLower.includes('red') || bgLower.includes('ff4d4f') || bgLower.includes('f5222d') || bgLower.includes('error')) return 'danger';
  if (bgLower.includes('orange') || bgLower.includes('fa8c16') || bgLower.includes('ff7d00') || bgLower.includes('warning')) return 'warning';
  if (bgLower.includes('green') || bgLower.includes('52c41a') || bgLower.includes('success') || bgLower.includes('tip')) return 'tip';
  // Default to note for blue, grey, and unknown
  return 'note';
}

// ── Slugify ──

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

// ── Heading Tree ──

/**
 * Build a tree from flat blocks array.
 * Start level: H2 (level 2). Only H2+ blocks become tree nodes.
 * Uses a stack-based approach for level-skip tolerance.
 * Empty headings are silently skipped.
 */
function buildHeadingTree(blocks, startLevel) {
  const root = { level: startLevel - 1, title: '', slug: '', blocks: [], children: [] };
  const stack = [root]; // stack of ancestor nodes

  for (const block of blocks) {
    const btNum = block.block_type;
    const typeStr = BT[btNum];
    if (!typeStr || !typeStr.startsWith('heading')) continue;

    const level = parseInt(typeStr.replace('heading', ''));
    if (level < startLevel) continue; // Skip H1 and above

    const data = block[typeStr];
    if (!data) continue;

    const headingText = extractRichText((data.elements || [])).trim();
    // [4.5a] Skip empty headings in tree building too
    if (!headingText) continue;

    const node = {
      level,
      title: headingText,
      slug: slugify(headingText),
      blocks: [],
      children: [],
    };

    // Find correct parent: pop stack until we find a node with lower level
    while (stack.length > 1 && stack[stack.length - 1].level >= level) {
      stack.pop();
    }

    // Attach to current top of stack (level-skip tolerance: even if H3→H5, attach to H3)
    stack[stack.length - 1].children.push(node);
    stack.push(node);
  }

  // Distribute non-heading blocks to the correct node
  const nodeList = []; // flat list of all nodes in order
  function collectNodes(node) {
    for (const child of node.children) {
      nodeList.push(child);
      collectNodes(child);
    }
  }
  collectNodes(root);

  let currentLeaf = root; // block container
  for (const block of blocks) {
    const btNum = block.block_type;
    const typeStr = BT[btNum];

    // If this is a heading, move currentLeaf to this node
    if (typeStr && typeStr.startsWith('heading')) {
      const level = parseInt(typeStr.replace('heading', ''));
      if (level >= startLevel) {
        const data = block[typeStr];
        if (data) {
          const headingText = extractRichText((data.elements || [])).trim();
          if (headingText) {
            const match = nodeList.find(n => n.title === headingText);
            if (match) currentLeaf = match;
          }
        }
      }
      continue;
    }

    // Collect image tokens from image blocks for syncImages
    if (typeStr === 'image' && block.image && block.image.token) {
      currentLeaf.blocks.push(block);
    } else if (btNum === 1) {
      // skip page block
    } else {
      currentLeaf.blocks.push(block);
    }
  }

  return root;
}

// ── Write tree to docs ──

function makeFrontmatter(title, position) {
  return '---\nsidebar_position: ' + position + '\ntitle: "' + title.replace(/"/g, '\\"') + '"\ntoc: true\ntoc_max_heading_level: 6\ntoc_min_heading_level: 2\n---';
}

function makeCategoryJson(label, position) {
  const obj = {
    label: label,
    position: position,
    link: { type: 'generated-index', title: label },
  };
  return JSON.stringify(obj, null, 2);
}

/**
 * Recursively write the heading tree to docs directory.
 * - Non-leaf nodes → subdirectory + _category_.json
 * - Leaf nodes → .md file with frontmatter
 */
function writeTreeToDocs(node, outputDir, imgBaseRelPath, positionPrefix) {
  if (!node.children.length) return;

  node.children.forEach((child, idx) => {
    const position = positionPrefix ? positionPrefix + '.' + (idx + 1) : String(idx + 1);
    const paddedIdx = String(idx + 1).padStart(2, '0');

    if (child.children.length > 0) {
      // Non-leaf: create subdirectory
      const dirPath = path.join(outputDir, paddedIdx + '-' + child.slug);
      fs.mkdirSync(dirPath, { recursive: true });

      // Write _category_.json
      fs.writeFileSync(
        path.join(dirPath, '_category_.json'),
        makeCategoryJson(child.title, parseInt(position, 10)),
        'utf8'
      );
      console.log('  DIR:  ' + path.relative(DOCS_DIR, dirPath) + '/ (' + child.title + ')');

      // Recurse
      writeTreeToDocs(child, dirPath, imgBaseRelPath, position);
    } else {
      // Leaf: create .md file
      const result = blocksToMarkdown(child.blocks, imgBaseRelPath);
      const frontmatter = makeFrontmatter(child.title, parseInt(position, 10));
      const content = frontmatter + '\n\n' + result.markdown.trim() + '\n';
      const filePath = path.join(outputDir, paddedIdx + '-' + child.slug + '.md');
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('  FILE: ' + path.relative(DOCS_DIR, filePath) + ' (' + child.title + ')');

      // Collect image tokens
      _collectedImageTokens.push(...result.imageTokens);
    }
  });
}

// Global collector for image tokens during tree writing
let _collectedImageTokens = [];

// ── Image sync ──

/**
 * Download a single image from Feishu with retry.
 */
async function downloadImage(token, imgToken, imgDir, retries) {
  const url = getImageDownloadUrl(token, imgToken);
  const filePath = path.join(imgDir, imgToken + '.png');

  return new Promise((resolve, reject) => {
    const u = new URL(url);
    https.get({
      hostname: u.hostname, path: u.pathname + u.search,
      headers: { 'Authorization': 'Bearer ' + token }
    }, async (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        // Follow redirect
        const redirect = res.headers.location;
        if (redirect) {
          resolve(await downloadImage(token, imgToken, imgDir, retries));
          return;
        }
      }
      if (res.statusCode !== 200) {
        if (retries > 0) {
          await sleep(500);
          resolve(await downloadImage(token, imgToken, imgDir, retries - 1));
          return;
        }
        reject(new Error('Download failed: ' + res.statusCode + ' for ' + imgToken));
        return;
      }

      const fileStream = fs.createWriteStream(filePath);
      res.pipe(fileStream);
      fileStream.on('finish', () => { fileStream.close(); resolve(filePath); });
      fileStream.on('error', reject);
    }).on('error', async (err) => {
      if (retries > 0) {
        await sleep(500);
        resolve(await downloadImage(token, imgToken, imgDir, retries - 1));
      } else {
        reject(err);
      }
    });
  });
}

/**
 * Incremental image sync:
 * - A (Feishu tokens) - B (local files) → download new
 * - B - A → delete stale
 * Downloads with 200ms interval to avoid rate limits.
 */
async function syncImages(token, imageTokens, imgDir) {
  fs.mkdirSync(imgDir, { recursive: true });

  // Set A: tokens from Feishu
  const remoteSet = new Set(imageTokens);

  // Set B: existing local files
  const localFiles = new Set();
  if (fs.existsSync(imgDir)) {
    for (const f of fs.readdirSync(imgDir)) {
      if (f.endsWith('.png')) {
        localFiles.add(f.replace('.png', ''));
      }
    }
  }

  // New images to download
  const toDownload = [...remoteSet].filter(t => !localFiles.has(t));
  // Stale images to delete
  const toDelete = [...localFiles].filter(t => !remoteSet.has(t));

  if (toDelete.length > 0) {
    console.log('  Images to delete: ' + toDelete.length);
    for (const imgToken of toDelete) {
      const f = path.join(imgDir, imgToken + '.png');
      try { fs.unlinkSync(f); } catch {}
    }
  }

  if (toDownload.length > 0) {
    console.log('  Images to download: ' + toDownload.length);
    let downloaded = 0;
    for (const imgToken of toDownload) {
      try {
        await downloadImage(token, imgToken, imgDir, 3);
        downloaded++;
        if (downloaded % 10 === 0) console.log('    Downloaded: ' + downloaded + '/' + toDownload.length);
        await sleep(200); // Rate limit
      } catch (err) {
        console.error('    Failed to download ' + imgToken + ': ' + err.message);
      }
    }
    console.log('  Downloaded: ' + downloaded + '/' + toDownload.length);
  } else {
    console.log('  Images: all up-to-date (' + remoteSet.size + ' total)');
  }
}

// ── Clean docs directory ──

function cleanDocDir(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      // Recursively remove subdirectories
      cleanDocDir(fullPath);
      fs.rmdirSync(fullPath);
    } else if (entry.endsWith('.md') || entry.endsWith('.json')) {
      fs.unlinkSync(fullPath);
    }
  }
}

// ── Main ──

async function main() {
  console.log('DMP Help Center Pipeline v2');
  console.log('Time: ' + new Date().toLocaleString('zh-CN'));

  console.log('\nGetting Feishu Token...');
  const token = await getToken();
  console.log('Token OK');

  for (const doc of DOC_CONFIGS) {
    console.log('\n━━━ Syncing: ' + doc.title + ' ━━━');
    const blocks = await getAllBlocks(token, doc.docToken);
    console.log('  Blocks fetched: ' + blocks.length);

    const imgBaseRelPath = '/img/' + doc.slug;
    const imgDir = path.join(STATIC_DIR, doc.slug);
    const docDir = path.join(DOCS_DIR, doc.slug);

    // Clean target directory
    cleanDocDir(docDir);
    fs.mkdirSync(docDir, { recursive: true });

    // Build heading tree
    const tree = buildHeadingTree(blocks, 2); // Start from H2
    console.log('  H2 sections: ' + tree.children.length);

    // Write top-level _category_.json
    fs.writeFileSync(
      path.join(docDir, '_category_.json'),
      JSON.stringify({
        label: doc.title,
        link: { type: 'generated-index', title: doc.title },
      }, null, 2),
      'utf8'
    );

    // Reset image token collector
    _collectedImageTokens = [];

    // Recursively write docs
    writeTreeToDocs(tree, docDir, imgBaseRelPath, '');

    console.log('  Total image refs: ' + _collectedImageTokens.length);

    // Sync images
    console.log('  Syncing images...');
    await syncImages(token, _collectedImageTokens, imgDir);
  }

  // Generate index.md
  const indexContent = '---\nslug: /\ntitle: DMP Help Center\n---\n\n# DMP Help Center\n\nWelcome to the DMP Platform Help Center.\n\n## Documentation\n\n- **Admin User Manual** — For platform owners and administrators\n- **Developer Manual** — For hardware developers\n\n---\n\n*Last updated: ' + new Date().toISOString().split('T')[0] + '*\n';
  fs.writeFileSync(path.join(DOCS_DIR, 'index.md'), indexContent, 'utf8');
  console.log('\nGenerated: docs/index.md');

  console.log('\n✅ Pipeline Complete!');
}

main().catch(err => {
  console.error('Pipeline failed:', err.message);
  console.error(err.stack);
  process.exit(1);
});
