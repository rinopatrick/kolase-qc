# Issue 02 — Single-photo geometry parity (pan/zoom/rotate)

## Parent

PDF parity spec (spec text in chat; no remote tracker — `gh` fails with `no git remotes found`).

## What to build

End-to-end: user pans, zooms, and rotates the single 01 photo in preview until the paper document fills the frame, taps PDF export, and the PDF shows the same crop/position/rotation. The canvas redraw uses the identical cover-fit + zoom + rotate + pan math as the preview renderer, so what is on screen is what lands on paper.

Prototype decision (from running code — keep exactly):

```
base = max(dw/im.width, dh/im.height) * zoom
translate(dx + dw/2 + px*k, dy + dh/2 + py*k); rotate(rot); scale(base); drawImage(im, -w/2, -h/2)
```

with `k` = PDF-width / DOM-width ratio aligning the pan offsets.

## Acceptance criteria

- [x] Photo 01 positioned in preview (like `c3b3a6d8` preview shot) exports to the same position in PDF — no re-crop, no shift (preview 0.7143/0.6071 vs PDF 0.7143/0.6071, live 2026-11-04)
- [x] Zoom in/out reflected 1:1 in PDF (zoom 1.4 base + 2.2 stressed, live 2026-11-04)
- [x] 90° rotation reflected 1:1 in PDF (stressed 0.4545/0.3863 both sides, live 2026-11-04)
- [x] Pan offsets scaled correctly via `k` factor (no drift at 200 DPI) (k=3.0624, pan -50/60 stressed green, live 2026-11-04)
- [x] Verified with the reported case: document photo filling slot 01 (`docs/specs/verify-closeout-02.png`, live 2026-11-04)

## Blocked by

- Issue 01 — Clean PDF output (canvas must already be badge/caption-free before geometry can be compared)
