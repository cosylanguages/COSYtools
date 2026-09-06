(function initialiseSupplementalLexicon() {
    const input = document.querySelector('#verb-search-input, #noun-search-input, #search-input');
    if (!input || document.getElementById('supplemental-lexicon-panel')) return;

    const panel = document.createElement('section');
    panel.id = 'supplemental-lexicon-panel';
    panel.setAttribute('aria-live', 'polite');
    panel.innerHTML = '<h3>Source-backed additions</h3><p class="supplemental-status">Loading imported vocabulary...</p><div class="supplemental-results"></div>';
    input.closest('main')?.appendChild(panel);

    const status = panel.querySelector('.supplemental-status');
    const results = panel.querySelector('.supplemental-results');
    let units = [];

    Promise.allSettled(['data/morphology.json', 'data/kaikki.json'].map(file => fetch(file).then(response => {
        if (!response.ok) throw new Error(`${file}: ${response.status}`);
        return response.json();
    }))).then(responses => {
        units = responses
            .filter(response => response.status === 'fulfilled' && Array.isArray(response.value.units))
            .flatMap(response => response.value.units);
        status.textContent = units.length ? `${units.length} imported units available` : 'No supplemental source loaded for this tool.';
        if (!units.length) panel.classList.add('empty');
        renderResults(input.value);
    });

    function renderResults(query) {
        const cleanQuery = query.trim().toLocaleLowerCase();
        if (!cleanQuery || !units.length) {
            results.innerHTML = '';
            return;
        }

        const matches = units.filter(unit => {
            const forms = (unit.forms || []).map(form => typeof form === 'string' ? form : form.form).join(' ');
            return unit.lemma.toLocaleLowerCase().includes(cleanQuery) || forms.toLocaleLowerCase().includes(cleanQuery);
        }).slice(0, 12);

        results.innerHTML = matches.length ? matches.map(unit => {
            const forms = (unit.forms || []).slice(0, 8).map(form => typeof form === 'string' ? form : form.form).join(', ');
            const details = unit.definition || `${unit.pos || 'lexical unit'}: ${forms}`;
            return `<article class="supplemental-result"><strong>${unit.lemma}</strong><span>${details}</span><small>${unit.source || 'Imported source'}</small></article>`;
        }).join('') : '<p class="supplemental-empty">No imported match.</p>';
    }

    input.addEventListener('input', () => renderResults(input.value));
})();