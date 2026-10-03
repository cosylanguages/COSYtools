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

    // Bind theme toggle button when DOM is ready
    function bindEvents() {
        initTheme();
        const toggleBtn = document.getElementById('cosy-theme-toggle');
        if (toggleBtn) {
            toggleBtn.removeEventListener('click', toggleTheme);
            toggleBtn.addEventListener('click', toggleTheme);
        }
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
