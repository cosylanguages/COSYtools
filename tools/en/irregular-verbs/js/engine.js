/**
 * COSYlanguages Standalone App — English Irregular Verbs Engine (en-irregular-verbs)
 * Provides offline verb lookup, principal parts (Base, Past Simple, Past Participle, 3rd Person),
 * pedagogical pattern grouping, spaced-repetition practice modes & dashboard.
 */

class EnglishIrregularVerbsEngine {
    constructor() {
        this.verbDb = {};
        this.verbKeys = [];
        this.filteredKeys = [];
        this.appMode = 'practice'; // 'practice' | 'lookup' | 'dashboard'
        this.activePatternFilter = 'all';
        this.activeLevelFilter = 'all';
        this.currentIndex = -1;

        this.srsStore = null;
        this.practice = null;
        this.dashboard = null;

        this.init();
    }

    async init() {
        try {
            const res = await fetch('data/verbs.json');
            this.verbDb = await res.json();
            this.verbKeys = Object.keys(this.verbDb);
            this.filteredKeys = [...this.verbKeys];

            this.srsStore = new SpacedRepetitionStore();
            this.practice = new PracticeManager(this, this.srsStore);
            this.dashboard = new DashboardManager(this, this.srsStore);

            this.bindEvents();
            this.setAppMode('practice');
        } catch (err) {
            console.error("Failed to load irregular verbs database:", err);
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
        const lvl = levelSelect ? levelSelect.value : 'all';

        if (this.practice) {
            this.practice.startSession(lvl);
        }
    }

    onPracticeFilterChange() {
        this.startNewPracticeSession();
    }

    getFormPattern(verb) {
        const forms = [verb.base, verb.past_simple, verb.past_participle].map(form => form.toLowerCase().split('/')[0]);
        const [base, past, participle] = forms;

        if (base === past && past === participle) return { key: 'aaa', label: 'A-A-A (cut-cut-cut)' };
        if (base === participle) return { key: 'aba', label: 'A-B-A (come-came-come)' };
        if (past === participle) return { key: 'abb', label: 'A-B-B (buy-bought-bought)' };
        return { key: 'abc', label: 'A-B-C (go-went-gone)' };
    }

    getRhymeFamily(verb) {
        const families = {
            sing: 'i-a-u family (sing/ring/drink)',
            ring: 'i-a-u family (sing/ring/drink)',
            drink: 'i-a-u family (sing/ring/drink)',
            feel: 'feel/felt family (feel/keep/sleep/sweep)',
            keep: 'feel/felt family (feel/keep/sleep/sweep)',
            sleep: 'feel/felt family (feel/keep/sleep/sweep)',
            sweep: 'feel/felt family (feel/keep/sleep/sweep)'
        };
        return families[verb.base] || '';
    }

    setPatternFilter(filterType) {
        this.activePatternFilter = filterType;

        ['all', 'no_change', 'vowel_change', 'same_past_participle', 'totally_irregular', 'add_en_or_n'].forEach(f => {
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
        this.filteredKeys = this.verbKeys.filter(key => {
            const verb = this.verbDb[key];
            const matchPattern = (this.activePatternFilter === 'all' || verb.pattern_group === this.activePatternFilter);
            const matchLevel = (this.activeLevelFilter === 'all' || verb.level === this.activeLevelFilter);
            return matchPattern && matchLevel;
        });
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
        const matches = pool.filter(key => {
            const verb = this.verbDb[key];
            return key.toLowerCase().includes(cleanQuery) ||
                   verb.past_simple.toLowerCase().includes(cleanQuery) ||
                   verb.past_participle.toLowerCase().includes(cleanQuery);
        });

        if (matches.length > 0 && suggestionsBox) {
            suggestionsBox.innerHTML = matches.slice(0, 8).map(key => {
                const data = this.verbDb[key];
                return `
                <div class="suggestion-item" onclick="appEngine.selectSuggestion('${key}')">
                    <span><strong>${key}</strong> <small style="color: var(--ink-muted);">(${data.past_simple} / ${data.past_participle})</small></span>
                    <span class="badge cefr-badge">${data.level}</span>
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
            matchedKey = this.verbKeys.find(k => {
                const verb = this.verbDb[k];
                return k.toLowerCase().startsWith(cleanQuery) ||
                       verb.past_simple.toLowerCase() === cleanQuery ||
                       verb.past_participle.toLowerCase() === cleanQuery;
            });
        }

        if (matchedKey) {
            const pool = this.filteredKeys.length > 0 ? this.filteredKeys : this.verbKeys;
            this.currentIndex = pool.indexOf(matchedKey);
            this.renderVerbResult(matchedKey, this.verbDb[matchedKey]);
        } else {
            this.currentIndex = -1;
            const fallbackData = {
                base: cleanQuery,
                past_simple: `${cleanQuery}ed`,
                past_participle: `${cleanQuery}ed`,
                third_person_singular: `${cleanQuery}s`,
                pattern_group: "regular_fallback",
                level: "A2",
                definition: `Action or verb '${cleanQuery}'.`,
                examples: [
                    `She ${cleanQuery}s regularly.`,
                    `He ${cleanQuery}ed yesterday.`,
                    `They have ${cleanQuery}ed before.`
                ]
            };
            this.renderVerbResult(cleanQuery, fallbackData);
        }
    }

    renderVerbResult(verbKey, data) {
        document.getElementById('empty-state').style.display = 'none';
        const resultCard = document.getElementById('verb-result-container');
        resultCard.style.display = 'block';

        document.getElementById('verb-title').textContent = data.base || verbKey;

        // Forms matrix
        document.getElementById('form-base-val').textContent = data.base || verbKey;
        document.getElementById('form-v2-val').textContent = data.past_simple || '-';
        document.getElementById('form-v3-val').textContent = data.past_participle || '-';
        document.getElementById('form-3rd-val').textContent = data.third_person_singular || '-';

        // Pattern Group
        const patternLabels = {
            "no_change": "No Change (cut-cut-cut)",
            "vowel_change": "Vowel Change (sing-sang-sung)",
            "same_past_participle": "Same Past Participle (buy-bought-bought)",
            "totally_irregular": "Totally Irregular (go-went-gone)",
            "add_en_or_n": "Add -en / -n (speak-spoke-spoken)"
        };

        const patternBadge = document.getElementById('verb-pattern-badge');
        if (patternBadge) {
            const groupLabel = patternLabels[data.pattern_group] || data.pattern_group;
            const formPattern = this.getFormPattern(data);
            const rhymeFamily = this.getRhymeFamily(data);
            patternBadge.textContent = `${groupLabel} · ${formPattern.label}${rhymeFamily ? ` · ${rhymeFamily}` : ''}`;
        }

        // CEFR Level
        document.getElementById('verb-cefr-badge').textContent = `Level: ${data.level || 'A2'}`;

        // Definition
        document.getElementById('verb-definition').textContent = data.definition || 'Definition unavailable.';

        // Example sentences
        const examplesList = document.getElementById('examples-list');
        if (data.examples && data.examples.length > 0) {
            examplesList.innerHTML = data.examples.map(ex => `<li>${ex}</li>`).join('');
            document.getElementById('examples-container').style.display = 'block';
        } else {
            document.getElementById('examples-container').style.display = 'none';
        }
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
    appEngine = new EnglishIrregularVerbsEngine();
});
