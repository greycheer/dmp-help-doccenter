/**
 * pipeline.js — DMP Help Center sync pipeline (v2.4)
 * Feishu doc → heading tree → multi-level directory + files
 * 
 * Changes from v1:
 *   - buildHeadingTree(): recursive tree with level-skip tolerance + empty heading filter
 *   - writeTreeToDocs(): nested dirs + _category_.json + frontmatter
 *   - syncImages(): incremental image download with cleanup
 *   - blocksToMarkdown() enhancements: underline fix, bare-URL images, list depth,
 *     callout→admonition, code block plain text, remove < > escaping
 * 
 * Changes in v2.1:
 *   - stripHeadingNumber(): unified removal of leading numbering (e.g. "2. ", "1.1 ")
 *   - Applied to both buildHeadingTree() and blocksToMarkdown() for consistency
 * 
 * Changes in v2.2:
 *   - Quick Guide post-processing: auto-link section names to doc pages
 *   - fetchNewTableAsMarkdown(): block_type 31 table support
 *   - top-level block filtering by parent_id
 * 
 * Changes in v2.3:
 *   - Fixed buildHeadingTree(): use block index to match heading with node
 *     instead of title matching, preventing content misplacement when duplicate
 *     titles exist (e.g., multiple "Section Overview" headings)
 * 
 * Changes in v2.4:
 *   - Fixed nested list rendering: bullet/ordered blocks with children are now
 *     recursively rendered with proper indentation. Previously nested list items
 *     were lost because only top-level blocks were processed.
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
    sidebarLabel: 'For Admin User',
    sidebarPosition: 2,
    slug: 'admin-manual',
  },
  {
    key: 'developer',
    docToken: 'XFzWdutGcoS0Ngxg1pWc9T1cnDg',
    title: 'DMP Platform Manual for Developer',
    sidebarLabel: 'For Developer',
    sidebarPosition: 3,
    slug: 'developer-manual',
  },
];

/**
 * Quick Guide link mappings.
 * After all docs are generated, pipeline scans the Quick Guide markdown file
 * and replaces section references with clickable links.
 * 
 * Key = display text (after numbering is stripped, case-insensitive match)
 * Value = relative path from Quick Guide file to target doc page
 *         (using Docusaurus slugs — directory/file names without numeric prefixes)
 */
const QUICK_GUIDE_LINKS = {
  'admin': {
    // Quick Guide file is at: admin-manual/01-introduction/04-quick-guide.md
    filePattern: 'quick-guide',
    links: [
      {
        // Match text like "Platform Account and Role Management" (case-insensitive)
        match: /platform account and role management/i,
        href: '../product-development-on-dmp-platform/platform-account-and-role-management/section-overview',
      },
      {
        match: /product development management/i,
        href: '../product-development-on-dmp-platform/product-development-management/category-creation-and-management/section-overview',
      },
      {
        match: /create app/i,
        href: '../product-development-on-dmp-platform/app-management/create-app/section-overview',
      },
      {
        match: /app list configuration/i,
        href: '../product-development-on-dmp-platform/app-management/app-list-configuration/agreement-configuration',
      },
      {
        match: /network provisioning and front.?end category management/i,
        href: '../product-development-on-dmp-platform/app-management/network-provisioning-and-front-end-category-management/section-overview',
      },
      {
        match: /customer relationship management/i,
        href: '../product-development-on-dmp-platform/customer-relationship-management/after-sales-management',
      },
    ],
  },
};

