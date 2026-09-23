/**
 * COSYlanguages Shared Practice Engine
 * Pluggable, reusable practice session runner that manages session queues,
 * question format rendering, scoring, inline feedback, and SRS integration.
 */

class PracticeEngine {
    constructor(options = {}) {
        this.engine = options.engine || null;
        this.srsStore = options.srsStore || null;
        this.containerId = options.containerId || 'practice-card-content';
        this.sessionLength = options.sessionLength || 10;
        this.scorePerCorrect = options.scorePerCorrect || 10;
        this.practiceModes = options.practiceModes || null;

        // Custom pool provider function (targetLevel, targetType, isWeakSpot, extraParams)
        this.poolProvider = options.poolProvider || ((targetLevel = 'all', targetType = 'all', isWeakSpot = false) => {
            if (!this.srsStore || !this.engine) return [];
            const dbMap = this.engine.dbMap || this.engine.verbDb;
            if (isWeakSpot) {
                return this.srsStore.getWeakCandidates(dbMap);
            }
            return this.srsStore.getDueCandidatePool(dbMap, targetLevel, targetType);
        });

        // Pluggable format renderers map
        this.renderers = new Map();

        // Custom format selector function (item, engine) -> format string
        this.formatSelector = options.formatSelector || null;

        // Callbacks
        this.onSessionComplete = options.onSessionComplete || null;
        this.onAnswerChecked = options.onAnswerChecked || null;

        // Session state
        this.currentSession = [];
        this.currentIndex = 0;
        this.sessionScore = 0;
        this.sessionCorrectItems = [];
        this.sessionWrongItems = [];
        this.masteredThisSession = [];
        this.activeQuestion = null;

        // Register default built-in format renderers
        this.registerFormat('mc', (item, format, container) => this.renderMcQuestion(item, format, container));
        this.registerFormat('type', (item, format, container) => this.renderTypeQuestion(item, format, container));
        this.registerFormat('spot_mistake', (item, format, container) => this.renderSpotMistakeQuestion(item, format, container));
        this.registerFormat('blank', (item, format, container) => this.renderBlankQuestion(item, format, container));
        this.registerFormat('match', (item, format, container) => this.renderMatchQuestion(item, format, container));

        if (options.renderers) {
            Object.keys(options.renderers).forEach(format => {
                this.registerFormat(format, options.renderers[format]);
            });
        }
    }

    /**
     * Answer normalization helper logic used across tools:
     * - Case-insensitive comparison
     * - Trimmed whitespace
     * - Slash-separated alternate accepted answers (e.g., "went/gone" or "on/upon")
     */
    static normalizeAnswer(typed, expected) {
        if (typed === undefined || typed === null) return false;
        const normalizedTyped = String(typed).trim().toLowerCase();
        if (!normalizedTyped) return false;

        const expectedStr = String(expected || '').trim().toLowerCase();
        const options = expectedStr.split('/').map(s => s.trim()).filter(Boolean);

        return options.some(opt => normalizedTyped === opt || normalizedTyped.split(/\s+/).includes(opt));
    }

    registerFormat(formatName, renderFn) {
        this.renderers.set(formatName, renderFn);
    }

    getContainer() {
        return document.getElementById(this.containerId);
    }

    startSession(targetLevel = 'all', targetType = 'all', isWeakSpotOnly = false, extraParams = {}) {
        let pool = this.poolProvider(targetLevel, targetType, isWeakSpotOnly, extraParams) || [];

        if (pool.length === 0 && this.srsStore && this.engine) {
            const dbMap = this.engine.dbMap || this.engine.verbDb;
            pool = this.srsStore.getDueCandidatePool(dbMap, 'all', 'all') || [];
        }

        this.currentSession = pool.slice(0, this.sessionLength);
        this.currentIndex = 0;
        this.sessionScore = 0;
        this.sessionCorrectItems = [];
        this.sessionWrongItems = [];
        this.masteredThisSession = [];
        this.activeQuestion = null;

        this.renderQuestion();
    }

