const fs = require('fs');
const path = require('path');

// Basic character mapping for Latin diacritics, Cyrillic, Greek, Armenian, Georgian
function transliterate(str) {
  const charMap = {
    'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh','з':'z','и':'i','й':'y',
    'к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f',
    'х':'kh','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya',
    'ә':'ae','ө':'oe','ү':'ue','ң':'ng','ғ':'gh','ҡ':'q','һ':'h','ҙ':'dh','ҫ':'th','ӑ':'a','ӗ':'e',
    'ҫ':'s','ӳ':'u','α':'a','β':'v','γ':'g','δ':'d','ε':'e','ζ':'z','η':'i','θ':'th','ι':'i',
    'κ':'k','λ':'l','μ':'m','ν':'n','ξ':'x','ο':'o','π':'p','ρ':'r','σ':'s','ς':'s','τ':'t',
    'υ':'y','φ':'f','χ':'ch','ψ':'ps','ω':'o','ά':'a','έ':'e','ή':'i','ί':'i','ό':'o','ύ':'y','ώ':'o'
  };

  return str.toLowerCase().split('').map(c => charMap[c] || c).join('');
}

function slugify(text) {
  const normalized = transliterate(text.toString().toLowerCase())
    .replace(/[áàâäã]/g, 'a')
    .replace(/[éèêë]/g, 'e')
    .replace(/[íìîï]/g, 'i')
    .replace(/[óòôöõ]/g, 'o')
    .replace(/[úùûü]/g, 'u')
    .replace(/[ç]/g, 'c');

  const slug = normalized
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

  return slug || 'group';
}

const verbFiles = [
  'tools/de/konjugation/data/verbs.json',
  'tools/pt/conjugeur/data/verbs.json',
  'tools/es/conjugeur/data/verbs.json',
  'tools/fr/conjugeur/data/verbs.json',
  'tools/ru/spryazhenie/data/verbs.json',
  'tools/it/coniugatore/data/verbs.json',
  'tools/el/klisi-rimaton/data/verbs.json',
  'tools/br/conjugeur/data/verbs.json',
  'tools/tt/conjugeur/data/verbs.json',
  'tools/ba/conjugeur/data/verbs.json',
  'tools/cv/conjugeur/data/verbs.json',
  'tools/hy/conjugeur/data/verbs.json',
  'tools/ka/conjugeur/data/verbs.json'
];

let totalGroupFilesCreated = 0;

for (const filePath of verbFiles) {
  if (!fs.existsSync(filePath)) continue;

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const groupsDir = path.join(path.dirname(filePath), 'groups');

  if (fs.existsSync(groupsDir)) {
    fs.rmSync(groupsDir, { recursive: true, force: true });
  }
  fs.mkdirSync(groupsDir, { recursive: true });

  const groupedVerbs = {};

  for (const [lemma, verbObj] of Object.entries(data)) {
    const rawGroup = verbObj.group || 'other';
    let groupSlug = slugify(rawGroup);

    if (!groupedVerbs[groupSlug]) {
      groupedVerbs[groupSlug] = {
        group_name: rawGroup,
        verbs: {}
      };
    }

    groupedVerbs[groupSlug].verbs[lemma] = verbObj;
  }

  for (const [slug, groupData] of Object.entries(groupedVerbs)) {
    const outPath = path.join(groupsDir, `${slug}.json`);
    fs.writeFileSync(outPath, JSON.stringify(groupData, null, 2) + '\n', 'utf8');
    totalGroupFilesCreated++;
  }
}

console.log(`Successfully generated group shards across verb tools. Created ${totalGroupFilesCreated} group files.`);
