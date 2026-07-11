@echo off
REM sync_wecom_all.cmd — 从企业微信文档全量同步中英文帮助中心
REM 用法: sync_wecom_all.cmd
cd /d "%~dp0"

echo ============================================
echo  DMP Help Center - WeCom 全量同步
echo ============================================
echo.

REM Step 1: 拉取 WeCom 文档
echo [1/2] 拉取企业微信文档...
bash fetch_wecom_docs.sh
if %ERRORLEVEL% NEQ 0 (
  echo 拉取失败！
  pause
  exit /b 1
)

REM Step 2: 运行管道生成
echo.
echo [2/2] 生成 Docusaurus 文件...

REM 英文管理员
echo   EN Admin...
D:\Software\Node.js\node.exe pipeline_wecom.js --input=wecom_docs/en_admin.md --lang=en --label="For Admin User" --slug=admin-manual

REM 英文开发者
echo   EN Developer...
D:\Software\Node.js\node.exe pipeline_wecom.js --input=wecom_docs/en_dev.md --lang=en --label="For Developer" --slug=developer-manual

REM 中文管理员
echo   ZH Admin...
D:\Software\Node.js\node.exe pipeline_wecom.js --input=wecom_docs/zh_admin.md --lang=zh-CN --label="管理员手册" --slug=admin-manual

REM 中文开发者
echo   ZH Developer...
D:\Software\Node.js\node.exe pipeline_wecom.js --input=wecom_docs/zh_dev.md --lang=zh-CN --label="开发者手册" --slug=developer-manual

echo.
echo ============================================
echo  同步完成！
echo  运行 npx docusaurus build 构建网站
echo ============================================
pause
