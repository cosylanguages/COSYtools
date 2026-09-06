/**
 * Spaced Repetition Store & Progress Persistence for en-irregular-verbs
 * Uses localStorage to track per-verb mastery level (0-5), due dates, streaks, and SRS intervals.
 */

class SpacedRepetitionStore {
    constructor() {
        this.progressKey = 'cosy-en-irregular-verbs-progress';
        this.streakKey = 'cosy-en-irregular-verbs-streak';
        this.goalKey = 'cosy-en-irregular-verbs-goal';
        this.progress = this.loadProgress();
        this.streakData = this.loadStreak();
        this.dailyGoal = parseInt(localStorage.getItem(this.goalKey) || '1', 10);
    }

    loadProgress() {
        try {
            const raw = localStorage.getItem(this.progressKey);
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            console.error('Failed to load irregular verbs progress:', e);
            return {};
        }
    }

    saveProgress() {
        try {
            localStorage.setItem(this.progressKey, JSON.stringify(this.progress));
        } catch (e) {
            console.error('Failed to save irregular verbs progress:', e);
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

    getItemKey(verbKey) {
        return verbKey.toLowerCase().trim();
    }

    getWordProgress(verbKey) {
        const id = this.getItemKey(verbKey);
        return this.progress[id] || {
            masteryLevel: 0,
            dueDate: null,
            timesCorrect: 0,
            timesWrong: 0,
            lastSeen: null
        };
    }

    recordAnswer(verbKey, isCorrect) {
        const id = this.getItemKey(verbKey);
        const current = this.getWordProgress(verbKey);
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

    getDueCandidatePool(verbDb, targetLevel = 'all', targetPatternGroup = 'all') {
        const nowIso = new Date().toISOString();
        const items = [];

        Object.keys(verbDb).forEach(key => {
            const entry = verbDb[key];
            if (targetLevel !== 'all' && entry.level !== targetLevel) return;
            if (targetPatternGroup !== 'all' && entry.pattern_group !== targetPatternGroup) return;

            const prog = this.getWordProgress(key);
            const isDue = !prog.dueDate || prog.dueDate <= nowIso;

            items.push({
                key: key,
                entry: entry,
                progress: prog,
                isDue: isDue,
                mastery: prog.masteryLevel
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

    getWeakCandidates(verbDb) {
        const items = [];
        Object.keys(verbDb).forEach(key => {
            const entry = verbDb[key];
            const prog = this.getWordProgress(key);
            if (prog.masteryLevel <= 1) {
                items.push({
                    key: key,
                    entry: entry,
                    progress: prog
                });
            }
        });

        items.sort(() => Math.random() - 0.5);
        return items;
    }
}

window.SpacedRepetitionStore = SpacedRepetitionStore;
