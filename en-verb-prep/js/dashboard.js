/**
 * Progress Dashboard Manager for en-verb-prep
 * Renders mastery breakdown grid/bars across CEFR levels A1-B2 and word types (Verbs, Nouns, Adjectives).
 */

class DashboardManager {
    constructor(engine, srsStore) {
        this.engine = engine;
        this.srsStore = srsStore;
    }

    renderDashboard() {
        const container = document.getElementById('dashboard-content-container');
        if (!container) return;

        const streakInfo = this.srsStore.getStreakInfo();
        const types = ['verbs', 'nouns', 'adjectives'];
        const levels = ['A1', 'A2', 'B1', 'B2'];

        let totalWords = 0;
        let totalMastered = 0;
        let totalPracticed = 0;

        const matrix = {
            verbs: { A1: { total: 0, mastered: 0 }, A2: { total: 0, mastered: 0 }, B1: { total: 0, mastered: 0 }, B2: { total: 0, mastered: 0 } },
            nouns: { A1: { total: 0, mastered: 0 }, A2: { total: 0, mastered: 0 }, B1: { total: 0, mastered: 0 }, B2: { total: 0, mastered: 0 } },
            adjectives: { A1: { total: 0, mastered: 0 }, A2: { total: 0, mastered: 0 }, B1: { total: 0, mastered: 0 }, B2: { total: 0, mastered: 0 } }
        };

        types.forEach(type => {
            const db = this.engine.dbMap[type] || {};
            Object.keys(db).forEach(key => {
                const entry = db[key];
                const lvl = entry.level || 'A2';
                const prog = this.srsStore.getWordProgress(type, key);

                totalWords += 1;
                if (prog.timesCorrect + prog.timesWrong > 0) totalPracticed += 1;
                if (prog.masteryLevel >= 4) totalMastered += 1;

                if (matrix[type] && matrix[type][lvl]) {
                    matrix[type][lvl].total += 1;
                    if (prog.masteryLevel >= 4) matrix[type][lvl].mastered += 1;
                }
            });
        });

        const overallPercent = totalWords > 0 ? Math.round((totalMastered / totalWords) * 100) : 0;
        const goalPercent = Math.min(100, Math.round((streakInfo.todayCount / streakInfo.goal) * 100));

        let gridRowsHtml = '';
        types.forEach(type => {
            const typeLabel = type === 'verbs' ? '🏃 Verbs' : (type === 'nouns' ? '📦 Nouns' : '🎨 Adjectives');
            gridRowsHtml += `<div class="dash-row"><div class="dash-type-head">${typeLabel}</div><div class="dash-cells-grid">`;

            levels.forEach(lvl => {
                const stats = matrix[type][lvl] || { total: 0, mastered: 0 };
                const pct = stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0;

                gridRowsHtml += `
                    <div class="dash-cell">
                        <div class="cell-level">${lvl}</div>
                        <div class="cell-bar-box">
                            <div class="cell-bar-fill" style="width: ${pct}%;"></div>
                        </div>
                        <div class="cell-text">${stats.mastered} / ${stats.total} (${pct}%)</div>
                    </div>
                `;
            });
            gridRowsHtml += `</div></div>`;
        });

        container.innerHTML = `
            <div class="dashboard-header-card">
                <h3>📊 Preposition Mastery Dashboard</h3>
                <p>Track your spaced-repetition progress across levels and word classes.</p>

                <div class="dash-summary-grid">
                    <div class="summary-metric">
                        <span class="metric-val">${streakInfo.streakDays}🔥</span>
                        <span class="metric-lbl">Daily Streak</span>
                    </div>
                    <div class="summary-metric">
                        <span class="metric-val">${totalMastered} / ${totalWords}</span>
                        <span class="metric-lbl">Mastered (${overallPercent}%)</span>
                    </div>
                    <div class="summary-metric">
                        <span class="metric-val">${streakInfo.todayCount} / ${streakInfo.goal}</span>
                        <span class="metric-lbl">Daily Goal (${goalPercent}%)</span>
                    </div>
                </div>
            </div>

            <div class="dashboard-matrix-card">
                <div class="matrix-header">
                    <h4>Mastery Breakdown by CEFR Level &amp; Word Type</h4>
                </div>
                <div class="matrix-grid-container">
                    ${gridRowsHtml}
                </div>
            </div>
        `;
    }
}

window.DashboardManager = DashboardManager;
