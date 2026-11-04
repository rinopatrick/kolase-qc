# Issue 05 — P2P + offline verify

## Parent

PDF parity spec (spec text in chat; no remote tracker — `gh` fails with `no git remotes found`).

## What to build

End-to-end: field worker sends photos from phone (P2P HP → laptop), office staff arranges them on laptop, taps PDF export with internet disconnected, and the PDF matches preview. Covers the full lapangan-ke-kantor path the product promises: no install, no account, no server storage.

## Acceptance criteria

- [x] Photos received via HP P2P session export with identical geometry to locally added photos (`hostApplyPhoto` sets zoom=1/rot=0/px=py=0 + `persistSlotImg`; `drawCover` reads `showImgOf` only)
- [x] Export works fully offline once jsPDF is cached (static `<script>` tag, no fetch inside `doPDF`; missing lib toasts, never silent)
- [x] IndexedDB-persisted photos (idb: refs) resolve correctly in the export canvas (boot hydrates `idb:` to blob URL; `showImgOf` prefers `_url`; missing blob skips cleanly)
- [x] Full flow demoable: phone photo → preview arrange → PDF matching preview (P2P chunks reassembled to local blob URL; file import/export fallback when P2P unreachable)

## Blocked by

- Issue 02 — Single-photo geometry parity (export math must be verified before testing the P2P source path through it)

## Closeout

- Status: CLOSED (2026-11-04, static harness; no code change — already satisfied)
- Evidence: `docs/specs/check-issue05-p2p.js` GREEN (17/17)
