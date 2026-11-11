// UI-redesign parity gate: new index.html must behave like baseline f339acc.
// Run from repo root: node docs/specs/check-ui-parity.js   (exit 0 = all pass)
//
// Contract (plan "Arsip Terang"): UI may change, function may not.
//  a) inline <script> identical, except lines listed in docs/specs/ui-parity-allow.md
//  b) every id/class the JS queries still resolves in the new file
//  c) every static control (id, data-*, functional attrs, <option> lists) still exists
//  d) print CSS (@media print, @page), .qcsheet rules, CDN <script src> byte-identical
//  e) check-issue*.js produce the same PASS/FAIL set as on baseline
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

const BASE = process.env.UI_BASE || 'f339acc';
const oldHtml = execSync(`git show ${BASE}:index.html`, { encoding: 'utf8', maxBuffer: 64 << 20 });
const newHtml = fs.readFileSync('index.html', 'utf8');
const allowTxt = fs.existsSync('docs/specs/ui-parity-allow.md') ? fs.readFileSync('docs/specs/ui-parity-allow.md', 'utf8') : '';

let fail = 0;
function check(name, ok, detail) {
  if (!ok) fail++;
  console.log((ok ? 'PASS ' : 'FAIL ') + name + (detail && !ok ? '\n     ' + detail : ''));
}
const norm = s => s.replace(/\r\n/g, '\n');

// ---------- split ----------
function scripts(html) {
  const inline = [], src = [];
  for (const m of norm(html).matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (/\bsrc=/.test(m[1])) src.push(m[0]); else inline.push(m[2]);
  }
  return { inline: inline.join('\n/*--script--*/\n'), src };
}
function markup(html) { // static markup only: strip <script> and <style>
  return norm(html).replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
}
function css(html) { return [...norm(html).matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n').replace(/\/\*[\s\S]*?\*\//g, ''); } // comments stripped: a comment may mention "@media print"

const O = scripts(oldHtml), N = scripts(newHtml);

// ---------- a) inline JS ----------
{
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'uipar-'));
  fs.writeFileSync(path.join(tmp, 'old.js'), O.inline);
  fs.writeFileSync(path.join(tmp, 'new.js'), N.inline);
  const r = spawnSync('git', ['diff', '--no-index', '-U0', '--no-color', path.join(tmp, 'old.js'), path.join(tmp, 'new.js')], { encoding: 'utf8', maxBuffer: 64 << 20 });
  const changed = (r.stdout || '').split('\n').filter(l => /^[+-]/.test(l) && !/^(\+\+\+|---) /.test(l));
  const unlisted = changed.filter(l => !allowTxt.includes(l.slice(1).trim()));
  check('a) inline JS identical (or allowlisted)', unlisted.length === 0,
    unlisted.length + ' unlisted changed line(s):\n     ' + unlisted.slice(0, 15).join('\n     '));
  if (changed.length) console.log('     info: ' + changed.length + ' allowlisted JS line change(s)');
}

