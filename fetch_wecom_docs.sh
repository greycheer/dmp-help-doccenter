#!/bin/bash
# fetch_wecom_docs.sh — 批量拉取企业微信文档到本地 Markdown 文件
# 配合 pipeline_wecom.js 使用：先拉取，再管道理生成

set -e
cd "$(dirname "$0")"
mkdir -p wecom_docs

fetch_doc() {
  local docid="$1" out="$2"
  echo "📖 拉取: $docid -> $out"
  
  local result=$(wecom-cli doc get_doc_content "{\"docid\": \"$docid\", \"type\": 2}" 2>&1)
  local task_id=$(echo "$result" | python -c "import sys,json; print(json.loads(json.loads(sys.stdin.read())['result']['content'][0]['text'])['task_id'])")
  
  for n in $(seq 1 20); do
    sleep 5
    result=$(wecom-cli doc get_doc_content "{\"docid\": \"$docid\", \"type\": 2, \"task_id\": \"$task_id\"}" 2>&1)
    local done_val=$(echo "$result" | python -c "import sys,json; print(json.loads(json.loads(sys.stdin.read())['result']['content'][0]['text'])['task_done'])")
    if [ "$done_val" = "True" ]; then
      echo "$result" | python -c "import sys,json; data=json.loads(sys.stdin.read()); inner=json.loads(data['result']['content'][0]['text']); print(inner['content'])" > "$out"
      echo "  ✅ $(wc -c < "$out" | tr -d ' ') bytes"
      return 0
    fi
    echo -n "."
  done
  echo "  ❌ 超时"
  return 1
}

# 英文
fetch_doc "w3_AVYANAaNAHQCN718uBqAnQPOloOFs" "wecom_docs/en_admin.md"
fetch_doc "w3_AVYANAaNAHQCNtWUCpqfMRrWYNikl" "wecom_docs/en_dev.md"

# 中文
fetch_doc "w3_AVYANAaNAHQCNdTiSyUFZSNGBvTMo" "wecom_docs/zh_admin.md"
fetch_doc "w3_AVYANAaNAHQCNALJkIy8yTPeYZJ56" "wecom_docs/zh_dev.md"

echo ""
echo "✅ 全部拉取完成"
echo ""
echo "下一步运行:"
echo "  node pipeline_wecom.js --input=wecom_docs/en_admin.md --lang=en --label='For Admin User' --slug=admin-manual"
echo "  node pipeline_wecom.js --input=wecom_docs/en_dev.md --lang=en --label='For Developer' --slug=developer-manual"
echo "  node pipeline_wecom.js --input=wecom_docs/zh_admin.md --lang=zh-CN --label='管理员手册' --slug=admin-manual"
echo "  node pipeline_wecom.js --input=wecom_docs/zh_dev.md --lang=zh-CN --label='开发者手册' --slug=developer-manual"
