class NounGenderEngine {
    constructor() {
        this.nounDb = {};
        this.isGameActive = false;
        this.gameScore = 0;
        this.gameStreak = 0;
        this.currentQuestion = null;
        this.gamePracticeMode = 'gender';
        this.init();
    }

    async init() {
        try {
            const res = await fetch('data/nouns.json');
            this.nounDb = await res.json();
            this.bindEvents();
        } catch (err) { console.error(err); }
    }

    bindEvents() {
        const input = document.getElementById('noun-search-input');
        if (input) {
            input.addEventListener('input', (e) => this.handleSearchInput(e.target.value));
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') this.searchNoun(input.value);
            });
        }
    }

    handleSearchInput(query) {
        const q = query.trim().toLowerCase();
        const suggestionsBox = document.getElementById('search-suggestions');
        if (!q) { suggestionsBox.style.display = 'none'; return; }
        const matches = Object.keys(this.nounDb).filter(n => n.startsWith(q));
        if (matches.length > 0) {
            suggestionsBox.innerHTML = matches.map(n => `
                <div class="suggestion-item" onclick="appEngine.searchNoun('${n}')">
                    <span><strong>${n}</strong></span>
                    <span class="article">${this.nounDb[n].gender}</span>
                </div>
            `).join('');
            suggestionsBox.style.display = 'block';
        } else { suggestionsBox.style.display = 'none'; }
    }

    searchNoun(query) {
        const q = query.trim().toLowerCase();
        document.getElementById('search-suggestions').style.display = 'none';
        if (this.nounDb[q]) {
            this.renderNoun(q, this.nounDb[q]);
        } else if (q) {
            // Default rule fallback
            const isFem = q.endsWith('e') || q.endsWith('tion') || q.endsWith('té');
            this.renderNoun(q, {
                gender: isFem ? 'Féminin' : 'Masculin',
                article: isFem ? 'la' : 'le',
                definition: `Nom commun (${q}).`,
                antonyms: [],
                plural: q.endsWith('al') ? q.slice(0, -2) + 'aux' : q + 's'
            });
        }
    }

    renderNoun(noun, data) {
        document.getElementById('empty-state').style.display = 'none';
        document.getElementById('noun-result-container').style.display = 'block';
        document.getElementById('noun-title').textContent = noun;

        const badge = document.getElementById('gender-badge');
        badge.textContent = data.gender === 'Masculin' ? '♂️ Masculin (Le / Un)' : '♀️ Féminin (La / Une)';

        let levelBadge = document.getElementById('noun-cefr-badge');
        if (!levelBadge) {
            levelBadge = document.createElement('span');
            levelBadge.id = 'noun-cefr-badge';
            levelBadge.className = 'badge cefr-badge';
            badge.insertAdjacentElement('afterend', levelBadge);
        }
        levelBadge.textContent = `Niveau : ${data.level || 'A1'}`;
        badge.className = `badge ${data.gender === 'Masculin' ? 'gender-masc' : 'gender-fem'}`;

        document.getElementById('noun-definition').textContent = data.definition;

        const ruleBox = document.getElementById('grammar-rule-container');
        const ruleTextEl = document.getElementById('grammar-rule-text');
        if (ruleTextEl && ruleBox) {
            if (data.grammar_rule) {
                ruleTextEl.textContent = data.grammar_rule;
                ruleBox.style.display = 'flex';
            } else {
                ruleBox.style.display = 'none';
            }
        }

        const isVowelStart = /^[aeiouyéèêhô]/i.test(noun);
        const defaultArticle = isVowelStart ? "l'" : (data.gender === 'Masculin' ? 'le' : 'la');
        const article = data.article || defaultArticle;
        document.getElementById('sing-form').innerHTML = `<span class="article">${article}</span> <span class="stem">${noun}</span>`;

        // Plural ending split
        const pluralForm = data.plural || (noun.endsWith('al') ? noun.slice(0, -2) + 'aux' : (noun.endsWith('s') || noun.endsWith('x') ? noun : noun + 's'));
        if (data.irregular) {
            document.getElementById('plur-form').innerHTML = `<span class="article">les</span> <span>${pluralForm}</span>`;
        } else {
            let stem = noun;
            let ending = 's';
            if (pluralForm.endsWith('oux') || pluralForm.endsWith('aux') || pluralForm.endsWith('x')) {
                ending = pluralForm.slice(-1);
                stem = pluralForm.slice(0, -1);
            } else if (pluralForm === noun) {
                stem = noun;
                ending = '';
            } else if (pluralForm.endsWith('s')) {
                stem = pluralForm.slice(0, -1);
                ending = 's';
            } else {
                stem = pluralForm;
                ending = '';
            }
            document.getElementById('plur-form').innerHTML = `<span class="article">les</span> <span class="stem">${stem}</span><span class="ending">${ending}</span>`;
        }

        const antonymsBox = document.getElementById('antonyms-pills');
        if (data.antonyms && data.antonyms.length > 0) {
            document.getElementById('antonyms-container').style.display = 'flex';
            antonymsBox.innerHTML = data.antonyms.map(a => `<button class="antonym-pill" onclick="appEngine.searchNoun('${a}')">↔ ${a}</button>`).join('');
        } else {
            document.getElementById('antonyms-container').style.display = 'none';
        }
    }

    setPracticeMode(mode) {
        this.gamePracticeMode = mode;
        const gBtn = document.getElementById('mode-gender-btn');
        const cBtn = document.getElementById('mode-cases-btn');
        if (gBtn && cBtn) {
            gBtn.className = mode === 'gender' ? 'badge active-mode' : 'badge';
            cBtn.className = mode === 'articles' ? 'badge active-mode' : 'badge';
        }
        this.nextGameQuestion();
    }

    toggleGameMode() {
        this.isGameActive = !this.isGameActive;
        document.getElementById('game-container').style.display = this.isGameActive ? 'block' : 'none';
        document.getElementById('search-section-container').style.display = this.isGameActive ? 'none' : 'block';
        document.getElementById('noun-result-container').style.display = 'none';
        document.getElementById('empty-state').style.display = this.isGameActive ? 'none' : 'block';
        if (this.isGameActive) this.nextGameQuestion();
    }

    nextGameQuestion() {
        if (this.gamePracticeMode === 'articles') {
            this.nextArticlesQuestion();
            return;
        }
        const choiceGroup = document.querySelector('.game-choice-group');
        const mcGroup = document.getElementById('game-mc-options');
        if (choiceGroup) choiceGroup.style.display = 'flex';
        if (mcGroup) mcGroup.style.display = 'none';
        const nouns = Object.keys(this.nounDb);
        const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
        this.currentQuestion = { noun: randomNoun, expectedGender: this.nounDb[randomNoun].gender };
        document.getElementById('game-noun-prompt').textContent = randomNoun;
        document.getElementById('game-feedback-box').style.display = 'none';
        document.getElementById('game-next-btn').style.display = 'none';
    }

    nextArticlesQuestion() {
        const choiceGroup = document.querySelector('.game-choice-group');
        let mcGroup = document.getElementById('game-mc-options');
        if (choiceGroup) choiceGroup.style.display = 'none';
        if (!mcGroup) {
            mcGroup = document.createElement('div');
            mcGroup.id = 'game-mc-options';
            mcGroup.className = 'mc-options-grid';
            document.querySelector('.game-prompt-box').insertAdjacentElement('afterend', mcGroup);
        }
        mcGroup.style.display = 'grid';

        const nouns = Object.keys(this.nounDb);
        if (nouns.length === 0) return;

        const targetNoun = nouns[Math.floor(Math.random() * nouns.length)];
        const data = this.nounDb[targetNoun];

        const prepPatterns = [
            { prep: 'à', combines: { 'le': 'au', 'la': 'à la', "l'": "à l'", 'les': 'aux' } },
            { prep: 'de', combines: { 'le': 'du', 'la': 'de la', "l'": "de l'", 'les': 'des' } }
        ];

        const pat = prepPatterns[Math.floor(Math.random() * prepPatterns.length)];
        const art = data.article || (data.gender === 'Masculin' ? 'le' : 'la');
        const combined = pat.combines[art] || `${pat.prep} ${art}`;
        const correctVal = combined;

        const distractors = new Set();
        const artKeys = ["le", "la", "l'", "les"];
        for (let a of artKeys) {
            let comb = pat.combines[a] || `${pat.prep} ${a}`;
            if (comb !== correctVal) distractors.add(comb);
        }

        const options = [correctVal, ...Array.from(distractors).slice(0, 3)].sort(() => 0.5 - Math.random());

        this.currentQuestion = { noun: targetNoun, prep: pat.prep, art: art, expected: correctVal };

        document.getElementById('game-noun-prompt').textContent = `${pat.prep} + ${art} (${targetNoun})`;
        let labelEl = document.querySelector('.prompt-label');
        if (labelEl) labelEl.textContent = 'Contractez la préposition :';

        mcGroup.innerHTML = options.map(opt => `
            <button class="mc-option-btn" onclick="appEngine.checkArticlesChoice('${opt.replace(/'/g, "\\'")}')">${opt}</button>
        `).join('');

        document.getElementById('game-feedback-box').style.display = 'none';
        document.getElementById('game-next-btn').style.display = 'none';
    }

    checkArticlesChoice(selected) {
        if (!this.currentQuestion) return;
        const isCorrect = selected === this.currentQuestion.expected;
        const feedback = document.getElementById('game-feedback-box');
        feedback.style.display = 'block';

        if (isCorrect) {
            this.gameScore += 10; this.gameStreak += 1;
            feedback.className = 'feedback-card correct';
            feedback.innerHTML = `✅ Excellent ! <strong>${selected} ${this.currentQuestion.noun}</strong> est la forme correcte (+10 pts).`;
        } else {
            this.gameStreak = 0;
            feedback.className = 'feedback-card wrong';
            feedback.innerHTML = `❌ Oups ! La forme correcte est : <strong>${this.currentQuestion.expected} ${this.currentQuestion.noun}</strong>.`;
        }
        document.getElementById('game-score').textContent = this.gameScore;
        document.getElementById('game-streak').textContent = this.gameStreak;
        document.getElementById('game-next-btn').style.display = 'block';
    }

    checkGameChoice(gender) {
        if (!this.currentQuestion) return;
        const isCorrect = gender === this.currentQuestion.expectedGender;
        const feedback = document.getElementById('game-feedback-box');
        feedback.style.display = 'block';
        if (isCorrect) {
            this.gameScore += 10;
            this.gameStreak += 1;
            feedback.className = 'feedback-card correct';
            feedback.innerHTML = `✅ Bravo ! <strong>${this.currentQuestion.noun}</strong> est bien ${gender}.`;
        } else {
            this.gameStreak = 0;
            feedback.className = 'feedback-card wrong';
            feedback.innerHTML = `❌ Erreur ! <strong>${this.currentQuestion.noun}</strong> est ${this.currentQuestion.expectedGender}.`;
        }
        document.getElementById('game-score').textContent = this.gameScore;
        document.getElementById('game-streak').textContent = this.gameStreak;
        document.getElementById('game-next-btn').style.display = 'block';
    }
}

let appEngine;
document.addEventListener('DOMContentLoaded', () => { appEngine = new NounGenderEngine(); });
