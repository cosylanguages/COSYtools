(function initialiseSupplementalLexicon() {
    const input = document.querySelector('#verb-search-input, #noun-search-input, #search-input');
    if (!input || document.getElementById('supplemental-lexicon-panel')) return;

    const pathParts = window.location.pathname.replace(/^\//, '').split('/');
    const toolsIdx = pathParts.indexOf('tools');

    let lang = null;
    let rootPath = '';

    if (toolsIdx !== -1 && toolsIdx + 1 < pathParts.length) {
        lang = pathParts[toolsIdx + 1];
        const depth = pathParts.length - 1;
        rootPath = '../'.repeat(depth);
    }

    if (!lang) return;

    const manifestUrl = `${rootPath}shared/data/data-manifest.json`;

    fetch(manifestUrl)
        .then(res => {
            if (!res.ok) throw new Error(`Manifest response error: ${res.status}`);
            return res.json();
        })
        .then(manifest => {
            const langData = manifest[lang];
            if (!langData) return;

            const filesToFetch = [];
            if (langData.morphology) {
                filesToFetch.push(`${rootPath}tools/${lang}/data/morphology.json`);
            }
            if (langData.kaikki) {
                filesToFetch.push(`${rootPath}tools/${lang}/data/kaikki.json`);
            }

            if (filesToFetch.length === 0) {
                return;
            }

            const panel = document.createElement('section');
            panel.id = 'supplemental-lexicon-panel';
            panel.setAttribute('aria-live', 'polite');
            panel.innerHTML = '<h3>Source-backed additions</h3><p class="supplemental-status">Loading imported vocabulary...</p><div class="supplemental-results"></div>';
            input.closest('main')?.appendChild(panel);

            const status = panel.querySelector('.supplemental-status');
            const results = panel.querySelector('.supplemental-results');
            let units = [];

            Promise.allSettled(filesToFetch.map(file => fetch(file).then(response => {
                if (!response.ok) throw new Error(`${file}: ${response.status}`);
                return response.json();
            }))).then(responses => {
                units = responses
                    .filter(response => response.status === 'fulfilled' && response.value && Array.isArray(response.value.units))
                    .flatMap(response => response.value.units);

                if (!units.length) {
                    panel.remove();
                    return;
                }

                status.textContent = `${units.length} imported units available`;
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
        })
        .catch(err => {
        });
})();
