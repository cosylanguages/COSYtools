const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  let res = [];
  const list = fs.readdirSync(dir);
  for (const f of list) {
    if (f === 'node_modules' || f === '.git') continue;
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) res = res.concat(getFiles(full));
    else if (f.endsWith('.html')) res.push(full);
  }
  return res;
}

const files = getFiles('.');
let errors = 0;

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  if (!content.includes('class="cosy-ecosystem-strip"')) {
    console.error(`[FAIL] ${f}: Missing ecosystem strip`);
    errors++;
  }
  if (!content.includes('<footer')) {
    console.error(`[FAIL] ${f}: Missing shell footer`);
    errors++;
  }
});

if (errors > 0) {
  console.error(`\nCheck shell failed: ${errors} error(s) found.`);
  process.exit(1);
} else {
  console.log(`\nCheck shell passed: All ${files.length} HTML files contain shell strip and footer.`);
}
