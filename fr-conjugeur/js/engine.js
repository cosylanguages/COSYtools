/**
 * COSYlanguages Standalone App — French Conjugation Engine (fr-conjugeur)
 * Includes pattern recognition ending markup and interactive Practice Game mode.
 */

class ConjugationEngine {
    constructor() {
        this.verbDb = {};
        this.formToInfinitiveMap = {};
        this.isGameActive = false;
        this.gameScore = 0;
        this.gameStreak = 0;
        this.currentQuestion = null;
        this.gamePracticeMode = 'conjugation';
        this.init();
    }

    async init() {
        try {
            const response = await fetch('data/verbs.json');
            this.verbDb = await response.json();
            this.buildLemmatizationIndex();
            this.bindEvents();
        } catch (err) {
            console.error("Failed to load verbs database:", err);
        }
    }

    buildLemmatizationIndex() {
        this.formToInfinitiveMap = {};
        for (const [infinitive, data] of Object.entries(this.verbDb)) {
            this.formToInfinitiveMap[infinitive.toLowerCase()] = infinitive;
            if (data.tenses) {
                for (const forms of Object.values(data.tenses)) {
                    forms.forEach(fullForm => {
                        const cleanForm = fullForm
                            .replace(/^(je|j'|tu|il\/elle|nous|vous|ils\/elles|que|qu'|que tu|que nous|que vous)\s+/i, '')
                            .trim()
                            .toLowerCase();
                        if (cleanForm) {
                            this.formToInfinitiveMap[cleanForm] = infinitive;
                        }
                    });
                }
            }
        }
    }

