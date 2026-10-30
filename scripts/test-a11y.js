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


// Pages that must be fully clean for the stricter checks (errors, not warnings).
// Add a page here once it has been made keyboard- and screen-reader-operable.
const STRICT_PAGES = new Set([
  path.join('practice', 'top-verbs', 'index.html')
]);

function reportClickableNonInteractive(relPath, content) {
  const strict = STRICT_PAGES.has(relPath);
  const log = strict ? console.error : console.warn;
  const mark = strict ? '❌' : '⚠️';
  const bump = () => { if (strict) errors++; else warnings++; };

  // onclick on div/span/heading/p/li/td without a role is not reachable by keyboard
  const clickable = content.match(/<(div|span|h[1-6]|p|li|td)\b[^>]*\sonclick=[^>]*>/gi) || [];
  clickable.forEach(tag => {
    if (!/role=["'](button|link|radio|checkbox|tab|switch|menuitem|option)["']/i.test(tag) || !/tabindex=/i.test(tag)) {
      log(`${mark} [${relPath}]: click handler on non-interactive element (use <button>): ${tag.slice(0, 120)}`);
      bump();
    }
  });

  // inline outline:none removes the keyboard focus indicator
  const noOutline = content.match(/<(input|button|a|select|textarea)\b[^>]*style=["'][^"']*outline:\s*none/gi) || [];
  noOutline.forEach(tag => {
    log(`${mark} [${relPath}]: inline outline:none removes the focus indicator: ${tag.slice(0, 100)}`);
    bump();
  });

  if (strict) {
    // Decorative emoji-only and status elements on strict pages
    if (!/role=["']status["']|aria-live=/i.test(content)) {
      console.error(`❌ [${relPath}]: no live region (role="status"/aria-live) for dynamic feedback.`);
      errors++;
    }
    // Dynamic templates in strict pages must not build clickable divs either
    const tpl = content.match(/`[^`]*<(div|span|h[1-6])\b[^>]*\sonclick=[^`]*`/g) || [];
    tpl.forEach(t => {
      console.error(`❌ [${relPath}]: script template renders a clickable non-interactive element.`);
      errors++;
    });
  }
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

  // Check 7: click handlers on non-interactive elements (not keyboard/screen-reader operable)
  reportClickableNonInteractive(relPath, content);
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

// ---- Scan JavaScript templates (engines render most of the interactive UI) ----
function collectJsFiles(dir, out) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    if (entry.name === 'node_modules' || entry.name === '.git') return;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectJsFiles(full, out);
    else if (entry.name.endsWith('.js')) out.push(full);
  });
  return out;
}
collectJsFiles(ROOT_DIR, []).forEach(file => {
  const rel = path.relative(ROOT_DIR, file);
  if (rel.startsWith('scripts' + path.sep)) return;
  const js = fs.readFileSync(file, 'utf8');
  const bad = js.match(/<(div|span|h[1-6]|p|li|td)\b[^>]*\sonclick=[^>]*>/gi) || [];
  bad.forEach(tag => {
    if (!/role=["'](button|link|radio|checkbox|tab|switch|menuitem|option)["']/i.test(tag) || !/tabindex=/i.test(tag)) {
      console.error(`❌ [${rel}]: script template renders a clickable non-interactive element (use <button>): ${tag.slice(0, 110)}`);
      errors++;
    }
  });
});

if (errors > 0) {
  console.error(`\nAccessibility audit failed with ${errors} error(s) and ${warnings} warning(s).`);
  process.exit(1);
} else {
  console.log(`\nAccessibility audit passed cleanly! (${warnings} warning(s))`);
}
