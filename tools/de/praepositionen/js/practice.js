/**
 * Practice Manager for de-praepositionen
 * Uses PracticeEngine shared base class for 10-item sessions, question formats (fill-in-blank, pick-correct, spot-mistake, match).
 */

class PracticeManager extends PracticeEngine {
    constructor(engine, srsStore) {
        super({
            engine: engine,
            srsStore: srsStore,
            containerId: 'practice-card-content',
            sessionLength: 10,
            onSessionComplete: () => this.renderSessionSummary()
        });

        this.registerFormat('mc', (item, format, container) => this.renderGermanQuestion(item, 'mc', container));
        this.registerFormat('blank', (item, format, container) => this.renderGermanQuestion(item, 'blank', container));
        this.registerFormat('type', (item, format, container) => this.renderGermanQuestion(item, 'blank', container));
        this.registerFormat('spot_mistake', (item, format, container) => this.renderGermanQuestion(item, 'spot_mistake', container));
    }

    renderGermanQuestion(item, format, container) {
        const data = item.entry || item.data;
        const promptWord = item.key || data.base || '';

        const primaryPrep = data.prepositions?.[0] || 'none';
        const prepPool = ['an', 'auf', 'für', 'mit', 'von', 'zu', 'über', 'in', 'vor', 'bei'];

        let choices = [primaryPrep];
        while (choices.length < 4) {
            const pick = prepPool[Math.floor(Math.random() * prepPool.length)];
            if (!choices.includes(pick)) choices.push(pick);
        }
        choices.sort(() => Math.random() - 0.5);

        this.activeQuestion = {
            item: item,
            format: format,
            expected: primaryPrep,
            choices: choices,
            comparator: (typed, exp) => PracticeEngine.normalizeAnswer(typed, exp)
        };

        let questionPromptHtml = '';

        if (format === 'spot_mistake' && data.common_mistake) {
            questionPromptHtml = `
                <div class="mistake-spot-prompt">
                    <span class="prompt-badge spot-badge">⚠️ Fehler korrigieren</span>
                    <h4>Welche Präposition gehört zu: <strong class="highlight-word">${promptWord}</strong>?</h4>
                    <p class="mistake-line">${data.common_mistake.split('➜')[0] || data.common_mistake}</p>
                </div>
            `;
        } else if ((format === 'blank' || format === 'type') && data.examples?.[0]) {
            const ex = data.examples[0];
            let blankSentence = ex;

            if (primaryPrep !== 'none') {
                const prepRegex = new RegExp(`\\b(${primaryPrep}|an|auf|für|mit|von|zu|über|in|vor|bei)\\b`, 'i');
                blankSentence = ex.replace(prepRegex, '<strong class="blank-spot">[ ___ ]</strong>');
            }
            questionPromptHtml = `
                <div class="blank-prompt">
                    <span class="prompt-badge blank-badge">💡 Satz ergänzen</span>
                    <h3>${promptWord}</h3>
                    <p class="sentence-box">"${blankSentence}"</p>
                </div>
            `;
        } else {
            questionPromptHtml = `
                <div class="mc-prompt">
                    <span class="prompt-badge mc-badge">🎯 Präposition wählen</span>
                    <h3>${promptWord}</h3>
                    <p class="definition-hint"><em>${data.definition || ''}</em></p>
                </div>
            `;
        }

        const choiceButtonsHtml = choices.map(choice => `
            <button class="choice-btn" onclick="appEngine.practice.checkAnswer('${choice}')">
                ${choice === 'none' ? 'Direkt (ohne Präp.)' : choice}
            </button>
        `).join('');

        container.innerHTML = `
            <div class="question-header">
                <div class="meta-info">
                    <span class="badge type-badge">DEUTSCH 🇩🇪</span>
                    <span class="badge cefr-badge">Niveau: ${data.level || 'A1'}</span>
                    <span class="progress-count">Wort ${this.currentIndex + 1} von ${this.currentSession.length}</span>
                </div>
            </div>

            ${questionPromptHtml}

            <div class="choice-grid">
                ${choiceButtonsHtml}
            </div>

            <div id="practice-feedback-box" class="inline-feedback-card hidden" style="display:none;"></div>
            <button id="practice-next-btn" class="game-btn hidden" style="display:none;" onclick="appEngine.practice.nextQuestion()">Weiter ➔</button>
        `;
    }

