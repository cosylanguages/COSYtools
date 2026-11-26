#!/usr/bin/env node
/**
 * scripts/test-vocabulary-relations.js
 * Antonyms always, synonyms from B1-B2 upwards, on every vocabulary surface.
 */
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const vocab = require('../shared/js/vocabulary-relations.js');
const lexicon = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'shared', 'js', 'vocabulary-relations.json'), 'utf-8'));
const table = lexicon.langs.en;

// 1. Lexicon shape
assert.strictEqual(lexicon.version, 1, 'lexicon has a version');
assert(table && typeof table === 'object', 'english table present');
const words = Object.keys(table);
assert(words.length >= 500, `lexicon covers at least 500 words, has ${words.length}`);
const withAntonym = words.filter((w) => (table[w].antonyms || []).length > 0);
assert(withAntonym.length >= 300, `at least 300 words carry an antonym, has ${withAntonym.length}`);
for (const w of words) {
    const entry = table[w];
    assert.strictEqual(w, w.toLowerCase().trim(), `${w}: keys are normalised`);
    assert(Array.isArray(entry.antonyms) && Array.isArray(entry.synonyms), `${w}: both arrays present`);
    assert(entry.antonyms.length + entry.synonyms.length > 0, `${w}: at least one relation`);
    for (const a of entry.antonyms) {
        assert(typeof a === 'string' && a.trim().length > 0, `${w}: antonym is a word`);
        assert(a.toLowerCase() !== w, `${w}: no self-antonym`);
    }
    for (const s of entry.synonyms) {
        assert(typeof s === 'string' && s.trim().length > 0, `${w}: synonym is a word`);
        assert(s.toLowerCase() !== w, `${w}: no self-synonym`);
    }
}
console.log(`  PASS: lexicon — ${words.length} words, ${withAntonym.length} with an antonym`);

// 2. Band model
vocab.prime(lexicon);
assert.strictEqual(vocab.bandFromLevel('A2'), 'a2', 'A2 maps to a2');
assert.strictEqual(vocab.bandFromLevel('B1'), 'b1-b2', 'B1 maps to b1-b2');
assert.strictEqual(vocab.bandFromLevel('c2'), 'c1-c2', 'c2 maps to c1-c2');
assert.strictEqual(vocab.bandFromLevel('zz'), '', 'unknown level maps to nothing');
assert.strictEqual(vocab.allowsSynonyms('a0-a1'), false, 'no synonyms at a0-a1');
assert.strictEqual(vocab.allowsSynonyms('a2'), false, 'no synonyms at a2');
assert.strictEqual(vocab.allowsSynonyms('b1-b2'), true, 'synonyms at b1-b2');
assert.strictEqual(vocab.allowsSynonyms('C1'), true, 'synonyms at C1');
console.log('  PASS: band model — synonyms start at b1-b2');

// 3. Resolution and gating
const calmA2 = vocab.forBand('calm', 'a2', 'en');
const calmB1 = vocab.forBand('calm', 'b1-b2', 'en');
assert(calmA2.antonyms.length > 0, 'antonym shown at a2');
assert.strictEqual(calmA2.synonyms.length, 0, 'no synonyms at a2');
assert(calmB1.antonyms.length > 0 && calmB1.synonyms.length > 0, 'antonyms and synonyms at b1-b2');
assert.deepStrictEqual(vocab.relations('CALM', 'en').antonyms, vocab.relations('calm', 'en').antonyms, 'lookup is case-insensitive');
assert.deepStrictEqual(vocab.relations('unlistedword', 'en'), { antonyms: [], synonyms: [] }, 'unknown word is empty');
assert.deepStrictEqual(vocab.relations('calm', 'xx'), { antonyms: [], synonyms: [] }, 'unknown language is empty');
const bare = Object.keys(table).find((w) => table[w].antonyms.length === 0);
assert.strictEqual(vocab.relationsLine(bare, { band: 'c1-c2', lang: 'en' }).includes('↔'), false, `${bare}: no antonym means no arrow`);
console.log('  PASS: resolution — case-insensitive, band-gated, empty for unknown words');

// 4. Rendering helpers
const line = vocab.relationsLine('calm', { band: 'b1-b2', lang: 'en' });
assert(line.includes('vocab-antonym') && line.includes('vocab-synonym'), 'line carries both relations');
assert.strictEqual(vocab.relationsLine('calm', { band: 'a0-a1', lang: 'en' }).includes('vocab-synonym'), false, 'a0-a1 line has no synonym');
assert.strictEqual(vocab.relationsLine('notaword', { band: 'c1-c2', lang: 'en' }), '', 'unknown word renders nothing');
const chip = vocab.decorate('happy', { band: 'a2', lang: 'en' });
assert.strictEqual(chip.word, 'happy', 'decorate keeps the word');
assert(chip.antonyms.length > 0 && chip.synonyms.length === 0, 'a2 chip keeps antonym only');
assert.strictEqual(chip.hasRelations, true, 'hasRelations flag set');
const list = vocab.decorateList(['calm', 'notaword'], { band: 'b1-b2', lang: 'en' });
assert.strictEqual(list.length, 2, 'decorateList keeps every word');
assert.strictEqual(list[1].hasRelations, false, 'unknown word flagged empty');
const entry = vocab.attach({ word: 'calm' }, { band: 'b1-b2', lang: 'en' });
assert(entry.antonyms.length > 0 && entry.synonyms.length > 0, 'attach writes onto the entry');
console.log('  PASS: rendering — line, chip and entry forms');

console.log('\n🎉 vocabulary relations tests passed');
