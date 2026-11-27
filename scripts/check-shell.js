const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const stripTemplate = fs.readFileSync(path.join(ROOT, 'shared/templates/strip.html'), 'utf8');
const footerTemplate = fs.readFileSync(path.join(ROOT, 'shared/templates/footer.html'), 'utf8');
const tokenCss = fs.readFileSync(path.join(ROOT, 'shared/css/cosy-tokens.css'), 'utf8');

const THEME_COLOUR = /--cosy-signal:\s*(#[0-9A-Fa-f]{3,8})/.exec(tokenCss)[1].toUpperCase();
// The install surface (manifest background) uses the page background token.
const CREAM = /--cosy-color-cream:\s*(#[0-9A-Fa-f]{3,8})/.exec(tokenCss)[1].toUpperCase();
const STRIP_ASSETS = ['shared/vendor/ecosystem-strip.css', 'shared/vendor/ecosystem-strip.js'];
const SIBLING_ASSET = /(?:src|href)=["'][^"']*cosylanguages\.github\.io\/COSYlanguages\/(?:css|js)\/ecosystem-strip\.(?:css|js)["']/i;

const TRANSLATIONS = {
  en: {
    themeLabel: 'Switch theme',
    footerText: 'Language reference tools across 14 languages. 100% client-side & private.',
    footerSubtext: 'Open language reference tools.'
  },
  fr: {
    themeLabel: 'Changer de thème',
    footerText: 'Outils de référence linguistique dans 14 langues. 100% côté client & privé.',
    footerSubtext: 'Outils de référence linguistique ouverts.'
  },
  it: {
    themeLabel: 'Cambia tema',
    footerText: 'Strumenti di consultazione linguistica in 14 lingue. 100% lato client e privato.',
    footerSubtext: 'Strumenti di consultazione linguistica aperti.'
  },
  ru: {
    themeLabel: 'Переключить тему',
    footerText: 'Языковые справочные инструменты для 14 языков. 100% на стороне клиента и конфиденциально.',
    footerSubtext: 'Открытые языковые справочные инструменты.'
  },
  el: {
    themeLabel: 'Αλλαγή θέματος',
    footerText: 'Εργαλεία γλωσσικής αναφοράς σε 14 γλώσσες. 100% client-side & ιδιωτικά.',
    footerSubtext: 'Ανοιχτά εργαλεία γλωσσικής αναφοράς.'
  },
  de: {
    themeLabel: 'Design wechseln',
    footerText: 'Sprachnachschlagewerke für 14 Sprachen. 100% clientseitig & privat.',
    footerSubtext: 'Offene Sprachnachschlagewerke.'
  },
  es: {
    themeLabel: 'Cambiar tema',
    footerText: 'Herramientas de consulta lingüística en 14 idiomas. 100% en el cliente y privado.',
    footerSubtext: 'Herramientas de consulta lingüística abiertas.'
  },
  pt: {
    themeLabel: 'Alternar tema',
    footerText: 'Ferramentas de referência linguística em 14 idiomas. 100% no cliente e privado.',
    footerSubtext: 'Ferramentas de referência linguística abertas.'
  }
};

function getFiles(dir) {
  let res = [];
  const list = fs.readdirSync(dir);
  for (const f of list) {
    if (f === 'node_modules' || f === '.git' || f === 'shared') continue;
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) res = res.concat(getFiles(full));
    else if (f.endsWith('.html')) res.push(full);
  }
  return res;
}

function getManifests(dir, res = []) {
  for (const f of fs.readdirSync(dir)) {
    if (f === 'node_modules' || f === '.git') continue;
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) getManifests(full, res);
    else if (f === 'manifest.json') res.push(full);
  }
  return res;
}

function getFileLang(content) {
  const match = content.match(/<html[^>]*lang=["']([^"']+)["']/i);
  if (match) {
    const lang = match[1].toLowerCase();
    if (TRANSLATIONS[lang]) return lang;
  }
  return 'en';
}

