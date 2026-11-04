# Issue 03 — Pattern + empty-cell parity

## Parent

PDF parity spec (spec text in chat; no remote tracker — `gh` fails with `no git remotes found`).

## What to build

End-to-end: user picks any page pattern (1/2/3B/3S/4/6/8, including 3B/3S hero spans), leaves some slots empty, taps PDF export, and the PDF grid matches the preview grid cell-for-cell. Empty slots render as dashed placeholder boxes (same visual language as preview) so pages never collapse or reflow.

## Acceptance criteria

- [x] Patterns 1, 2, 3B, 3S, 4, 6, 8 all export with identical cell geometry to preview (live DOM rects 2026-11-04: 1 full-bleed; 2S 2-col; 2H 2-row; 3B hero full row; 3S hero full row; 4 2x2; 6 3x2; 8 4x2; PDF `doPDF` toast confirms export)
- [x] 3B/3S hero spans (portrait full-width-top, landscape side-span) match preview in both orientations (`check-issue03-hero.js` GREEN: portrait delta 0.0071, landscape delta 0.0040; live landscape side-span hero col 0.494 + stack 0.489)
- [x] Empty slots render as dashed boxes in PDF, same positions as preview (live 2-page export 3B-landscape 2 filled + 1 empty, 6-portrait 4 filled + 2 empty; `setLineDash` branch in `doPDF`; empties carry geometry)
- [x] Cell positions measured from live preview DOM rects; model-based fallback used only when DOM not rendered (`measureCells` returns early on full DOM match; fallback reached only when rect zero or slot el missing; both grids rendered live)
- [x] 6-photo case keeps the same page breaks as preview (`doPDF` iterates `S.pages` in order, one canvas per page; live 2-page export preserves break)

## Blocked by

- Issue 02 — Single-photo geometry parity (per-photo math must be correct before multi-cell layout can be trusted)
