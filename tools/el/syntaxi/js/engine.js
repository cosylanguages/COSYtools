/**
 * COSYlanguages Standalone App — Greek Verbs Syntax Engine (el-syntaxi)
 * Provides offline search, case government (Accusative / Genitive), prepositions,
 * English-contrast rules, cross-reference links to el-genos-ptoseis nouns dataset.
 */

class GreekSyntaxiEngine {
    constructor() {
        this.verbDb = {};
        this.nounDb = {};
        this.verbKeys = [];
        this.filteredKeys = [];
        this.activeFilter = 'all';
        this.currentIndex = -1;
        this.appMode = 'lookup';
        this.gameScore = 0;
        this.gameStreak = 0;
        this.currentQuestion = null;

        this.init();
    }

    async init() {
        try {
            const [verbsRes, nounsRes] = await Promise.all([
                fetch('data/verbs.json'),
                fetch('../el-genos-ptoseis/data/nouns.json').catch(() => null)
            ]);

            this.verbDb = await verbsRes.json();
            if (nounsRes && nounsRes.ok) {
                this.nounDb = await nounsRes.json();
            }

            this.verbKeys = Object.keys(this.verbDb);
            this.filteredKeys = [...this.verbKeys];

            this.bindEvents();
            this.updateFilteredKeys();
        } catch (err) {
            console.error("Failed to load Greek syntax database:", err);
        }
    }

    setAppMode(mode) {
        this.appMode = mode;
        const container = document.getElementById('lookup-view-container');
        if (container) container.style.display = 'block';
    }

