# SDD — Redesign Task 1: P2P QR real + guest + draft

Tanggal: 2026-10-31. Plan: `docs/superpowers/plans/2026-10-31-redesign-port.md` Task 1.
File kerja: `redesign-ref.html`. `index.html` TIDAK disentuh (git clean).

## Status
Selesai — port dikerjakan sesi lalu, sesi ini verifikasi ulang fungsi-per-fungsi
vs sumber `index.html` (~1788-2015, 351, 451, 496). Tak ada gap → tak ada commit baru.

## Commits (hanya redesign-ref.html)
- `2eb1f76` bulk port: markup guestBar/scanBar/scanModal/ovPhone-link + CDN consts
  (PEERJS/QR/SCAN) + JS LINK penuh adaptasi S.pages/Slots (+843 baris, 1 file).
- `9413fb7` fix: urutan `pushUndo()` sebelum mutasi di `hostOnData`
  (img-end, cap), `id="lkClose"` pada tombol Tutup sesi, auto-antre guest
  (`addFiles`/`dropToSlot` wrapper → `syncEnqueueAll`), veil-click
  `#scanModal` → `scanClose`.

## Checklist plan
- [x] Step 1 — markup: `#guestBar` + `#scanBar` (l.196-197), `#ovPhone` isi
  linkModal real (`#lkQr/#lkCode/#lkCount/#lkLink/#lkCopy/#lkStatus/#lkImportBtn/#lkFile/#lkClose`,
  l.316-328), `#scanModal` + `#scanView/#scanMsg/#scanErr/#scanCancel` (l.330-341).
- [x] Step 2 — JS LINK: `LINK` + `hostOpen/hostOnData/hostApplyPhoto/hostDestroy`,
  `guestInit/guestConnect/guestOnHost/guestSend/guestExport`, sync realtime
  (`syncEnqueue(All)/syncPump/syncDel/syncCap/linkSend/connOpen`), `scanOpen/scanFound/scanClose`,
  draft IndexedDB (`draftDB/draftTx/draftSaveAll/draftLoad/draftClear/draftArm`).
- [x] Step 3 — verifikasi: `node --check` OK, grep LINK=66 (>0), `alert(/confirm(`=0.
- [x] Step 4 — commit: `git add redesign-ref.html` saja (2 commit di atas); sesi ini
  nol perubahan → nol commit baru.

## Kecocokan vs sumber (verifikasi sesi ini)
- 41/41 fungsi P2P/guest/scan/draft sumber ada di port (`syncSheets`/`pageCaps`/
  `pickPhoto`/`tryCapture` milik Task 2/3, bukan Task 1 — benar tidak diport).
- `photoToDataUrl(p)` sumber → `slotToDataUrl(s)` port (fetch `slot.img` → `blobToJpeg` 1920px).
- `hostApplyPhoto`: cari slot ber-pid → `firstEmptySlot()` → `newPage()` bila penuh.
- Mutasi host: `pushUndo()` dulu, lalu `save();render()` (bukan `commitHist/renderAll`).
- `clear` dua arah: host filter hanya slot ber-pid; guest `btnClear` kirim `{t:"clear"}` +
  toast urungkan 8 dtk gaya redesign.
- `del`/`cap` dua arah + ack (`img-ack/del-ack/cap-ack`), `welcome.have` anti-duplikat.
- `btnClear` port = `pushUndo` + `snap()`/`restore(bak)` + toast Urungkan 8000ms
  (pengganti `pendingDel` sumber, sesuai constraint global).
- Caption `change` → `syncCap`; `slotTool del` → `syncDel`; auto-antre via wrapper
  `addFiles`/`dropToSlot` + auto-`guestConnect()` di `guestInit`.
- `scanModal` veil via class `open` (redesign) ganti `hidden` sumber; `scanBarRefresh()`
  sembunyikan scanBar saat `isGuest`.
- Draft: simpan blob dari `slot.img`, load ke `firstEmptySlot` (page baru bila penuh);
  `draftArm()` interval 4 dtk + pagehide/beforeunload; boot `draftArm();guestInit();`
  + `draftLoad()` bila tanpa `#s=`.
- `render` di-wrap: panggil `updGuestCount()` bila `isGuest`.

## Verifikasi (sesi ini)
- `node --check` script inline terekstrak (1 script): OK.
- `grep -c "LINK\|hostOpen\|guestInit\|draftSaveAll"` = 66 (>0).
- `grep -c "alert(\|confirm("` = 0. `grep -c drawFakeQR` = 0.
- `git status -- index.html` bersih; `git diff 9413fb7~2..HEAD --stat`: +843 hanya `redesign-ref.html`.

## Buka-browser (manual, belum dilakukan)
Klik 📲 HP → QR real tampil + status sesi. P2P penuh butuh 2 device —
cukup QR tampil + status "QR aktif". Guest: buka link `#s=` di HP → guestBar
muncul, `gSend` enqueue, `gExport` unduh JSON fallback.
