/**
 * Practice Manager for en-irregular-verbs
 * Implements 4 distinct practice modes:
 * 1. Flashcard Mode (base form prompt -> flip card to reveal past_simple + past_participle)
 * 2. Fill-the-blank Mode (complete sentences with correct past_simple or past_participle form)
 * 3. Timed Sprint Mode (60s rapid-fire drill for base -> past simple / past participle)
 * 4. Pattern-Grouped Deck Mode (mnemonic drill restricted to a chosen pattern group)
 */

class PracticeManager {
    constructor(engine, srsStore) {
        this.engine = engine;
        this.srsStore = srsStore;
        this.activeMode = 'flashcard'; // 'flashcard' | 'blank' | 'sprint' | 'pattern'
        this.currentSession = [];
        this.currentIndex = 0;
        this.sessionScore = 0;
        this.sessionCorrectItems = [];
        this.sessionWrongItems = [];
        this.masteredThisSession = [];
        this.activeQuestion = null;

        // Timed sprint state
        this.sprintTimer = null;
        this.sprintTimeLeft = 60;
        this.sprintStreak = 0;
        this.sprintActive = false;

        // Pattern filter state
        this.selectedPatternGroup = 'all';
    }

    setPracticeMode(mode) {
        this.activeMode = mode;
        if (this.sprintTimer) {
            clearInterval(this.sprintTimer);
            this.sprintTimer = null;
            this.sprintActive = false;
        }

        // Highlight tab
        ['flashcard', 'blank', 'sprint', 'pattern'].forEach(m => {
            const btn = document.getElementById(`pmode-${m}-btn`);
            if (btn) {
                if (m === mode) btn.classList.add('active');
                else btn.classList.remove('active');
            }
        });

        // Show/hide pattern selector bar
        const patternSelector = document.getElementById('practice-pattern-bar');
        if (patternSelector) {
            patternSelector.style.display = (mode === 'pattern') ? 'flex' : 'none';
        }

        this.startSession();
    }

    setPatternGroupFilter(group) {
        this.selectedPatternGroup = group;

        ['all', 'no_change', 'vowel_change', 'same_past_participle', 'totally_irregular', 'add_en_or_n'].forEach(g => {
            const chip = document.getElementById(`pchip-${g}`);
            if (chip) {
                if (g === group) chip.classList.add('active');
                else chip.classList.remove('active');
            }
        });

        this.startSession();
    }

    startSession(targetLevel = 'all', isWeakSpotOnly = false) {
        if (this.sprintTimer) {
            clearInterval(this.sprintTimer);
            this.sprintTimer = null;
            this.sprintActive = false;
        }

        let patternGroup = 'all';
        if (this.activeMode === 'pattern') {
            patternGroup = this.selectedPatternGroup;
        }

        let pool = [];
        if (isWeakSpotOnly) {
            pool = this.srsStore.getWeakCandidates(this.engine.verbDb);
        } else {
            pool = this.srsStore.getDueCandidatePool(this.engine.verbDb, targetLevel, patternGroup);
        }

        if (pool.length === 0) {
            pool = this.srsStore.getDueCandidatePool(this.engine.verbDb, 'all', 'all');
        }

        this.currentSession = pool;
        this.currentIndex = 0;
        this.sessionScore = 0;
        this.sessionCorrectItems = [];
        this.sessionWrongItems = [];
        this.masteredThisSession = [];

        if (this.activeMode === 'sprint') {
            this.startTimedSprint();
        } else {
            this.renderQuestion();
        }
    }

    renderQuestion() {
        const practiceContainer = document.getElementById('practice-card-content');
        if (!practiceContainer) return;

        if (this.currentIndex >= this.currentSession.length) {
            this.finishSession();
            return;
        }

        const item = this.currentSession[this.currentIndex];
        const verb = item.entry;

        if (this.activeMode === 'flashcard') {
            this.renderFlashcardQuestion(item, verb);
        } else if (this.activeMode === 'blank') {
            this.renderFillBlankQuestion(item, verb);
        } else if (this.activeMode === 'pattern') {
            this.renderPatternQuestion(item, verb);
        }
    }

