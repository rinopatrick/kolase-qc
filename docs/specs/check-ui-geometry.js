// Paper-world geometry probe. Paste the body into the page (browser devtools / browser pane JS)
// of BOTH the baseline and the redesigned index.html with the same stored state, then compare
// the two JSON outputs: every number must match within 0.003 (fraction of sheet size).
// Geometry is measured as fractions of the .sheet rect, so a different stage width is fine.
//
// Walks page 1 through every pattern x orientation via the page-bar selects (the same path
// a user clicks), records sheet aspect, kop box, and every slot box, then restores the start.
async function uiGeometry() {
  const wait = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  const page = () => document.querySelector('.page-wrap');
  const sel = act => page().querySelector('select[data-act="' + act + '"]');
  const fire = (el, v) => { el.value = v; el.dispatchEvent(new Event('change', { bubbles: true })); };
  const r4 = n => Math.round(n * 10000) / 10000;
  const start = { pat: sel('pat').value, ori: sel('ori').value };
  const out = {};
  for (const ori of ['portrait', 'landscape']) {
    for (const pat of ['1', '2H', '2S', '3B', '3S', '4', '6', '8']) {
      fire(sel('ori'), ori); await wait();
      fire(sel('pat'), pat); await wait();
      const sh = page().querySelector('.sheet').getBoundingClientRect();
      const box = el => { const b = el.getBoundingClientRect(); return [r4((b.left - sh.left) / sh.width), r4((b.top - sh.top) / sh.height), r4(b.width / sh.width), r4(b.height / sh.height)]; };
      const head = page().querySelector('.doc-head');
      out[ori + '/' + pat] = {
        aspect: r4(sh.width / sh.height),
        head: head ? box(head) : null,
        slots: [...page().querySelectorAll('.slot')].map(box),
      };
    }
  }
  fire(sel('ori'), start.ori); await wait();
  fire(sel('pat'), start.pat); await wait();
  return out;
}

function uiGeometryDiff(a, b, tol = 0.003) {
  const bad = [];
  for (const k of Object.keys(a)) {
    const fa = JSON.stringify(a[k]).match(/-?\d+(\.\d+)?/g) || [], fb = JSON.stringify(b[k] || {}).match(/-?\d+(\.\d+)?/g) || [];
    if (fa.length !== fb.length) { bad.push(k + ' shape differs'); continue; }
    fa.forEach((v, i) => { if (Math.abs(+v - +fb[i]) > tol) bad.push(k + ' #' + i + ' ' + v + ' vs ' + fb[i]); });
  }
  return bad.length ? 'FAIL\n' + bad.join('\n') : 'PASS geometry identical';
}

if (typeof module !== 'undefined') module.exports = { uiGeometry, uiGeometryDiff };
