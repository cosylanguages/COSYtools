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

    ok(errs.length === 0, 'No script errors on daily page: ' + errs.join('|'));
    ok(doc.getElementById('card-conjugation'), 'Conjugation card rendered');
    ok(doc.getElementById('card-preposition'), 'Preposition card rendered');
    ok(doc.getElementById('link-conversation').href.includes('COSYlanguages/?date='), 'Conversation ecosystem button rendered');
    ok(doc.getElementById('link-practice').href.includes('COSYpractice/?verb='), 'Practice ecosystem button rendered');

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
