class GreekConjugationEngine {
    constructor() {
        this.verbDb = {};
        this.isGameActive = false;
        this.gameScore = 0;
        this.gameStreak = 0;
        this.currentQuestion = null;
        this.gamePracticeMode = 'conjugation';
        this.init();
    }

    async init() {
        try {
            const res = await fetch('data/verbs.json');
            this.verbDb = await res.json();
            this.bindEvents();
        } catch (e) { console.error(e); }
    }

    bindEvents() {
        const input = document.getElementById('verb-search-input');
        if (input) {
            input.addEventListener('input', (e) => this.handleInput(e.target.value));
            input.addEventListener('keydown', (e) => { if (e.key === 'Enter') this.searchVerb(input.value); });
        }
        const gInput = document.getElementById('game-answer-input');
        if (gInput) {
            gInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') this.checkGameAnswer(); });
        }
    }

    handleInput(query) {
        const q = query.trim().toLowerCase();
        const box = document.getElementById('search-suggestions');
        if (!q) { box.style.display = 'none'; return; }
        const matches = Object.keys(this.verbDb).filter(v => v.startsWith(q));
        if (matches.length > 0) {
            box.innerHTML = matches.slice(0, 6).map(v => `
                <div class="suggestion-item" onclick="appEngine.searchVerb('${v}')">
                    <span><strong>${v}</strong></span>
                    <span>${this.verbDb[v].group}</span>
                </div>
            `).join('');
            box.style.display = 'block';
        } else box.style.display = 'none';
    }

    searchVerb(query) {
        const q = query.trim().toLowerCase();
        const box = document.getElementById('search-suggestions');
        if (box) box.style.display = 'none';
        if (this.verbDb[q]) {
            this.renderVerb(q, this.verbDb[q]);
        } else if (q) {
            let stem = q.slice(0, -1);
            this.renderVerb(q, {
                group: 'Τύπος Α\' (-ω)',
                voice: 'Ενεργητική Φωνή',
                definition: `Ρήμα (${q}).`,
                usage_hint: `${q} + αιτιατική (άμεσο αντικείμενο)`,
                antonyms: [],
                tenses: {
                    pres: [`εγώ ${stem}ω`, `εσύ ${stem}εις`, `αυτός ${stem}ει`, `εμείς ${stem}ουμε`, `εσείς ${stem}ετε`, `αυτοί ${stem}ουν`],
                    imp: [`εγώ έ${stem}α`, `εσύ έ${stem}ες`, `αυτός έ${stem}ε`, `εμείς ${stem}αμε`, `εσείς ${stem}ατε`, `αυτοί έ${stem}αν`],
                    aor: [`εγώ έ${stem}α`, `εσύ έ${stem}ες`, `αυτός έ${stem}ε`, `εμείς ${stem}αμε`, `εσείς ${stem}ατε`, `αυτοί έ${stem}αν`],
                    fut: [`εγώ θα ${stem}ω`, `εσύ θα ${stem}εις`, `αυτός θα ${stem}ει`, `εμείς θα ${stem}ουμε`, `εσείς θα ${stem}ετε`, `αυτοί θα ${stem}ουν`],
                    perf: [`εγώ έχω ${stem}ει`, `εσύ έχεις ${stem}ει`, `αυτός έχει ${stem}ει`, `εμείς έχουμε ${stem}ει`, `εσείς έχετε ${stem}ει`, `αυτοί έχουν ${stem}ει`],
                    subj: [`να ${stem}ω`, `να ${stem}εις`, `να ${stem}ει`, `να ${stem}ουμε`, `να ${stem}ετε`, `να ${stem}ουν`],
                    cond: [`θα έ${stem}α`, `θα έ${stem}ες`, `θα έ${stem}ε`, `θα ${stem}αμε`, `θα ${stem}ατε`, `θα έ${stem}αν`],
                    impv: [`${stem}ε!`, `${stem}τε!`]
                }
            });
        }
    }

