#!/usr/bin/env node
/**
 * scripts/test-daily-engine.js
 * Unit tests for shared/js/daily-engine.js and integrity checks for daily-manifest.json.
 */
const assert = require('assert');
const path = require('path');

const engine = require('../shared/js/daily-engine.js');
const manifest = require('../shared/js/daily-manifest.json');

let passed = 0;
function test(name, fn) {
    fn();
    passed++;
    console.log(`  PASS: ${name}`);
}

console.log('Test 1: Local date resolution');
test('Auckland is a day ahead of UTC late at night', () => {
    assert.strictEqual(engine.localDateKey(new Date('2026-11-26T23:30:00Z'), 'Pacific/Auckland'), '2026-11-27');
});
test('Los Angeles is still on the UTC day', () => {
    assert.strictEqual(engine.localDateKey(new Date('2026-11-26T23:30:00Z'), 'America/Los_Angeles'), '2026-11-26');
});
test('UTC matches the ISO date', () => {
    assert.strictEqual(engine.localDateKey(new Date('2026-11-26T12:00:00Z'), 'UTC'), '2026-11-26');
});
test('day index is stable and consecutive', () => {
    assert.strictEqual(engine.daysSinceEpoch('2026-11-27') - engine.daysSinceEpoch('2026-11-26'), 1);
});

console.log('Test 2: Band mapping');
test('single levels map to their band', () => {
    assert.strictEqual(engine.bandOfLevel('A0'), 'a0-a1');
    assert.strictEqual(engine.bandOfLevel('A2'), 'a2');
    assert.strictEqual(engine.bandOfLevel('B2'), 'b1-b2');
    assert.strictEqual(engine.bandOfLevel('C2'), 'c1-c2');
});
test('ranged prompt labels map by their lower bound', () => {
    assert.strictEqual(engine.bandOfLevel('A1-A2'), 'a0-a1');
    assert.strictEqual(engine.bandOfLevel('A2-B1'), 'a2');
    assert.strictEqual(engine.bandOfLevel('B2-C1'), 'b1-b2');
    assert.strictEqual(engine.bandOfLevel('C1-C2'), 'c1-c2');
});
test('two-level bands alternate by day', () => {
    assert.deepStrictEqual(engine.levelPrefs('b1-b2', 100), ['B1', 'B2']);
    assert.deepStrictEqual(engine.levelPrefs('b1-b2', 101), ['B2', 'B1']);
    assert.deepStrictEqual(engine.levelPrefs('a2', 101), ['A2']);
});

console.log('Test 3: Manifest integrity');
const ids = manifest.elements.map((e) => e.id);
test('element ids are unique', () => assert.strictEqual(new Set(ids).size, ids.length));
test('every element declares a known mode and owner', () => {
    const modes = ['pool', 'calendar', 'daily-file', 'derived', 'wheel'];
    for (const e of manifest.elements) {
        assert(modes.includes(e.mode), `${e.id}: unknown mode ${e.mode}`);
        assert(typeof e.owner === 'string' && e.owner.length, `${e.id}: owner required`);
        assert(Array.isArray(e.bands) && e.bands.length, `${e.id}: bands required`);
        for (const b of e.bands) assert(manifest.bands.includes(b), `${e.id}: unknown band ${b}`);
    }
});
test('live elements have a data url and languages', () => {
    for (const e of manifest.elements.filter((x) => x.status === 'live')) {
        assert(typeof e.url === 'string' && e.url.length, `${e.id}: url required`);
        assert(Array.isArray(e.languages) && e.languages.length, `${e.id}: languages required`);
        assert(e.task && typeof e.task.work_seconds === 'number', `${e.id}: task.work_seconds required`);
    }
});
test('directory hosts reference real elements', () => {
    for (const host of manifest.directory) {
        assert(host.key && host.title && host.url, 'host needs key, title and url');
        for (const id of host.slots) assert(ids.includes(id), `host ${host.key}: unknown slot ${id}`);
    }
});
test('every live element is reachable from a directory host', () => {
    const listed = new Set(manifest.directory.flatMap((h) => h.slots));
    for (const e of manifest.elements.filter((x) => x.status === 'live')) {
        assert(listed.has(e.id), `${e.id} is not listed in any directory host`);
    }
});

