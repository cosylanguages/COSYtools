/**
 * COSYlanguages Standalone App — Régime prépositionnel français SRS Manager
 * Manages per-word mastery tracking (level 0–5), Leitner/SRS due dates, daily streaks,
 * progress dashboard matrices, and weak-spot deck in localStorage ("cosy-fr-regime-progress").
 */

class FrRegimeSrsManager {
    constructor() {
        this.STORAGE_KEY = "cosy-fr-regime-progress";
        this.INTERVALS = [0, 1, 3, 7, 14, 30]; // Level 0-5 in days
        this.progress = this.loadProgress();
        this.checkStreak();
    }

    loadProgress() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                return {
                    streak: parsed.streak || 0,
                    lastActiveDate: parsed.lastActiveDate || "",
                    dailyGoal: parsed.dailyGoal || 10,
                    dailyCompletedToday: parsed.dailyCompletedToday || 0,
                    items: parsed.items || {}
                };
            }
        } catch (e) {
            console.error("Failed to load SRS progress:", e);
        }

        return {
            streak: 0,
            lastActiveDate: "",
            dailyGoal: 10,
            dailyCompletedToday: 0,
            items: {}
        };
    }

    saveProgress() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.progress));
        } catch (e) {
            console.error("Failed to save SRS progress:", e);
        }
    }

    getTodayStr() {
        return new Date().toISOString().slice(0, 10);
    }

    checkStreak() {
        const today = this.getTodayStr();
        if (!this.progress.lastActiveDate) {
            this.progress.dailyCompletedToday = 0;
            return;
        }

        const last = new Date(this.progress.lastActiveDate);
        const curr = new Date(today);
        const diffDays = Math.floor((curr - last) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            // Consecutive day
            if (this.progress.lastActiveDate !== today) {
                this.progress.dailyCompletedToday = 0;
            }
        } else if (diffDays > 1) {
            // Streak broken
            this.progress.streak = 0;
            this.progress.dailyCompletedToday = 0;
        } else if (diffDays === 0) {
            // Same day
        }
    }

    getItemState(type, key) {
        const id = `${type}:${key}`;
        if (!this.progress.items[id]) {
            this.progress.items[id] = {
                id: id,
                type: type,
                key: key,
                level: 0,
                intervalDays: 0,
                nextDue: 0,
                lastReviewed: 0,
                totalReviews: 0,
                correctCount: 0,
                streak: 0
            };
        }
        return this.progress.items[id];
    }

    recordAnswer(type, key, isCorrect) {
        const item = this.getItemState(type, key);
        const now = Date.now();

        item.lastReviewed = now;
        item.totalReviews += 1;

        const oldLevel = item.level;

        if (isCorrect) {
            item.correctCount += 1;
            item.streak += 1;
            item.level = Math.min(5, item.level + 1);
        } else {
            item.streak = 0;
            item.level = Math.max(0, item.level - 1);
        }

        item.intervalDays = this.INTERVALS[item.level];
        item.nextDue = now + item.intervalDays * 24 * 60 * 60 * 1000;

        // Daily activity tracking
        const today = this.getTodayStr();
        if (this.progress.lastActiveDate !== today) {
            if (this.progress.lastActiveDate) {
                const last = new Date(this.progress.lastActiveDate);
                const curr = new Date(today);
                const diffDays = Math.floor((curr - last) / (1000 * 60 * 60 * 24));
                if (diffDays === 1) {
                    this.progress.streak += 1;
                } else if (diffDays > 1) {
                    this.progress.streak = 1;
                }
            } else {
                this.progress.streak = 1;
            }
            this.progress.lastActiveDate = today;
            this.progress.dailyCompletedToday = 1;
        } else {
            this.progress.dailyCompletedToday += 1;
        }

        this.saveProgress();

        return {
            id: item.id,
            oldLevel: oldLevel,
            newLevel: item.level,
            leveledUp: item.level > oldLevel,
            mastered: item.level >= 4 && oldLevel < 4
        };
    }

    getDailySessionItems(datasets, filterType = 'mixed', targetCount = 10) {
        const now = Date.now();
        let candidates = [];

        const typesToInclude = filterType === 'mixed' || filterType === 'weak'
            ? ['verbs', 'nouns', 'adjectives']
            : [filterType];

        for (const type of typesToInclude) {
            const db = datasets[type] || {};
            for (const key of Object.keys(db)) {
                const data = db[key];
                const state = this.getItemState(type, key);

                if (filterType === 'weak') {
                    if (state.totalReviews > 0 && state.level <= 1) {
                        candidates.push({ type, key, data, state, priority: 1 });
                    }
                } else {
                    if (state.totalReviews === 0) {
                        // New item
                        candidates.push({ type, key, data, state, priority: 3 });
                    } else if (state.nextDue <= now) {
                        // Due item
                        candidates.push({ type, key, data, state, priority: 2 });
                    } else {
                        // Practice anyway if pool is small
                        candidates.push({ type, key, data, state, priority: 4 });
                    }
                }
            }
        }

        // Sort by priority (due > new > remaining) and randomize equal priorities
        candidates.sort((a, b) => {
            if (a.priority !== b.priority) return a.priority - b.priority;
            return Math.random() - 0.5;
        });

        return candidates.slice(0, targetCount);
    }

    getWeakSpots(datasets) {
        let weak = [];
        for (const type of ['verbs', 'nouns', 'adjectives']) {
            const db = datasets[type] || {};
            for (const key of Object.keys(db)) {
                const state = this.getItemState(type, key);
                if (state.totalReviews > 0 && state.level <= 1) {
                    weak.push({ type, key, data: db[key], state });
                }
            }
        }
        return weak;
    }

    getDashboardStats(datasets) {
        const levels = ['A1', 'A2', 'B1', 'B2'];
        const types = ['verbs', 'nouns', 'adjectives'];
        const matrix = {};

        let totalMastered = 0;
        let totalItems = 0;

        types.forEach(t => {
            matrix[t] = {};
            levels.forEach(l => {
                matrix[t][l] = { total: 0, mastered: 0, reviewing: 0 };
            });
        });

        types.forEach(t => {
            const db = datasets[t] || {};
            Object.keys(db).forEach(key => {
                const item = db[key];
                const lvl = item.level || 'A1';
                const state = this.getItemState(t, key);

                if (matrix[t][lvl]) {
                    matrix[t][lvl].total += 1;
                    totalItems += 1;
                    if (state.level >= 4) {
                        matrix[t][lvl].mastered += 1;
                        totalMastered += 1;
                    } else if (state.totalReviews > 0) {
                        matrix[t][lvl].reviewing += 1;
                    }
                }
            });
        });

        return {
            matrix,
            totalItems,
            totalMastered,
            streak: this.progress.streak,
            dailyCompletedToday: this.progress.dailyCompletedToday,
            dailyGoal: this.progress.dailyGoal
        };
    }
}

if (typeof module !== 'undefined') {
    module.exports = FrRegimeSrsManager;
}
