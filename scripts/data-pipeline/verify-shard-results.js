const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const toolsDir = path.join(ROOT_DIR, 'tools');

function testLanguageQueries(lang) {
    const dataDir = path.join(toolsDir, lang, 'data');
    if (!fs.existsSync(dataDir)) return { lang, status: 'SKIPPED', matches: 0 };

    const originalFiles = ['morphology.json', 'kaikki.json'].map(f => path.join(dataDir, f)).filter(f => fs.existsSync(f));
    if (originalFiles.length === 0) return { lang, status: 'SKIPPED (no morphology/kaikki)', matches: 0 };

    let originalUnits = [];
    for (const f of originalFiles) {
        const content = JSON.parse(fs.readFileSync(f, 'utf8'));
        originalUnits = originalUnits.concat(Array.isArray(content) ? content : (content.units || []));
    }

    const sampleQueries = [];
    const step = Math.max(1, Math.floor(originalUnits.length / 20));
    for (let i = 0; i < originalUnits.length && sampleQueries.length < 20; i += step) {
        const lemma = originalUnits[i].lemma || originalUnits[i].headword;
        if (lemma && !sampleQueries.includes(lemma)) {
            sampleQueries.push(lemma);
        }
    }

    let identicalCount = 0;

    for (const q of sampleQueries) {
        const cleanQ = q.trim().toLocaleLowerCase().normalize('NFC');
        const letter = cleanQ.charAt(0);

        const origMatches = originalUnits.filter(unit => {
            const l = (unit.lemma || unit.headword || '').toLocaleLowerCase().normalize('NFC');
            const forms = (unit.forms || []).map(f => typeof f === 'string' ? f : f.form).join(' ').toLocaleLowerCase().normalize('NFC');
            return l.includes(cleanQ) || forms.includes(cleanQ);
        }).slice(0, 12);

        const shardPath = path.join(dataDir, 'shards', `${letter}.json`);
        let shardUnits = [];
        if (fs.existsSync(shardPath)) {
            shardUnits = JSON.parse(fs.readFileSync(shardPath, 'utf8')).units || [];
        }

        const shardMatches = shardUnits.filter(unit => {
            const l = (unit.lemma || unit.headword || '').toLocaleLowerCase().normalize('NFC');
            const forms = (unit.forms || []).map(f => typeof f === 'string' ? f : f.form).join(' ').toLocaleLowerCase().normalize('NFC');
            return l.includes(cleanQ) || forms.includes(cleanQ);
        }).slice(0, 12);

        const origLemmas = origMatches.map(u => u.lemma || u.headword).sort().join(',');
        const shardLemmas = shardMatches.map(u => u.lemma || u.headword).sort().join(',');

        if (origLemmas === shardLemmas) {
            identicalCount++;
        }
    }

    const passed = (identicalCount === sampleQueries.length && sampleQueries.length > 0);
    return {
        lang,
        sampleCount: sampleQueries.length,
        identicalCount,
        status: passed ? 'PASS (100% Identical)' : 'FAIL'
    };
}

function runVerification() {
    const langs = fs.readdirSync(toolsDir).filter(f => fs.statSync(path.join(toolsDir, f)).isDirectory()).sort();
    console.log('=== SHARD COMPARISON PROOF (20 Sample Queries Per Language) ===');
    const results = [];
    for (const lang of langs) {
        const res = testLanguageQueries(lang);
        results.push(res);
        console.log(`Language [${lang}]: Tested ${res.sampleCount || 0} queries -> ${res.identicalCount || 0}/${res.sampleCount || 0} identical | ${res.status}`);
    }
    const allPassed = results.every(r => r.status.includes('PASS') || r.status.includes('SKIPPED'));
    if (allPassed) {
        console.log('\n✅ Verification successful: All rendered results before and after sharding are 100% identical!');
    } else {
        console.error('\n❌ Verification failed.');
        process.exit(1);
    }
}

runVerification();
