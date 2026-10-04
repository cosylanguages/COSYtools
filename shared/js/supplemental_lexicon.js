(function () {
    /**
     * Shared Shard Loader & Supplemental Lexicon Module for COSYtools
     * Maintains a single cached instance of index.json and loaded shards per language.
     */

    function getFirstLetter(word) {
        if (!word) return 'other';
        const norm = String(word).normalize('NFC').toLowerCase().trim();
        if (!norm) return 'other';
        const char = norm.charAt(0);
        if (/[a-z0-9\u00C0-\u024F\u0370-\u03FF\u0400-\u04FF\u0530-\u058F\u10A0-\u10FF]/i.test(char)) {
            return char;
        }
        return 'other';
    }

    class ShardLoader {
        constructor() {
            this.cache = new Map(); // lang -> { indexPromise, index, shardPromises: Map(letter -> promise), shardUnits: Map(letter -> units) }
        }

        getRootPath() {
            const pathParts = window.location.pathname.replace(/^\//, '').split('/');
            const toolsIdx = pathParts.indexOf('tools');
            if (toolsIdx !== -1) {
                const depth = pathParts.length - 1;
                return '../'.repeat(depth);
            }
            return '';
        }

        getLangState(lang) {
            if (!this.cache.has(lang)) {
                this.cache.set(lang, {
                    indexPromise: null,
                    index: null,
                    shardPromises: new Map(),
                    shardUnits: new Map()
                });
            }
            return this.cache.get(lang);
        }

        async loadIndex(lang) {
            const state = this.getLangState(lang);
            if (state.index) return state.index;
            if (state.indexPromise) return state.indexPromise;

            const rootPath = this.getRootPath();
            const url = `${rootPath}tools/${lang}/data/shards/index.json`;

            state.indexPromise = fetch(url)
                .then(res => {
                    if (!res.ok) throw new Error(`Index status ${res.status}`);
                    return res.json();
                })
                .then(indexData => {
                    state.index = indexData;
                    return indexData;
                })
                .catch(err => {
                    state.indexPromise = null;
                    throw err;
                });

            return state.indexPromise;
        }

        async loadShard(lang, letter) {
            const state = this.getLangState(lang);
            const normLetter = getFirstLetter(letter);

            if (state.shardUnits.has(normLetter)) {
                return state.shardUnits.get(normLetter);
            }
            if (state.shardPromises.has(normLetter)) {
                return state.shardPromises.get(normLetter);
            }

            const index = await this.loadIndex(lang);
            if (!index.letters.includes(normLetter)) {
                state.shardUnits.set(normLetter, []);
                return [];
            }

            const rootPath = this.getRootPath();
            const url = `${rootPath}tools/${lang}/data/shards/${normLetter}.json`;

            const promise = fetch(url)
                .then(res => {
                    if (!res.ok) throw new Error(`Shard status ${res.status}`);
                    return res.json();
                })
                .then(shardData => {
                    const units = shardData.units || [];
                    state.shardUnits.set(normLetter, units);
                    return units;
                })
                .catch(err => {
                    state.shardPromises.delete(normLetter);
                    state.shardUnits.set(normLetter, []);
                    return [];
                });

            state.shardPromises.set(normLetter, promise);
            return promise;
        }

        async getUnitByLemma(lang, lemma) {
            if (!lemma) return null;
            const normLemma = lemma.normalize('NFC').toLowerCase().trim();
            const letter = getFirstLetter(normLemma);
            const units = await this.loadShard(lang, letter);
            const matches = units.filter(u => (u.lemma || u.headword || u.word || '').normalize('NFC').toLowerCase().trim() === normLemma);
            if (!matches.length) return null;
            const vUnit = matches.find(u => (u.pos === 'V' || u.kind === 'verbs') && u.forms && u.forms.length > 0);
            if (vUnit) return vUnit;
            const formsUnit = matches.find(u => u.forms && u.forms.length > 0);
            if (formsUnit) return formsUnit;
            return matches[0];
        }

        async getAllVerbUnits(lang) {
            const index = await this.loadIndex(lang);
            const allShards = await Promise.all(index.letters.map(l => this.loadShard(lang, l)));
            const verbUnits = [];
            for (const shard of allShards) {
                for (const u of shard) {
                    if (u.pos === 'V' || u.kind === 'verbs') {
                        verbUnits.push(u);
                    }
                }
            }
            return verbUnits;
        }

        async searchUnits(lang, query) {
            if (!query) return [];
            const cleanQuery = query.normalize('NFC').toLowerCase().trim();
            if (!cleanQuery) return [];

            const index = await this.loadIndex(lang);
            const matchingLetters = new Set();
            const firstChar = getFirstLetter(cleanQuery);
            if (index.letters.includes(firstChar)) {
                matchingLetters.add(firstChar);
            }

            // Also check headwords list in index for prefix/substring matches
            if (index.headwords) {
                for (const hw of index.headwords) {
                    if (hw.includes(cleanQuery)) {
                        matchingLetters.add(getFirstLetter(hw));
                    }
                }
            }

            const shards = await Promise.all(Array.from(matchingLetters).map(l => this.loadShard(lang, l)));
            const results = [];
            for (const shard of shards) {
                for (const u of shard) {
                    const lemma = (u.lemma || u.headword || u.word || '').normalize('NFC').toLowerCase();
                    const formsStr = (u.forms || []).map(f => typeof f === 'string' ? f : (f.form || '')).join(' ').toLowerCase();
                    if (lemma.includes(cleanQuery) || formsStr.includes(cleanQuery)) {
                        results.push(u);
                    }
                }
            }
            return results;
        }
    }

    window.COSYSupplementalLexicon = new ShardLoader();

    // UI Controller for Supplemental Lexicon Panel
    function initUI() {
        const input = document.querySelector('#verb-search-input, #noun-search-input, #search-input');
        if (!input || document.getElementById('supplemental-lexicon-panel')) return;

        const pathParts = window.location.pathname.replace(/^\//, '').split('/');
        const toolsIdx = pathParts.indexOf('tools');
        let lang = null;
        if (toolsIdx !== -1 && toolsIdx + 1 < pathParts.length) {
            lang = pathParts[toolsIdx + 1];
        }
        if (!lang) return;

        const panel = document.createElement('section');
        panel.id = 'supplemental-lexicon-panel';
        panel.setAttribute('aria-live', 'polite');
        panel.innerHTML = '<h3>Source-backed additions</h3><p class="supplemental-status">Imported vocabulary ready</p><div class="supplemental-results"></div>';
        input.closest('main')?.appendChild(panel);

        const resultsContainer = panel.querySelector('.supplemental-results');

        const RELATED_VERBS_TITLES = {
            es: 'Verbos relacionados',
            pt: 'Verbos relacionados',
            de: 'Verwandte Verben',
            en: 'Related verbs',
            fr: 'Verbes apparentés',
            it: 'Verbi correlati',
            ru: 'Родственные глаголы',
            el: 'Σχετικά ρήματα'
        };

        async function renderResults(query) {
            const normQuery = (query || '').normalize('NFC').toLowerCase().trim();
            if (!normQuery) {
                resultsContainer.innerHTML = '';
                return;
            }

            try {
                const matches = await window.COSYSupplementalLexicon.searchUnits(lang, normQuery);

                const exactMatches = [];
                const relatedMatches = [];

                matches.forEach(unit => {
                    if (unit.pos === 'OTHER') {
                        const hw = (unit.lemma || '').toLowerCase();
                        const hasRelatedForm = (unit.forms || []).some(f => {
                            const str = (typeof f === 'string' ? f : f.form || '').toLowerCase();
                            return str.includes(hw) || hw.includes(str);
                        });
                        if (!hasRelatedForm) return;
                    }

                    const lemmaNorm = (unit.lemma || unit.headword || unit.word || '').normalize('NFC').toLowerCase().trim();
                    if (lemmaNorm === normQuery) {
                        exactMatches.push(unit);
                    } else {
                        relatedMatches.push(unit);
                    }
                });

                if (!exactMatches.length && !relatedMatches.length) {
                    resultsContainer.innerHTML = '<p class="supplemental-empty">No imported match.</p>';
                    return;
                }

                function renderUnitCard(unit, unitIdx) {
                    const sourceName = unit.source === 'Kaikki/Wiktionary' || (unit.source_url && unit.source_url.includes('kaikki'))
                        ? 'Imported entries (Kaikki)'
                        : 'Imported forms (UniMorph)';

                    const sourceUrl = unit.source_url || '#';
                    const linkHtml = sourceUrl !== '#' ? `<a href="${sourceUrl}" target="_blank" rel="noopener">${sourceName}</a>` : sourceName;

                    const rawForms = unit.forms || [];
                    const groupedByTag = new Map();

                    rawForms.forEach(f => {
                        if (typeof f === 'string') {
                            if (!groupedByTag.has('Form')) groupedByTag.set('Form', new Set());
                            groupedByTag.get('Form').add(f);
                        } else if (f && f.form) {
                            const tagStr = (f.features || []).join(' ') || 'Form';
                            if (!groupedByTag.has(tagStr)) groupedByTag.set(tagStr, new Set());
                            groupedByTag.get(tagStr).add(f.form);
                        }
                    });

                    const allFormItems = [];
                    groupedByTag.forEach((formSet, tag) => {
                        const uniqueForms = Array.from(formSet).join(', ');
                        allFormItems.push({ tag, forms: uniqueForms });
                    });

                    let formsDisplayHtml = '';
                    if (allFormItems.length > 0) {
                        const visibleItems = allFormItems.slice(0, 12);
                        const hiddenItems = allFormItems.slice(12);

                        const renderItem = item => `<li><small class="tag-label">${item.tag}:</small> <span>${item.forms}</span></li>`;

                        formsDisplayHtml = `<ul class="supplemental-forms-list">${visibleItems.map(renderItem).join('')}</ul>`;

                        if (hiddenItems.length > 0) {
                            const hiddenListId = `supp-hidden-${unitIdx}-${Math.random().toString(36).substr(2, 5)}`;
                            formsDisplayHtml += `
                                <ul id="${hiddenListId}" class="supplemental-forms-list hidden-forms" style="display:none;">
                                    ${hiddenItems.map(renderItem).join('')}
                                </ul>
                                <button type="button" class="show-more-btn" onclick="
                                    const el = document.getElementById('${hiddenListId}');
                                    if (el.style.display === 'none') {
                                        el.style.display = 'block';
                                        this.textContent = 'Show less';
                                    } else {
                                        el.style.display = 'none';
                                        this.textContent = 'Show more (${hiddenItems.length} more)';
                                    }
                                ">Show more (${hiddenItems.length} more)</button>
                            `;
                        }
                    } else {
                        formsDisplayHtml = `<span>${unit.definition || unit.pos || ''}</span>`;
                    }

                    return `
                        <article class="supplemental-result">
                            <div class="supplemental-header">
                                <strong>${unit.lemma}</strong>
                                <span class="supplemental-source-title">${linkHtml}</span>
                            </div>
                            <div class="supplemental-body">
                                ${formsDisplayHtml}
                            </div>
                        </article>
                    `;
                }

                let html = exactMatches.slice(0, 12).map((u, i) => renderUnitCard(u, i)).join('');

                if (relatedMatches.length > 0) {
                    const relatedTitle = RELATED_VERBS_TITLES[lang] || RELATED_VERBS_TITLES.en;
                    const relatedCardsHtml = relatedMatches.slice(0, 12).map((u, i) => renderUnitCard(u, i + 100)).join('');
                    html += `
                        <details class="related-verbs-details" style="margin-top: 1rem; border: 1px solid var(--border-color, #e2e8f0); border-radius: 8px; padding: 0.5rem 0.75rem;">
                            <summary style="cursor: pointer; font-weight: 600; color: var(--ink-soft, #475569);">${relatedTitle} (${relatedMatches.length})</summary>
                            <div class="related-verbs-list" style="margin-top: 0.75rem;">
                                ${relatedCardsHtml}
                            </div>
                        </details>
                    `;
                }

                resultsContainer.innerHTML = html;
            } catch (err) {
                resultsContainer.innerHTML = '';
            }
        }

        input.addEventListener('input', () => renderResults(input.value));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUI);
    } else {
        initUI();
    }
})();
