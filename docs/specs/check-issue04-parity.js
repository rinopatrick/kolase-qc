// Issue 04 RED/GREEN — divider + overlay + orientation parity, DOM-less fallback path.
// Run: node docs/specs/check-issue04-parity.js   (exit 0 = all within tolerance)
//
// Data shape (principle-model-the-domain): cells are grid fractions {x,y,w,h,ovl}.
// The harness extracts measureCells from index.html and calls it with gridEl=null,
// the fallback under test. Preview truth comes from render(): each row uses
// rowFrOf(ri) fractions, rows stack vertically by divsOf(p).rows fractions.

const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

function buildHarness() {
  const start = html.indexOf('function measureCells(');
  if (start < 0) throw new Error('measureCells not found');
  let depth = 0, i = html.indexOf('{', start);
  for (; i < html.length; i++) {
    if (html[i] === '{') depth++;
    else if (html[i] === '}') { depth--; if (!depth) break; }
  }
  const fnSrc = html.slice(start, i + 1);
  const factory = new Function('stubs', `
    const document = stubs.document;
    function gridShape(p){const n=p.slots.length,pat=p.pattern;
      const cg=String(pat||'').match(/^(\\d+)x(\\d+)$/);if(cg)return[Math.min(6,Math.max(1,+cg[1])),Math.min(6,Math.max(1,+cg[2]))];
      if(pat==='2H'||(n===2&&stubs.variant==='rows'))return[1,2];
      if(pat==='2S'||(n===2&&stubs.variant!=='rows'))return[2,1];
      if(n===1)return[1,1];if(stubs.variant==='rows')return[1,n];if(stubs.variant==='cols')return[n,1];
      if(n===3)return[2,2];if(n<=4)return[2,2];if(n<=6)return[2,3];return[2,4];}
    function colWOf(p){let v=p.colW;if(v==null)return 0.5;if(v>1)v=v/100;return Math.min(0.7,Math.max(0.3,v));}
    function rowHOf(p){let v=p.rowH;if(v==null)return 0.5;if(v>1)v=v/100;return Math.min(0.85,Math.max(0.15,v));}
    function divsOf(p){const[c,r]=gridShape(p);const d=p.dividers;
      if(d&&d.cols&&d.cols.length===c&&d.rows&&d.rows.length===r)return d;
      const cw=colWOf(p),rh=rowHOf(p);
      const cols=c<2?[1]:c===2?[cw,1-cw]:[cw,...Array(c-1).fill(+((1-cw)/(c-1)).toFixed(3))];
      const rows=r<2?[1]:r===2?[rh,1-rh]:Array(r).fill(+(1/r).toFixed(3));
      return{cols,rows};}
    function rowColsOf(p,ri,dv0){if(ri===0)return dv0.cols.length;if(p.rowCols&&p.rowCols[ri]!=null)return p.rowCols[ri];return dv0.cols.length;}
    function rowFrOf(p,ri,n){const fr=p['rowFr_'+ri];if(fr&&fr.length===n)return[...fr];return Array(n).fill(+(1/n).toFixed(3));}
    function freeBox(p,s){return(p.free||{})[s.id]||null;}
    ${fnSrc}
    return measureCells;
  `);
  return factory({
    variant: 'grid',
    document: { querySelector: () => null, querySelectorAll: () => [] },
  });
}

const measureCells = buildHarness();
const TOL = 0.02;
let fail = 0;
function check(name, got, want) {
  const d = Math.max(Math.abs(got.x - want.x), Math.abs(got.y - want.y),
    Math.abs(got.w - want.w), Math.abs(got.h - want.h));
  const ok = d <= TOL && (want.ovl === undefined || got.ovl === want.ovl);
  if (!ok) fail++;
  console.log((ok ? 'PASS' : 'FAIL') + ' ' + name + ' delta=' + d.toFixed(4) +
    ' got=' + JSON.stringify({ x: +got.x.toFixed(3), y: +got.y.toFixed(3), w: +got.w.toFixed(3), h: +got.h.toFixed(3), ovl: got.ovl }));
}