    /* ── 1. FLASHCARD MODE ── */
    renderFlashcardQuestion(item, verb) {
        const practiceContainer = document.getElementById('practice-card-content');
        this.activeQuestion = { item, verb, flipped: false };

        const patternLabels = {
            "no_change": "No Change (cut-cut-cut)",
            "vowel_change": "Vowel Change (sing-sang-sung)",
            "same_past_participle": "Same Past Participle (buy-bought-bought)",
            "totally_irregular": "Totally Irregular (go-went-gone)",
            "add_en_or_n": "Add -en / -n (speak-spoke-spoken)"
        };

        practiceContainer.innerHTML = `
            <div class="question-header">
                <div class="meta-info">
                    <span class="badge cefr-badge">Level: ${verb.level}</span>
                    <span class="progress-count">Card ${this.currentIndex + 1} of ${Math.min(10, this.currentSession.length)}</span>
                </div>
            </div>

            <div class="flashcard-wrapper" onclick="appEngine.practice.flipCard()">
                <div id="flashcard-card" class="flashcard-inner">
                    <div class="flashcard-front">
                        <span class="prompt-badge mc-badge">🃏 Flashcard — Base Form</span>
                        <div class="flashcard-prompt">${verb.base}</div>
                        <p class="flashcard-hint"><em>${verb.definition}</em></p>
                        <p style="margin-top: 1rem; font-size: 0.85rem; color: var(--sage-primary); font-weight: 700;">👆 Click card to flip and reveal forms</p>
                    </div>

                    <div class="flashcard-back">
                        <span class="flashcard-pattern-tag">Pattern: ${patternLabels[verb.pattern_group] || verb.pattern_group}</span>
                        <div class="flashcard-answers-grid">
                            <div class="form-stat-card">
                                <div class="form-label">Past Simple (V2)</div>
                                <div class="form-value">${verb.past_simple}</div>
                            </div>
                            <div class="form-stat-card">
                                <div class="form-label">Past Participle (V3)</div>
                                <div class="form-value">${verb.past_participle}</div>
                            </div>
                        </div>
                        <div style="margin-top: 0.75rem; font-size: 0.88rem; color: var(--ink-muted);">
                            3rd Person: <strong>${verb.third_person_singular}</strong>
                        </div>
                    </div>
                </div>
            </div>

            <div id="flashcard-eval-buttons" class="flashcard-actions" style="display: none;">
                <button class="game-btn secondary-btn" style="background: rgba(200, 90, 50, 0.12) !important; color: var(--terracotta) !important; flex: 1;" onclick="appEngine.practice.rateFlashcard(false)">
                    ❌ Hard / Forgot
                </button>
                <button class="game-btn" style="flex: 1;" onclick="appEngine.practice.rateFlashcard(true)">
                    ✅ Easy / Remembered
                </button>
            </div>
        `;
    }

    flipCard() {
        const card = document.getElementById('flashcard-card');
        const evalBtns = document.getElementById('flashcard-eval-buttons');
        if (card) {
            card.classList.toggle('flipped');
            if (evalBtns) {
                evalBtns.style.display = card.classList.contains('flipped') ? 'flex' : 'none';
            }
        }
    }

    rateFlashcard(isCorrect) {
        if (!this.activeQuestion) return;
        const item = this.activeQuestion.item;
        const newProg = this.srsStore.recordAnswer(item.key, isCorrect);

        if (isCorrect) {
            this.sessionScore += 10;
            this.sessionCorrectItems.push(item);
            if (newProg.masteryLevel >= 4) this.masteredThisSession.push(item);
        } else {
            this.sessionWrongItems.push(item);
        }

        this.currentIndex += 1;
        if (this.currentIndex >= Math.min(10, this.currentSession.length)) {
            this.finishSession();
        } else {
            this.renderQuestion();
        }
    }

