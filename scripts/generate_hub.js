#!/usr/bin/env node
/**
 * generate_hub.js — renders the COSYtools hub (index.html) from catalog.json.
 *
 * catalog.json is the single source of truth for tools. This script rewrites two
 * marker-delimited regions in index.html:
 *   <!-- HUB:FILTERS:START --> ... <!-- HUB:FILTERS:END -->   language/type filter bar
 *   <!-- HUB:TOOLS:START -->   ... <!-- HUB:TOOLS:END -->     one section per tool type
 *
 * Usage:
 *   node scripts/generate_hub.js           rewrite index.html
 *   node scripts/generate_hub.js --check   exit 1 if index.html is stale or catalog is invalid (CI)
 *
 * Catalog fields used per tool: id, language, type, status (stable|beta|stub),
 * title, description (both in the tool's own language), keywords (optional), entry_url.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CHECK = process.argv.includes('--check');

const STATUSES = ['stable', 'beta', 'stub'];
// Catalog `type` -> hub section. "syntax" and "prepositions" share one section.
const TYPE_GROUP = {
  conjugation: 'conjugation',
  'gender-case': 'gender-case',
  prepositions: 'syntax',
  syntax: 'syntax',
  speaking: 'speaking'
};
const GROUPS = [
  { id: 'conjugation', i18n: 'type_conjugation', label: 'Verb conjugation', icon: 'icon-book' },
  { id: 'gender-case', i18n: 'type_gender_case', label: 'Gender & cases', icon: 'icon-scale' },
  { id: 'syntax', i18n: 'type_syntax', label: 'Prepositions & syntax', icon: 'icon-puzzle' },
  { id: 'speaking', i18n: 'type_speaking', label: 'Speaking practice', icon: 'icon-speech' }
];

const esc = s => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function readLanguages() {
  const src = fs.readFileSync(path.join(ROOT, 'shared/js/languages.js'), 'utf8');
  const re = /\{\s*code:\s*'([a-z]{2})',\s*name:\s*'([^']+)',\s*native:\s*'([^']+)'[^}]*?flag:\s*'([^']+)'/g;
  const langs = [];
  let m;
  while ((m = re.exec(src))) langs.push({ code: m[1], name: m[2], native: m[3], flag: m[4] });
  return langs;
}

function readPrimaryLanguages() {
  const src = fs.readFileSync(path.join(ROOT, 'shared/js/languages.js'), 'utf8');
  const match = src.match(/window\.COSYTOOLS_PRIMARY_LANGUAGES\s*=\s*\[([^\]]*)\]/);
  if (!match) throw new Error('shared/js/languages.js is missing COSYTOOLS_PRIMARY_LANGUAGES');
  return Array.from(match[1].matchAll(/'([a-z]{2})'/g), item => item[1]);
}

function validate(catalog, langs, primaryLanguages) {
  const errors = [];
  const ids = new Set();
  const langCodes = new Set(langs.map(l => l.code));
  const urls = new Set();
  if (!primaryLanguages.length) errors.push('shared/js/languages.js: COSYTOOLS_PRIMARY_LANGUAGES must not be empty');
  for (const code of primaryLanguages) {
    if (!langCodes.has(code)) errors.push(`shared/js/languages.js: primary language "${code}" is not registered`);
    if (!catalog.some(tool => tool.language === code)) errors.push(`catalog.json: primary language "${code}" has no tools`);
  }
  for (const t of catalog) {
    const where = `catalog.json › ${t.id || '(no id)'}`;
    if (!t.id) errors.push(`${where}: missing id`);
    if (ids.has(t.id)) errors.push(`${where}: duplicate id`);
    ids.add(t.id);
    if (!langCodes.has(t.language)) errors.push(`${where}: language "${t.language}" not in shared/js/languages.js`);
    if (!TYPE_GROUP[t.type]) errors.push(`${where}: unknown type "${t.type}"`);
    if (!STATUSES.includes(t.status)) errors.push(`${where}: status must be one of ${STATUSES.join('|')}`);
    if (!t.title) errors.push(`${where}: missing title`);
    if (!t.description) errors.push(`${where}: missing description`);
    if (!t.entry_url || !fs.existsSync(path.join(ROOT, t.entry_url))) errors.push(`${where}: entry_url does not exist (${t.entry_url})`);
    urls.add(path.normalize(t.entry_url || ''));
  }
  // Every tool page on disk must be catalogued, otherwise it is invisible in the hub.
  const toolsDir = path.join(ROOT, 'tools');
  for (const lang of fs.readdirSync(toolsDir, { withFileTypes: true }).filter(d => d.isDirectory())) {
    for (const tool of fs.readdirSync(path.join(toolsDir, lang.name), { withFileTypes: true }).filter(d => d.isDirectory())) {
      const page = path.join('tools', lang.name, tool.name, 'index.html');
      if (fs.existsSync(path.join(ROOT, page)) && !urls.has(path.normalize(page))) {
        errors.push(`${page} exists but is not listed in catalog.json (it would be missing from the hub)`);
      }
    }
  }
  return errors;
}

function renderFilters(catalog, langs, primaryLanguages) {
  const byLang = new Map();
  catalog.forEach(t => {
    if (!byLang.has(t.language)) byLang.set(t.language, []);
    byLang.get(t.language).push(t);
  });
  const devCount = catalog.filter(t => t.status === 'stub').length;
  const langPill = l => {
    const devOnly = byLang.get(l.code).every(t => t.status === 'stub');
    return `            <button type="button" class="fpill" data-filter-lang="${l.code}"${devOnly ? ' data-dev-only="true"' : ''} aria-pressed="false"><span class="hub-lang-code" aria-hidden="true">${l.code.toUpperCase()}</span> ${esc(l.native)}</button>`;
  };
  const primaryLangPills = primaryLanguages
    .map(code => langs.find(l => l.code === code))
    .filter(l => l && byLang.has(l.code))
    .map(langPill)
    .join('\n');
  const otherLangPills = langs.filter(l => !primaryLanguages.includes(l.code) && byLang.has(l.code)).map(langPill).join('\n');
  const otherLanguageCount = langs.filter(l => !primaryLanguages.includes(l.code) && byLang.has(l.code)).length;
  const usedGroups = GROUPS.filter(g => catalog.some(t => TYPE_GROUP[t.type] === g.id));
  const typePills = usedGroups
    .map(g => `            <button type="button" class="fpill" data-filter-type="${g.id}" data-i18n="${g.i18n}" aria-pressed="false">${esc(g.label)}</button>`)
    .join('\n');
  return `<!-- HUB:FILTERS:START (generated by scripts/generate_hub.js from catalog.json — do not edit by hand) -->
        <div class="filter-section hub-filter-panel">
            <div class="filter-row hub-primary-languages" id="hub-primary-languages" role="group" aria-labelledby="hub-lang-label">
            <span class="filter-label" id="hub-lang-label" data-i18n="filter_lang_label">Choose a language:</span>
${primaryLangPills}
          </div>
          <details class="hub-secondary-options" id="hub-more-languages">
            <summary><span data-i18n="filter_more_languages">Other languages</span><span class="hub-dev-count">${otherLanguageCount} <span data-i18n="filter_in_development">in development</span></span></summary>
            <div class="filter-row hub-other-languages" role="group" aria-label="Other languages in development">
              <button type="button" class="fpill" data-filter-lang="all" data-i18n="filter_all_langs" aria-pressed="false">All languages</button>
${otherLangPills}
            </div>
          </details>
          <details class="hub-secondary-options" id="hub-advanced-filters">
            <summary data-i18n="filter_more_options">More filters</summary>
            <div class="filter-row" role="group" aria-labelledby="hub-type-label">
              <span class="filter-label" id="hub-type-label" data-i18n="filter_type_label">Tool type:</span>
              <button type="button" class="fpill active" data-filter-type="all" data-i18n="filter_all_types" aria-pressed="true">All types</button>
${typePills}
            </div>
            <div class="filter-row hub-filter-meta">
              <label class="hub-dev-toggle">
                <input type="checkbox" id="hub-show-dev">
                <span data-i18n="filter_show_dev">Show incomplete tools</span>
                <span class="hub-dev-count">(${devCount})</span>
              </label>
            </div>
          </details>
          <div class="filter-row hub-filter-meta">
            <span id="hub-result-count" class="hub-result-count" role="status" aria-live="polite"></span>
          </div>
        </div>
        <!-- HUB:FILTERS:END -->`;
}

function renderCard(t, langMap) {
  const l = langMap.get(t.language);
  const group = TYPE_GROUP[t.type];
  const groupObj = GROUPS.find(g => g.id === group) || GROUPS[0];
  const href = t.entry_url.replace(/index\.html$/, '');
  const search = [l.native, l.name, t.language, t.type, group, groupObj.label, t.title, t.description, t.keywords || '']
    .join(' ').toLowerCase();
  const statusBadge = t.status === 'stable' ? '' :
    `<span class="status-badge status-${t.status}" data-i18n="status_${t.status}">${t.status === 'beta' ? 'Beta' : 'In development'}</span>`;
  return `          <a href="${esc(href)}" class="engine-card" data-tool="${esc(t.id)}" data-lang="${t.language}" data-type="${group}" data-status="${t.status}" data-search="${esc(search)}">
            <div>
              <div class="engine-card-top">
                <div class="engine-icon" aria-hidden="true">${l.code.toUpperCase()}</div>
                <div class="engine-title-area">
                  <h3>${esc(t.title)}</h3>
                  <div class="engine-subtitle">
                    <span class="card-lang-tag">${esc(l.native)} (${esc(l.name)})</span>
                    <span class="card-type-tag" data-i18n="${groupObj.i18n}">${esc(groupObj.label)}</span>
                    ${statusBadge}
                  </div>
                </div>
              </div>
              <p class="engine-desc">${esc(t.description)}</p>
            </div>
            <div class="engine-cta-btn"><span data-i18n="btn_open_tool">▶ Open tool</span></div>
          </a>`;
}

function renderTools(catalog, langs) {
  const langMap = new Map(langs.map(l => [l.code, l]));
  const order = new Map(langs.map((l, i) => [l.code, i]));
  const sections = GROUPS.map(g => {
    const tools = catalog
      .filter(t => TYPE_GROUP[t.type] === g.id)
      .sort((a, b) => (order.get(a.language) - order.get(b.language)) || a.id.localeCompare(b.id));
    if (!tools.length) return '';
    return `        <section class="hub-section" data-section="${g.id}" aria-labelledby="sec-${g.id}">
          <div class="category-header" id="sec-${g.id}" role="heading" aria-level="2"><span class="cosy-icon ${g.icon}" aria-hidden="true"></span> <span data-i18n="${g.i18n}">${esc(g.label)}</span></div>
          <div class="engines-grid">
${tools.map(t => renderCard(t, langMap)).join('\n\n')}
          </div>
        </section>`;
  }).filter(Boolean).join('\n\n');
  return `<!-- HUB:TOOLS:START (generated by scripts/generate_hub.js from catalog.json — do not edit by hand) -->
${sections}
        <!-- HUB:TOOLS:END -->`;
}

function replaceRegion(html, name, replacement) {
  const re = new RegExp(`<!-- HUB:${name}:START[\\s\\S]*?<!-- HUB:${name}:END -->`);
  if (!re.test(html)) throw new Error(`index.html is missing the HUB:${name} START/END markers`);
  return html.replace(re, () => replacement);
}

function main() {
  const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, 'catalog.json'), 'utf8'));
  const langs = readLanguages();
  const primaryLanguages = readPrimaryLanguages();
  if (!langs.length) throw new Error('Could not read any languages from shared/js/languages.js');
  const errors = validate(catalog, langs, primaryLanguages);
  if (errors.length) {
    console.error('Hub generation failed — fix catalog.json:\n' + errors.map(e => '  - ' + e).join('\n'));
    process.exit(1);
  }
  const file = path.join(ROOT, 'index.html');
  const current = fs.readFileSync(file, 'utf8');
  let next = replaceRegion(current, 'FILTERS', renderFilters(catalog, langs, primaryLanguages));
  next = replaceRegion(next, 'TOOLS', renderTools(catalog, langs));
  if (CHECK) {
    if (next !== current) {
      console.error('index.html is out of sync with catalog.json. Run: npm run generate:hub');
      process.exit(1);
    }
    console.log(`Hub check passed: ${catalog.length} catalog tools rendered, catalog valid, no uncatalogued tool pages.`);
    return;
  }
  fs.writeFileSync(file, next);
  console.log(`Hub generated: ${catalog.length} tools (${catalog.filter(t => t.status === 'stub').length} in development).`);
}

main();
