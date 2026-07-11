/**
 * check_i18n_alignment.js — 校验 EN (docs/{slug}) 与 ZH (i18n/zh-CN/.../{slug}) 文档结构对齐
 *
 * 用法：node check_i18n_alignment.js
 * 退出码：0 = 完全对齐；1 = 存在差异（差异明细见输出）
 *
 * 原理：EN/ZH 用同一套 position-based slug（section-N / page-N），若两棵树路径一致，
 *       则语言切换可一一对应；若不一致，列出 EN-only / ZH-only 路径供修正源文档。
 */
const fs = require('fs');
const path = require('path');

const BASE = __dirname;
const SLUGS = ['admin-manual', 'developer-manual'];
const EN_ROOT = (slug) => path.join(BASE, 'docs', slug);
const ZH_ROOT = (slug) => path.join(BASE, 'i18n', 'zh-CN', 'docusaurus-plugin-content-docs', 'current', slug);

function walk(dir, prefix = '') {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    const rel = prefix + e.name;
    if (e.isDirectory()) out.push(...walk(path.join(dir, e.name), rel + '/'));
    else out.push(rel);
  }
  return out;
}

let aligned = 0, enOnly = [], zhOnly = [], totalDiff = 0;

for (const slug of SLUGS) {
  const enFiles = new Set(walk(EN_ROOT(slug)));
  const zhFiles = new Set(walk(ZH_ROOT(slug)));
  for (const f of enFiles) {
    if (zhFiles.has(f)) aligned++;
    else enOnly.push(`${slug}/${f}`);
  }
  for (const f of zhFiles) {
    if (!enFiles.has(f)) zhOnly.push(`${slug}/${f}`);
  }
}

totalDiff = enOnly.length + zhOnly.length;

console.log('━━━ EN/ZH 文档结构对齐校验 ━━━');
console.log(`对齐页数: ${aligned}`);
console.log(`EN 独有: ${enOnly.length}`);
enOnly.forEach(f => console.log(`  [EN-only] ${f}`));
console.log(`ZH 独有: ${zhOnly.length}`);
zhOnly.forEach(f => console.log(`  [ZH-only] ${f}`));
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
if (totalDiff === 0) {
  console.log('✅ 完全对齐，语言切换可一一对应');
  process.exit(0);
} else {
  console.log(`⚠️  存在 ${totalDiff} 处差异，语言切换在这些路径会 404（已由 NotFound 兜底跳转文档根）`);
  console.log('   修正方法：在 WeCom 源文档中对齐 EN/ZH 的标题层级与数量后重新跑 pipeline_wecom.js');
  process.exit(1);
}