    /* ── 2. FILL-IN-THE-BLANK MODE ── */
    renderFillBlankQuestion(item, verb) {
        const practiceContainer = document.getElementById('practice-card-content');

        // Choose sentence target tense: 'past_simple' or 'past_participle'
        const exList = verb.examples || [];
        let targetSentence = exList[1] || exList[0] || `They [${verb.base}] yesterday.`;
        let targetForm = 'past_simple';
        let targetAns = verb.past_simple;

        // If example sentence 3 (usually contains present perfect / past participle), pick past_participle
        if (exList.length >= 3 && Math.random() > 0.5) {
            targetSentence = exList[2];
            targetForm = 'past_participle';
            targetAns = verb.past_participle;
        }

        // Build blank sentence by replacing target answer or base form
        let blankSentence = targetSentence;
        const regAns = new RegExp(`\\b${targetAns.replace(/[\/]/g, '|')}\\b`, 'gi');
        if (regAns.test(blankSentence)) {
            blankSentence = blankSentence.replace(regAns, `<strong class="blank-spot">[ ___ ]</strong>`);
        } else {
            // Fallback replace base form
            blankSentence = blankSentence.replace(new RegExp(`\\b${verb.base}\\b`, 'gi'), `<strong class="blank-spot">[ ___ ]</strong>`);
        }

        this.activeQuestion = { item, verb, targetForm, targetAns };

        practiceContainer.innerHTML = `
            <div class="question-header">
                <div class="meta-info">
                    <span class="badge cefr-badge">Level: ${verb.level}</span>
                    <span class="progress-count">Item ${this.currentIndex + 1} of ${Math.min(10, this.currentSession.length)}</span>
                </div>
            </div>

            <div class="blank-prompt">
                <span class="prompt-badge blank-badge">💡 Complete Sentence (${targetForm === 'past_simple' ? 'Past Simple V2' : 'Past Participle V3'})</span>
                <h3>Base Form: <strong style="color: var(--sage-dark);">${verb.base}</strong></h3>
                <p class="sentence-box">"${blankSentence}"</p>
            </div>

            <div style="display: flex; gap: 0.5rem; margin-bottom: 1.25rem;">
                <input type="text" id="blank-answer-input" class="sprint-input-group" style="flex: 1; padding: 0.8rem 1rem; border-radius: 12px; border: 2px solid var(--border-color); font-size: 1.1rem; outline: none;" placeholder="Type the correct ${targetForm === 'past_simple' ? 'Past Simple' : 'Past Participle'} form..." autocomplete="off" autofocus onkeydown="if(event.key==='Enter') appEngine.practice.checkBlankAnswer()">
                <button class="game-btn" style="width: auto; padding: 0.8rem 1.5rem;" onclick="appEngine.practice.checkBlankAnswer()">Check ➔</button>
            </div>

            <div id="practice-feedback-box" class="inline-feedback-card" style="display: none;"></div>
            <button id="practice-next-btn" class="game-btn" style="display: none;" onclick="appEngine.practice.nextQuestion()">Continue ➔</button>
        `;
    }

