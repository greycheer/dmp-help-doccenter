# 飞书云文档格式分析报告

> 分析对象：pipeline.js 转换逻辑 vs 飞书文档实际输出内容
> 日期：2026-04-07

---

## 一、已发现的问题（按严重程度排序）

### 🔴 P0 — 直接导致构建失败或内容丢失

#### 1. 空标题 block 生成 `##  ` / `###  ` 乱码

**现象**：多处出现仅有空格的标题行：
```markdown
###  

##  

#  
```

**出现位置**：
- `developer-manual/01-introduction.md` 第 13 行：`###  `
- `admin-manual/02-product-development-on-dmp-platform.md` 第 181 行：`##  `
- `admin-manual/02-product-development-on-dmp-platform.md` 第 295 行：`######  `
- `admin-manual/02-product-development-on-dmp-platform.md` 第 607 行：`####  `
- `admin-manual/03-appendix.md` 第 11 行：`#  `
- `developer-manual/03-appendix.md` 第 91、95 行

**根因**：飞书文档中存在空内容的标题 block（可能是用户删除文字后残留，或复制粘贴带入的空标题），`extractRichText(elements)` 返回空字符串，pipeline 直接输出 `##  ` 或 `#  `。

**影响**：
- Docusaurus 解析空标题时不报错，但生成无文本的锚点，TOC 中出现空白条目
- 按 H2 拆分时，空 `##  ` 会被误认为新章节起点，**把后续内容错误地拆到新 section**

**脚本修复方案**：
```javascript
// 在 blocksToMarkdown 中，标题处理部分加空文本过滤
if (typeStr.startsWith('heading')) {
  const level = typeStr.replace('heading', '');
  const text = extractRichText(elements).trim();
  if (!text) continue; // 跳过空标题
  lines.push('#'.repeat(parseInt(level)) + ' ' + text);
  lines.push('');
}
```

---

#### 2. 裸 URL 未转成链接

**现象**：`admin-manual/02-product-development-on-dmp-platform.md` 第 299 行：
```markdown
https://wdcdn.qpic.cn/MTY4ODg1NjExMDY0MjI2Mg_991828_hTQMdqHTmVfhRxul_1774512104?w=2272&h=1223&type=image/png
```

**根因**：飞书文档中用户直接粘贴了图片 URL（不是通过飞书图片 block 插入），而是作为纯文本内容。`extractRichText()` 把它当作普通文本处理，不会加链接标记。

**影响**：
- 在 Docusaurus 页面上显示为不可点击的纯文本
- 更严重的是，这本来应该是一张图片，但飞书 API 返回的是 text block 而非 image block，**图片完全丢失了**

**脚本修复方案**：
```javascript
// 在 extractRichText 中，检测独立的图片 URL 并转为 Markdown 图片语法
const IMAGE_URL_PATTERN = /^https?:\/\/[^\s]+\.(?:png|jpe?g|gif|webp|svg)(?:\?[^\s]*)?$/i;
// 或者更宽松：检测 wdcdn.qpic.cn / feishu.cn / larksuite.com 等域名
const CLOUD_IMAGE_PATTERN = /^https?:\/\/(?:[a-z0-9-]+\.)?(?:qpic\.cn|feishu\.cn|larksuite\.com|lh3\.googleusercontent\.com)\//i;
```

如果文本内容匹配这些模式，自动转为 `![image](URL)`。

---

#### 3. 下划线转 bold 导致格式失真

**现象**：pipeline.js 第 87-88 行：
```javascript
// Skip underline in MDX - use bold instead to avoid <u> conflicts
if (s.underline) t = '**' + t + '**';
```

**根因**：Markdown 原生不支持下划线，pipeline 选择用 bold 替代。但飞书文档中很多「导航路径」使用了下划线样式（如 `[Settings]`），这些在原文中应该只是导航指引，不应该变成粗体。

**影响**：视觉上与用户手动标记的粗体无法区分，语义失真。

