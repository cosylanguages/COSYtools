const fs = require('fs');
const path = require('path');

const stripTemplate = fs.readFileSync(path.join(__dirname, '../shared/templates/strip.html'), 'utf8');
const footerTemplate = fs.readFileSync(path.join(__dirname, '../shared/templates/footer.html'), 'utf8');
const tokenCss = fs.readFileSync(path.join(__dirname, '../shared/css/cosy-tokens.css'), 'utf8');

// Pinned copy: see shared/vendor/ASSETS.json and docs/architecture.md.
const STRIP_CSS = 'shared/vendor/ecosystem-strip.css';
const STRIP_JS = 'shared/vendor/ecosystem-strip.js';

// One browser-chrome colour for the whole site, read from the canonical token.
const THEME_COLOUR = /--cosy-signal:\s*(#[0-9A-Fa-f]{3,8})/.exec(tokenCss)[1].toUpperCase();
const THEME_COLOUR_META = `<meta name="theme-color" content="${THEME_COLOUR}">`;

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

function normalizePath(p) {
  return p.replace(/\\/g, '/');
}

// Prefix that walks from a page back to the repository root.
function getRelativeRoot(fromFile) {
  const parts = normalizePath(fromFile).split('/').filter(Boolean);
  return '../'.repeat(parts.length - 1);
}

function getFileLang(content) {
  const match = content.match(/<html[^>]*lang=["']([^"']+)["']/i);
  if (match) {
    const lang = match[1].toLowerCase();
    if (TRANSLATIONS[lang]) return lang;
  }
  return 'en';
}

function renderStrip(fromFile, lang) {
  const trans = TRANSLATIONS[lang] || TRANSLATIONS.en;
  return stripTemplate
    .replace('{{LANG}}', lang)
    .replace('{{THEME_TOGGLE_LABEL}}', trans.themeLabel);
}

function renderFooter(lang) {
  const trans = TRANSLATIONS[lang] || TRANSLATIONS.en;
  return footerTemplate
    .replace('{{FOOTER_TEXT}}', trans.footerText)
    .replace('{{FOOTER_SUBTEXT}}', trans.footerSubtext);
}

const files = getFiles('.');

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  const lang = getFileLang(content);

  const strip = renderStrip(f, lang);
  if (content.includes('<!-- /Shared Ecosystem Strip -->')) {
    content = content.replace(/<!-- Shared Ecosystem Strip -->[\s\S]*?<!-- \/Shared Ecosystem Strip -->/i, strip.trim());
  } else if (content.includes('class="cosy-ecosystem-strip"')) {
    // Legacy hand-written bar (strip + inner divs) → component mount.
    content = content.replace(/<!-- Shared Ecosystem Strip -->[\s\S]*?<\/div>\s*<\/div>/i, strip.trim());
  } else if (content.includes('<body')) {
    content = content.replace(/(<body[^>]*>)/i, `$1\n    ${strip.trim()}\n`);
  }

  // Load the shared strip component once per page, from the pinned local copy.
  const root = getRelativeRoot(f);
  const stripCssHref = root + STRIP_CSS;
  const stripJsSrc = root + STRIP_JS;

  content = content.replace(
    /<link[^>]*href=["']https?:\/\/cosylanguages\.github\.io\/COSYlanguages\/css\/ecosystem-strip\.css["'][^>]*>/gi,
    `<link rel="stylesheet" href="${stripCssHref}">`
  );
  content = content.replace(
    /<script[^>]*src=["']https?:\/\/cosylanguages\.github\.io\/COSYlanguages\/js\/ecosystem-strip\.js["'][^>]*><\/script>/gi,
    `<script src="${stripJsSrc}" defer></script>`
  );

  if (!content.includes('ecosystem-strip.css') && content.includes('</head>')) {
    content = content.replace('</head>', `  <link rel="stylesheet" href="${stripCssHref}">\n</head>`);
  }
  if (!content.includes('ecosystem-strip.js') && content.includes('</body>')) {
    content = content.replace('</body>', `  <script src="${stripJsSrc}" defer></script>\n</body>`);
  }

  // One browser-chrome colour for every page, so the address bar matches the brand.
  if (/<meta[^>]+name=["']theme-color["'][^>]*>/i.test(content)) {
    content = content.replace(/<meta[^>]+name=["']theme-color["'][^>]*>/i, THEME_COLOUR_META);
  } else if (content.includes('</head>')) {
    content = content.replace('</head>', `  ${THEME_COLOUR_META}\n</head>`);
  }

  const footer = renderFooter(lang);
  if (content.includes('class="cosy-footer"') || content.includes('<footer')) {
    content = content.replace(/(<!-- Shared Shell Footer -->\s*)*<footer[\s\S]*?<\/footer>/i, footer.trim());
  } else if (content.includes('</body>')) {
    content = content.replace('</body>', `    ${footer.trim()}\n</body>`);
  }

  fs.writeFileSync(f, content, 'utf8');
});

console.log(`Synced shell strip, footer and theme colour across ${files.length} HTML files.`);
