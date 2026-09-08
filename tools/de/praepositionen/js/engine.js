/**
 * COSYlanguages Standalone App — Deutsche Präpositionen & Kasus (de-praepositionen)
 * Provides offline search across German Verbs, Nouns & Adjectives with prepositional regimes & cases (Akkusativ/Dativ),
 * Wechselpräpositionen reference section, word-type switching & Spaced Repetition System (SRS) practice mode.
 */

class GermanPraepositionenEngine {
    constructor() {
        this.datasets = {
            verbs: {},
            nouns: {},
            adjectives: {},
            two_way: {}
        };
        this.srs = new DePraepositionenSrsManager();
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
            const [verbsRes, nounsRes, adjRes, twoWayRes] = await Promise.all([
                fetch('data/verbs.json'),
                fetch('data/nouns.json'),
                fetch('data/adjectives.json'),
                fetch('data/two_way_prepositions.json')
            ]);

            this.datasets.verbs = await verbsRes.json();
            this.datasets.nouns = await nounsRes.json();
            this.datasets.adjectives = await adjRes.json();
            this.datasets.two_way = await twoWayRes.json();

            this.renderFilterPills();
            this.updateFilteredKeys();
            this.updateSrsStatsBar();
            this.bindEvents();
            this.setAppMode('practice');
        } catch (err) {
            console.error("Fehler beim Laden der deutschen Präpositionsdatensätze:", err);
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
            if (practiceView) {
                practiceView.classList.remove('hidden');
                practiceView.style.display = 'block';
            }
            if (dictionaryView) {
                dictionaryView.classList.add('hidden');
                dictionaryView.style.display = 'none';
            }
            if (pracBtn) pracBtn.className = 'mode-btn active';
            if (dictBtn) dictBtn.className = 'mode-btn';
            this.updateSrsStatsBar();
            this.resetSrsLauncher();
        } else {
            if (practiceView) {
                practiceView.classList.add('hidden');
                practiceView.style.display = 'none';
            }
            if (dictionaryView) {
                dictionaryView.classList.remove('hidden');
                dictionaryView.style.display = 'block';
            }
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
            alert("Keine Wörter in dieser Kategorie zum Wiederholen!");
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
        const primaryPrep = data.prepositions?.[0] || 'keine';
        const itemCase = data.case || 'Akkusativ';

        const formats = ['pick_prep', 'fill_blank', 'spot_mistake'];
        const format = formats[Math.floor(Math.random() * formats.length)];

        this.currentQuestion = {
            item: current,
            format: format,
            expected: primaryPrep,
            expectedCase: itemCase,
            data: data
        };

        document.getElementById('srs-step-indicator').textContent = `Frage ${this.sessionIndex + 1} / ${this.sessionItems.length}`;
        document.getElementById('srs-word-prompt').textContent = current.key;

        const typeTag = document.getElementById('srs-word-type-tag');
        typeTag.textContent = current.type === 'verbs' ? 'Verb 💬' : (current.type === 'nouns' ? 'Nomen 📦' : 'Adjektiv 🎨');

        document.getElementById('srs-cefr-tag').textContent = `Niveau: ${data.level || 'A1'}`;

        document.getElementById('srs-choices-grid').style.display = 'none';
        document.getElementById('srs-fill-container').style.display = 'none';
        document.getElementById('srs-feedback-box').style.display = 'none';
        document.getElementById('srs-next-btn').style.display = 'none';

        const exampleSentence = data.examples?.[0] || `Wort: ${current.key}`;

        if (format === 'fill_blank') {
            document.getElementById('srs-question-type-label').textContent = `Format: Präposition eingeben (${itemCase})`;
            let sentencePrompt = exampleSentence;
            if (primaryPrep !== 'keine' && primaryPrep !== 'none') {
                const prepRegex = new RegExp(`\\b${primaryPrep.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
                sentencePrompt = exampleSentence.replace(prepRegex, `<strong class="blank-spot">[ ? ]</strong>`);
            }
            document.getElementById('srs-sentence-prompt').innerHTML = `Beispiel: "${sentencePrompt}"`;

            const inputEl = document.getElementById('srs-blank-input');
            inputEl.value = '';
            document.getElementById('srs-fill-container').style.display = 'flex';
            setTimeout(() => inputEl.focus(), 100);

        } else if (format === 'spot_mistake' && data.common_mistake) {
            document.getElementById('srs-question-type-label').textContent = `Format: Fehler korrigieren (${itemCase})`;
            document.getElementById('srs-sentence-prompt').innerHTML = `Typischer Fehler: <span class="blank-spot">${data.common_mistake.split('➜')[0]}</span><br>Welche Präposition gehört dazu?`;

            const choices = this.generatePrepositionChoices(primaryPrep);
            const grid = document.getElementById('srs-choices-grid');
            grid.style.display = 'grid';
            grid.innerHTML = choices.map(choice => `
                <button class="choice-btn" onclick="appEngine.checkSrsAnswer('${choice}')">
                    ${choice === 'keine' || choice === 'none' ? 'Direkt (ohne Präp.)' : choice}
                </button>
            `).join('');

        } else {
            document.getElementById('srs-question-type-label').textContent = `Format: Präposition wählen (${itemCase})`;
            let sentencePrompt = exampleSentence;
            if (primaryPrep !== 'keine' && primaryPrep !== 'none') {
                const prepRegex = new RegExp(`\\b${primaryPrep.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
                sentencePrompt = exampleSentence.replace(prepRegex, `<strong class="blank-spot">[ ? ]</strong>`);
            }
            document.getElementById('srs-sentence-prompt').innerHTML = `Beispiel: "${sentencePrompt}"`;

            const choices = this.generatePrepositionChoices(primaryPrep);
            const grid = document.getElementById('srs-choices-grid');
            grid.style.display = 'grid';
            grid.innerHTML = choices.map(choice => `
                <button class="choice-btn" onclick="appEngine.checkSrsAnswer('${choice}')">
                    ${choice === 'keine' || choice === 'none' ? 'Direkt (ohne Präp.)' : choice}
                </button>
            `).join('');
        }
    }

    generatePrepositionChoices(primaryPrep) {
        const pool = ['an', 'auf', 'bei', 'für', 'gegen', 'in', 'mit', 'nach', 'über', 'um', 'unter', 'von', 'vor', 'zu'];
        let choices = [primaryPrep];

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
        const expectedCase = this.currentQuestion.expectedCase;
        const data = this.currentQuestion.data;

        const cleanUser = userAnswer.toLowerCase().trim();
        const cleanExpected = expected.toLowerCase().trim();

        let isCorrect = (cleanUser === cleanExpected);
        if ((cleanUser === 'direkt' || cleanUser === 'ohne' || cleanUser === '') && (cleanExpected === 'keine' || cleanExpected === 'none')) {
            isCorrect = true;
        }

        const srsResult = this.srs.recordAnswer(current.type, current.key, isCorrect);

        const feedback = document.getElementById('srs-feedback-box');
        feedback.style.display = 'block';

        if (isCorrect) {
            this.sessionScore += 10;
            this.sessionCorrectCount += 1;
            feedback.className = 'feedback-card correct';
            feedback.innerHTML = `✅ Richtig! <strong>${current.key}</strong> verlangt <strong>${expected} + ${expectedCase}</strong>.<br><div style="margin-top:4px; font-weight:600; font-size:0.9rem;">⭐ Lernstufe: ${srsResult.newLevel}/5</div>`;
        } else {
            feedback.className = 'feedback-card wrong';
            feedback.innerHTML = `❌ Falsch! <strong>${current.key}</strong> verlangt: <strong>${expected} + ${expectedCase}</strong>.<br><small class="rule-box-spaced"><strong>Regel:</strong> ${data.grammar_rule}</small>${data.common_mistake ? `<br><small class="trap-box-spaced"><strong>Typischer Fehler:</strong> ${data.common_mistake}</small>` : ''}`;
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

        document.getElementById('summary-score-text').textContent = `Du hast heute ${this.sessionItems.length} Wörter geübt!`;
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
            { id: 'verbs', label: '💬 Verben' },
            { id: 'nouns', label: '📦 Nomen' },
            { id: 'adjectives', label: '🎨 Adjektive' }
        ];

        let html = `
            <div class="mastered-stats-box">
                <div>Gesamtwörter: <strong>${stats.totalItems}</strong></div>
                <div>Gelernt (Stufe 4+): <strong class="text-sage-primary">${stats.totalMastered}</strong></div>
                <div>Serie: <strong>${stats.streak} Tage</strong></div>
            </div>
            <table class="matrix-table">
                <thead>
                    <tr>
                        <th>Wortart</th>
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
                        <div class="text-faint-muted">${pct}% gelernt</div>
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
        this.currentWordType = type;
        this.activeFilter = 'all';

        ['verbs', 'nouns', 'adjectives', 'two_way'].forEach(t => {
            const tab = document.getElementById(`tab-${t}`);
            if (tab) {
                if (t === type) tab.classList.add('active');
                else tab.classList.remove('active');
            }
        });

        if (type === 'two_way') {
            this.renderTwoWaySection();
            return;
        }

        document.getElementById('two-way-container').style.display = 'none';
        this.renderFilterPills();
        this.updateFilteredKeys();

        const input = document.getElementById('verb-search-input');
        if (input && input.value.trim()) {
            this.handleSearchInput(input.value);
        } else {
            this.resetDisplay();
        }
    }

    renderTwoWaySection() {
        document.getElementById('filter-pills-container').innerHTML = '';
        document.getElementById('verb-result-container').style.display = 'none';
        document.getElementById('empty-state').style.display = 'none';

        const twoWayBox = document.getElementById('two-way-container');
        twoWayBox.style.display = 'block';

        const data = this.datasets.two_way;
        let html = `
            <div style="background:var(--surface-white); border:1px solid var(--border-color); border-radius:16px; padding:1.5rem; margin-bottom:1.5rem;">
                <h2 style="color:var(--sage-dark); margin-top:0;">🔄 Die 9 Wechselpräpositionen</h2>
                <p style="color:var(--ink-soft); font-size:0.95rem;">
                    Diese Präpositionen regieren <strong>Dativ</strong> bei der Frage <em>Wo?</em> (Lage / keine Bewegung) und <strong>Akkusativ</strong> bei der Frage <em>Wohin?</em> (Richtung / Zielbewegung):
                    <br><strong>an, auf, hinter, in, neben, über, unter, vor, zwischen</strong>
                </p>
                <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:1rem; margin-top:1.25rem;">
        `;

        Object.keys(data).forEach(p => {
            const entry = data[p];
            html += `
                <div style="background:var(--paper-bg); border:1px solid var(--border-color); border-radius:12px; padding:1rem;">
                    <div style="display:flex; justify-shadow:space-between; align-items:center; margin-bottom:0.5rem;">
                        <span style="font-size:1.3rem; font-weight:800; color:var(--sage-dark);">${entry.preposition}</span>
                        <span class="badge case-badge">${entry.translation}</span>
                    </div>
                    <div style="font-size:0.85rem; margin-bottom:0.5rem; background:#fef3c7; padding:6px 10px; border-radius:6px; color:#92400e;">
                        <strong>📍 Dativ (Wo?):</strong> ${entry.dativ_wo.example}
                    </div>
                    <div style="font-size:0.85rem; background:#e0f2fe; padding:6px 10px; border-radius:6px; color:#0369a1;">
                        <strong>🎯 Akkusativ (Wohin?):</strong> ${entry.akkusativ_wohin.example}
                    </div>
                </div>
            `;
        });

        html += `</div></div>`;
        twoWayBox.innerHTML = html;
    }

    renderFilterPills() {
        const container = document.getElementById('filter-pills-container');
        if (!container) return;

        let pills = [
            { id: 'all', label: 'Alle Einträge' },
            { id: 'akkusativ', label: 'Kasus: Akkusativ 🎯' },
            { id: 'dativ', label: 'Kasus: Dativ 📍' },
            { id: 'an', label: 'Präposition « an »' },
            { id: 'auf', label: 'Präposition « auf »' },
            { id: 'für', label: 'Präposition « für »' },
            { id: 'mit', label: 'Präposition « mit »' },
            { id: 'über', label: 'Präposition « über »' },
            { id: 'von', label: 'Präposition « von »' },
            { id: 'vor', label: 'Präposition « vor »' },
            { id: 'zu', label: 'Präposition « zu »' }
        ];

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

        if (this.activeFilter === 'akkusativ') {
            this.filteredKeys = keys.filter(k => (db[k].case || '').includes('Akkusativ'));
        } else if (this.activeFilter === 'dativ') {
            this.filteredKeys = keys.filter(k => (db[k].case || '').includes('Dativ'));
        } else if (this.activeFilter !== 'all') {
            const p = this.activeFilter;
            this.filteredKeys = keys.filter(k => (db[k].prepositions || []).some(prep => prep === p || prep.includes(p)));
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
                    utterance.lang = 'de-DE';
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
                const caseLabel = data.case ? ` + ${data.case}` : '';
                return `
                <div class="suggestion-item" onclick="appEngine.selectSuggestion('${key.replace(/'/g, "\\'")}')">
                    <span><strong>${key}</strong></span>
                    <span class="text-label-sage">${preps}${caseLabel}</span>
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
                prepositions: ["an"],
                case: "Akkusativ",
                pattern: `${cleanQuery} an [Akkusativ]`,
                level: "A2",
                definition: `Eintrag zu « ${cleanQuery} ».`,
                grammar_rule: `Deutsches Wort « ${cleanQuery} ». Auf richtige Präposition und Kasus achten.`,
                examples: [
                    `Man muss ${cleanQuery} richtig verwenden.`
                ],
                common_mistake: `⚠️ Prüfe den Kasus und die Präposition bei « ${cleanQuery} ».`,
                synonyms: [],
                antonyms: []
            };
            this.renderVerbResult(cleanQuery, fallbackData);
        }
    }

    renderVerbResult(key, data) {
        document.getElementById('empty-state').style.display = 'none';
        document.getElementById('two-way-container').style.display = 'none';
        const resultCard = document.getElementById('verb-result-container');
        resultCard.style.display = 'block';

        document.getElementById('verb-title').textContent = key;

        const typeBadge = document.getElementById('word-type-badge');
        const typeLabel = this.currentWordType === 'verbs' ? 'Verb 💬' : (this.currentWordType === 'nouns' ? 'Nomen 📦' : 'Adjektiv 🎨');
        typeBadge.textContent = typeLabel;

        const prepBadge = document.getElementById('prep-badge');
        const prepList = (data.prepositions || []).join(' / ');
        prepBadge.textContent = `Präposition: ${prepList}`;

        const caseBadge = document.getElementById('case-badge');
        if (data.case) {
            caseBadge.style.display = 'inline-block';
            caseBadge.textContent = `Kasus: ${data.case}`;
        } else {
            caseBadge.style.display = 'none';
        }

        document.getElementById('verb-cefr-badge').textContent = `Niveau: ${data.level || 'A1'}`;

        document.getElementById('verb-definition').textContent = data.definition || 'Keine Definition verfügbar.';
        document.getElementById('verb-pattern-text').textContent = data.pattern || key;

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
        document.getElementById('two-way-container').style.display = 'none';
        document.getElementById('empty-state').style.display = 'block';
    }
}

let appEngine;
document.addEventListener('DOMContentLoaded', () => {
    appEngine = new GermanPraepositionenEngine();
});
