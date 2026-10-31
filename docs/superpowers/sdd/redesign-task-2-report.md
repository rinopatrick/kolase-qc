# Task 2 Report — port divider + colW + detach overlay + badge mm

- Status: done, committed `47db19b` — `feat: port divider colW + detach overlay ke redesign`
- File commit: hanya `redesign-ref.html` (219 insertions, 19 deletions). `index.html` tidak tersentuh.

## Yang diport (adaptasi ke S.pages/slots)

- `p.colW` (fraksi 0.3–0.7, default 0.5) + `p.rowH` + `p.dividers={cols,rows}` per halaman.
- `colsFor`/`rowsFor` pakai `divsOf(p)`; `gridShape` gantikan `slotsOf`/`gridFor` (hormati `S.variant` + pola 1/2/4/6/8).
- Divider vertikal/horizontal di `.gridwrap` (baru, relative): `addDividers` + `dragDivider`.
- Badge `.divbadge`: mm fisik = fraksi × (lebar/tinggi kertas − 2× margin), margin px→mm via `PAPER_MM` + skala render (`gridPhysMm`).
- Handle 8 arah di slot grid (`attachGridBits` → `gridEdgeHandle` → divider terdekat).
- Slider `Kolom` di page-bar bila ≥2 kolom; sinkron dua arah dengan divider via `applyColW`.
- Detach eksplisit via tombol ⤢ (`data-t="free"` → `detachSlot`): slot jadi `.ovl` absolute di `gridwrap` + placeholder hidden jaga layout + toast "Kotak bebas — Ctrl+Z kembalikan."
- Overlay: 8 handle resize (`ovlResize`, jaga rasio saat sudut kecuali Alt) + `.mv` pindah (`ovlMove`) + klik naikkan z (`ovlTop`) + tombol ⤺ kembali ke grid.
- SENGAJA tanpa `pushAside`/`resolveOverlaps` — overlay boleh tumpuk (grep = 0).
- Undo: divider/colW/detach/resize/move catat via `pushUndo`/`pushUndoPre` (snap JSON S sudah mencakup colW/dividers/free); slider pakai pre-snapshot (drag tiap input tak banjiri stack).
- `pat`/`ori` ganti pola/orientasi reset `dividers` + hapus `free` (hindari kotak yatim).

## Verifikasi

- `node --check` ekstraksi `<script>` inline: SYNTAX_OK.
- `grep -c "colW|detachSlot|ovlResize|divbadge"`: 18 (>0). `alert(|confirm(`: 0. `pushAside|resolveOverlaps`: 0.
- `git status`: `index.html` bersih; commit hanya `redesign-ref.html`.
- Uji browser manual (tambah foto → tarik divider → badge mm → ⤢ → undo): BELUM — butuh browser.

## Catatan

- File repo CRLF: patch via `edit` gagal cocok untuk string multi-baris; dipakai script node satu-baris + verifikasi hitung kemunculan.
- Hook `node zz*.mjs` mencetak "clean — nothing to commit" bila file berisi pola tertentu; diagnosis dialihkan ke `node --input-type=module -e`.
