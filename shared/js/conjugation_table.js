(function() {
    /**
     * COSYtools Conjugation Table Generator
     * Renders real UniMorph conjugation tables for template-based conjugators.
     */

    const LABELS = {
        es: {
            // Persons & Numbers
            '1_SG': '1.ª persona singular (yo)',
            '2_SG': '2.ª persona singular (tú)',
            '3_SG': '3.ª persona singular (él/ella/usted)',
            '1_PL': '1.ª persona plural (nosotros)',
            '2_PL': '2.ª persona plural (vosotros)',
            '3_PL': '3.ª persona plural (ellos/ellas/ustedes)',

            // Mood / Tense sections
            'IND PRS': 'Indicativo — Presente',
            'IND PST IPFV': 'Indicativo — Pretérito imperfecto',
            'IND PST PFV': 'Indicativo — Pretérito perfecto simple',
            'IND FUT': 'Indicativo — Futuro simple',
            'COND': 'Condicional simple',
            'SBJV PRS': 'Subjuntivo — Presente',
            'SBJV PST': 'Subjuntivo — Pretérito imperfecto',
            'SBJV PST LGSPEC1': 'Subjuntivo — Pretérito imperfecto (-ra)',
            'SBJV PST LGSPEC2': 'Subjuntivo — Pretérito imperfecto (-se)',
            'SBJV FUT': 'Subjuntivo — Futuro simple',
            'IMP': 'Imperativo',
            'IMP POS': 'Imperativo afirmativo',
            'IMP NEG': 'Imperativo negativo',
            'NFIN': 'Infinitivo',
            'V.PTCP': 'Participio',
            'V.PTCP PST MASC': 'Participio (masculino)',
            'V.PTCP PST FEM': 'Participio (femenino)',
            'V.CVB PRS': 'Gerundio',

            // Qualifiers / Small labels
            'FORM': 'formal',
            'INFM': 'informal',
            'POS': 'afirmativo',
            'NEG': 'negativo',
            'MASC': 'masculino',
            'FEM': 'femenino'
        },
        pt: {
            // Persons & Numbers
            '1_SG': '1.ª pessoa singular (eu)',
            '2_SG': '2.ª pessoa singular (tu)',
            '3_SG': '3.ª pessoa singular (ele/ela)',
            '1_PL': '1.ª pessoa plural (nós)',
            '2_PL': '2.ª pessoa plural (vós)',
            '3_PL': '3.ª pessoa plural (eles/elas)',

            // Mood / Tense sections
            'IND PRS': 'Indicativo — Presente',
            'IND PST IPFV': 'Indicativo — Pretérito imperfeito',
            'IND PST PFV': 'Indicativo — Pretérito perfeito',
            'IND PST PRF': 'Indicativo — Pretérito mais-que-perfeito',
            'IND FUT': 'Indicativo — Futuro do presente',
            'COND': 'Condicional — Futuro do pretérito',
            'SBJV PRS': 'Subjuntivo — Presente',
            'SBJV PST IPFV': 'Subjuntivo — Pretérito imperfeito',
            'SBJV PST': 'Subjuntivo — Pretérito imperfeito',
            'SBJV FUT': 'Subjuntivo — Futuro',
            'IMP': 'Imperativo',
            'IMP POS': 'Imperativo afirmativo',
            'IMP NEG': 'Imperativo negativo',
            'NFIN': 'Infinitivo',
            'PCP': 'Particípio',
            'V.PTCP': 'Particípio',

            // Qualifiers
            'FORM': 'formal',
            'INFM': 'informal',
            'POS': 'afirmativo',
            'NEG': 'negativo'
        },
        de: {
            // Persons & Numbers
            '1_SG': '1. Person Singular (ich)',
            '2_SG': '2. Person Singular (du)',
            '3_SG': '3. Person Singular (er/sie/es)',
            '1_PL': '1. Person Plural (wir)',
            '2_PL': '2. Person Plural (ihr)',
            '3_PL': '3. Person Plural (sie/Sie)',

            // Mood / Tense sections
            'IND PRS': 'Indikativ — Präsens',
            'IND PST': 'Indikativ — Präteritum',
            'SBJV PRS': 'Konjunktiv I (Präsens)',
            'SBJV PST': 'Konjunktiv II (Präteritum)',
            'IMP': 'Imperativ',
            'NFIN': 'Infinitiv',
            'V.PTCP': 'Partizip II',
            'PCP': 'Partizip II',

            // Qualifiers
            'FORM': 'formell',
            'INFM': 'informell',
            'POS': 'positiv',
            'NEG': 'negativ'
        }
    };

    function getLabel(lang, key, fallback) {
        if (LABELS[lang] && LABELS[lang][key]) {
            return LABELS[lang][key];
        }
        return fallback !== undefined ? fallback : key;
    }

    function buildTable(unit, lang) {
        if (!unit || !unit.forms || unit.forms.length === 0) {
            return null;
        }

        const vForms = unit.forms.filter(f => typeof f === 'object' && f.form);
        if (vForms.length === 0) return null;

        const sectionsMap = new Map();

        vForms.forEach(item => {
            const feat = item.features || [];
            let pers = feat.find(x => ['1','2','3'].includes(x));
            let num = feat.find(x => ['SG','PL'].includes(x));

            if (!pers && feat.some(x => x.startsWith('ARGNO'))) {
                const arg = feat.find(x => x.startsWith('ARGNO'));
                pers = arg.charAt(5);
                num = arg.length >= 7 && arg.charAt(6) === 'P' ? 'PL' : 'SG';
            }

            const sectionFeatures = feat.filter(x =>
                !['V','POS','NEG','FIN','NFIN','FORM','INFM','LGSPEC1','LGSPEC2','LGSPEC01','1','2','3','SG','PL'].includes(x) &&
                !x.startsWith('ARGNO') && !x.startsWith('ARGAC')
            );

            const sectionKey = sectionFeatures.join(' ') || (feat.includes('NFIN') ? 'NFIN' : 'OTHER');

            if (!sectionsMap.has(sectionKey)) {
                sectionsMap.set(sectionKey, []);
            }

            const qualifiers = feat.filter(x => ['FORM','INFM','POS','NEG','MASC','FEM','LGSPEC1','LGSPEC2'].includes(x));

            sectionsMap.get(sectionKey).push({
                pers,
                num,
                form: item.form,
                qualifiers,
                rawFeatures: feat
            });
        });

        if (sectionsMap.size === 0) return null;

        let html = '<div class="conjugation-tables-container" style="margin-top: 1.5rem;">';

        sectionsMap.forEach((forms, secKey) => {
            const sectionTitle = getLabel(lang, secKey, secKey);
            const hasPersonNumberForms = forms.some(f => f.pers && f.num);

            if (hasPersonNumberForms) {
                html += `<div class="conjugation-section" style="margin-bottom: 1.5rem;">`;
                html += `<h3 class="section-title" style="margin-bottom: 0.5rem; border-bottom: 1px solid var(--border-color, #e2e8f0); padding-bottom: 0.25rem;">${sectionTitle}</h3>`;
                html += `<table class="conjugation-table" style="width:100%; border-collapse: collapse;"><thead><tr style="text-align:left; background: var(--bg-soft, #f8fafc);"><th style="padding: 0.5rem;">${lang === 'es' ? 'Persona' : (lang === 'pt' ? 'Pessoa' : (lang === 'de' ? 'Person' : 'Person'))}</th><th style="padding: 0.5rem;">${lang === 'es' ? 'Forma' : (lang === 'pt' ? 'Forma' : (lang === 'de' ? 'Form' : 'Form'))}</th></tr></thead><tbody>`;

                const personSlots = [
                    { pers: '1', num: 'SG' },
                    { pers: '2', num: 'SG' },
                    { pers: '3', num: 'SG' },
                    { pers: '1', num: 'PL' },
                    { pers: '2', num: 'PL' },
                    { pers: '3', num: 'PL' }
                ];

                personSlots.forEach(pn => {
                    const matchingForms = forms.filter(f => f.pers === pn.pers && f.num === pn.num);
                    if (matchingForms.length === 0) return; // Never fill gaps!

                    // Check if second-person forms contain distinct INFM / FORM qualifiers or raw tags
                    const hasFormTag = matchingForms.some(f => f.qualifiers.includes('FORM'));
                    const hasInfmTag = matchingForms.some(f => f.qualifiers.includes('INFM'));

                    if (pn.pers === '2' && (hasFormTag || hasInfmTag)) {
                        const groups = [
                            { tag: 'INFM', forms: matchingForms.filter(f => f.qualifiers.includes('INFM')) },
                            { tag: 'FORM', forms: matchingForms.filter(f => f.qualifiers.includes('FORM')) },
                            { tag: 'OTHER', forms: matchingForms.filter(f => !f.qualifiers.includes('INFM') && !f.qualifiers.includes('FORM')) }
                        ];

                        groups.forEach(g => {
                            if (g.forms.length === 0) return;

                            let rowLabel = getLabel(lang, `${pn.pers}_${pn.num}`, `${pn.pers} ${pn.num}`);

                            if (g.tag === 'INFM') {
                                if (lang === 'es') rowLabel = '2.ª singular informal (tú / vos)';
                                else if (lang === 'pt') rowLabel = '2.ª singular (tu)';
                                else if (lang === 'de') rowLabel = 'du';
                                else rowLabel += ' (INFM)';
                            } else if (g.tag === 'FORM') {
                                if (lang === 'es') rowLabel = 'formal (usted)';
                                else if (lang === 'pt') rowLabel = '(você)';
                                else if (lang === 'de') rowLabel = 'Sie';
                                else rowLabel += ' (FORM)';
                            }

                            const formMap = new Map();
                            g.forms.forEach(f => {
                                if (!formMap.has(f.form)) formMap.set(f.form, []);
                                const otherQuals = f.qualifiers.filter(q => q !== 'FORM' && q !== 'INFM').map(q => getLabel(lang, q, q));
                                if (otherQuals.length > 0) {
                                    formMap.get(f.form).push(otherQuals.join('/'));
                                }
                            });

                            const cellHtml = Array.from(formMap.entries()).map(([formStr, qualList]) => {
                                const qualStr = qualList.length > 0 ? ` <small class="qualifier" style="color: var(--ink-soft, #64748b);">(${qualList.join(', ')})</small>` : '';
                                return `<span class="cell-form"><strong>${formStr}</strong>${qualStr}</span>`;
                            }).join(' · ');

                            html += `<tr style="border-bottom: 1px solid var(--border-color, #f1f5f9);"><td class="person-label" style="padding: 0.5rem; font-weight: 500;">${rowLabel}</td><td class="form-cell" style="padding: 0.5rem;">${cellHtml}</td></tr>`;
                        });
                    } else {
                        const rowLabel = getLabel(lang, `${pn.pers}_${pn.num}`, `${pn.pers} ${pn.num}`);

                        const formMap = new Map();
                        matchingForms.forEach(f => {
                            if (!formMap.has(f.form)) formMap.set(f.form, []);
                            const qualLabels = f.qualifiers.map(q => getLabel(lang, q, q));
                            if (qualLabels.length > 0) {
                                formMap.get(f.form).push(qualLabels.join('/'));
                            }
                        });

                        const cellHtml = Array.from(formMap.entries()).map(([formStr, qualList]) => {
                            const qualStr = qualList.length > 0 ? ` <small class="qualifier" style="color: var(--ink-soft, #64748b);">(${qualList.join(', ')})</small>` : '';
                            return `<span class="cell-form"><strong>${formStr}</strong>${qualStr}</span>`;
                        }).join(' · ');

                        html += `<tr style="border-bottom: 1px solid var(--border-color, #f1f5f9);"><td class="person-label" style="padding: 0.5rem; font-weight: 500;">${rowLabel}</td><td class="form-cell" style="padding: 0.5rem;">${cellHtml}</td></tr>`;
                    }
                });

                html += `</tbody></table></div>`;
            } else {
                html += `<div class="conjugation-section non-person-section" style="margin-bottom: 1rem;">`;
                html += `<h3 class="section-title" style="margin-bottom: 0.25rem;">${sectionTitle}</h3>`;

                const formMap = new Map();
                forms.forEach(f => {
                    if (!formMap.has(f.form)) formMap.set(f.form, []);
                    const qualLabels = f.qualifiers.map(q => getLabel(lang, q, q));
                    if (qualLabels.length > 0) formMap.get(f.form).push(qualLabels.join('/'));
                });

                const listHtml = Array.from(formMap.entries()).map(([formStr, qualList]) => {
                    const qualStr = qualList.length > 0 ? ` <small class="qualifier">(${qualList.join(', ')})</small>` : '';
                    return `<strong>${formStr}</strong>${qualStr}`;
                }).join(', ');

                html += `<p class="non-person-forms" style="margin:0.25rem 0 0.75rem;">${listHtml}</p></div>`;
            }
        });

        html += '</div>';
        return html;
    }

    window.COSYConjugationTable = {
        buildTable,
        getLabel,
        LABELS
    };
})();