**脚本修复方案**：
```javascript
// 方案 A：忽略下划线（最安全）
if (s.underline) { /* 不做任何处理，保留纯文本 */ }

// 方案 B：用 <u> 标签（Docusaurus 默认支持 HTML）
if (s.underline) t = '<u>' + t + '</u>';
```

---

### 🟡 P1 — 影响阅读体验但不导致错误

#### 4. 标题层级跳级 / 不规范

**现象**：`developer-manual/02-product-development-on-dmp-platform.md` 中：
```markdown
### 2.1 Product Development          ← H3
#### 2.2.1 Product Firmware Management  ← H4（跳过 2.2，直接从 2.1 跳到 2.2.1）
```

而 `admin-manual/02-product-development-on-dmp-platform.md` 中：
```markdown
### 2.0 How to Access to the Platform  ← H3（序号用 2.0）
### 2.1 Platform Account...           ← H3
#### 2.1.1 Section Overview           ← H4
##### 2.2.1.1 Section Overview        ← H5（跳了 H4 的 2.2）
```

**根因**：飞书文档作者手动编号，编号与飞书标题级别（H2/H3/H4/H5/H6）不完全对应，且存在跳级和编号不一致。

**影响**：
- 当前按 H2 拆分时不受影响（只认 `##`）
- 改为叶子节点拆分后，标题树算法需要正确处理跳级——如果 H3 下面直接跟 H5，应该把 H5 当作 H3 的子节点（而不是 H4 的子节点）

**脚本修复方案**：
```javascript
// 在 buildHeadingTree 中，用 "栈" 模式处理跳级：
// 新标题 level <= 当前 level → 回溯到对应的父级
// 新标题 level > 当前 level + 1 → 仍视为当前节点的直接子节点（不创建中间空节点）

function buildHeadingTree(blocks) {
  const root = { level: 1, title: 'root', blocks: [], children: [] };
  const stack = [root]; // 栈顶永远是当前父节点

  for (const block of blocks) {
    if (isHeading(block)) {
      const level = block.block_type; // 3=H1, 4=H2, 5=H3, 6=H4, 7=H5, 8=H6
      const node = { level, title: extractTitle(block), blocks: [], children: [] };

      // 跳级容忍：回溯到第一个 level < 当前 level 的祖先
      while (stack.length > 1 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      stack[stack.length - 1].children.push(node);
      stack.push(node);
    } else {
      stack[stack.length - 1].blocks.push(block);
    }
  }
  return root;
}
```

---

#### 5. 列表嵌套丢失

**现象**：飞书文档中的多级列表，转换后全部变为平铺的一级列表：
```markdown
- Required Information [Important]
- **Account Nickname** — Fill in according to...
- **Verification Email** — Used to receive...
- Additional Information for Hardware Developers
- Company Name
- Company Address
```

**根因**：`extractRichText()` 只处理 block 级别，没有处理飞书的 `bullet` / `ordered` block 的 `depth` 属性。飞书 API 返回的列表 block 包含 `bullet.depth` 或 `ordered.depth` 字段表示嵌套层级，但 pipeline.js 完全忽略了。

**影响**：原本有层级的操作步骤、信息分类变成了扁平列表，阅读时难以区分层级关系。

**脚本修复方案**：
```javascript
} else if (typeStr === 'bullet') {
  const depth = data.depth || 0;
  const indent = '  '.repeat(depth);
  lines.push(indent + '- ' + extractRichText(elements));
  lines.push('');
} else if (typeStr === 'ordered') {
  const depth = data.depth || 0;
  const seq = (data.style && data.style.sequence) || '1';
  const indent = '  '.repeat(depth);
  lines.push(indent + seq + '. ' + extractRichText(elements));
  lines.push('');
}
```

---

#### 6. callout 被转成普通引用，丢失语义

**现象**：pipeline.js 第 175-177 行：
```javascript
} else if (typeStr === 'callout') {
  const emoji = (data.style && data.style.icon && data.style.icon.emoji) || '';
  lines.push('> ' + (emoji ? emoji + ' ' : '') + extractRichText(elements));
  lines.push('');
}
```