// Block type map (numeric -> string)
const BT = {
  1: 'page', 2: 'text', 3: 'heading1', 4: 'heading2', 5: 'heading3',
  6: 'heading4', 7: 'heading5', 8: 'heading6', 12: 'bullet', 13: 'ordered',
  14: 'code', 15: 'quote', 16: 'divider', 17: 'todo', 22: 'table',
  27: 'image', 28: 'callout', 30: 'sheet',
  31: 'table_new', 32: 'table_cell'
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

/**
 * Fetch a bitable (embedded sheet) and render as Markdown table.
 * Requires bitable:app permission on the Feishu app.
 */
async function fetchBitableAsMarkdown(token, sheetToken) {
  try {
    // 1. List data tables
    let tablesUrl = 'https://open.feishu.cn/open-apis/bitable/v1/apps/' + sheetToken + '/tables?page_size=100';
    const tablesResp = await httpRequest('GET', tablesUrl, { 'Authorization': 'Bearer ' + token });
    if (tablesResp.code !== 0 || !tablesResp.data || !tablesResp.data.items) {
      console.log('    [BITABLE] Cannot list tables for ' + sheetToken + ': ' + (tablesResp.msg || tablesResp.code));
      return null;
    }

    const mdParts = [];

    // Process each data table
    for (const table of tablesResp.data.items) {
      const tableId = table.table_id;
      const tableName = table.name || 'Table';

      // 2. Get fields
      const fieldsResp = await httpRequest('GET',
        'https://open.feishu.cn/open-apis/bitable/v1/apps/' + sheetToken + '/tables/' + tableId + '/fields?page_size=100',
        { 'Authorization': 'Bearer ' + token }
      );
      if (fieldsResp.code !== 0 || !fieldsResp.data || !fieldsResp.data.items) {
        console.log('    [BITABLE] Cannot list fields for table ' + tableId);
        continue;
      }

      // Map field type to name, skip unsupported types
      const fieldMap = {};
      const colNames = [];
      for (const f of fieldsResp.data.items) {
        // Only include text-like fields (1=text, 2=number, 3=single_select, 4=multi_select,
        // 5=date, 7=checkbox, 11=phone, 13=url, 15=email, 17=duplicate, 1001=created_time, 1002=modified_time)
        const supportedTypes = [1, 2, 3, 4, 5, 7, 11, 13, 15, 17, 1001, 1002, 1003, 1004, 1005];
        if (supportedTypes.includes(f.type)) {
          fieldMap[f.field_id] = f.field_name;
          colNames.push(f.field_name);
        }
      }

      if (colNames.length === 0) continue;

      // 3. Fetch all records (paginated)
      let allRecords = [];
      let pageToken = '';
      while (true) {
        let recUrl = 'https://open.feishu.cn/open-apis/bitable/v1/apps/' + sheetToken + '/tables/' + tableId + '/records?page_size=500&field_type=0';
        if (pageToken) recUrl += '&page_token=' + encodeURIComponent(pageToken);
        const recResp = await httpRequest('GET', recUrl, { 'Authorization': 'Bearer ' + token });
        if (recResp.code !== 0 || !recResp.data) break;
        allRecords = allRecords.concat(recResp.data.items || []);
        if (!recResp.data.has_more || !recResp.data.page_token) break;
        pageToken = recResp.data.page_token;
      }

      // 4. Render Markdown table
      if (allRecords.length === 0) {
        mdParts.push('**' + tableName + '** (empty)');
        mdParts.push('');
        continue;
      }

      mdParts.push('**' + tableName + '**');
      mdParts.push('');

      // Header row
      mdParts.push('| ' + colNames.join(' | ') + ' |');
      mdParts.push('| ' + colNames.map(() => '---').join(' | ') + ' |');

      // Data rows
      for (const record of allRecords) {
        const row = colNames.map(name => {
          const val = record.fields[name];
          if (val === undefined || val === null) return '';
          if (Array.isArray(val)) {
            // multi_select etc.
            return val.map(v => typeof v === 'object' ? (v.text || v.name || JSON.stringify(v)) : v).join(', ');
          }
          if (typeof val === 'object') {
            return val.text || val.name || val.link || String(val);
          }
          return String(val).replace(/\|/g, '\\|').replace(/\n/g, ' ');
        });
        mdParts.push('| ' + row.join(' | ') + ' |');
      }
      mdParts.push('');
    }

    return mdParts.length > 0 ? mdParts.join('\n') : null;
  } catch (e) {
    console.log('    [BITABLE] Error fetching bitable ' + sheetToken + ': ' + e.message);
    return null;
  }
}

// ── Text extraction (enhanced) ──

/**
 * Fetch a new-style table (block_type 31) by getting its cell children (type 32)
 * and rendering as Markdown table.
 * cellIds: array of cell block IDs (row-major order)
 * property: { column_size, row_size, header_row, merge_info }
 */
async function fetchNewTableAsMarkdown(token, docToken, blockId, cellIds, property) {
  try {
    const cols = property.column_size || 1;
    const rows = property.row_size || Math.ceil(cellIds.length / cols);
    const hasHeader = property.header_row;

    // Fetch all cell blocks in one call
    const url = 'https://open.feishu.cn/open-apis/docx/v1/documents/' + docToken +
      '/blocks/' + blockId + '/children?document_revision_id=-1&page_size=500';
    const resp = await httpRequest('GET', url, { 'Authorization': 'Bearer ' + token });

    if (resp.code !== 0 || !resp.data || !resp.data.items) {
      console.log('    [TABLE-31] Cannot fetch cells for ' + blockId + ': ' + (resp.msg || resp.code));
      return null;
    }

    // Build cell content map: cellId -> text
    const cellMap = {};
    for (const cellBlock of resp.data.items) {
      const cellId = cellBlock.block_id;
      // Get children of this cell block to get text content
      const childUrl = 'https://open.feishu.cn/open-apis/docx/v1/documents/' + docToken +
        '/blocks/' + cellId + '/children?document_revision_id=-1&page_size=100';
      const childResp = await httpRequest('GET', childUrl, { 'Authorization': 'Bearer ' + token });

      if (childResp.code === 0 && childResp.data && childResp.data.items) {
        const texts = [];
        for (const ch of childResp.data.items) {
          if (ch.block_type === 2 && ch.text && ch.text.elements) {
            texts.push(extractRichText(ch.text.elements));
          }
        }
        cellMap[cellId] = texts.join(' ').trim();
      } else {
        cellMap[cellId] = '';
      }
    }

    // Render Markdown table
    const tLines = [];
    const startRow = hasHeader ? 0 : 0;

    // Header
    const hdr = [];
    for (let c = 0; c < cols; c++) {
      const idx = c; // first row
      const cid = cellIds[idx];
      hdr.push(cellMap[cid] || '');
    }
    tLines.push('| ' + hdr.join(' | ') + ' |');
    tLines.push('| ' + hdr.map(() => '---').join(' | ') + ' |');

    // Data rows
    for (let r = 1; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        const cid = cellIds[idx];
        const text = cid ? (cellMap[cid] || '') : '';
        row.push(text.replace(/\|/g, '\\|').replace(/\n/g, ' '));
      }
      tLines.push('| ' + row.join(' | ') + ' |');
    }

    return tLines.join('\n') + '\n';
  } catch (e) {
    console.log('    [TABLE-31] Error: ' + e.message);
    return null;
  }
}

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