    checkBlankAnswer() {
        if (!this.activeQuestion) return;

        const input = document.getElementById('blank-answer-input');
        if (!input) return;

        const typed = input.value.trim().toLowerCase();
        const item = this.activeQuestion.item;
        const verb = this.activeQuestion.verb;
        const expected = this.activeQuestion.targetAns.toLowerCase();

        // Support slashed answers e.g. "was/were"
        const expectedOptions = expected.split('/').map(s => s.trim());
        const isCorrect = expectedOptions.includes(typed);

        const feedbackBox = document.getElementById('practice-feedback-box');
        const nextBtn = document.getElementById('practice-next-btn');

        const newProg = this.srsStore.recordAnswer(item.key, isCorrect);

        if (isCorrect) {
            this.sessionScore += 10;
            this.sessionCorrectItems.push(item);
            if (newProg.masteryLevel >= 4) this.masteredThisSession.push(item);

            feedbackBox.className = 'inline-feedback-card feedback-correct';
            feedbackBox.innerHTML = `
                <div class="feedback-title">✅ Correct! (${this.activeQuestion.targetAns})</div>
                <div class="feedback-srs-info">⭐ Mastery: Level ${newProg.masteryLevel}/5</div>
                <div class="feedback-rule">📌 Forms: Base: <strong>${verb.base}</strong> | Past Simple: <strong>${verb.past_simple}</strong> | Past Participle: <strong>${verb.past_participle}</strong></div>
            `;
        } else {
            this.sessionWrongItems.push(item);

            feedbackBox.className = 'inline-feedback-card feedback-wrong';
            feedbackBox.innerHTML = `
                <div class="feedback-title">❌ Incorrect! Expected: <strong>${this.activeQuestion.targetAns}</strong></div>
                <div class="feedback-srs-info">⭐ Mastery: Level ${newProg.masteryLevel}/5</div>
                <div class="feedback-rule">📌 Forms: Base: <strong>${verb.base}</strong> | Past Simple: <strong>${verb.past_simple}</strong> | Past Participle: <strong>${verb.past_participle}</strong></div>
            `;
        }

        feedbackBox.style.display = 'block';
        input.disabled = true;
        if (nextBtn) nextBtn.style.display = 'block';
    }

    /* ── 3. TIMED SPRINT MODE ── */
    startTimedSprint() {
        this.sprintTimeLeft = 60;
        this.sprintScore = 0;
        this.sprintStreak = 0;
        this.sprintActive = true;

        const practiceContainer = document.getElementById('practice-card-content');
        if (!practiceContainer) return;

        if (this.sprintTimer) clearInterval(this.sprintTimer);

        this.sprintTimer = setInterval(() => {
            this.sprintTimeLeft -= 1;
            const timerEl = document.getElementById('sprint-timer-val');
            if (timerEl) timerEl.textContent = `${this.sprintTimeLeft}s`;

            if (this.sprintTimeLeft <= 0) {
                clearInterval(this.sprintTimer);
                this.sprintTimer = null;
                this.sprintActive = false;
                this.finishSession();
            }
        }, 1000);

        this.renderSprintQuestion();
    }

    renderSprintQuestion() {
        if (!this.sprintActive) return;

        const practiceContainer = document.getElementById('practice-card-content');
        if (!practiceContainer) return;

        if (this.currentIndex >= this.currentSession.length) {
            this.currentIndex = 0; // Loop pool
        }

        const item = this.currentSession[this.currentIndex];
        const verb = item.entry;

        this.activeQuestion = { item, verb };

        practiceContainer.innerHTML = `
            <div class="sprint-header-bar">
                <div class="sprint-timer">
                    ⏳ Time Left: <span id="sprint-timer-val">${this.sprintTimeLeft}s</span>
                </div>
                <div class="sprint-score-widget">
                    Score: <strong>${this.sessionScore}</strong> | Streak: 🔥<strong>${this.sprintStreak}</strong>
                </div>
            </div>

            <div class="sprint-prompt-card">
                <span class="prompt-badge mc-badge">⚡ Timed Sprint — Enter Past Forms</span>
                <div class="sprint-prompt-word">${verb.base}</div>
                <p class="flashcard-hint"><em>${verb.definition}</em></p>
            </div>

            <div class="sprint-inputs-form">
                <div class="sprint-input-group">
                    <label>Past Simple (V2):</label>
                    <input type="text" id="sprint-v2-input" autocomplete="off" autofocus placeholder="e.g. ${verb.past_simple.includes('/') ? verb.past_simple.split('/')[0] : 'went'}">
                </div>
                <div class="sprint-input-group">
                    <label>Past Participle (V3):</label>
                    <input type="text" id="sprint-v3-input" autocomplete="off" placeholder="e.g. gone" onkeydown="if(event.key==='Enter') appEngine.practice.checkSprintAnswer()">
                </div>
            </div>

            <button class="game-btn" onclick="appEngine.practice.checkSprintAnswer()">Submit &amp; Next ➔</button>
            <div id="practice-feedback-box" class="inline-feedback-card" style="display: none; margin-top: 1rem;"></div>
        `;
    }