    bindEvents() {
        const input = document.getElementById('verb-search-input');
        const clearBtn = document.getElementById('clear-search-btn');
        const ttsBtn = document.getElementById('speak-verb-btn');
        const gameInput = document.getElementById('game-answer-input');

        if (input) {
            input.addEventListener('input', (e) => this.handleSearchInput(e.target.value));
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.searchVerb(input.value);
                    this.hideSuggestions();
                }
            });
        }

        if (gameInput) {
            gameInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.checkGameAnswer();
                }
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                input.value = '';
                clearBtn.style.display = 'none';
                this.resetDisplay();
            });
        }

        if (ttsBtn) {
            ttsBtn.addEventListener('click', () => {
                const infinitive = document.getElementById('verb-infinitive').textContent;
                if (infinitive && 'speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance(infinitive);
                    utterance.lang = 'fr-FR';
                    window.speechSynthesis.speak(utterance);
                }
            });
        }
    }

    handleSearchInput(query) {
        const clearBtn = document.getElementById('clear-search-btn');
        const suggestionsBox = document.getElementById('search-suggestions');
        const cleanQuery = query.trim().toLowerCase();

        if (clearBtn) {
            clearBtn.style.display = cleanQuery ? 'block' : 'none';
        }

        if (!cleanQuery) {
            this.hideSuggestions();
            return;
        }

        const matches = new Set();
        for (const [form, infinitive] of Object.entries(this.formToInfinitiveMap)) {
            if (form.startsWith(cleanQuery)) {
                matches.add(infinitive);
                if (matches.size >= 6) break;
            }
        }

        if (matches.size > 0 && suggestionsBox) {
            suggestionsBox.innerHTML = Array.from(matches).map(inf => `
                <div class="suggestion-item" onclick="appEngine.selectSuggestion('${inf}')">
                    <span><strong>${inf}</strong></span>
                    <span style="color: var(--ink-muted); font-size: 0.85rem;">${this.verbDb[inf]?.group || ''}</span>
                </div>
            `).join('');
            suggestionsBox.style.display = 'block';
        } else if (suggestionsBox) {
            this.hideSuggestions();
        }
    }

    selectSuggestion(infinitive) {
        const input = document.getElementById('verb-search-input');
        if (input) input.value = infinitive;
        this.hideSuggestions();
        this.searchVerb(infinitive);
    }

    hideSuggestions() {
        const suggestionsBox = document.getElementById('search-suggestions');
        if (suggestionsBox) suggestionsBox.style.display = 'none';
    }

    searchVerb(query) {
        if (!query) return;
        if (this.isGameActive) this.toggleGameMode();

        const cleanQuery = query.trim().toLowerCase();
        let targetInfinitive = this.formToInfinitiveMap[cleanQuery] || cleanQuery;

        if (this.verbDb[targetInfinitive]) {
            this.renderVerbResult(targetInfinitive, this.verbDb[targetInfinitive]);
        } else if (targetInfinitive.endsWith('er')) {
            const generatedData = this.generateRegularErVerb(targetInfinitive);
            this.renderVerbResult(targetInfinitive, generatedData);
        } else {
            alert(`Désolé, le verbe "${query}" n'est pas encore dans la base de données.`);
        }
    }

    generateRegularErVerb(infinitive) {
        const stem = infinitive.slice(0, -2);
        const startsWithVowel = /^[aeiouyéèêh]/i.test(infinitive);
        const jePronoun = startsWithVowel ? "j'" : "je ";
        const queJePronoun = startsWithVowel ? "que j'" : "que je ";
        return {
            group: "1er groupe (-er)",
            auxiliary: "avoir",
            definition: `Action de ${infinitive}.`,
            usage_hint: `${infinitive} + COD (complément d'objet direct)`,
            antonyms: [],
            tenses: {
                indicatif_present: [`${jePronoun}${stem}e`, `tu ${stem}es`, `il/elle ${stem}e`, `nous ${stem}ons`, `vous ${stem}ez`, `ils/elles ${stem}ent`],
                indicatif_imparfait: [`${jePronoun}${stem}ais`, `tu ${stem}ais`, `il/elle ${stem}ait`, `nous ${stem}ions`, `vous ${stem}iez`, `ils/elles ${stem}aient`],
                pc: [`j'ai ${stem}é`, `tu as ${stem}é`, `il/elle a ${stem}é`, `nous avons ${stem}é`, `vous avez ${stem}é`, `ils/elles ont ${stem}é`],
                pqp: [`j'avais ${stem}é`, `tu avais ${stem}é`, `il/elle avait ${stem}é`, `nous avions ${stem}é`, `vous aviez ${stem}é`, `ils/elles avaient ${stem}é`],
                indicatif_futur_simple: [`${jePronoun}${infinitive}ai`, `tu ${infinitive}as`, `il/elle ${infinitive}a`, `nous ${infinitive}ons`, `vous ${infinitive}ez`, `ils/elles ${infinitive}ont`],
                fut_ant: [`j'aurai ${stem}é`, `tu auras ${stem}é`, `il/elle aura ${stem}é`, `nous aurons ${stem}é`, `vous aurez ${stem}é`, `ils/elles auront ${stem}é`],
                conditionnel_present: [`${jePronoun}${infinitive}ais`, `tu ${infinitive}ais`, `il/elle ${infinitive}ait`, `nous ${infinitive}ions`, `vous ${infinitive}iez`, `ils/elles ${infinitive}aient`],
                cond_pass: [`j'aurais ${stem}é`, `tu aurais ${stem}é`, `il/elle aurait ${stem}é`, `nous aurions ${stem}é`, `vous auriez ${stem}é`, `ils/elles auraient ${stem}é`],
                subjonctif_present: [`${queJePronoun}${stem}e`, `que tu ${stem}es`, `qu'il/elle ${stem}e`, `que nous ${stem}ions`, `que vous ${stem}iez`, `qu'ils/elles ${stem}ent`],
                subj_pass: [`que j'aie ${stem}é`, `que tu aies ${stem}é`, `qu'il/elle ait ${stem}é`, `que nous ayons ${stem}é`, `que vous ayez ${stem}é`, `qu'ils/elles aient ${stem}é`],
                imperatif: [`${stem}e !`, `${stem}ons !`, `${stem}ez !`],
                part: [`${stem}ant`, `${stem}é`]
            }
        };
    }

    formatColorCodedForm(form, infinitive, isIrregular = false) {
        if (isIrregular) {
            return form;
        }
        const regularEndings = ['issent', 'issez', 'issons', 'issais', 'issait', 'issaient', 'issiez', 'issions', 'eraient', 'erions', 'eriez', 'erais', 'erait', 'eront', 'erez', 'erons', 'eras', 'erai', 'aient', 'ions', 'iez', 'ais', 'ait', 'ons', 'ez', 'ent', 'es', 'is', 'it', 'e', 's', 't', 'é'];

        let words = form.split(' ');
        let lastWord = words.pop();

        for (let ending of regularEndings) {
            if (lastWord.endsWith(ending) && lastWord.length > ending.length) {
                let stemPart = lastWord.slice(0, -ending.length);
                let coloredLastWord = `<span class="stem">${stemPart}</span><span class="ending">${ending}</span>`;
                words.push(coloredLastWord);
                return words.join(' ');
            }
        }
        words.push(lastWord);
        return words.join(' ');
    }

    renderVerbResult(infinitive, data) {
        document.getElementById('empty-state').style.display = 'none';
        const resultCard = document.getElementById('verb-result-container');
        resultCard.style.display = 'block';

        document.getElementById('verb-infinitive').textContent = infinitive;
        document.getElementById('verb-group-badge').textContent = data.group;
        document.getElementById('verb-aux-badge').textContent = `Auxiliaire : ${data.auxiliary}`;

        let levelBadge = document.getElementById('verb-cefr-badge');
        if (!levelBadge) {
            levelBadge = document.createElement('span');
            levelBadge.id = 'verb-cefr-badge';
            levelBadge.className = 'badge cefr-badge';
            document.getElementById('verb-aux-badge').insertAdjacentElement('afterend', levelBadge);
        }
        levelBadge.textContent = `Niveau : ${data.level || 'A1'}`;
        document.getElementById('verb-definition').textContent = data.definition || 'Définition indisponible.';

        const usageBox = document.getElementById('usage-container');
        const usageHintEl = document.getElementById('verb-usage-hint');
        if (usageHintEl) {
            const usage = data.usage_hint || `${infinitive} + COD`;
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
            antonymsBox.innerHTML = data.antonyms.map(ant => `
                <button class="antonym-pill" onclick="appEngine.searchVerb('${ant}')">↔ ${ant}</button>
            `).join('');
        } else {
            document.getElementById('antonyms-container').style.display = 'none';
        }

        const pronounsMap = {
            indicatif_present: ["je", "tu", "il/elle", "nous", "vous", "ils/elles"],
            indicatif_imparfait: ["je", "tu", "il/elle", "nous", "vous", "ils/elles"],
            pc: ["j'", "tu", "il/elle", "nous", "vous", "ils/elles"],
            pqp: ["j'", "tu", "il/elle", "nous", "vous", "ils/elles"],
            indicatif_futur_simple: ["je", "tu", "il/elle", "nous", "vous", "ils/elles"],
            fut_ant: ["j'", "tu", "il/elle", "nous", "vous", "ils/elles"],
            subjonctif_present: ["que je", "que tu", "qu'il/elle", "que nous", "que vous", "qu'ils/elles"],
            subj_pass: ["que j'", "que tu", "qu'il/elle", "que nous", "que vous", "qu'ils/elles"],
            conditionnel_present: ["je", "tu", "il/elle", "nous", "vous", "ils/elles"],
            cond_pass: ["j'", "tu", "il/elle", "nous", "vous", "ils/elles"],
            imperatif: ["(2e pers.)", "(1re pl.)", "(2e pl.)"],
            part: ["Présent", "Passé"]
        };

        const tenseIdMap = {
            indicatif_present: "pres",
            indicatif_imparfait: "imp",
            indicatif_futur_simple: "fut",
            conditionnel_present: "cond",
            cond_pass: "cond_pass",
            subjonctif_present: "subj",
            subj_pass: "subj_pass",
            pqp: "pqp",
            fut_ant: "fut_ant",
            imperatif: "impv",
            part: "part",
            pc: "pc"
        };

        for (const [tenseKey, forms] of Object.entries(data.tenses)) {
            const targetId = tenseIdMap[tenseKey] || tenseKey;
            const listEl = document.getElementById(`tense-${targetId}`);
            if (listEl) {
                listEl.innerHTML = forms.map((form, idx) => {
                    const cleanForm = form.replace(/^(je\s+|j'|tu\s+|il\/elle\s+|nous\s+|vous\s+|ils\/elles\s+|que\s+je\s+|que\s+j'|que\s+tu\s+|qu'il\/elle\s+|que\s+nous\s+|que\s+vous\s+|qu'ils\/elles\s+)/i, '').trim();
                    const formattedForm = this.formatColorCodedForm(cleanForm, infinitive, data.irregular);
                    return `<li><span class="pronoun">${pronounsMap[tenseKey]?.[idx] || ''}</span> <span class="verb-form">${formattedForm}</span></li>`;
                }).join('');
            }
        }
    }

    resetDisplay() {
        document.getElementById('verb-result-container').style.display = 'none';
        document.getElementById('empty-state').style.display = 'block';
    }

    /* ==========================================================================
       Interactive Practice Game Logic
       ========================================================================== */

    toggleGameMode() {
        this.isGameActive = !this.isGameActive;
        const toggleBtn = document.getElementById('toggle-game-btn');
        const gameContainer = document.getElementById('game-container');
        const searchContainer = document.getElementById('search-section-container');
        const resultContainer = document.getElementById('verb-result-container');
        const emptyState = document.getElementById('empty-state');

        if (this.isGameActive) {
            toggleBtn.textContent = '📖 Mode Dictionnaire';
            toggleBtn.style.backgroundColor = 'var(--sage-primary)';
            toggleBtn.style.color = '#ffffff';
            gameContainer.style.display = 'block';
            searchContainer.style.display = 'none';
            resultContainer.style.display = 'none';
            emptyState.style.display = 'none';
            this.nextGameQuestion();
        } else {
            toggleBtn.textContent = '🎮 Mode Entraînement';
            toggleBtn.style.backgroundColor = 'var(--cream-card)';
            toggleBtn.style.color = 'var(--sage-primary)';
            gameContainer.style.display = 'none';
            searchContainer.style.display = 'block';
            this.resetDisplay();
        }
    }

    setPracticeMode(mode) {
        this.gamePracticeMode = mode;
        const cBtn = document.getElementById('mode-conj-btn');
        const aBtn = document.getElementById('mode-aux-btn');
        const gBtn = document.getElementById('mode-prep-btn');
        if (cBtn) cBtn.className = mode === 'conjugation' ? 'badge active-mode' : 'badge';
        if (aBtn) aBtn.className = mode === 'auxiliary' ? 'badge active-mode' : 'badge';
        if (gBtn) gBtn.className = mode === 'preposition' ? 'badge active-mode' : 'badge';
        this.nextGameQuestion();
    }

    nextGameQuestion() {
        if (this.gamePracticeMode === 'preposition') {
            this.nextPrepositionQuestion();
            return;
        }
        if (this.gamePracticeMode === 'auxiliary') {
            this.nextAuxiliaryQuestion();
            return;
        }
        const gameAnsInput = document.getElementById('game-answer-input');
        const mcGroup = document.getElementById('game-mc-options');
        if (gameAnsInput && gameAnsInput.parentElement) gameAnsInput.parentElement.style.display = 'flex';
        if (mcGroup) mcGroup.style.display = 'none';
        const verbs = Object.keys(this.verbDb);
        if (verbs.length === 0) return;

        const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
        const verbData = this.verbDb[randomVerb];

        const tenseKeys = ['indicatif_present', 'indicatif_imparfait', 'pc', 'indicatif_futur_simple', 'conditionnel_present', 'subjonctif_present'];
        const tenseNameMap = {
            indicatif_present: 'Présent',
            indicatif_imparfait: 'Imparfait',
            pc: 'Passé composé',
            indicatif_futur_simple: 'Futur simple',
            conditionnel_present: 'Conditionnel Présent',
            subjonctif_present: 'Subjonctif Présent'
        };
        const pronouns = ['je', 'tu', 'il/elle', 'nous', 'vous', 'ils/elles'];

        const randomTense = tenseKeys[Math.floor(Math.random() * tenseKeys.length)];
        const tenseForms = verbData.tenses?.[randomTense];
        if (!tenseForms || tenseForms.length === 0) {
            this.nextGameQuestion();
            return;
        }

        const isSingleForm = tenseForms.length === 1;
        const randomIdx = isSingleForm ? 0 : Math.floor(Math.random() * Math.min(tenseForms.length, 6));
        const targetForm = tenseForms[randomIdx];
        const pronoun = isSingleForm ? 'il/elle' : (pronouns[randomIdx] || 'il/elle');

        const cleanExpected = targetForm
            .replace(/^((je|tu|il\/elle|nous|vous|ils\/elles|que|qu'|que tu|que nous|que vous)\s+|j')/i, '')
            .trim();

        const displayPronoun = targetForm.startsWith("j'") ? "j'" : (isSingleForm ? "il" : pronoun);

        this.currentQuestion = {
            verb: randomVerb,
            tense: tenseNameMap[randomTense] || 'Présent',
            pronoun: displayPronoun,
            expected: cleanExpected
        };

        document.getElementById('game-verb-prompt').textContent = randomVerb;
        document.getElementById('game-tense-badge').textContent = tenseNameMap[randomTense] || 'Présent';
        document.getElementById('game-pronoun-prompt').textContent = displayPronoun;

        const answerInput = document.getElementById('game-answer-input');
        answerInput.value = '';
        answerInput.disabled = false;
        answerInput.focus();

        document.getElementById('game-feedback-box').style.display = 'none';
        document.getElementById('game-submit-btn').style.display = 'block';
        document.getElementById('game-next-btn').style.display = 'none';
    }

    sanitizeUsageHint(hint, verb) {
        if (!hint) return '';
        let clean = hint;

        clean = clean.replace(/\+\s*COD\s*\([^)]*\)/gi, '+ COD');

        if (verb) {
            const verbEscaped = verb.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            clean = clean.replace(new RegExp(`^intransitif:\\s*${verbEscaped}\\s+`, 'i'), '');
            clean = clean.replace(new RegExp(`^${verbEscaped}\\s+`, 'i'), '');
            clean = clean.replace(new RegExp(`^se\\s+${verbEscaped}\\s+`, 'i'), '');
            clean = clean.replace(new RegExp(`^s'${verbEscaped}\\s+`, 'i'), '');
            clean = clean.replace(new RegExp(`\\b${verbEscaped}\\b`, 'gi'), '');
        }

        clean = clean.replace(/^intransitif:\s*/i, '');
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
        document.getElementById('game-tense-badge').textContent = 'Prépositions & Emploi';
        document.getElementById('game-pronoun-prompt').textContent = 'Choisissez le bon emploi :';

        mcGroup.innerHTML = options.map(opt => `
            <button class="mc-option-btn" onclick="appEngine.checkPrepositionChoice('${opt.replace(/'/g, "\\'")}')">${opt}</button>
        `).join('');

        document.getElementById('game-feedback-box').style.display = 'none';
        document.getElementById('game-submit-btn').style.display = 'none';
        document.getElementById('game-next-btn').style.display = 'none';
    }

    nextAuxiliaryQuestion() {
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

        const verbs = Object.keys(this.verbDb);
        if (verbs.length === 0) return;

        // 30% chance to test a dual-auxiliary verb if available
        const dualVerbs = verbs.filter(k => this.verbDb[k].auxiliary === 'both');
        const isDualTest = dualVerbs.length > 0 && Math.random() < 0.4;
        const targetVerb = isDualTest ? dualVerbs[Math.floor(Math.random() * dualVerbs.length)] : verbs[Math.floor(Math.random() * verbs.length)];
        const verbData = this.verbDb[targetVerb];

        if (isDualTest && verbData.dual_auxiliary_rules) {
            const rules = verbData.dual_auxiliary_rules;
            const useAvoir = Math.random() < 0.5;
            const chosenAux = useAvoir ? 'avoir' : 'être';
            const ruleData = rules[chosenAux];

            this.currentQuestion = {
                verb: targetVerb,
                expected: chosenAux,
                isAuxiliary: true,
                explanation: `<strong>${chosenAux.toUpperCase()}</strong> (${ruleData.condition}). Ex : <em>"${ruleData.example}"</em>`
            };

            document.getElementById('game-verb-prompt').textContent = targetVerb;
            document.getElementById('game-tense-badge').textContent = 'Auxiliaire au Passé Composé';
            document.getElementById('game-pronoun-prompt').textContent = `Contexte : ${ruleData.condition}`;

            mcGroup.innerHTML = `
                <button class="mc-option-btn" onclick="appEngine.checkAuxiliaryChoice('avoir')">avoir (ai, a, avons...)</button>
                <button class="mc-option-btn" onclick="appEngine.checkAuxiliaryChoice('être')">être (suis, est, sommes...)</button>
                <button class="mc-option-btn" onclick="appEngine.checkAuxiliaryChoice('both')">les deux (selon le COD / sens)</button>
            `;
        } else {
            const expectedAux = verbData.auxiliary || 'avoir';
            this.currentQuestion = {
                verb: targetVerb,
                expected: expectedAux,
                isAuxiliary: true,
                explanation: expectedAux === 'être'
                    ? `Verbe de mouvement / pronominal ➔ <strong>ÊTRE</strong>`
                    : (expectedAux === 'both' ? `Verbe à double auxiliaire ➔ <strong>ÊTRE / AVOIR</strong>` : `Verbe transitif standard ➔ <strong>AVOIR</strong>`)
            };

            document.getElementById('game-verb-prompt').textContent = targetVerb;
            document.getElementById('game-tense-badge').textContent = 'Auxiliaire au Passé Composé';
            document.getElementById('game-pronoun-prompt').textContent = 'Quel auxiliaire utilise ce verbe ?';

            mcGroup.innerHTML = `
                <button class="mc-option-btn" onclick="appEngine.checkAuxiliaryChoice('avoir')">avoir (ai, a, avons...)</button>
                <button class="mc-option-btn" onclick="appEngine.checkAuxiliaryChoice('être')">être (suis, est, sommes...)</button>
                <button class="mc-option-btn" onclick="appEngine.checkAuxiliaryChoice('both')">les deux (selon le COD / sens)</button>
            `;
        }

        document.getElementById('game-feedback-box').style.display = 'none';
        document.getElementById('game-submit-btn').style.display = 'none';
        document.getElementById('game-next-btn').style.display = 'none';
    }

    checkAuxiliaryChoice(selected) {
        if (!this.currentQuestion) return;
        const isCorrect = selected === this.currentQuestion.expected;
        const feedbackBox = document.getElementById('game-feedback-box');
        feedbackBox.style.display = 'block';

        if (isCorrect) {
            this.gameScore += 10; this.gameStreak += 1;
            feedbackBox.className = 'feedback-card correct';
            feedbackBox.innerHTML = `✅ Exact ! <strong>${this.currentQuestion.verb}</strong> ➔ ${this.currentQuestion.explanation} (+10 pts).`;
        } else {
            this.gameStreak = 0;
            feedbackBox.className = 'feedback-card wrong';
            feedbackBox.innerHTML = `❌ Oups ! Réponse correcte : <strong>${this.currentQuestion.expected.toUpperCase()}</strong>. ${this.currentQuestion.explanation}`;
        }

        document.getElementById('game-score').textContent = this.gameScore;
        document.getElementById('game-streak').textContent = this.gameStreak;
        document.getElementById('game-next-btn').style.display = 'block';
    }

    checkPrepositionChoice(selected) {
        if (!this.currentQuestion) return;
        const isCorrect = selected === this.currentQuestion.expected;
        const feedbackBox = document.getElementById('game-feedback-box');
        feedbackBox.style.display = 'block';

        if (isCorrect) {
            this.gameScore += 10; this.gameStreak += 1;
            feedbackBox.className = 'feedback-card correct';
            feedbackBox.innerHTML = `✅ Excellent ! <strong>${this.currentQuestion.verb}</strong> ➔ ${selected} (+10 pts).`;
        } else {
            this.gameStreak = 0;
            feedbackBox.className = 'feedback-card wrong';
            feedbackBox.innerHTML = `❌ Oups ! La bonne réponse était : <strong>${this.currentQuestion.verb}</strong> ➔ <strong>${this.currentQuestion.expected}</strong>.`;
        }

        document.getElementById('game-score').textContent = this.gameScore;
        document.getElementById('game-streak').textContent = this.gameStreak;
        document.getElementById('game-next-btn').style.display = 'block';
    }

    checkGameAnswer() {
        if (!this.currentQuestion) return;

        const answerInput = document.getElementById('game-answer-input');
        const userAnswer = answerInput.value.trim().toLowerCase();
        const expected = this.currentQuestion.expected.toLowerCase();

        const feedbackBox = document.getElementById('game-feedback-box');
        feedbackBox.style.display = 'block';

        if (userAnswer === expected) {
            this.gameScore += 10;
            this.gameStreak += 1;
            feedbackBox.className = 'feedback-card correct';
            feedbackBox.innerHTML = `✅ Excellent ! <strong>${this.currentQuestion.pronoun} ${expected}</strong> est la bonne réponse (+10 pts).`;
        } else {
            this.gameStreak = 0;
            feedbackBox.className = 'feedback-card wrong';
            feedbackBox.innerHTML = `❌ Oups ! La bonne réponse était : <strong>${this.currentQuestion.pronoun} ${expected}</strong>.`;
        }

        document.getElementById('game-score').textContent = this.gameScore;
        document.getElementById('game-streak').textContent = this.gameStreak;

        answerInput.disabled = true;
        document.getElementById('game-submit-btn').style.display = 'none';
        document.getElementById('game-next-btn').style.display = 'block';
    }
}

// Global initialization
let appEngine;
document.addEventListener('DOMContentLoaded', () => {
    appEngine = new ConjugationEngine();
});
