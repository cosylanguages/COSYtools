/**
 * COSYlanguages Standalone App — Régime prépositionnel français (fr-regime)
 * Provides offline search across French Verbs, Noms & Adjectifs with prepositional rules,
 * word-type switching, cross-reference chips & Spaced Repetition System (SRS) practice mode.
 */

class FrenchRegimeEngine {
    constructor() {
        this.datasets = {
            verbs: {},
            nouns: {},
            adjectives: {}
        };
        this.srs = new FrRegimeSrsManager();
        this.appMode = 'practice'; // 'practice' or 'dictionary'
        this.currentWordType = 'verbs';
        this.activeFilter = 'all';
        this.filteredKeys = [];
        this.currentIndex = -1;

        // SRS Session state
        this.sessionFilter = 'mixed';
        this.sessionItems = [];
        this.sessionIndex = 0;
        this.sessionScore = 0;
        this.sessionCorrectCount = 0;
        this.currentQuestion = null;

        this.init();
    }

    async init() {
        try {
            const [verbsRes, nounsRes, adjRes] = await Promise.all([
                fetch('data/verbs.json'),
                fetch('data/nouns.json'),
                fetch('data/adjectives.json')
            ]);

            this.datasets.verbs = await verbsRes.json();
            this.datasets.nouns = await nounsRes.json();
            this.datasets.adjectives = await adjRes.json();

            this.renderFilterPills();
            this.updateFilteredKeys();
            this.updateSrsStatsBar();
            this.bindEvents();
            this.setAppMode('practice');
        } catch (err) {
            console.error("Failed to load French regime datasets:", err);
        }
    }

    get activeDb() {
        return this.datasets[this.currentWordType] || {};
    }

    get activeKeys() {
        return Object.keys(this.activeDb);
    }

    setAppMode(mode) {
        this.appMode = mode;
        const practiceView = document.getElementById('practice-view-container');
        const dictionaryView = document.getElementById('dictionary-view-container');
        const pracBtn = document.getElementById('mode-practice-btn');
        const dictBtn = document.getElementById('mode-dictionary-btn');

        if (mode === 'practice') {
            practiceView.style.display = 'block';
            dictionaryView.style.display = 'none';
            if (pracBtn) pracBtn.className = 'mode-btn active';
            if (dictBtn) dictBtn.className = 'mode-btn';
            this.updateSrsStatsBar();
            this.resetSrsLauncher();
        } else {
            practiceView.style.display = 'none';
            dictionaryView.style.display = 'block';
            if (pracBtn) pracBtn.className = 'mode-btn';
            if (dictBtn) dictBtn.className = 'mode-btn active';
            this.resetDisplay();
        }
    }

    /* SRS Practice Session Management */
    updateSrsStatsBar() {
        const stats = this.srs.getDashboardStats(this.datasets);
        const streakEl = document.getElementById('srs-streak-count');
        const dailyText = document.getElementById('srs-daily-text');
        const ringProgress = document.getElementById('ring-progress');
        const weakCountEl = document.getElementById('weak-spot-count');

        if (streakEl) streakEl.textContent = stats.streak;
        if (dailyText) dailyText.textContent = `${stats.dailyCompletedToday}/${stats.dailyGoal}`;

        if (ringProgress) {
            const circumference = 113;
            const pct = Math.min(1, stats.dailyCompletedToday / stats.dailyGoal);
            const offset = circumference * (1 - pct);
            ringProgress.style.strokeDashoffset = offset;
        }

        const weakSpots = this.srs.getWeakSpots(this.datasets);
        if (weakCountEl) weakCountEl.textContent = weakSpots.length;
    }

    setSessionFilter(filter) {
        this.sessionFilter = filter;
        ['mixed', 'verbs', 'nouns', 'adjectives', 'weak'].forEach(f => {
            const pill = document.getElementById(`session-filter-${f}`);
            if (pill) {
                if (f === filter) pill.classList.add('active');
                else pill.classList.remove('active');
            }
        });
    }

