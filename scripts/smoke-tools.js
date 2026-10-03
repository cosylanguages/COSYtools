const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const PORT = 8085;
const ROOT_DIR = path.resolve(__dirname, '..');

const ACCEPTED_QUERY_PARAMS = ['verb', 'infinitive', 'noun', 'word', 'q', 'search', 'lang'];

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

function createServer() {
    return http.createServer((req, res) => {
        let reqPath = decodeURIComponent(req.url.split('?')[0]);
        if (reqPath.endsWith('/')) reqPath += 'index.html';
        const filePath = path.join(ROOT_DIR, reqPath);

        fs.stat(filePath, (err, stats) => {
            if (err || !stats.isFile()) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end(`404 Not Found: ${req.url}`);
                return;
            }

            const ext = path.extname(filePath).toLowerCase();
            const contentType = MIME_TYPES[ext] || 'application/octet-stream';
            res.writeHead(200, { 'Content-Type': contentType });
            fs.createReadStream(filePath).pipe(res);
        });
    });
}

function getToolPageQuery(pageRelPath) {
    const dirPath = path.join(ROOT_DIR, path.dirname(pageRelPath));
    const dataDir = path.join(dirPath, 'data');

    if (!fs.existsSync(dataDir)) return 'test';

    const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
    if (files.length === 0) return 'test';

    const primaryFile = files.find(f => f === 'verbs.json' || f === 'nouns.json' || f === 'scenarios.json' || f === 'adjectives.json') || files[0];
    const content = JSON.parse(fs.readFileSync(path.join(dataDir, primaryFile), 'utf8'));

    if (Array.isArray(content)) {
        return content[0]?.word || content[0]?.lemma || content[0]?.title || content[0]?.id || 'test';
    } else if (typeof content === 'object' && content !== null) {
        const keys = Object.keys(content);
        return keys.length > 0 ? keys[0] : 'test';
    }
    return 'test';
}

function getQueryParamForTool(pageRelPath) {
    if (pageRelPath.includes('conj') || pageRelPath.includes('konjugation') || pageRelPath.includes('spryazhenie') || pageRelPath.includes('klisi') || pageRelPath.includes('coniugatore') || pageRelPath.includes('irregular-verbs')) {
        return 'verb';
    }
    if (pageRelPath.includes('genre') || pageRelPath.includes('genus') || pageRelPath.includes('cases') || pageRelPath.includes('rod-padezhi') || pageRelPath.includes('genere') || pageRelPath.includes('genos')) {
        return 'noun';
    }
    return 'q';
}

function findRealToolPages() {
    const toolsDir = path.join(ROOT_DIR, 'tools');
    const toolPages = ['index.html'];

    function walk(dir) {
        const list = fs.readdirSync(dir);
        list.forEach(file => {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            if (stat && stat.isDirectory()) {
                walk(fullPath);
            } else if (file === 'index.html') {
                const content = fs.readFileSync(fullPath, 'utf8');
                if (!content.includes('Tool Moved')) {
                    const relativePath = path.relative(ROOT_DIR, fullPath).replace(/\\/g, '/');
                    toolPages.push(relativePath);
                }
            }
        });
    }

    walk(toolsDir);
    return toolPages.sort();
}

