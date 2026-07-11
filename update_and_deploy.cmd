@echo off
chcp 65001 >nul
REM update_and_deploy.cmd — DMP 帮助中心一键更新+部署
REM 流程：拉取企业微信文档 → 生成中英文 → 校验对齐 → 本地构建 → 推送 GitHub 自动部署
REM 用法：双击或命令行运行 update_and_deploy.cmd
cd /d "%~dp0"

echo ============================================
echo   DMP Help Center - 一键更新并部署
echo ============================================
echo.

REM ── 检测 node ──
where node >nul 2>nul && (set "NODE=node") || (
  if exist "D:\Software\Node.js\node.exe" (set "NODE=D:\Software\Node.js\node.exe") else (
    if exist "C:\Users\babya\.workbuddy\binaries\node\versions\22.22.2\node.exe" (set "NODE=C:\Users\babya\.workbuddy\binaries\node\versions\22.22.2\node.exe") else (
      echo [错误] 找不到 node，请安装 Node.js 或修改本脚本里的 NODE 路径
      pause & exit /b 1
    )
  )
)
echo 使用 Node: %NODE%
echo.

REM ── Step 1: 拉取企业微信文档 ──
echo [1/5] 拉取企业微信文档...
bash fetch_wecom_docs.sh
if %ERRORLEVEL% NEQ 0 ( echo 拉取失败！& pause & exit /b 1 )
echo.

REM ── Step 2: 生成中英文 Docusaurus 文件 ──
echo [2/5] 生成文档...
echo   EN Admin...    & %NODE% pipeline_wecom.js --input=wecom_docs/en_admin.md --lang=en --slug=admin-manual
echo   EN Developer... & %NODE% pipeline_wecom.js --input=wecom_docs/en_dev.md --lang=en --slug=developer-manual
echo   ZH Admin...    & %NODE% pipeline_wecom.js --input=wecom_docs/zh_admin.md --lang=zh-CN --slug=admin-manual
echo   ZH Developer... & %NODE% pipeline_wecom.js --input=wecom_docs/zh_dev.md --lang=zh-CN --slug=developer-manual
echo.

REM ── Step 3: 校验中英文对齐 ──
echo [3/5] 校验中英文结构对齐...
%NODE% check_i18n_alignment.js
echo   （存在差异属正常，对不上的页切换语言会兜底跳转；对得上的页不会 404）
echo.

REM ── Step 4: 本地构建验证 ──
echo [4/5] 本地构建验证...
call npm run build
if %ERRORLEVEL% NEQ 0 ( echo 构建失败！请检查上方错误 & pause & exit /b 1 )
echo.

REM ── Step 5: 推送 GitHub 自动部署 ──
echo [5/5] 推送 GitHub...
%NODE% deploy_to_github.js
if %ERRORLEVEL% NEQ 0 ( echo 推送失败！& pause & exit /b 1 )
echo.

echo ============================================
echo   ✅ 全部完成！
echo   GitHub Actions 会自动构建部署到:
echo   https://greycheer.github.io/dmp-help-doccenter/
echo ============================================
pause