    setFilter(filterType) {
        this.activeFilter = filterType;

        ['all', 'acc-direct', 'prep-acc', 'genitive'].forEach(f => {
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
        if (this.activeFilter === 'acc-direct') {
            this.filteredKeys = this.verbKeys.filter(k => {
                const gov = this.verbDb[k].government || [];
                return gov.some(g => g.case === 'accusative' && !g.preposition);
            });
        } else if (this.activeFilter === 'prep-acc') {
            this.filteredKeys = this.verbKeys.filter(k => {
                const gov = this.verbDb[k].government || [];
                return gov.some(g => g.case === 'accusative' && g.preposition);
            });
        } else if (this.activeFilter === 'genitive') {
            this.filteredKeys = this.verbKeys.filter(k => {
                const gov = this.verbDb[k].government || [];
                return gov.some(g => g.case === 'genitive');
            });
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
                    utterance.lang = 'el-GR';
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
                const govText = (data.government || []).map(g => g.preposition ? `${g.preposition} + ${g.case}` : g.case).join(', ');
                return `
                <div class="suggestion-item" onclick="appEngine.selectSuggestion('${key}')">
                    <span><strong>${key}</strong></span>
                    <span style="color: var(--sage-primary); font-size: 0.85rem; font-weight: 600;">${govText}</span>
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
                government: [{ case: "accusative", preposition: null }],
                pattern: `${cleanQuery} + αιτιατική`,
                level: "A2",
                definition: `Σύνταξη του ρήματος '${cleanQuery}'.`,
                grammar_rule: `English '${cleanQuery}'. Ensure correct Greek case object usage.`,
                examples: [
                    `Χρησιμοποιούμε το ρήμα ${cleanQuery} στην πρόταση.`,
                    `Πρέπει να προσέχουμε τη σύνταξη του ρήματος ${cleanQuery}.`
                ],
                common_mistake: `⚠️ Ελέγξτε την πτώση και την πρόθεση για το ρήμα '${cleanQuery}'.`,
                synonyms: [],
                antonyms: [],
                linked_noun_keys: []
            };
            this.renderVerbResult(cleanQuery, fallbackData);
        }
    }

    renderVerbResult(verbKey, data) {
        document.getElementById('empty-state').style.display = 'none';
        const resultCard = document.getElementById('verb-result-container');
        resultCard.style.display = 'block';

        document.getElementById('verb-title').textContent = verbKey;

        // Government Badge
        const govBadge = document.getElementById('gov-badge');
        const govStrings = (data.government || []).map(g => {
            const caseGreek = g.case === 'genitive' ? 'Γενική' : 'Αιτιατική';
            return g.preposition ? `${g.preposition} + ${caseGreek}` : `${caseGreek} (χωρίς πρόθεση)`;
        });
        govBadge.textContent = govStrings.join(' / ');

        // CEFR Level
        document.getElementById('verb-cefr-badge').textContent = `Επίπεδο: ${data.level || 'A1'}`;

        // Lexical details
        document.getElementById('verb-definition').textContent = data.definition || '';
        document.getElementById('verb-pattern-text').textContent = data.pattern || verbKey;

        // Noun Parallel & Linked Noun Keys
        const nounParallelBox = document.getElementById('noun-parallel-container');
        const nounParallelText = document.getElementById('noun-parallel-text');
        let contrastHtml = '';

        if (data.noun_parallel) {
            contrastHtml += `<div>${data.noun_parallel}</div>`;
        }

        if (data.linked_noun_keys && data.linked_noun_keys.length > 0) {
            contrastHtml += `<div style="margin-top: 0.5rem; display: flex; gap: 0.4rem; flex-wrap: wrap; align-items: center;">`;
            contrastHtml += `<span style="font-size: 0.85rem; font-weight: 700; color: var(--ink-muted);">Συνδεδεμένα ουσιαστικά:</span>`;
            data.linked_noun_keys.forEach(nounKey => {
                contrastHtml += `<span class="xref-chip" style="cursor: default;">📦 ${nounKey}</span>`;
            });
            contrastHtml += `</div>`;
        }

        if (contrastHtml) {
            nounParallelText.innerHTML = contrastHtml;
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

    setAppMode(mode) {
        this.appMode = mode;
        const lookupView = document.getElementById('lookup-view-container');
        const practiceView = document.getElementById('practice-view-container');
        const lookupBtn = document.getElementById('nav-lookup-btn');
        const practiceBtn = document.getElementById('nav-practice-btn');

        if (mode === 'practice') {
            lookupView.style.display = 'none';
            practiceView.style.display = 'block';
            if (lookupBtn) lookupBtn.className = 'nav-mode-btn';
            if (practiceBtn) practiceBtn.className = 'nav-mode-btn active';
            this.nextPracticeQuestion();
        } else {
            lookupView.style.display = 'block';
            practiceView.style.display = 'none';
            if (lookupBtn) lookupBtn.className = 'nav-mode-btn active';
            if (practiceBtn) practiceBtn.className = 'nav-mode-btn';
        }
    }

    formatGovPattern(data) {
        if (!data || !data.government) return '';
        const govStrings = data.government.map(g => {
            const caseGreek = g.case === 'genitive' ? 'Γενική' : 'Αιτιατική';
            return g.preposition ? `${g.preposition} + ${caseGreek}` : `${caseGreek} (χωρίς πρόθεση)`;
        });
        return govStrings.join(' / ');
    }

    nextPracticeQuestion() {
        if (this.verbKeys.length === 0) return;

        const targetVerb = this.verbKeys[Math.floor(Math.random() * this.verbKeys.length)];
        const verbData = this.verbDb[targetVerb];
        const correctGov = this.formatGovPattern(verbData);

        const allPatterns = [];
        for (const k of this.verbKeys) {
            const pat = this.formatGovPattern(this.verbDb[k]);
            if (pat && pat !== correctGov && !allPatterns.includes(pat)) {
                allPatterns.push(pat);
            }
        }

        allPatterns.sort(() => 0.5 - Math.random());
        const distractors = allPatterns.slice(0, 3);
        const choices = [correctGov, ...distractors].sort(() => 0.5 - Math.random());

        this.currentQuestion = {
            verb: targetVerb,
            expected: correctGov,
            data: verbData
        };

        document.getElementById('game-verb-prompt').textContent = targetVerb;
        document.getElementById('game-cefr-badge').textContent = `Επίπεδο: ${verbData.level || 'A1'}`;
        document.getElementById('game-def-prompt').textContent = verbData.definition || '';

        const mcGroup = document.getElementById('game-mc-options');
        mcGroup.innerHTML = choices.map(choice => `
            <button class="choice-btn" onclick="appEngine.checkPracticeAnswer('${choice.replace(/'/g, "\\'")}')">${choice}</button>
        `).join('');

        document.getElementById('game-feedback-box').style.display = 'none';
        document.getElementById('game-next-btn').style.display = 'none';
    }

    checkPracticeAnswer(selected) {
        if (!this.currentQuestion) return;

        const isCorrect = selected === this.currentQuestion.expected;
        const feedbackBox = document.getElementById('game-feedback-box');
        feedbackBox.style.display = 'block';

        if (isCorrect) {
            this.gameScore += 10;
            this.gameStreak += 1;
            feedbackBox.className = 'feedback-card correct';
            feedbackBox.innerHTML = `✅ Σωστά! Το ρήμα <strong>${this.currentQuestion.verb}</strong> συντάσσεται με: <strong>${selected}</strong>. (+10 pti).`;
        } else {
            this.gameStreak = 0;
            feedbackBox.className = 'feedback-card wrong';
            feedbackBox.innerHTML = `❌ Λάθος! Η σωστή σύνταξη για το ρήμα <strong>${this.currentQuestion.verb}</strong> είναι: <strong>${this.currentQuestion.expected}</strong>.<br><small style="margin-top:4px; display:block;">📌 Κανόνας: ${this.currentQuestion.data.grammar_rule || ''}</small>`;
        }

        document.getElementById('game-score').textContent = this.gameScore;
        document.getElementById('game-streak').textContent = this.gameStreak;
        document.getElementById('game-next-btn').style.display = 'block';
    }
}

let appEngine;
document.addEventListener('DOMContentLoaded', () => {
    appEngine = new GreekSyntaxiEngine();
});
