/**
 * Practice Manager for it-reggenza
 * Manages 10-item sessions, question formats (fill-in-blank, pick-correct, spot-mistake),
 * contraction-aware grading for preposizioni articolate (al, allo, alla, del, dello, della, nel, sul...),
 * immediate inline feedback, session summary, weak-spot reviews, and cross-family nudges.
 */

class PracticeManager {
    constructor(engine, srsStore) {
        this.engine = engine;
        this.srsStore = srsStore;
        this.currentSession = [];
        this.currentIndex = 0;
        this.sessionScore = 0;
        this.sessionCorrectItems = [];
        this.sessionWrongItems = [];
        this.masteredThisSession = [];
        this.activeQuestion = null;
    }

    startSession(targetLevel = 'all', targetWordType = 'all', isWeakSpotOnly = false) {
        let pool = [];
        if (isWeakSpotOnly) {
            pool = this.srsStore.getWeakCandidates(this.engine.dbMap);
        } else {
            pool = this.srsStore.getDueCandidatePool(this.engine.dbMap, targetLevel, targetWordType);
        }

        if (pool.length === 0) {
            pool = this.srsStore.getDueCandidatePool(this.engine.dbMap, 'all', 'all');
        }

        this.currentSession = pool.slice(0, 10);
        this.currentIndex = 0;
        this.sessionScore = 0;
        this.sessionCorrectItems = [];
        this.sessionWrongItems = [];
        this.masteredThisSession = [];

        this.renderQuestion();
    }

    renderQuestion() {
        if (this.currentIndex >= this.currentSession.length) {
            this.finishSession();
            return;
        }

        const item = this.currentSession[this.currentIndex];
        const data = item.entry;
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

        // Question format: 'mc' (multiple choice), 'blank' (fill in blank), or 'spot_mistake' (if common_mistake exists)
        const randVal = Math.random();
        let format = 'mc';
        if (data.common_mistake && randVal < 0.35) {
            format = 'spot_mistake';
        } else if (data.examples && data.examples.length > 0 && randVal < 0.7) {
            format = 'blank';
        }

        const primaryPrep = data.prepositions?.[0] || 'none';
        const prepPool = ['a', 'di', 'su', 'in', 'con', 'da', 'per', 'tra', 'fra', 'none'];

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

        const practiceContainer = document.getElementById('practice-card-content');
        if (!practiceContainer) return;

        let questionPromptHtml = '';

        if (format === 'spot_mistake' && data.common_mistake) {
            questionPromptHtml = `
                <div class="mistake-spot-prompt">
                    <span class="prompt-badge spot-badge">⚠️ Correggi l'errore</span>
                    <h4>Identifica la struttura corretta per: <strong class="highlight-word">${promptWord}</strong></h4>
                    <p class="mistake-line">${data.common_mistake.split('➜')[0] || data.common_mistake}</p>
                </div>
            `;
        } else if (format === 'blank' && data.examples?.[0]) {
            const ex = data.examples[0];
            let blankSentence = ex;

            if (primaryPrep !== 'none') {
                // Check if sentence contains preposizione articolata (al, allo, alla, del, della, sul...)
                const prepRegex = new RegExp(`\\b(${primaryPrep}|al|allo|alla|ai|agli|alle|del|dello|della|dei|degli|delle|dal|dallo|dalla|dai|dagli|dalle|nel|nello|nella|nei|negli|nelle|sul|sullo|sulla|sui|sugli|sulle)\\b`, 'i');
                blankSentence = ex.replace(prepRegex, '<strong class="blank-spot">[ ___ ]</strong>');
            } else {
                blankSentence = ex.replace(new RegExp(`\\b${promptWord}\\b`, 'i'), `${promptWord} <strong class="blank-spot">[ ___ ]</strong>`);
            }
            questionPromptHtml = `
                <div class="blank-prompt">
                    <span class="prompt-badge blank-badge">💡 Completa la frase</span>
                    <h3>${promptWord}</h3>
                    <p class="sentence-box">"${blankSentence}"</p>
                </div>
            `;
        } else {
            questionPromptHtml = `
                <div class="mc-prompt">
                    <span class="prompt-badge mc-badge">🎯 Preposizione reggente</span>
                    <h3>${promptWord}</h3>
                    <p class="definition-hint"><em>${data.definition || ''}</em></p>
                </div>
            `;
        }

        let typeBadgeLabel = type.toUpperCase();
        if (type === 'verbs') typeBadgeLabel = data.pronominal ? 'Verbo pronominale 🪞' : 'Verbo 🏃';
        else if (type === 'nouns') typeBadgeLabel = 'Nome 📦';
        else if (type === 'adjectives') typeBadgeLabel = 'Aggettivo 🎨';

        const choiceButtonsHtml = choices.map(choice => `
            <button class="choice-btn" onclick="appEngine.practice.checkAnswer('${choice}')">
                ${choice === 'none' ? 'Diretto (senza prep)' : choice}
            </button>
        `).join('');

        practiceContainer.innerHTML = `
            <div class="question-header">
                <div class="meta-info">
                    <span class="badge type-badge">${typeBadgeLabel}</span>
                    <span class="badge cefr-badge">Livello: ${data.level}</span>
                    <span class="progress-count">Voce ${this.currentIndex + 1} di ${this.currentSession.length}</span>
                </div>
            </div>

            ${questionPromptHtml}

            <div class="choice-grid">
                ${choiceButtonsHtml}
            </div>

            <div id="practice-feedback-box" class="inline-feedback-card hidden"></div>
            <button id="practice-next-btn" class="game-btn hidden" onclick="appEngine.practice.nextQuestion()">Continua ➔</button>
        `;
    }

