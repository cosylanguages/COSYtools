#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TOKEN_URL = 'https://cosylanguages.github.io/COSYlanguages/shared/css/tokens.css';
const TOKEN_FILE = path.join(ROOT, 'shared/css/cosy-tokens.css');
const args = new Set(process.argv.slice(2));
const syncMode = args.has('--sync');
const offlineOk = args.has('--offline-ok');

function normalize(content) {
  return content.replace(/\r\n/g, '\n').trimEnd() + '\n';
}

async function fetchCanonicalTokens() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(TOKEN_URL, { signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const content = normalize(await response.text());
    if (!content.includes(':root') || !content.includes('--cosy-color-cream:')) {
      throw new Error('The response does not look like the canonical token stylesheet.');
    }
    return content;
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  let canonical;
  try {
    canonical = await fetchCanonicalTokens();
  } catch (error) {
    if (offlineOk) {
      console.warn(`Design token check skipped: canonical source unavailable (${error.message}).`);
      return;
    }
    throw error;
  }

  if (syncMode) {
    fs.writeFileSync(TOKEN_FILE, canonical, 'utf8');
    console.log('Vendored COSYlanguages design tokens synchronized.');
    return;
  }

  const local = normalize(fs.readFileSync(TOKEN_FILE, 'utf8'));
  if (local !== canonical) {
    console.error('Design token drift detected. Run `npm run sync:design-tokens` to update the vendored copy.');
    process.exitCode = 1;
    return;
  }

  console.log('Design token check passed: vendored copy matches COSYlanguages.');
}

main().catch((error) => {
  console.error(`Design token sync failed: ${error.message}`);
  process.exitCode = 1;
});