    checkAnswer(userChoice) {
        if (!this.activeQuestion) return;

        const result = super.checkAnswer(userChoice);
        if (!result) return;

        const { isCorrect, expected, newProg, item } = result;

        const feedbackBox = document.getElementById('practice-feedback-box');
        const nextBtn = document.getElementById('practice-next-btn');
        const choiceGrid = document.querySelector('.choice-grid');

        const entry = item.entry || item.data;

        if (isCorrect) {
            feedbackBox.className = 'inline-feedback-card feedback-correct';
            feedbackBox.innerHTML = `
                <div class="feedback-title">✅ Richtig! (${expected === 'none' ? 'Direkt / Ohne Präposition' : 'Präposition: ' + expected})</div>
                <div class="feedback-srs-info" style="margin: 0.25rem 0; font-weight: 600; font-size: 0.9rem;">⭐ Lernstufe: ${newProg.masteryLevel}/5</div>
                ${entry.grammar_rule ? `<div class="feedback-rule">📌 Regel: ${entry.grammar_rule}</div>` : ''}
            `;
        } else {
            feedbackBox.className = 'inline-feedback-card feedback-wrong';
            feedbackBox.innerHTML = `
                <div class="feedback-title">❌ Falsch! Erwartet: <strong>${expected === 'none' ? 'Direkt (ohne Präposition)' : expected}</strong></div>
                <div class="feedback-srs-info" style="margin: 0.25rem 0; font-weight: 600; font-size: 0.9rem;">⭐ Lernstufe: ${newProg.masteryLevel}/5</div>
                ${entry.grammar_rule ? `<div class="feedback-rule">📌 Regel: ${entry.grammar_rule}</div>` : ''}
                ${entry.common_mistake ? `<div class="feedback-mistake">⚠️ Typischer Fehler: ${entry.common_mistake}</div>` : ''}
            `;
        }

        feedbackBox.style.display = 'block';
        if (choiceGrid) choiceGrid.style.pointerEvents = 'none';
        if (nextBtn) nextBtn.style.display = 'block';
    }

    renderSessionSummary() {
        const practiceContainer = this.getContainer();
        if (!practiceContainer) return;

        const streakInfo = this.srsStore ? this.srsStore.getStreakInfo() : { streakDays: 0, todayCount: 0, goal: 10 };

        practiceContainer.innerHTML = `
            <div class="session-summary-box">
                <span class="summary-icon">🎉</span>
                <h3>Übungssession beendet!</h3>
                <p>Gute Arbeit! Du hast ${this.sessionCorrectItems.length} von ${this.currentSession.length} Fragen richtig beantwortet.</p>

                <div class="summary-stats-grid">
                    <div class="stat-box">
                        <span class="stat-num">${this.sessionScore}</span>
                        <span class="stat-lbl">Punkte</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-num">${this.masteredThisSession.length}</span>
                        <span class="stat-lbl">Gelernt</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-num">${streakInfo.streakDays}🔥</span>
                        <span class="stat-lbl">Tage Serie</span>
                    </div>
                </div>

                <div class="summary-actions">
                    <button class="game-btn secondary-btn" onclick="appEngine.practice.startSession('all', 'all', true)">
                        🔁 Schwachstellen wiederholen
                    </button>
                    <button class="game-btn" onclick="appEngine.setAppMode('practice')">
                        ✅ Fertig für heute
                    </button>
                </div>
            </div>
        `;
    }
}

window.PracticeManager = PracticeManager;
