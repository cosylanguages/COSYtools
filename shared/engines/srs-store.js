/**
 * COSYlanguages Shared SRS Store & Progress Persistence Engine
 * Unified spaced-repetition manager handling Leitner box tracking (levels 0-5),
 * due dates, daily streaks, goals, candidate pools, and dashboard statistics.
 */

class SpacedRepetitionStore {
    constructor(storagePrefix = 'cosy-srs') {
        this.prefix = storagePrefix;
        this.progressKey = `${this.prefix}-progress`;
        this.streakKey = `${this.prefix}-streak`;
        this.goalKey = `${this.prefix}-goal`;

        this.INTERVALS = [0, 1, 3, 7, 14, 30]; // Level 0-5 in days

        this.progress = this.loadProgress();
        this.streakData = this.loadStreak();
        this.dailyGoal = parseInt(localStorage.getItem(this.goalKey) || '10', 10);

        this.checkStreak();
    }

    getTodayStr() {
        return new Date().toISOString().split('T')[0];
    }

    loadProgress() {
        try {
            const raw = localStorage.getItem(this.progressKey);
            if (!raw) return {};

            const parsed = JSON.parse(raw);
            // Handle legacy fr-regime/de-praepositionen nested object structure if present
            if (parsed && typeof parsed === 'object' && parsed.items && !parsed.masteryLevel) {
                if (parsed.streak !== undefined) {
                    this.streakData = {
                        streakDays: parsed.streak || 0,
                        lastDate: parsed.lastActiveDate || null,
                        todayCount: parsed.dailyCompletedToday || 0
                    };
                }
                return parsed.items || {};
            }
            return parsed || {};
        } catch (e) {
            console.error('Failed to load progress for prefix', this.prefix, e);
            return {};
        }
    }

    saveProgress() {
        try {
            localStorage.setItem(this.progressKey, JSON.stringify(this.progress));
        } catch (e) {
            console.error('Failed to save progress for prefix', this.prefix, e);
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
            console.error('Failed to save streak for prefix', this.prefix, e);
        }
    }

    checkStreak() {
        const today = this.getTodayStr();
        if (!this.streakData.lastDate) {
            this.streakData.todayCount = 0;
            return;
        }

        if (this.streakData.lastDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yestStr = yesterday.toISOString().split('T')[0];

            if (this.streakData.lastDate !== yestStr) {
                this.streakData.streakDays = 0;
            }
            this.streakData.todayCount = 0;
        }
    }

    getItemKey(typeOrKey, wordKey) {
        if (wordKey !== undefined && wordKey !== null) {
            return `${typeOrKey}:${String(wordKey).toLowerCase().trim()}`;
        }
        return String(typeOrKey).toLowerCase().trim();
    }

    getWordProgress(typeOrKey, wordKey) {
        const id = this.getItemKey(typeOrKey, wordKey);
        const item = this.progress[id];

        let type = '';
        let key = id;
        if (wordKey !== undefined && wordKey !== null) {
            type = typeOrKey;
            key = wordKey;
        } else if (id.includes(':')) {
            const parts = id.split(':');
            type = parts[0];
            key = parts.slice(1).join(':');
        }

        const masteryLevel = item ? (item.masteryLevel ?? item.level ?? 0) : 0;
        const timesCorrect = item ? (item.timesCorrect ?? item.correctCount ?? 0) : 0;
        const timesWrong = item ? (item.timesWrong ?? 0) : 0;
        const totalReviews = item ? (item.totalReviews ?? (timesCorrect + timesWrong)) : (timesCorrect + timesWrong);
        const streak = item ? (item.streak ?? 0) : 0;

        let dueDateIso = item?.dueDate || null;
        let nextDueTimestamp = item?.nextDue || 0;
        if (item?.dueDate && !nextDueTimestamp) {
            nextDueTimestamp = new Date(item.dueDate).getTime();
        } else if (item?.nextDue && !dueDateIso) {
            dueDateIso = new Date(item.nextDue).toISOString();
        }

        let lastSeenIso = item?.lastSeen || null;
        let lastReviewedTimestamp = item?.lastReviewed || 0;
        if (item?.lastSeen && !lastReviewedTimestamp) {
            lastReviewedTimestamp = new Date(item.lastSeen).getTime();
        } else if (item?.lastReviewed && !lastSeenIso) {
            lastSeenIso = new Date(item.lastReviewed).toISOString();
        }

        return {
            id: id,
            type: type,
            key: key,
            masteryLevel: masteryLevel,
            level: masteryLevel,
            dueDate: dueDateIso,
            nextDue: nextDueTimestamp,
            intervalDays: item?.intervalDays ?? this.INTERVALS[masteryLevel] ?? 0,
            timesCorrect: timesCorrect,
            correctCount: timesCorrect,
            timesWrong: timesWrong,
            totalReviews: totalReviews,
            streak: streak,
            lastSeen: lastSeenIso,
            lastReviewed: lastReviewedTimestamp
        };
    }