/**
 * Recursively render nested list items (bullet/ordered with children).
 * Fetches children via API if not already in allBlocks map.
 */
async function renderNestedList(block, allBlocksMap, token, docToken, depth, imgBaseRelPath, imageTokens) {
  const lines = [];
  const btNum = block.block_type;
  const typeStr = BT[btNum];
  const data = block[typeStr] || {};
  const elements = data.elements || [];
  const indent = '  '.repeat(depth);
  
  if (typeStr === 'bullet') {
    lines.push(indent + '- ' + extractRichText(elements));
  } else if (typeStr === 'ordered') {
    const seq = (data.style && data.style.sequence) || '1';
    lines.push(indent + seq + '. ' + extractRichText(elements));
  }
  
  // Find children of this block
  let children = [];
  
  // First check if children are in allBlocksMap (pre-fetched)
  for (const [id, b] of allBlocksMap) {
    if (b.parent_id === block.block_id) {
      children.push(b);
    }
  }
  
  // If no children found in map, fetch via API
  if (children.length === 0 && token && docToken) {
    try {
      const url = `https://open.feishu.cn/open-apis/docx/v1/documents/${docToken}/blocks/${block.block_id}/children?document_revision_id=-1&page_size=100`;
      const resp = await httpRequest('GET', url, { 'Authorization': 'Bearer ' + token });
      if (resp.code === 0 && resp.data && resp.data.items) {
        children = resp.data.items;
        // Add to map for future use
        for (const child of children) {
          allBlocksMap.set(child.block_id, child);
        }
      }
    } catch (e) {
      // Silently fail, no children
    }
  }
  
  // Sort children by their position (if available) or keep API order
  children.sort((a, b) => {
    // Use block_id as fallback for stable sorting
    return a.block_id.localeCompare(b.block_id);
  });
  
  // Recursively render children
  for (const child of children) {
    const childType = BT[child.block_type];
    if (childType === 'bullet' || childType === 'ordered') {
      const childLines = await renderNestedList(child, allBlocksMap, token, docToken, depth + 1, imgBaseRelPath, imageTokens);
      lines.push(...childLines);
    } else if (childType === 'text') {
      const text = extractRichText(child.text?.elements || []);
      if (text.trim()) {
        lines.push(indent + '  ' + text);
      }
    } else if (childType === 'image' && child.image?.token) {
      lines.push(indent + '  ![image](' + imgBaseRelPath + '/' + child.image.token + '.png)');
      imageTokens.push(child.image.token);
    }
  }
  
  return lines;
}

