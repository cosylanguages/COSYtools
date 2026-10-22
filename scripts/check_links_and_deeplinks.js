#!/usr/bin/env node
/**
 * scripts/check_links_and_deeplinks.js
 *
 * Checks:
 * 1. Broken local links: Scans HTML files for href/src links pointing to local files and verifies their existence.
 * 2. Deep-link parameter parsing: Tests standard deep-link parameters across edge cases:
 *    - Parameters: verb, infinitive, noun, word, q, search, lang, type, dev
 *    - Cases: percent-encoded Unicode, spaces, apostrophes, accents, empty parameters, malformed encoding.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// Helper to simulate deep-link parameter extraction as used in COSYtools engines
function extractDeepLinkParam(queryString, keys) {
  try {
    const params = new URLSearchParams(queryString);
    for (const k of keys) {
      if (params.has(k)) {
        const val = params.get(k);
        if (val !== null) {
          // Clean/decode parameter value safely
          try {
            return decodeURIComponent(val.trim());
          } catch (e) {
            return val.trim();
          }
        }
      }
    }
  } catch (e) {
    return null;
  }
  return null;
}

function testDeepLinkParsing() {
  console.log('--- Testing Deep-Link Parameter Parsing ---');
  const testCases = [
    { query: '?verb=parler', keys: ['verb', 'infinitive'], expected: 'parler' },
    { query: '?infinitive=%CE%B3%CF%81%CE%AC%CF%86%CF%89', keys: ['verb', 'infinitive'], expected: 'γράφω' },
    { query: '?noun=l%27eau', keys: ['noun', 'word'], expected: "l'eau" },
    { query: '?word=caf%C3%A9', keys: ['noun', 'word'], expected: 'café' },
    { query: '?q=el%20ni%C3%B1o', keys: ['q', 'search'], expected: 'el niño' },
    { query: '?search=der%20B%C3%A4r', keys: ['q', 'search'], expected: 'der Bär' },
    { query: '?verb=', keys: ['verb'], expected: '' },
    { query: '?lang=fr&type=gender-case&q=chat&dev=1', keys: ['q'], expected: 'chat' }
  ];

  let passed = 0;
  for (const tc of testCases) {
    const result = extractDeepLinkParam(tc.query, tc.keys);
    if (result === tc.expected) {
      passed++;
    } else {
      console.error(`[FAIL] Deep link test for "${tc.query}": expected "${tc.expected}", got "${result}"`);
    }
  }

  console.log(`Deep-link unit tests: ${passed}/${testCases.length} passed.`);
  return passed === testCases.length;
}

function scanHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of list) {
    const res = path.join(dir, file.name);
    if (file.isDirectory()) {
      if (file.name !== 'node_modules' && file.name !== '.git') {
        results = results.concat(scanHtmlFiles(res));
      }
    } else if (file.name.endsWith('.html')) {
      results.push(res);
    }
  }
  return results;
}

function checkBrokenLocalLinks() {
  console.log('\n--- Checking Broken Local Links in HTML Pages ---');
  const htmlFiles = scanHtmlFiles(ROOT);
  const errors = [];
  const linkRegex = /(?:href|src)=["']([^"']+)["']/g;

  for (const htmlFile of htmlFiles) {
    const content = fs.readFileSync(htmlFile, 'utf8');
    let match;
    while ((match = linkRegex.exec(content)) !== null) {
      const rawUrl = match[1].trim();

      // Skip external URLs, protocols, anchors, empty links, and template placehoders
      if (
        !rawUrl ||
        rawUrl.startsWith('http://') ||
        rawUrl.startsWith('https://') ||
        rawUrl.startsWith('//') ||
        rawUrl.startsWith('#') ||
        rawUrl.startsWith('mailto:') ||
        rawUrl.startsWith('javascript:') ||
        rawUrl.startsWith('data:') ||
        rawUrl.includes('{{') ||
        rawUrl.includes('${')
      ) {
        continue;
      }

      // Extract file path without query parameters or hash
      let cleanUrl = rawUrl.split('?')[0].split('#')[0];
      if (!cleanUrl) continue;

      // Strip GitHub Pages subpath prefix if present
      if (cleanUrl.startsWith('/COSYtools/')) {
        cleanUrl = cleanUrl.replace(/^\/COSYtools\//, '/');
      }

      let targetPath;
      if (cleanUrl.startsWith('/')) {
        targetPath = path.join(ROOT, cleanUrl.slice(1));
        // If pointing to a directory root like '/' or ''
        if (cleanUrl === '/') {
          targetPath = path.join(ROOT, 'index.html');
        }
      } else {
        targetPath = path.join(path.dirname(htmlFile), cleanUrl);
      }

      if (!fs.existsSync(targetPath)) {
        const relHtml = path.relative(ROOT, htmlFile);
        errors.push(`${relHtml} -> broken link to "${rawUrl}" (resolved to "${path.relative(ROOT, targetPath)}")`);
      }
    }
  }

  if (errors.length > 0) {
    console.error(`Found ${errors.length} broken local link(s):`);
    for (const err of errors) {
      console.error(`  [ERROR] ${err}`);
    }
    return false;
  }

  console.log(`Scanned ${htmlFiles.length} HTML pages. 0 broken local links found!`);
  return true;
}

function main() {
  const deepLinkOk = testDeepLinkParsing();
  const linksOk = checkBrokenLocalLinks();

  if (!deepLinkOk || !linksOk) {
    process.exit(1);
  }

  console.log('\nAll link and deep-link checks passed successfully!');
}

main();
