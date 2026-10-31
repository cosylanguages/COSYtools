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
                    state.shardPromises.delete(normLetter);
                    return units;
                })
                .catch(err => {
                    state.shardPromises.delete(normLetter);
                    console.warn(`COSY Supplemental Lexicon: Failed loading shard ${normLetter} for ${lang}`, err);
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

        const SUPP_I18N = {
            en: { title: "Source-backed additions", ready: "Imported vocabulary ready", noMatch: "No imported match.", more: "Show more ({n} more)", less: "Show less", srcK: "Imported entries (Kaikki)", srcU: "Imported forms (UniMorph)", newTab: "(opens in a new tab)" },
            fr: { title: "Compléments issus de sources", ready: "Vocabulaire importé prêt", noMatch: "Aucune correspondance importée.", more: "Afficher plus ({n} de plus)", less: "Afficher moins", srcK: "Entrées importées (Kaikki)", srcU: "Formes importées (UniMorph)", newTab: "(s'ouvre dans un nouvel onglet)" },
            es: { title: "Ampliaciones con fuentes", ready: "Vocabulario importado listo", noMatch: "No hay coincidencias importadas.", more: "Mostrar más ({n} más)", less: "Mostrar menos", srcK: "Entradas importadas (Kaikki)", srcU: "Formas importadas (UniMorph)", newTab: "(se abre en una pestaña nueva)" },
            it: { title: "Aggiunte con fonti", ready: "Vocabolario importato pronto", noMatch: "Nessuna corrispondenza importata.", more: "Mostra altro ({n} in più)", less: "Mostra meno", srcK: "Voci importate (Kaikki)", srcU: "Forme importate (UniMorph)", newTab: "(si apre in una nuova scheda)" },
            de: { title: "Ergänzungen mit Quellenangabe", ready: "Importierter Wortschatz bereit", noMatch: "Kein importierter Treffer.", more: "Mehr anzeigen ({n} weitere)", less: "Weniger anzeigen", srcK: "Importierte Einträge (Kaikki)", srcU: "Importierte Formen (UniMorph)", newTab: "(öffnet in einem neuen Tab)" },
            pt: { title: "Acréscimos com fontes", ready: "Vocabulário importado pronto", noMatch: "Nenhuma correspondência importada.", more: "Mostrar mais ({n} mais)", less: "Mostrar menos", srcK: "Entradas importadas (Kaikki)", srcU: "Formas importadas (UniMorph)", newTab: "(abre num novo separador)" },
            ru: { title: "Дополнения с источниками", ready: "Импортированный словарь готов", noMatch: "Импортированных совпадений нет.", more: "Показать ещё ({n})", less: "Показать меньше", srcK: "Импортированные статьи (Kaikki)", srcU: "Импортированные формы (UniMorph)", newTab: "(откроется в новой вкладке)" },
            el: { title: "Προσθήκες με πηγές", ready: "Το εισαγόμενο λεξιλόγιο είναι έτοιμο", noMatch: "Δεν βρέθηκε εισαγόμενο αποτέλεσμα.", more: "Εμφάνιση περισσότερων ({n} ακόμη)", less: "Εμφάνιση λιγότερων", srcK: "Εισαγόμενες καταχωρίσεις (Kaikki)", srcU: "Εισαγόμενοι τύποι (UniMorph)", newTab: "(ανοίγει σε νέα καρτέλα)" },
            hy: { title: "Աղբյուրներով լրացումներ", ready: "Ներմուծված բառապաշարը պատրաստ է", noMatch: "Ներմուծված համընկնում չկա։", more: "Ցույց տալ ավելին ({n} ևս)", less: "Ցույց տալ պակաս", srcK: "Ներմուծված գրառումներ (Kaikki)", srcU: "Ներմուծված ձևեր (UniMorph)", newTab: "(բացվում է նոր ներդիրում)" },
            ka: { title: "წყაროებით დამატებული მასალა", ready: "იმპორტირებული ლექსიკა მზადაა", noMatch: "იმპორტირებული დამთხვევა ვერ მოიძებნა.", more: "მეტის ჩვენება (კიდევ {n})", less: "ნაკლების ჩვენება", srcK: "იმპორტირებული ჩანაწერები (Kaikki)", srcU: "იმპორტირებული ფორმები (UniMorph)", newTab: "(იხსნება ახალ ჩანართში)" },
            tt: { title: "Чыганаклы өстәмәләр", ready: "Импортланган лексика әзер", noMatch: "Импортланган туры килү юк.", more: "Күбрәк күрсәтү ({n} тагын)", less: "Азрак күрсәтү", srcK: "Импортланган язмалар (Kaikki)", srcU: "Импортланган формалар (UniMorph)", newTab: "(яңа биттә ачыла)" },
            ba: { title: "Сығанаҡлы өҫтәмәләр", ready: "Импортланған лексика әҙер", noMatch: "Импортланған тап килеү юҡ.", more: "Күберәк күрһәтеү ({n} тағы)", less: "Әҙерәк күрһәтеү", srcK: "Импортланған яҙмалар (Kaikki)", srcU: "Импортланған формалар (UniMorph)", newTab: "(яңы биттә асыла)" },
            cv: { title: "Çăлкуçлă хушмăсем", ready: "Импорт турăннă лексика хатĕр", noMatch: "Импорт турăннă килĕшӳ çук.", more: "Ытларах кăтартас ({n} татах)", less: "Сахалрах кăтартас", srcK: "Импорт турăннă статьясем (Kaikki)", srcU: "Импорт турăннă формăсем (UniMorph)", newTab: "(çĕнĕ вкладкăра уçăлать)" },
            br: { title: "Ouzhpennadoù gant mammennoù", ready: "Geriaoueg enporzhiet prest", noMatch: "Klotadenn enporzhiet ebet.", more: "Diskouez muioc'h ({n} c'hoazh)", less: "Diskouez nebeutoc'h", srcK: "Enankadoù enporzhiet (Kaikki)", srcU: "Stummoù enporzhiet (UniMorph)", newTab: "(digor en un ivinell nevez)" },
        };
        const t = SUPP_I18N[lang] || SUPP_I18N.en;
        const esc = v => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        const SR_ONLY = 'position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;';

        const panel = document.createElement('section');
        panel.id = 'supplemental-lexicon-panel';
        panel.style.display = 'none';
        panel.setAttribute('aria-live', 'polite');
        panel.setAttribute('aria-labelledby', 'supplemental-lexicon-title');
        panel.innerHTML = '<h2 id="supplemental-lexicon-title">' + esc(t.title) + '</h2><p class="supplemental-status">' + esc(t.ready) + '</p><div class="supplemental-results"></div>';
        input.closest('main')?.appendChild(panel);

        const resultsContainer = panel.querySelector('.supplemental-results');
        let currentSearchRequestId = 0;

        async function renderResults(query) {
            const requestId = ++currentSearchRequestId;

            if (!query.trim()) {
                panel.style.display = 'none';
                resultsContainer.innerHTML = '';
                return;
            }
            panel.style.display = 'block';

            try {
                const matches = await window.COSYSupplementalLexicon.searchUnits(lang, query);
                if (requestId !== currentSearchRequestId) {
                    // Stale query response ignored due to newer search input
                    return;
                }

                // Item 3 filtering & formatting logic:
                // 1. Group matches by source
                // 2. Hide rows with POS "OTHER" whose forms are unrelated to headword
                // 3. Deduplicate forms and group by tag
                // 4. Limit to 12 forms per row with "Show more" control
                // 5. Title block "Imported forms (UniMorph)" / "Imported entries (Kaikki)" with source_url link

                const filtered = matches.filter(unit => {
                    if (unit.pos === 'OTHER') {
                        // Check if forms are unrelated to headword
                        const hw = (unit.lemma || '').toLowerCase();
                        const hasRelatedForm = (unit.forms || []).some(f => {
                            const str = (typeof f === 'string' ? f : f.form || '').toLowerCase();
                            return str.includes(hw) || hw.includes(str);
                        });
                        if (!hasRelatedForm) {
                            return false; // Hide unrelated OTHER POS row
                        }
                    }
                    return true;
                }).slice(0, 12);

                if (!filtered.length) {
                    resultsContainer.innerHTML = '<p class="supplemental-empty">' + esc(t.noMatch) + '</p>';
                    return;
                }

                resultsContainer.innerHTML = filtered.map((unit, unitIdx) => {
                    const sourceName = unit.source === 'Kaikki/Wiktionary' || (unit.source_url && unit.source_url.includes('kaikki'))
                        ? t.srcK
                        : t.srcU;

                    const sourceUrl = unit.source_url || '#';
                    const linkHtml = sourceUrl !== '#' ? `<a href="${esc(sourceUrl)}" target="_blank" rel="noopener">${esc(sourceName)}<span style="${SR_ONLY}"> ${esc(t.newTab)}</span></a>` : esc(sourceName);

                    // Deduplicate forms and group by tag
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

                        const renderItem = item => `<li><small class="tag-label">${esc(item.tag)}:</small> <span>${esc(item.forms)}</span></li>`;

                        formsDisplayHtml = `<ul class="supplemental-forms-list">${visibleItems.map(renderItem).join('')}</ul>`;

                        if (hiddenItems.length > 0) {
                            const hiddenListId = `supp-hidden-${unitIdx}`;
                            formsDisplayHtml += `
                                <ul id="${hiddenListId}" class="supplemental-forms-list hidden-forms" style="display:none;">
                                    ${hiddenItems.map(renderItem).join('')}
                                </ul>
                                <button type="button" class="show-more-btn" aria-expanded="false" aria-controls="${hiddenListId}" data-more="${esc(t.more.replace('{n}', hiddenItems.length))}" data-less="${esc(t.less)}" onclick="(function (b) { var el = document.getElementById(b.getAttribute('aria-controls')); var open = el.style.display === 'none'; el.style.display = open ? 'block' : 'none'; b.setAttribute('aria-expanded', open ? 'true' : 'false'); b.textContent = open ? b.dataset.less : b.dataset.more; })(this)">${esc(t.more.replace('{n}', hiddenItems.length))}</button>
                            `;
                        }
                    } else {
                        formsDisplayHtml = `<span>${unit.definition || unit.pos || ''}</span>`;
                    }

                    return `
                        <article class="supplemental-result">
                            <div class="supplemental-header">
                                <strong>${esc(unit.lemma)}</strong>
                                <span class="supplemental-source-title">${linkHtml}</span>
                            </div>
                            <div class="supplemental-body">
                                ${formsDisplayHtml}
                            </div>
                        </article>
                    `;
                }).join('');

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
