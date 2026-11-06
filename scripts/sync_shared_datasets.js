#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SYNC = process.argv.includes('--sync');
const CHECK = process.argv.includes('--check');
const MIRRORS = [
  ['tools/fr/genre/data/nouns.json', 'shared/data/genders-fr.json'],
  ['tools/it/genere/data/nouns.json', 'shared/data/genders-it.json'],
  ['tools/ru/rod-padezhi/data/nouns.json', 'shared/data/genders-ru.json'],
  ['tools/el/genos-ptoseis/data/nouns.json', 'shared/data/genders-el.json']
];

if (SYNC === CHECK) {
  console.error('Choose exactly one mode: --sync or --check.');
  process.exit(2);
}

const errors = [];
for (const [sourcePath, targetPath] of MIRRORS) {
  const source = path.join(ROOT, sourcePath);
  const target = path.join(ROOT, targetPath);
  if (!fs.existsSync(source)) {
    errors.push(`Missing canonical dataset: ${sourcePath}`);
    continue;
  }

  const content = fs.readFileSync(source);
  try {
    const data = JSON.parse(content.toString('utf8'));
    if (!data || Array.isArray(data) || typeof data !== 'object') throw new Error('expected a JSON object');
  } catch (error) {
    errors.push(`${sourcePath}: ${error.message}`);
    continue;
  }

  if (SYNC) {
    fs.writeFileSync(target, content);
  } else if (!fs.existsSync(target) || !fs.readFileSync(target).equals(content)) {
    errors.push(`${targetPath} differs from its canonical source ${sourcePath}; run npm run sync:shared-data`);
  }
}

if (errors.length) {
  console.error(errors.map(error => `  - ${error}`).join('\n'));
  process.exit(1);
}

console.log(SYNC
  ? `Synchronized ${MIRRORS.length} public gender dataset mirrors.`
  : `Shared dataset check passed: ${MIRRORS.length} public gender mirrors match their canonical tool datasets.`);