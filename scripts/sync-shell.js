const fs = require('fs');
const path = require('path');

const stripTemplate = fs.readFileSync(path.join(__dirname, '../shared/templates/strip.html'), 'utf8');
const footerTemplate = fs.readFileSync(path.join(__dirname, '../shared/templates/footer.html'), 'utf8');

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

function getRelativeIndex(fromFile) {
  const norm = normalizePath(fromFile);
  const parts = norm.split('/').filter(Boolean);
  const dirDepth = parts.length - 1;
  if (dirDepth === 0) return 'index.html';
  return '../'.repeat(dirDepth) + 'index.html';
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
  const indexLink = getRelativeIndex(fromFile);
  const trans = TRANSLATIONS[lang] || TRANSLATIONS.en;
  return stripTemplate
    .replace('{{INDEX_LINK}}', indexLink)
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
  if (content.includes('class="cosy-ecosystem-strip"')) {
    content = content.replace(/<!-- Shared Ecosystem Strip -->[\s\S]*?<\/div>\s*<\/div>/i, strip.trim());
  } else if (content.includes('<body')) {
    content = content.replace(/(<body[^>]*>)/i, `$1\n    ${strip.trim()}\n`);
  }

  const footer = renderFooter(lang);
  if (content.includes('class="cosy-footer"') || content.includes('<footer')) {
    content = content.replace(/(<!-- Shared Shell Footer -->\s*)?<footer[\s\S]*?<\/footer>/i, footer.trim());
  } else if (content.includes('</body>')) {
    content = content.replace('</body>', `    ${footer.trim()}\n</body>`);
  }

  fs.writeFileSync(f, content, 'utf8');
});

console.log(`Synced shell strip and footer across ${files.length} HTML files.`);
