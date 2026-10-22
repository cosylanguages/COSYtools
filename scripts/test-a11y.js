#!/usr/bin/env node
/**
 * scripts/test-a11y.js
 * Automated accessibility checks across standalone HTML files in COSYtools.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

function getAllHtmlFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    if (file === 'node_modules' || file === '.git' || file === 'templates') return;
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllHtmlFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.html')) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

const htmlFiles = getAllHtmlFiles(ROOT_DIR);
let errors = 0;
let warnings = 0;

console.log(`Auditing accessibility for ${htmlFiles.length} HTML files...`);

htmlFiles.forEach(file => {
  const relPath = path.relative(ROOT_DIR, file);
  const content = fs.readFileSync(file, 'utf8');

  // Check 1: html lang attribute
  if (!/<html[^>]*lang=["'][a-z]{2}(-[A-Z]{2})?["']/i.test(content)) {
    console.error(`❌ [${relPath}]: Missing or invalid <html lang="..."> attribute.`);
    errors++;
  }

  // Check 2: <title> element
  if (!/<title>[\s\S]+?<\/title>/i.test(content)) {
    console.error(`❌ [${relPath}]: Missing <title> tag.`);
    errors++;
  }

  // Check 3: Check <img> tags for alt attribute
  const imgTags = content.match(/<img[^>]*>/gi) || [];
  imgTags.forEach(img => {
    if (!/alt=["'][\s\S]*?["']/i.test(img)) {
      console.error(`❌ [${relPath}]: <img> tag missing alt attribute: ${img}`);
      errors++;
    }
  });

  // Check 4: Check for invalid ARIA attributes like aria-press
  if (/aria-press=/i.test(content)) {
    console.error(`❌ [${relPath}]: Typo detected: aria-press used instead of aria-pressed.`);
    errors++;
  }

  // Check 5: Form inputs should have associated label or aria-label
  const inputTags = content.match(/<input[^>]*>/gi) || [];
  inputTags.forEach(input => {
    const isHidden = /type=["']hidden["']/i.test(input);
    const isCheckbox = /type=["']checkbox["']/i.test(input);
    const hasLabel = /aria-label=/i.test(input) || /aria-labelledby=/i.test(input) || /id=["'][\w-]+["']/i.test(input);
    if (!isHidden && !isCheckbox && !hasLabel) {
      console.warn(`⚠️ [${relPath}]: <input> without explicit aria-label/id: ${input}`);
      warnings++;
    }
  });
});

// Check 6: Check base.css for prefers-reduced-motion
const baseCssPath = path.join(ROOT_DIR, 'shared', 'css', 'base.css');
if (fs.existsSync(baseCssPath)) {
  const cssContent = fs.readFileSync(baseCssPath, 'utf8');
  if (!cssContent.includes('prefers-reduced-motion')) {
    console.error(`❌ [shared/css/base.css]: Missing @media (prefers-reduced-motion) media query.`);
    errors++;
  }
}

if (errors > 0) {
  console.error(`\nAccessibility audit failed with ${errors} error(s) and ${warnings} warning(s).`);
  process.exit(1);
} else {
  console.log(`\nAccessibility audit passed cleanly! (${warnings} warning(s))`);
}
