/**
 * COSYlanguages Standalone App — English Prepositions Engine (en-verb-prep)
 * Provides offline search, transitivity rules, dependent prepositions, phrasal verbs,
 * nouns, adjectives, cross-reference navigation, spaced-repetition practice mode & dashboard.
 */

class EnglishVerbPrepEngine {
    constructor() {
        this.dbMap = { verbs: {}, nouns: {}, adjectives: {} };
        this.currentWordType = 'verbs'; // 'verbs' | 'nouns' | 'adjectives'
        this.appMode = 'practice'; // 'practice' | 'lookup' | 'dashboard'
        this.verbDb = {};
        this.verbKeys = [];
        this.filteredKeys = [];
        this.activeFilter = 'all';
        this.currentIndex = -1;

        this.srsStore = null;
        this.practice = null;
        this.dashboard = null;

        this.init();
    }

    async init() {
        try {
            const [verbsRes, nounsRes, adjRes] = await Promise.all([
                fetch('data/verbs.json'),
                fetch('data/nouns.json'),
                fetch('data/adjectives.json')
            ]);

            this.dbMap.verbs = await verbsRes.json();
            this.dbMap.nouns = await nounsRes.json();
            this.dbMap.adjectives = await adjRes.json();

            this.srsStore = new SpacedRepetitionStore();
            this.practice = new PracticeManager(this, this.srsStore);
            this.dashboard = new DashboardManager(this, this.srsStore);

            this.setWordType('verbs');
            this.bindEvents();
            this.setAppMode('practice');
        } catch (err) {
            console.error("Failed to load prepositions database:", err);
        }
    }

    setAppMode(mode) {
        this.appMode = mode;

        ['practice', 'lookup', 'dashboard'].forEach(m => {
            const btn = document.getElementById(`nav-${m}-btn`);
            const container = document.getElementById(`${m}-view-container`);
            if (btn) {
                if (m === mode) btn.classList.add('active');
                else btn.classList.remove('active');
            }
            if (container) {
                container.style.display = (m === mode) ? 'block' : 'none';
            }
        });

        if (mode === 'practice') {
            this.updateStreakWidget();
            if (!this.practice.currentSession || this.practice.currentSession.length === 0) {
                this.startNewPracticeSession();
            }
        } else if (mode === 'dashboard') {
            if (this.dashboard) this.dashboard.renderDashboard();
        }
    }

    updateStreakWidget() {
        if (!this.srsStore) return;
        const streakInfo = this.srsStore.getStreakInfo();
        const streakEl = document.getElementById('practice-streak-count');
        const goalEl = document.getElementById('practice-goal-sub');

        if (streakEl) streakEl.textContent = streakInfo.streakDays;
        if (goalEl) goalEl.textContent = `Goal: ${streakInfo.todayCount} / ${streakInfo.goal} sessions today`;
    }

    startNewPracticeSession() {
        const levelSelect = document.getElementById('practice-level-select');
        const typeSelect = document.getElementById('practice-type-select');

        const lvl = levelSelect ? levelSelect.value : 'all';
        const type = typeSelect ? typeSelect.value : 'all';

        if (this.practice) {
            this.practice.startSession(lvl, type);
        }
    }

    onPracticeFilterChange() {
        this.startNewPracticeSession();
    }

    setWordType(wordType) {
        if (!this.dbMap[wordType]) return;
        this.currentWordType = wordType;

        // Update tab button styling
        ['verbs', 'nouns', 'adjectives'].forEach(wt => {
            const tabBtn = document.getElementById(`tab-${wt}`);
            if (tabBtn) {
                if (wt === wordType) tabBtn.classList.add('active');
                else tabBtn.classList.remove('active');
            }
        });

        // Update current DB reference and keys
        this.verbDb = this.dbMap[this.currentWordType];
        this.verbKeys = Object.keys(this.verbDb);

        // Update filter pills bar based on word type
        const filterBar = document.getElementById('filter-pills-bar');
        if (filterBar) {
            if (wordType === 'verbs') {
                filterBar.innerHTML = `
                    <button class="filter-pill active" id="filter-all" onclick="appEngine.setFilter('all')">All Verbs</button>
                    <button class="filter-pill" id="filter-prep" onclick="appEngine.setFilter('prep')">Verb Prepositions</button>
                    <button class="filter-pill" id="filter-phrasal" onclick="appEngine.setFilter('phrasal')">Phrasal Verbs 🧩</button>
                    <button class="filter-pill" id="filter-double" onclick="appEngine.setFilter('double')">Double Prepositions 🔗</button>
                `;
            } else if (wordType === 'nouns') {
                filterBar.innerHTML = `
                    <button class="filter-pill active" id="filter-all" onclick="appEngine.setFilter('all')">All Nouns</button>
                `;
            } else if (wordType === 'adjectives') {
                filterBar.innerHTML = `
                    <button class="filter-pill active" id="filter-all" onclick="appEngine.setFilter('all')">All Adjectives</button>
                `;
            }
        }

        // Reset filter state
        this.activeFilter = 'all';
        this.updateFilteredKeys();

        // Update search input placeholder
        const input = document.getElementById('verb-search-input');
        if (input) {
            if (wordType === 'verbs') input.placeholder = "Search a verb (e.g. influence, affect, depend, answer, turn down, give up)...";
            else if (wordType === 'nouns') input.placeholder = "Search a noun (e.g. reason for, interest in, visit to, effect on, lack of)...";
            else if (wordType === 'adjectives') input.placeholder = "Search an adjective (e.g. good at, interested in, proud of, responsible for, dependent on)...";

            if (input.value.trim()) {
                this.handleSearchInput(input.value);
            } else {
                this.resetDisplay();
            }
        }
    }

