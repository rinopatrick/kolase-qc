# Issue 04 — Divider + overlay + mixed orientation parity

## Parent

PDF parity spec (spec text in chat; no remote tracker — `gh` fails with `no git remotes found`).

## What to build

End-to-end: user drags dividers, detaches a free overlay box, mixes portrait and landscape pages, taps PDF export, and gets one file where every manual adjustment survives. Grid cells draw first, free overlays on top (preview z-order). jsPDF merges portrait + landscape pages into a single file as today.

## Acceptance criteria

- [x] Dragged column/row divider positions reflected in PDF cell sizes (`docs/specs/check-issue04-parity.js` GREEN: colW=0.7 slider fallback now matches preview; per-row `rowFr_0` only reshapes its row; rowdiv 0.8/0.2 splits height; live DOM path auto-parity via rects)
- [x] Free overlay boxes export at their preview position/size, drawn above grid cells (`freeBox` fractions measured from DOM rects, `order=grid+ovl` draws overlays last; hero+overlay mix keeps hero full-height)
- [x] Mixed portrait + landscape pages combine into one PDF with correct per-page dimensions (per-page `p.ori` in `new jsPDF` + `addPage`, `pw/ph` swapped per page)
- [x] Kop on/off and head-height drag still reserve the same space as preview (`no-kop` drops head row in preview, `top=mx` in PDF; `p.headH` term shared by `headpad` and `top`)

## Blocked by

- Issue 03 — Pattern + empty-cell parity (base grid must match before dividers/overlays layer on top)

## Closeout

- Status: CLOSED (2026-11-04, node harness + static DOM-path audit)
- Fix: `measureCells` fallback row 0 now uses `dv.cols` when `rowFr_0` unset (slider/divider path), matching preview `render()`
- Evidence: `docs/specs/check-issue04-parity.js` GREEN (9/9); `docs/specs/check-issue03-hero.js` still GREEN (no regression)