    getValidFormatForItem(item, preferredFormat = null) {
        const data = item.entry || item.data || item;
        let allowedModes = this.practiceModes;

        if (!allowedModes && this.engine && this.engine.manifest && Array.isArray(this.engine.manifest.practiceModes)) {
            allowedModes = this.engine.manifest.practiceModes;
        }

        if (!allowedModes || !Array.isArray(allowedModes) || allowedModes.length === 0) {
            allowedModes = Array.from(this.renderers.keys());
        }

        const validModes = allowedModes.filter(mode => {
            if (mode === 'spot_mistake') {
                return Boolean(data && data.common_mistake);
            }
            if (mode === 'blank') {
                return Boolean(data && ((data.examples && data.examples.length > 0) || data.base));
            }
            return this.renderers.has(mode);
        });

        if (validModes.length === 0) {
            return this.renderers.has('mc') ? 'mc' : (Array.from(this.renderers.keys())[0] || 'default');
        }

        if (preferredFormat && validModes.includes(preferredFormat)) {
            return preferredFormat;
        }

        return validModes[Math.floor(Math.random() * validModes.length)];
    }

    renderQuestion() {
        const container = this.getContainer();
        if (!container) return;

        if (this.currentIndex >= this.currentSession.length) {
            this.finishSession();
            return;
        }

        const item = this.currentSession[this.currentIndex];

        let selectedFormat = null;
        if (typeof this.formatSelector === 'function') {
            selectedFormat = this.formatSelector(item, this);
        }

        const format = this.getValidFormatForItem(item, selectedFormat);
        const renderer = this.renderers.get(format) || this.renderers.get('default') || this.renderers.values().next().value;

        if (typeof renderer === 'function') {
            renderer(item, format, container, this);
        }
    }

    /* ── BUILT-IN DEFAULT RENDERERS ── */

    renderMcQuestion(item, format, container) {
        const data = item.entry || item.data || item;
        const key = item.key || data.base || '';

        let promptWord = key;
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

        const expected = data.prepositions?.[0] || data.past_simple || data.answer || 'none';
        const prepPool = ['on', 'in', 'at', 'for', 'to', 'from', 'with', 'about', 'of', 'none'];

        let choices = [expected];
        while (choices.length < 4) {
            const pick = prepPool[Math.floor(Math.random() * prepPool.length)];
            if (!choices.includes(pick)) choices.push(pick);
        }
        choices.sort(() => Math.random() - 0.5);

        this.activeQuestion = {
            item,
            format: 'mc',
            expected,
            choices
        };

        const choiceBtnsHtml = choices.map(choice => `
            <button class="choice-btn" onclick="appEngine.practice.checkAnswer('${choice}')">
                ${choice === 'none' ? 'No Preposition (Direct)' : choice}
            </button>
        `).join('');

        container.innerHTML = `
            <div class="question-header">
                <div class="meta-info">
                    <span class="badge type-badge">${item.type ? String(item.type).toUpperCase() : 'PRACTICE'}</span>
                    ${data.level ? `<span class="badge cefr-badge">Level: ${data.level}</span>` : ''}
                    <span class="progress-count">Item ${this.currentIndex + 1} of ${this.currentSession.length}</span>
                </div>
            </div>

            <div class="mc-prompt">
                <span class="prompt-badge mc-badge">🎯 Select Correct Option</span>
                <h3>${promptWord}</h3>
                ${data.definition ? `<p class="definition-hint"><em>${data.definition}</em></p>` : ''}
            </div>

            <div class="choice-grid">
                ${choiceBtnsHtml}
            </div>

            <div id="practice-feedback-box" class="inline-feedback-card" style="display: none;"></div>
            <button id="practice-next-btn" class="game-btn" style="display: none;" onclick="appEngine.practice.nextQuestion()">Continue ➔</button>
        `;
    }