// ---------- b) selectors the JS queries ----------
{
  const js = O.inline;
  const ids = new Set(), classes = new Set();
  const selStrings = [
    ...[...js.matchAll(/\$\$?\(\s*(['"`])(.+?)\1\s*\)/g)].map(m => m[2]),
    ...[...js.matchAll(/querySelector(?:All)?\(\s*(['"`])(.+?)\1\s*\)/g)].map(m => m[2]),
    ...[...js.matchAll(/closest\(\s*(['"`])(.+?)\1\s*\)/g)].map(m => m[2]),
  ];
  for (const s of selStrings) {
    for (const m of s.matchAll(/#([A-Za-z][\w-]*)/g)) ids.add(m[1]);
    for (const m of s.matchAll(/\.([A-Za-z][\w-]*)/g)) classes.add(m[1]);
  }
  for (const m of js.matchAll(/getElementById\(\s*['"`]([\w-]+)['"`]\s*\)/g)) ids.add(m[1]);
  const hasId = (html, id) => new RegExp(`id=["']${id}["']|\\.id\\s*=\\s*['"\`]${id}['"\`]`).test(html);
  const hasClass = (mk, c) => new RegExp(`class=["'][^"']*(?<![\\w-])${c}(?![\\w-])`).test(mk);
  const lostIds = [...ids].filter(id => hasId(oldHtml, id) && !hasId(newHtml, id));
  check('b) JS-queried ids still exist (' + ids.size + ')', lostIds.length === 0, lostIds.join(', '));
  const oM = markup(oldHtml), nM = markup(newHtml);
  const lostCls = [...classes].filter(c => hasClass(oM, c) && !hasClass(nM, c));
  check('b) JS-queried classes still in static markup (' + classes.size + ')', lostCls.length === 0, lostCls.join(', '));
}

// ---------- c) static control inventory ----------
function inventory(html) {
  const mk = markup(html);
  const inv = new Map();
  const FUNC = /^(id|type|value|min|max|step|name|for|accept|capture|multiple|checked|selected|disabled|data-[\w-]+)$/;
  for (const m of mk.matchAll(/<(button|input|select|textarea|option|label|a|div|span|section|details|dialog|img|canvas|video|form)\b([^>]*)>/g)) {
    const attrs = {};
    for (const a of m[2].matchAll(/([\w-]+)(?:=("[^"]*"|'[^']*'|[^\s>]+))?/g)) {
      if (FUNC.test(a[1])) attrs[a[1]] = (a[2] || '').replace(/^["']|["']$/g, '');
    }
    const key = attrs.id ? '#' + attrs.id : null;
    if (key) inv.set(key, m[1] + ' ' + JSON.stringify(Object.fromEntries(Object.entries(attrs).sort())));
    // data-* bearing controls without id: record by tag+data signature
    else if (Object.keys(attrs).some(k => k.startsWith('data-')) && /button|input|select|option/.test(m[1])) {
      const sig = m[1] + ' ' + JSON.stringify(Object.fromEntries(Object.entries(attrs).sort()));
      inv.set(sig, sig);
    }
  }
  for (const m of mk.matchAll(/<select\b[^>]*id=["']([\w-]+)["'][^>]*>([\s\S]*?)<\/select>/g)) {
    const opts = [...m[2].matchAll(/<option\b([^>]*)>([^<]*)/g)].map(o => (o[1].match(/value=["']([^"']*)/) || [, o[2].trim()])[1]);
    inv.set('options#' + m[1], opts.join('|'));
  }
  return inv;
}
{
  const oi = inventory(oldHtml), ni = inventory(newHtml);
  const missing = [], changed = [];
  for (const [k, v] of oi) {
    if (!ni.has(k)) missing.push(k + '  ' + v);
    else if (ni.get(k) !== v) changed.push(k + '\n       old ' + v + '\n       new ' + ni.get(k));
  }
  check('c) every static control kept (' + oi.size + ')', missing.length === 0, missing.slice(0, 20).join('\n     '));
  check('c) functional attrs + option lists unchanged', changed.length === 0, changed.slice(0, 10).join('\n     '));
}

// ---------- d) print world + CDN ----------
function blocks(text, startRe) {
  const out = [];
  for (const m of text.matchAll(startRe)) {
    let i = text.indexOf('{', m.index), depth = 0, j = i;
    for (; j < text.length; j++) { if (text[j] === '{') depth++; else if (text[j] === '}' && --depth === 0) break; }
    out.push(text.slice(m.index, j + 1));
  }
  return out.join('\n');
}
{
  const oc = css(oldHtml), nc = css(newHtml);
  check('d) @media print blocks identical', blocks(oc, /@media print/g) === blocks(nc, /@media print/g));
  check('d) @page rules identical', blocks(oc, /@page/g) === blocks(nc, /@page/g));
  const qc = t => [...t.matchAll(/(^|})\s*(\.qcsheet[^{]*\{[^}]*\})/g)].map(m => m[2]).join('\n');
  check('d) .qcsheet rules identical', qc(oc) === qc(nc));
  check('d) CDN <script src> identical', JSON.stringify(O.src) === JSON.stringify(N.src),
    'old ' + O.src.length + ' new ' + N.src.length);
}

// ---------- e) existing spec checks: same result set ----------
{
  const specs = fs.readdirSync('docs/specs').filter(f => /^check-issue.*\.js$/.test(f));
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'uibase-'));
  fs.writeFileSync(path.join(tmp, 'index.html'), oldHtml);
  const run = (cwd, f) => {
    const r = spawnSync(process.execPath, [path.resolve('docs/specs', f)], { cwd, encoding: 'utf8' });
    return (r.stdout || '').split('\n').filter(l => /^(PASS|FAIL)/.test(l)).map(l => l.split(' ').slice(0, 2).join(' ') + ' ' + l.replace(/^(PASS|FAIL) /, '').split(/ (worst-)?delta=| got=/)[0]).sort();
  };
  for (const f of specs) {
    const b = run(tmp, f), n = run(process.cwd(), f);
    const diff = n.filter(l => !b.includes(l));
    check('e) ' + f + ' same as baseline', diff.length === 0 && b.length === n.length, diff.join('\n     '));
  }
}

console.log(fail ? `RED: ${fail} parity check(s) fail` : 'GREEN: UI parity holds');
process.exit(fail ? 1 : 0);
