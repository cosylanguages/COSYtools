#!/usr/bin/env node
/**
 * scripts/test-multilingual-inventory.js
 *
 * Automated test suite for the Multilingual Verb Inventory & Language Registry.
 * Verifies representation of all 53 source concepts, all 14 target languages,
 * sense disambiguation, Unicode NFC normalization, non-empty lemmas, and schema structural rules.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const INVENTORY_PATH = path.join(ROOT, 'shared', 'data', 'multilingual-verb-inventory.json');
const REGISTRY_PATH = path.join(ROOT, 'shared', 'data', 'verb-language-registry.json');
const INVENTORY_SCHEMA_PATH = path.join(ROOT, 'schemas', 'multilingual-verb-inventory.schema.json');
const REGISTRY_SCHEMA_PATH = path.join(ROOT, 'schemas', 'verb-language-registry.schema.json');

const CANONICAL_53_CONCEPTS = [
  'be', 'have', 'think', 'know', 'like', 'love', 'hate', 'dislike', 'want', 'work',
  'study', 'go', 'can', 'eat', 'drink', 'do', 'make', 'understand', 'speak', 'talk',
  'say', 'tell', 'need', 'look', 'watch', 'see', 'ask', 'answer', 'take', 'give',
  'must', 'have to', 'wait', 'live', 'listen', 'hear', 'pay', 'buy', 'remember', 'forget',
  'feel', 'meet', 'decide', 'write', 'read', 'type', 'spend', 'waste', 'play', 'agree',
  'disagree', 'send', 'get'
];

const REQUIRED_LANGUAGES = [
  'en', 'fr', 'it', 'ru', 'el', 'pt', 'de', 'es', 'tt', 'ba', 'cv', 'br', 'hy', 'ka'
];

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

function testFileExistence() {
  console.log('--- Testing File Existence ---');
  assert(fs.existsSync(INVENTORY_PATH), 'shared/data/multilingual-verb-inventory.json exists');
  assert(fs.existsSync(REGISTRY_PATH), 'shared/data/verb-language-registry.json exists');
  assert(fs.existsSync(INVENTORY_SCHEMA_PATH), 'schemas/multilingual-verb-inventory.schema.json exists');
  assert(fs.existsSync(REGISTRY_SCHEMA_PATH), 'schemas/verb-language-registry.schema.json exists');
}

function testLanguageRegistry() {
  console.log('\n--- Testing Language Registry Data ---');
  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
  assert(registry.version === '1.0.0', 'Registry version is 1.0.0');

  const langs = Object.keys(registry.languages || {});
  assert(langs.length === 14, `Registry contains exactly 14 languages (found ${langs.length})`);

  for (const langCode of REQUIRED_LANGUAGES) {
    const l = registry.languages[langCode];
    assert(!!l, `Language "${langCode}" is registered in language registry`);
    if (l) {
      assert(l.code === langCode, `Language "${langCode}" code matches key`);
      assert(typeof l.name === 'string' && l.name.length > 0, `Language "${langCode}" has valid name (${l.name})`);
      assert(typeof l.native === 'string' && l.native.length > 0, `Language "${langCode}" has valid native name (${l.native})`);
      assert(typeof l.script === 'string', `Language "${langCode}" specifies script (${l.script})`);
    }
  }
}

function testVerbInventoryCoverage() {
  console.log('\n--- Testing Verb Inventory Concepts & Senses ---');
  const inventory = JSON.parse(fs.readFileSync(INVENTORY_PATH, 'utf8'));
  const concepts = inventory.concepts || {};

  const conceptKeys = Object.keys(concepts);
  assert(conceptKeys.length === 53, `Inventory contains exactly 53 concepts (found ${conceptKeys.length})`);

  // Assert all 53 canonical terms are present
  for (const term of CANONICAL_53_CONCEPTS) {
    const found = Object.values(concepts).find(c => c.english_term === term);
    assert(!!found, `Canonical concept "${term}" is represented in dataset`);
  }

  // Assert all 14 languages present in every sense
  let totalSenses = 0;
  for (const [key, concept] of Object.entries(concepts)) {
    assert(!!concept.concept_id, `Concept "${key}" has concept_id`);
    assert(Array.isArray(concept.senses) && concept.senses.length > 0, `Concept "${key}" has at least 1 sense`);

    for (const sense of (concept.senses || [])) {
      totalSenses++;
      assert(!!sense.sense_id, `Sense in concept "${key}" has sense_id`);
      assert(!!sense.translations, `Sense "${sense.sense_id}" has translations object`);

      for (const langCode of REQUIRED_LANGUAGES) {
        const transList = sense.translations ? sense.translations[langCode] : null;
        assert(Array.isArray(transList) && transList.length > 0, `Sense "${sense.sense_id}" has translations for "${langCode}"`);

        if (Array.isArray(transList)) {
          for (const item of transList) {
            assert(typeof item.lemma === 'string' && item.lemma.length > 0, `Sense "${sense.sense_id}" [${langCode}] has non-empty lemma`);
            assert(item.lemma === item.lemma.normalize('NFC'), `Sense "${sense.sense_id}" [${langCode}] lemma "${item.lemma}" is NFC normalized`);
            assert(typeof item.definition === 'string' && item.definition.length > 0, `Sense "${sense.sense_id}" [${langCode}] has definition`);
            assert(typeof item.example_sentence === 'string' && item.example_sentence.length > 0, `Sense "${sense.sense_id}" [${langCode}] has example sentence`);
            assert(!!item.provenance, `Sense "${sense.sense_id}" [${langCode}] has provenance record`);
          }
        }
      }
    }
  }
  console.log(`Verified ${totalSenses} total verb senses across all 53 concepts.`);
}

function main() {
  console.log('====================================================');
  console.log('Running COSY Multilingual Verb Inventory Test Suite');
  console.log('====================================================\n');

  testFileExistence();
  testLanguageRegistry();
  testVerbInventoryCoverage();

  console.log(`\nResults: ${passedTests}/${totalTests} checks passed cleanly.`);
  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

main();