**根因**：飞书的 callout（高亮块）支持多种类型（info、warning、tip、error 等），每种有不同背景色和图标。pipeline 只保留 emoji，全部变成了 `>` 引用块，Docusaurus 渲染后视觉上没有区分。

**影响**：原文中用红色警告块强调的注意事项，在帮助中心变成了和普通引用一样的灰色块。

**脚本修复方案**：
```javascript
} else if (typeStr === 'callout') {
  // 根据飞书 callout 背景色推断类型
  const bg = data.style?.background || '';
  let type = 'note';
  if (bg.includes('red') || bg.includes('error')) type = 'danger';
  else if (bg.includes('yellow') || bg.includes('warning')) type = 'warning';
  else if (bg.includes('blue') || bg.includes('info')) type = 'info';
  else if (bg.includes('green') || bg.includes('tip')) type = 'tip';

  // 使用 Docusaurus 的 admonition 语法
  lines.push(':::' + type);
  lines.push(extractRichText(elements));
  lines.push(':::');
  lines.push('');
}
```

---

#### 7. 代码块内容用 extractRichText 处理可能丢失格式

**现象**：pipeline.js 第 158 行：
```javascript
lines.push(extractRichText(elements));
```

**根因**：`extractRichText()` 会给文本添加 `**bold**`、`*italic*` 等标记，但代码块内容应该是纯文本，不应该有 Markdown 格式标记。如果飞书代码块中有用粗体标记的关键字，输出后会出现 `**code**` 在代码块内。

**影响**：代码块内出现 Markdown 标记，渲染时可能显示异常。

**脚本修复方案**：
```javascript
} else if (typeStr === 'code') {
  const lang = (data.style && data.style.language) || '';
  // 代码块内容应该用纯文本，不做格式化处理
  const codeText = (data.elements || []).map(el => {
    return el.text_run?.content || '';
  }).join('');
  lines.push('```' + lang);
  lines.push(codeText);
  lines.push('```');
  lines.push('');
}
```

---

### 🟢 P2 — 优化项，不影响正确性

#### 8. < > 转义可能误伤有效标签

**现象**：pipeline.js 第 185 行：
```javascript
md = md.replace(/(?<!=)<(?![\/!a-zA-Z])/g, '\\<');
```

**根因**：这个正则试图转义 `<` 符号防止被当作 HTML 标签，但排除条件不够精确。例如 `<` 后跟空格时不转义，但 `<2.3` 会被转义为 `\<2.3`。

而 `developer-manual/02-product-development-on-dmp-platform.md` 第 135 行实际出现了：
```markdown
please refer to the \<**Product Firmware Management>**
```

这里 `\<` 和 `>` 形成了混乱——既有转义又有没转义的 `>`。

**脚本修复方案**：
```javascript
// 更精确的方案：只在行内文本上下文中转义 < 和 >
// 跳过已有 \ 转义、已有 Markdown 语法（链接、图片、代码块）
// 或者干脆去掉这个后处理，Docusaurus 的 MDX 本身就能正确处理裸 <
md = md.replace(/<(?!=)(?!\s)(?!\/)/g, '\\<');
// 如果是 > 后跟非数字非字母的情况，转义
md = md.replace(/>(?=[^a-zA-Z0-9\/])/g, '\\>');
```

实际上 **建议直接删除这个后处理**，Docusaurus 3.7 的 MDX 引擎可以正确处理文本中的 `<` 和 `>`，不需要手动转义。

---

#### 9. 图片下载逻辑缺失

**现象**：pipeline.js 收集了 `imageTokens`，但从未实际下载图片。当前仓库中 `static/img/` 下的 96 张图片是通过其他方式（可能是手动或旧版脚本）获取的。

**影响**：同步后图片引用指向不存在的文件，页面显示为图片裂开。`npm run sync` 不是完整的同步流程。

**脚本修复方案**：
```javascript
async function downloadImage(token, savePath) {
  const url = 'https://open.feishu.cn/open-apis/docx/v1/documents/' + docToken +
    '/blocks/' + token + '/resources/' + token + '?type=image';
  const res = await httpRequest('GET', url, { 'Authorization': 'Bearer ' + token });
  // 写入文件...
}

