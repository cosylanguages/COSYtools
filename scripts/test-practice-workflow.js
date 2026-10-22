#!/usr/bin/env node
/**
 * scripts/test-practice-workflow.js
 * Integration test for the reference-to-practice workflow (fr-conjugeur).
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = path.resolve(__dirname, '..');
const HTML_PATH = path.join(ROOT, 'tools', 'fr', 'conjugeur', 'index.html');
const VERBS_PATH = path.join(ROOT, 'tools', 'fr', 'conjugeur', 'data', 'verbs.json');

console.log('=== Testing Reference-to-Practice Workflow ===\n');

let failures = 0;
function check(name, cond, detail) {
  if (cond) {
    console.log(`  PASS ${name}`);
  } else {
    failures++;
    console.error(`  FAIL ${name}${detail ? ' — ' + detail : ''}`);
  }
}

async function testWorkflow() {
  const htmlContent = fs.readFileSync(HTML_PATH, 'utf8');
  const verbsData = JSON.parse(fs.readFileSync(VERBS_PATH, 'utf8'));

  const dom = new JSDOM(htmlContent, {
    url: 'https://cosylanguages.github.io/COSYtools/tools/fr/conjugeur/index.html',
    runScripts: 'outside-only',
    pretendToBeVisual: true
  });

  const { window } = dom;

  // Mock window.fetch for verbs.json before loading scripts
  window.fetch = async (url) => {
    if (url === 'data/verbs.json' || url.endsWith('verbs.json')) {
      return {
        ok: true,
        json: async () => verbsData
      };
    }
    throw new Error(`Unexpected fetch URL: ${url}`);
  };

  // Load shared & engine scripts into window scope
  const srsScript = fs.readFileSync(path.join(ROOT, 'shared', 'engines', 'srs-store.js'), 'utf8');
  const practiceScript = fs.readFileSync(path.join(ROOT, 'shared', 'engines', 'practice-engine.js'), 'utf8');
  const engineScript = fs.readFileSync(path.join(ROOT, 'tools', 'fr', 'conjugeur', 'js', 'engine.js'), 'utf8');

  window.eval(srsScript);
  window.eval(practiceScript);
  window.eval(engineScript);

  if (!window.appEngine && typeof window.ConjugationEngine === 'function') {
    window.appEngine = new window.ConjugationEngine();
  }

  await new Promise(r => setTimeout(r, 100));

  const engine = window.appEngine;
  check('ConjugationEngine initialized', !!engine);

  if (engine) {
    // 1. Search a verb
    engine.searchVerb('parler');
    const resultCard = window.document.getElementById('verb-result-container');
    const infHead = window.document.getElementById('verb-infinitive');
    check('Verb result view displayed', resultCard.style.display === 'block');
    check('Infinitive heading renders "parler"', infHead.textContent === 'parler');

    // 2. Launch practice from verb result
    const practiceBtn = window.document.getElementById('practice-this-verb-btn');
    check('Practice button present in result header', !!practiceBtn);

    engine.launchPracticeForVerb('parler');
    check('Practice game mode active', engine.isGameActive === true);
    const gameContainer = window.document.getElementById('game-container');
    check('Game container visible', gameContainer.style.display === 'block');
    check('Result container hidden during practice', resultCard.style.display === 'none');

    // 3. Return to reference tool
    engine.toggleGameMode();
    check('Game mode deactivated', engine.isGameActive === false);
    check('Returns to verb result container for "parler"', resultCard.style.display === 'block');
    check('Headword preserved as "parler"', infHead.textContent === 'parler');
  }

  if (failures > 0) {
    console.error(`\nWorkflow test failed with ${failures} error(s).`);
    process.exit(1);
  } else {
    console.log('\nAll Reference-to-Practice workflow tests passed cleanly!');
  }
}

testWorkflow().catch(err => {
  console.error('Unhandled error in workflow test:', err);
  process.exit(1);
});
