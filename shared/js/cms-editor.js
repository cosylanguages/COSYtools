(function() {
    'use strict';

    /**
     * COSY Founder Visual On-Page CMS Editor
     * Allows admin, founder, and owner roles to visually edit live page content
     * and persist/apply page content overrides via Supabase `cms_page_overrides`.
     */

    let isEditingActive = false;

    function getSupabaseClient() {
        if (window.supabaseClient && window.supabaseClient.auth) {
            return window.supabaseClient;
        }
        if (window.supabase && window.supabase.auth) {
            return window.supabase;
        }
        if (window.COSY_SSO && typeof window.COSY_SSO.getSupabaseClient === 'function') {
            return window.COSY_SSO.getSupabaseClient();
        }
        return null;
    }

    async function isFounderOrAdmin() {
        // Check global COSY_USER or localStorage
        let user = window.COSY_USER;
        if (!user) {
            try {
                const stored = localStorage.getItem('COSY_USER') || localStorage.getItem('cosy_user');
                if (stored) user = JSON.parse(stored);
            } catch (e) {}
        }

        const role = (
            user?.role ||
            user?.user_metadata?.role ||
            user?.app_metadata?.role ||
            localStorage.getItem('cosy_role') ||
            ''
        ).toLowerCase();

        if (['admin', 'founder', 'owner'].includes(role)) {
            return true;
        }

        // Check active Supabase session
        const client = getSupabaseClient();
        if (client && client.auth) {
            try {
                let session = null;
                if (typeof client.auth.getSession === 'function') {
                    const { data } = await client.auth.getSession();
                    session = data?.session;
                } else if (typeof client.auth.session === 'function') {
                    session = client.auth.session();
                }

                const sessionUser = session?.user;
                if (sessionUser) {
                    const sessionRole = (
                        sessionUser.role ||
                        sessionUser.user_metadata?.role ||
                        sessionUser.app_metadata?.role ||
                        ''
                    ).toLowerCase();
                    if (['admin', 'founder', 'owner'].includes(sessionRole)) {
                        return true;
                    }
                }
            } catch (e) {
                console.warn('COSY CMS: Error checking session role', e);
            }
        }

        return false;
    }

    function sanitizeHTML(html) {
        if (!html || typeof html !== 'string') return '';
        const doc = new DOMParser().parseFromString(html, 'text/html');

        // Remove script, iframe, object, embed tags
        const dangerous = doc.querySelectorAll('script, iframe, object, embed, link, meta');
        dangerous.forEach(el => el.remove());

        // Strip event handlers (on*) and javascript: links
        const allElements = doc.body.querySelectorAll('*');
        allElements.forEach(el => {
            Array.from(el.attributes).forEach(attr => {
                if (attr.name.startsWith('on') || (attr.name === 'href' && attr.value.trim().toLowerCase().startsWith('javascript:'))) {
                    el.removeAttribute(attr.name);
                }
            });
        });

        return doc.body.innerHTML;
    }

    function getElementSelector(elem) {
        if (!elem) return '';
        if (elem.id) return '#' + elem.id;
        if (elem.getAttribute('data-cms-id')) return `[data-cms-id="${elem.getAttribute('data-cms-id')}"]`;
        if (elem.getAttribute('data-i18n')) return `[data-i18n="${elem.getAttribute('data-i18n')}"]`;

        const path = [];
        let curr = elem;
        while (curr && curr.nodeType === Node.ELEMENT_NODE && curr !== document.body) {
            let selector = curr.nodeName.toLowerCase();
            if (curr.className) {
                const firstClass = String(curr.className).split(/\s+/).find(c => c && !c.startsWith('cosy-cms'));
                if (firstClass) selector += '.' + firstClass;
            }
            let sibling = curr;
            let nth = 1;
            while ((sibling = sibling.previousElementSibling) !== null) {
                if (sibling.nodeName.toLowerCase() === curr.nodeName.toLowerCase()) nth++;
            }
            if (nth > 1) selector += `:nth-of-type(${nth})`;
            path.unshift(selector);
            curr = curr.parentNode;
        }
        return path.join(' > ');
    }

    async function fetchAndApplyPageOverrides() {
        const client = getSupabaseClient();
        if (!client || typeof client.from !== 'function') return;

        try {
            const pagePath = window.location.pathname;
            const { data, error } = await client
                .from('cms_page_overrides')
                .select('*')
                .eq('page_path', pagePath);

            if (error) {
                console.warn('COSY CMS: Could not fetch page overrides:', error.message || error);
                return;
            }

            if (data && Array.isArray(data)) {
                data.forEach(row => {
                    const selector = row.selector || (row.element_id ? '#' + row.element_id : null);
                    const content = row.content || row.html_content;
                    if (!selector || !content) return;

                    const elem = document.querySelector(selector);
                    if (elem) {
                        elem.innerHTML = sanitizeHTML(content);
                    }
                });
            }
        } catch (err) {
            console.warn('COSY CMS: Exception loading overrides:', err);
        }
    }

    function injectCMSStyles() {
        if (document.getElementById('cosy-cms-styles')) return;
        const style = document.createElement('style');
        style.id = 'cosy-cms-styles';
        style.textContent = `
            .cosy-cms-editable-active {
                outline: 2px dashed var(--sage, #416b49) !important;
                outline-offset: 3px !important;
                border-radius: 4px !important;
                transition: outline 0.2s ease !important;
            }
            .cosy-cms-editable-active:hover {
                outline-color: #276749 !important;
                background: rgba(65, 107, 73, 0.05) !important;
            }
            .cosy-cms-floating-bar button:hover {
                filter: brightness(1.15);
                transform: translateY(-1px);
            }
            .cosy-cms-toast {
                position: fixed;
                bottom: 80px;
                right: 20px;
                background: #1a202c;
                color: #fff;
                padding: 10px 18px;
                border-radius: 12px;
                box-shadow: 0 4px 16px rgba(0,0,0,0.25);
                font-family: system-ui, sans-serif;
                font-size: 0.88rem;
                z-index: 999999;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            .cosy-cms-toast.show {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }

    function showToast(message, isError = false) {
        let toast = document.getElementById('cosy-cms-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'cosy-cms-toast';
            toast.className = 'cosy-cms-toast';
            document.body.appendChild(toast);
        }
        toast.style.background = isError ? '#9b2c2c' : '#276749';
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3500);
    }

    function getEditableCandidateElements() {
        const toolbar = document.getElementById('cosy-founder-cms-toolbar');
        const strip = document.querySelector('.cosy-ecosystem-strip');
        const footer = document.querySelector('.cosy-footer');

        const elements = Array.from(document.querySelectorAll(
            'h1, h2, h3, h4, h5, h6, p, span.tagline, .hero-hub-subtext, .ref-card-title, .ref-card-desc, .engine-desc, [data-cms-editable]'
        ));

        return elements.filter(el => {
            if (toolbar && toolbar.contains(el)) return false;
            if (strip && strip.contains(el)) return false;
            if (footer && footer.contains(el)) return false;
            if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'BUTTON') return false;
            return true;
        });
    }

    function toggleVisualEditing(enable) {
        injectCMSStyles();
        isEditingActive = (enable !== undefined) ? Boolean(enable) : !isEditingActive;

        const candidates = getEditableCandidateElements();
        candidates.forEach(el => {
            if (isEditingActive) {
                el.contentEditable = "true";
                el.classList.add('cosy-cms-editable-active');
            } else {
                el.contentEditable = "false";
                el.classList.remove('cosy-cms-editable-active');
            }
        });

        const toggleBtn = document.getElementById('cms-toggle-edit-btn');
        if (toggleBtn) {
            toggleBtn.textContent = isEditingActive ? '✏️ Editing Active' : '✏️ Edit Page Content';
            toggleBtn.style.background = isEditingActive ? '#276749' : 'rgba(255,255,255,0.15)';
        }

        const statusMsg = document.getElementById('cms-status-msg');
        if (statusMsg) {
            statusMsg.textContent = isEditingActive ? 'Click any highlighted text to edit.' : '';
        }
    }

    async function saveAndPublishLive() {
        const client = getSupabaseClient();
        if (!client || typeof client.from !== 'function') {
            showToast('⚠️ Supabase client not available for live publishing.', true);
            return;
        }

        const statusMsg = document.getElementById('cms-status-msg');
        if (statusMsg) statusMsg.textContent = '💾 Saving & Publishing live...';

        const editableElements = getEditableCandidateElements().filter(el => el.classList.contains('cosy-cms-editable-active') || el.isContentEditable);

        if (editableElements.length === 0) {
            showToast('No page content changes detected to publish.');
            if (statusMsg) statusMsg.textContent = '';
            return;
        }

        const pagePath = window.location.pathname;
        const overrides = editableElements.map(el => ({
            page_path: pagePath,
            selector: getElementSelector(el),
            content: sanitizeHTML(el.innerHTML.trim()),
            updated_at: new Date().toISOString()
        })).filter(o => o.selector && o.content);

        try {
            const { error } = await client
                .from('cms_page_overrides')
                .upsert(overrides, { onConflict: 'page_path,selector' });

            if (error) {
                console.error('COSY CMS: Error publishing live overrides:', error);
                showToast(`❌ Save failed: ${error.message || 'Supabase error'}`, true);
                if (statusMsg) statusMsg.textContent = '❌ Save error';
            } else {
                showToast('✨ Page content saved & published live!');
                if (statusMsg) statusMsg.textContent = '✅ Published!';
                toggleVisualEditing(false);
            }
        } catch (err) {
            console.error('COSY CMS: Exception publishing live:', err);
            showToast('❌ Exception while publishing edits.', true);
            if (statusMsg) statusMsg.textContent = '❌ Error';
        }
    }

    function renderCMSToolbar() {
        if (document.getElementById('cosy-founder-cms-toolbar')) return;

        injectCMSStyles();

        const toolbar = document.createElement('div');
        toolbar.id = 'cosy-founder-cms-toolbar';
        toolbar.className = 'cosy-cms-floating-bar';
        toolbar.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 999999;
            background: #2c3e2e;
            color: #ffffff;
            padding: 8px 16px;
            border-radius: 30px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.35);
            font-family: system-ui, -apple-system, sans-serif;
            display: flex;
            align-items: center;
            gap: 10px;
            border: 1px solid rgba(255,255,255,0.25);
        `;

        toolbar.innerHTML = `
            <span style="font-weight: 700; font-size: 0.88rem; display: flex; align-items: center; gap: 4px;">👑 Founder CMS</span>
            <button id="cms-toggle-edit-btn" style="background: rgba(255,255,255,0.15); color: #fff; border: 1px solid rgba(255,255,255,0.3); padding: 6px 12px; border-radius: 20px; cursor: pointer; font-size: 0.82rem; font-weight: 600; transition: all 0.2s ease;">✏️ Edit Page Content</button>
            <button id="cms-save-publish-btn" style="background: #416b49; color: #fff; border: none; padding: 6px 14px; border-radius: 20px; cursor: pointer; font-size: 0.82rem; font-weight: 600; transition: all 0.2s ease;">💾 Save &amp; Publish Live</button>
            <span id="cms-status-msg" style="font-size: 0.78rem; opacity: 0.85;"></span>
        `;

        document.body.appendChild(toolbar);

        document.getElementById('cms-toggle-edit-btn').addEventListener('click', () => toggleVisualEditing());
        document.getElementById('cms-save-publish-btn').addEventListener('click', saveAndPublishLive);
    }

    async function initCMS() {
        await fetchAndApplyPageOverrides();

        const authorized = await isFounderOrAdmin();
        if (authorized) {
            renderCMSToolbar();
        }
    }

    window.addEventListener('cosy:auth:changed', async () => {
        const authorized = await isFounderOrAdmin();
        if (authorized) {
            renderCMSToolbar();
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCMS);
    } else {
        initCMS();
    }

    window.COSY_CMS = {
        fetchAndApplyPageOverrides: fetchAndApplyPageOverrides,
        toggleVisualEditing: toggleVisualEditing,
        saveAndPublishLive: saveAndPublishLive,
        renderCMSToolbar: renderCMSToolbar,
        sanitizeHTML: sanitizeHTML
    };

})();
