#!/usr/bin/env node
/**
 * sync.js — 飞书文档同步到 Docusaurus
 * 
 * 用法:
 *   node sync.js              # 同步所有文档
 *   node sync.js admin        # 只同步 admin-manual
 *   node sync.js developer    # 只同步 developer-manual
 * 
 * 环境变量（可选，否则使用内置凭证）:
 *   FEISHU_APP_ID
 *   FEISHU_APP_SECRET
 *   GITHUB_TOKEN
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ── 配置 ──────────────────────────────────────────────────────────────────────

const APP_ID = process.env.FEISHU_APP_ID || 'cli_a944f3bde3b89bce';
const APP_SECRET = process.env.FEISHU_APP_SECRET || 'vfdmNKgwYQApJhMnjX2vUhtEL2vgQZ85';

const DOCS = [
  {
    key: 'admin',
    docToken: 'P9yTddX2RoalLFxCHnbcPX5QnOb',
    wikiToken: 'KAwYwIzlriHW4fkoImJcO4eMnJe',
    title: 'DMP Platform Manual for Admin User',
    slug: 'admin-manual',
    sidebar_position: 1,
  },
  {
    key: 'developer',
    docToken: 'XFzWdutGcoS0Ngxg1pWc9T1cnDg',
    wikiToken: 'Mw3mwB4aRiVSjOkQnYacOn1onpf',
    title: 'DMP Platform Manual for Developer',
    slug: 'developer-manual',
    sidebar_position: 2,
  },
];

const OUTPUT_DIR = path.join(__dirname, 'docs');
const STATIC_DIR = path.join(__dirname, 'static', 'img');

// ── HTTP ──────────────────────────────────────────────────────────────────────

function httpRequest(method, url, headers, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = {
      hostname: u.hostname,
      path: u.pathname + u.search,
      method,
      headers: Object.assign({ 'Content-Type': 'application/json' }, headers),
    };
    const payload = body ? JSON.stringify(body) : null;
    if (payload) opts.headers['Content-Length'] = Buffer.byteLength(payload);
    const req = https.request(opts, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const raw = Buffer.concat(chunks).toString('utf8');
        try { resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(raw) }); }
        catch { resolve({ status: res.statusCode, headers: res.headers, data: raw }); }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function getToken() {
  const r = await httpRequest('POST',
    'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
    {}, { app_id: APP_ID, app_secret: APP_SECRET }
  );
  if (r.data.code !== 0) throw new Error('Token 获取失败: ' + JSON.stringify(r.data));
  return r.data.tenant_access_token;
}

async function getAllBlocks(token, docToken) {
  const items = [];
  let pageToken = '';
  while (true) {
    const url = `https://open.feishu.cn/open-apis/docx/v1/documents/${docToken}/blocks?page_size=500` +
      (pageToken ? `&page_token=${pageToken}` : '');
    const r = await httpRequest('GET', url, { Authorization: `Bearer ${token}` });
    if (r.data.code !== 0) throw new Error('获取 blocks 失败: ' + JSON.stringify(r.data));
    items.push(...(r.data.data.items || []));
    if (!r.data.data.has_more) break;
    pageToken = r.data.data.page_token;
  }
  return items;
}

// ── Image download ────────────────────────────────────────────────────────────

function downloadImageFollowRedirect(url, token, destPath, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) return reject(new Error('Too many redirects'));
    const u = new URL(url);
    const opts = { hostname: u.hostname, path: u.pathname + u.search, headers: { Authorization: `Bearer ${token}` } };
    https.get(opts, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        downloadImageFollowRedirect(res.headers.location, token, destPath, redirectCount + 1)
          .then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) { res.resume(); return reject(new Error(`HTTP ${res.statusCode}`)); }
      const stream = fs.createWriteStream(destPath);
      res.pipe(stream);
      stream.on('finish', resolve);
      stream.on('error', reject);
    }).on('error', reject);
  });
}

async function downloadImage(token, fileToken, imgDir) {
  const url = `https://open.feishu.cn/open-apis/drive/v1/medias/${fileToken}/download`;
  const filename = `${fileToken}.png`;
  const destPath = path.join(imgDir, filename);
  if (fs.existsSync(destPath)) return filename; // 已存在则跳过
  try {
    await downloadImageFollowRedirect(url, token, destPath);
    return filename;
  } catch (e) {
    console.warn(`  [WARN] 图片下载失败 ${fileToken}: ${e.message}`);
    return null;
  }
}

// ── Text extraction ───────────────────────────────────────────────────────────

function extractText(elements) {
  if (!Array.isArray(elements)) return '';
  return elements.map(el => {
    if (!el) return '';
    if (el.text_run) {
      let t = el.text_run.content || '';
      const s = el.text_run.text_element_style || {};
      if (s.bold && t.trim()) t = `**${t}**`;
      if (s.italic && t.trim()) t = `*${t}*`;
      if (s.strikethrough && t.trim()) t = `~~${t}~~`;
      if (s.inline_code && t.trim()) t = `\`${t}\``;
      if (el.text_run.link && el.text_run.link.url) {
        const href = decodeURIComponent(el.text_run.link.url);
        t = `[${t}](${href})`;
      }
      return t;
    }
    if (el.mention_doc) return `[${el.mention_doc.title || 'doc'}](${el.mention_doc.url || ''})`;
    if (el.mention_user) return `@${el.mention_user.name || 'user'}`;
    if (el.equation) return `$${el.equation.content}$`;
    return '';
  }).join('');
}

// ── Blocks -> Markdown ────────────────────────────────────────────────────────

async function blocksToMarkdown(allBlocks, token, imgDir, imgRelPath) {
  const blockMap = Object.fromEntries(allBlocks.map(b => [b.block_id, b]));
  const processed = new Set();
  const output = [];

  async function processBlock(b, depth) {
    if (!b || processed.has(b.block_id)) return;
    processed.add(b.block_id);
    const t = b.block_type;

    if (t === 1) {
      for (const cid of b.children || []) await processBlock(blockMap[cid], 0);
      return;
    }
    if (t >= 3 && t <= 11) {
      const level = t - 2;
      const el = b[`heading${level}`] || {};
      const text = extractText(el.elements);
      if (text.trim()) {
        output.push(`${'#'.repeat(Math.min(level, 6))} ${text}`);
        output.push('');
      }
      return;
    }
    if (t === 2) {
      const para = b.paragraph || {};
      const text = extractText(para.elements);
      output.push(text);
      return;
    }
    if (t === 12) {
      const el = b.bullet || {};
      const text = extractText(el.elements);
      output.push(`${'  '.repeat(depth)}- ${text}`);
      for (const cid of b.children || []) await processBlock(blockMap[cid], depth + 1);
      return;
    }
    if (t === 13) {
      const el = b.ordered || {};
      const text = extractText(el.elements);
      output.push(`${'  '.repeat(depth)}1. ${text}`);
      for (const cid of b.children || []) await processBlock(blockMap[cid], depth + 1);
      return;
    }
    if (t === 14) {
      const el = b.code || {};
      const langRaw = ((el.style || {}).language || '').toLowerCase();
      const langMap = { plaintext: '', shell: 'bash', python: 'python', javascript: 'js', typescript: 'ts', java: 'java', go: 'go', sql: 'sql', json: 'json', xml: 'xml', yaml: 'yaml', bash: 'bash' };
      const lang = langMap[langRaw] !== undefined ? langMap[langRaw] : langRaw;
      const text = extractText(el.elements);
      output.push(`\`\`\`${lang}`);
      output.push(text);
      output.push('```');
      output.push('');
      return;
    }
    if (t === 15) {
      const el = b.quote || {};
      const text = extractText(el.elements);
      output.push(`> ${text}`);
      return;
    }
    if (t === 17) {
      const el = b.todo || {};
      const done = (el.style || {}).done ? '[x]' : '[ ]';
      const text = extractText(el.elements);
      output.push(`- ${done} ${text}`);
      return;
    }
    if (t === 18) { output.push('---'); output.push(''); return; }
    if (t === 22) {
      const img = b.image || {};
      if (img.token && token) {
        const filename = await downloadImage(token, img.token, imgDir);
        if (filename) { output.push(''); output.push(`![](${imgRelPath}/${filename})`); output.push(''); }
      }
      return;
    }
    if (t === 24) {
      const tbl = b.table || {};
      const rowCount = (tbl.property || {}).row_size || 0;
      const colCount = (tbl.property || {}).column_size || 0;
      const cellIds = b.children || [];
      if (rowCount > 0 && colCount > 0) {
        const cellTexts = [];
        for (const cid of cellIds) {
          const cell = blockMap[cid];
          let cellText = '';
          if (cell) {
            for (const subId of cell.children || []) {
              const sub = blockMap[subId];
              if (!sub) continue;
              const st = sub.block_type;
              if (st === 2) cellText += extractText((sub.paragraph || {}).elements || []);
              else if (st >= 3 && st <= 11) cellText += extractText(((sub[`heading${st - 2}`]) || {}).elements || []);
            }
            processed.add(cell.block_id);
            for (const sid of cell.children || []) processed.add(sid);
          }
          cellTexts.push(cellText.replace(/\n/g, ' ').replace(/\|/g, '\\|').trim());
        }
        output.push('');
        for (let r = 0; r < rowCount; r++) {
          const cells = [];
          for (let c = 0; c < colCount; c++) cells.push(cellTexts[r * colCount + c] || '');
          output.push(`| ${cells.join(' | ')} |`);
          if (r === 0) output.push(`| ${cells.map(() => '---').join(' | ')} |`);
        }
        output.push('');
      }
      return;
    }
    if (t === 19) {
      const el = b.callout || {};
      const text = extractText(el.elements);
      if (text.trim()) output.push(`> 💡 ${text}`);
      for (const cid of b.children || []) await processBlock(blockMap[cid], depth);
      return;
    }
    // 其他：递归子节点
    for (const cid of b.children || []) await processBlock(blockMap[cid], depth);
  }

  await processBlock(allBlocks[0], 0);

  const result = [];
  let blanks = 0;
  for (const line of output) {
    if (line === '') { blanks++; if (blanks <= 1) result.push(line); }
    else { blanks = 0; result.push(line); }
  }
  return result.join('\n');
}

// ── Section split ─────────────────────────────────────────────────────────────

function splitSections(markdown) {
  const lines = markdown.split('\n');
  const sections = [];
  let current = null;
  for (const line of lines) {
    if (line.match(/^## .+/)) {
      if (current) sections.push(current);
      current = { title: line.replace(/^## /, '').trim(), lines: [line] };
    } else if (line.match(/^# .+/)) {
      if (current) sections.push(current);
      current = { title: line.replace(/^# /, '').trim(), lines: [line] };
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) sections.push(current);
  return sections;
}

function slugify(text) {
  return text.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-\u4e00-\u9fa5]/g, '')
    .replace(/-+/g, '-').replace(/^-|-$/g, '')
    .substring(0, 60) || 'section';
}

function frontmatter(title, position) {
  return `---\nsidebar_position: ${position}\ntitle: "${title.replace(/"/g, '\\"')}"\n---\n`;
}

// ── Write doc ─────────────────────────────────────────────────────────────────

async function syncDoc(doc, token) {
  console.log(`\n📄 同步: ${doc.title}`);
  const blocks = await getAllBlocks(token, doc.docToken);
  console.log(`   Blocks: ${blocks.length}`);

  const docDir = path.join(OUTPUT_DIR, doc.slug);
  const imgDir = path.join(STATIC_DIR, doc.slug);
  fs.mkdirSync(docDir, { recursive: true });
  fs.mkdirSync(imgDir, { recursive: true });

  const markdown = await blocksToMarkdown(blocks, token, imgDir, `/img/${doc.slug}`);
  console.log(`   Markdown: ${markdown.length} 字符`);

  // 写 _category_.json
  fs.writeFileSync(
    path.join(docDir, '_category_.json'),
    JSON.stringify({ label: doc.title, position: doc.sidebar_position, link: { type: 'generated-index', title: doc.title } }, null, 2),
    'utf8'
  );

  // 清理旧文件（保留 _category_.json）
  for (const f of fs.readdirSync(docDir)) {
    if (f !== '_category_.json') fs.unlinkSync(path.join(docDir, f));
  }

  const sections = splitSections(markdown);
  if (sections.length === 0) {
    fs.writeFileSync(path.join(docDir, 'index.md'), frontmatter(doc.title, 1) + '\n' + markdown, 'utf8');
    console.log(`   写入: index.md`);
  } else {
    sections.forEach((sec, idx) => {
      const slug = slugify(sec.title);
      const filename = `${String(idx + 1).padStart(2, '0')}-${slug}.md`;
      const content = frontmatter(sec.title, idx + 1) + '\n' + sec.lines.join('\n');
      fs.writeFileSync(path.join(docDir, filename), content, 'utf8');
      console.log(`   写入: ${filename}`);
    });
  }

  const imgs = fs.readdirSync(imgDir);
  console.log(`   图片: ${imgs.length} 张`);
}

// ── Entry ─────────────────────────────────────────────────────────────────────

async function main() {
  const filter = process.argv[2];
  console.log('🚀 DMP Help Center 飞书文档同步工具');
  console.log(`   时间: ${new Date().toLocaleString('zh-CN')}`);
  if (filter) console.log(`   过滤: ${filter}`);
  console.log('');

  console.log('🔑 获取飞书 Token...');
  const token = await getToken();
  console.log('   Token OK');

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.mkdirSync(STATIC_DIR, { recursive: true });

  const targets = filter ? DOCS.filter(d => d.key.includes(filter) || d.slug.includes(filter)) : DOCS;
  if (targets.length === 0) {
    console.error(`❌ 未找到匹配文档: ${filter}`);
    process.exit(1);
  }

  for (const doc of targets) await syncDoc(doc, token);

  console.log('\n✅ 同步完成！');
}

main().catch(err => {
  console.error('\n❌ 同步失败:', err.message);
  process.exit(1);
});