    startSrsSession() {
        this.sessionItems = this.srs.getDailySessionItems(this.datasets, this.sessionFilter, 10);
        if (this.sessionItems.length === 0) {
            alert("Aucun mot à réviser dans cette catégorie !");
            return;
        }

        this.sessionIndex = 0;
        this.sessionScore = 0;
        this.sessionCorrectCount = 0;

        document.getElementById('session-launcher-card').style.display = 'none';
        document.getElementById('srs-summary-card').style.display = 'none';
        document.getElementById('srs-practice-card').style.display = 'block';

        this.nextSrsQuestion();
    }

    nextSrsQuestion() {
        if (this.sessionIndex >= this.sessionItems.length) {
            this.finishSrsSession();
            return;
        }

        const current = this.sessionItems[this.sessionIndex];
        const data = current.data;
        const primaryPrep = data.prepositions?.[0] || 'none';

        // Select Question Format randomly:
        // 1: pick_prep (multiple choice)
        // 2: fill_blank (type in preposition)
        // 3: spot_mistake (multiple choice sentence fixing mistake)
        const formats = ['pick_prep', 'fill_blank', 'spot_mistake'];
        const format = formats[Math.floor(Math.random() * formats.length)];

        this.currentQuestion = {
            item: current,
            format: format,
            expected: primaryPrep,
            data: data
        };

        // Header info
        document.getElementById('srs-step-indicator').textContent = `Question ${this.sessionIndex + 1} / ${this.sessionItems.length}`;
        document.getElementById('srs-word-prompt').textContent = current.key;

        const typeTag = document.getElementById('srs-word-type-tag');
        typeTag.textContent = current.type === 'verbs' ? 'Verbe 💬' : (current.type === 'nouns' ? 'Nom 📦' : 'Adjectif 🎨');

        document.getElementById('srs-cefr-tag').textContent = `Niveau : ${data.level || 'A1'}`;

        // Reset views
        document.getElementById('srs-choices-grid').style.display = 'none';
        document.getElementById('srs-fill-container').style.display = 'none';
        document.getElementById('srs-feedback-box').style.display = 'none';
        document.getElementById('srs-nudge-box').style.display = 'none';
        document.getElementById('srs-next-btn').style.display = 'none';

        const exampleSentence = data.examples?.[0] || `Mot : ${current.key}`;

        if (format === 'fill_blank') {
            document.getElementById('srs-question-type-label').textContent = "Format : Remplissez le blanc";
            let sentencePrompt = exampleSentence;
            if (primaryPrep !== 'none') {
                const prepRegex = new RegExp(`\\b${primaryPrep.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
                sentencePrompt = exampleSentence.replace(prepRegex, `<strong class="blank-spot">[ ? ]</strong>`);
            }
            document.getElementById('srs-sentence-prompt').innerHTML = `Exemple : "${sentencePrompt}"`;

            const inputEl = document.getElementById('srs-blank-input');
            inputEl.value = '';
            document.getElementById('srs-fill-container').style.display = 'flex';
            setTimeout(() => inputEl.focus(), 100);

        } else if (format === 'spot_mistake' && data.common_mistake) {
            document.getElementById('srs-question-type-label').textContent = "Format : Corrigez l'erreur";
            document.getElementById('srs-sentence-prompt').innerHTML = `Erreur courante : <span class="text-terracotta">${data.common_mistake.split('➜')[0]}</span><br>Quelle est la forme correcte ?`;

            const choices = this.generatePrepositionChoices(primaryPrep);
            const grid = document.getElementById('srs-choices-grid');
            grid.style.display = 'grid';
            grid.innerHTML = choices.map(choice => `
                <button class="choice-btn" onclick="appEngine.checkSrsAnswer('${choice}')">
                    ${choice === 'none' ? 'Direct (sans prép)' : choice}
                </button>
            `).join('');

        } else {
            // pick_prep
            document.getElementById('srs-question-type-label').textContent = "Format : Choix de la préposition";
            let sentencePrompt = exampleSentence;
            if (primaryPrep !== 'none') {
                const prepRegex = new RegExp(`\\b${primaryPrep.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
                sentencePrompt = exampleSentence.replace(prepRegex, `<strong class="blank-spot">[ ? ]</strong>`);
            }
            document.getElementById('srs-sentence-prompt').innerHTML = `Exemple : "${sentencePrompt}"`;

            const choices = this.generatePrepositionChoices(primaryPrep);
            const grid = document.getElementById('srs-choices-grid');
            grid.style.display = 'grid';
            grid.innerHTML = choices.map(choice => `
                <button class="choice-btn" onclick="appEngine.checkSrsAnswer('${choice}')">
                    ${choice === 'none' ? 'Direct (sans prép)' : choice}
                </button>
            `).join('');
        }
    }

    generatePrepositionChoices(primaryPrep) {
        const pool = ['à', 'de', 'sur', 'en', 'pour', 'avec', 'par', 'envers', 'none'];
        let choices = [primaryPrep];

        // Add contractions if primary is à or de
        if (primaryPrep === 'à') choices.push('au');
        if (primaryPrep === 'de') choices.push('du');

        while (choices.length < 4) {
            const r = pool[Math.floor(Math.random() * pool.length)];
            if (!choices.includes(r)) choices.push(r);
        }
        return choices.sort(() => Math.random() - 0.5);
    }

    submitBlankAnswer() {
        const input = document.getElementById('srs-blank-input').value.trim();
        this.checkSrsAnswer(input);
    }

    checkSrsAnswer(userAnswer) {
        if (!this.currentQuestion) return;

        const current = this.currentQuestion.item;
        const expected = this.currentQuestion.expected;
        const data = this.currentQuestion.data;

        const cleanUser = userAnswer.toLowerCase().trim();
        const cleanExpected = expected.toLowerCase().trim();

        // Contraction awareness checking
        let isCorrect = false;
        if (cleanUser === cleanExpected) {
            isCorrect = true;
        } else if (cleanExpected === 'à' && (cleanUser === 'au' || cleanUser === 'aux' || cleanUser === "à l'")) {
            isCorrect = true;
        } else if (cleanExpected === 'de' && (cleanUser === 'du' || cleanUser === 'des' || cleanUser === "d'")) {
            isCorrect = true;
        } else if ((cleanUser === 'direct' || cleanUser === 'sans' || cleanUser === '') && cleanExpected === 'none') {
            isCorrect = true;
        }

        const srsResult = this.srs.recordAnswer(current.type, current.key, isCorrect);

        const feedback = document.getElementById('srs-feedback-box');
        feedback.style.display = 'block';

        if (isCorrect) {
            this.sessionScore += 10;
            this.sessionCorrectCount += 1;
            feedback.className = 'feedback-card correct';
            feedback.innerHTML = `✅ Excellent ! La préposition exacte pour <strong>${current.key}</strong> est <strong>${expected === 'none' ? 'Direct (sans préposition)' : expected}</strong>.<br><div style="margin-top:4px; font-weight:600; font-size:0.9rem;">⭐ Niveau de maîtrise : ${srsResult.newLevel}/5</div>`;
        } else {
            feedback.className = 'feedback-card wrong';
            feedback.innerHTML = `❌ Incorrect ! <strong>${current.key}</strong> demande : <strong>${expected === 'none' ? 'Direct (sans préposition)' : expected}</strong>.<br><small class="rule-box-spaced"><strong>Règle :</strong> ${data.grammar_rule}</small>${data.common_mistake ? `<small class="trap-box-spaced"><strong>Piège :</strong> ${data.common_mistake}</small>` : ''}`;
        }

        // Check for cross-family "Le saviez-vous ?" nudge on mastery or review
        if (srsResult.leveledUp || data.related_forms || data.noun_parallel) {
            const rawText = data.related_forms || data.noun_parallel || '';
            if (rawText) {
                const nudgeBox = document.getElementById('srs-nudge-box');
                document.getElementById('srs-nudge-text').textContent = rawText;
                const chips = this.generateCrossReferenceChips(rawText);
                document.getElementById('srs-nudge-chips').innerHTML = chips;
                nudgeBox.style.display = 'flex';
            }
        }

        document.getElementById('srs-choices-grid').style.display = 'none';
        document.getElementById('srs-fill-container').style.display = 'none';
        document.getElementById('srs-next-btn').style.display = 'block';

        this.sessionIndex += 1;
        this.updateSrsStatsBar();
    }

    finishSrsSession() {
        document.getElementById('srs-practice-card').style.display = 'none';
        const summaryCard = document.getElementById('srs-summary-card');
        summaryCard.style.display = 'block';

        document.getElementById('summary-score-text').textContent = `Vous avez révisé ${this.sessionItems.length} mots lors de cette session !`;
        document.getElementById('summary-correct-count').textContent = `${this.sessionCorrectCount} / ${this.sessionItems.length}`;

        const stats = this.srs.getDashboardStats(this.datasets);
        document.getElementById('summary-streak-count').textContent = stats.streak;
        document.getElementById('summary-mastered-count').textContent = stats.totalMastered;

        this.updateSrsStatsBar();
    }

    resetSrsLauncher() {
        document.getElementById('session-launcher-card').style.display = 'block';
        document.getElementById('srs-practice-card').style.display = 'none';
        document.getElementById('srs-summary-card').style.display = 'none';
        this.updateSrsStatsBar();
    }

    toggleDashboard() {
        const modal = document.getElementById('srs-dashboard-modal');
        if (modal.style.display === 'none' || !modal.style.display) {
            this.renderDashboardMatrix();
            modal.style.display = 'flex';
        } else {
            modal.style.display = 'none';
        }
    }

    renderDashboardMatrix() {
        const container = document.getElementById('dashboard-matrix-container');
        const stats = this.srs.getDashboardStats(this.datasets);

        const levels = ['A1', 'A2', 'B1', 'B2'];
        const types = [
            { id: 'verbs', label: '💬 Verbes' },
            { id: 'nouns', label: '📦 Noms' },
            { id: 'adjectives', label: '🎨 Adjectifs' }
        ];

        let html = `
            <div class="mastered-stats-box">
                <div>Total mots : <strong>${stats.totalItems}</strong></div>
                <div>Maîtrisés (Niv 4+) : <strong class="text-sage-primary">${stats.totalMastered}</strong></div>
                <div>Série : <strong>${stats.streak} jours</strong></div>
            </div>
            <table class="matrix-table">
                <thead>
                    <tr>
                        <th>Type de mot</th>
                        <th>A1</th>
                        <th>A2</th>
                        <th>B1</th>
                        <th>B2</th>
                    </tr>
                </thead>
                <tbody>
        `;

        types.forEach(t => {
            html += `<tr><td><strong>${t.label}</strong></td>`;
            levels.forEach(l => {
                const cell = stats.matrix[t.id][l];
                const pct = cell.total > 0 ? Math.round((cell.mastered / cell.total) * 100) : 0;
                html += `
                    <td>
                        <div><strong>${cell.mastered} / ${cell.total}</strong></div>
                        <div class="text-faint-muted">${pct}% maîtrisés</div>
                    </td>
                `;
            });
            html += `</tr>`;
        });

        html += `</tbody></table>`;
        container.innerHTML = html;
    }

    /* Dictionary Mode Methods */
    setWordType(type) {
        if (!this.datasets[type]) return;
        this.currentWordType = type;
        this.activeFilter = 'all';

        ['verbs', 'nouns', 'adjectives'].forEach(t => {
            const tab = document.getElementById(`tab-${t}`);
            if (tab) {
                if (t === type) tab.classList.add('active');
                else tab.classList.remove('active');
            }
        });

        this.renderFilterPills();
        this.updateFilteredKeys();

        const input = document.getElementById('verb-search-input');
        if (input && input.value.trim()) {
            this.handleSearchInput(input.value);
        } else {
            this.resetDisplay();
        }
    }

    renderFilterPills() {
        const container = document.getElementById('filter-pills-container');
        if (!container) return;

        let pills = [];
        if (this.currentWordType === 'verbs') {
            pills = [
                { id: 'all', label: 'Tous les verbes' },
                { id: 'a', label: 'Régime « à »' },
                { id: 'de', label: 'Régime « de »' },
                { id: 'direct', label: 'Direct (sans prép)' },
                { id: 'pronominal', label: 'Pronominaux 🪞' },
                { id: 'other', label: 'Autres (sur, en...)' }
            ];
        } else if (this.currentWordType === 'nouns') {
            pills = [
                { id: 'all', label: 'Tous les noms' },
                { id: 'de', label: 'Régime « de »' },
                { id: 'a', label: 'Régime « à »' },
                { id: 'pour', label: 'Régime « pour / envers »' },
                { id: 'other', label: 'Autres (en, sur, avec...)' }
            ];
        } else {
            pills = [
                { id: 'all', label: 'Tous les adjectifs' },
                { id: 'de', label: 'Régime « de »' },
                { id: 'a', label: 'Régime « à »' },
                { id: 'avec', label: 'Régime « avec / envers »' },
                { id: 'other', label: 'Autres (pour, par, sur...)' }
            ];
        }

        container.innerHTML = pills.map(p => `
            <button class="filter-pill ${p.id === this.activeFilter ? 'active' : ''}" id="filter-${p.id}" onclick="appEngine.setFilter('${p.id}')">
                ${p.label}
            </button>
        `).join('');
    }

    setFilter(filterType) {
        this.activeFilter = filterType;
        const container = document.getElementById('filter-pills-container');
        if (container) {
            container.querySelectorAll('.filter-pill').forEach(btn => {
                if (btn.id === `filter-${filterType}`) btn.classList.add('active');
                else btn.classList.remove('active');
            });
        }
        this.updateFilteredKeys();

        const input = document.getElementById('verb-search-input');
        if (input && input.value.trim()) {
            this.handleSearchInput(input.value);
        }
    }

    updateFilteredKeys() {
        const db = this.activeDb;
        const keys = this.activeKeys;

        if (this.activeFilter === 'a') {
            this.filteredKeys = keys.filter(k => (db[k].prepositions || []).some(p => p === 'à' || p.includes('à')));
        } else if (this.activeFilter === 'de') {
            this.filteredKeys = keys.filter(k => (db[k].prepositions || []).some(p => p === 'de' || p.includes('de')));
        } else if (this.activeFilter === 'direct') {
            this.filteredKeys = keys.filter(k => (db[k].prepositions || []).includes('none'));
        } else if (this.activeFilter === 'pronominal') {
            this.filteredKeys = keys.filter(k => db[k].pronominal === true);
        } else if (this.activeFilter === 'pour') {
            this.filteredKeys = keys.filter(k => (db[k].prepositions || []).some(p => p === 'pour' || p === 'envers'));
        } else if (this.activeFilter === 'avec') {
            this.filteredKeys = keys.filter(k => (db[k].prepositions || []).some(p => p === 'avec' || p === 'envers'));
        } else if (this.activeFilter === 'other') {
            this.filteredKeys = keys.filter(k => (db[k].prepositions || []).some(p => p !== 'à' && p !== 'de' && p !== 'none'));
        } else {
            this.filteredKeys = [...keys];
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
                const text = document.getElementById('verb-title').textContent;
                if (text && 'speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance(text);
                    utterance.lang = 'fr-FR';
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

        const pool = this.filteredKeys.length > 0 ? this.filteredKeys : this.activeKeys;
        const matches = pool.filter(key => key.toLowerCase().includes(cleanQuery));

        if (matches.length > 0 && suggestionsBox) {
            suggestionsBox.innerHTML = matches.slice(0, 6).map(key => {
                const data = this.activeDb[key];
                const preps = (data.prepositions || []).join(' / ');
                const prepLabel = preps === 'none' ? 'Direct' : `Prép : ${preps}`;
                return `
                <div class="suggestion-item" onclick="appEngine.selectSuggestion('${key.replace(/'/g, "\\'")}')">
                    <span><strong>${key}</strong></span>
                    <span class="text-label-sage">${prepLabel}</span>
                </div>
            `;
            }).join('');
            suggestionsBox.style.display = 'block';
        } else if (suggestionsBox) {
            this.hideSuggestions();
        }
    }

    selectSuggestion(key) {
        const input = document.getElementById('verb-search-input');
        if (input) input.value = key;
        this.hideSuggestions();
        this.searchVerb(key);
    }

    hideSuggestions() {
        const suggestionsBox = document.getElementById('search-suggestions');
        if (suggestionsBox) suggestionsBox.style.display = 'none';
    }

    searchVerb(query) {
        this.searchEntry(query, this.currentWordType);
    }

    searchEntry(query, targetType = this.currentWordType) {
        if (!query) return;
        if (this.appMode !== 'dictionary') {
            this.setAppMode('dictionary');
        }

        if (targetType !== this.currentWordType) {
            this.setWordType(targetType);
        }

        const cleanQuery = query.trim().toLowerCase();
        const db = this.activeDb;
        const keys = this.activeKeys;

        let matchedKey = keys.find(k => k.toLowerCase() === cleanQuery);
        if (!matchedKey) {
            matchedKey = keys.find(k => k.toLowerCase().startsWith(cleanQuery));
        }

        if (matchedKey) {
            const pool = this.filteredKeys.length > 0 ? this.filteredKeys : keys;
            this.currentIndex = pool.indexOf(matchedKey);
            this.renderVerbResult(matchedKey, db[matchedKey]);
        } else {
            this.currentIndex = -1;
            const fallbackData = {
                word_type: this.currentWordType === 'nouns' ? 'noun' : (this.currentWordType === 'adjectives' ? 'adjective' : 'verb'),
                prepositions: ["none"],
                pronominal: cleanQuery.startsWith("se ") || cleanQuery.startsWith("s'"),
                pattern: `${cleanQuery} [complément]`,
                level: "A2",
                definition: `Entrée liée à « ${cleanQuery} ».`,
                grammar_rule: `Mot français « ${cleanQuery} ». Vérifiez l'accord et le régime prépositionnel.`,
                related_forms: "",
                examples: [
                    `Il convient de bien employer ${cleanQuery}.`,
                    `Consultez la grammaire pour utiliser ${cleanQuery}.`
                ],
                common_mistake: `⚠️ Vérifiez la préposition appropriée pour « ${cleanQuery} ».`,
                synonyms: [],
                antonyms: []
            };
            this.renderVerbResult(cleanQuery, fallbackData);
        }
    }

    renderVerbResult(key, data) {
        document.getElementById('empty-state').style.display = 'none';
        const resultCard = document.getElementById('verb-result-container');
        resultCard.style.display = 'block';

        document.getElementById('verb-title').textContent = key;

        const typeBadge = document.getElementById('word-type-badge');
        const typeLabel = this.currentWordType === 'verbs' ? 'Verbe 💬' : (this.currentWordType === 'nouns' ? 'Nom 📦' : 'Adjectif 🎨');
        typeBadge.textContent = typeLabel;

        const proBadge = document.getElementById('pronominal-badge');
        if (this.currentWordType === 'verbs' && data.pronominal) {
            proBadge.style.display = 'inline-block';
            proBadge.textContent = 'Pronominal 🪞';
        } else {
            proBadge.style.display = 'none';
        }

        const prepBadge = document.getElementById('prep-badge');
        const prepList = (data.prepositions || []).join(' / ');
        if (prepList === 'none') {
            prepBadge.textContent = 'Direct (sans préposition)';
            prepBadge.className = 'badge trans-vt';
        } else {
            prepBadge.textContent = `Préposition : ${prepList}`;
            prepBadge.className = 'badge prep-badge';
        }

        document.getElementById('verb-cefr-badge').textContent = `Niveau : ${data.level || 'A1'}`;

        document.getElementById('verb-definition').textContent = data.definition || 'Définition non disponible.';
        document.getElementById('verb-pattern-text').textContent = data.pattern || key;

        const crossRefBox = document.getElementById('cross-ref-container');
        const crossRefContent = document.getElementById('cross-ref-content');

        const rawText = data.related_forms || data.noun_parallel || '';
        if (rawText) {
            const chipsHtml = this.generateCrossReferenceChips(rawText);
            crossRefContent.innerHTML = `<p class="cross-ref-title">${rawText}</p>${chipsHtml}`;
            crossRefBox.style.display = 'block';
        } else {
            crossRefBox.style.display = 'none';
        }

        document.getElementById('grammar-rule-text').textContent = data.grammar_rule || '';

        const mistakeBox = document.getElementById('mistake-container');
        const mistakeEl = document.getElementById('mistake-text');
        if (data.common_mistake) {
            mistakeEl.textContent = data.common_mistake;
            mistakeBox.style.display = 'block';
        } else {
            mistakeBox.style.display = 'none';
        }

        const examplesList = document.getElementById('examples-list');
        if (data.examples && data.examples.length > 0) {
            examplesList.innerHTML = data.examples.map(ex => `<li>${ex}</li>`).join('');
            document.getElementById('examples-container').style.display = 'block';
        } else {
            document.getElementById('examples-container').style.display = 'none';
        }

        const antonymsBox = document.getElementById('antonyms-pills');
        const items = [...(data.synonyms || []).map(s => `≈ ${s}`), ...(data.antonyms || []).map(a => `↔ ${a}`)];
        if (items.length > 0) {
            antonymsBox.innerHTML = items.map(item => `<span class="antonym-pill">${item}</span>`).join('');
            document.getElementById('antonyms-container').style.display = 'block';
        } else {
            document.getElementById('antonyms-container').style.display = 'none';
        }
    }

    generateCrossReferenceChips(text) {
        let chips = [];

        for (const type of ['verbs', 'nouns', 'adjectives']) {
            const db = this.datasets[type];
            for (const key of Object.keys(db)) {
                if (text.includes(`« ${key} »`) || text.includes(`'${key}'`) || text.includes(`"${key}"`) || text.toLowerCase().includes(key.toLowerCase())) {
                    if (key.length > 2) {
                        const icon = type === 'verbs' ? '💬' : (type === 'nouns' ? '📦' : '🎨');
                        const label = `${icon} ${key}`;
                        chips.push(`
                            <button class="ref-chip" onclick="appEngine.navigateToCrossReference('${type}', '${key.replace(/'/g, "\\'")}')">
                                🔗 ${label}
                            </button>
                        `);
                    }
                }
            }
        }

        const uniqueChips = [...new Set(chips)];
        return uniqueChips.length > 0 ? `<div class="chips-wrap-flex">${uniqueChips.join('')}</div>` : '';
    }

    navigateToCrossReference(targetType, key) {
        this.searchEntry(key, targetType);
    }

    navigateNext() {
        const pool = this.filteredKeys.length > 0 ? this.filteredKeys : this.activeKeys;
        if (pool.length === 0) return;
        this.currentIndex = (this.currentIndex + 1) % pool.length;
        const key = pool[this.currentIndex];
        this.searchEntry(key, this.currentWordType);
    }

    navigatePrevious() {
        const pool = this.filteredKeys.length > 0 ? this.filteredKeys : this.activeKeys;
        if (pool.length === 0) return;
        this.currentIndex = (this.currentIndex - 1 + pool.length) % pool.length;
        const key = pool[this.currentIndex];
        this.searchEntry(key, this.currentWordType);
    }

    navigateRandom() {
        const pool = this.filteredKeys.length > 0 ? this.filteredKeys : this.activeKeys;
        if (pool.length === 0) return;
        let nextIdx = Math.floor(Math.random() * pool.length);
        if (nextIdx === this.currentIndex && pool.length > 1) {
            nextIdx = (nextIdx + 1) % pool.length;
        }
        this.currentIndex = nextIdx;
        const key = pool[this.currentIndex];
        this.searchEntry(key, this.currentWordType);
    }

    resetDisplay() {
        document.getElementById('verb-result-container').style.display = 'none';
        document.getElementById('empty-state').style.display = 'block';
    }
}

let appEngine;
document.addEventListener('DOMContentLoaded', () => {
    appEngine = new FrenchRegimeEngine();
});