    renderTypeQuestion(item, format, container) {
        const data = item.entry || item.data || item;
        const key = item.key || data.base || '';

        let promptWord = key;
        const expected = data.prepositions?.[0] || data.past_simple || data.answer || key;

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

        let sentenceHtml = '';
        if (data.examples && data.examples.length > 0) {
            const ex = data.examples[0];
            let blankSentence = ex;
            if (expected && expected !== 'none') {
                const reg = new RegExp(`\\b${expected.replace(/[\/]/g, '|')}\\b`, 'gi');
                blankSentence = blankSentence.replace(reg, '<strong class="blank-spot">[ ___ ]</strong>');
            }
            sentenceHtml = `<p class="sentence-box">"${blankSentence}"</p>`;
        }

        this.activeQuestion = {
            item,
            format: 'type',
            expected,
            comparator: (typed, exp) => PracticeEngine.normalizeAnswer(typed, exp)
        };

        container.innerHTML = `
            <div class="question-header">
                <div class="meta-info">
                    <span class="badge type-badge">${item.type ? String(item.type).toUpperCase() : 'PRACTICE'}</span>
                    ${data.level ? `<span class="badge cefr-badge">Level: ${data.level}</span>` : ''}
                    <span class="progress-count">Item ${this.currentIndex + 1} of ${this.currentSession.length}</span>
                </div>
            </div>

            <div class="blank-prompt">
                <span class="prompt-badge blank-badge">✍️ Type Answer</span>
                <h3>${promptWord}</h3>
                ${data.definition ? `<p class="definition-hint"><em>${data.definition}</em></p>` : ''}
                ${sentenceHtml}
            </div>

            <div style="display: flex; gap: 0.5rem; margin-bottom: 1.25rem;">
                <input type="text" id="type-answer-input" class="sprint-input-group" style="flex: 1; padding: 0.8rem 1rem; border-radius: 12px; border: 2px solid var(--border-color); font-size: 1.1rem; outline: none;" placeholder="Type your answer..." autocomplete="off" autofocus onkeydown="if(event.key==='Enter') appEngine.practice.checkTypedAnswer()" aria-label="Type answer">
                <button class="game-btn" style="width: auto; padding: 0.8rem 1.5rem;" onclick="appEngine.practice.checkTypedAnswer()">Check ➔</button>
            </div>

            <div id="practice-feedback-box" class="inline-feedback-card" style="display: none;"></div>
            <button id="practice-next-btn" class="game-btn" style="display: none;" onclick="appEngine.practice.nextQuestion()">Continue ➔</button>
        `;
    }

    renderSpotMistakeQuestion(item, format, container) {
        const data = item.entry || item.data || item;
        const key = item.key || data.base || '';

        let promptWord = key;
        const expected = data.prepositions?.[0] || data.past_simple || data.answer || key;

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

        const mistakeText = data.common_mistake || '';
        const mistakeDisplay = mistakeText.split('➜')[0] || mistakeText;

        this.activeQuestion = {
            item,
            format: 'spot_mistake',
            expected,
            comparator: (typed, exp) => PracticeEngine.normalizeAnswer(typed, exp)
        };

        container.innerHTML = `
            <div class="question-header">
                <div class="meta-info">
                    <span class="badge type-badge">${item.type ? String(item.type).toUpperCase() : 'PRACTICE'}</span>
                    ${data.level ? `<span class="badge cefr-badge">Level: ${data.level}</span>` : ''}
                    <span class="progress-count">Item ${this.currentIndex + 1} of ${this.currentSession.length}</span>
                </div>
            </div>

            <div class="mistake-spot-prompt">
                <span class="prompt-badge spot-badge">⚠️ Spot &amp; Fix Pitfall</span>
                <h4>Identify the correct pattern for: <strong class="highlight-word">${promptWord}</strong></h4>
                <p class="mistake-line">${mistakeDisplay}</p>
            </div>

            <div style="display: flex; gap: 0.5rem; margin-bottom: 1.25rem;">
                <input type="text" id="type-answer-input" class="sprint-input-group" style="flex: 1; padding: 0.8rem 1rem; border-radius: 12px; border: 2px solid var(--border-color); font-size: 1.1rem; outline: none;" placeholder="Type the correct preposition or word..." autocomplete="off" autofocus onkeydown="if(event.key==='Enter') appEngine.practice.checkTypedAnswer()" aria-label="Type corrected answer">
                <button class="game-btn" style="width: auto; padding: 0.8rem 1.5rem;" onclick="appEngine.practice.checkTypedAnswer()">Check ➔</button>
            </div>

            <div id="practice-feedback-box" class="inline-feedback-card" style="display: none;"></div>
            <button id="practice-next-btn" class="game-btn" style="display: none;" onclick="appEngine.practice.nextQuestion()">Continue ➔</button>
        `;
    }

