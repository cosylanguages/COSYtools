class ItalianGenderEngine {
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
        } catch (e) { console.error(e); }
    }

    bindEvents() {
        const input = document.getElementById('noun-search-input');
        if (input) {
            input.addEventListener('input', (e) => this.handleInput(e.target.value));
            input.addEventListener('keydown', (e) => { if (e.key === 'Enter') this.searchNoun(input.value); });
        }
    }

    handleInput(query) {
        const q = query.trim().toLowerCase();
        const box = document.getElementById('search-suggestions');
        if (!q) { box.style.display = 'none'; return; }
        const matches = Object.keys(this.nounDb).filter(n => n.startsWith(q));
        if (matches.length > 0) {
            box.innerHTML = matches.map(n => `
                <div class="suggestion-item" onclick="appEngine.searchNoun('${n}')">
                    <span><strong>${n}</strong></span>
                    <span>${this.nounDb[n].gender}</span>
                </div>
            `).join('');
            box.style.display = 'block';
        } else box.style.display = 'none';
    }

    searchNoun(query) {
        const q = query.trim().toLowerCase();
        document.getElementById('search-suggestions').style.display = 'none';
        if (this.nounDb[q]) {
            this.renderNoun(q, this.nounDb[q]);
        } else if (q) {
            const isFem = q.endsWith('a');
            this.renderNoun(q, {
                gender: isFem ? 'Femminile' : 'Maschile',
                article: isFem ? 'la' : 'il',
                definition: `Sostantivo (${q}).`,
                antonyms: [],
                plural: isFem ? q.slice(0, -1) + 'e' : q.slice(0, -1) + 'i'
            });
        }
    }

    renderNoun(noun, data) {
        document.getElementById('empty-state').style.display = 'none';
        document.getElementById('noun-result-container').style.display = 'block';
        document.getElementById('noun-title').textContent = noun;
        const badge = document.getElementById('gender-badge');
        badge.textContent = data.gender === 'Maschile' ? '♂️ Maschile (Il / Un)' : '♀️ Femminile (La / Una)';
        badge.className = `badge ${data.gender === 'Maschile' ? 'gender-masc' : 'gender-fem'}`;

        let levelBadge = document.getElementById('noun-cefr-badge');
        if (!levelBadge) {
            levelBadge = document.createElement('span');
            levelBadge.id = 'noun-cefr-badge';
            levelBadge.className = 'badge cefr-badge';
            if (badge) badge.insertAdjacentElement('afterend', levelBadge);
        }
        if (levelBadge) levelBadge.textContent = `Livello : ${data.level || 'A1'}`;

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

        const isFem = data.gender === 'Femminile';
        const isVowel = /^[aeiouàèéìòù]/i.test(noun);
        const defaultArt = isVowel ? "l'" : (isFem ? 'la' : 'il');
        const singArt = data.article || defaultArt;

        let stem = noun.length > 1 ? noun.slice(0, -1) : noun;
        let ending = noun.length > 1 ? noun.slice(-1) : '';
        document.getElementById('sing-form').innerHTML = `<span class="article">${singArt}</span> <span class="stem">${stem}</span><span class="ending">${ending}</span>`;

        const defaultPlur = isFem ? (noun.endsWith('a') ? noun.slice(0, -1) + 'e' : noun + 'e') : (noun.slice(0, -1) + 'i');
        const pluralForm = data.plural || defaultPlur;
        let plurArticle = isFem ? 'le' : (singArt === 'lo' || (isVowel && !isFem) ? 'gli' : 'i');

        if (data.irregular) {
            document.getElementById('plur-form').innerHTML = `<span class="article">${plurArticle}</span> <span>${pluralForm}</span>`;
        } else {
            let plurEnding = pluralForm.length > 1 ? pluralForm.slice(-1) : '';
            let plurStem = pluralForm.length > 1 ? pluralForm.slice(0, -1) : pluralForm;
            document.getElementById('plur-form').innerHTML = `<span class="article">${plurArticle}</span> <span class="stem">${plurStem}</span><span class="ending">${plurEnding}</span>`;
        }

        const antonymsBox = document.getElementById('antonyms-pills');
        if (data.antonyms && data.antonyms.length > 0) {
            document.getElementById('antonyms-container').style.display = 'flex';
            antonymsBox.innerHTML = data.antonyms.map(a => `<button class="antonym-pill" onclick="appEngine.searchNoun('${a}')">↔ ${a}</button>`).join('');
        } else document.getElementById('antonyms-container').style.display = 'none';
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
            { prep: 'in', combines: { 'il': 'nel', 'la': 'nella', "l'": "nell'", 'i': 'nei', 'le': 'nelle' } },
            { prep: 'a', combines: { 'il': 'al', 'la': 'alla', "l'": "all'", 'i': 'ai', 'le': 'alle' } },
            { prep: 'da', combines: { 'il': 'dal', 'la': 'dalla', "l'": "dall'", 'i': 'dai', 'le': 'dalle' } }
        ];

        const pat = prepPatterns[Math.floor(Math.random() * prepPatterns.length)];
        const art = data.article || (data.gender === 'Maschile' ? 'il' : 'la');
        const combined = pat.combines[art] || `${pat.prep} ${art}`;
        const correctVal = combined;

        const distractors = new Set();
        const artKeys = ["il", "la", "l'", "i", "le"];
        for (let a of artKeys) {
            let comb = pat.combines[a] || `${pat.prep} ${a}`;
            if (comb !== correctVal) distractors.add(comb);
        }

        const options = [correctVal, ...Array.from(distractors).slice(0, 3)].sort(() => 0.5 - Math.random());

        this.currentQuestion = { noun: targetNoun, prep: pat.prep, art: art, expected: correctVal };

        document.getElementById('game-noun-prompt').textContent = `${pat.prep} + ${art} (${targetNoun})`;
        let labelEl = document.querySelector('.prompt-label');
        if (labelEl) labelEl.textContent = 'Forma la preposizione articolata:';

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
            feedback.innerHTML = `✅ Eccellente! <strong>${selected} ${this.currentQuestion.noun}</strong> è la forma corretta (+10 pti).`;
        } else {
            this.gameStreak = 0;
            feedback.className = 'feedback-card wrong';
            feedback.innerHTML = `❌ Ops! La forma corretta era: <strong>${this.currentQuestion.expected} ${this.currentQuestion.noun}</strong>.`;
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
            this.gameScore += 10; this.gameStreak += 1;
            feedback.className = 'feedback-card correct';
            feedback.innerHTML = `✅ Bravo! <strong>${this.currentQuestion.noun}</strong> è ${gender}.`;
        } else {
            this.gameStreak = 0;
            feedback.className = 'feedback-card wrong';
            feedback.innerHTML = `❌ Errore! <strong>${this.currentQuestion.noun}</strong> è ${this.currentQuestion.expectedGender}.`;
        }
        document.getElementById('game-score').textContent = this.gameScore;
        document.getElementById('game-streak').textContent = this.gameStreak;
        document.getElementById('game-next-btn').style.display = 'block';
    }
}

let appEngine;
document.addEventListener('DOMContentLoaded', () => { appEngine = new ItalianGenderEngine(); });
