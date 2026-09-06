/**
 * Progress Dashboard Manager for en-irregular-verbs
 * Renders mastery breakdown across CEFR levels (A1-B2+) and pattern groups.
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
        const levels = ['A1', 'A2', 'B1', 'B2', 'B2+'];
        const patterns = [
            { key: "no_change", label: "No Change (cut-cut-cut)" },
            { key: "vowel_change", label: "Vowel Change (sing-sang-sung)" },
            { key: "same_past_participle", label: "Same Past Participle (buy-bought-bought)" },
            { key: "totally_irregular", label: "Totally Irregular (go-went-gone)" },
            { key: "add_en_or_n", label: "Add -en / -n (speak-spoke-spoken)" }
        ];

        let totalWords = 0;
        let totalMastered = 0;
        let totalPracticed = 0;

        const levelStats = {
            'A1': { total: 0, mastered: 0 },
            'A2': { total: 0, mastered: 0 },
            'B1': { total: 0, mastered: 0 },
            'B2': { total: 0, mastered: 0 },
            'B2+': { total: 0, mastered: 0 }
        };

        const patternStats = {};
        patterns.forEach(p => {
            patternStats[p.key] = { total: 0, mastered: 0, label: p.label };
        });

        const verbDb = this.engine.verbDb || {};
        Object.keys(verbDb).forEach(key => {
            const entry = verbDb[key];
            const lvl = entry.level || 'A2';
            const pat = entry.pattern_group || 'no_change';
            const prog = this.srsStore.getWordProgress(key);

            totalWords += 1;
            if (prog.timesCorrect + prog.timesWrong > 0) totalPracticed += 1;
            if (prog.masteryLevel >= 4) totalMastered += 1;

            if (levelStats[lvl]) {
                levelStats[lvl].total += 1;
                if (prog.masteryLevel >= 4) levelStats[lvl].mastered += 1;
            }

            if (patternStats[pat]) {
                patternStats[pat].total += 1;
                if (prog.masteryLevel >= 4) patternStats[pat].mastered += 1;
            }
        });

        const overallPercent = totalWords > 0 ? Math.round((totalMastered / totalWords) * 100) : 0;
        const goalPercent = Math.min(100, Math.round((streakInfo.todayCount / streakInfo.goal) * 100));

        // CEFR Level breakdown grid
        let levelCellsHtml = '';
        levels.forEach(lvl => {
            const stats = levelStats[lvl] || { total: 0, mastered: 0 };
            const pct = stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0;

            levelCellsHtml += `
                <div class="dash-cell">
                    <div class="cell-level">Level ${lvl}</div>
                    <div class="cell-bar-box">
                        <div class="cell-bar-fill" style="width: ${pct}%;"></div>
                    </div>
                    <div class="cell-text">${stats.mastered} / ${stats.total} (${pct}%)</div>
                </div>
            `;
        });

        // Pattern Group breakdown grid
        let patternCellsHtml = '';
        patterns.forEach(p => {
            const stats = patternStats[p.key] || { total: 0, mastered: 0 };
            const pct = stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0;

            patternCellsHtml += `
                <div class="dash-cell" style="grid-column: span 1;">
                    <div class="cell-level" style="font-size: 0.82rem;">${p.label}</div>
                    <div class="cell-bar-box">
                        <div class="cell-bar-fill" style="width: ${pct}%;"></div>
                    </div>
                    <div class="cell-text">${stats.mastered} / ${stats.total} (${pct}%)</div>
                </div>
            `;
        });

        container.innerHTML = `
            <div class="dashboard-header-card">
                <h3>📊 Irregular Verbs Mastery Dashboard</h3>
                <p>Track your spaced-repetition progress across CEFR levels and pedagogical pattern groups.</p>

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
                    <h4>Mastery Breakdown by CEFR Level</h4>
                </div>
                <div class="dash-cells-grid" style="margin-top: 1rem;">
                    ${levelCellsHtml}
                </div>
            </div>

            <div class="dashboard-matrix-card">
                <div class="matrix-header">
                    <h4>Mastery Breakdown by Pattern Group</h4>
                </div>
                <div class="dash-cells-grid" style="margin-top: 1rem;">
                    ${patternCellsHtml}
                </div>
            </div>
        `;
    }
}

window.DashboardManager = DashboardManager;
