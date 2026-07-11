/**
 * pipeline_wecom.js — DMP Help Center sync pipeline (WeCom Docs)
 *
 * 从企业微信文档（Markdown）解析标题树，递归生成 Docusaurus 目录结构。
 *
 * 用法：
 *   node pipeline_wecom.js --input=wecom_docs/en_admin.md --lang=en --label="For Admin User" --slug=admin-manual
 *   node pipeline_wecom.js --input=wecom_docs/zh_admin.md --lang=zh-CN --label="管理员手册" --slug=admin-manual
 */

const fs = require('fs');
const path = require('path');

// ─── 参数 ───
const args = {};
process.argv.slice(2).forEach(a => { const [k, v] = a.split('='); args[k.replace('--', '')] = v; });
const INPUT = args.input, LANG = args.lang || 'en', LABEL = args.label || 'Manual', SLUG = args.slug || 'manual';
const OUT_DIR = LANG === 'en'
  ? path.join(__dirname, 'docs', SLUG)
  : path.join(__dirname, 'i18n', LANG, 'docusaurus-plugin-content-docs', 'current', SLUG);

if (!INPUT || !fs.existsSync(INPUT)) { console.error('缺少 --input'); process.exit(1); }
console.log(`📖 ${INPUT} → ${LANG === 'en' ? 'docs' : 'i18n/' + LANG}/${SLUG}/`);

// ─── Step 1: 读取 + 清理 ───
let content = fs.readFileSync(INPUT, 'utf8')
  .replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
console.log(`  文件: ${(content.length / 1024 / 1024).toFixed(1)} MB`);

// 提取 base64 图片
const imgDir = path.join(__dirname, 'static', 'img', SLUG);
fs.mkdirSync(imgDir, { recursive: true });
let imgCount = 0;
content = content.replace(/!\[([^\]]*)\]\(data:image\/(png|jpeg|jpg|gif);base64,([^)]+)\)/g, (_, alt, ext, b64) => {
  imgCount++;
  const fname = `w_${String(imgCount).padStart(4, '0')}.${ext === 'jpeg' ? 'jpg' : ext}`;
  try { fs.writeFileSync(path.join(imgDir, fname), Buffer.from(b64, 'base64')); } catch {}
  return `![${alt}](/img/${SLUG}/${fname})`;
});
if (imgCount) console.log(`  图片: ${imgCount} 张 → static/img/${SLUG}/`);

// ─── Step 2: 构建标题行索引 ───
const lines = content.split('\n');
const hRegex = /^(#{1,6})\s+(.+)/;
const headings = [];  // { line, level, title }

for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(hRegex);
  if (!m) continue;
  const title = m[2].replace(/\*\*/g, '').trim().replace(/\s+/g, ' ');
  if (!title) continue;
  headings.push({ line: i, level: m[1].length, title });
}

console.log(`  标题: ${headings.length} 个`);

// ─── Step 3: 递归构建节点树 ───
function slugify(text, fallback) {
  // 先尝试英文 slug
  let s = text.toLowerCase()
    .replace(/^[\d.]+[\s-]+/, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80);
  // 如果完全去掉了中文变成空的，用 fallback 编号
  if (!s || s.length < 2) {
    s = 'section-' + (fallback || '1');
  }
  return s;
}

function buildTree(hList, startIdx, endIdx) {
  if (startIdx >= endIdx) return [];
  const nodes = [];
  let i = startIdx;
  while (i < endIdx) {
    const h = hList[i];
    // 找 children: 下一个同级别或更高级别的 heading 之前的所有行
    let j = i + 1;
    while (j < endIdx && hList[j].level > h.level) j++;
    const children = (j > i + 1) ? buildTree(hList, i + 1, j) : [];
    nodes.push({ ...h, children });
    i = j;
  }
  return nodes;
}

// 跳过 H1（文档标题），从 H2 开始
const startIdx = headings.findIndex(h => h.level >= 2);
let topHeadings = startIdx >= 0 ? headings.slice(startIdx) : headings;

const tree = buildTree(topHeadings, 0, topHeadings.length);
const h2Count = topHeadings.filter(h => h.level === 2).length;
console.log(`  H2 目录: ${h2Count} 个`);

// ─── Step 4: 获取节点内容 ───
function getContent(h) {
  const start = h.line + 1;
  let end = lines.length;
  // 找到下一个同级或更高级标题
  for (let k = 0; k < headings.length; k++) {
    if (headings[k].line > h.line && headings[k].level <= h.level) {
      end = headings[k].line; break;
    }
  }
  return lines.slice(start, end).join('\n').trim();
}

// ─── Step 5: 写入（递归） ───
if (fs.existsSync(OUT_DIR)) fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

const rootPos = SLUG === 'admin-manual' ? 2 : 3;
const rootLabel = SLUG === 'admin-manual'
  ? (LANG === 'en' ? 'For Admin User' : '管理员手册')
  : (LANG === 'en' ? 'For Developer' : '开发者手册');
fs.writeFileSync(path.join(OUT_DIR, '_category_.json'), JSON.stringify({
  label: rootLabel, position: rootPos, link: { type: 'generated-index', title: tree[0]?.title || rootLabel },
}, null, 2), 'utf8');

let catIdx = 0, pageIdxGlobal = 0;
function writeNode(nodes, parentDir, depth) {
  for (const n of nodes) {
    if (n.children.length > 0) {
      // 非叶子 → 子目录
      catIdx++;
      const slug = slugify(n.title, String(catIdx));
      const dir = path.join(parentDir, `${String(catIdx).padStart(2, '0')}-${slug}`);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, '_category_.json'), JSON.stringify({
        label: n.title, position: catIdx, link: { type: 'generated-index', title: n.title },
      }, null, 2), 'utf8');
      writeNode(n.children, dir, depth + 1);
    } else {
      // 叶子 → .md 文件
      pageIdxGlobal++;
      const slug = slugify(n.title, String(pageIdxGlobal));
      const content = getContent(n);
      const fm = `---\nsidebar_position: ${pageIdxGlobal}\ntitle: "${n.title.replace(/"/g, '\\"')}"\ntoc: true\ntoc_max_heading_level: 6\ntoc_min_heading_level: 2\n---`;
      const file = `${String(pageIdxGlobal).padStart(2, '0')}-${slug}.md`;
      // MDX 安全转义
      let safeContent = content
        .replace(/<(?!\/?[a-zA-Z]|\!|\?)/g, '\\<')
        .replace(/\{/g, '\\{')
        .replace(/^\*\s+/gm, '- ');
      fs.writeFileSync(path.join(parentDir, file), fm + '\n\n' + safeContent, 'utf8');
    }
  }
}

writeNode(tree, OUT_DIR, 1);
console.log(`✅ 完成 → ${catIdx} 个节点`);
