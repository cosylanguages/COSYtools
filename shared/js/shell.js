(function() {
    'use strict';

    // --------------------------------------------------------------------------
    // Theme Management
    // --------------------------------------------------------------------------
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        const btn = document.getElementById('cosy-theme-toggle');
        if (btn) {
            btn.textContent = theme === 'dark' ? '☀️' : '🌙';
            btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
        }
    }

    function initTheme() {
        const stored = localStorage.getItem('cosy_theme');
        if (stored === 'dark' || stored === 'light') {
            applyTheme(stored);
        } else {
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            applyTheme(prefersDark ? 'dark' : 'light');
        }
    }

    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        localStorage.setItem('cosy_theme', next);
        applyTheme(next);
    }

    // --------------------------------------------------------------------------
    // App Header Rendering
    // --------------------------------------------------------------------------
    const BACK_LINK_TRANSLATIONS = {
        en: '← COSYtools',
        fr: '← COSYtools',
        it: '← COSYtools',
        ru: '← COSYtools',
        el: '← COSYtools',
        de: '← COSYtools',
        es: '← COSYtools',
        pt: '← COSYtools'
    };

    function renderAppHeader() {
        const header = document.querySelector('header.app-header[data-icon]');
        if (!header) return;

        const icon = header.getAttribute('data-icon') || '';
        const title = header.getAttribute('data-title') || '';
        const tagline = header.getAttribute('data-tagline') || '';

        const lang = (document.documentElement.lang || 'en').toLowerCase();
        const backText = BACK_LINK_TRANSLATIONS[lang] || '← COSYtools';

        // Calculate relative path to root index.html based on pathname depth
        const depth = window.location.pathname.split('/').filter(Boolean).length - 1;
        const relativeRoot = depth > 0 ? '../'.repeat(depth) + 'index.html' : 'index.html';

        header.innerHTML = `
            <div class="logo-badge">
                ${icon ? `<span class="brand-icon">${icon}</span>` : ''}
                <div class="brand-text">
                    <h1>${title}</h1>
                    ${tagline ? `<p class="tagline">${tagline}</p>` : ''}
                </div>
            </div>
            <div class="header-actions">
                <a href="${relativeRoot}" class="back-link nav-btn" style="text-decoration:none; display:inline-flex; align-items:center; gap:0.4rem; padding:0.5rem 0.9rem; font-weight:600;">${backText}</a>
            </div>
        `;
    }

    // --------------------------------------------------------------------------
    // Initial Query Search Deep Links
    // --------------------------------------------------------------------------
    function handleInitialDeepLink() {
        const query = window.COSY && typeof window.COSY.getInitialSearchQuery === 'function'
            ? window.COSY.getInitialSearchQuery()
            : null;
        if (!query) return;

        const input = document.getElementById('search-input') || document.getElementById('verb-search-input');
        if (!input) return;

        input.value = query;
        // Dispatch 'input' event so tool inline listeners trigger search & render
        input.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // Bind theme toggle button & app header rendering when DOM is ready
    function bindEvents() {
        initTheme();
        renderAppHeader();
        const toggleBtn = document.getElementById('cosy-theme-toggle');
        if (toggleBtn) {
            toggleBtn.removeEventListener('click', toggleTheme);
            toggleBtn.addEventListener('click', toggleTheme);
        }
        handleInitialDeepLink();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindEvents);
    } else {
        bindEvents();
    }

    // --------------------------------------------------------------------------
    // Compatibility Object
    // --------------------------------------------------------------------------
    window.COSY = window.COSY || {};

    /**
     * Extracts query parameter value from standard query parameter aliases.
     * Copy verbatim from legacy ui.js for tool compatibility.
     * @param {Array<string>} [keys]
     * @returns {string|null}
     */
    window.COSY.getInitialSearchQuery = function(keys) {
        const searchKeys = keys || ['verb', 'infinitive', 'noun', 'word', 'q', 'search'];
        const params = new URLSearchParams(window.location.search);
        for (const key of searchKeys) {
            const val = params.get(key);
            if (val && val.trim()) {
                return val.trim();
            }
        }
        return null;
    };

})();
