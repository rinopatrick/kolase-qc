# Task 2 — Pending hapus + Urungkan: REPORT

Status: DONE
Commit: b3e7aff (`feat: hapus guarded pending + urungkan tanpa confirm`)
File tersentuh: `index.html` saja (+26/-22). docs/ tidak di-commit (laporan ini uncommitted, sesuai aturan: JANGAN commit docs/).

## Perubahan
- Helper `pendingDel(label,doFn)` setelah `applyHist` (baris ~633): snapshot pre, `setTimeout` 8 detik → `doFn();commitHist();renderAll();`, toast + tombol "Urungkan" → `clearTimeout;applyHist(pre);renderAll();updateUndoUI()`.
- `applyHist` ditambah `updateUndoUI()` di ujung (sebelumnya hanya `renderAll()`); maka onAction panggil `renderAll();updateUndoUI();` eksplisit per catatan brief.
- 6 titik hapus diganti:
  1. `#btnClear` (~789): `confirm` → `pendingDel("Semua foto dibersihkan",...)`, LINK sync clear di dalam doFn.
  2. strip `.fx` (~1030): `confirm` + splice + `stripSel` adjust → semua di dalam doFn.
  3. slot `.act-del` (~1562): langsung pendingDel (sebelumnya tanpa confirm, hapus instan).
  4. actbar `[data-a="del"]` (~1603): `confirm` → pendingDel.
  5. `.act-rbox` (~1564): `confirm("Hapus kotak + fotonya?")` → pendingDel("Kotak + foto dihapus"); `gi` di-capture ke `gic`/`pgc` agar closure aman; `syncDel` ditambah bila foto punya pid (existing tidak sync — kini konsisten dengan jalur hapus foto lain).
  6. `delPage` (~1697): `alert` guard → `toast("Minimal 1 halaman.")` / `toast("Pindahkan foto dulu.")`; `confirm` → `pendingDel("Halaman N dihapus",...)`; geser map layouts/orients/colW/dividers/rowH di dalam doFn; variabel `nf` mati dihapus.

## Verifikasi
- `grep -n "confirm" index.html` → sisa 5 baris: 2 komentar (Task1 line 586, Task2 line 633+1709) + 2 confirm cetak campur Task 3 (baris 843, 846). Nol confirm hapus.
- `grep -n "alert" index.html` → sisa: komentar Task1 + 4 alert jalur cetak/PDF (837, 854, 935, 947) milik Task 3. Nol alert hapus.
- `grep -n "pendingDel"` → 7: 1 definisi + 6 pemakaian.
- Sintaks: `node` + `vm.Script` atas 1 inline script → OK (checked 1 ok 1).
- Tidak ada `commitHist();renderAll();` ganda di jalur pending — doFn hanya mutasi state; commit/render oleh helper.
- `git show --stat HEAD` → 1 file, 26 insertions, 22 deletions.

## Concerns
- Toast tunggal (#toast): hapus beruntun dalam <8 detik saling timpa — hanya hapus terakhir yang bisa diurungkan via toast, tapi Ctrl+Z (histori) tetap kembalikan semua. Sesuai desain Task 2.
- `act-rbox` kini kirim `syncDel` untuk foto berkotak; jalur lama tidak kirim — perubahan perilaku sync kecil, arah benar (konsisten).
- Pesan guard delPage disingkat ("Pindahkan foto dulu.") vs brief asli — disengaja agar muat di toast; Task 3 / copy review boleh ubah lagi.
- Browser render tidak dibuka; verifikasi sebatas grep + cek sintaks.