console.log('Test 4: Resolvers (stubbed fetch)');
const realFetch = global.fetch;
function stub(routes) {
    global.fetch = (url) => {
        const body = routes[url];
        if (body === undefined) return Promise.resolve({ ok: false, status: 404 });
        return Promise.resolve({ ok: true, json: () => Promise.resolve(body) });
    };
}
const poolElement = {
    id: 'speaking', title: 'Speaking Prompt', icon: '🗣️', owner: 'COSYpractice', mode: 'pool',
    status: 'live', url: 'https://example.test/{lang}/speaking.json',
    languages: ['en'], bands: manifest.bands, task: { work_seconds: 45 }
};
const calendarElement = {
    id: 'word', title: 'Word of the Day', icon: '📖', owner: 'COSYdata', mode: 'calendar',
    status: 'live', url: 'https://example.test/{lang}/{month}.json',
    languages: ['en'], bands: manifest.bands, task: { work_seconds: 60 }
};
const fileElement = {
    id: 'science', title: 'Today in Science', icon: '🔬', owner: 'COSYevents', mode: 'daily-file',
    status: 'live', url: 'https://example.test/spot.json', item_key: 'science',
    languages: ['en'], bands: manifest.bands, task: { work_seconds: 120 }
};

async function run() {
    stub({
        'https://example.test/en/speaking.json': [
            { id: 'a', prompt: 'A2 prompt', level: 'A2' },
            { id: 'b', prompt: 'B1 prompt', level: 'B1' },
            { id: 'c', prompt: 'B2 prompt', level: 'B2' }
        ],
        'https://example.test/en/2026-11.json': {
            days: { '2026-11-26': { A2: { id: 'w1', word: 'gare', definition: 'station', example: 'La gare.' }, B1: { id: 'w2', word: 'quai', definition: 'platform' } } }
        },
        'https://example.test/spot.json': {
            date: '2026-11-26',
            items: { science: { title: 'Today science', description: 'Something happened.' } },
            days: { '2026-11-27': { items: { science: { title: 'Tomorrow science', description: 'Will happen.' } } } }
        }
    });
    try {
        const pool = await engine.resolve(poolElement, { lang: 'en', band: 'b1-b2', date: '2026-11-26' });
        assert.strictEqual(pool.status, 'ok');
        assert(['b', 'c'].includes(pool.id), 'band filter must exclude the A2 card');

        const cal = await engine.resolve(calendarElement, { lang: 'en', band: 'b1-b2', date: '2026-11-26' });
        assert.strictEqual(cal.headword, 'quai', 'calendar must pick the B1 card for b1-b2');
        assert.strictEqual(cal.level, 'B1');

        const day = await engine.resolve(fileElement, { lang: 'en', band: 'a2', date: '2026-11-27' });
        assert.strictEqual(day.headword, 'Tomorrow science', 'daily-file must read the local day from the window');
        assert.strictEqual(day.stale, false);

        const stale = await engine.resolve(fileElement, { lang: 'en', band: 'a2', date: '2026-12-01' });
        assert.strictEqual(stale.stale, true, 'a day outside the window is stale');

        const planned = await engine.resolve({ ...poolElement, id: 'wheel-x', status: 'planned', mode: 'wheel' }, { lang: 'en' });
        assert.strictEqual(planned.status, 'planned');

        const unavailable = await engine.resolve(poolElement, { lang: 'ru' });
        assert.strictEqual(unavailable.status, 'unavailable');

        console.log('  PASS: pool, calendar, daily-file, planned and unavailable paths');
        passed++;
    } finally {
        global.fetch = realFetch;
    }
    console.log(`\n🎉 daily engine: ${passed} checks passed`);
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
