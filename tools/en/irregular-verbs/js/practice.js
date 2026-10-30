/**
 * Practice Manager for en-irregular-verbs
 * Extends PracticeEngine shared base class for 4 distinct practice modes:
 * 1. Flashcard Mode (base form prompt -> flip card to reveal past_simple + past_participle)
 * 2. Fill-the-blank Mode (complete sentences with correct past_simple or past_participle form)
 * 3. Timed Sprint Mode (60s rapid-fire drill for base -> past simple / past participle)
 * 4. Pattern-Grouped Deck Mode (mnemonic drill restricted to a chosen pattern group)
 */

class PracticeManager extends PracticeEngine {
    constructor(engine, srsStore) {
        super({
            engine: engine,
            srsStore: srsStore,
            containerId: 'practice-card-content',
            sessionLength: 10,
            poolProvider: (targetLevel, targetType, isWeakSpotOnly) => {
                let patternGroup = 'all';
                let effectiveLevel = targetLevel;
                if (this.activeMode === 'present_top10') {
                    effectiveLevel = 'all';
                } else if (this.activeMode === 'pattern') {
                    patternGroup = this.selectedPatternGroup;
                }

                let pool = [];
                if (isWeakSpotOnly) {
                    pool = this.srsStore.getWeakCandidates(this.engine.verbDb);
                } else {
                    pool = this.srsStore.getDueCandidatePool(this.engine.verbDb, effectiveLevel, patternGroup);
                }

                if (this.activeMode === 'present_top10') {
                    pool = pool.filter(item => {
                        const verb = item.entry || item.data;
                        const key = (item.key || (verb && (verb.base || verb.en_lemma || verb.infinitive)) || '').toLowerCase();
                        return this.top10Lemmas.includes(key);
                    });
                } else if (this.selectedFormPattern !== 'all') {
                    pool = pool.filter(item => this.engine.getFormPattern(item.entry || item.data).key === this.selectedFormPattern);
                }

                if (pool.length === 0) {
                    pool = this.srsStore.getDueCandidatePool(this.engine.verbDb, 'all', 'all');
                    if (this.activeMode === 'present_top10') {
                        pool = pool.filter(item => {
                            const verb = item.entry || item.data;
                            const key = (item.key || (verb && (verb.base || verb.en_lemma || verb.infinitive)) || '').toLowerCase();
                            return this.top10Lemmas.includes(key);
                        });
                    } else if (this.selectedFormPattern !== 'all') {
                        pool = pool.filter(item => this.engine.getFormPattern(item.entry || item.data).key === this.selectedFormPattern);
                    }
                }
                return pool;
            }
        });

        this.activeMode = 'present_top10'; // 'present_top10' | 'flashcard' | 'blank' | 'sprint' | 'pattern'

        // Timed sprint state
        this.sprintTimer = null;
        this.sprintTimeLeft = 60;
        this.sprintStreak = 0;
        this.sprintActive = false;

        // Pattern filter state
        this.selectedPatternGroup = 'all';
        this.selectedFormPattern = 'all';

        this.top10Lemmas = ['be', 'have', 'think', 'know', 'like', 'want', 'work', 'study', 'go', 'can', 'eat', 'drink'];

        this.registerFormat('present_top10', (item, format, container) => this.renderPresentTop10Question(item, item.entry || item.data));
        this.registerFormat('flashcard', (item, format, container) => this.renderFlashcardQuestion(item, item.entry || item.data));
        this.registerFormat('blank', (item, format, container) => this.renderFillBlankQuestion(item, item.entry || item.data));
        this.registerFormat('sprint', (item, format, container) => this.renderSprintQuestion());
        this.registerFormat('pattern', (item, format, container) => this.renderPatternQuestion(item, item.entry || item.data));
    }

    setPracticeMode(mode) {
        this.activeMode = mode;
        if (this.sprintTimer) {
            clearInterval(this.sprintTimer);
            this.sprintTimer = null;
            this.sprintActive = false;
        }

        // Highlight tab
        ['present_top10', 'flashcard', 'blank', 'sprint', 'pattern'].forEach(m => {
            const btn = document.getElementById(`pmode-${m}-btn`);
            if (btn) {
                if (m === mode) btn.classList.add('active');
                else btn.classList.remove('active');
            }
        });

        // Show/hide pattern selector bar
        const patternSelector = document.getElementById('practice-pattern-bar');
        const formPatternSelector = document.getElementById('practice-form-pattern-bar');
        if (patternSelector) {
            patternSelector.style.display = (mode === 'pattern') ? 'flex' : 'none';
        }
        if (formPatternSelector) {
            formPatternSelector.style.display = (mode === 'pattern') ? 'flex' : 'none';
        }

        this.startSession();
    }

