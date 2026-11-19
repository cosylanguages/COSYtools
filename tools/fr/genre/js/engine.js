class NounGenderEngine extends GenderEngineBase {
    constructor() {
        super({
            storeKey: 'cosy-fr-genre',
            strings: {
            genderPrompt: 'Quel est le genre de :',
            genderRight: (noun, gender) => `✅ Bravo ! <strong>${noun}</strong> est bien ${gender}.`,
            genderWrong: (noun, expected) => `❌ Erreur ! <strong>${noun}</strong> est ${expected}.`,
            endingRight: (label, gender) => `✅ Correct ! ${label}. Genre : <strong>${gender}</strong>.`,
            endingWrong: (label, gender) => `❌ Classe attendue : <strong>${label}</strong>. Genre : ${gender}.`,
            articlesRight: (form, noun) => `✅ Excellent ! <strong>${form} ${noun}</strong> est la forme correcte (+10 pts).`,
            articlesWrong: (expected, noun) => `❌ Oups ! La forme correcte est : <strong>${expected} ${noun}</strong>.`,
            },
        });
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
        const patternBadge = document.getElementById('gender-pattern-badge');
        if (patternBadge) patternBadge.textContent = this.getEndingClass(noun, data).label;

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
        const indArt = data.indefinite_article ? `<span class="indefinite-art"> (${COSYEscape.escapeHtml(data.indefinite_article)})</span>` : '';
        document.getElementById('sing-form').innerHTML = `<span class="article">${COSYEscape.escapeHtml(article)}</span> <span class="stem">${COSYEscape.escapeHtml(noun)}</span>${indArt}`;

        // Plural ending split
        const pluralForm = data.plural || (noun.endsWith('al') ? noun.slice(0, -2) + 'aux' : (noun.endsWith('s') || noun.endsWith('x') ? noun : noun + 's'));
        if (data.irregular) {
            document.getElementById('plur-form').innerHTML = `<span class="article">les</span> <span>${COSYEscape.escapeHtml(pluralForm)}</span>`;
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
            document.getElementById('plur-form').innerHTML = `<span class="article">les</span> <span class="stem">${COSYEscape.escapeHtml(stem)}</span><span class="ending">${COSYEscape.escapeHtml(ending)}</span>`;
        }

        const antonymsBox = document.getElementById('antonyms-pills');
        if (data.antonyms && data.antonyms.length > 0) {
            document.getElementById('antonyms-container').style.display = 'flex';
            antonymsBox.innerHTML = data.antonyms.map(a => `<button class="antonym-pill" onclick="appEngine.searchNoun('${a}')">↔ ${a}</button>`).join('');
        } else {
            document.getElementById('antonyms-container').style.display = 'none';
        }
    }

    getEndingClass(noun, data) {
        if (data.irregular) return { key: 'exception', label: 'Exception à mémoriser' };
        const endingRules = [
            { key: 'feminine', suffixes: ['tion', 'sion', 'té', 'ité', 'ette', 'ance', 'ence', 'ée', 'ure', 'ie', 'esse', 'aison'], label: 'Terminaison typiquement féminine' },
            { key: 'masculine', suffixes: ['age', 'ment', 'isme', 'oir', 'eau', 'phone', 'scope', 'ème'], label: 'Terminaison typiquement masculine' }
        ];
        const rule = endingRules.find(candidate => candidate.suffixes.some(suffix => noun.endsWith(suffix)));
        return rule || { key: 'ambiguous', label: 'Terminaison ambiguë : apprendre avec l’article' };
    }

    nextEndingQuestion() {
        const choiceGroup = document.querySelector('.game-choice-group');
        const mcGroup = document.getElementById('game-mc-options');
        if (choiceGroup) choiceGroup.style.display = 'none';
        if (!mcGroup) {
            const group = document.createElement('div');
            group.id = 'game-mc-options';
            group.className = 'mc-options-grid';
            document.querySelector('.game-prompt-box').insertAdjacentElement('afterend', group);
        }
        const optionsGroup = document.getElementById('game-mc-options');
        optionsGroup.style.display = 'grid';
        const nouns = Object.keys(this.nounDb);
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        const pattern = this.getEndingClass(noun, this.nounDb[noun]);
        const options = [
            'Terminaison typiquement féminine',
            'Terminaison typiquement masculine',
            'Terminaison ambiguë : apprendre avec l’article',
            'Exception à mémoriser'
        ];
        this.currentQuestion = { noun, expectedPattern: pattern.key };
        document.getElementById('game-noun-prompt').textContent = noun;
        const label = document.querySelector('.prompt-label');
        if (label) label.textContent = 'Quelle classe suggère la terminaison ?';
        optionsGroup.innerHTML = options.map((option, index) => `
            <button class="mc-option-btn" onclick="appEngine.checkEndingChoice('${['feminine', 'masculine', 'ambiguous', 'exception'][index]}')">${option}</button>
        `).join('');
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

}

let appEngine;
document.addEventListener('DOMContentLoaded', () => { appEngine = new NounGenderEngine(); });
