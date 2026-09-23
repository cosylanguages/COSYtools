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

        if (options.renderers) {
            Object.keys(options.renderers).forEach(format => {
                this.registerFormat(format, options.renderers[format]);
            });
        }
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

    renderQuestion() {
        const container = this.getContainer();
        if (!container) return;

        if (this.currentIndex >= this.currentSession.length) {
            this.finishSession();
            return;
        }

        const item = this.currentSession[this.currentIndex];

        let format = 'mc';
        if (typeof this.formatSelector === 'function') {
            format = this.formatSelector(item, this);
        } else {
            const data = item.entry || item.data || item;
            const randVal = Math.random();
            if (data.common_mistake && randVal < 0.35) {
                format = 'spot_mistake';
            } else if (data.examples && data.examples.length > 0 && randVal < 0.7) {
                format = 'blank';
            }
        }

        const renderer = this.renderers.get(format) || this.renderers.get('default') || this.renderers.values().next().value;

        if (typeof renderer === 'function') {
            renderer(item, format, container, this);
        }
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
            isCorrect = String(userChoice).toLowerCase().trim() === String(expected).toLowerCase().trim();
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
