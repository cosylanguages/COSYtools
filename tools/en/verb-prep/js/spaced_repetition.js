/**
 * Spaced Repetition Store & Progress Persistence for en-verb-prep
 * Uses localStorage to track mastery level (0-5), due dates, streaks, and SRS intervals.
 */

class SpacedRepetitionStore {
    constructor() {
        this.progressKey = 'cosy-en-verb-prep-progress';
        this.streakKey = 'cosy-en-verb-prep-streak';
        this.goalKey = 'cosy-en-verb-prep-goal';
        this.progress = this.loadProgress();
        this.streakData = this.loadStreak();
        this.dailyGoal = parseInt(localStorage.getItem(this.goalKey) || '1', 10);
    }

    loadProgress() {
        try {
            const raw = localStorage.getItem(this.progressKey);
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            console.error('Failed to load progress:', e);
            return {};
        }
    }

    saveProgress() {
        try {
            localStorage.setItem(this.progressKey, JSON.stringify(this.progress));
        } catch (e) {
            console.error('Failed to save progress:', e);
        }
    }

    loadStreak() {
        try {
            const raw = localStorage.getItem(this.streakKey);
            return raw ? JSON.parse(raw) : { streakDays: 0, lastDate: null, todayCount: 0 };
        } catch (e) {
            return { streakDays: 0, lastDate: null, todayCount: 0 };
        }
    }

    saveStreak() {
        try {
            localStorage.setItem(this.streakKey, JSON.stringify(this.streakData));
        } catch (e) {
            console.error('Failed to save streak:', e);
        }
    }

    getItemKey(type, wordKey) {
        return `${type}:${wordKey.toLowerCase()}`;
    }

    getWordProgress(type, wordKey) {
        const id = this.getItemKey(type, wordKey);
        return this.progress[id] || {
            masteryLevel: 0,
            dueDate: null,
            timesCorrect: 0,
            timesWrong: 0,
            lastSeen: null
        };
    }

    recordAnswer(type, wordKey, isCorrect) {
        const id = this.getItemKey(type, wordKey);
        const current = this.getWordProgress(type, wordKey);
        const now = new Date();

        let newLevel = current.masteryLevel;
        let daysToAdd = 1;

        const intervals = [0, 1, 3, 7, 14, 30];

        if (isCorrect) {
            newLevel = Math.min(5, current.masteryLevel + 1);
            daysToAdd = intervals[newLevel] || 30;
        } else {
            newLevel = Math.max(0, current.masteryLevel - 1);
            daysToAdd = intervals[newLevel] || 1;
        }

        const dueDate = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

        this.progress[id] = {
            masteryLevel: newLevel,
            dueDate: dueDate.toISOString(),
            timesCorrect: current.timesCorrect + (isCorrect ? 1 : 0),
            timesWrong: current.timesWrong + (isCorrect ? 0 : 1),
            lastSeen: now.toISOString()
        };

        this.saveProgress();
        return this.progress[id];
    }

    recordSessionCompletion() {
        const todayStr = new Date().toISOString().split('T')[0];
        if (this.streakData.lastDate === todayStr) {
            this.streakData.todayCount += 1;
        } else {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yestStr = yesterday.toISOString().split('T')[0];

            if (this.streakData.lastDate === yestStr) {
                this.streakData.streakDays += 1;
            } else if (this.streakData.lastDate !== todayStr) {
                this.streakData.streakDays = 1;
            }
            this.streakData.lastDate = todayStr;
            this.streakData.todayCount = 1;
        }
        this.saveStreak();
    }

    setDailyGoal(goal) {
        this.dailyGoal = goal;
        localStorage.setItem(this.goalKey, goal.toString());
    }

    getStreakInfo() {
        const todayStr = new Date().toISOString().split('T')[0];
        if (this.streakData.lastDate && this.streakData.lastDate !== todayStr) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yestStr = yesterday.toISOString().split('T')[0];
            if (this.streakData.lastDate !== yestStr) {
                this.streakData.streakDays = 0;
            }
            this.streakData.todayCount = 0;
        }

        return {
            streakDays: this.streakData.streakDays || 0,
            todayCount: this.streakData.todayCount || 0,
            goal: this.dailyGoal
        };
    }

    getDueCandidatePool(dbMap, targetLevel = 'all', targetWordType = 'all') {
        const nowIso = new Date().toISOString();
        const types = targetWordType === 'all' ? ['verbs', 'nouns', 'adjectives'] : [targetWordType];
        const items = [];

        types.forEach(type => {
            const db = dbMap[type] || {};
            Object.keys(db).forEach(key => {
                const entry = db[key];
                if (targetLevel !== 'all' && entry.level !== targetLevel) return;

                const prog = this.getWordProgress(type, key);
                const isDue = !prog.dueDate || prog.dueDate <= nowIso;

                items.push({
                    type: type,
                    key: key,
                    entry: entry,
                    progress: prog,
                    isDue: isDue,
                    mastery: prog.masteryLevel
                });
            });
        });

        // Priority sort: due items first, then lower mastery, then random
        items.sort((a, b) => {
            if (a.isDue !== b.isDue) return a.isDue ? -1 : 1;
            if (a.mastery !== b.mastery) return a.mastery - b.mastery;
            return Math.random() - 0.5;
        });

        return items;
    }

    getWeakCandidates(dbMap) {
        const items = [];
        ['verbs', 'nouns', 'adjectives'].forEach(type => {
            const db = dbMap[type] || {};
            Object.keys(db).forEach(key => {
                const entry = db[key];
                const prog = this.getWordProgress(type, key);
                if (prog.masteryLevel <= 1) {
                    items.push({
                        type: type,
                        key: key,
                        entry: entry,
                        progress: prog
                    });
                }
            });
        });

        items.sort(() => Math.random() - 0.5);
        return items;
    }
}

window.SpacedRepetitionStore = SpacedRepetitionStore;