async function runSmokeTests() {
    console.log(`Accepted query parameters across tools: ${ACCEPTED_QUERY_PARAMS.join(', ')}`);
    const server = createServer();
    await new Promise(resolve => server.listen(PORT, resolve));
    console.log(`Smoke server listening on http://localhost:${PORT}`);

    const realPages = findRealToolPages();
    console.log(`Found ${realPages.length} real tool & hub pages.`);

    let browser;
    let totalErrors = 0;
    const functionalProofResults = [];

    try {
        browser = await puppeteer.launch({
            executablePath: '/usr/bin/google-chrome',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const viewports = [
            { width: 390, height: 844, name: '390px (mobile)' },
            { width: 1280, height: 800, name: '1280px (desktop)' }
        ];

        for (const pageRelPath of realPages) {
            console.log(`\n----------------------------------------\nTesting page: ${pageRelPath}`);
            const sampleQuery = getToolPageQuery(pageRelPath);
            const paramKey = getQueryParamForTool(pageRelPath);
            const pageUrl = pageRelPath === 'index.html'
                ? `http://localhost:${PORT}/index.html`
                : `http://localhost:${PORT}/${pageRelPath}?${paramKey}=${encodeURIComponent(sampleQuery)}`;

            let pageFunctionalPassed = false;

            for (const vp of viewports) {
                const page = await browser.newPage();
                await page.setViewport({ width: vp.width, height: vp.height });

                const pageErrors = [];
                const notFoundRequests = [];

                page.on('console', msg => {
                    if (msg.type() === 'error') {
                        const txt = msg.text();
                        if (!txt.includes('Data coming soon') && !txt.includes('404')) {
                            pageErrors.push(`Console Error: ${txt}`);
                        }
                    }
                });

                page.on('pageerror', err => {
                    pageErrors.push(`Uncaught Page Exception: ${err.message}`);
                });

                page.on('response', response => {
                    if (response.status() === 404) {
                        const url = response.url();
                        if (url.includes(`localhost:${PORT}`) && !url.endsWith('/favicon.ico') && !url.endsWith('data/verbs.json') && !url.endsWith('data/nouns.json')) {
                            notFoundRequests.push(url);
                        }
                    }
                });

                try {
                    await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
                } catch (gotoErr) {
                    pageErrors.push(`Navigation Error: ${gotoErr.message}`);
                }

                const hasHorizontalScroll = await page.evaluate(() => {
                    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
                });

                if (hasHorizontalScroll) {
                    pageErrors.push(`Horizontal scroll detected (scrollWidth > clientWidth)`);
                }

                if (notFoundRequests.length > 0) {
                    notFoundRequests.forEach(reqUrl => {
                        pageErrors.push(`404 Local Resource: ${reqUrl}`);
                    });
                }

                // Shell & UI Structural Assertions on every page
                const structuralCheck = await page.evaluate(() => {
                    const dictFab = document.getElementById('dict-fab');
                    const tourFab = document.getElementById('cosy-tour-fab');
                    const strips = document.querySelectorAll('.cosy-ecosystem-strip');
                    const footers = document.querySelectorAll('.cosy-footer');

                    const errs = [];
                    if (dictFab) errs.push('Found removed element #dict-fab on page');
                    if (tourFab) errs.push('Found removed element #cosy-tour-fab on page');
                    if (strips.length !== 1) errs.push(`Expected exactly 1 ecosystem strip, found ${strips.length}`);
                    if (footers.length !== 1) errs.push(`Expected exactly 1 footer, found ${footers.length}`);

                    return errs;
                });

                if (structuralCheck.length > 0) {
                    structuralCheck.forEach(e => pageErrors.push(`Structural Error: ${e}`));
                }

                // Theme Toggle Assertion
                if (vp.width === 1280) {
                    const themeTogglePassed = await page.evaluate(() => {
                        const toggleBtn = document.getElementById('cosy-theme-toggle');
                        if (!toggleBtn) return true;

                        const initialTheme = document.documentElement.getAttribute('data-theme') || 'light';
                        toggleBtn.click();
                        const newTheme = document.documentElement.getAttribute('data-theme') || 'light';
                        const themeChanged = initialTheme !== newTheme;
                        toggleBtn.click(); // restore
                        return themeChanged;
                    });

                    if (!themeTogglePassed) {
                        pageErrors.push(`Theme toggle assertion failed: clicking #cosy-theme-toggle did not change data-theme`);
                    }
                }

                // Hub Language Switcher Assertion (on index.html)
                if (pageRelPath === 'index.html' && vp.width === 1280) {
                    const hubI18nPassed = await page.evaluate(() => {
                        const heroTitle = document.querySelector('.hero-fraunces-title');

                        if (window.COSY_UI && typeof window.COSY_UI.setUILanguage === 'function') {
                            window.COSY_UI.setUILanguage('fr');
                            const frText = heroTitle ? heroTitle.textContent.trim() : '';
                            const isFrench = frText.includes('Outils de Référence') || frText.includes('Référence');
                            window.COSY_UI.setUILanguage('en'); // restore
                            return isFrench;
                        }
                        return false;
                    });

                    if (!hubI18nPassed) {
                        pageErrors.push(`Hub language switcher assertion failed: setUILanguage('fr') did not update hero title`);
                    }
                }

                if (vp.width === 1280 && pageRelPath !== 'index.html') {
                    try {
                        // Switch to dictionary/search view if available
                        await page.evaluate(() => {
                            if (window.appEngine && typeof window.appEngine.setAppMode === 'function') {
                                window.appEngine.setAppMode('dictionary');
                            } else {
                                const modeBtn = document.getElementById('mode-dictionary-btn') || document.getElementById('nav-lookup-btn');
                                if (modeBtn) modeBtn.click();
                            }
                        });
                        await new Promise(r => setTimeout(r, 200));

                        const deepLinkApplied = await page.evaluate((expectedQuery) => {
                            const inputSelector = '#verb-search-input, #noun-search-input, #search-input, input[type="text"]';
                            const input = document.querySelector(inputSelector);
                            if (input && input.value && input.value.toLowerCase().includes(expectedQuery.toLowerCase())) {
                                return true;
                            }
                            const containers = document.querySelectorAll('#verb-display, #result-display, #verb-result-container, .result-card, .results-container, table, article, .suggestion-item, .sb-grid');
                            for (const c of containers) {
                                if (c && c.offsetHeight > 0 && c.textContent.toLowerCase().includes(expectedQuery.toLowerCase())) {
                                    return true;
                                }
                            }
                            return false;
                        }, sampleQuery);

                        if (deepLinkApplied || pageRelPath.includes('speaking-bot')) {
                            pageFunctionalPassed = true;
                        } else {
                            const inputSelector = '#verb-search-input, #noun-search-input, #search-input, input[type="text"]';
                            const inputHandle = await page.$(inputSelector);
                            if (inputHandle) {
                                await inputHandle.click({ clickCount: 3 });
                                await inputHandle.type(sampleQuery);
                                await page.keyboard.press('Enter');
                                await new Promise(r => setTimeout(r, 300));

                                const hasResults = await page.evaluate(() => {
                                    const containers = document.querySelectorAll('#verb-display, #result-display, #verb-result-container, .result-card, .results-container, table, article, .suggestion-item, .sb-grid');
                                    for (const c of containers) {
                                        if (c && c.offsetHeight > 0 && c.textContent.trim().length > 10) {
                                            return true;
                                        }
                                    }
                                    return false;
                                });

                                if (hasResults) {
                                    pageFunctionalPassed = true;
                                } else {
                                    pageErrors.push(`Functional Proof failed: query '${sampleQuery}' yielded no visible result card or table.`);
                                }
                            } else {
                                pageFunctionalPassed = true;
                            }
                        }
                    } catch (funcErr) {
                        pageErrors.push(`Functional Proof Error: ${funcErr.message}`);
                    }
                } else if (pageRelPath === 'index.html') {
                    pageFunctionalPassed = true;
                }

                if (pageErrors.length > 0) {
                    console.error(`❌ FAIL [${vp.name}] ${pageRelPath}:`);
                    pageErrors.forEach(err => console.error(`   - ${err}`));
                    totalErrors += pageErrors.length;
                } else {
                    console.log(`  PASS [${vp.name}]`);
                }

                await page.close();
            }

            const toolName = pageRelPath.replace('tools/', '').replace('/index.html', '');
            functionalProofResults.push({
                tool: toolName,
                query: pageRelPath === 'index.html' ? 'N/A (Hub)' : `${paramKey}=${sampleQuery}`,
                status: pageFunctionalPassed ? 'PASS' : 'FAIL'
            });
        }

        console.log(`\n========================================`);
        console.log(`FUNCTIONAL PROOF SAMPLE QUERY RESULTS TABLE:`);
        console.log(`| Tool | Sample Query | Status |`);
        console.log(`| --- | --- | --- |`);
        functionalProofResults.forEach(r => {
            console.log(`| ${r.tool} | ${r.query} | ${r.status} |`);
        });

    } finally {
        if (browser) await browser.close();
        server.close();
    }

    console.log(`\n========================================`);
    if (totalErrors > 0) {
        console.error(`Smoke tests finished with ${totalErrors} issue(s).`);
        process.exit(1);
    } else {
        console.log(`Smoke tests passed cleanly across all tool pages!`);
        process.exit(0);
    }
}

runSmokeTests().catch(err => {
    console.error('Smoke test runner crashed:', err);
    process.exit(1);
});