    checkSprintAnswer() {
        if (!this.activeQuestion || !this.sprintActive) return;

        const v2Input = document.getElementById('sprint-v2-input');
        const v3Input = document.getElementById('sprint-v3-input');

        if (!v2Input || !v3Input) return;

        const typedV2 = v2Input.value.trim().toLowerCase();
        const typedV3 = v3Input.value.trim().toLowerCase();

        const item = this.activeQuestion.item;
        const verb = this.activeQuestion.verb;

        const expectedV2Opts = verb.past_simple.toLowerCase().split('/').map(s => s.trim());
        const expectedV3Opts = verb.past_participle.toLowerCase().split('/').map(s => s.trim());

        const v2Correct = expectedV2Opts.includes(typedV2);
        const v3Correct = expectedV3Opts.includes(typedV3);
        const isCorrect = v2Correct && v3Correct;

        this.srsStore.recordAnswer(item.key, isCorrect);

        if (isCorrect) {
            this.sessionScore += 20;
            this.sprintStreak += 1;
            this.sessionCorrectItems.push(item);
        } else {
            this.sprintStreak = 0;
            this.sessionWrongItems.push(item);
        }

        this.currentIndex += 1;
        this.renderSprintQuestion();
    }

    /* ── 4. PATTERN-GROUPED DECK MODE ── */
    renderPatternQuestion(item, verb) {
        // Uses multiple choice or fill format focused on pattern group memory
        const practiceContainer = document.getElementById('practice-card-content');
        this.activeQuestion = { item, verb };

        const patternLabels = {
            "no_change": "No Change (cut - cut - cut)",
            "vowel_change": "Vowel Change (sing - sang - sung)",
            "same_past_participle": "Same Past Participle (buy - bought - bought)",
            "totally_irregular": "Totally Irregular (go - went - gone)",
            "add_en_or_n": "Add -en / -n (speak - spoke - spoken)"
        };

        // Pick 4 multiple choice sets of (Past Simple / Past Participle)
        const correctCombo = `${verb.past_simple} / ${verb.past_participle}`;
        const distractors = [];

        // Generate 3 plausible distractors from database
        const verbKeys = Object.keys(this.engine.verbDb);
        while (distractors.length < 3) {
            const randKey = verbKeys[Math.floor(Math.random() * verbKeys.length)];
            const randVerb = this.engine.verbDb[randKey];
            const combo = `${randVerb.past_simple} / ${randVerb.past_participle}`;
            if (combo !== correctCombo && !distractors.includes(combo)) {
                distractors.push(combo);
            }
        }

        const choices = [correctCombo, ...distractors].sort(() => Math.random() - 0.5);

        const choiceBtnsHtml = choices.map(choice => `
            <button class="choice-btn" onclick="appEngine.practice.checkPatternChoice('${choice.replace(/'/g, "\\'")}')">
                ${choice}
            </button>
        `).join('');

        practiceContainer.innerHTML = `
            <div class="question-header">
                <div class="meta-info">
                    <span class="pattern-group-badge">Pattern: ${patternLabels[verb.pattern_group] || verb.pattern_group}</span>
                    <span class="progress-count">Item ${this.currentIndex + 1} of ${Math.min(10, this.currentSession.length)}</span>
                </div>
            </div>

            <div class="mc-prompt">
                <span class="prompt-badge mc-badge">🧩 Pattern Deck — Select Correct Past Forms</span>
                <h3>${verb.base}</h3>
                <p class="definition-hint"><em>${verb.definition}</em></p>
            </div>

            <div class="choice-grid">
                ${choiceBtnsHtml}
            </div>

            <div id="practice-feedback-box" class="inline-feedback-card" style="display: none;"></div>
            <button id="practice-next-btn" class="game-btn" style="display: none;" onclick="appEngine.practice.nextQuestion()">Continue ➔</button>
        `;
    }

