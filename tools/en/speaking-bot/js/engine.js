/**
 * tools/en/speaking-bot/js/engine.js
 *
 * Text-based speaking-practice partner (gap-analysis A3).
 *
 * Runs CEFR-leveled role-play scenarios as a branching dialogue. The "bot"
 * plays one role, the learner types their lines, and the engine checks each
 * response against an `accept` pattern (keyword / anyOf / regex / any) and
 * gives immediate feedback + a model answer.
 *
 * No external API: response evaluation is keyword/pattern based, so the app
 * is fully static and offline-capable.
 */
(function () {
    'use strict';

    var state = {
        scenario: null,
        turn: 0,
        hintsUsed: 0,
        completed: 0,
        transcript: []
    };

    function $(id) { return document.getElementById(id); }
    function el(tag, cls, text) {
        var n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text != null) n.textContent = text;
        return n;
    }

    function norm(s) { return String(s == null ? '' : s).toLowerCase().replace(/[^a-z0-9'\s]/g, ' ').replace(/\s+/g, ' ').trim(); }
    function words(s) { return norm(s).split(' ').filter(Boolean); }

    // Evaluate a learner response against an accept spec. Returns {ok, why}.
    function evaluate(response, accept) {
        var r = norm(response);
        if (!r) return { ok: false, why: 'empty' };
        if (accept.any) return { ok: true, why: 'any' };
        if (accept.regex) {
            try { if (new RegExp(accept.regex, 'i').test(response)) return { ok: true, why: 'regex' }; }
            catch (e) { /* fall through */ }
        }
        var w = words(response);
        if (accept.contains) {
            var hit = accept.contains.some(function (kw) {
                kw = norm(kw);
                return w.some(function (x) { return x === kw || (x.indexOf(kw) === 0 && kw.length >= 4 && x.indexOf(kw) === 0); });
            });
            // also allow substring match for multi-word phrases
            if (!hit) hit = accept.contains.some(function (kw) { return r.indexOf(norm(kw)) !== -1; });
            return { ok: hit, why: hit ? 'contains' : 'no-keyword' };
        }
        if (accept.anyOf) {
            var anyHit = accept.anyOf.some(function (group) {
                return group.some(function (kw) { return r.indexOf(norm(kw)) !== -1; });
            });
            return { ok: anyHit, why: anyHit ? 'anyOf' : 'no-group' };
        }
        return { ok: true, why: 'fallback' };
    }

    function renderScenarioList(scenarios) {
        var list = $('sb-scenarios');
        list.innerHTML = '';
        scenarios.forEach(function (sc) {
            var card = el('div', 'sb-card');
            var lvl = el('span', 'sb-level', sc.level);
            card.appendChild(lvl);
            card.appendChild(el('h3', '', sc.title));
            card.appendChild(el('p', 'sb-meta', sc.botRole + ' ↔ ' + sc.learnerRole + ' · ' + sc.turns.length + ' turns'));
            card.appendChild(el('p', 'sb-obj', '🎯 ' + sc.objective));
            var btn = el('button', 'btn btn-primary', 'Start role-play');
            btn.addEventListener('click', function () { startScenario(sc); });
            card.appendChild(btn);
            list.appendChild(card);
        });
    }

    function startScenario(sc) {
        state.scenario = sc;
        state.turn = 0;
        state.hintsUsed = 0;
        state.completed = 0;
        state.transcript = [];
        $('sb-setup').hidden = true;
        $('sb-run').hidden = false;
        $('sb-title').textContent = sc.title + ' (' + sc.level + ')';
        $('sb-roles').textContent = 'You are: ' + sc.learnerRole + ' · Bot is: ' + sc.botRole;
        $('sb-log').innerHTML = '';
        addBotLine(sc.objective, 'objective');
        playTurn();
    }

    function addBotLine(text, kind) {
        var row = el('div', 'sb-msg sb-bot');
        row.appendChild(el('span', 'sb-avatar', state.scenario ? state.scenario.botRole.slice(0, 1) : '🤖'));
        row.appendChild(el('span', 'sb-bubble ' + (kind || ''), text));
        $('sb-log').appendChild(row);
        $('sb-log').scrollTop = $('sb-log').scrollHeight;
    }

    function addUserLine(text) {
        var row = el('div', 'sb-msg sb-user');
        row.appendChild(el('span', 'sb-bubble', text));
        $('sb-log').appendChild(row);
        $('sb-log').scrollTop = $('sb-log').scrollHeight;
    }

    function addFeedback(text, ok) {
        var row = el('div', 'sb-feedback ' + (ok ? 'ok' : 'no'));
        row.textContent = (ok ? '✓ ' : '✗ ') + text;
        $('sb-log').appendChild(row);
        $('sb-log').scrollTop = $('sb-log').scrollHeight;
    }

    function playTurn() {
        var sc = state.scenario;
        if (state.turn >= sc.turns.length) { finish(); return; }
        var t = sc.turns[state.turn];
        addBotLine(t.bot);
        $('sb-hint-text').textContent = '';
        $('sb-hint').hidden = true;
        $('sb-input').value = '';
        $('sb-input').disabled = false;
        $('sb-submit').disabled = false;
        $('sb-input').focus();
    }

    function handleSubmit() {
        var sc = state.scenario;
        var t = sc.turns[state.turn];
        var resp = $('sb-input').value.trim();
        if (!resp) return;
        addUserLine(resp);
        var res = evaluate(resp, t.accept);
        if (res.ok) {
            state.completed++;
            addFeedback('Good — that hit the target language function. Model: "' + t.model + '"', true);
            state.turn++;
            playTurn();
        } else {
            state.hintsUsed++;
            addFeedback('Not quite. Try the target function.', false);
            $('sb-hint-text').textContent = '💡 ' + t.hint;
            $('sb-hint').hidden = false;
            $('sb-input').value = '';
            $('sb-input').focus();
        }
    }

    function finish() {
        var sc = state.scenario;
        var total = sc.turns.length;
        var score = Math.round((state.completed / total) * 100);
        $('sb-input').disabled = true;
        $('sb-submit').disabled = true;
        addBotLine('🏁 Role-play complete! You handled ' + state.completed + '/' + total + ' turns cleanly (score ' + score + '%, ' + state.hintsUsed + ' hints used).');
        if (score >= 80) addBotLine("Excellent — you're ready to try this scenario in real life.", 'objective');
        else addBotLine('Replay it to build fluency, or try a level below.', 'objective');
    }

    function load() {
        fetch('data/scenarios.json').then(function (r) {
            if (!r.ok) throw new Error('scenarios not found');
            return r.json();
        }).then(function (data) {
            renderScenarioList(data.scenarios || []);
        }).catch(function (e) {
            $('sb-error').textContent = 'Could not load scenarios: ' + e.message;
            $('sb-error').hidden = false;
        });
    }

    // wire events
    document.addEventListener('DOMContentLoaded', function () {
        load();
        $('sb-submit').addEventListener('click', function (e) { e.preventDefault(); handleSubmit(); });
        $('sb-input').addEventListener('keydown', function (e) {
            if (e.key === 'Enter') { e.preventDefault(); handleSubmit(); }
        });
        $('sb-back').addEventListener('click', function (e) {
            e.preventDefault();
            $('sb-run').hidden = true;
            $('sb-setup').hidden = false;
        });
    });
})();