    getItemState(typeOrKey, wordKey) {
        return this.getWordProgress(typeOrKey, wordKey);
    }

    recordAnswer(typeOrKey, keyOrIsCorrect, isCorrectArg) {
        let type = '';
        let key = '';
        let isCorrect = false;

        if (typeof isCorrectArg === 'boolean') {
            type = typeOrKey;
            key = keyOrIsCorrect;
            isCorrect = isCorrectArg;
        } else {
            key = typeOrKey;
            isCorrect = Boolean(keyOrIsCorrect);
        }

        const id = this.getItemKey(type ? type : key, type ? key : undefined);
        const current = this.getWordProgress(type ? type : key, type ? key : undefined);
        const now = new Date();
        const nowMs = now.getTime();
        const oldLevel = current.masteryLevel;

        let newLevel = oldLevel;
        let daysToAdd = 1;

        if (isCorrect) {
            newLevel = Math.min(5, oldLevel + 1);
            daysToAdd = this.INTERVALS[newLevel] || 30;
        } else {
            newLevel = Math.max(0, oldLevel - 1);
            daysToAdd = this.INTERVALS[newLevel] || 1;
        }

        const dueDateObj = new Date(nowMs + daysToAdd * 24 * 60 * 60 * 1000);

        const updatedState = {
            id: id,
            type: current.type || type,
            key: current.key || key,
            masteryLevel: newLevel,
            level: newLevel,
            intervalDays: daysToAdd,
            dueDate: dueDateObj.toISOString(),
            nextDue: dueDateObj.getTime(),
            timesCorrect: current.timesCorrect + (isCorrect ? 1 : 0),
            correctCount: current.timesCorrect + (isCorrect ? 1 : 0),
            timesWrong: current.timesWrong + (isCorrect ? 0 : 1),
            totalReviews: current.totalReviews + 1,
            streak: isCorrect ? (current.streak + 1) : 0,
            lastSeen: now.toISOString(),
            lastReviewed: nowMs
        };

        this.progress[id] = updatedState;
        this.saveProgress();

        // Update daily activity streak
        const today = this.getTodayStr();
        if (this.streakData.lastDate !== today) {
            if (this.streakData.lastDate) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yestStr = yesterday.toISOString().split('T')[0];

                if (this.streakData.lastDate === yestStr) {
                    this.streakData.streakDays += 1;
                } else {
                    this.streakData.streakDays = 1;
                }
            } else {
                this.streakData.streakDays = 1;
            }
            this.streakData.lastDate = today;
            this.streakData.todayCount = 1;
        } else {
            this.streakData.todayCount += 1;
        }
        this.saveStreak();

