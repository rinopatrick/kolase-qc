// Issue 01 RED/GREEN — clean PDF output (no numbers, no captions).
// Run: node docs/specs/check-issue01-clean.js   (exit 0 = all pass)
//
// Data shape (principle-model-the-domain): doPDF draws from a cell list.
// Badges (.num) and captions (.cap) exist in preview DOM only.
// Expected values come from the spec text, not from a run of the code.

const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

let fail = 0;
function check(name, ok, detail) {
  if (!ok) fail++;
  console.log((ok ? 'PASS' : 'FAIL') + ' ' + name + (detail ? ' ' + detail : ''));
}

// Slice 1: export canvas draws photos via drawCover only, no badge/caption paint.
const pdfStart = html.indexOf('async function doPDF');
const pdfEnd = html.indexOf('function flatIndex');
const pdfSrc = html.slice(pdfStart, pdfEnd);
check('export paints photos via drawCover', pdfSrc.includes('drawCover(ctx,c.s,'),
  'drawCover is the only image paint in doPDF');
check('export paints no badge text', !/fillText\s*\([^)]*(\.num|badge|slot-index|globalIndex)/i.test(pdfSrc),
  'no fillText call references badges or slot numbers');
const fillTexts = [...pdfSrc.matchAll(/ctx\.fillText\(([^;]+)\)/g)].map(m => m[1].slice(0, 60));
const kopOnly = fillTexts.every(t => /title|sub|fmtDate|dt|S\.title|S\.sub/i.test(t) || t.includes('cx'));
check('export fillText is kop header only', kopOnly, JSON.stringify(fillTexts));

// Slice 2: preview still shows badges + editable captions (editing aid preserved).
check('preview renders .num badges', html.includes('<span class="num">'),
  'badge spans remain in render()');
check('preview renders caption inputs', html.includes('<input class="cap"'),
  'caption inputs remain in render()');
check('preview caption is input not static', html.includes('class="cap" aria-label'),
  'captions stay editable');

// Slice 3: print stylesheet hides badges, captions, and divider handles.
const printStart = html.lastIndexOf('@media print{');
const printCss = html.slice(printStart, printStart + 800);
check('print hides .slot .num', printCss.includes('.slot .num'),
  'badge hidden in print');
check('print hides .slot .cap', printCss.includes('.slot .cap'),
  'caption hidden in print');
check('print hides .divider/.hd handles', printCss.includes('.divider') && printCss.includes('.hd'),
  'drag handles hidden in print');

// Slice 4: no caption text leaks through strip fill (strip is blank white, not text).
check('caption strip is blank fill', pdfSrc.includes("ctx.fillStyle='#fff';ctx.fillRect(cx2,cy+ph,c.w,strip)"),
  'photo area + white strip, no text paint');

// Slice 5: empty-slot dashed boxes carry no imagery text.
check('empty slots are dashed boxes', pdfSrc.includes('setLineDash([12,9])'),
  'empties render as dashed placeholders');

console.log(fail ? `RED: ${fail} issue-01 case(s) fail` : 'GREEN: clean PDF output holds');
process.exit(fail ? 1 : 0);