    renderBlankQuestion(item, format, container) {
        return this.renderTypeQuestion(item, format, container);
    }

    getRightTextForItem(batchItem) {
        const data = batchItem.entry || batchItem.data || batchItem;
        if (data.past_participle) {
            return data.past_participle;
        } else if (data.prepositions && data.prepositions.length > 0 && data.prepositions[0] !== 'none') {
            return data.prepositions[0];
        } else if (data.definition) {
            return data.definition;
        } else if (data.answer) {
            return data.answer;
        }
        return 'direct';
    }

    renderMatchQuestion(item, format, container) {
        // Collect candidate items from currentSession starting at currentIndex with unique rightText values
        const batchItems = [];
        const batchIndices = [];
        const seenRights = new Set();

        for (let i = this.currentIndex; i < this.currentSession.length && batchItems.length < 5; i++) {
            const cand = this.currentSession[i];
            const rightVal = this.getRightTextForItem(cand);
            if (!seenRights.has(rightVal)) {
                seenRights.add(rightVal);
                batchItems.push(cand);
                batchIndices.push(i);
            }
        }

        // If not enough unique items were found in the remainder, fill from remaining items anyway
        if (batchItems.length < Math.min(3, this.currentSession.length - this.currentIndex)) {
            for (let i = this.currentIndex; i < this.currentSession.length && batchItems.length < 5; i++) {
                if (!batchIndices.includes(i)) {
                    batchItems.push(this.currentSession[i]);
                    batchIndices.push(i);
                }
            }
        }

        // Swap selected batch items to be contiguous in currentSession starting at currentIndex
        batchIndices.forEach((origIdx, k) => {
            const targetIdx = this.currentIndex + k;
            if (origIdx !== targetIdx) {
                const temp = this.currentSession[targetIdx];
                this.currentSession[targetIdx] = this.currentSession[origIdx];
                this.currentSession[origIdx] = temp;
            }
        });

        const pairs = batchItems.map((batchItem, idx) => {
            const data = batchItem.entry || batchItem.data || batchItem;
            let leftText = batchItem.key || data.base || '';
            const rightText = this.getRightTextForItem(batchItem);

            if (data.prepositions && data.prepositions.length > 0 && data.prepositions[0] !== 'none') {
                for (const p of data.prepositions) {
                    if (p === 'none') continue;
                    const reg = new RegExp(`\\s+${p.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, 'i');
                    if (reg.test(leftText)) {
                        leftText = leftText.replace(reg, '');
                        break;
                    }
                }
                leftText = leftText.trim();
            }

            return {
                id: idx,
                item: batchItem,
                leftText,
                rightText
            };
        });

        const leftItems = [...pairs];
        const rightItems = [...pairs].sort(() => Math.random() - 0.5);

        this.activeQuestion = {
            item: pairs[0] ? pairs[0].item : item,
            format: 'match',
            batch: pairs,
            batchSize: pairs.length,
            selectedLeft: null,
            matchedCount: 0,
            totalPairs: pairs.length,
            timeoutId: null
        };

        const leftHtml = leftItems.map(p => `
            <button class="match-btn match-left" id="match-left-${p.id}" onclick="appEngine.practice.handleMatchClick('left', ${p.id})">
                ${p.leftText}
            </button>
        `).join('');

        const rightHtml = rightItems.map(p => `
            <button class="match-btn match-right" id="match-right-${p.id}" onclick="appEngine.practice.handleMatchClick('right', ${p.id})">
                ${p.rightText}
            </button>
        `).join('');

        container.innerHTML = `
            <div class="question-header">
                <div class="meta-info">
                    <span class="badge type-badge">MATCHING</span>
                    <span class="progress-count">Matched <span id="match-score-count">0</span> of ${uniquePairs.length} pairs</span>
                </div>
            </div>

            <div class="mc-prompt">
                <span class="prompt-badge mc-badge">🧩 Match Pair Items</span>
                <h3>Click a word on the left, then click its corresponding match on the right.</h3>
            </div>

            <div class="match-container" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
                <div class="match-col left-col" style="display: flex; flex-direction: column; gap: 0.5rem;">
                    ${leftHtml}
                </div>
                <div class="match-col right-col" style="display: flex; flex-direction: column; gap: 0.5rem;">
                    ${rightHtml}
                </div>
            </div>

            <div id="practice-feedback-box" class="inline-feedback-card" style="display: none; margin-top: 1rem;"></div>
            <button id="practice-next-btn" class="game-btn" style="display: none; margin-top: 1rem;" onclick="appEngine.practice.advanceMatchRound()">Continue ➔</button>
        `;

        this.injectMatchStyles();
    }

    injectMatchStyles() {
        if (document.getElementById('practice-match-styles')) return;
        const style = document.createElement('style');
        style.id = 'practice-match-styles';
        style.textContent = `
            .match-btn {
                padding: 0.8rem 1rem;
                font-size: 1rem;
                font-family: var(--font-sans, inherit);
                border: 2px solid var(--border-color, #d2c8be);
                border-radius: 12px;
                background: var(--paper-light, #ffffff);
                color: var(--text-color, #2c2523);
                cursor: pointer;
                transition: all 0.2s ease;
                text-align: center;
            }
            .match-btn:hover:not(:disabled) {
                border-color: var(--sage, #416b49);
                background: rgba(65, 107, 73, 0.05);
            }
            .match-btn.selected {
                border-color: var(--sage, #416b49);
                background: rgba(65, 107, 73, 0.15);
                font-weight: bold;
            }
            .match-btn.matched {
                border-color: #48bb78;
                background: #f0fff4;
                color: #276749;
                cursor: default;
                opacity: 0.7;
            }
            .match-btn.wrong-shake {
                border-color: #f56565;
                background: #fff5f5;
                color: #9b2c2c;
            }
        `;
        document.head.appendChild(style);
    }

    handleMatchClick(col, pairId) {
        if (!this.activeQuestion || this.activeQuestion.format !== 'match') return;

        const q = this.activeQuestion;
        const btn = document.getElementById(`match-${col}-${pairId}`);
        if (!btn || btn.classList.contains('matched')) return;

        if (col === 'left') {
            if (q.timeoutId) {
                clearTimeout(q.timeoutId);
                q.timeoutId = null;
                document.querySelectorAll('.match-btn.wrong-shake').forEach(b => b.classList.remove('wrong-shake'));
            }

            if (q.selectedLeft !== null) {
                const oldBtn = document.getElementById(`match-left-${q.selectedLeft}`);
                if (oldBtn) oldBtn.classList.remove('selected');
            }
            q.selectedLeft = pairId;
            btn.classList.add('selected');
        } else if (col === 'right') {
            if (q.selectedLeft === null) {
                const feedbackBox = document.getElementById('practice-feedback-box');
                if (feedbackBox) {
                    feedbackBox.className = 'inline-feedback-card feedback-wrong';
                    feedbackBox.innerHTML = '<div class="feedback-title">👉 Select an item on the left first!</div>';
                    feedbackBox.style.display = 'block';
                }
                return;
            }

            if (q.timeoutId) {
                clearTimeout(q.timeoutId);
                q.timeoutId = null;
                document.querySelectorAll('.match-btn.wrong-shake').forEach(b => b.classList.remove('wrong-shake'));
            }

            const leftId = q.selectedLeft;
            const leftBtn = document.getElementById(`match-left-${leftId}`);

            const leftPair = q.batch.find(p => p.id === leftId);
            const rightPair = q.batch.find(p => p.id === pairId);

            const isMatch = (leftPair && rightPair && leftPair.rightText === rightPair.rightText);
            const item = leftPair ? leftPair.item : q.item;

            let type = item.type;
            let key = item.key;
            let newProg = null;
            if (this.srsStore) {
                newProg = type ? this.srsStore.recordAnswer(type, key, isMatch) : this.srsStore.recordAnswer(key, isMatch);
            } else {
                newProg = { masteryLevel: 0 };
            }

            const feedbackBox = document.getElementById('practice-feedback-box');

            if (isMatch) {
                leftBtn.classList.remove('selected');
                leftBtn.classList.add('matched');
                leftBtn.disabled = true;

                btn.classList.add('matched');
                btn.disabled = true;

                q.selectedLeft = null;
                q.matchedCount += 1;
                this.sessionScore += this.scorePerCorrect;
                this.sessionCorrectItems.push(item);

                const countEl = document.getElementById('match-score-count');
                if (countEl) countEl.textContent = String(q.matchedCount);

                if (feedbackBox) {
                    feedbackBox.className = 'inline-feedback-card feedback-correct';
                    feedbackBox.innerHTML = `<div class="feedback-title">✅ Correct Match! (${leftPair.leftText} ➔ ${leftPair.rightText})</div>`;
                    feedbackBox.style.display = 'block';
                }

                if (q.matchedCount >= q.totalPairs) {
                    const nextBtn = document.getElementById('practice-next-btn');
                    if (nextBtn) nextBtn.style.display = 'block';
                }
            } else {
                leftBtn.classList.add('wrong-shake');
                btn.classList.add('wrong-shake');

                this.sessionWrongItems.push(item);

                if (feedbackBox) {
                    feedbackBox.className = 'inline-feedback-card feedback-wrong';
                    feedbackBox.innerHTML = '<div class="feedback-title">❌ Not a match! Try again.</div>';
                    feedbackBox.style.display = 'block';
                }

                q.timeoutId = setTimeout(() => {
                    leftBtn.classList.remove('wrong-shake', 'selected');
                    btn.classList.remove('wrong-shake');
                    q.selectedLeft = null;
                    q.timeoutId = null;
                }, 800);
            }
        }
    }

    advanceMatchRound() {
        if (!this.activeQuestion || this.activeQuestion.format !== 'match') return;
        const batchSize = this.activeQuestion.batchSize || this.activeQuestion.totalPairs || 1;
        this.currentIndex += batchSize;
        this.renderQuestion();
    }

    checkTypedAnswer() {
        const input = document.getElementById('type-answer-input');
        if (!input || !this.activeQuestion) return;

        const typed = input.value;
        const result = this.checkAnswer(typed);
        if (!result) return;

        const { isCorrect, expected, newProg, item } = result;
        const feedbackBox = document.getElementById('practice-feedback-box');
        const nextBtn = document.getElementById('practice-next-btn');

        const data = item.entry || item.data || item;

        if (feedbackBox) {
            feedbackBox.className = isCorrect ? 'inline-feedback-card feedback-correct' : 'inline-feedback-card feedback-wrong';
            feedbackBox.innerHTML = isCorrect
                ? `<div class="feedback-title">✅ Correct! (${expected === 'none' ? 'No Preposition' : expected})</div>
                   <div class="feedback-srs-info" style="margin: 0.25rem 0; font-weight: 600; font-size: 0.9rem;">⭐ Mastery: Level ${newProg.masteryLevel}/5</div>
                   ${data.grammar_rule ? `<div class="feedback-rule">📌 Rule: ${data.grammar_rule}</div>` : ''}`
                : `<div class="feedback-title">❌ Incorrect! Expected: <strong>${expected === 'none' ? 'No Preposition' : expected}</strong></div>
                   <div class="feedback-srs-info" style="margin: 0.25rem 0; font-weight: 600; font-size: 0.9rem;">⭐ Mastery: Level ${newProg.masteryLevel}/5</div>
                   ${data.grammar_rule ? `<div class="feedback-rule">📌 Rule: ${data.grammar_rule}</div>` : ''}
                   ${data.common_mistake ? `<div class="feedback-mistake">⚠️ Pitfall Fix: ${data.common_mistake}</div>` : ''}`;
            feedbackBox.style.display = 'block';
        }

        input.disabled = true;
        if (nextBtn) nextBtn.style.display = 'block';
    }

    checkAnswer(userChoice, expectedOverride) {
        if (!this.activeQuestion) return null;

        const item = this.activeQuestion.item;
        const expected = expectedOverride !== undefined ? expectedOverride : this.activeQuestion.expected;

        let isCorrect = false;
        if (typeof userChoice === 'boolean') {
            isCorrect = userChoice;
        } else if (typeof this.activeQuestion.comparator === 'function') {
            isCorrect = this.activeQuestion.comparator(userChoice, expected);
        } else {
            isCorrect = PracticeEngine.normalizeAnswer(userChoice, expected);
        }

        let type = item.type;
        let key = item.key;
        let newProg = null;

        if (this.srsStore) {
            if (type) {
                newProg = this.srsStore.recordAnswer(type, key, isCorrect);
            } else {
                newProg = this.srsStore.recordAnswer(key, isCorrect);
            }
        } else {
            newProg = { masteryLevel: 0, level: 0 };
        }

        const masteryLevel = newProg.masteryLevel ?? newProg.level ?? 0;

        if (isCorrect) {
            this.sessionScore += this.scorePerCorrect;
            this.sessionCorrectItems.push(item);
            if (masteryLevel >= 4) {
                this.masteredThisSession.push(item);
            }
        } else {
            this.sessionWrongItems.push(item);
        }

        if (typeof this.onAnswerChecked === 'function') {
            this.onAnswerChecked(isCorrect, userChoice, expected, newProg, this);
        }

        return { isCorrect, expected, newProg, item };
    }

    nextQuestion() {
        this.currentIndex += 1;
        this.renderQuestion();
    }

    finishSession() {
        if (this.srsStore) {
            this.srsStore.recordSessionCompletion();
        }

        if (typeof this.onSessionComplete === 'function') {
            this.onSessionComplete(this);
            return;
        }

        const container = this.getContainer();
        if (!container) return;

        const streakInfo = this.srsStore ? this.srsStore.getStreakInfo() : { streakDays: 0, todayCount: 0, goal: 10 };

        container.innerHTML = `
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
                        <span class="stat-lbl">Items Mastered</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-num">${streakInfo.streakDays}🔥</span>
                        <span class="stat-lbl">Daily Streak</span>
                    </div>
                </div>

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

    getStreakInfo() {
        return this.srsStore ? this.srsStore.getStreakInfo() : { streakDays: 0, todayCount: 0, goal: 10 };
    }
}

window.PracticeEngine = PracticeEngine;
if (typeof module !== 'undefined') {
    module.exports = PracticeEngine;
}
