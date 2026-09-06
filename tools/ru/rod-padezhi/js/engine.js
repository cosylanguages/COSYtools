class RussianGenderCasesEngine {
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
                    <span>${this.nounDb[n].gender} род</span>
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
            let isFem = q.endsWith('а') || q.endsWith('я');
            let isNeut = q.endsWith('о') || q.endsWith('е');
            this.renderNoun(q, {
                gender: isFem ? 'Женский' : (isNeut ? 'Средний' : 'Мужской'),
                animacy: 'Неодушевлённое',
                definition: `Существительное (${q}).`,
                antonyms: [],
                cases: {
                    nom: [q, q + 'ы'],
                    gen: [q + 'а', q + 'ов'],
                    dat: [q + 'у', q + 'ам'],
                    acc: [q, q + 'ы'],
                    inst: [q + 'ом', q + 'ами'],
                    prep: [q + 'е', q + 'ах']
                }
            });
        }
    }

    formatColorCoded(word, isIrregular = false) {
        if (isIrregular) {
            return word;
        }
        const endings = ['ами', 'ях', 'ах', 'ов', 'ев', 'ом', 'ем', 'ой', 'ей', 'ам', 'ям', 'а', 'я', 'у', 'ю', 'ы', 'и', 'е', 'о'];
        let clean = word.replace(/[\u0300-\u036f]/g, "");
        for (let end of endings) {
            if (clean.endsWith(end) && clean.length > end.length) {
                let stem = word.slice(0, -end.length);
                let actualEnd = word.slice(-end.length);
                return `<span class="stem">${stem}</span><span class="ending">${actualEnd}</span>`;
            }
        }
        return `<span class="stem">${word}</span>`;
    }

    renderNoun(noun, data) {
        document.getElementById('empty-state').style.display = 'none';
        document.getElementById('noun-result-container').style.display = 'block';
        document.getElementById('noun-title').textContent = noun;

        const badge = document.getElementById('gender-badge');
        badge.textContent = `${data.gender.toLowerCase()} род`;
        badge.className = `badge ${data.gender.toLowerCase() === 'мужской' ? 'gender-masc' : (data.gender.toLowerCase() === 'женский' ? 'gender-fem' : 'gender-neut')}`;
        document.getElementById('animacy-badge').textContent = data.animacy;
        const patternBadge = document.getElementById('gender-pattern-badge');
        if (patternBadge) patternBadge.textContent = this.getEndingClass(noun, data).label;

        let levelBadge = document.getElementById('noun-cefr-badge');
        if (!levelBadge) {
            levelBadge = document.createElement('span');
            levelBadge.id = 'noun-cefr-badge';
            levelBadge.className = 'badge cefr-badge';
            const animacyBadge = document.getElementById('animacy-badge');
            if (animacyBadge) animacyBadge.insertAdjacentElement('afterend', levelBadge);
        }
        if (levelBadge) levelBadge.textContent = `Уровень : ${data.level || 'A1'}`;

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
            { sing: 'nom_sing', plur: 'nom_plur', legacy: 'nom', name: 'Именительный', q: 'Кто? Что?' },
            { sing: 'gen_sing', plur: 'gen_plur', legacy: 'gen', name: 'Родительный', q: 'Кого? Чего?' },
            { sing: 'dat_sing', plur: 'dat_plur', legacy: 'dat', name: 'Дательный', q: 'Кому? Чему?' },
            { sing: 'acc_sing', plur: 'acc_plur', legacy: 'acc', name: 'Винительный', q: 'Кого? Что?' },
            { sing: 'ins_sing', plur: 'ins_plur', legacy: 'inst', name: 'Творительный', q: 'Кем? Чем?' },
            { sing: 'pre_sing', plur: 'pre_plur', legacy: 'prep', name: 'Предложный', q: 'О ком? О чём?' }
        ];

        const tbody = document.getElementById('cases-table-body');
        tbody.innerHTML = caseMeta.map(c => {
            let singVal = data.cases[c.sing] || (data.cases[c.legacy] ? data.cases[c.legacy][0] : '-');
            let plurVal = data.cases[c.plur] || (data.cases[c.legacy] ? data.cases[c.legacy][1] : '-');
            return `
            <tr>
                <td><strong>${c.name}</strong></td>
                <td style="color: var(--ink-muted);">${c.q}</td>
                <td>${this.formatColorCoded(singVal, data.irregular)}</td>
                <td>${this.formatColorCoded(plurVal, data.irregular)}</td>
            </tr>
        `;
        }).join('');
    }

    setPracticeMode(mode) {
        this.gamePracticeMode = mode;
        const gBtn = document.getElementById('mode-gender-btn');
        const eBtn = document.getElementById('mode-ending-btn');
        const cBtn = document.getElementById('mode-cases-btn');
        if (gBtn && cBtn) {
            gBtn.className = mode === 'gender' ? 'badge active-mode' : 'badge';
            cBtn.className = mode === 'cases' ? 'badge active-mode' : 'badge';
        }
        if (eBtn) eBtn.className = mode === 'ending' ? 'badge active-mode' : 'badge';
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
        if (this.gamePracticeMode === 'ending') {
            this.nextEndingQuestion();
            return;
        }
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

    getEndingClass(noun, data) {
        if (data.irregular) return { key: 'exception', label: 'Исключение: запомнить отдельно' };
        const ending = noun.toLowerCase().replace(/[\u0300-\u036f]/g, '').slice(-2);
        if (ending === 'о' || ending === 'е' || ending === 'ё' || ending === 'мя') return { key: 'neuter', label: 'Средний род: типичное окончание -о/-е' };
        if (ending === 'а' || ending === 'я') return { key: 'feminine', label: 'Женский род: типичное окончание -а/-я' };
        if (noun.endsWith('ь')) return { key: 'ambiguous', label: 'Мягкий знак: род нужно запомнить' };
        if (/[бвгджзклмнпрстфхцчшщй]$/.test(noun.toLowerCase())) return { key: 'masculine', label: 'Мужской род: согласная или -й' };
        return { key: 'ambiguous', label: 'Неоднозначное окончание' };
    }

    nextEndingQuestion() {
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
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        const pattern = this.getEndingClass(noun, this.nounDb[noun]);
        const keys = ['masculine', 'feminine', 'neuter', 'ambiguous', 'exception'];
        const labels = ['Мужской род', 'Женский род', 'Средний род', 'Мягкий знак / неоднозначно', 'Исключение'];
        this.currentQuestion = { noun, expectedPattern: pattern.key };
        document.getElementById('game-noun-prompt').textContent = noun;
        const label = document.querySelector('.prompt-label');
        if (label) label.textContent = 'Какой класс окончания?';
        mcGroup.innerHTML = labels.map((option, index) => `<button class="mc-option-btn" onclick="appEngine.checkEndingChoice('${keys[index]}')">${option}</button>`).join('');
        document.getElementById('game-feedback-box').style.display = 'none';
        document.getElementById('game-next-btn').style.display = 'none';
    }

    checkEndingChoice(selected) {
        if (!this.currentQuestion) return;
        const data = this.nounDb[this.currentQuestion.noun];
        const expected = this.getEndingClass(this.currentQuestion.noun, data);
        const isCorrect = selected === expected.key;
        const feedback = document.getElementById('game-feedback-box');
        feedback.style.display = 'block';
        feedback.className = `feedback-card ${isCorrect ? 'correct' : 'wrong'}`;
        feedback.innerHTML = isCorrect
            ? `✅ Правильно! ${expected.label}. ${data.gender} род.`
            : `❌ Правильный класс: <strong>${expected.label}</strong>. ${data.gender} род.`;
        this.gameScore += isCorrect ? 10 : 0;
        this.gameStreak = isCorrect ? this.gameStreak + 1 : 0;
        document.getElementById('game-score').textContent = this.gameScore;
        document.getElementById('game-streak').textContent = this.gameStreak;
        document.getElementById('game-next-btn').style.display = 'block';
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
            { key: 'gen_sing', legacyKey: 'gen', legacyIdx: 0, name: 'Родительный п. (ед.ч.)' },
            { key: 'dat_sing', legacyKey: 'dat', legacyIdx: 0, name: 'Дательный п. (ед.ч.)' },
            { key: 'acc_sing', legacyKey: 'acc', legacyIdx: 0, name: 'Винительный п. (ед.ч.)' },
            { key: 'ins_sing', legacyKey: 'inst', legacyIdx: 0, name: 'Творительный п. (ед.ч.)' },
            { key: 'pre_sing', legacyKey: 'prep', legacyIdx: 0, name: 'Предложный п. (ед.ч.)' },
            { key: 'nom_plur', legacyKey: 'nom', legacyIdx: 1, name: 'Именительный п. (мн.ч.)' },
            { key: 'gen_plur', legacyKey: 'gen', legacyIdx: 1, name: 'Родительный п. (мн.ч.)' }
        ];

        const targetCase = caseMeta[Math.floor(Math.random() * caseMeta.length)];
        let correctVal = data.cases ? (data.cases[targetCase.key] || (data.cases[targetCase.legacyKey] ? data.cases[targetCase.legacyKey][targetCase.legacyIdx] : null)) : null;
        if (!correctVal) correctVal = targetNoun;
        correctVal = correctVal.replace(/[\u0300-\u036f]/g, "");

        const distractors = new Set();
        if (data.cases) {
            caseMeta.forEach(c => {
                let val = data.cases[c.key] || (data.cases[c.legacyKey] ? data.cases[c.legacyKey][c.legacyIdx] : null);
                if (val) {
                    val = val.replace(/[\u0300-\u036f]/g, "");
                    if (val !== correctVal) distractors.add(val);
                }
            });
        }

        let distractorList = Array.from(distractors).sort(() => 0.5 - Math.random());

        if (distractorList.length < 3) {
            const cleanStem = targetNoun.endsWith('а') || targetNoun.endsWith('я') || targetNoun.endsWith('о') || targetNoun.endsWith('е') || targetNoun.endsWith('ь') ? targetNoun.slice(0, -1) : targetNoun;
            const syntheticEndings = ['а', 'у', 'ом', 'е', 'ы', 'ов', 'ам', 'ами', 'ах'];
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
        if (labelEl) labelEl.textContent = `Форма: ${targetCase.name}`;

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
            feedback.innerHTML = `✅ Отлично! <strong>${this.currentQuestion.noun}</strong> (${this.currentQuestion.caseName}) ➔ <strong>${selected}</strong> (+10 очков).`;
        } else {
            this.gameStreak = 0;
            feedback.className = 'feedback-card wrong';
            feedback.innerHTML = `❌ Ошибка! Правильно: <strong>${this.currentQuestion.noun}</strong> (${this.currentQuestion.caseName}) ➔ <strong>${this.currentQuestion.expected}</strong>.`;
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
            feedback.innerHTML = `✅ Отлично! Слово <strong>${this.currentQuestion.noun}</strong> — ${gender} род.`;
        } else {
            this.gameStreak = 0;
            feedback.className = 'feedback-card wrong';
            feedback.innerHTML = `❌ Ошибка! Слово <strong>${this.currentQuestion.noun}</strong> — ${this.currentQuestion.expectedGender} род.`;
        }
        document.getElementById('game-score').textContent = this.gameScore;
        document.getElementById('game-streak').textContent = this.gameStreak;
        document.getElementById('game-next-btn').style.display = 'block';
    }
}

let appEngine;
document.addEventListener('DOMContentLoaded', () => { appEngine = new RussianGenderCasesEngine(); });