    formatColorCoded(form, isIrregular = false) {
        if (isIrregular) {
            return form;
        }
        const endings = ['ουμε', 'ετε', 'ουν', 'εις', 'ει', 'αμε', 'ατε', 'αν', 'ες', 'ει', 'ω', 'α'];
        let words = form.split(' ');
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

    renderVerb(verb, data) {
        document.getElementById('empty-state').style.display = 'none';
        document.getElementById('verb-result-container').style.display = 'block';
        document.getElementById('verb-infinitive').textContent = verb;
        document.getElementById('verb-group-badge').textContent = data.group;
        document.getElementById('verb-voice-badge').textContent = data.voice || '—';

        let levelBadge = document.getElementById('verb-cefr-badge');
        if (!levelBadge) {
            levelBadge = document.createElement('span');
            levelBadge.id = 'verb-cefr-badge';
            levelBadge.className = 'badge cefr-badge';
            const voiceBadge = document.getElementById('verb-voice-badge');
            if (voiceBadge) voiceBadge.insertAdjacentElement('afterend', levelBadge);
        }
        if (levelBadge) levelBadge.textContent = `Επίπεδο : ${data.level || 'A1'}`;

        document.getElementById('verb-definition').textContent = data.definition;

        const usageBox = document.getElementById('usage-container');
        const usageHintEl = document.getElementById('verb-usage-hint');
        if (usageHintEl) {
            const usage = data.usage_hint || `${verb} + αιτιατική (άμεσο αντικείμενο)`;
            usageHintEl.textContent = usage;
            if (usageBox) usageBox.style.display = 'flex';
        }

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
            antonymsBox.innerHTML = data.antonyms.map(a => `<button class="antonym-pill" onclick="appEngine.searchVerb('${a}')">↔ ${a}</button>`).join('');
        } else document.getElementById('antonyms-container').style.display = 'none';

        const pronouns = ['εγώ', 'εσύ', 'αυτός/αυτή', 'εμείς', 'εσείς', 'αυτοί/αυτές'];
        const tenseIdList = ['pres', 'imp', 'aor', 'fut', 'perf', 'subj', 'cond', 'impv'];

        for (let t of tenseIdList) {
            const list = document.getElementById(`tense-${t}`);
            if (list && data.tenses && data.tenses[t]) {
                list.innerHTML = data.tenses[t].map((f, i) => {
                    const cleanForm = f.replace(/^(εγώ|εσύ|αυτός\/αυτή|αυτός|αυτή|εμείς|εσείς|αυτοί\/αυτές|αυτοί|αυτές)\s+/i, '').trim();
                    return `<li><span class="pronoun">${pronouns[i] || ''}</span> <span>${this.formatColorCoded(cleanForm, data.irregular)}</span></li>`;
                }).join('');
            }
        }
    }

    toggleGameMode() {
        this.isGameActive = !this.isGameActive;
        document.getElementById('game-container').style.display = this.isGameActive ? 'block' : 'none';
        document.getElementById('search-section-container').style.display = this.isGameActive ? 'none' : 'block';
        document.getElementById('verb-result-container').style.display = 'none';
        document.getElementById('empty-state').style.display = this.isGameActive ? 'none' : 'block';
        if (this.isGameActive) this.nextGameQuestion();
    }

    setPracticeMode(mode) {
        this.gamePracticeMode = mode;
        const cBtn = document.getElementById('mode-conj-btn');
        const gBtn = document.getElementById('mode-prep-btn');
        if (cBtn && gBtn) {
            cBtn.className = mode === 'conjugation' ? 'badge active-mode' : 'badge';
            gBtn.className = mode === 'preposition' ? 'badge active-mode' : 'badge';
        }
        this.nextGameQuestion();
    }

    nextGameQuestion() {
        if (this.gamePracticeMode === 'preposition') {
            this.nextPrepositionQuestion();
            return;
        }
        const answerInput = document.getElementById('game-answer-input');
        const mcGroup = document.getElementById('game-mc-options');
        if (answerInput) answerInput.parentElement.style.display = 'flex';
        if (mcGroup) mcGroup.style.display = 'none';
        const verbs = Object.keys(this.verbDb);
        const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
        const data = this.verbDb[randomVerb];
        const pronouns = ['εγώ', 'εσύ', 'αυτός/αυτή', 'εμείς', 'εσείς', 'αυτοί/αυτές'];
        const pIdx = Math.floor(Math.random() * 6);
        const presForms = data.tenses.pres || [];
        const rawTarget = presForms[pIdx] || 'γράφει';
        const target = rawTarget.replace(/^(εγώ|εσύ|αυτός\/αυτή|εμείς|εσείς|αυτοί\/αυτές)\s+/i, '').trim();

        this.currentQuestion = { verb: randomVerb, pronoun: pronouns[pIdx], expected: target };
        document.getElementById('game-verb-prompt').textContent = randomVerb;
        document.getElementById('game-pronoun-prompt').textContent = pronouns[pIdx];
        document.getElementById('game-feedback-box').style.display = 'none';
        document.getElementById('game-next-btn').style.display = 'none';
        const inp = document.getElementById('game-answer-input');
        inp.value = ''; inp.disabled = false; inp.focus();
    }

    sanitizeUsageHint(hint, verb) {
        if (!hint) return '';
        let clean = hint;

        clean = clean.replace(/\+\s*αιτιατική\s*\([^)]*\)/gi, '+ αιτιατική');

        if (verb) {
            const verbEscaped = verb.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            clean = clean.replace(new RegExp(`^${verbEscaped}\\s+`, 'i'), '');
            clean = clean.replace(new RegExp(`\\b${verbEscaped}\\b`, 'gi'), '');
        }