    checkPatternChoice(userChoice) {
        if (!this.activeQuestion) return;

        const item = this.activeQuestion.item;
        const verb = this.activeQuestion.verb;
        const expectedCombo = `${verb.past_simple} / ${verb.past_participle}`;
        const isCorrect = userChoice.trim().toLowerCase() === expectedCombo.toLowerCase();

        const feedbackBox = document.getElementById('practice-feedback-box');
        const nextBtn = document.getElementById('practice-next-btn');
        const choiceGrid = document.querySelector('.choice-grid');

        const newProg = this.srsStore.recordAnswer(item.key, isCorrect);

        if (isCorrect) {
            this.sessionScore += 10;
            this.sessionCorrectItems.push(item);
            if (newProg.masteryLevel >= 4) this.masteredThisSession.push(item);

            feedbackBox.className = 'inline-feedback-card feedback-correct';
            feedbackBox.innerHTML = `
                <div class="feedback-title">✅ Correct! (${expectedCombo})</div>
                <div class="feedback-srs-info">⭐ Mastery: Level ${newProg.masteryLevel}/5</div>
            `;
        } else {
            this.sessionWrongItems.push(item);

            feedbackBox.className = 'inline-feedback-card feedback-wrong';
            feedbackBox.innerHTML = `
                <div class="feedback-title">❌ Incorrect! Correct form: <strong>${expectedCombo}</strong></div>
                <div class="feedback-srs-info">⭐ Mastery: Level ${newProg.masteryLevel}/5</div>
            `;
        }

        feedbackBox.style.display = 'block';
        if (choiceGrid) choiceGrid.style.pointerEvents = 'none';
        if (nextBtn) nextBtn.style.display = 'block';
    }

    nextQuestion() {
        this.currentIndex += 1;
        this.renderQuestion();
    }

    finishSession() {
        if (this.sprintTimer) {
            clearInterval(this.sprintTimer);
            this.sprintTimer = null;
        }

        this.srsStore.recordSessionCompletion();

        const practiceContainer = document.getElementById('practice-card-content');
        if (!practiceContainer) return;

        const streakInfo = this.srsStore.getStreakInfo();

        practiceContainer.innerHTML = `
            <div class="session-summary-box">
                <span class="summary-icon">🎉</span>
                <h3>Practice Round Complete!</h3>
                <p>Great job! You scored <strong>${this.sessionScore}</strong> points in this session.</p>

                <div class="summary-stats-grid">
                    <div class="stat-box">
                        <span class="stat-num">${this.sessionScore}</span>
                        <span class="stat-lbl">Points Earned</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-num">${this.masteredThisSession.length}</span>
                        <span class="stat-lbl">Verbs Mastered</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-num">${streakInfo.streakDays}🔥</span>
                        <span class="stat-lbl">Daily Streak</span>
                    </div>
                </div>

                <div class="summary-actions">
                    <button class="game-btn secondary-btn" onclick="appEngine.practice.startSession('all', true)">
                        🔁 Review Weak Spots Now
                    </button>
                    <button class="game-btn" onclick="appEngine.setAppMode('practice')">
                        ✅ Done for Today
                    </button>
                </div>
            </div>
        `;
    }
}

window.PracticeManager = PracticeManager;
