#!/usr/bin/env node
/**
 * scripts/validate_linguistic_datasets.js
 * Language-aware structural and linguistic validation suite for COSYtools datasets.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const CATALOG_PATH = path.join(ROOT_DIR, 'catalog.json');

if (!fs.existsSync(CATALOG_PATH)) {
  console.error('❌ catalog.json not found!');
  process.exit(1);
}

const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));

let totalErrors = 0;
let totalWarnings = 0;
let checkedFiles = 0;
let checkedRecords = 0;

console.log('=== COSYtools Linguistic Dataset Validation Suite ===\n');

// Valid CEFR levels across COSYtools tools
const VALID_CEFR = new Set(['A0', 'A1', 'A1+', 'A2', 'A2+', 'B1', 'B1+', 'B2', 'B2+', 'C1', 'C2', 'All', 'all']);

// Language-specific rules & expected schemas
catalog.forEach((tool) => {
  const lang = tool.language;
  const toolType = tool.type;
  const dataFiles = tool.data_file_paths || [];

  dataFiles.forEach((relPath) => {
    const fullPath = path.join(ROOT_DIR, relPath);
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ [${tool.id}] Data file missing: ${relPath}`);
      totalErrors++;
      return;
    }

    checkedFiles++;
    let data;
    try {
      data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    } catch (err) {
      console.error(`❌ [${relPath}] Invalid JSON syntax: ${err.message}`);
      totalErrors++;
      return;
    }

    const isArray = Array.isArray(data);
    const entries = isArray ? data : Object.entries(data);

    entries.forEach((item, index) => {
      checkedRecords++;
      const lemma = isArray ? (item.verb || item.noun || item.word || `Index ${index}`) : item[0];
      const entry = isArray ? item : item[1];

      // Rule 1: Unicode Normalization Check (NFC)
      const strRepresent = JSON.stringify(entry);
      if (strRepresent !== strRepresent.normalize('NFC')) {
        console.warn(`⚠️ [${relPath}] Entry "${lemma}": String is not normalized in Unicode NFC.`);
        totalWarnings++;
      }

      // Rule 2: CEFR Level Format
      if (entry.level && !VALID_CEFR.has(entry.level)) {
        console.warn(`⚠️ [${relPath}] Entry "${lemma}": Unknown CEFR level "${entry.level}".`);
        totalWarnings++;
      }

      // Rule 3: Provenance Metadata Verification
      if (entry.review_status) {
        const validStatuses = new Set(['unreviewed', 'needs_review', 'reviewed', 'verified_native']);
        if (!validStatuses.has(entry.review_status)) {
          console.error(`❌ [${relPath}] Entry "${lemma}": Invalid review_status "${entry.review_status}".`);
          totalErrors++;
        }
      }

      // Rule 4: Language & Tool-Specific Schema Logic
      if (toolType === 'conjugation') {
        // Verb conjugation checks
        if (!entry.definition && !entry.meaning && !entry.translation) {
          console.warn(`⚠️ [${relPath}] Verb "${lemma}": Missing definition/translation.`);
          totalWarnings++;
        }

        if (entry.tenses && typeof entry.tenses === 'object') {
          const tenseKeys = Object.keys(entry.tenses);
          // Check for present or future non-past tense across schema conventions
          const hasPres = tenseKeys.some(k => ['pres', 'present', 'presente', 'indicatif_present', 'indicativo_presente', 'praesens', 'prs', 'pres_sing', 'futur', 'futur_simple', 'buduschee'].includes(k.toLowerCase()));
          if (!hasPres && !entry.past_simple) {
            console.warn(`⚠️ [${relPath}] Verb "${lemma}": Missing non-past conjugation tense.`);
            totalWarnings++;
          }
        }
      } else if (toolType === 'gender-case') {
        // Noun gender and case checks
        if (lang === 'de') {
          if (entry.gender && !['masculine', 'feminine', 'neuter', 'maskulinum', 'femininum', 'neutrum', 'm', 'f', 'n', 'der', 'die', 'das'].includes(String(entry.gender).toLowerCase())) {
            console.error(`❌ [${relPath}] German noun "${lemma}": Invalid gender "${entry.gender}".`);
            totalErrors++;
          }
        } else if (lang === 'ru') {
          if (entry.cases && typeof entry.cases === 'object') {
            const requiredCases = ['nom_sing', 'gen_sing', 'dat_sing', 'acc_sing', 'ins_sing', 'pre_sing'];
            const missingCases = requiredCases.filter(c => !entry.cases[c]);
            if (missingCases.length > 0) {
              console.warn(`⚠️ [${relPath}] Russian noun "${lemma}": Missing singular cases: ${missingCases.join(', ')}.`);
              totalWarnings++;
            }
          }
        } else if (lang === 'el') {
          if (entry.cases && typeof entry.cases === 'object') {
            const requiredCases = ['nom_sing', 'gen_sing', 'acc_sing', 'voc_sing'];
            const missingCases = requiredCases.filter(c => !entry.cases[c]);
            if (missingCases.length > 0) {
              console.warn(`⚠️ [${relPath}] Greek noun "${lemma}": Missing singular cases: ${missingCases.join(', ')}.`);
              totalWarnings++;
            }
          }
        }
      } else if (toolType === 'prepositions' || toolType === 'syntax') {
        // Preposition and regime checks
        if (!entry.prepositions && !entry.government && !entry.pattern && !entry.preposition) {
          console.warn(`⚠️ [${relPath}] Syntax entry "${lemma}": Missing preposition, government or pattern.`);
          totalWarnings++;
        }
      }
    });
  });
});

console.log(`Validated ${checkedFiles} dataset files containing ${checkedRecords} records.`);
console.log(`Results: ${totalErrors} Error(s), ${totalWarnings} Warning(s).\n`);

if (totalErrors > 0) {
  console.error('❌ Linguistic dataset validation failed.');
  process.exit(1);
} else {
  console.log('✅ Linguistic dataset validation passed cleanly!');
}
