/**
 * Debug script: Check Feishu list block structure
 */
const https = require('https');

const APP_ID = 'cli_a944f3bde3b89bce';
const APP_SECRET = 'vfdmNKgwYQApJhMnjX2vUhtEL2vgQZ85';
const DOC_TOKEN = 'P9yTddX2RoalLFxCHnbcPX5QnOb'; // Admin manual

function httpRequest(method, url, headers, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = { hostname: u.hostname, path: u.pathname + u.search, method, headers };
    const req = https.request(opts, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(JSON.parse(Buffer.concat(chunks).toString())));
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function getToken() {
  const resp = await httpRequest('POST', 'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
    'Content-Type': 'application/json'
  }, { app_id: APP_ID, app_secret: APP_SECRET });
  return resp.tenant_access_token;
}

async function getAllBlocks(token, docToken) {
  const blocks = [];
  let pageToken = '';
  while (true) {
    let url = `https://open.feishu.cn/open-apis/docx/v1/documents/${docToken}/blocks?document_revision_id=-1&page_size=500`;
    if (pageToken) url += '&page_token=' + encodeURIComponent(pageToken);
    const resp = await httpRequest('GET', url, { 'Authorization': 'Bearer ' + token });
    if (resp.code !== 0 || !resp.data) break;
    blocks.push(...(resp.data.items || []));
    if (!resp.data.has_more || !resp.data.page_token) break;
    pageToken = resp.data.page_token;
  }
  return blocks;
}

async function main() {
  console.log('Fetching token...');
  const token = await getToken();
  
  console.log('Fetching blocks...');
  const allBlocks = await getAllBlocks(token, DOC_TOKEN);
  
  // Filter top-level blocks
  const blocks = allBlocks.filter(b => b.parent_id === DOC_TOKEN);
  
  console.log(`\nTotal blocks: ${allBlocks.length}, Top-level: ${blocks.length}\n`);
  
  // Print first 20 headings to understand structure
  console.log('=== First 20 headings ===');
  let headingCount = 0;
  for (let i = 0; i < blocks.length && headingCount < 20; i++) {
    const b = blocks[i];
    const bt = b.block_type;
    if (bt >= 3 && bt <= 8) {
      const headingKey = 'heading' + bt;
      const headingData = b[headingKey] || {};
      const elements = headingData.elements || [];
      const text = elements.map(e => e.text_run?.content || '').join('');
      console.log(`${i}: [${bt}] "${text}"`);
      if (!text) {
        console.log('  Full block:', JSON.stringify(b, null, 2).substring(0, 500));
      }
      headingCount++;
    }
  }
  
  // Find all bullet blocks and check their structure
  console.log('\n=== All bullet blocks with "Account" in text ===');
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.block_type === 12) {
      const text = (b.bullet?.elements || []).map(e => e.text_run?.content || '').join('');
      if (text.toLowerCase().includes('account')) {
        console.log(`\nBlock ${i}: BULLET`);
        console.log('  text:', text.substring(0, 100));
        console.log('  block_id:', b.block_id);
        
        // Check if this bullet has children
        const children = allBlocks.filter(child => child.parent_id === b.block_id);
        console.log(`  children count: ${children.length}`);
        if (children.length > 0) {
          console.log('  children:', children.map(c => ({ 
            type: c.block_type, 
            text: (c.bullet?.elements || c.text?.elements || []).map(e => e.text_run?.content || '').join('').substring(0, 50)
          })));
        }
      }
    }
  }
  
  // Also check all blocks with parent_id != docToken (nested blocks)
  console.log('\n=== Nested bullet blocks (parent_id != docToken) ===');
  const nestedBullets = allBlocks.filter(b => b.block_type === 12 && b.parent_id !== DOC_TOKEN);
  console.log(`Found ${nestedBullets.length} nested bullets`);
  for (let i = 0; i < Math.min(10, nestedBullets.length); i++) {
    const b = nestedBullets[i];
    const text = (b.bullet?.elements || []).map(e => e.text_run?.content || '').join('');
    console.log(`  ${i}: parent=${b.parent_id.substring(0, 20)}... text=${text.substring(0, 60)}`);
  }
}

main().catch(console.error);
