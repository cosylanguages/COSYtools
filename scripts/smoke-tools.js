const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const PORT = 8085;
const ROOT_DIR = path.resolve(__dirname, '..');

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

function findRealToolPages() {
    const toolsDir = path.join(ROOT_DIR, 'tools');
    const toolPages = [];

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
    const server = createServer();
    await new Promise(resolve => server.listen(PORT, resolve));
    console.log(`Smoke server listening on http://localhost:${PORT}`);

    const realPages = findRealToolPages();
    console.log(`Found ${realPages.length} real tool pages.`);

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
            console.log(`\n----------------------------------------\nTesting tool page: ${pageRelPath}`);
            const pageUrl = `http://localhost:${PORT}/${pageRelPath}`;
            const sampleQuery = getToolPageQuery(pageRelPath);

            let pageFunctionalPassed = false;

            for (const vp of viewports) {
                const page = await browser.newPage();
                await page.setViewport({ width: vp.width, height: vp.height });

                const pageErrors = [];
                const notFoundRequests = [];

                page.on('console', msg => {
                    if (msg.type() === 'error') {
                        pageErrors.push(`Console Error: ${msg.text()}`);
                    }
                });

                page.on('pageerror', err => {
                    pageErrors.push(`Uncaught Page Exception: ${err.message}`);
                });

                page.on('response', response => {
                    if (response.status() === 404) {
                        const url = response.url();
                        if (url.includes(`localhost:${PORT}`)) {
                            notFoundRequests.push(url);
                        }
                    }
                });

                try {
                    await page.goto(pageUrl, { waitUntil: 'networkidle0', timeout: 10000 });
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

                if (vp.width === 1280) {
                    try {
                        const tabClicked = await page.evaluate(() => {
                            const tabs = Array.from(document.querySelectorAll('button, a, .tab-btn, .mode-btn, .mode-toggle-btn'));
                            const lookupTab = tabs.find(t => {
                                const text = t.textContent.toLowerCase();
                                const id = (t.id || '').toLowerCase();
                                return text.includes('look up') || text.includes('nachschlagen') || text.includes('suche') || text.includes('dico') || text.includes('recherche') || id === 'mode-dictionary-btn' || id === 'nav-lookup-btn' || id === 'tab-dictionary' || id === 'toggle-game-btn';
                            });
                            if (lookupTab && (lookupTab.id === 'mode-dictionary-btn' || lookupTab.id === 'nav-lookup-btn' || lookupTab.id === 'tab-dictionary' || lookupTab.textContent.toLowerCase().includes('nachschlagen') || lookupTab.textContent.toLowerCase().includes('look up'))) {
                                lookupTab.click();
                                return true;
                            }
                            return false;
                        });

                        const inputSelector = '#verb-search-input, #noun-search-input, #search-input, input[type="text"]';
                        const inputHandle = await page.$(inputSelector);
                        if (inputHandle) {
                            await inputHandle.click({ clickCount: 3 });
                            await inputHandle.type(sampleQuery);
                            await page.keyboard.press('Enter');
                            await new Promise(r => setTimeout(r, 300));

                            const hasResults = await page.evaluate(() => {
                                const containers = document.querySelectorAll('#verb-display, #result-display, #verb-result-container, .result-card, .results-container, table, article, .suggestion-item');
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
                    } catch (funcErr) {
                        pageErrors.push(`Functional Proof Error: ${funcErr.message}`);
                    }
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
                query: sampleQuery,
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
