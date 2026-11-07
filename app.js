/* Symbolic Society — logica condivisa tra la versione italiana e quella inglese.
   Testi e percorsi arrivano da window.SITE (definito in index.html e en/index.html). */
const S = window.SITE, T = S.t;
const $ = s => document.querySelector(s);
const RINCARO = 0.15;      // aumento di prezzo per ogni esemplare venduto (0 = prezzo fisso)
const MAX_EDIZIONI = 5;
const ROM = ['I','II','III','IV'];
const eur = n => S.lang === 'en' ? '€' + n : n + ' €';   // 29 € in italiano, €29 in inglese
const LIV = S.levels;

/* ---------- Dimostrazione: la serie Fire Fears come scala di astrazione ---------- */
const frame = $('#frame'), lvl = $('#level');
frame.innerHTML = LIV.map(l => `<img src="${S.base}img/${l.code}.jpg" alt="${T.demoAlt(l.code)}">`).join('');
$('#steps').innerHTML = LIV.map((l,i) => `<span>${l.nome}</span>`).join('');
function setLevel(i){
  const L = LIV[i];
  frame.querySelectorAll('img').forEach((im,k) => im.classList.toggle('on', k === i));
  $('#lvlPrice').textContent = eur(L.prezzo);
  $('#lvlDesc').textContent = L.cosa;
  $('#demoCap').textContent = T.demoCap(L.code, ROM[i]);
  document.querySelectorAll('#steps span').forEach((s,k) => s.classList.toggle('cur', k === i));
}
lvl.addEventListener('input', () => setLevel(+lvl.value));
setLevel(0);

/* tabella prezzi e selettore del livello nel modulo */
$('#tbl').innerHTML = LIV.map((l,i) => `<tr><td><strong>${ROM[i]}. ${l.nome}</strong></td><td>${l.cosa}</td><td class="pr">${eur(l.prezzo)}</td></tr>`).join('');
$('#livelloSel').innerHTML = LIV.map((l,i) => `<option value="${l.nome}">${ROM[i]}. ${l.nome} (${eur(l.prezzo)})</option>`).join('') + `<option value="${T.dontKnow}">${T.dontKnow}</option>`;
$('#heroCta').addEventListener('click', () => { $('#livelloSel').selectedIndex = +lvl.value; });
document.querySelectorAll('[data-pet]').forEach(a => a.addEventListener('click', () => { $('#soggetto').value = T.petValue; }));

