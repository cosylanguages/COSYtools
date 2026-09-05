/**
 * Dashboard Manager for it-reggenza
 * Renders CEFR level (A1, A2, B1, B2) x Word Type (Verbi, Nomi, Aggettivi) progress matrix.
 */

class DashboardManager {
    constructor(engine, srsStore) {
        this.engine = engine;
        this.srsStore = srsStore;
    }

    renderDashboard() {
        const container = document.getElementById('dashboard-content-container');
        if (!container) return;

        const levels = ['A1', 'A2', 'B1', 'B2'];
        const wordTypes = [
            { id: 'verbs', name: 'Verbi 🏃', dbKey: 'verbs' },
            { id: 'nouns', name: 'Nomi 📦', dbKey: 'nouns' },
            { id: 'adjectives', name: 'Aggettivi 🎨', dbKey: 'adjectives' }
        ];

        let totalItemsAll = 0;
        let totalMasteredAll = 0;

        const typeRowsHtml = wordTypes.map(wt => {
            const db = this.engine.dbMap[wt.dbKey] || {};
            const keys = Object.keys(db);

            let typeTotal = keys.length;
            let typeMastered = 0;

            const cellsHtml = levels.map(lvl => {
                const lvlKeys = keys.filter(k => db[k].level === lvl);
                let lvlMastered = 0;

                lvlKeys.forEach(k => {
                    const prog = this.srsStore.getWordProgress(wt.dbKey, k);
                    if (prog.masteryLevel >= 4) {
                        lvlMastered += 1;
                        typeMastered += 1;
                        totalMasteredAll += 1;
                    }
                });

                totalItemsAll += lvlKeys.length;

                const percent = lvlKeys.length > 0 ? Math.round((lvlMastered / lvlKeys.length) * 100) : 0;

                return `
                    <div class="dash-cell">
                        <div class="cell-level">${lvl}</div>
                        <div class="cell-bar-box">
                            <div class="cell-bar-fill" style="--percent-width: ${percent}%; width: ${percent}%;"></div>
                        </div>
                        <div class="cell-text">${lvlMastered} / ${lvlKeys.length} (${percent}%)</div>
                    </div>
                `;
            }).join('');

            return `
                <div class="dash-row">
                    <div class="dash-type-head">${wt.name}</div>
                    <div class="dash-cells-grid">
                        ${cellsHtml}
                    </div>
                </div>
            `;
        }).join('');

        const overallPercent = totalItemsAll > 0 ? Math.round((totalMasteredAll / totalItemsAll) * 100) : 0;
        const streakInfo = this.srsStore.getStreakInfo();

        container.innerHTML = `
            <div class="dashboard-header-card">
                <h2>📊 Quadro di Padronanza della Reggenza Italiana</h2>
                <p>Progresso della ripetizione dilazionata (SRS) su verbi, nomi e aggettivi.</p>

                <div class="dash-summary-grid">
                    <div class="summary-metric">
                        <span class="metric-val">${overallPercent}%</span>
                        <span class="metric-lbl">Padronanza Totale</span>
                    </div>
                    <div class="summary-metric">
                        <span class="metric-val">${totalMasteredAll} / ${totalItemsAll}</span>
                        <span class="metric-lbl">Voci Assimilate (Livello ≥ 4)</span>
                    </div>
                    <div class="summary-metric">
                        <span class="metric-val">${streakInfo.streakDays} 🔥</span>
                        <span class="metric-lbl">Serie di Giorni</span>
                    </div>
                </div>
            </div>

            <div class="dashboard-matrix-card">
                <h3>Matrice per Livello CEFR e Tipo di Parola</h3>
                ${typeRowsHtml}
            </div>
        `;
    }
}

window.DashboardManager = DashboardManager;
