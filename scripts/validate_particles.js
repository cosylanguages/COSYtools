const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const ALLOWED_LANGUAGES = new Set(['en', 'fr', 'it', 'ru', 'el']);
const ALLOWED_CATEGORIES = new Set([
  'prepositions_place',
  'prepositions_time',
  'prepositions_direction',
  'dependent_prepositions'
]);
const ALLOWED_LEVELS = new Set(['A1', 'A2', 'B1', 'B2', 'B2+']);

let totalFilesChecked = 0;
let errors = 0;

for (const lang of ALLOWED_LANGUAGES) {
  const particlesDir = path.join(rootDir, 'tools', lang, 'particles');
  if (!fs.existsSync(particlesDir)) {
    console.error(`❌ Missing directory: ${particlesDir}`);
    errors++;
    continue;
  }

  for (const category of ALLOWED_CATEGORIES) {
    const filePath = path.join(particlesDir, `${category}.json`);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Missing particle file: ${filePath}`);
      errors++;
      continue;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);
      totalFilesChecked++;

      // Assert required top-level fields
      const requiredFields = [
        'id',
        'category',
        'language',
        'title',
        'level',
        'definition',
        'rules',
        'examples',
        'practice_links'
      ];

      for (const field of requiredFields) {
        if (data[field] === undefined) {
          console.error(`❌ Missing field '${field}' in ${filePath}`);
          errors++;
        }
      }

      if (data.language !== lang) {
        console.error(`❌ Language mismatch in ${filePath}: expected '${lang}', got '${data.language}'`);
        errors++;
      }

      if (data.category !== category) {
        console.error(`❌ Category mismatch in ${filePath}: expected '${category}', got '${data.category}'`);
        errors++;
      }

      if (!ALLOWED_LEVELS.has(data.level)) {
        console.error(`❌ Invalid level '${data.level}' in ${filePath}`);
        errors++;
      }

      if (!Array.isArray(data.rules) || data.rules.length === 0) {
        console.error(`❌ 'rules' must be a non-empty array in ${filePath}`);
        errors++;
      } else {
        data.rules.forEach((rule, idx) => {
          if (!rule.preposition || !rule.rule) {
            console.error(`❌ Invalid rule item at index ${idx} in ${filePath}`);
            errors++;
          }
        });
      }

      if (!Array.isArray(data.examples) || data.examples.length === 0) {
        console.error(`❌ 'examples' must be a non-empty array in ${filePath}`);
        errors++;
      } else {
        data.examples.forEach((ex, idx) => {
          if (!ex.sentence || !ex.translation) {
            console.error(`❌ Invalid example item at index ${idx} in ${filePath}`);
            errors++;
          }
        });
      }

      if (!Array.isArray(data.practice_links) || data.practice_links.length === 0) {
        console.error(`❌ 'practice_links' must be a non-empty array in ${filePath}`);
        errors++;
      }

    } catch (err) {
      console.error(`❌ Failed parsing ${filePath}: ${err.message}`);
      errors++;
    }
  }
}

console.log(`Checked ${totalFilesChecked} particle category files.`);

if (errors > 0) {
  console.error(`\n❌ Found ${errors} validation errors in particle category files!`);
  process.exit(1);
} else {
  console.log(`✅ All ${totalFilesChecked} particle category files passed validation successfully!`);
}
