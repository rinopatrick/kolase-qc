// Issue 03 RED/GREEN — hero fallback geometry vs DOM-measured truth.
// Run: node docs/specs/check-issue03-hero.js   (exit 0 = all within tolerance)
//
// Data shape (principle-model-the-domain): cells are grid fractions {x,y,w,h}.
// One source of truth: TRUTH table measured from live preview (agent_browser eval).
// The fallback under test is extracted from index.html measureCells by calling
// it with gridEl=null (DOM-less path) under lightweight stubs.

const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// DOM truth as grid fractions (x,y,w,h), measured from live preview after fix.
// Portrait hero: full-width hero row + 2-col partner row. Landscape hero: side
// span col + stacked partner col (hero full height, partners split vertically).
const TRUTH = {
  '3B|portrait': [
    { x: 0, y: 0, w: 1, h: 312 / 644 },
    { x: 0, y: 333 / 644, w: 246 / 502, h: 312 / 644 },
    { x: 256 / 502, y: 333 / 644, w: 246 / 502, h: 312 / 644 },
  ],
  '3S|portrait': [
    { x: 0, y: 0, w: 246 / 502, h: 312 / 644 },
    { x: 256 / 502, y: 0, w: 246 / 502, h: 312 / 644 },
    { x: 0, y: 333 / 644, w: 1, h: 312 / 644 },
  ],
  '3B|landscape': [
    { x: 0, y: 0, w: 0.494, h: 1 },
    { x: 0.506, y: 0, w: 0.494, h: 0.489 },
    { x: 0.506, y: 0.511, w: 0.494, h: 0.489 },
  ],
  '3S|landscape': [
    { x: 0, y: 0, w: 0.494, h: 0.489 },
    { x: 0, y: 0.511, w: 0.494, h: 0.489 },
    { x: 0.506, y: 0, w: 0.494, h: 1 },
  ],
};
const TOL = 0.02;

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
let fail = 0;
for (const key of Object.keys(TRUTH)) {
  const [pat, ori] = key.split('|');
  const slots = [0, 1, 2].map(i => ({ id: 's' + i, img: null }));
  const p = { pattern: pat, slots, ori, dividers: null, colW: 0.5, rowH: 0.5 };
  const areaW = 1000, areaH = 1000, gx = areaW * 0.02;
  const cells = measureCells(p, null, ori, areaW, areaH, gx);
  const got = cells.map(c => ({ x: c.x / areaW, y: c.y / areaH, w: c.w / areaW, h: c.h / areaH }));
  const want = TRUTH[key];
  let worst = 0;
  got.forEach((g, i) => {
    const d = Math.max(Math.abs(g.x - want[i].x), Math.abs(g.y - want[i].y),
      Math.abs(g.w - want[i].w), Math.abs(g.h - want[i].h));
    worst = Math.max(worst, d);
  });
  const ok = worst <= TOL;
  if (!ok) fail++;
  console.log((ok ? 'PASS' : 'FAIL') + ' ' + key + ' worst-delta=' + worst.toFixed(4) +
    ' got=' + JSON.stringify(got.map(c => ({ x: +c.x.toFixed(3), y: +c.y.toFixed(3), w: +c.w.toFixed(3), h: +c.h.toFixed(3) }))));
}
console.log(fail ? `RED: ${fail} hero fallback case(s) diverge from preview DOM` : 'GREEN: hero fallback matches preview DOM');
process.exit(fail ? 1 : 0);
