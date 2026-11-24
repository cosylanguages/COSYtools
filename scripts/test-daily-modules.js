/**
 * Automated test suite for COSYDailyFeed and practice/daily/index.html.
 */
require('./lib/ignore-closed-window-errors');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

const root = path.join(__dirname, '..');
const feed = require('../shared/js/daily-feed.js');

let fails = 0;
const ok = (c, m) => {
    if (!c) {
        fails++;
        console.error('FAIL', m);
    } else {
        console.log('ok  ', m);
    }
};

const server = http.createServer((req, res) => {
    const filePath = path.join(root, decodeURIComponent(req.url.split('?')[0]));
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        res.statusCode = 404;
        return res.end('404');
    }
    const ext = path.extname(filePath);
    const mimes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.css': 'text/css'
    };
    res.setHeader('content-type', mimes[ext] || 'application/octet-stream');
    res.end(fs.readFileSync(filePath));
}).listen(0);

const sleep = ms => new Promise(r => setTimeout(r, ms));
const { pageErrors } = require('./lib/shared-asset-errors');

async function runTests() {
    console.log('--- Testing COSYDailyFeed Unit Functions ---');

    // 1. Date calculation & midnight rollover format
    const sampleDate = new Date('2026-11-15T00:00:00');
    ok(feed.getLocalDateString(sampleDate) === '2026-11-15', 'getLocalDateString returns YYYY-MM-DD');
    ok(feed.getYearMonth('2026-11-15') === '2026-11', 'getYearMonth parses YYYY-MM');

    // 2. Ecosystem links formatting
    const links = feed.getEcosystemLinks('2026-11-15', 'break');
    ok(links.conversation === 'https://cosylanguages.github.io/COSYlanguages/?date=2026-11-15', 'COSYlanguages conversation deep-link has date');
    ok(links.practice === 'https://cosylanguages.github.io/COSYpractice/?verb=break', 'COSYpractice deep-link has verb ID');

    // 3. Verb matching and tense extraction
    const enVerbs = JSON.parse(fs.readFileSync(path.join(root, 'tools/en/irregular-verbs/data/verbs.json'), 'utf8'));
    const matched = feed.matchVerbEntry(enVerbs, 'break');
    ok(matched && matched.past_simple === 'broke', 'matchVerbEntry finds irregular verb');
    const tenses = feed.extractKeyTenses(matched, 'en');
    ok(tenses.is_irregular && tenses.past_participle === 'broken', 'extractKeyTenses highlights English irregular forms');

    // 3b. Per-language tense maps: German must show present/past/perfect, not only the future.
    const deVerbs = JSON.parse(fs.readFileSync(path.join(root, 'tools/de/konjugation/data/verbs.json'), 'utf8'));
    const deTenses = feed.extractKeyTenses(deVerbs.lernen, 'de');
    ok(deTenses.present && deTenses.present[0] === 'ich lerne', 'German present tense is extracted');
    ok(deTenses.past && deTenses.past[0] === 'ich lernte', 'German präteritum is extracted');
    ok(deTenses.perfect && deTenses.perfect[0] === 'ich habe gelernt', 'German perfekt is extracted');
    ok(deTenses.future && deTenses.future[0] === 'ich werde lernen', 'German future is still extracted');
    ok(Object.keys(deTenses).length >= 4, 'German card has more than the future block');

    // 3c. Spanish must not confuse the imperfect with the perfect.
    const esVerbs = JSON.parse(fs.readFileSync(path.join(root, 'tools/es/conjugeur/data/verbs.json'), 'utf8'));
    const esTenses = feed.extractKeyTenses(esVerbs.visitar, 'es');
    ok(esTenses.past && esTenses.past[0] === 'visité', 'Spanish preterite is extracted as past');
    ok(esTenses.imperfect && esTenses.imperfect[0] === 'visitaba', 'Spanish imperfect is extracted separately');
    ok(esTenses.perfect && esTenses.perfect[0] === 'he visitado', 'Spanish perfect is extracted separately');
    ok(esTenses.imperfect[0] !== esTenses.perfect[0], 'Spanish imperfect and perfect are not the same block');

    // 3d. French and Italian keep their perfect forms.
    const frVerbs = JSON.parse(fs.readFileSync(path.join(root, 'tools/fr/conjugeur/data/verbs.json'), 'utf8'));
    const frTenses = feed.extractKeyTenses(frVerbs.parler, 'fr');
    ok(frTenses.present && frTenses.present[0] === 'je parle' && frTenses.perfect && frTenses.perfect[0] === "j'ai parlé", 'French present and passé composé are extracted');
    const itVerbs = JSON.parse(fs.readFileSync(path.join(root, 'tools/it/coniugatore/data/verbs.json'), 'utf8'));
    const itTenses = feed.extractKeyTenses(itVerbs.parlare, 'it');
    ok(itTenses.present && itTenses.present[0] === 'parlo' && itTenses.past && itTenses.past[0] === 'ho parlato', 'Italian present and passato prossimo are extracted');

    // 3e. Greek keeps aorist and perfect apart, and Russian keeps its past/future.
    const elVerbs = JSON.parse(fs.readFileSync(path.join(root, 'tools/el/klisi-rimaton/data/verbs.json'), 'utf8'));
    const elTenses = feed.extractKeyTenses(elVerbs['γράφω'], 'el');
    ok(elTenses.present && elTenses.present[0] === 'γράφω', 'Greek present is extracted');
    ok(elTenses.past && elTenses.past[0] === 'έγραφα', 'Greek imperfect is extracted as past');
    ok(elTenses.aorist && elTenses.aorist[0] === 'έγραψα', 'Greek aorist is extracted separately');
    ok(elTenses.perfect && elTenses.perfect[0] === 'έχω γράψει', 'Greek perfect is extracted');
    ok(elTenses.future && elTenses.future[0] === 'θα γράψω', 'Greek future is extracted');
    const ruVerbs = JSON.parse(fs.readFileSync(path.join(root, 'tools/ru/spryazhenie/data/verbs.json'), 'utf8'));
    const ruTenses = feed.extractKeyTenses(ruVerbs['говорить'], 'ru');
    ok(ruTenses.present && ruTenses.present[0] === 'я говорю́', 'Russian present is extracted');
    ok(ruTenses.past && ruTenses.past[0] === 'он говори́л', 'Russian past is extracted');
    ok(ruTenses.future && ruTenses.future[0] === 'я буду говорить', 'Russian future is extracted');

    // 4. Preposition governance matching
    const enPrep = JSON.parse(fs.readFileSync(path.join(root, 'tools/en/verb-prep/data/verbs.json'), 'utf8'));
    const prepEntry = feed.matchPrepositionEntry(enPrep, 'depend');
    ok(prepEntry && prepEntry.prepositions.includes('on'), 'matchPrepositionEntry matches dependent prepositions');

    // 5. Deterministic fallback test
    const fb = feed.getFallbackDailyEntry('en', enVerbs, enPrep, '2026-11-15');
    ok(fb && fb.verbKey && fb.verbEntry, 'getFallbackDailyEntry yields deterministic valid verb entry');

    // 6. Full pack generation test
    const pack = await feed.getDailyGrammarPack('en', '2026-11-15', '');
    ok(pack && pack.verbEntry && pack.prepEntry && pack.links, 'getDailyGrammarPack generates full bundle');

    // 7. COSYdata calendars hold one card per CEFR level per date
    const lvlDay = { A2: { id: 'a', word: 'head out', definition: 'x' }, B1: { id: 'b', word: 'hand out', definition: 'y' }, B2: { id: 'c', word: 'tone down', definition: 'z' } };
    ok(feed.pickLevelCard(lvlDay, 'B2').word === 'tone down', 'pickLevelCard returns the requested level');
    ok(feed.pickLevelCard(lvlDay, 'B2').level === 'B2', 'pickLevelCard records the level on the card');
    ok(feed.pickLevelCard(lvlDay, 'C1').word === 'hand out', 'pickLevelCard falls back to B1 when the level is missing');
    ok(feed.pickLevelCard({ A2: lvlDay.A2 }, 'C1').word === 'head out', 'pickLevelCard falls back to any published level');
    ok(feed.pickLevelCard({ word: 'flat', definition: 'old feed' }).word === 'flat', 'pickLevelCard passes a flat card through');
    ok(feed.pickLevelCard(null) === null && feed.pickLevelCard({}) === null && feed.pickLevelCard({ B1: { word: '  ' } }) === null, 'pickLevelCard rejects empty days and cards');

    const realFetch = global.fetch;
    global.fetch = async (url) => {
        const m = String(url).match(/calendar\/([\w-]+)\/(\d{4}-\d{2})/);
        if (m && m[1] === 'phrasal-verb') return { ok: true, json: async () => ({ days: { '2026-11-15': { A2: { id: 'p', word: 'look up', definition: 'To search for information.', example: 'Look up the word.' }, B1: { id: 'p2', word: 'work through', definition: 'To deal with.', example: 'We worked through it.' } } } }) };
        if (m && m[1] === 'word') return { ok: true, json: async () => ({ days: { '2026-11-15': { B1: { id: 'w', word: 'soft', pos: 'adjective', definition: 'not hard', example: 'Soft.' } } } }) };
        return { ok: false, status: 404, json: async () => null };
    };
    try {
        const lvlPack = await feed.getDailyGrammarPack('en', '2026-11-15', '', 'A2');
        ok(lvlPack.phrasalOfDay && lvlPack.phrasalOfDay.word === 'look up', 'pack reads the phrasal verb of the requested level from a per-level calendar');
        ok(lvlPack.wordOfDay && lvlPack.wordOfDay.word === 'soft', 'pack reads the word of the day from a per-level calendar');
        ok(lvlPack.prepEntry && String(lvlPack.prepEntry.pattern || '').trim() !== '[object]' && String(lvlPack.prepEntry.pattern || '').trim() !== '', 'a per-level feed never produces a preposition card with an empty verb');
    } finally {
        global.fetch = realFetch;
    }

    // 8. verb and verb-prep calendars drive the conjugation and preposition cards
    const realFetch2 = global.fetch;
    const calendars = {
        verb: { B1: { id: 'en:begin:verb', word: 'begin', level: 'A1', definition: 'To start doing something.', example: 'We begin the lesson at nine.' } },
        'verb-prep': { B1: { id: 'en:depend:verb', word: 'depend', level: 'A2', definition: 'To rely on something.', example: 'It depends on the weather.' } },
        'phrasal-verb': { B1: { id: 'en:look-up:verb', word: 'look up', level: 'A2', definition: 'To search for information.', example: 'Look up the word.' } }
    };
    global.fetch = async (url) => {
        const m = String(url).match(/calendar\/([\w-]+)\/(\d{4}-\d{2})/);
        if (m && calendars[m[1]]) return { ok: true, json: async () => ({ days: { '2026-11-15': calendars[m[1]] } }) };
        return { ok: false, status: 404, json: async () => null };
    };
    try {
        const vp = await feed.getDailyGrammarPack('en', '2026-11-15', '', 'B1');
        ok(vp.lemma === 'begin' && vp.source === 'cosydata-feed', 'the verb of the day drives the conjugation card (no local fallback)');
        ok(vp.verbEntry && vp.verbOfDay && vp.verbOfDay.word === 'begin', 'pack exposes verbOfDay and its conjugation entry');
        ok(vp.prepLemma === 'depend' && vp.prepEntry && /depend/.test(String(vp.prepEntry.pattern || '')), 'the verb + preposition of the day drives the preposition card');
        ok(vp.verbPrepOfDay && vp.verbPrepOfDay.word === 'depend', 'pack exposes verbPrepOfDay');
        ok(vp.phrasalOfDay && vp.phrasalOfDay.word === 'look up', 'the phrasal verb of the day is still returned separately');
        delete calendars['verb-prep'];
        const noPrep = await feed.getDailyGrammarPack('en', '2026-11-15', '', 'B1');
        ok(noPrep.lemma === 'begin' && noPrep.verbPrepOfDay === null, 'without a verb-prep calendar the verb of the day still works');
        delete calendars.verb; delete calendars['phrasal-verb'];
        const none = await feed.getDailyGrammarPack('en', '2026-11-15', '', 'B1');
        ok(none.source === 'local-fallback' && none.verbOfDay === null && none.verbEntry, 'with no calendars the local fallback still produces a full pack');
    } finally {
        global.fetch = realFetch2;
    }

    // 9. Ecosystem daily destinations: a link directory grouped by owning repository
    const dests = feed.getDailyDestinations();
    ok(Array.isArray(dests) && dests.length === 4, 'getDailyDestinations returns one entry per owning repository (' + dests.length + ')');
    const repos = dests.map(d => d.repo);
    ok(repos.includes('COSYdata') && repos.includes('COSYpractice') && repos.includes('COSYlanguages') && repos.includes('COSYevents'), 'the directory covers vocabulary, practice, hub and events repositories');
    const vocab = dests.find(d => d.repo === 'COSYdata');
    ok(/^https:\/\/cosylanguages\.github\.io\/COSYdata\//.test(vocab.url), 'vocabulary links to the COSYdata daily page');
    ok(vocab.slots.some(s => /Word of the Day/.test(s.label)) && vocab.slots.some(s => /Idiom of the Day/.test(s.label)), 'COSYdata entry lists its vocabulary slots');
    const practice = dests.find(d => d.repo === 'COSYpractice');
    ok(practice.url.includes('#daily-challenge') && practice.slots.some(s => /Daily Challenge/.test(s.label)), 'COSYpractice entry links to the Daily Challenge');
    ok(dests.every(d => d.slots.length > 0 && /^https:\/\//.test(d.url)), 'every destination has a daily URL and at least one slot');
    ok(typeof feed.getDailyElements === 'undefined' && typeof feed.DAILY_ELEMENT_SOURCES === 'undefined', 'content-consolidation API is gone (no duplicated daily content)');


    console.log('\n--- Testing practice/daily/index.html Behaviour in JSDOM ---');
    const errs = [];
    const vc = new VirtualConsole();
    vc.on('jsdomError', e => errs.push(e.message));

    const dom = await JSDOM.fromURL(`http://localhost:${server.address().port}/practice/daily/index.html`, {
        runScripts: 'dangerously',
        resources: 'usable',
        pretendToBeVisual: true,
        virtualConsole: vc,
        beforeParse(win) {
            win.fetch = u => fetch(new URL(u, win.location.href).href);
        }
    });

    await sleep(800);
    const doc = dom.window.document;

    ok(pageErrors(errs).length === 0, 'No script errors on daily page: ' + pageErrors(errs).join('|'));
    ok(doc.getElementById('card-conjugation'), 'Conjugation card rendered');
    ok(doc.getElementById('card-preposition'), 'Preposition card rendered');
    ok(doc.getElementById('link-conversation').href.includes('COSYlanguages/?date='), 'Conversation ecosystem button rendered');
    ok(doc.getElementById('link-practice').href.includes('COSYpractice/?verb='), 'Practice ecosystem button rendered');
    ok(doc.getElementById('card-elements') && doc.getElementById('elements-grid'), 'Ecosystem daily elements card rendered');

    // The elements grid is a link directory to each owning repository's daily page.
    const destCards = doc.querySelectorAll('#elements-grid .dest-card');
    ok(destCards.length === 4, 'Ecosystem daily destinations grid shows one card per repository (' + destCards.length + ')');
    const gridText = doc.getElementById('elements-grid').textContent;
    ok(/COSYdata/.test(gridText) && /COSYpractice/.test(gridText) && /COSYlanguages/.test(gridText) && /COSYevents/.test(gridText), 'Destination cards name every owning repository');
    const destLinks = Array.from(doc.querySelectorAll('#elements-grid .dest-card-link'));
    ok(destLinks.length === 4 && destLinks.every(a => /^https:\/\/cosylanguages\.github\.io\//.test(a.href)), 'Every destination card links to its repository daily page');

    // Test mini-drill conjugation check
    const input = doc.getElementById('drill-conj-input');
    input.value = dom.window.expectedConjugationForm;
    doc.querySelector('#card-conjugation button').click();
    const fbBox = doc.getElementById('drill-conj-feedback');
    ok(fbBox.style.display !== 'none' && fbBox.textContent.includes('Correct'), 'Conjugation mini-drill validation works');

    // Test preposition drill
    const prepBtns = doc.querySelectorAll('#prep-drill-options button');
    ok(prepBtns.length >= 2, 'Preposition drill renders choice options');
    prepBtns[0].click();
    const prepFb = doc.getElementById('prep-drill-feedback');
    ok(prepFb.style.display !== 'none', 'Preposition drill displays feedback upon choice');

    // The strips link to the Daily page with ?lang=xx
    for (const [query, expected] of [['?lang=fr', 'fr'], ['?lang=el', 'el'], ['?lang=zz', 'en'], ['', 'en']]) {
        const langErrs = [];
        const lvc = new VirtualConsole();
        lvc.on('jsdomError', e => langErrs.push(e.message));
        const ldom = await JSDOM.fromURL(`http://localhost:${server.address().port}/practice/daily/index.html${query}`, {
            runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true, virtualConsole: lvc,
            beforeParse(win) { win.fetch = u => fetch(new URL(u, win.location.href).href); }
        });
        await sleep(800);
        const sel = ldom.window.document.getElementById('daily-language-select');
        ok(sel.value === expected && ldom.window.currentLang === expected, `Daily page opens in '${expected}' for "${query}"`);
        ok(pageErrors(langErrs).length === 0, `No script errors for "${query}": ` + pageErrors(langErrs).join('|'));
        ldom.window.close();
    }

    // German must show the full tense set (the old generic matcher showed only the future).
    {
        const deErrs = [];
        const deVc = new VirtualConsole();
        deVc.on('jsdomError', e => deErrs.push(e.message));
        const deDom = await JSDOM.fromURL(`http://localhost:${server.address().port}/practice/daily/index.html?lang=de&level=B1`, {
            runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true, virtualConsole: deVc,
            beforeParse(win) { win.fetch = u => fetch(new URL(u, win.location.href).href); }
        });
        await sleep(900);
        const deDoc = deDom.window.document;
        const blocks = deDoc.querySelectorAll('#tenses-container .tense-block');
        ok(blocks.length >= 3, `German conjugation shows present/past/perfect blocks (${blocks.length})`);
        ok(/present/.test(deDoc.getElementById('tenses-container').textContent.toLowerCase()), 'German conjugation has a present block');
        ok(deDom.window.expectedConjugationForm && deDom.window.expectedConjugationForm !== deDom.window.currentPack.lemma,
            'German mini-drill expects a conjugated form, not the infinitive');
        ok(pageErrors(deErrs).length === 0, 'No script errors on the German daily page: ' + pageErrors(deErrs).join('|'));
        deDom.window.close();
    }

    // Spanish must show the imperfect and perfect as separate blocks, not the imperfect twice.
    {
        const esErrs = [];
        const esVc = new VirtualConsole();
        esVc.on('jsdomError', e => esErrs.push(e.message));
        const esDom = await JSDOM.fromURL(`http://localhost:${server.address().port}/practice/daily/index.html?lang=es&level=B1`, {
            runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true, virtualConsole: esVc,
            beforeParse(win) { win.fetch = u => fetch(new URL(u, win.location.href).href); }
        });
        await sleep(900);
        const esText = esDom.window.document.getElementById('tenses-container').textContent.toLowerCase();
        ok(/imperfect/.test(esText) && /perfect/.test(esText), 'Spanish shows separate imperfect and perfect blocks');
        const esPack = esDom.window.currentPack;
        ok(esPack && esPack.keyTenses && esPack.keyTenses.past && esPack.keyTenses.perfect && esPack.keyTenses.past[0] !== esPack.keyTenses.perfect[0],
            'Spanish past and perfect are different forms');
        ok(pageErrors(esErrs).length === 0, 'No script errors on the Spanish daily page: ' + pageErrors(esErrs).join('|'));
        esDom.window.close();
    }

    // A language with conjugation data but no preposition data must hide the drill, not fall back to English.
    {
        const ptErrs = [];
        const ptVc = new VirtualConsole();
        ptVc.on('jsdomError', e => ptErrs.push(e.message));
        const ptDom = await JSDOM.fromURL(`http://localhost:${server.address().port}/practice/daily/index.html?lang=pt&level=B1`, {
            runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true, virtualConsole: ptVc,
            beforeParse(win) { win.fetch = u => fetch(new URL(u, win.location.href).href); }
        });
        await sleep(900);
        const ptDoc = ptDom.window.document;
        const drill = ptDoc.getElementById('prep-drill-section');
        ok(drill && drill.style.display === 'none', 'Portuguese hides the preposition drill when there is no governance data');
        ok(/No separate preposition|No preposition data/.test(ptDoc.getElementById('prep-rule-text').textContent),
            'Portuguese explains that there is no preposition data');
        ok(!/We depend on daily language practice/.test(ptDoc.body.textContent), 'Portuguese never shows the English fallback example');
        ok(pageErrors(ptErrs).length === 0, 'No script errors on the Portuguese daily page: ' + pageErrors(ptErrs).join('|'));
        ptDom.window.close();
    }

    // ?level= selects the CEFR level used to pick the daily cards
    for (const [query, expected] of [['?level=B2', 'B2'], ['?level=zz', 'B1'], ['', 'B1']]) {
        const lvc = new VirtualConsole();
        const ldom = await JSDOM.fromURL(`http://localhost:${server.address().port}/practice/daily/index.html${query}`, {
            runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true, virtualConsole: lvc,
            beforeParse(win) { win.fetch = u => fetch(new URL(u, win.location.href).href); }
        });
        await sleep(800);
        const levelSel = ldom.window.document.getElementById('daily-level-select');
        ok(levelSel.value === expected && ldom.window.currentLevel === expected, `Daily page uses level '${expected}' for "${query}"`);
        ldom.window.close();
    }

    server.close();
    if (fails > 0) {
        console.error(`\nFAILED with ${fails} error(s).`);
        process.exit(1);
    } else {
        console.log('\nALL DAILY MODULE TESTS PASSED!');
        process.exit(0);
    }
}

runTests().catch(e => {
    console.error('Test runner crashed:', e);
    server.close();
    process.exit(1);
});