async function syncImages(imageTokens, imgDir) {
  fs.mkdirSync(imgDir, { recursive: true });
  const existing = new Set(fs.readdirSync(imgDir).filter(f => f.endsWith('.png')));
  const needed = new Set(imageTokens.map(t => t + '.png'));

  // 删除多余
  for (const f of existing) {
    if (!needed.has(f)) fs.unlinkSync(path.join(imgDir, f));
  }
  // 下载新增
  for (const token of imageTokens) {
    if (!existing.has(token + '.png')) {
      await downloadImage(token, path.join(imgDir, token + '.png'));
      await new Promise(r => setTimeout(r, 200)); // 限频
    }
  }
}
```

---

## 二、飞书文档格式规范建议

以下是建议在飞书端改善的格式习惯，可以从源头减少转换问题：

| # | 问题 | 飞书端建议 | 脚本能否兜底 |
|---|------|-----------|------------|
| 1 | 空标题 block | 删除文档中所有空白标题行，在发布前做一次检查 | ✅ 可以跳过空标题 |
| 2 | 图片用 URL 文本粘贴 | 统一使用飞书图片 block 插入图片，不要粘贴图片链接 | ⚠️ 可以自动检测 URL 转图片，但飞书图片 token 不同，无法下载 |
| 3 | 标题编号与层级不一致 | 规范编号：H2 用大编号（2.），H3 用子编号（2.1），不跳级 | ✅ 脚本可用标题级别自动编号，忽略原文编号 |
| 4 | 列表嵌套层级丢失 | 使用飞书原生的多级列表（Tab 缩进），不要用 bullet 模拟子列表 | ✅ 脚本可读取 depth 字段 |
| 5 | callout 类型丢失 | 正常使用飞书 callout 即可，脚本根据颜色映射 | ✅ 脚本可自动映射 |
| 6 | 导航路径用下划线 | 这是飞书常见用法，脚本正确处理即可 | ✅ 忽略下划线或用 HTML `<u>` |

---

## 三、脚本容错改造优先级

| 优先级 | 改造项 | 工作量 | 收益 |
|--------|--------|--------|------|
| **P0-1** | 跳过空标题 | 3 行代码 | 消除空白标题乱码，防止错误拆分 |
| **P0-2** | 裸 URL → 图片检测 | 10 行代码 | 防止图片丢失 |
| **P0-3** | 修复下划线处理 | 1 行代码 | 消除格式失真 |
| **P1-1** | 列表 depth 嵌套 | 5 行代码 | 恢复列表层级 |
| **P1-2** | callout → admonition | 15 行代码 | 语义化高亮块 |
| **P1-3** | 代码块纯文本 | 5 行代码 | 防止代码块内格式污染 |
| **P1-4** | 标题跳级容忍 | 20 行代码 | 支持叶子节点拆分 |
| **P2-1** | 删除 < > 转义后处理 | 删除 1 行 | 消除误转义 |
| **P2-2** | 图片增量下载 | 40 行代码 | 完善 sync 流程 |

**总计约 100 行代码改造**，建议在 pipeline.js 改造（叶子节点拆分）时一并实施。

---

## 四、结论

**飞书文档格式总体良好**，主要问题集中在 3 个方面：

1. **空标题残留**（P0）— 文档编辑过程中产生的垃圾 block，脚本可完全兜底
2. **图片插入方式不统一**（P0）— 少数图片用 URL 粘贴而非飞书图片 block，脚本可部分兜底
3. **编号与层级不完全对应**（P1）— 人工编号习惯问题，脚本可通过标题级别自动处理，不依赖编号

**建议在飞书端只做一件事**：发布前删除所有空白标题。其余问题都可以通过脚本改造完全覆盖。

---

*分析完成。如需我直接改造 pipeline.js，请确认。*
