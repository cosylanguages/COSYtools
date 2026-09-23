/**
 * Practice Manager for el-syntaxi
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

        this.registerFormat('mc', (item, format, container) => this.renderGreekQuestion(item, 'mc', container));
        this.registerFormat('blank', (item, format, container) => this.renderGreekQuestion(item, 'blank', container));
        this.registerFormat('type', (item, format, container) => this.renderGreekQuestion(item, 'blank', container));
        this.registerFormat('spot_mistake', (item, format, container) => this.renderGreekQuestion(item, 'spot_mistake', container));
    }

    formatGovPattern(data) {
        if (!data || !data.government) return 'αιτιατική';
        const govStrings = data.government.map(g => {
            const caseGreek = g.case === 'genitive' ? 'Γενική' : 'Αιτιατική';
            return g.preposition ? `${g.preposition} + ${caseGreek}` : `${caseGreek} (χωρίς πρόθεση)`;
        });
        return govStrings.join(' / ');
    }

    renderGreekQuestion(item, format, container) {
        const data = item.entry || item.data;
        const promptWord = item.key || data.base || '';

        const expected = this.formatGovPattern(data);

        this.activeQuestion = {
            item: item,
            format: format,
            expected: expected,
            comparator: (typed, exp) => PracticeEngine.normalizeAnswer(typed, exp)
        };

        let questionPromptHtml = '';

        if (format === 'spot_mistake' && data.common_mistake) {
            questionPromptHtml = `
                <div class="mistake-spot-prompt">
                    <span class="prompt-badge spot-badge">⚠️ Διορθώστε το λάθος</span>
                    <h4>Εντοπίστε τη σωστή σύνταξη για το ρήμα: <strong class="highlight-word">${promptWord}</strong></h4>
                    <p class="mistake-line">${data.common_mistake.split('➜')[0] || data.common_mistake}</p>
                </div>
            `;
        } else if ((format === 'blank' || format === 'type') && data.examples?.[0]) {
            const ex = data.examples[0];
            questionPromptHtml = `
                <div class="blank-prompt">
                    <span class="prompt-badge blank-badge">💡 Συμπληρώστε τη σύνταξη</span>
                    <h3>${promptWord}</h3>
                    <p class="sentence-box">"${ex}"</p>
                </div>
            `;
        } else {
            questionPromptHtml = `
                <div class="mc-prompt">
                    <span class="prompt-badge mc-badge">🎯 Σύνταξη Ρήματος</span>
                    <h3>${promptWord}</h3>
                    <p class="definition-hint"><em>${data.definition || ''}</em></p>
                </div>
            `;
        }

        const choices = [
            expected,
            'Αιτιατική (χωρίς πρόθεση)',
            'σε + Αιτιατική',
            'με + Αιτιατική',
            'για + Αιτιατική',
            'από + Αιτιατική',
            'Γενική'
        ].filter((val, idx, self) => self.indexOf(val) === idx).slice(0, 4);

        choices.sort(() => Math.random() - 0.5);

        const choiceButtonsHtml = choices.map(choice => `
            <button class="choice-btn" onclick="appEngine.practice.checkAnswer('${choice.replace(/'/g, "\\'")}')">
                ${choice}
            </button>
        `).join('');

        container.innerHTML = `
            <div class="question-header">
                <div class="meta-info">
                    <span class="badge type-badge">ΡΗΜΑ 🇬🇷</span>
                    <span class="badge cefr-badge">Επίπεδο: ${data.level || 'A1'}</span>
                    <span class="progress-count">Ρήμα ${this.currentIndex + 1} από ${this.currentSession.length}</span>
                </div>
            </div>

            ${questionPromptHtml}

            <div class="choice-grid">
                ${choiceButtonsHtml}
            </div>

            <div id="practice-feedback-box" class="inline-feedback-card hidden" style="display:none;"></div>
            <button id="practice-next-btn" class="game-btn hidden" style="display:none;" onclick="appEngine.practice.nextQuestion()">Συνέχεια ➔</button>
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
                <div class="feedback-title">✅ Σωστά! (${expected})</div>
                <div class="feedback-srs-info" style="margin: 0.25rem 0; font-weight: 600; font-size: 0.9rem;">⭐ Επίπεδο κατάκτησης: ${newProg.masteryLevel}/5</div>
                ${entry.grammar_rule ? `<div class="feedback-rule">📌 Κανόνας: ${entry.grammar_rule}</div>` : ''}
            `;
        } else {
            feedbackBox.className = 'inline-feedback-card feedback-wrong';
            feedbackBox.innerHTML = `
                <div class="feedback-title">❌ Λάθος! Αναμενόμενη σύνταξη: <strong>${expected}</strong></div>
                <div class="feedback-srs-info" style="margin: 0.25rem 0; font-weight: 600; font-size: 0.9rem;">⭐ Επίπεδο κατάκτησης: ${newProg.masteryLevel}/5</div>
                ${entry.grammar_rule ? `<div class="feedback-rule">📌 Κανόνας: ${entry.grammar_rule}</div>` : ''}
                ${entry.common_mistake ? `<div class="feedback-mistake">⚠️ Συχνό λάθος: ${entry.common_mistake}</div>` : ''}
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
                <h3>Η συνεδρία ολοκληρώθηκε!</h3>
                <p>Μπράβο! Απαντήσατε σωστά σε ${this.sessionCorrectItems.length} από τα ${this.currentSession.length} ρήματα.</p>

                <div class="summary-stats-grid">
                    <div class="stat-box">
                        <span class="stat-num">${this.sessionScore}</span>
                        <span class="stat-lbl">Πόντοι</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-num">${this.masteredThisSession.length}</span>
                        <span class="stat-lbl">Ρήματα που κατακτήθηκαν</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-num">${streakInfo.streakDays}🔥</span>
                        <span class="stat-lbl">Συνεχόμενες ημέρες</span>
                    </div>
                </div>

                <div class="summary-actions">
                    <button class="game-btn secondary-btn" onclick="appEngine.practice.startSession('all', 'all', true)">
                        🔁 Επανάληψη αδύναμων σημείων
                    </button>
                    <button class="game-btn" onclick="appEngine.setAppMode('practice')">
                        ✅ Ολοκλήρωση για σήμερα
                    </button>
                </div>
            </div>
        `;
    }
}

window.PracticeManager = PracticeManager;