// Slice 1: dragged column divider (pattern 4, colW 0.7 via slider path).
// Preview truth: rowFr_0 is NOT set by slider; row 0 uses dv.cols=[0.7,0.3].
{ const p = { pattern: '4', slots: [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }],
    dividers: { cols: [0.7, 0.3], rows: [0.5, 0.5] }, colW: 0.7, rowH: 0.5 };
  const gx = 10 / 1000, areaW = 1000, areaH = 1000;
  const aW = areaW - gx, availH = areaH - gx;
  const cells = measureCells(p, null, 'portrait', areaW, areaH, 10)
    .map(c => ({ x: c.x / areaW, y: c.y / areaH, w: c.w / areaW, h: c.h / areaH, ovl: c.ovl }));
  check('divider colW=0.7 slot a', cells[0], { x: 0, y: 0, w: aW * 0.7 / areaW, h: availH * 0.5 / areaH, ovl: false });
  check('divider colW=0.7 slot b', cells[1], { x: (aW * 0.7 + gx) / areaW, y: 0, w: aW * 0.3 / areaW, h: availH * 0.5 / areaH, ovl: false }); }

// Slice 2: free overlay box exports at preview position/size, drawn above grid.
{ const p = { pattern: '4', slots: [{ id: 'a' }, { id: 'b' }], free: { b: { x: 0.1, y: 0.1, w: 0.3, h: 0.3 } } };
  const cells = measureCells(p, null, 'portrait', 1000, 1000, 10);
  const ovl = cells.find(c => c.s.id === 'b');
  check('overlay free box', { x: ovl.x / 1000, y: ovl.y / 1000, w: ovl.w / 1000, h: ovl.h / 1000, ovl: ovl.ovl },
    { x: 0.1, y: 0.1, w: 0.3, h: 0.3, ovl: true }); }

// Slice 3: hero + overlay mix (3B landscape, non-hero detached).
{ const p = { pattern: '3B', slots: [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
    free: { b: { x: 0.2, y: 0.2, w: 0.25, h: 0.25 } } };
  const cells = measureCells(p, null, 'landscape', 1000, 1000, 10);
  const hero = cells.find(c => c.s.id === 'a');
  const ovl = cells.find(c => c.s.id === 'b');
  check('hero stays full-height', { x: hero.x / 1000, y: hero.y / 1000, w: hero.w / 1000, h: hero.h / 1000, ovl: hero.ovl },
    { x: 0, y: 0, w: 0.495, h: 1, ovl: false });
  check('overlay above hero grid', { x: ovl.x / 1000, y: ovl.y / 1000, w: ovl.w / 1000, h: ovl.h / 1000, ovl: ovl.ovl },
    { x: 0.2, y: 0.2, w: 0.25, h: 0.25, ovl: true }); }

// Slice 4: per-row divider override (rowFr_0) only reshapes its own row.
{ const p = { pattern: '4', slots: [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }],
    dividers: { cols: [0.5, 0.5], rows: [0.5, 0.5] }, rowFr_0: [0.8, 0.2] };
  const gx = 10 / 1000, areaW = 1000, areaH = 1000;
  const aW = areaW - gx, availH = areaH - gx;
  const cells = measureCells(p, null, 'portrait', areaW, areaH, 10)
    .map(c => ({ x: c.x / areaW, y: c.y / areaH, w: c.w / areaW, h: c.h / areaH, ovl: c.ovl }));
  check('rowFr_0 slot a', cells[0], { x: 0, y: 0, w: aW * 0.8 / areaW, h: availH * 0.5 / areaH, ovl: false });
  check('rowFr_0 slot c untouched', cells[2], { x: 0, y: (availH * 0.5 + gx) / areaH, w: aW * 0.5 / areaW, h: availH * 0.5 / areaH, ovl: false }); }

// Slice 5: row divider drag (2H, rows 0.8/0.2) splits height.
{ const p = { pattern: '2H', slots: [{ id: 'a' }, { id: 'b' }],
    dividers: { cols: [1], rows: [0.8, 0.2] }, colW: 0.5, rowH: 0.8 };
  const cells = measureCells(p, null, 'portrait', 1000, 1000, 0)
    .map(c => ({ x: c.x / 1000, y: c.y / 1000, w: c.w / 1000, h: c.h / 1000, ovl: c.ovl }));
  check('rowdiv 0.8 slot a', cells[0], { x: 0, y: 0, w: 1, h: 0.8, ovl: false });
  check('rowdiv 0.2 slot b', cells[1], { x: 0, y: 0.8, w: 1, h: 0.2, ovl: false }); }

console.log(fail ? `RED: ${fail} issue-04 case(s) diverge from preview` : 'GREEN: divider+overlay fallback matches preview');
process.exit(fail ? 1 : 0);
