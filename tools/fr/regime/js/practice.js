/**
 * Practice Manager for fr-regime
 * Uses PracticeEngine shared base class for 10-item sessions, question formats (fill-in-blank, pick-correct, spot-mistake, match),
 * contraction-aware grading for prepositions (à, de, au, du, aux, des...),
 * immediate inline feedback, session summary, weak-spot reviews, and cross-family nudges.
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

        this.registerFormat('mc', (item, format, container) => this.renderFrenchQuestion(item, 'mc', container));
        this.registerFormat('blank', (item, format, container) => this.renderFrenchQuestion(item, 'blank', container));
        this.registerFormat('type', (item, format, container) => this.renderFrenchQuestion(item, 'blank', container));
        this.registerFormat('spot_mistake', (item, format, container) => this.renderFrenchQuestion(item, 'spot_mistake', container));
    }

    renderFrenchQuestion(item, format, container) {
        const data = item.entry || item.data;
        const rawKey = item.key;
        const type = item.type;

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
        const prepPool = ['à', 'de', 'sur', 'en', 'pour', 'avec', 'par', 'envers', 'none'];

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
            comparator: (typed, expected) => {
                const normTyped = String(typed).trim().toLowerCase();
                const normExp = String(expected).trim().toLowerCase();
                if (normTyped === normExp) return true;
                if (normExp === 'à' && ['au', 'aux', "à l'"].includes(normTyped)) return true;
                if (normExp === 'de' && ['du', 'des', "d'"].includes(normTyped)) return true;
                if (normExp === 'none' && ['direct', 'sans', 'none', ''].includes(normTyped)) return true;
                return PracticeEngine.normalizeAnswer(typed, expected);
            }
        };

        let questionPromptHtml = '';

        if (format === 'spot_mistake' && data.common_mistake) {
            questionPromptHtml = `
                <div class="mistake-spot-prompt">
                    <span class="prompt-badge spot-badge">⚠️ Corrigez l'erreur</span>
                    <h4>Identifiez la construction correcte pour : <strong class="highlight-word">${promptWord}</strong></h4>
                    <p class="mistake-line">${data.common_mistake.split('➜')[0] || data.common_mistake}</p>
                </div>
            `;
        } else if ((format === 'blank' || format === 'type') && data.examples?.[0]) {
            const ex = data.examples[0];
            let blankSentence = ex;

            if (primaryPrep !== 'none') {
                const prepRegex = new RegExp(`\\b(${primaryPrep}|au|aux|du|des|à|de|sur|en|pour|avec)\\b`, 'i');
                blankSentence = ex.replace(prepRegex, '<strong class="blank-spot">[ ___ ]</strong>');
            } else {
                blankSentence = ex.replace(new RegExp(`\\b${promptWord}\\b`, 'i'), `${promptWord} <strong class="blank-spot">[ ___ ]</strong>`);
            }
            questionPromptHtml = `
                <div class="blank-prompt">
                    <span class="prompt-badge blank-badge">💡 Complétez la phrase</span>
                    <h3>${promptWord}</h3>
                    <p class="sentence-box">"${blankSentence}"</p>
                </div>
            `;
        } else {
            questionPromptHtml = `
                <div class="mc-prompt">
                    <span class="prompt-badge mc-badge">🎯 Régime prépositionnel</span>
                    <h3>${promptWord}</h3>
                    <p class="definition-hint"><em>${data.definition || ''}</em></p>
                </div>
            `;
        }

        let typeBadgeLabel = type ? type.toUpperCase() : 'MOT';
        if (type === 'verbs') typeBadgeLabel = data.pronominal ? 'Verbe pronominal 🪞' : 'Verbe 💬';
        else if (type === 'nouns') typeBadgeLabel = 'Nom 📦';
        else if (type === 'adjectives') typeBadgeLabel = 'Adjectif 🎨';

        const choiceButtonsHtml = choices.map(choice => `
            <button class="choice-btn" onclick="appEngine.practice.checkAnswer('${choice}')">
                ${choice === 'none' ? 'Direct (sans prép)' : choice}
            </button>
        `).join('');

        container.innerHTML = `
            <div class="question-header">
                <div class="meta-info">
                    <span class="badge type-badge">${typeBadgeLabel}</span>
                    <span class="badge cefr-badge">Niveau : ${data.level || 'A1'}</span>
                    <span class="progress-count">Mot ${this.currentIndex + 1} de ${this.currentSession.length}</span>
                </div>
            </div>

            ${questionPromptHtml}

            <div class="choice-grid">
                ${choiceButtonsHtml}
            </div>

            <div id="practice-feedback-box" class="inline-feedback-card hidden"></div>
            <button id="practice-next-btn" class="game-btn hidden" onclick="appEngine.practice.nextQuestion()">Continuer ➔</button>
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
                <div class="feedback-title">✅ Exact ! (${expected === 'none' ? 'Direct / Sans préposition' : 'Préposition : ' + expected})</div>
                <div class="feedback-srs-info" style="margin: 0.25rem 0; font-weight: 600; font-size: 0.9rem;">⭐ Niveau de maîtrise : ${newProg.masteryLevel}/5</div>
                ${entry.grammar_rule ? `<div class="feedback-rule">📌 Règle : ${entry.grammar_rule}</div>` : ''}
            `;
        } else {
            feedbackBox.className = 'inline-feedback-card feedback-wrong';
            feedbackBox.innerHTML = `
                <div class="feedback-title">❌ Incorrect ! Réponse attendue : <strong>${expected === 'none' ? 'Direct (sans préposition)' : expected}</strong></div>
                <div class="feedback-srs-info" style="margin: 0.25rem 0; font-weight: 600; font-size: 0.9rem;">⭐ Niveau de maîtrise : ${newProg.masteryLevel}/5</div>
                ${entry.grammar_rule ? `<div class="feedback-rule">📌 Règle : ${entry.grammar_rule}</div>` : ''}
                ${entry.common_mistake ? `<div class="feedback-mistake">⚠️ Piège à éviter : ${entry.common_mistake}</div>` : ''}
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
                <h3>Session terminée !</h3>
                <p>Beau travail ! Vous avez répondu correctement à ${this.sessionCorrectItems.length} sur ${this.currentSession.length} mots.</p>

                <div class="summary-stats-grid">
                    <div class="stat-box">
                        <span class="stat-num">${this.sessionScore}</span>
                        <span class="stat-lbl">Points gagnés</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-num">${this.masteredThisSession.length}</span>
                        <span class="stat-lbl">Mots assimilés</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-num">${streakInfo.streakDays}🔥</span>
                        <span class="stat-lbl">Jours de série</span>
                    </div>
                </div>

                <div class="summary-actions">
                    <button class="game-btn secondary-btn" onclick="appEngine.practice.startSession('all', 'all', true)">
                        🔁 Réviser les points faibles
                    </button>
                    <button class="game-btn" onclick="appEngine.setAppMode('practice')">
                        ✅ Terminé pour aujourd'hui
                    </button>
                </div>
            </div>
        `;
    }
}

window.PracticeManager = PracticeManager;
