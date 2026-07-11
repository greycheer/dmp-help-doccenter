/**
 * deploy_to_github.js — 把本地生成好的帮助中心内容部署到 GitHub
 *
 * 流程：clone → git rm 清空旧文件 → 拷贝新内容 → commit → push
 * 凭据：从环境变量 GH_PAT 或本地 gh_token.txt（已 gitignore）读取，不硬编码。
 *
 * 用法：
 *   set GH_PAT=ghp_xxxx  （或把 token 写入同目录 gh_token.txt）
 *   node deploy_to_github.js
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function getToken() {
  if (process.env.GH_PAT) return process.env.GH_PAT.trim();
  const tf = path.join(__dirname, 'gh_token.txt');
  if (fs.existsSync(tf)) return fs.readFileSync(tf, 'utf8').trim();
  console.error('❌ 未找到 GitHub PAT。请设置环境变量 GH_PAT，或把 token 写入 gh_token.txt');
  process.exit(1);
}

const TOKEN = getToken();
const OWNER = 'greycheer';
const REPO = 'dmp-help-doccenter';
const BASE = __dirname;
const CLONE = path.join(BASE, '..', '_dmp_deploy_tmp');
const REPO_URL = `https://${TOKEN}@github.com/${OWNER}/${REPO}.git`;

const DIRS = ['docs', 'i18n', 'static', 'src', '.github'];
const FILES = ['docusaurus.config.js', 'sidebars.js', 'package.json', 'pipeline_wecom.js', 'check_i18n_alignment.js', 'deploy_to_github.js', 'update_and_deploy.cmd', '.gitignore', 'README.md'];

function run(cmd) {
  console.log('  $ ' + cmd.replace(TOKEN, '***'));
  execSync(cmd, { stdio: 'inherit' });
}
function psRemove(p) {
  try { execSync(`powershell -NoProfile -Command "Remove-Item -LiteralPath '${p}' -Recurse -Force -ErrorAction SilentlyContinue"`, { stdio: 'ignore' }); } catch {}
}

function main() {
  console.log('📦 部署到 GitHub...');

  console.log('▶ clone 仓库...');
  psRemove(CLONE);
  run(`git clone --depth 1 ${REPO_URL} "${CLONE}"`);

  console.log('▶ 清空旧文件...');
  run(`git -C "${CLONE}" rm -rf --quiet --ignore-unmatch .`);

  console.log('▶ 拷贝新内容...');
  for (const d of DIRS) {
    if (fs.existsSync(path.join(BASE, d))) {
      fs.cpSync(path.join(BASE, d), path.join(CLONE, d), { recursive: true });
    }
  }
  for (const f of FILES) {
    if (fs.existsSync(path.join(BASE, f))) {
      fs.copyFileSync(path.join(BASE, f), path.join(CLONE, f));
    }
  }

  console.log('▶ commit + push...');
  run(`git -C "${CLONE}" config user.email "142539271+greycheer@users.noreply.github.com"`);
  run(`git -C "${CLONE}" config user.name "greycheer"`);
  run(`git -C "${CLONE}" add -A`);
  try {
    run(`git -C "${CLONE}" commit -m "sync: 更新帮助中心内容 (WeCom pipeline)"`);
    run(`git -C "${CLONE}" push ${REPO_URL} HEAD:main`);
    console.log('✅ 已推送，GitHub Actions 将自动构建部署到 https://greycheer.github.io/dmp-help-doccenter/');
  } catch (e) {
    console.log('ℹ️  没有变更或推送失败，请检查上方输出');
  }

  psRemove(CLONE);
  console.log('🧹 已清理临时目录');
}

main();
