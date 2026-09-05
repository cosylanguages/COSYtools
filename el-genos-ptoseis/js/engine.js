class GreekGenderCasesEngine {
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
            let isMasc = q.endsWith('ος') || q.endsWith('ης') || q.endsWith('ας');
            let isFem = q.endsWith('α') || q.endsWith('η');
            this.renderNoun(q, {
                gender: isMasc ? 'Αρσενικό' : (isFem ? 'Θηλυκό' : 'Ουδέτερο'),
                article: isMasc ? 'ο' : (isFem ? 'η' : 'το'),
                definition: `Ουσιαστικό (${q}).`,
                antonyms: [],
                cases: {
                    nom: [isMasc ? 'ο ' + q : (isFem ? 'η ' + q : 'το ' + q), 'οι ' + q + 'ες'],
                    gen: ['του ' + q, 'των ' + q + 'ων'],
                    acc: ['τον ' + q, 'τους ' + q + 'ους'],
                    voc: [q, q + 'ες']
                }
            });
        }
    }

    formatColorCoded(phrase, isIrregular = false) {
        if (isIrregular) {
            return phrase;
        }
        const endings = ['ους', 'ων', 'ες', 'οι', 'ου', 'ος', 'ης', 'ας', 'ια', 'α', 'η', 'ο'];
        let words = phrase.split(' ');
        let lastWord = words.pop();
        for (let end of endings) {
            if (lastWord.endsWith(end) && lastWord.length > end.length) {
                let stem = lastWord.slice(0, -end.length);
                words.push(`<span class="stem">${stem}</span><span class="ending">${end}</span>`);
                return words.join(' ');
            }
        }
        words.push(lastWord);
        return words.join(' ');
    }

    renderNoun(noun, data) {
        document.getElementById('empty-state').style.display = 'none';
        document.getElementById('noun-result-container').style.display = 'block';
        document.getElementById('noun-title').textContent = noun;

        const badge = document.getElementById('gender-badge');
        const artDisplay = (data.article || (data.gender === 'Αρσενικό' ? 'ο' : (data.gender === 'Θηλυκό' ? 'η' : 'το'))).toUpperCase();
        badge.textContent = `${data.gender} (${artDisplay})`;
        badge.className = `badge ${data.gender === 'Αρσενικό' ? 'gender-masc' : (data.gender === 'Θηλυκό' ? 'gender-fem' : 'gender-neut')}`;

        let levelBadge = document.getElementById('noun-cefr-badge');
        if (!levelBadge) {
            levelBadge = document.createElement('span');
            levelBadge.id = 'noun-cefr-badge';
            levelBadge.className = 'badge cefr-badge';
            if (badge) badge.insertAdjacentElement('afterend', levelBadge);
        }
        if (levelBadge) levelBadge.textContent = `Επίπεδο : ${data.level || 'A1'}`;

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

        const antonymsBox = document.getElementById('antonyms-pills');
        if (data.antonyms && data.antonyms.length > 0) {
            document.getElementById('antonyms-container').style.display = 'flex';
            antonymsBox.innerHTML = data.antonyms.map(a => `<button class="antonym-pill" onclick="appEngine.searchNoun('${a}')">↔ ${a}</button>`).join('');
        } else document.getElementById('antonyms-container').style.display = 'none';

        const caseMeta = [
            { sing: 'nom_sing', plur: 'nom_plur', legacy: 'nom', name: 'Ονομαστική' },
            { sing: 'gen_sing', plur: 'gen_plur', legacy: 'gen', name: 'Γενική' },
            { sing: 'acc_sing', plur: 'acc_plur', legacy: 'acc', name: 'Αιτιατική' },
            { sing: 'voc_sing', plur: 'voc_plur', legacy: 'voc', name: 'Κλητική' }
        ];

        const tbody = document.getElementById('cases-table-body');
        tbody.innerHTML = caseMeta.map(c => {
            const singVal = (data.cases && (data.cases[c.sing] || (data.cases[c.legacy] ? data.cases[c.legacy][0] : ''))) || '';
            const plurVal = (data.cases && (data.cases[c.plur] || (data.cases[c.legacy] ? data.cases[c.legacy][1] : ''))) || '';
            return `
            <tr>
                <td><strong>${c.name}</strong></td>
                <td>${this.formatColorCoded(singVal, data.irregular)}</td>
                <td>${this.formatColorCoded(plurVal, data.irregular)}</td>
            </tr>
            `;
        }).join('');
    }

    setPracticeMode(mode) {
        this.gamePracticeMode = mode;
        const gBtn = document.getElementById('mode-gender-btn');
        const cBtn = document.getElementById('mode-cases-btn');
        if (gBtn && cBtn) {
            gBtn.className = mode === 'gender' ? 'badge active-mode' : 'badge';
            cBtn.className = mode === 'cases' ? 'badge active-mode' : 'badge';
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
        if (this.gamePracticeMode === 'cases') {
            this.nextCasesQuestion();
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

    nextCasesQuestion() {
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

        const caseMeta = [
            { key: 'gen_sing', name: 'Γενική ενικού (Gen. Sing.)' },
            { key: 'acc_sing', name: 'Αιτιατική ενικού (Acc. Sing.)' },
            { key: 'nom_plur', name: 'Ονομαστική πληθυντικού (Nom. Plur.)' },
            { key: 'gen_plur', name: 'Γενική πληθυντικού (Gen. Plur.)' },
            { key: 'acc_plur', name: 'Αιτιατική πληθυντικού (Acc. Plur.)' }
        ];

        const targetCase = caseMeta[Math.floor(Math.random() * caseMeta.length)];
        let correctVal = data.cases ? data.cases[targetCase.key] : targetNoun;

        const distractors = new Set();
        if (data.cases) {
            Object.values(data.cases).forEach(val => {
                if (typeof val === 'string' && val && val !== correctVal) {
                    distractors.add(val);
                } else if (Array.isArray(val)) {
                    val.forEach(v => { if (v && v !== correctVal) distractors.add(v); });
                }
            });
        }

        let distractorList = Array.from(distractors).sort(() => 0.5 - Math.random());

        if (distractorList.length < 3) {
            const cleanStem = targetNoun.endsWith('ος') || targetNoun.endsWith('ης') || targetNoun.endsWith('ας') || targetNoun.endsWith('ιο') ? targetNoun.slice(0, -2) : (targetNoun.endsWith('α') || targetNoun.endsWith('η') || targetNoun.endsWith('ο') ? targetNoun.slice(0, -1) : targetNoun);
            const syntheticEndings = ['ου', 'ο', 'οι', 'ων', 'ους', 'ες', 'α'];
            for (let end of syntheticEndings) {
                let synthVal = cleanStem + end;
                if (synthVal !== correctVal && !distractorList.includes(synthVal)) {
                    distractorList.push(synthVal);
                    if (distractorList.length >= 3) break;
                }
            }
        }

        distractorList = distractorList.slice(0, 3);
        const options = [correctVal, ...distractorList].sort(() => 0.5 - Math.random());

        this.currentQuestion = { noun: targetNoun, caseName: targetCase.name, expected: correctVal, isCases: true };

        document.getElementById('game-noun-prompt').textContent = targetNoun;
        let labelEl = document.querySelector('.prompt-label');
        if (labelEl) labelEl.textContent = `Πτώση: ${targetCase.name}`;

        mcGroup.innerHTML = options.map(opt => `
            <button class="mc-option-btn" onclick="appEngine.checkCasesChoice('${opt.replace(/'/g, "\'")}')">${opt}</button>
        `).join('');

        document.getElementById('game-feedback-box').style.display = 'none';
        document.getElementById('game-next-btn').style.display = 'none';
    }

    checkCasesChoice(selected) {
        if (!this.currentQuestion) return;
        const isCorrect = selected === this.currentQuestion.expected;
        const feedback = document.getElementById('game-feedback-box');
        feedback.style.display = 'block';

        if (isCorrect) {
            this.gameScore += 10; this.gameStreak += 1;
            feedback.className = 'feedback-card correct';
            feedback.innerHTML = `✅ Μπράβο! <strong>${this.currentQuestion.noun}</strong> (${this.currentQuestion.caseName}) ➔ <strong>${selected}</strong> (+10 πόντοι).`;
        } else {
            this.gameStreak = 0;
            feedback.className = 'feedback-card wrong';
            feedback.innerHTML = `❌ Λάθος! Η σωστή απάντηση είναι: <strong>${this.currentQuestion.noun}</strong> (${this.currentQuestion.caseName}) ➔ <strong>${this.currentQuestion.expected}</strong>.`;
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
            feedback.innerHTML = `✅ Μπράβο! Η λέξη <strong>${this.currentQuestion.noun}</strong> είναι ${gender}.`;
        } else {
            this.gameStreak = 0;
            feedback.className = 'feedback-card wrong';
            feedback.innerHTML = `❌ Λάθος! Η λέξη <strong>${this.currentQuestion.noun}</strong> είναι ${this.currentQuestion.expectedGender}.`;
        }
        document.getElementById('game-score').textContent = this.gameScore;
        document.getElementById('game-streak').textContent = this.gameStreak;
        document.getElementById('game-next-btn').style.display = 'block';
    }
}

let appEngine;
document.addEventListener('DOMContentLoaded', () => { appEngine = new GreekGenderCasesEngine(); });
