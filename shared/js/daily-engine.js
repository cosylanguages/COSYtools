/**
 * shared/js/daily-engine.js
 *
 * One date model, one band model and one card shape for every COSY daily element.
 * Content stays in the repository that owns it; this file only decides what to show
 * today for a reader in a given timezone and CEFR band.
 *
 * Registry: shared/js/daily-manifest.json
 */
(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.CosyDaily = factory();
    }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    var BANDS = ['a0-a1', 'a2', 'b1-b2', 'c1-c2'];
    var LEVEL_TO_BAND = { A0: 'a0-a1', A1: 'a0-a1', A2: 'a2', B1: 'b1-b2', B2: 'b1-b2', C1: 'c1-c2', C2: 'c1-c2' };
    var LEVEL_ORDER = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    var cache = new Map();

    function manifestUrl() {
        if (typeof document !== 'undefined' && document.currentScript && document.currentScript.src) {
            return new URL('daily-manifest.json', document.currentScript.src).href;
        }
        return 'daily-manifest.json';
    }

    /* ---------- date ---------- */

    function localDateKey(date, timeZone) {
        date = date || new Date();
        try {
            return new Intl.DateTimeFormat('en-CA', {
                timeZone: timeZone, year: 'numeric', month: '2-digit', day: '2-digit'
            }).format(date);
        } catch (e) {
            var m = String(date.getMonth() + 1).padStart(2, '0');
            var d = String(date.getDate()).padStart(2, '0');
            return date.getFullYear() + '-' + m + '-' + d;
        }
    }

    function daysSinceEpoch(dateKey) {
        var p = dateKey.split('-').map(Number);
        return Math.floor(Date.UTC(p[0], p[1] - 1, p[2]) / 86400000);
    }

    function msUntilMidnight(now) {
        now = now || new Date();
        var next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 50);
        return next - now;
    }

    /* ---------- bands ---------- */

    function bandOfLevel(level) {
        if (!level) return null;
        var first = String(level).toUpperCase().match(/A0|A1|A2|B1|B2|C1|C2/);
        return first ? LEVEL_TO_BAND[first[0]] : null;
    }

    // A band that spans two levels alternates by day so both get exposure.
    function levelPrefs(band, dayIndex) {
        var odd = Math.abs(dayIndex) % 2 === 1;
        if (band === 'a0-a1') return odd ? ['A1', 'A0'] : ['A0', 'A1'];
        if (band === 'a2') return ['A2'];
        if (band === 'b1-b2') return odd ? ['B2', 'B1'] : ['B1', 'B2'];
        if (band === 'c1-c2') return odd ? ['C2', 'C1'] : ['C1', 'C2'];
        return LEVEL_ORDER;
    }

    /* ---------- data ---------- */

    function fetchJSON(url) {
        if (cache.has(url)) return cache.get(url);
        var p = fetch(url, { cache: 'no-cache' })
            .then(function (r) {
                if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + url);
                return r.json();
            })
            .catch(function (err) { cache.delete(url); throw err; });
        cache.set(url, p);
        return p;
    }

    function fill(template, vars) {
        return template.replace(/\{(\w+)\}/g, function (_, k) { return vars[k] || ''; });
    }

    function card(element, base) {
        return Object.assign({
            element: element.id,
            title: element.title,
            icon: element.icon,
            owner: element.owner,
            mode: element.mode,
            status: 'ok',
            task: element.task,
            rules: element.rules,
            render: element.render
        }, base);
    }

    function resolvePool(element, ctx) {
        var url = fill(element.url, { lang: ctx.lang, month: ctx.dateKey.slice(0, 7) });
        return fetchJSON(url).then(function (items) {
            if (!Array.isArray(items) || !items.length) return card(element, { status: 'empty' });
            var matching = items.filter(function (it) { return bandOfLevel(it.level) === ctx.band; });
            var curated = matching.filter(function (it) { return it.curated; });
            var pool = curated.length ? curated : matching;
            if (!pool.length) pool = items;
            var item = pool[ctx.dayIndex % pool.length];
            return card(element, {
                id: item.id,
                level: item.level || null,
                band: ctx.band,
                body: item.prompt || item.fact,
                follow_ups: item.follow_ups || [],
                source: { repo: element.owner, url: url, id: item.id },
                pool_size: pool.length
            });
        });
    }

    function resolveCalendar(element, ctx) {
        var url = fill(element.url, { lang: ctx.lang, month: ctx.dateKey.slice(0, 7) });
        return fetchJSON(url).then(function (data) {
            var day = data && data.days && data.days[ctx.dateKey];
            if (!day) return card(element, { status: 'no-day', source: { url: url } });
            var prefs = levelPrefs(ctx.band, ctx.dayIndex);
            var chosen = null, level = null;
            for (var i = 0; i < prefs.length && !chosen; i++) {
                if (day[prefs[i]]) { chosen = day[prefs[i]]; level = prefs[i]; }
            }
            if (!chosen) {
                var avail = Object.keys(day).sort(function (a, b) {
                    return Math.abs(LEVEL_ORDER.indexOf(a) - LEVEL_ORDER.indexOf(prefs[0])) -
                           Math.abs(LEVEL_ORDER.indexOf(b) - LEVEL_ORDER.indexOf(prefs[0]));
                });
                if (!avail.length) return card(element, { status: 'empty' });
                level = avail[0];
                chosen = day[level];
            }
            var head = chosen.word || chosen.idiom || chosen.term || '';
            var body = [chosen.definition, chosen.example].filter(Boolean).join(' — ');
            return card(element, {
                id: chosen.id,
                level: level,
                band: ctx.band,
                headword: head,
                body: body,
                extra: chosen,
                source: { repo: element.owner, url: url, id: chosen.id }
            });
        });
    }

    function resolveDailyFile(element, ctx) {
        return fetchJSON(element.url).then(function (data) {
            var day = data.days && data.days[ctx.dateKey];
            var items = day ? day.items : (data.items || {});
            var item = items[element.item_key];
            if (!item) return card(element, { status: 'empty' });
            var t = (item.i18n && (item.i18n[ctx.lang] || item.i18n.en)) || {};
            var fileDate = day ? ctx.dateKey : data.date;
            return card(element, {
                id: element.item_key + ':' + (fileDate || ''),
                level: null,
                band: ctx.band,
                headword: t.title || item.title,
                body: t.description || item.description,
                stale: !!fileDate && fileDate !== ctx.dateKey,
                file_date: fileDate,
                source: { repo: element.owner, url: element.url }
            });
        });
    }

    // Wheels: a deterministic daily set of prompts; the learner spins to pick one.
    function resolveWheel(element, ctx) {
        var url = fill(element.url, { lang: ctx.lang });
        return fetchJSON(url).then(function (data) {
            var pool = (data.prompts || []).filter(function (p) { return p.band === ctx.band; });
            if (!pool.length) return card(element, { status: 'empty', source: { url: url } });
            var start = ctx.dayIndex % pool.length;
            var picks = [];
            var size = Math.min(element.wheel_size || 8, pool.length);
            for (var i = 0; i < size; i++) picks.push(pool[(start + i) % pool.length]);
            return card(element, {
                id: picks[0].id,
                band: ctx.band,
                headword: picks[0].prompt,
                body: picks.length + ' prompts today',
                wheel: picks,
                pool_size: pool.length,
                source: { repo: element.owner, url: url, id: picks[0].id }
            });
        });
    }

    function resolveDerived(element, ctx, manifest) {
        var parent = manifest.elements.find(function (e) { return e.id === element.parent; });
        if (!parent) return Promise.resolve(card(element, { status: 'error', body: 'parent missing' }));
        return resolve(parent, ctx, manifest).then(function (p) {
            if (p.status !== 'ok') return card(element, { status: p.status });
            var word = p.headword || p.body;
            return card(element, {
                id: p.id,
                level: p.level,
                band: ctx.band,
                headword: word,
                body: element.id === 'conjugation-drill'
                    ? 'Conjugate “' + word + '” for the persons and tenses of your band.'
                    : 'Which preposition goes with “' + word + '”?',
                derived_from: parent.id,
                source: p.source
            });
        });
    }

    /* ---------- public API ---------- */

    function resolve(element, opts, manifest) {
        opts = opts || {};
        var date = opts.date instanceof Date ? opts.date : (opts.date ? new Date(opts.date + 'T12:00:00') : new Date());
        var dateKey = typeof opts.date === 'string' ? opts.date : localDateKey(date, opts.tz);
        var ctx = {
            lang: opts.lang || 'en',
            band: opts.band || 'b1-b2',
            dateKey: dateKey,
            dayIndex: daysSinceEpoch(dateKey),
            tz: opts.tz
        };
        if (element.status !== 'live') return Promise.resolve(card(element, { status: 'planned', body: element.notes }));
        if (element.languages && element.languages.indexOf(ctx.lang) === -1)
            return Promise.resolve(card(element, { status: 'unavailable', body: 'Not published for ' + ctx.lang }));
        if (element.mode === 'pool') return resolvePool(element, ctx);
        if (element.mode === 'calendar') return resolveCalendar(element, ctx);
        if (element.mode === 'daily-file') return resolveDailyFile(element, ctx);
        if (element.mode === 'wheel') return resolveWheel(element, ctx);
        if (element.mode === 'derived') return resolveDerived(element, ctx, manifest);
        return Promise.resolve(card(element, { status: 'unknown-mode' }));
    }

    function loadManifest(url) {
        return fetchJSON(url || manifestUrl());
    }

    function resolveAll(opts) {
        return loadManifest(opts && opts.manifestUrl).then(function (manifest) {
            return Promise.all(manifest.elements.map(function (e) {
                return resolve(e, opts, manifest).catch(function (err) {
                    return card(e, { status: 'error', body: String(err.message || err) });
                });
            })).then(function (cards) { return { manifest: manifest, cards: cards }; });
        });
    }

    // Host cards for the ecosystem directory, in the order the manifest declares.
    function directoryHosts(manifest) {
        return (manifest.directory || []).map(function (host) {
            return {
                key: host.key,
                repo: host.repo,
                icon: host.icon,
                title: host.title,
                url: host.url,
                description: host.description,
                slots: (host.slots || []).map(function (id) {
                    var el = manifest.elements.find(function (e) { return e.id === id; });
                    return { label: el ? el.title : id, icon: el ? el.icon : '' };
                })
            };
        });
    }

    return {
        BANDS: BANDS,
        localDateKey: localDateKey,
        daysSinceEpoch: daysSinceEpoch,
        msUntilMidnight: msUntilMidnight,
        bandOfLevel: bandOfLevel,
        levelPrefs: levelPrefs,
        loadManifest: loadManifest,
        resolve: resolve,
        resolveAll: resolveAll,
        directoryHosts: directoryHosts,
        clearCache: function () { cache.clear(); }
    };
});
