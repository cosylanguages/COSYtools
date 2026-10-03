const fs = require('fs');
const path = require('path');
const vm = require('vm');

function findHtmlFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                results = results.concat(findHtmlFiles(filePath));
            }
        } else if (filePath.endsWith('.html')) {
            results.push(filePath);
        }
    });
    return results;
}

const htmlFiles = findHtmlFiles('.');
let totalBlocks = 0;
let failures = 0;

console.log(`Checking inline JavaScript in ${htmlFiles.length} HTML files...`);

htmlFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const scriptRegex = /<script\b(?![^>]*\bsrc\s*=)[^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    let blockIndex = 0;
    while ((match = scriptRegex.exec(content)) !== null) {
        const code = match[1];
        if (!code.trim()) continue;

        totalBlocks++;
        blockIndex++;

        try {
            new vm.Script(code, { filename: `${file}#inline-script-${blockIndex}` });
        } catch (err) {
            console.error(`Syntax error in inline script #${blockIndex} of ${file}:\n${err.stack}`);
            failures++;
        }
    }
});

if (failures > 0) {
    console.error(`Inline JS check failed with ${failures} error(s) across ${totalBlocks} block(s).`);
    process.exit(1);
} else {
    console.log(`All ${totalBlocks} inline script blocks in ${htmlFiles.length} HTML files passed syntax check.`);
    process.exit(0);
}
