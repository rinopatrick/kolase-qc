// Issue 05 RED/GREEN — P2P + offline verify.
// Run: node docs/specs/check-issue05-p2p.js   (exit 0 = all pass)
//
// Data shape (principle-model-the-domain): every photo ends as a slot with
// {img, pid, zoom, rot, px, py, broken}. Export reads showImgOf(s) only,
// so source (local file vs P2P blob URL) cannot change geometry.

const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

let fail = 0;
function check(name, ok, detail) {
  if (!ok) fail++;
  console.log((ok ? 'PASS' : 'FAIL') + ' ' + name + (detail ? ' ' + detail : ''));
}

// Slice 1: P2P photos get identical slot defaults as local photos.
const hostFn = html.slice(html.indexOf('async function hostApplyPhoto'),
  html.indexOf('async function hostApplyPhoto') + 900);
check('P2P photo sets zoom=1', hostFn.includes('zoom=1'), 'same default as local intake');
check('P2P photo sets rot=0', hostFn.includes('rot=0'), 'no rotation bias');
check('P2P photo sets px=py=0', hostFn.includes('px=0') && hostFn.includes('py=0'), 'no pan bias');
check('P2P photo persists to IDB', hostFn.includes('persistSlotImg'), 'same IDB path as local');
check('P2P photo clears broken flag', hostFn.includes('broken=false'), 'eligible for export');

// Slice 2: export reads one source function regardless of photo origin.
const pdfSrc = html.slice(html.indexOf('async function doPDF'), html.indexOf('function flatIndex'));
check('export draws via drawCover', pdfSrc.includes('drawCover(ctx,c.s,'), 'single geometry path');
const drawSrc = html.slice(html.indexOf('async function drawCover'), html.indexOf('async function drawCover') + 700);
check('drawCover resolves via showImgOf', drawSrc.includes('showImgOf(s)'), 'source-agnostic resolve');
check('drawCover applies slot pan/zoom/rot', drawSrc.includes('(s.px||0)') && drawSrc.includes('s.zoom||1') && drawSrc.includes('(s.rot||0)'),
  'geometry from slot fields, not from intake path');

// Slice 3: IDB refs resolve before draw (boot hydration + runtime _url).
check('boot hydrates idb refs to blob URLs', html.includes("slot._url=URL.createObjectURL(b)"),
  'idb:xxx becomes renderable URL at boot');
check('showImgOf prefers live blob URL', html.includes('if(slot._url)return slot._url'),
  'export sees hydrated blob, never raw idb: string');
check('drawCover skips unresolvable source', drawSrc.includes('if(!src)return'),
  'missing blob degrades to empty, no crash');

// Slice 4: export needs no network (jsPDF loaded via script tag, no fetch at export).
check('jsPDF via static script tag', html.includes('cdnjs.cloudflare.com/ajax/libs/jspdf/'),
  'cached by browser after first load');
check('export does not fetch jsPDF', !/fetch\s*\([^)]*jspdf/i.test(pdfSrc) && !/loadScriptOnce\s*\([^)]*jspdf/i.test(pdfSrc),
  'no CDN fetch inside doPDF');
check('export guards missing lib with toast', pdfSrc.includes('window.jspdf') && pdfSrc.includes('sambungkan internet sekali'),
  'offline-without-cache fails loudly, not silently');
const imgEnd = html.slice(html.indexOf("d.t==='img-end'"), html.indexOf("d.t==='img-end'") + 700);
check('P2P uses blob URLs not server round-trip', imgEnd.includes('URL.createObjectURL(blob)'),
  'photo bytes reassembled locally from chunks');

// Slice 5: offline fallback path exists (file import/export without P2P network).
check('file import fallback exists', html.includes("lkImportBtn") && html.includes('Import file'),
  'HP->laptop via file when P2P unreachable');
check('file export fallback exists', html.includes("gExport") || html.includes('Unduh file'),
  'HP can export file when offline');

console.log(fail ? `RED: ${fail} issue-05 case(s) fail` : 'GREEN: P2P + offline holds');
process.exit(fail ? 1 : 0);