    setFormPatternFilter(pattern) {
        this.selectedFormPattern = pattern;

        ['all', 'aaa', 'aba', 'abb', 'abc'].forEach(key => {
            const chip = document.getElementById(`fpchip-${key}`);
            if (chip) chip.classList.toggle('active', key === pattern);
        });

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

        super.startSession(targetLevel, 'all', isWeakSpotOnly);

        if (this.activeMode === 'sprint') {
            this.startTimedSprint();
        }
    }

    renderQuestion() {
        const practiceContainer = this.getContainer();
        if (!practiceContainer) return;

        if (this.currentIndex >= this.currentSession.length) {
            this.finishSession();
            return;
        }

        const item = this.currentSession[this.currentIndex];
        const verb = item.entry || item.data;

        if (this.activeMode === 'present_top10') {
            this.renderPresentTop10Question(item, verb);
        } else if (this.activeMode === 'flashcard') {
            this.renderFlashcardQuestion(item, verb);
        } else if (this.activeMode === 'blank') {
            this.renderFillBlankQuestion(item, verb);
        } else if (this.activeMode === 'pattern') {
            this.renderPatternQuestion(item, verb);
        }
    }

    /* ── 0. TOP 10 PRESENT TENSE MODE ── */
    getPresentPrompt(verb, pronoun) {
        const lemma = (verb.base || verb.en_lemma || verb.infinitive || '').toLowerCase();
        const prompts = {
            be: {
                I: { sentence: "I [___] Maya and I am a doctor.", expected: "am" },
                you: { sentence: "You [___] early for class today!", expected: "are" },
                "he/she/it": { sentence: "She [___] 25 years old and she is at home.", expected: "is" },
                we: { sentence: "We [___] ready for practice.", expected: "are" },
                they: { sentence: "They [___] happy with the results.", expected: "are" }
            },
            have: {
                I: { sentence: "I [___] two brothers and a nice phone.", expected: "have" },
                you: { sentence: "Do you [___] free time this afternoon?", expected: "have" },
                "he/she/it": { sentence: "She [___] blue eyes and a friendly dog.", expected: "has" },
                we: { sentence: "We [___] breakfast together every morning.", expected: "have" },
                they: { sentence: "They [___] a big house in Paris.", expected: "have" }
            },
            think: {
                I: { sentence: "I [___] learning English is a great idea.", expected: "think" },
                you: { sentence: "What do you [___] about this film?", expected: "think" },
                "he/she/it": { sentence: "She [___] carefully before deciding.", expected: "thinks" },
                we: { sentence: "We [___] that this solution is correct.", expected: "think" },
                they: { sentence: "They [___] about the future.", expected: "think" }
            },
            know: {
                I: { sentence: "I [___] the correct answer to question 5.", expected: "know" },
                you: { sentence: "Do you [___] where the train station is?", expected: "know" },
                "he/she/it": { sentence: "He [___] how to drive a car fluently.", expected: "knows" },
                we: { sentence: "We [___] this city very well.", expected: "know" },
                they: { sentence: "They [___] the safety rules at work.", expected: "know" }
            },
            like: {
                I: { sentence: "I [___] Italian food and warm weather.", expected: "like" },
                you: { sentence: "Do you [___] listening to music?", expected: "like" },
                "he/she/it": { sentence: "She [___] reading books before bed.", expected: "likes" },
                we: { sentence: "We [___] traveling in summer.", expected: "like" },
                they: { sentence: "They [___] outdoor sports.", expected: "like" }
            },
            want: {
                I: { sentence: "I [___] a glass of cold water, please.", expected: "want" },
                you: { sentence: "What do you [___] to eat for dinner?", expected: "want" },
                "he/she/it": { sentence: "She [___] to learn English fluently.", expected: "wants" },
                we: { sentence: "We [___] to see the new museum.", expected: "want" },
                they: { sentence: "They [___] to buy a new car.", expected: "want" }
            },
            work: {
                I: { sentence: "I [___] at an IT company in Paris.", expected: "work" },
                you: { sentence: "Where do you [___] during the week?", expected: "work" },
                "he/she/it": { sentence: "She [___] hard as an English teacher.", expected: "works" },
                we: { sentence: "We [___] together on this project.", expected: "work" },
                they: { sentence: "They [___] in a quiet office.", expected: "work" }
            },
            study: {
                I: { sentence: "I [___] English grammar every day.", expected: "study" },
                you: { sentence: "Do you [___] at the university?", expected: "study" },
                "he/she/it": { sentence: "He [___] medicine at the university.", expected: "studies" },
                we: { sentence: "We [___] together in the library.", expected: "study" },
                they: { sentence: "They [___] hard for the exam.", expected: "study" }
            },
            go: {
                I: { sentence: "I [___] to work by subway.", expected: "go" },
                you: { sentence: "Where do you [___] on weekends?", expected: "go" },
                "he/she/it": { sentence: "She [___] to school every morning.", expected: "goes" },
                we: { sentence: "We [___] to the park on Sundays.", expected: "go" },
                they: { sentence: "They [___] to the market on foot.", expected: "go" }
            },
            can: {
                I: { sentence: "I [___] speak three languages fluently.", expected: "can" },
                you: { sentence: "[___] you help me with this heavy bag?", expected: "can" },
                "he/she/it": { sentence: "She [___] swim very fast in the pool.", expected: "can" },
                we: { sentence: "We [___] solve this problem together.", expected: "can" },
                they: { sentence: "They [___] play football well.", expected: "can" }
            },
            eat: {
                I: { sentence: "I [___] fresh fruit every morning.", expected: "eat" },
                you: { sentence: "What do you [___] for breakfast?", expected: "eat" },
                "he/she/it": { sentence: "She [___] lunch at 1 o'clock.", expected: "eats" },
                we: { sentence: "We [___] dinner together at home.", expected: "eat" },
                they: { sentence: "They [___] pizza on Friday nights.", expected: "eat" }
            },
            drink: {
                I: { sentence: "I [___] two liters of water every day.", expected: "drink" },
                you: { sentence: "Do you [___] tea or coffee?", expected: "drink" },
                "he/she/it": { sentence: "He [___] black coffee in the morning.", expected: "drinks" },
                we: { sentence: "We [___] hot tea in winter.", expected: "drink" },
                they: { sentence: "They [___] fresh orange juice.", expected: "drink" }
            }
        };

        const verbData = prompts[lemma] || prompts.be;
        return verbData[pronoun] || verbData["he/she/it"] || verbData.I;
    }