async function blocksToMarkdown(blocks, imgBaseRelPath, token, docToken, allBlocks = []) {
  const lines = [];
  const imageTokens = [];
  
  // Build a map of all blocks for quick lookup
  const allBlocksMap = new Map();
  for (const b of allBlocks) {
    allBlocksMap.set(b.block_id, b);
  }
  // Also add current blocks to map
  for (const b of blocks) {
    allBlocksMap.set(b.block_id, b);
  }

  for (const block of blocks) {
    const btNum = block.block_type;
    const typeStr = BT[btNum];
    if (!typeStr) continue;
    if (btNum === 1) continue; // page block
    if (btNum === 32) continue; // table_cell: handled by table_new parent

    // block_type 31 uses property key 'table', not 'table_new'
    const data = (btNum === 31) ? block.table : block[typeStr];
    if (!data) continue;

    const elements = data.elements || [];

    if (typeStr.startsWith('heading')) {
      // [4.5a] Skip empty headings
      const headingText = extractRichText(elements).trim();
      if (!headingText) continue;

      // [4.5h] Strip leading numbering for clean headings
      const cleanHeading = stripHeadingNumber(headingText);
      if (!cleanHeading) continue;

      const level = typeStr.replace('heading', '');
      lines.push('#'.repeat(parseInt(level)) + ' ' + cleanHeading);
      lines.push('');
    } else if (typeStr === 'text') {
      let text = extractRichText(elements);
      // [4.5b] Detect bare image URLs
      text = enhanceTextWithImages(text);
      if (text.trim()) { lines.push(text); lines.push(''); }
    } else if (typeStr === 'bullet' || typeStr === 'ordered') {
      // [v2.3] Recursively render nested list items
      const listLines = await renderNestedList(block, allBlocksMap, token, docToken, 0, imgBaseRelPath, imageTokens);
      lines.push(...listLines);
      lines.push('');
    } else if (typeStr === 'table') {
      // Normal table (block_type 22): inline cells in doc block
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
    } else if (typeStr === 'sheet') {
      // Embedded bitable (block_type 30): fetch via Bitable API
      if (data.token && token) {
        const tableMd = await fetchBitableAsMarkdown(token, data.token);
        if (tableMd) {
          lines.push(tableMd);
        } else {
          lines.push('> *Embedded table could not be loaded (check bitable API permissions)*');
          lines.push('');
        }
      } else {
        lines.push('> *Embedded table skipped (no API token or not connected)*');
        lines.push('');
      }
    } else if (typeStr === 'table_new') {
      // New-style table (block_type 31): cells are child blocks (type 32)
      if (data.property && data.cells && docToken && token) {
        const tableMd = await fetchNewTableAsMarkdown(
          token, docToken, block.block_id, data.cells, data.property
        );
        if (tableMd) {
          lines.push(tableMd);
          lines.push('');
        } else {
          lines.push('> *Table could not be loaded*');
          lines.push('');
        }
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

// ── Heading Number Stripper ──

/**
 * Remove leading numbering from headings.
 * Examples: "2. Introduction" → "Introduction"
 *           "1.1 Purpose" → "Purpose"
 *           "3.2.1 Details" → "Details"
 * Also handles trailing dots after numbers: "2..1" edge case
 */
function stripHeadingNumber(text) {
  return text.replace(/^\d+(\.\d+)*\.?\s+/, '').trim();
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
 * 
 * Fix v2.3: Use block index to match heading with node, avoiding duplicate title issues.
 */
function buildHeadingTree(blocks, startLevel) {
  const root = { level: startLevel - 1, title: '', slug: '', blocks: [], children: [] };
  const stack = [root]; // stack of ancestor nodes
  const headingIndexToNode = new Map(); // block index -> node mapping

  // First pass: build tree structure and record heading->node mapping
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
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

    // [4.5h] Strip leading numbering
    const cleanHeading = stripHeadingNumber(headingText);
    if (!cleanHeading) continue;

    const node = {
      level,
      title: cleanHeading,
      slug: slugify(cleanHeading),
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
    
    // Record mapping from block index to node
    headingIndexToNode.set(i, node);
  }

  // Second pass: distribute non-heading blocks to the correct node
  // Use block index to find the correct node, avoiding duplicate title issues
  let currentNode = root;
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const btNum = block.block_type;
    const typeStr = BT[btNum];

    // If this is a heading, move currentNode to this heading's node
    if (typeStr && typeStr.startsWith('heading')) {
      const level = parseInt(typeStr.replace('heading', ''));
      if (level >= startLevel) {
        const node = headingIndexToNode.get(i);
        if (node) currentNode = node;
      }
      continue;
    }

    // Collect image tokens from image blocks for syncImages
    if (typeStr === 'image' && block.image && block.image.token) {
      currentNode.blocks.push(block);
    } else if (btNum === 1 || btNum === 32) {
      // skip page block and table_cell (handled by table_new parent)
    } else {
      currentNode.blocks.push(block);
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
async function writeTreeToDocs(node, outputDir, imgBaseRelPath, positionPrefix, token, docToken, allBlocks) {
  if (!node.children.length) return;

  for (let idx = 0; idx < node.children.length; idx++) {
    const child = node.children[idx];
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
      await writeTreeToDocs(child, dirPath, imgBaseRelPath, position, token, docToken, allBlocks);
    } else {
      // Leaf: create .md file
      const result = await blocksToMarkdown(child.blocks, imgBaseRelPath, token, docToken, allBlocks);
      const frontmatter = makeFrontmatter(child.title, parseInt(position, 10));
      const content = frontmatter + '\n\n' + result.markdown.trim() + '\n';
      const filePath = path.join(outputDir, paddedIdx + '-' + child.slug + '.md');
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('  FILE: ' + path.relative(DOCS_DIR, filePath) + ' (' + child.title + ')');

      // Collect image tokens
      _collectedImageTokens.push(...result.imageTokens);
    }
  }
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

// ── Quick Guide Link Post-Processing ──

/**
 * After all docs are generated, find Quick Guide files and replace
 * section name references with clickable Markdown links.
 * 
 * The function scans for patterns like:
 *   "Please refer to **Section Name**"
 * and replaces them with:
 *   "Please refer to **[Section Name](relative/path)**"
 * 
 * If the text is already a link, it is left unchanged.
 */
async function processQuickGuideLinks() {
  for (const [docKey, config] of Object.entries(QUICK_GUIDE_LINKS)) {
    const docConfig = DOC_CONFIGS.find(d => d.key === docKey);
    if (!docConfig) continue;

    const docDir = path.join(DOCS_DIR, docConfig.slug);

    // Find Quick Guide file
    let quickGuideFile = null;
    function findFile(dir) {
      if (!fs.existsSync(dir)) return;
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          findFile(fullPath);
        } else if (entry.isFile() && entry.name.toLowerCase().includes(config.filePattern) && entry.name.endsWith('.md')) {
          quickGuideFile = fullPath;
          return;
        }
      }
    }
    findFile(docDir);

    if (!quickGuideFile) {
      console.log('  [' + docKey + '] Quick Guide file not found, skipping');
      continue;
    }

    let content = fs.readFileSync(quickGuideFile, 'utf8');
    let replaced = 0;

    for (const linkDef of config.links) {
      // Match "**Section Name**" that is NOT already inside a markdown link.
      // Already linked: **[text](url)** — the ** is preceded by [
      // Not linked: refer to **Section Name** — the ** is preceded by a space or line start
      const pattern = new RegExp(
        '(?<!\\[)\\*\\*(' + linkDef.match.source + ')\\*\\*',
        'gi'
      );

      const newContent = content.replace(pattern, (match, groupName) => {
        replaced++;
        return '**[' + groupName + '](' + linkDef.href + ')**';
      });

      if (newContent !== content) {
        content = newContent;
      }
    }

    if (replaced > 0) {
      fs.writeFileSync(quickGuideFile, content, 'utf8');
      console.log('  [' + docKey + '] Quick Guide: ' + replaced + ' link(s) injected');
    } else {
      console.log('  [' + docKey + '] Quick Guide: no matching sections found (may already be linked)');
    }
  }
}

// ── Clean docs directory ──

function cleanDocDir(dir) {
  if (!fs.existsSync(dir)) return;
  fs.rmSync(dir, { recursive: true, force: true });
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
    // Filter: only top-level blocks (parent_id === docToken) to avoid nested table cells etc.
    const topBlocks = blocks.filter(b => b.parent_id === doc.docToken);
    console.log('  Top-level blocks: ' + topBlocks.length);

    const imgBaseRelPath = '/img/' + doc.slug;
    const imgDir = path.join(STATIC_DIR, doc.slug);
    const docDir = path.join(DOCS_DIR, doc.slug);

    // Clean target directory
    cleanDocDir(docDir);
    fs.mkdirSync(docDir, { recursive: true });

    // Build heading tree
    const tree = buildHeadingTree(topBlocks, 2); // Start from H2
    console.log('  H2 sections: ' + tree.children.length);

    // Write top-level _category_.json (use sidebarLabel for shorter sidebar name)
    const categoryLabel = doc.sidebarLabel || doc.title;
    const catJson = {
      label: categoryLabel,
      link: { type: 'generated-index', title: doc.title },
    };
    if (doc.sidebarPosition) catJson.position = doc.sidebarPosition;
    fs.writeFileSync(
      path.join(docDir, '_category_.json'),
      JSON.stringify(catJson, null, 2),
      'utf8'
    );

    // Reset image token collector
    _collectedImageTokens = [];

    // Recursively write docs (pass all blocks for nested list rendering)
    await writeTreeToDocs(tree, docDir, imgBaseRelPath, '', token, doc.docToken, blocks);

    console.log('  Total image refs: ' + _collectedImageTokens.length);

    // Sync images
    console.log('  Syncing images...');
    await syncImages(token, _collectedImageTokens, imgDir);
  }

  // Generate index.md (skip if custom React homepage exists at src/pages/index.js)
  const customHomePage = path.join(__dirname, 'src', 'pages', 'index.js');
  if (!fs.existsSync(customHomePage)) {
    const indexContent = '---\nslug: /\ntitle: DMP Help Center\n---\n\n# DMP Help Center\n\nWelcome to the DMP Platform Help Center.\n\n## Documentation\n\n- **Admin User Manual** — For platform owners and administrators\n- **Developer Manual** — For hardware developers\n\n---\n\n*Last updated: ' + new Date().toISOString().split('T')[0] + '*\n';
    fs.writeFileSync(path.join(DOCS_DIR, 'index.md'), indexContent, 'utf8');
    console.log('\nGenerated: docs/index.md');
  } else {
    console.log('\nSkipped: docs/index.md (custom React homepage exists)');
  }

  // Post-process: Quick Guide link injection
  console.log('\nPost-processing Quick Guide links...');
  await processQuickGuideLinks();

  console.log('\n✅ Pipeline Complete!');
}

main().catch(err => {
  console.error('Pipeline failed:', err.message);
  console.error(err.stack);
  process.exit(1);
});
