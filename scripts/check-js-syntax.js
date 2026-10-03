const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function findJsFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                results = results.concat(findJsFiles(filePath));
            }
        } else if (filePath.endsWith('.js')) {
            results.push(filePath);
        }
    });
    return results;
}

const jsFiles = findJsFiles('.');
let failures = 0;

console.log(`Checking syntax on ${jsFiles.length} JavaScript files...`);

jsFiles.forEach(file => {
    const res = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
    if (res.status !== 0) {
        console.error(`Syntax error in ${file}:\n${res.stderr}`);
        failures++;
    }
});

if (failures > 0) {
    console.error(`JS syntax check failed with ${failures} error(s).`);
    process.exit(1);
} else {
    console.log(`All ${jsFiles.length} JS files passed syntax check.`);
    process.exit(0);
}