        clean = clean.replace(/\(\s*\)/g, '').replace(/\s+/g, ' ').trim();
        return clean || hint;
    }

    nextPrepositionQuestion() {
        const inputGroup = document.querySelector('.game-input-group');
        let mcGroup = document.getElementById('game-mc-options');
        if (inputGroup) inputGroup.style.display = 'none';
        if (!mcGroup) {
            mcGroup = document.createElement('div');
            mcGroup.id = 'game-mc-options';
            mcGroup.className = 'mc-options-grid';
            document.querySelector('.game-prompt-box').insertAdjacentElement('afterend', mcGroup);
        }
        mcGroup.style.display = 'grid';

        const verbsWithHints = Object.keys(this.verbDb).filter(k => this.verbDb[k].usage_hint);
        if (verbsWithHints.length === 0) return;

        const targetVerb = verbsWithHints[Math.floor(Math.random() * verbsWithHints.length)];
        const correctRawHint = this.verbDb[targetVerb].usage_hint;
        const correctHint = this.sanitizeUsageHint(correctRawHint, targetVerb);

        const allSanitizedHints = [];
        for (const v of verbsWithHints) {
            const sanitized = this.sanitizeUsageHint(this.verbDb[v].usage_hint, v);
            if (sanitized && sanitized !== correctHint && !allSanitizedHints.includes(sanitized)) {
                allSanitizedHints.push(sanitized);
            }
        }

        allSanitizedHints.sort(() => 0.5 - Math.random());
        const distractors = allSanitizedHints.slice(0, 3);
        const options = [correctHint, ...distractors].sort(() => 0.5 - Math.random());

        this.currentQuestion = { verb: targetVerb, expected: correctHint, isPreposition: true };

        document.getElementById('game-verb-prompt').textContent = targetVerb;
        document.getElementById('game-tense-badge').textContent = 'Προθέσεις & Σύνταξη';
        document.getElementById('game-pronoun-prompt').textContent = 'Επιλέξτε τη σωστή σύνταξη:';

        mcGroup.innerHTML = options.map(opt => `
            <button class="mc-option-btn" onclick="appEngine.checkPrepositionChoice('${opt.replace(/'/g, "\\'")}')">${opt}</button>
        `).join('');

        document.getElementById('game-feedback-box').style.display = 'none';
        document.getElementById('game-submit-btn').style.display = 'none';
        document.getElementById('game-next-btn').style.display = 'none';
    }

    checkPrepositionChoice(selected) {
        if (!this.currentQuestion) return;
        const isCorrect = selected === this.currentQuestion.expected;
        const feedbackBox = document.getElementById('game-feedback-box');
        feedbackBox.style.display = 'block';

        if (isCorrect) {
            this.gameScore += 10; this.gameStreak += 1;
            feedbackBox.className = 'feedback-card correct';
            feedbackBox.innerHTML = `✅ Μπράβο! <strong>${this.currentQuestion.verb}</strong> ➔ ${selected} (+10 πόντοι).`;
        } else {
            this.gameStreak = 0;
            feedbackBox.className = 'feedback-card wrong';
            feedbackBox.innerHTML = `❌ Λάθος! Η σωστή απάντηση είναι: <strong>${this.currentQuestion.verb}</strong> ➔ <strong>${this.currentQuestion.expected}</strong>.`;
        }

        document.getElementById('game-score').textContent = this.gameScore;
        document.getElementById('game-streak').textContent = this.gameStreak;
        document.getElementById('game-next-btn').style.display = 'block';
    }

    checkGameAnswer() {
        if (!this.currentQuestion) return;
        const answer = document.getElementById('game-answer-input').value.trim().toLowerCase();
        const feedback = document.getElementById('game-feedback-box');
        feedback.style.display = 'block';
        if (answer === this.currentQuestion.expected.toLowerCase()) {
            this.gameScore += 10; this.gameStreak += 1;
            feedback.className = 'feedback-card correct';
            feedback.innerHTML = `✅ Μπράβο! <strong>${this.currentQuestion.pronoun} ${this.currentQuestion.expected}</strong> (+10 πόντοι).`;
        } else {
            this.gameStreak = 0;
            feedback.className = 'feedback-card wrong';
            feedback.innerHTML = `❌ Λάθος! Το σωστό είναι: <strong>${this.currentQuestion.pronoun} ${this.currentQuestion.expected}</strong>.`;
        }
        document.getElementById('game-score').textContent = this.gameScore;
        document.getElementById('game-streak').textContent = this.gameStreak;
        document.getElementById('game-next-btn').style.display = 'block';
    }
}

let appEngine;
document.addEventListener('DOMContentLoaded', () => { appEngine = new GreekConjugationEngine(); });