    checkAnswer(userChoice) {
        if (!this.activeQuestion) return;

        const feedbackBox = document.getElementById('practice-feedback-box');
        const nextBtn = document.getElementById('practice-next-btn');
        const choiceGrid = document.querySelector('.choice-grid');

        const item = this.activeQuestion.item;
        const expected = this.activeQuestion.expected;
        const isCorrect = userChoice.toLowerCase() === expected.toLowerCase();

        const newProg = this.srsStore.recordAnswer(item.type, item.key, isCorrect);

        if (isCorrect) {
            this.sessionScore += 10;
            this.sessionCorrectItems.push(item);
            if (newProg.masteryLevel >= 4) {
                this.masteredThisSession.push(item);
            }
            feedbackBox.className = 'inline-feedback-card feedback-correct';
            feedbackBox.innerHTML = `
                <div class="feedback-title">✅ Esatto! (${expected === 'none' ? 'Diretto / Senza preposizione' : 'Preposizione: ' + expected})</div>
                <div class="feedback-srs-info" style="margin: 0.25rem 0; font-weight: 600; font-size: 0.9rem;">⭐ Livello di maestria: ${newProg.masteryLevel}/5</div>
                <div class="feedback-rule">📌 Regola: ${item.entry.grammar_rule}</div>
            `;
        } else {
            this.sessionWrongItems.push(item);
            feedbackBox.className = 'inline-feedback-card feedback-wrong';
            feedbackBox.innerHTML = `
                <div class="feedback-title">❌ Errato! Risposta corretta: <strong>${expected === 'none' ? 'Diretto (senza preposizione)' : expected}</strong></div>
                <div class="feedback-srs-info" style="margin: 0.25rem 0; font-weight: 600; font-size: 0.9rem;">⭐ Livello di maestria: ${newProg.masteryLevel}/5</div>
                <div class="feedback-rule">📌 Regola: ${item.entry.grammar_rule}</div>
                ${item.entry.common_mistake ? `<div class="feedback-mistake">⚠️ Errore da evitare: ${item.entry.common_mistake}</div>` : ''}
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
        this.srsStore.recordSessionCompletion();

        const practiceContainer = document.getElementById('practice-card-content');
        if (!practiceContainer) return;

        // Check for cross-family nudge
        let nudgeHtml = '';
        if (this.masteredThisSession.length > 0) {
            const masteredItem = this.masteredThisSession[0];
            const contrastText = masteredItem.entry.related_forms || masteredItem.entry.noun_parallel;
            if (contrastText) {
                const crossRefs = this.engine.extractCrossReferences(contrastText, masteredItem.type);
                if (crossRefs.length > 0) {
                    const ref = crossRefs[0];
                    nudgeHtml = `
                        <div class="nudge-card">
                            <span class="nudge-icon">💡</span>
                            <div>
                                <strong>Lo sapevi?</strong>
                                <p>Hai padroneggiato <em>${masteredItem.key}</em>! Scopri la forma correlata:</p>
                                <button class="xref-chip" onclick="appEngine.practice.triggerNudge('${ref.type}', '${ref.key.replace(/'/g, "\\'")}')">
                                    ${ref.label}
                                </button>
                            </div>
                        </div>
                    `;
                }
            }
        }

        const streakInfo = this.srsStore.getStreakInfo();

        practiceContainer.innerHTML = `
            <div class="session-summary-box">
                <span class="summary-icon">🎉</span>
                <h3>Sessione completata!</h3>
                <p>Ottimo lavoro! Hai risposto correttamente a ${this.sessionCorrectItems.length} su ${this.currentSession.length} voci.</p>

                <div class="summary-stats-grid">
                    <div class="stat-box">
                        <span class="stat-num">${this.sessionScore}</span>
                        <span class="stat-lbl">Punti guadagnati</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-num">${this.masteredThisSession.length}</span>
                        <span class="stat-lbl">Voci assimilate</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-num">${streakInfo.streakDays}🔥</span>
                        <span class="stat-lbl">Giorni di fila</span>
                    </div>
                </div>

                ${nudgeHtml}

                <div class="summary-actions">
                    <button class="game-btn secondary-btn" onclick="appEngine.practice.startSession('all', 'all', true)">
                        🔁 Ripassa i punti deboli
                    </button>
                    <button class="game-btn" onclick="appEngine.setAppMode('practice')">
                        ✅ Fatto per oggi
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