        return {
            ...updatedState,
            oldLevel: oldLevel,
            newLevel: newLevel,
            leveledUp: newLevel > oldLevel,
            mastered: newLevel >= 4 && oldLevel < 4
        };
    }

    recordSessionCompletion() {
        const today = this.getTodayStr();
        if (this.streakData.lastDate === today) {
            this.streakData.todayCount += 1;
        } else {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yestStr = yesterday.toISOString().split('T')[0];

            if (this.streakData.lastDate === yestStr) {
                this.streakData.streakDays += 1;
            } else {
                this.streakData.streakDays = 1;
            }
            this.streakData.lastDate = today;
            this.streakData.todayCount = 1;
        }
        this.saveStreak();
    }

    setDailyGoal(goal) {
        this.dailyGoal = goal;
        localStorage.setItem(this.goalKey, goal.toString());
    }

    getStreakInfo() {
        this.checkStreak();
        return {
            streakDays: this.streakData.streakDays || 0,
            todayCount: this.streakData.todayCount || 0,
            goal: this.dailyGoal
        };
    }

    getDueCandidatePool(dbMap, targetLevel = 'all', targetWordTypeOrPatternGroup = 'all') {
        const nowIso = new Date().toISOString();
        const items = [];

        if (!dbMap) return items;

        const isMultiType = Boolean(dbMap.verbs || dbMap.nouns || dbMap.adjectives);

        if (isMultiType) {
            const types = targetWordTypeOrPatternGroup === 'all'
                ? Object.keys(dbMap).filter(k => typeof dbMap[k] === 'object' && !dbMap[k].level)
                : [targetWordTypeOrPatternGroup];

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
                        data: entry,
                        progress: prog,
                        state: prog,
                        isDue: isDue,
                        mastery: prog.masteryLevel
                    });
                });
            });
        } else {
            Object.keys(dbMap).forEach(key => {
                const entry = dbMap[key];
                if (targetLevel !== 'all' && entry.level !== targetLevel) return;
                if (targetWordTypeOrPatternGroup !== 'all' && entry.pattern_group !== targetWordTypeOrPatternGroup) return;

                const prog = this.getWordProgress(key);
                const isDue = !prog.dueDate || prog.dueDate <= nowIso;

                items.push({
                    key: key,
                    entry: entry,
                    data: entry,
                    progress: prog,
                    state: prog,
                    isDue: isDue,
                    mastery: prog.masteryLevel
                });
            });
        }

        items.sort((a, b) => {
            if (a.isDue !== b.isDue) return a.isDue ? -1 : 1;
            if (a.mastery !== b.mastery) return a.mastery - b.mastery;
            return Math.random() - 0.5;
        });

        return items;
    }

    getWeakCandidates(dbMap) {
        const items = [];
        if (!dbMap) return items;

        const isMultiType = Boolean(dbMap.verbs || dbMap.nouns || dbMap.adjectives);

        if (isMultiType) {
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
                            data: entry,
                            progress: prog,
                            state: prog
                        });
                    }
                });
            });
        } else {
            Object.keys(dbMap).forEach(key => {
                const entry = dbMap[key];
                const prog = this.getWordProgress(key);
                if (prog.masteryLevel <= 1) {
                    items.push({
                        key: key,
                        entry: entry,
                        data: entry,
                        progress: prog,
                        state: prog
                    });
                }
            });
        }

        items.sort(() => Math.random() - 0.5);
        return items;
    }

    getDailySessionItems(datasets, filterType = 'mixed', targetCount = 10) {
        const now = Date.now();
        let candidates = [];

        const typesToInclude = (filterType === 'mixed' || filterType === 'weak')
            ? ['verbs', 'nouns', 'adjectives']
            : [filterType];

        for (const type of typesToInclude) {
            const db = datasets[type] || {};
            for (const key of Object.keys(db)) {
                const data = db[key];
                const state = this.getWordProgress(type, key);

                if (filterType === 'weak') {
                    if (state.totalReviews > 0 && state.masteryLevel <= 1) {
                        candidates.push({ type, key, data, entry: data, state, progress: state, priority: 1 });
                    }
                } else {
                    if (state.totalReviews === 0) {
                        candidates.push({ type, key, data, entry: data, state, progress: state, priority: 3 });
                    } else if (state.nextDue <= now) {
                        candidates.push({ type, key, data, entry: data, state, progress: state, priority: 2 });
                    } else {
                        candidates.push({ type, key, data, entry: data, state, progress: state, priority: 4 });
                    }
                }
            }
        }

        candidates.sort((a, b) => {
            if (a.priority !== b.priority) return a.priority - b.priority;
            return Math.random() - 0.5;
        });

        return candidates.slice(0, targetCount);
    }

    getWeakSpots(datasets) {
        let weak = [];
        const isMultiType = Boolean(datasets.verbs || datasets.nouns || datasets.adjectives);
        const types = isMultiType ? ['verbs', 'nouns', 'adjectives'] : [null];

        types.forEach(type => {
            const db = type ? (datasets[type] || {}) : datasets;
            Object.keys(db).forEach(key => {
                const state = type ? this.getWordProgress(type, key) : this.getWordProgress(key);
                if (state.totalReviews > 0 && state.masteryLevel <= 1) {
                    weak.push({ type, key, data: db[key], entry: db[key], state });
                }
            });
        });
        return weak;
    }

    getDashboardStats(datasets) {
        const levels = ['A1', 'A2', 'B1', 'B2', 'B2+'];
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

        const isMultiType = Boolean(datasets.verbs || datasets.nouns || datasets.adjectives);

        if (isMultiType) {
            types.forEach(t => {
                const db = datasets[t] || {};
                Object.keys(db).forEach(key => {
                    const item = db[key];
                    const lvl = item.level || 'A1';
                    const state = this.getWordProgress(t, key);

                    totalItems += 1;
                    if (matrix[t] && matrix[t][lvl]) {
                        matrix[t][lvl].total += 1;
                        if (state.masteryLevel >= 4) {
                            matrix[t][lvl].mastered += 1;
                            totalMastered += 1;
                        } else if (state.totalReviews > 0) {
                            matrix[t][lvl].reviewing += 1;
                        }
                    }
                });
            });
        }

        const streakInfo = this.getStreakInfo();

        return {
            matrix,
            totalItems,
            totalMastered,
            streak: streakInfo.streakDays,
            streakDays: streakInfo.streakDays,
            dailyCompletedToday: streakInfo.todayCount,
            todayCount: streakInfo.todayCount,
            dailyGoal: streakInfo.goal,
            goal: streakInfo.goal
        };
    }
}

window.SpacedRepetitionStore = SpacedRepetitionStore;
if (typeof module !== 'undefined') {
    module.exports = SpacedRepetitionStore;
}