/* ---------- Catalogo ---------- */
let OPERE = [];
const prezzoCorrente = o => o.regime === 'unica' ? o.prezzo : Math.round(o.prezzo * (1 + RINCARO * o.vendute));
const esaurita = o => o.regime === 'unica' ? !!o.venduta : o.vendute >= MAX_EDIZIONI;
const hasPrice = o => o.prezzo > 0;
function esc(s){ return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
function sfondo(cod){
  let h = 0; for (const c of cod) h = (h * 31 + c.charCodeAt(0)) % 360;
  return `radial-gradient(circle at 30% 25%, hsl(${h} 38% 72%), transparent 60%), radial-gradient(circle at 75% 80%, hsl(${(h+70)%360} 30% 38%), transparent 65%), hsl(${(h+30)%360} 18% 82%)`;
}
function card(o){
  const fin = esaurita(o);
  const ed = Math.min(o.vendute + 1, MAX_EDIZIONI);
  const badge = o.regime === 'unica'
    ? `<span class="badge unica">${T.unique}</span>`
    : `<span class="badge ${fin ? 'fin' : 'tir'}">${fin ? T.soldOut : `${T.edition} ${ed}/${MAX_EDIZIONI}`}</span>`;
  const price = fin ? '' : (hasPrice(o) ? eur(prezzoCorrente(o)) : `<span class="small">${T.onRequest}</span>`);
  const btn = fin ? `<button class="btn ghost" disabled>${T.unavailable}</button>` : `<button class="btn ghost" data-cod="${esc(o.codice)}">${T.request}</button>`;
  const ig = o.ig ? `<div class="ig"><a href="${esc(o.ig)}" rel="noopener">${T.igPost}</a></div>` : '';
  const tech = (T.tech && T.tech[o.tecnica]) || o.tecnica;
  return `<article class="work" id="${esc(o.codice)}">
    <div class="img" style="background:${sfondo(o.codice)}"><img src="${S.base}${esc(o.immagine || '')}" alt="${esc(o.titolo)}" loading="lazy" onerror="this.remove()"></div>
    <div class="code">${esc(o.codice)}</div>
    <h3>${esc(o.titolo)}</h3>
    <div class="meta">${esc(o.serie)}, ${esc(o.anno)}. ${esc(tech)}</div>
    <div class="row">${badge}<span class="p">${price}</span></div>
    <div class="row" style="margin-top:12px">${btn}</div>${ig}
  </article>`;
}
function render(){
  const q = $('#q').value.trim().toLowerCase(), s = $('#fSerie').value, r = $('#fRegime').value;
  const list = OPERE.filter(o => {
    if (s && o.serie !== s) return false;
    if (r === 'unica' && o.regime !== 'unica') return false;
    if (r === 'tiratura' && o.regime !== 'tiratura') return false;
    if (r === 'disp' && esaurita(o)) return false;
    return !q || (o.codice + ' ' + o.titolo + ' ' + o.serie).toLowerCase().includes(q);
  });
  $('#grid').innerHTML = list.map(card).join('');
  $('#empty').hidden = list.length > 0;
}
function apriOpera(cod){
  const o = OPERE.find(x => x.codice.toLowerCase() === cod.toLowerCase());
  if (!o || esaurita(o)) return false;
  $('#opCod').value = o.codice;
  $('#dlgTitle').textContent = T.dlgTitle(o.codice);
  $('#dlgSub').textContent = T.dlgSub(o.titolo, o.regime === 'unica', Math.min(o.vendute + 1, MAX_EDIZIONI), MAX_EDIZIONI, hasPrice(o) ? eur(prezzoCorrente(o)) : null);
  $('#fOp .ok').style.display = 'none'; $('#fOp .err').style.display = 'none';
  $('#dlg').showModal();
  return true;
}
$('#grid').addEventListener('click', e => { const b = e.target.closest('button[data-cod]'); if (b) apriOpera(b.dataset.cod); });
$('#dlgClose').addEventListener('click', () => $('#dlg').close());
['q','fSerie','fRegime'].forEach(id => $('#' + id).addEventListener('input', render));

fetch(S.base + 'catalogo.json').then(r => { if (!r.ok) throw 0; return r.json(); }).catch(() => []).then(data => {
  OPERE = data.filter(o => o.pubblico !== false);   // le opere con diritti da verificare restano fuori dal sito
  const serie = [...new Set(OPERE.map(o => o.serie))].sort();
  $('#fSerie').innerHTML += serie.map(s => `<option>${esc(s)}</option>`).join('');
  render();
  /* collegamento da Instagram: /#SS-0147  oppure  ?o=SS-0147 */
  const cod = new URLSearchParams(location.search).get('o') || decodeURIComponent(location.hash.slice(1));
  if (/^(SS|PR|PT)-\d+/i.test(cod)) {
    const el = document.getElementById(cod.toUpperCase());
    if (el) { el.scrollIntoView(); apriOpera(cod); }
  }
});

/* ---------- Invio moduli (Netlify Forms) ---------- */
document.querySelectorAll('form[data-netlify]:not(#galForm)').forEach(f => {
  f.addEventListener('submit', async e => {
    e.preventDefault();
    const ok = f.querySelector('.ok'), err = f.querySelector('.err'), btn = f.querySelector('button[type=submit]');
    ok.style.display = 'none'; err.style.display = 'none'; btn.disabled = true;
    try {
      const r = await fetch('/', { method: 'POST', body: new FormData(f) });
      if (!r.ok) throw new Error(r.status);
      ok.style.display = 'block'; f.reset();
    } catch (_) { err.style.display = 'block'; }
    btn.disabled = false;
  });
});

/* ---------- Galleria: foto e video in numero variabile ---------- */
(function(){
  const form = $('#galForm'); if (!form) return;
  const G = T.gal, MAX_INLINE = 7 * 1024 * 1024;   // sotto questo peso i file partono con il modulo (limite di Netlify Forms: 8 MB)
  const drop = $('#galDrop'), input = $('#galInput'), list = $('#galList');
  const fmtN = n => n.toLocaleString(S.lang === 'en' ? 'en-GB' : 'it-IT');
  const mb = b => (b / 1048576).toFixed(b < 10485760 ? 1 : 0);
  let files = [];   // { file, kind, url }

  $('#galLevel').innerHTML = LIV.map((l,i) => `<option value="${l.nome}">${ROM[i]}. ${l.nome} (${eur(l.prezzo)})</option>`).join('') + `<option value="${T.dontKnow}">${T.dontKnow}</option>`;
  $('#galLevel').addEventListener('input', refresh);

  const kindOf = f => f.type.startsWith('video/') || /\.(mp4|mov|m4v|avi|mkv|webm)$/i.test(f.name) ? 'video'
                    : (f.type.startsWith('image/') || /\.(jpe?g|png|webp|heic|heif|tiff?|gif)$/i.test(f.name) ? 'img' : null);

  function add(fileList){
    for (const f of fileList){
      const kind = kindOf(f); if (!kind) continue;
      if (files.some(x => x.file.name === f.name && x.file.size === f.size && x.file.lastModified === f.lastModified)) continue;
      files.push({ file: f, kind, url: kind === 'img' && files.length < 80 ? URL.createObjectURL(f) : '' });
    }
    refresh();
  }
  function remove(i){ if (files[i].url) URL.revokeObjectURL(files[i].url); files.splice(i,1); refresh(); }

  function refresh(){
    const nf = files.filter(x => x.kind === 'img').length, nv = files.length - nf;
    const total = files.reduce((a,x) => a + x.file.size, 0);
    const parts = [];
    if (nf) parts.push((nf === 1 ? G.photo1 : G.photoN).replace('{n}', fmtN(nf)));
    if (nv) parts.push((nv === 1 ? G.video1 : G.videoN).replace('{n}', fmtN(nv)));
    $('#galCount').textContent = files.length ? parts.join(', ') + ', ' + mb(total) + ' MB' + (files.length > 300 ? '. ' + G.many : '') : G.none;
    list.innerHTML = files.map((x,i) => `<li><span class="th">${x.url ? `<img src="${x.url}" alt="">` : (x.kind === 'video' ? G.videoTag : 'IMG')}</span><span class="nm" title="${esc(x.file.name)}">${esc(x.file.name)}</span><span class="sz">${mb(x.file.size)} MB</span><button type="button" data-i="${i}" aria-label="${G.remove} ${esc(x.file.name)}">${G.remove}</button></li>`).join('');
    // stima indicativa: solo foto, prezzo del livello scelto, sconto del 15% da cinque foto
    const L = LIV.find(l => l.nome === $('#galLevel').value);
    let est = '';
    if (L && nf) {
      const disc = nf >= 5, amount = Math.round(nf * L.prezzo * (disc ? 0.85 : 1));
      est = G.est.replace('{amount}', eur(fmtN(amount))).replace('{disc}', disc ? G.disc : '') + (nf > 50 ? G.bulk : '');
    }
    $('#galEstimate').textContent = est;
    $('#galNF').value = nf; $('#galNV').value = nv; $('#galMB').value = mb(total);
  }
  list.addEventListener('click', e => { const b = e.target.closest('button[data-i]'); if (b) remove(+b.dataset.i); });
  input.addEventListener('change', () => { add(input.files); input.value = ''; });
  ['dragenter','dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('over'); }));
  ['dragleave','drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('over'); }));
  drop.addEventListener('drop', e => add(e.dataTransfer.files));
  refresh();

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const ok = form.querySelector('.ok'), err = form.querySelector('.err'), btn = form.querySelector('button[type=submit]');
    ok.style.display = 'none'; err.style.display = 'none';
    const link = form.elements['link'].value.trim();
    if (!files.length && !link) { err.textContent = G.need; err.style.display = 'block'; return; }
    btn.disabled = true;
    const total = files.reduce((a,x) => a + x.file.size, 0);
    const inline = files.length > 0 && total <= MAX_INLINE;
    const fd = new FormData(form); fd.delete('file');
    fd.set('riepilogo', files.map((x,i) => `${i+1}. ${x.file.name} (${x.file.type || '?'}, ${mb(x.file.size)} MB)`).join('\n'));
    fd.set('invio_file', inline ? 'file inclusi' : 'solo elenco');
    if (inline) files.forEach(x => fd.append('file', x.file, x.file.name));
    try {
      const r = await fetch('/', { method: 'POST', body: fd });
      if (!r.ok) throw new Error(r.status);
      ok.textContent = inline ? G.okFiles : (link ? G.okLink : G.okList);
      ok.style.display = 'block';
      files.forEach(x => x.url && URL.revokeObjectURL(x.url)); files = [];
      form.reset(); refresh();
    } catch (_) { err.textContent = G.err; err.style.display = 'block'; }
    btn.disabled = false;
  });
})();
