/**
 * Behavioural test for practice/top-verbs/index.html (runs the real page in jsdom).
 * Covers: accessible option cards, all 14 languages, drill + table sessions,
 * focus handling, live regions, deep links and the data-load error path.
 */
const http=require('http'),fs=require('fs'),path=require('path');
const {JSDOM,VirtualConsole}=require('jsdom');
const root=path.join(__dirname,'..');
const srv=http.createServer((q,r)=>{let f=path.join(root,decodeURIComponent(q.url.split('?')[0]));if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){r.statusCode=404;return r.end();}
 const ext=path.extname(f);r.setHeader('content-type',{'.html':'text/html','.js':'text/javascript','.json':'application/json','.css':'text/css'}[ext]||'application/octet-stream');r.end(fs.readFileSync(f));}).listen(0);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let fails=0; const ok=(c,m)=>{if(!c){fails++;console.log('FAIL',m);}else console.log('ok  ',m);};
async function load(query){
  const errs=[]; const vc=new VirtualConsole(); vc.on('jsdomError',e=>errs.push(e.message)); vc.on('error',e=>errs.push(String(e)));
  const dom=await JSDOM.fromURL(`http://localhost:${srv.address().port}/practice/top-verbs/index.html`+(query||''),{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true,virtualConsole:vc,
   beforeParse(w){w.navigator.clipboard={writeText:()=>Promise.resolve()};w.fetch=(u)=>fetch(new URL(u,w.location.href).href);}});
  await sleep(1200); return {dom,w:dom.window,d:dom.window.document,errs};
}
(async()=>{
 let {w,d,errs}=await load();
 ok(errs.length===0,'no script errors on load '+errs.join('|'));
 const cards=[...d.querySelectorAll('.person-radio-card')];
 ok(cards.length===12 && cards.every(c=>c.tagName==='BUTTON'),'12 option cards are <button>');
 ok(cards.every(c=>c.hasAttribute('aria-pressed')),'all cards have aria-pressed');
 d.getElementById('polarity-card-negative').click();
 ok(d.getElementById('polarity-card-negative').getAttribute('aria-pressed')==='true' && d.getElementById('polarity-card-positive').getAttribute('aria-pressed')==='false','pressed state toggles');
 ok(d.querySelectorAll('.verb-cb').length>=11,'verb checklist rendered: '+d.querySelectorAll('.verb-cb').length);
 ok(d.getElementById('share-toast').getAttribute('role')==='status','toast is a status live region');
 // every language: switch and check
 const langs=[...d.querySelectorAll('.lang-pill')].map(b=>b.id.replace('lang-pill-',''));
 ok(langs.length===14,'14 language pills: '+langs.join(','));
 for(const l of langs){
   d.getElementById('lang-pill-'+l).click(); await sleep(350);
   const pressed=d.querySelectorAll('.lang-pill[aria-pressed="true"]');
   const n=d.querySelectorAll('.verb-cb').length;
   const mag=d.getElementById('magazine-article-link').href;
   if(pressed.length!==1||pressed[0].id!=='lang-pill-'+l||n<11||!mag.endsWith('-'+l+'.html')||d.documentElement.lang!==l) {fails++;console.log('FAIL lang',l,pressed.length,n,mag,d.documentElement.lang);}
 }
 console.log('language switching checked for all 14');
 // every language must have complete UI + practice strings (no English fallback)
 const missing=JSON.parse(w.eval(`JSON.stringify(Object.keys(MONOLINGUAL_UI).flatMap(l=>{const base=Object.keys(EXTRA_UI.en);const own=EXTRA_UI[l]||{};const ui=Object.keys(MONOLINGUAL_UI.en).filter(k=>!MONOLINGUAL_UI[l][k]).map(k=>l+':ui.'+k);return base.filter(k=>!own[k]).map(k=>l+':'+k).concat(ui);}))`));
 ok(missing.length===0,'all 14 languages have complete UI and practice strings '+missing.slice(0,5).join(','));
 for(const l of langs){
   d.getElementById('lang-pill-'+l).click(); await sleep(250);
   d.getElementById('btn-launch').click(); await sleep(80);
   const html=d.getElementById('practice-card-content').innerHTML;
   const hasEnglish=l!=='en' && (/lang="en"/.test(html) || /Question \d+ of|Perfect!|Expected:/.test(html));
   if(hasEnglish||!d.getElementById('drill-single-input')){fails++;console.log('FAIL drill strings for',l);}
   w.showSetupCard();
 }
 console.log('drill strings checked for all 14 languages');
 // breadcrumb + media section follow the language (no English left on the page)
 d.getElementById('lang-pill-ka').click(); await sleep(250);
 ok(d.getElementById('media-title-text').textContent==='საკითხავი და ვიდეო სიები' && !d.getElementById('media-title-text').hasAttribute('lang'),'ka: media section is translated');
 ok(/ახალ ჩანართში/.test(d.querySelector('.newtab-hint').textContent),'ka: new-tab hint is translated');
 ok(d.getElementById('header-subtitle').textContent==='10 ძირითადი ზმნა','ka: breadcrumb is translated');
 d.getElementById('lang-pill-en').click(); await sleep(250);
 ok(errs.length===0,'no script errors after switching languages '+errs.slice(0,2).join('|'));
 // French question description, Georgian toast text, German label
 d.getElementById('lang-pill-fr').click(); await sleep(300);
 ok(/je/.test(d.getElementById('pol-desc-question').textContent),'FR keeps "je" note');
 d.getElementById('lang-pill-de').click(); await sleep(300);
 ok(!/je/.test(d.getElementById('pol-desc-question').textContent) && /Einzelform/.test(d.getElementById('lbl-mode-drill').textContent),'DE: no "je", fixed label');
 // full drill in fr
 d.getElementById('lang-pill-fr').click(); await sleep(300);
 d.getElementById('btn-launch').click(); await sleep(100);
 const inp=d.getElementById('drill-single-input');
 ok(!!inp && !!d.querySelector('label[for="drill-single-input"]'),'drill input has a label');
 ok(d.activeElement===inp,'input is focused');
 inp.value='zzz'; w.checkSingleDrillAnswer();
 ok(d.getElementById('single-drill-feedback').getAttribute('role')==='status','feedback is live region');
 ok(d.activeElement===d.getElementById('single-drill-next-btn'),'focus moves to Continue');
 const total=w.eval('drillQueue').length;
 for(let i=0;i<total;i++){ if(d.getElementById('single-drill-next-btn')){ if(d.getElementById('drill-single-input')&&!d.getElementById('drill-single-input').disabled){d.getElementById('drill-single-input').value=w.eval('drillQueue')[w.eval('drillIdx')].expected;w.checkSingleDrillAnswer();} w.nextSingleDrillItem(); } }
 ok(/%/.test(d.getElementById('practice-card-content').textContent) && !/NaN/.test(d.getElementById('practice-card-content').textContent),'session finishes with score, no NaN');
 // table mode
 d.querySelector('[onclick="showSetupCard()"]').click();
 d.getElementById('mode-card-table').click(); d.getElementById('btn-launch').click(); await sleep(300);
 ok(d.getElementById('practice-card-content').innerHTML.length>200,'table mode renders');
 const firstConj=d.querySelector('.conj-input');
 ok(!!firstConj && d.activeElement===firstConj,'table mode: first form input is focused');
 ok(d.querySelectorAll('.conj-input').length>0 && [...d.querySelectorAll('.conj-input')].every(i=>d.querySelector('label[for="'+i.id+'"]')),'table mode: every input has a label');
 ok(d.getElementById('practice-feedback-box').getAttribute('role')==='status','table mode: feedback box is a live region');
 w.eval('appEngine.practice.checkConjugateAnswer()');
 ok(d.activeElement===d.getElementById('practice-next-btn'),'table mode: focus moves to Continue after checking');
 ok(/Incorrect|Correct/.test(d.querySelector('.conj-feedback-text').textContent),'table mode: row feedback has text for screen readers');
 ok(w.eval(`cosyEsc("l'a\\"b")`)==="l&#39;a&quot;b",'engine escapes quotes/apostrophes in generated attributes');
 // none selected
 w.showSetupCard(); w.selectAllVerbs(false); d.getElementById('btn-launch').click(); await sleep(100);
 ok(!d.getElementById('setup-message').hidden && d.getElementById('setup-message').textContent.length>0,'no verb selected -> inline message (no alert)');
 ok(errs.length===0,'no script errors after full session '+errs.slice(0,2).join('|'));
 // deep link
 let r2=await load('?lang=ru&persons=plural&polarity=negative&target=pronoun&mode=drill&verbs=all&start=true');
 ok(r2.d.getElementById('practice-card').style.display==='block' && !!r2.d.getElementById('drill-single-input'),'deep link auto-starts');
 ok(r2.d.getElementById('magazine-article-link').href.endsWith('-ru.html'),'deep link sets magazine link');
 // data load failure
 let r3=await load('?lang=en'); 
 r3.w.fetch=()=>Promise.resolve({ok:false,status:404}); r3.w.loadLanguageData('en'); await sleep(300);
 ok(!r3.d.getElementById('setup-message').hidden,'fetch failure shows visible error');
 console.log(fails?('FAILURES: '+fails):'ALL BEHAVIOUR CHECKS PASSED'); srv.close(); process.exit(fails?1:0);
})();
