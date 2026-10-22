#!/usr/bin/env node
/**
 * scripts/validate_catalog.js
 *
 * Comprehensive validator for catalog.json and dataset integrity.
 *
 * Checks:
 * 1. Schema & Structure: Unique non-empty IDs, valid languages, categories, statuses, title, description, entry_url.
 * 2. File Integrity: Verifies entry URLs, referenced dataset files exist and contain valid JSON. Checks for uncatalogued tools.
 * 3. Count Integrity: Calculates actual dataset entries according to schema and verifies against entry_counts claims.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const ALLOWED_TYPES = new Set(['conjugation', 'gender-case', 'prepositions', 'syntax', 'speaking']);
const ALLOWED_STATUSES = new Set(['stable', 'beta', 'stub']);

function readLanguages() {
  const src = fs.readFileSync(path.join(ROOT, 'shared/js/languages.js'), 'utf8');
  const re = /\{\s*code:\s*'([a-z]{2})',\s*name:\s*'([^']+)',\s*native:\s*'([^']+)'/g;
  const langs = new Set();
  let m;
  while ((m = re.exec(src))) {
    langs.add(m[1]);
  }
  return langs;
}

function calculateDatasetEntries(filePath) {
  const fullPath = path.join(ROOT, filePath);
  if (!fs.existsSync(fullPath)) {
    return { error: `File not found: ${filePath}` };
  }

  let data;
  try {
    const raw = fs.readFileSync(fullPath, 'utf8');
    data = JSON.parse(raw);
  } catch (err) {
    return { error: `Malformed JSON in ${filePath}: ${err.message}` };
  }

  if (Array.isArray(data)) {
    return { count: data.length };
  } else if (data && typeof data === 'object') {
    if (data.scenarios && Array.isArray(data.scenarios)) {
      return { count: data.scenarios.length };
    }
    return { count: Object.keys(data).length };
  }

  return { error: `Unrecognized JSON data structure in ${filePath}` };
}

function validateCatalog() {
  const catalogPath = path.join(ROOT, 'catalog.json');
  if (!fs.existsSync(catalogPath)) {
    console.error('CRITICAL: catalog.json not found!');
    process.exit(1);
  }

  let catalog;
  try {
    catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  } catch (err) {
    console.error(`CRITICAL: catalog.json is malformed: ${err.message}`);
    process.exit(1);
  }

  const validLangs = readLanguages();
  const errors = [];
  const warnings = [];
  const seenIds = new Set();
  const cataloguedUrls = new Set();

  if (!Array.isArray(catalog)) {
    console.error('CRITICAL: catalog.json must be a JSON array.');
    process.exit(1);
  }

  for (let i = 0; i < catalog.length; i++) {
    const item = catalog[i];
    const prefix = `catalog.json [index ${i}, id: ${item.id || 'N/A'}]`;

    // 1. Unique non-empty ID
    if (!item.id || typeof item.id !== 'string' || !item.id.trim()) {
      errors.push(`${prefix}: Missing or empty "id" field`);
    } else if (seenIds.has(item.id)) {
      errors.push(`${prefix}: Duplicate tool ID "${item.id}"`);
    } else {
      seenIds.add(item.id);
    }

    // 2. Language
    if (!item.language || !validLangs.has(item.language)) {
      errors.push(`${prefix}: Invalid or missing "language" "${item.language}"`);
    }

    // 3. Category/Type
    if (!item.type || !ALLOWED_TYPES.has(item.type)) {
      errors.push(`${prefix}: Invalid or missing "type" "${item.type}". Allowed: ${Array.from(ALLOWED_TYPES).join(', ')}`);
    }

    // 4. Status
    if (!item.status || !ALLOWED_STATUSES.has(item.status)) {
      errors.push(`${prefix}: Invalid or missing "status" "${item.status}". Allowed: ${Array.from(ALLOWED_STATUSES).join(', ')}`);
    }

    // 5. Title & Description
    if (!item.title || typeof item.title !== 'string' || !item.title.trim()) {
      errors.push(`${prefix}: Missing or empty "title"`);
    }
    if (!item.description || typeof item.description !== 'string' || !item.description.trim()) {
      errors.push(`${prefix}: Missing or empty "description"`);
    }

    // 6. Entry URL & Existence
    if (!item.entry_url || typeof item.entry_url !== 'string') {
      errors.push(`${prefix}: Missing or invalid "entry_url"`);
    } else {
      const fullEntryPath = path.join(ROOT, item.entry_url);
      cataloguedUrls.add(path.normalize(item.entry_url));
      if (!fs.existsSync(fullEntryPath)) {
        errors.push(`${prefix}: entry_url "${item.entry_url}" does not exist on disk`);
      }
    }

    // 7. Data file paths
    if (!Array.isArray(item.data_file_paths)) {
      errors.push(`${prefix}: "data_file_paths" must be an array`);
    } else {
      for (const df of item.data_file_paths) {
        if (typeof df !== 'string' || !df.trim()) {
          errors.push(`${prefix}: Invalid empty string in "data_file_paths"`);
        } else if (!fs.existsSync(path.join(ROOT, df))) {
          errors.push(`${prefix}: Referenced dataset file "${df}" does not exist on disk`);
        }
      }
    }

    // 8. Entry counts structure & integrity
    if (!item.entry_counts || typeof item.entry_counts !== 'object') {
      errors.push(`${prefix}: Missing or invalid "entry_counts" object`);
    } else {
      const ec = item.entry_counts;
      if (typeof ec.total !== 'number' || ec.total < 0) {
        errors.push(`${prefix}: "entry_counts.total" must be a non-negative number`);
      }
      if (!ec.by_file || typeof ec.by_file !== 'object') {
        errors.push(`${prefix}: "entry_counts.by_file" must be an object`);
      } else if (Array.isArray(item.data_file_paths)) {
        let sumByFile = 0;
        for (const df of item.data_file_paths) {
          const claimedCount = ec.by_file[df];
          if (typeof claimedCount !== 'number' || claimedCount < 0) {
            errors.push(`${prefix}: "entry_counts.by_file['${df}']" must be a non-negative number`);
          } else {
            sumByFile += claimedCount;
          }

          // Count integrity check
          const result = calculateDatasetEntries(df);
          if (result.error) {
            errors.push(`${prefix}: ${result.error}`);
          } else if (claimedCount !== result.count) {
            warnings.push(
              `${prefix}: Count mismatch in "${df}". Claimed in catalog: ${claimedCount}, actual computed: ${result.count}`
            );
          }
        }

        if (typeof ec.total === 'number' && ec.total !== sumByFile) {
          errors.push(
            `${prefix}: "entry_counts.total" (${ec.total}) does not equal sum of by_file entries (${sumByFile})`
          );
        }
      }
    }
  }

  // Uncatalogued tools check
  const toolsDir = path.join(ROOT, 'tools');
  if (fs.existsSync(toolsDir)) {
    for (const langDir of fs.readdirSync(toolsDir, { withFileTypes: true }).filter(d => d.isDirectory())) {
      const lPath = path.join(toolsDir, langDir.name);
      for (const toolDir of fs.readdirSync(lPath, { withFileTypes: true }).filter(d => d.isDirectory())) {
        const pageRel = path.join('tools', langDir.name, toolDir.name, 'index.html');
        if (fs.existsSync(path.join(ROOT, pageRel)) && !cataloguedUrls.has(path.normalize(pageRel))) {
          errors.push(`Uncatalogued tool page found on disk: ${pageRel}`);
        }
      }
    }
  }

  // Report results
  console.log('--- Catalog & Dataset Integrity Audit Results ---');
  console.log(`Total catalog entries checked: ${catalog.length}`);

  if (warnings.length > 0) {
    console.log(`\nWarnings (${warnings.length} count discrepancies detected):`);
    for (const w of warnings) {
      console.log(`  [WARN] ${w}`);
    }
  }

  if (errors.length > 0) {
    console.error(`\nErrors (${errors.length} validation errors detected):`);
    for (const e of errors) {
      console.error(`  [ERROR] ${e}`);
    }
    process.exit(1);
  }

  console.log('\nCatalog schema & file integrity validation passed!');
}

validateCatalog();