    renderPresentTop10Question(item, verb) {
        const practiceContainer = this.getContainer();
        const pronouns = ['I', 'you', 'he/she/it', 'we', 'they'];
        const chosenPronoun = pronouns[Math.floor(Math.random() * pronouns.length)];
        const promptInfo = this.getPresentPrompt(verb, chosenPronoun);

        const lemma = verb.base || verb.en_lemma || verb.infinitive;
        this.activeQuestion = { item, verb, pronoun: chosenPronoun, targetAns: promptInfo.expected, lemma };

        practiceContainer.innerHTML = `
            <div class="question-header">
                <div class="meta-info">
                    <span class="badge cefr-badge">Level: ${verb.level || 'A1'}</span>
                    <span class="progress-count">Item ${this.currentIndex + 1} of ${Math.min(10, this.currentSession.length)}</span>
                </div>
            </div>

            <div class="blank-prompt" style="text-align: center; background: #fdfbf7; padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border-color); margin-bottom: 1.25rem;">
                <span class="prompt-badge blank-badge" style="background: var(--sage-primary); color: #fff; padding: 4px 10px; border-radius: 12px; font-size: 0.82rem; font-weight: bold;">⚡ Present Tense Simple</span>
                <h3 style="margin: 0.75rem 0 0.25rem 0; font-size: 1.4rem; color: var(--sage-dark);">Target Verb: <strong style="color: var(--sage-dark);">${lemma}</strong></h3>
                <p style="color: var(--ink-soft); font-size: 0.92rem; margin-bottom: 1rem;"><em>${verb.definition}</em></p>
                <div class="sentence-box" style="font-size: 1.25rem; font-weight: bold; background: #fff; padding: 1rem; border-radius: 10px; border: 1px solid var(--border-color); color: #1c1917;">
                    "${promptInfo.sentence.replace('[___]', '<strong style="color: var(--sage-primary); text-decoration: underline;">[ ___ ]</strong>')}"
                </div>
            </div>

            <div style="display: flex; gap: 0.5rem; margin-bottom: 1.25rem;">
                <input type="text" id="present-answer-input" class="sprint-input-group" style="flex: 1; padding: 0.85rem 1rem; border-radius: 12px; border: 2px solid var(--border-color); font-size: 1.1rem; outline: none;" placeholder="Type the present simple form for '${chosenPronoun}'..." autocomplete="off" autofocus onkeydown="if(event.key==='Enter') appEngine.practice.checkPresentTop10Answer()" aria-label="Type present tense answer">
                <button class="game-btn" style="width: auto; padding: 0.85rem 1.5rem; background: var(--sage-primary); color: #fff; border-radius: 12px; font-weight: bold; cursor: pointer; border: none;" onclick="appEngine.practice.checkPresentTop10Answer()">Check ➔</button>
            </div>

            <div id="practice-feedback-box" class="inline-feedback-card" style="display: none; padding: 1rem; border-radius: 10px; margin-bottom: 1rem;"></div>
            <button id="practice-next-btn" class="game-btn" style="display: none; width: 100%; padding: 0.85rem;" onclick="appEngine.practice.nextQuestion()">Continue ➔</button>
        `;
    }

