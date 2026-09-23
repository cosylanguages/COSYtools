/**
 * Practice Manager for en-verb-prep
 * Uses PracticeEngine shared base class for 10-item sessions, question formats (fill-in-blank, pick-correct, spot-mistake),
 * immediate inline feedback, session summary, weak-spot reviews, and cross-family nudges.
 */

class PracticeManager extends PracticeEngine {
    constructor(engine, srsStore) {
        super({
            engine: engine,
            srsStore: srsStore,
            containerId: 'practice-card-content',
            sessionLength: 10,
            onSessionComplete: (practice) => this.renderSessionSummary()
        });

        this.registerFormat('mc', (item, format, container) => this.renderVerbPrepQuestion(item, 'mc', container));
        this.registerFormat('blank', (item, format, container) => this.renderVerbPrepQuestion(item, 'blank', container));
        this.registerFormat('spot_mistake', (item, format, container) => this.renderVerbPrepQuestion(item, 'spot_mistake', container));
    }

    renderVerbPrepQuestion(item, format, container) {
        const data = item.entry || item.data;
        const rawKey = item.key;
        const type = item.type;

        // Clean prompt word to avoid leaking trailing preposition in key name
        let promptWord = rawKey;
        if (data.prepositions && data.prepositions.length > 0 && data.prepositions[0] !== 'none') {
            for (const p of data.prepositions) {
                if (p === 'none') continue;
                const reg = new RegExp(`\\s+${p.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, 'i');
                if (reg.test(promptWord)) {
                    promptWord = promptWord.replace(reg, '');
                    break;
                }
            }
            promptWord = promptWord.trim();
        }

        const primaryPrep = data.prepositions?.[0] || 'none';
        const prepPool = ['on', 'in', 'at', 'for', 'to', 'from', 'with', 'about', 'of', 'none'];

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
            choices: choices
        };

        let questionPromptHtml = '';

        if (format === 'spot_mistake' && data.common_mistake) {
            questionPromptHtml = `
                <div class="mistake-spot-prompt">
                    <span class="prompt-badge spot-badge">⚠️ Spot &amp; Fix Pitfall</span>
                    <h4>Identify the correct pattern for: <strong class="highlight-word">${promptWord}</strong></h4>
                    <p class="mistake-line">${data.common_mistake.split('➜')[0] || data.common_mistake}</p>
                </div>
            `;
        } else if (format === 'blank' && data.examples?.[0]) {
            const ex = data.examples[0];
            let blankSentence = ex;
            if (primaryPrep !== 'none') {
                const reg = new RegExp(`\\b${primaryPrep}\\b`, 'i');
                blankSentence = ex.replace(reg, '<strong class="blank-spot">[ ___ ]</strong>');
            } else {
                blankSentence = ex.replace(new RegExp(`\\b${promptWord}\\b`, 'i'), `${promptWord} <strong class="blank-spot">[ ___ ]</strong>`);
            }
            questionPromptHtml = `
                <div class="blank-prompt">
                    <span class="prompt-badge blank-badge">💡 Complete the Sentence</span>
                    <h3>${promptWord}</h3>
                    <p class="sentence-box">"${blankSentence}"</p>
                </div>
            `;
        } else {
            questionPromptHtml = `
                <div class="mc-prompt">
                    <span class="prompt-badge mc-badge">🎯 Dependent Preposition</span>
                    <h3>${promptWord}</h3>
                    <p class="definition-hint"><em>${data.definition || ''}</em></p>
                </div>
            `;
        }

        let typeBadgeLabel = type.toUpperCase();
        if (type === 'verbs') typeBadgeLabel = data.is_phrasal ? 'Phrasal Verb 🧩' : 'Verb 🏃';
        else if (type === 'nouns') typeBadgeLabel = 'Noun 📦';
        else if (type === 'adjectives') typeBadgeLabel = 'Adjective 🎨';

        const choiceButtonsHtml = choices.map(choice => `
            <button class="choice-btn" onclick="appEngine.practice.checkAnswer('${choice}')">
                ${choice === 'none' ? 'No Preposition (Direct)' : choice}
            </button>
        `).join('');

        container.innerHTML = `
            <div class="question-header">
                <div class="meta-info">
                    <span class="badge type-badge">${typeBadgeLabel}</span>
                    <span class="badge cefr-badge">Level: ${data.level}</span>
                    <span class="progress-count">Item ${this.currentIndex + 1} of ${this.currentSession.length}</span>
                </div>
            </div>

            ${questionPromptHtml}

            <div class="choice-grid">
                ${choiceButtonsHtml}
            </div>

            <div id="practice-feedback-box" class="inline-feedback-card" style="display: none;"></div>
            <button id="practice-next-btn" class="game-btn" style="display: none;" onclick="appEngine.practice.nextQuestion()">Continue ➔</button>
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
                <div class="feedback-title">✅ Correct! (${expected === 'none' ? 'No Preposition' : expected})</div>
                <div class="feedback-srs-info" style="margin: 0.25rem 0; font-weight: 600; font-size: 0.9rem;">⭐ Mastery: Level ${newProg.masteryLevel}/5</div>
                <div class="feedback-rule">📌 Rule: ${entry.grammar_rule}</div>
            `;
        } else {
            feedbackBox.className = 'inline-feedback-card feedback-wrong';
            feedbackBox.innerHTML = `
                <div class="feedback-title">❌ Incorrect! Correct choice: <strong>${expected === 'none' ? 'No Preposition (Direct)' : expected}</strong></div>
                <div class="feedback-srs-info" style="margin: 0.25rem 0; font-weight: 600; font-size: 0.9rem;">⭐ Mastery: Level ${newProg.masteryLevel}/5</div>
                <div class="feedback-rule">📌 Rule: ${entry.grammar_rule}</div>
                ${entry.common_mistake ? `<div class="feedback-mistake">⚠️ Pitfall Fix: ${entry.common_mistake}</div>` : ''}
            `;
        }

        feedbackBox.style.display = 'block';
        if (choiceGrid) choiceGrid.style.pointerEvents = 'none';
        if (nextBtn) nextBtn.style.display = 'block';
    }

    renderSessionSummary() {
        const practiceContainer = this.getContainer();
        if (!practiceContainer) return;

        // Check for cross-family nudge
        let nudgeHtml = '';
        if (this.masteredThisSession.length > 0) {
            const masteredItem = this.masteredThisSession[0];
            const entry = masteredItem.entry || masteredItem.data;
            const contrastText = entry.related_forms || entry.noun_parallel;
            if (contrastText) {
                const crossRefs = this.engine.extractCrossReferences(contrastText, masteredItem.type);
                if (crossRefs.length > 0) {
                    const ref = crossRefs[0];
                    nudgeHtml = `
                        <div class="nudge-card">
                            <span class="nudge-icon">💡</span>
                            <div>
                                <strong>Did you know?</strong>
                                <p>You mastered <em>${masteredItem.key}</em>! Check out the related form:</p>
                                <button class="xref-chip" onclick="appEngine.practice.triggerNudge('${ref.type}', '${ref.key.replace(/'/g, "\\'")}')">
                                    ${ref.label}
                                </button>
                            </div>
                        </div>
                    `;
                }
            }
        }

        const streakInfo = this.srsStore ? this.srsStore.getStreakInfo() : { streakDays: 0, todayCount: 0, goal: 10 };

        practiceContainer.innerHTML = `
            <div class="session-summary-box">
                <span class="summary-icon">🎉</span>
                <h3>Practice Round Complete!</h3>
                <p>Great job! You answered ${this.sessionCorrectItems.length} out of ${this.currentSession.length} correctly.</p>

                <div class="summary-stats-grid">
                    <div class="stat-box">
                        <span class="stat-num">${this.sessionScore}</span>
                        <span class="stat-lbl">Points Earned</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-num">${this.masteredThisSession.length}</span>
                        <span class="stat-lbl">Words Mastered</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-num">${streakInfo.streakDays}🔥</span>
                        <span class="stat-lbl">Daily Streak</span>
                    </div>
                </div>

                ${nudgeHtml}

                <div class="summary-actions">
                    <button class="game-btn secondary-btn" onclick="appEngine.practice.startSession('all', 'all', true)">
                        🔁 Review Weak Spots Now
                    </button>
                    <button class="game-btn" onclick="appEngine.setAppMode('practice')">
                        ✅ Done for Today
                    </button>
                </div>
            </div>
        `;
    }

    triggerNudge(targetType, targetKey) {
        this.engine.setAppMode('lookup');
        this.engine.navigateToCrossReference(targetType, targetKey);
    }
}

window.PracticeManager = PracticeManager;
