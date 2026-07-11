/**
 * pipeline_wecom.js — DMP Help Center sync pipeline (WeCom Docs)  v3
 *
 * 从企业微信文档（Markdown）解析标题树，递归生成 Docusaurus 目录结构。
 *
 * v3 修复：
 *   - 图片按语言命名空间（static/img/{slug}/{lang}/w_XXXX.png）
 *   - fixWecomTable 重写：cell 支持多行续行（列表/段落），用 <br> 合并
 *   - fixWecomParagraphs：段落间补空行；行首 → 转列表项
 *   - 相邻粗体 **** 合并（修 WeCom 导出的 **a****b** 问题）
 *   - writeNode 改为每父节点本地计数器，兄弟按文档真实顺序
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

// 相邻粗体合并：WeCom 导出 **a****b** → **ab**（修多余的 *）
content = content.replace(/\*\*\*\*/g, '');

// 剔除源文档里的孤立占位/备注杂行（如"用一个常见品类做配置示例"、裸"通知"等）
// 只剔整行匹配的，不影响正文里出现的同名词
const JUNK_LINES = new Set(['用一个常见品类做配置示例', '通知', '用一个常见品类做配置示例。']);
content = content.split('\n').filter(l => !JUNK_LINES.has(l.trim())).join('\n');

// 提取 base64 图片（按语言分目录，避免 en/zh 同名 w_XXXX.png 互相覆盖）
const imgDir = path.join(__dirname, 'static', 'img', SLUG, LANG);
fs.mkdirSync(imgDir, { recursive: true });
let imgCount = 0;
content = content.replace(/!\[([^\]]*)\]\(data:image\/(png|jpeg|jpg|gif);base64,([^)]+)\)/g, (_, alt, ext, b64) => {
  imgCount++;
  const fname = `w_${String(imgCount).padStart(4, '0')}.${ext === 'jpeg' ? 'jpg' : ext}`;
  try { fs.writeFileSync(path.join(imgDir, fname), Buffer.from(b64, 'base64')); } catch {}
  return `![${alt}](/img/${SLUG}/${LANG}/${fname})`;
});
if (imgCount) console.log(`  图片: ${imgCount} 张 → static/img/${SLUG}/${LANG}/`);

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
  // 按位置生成 slug（section-N）：保证 EN/ZH 路径对齐（语言切换可停留在当前页），
  // 同时避免同名标题（如多个 "App"）导致 Docusaurus doc ID 冲突。
  // 侧边栏可读性由 _category_.json 的 label（真实标题）保证，URL 用 section-N。
  return 'section-' + (fallback || '1');
}

function buildTree(hList, startIdx, endIdx) {
  if (startIdx >= endIdx) return [];
  const nodes = [];
  let i = startIdx;
  while (i < endIdx) {
    const h = hList[i];
    let j = i + 1;
    while (j < endIdx && hList[j].level > h.level) j++;
    const children = (j > i + 1) ? buildTree(hList, i + 1, j) : [];
    nodes.push({ ...h, children });
    i = j;
  }
  return nodes;
}

const startIdx = headings.findIndex(h => h.level >= 2);
let topHeadings = startIdx >= 0 ? headings.slice(startIdx) : headings;

const tree = buildTree(topHeadings, 0, topHeadings.length);
const h2Count = topHeadings.filter(h => h.level === 2).length;
console.log(`  H2 目录: ${h2Count} 个`);

// ─── Step 4: 获取节点内容 ───
function getContent(h) {
  const start = h.line + 1;
  let end = lines.length;
  for (let k = 0; k < headings.length; k++) {
    if (headings[k].line > h.line && headings[k].level <= h.level) {
      end = headings[k].line; break;
    }
  }
  return lines.slice(start, end).join('\n').trim();
}