    checkPresentTop10Answer() {
        if (!this.activeQuestion) return;

        const input = document.getElementById('present-answer-input');
        if (!input) return;

        const typed = input.value.trim().toLowerCase();
        const item = this.activeQuestion.item;
        const verb = this.activeQuestion.verb;
        const expected = this.activeQuestion.targetAns.toLowerCase();

        const isCorrect = typed === expected;
        const feedbackBox = document.getElementById('practice-feedback-box');
        const nextBtn = document.getElementById('practice-next-btn');

        const newProg = this.srsStore.recordAnswer(item.key, isCorrect);

        if (isCorrect) {
            this.sessionScore += 10;
            this.sessionCorrectItems.push(item);
            if (newProg.masteryLevel >= 4) this.masteredThisSession.push(item);

            feedbackBox.className = 'inline-feedback-card feedback-correct';
            feedbackBox.style.background = '#dcfce7';
            feedbackBox.style.color = '#166534';
            feedbackBox.innerHTML = `
                <div class="feedback-title" style="font-weight: bold; font-size: 1.1rem;">✅ Correct! (${this.activeQuestion.targetAns})</div>
                <div class="feedback-srs-info">⭐ Mastery Level: ${newProg.masteryLevel}/5</div>
                <div class="feedback-rule" style="margin-top: 0.4rem; font-size: 0.9rem;">📌 Rule: In present simple, <strong>${this.activeQuestion.lemma}</strong> takes '<strong>${this.activeQuestion.targetAns}</strong>' for <strong>${this.activeQuestion.pronoun}</strong>.</div>
            `;
        } else {
            this.sessionWrongItems.push(item);

            feedbackBox.className = 'inline-feedback-card feedback-wrong';
            feedbackBox.style.background = '#fee2e2';
            feedbackBox.style.color = '#991b1b';
            feedbackBox.innerHTML = `
                <div class="feedback-title" style="font-weight: bold; font-size: 1.1rem;">❌ Incorrect! Expected: <strong>${this.activeQuestion.targetAns}</strong></div>
                <div class="feedback-srs-info">⭐ Mastery Level: ${newProg.masteryLevel}/5</div>
                <div class="feedback-rule" style="margin-top: 0.4rem; font-size: 0.9rem;">📌 Rule: In present simple, <strong>${this.activeQuestion.lemma}</strong> takes '<strong>${this.activeQuestion.targetAns}</strong>' for <strong>${this.activeQuestion.pronoun}</strong>.</div>
            `;
        }

        feedbackBox.style.display = 'block';
        input.disabled = true;
        if (nextBtn) nextBtn.style.display = 'block';
    }