    setFilter(filterType) {
        this.activeFilter = filterType;

        ['all', 'prep', 'phrasal', 'double'].forEach(f => {
            const btn = document.getElementById(`filter-${f}`);
            if (btn) {
                if (f === filterType) btn.classList.add('active');
                else btn.classList.remove('active');
            }
        });

        this.updateFilteredKeys();

        const input = document.getElementById('verb-search-input');
        if (input && input.value.trim()) {
            this.handleSearchInput(input.value);
        }
    }

    updateFilteredKeys() {
        if (this.currentWordType === 'verbs') {
            if (this.activeFilter === 'phrasal') {
                this.filteredKeys = this.verbKeys.filter(k => this.verbDb[k].is_phrasal);
            } else if (this.activeFilter === 'prep') {
                this.filteredKeys = this.verbKeys.filter(k => !this.verbDb[k].is_phrasal);
            } else if (this.activeFilter === 'double') {
                this.filteredKeys = this.verbKeys.filter(k => this.verbDb[k].preposition_structure === 'double_phrasal');
            } else {
                this.filteredKeys = [...this.verbKeys];
            }
        } else {
            this.filteredKeys = [...this.verbKeys];
        }
    }

    bindEvents() {
        const input = document.getElementById('verb-search-input');
        const clearBtn = document.getElementById('clear-search-btn');
        const ttsBtn = document.getElementById('speak-verb-btn');

        if (input) {
            input.addEventListener('input', (e) => this.handleSearchInput(e.target.value));
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.searchVerb(input.value);
                    this.hideSuggestions();
                }
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (input) input.value = '';
                clearBtn.style.display = 'none';
                this.resetDisplay();
            });
        }

        if (ttsBtn) {
            ttsBtn.addEventListener('click', () => {
                const verbText = document.getElementById('verb-title').textContent;
                if (verbText && 'speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance(verbText);
                    utterance.lang = 'en-US';
                    window.speechSynthesis.speak(utterance);
                }
            });
        }
    }

    handleSearchInput(query) {
        const clearBtn = document.getElementById('clear-search-btn');
        const suggestionsBox = document.getElementById('search-suggestions');
        const cleanQuery = query.trim().toLowerCase();

        if (clearBtn) {
            clearBtn.style.display = cleanQuery ? 'block' : 'none';
        }

        if (!cleanQuery) {
            this.hideSuggestions();
            return;
        }

        const pool = this.filteredKeys.length > 0 ? this.filteredKeys : this.verbKeys;
        const matches = pool.filter(key => key.toLowerCase().includes(cleanQuery));

        if (matches.length > 0 && suggestionsBox) {
            suggestionsBox.innerHTML = matches.slice(0, 6).map(key => {
                const data = this.verbDb[key];
                let typeLabel = '';
                if (data.is_phrasal) {
                    typeLabel = 'Phrasal Verb';
                } else if (data.transitivity_code) {
                    typeLabel = `${data.transitivity} (${data.transitivity_code})`;
                } else if (data.word_type) {
                    typeLabel = data.word_type.toUpperCase();
                } else {
                    typeLabel = this.currentWordType.slice(0, -1).toUpperCase();
                }
                return `
                <div class="suggestion-item" onclick="appEngine.selectSuggestion('${key}')">
                    <span><strong>${key}</strong></span>
                    <span style="color: ${data.is_phrasal ? 'var(--purple-both)' : 'var(--ink-muted)'}; font-size: 0.85rem; font-weight: 600;">${typeLabel}</span>
                </div>
            `;
            }).join('');
            suggestionsBox.style.display = 'block';
        } else if (suggestionsBox) {
            this.hideSuggestions();
        }
    }

    selectSuggestion(verbKey) {
        const input = document.getElementById('verb-search-input');
        if (input) input.value = verbKey;
        this.hideSuggestions();
        this.searchVerb(verbKey);
    }

    hideSuggestions() {
        const suggestionsBox = document.getElementById('search-suggestions');
        if (suggestionsBox) suggestionsBox.style.display = 'none';
    }

    searchVerb(query) {
        if (!query) return;

        const cleanQuery = query.trim().toLowerCase();
        let matchedKey = this.verbKeys.find(k => k.toLowerCase() === cleanQuery);

        if (!matchedKey) {
            matchedKey = this.verbKeys.find(k => k.toLowerCase().startsWith(cleanQuery));
        }

        if (matchedKey) {
            const pool = this.filteredKeys.length > 0 ? this.filteredKeys : this.verbKeys;
            this.currentIndex = pool.indexOf(matchedKey);
            this.renderVerbResult(matchedKey, this.verbDb[matchedKey]);
        } else {
            this.currentIndex = -1;
            const fallbackData = {
                word_type: this.currentWordType.slice(0, -1),
                is_phrasal: cleanQuery.includes(' '),
                prepositions: ["none"],
                pattern: `${cleanQuery} [object]`,
                level: "A2",
                definition: `Action or concept of '${cleanQuery}'.`,
                grammar_rule: `English '${cleanQuery}'. Ensure correct preposition and object usage.`,
                examples: [
                    `She always tries to use ${cleanQuery} accurately.`,
                    `They examined ${cleanQuery} carefully.`
                ],
                common_mistake: `⚠️ Check whether '${cleanQuery}' requires a dependent preposition.`,
                synonyms: [],
                antonyms: []
            };
            this.renderVerbResult(cleanQuery, fallbackData);
        }
    }

    renderVerbResult(verbKey, data) {
        document.getElementById('empty-state').style.display = 'none';
        const resultCard = document.getElementById('verb-result-container');
        resultCard.style.display = 'block';

        document.getElementById('verb-title').textContent = verbKey;

        // Phrasal Verb / Word Type Badge
        const phrasalBadge = document.getElementById('phrasal-badge');
        if (data.is_phrasal) {
            phrasalBadge.style.display = 'inline-block';
            phrasalBadge.textContent = 'Phrasal Verb 🧩';
        } else if (data.word_type && data.word_type !== 'verb') {
            phrasalBadge.style.display = 'inline-block';
            phrasalBadge.textContent = data.word_type === 'noun' ? 'Noun 📦' : 'Adjective 🎨';
        } else {
            phrasalBadge.style.display = 'none';
        }

        // Separability Badge
        const sepBadge = document.getElementById('separability-badge');
        if (data.is_phrasal && data.separability) {
            sepBadge.style.display = 'inline-block';
            sepBadge.textContent = data.separability;
        } else {
            sepBadge.style.display = 'none';
        }

        // Transitivity Badge
        const transBadge = document.getElementById('transitivity-badge');
        if (data.transitivity_code) {
            transBadge.style.display = 'inline-block';
            transBadge.textContent = `${data.transitivity} (${data.transitivity_code})`;
            if (data.transitivity_code === 'VT') {
                transBadge.className = 'badge trans-vt';
            } else if (data.transitivity_code === 'VI') {
                transBadge.className = 'badge trans-vi';
            } else {
                transBadge.className = 'badge trans-both';
            }
        } else {
            transBadge.style.display = 'none';
        }

        // Preposition / Particle Badge
        const prepBadge = document.getElementById('prep-badge');
        const prepList = (data.prepositions || []).join(' / ');
        prepBadge.textContent = prepList === 'none' ? 'No preposition (Direct Object)' : (data.is_phrasal ? `Particle: ${prepList}` : `Prep: ${prepList}`);

        // CEFR Level
        document.getElementById('verb-cefr-badge').textContent = `Level: ${data.level || 'A2'}`;

        // Lexical details
        document.getElementById('verb-definition').textContent = data.definition || 'Definition unavailable.';
        document.getElementById('verb-pattern-text').textContent = data.pattern || verbKey;

        // Noun Parallel or Related Forms Box
        const nounParallelBox = document.getElementById('noun-parallel-container');
        const nounParallelText = document.getElementById('noun-parallel-text');
        const contrastContent = data.related_forms || data.noun_parallel;

        if (contrastContent) {
            const crossRefs = this.extractCrossReferences(contrastContent, this.currentWordType);
            let html = `<div>${contrastContent}</div>`;
            if (crossRefs.length > 0) {
                html += `<div style="margin-top: 0.5rem; display: flex; gap: 0.4rem; flex-wrap: wrap;">`;
                crossRefs.forEach(ref => {
                    html += `<button class="xref-chip" onclick="appEngine.navigateToCrossReference('${ref.type}', '${ref.key.replace(/'/g, "\\'")}')">${ref.label}</button>`;
                });
                html += `</div>`;
            }
            nounParallelText.innerHTML = html;
            nounParallelBox.style.display = 'block';
        } else {
            nounParallelBox.style.display = 'none';
        }

        document.getElementById('grammar-rule-text').textContent = data.grammar_rule || '';

        // Mistake box
        const mistakeBox = document.getElementById('mistake-container');
        const mistakeEl = document.getElementById('mistake-text');
        if (data.common_mistake) {
            mistakeEl.textContent = data.common_mistake;
            mistakeBox.style.display = 'block';
        } else {
            mistakeBox.style.display = 'none';
        }

        // Example sentences
        const examplesList = document.getElementById('examples-list');
        if (data.examples && data.examples.length > 0) {
            examplesList.innerHTML = data.examples.map(ex => `<li>${ex}</li>`).join('');
            document.getElementById('examples-container').style.display = 'block';
        } else {
            document.getElementById('examples-container').style.display = 'none';
        }

        // Synonyms & Antonyms
        const antonymsBox = document.getElementById('antonyms-pills');
        const items = [...(data.synonyms || []).map(s => `≈ ${s}`), ...(data.antonyms || []).map(a => `↔ ${a}`)];
        if (items.length > 0) {
            antonymsBox.innerHTML = items.map(item => `<span class="antonym-pill">${item}</span>`).join('');
            document.getElementById('antonyms-container').style.display = 'block';
        } else {
            document.getElementById('antonyms-container').style.display = 'none';
        }
    }

    extractCrossReferences(text, currentType) {
        if (!text) return [];
        const refs = [];
        const targetTypes = ['verbs', 'nouns', 'adjectives'].filter(t => t !== currentType);

        const quotedMatches = text.match(/'([^']+)'/g) || [];
        const candidates = quotedMatches.map(m => m.slice(1, -1).trim());

        targetTypes.forEach(type => {
            const db = this.dbMap[type] || {};
            const dbKeys = Object.keys(db);

            candidates.forEach(cand => {
                let matchedKey = dbKeys.find(k => k.toLowerCase() === cand.toLowerCase());
                if (!matchedKey) {
                    matchedKey = dbKeys.find(k => cand.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(cand.toLowerCase()));
                }
                if (matchedKey && !refs.some(r => r.type === type && r.key === matchedKey)) {
                    let labelType = type === 'verbs' ? 'Verb' : (type === 'nouns' ? 'Noun' : 'Adjective');
                    refs.push({ type, key: matchedKey, label: `➜ See ${labelType}: "${matchedKey}"` });
                }
            });
        });

        return refs;
    }

    navigateToCrossReference(targetType, targetKey) {
        this.setAppMode('lookup');
        this.setWordType(targetType);
        this.searchVerb(targetKey);
    }

    navigateNext() {
        const pool = this.filteredKeys.length > 0 ? this.filteredKeys : this.verbKeys;
        if (pool.length === 0) return;
        this.currentIndex = (this.currentIndex + 1) % pool.length;
        const key = pool[this.currentIndex];
        this.searchVerb(key);
    }

    navigatePrevious() {
        const pool = this.filteredKeys.length > 0 ? this.filteredKeys : this.verbKeys;
        if (pool.length === 0) return;
        this.currentIndex = (this.currentIndex - 1 + pool.length) % pool.length;
        const key = pool[this.currentIndex];
        this.searchVerb(key);
    }

    navigateRandom() {
        const pool = this.filteredKeys.length > 0 ? this.filteredKeys : this.verbKeys;
        if (pool.length === 0) return;
        let nextIdx = Math.floor(Math.random() * pool.length);
        if (nextIdx === this.currentIndex && pool.length > 1) {
            nextIdx = (nextIdx + 1) % pool.length;
        }
        this.currentIndex = nextIdx;
        const key = pool[this.currentIndex];
        this.searchVerb(key);
    }

    resetDisplay() {
        document.getElementById('verb-result-container').style.display = 'none';
        document.getElementById('empty-state').style.display = 'block';
    }
}

let appEngine;
document.addEventListener('DOMContentLoaded', () => {
    appEngine = new EnglishVerbPrepEngine();
});