// ─── 表格修复 v2 ───
// 处理 WeCom 非标准表格：每个 cell 一行（|cell），行尾 | 终止符，cell 可含多行续行
function fixWecomTable(text) {
  const ls = text.split('\n');
  const out = [];
  let i = 0;
  while (i < ls.length) {
    if (!ls[i].trimStart().startsWith('|')) { out.push(ls[i]); i++; continue; }
    // 收集表格块
    const block = [];
    let j = i;
    let lastWasTerminator = false;
    while (j < ls.length) {
      const ln = ls[j];
      if (ln.trimStart().startsWith('|')) {
        block.push(ln);
        lastWasTerminator = (ln.trim() === '|');
        j++;
      } else if (/^#{1,6}\s/.test(ln)) {
        break;
      } else if (ln.trim() === '') {
        // 空白行：若下一行是 | 则属于表内，否则结束
        if (j + 1 < ls.length && ls[j + 1].trimStart().startsWith('|')) { block.push(ln); j++; }
        else break;
      } else {
        // 非 | 文本：cell 续行（仅当上一行不是终止符）
        if (!lastWasTerminator && block.length > 0) { block.push(ln); j++; }
        else break;
      }
    }
    // 校验是否含分隔行
    const sepIdx = block.findIndex(l => /^\|[-| ]+\|?$/.test(l.trim()));
    if (sepIdx < 0) {
      out.push(...block);
      i = j;
      continue;
    }
    // 列数
    const sep = block[sepIdx].trim();
    const colCount = (sep.match(/\|/g) || []).length - 1;
    if (colCount < 1) { out.push(...block); i = j; continue; }
    // 解析 cell
    const rows = [];
    let cur = [];
    let curCellText = null;
    for (const ln of block) {
      if (ln === block[sepIdx]) continue; // 跳过分隔行
      if (ln.trimStart().startsWith('|')) {
        const c = ln.replace(/^\s*\|/, '').replace(/\|\s*$/, '');
        if (c.trim() === '') {
          // 终止符 → 结束当前行
          if (curCellText !== null) { cur.push(curCellText); curCellText = null; }
          if (cur.length > 0) { rows.push(cur); cur = []; }
        } else {
          if (curCellText !== null) cur.push(curCellText);
          curCellText = c;
        }
      } else {
        // 续行追加到当前 cell
        if (curCellText !== null) curCellText += '\n' + ln;
      }
    }
    if (curCellText !== null) cur.push(curCellText);
    if (cur.length > 0) rows.push(cur);
    // 生成标准 markdown 表格
    if (rows.length === 0) { out.push(...block); i = j; continue; }
    const fmt = cells => '| ' + cells.map(c => String(c).replace(/\n/g, '<br />').replace(/\|/g, '\\|').trim()).join(' | ') + ' |';
    // 补齐列数
    const norm = rows.map(r => {
      while (r.length < colCount) r.push('');
      return r.slice(0, colCount);
    });
    out.push(fmt(norm[0]));
    out.push('| ' + Array(colCount).fill('---').join(' | ') + ' |');
    for (let r = 1; r < norm.length; r++) out.push(fmt(norm[r]));
    i = j;
  }
  return out.join('\n');
}

// ─── 段落修复：行首 → 转列表项；段落间补空行 ───
function isListItem(s) { return /^\s*([-*+]|\d+\.)\s/.test(s); }

function fixWecomParagraphs(text) {
  const ls = text.split('\n');
  const out = [];
  for (let i = 0; i < ls.length; i++) {
    out.push(ls[i]);
    const next = ls[i + 1];
    if (next === undefined) break;
    const line = ls[i];
    if (line.trim() === '' || next.trim() === '') continue;        // 已有空行
    const lineT = line.trimStart().startsWith('|');
    const nextT = next.trimStart().startsWith('|');
    if (lineT && nextT) continue;                                   // 表格内部
    if (/^#{1,6}\s/.test(line) || /^#{1,6}\s/.test(next)) continue; // 标题
    if (isListItem(line) && isListItem(next)) continue;             // 同一列表
    if (/^\s/.test(next) && !nextT) continue;                       // 缩进续行
    out.push('');                                                    // 文本↔文本 / 文本↔表格 边界补空行
  }
  return out.join('\n');
}

// ─── 写入 ───
if (fs.existsSync(OUT_DIR)) fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

const rootPos = SLUG === 'admin-manual' ? 2 : 3;
const rootLabel = SLUG === 'admin-manual'
  ? (LANG === 'en' ? 'For Admin User' : '管理员手册')
  : (LANG === 'en' ? 'For Developer' : '开发者手册');
fs.writeFileSync(path.join(OUT_DIR, '_category_.json'), JSON.stringify({
  label: rootLabel, position: rootPos, link: { type: 'generated-index', title: tree[0]?.title || rootLabel },
}, null, 2), 'utf8');

// 每父节点本地计数器（兄弟按文档真实顺序，解决 2.0 排在 2.1 后的问题）
// 目录用 section-N、叶子用 page-N，避免父目录与首叶子同名导致 Docusaurus 丢页
function writeNode(nodes, parentDir) {
  let pos = 0;
  for (const n of nodes) {
    pos++;
    if (n.children.length > 0) {
      const slug = 'section-' + pos;
      const dir = path.join(parentDir, `${String(pos).padStart(2, '0')}-${slug}`);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, '_category_.json'), JSON.stringify({
        label: n.title, position: pos, link: { type: 'generated-index', title: n.title },
      }, null, 2), 'utf8');
      writeNode(n.children, dir);
    } else {
      const slug = 'page-' + pos;
      const content2 = getContent(n);
      const fm = `---\nsidebar_position: ${pos}\ntitle: "${n.title.replace(/"/g, '\\"')}"\ntoc: true\ntoc_max_heading_level: 6\ntoc_min_heading_level: 2\n---`;
      const file = `${String(pos).padStart(2, '0')}-${slug}.md`;
      let safeContent = content2
        .replace(/<(?!\/?[a-zA-Z]|\!|\?)/g, '\\<')
        .replace(/\{/g, '\\{')
        .replace(/^\*\s+/gm, '- ')       // * 列表 → - 列表
        .replace(/^\s*→\s*/gm, '- ')     // 行首 → 转列表项
        .replace(/^\s*->\s*/gm, '- ');
      safeContent = fixWecomTable(safeContent);
      safeContent = fixWecomParagraphs(safeContent);
      fs.writeFileSync(path.join(parentDir, file), fm + '\n\n' + safeContent, 'utf8');
    }
  }
}

writeNode(tree, OUT_DIR);
console.log(`✅ 完成`);