function renderExpectedStrip(fromFile, lang) {
  const trans = TRANSLATIONS[lang] || TRANSLATIONS.en;
  return stripTemplate
    .replace('{{LANG}}', lang)
    .replace('{{THEME_TOGGLE_LABEL}}', trans.themeLabel)
    .trim();
}

function renderExpectedFooter(lang) {
  const trans = TRANSLATIONS[lang] || TRANSLATIONS.en;
  return footerTemplate
    .replace('{{FOOTER_TEXT}}', trans.footerText)
    .replace('{{FOOTER_SUBTEXT}}', trans.footerSubtext)
    .trim();
}

const files = getFiles('.');
let errors = 0;

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const lang = getFileLang(content);

  const expectedStrip = renderExpectedStrip(f, lang);
  const expectedFooter = renderExpectedFooter(lang);

  if (!content.includes(expectedStrip)) {
    console.error(`[FAIL] ${f}: Ecosystem strip does not match expected template rendering for lang '${lang}'`);
    errors++;
  }

  if (!content.includes(expectedFooter)) {
    console.error(`[FAIL] ${f}: Shell footer does not match expected template rendering for lang '${lang}'`);
    errors++;
  }

  // The strip is a pinned local copy: a sibling-origin link is a cross-repo dependency.
  if (SIBLING_ASSET.test(content)) {
    console.error(`[FAIL] ${f}: Ecosystem strip is loaded from COSYlanguages; use the vendored copy`);
    errors++;
  }
  for (const asset of STRIP_ASSETS) {
    const referenced = new RegExp(`(?:src|href)=["'][^"']*${asset.replace(/\./g, '\\.')}["']`).test(content);
    if (!referenced) {
      console.error(`[FAIL] ${f}: Missing local link to ${asset}`);
      errors++;
      continue;
    }
    const href = new RegExp(`(?:src|href)=["']([^"']*${asset.replace(/\./g, '\\.')})["']`).exec(content)[1];
    const resolved = path.relative(ROOT, path.resolve(path.dirname(f), href)).split(path.sep).join('/');
    if (resolved !== asset) {
      console.error(`[FAIL] ${f}: ${asset} resolves to ${resolved}`);
      errors++;
    }
  }

  // One browser-chrome colour for the whole site, taken from the canonical token.
  const themeColour = /<meta[^>]+name=["']theme-color["'][^>]*content=["']([^"']+)["']/i.exec(content);
  if (!themeColour) {
    console.error(`[FAIL] ${f}: Missing <meta name="theme-color">`);
    errors++;
  } else if (themeColour[1].toUpperCase() !== THEME_COLOUR) {
    console.error(`[FAIL] ${f}: theme-color is ${themeColour[1]}, expected ${THEME_COLOUR}`);
    errors++;
  }
});

// The install surface has to agree with the pages. A manifest that paints a
// different colour gives an installed app a title bar the site never uses, and
// nothing on the page can reveal it: the mismatch only appears after install.
const manifests = getManifests('.');
if (!manifests.length) {
  console.error('[FAIL] No manifest.json found: the install surface is unchecked');
  errors++;
}
for (const file of manifests) {
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    console.error(`[FAIL] ${file}: not valid JSON (${error.message})`);
    errors++;
    continue;
  }
  if ((manifest.theme_color || '').toUpperCase() !== THEME_COLOUR) {
    console.error(`[FAIL] ${file}: theme_color is ${manifest.theme_color || 'missing'}, expected ${THEME_COLOUR}`);
    errors++;
  }
  if ((manifest.background_color || '').toUpperCase() !== CREAM) {
    console.error(`[FAIL] ${file}: background_color is ${manifest.background_color || 'missing'}, expected ${CREAM}`);
    errors++;
  }
}

if (errors > 0) {
  console.error(`\nCheck shell failed: ${errors} error(s) found.`);
  process.exit(1);
} else {
  console.log(
    `\nCheck shell passed: ${files.length} HTML files match the strip and footer templates, ` +
      `and ${manifests.length} manifests carry ${THEME_COLOUR} / ${CREAM}.`
  );
}
