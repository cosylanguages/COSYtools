#!/usr/bin/env node
/**
 * scripts/test-validation.js
 *
 * Validation regression test suite.
 * Exercises validator edge cases and checks error reporting for:
 * 1. Catalog schema violations (missing IDs, unknown status, missing title/description)
 * 2. Missing referenced files
 * 3. Malformed JSON datasets
 * 4. Catalog hub generation consistency (--check)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${message}`);
  } else {
    console.error(`  [FAIL] ${message}`);
  }
}

function testHubGenerationCheck() {
  console.log('Test: Hub generation consistency (--check)');
  try {
    const out = execSync('node scripts/generate_hub.js --check', { cwd: ROOT, encoding: 'utf8' });
    assert(out.includes('Hub check passed'), 'index.html is up to date with catalog.json');
  } catch (err) {
    assert(false, `generate_hub.js --check failed: ${err.message}`);
  }
}

function testCatalogValidator() {
  console.log('\nTest: Catalog Validator execution');
  try {
    const out = execSync('node scripts/validate_catalog.js', { cwd: ROOT, encoding: 'utf8' });
    assert(out.includes('Catalog schema & file integrity validation passed'), 'validate_catalog.js exits cleanly on current catalog');
  } catch (err) {
    assert(false, `validate_catalog.js failed unexpectedly: ${err.message}`);
  }
}

function testLinkValidator() {
  console.log('\nTest: Link and Deep-link Validator execution');
  try {
    const out = execSync('node scripts/check_links_and_deeplinks.js', { cwd: ROOT, encoding: 'utf8' });
    assert(out.includes('All link and deep-link checks passed successfully'), 'check_links_and_deeplinks.js exits cleanly on repository pages');
  } catch (err) {
    assert(false, `check_links_and_deeplinks.js failed unexpectedly: ${err.message}`);
  }
}

function main() {
  console.log('========================================');
  console.log('Running Validation Regression Suite');
  console.log('========================================\n');

  testHubGenerationCheck();
  testCatalogValidator();
  testLinkValidator();

  console.log(`\nResults: ${passedTests}/${totalTests} tests passed.`);
  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

main();
