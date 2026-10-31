# Polish trust — Kolase QC (pendekatan A)

Tanggal: 2026-10-30. Skor critique 21/40, fokus tutup P0/P1 tanpa rombak pipeline `renderPageCanvas`/`downloadPDF`.

## Seksi 1 — Print trust
- Topbar: `#btnPDF` primer label `⬇ Unduh PDF` di kiri; `#btnPrint` ghost kecil label `Cetak⋯` + `title` fallback sadar risiko.
- Modal `#printGuide`: `#gPreflight` ringkas — n halaman, kertas WxH mm, campur P+L / orientasi, n foto, `✓ tanpa tulisan tepi`.
- `downloadPDF()`: teks tombol progres `⏳ Menyusun i/N` + tombol modal ikut; `finally` kembalikan. Blok jsPDF hilang → toast, bukan `alert`.
- `#btnPrint` campur P+L: tanpa `confirm()` ganda — satu pilihan inline (lanjut 2 tahap / putar balik Unduh PDF).
- Slot/foto kosong: toast inline di kanvas + fokus slot pertama, bukan `alert`.

## Seksi 2 — Kontrol visible
- `.toolbar`, `.zctl` desktop: base `opacity:.38`, penuh saat hover/`.sel`/`focus-within`; coarse tetap `opacity:1`.
- `.hd` sudut: base `opacity:.38` bukan 0; penuh saat hover/pilih.
- `.divider::after`: `background accent-d 40%` idle, penuh saat hover/`.on`.
- Badge mm saat tarik divider/handle: lebar kolom / tinggi baris fisik (mm = fraksi × (W/H − 2m)).

## Seksi 3 — Bebas aman + hapus guarded
- Sudut (`ne/nw/se/sw`) = resize dalam grid; detach HANYA via tombol `⤢` → overlay + toast `Kotak bebas — Ctrl+Z kembalikan`.
- Kembali via `⤺`; `pushAside`/`resolveOverlaps` dihapus; overlay boleh tumpuk; klik naikkan z.
- Hapus (foto/slot/halaman/kosongkan): tanpa `confirm()` — status pending 8 dtk + tombol `Urungkan`; undo cover semua.
- `detachCell` bareTap commit; `commitIfChanged(pre)` di semua op layout.

## Self-review
- Placeholder: tidak ada; semua target ID/fungsi ada (`#btnPDF`, `#btnPrint`, `#gPreflight`, `downloadPDF`, `detachCell`, `delPage`, `commitHist`).
- Konsistensi: seksi 1–3 tidak ubah `renderPageCanvas`/pola/orientasi; undo tetap `snapState` penuh.
- Scope: satu file `index.html`, <150 baris ubahan; filmstrip/inspector/preset di luar scope (pendekatan B/C).
- Ambiguitas: toast = elemen inline baru `#toast` (bukan `alert`); pending-hapus default commit setelah 8 dtk kecuali `Urungkan`.
