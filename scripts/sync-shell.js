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

function getRelativeIndex(fromFile) {
  const dirDepth = fromFile.split('/').length - 1;
  if (dirDepth === 0) return 'index.html';
  return '../'.repeat(dirDepth) + 'index.html';
}

function getEcosystemStrip(fromFile) {
  const indexLink = getRelativeIndex(fromFile);
  return `<!-- Shared Ecosystem Strip -->
    <div class="cosy-ecosystem-strip" role="navigation" aria-label="COSY Ecosystem Products">
      <div class="cosy-strip-inner">
        <span class="cosy-strip-brand">🌐 COSY Ecosystem:</span>
        <ul class="cosy-strip-links">
          <li><a href="https://cosylanguages.github.io/COSYlanguages/" class="cosy-strip-link">COSYlanguages 🏠</a></li>
          <li><a href="https://cosylanguages.github.io/COSYdata/" target="_blank" rel="noopener" class="cosy-strip-link">COSYdata 📊</a></li>
          <li><a href="${indexLink}" class="cosy-strip-link active">COSYtools 🔎</a></li>
          <li><a href="https://cosylanguages.github.io/COSYgames/" target="_blank" rel="noopener" class="cosy-strip-link">COSYgames 🎮</a></li>
        </ul>
      </div>
    </div>`;
}

function getShellFooter() {
  return `<!-- Shared Shell Footer -->
    <footer class="app-footer cosy-footer">
      <div class="cosy-footer-inner" style="max-width: 1200px; margin: 0 auto; padding: 2rem 1.5rem; text-align: center; color: var(--ink-soft, #666);">
        <p>🌿 <strong>COSYtools</strong> — Language reference tools across 14 languages. 100% client-side &amp; private.</p>
        <p><small>© COSYlanguages. Open language reference tools.</small></p>
      </div>
    </footer>`;
}

const files = getFiles('.');

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');

  // Replace or insert ecosystem strip
  const strip = getEcosystemStrip(f);
  if (content.includes('class="cosy-ecosystem-strip"')) {
    content = content.replace(/<!-- Shared Ecosystem Strip -->[\s\S]*?<\/div>\s*<\/div>/i, strip);
  } else if (content.includes('<body')) {
    content = content.replace(/(<body[^>]*>)/i, `$1\n    ${strip}\n`);
  }

  // Replace or insert shell footer
  const footer = getShellFooter();
  if (content.includes('<footer')) {
    content = content.replace(/<footer[\s\S]*?<\/footer>/i, footer);
  } else if (content.includes('</body>')) {
    content = content.replace('</body>', `    ${footer}\n</body>`);
  }

  fs.writeFileSync(f, content, 'utf8');
});

console.log(`Synced shell strip and footer across ${files.length} HTML files.`);