    /* ── 1. FLASHCARD MODE ── */
    renderFlashcardQuestion(item, verb) {
        const practiceContainer = this.getContainer();
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

            <div class="flashcard-wrapper" role="button" tabindex="0" aria-pressed="false" aria-label="Flashcard: ${verb.base}. Press Enter or Space to flip it and reveal the forms." onclick="appEngine.practice.flipCard()" onkeydown="if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); appEngine.practice.flipCard(); }">
                <div id="flashcard-card" class="flashcard-inner">
                    <div class="flashcard-front">
                        <span class="prompt-badge mc-badge">🃏 Flashcard — Base Form</span>
                        <div class="flashcard-prompt">${verb.base}</div>
                        <p class="flashcard-hint"><em>${verb.definition}</em></p>
                        <p style="margin-top: 1rem; font-size: 0.85rem; color: var(--sage-primary); font-weight: 700;"><span aria-hidden="true">👆</span> Click the card (or press Enter) to flip and reveal forms</p>
                    </div>

                    <div class="flashcard-back">
                        <span class="flashcard-pattern-tag">Pattern: ${patternLabels[verb.pattern_group] || verb.pattern_group}</span>
                        <span class="flashcard-pattern-tag">Form shape: ${this.engine.getFormPattern(verb).label}</span>
                        ${this.engine.getRhymeFamily(verb) ? `<span class="flashcard-pattern-tag">Rhyme family: ${this.engine.getRhymeFamily(verb)}</span>` : ''}
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

            <div id="flashcard-live" role="status" aria-live="polite" style="position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;"></div>
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
            const flipped = card.classList.contains('flipped');
            if (evalBtns) {
                evalBtns.style.display = flipped ? 'flex' : 'none';
            }
            const wrapper = card.closest('.flashcard-wrapper');
            if (wrapper) wrapper.setAttribute('aria-pressed', flipped ? 'true' : 'false');
            // Screen readers cannot see the flip animation: announce the revealed forms
            const live = document.getElementById('flashcard-live');
            if (live) {
                const get = sel => { const el = card.querySelector(sel); return el ? el.textContent.trim() : ''; };
                const vals = [...card.querySelectorAll('.flashcard-back .form-value')].map(e => e.textContent.trim());
                live.textContent = flipped
                    ? `Past simple: ${vals[0] || ''}. Past participle: ${vals[1] || ''}. ${get('.flashcard-back div[style*="margin-top"]')}`
                    : 'Card turned back to the base form.';
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
        const practiceContainer = this.getContainer();

        const exList = verb.examples || [];
        let targetSentence = exList[1] || exList[0] || `They [${verb.base}] yesterday.`;
        let targetForm = 'past_simple';
        let targetAns = verb.past_simple;

        if (exList.length >= 3 && Math.random() > 0.5) {
            targetSentence = exList[2];
            targetForm = 'past_participle';
            targetAns = verb.past_participle;
        }

        let blankSentence = targetSentence;
        const regAns = new RegExp(`\\b${targetAns.replace(/[\/]/g, '|')}\\b`, 'gi');
        if (regAns.test(blankSentence)) {
            blankSentence = blankSentence.replace(regAns, `<strong class="blank-spot">[ ___ ]</strong>`);
        } else {
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
                <input type="text" id="blank-answer-input" class="sprint-input-group" style="flex: 1; padding: 0.8rem 1rem; border-radius: 12px; border: 2px solid var(--border-color); font-size: 1.1rem; outline: none;" placeholder="Type the correct ${targetForm === 'past_simple' ? 'Past Simple' : 'Past Participle'} form..." autocomplete="off" autofocus onkeydown="if(event.key==='Enter') appEngine.practice.checkBlankAnswer()" aria-label="Type verb form answer">
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

        const practiceContainer = this.getContainer();
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

        const practiceContainer = this.getContainer();
        if (!practiceContainer) return;

        if (this.currentIndex >= this.currentSession.length) {
            this.currentIndex = 0; // Loop pool
        }

        const item = this.currentSession[this.currentIndex];
        const verb = item.entry || item.data;

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
                    <input type="text" id="sprint-v2-input" autocomplete="off" autofocus placeholder="e.g. ${verb.past_simple.includes('/') ? verb.past_simple.split('/')[0] : 'went'}" aria-label="Past Simple form">
                </div>
                <div class="sprint-input-group">
                    <label>Past Participle (V3):</label>
                    <input type="text" id="sprint-v3-input" autocomplete="off" placeholder="e.g. gone" onkeydown="if(event.key==='Enter') appEngine.practice.checkSprintAnswer()" aria-label="Past Participle form">
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
        const practiceContainer = this.getContainer();
        this.activeQuestion = { item, verb };

        const patternLabels = {
            "no_change": "No Change (cut - cut - cut)",
            "vowel_change": "Vowel Change (sing - sang - sung)",
            "same_past_participle": "Same Past Participle (buy - bought - bought)",
            "totally_irregular": "Totally Irregular (go - went - gone)",
            "add_en_or_n": "Add -en / -n (speak - spoke - spoken)"
        };

        const correctCombo = `${verb.past_simple} / ${verb.past_participle}`;
        const distractors = [];

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
                    <span class="pattern-group-badge">Form shape: ${this.engine.getFormPattern(verb).label}</span>
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

    finishSession() {
        if (this.sprintTimer) {
            clearInterval(this.sprintTimer);
            this.sprintTimer = null;
        }

        super.finishSession();
    }
}

window.PracticeManager = PracticeManager;
