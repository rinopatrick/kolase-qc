# Issue 01 — Clean PDF output (no numbers, no captions)

## Parent

PDF parity spec (spec text in chat; no remote tracker — `gh` fails with `no git remotes found`).

## What to build

End-to-end: user arranges photos in kolase preview (badges 01/02 visible, caption inputs editable), taps PDF export, and gets a clean PDF with photos only. No number badges drawn on the canvas. No caption text drawn on the canvas. Browser Print path hides both as well so Cetak matches the PDF.

## Acceptance criteria

- [x] PDF pages contain photo imagery only — no 01/02 badge rendered anywhere (`drawCover` only image paint in `doPDF`; no badge `fillText`)
- [x] PDF pages contain no caption text (photo area + blank white strip only; kop header `fillText` is title/sub/date)
- [x] Preview still shows number badges and editable caption inputs (`<span class="num">` + `<input class="cap">` in `render()`)
- [x] Browser Print output hides `.slot .num` and `.slot .cap` (`@media print` hides `.num`, `.cap`, `.tools`, `.divider`, `.hd`)
- [x] Export with 6 filled photos produces pages with zero badge artifacts (only kop + photos + dashed empty boxes; `setLineDash` placeholders)

## Blocked by

None — can start immediately.

## Closeout

- Status: CLOSED (2026-11-04, static harness; no code change — already satisfied)
- Evidence: `docs/specs/check-issue01-clean.js` GREEN (11/11)
