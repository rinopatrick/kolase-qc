# Full Redesign + Port Fitur — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hasilkan `index.html` final = visual OpenDesign (redesign-ref.html, 45KB) + semua fitur matang dari `index.html` asli (132KB).

**Architecture:** Kerja di file `redesign-ref.html` (salinan redesign). JANGAN ubah `index.html` asli sampai final swap. Tiap task port satu subsistem dari asli → adaptasi ke struktur S/pages/slots redesign. Verifikasi: `node --check` + buka browser.

**Tech Stack:** HTML/CSS/JS vanilla satu file, jsPDF CDN, PeerJS + QRCode + jsQR CDN (lazy), localStorage + IndexedDB.

**Basis analisis (sudah diverifikasi):**
- Redesign SUDAH punya (jangan port ulang): toast+action+ms, pending per-aksi (del foto/halaman/clear + Urungkan 8 dtk), doPDF campur orientasi otomatis, filmstrip, undo/redo, empty hero, modal preflight + phone (QR palsu), pan/zoom/rot/caption/move, pola 1/2/4/6/8 + varian grid/rows/cols/hero, tambah halaman, localStorage.
- Redesign BELUM punya (ini yang diport): P2P/QR real (LINK+PeerJS+guest+sync+import+scan), divider tarik + colW/rowH + badge mm, detach bebas overlay (custom/ovlResize/ovlMove), buildPrint + printFilter + gMixChoice, pola 3B/3S + heterogen penuh, preflight detail + panduan OS + gSafari, PATTERNS/patAreas/slotsOf/gridFor/renderLaySeg, guestBar/scanBar + draft IndexedDB, IS_ANDROID sheet.

## Global Constraints

- File kerja: `redesign-ref.html`. `index.html` asli tidak disentuh sampai swap final.
- Tanpa dependensi baru selain yang sudah dipakai kedua file (jsPDF, PeerJS, QRCode, jsQR CDN).
- Nol `alert`/`confirm` baru maupun lama di file final.
- Pola S.pages redesign (array pages berisi slots) DIPERTAHANKAN — fitur asli diadaptasi ke struktur ini, bukan sebaliknya. Pagination global (pageCaps/breaks) DIGANTI model pages-eksplisit redesign; forceNew redesign sudah cukup.
- Semua pending-hapus pakai gaya toast+action redesign (bukan pendingDel), tapi perilaku 8 detik + Urungkan dipertahankan.

---

### Task 1: Port P2P/QR real + guest + draft

**Files:**
- Source baca: `index.html` baris ~1788-2015 (LINK, hostOpen/hostOnData, guestInit, sync realtime, import, scanOpen/scanFound, draft IndexedDB, guestBar/scanBar markup ~351, linkModal ~496, scanModal ~451).
- Modify: `redesign-ref.html` (tambah modal linkModal + scanModal + guestBar markup gaya redesign, tambah JS LINK disesuaikan).

**Interfaces:**
- Consumes: struktur S.pages/Slots redesign, `toast(msg,type,action)`, `pushUndo/save/render`, `addFiles`.
- Produces: `LINK` global + `hostOpen/guestInit/scanOpen/draft*` bekerja di atas S.pages.

- [ ] **Step 1: Tambah markup modal + bar gaya redesign**

```html
<!-- di dalam body redesign-ref, setelah ovPhone: ganti isi ovPhone dengan linkModal real -->
<!-- Tambah guestBar + scanBar di atas shell, dan scanModal setelah ovPhone -->
```

- [ ] **Step 2: Port JS LINK (adaptasi hostApplyPhoto → S.pages)**

```js
// hostApplyPhoto: cari slot berisi pid di S.pages; bila tidak ada, isi firstEmptySlot(); tambah halaman bila perlu
// sync del/cap/clear: operasi di S.pages + save(); render()
// guest: kirim foto dari S.pages (dataUrl via canvas), antrean + sentIds sama
// scan: scanOpen/scanFound sama, guestInit baca #s=
// draft IndexedDB: simpan blob dari slot img (dataURL→blob), load kembali ke firstEmptySlot
```

- [ ] **Step 3: Verifikasi**

Run: `node --check` ekstraksi script + `grep -c "LINK\|hostOpen\|guestInit\|draftSaveAll" redesign-ref.html` (harus >0), `grep -c "alert(\|confirm(" redesign-ref.html` (harus 0).
Buka browser: klik 📲 HP → QR real tampil; (P2P penuh butuh 2 device — cukup QR tampil + status).

- [ ] **Step 4: Commit**

```bash
git add redesign-ref.html && git commit -m "feat: port P2P QR real + guest + draft ke redesign"
```

### Task 2: Port divider + colW + detach overlay + badge mm

**Files:**
- Source baca: `index.html` (~divsOf/gridCssFor/addDividers/dragDivider + .divbadge, attachGridBits/detachCell/makeOverlay/ovlResize/ovlMove + HANDLES + cellRectFrac, marginFrac, PATTERNS/patAreas/slotsOf).
- Modify: `redesign-ref.html` (slot redesign dapat divider + handle + mode overlay).

**Interfaces:**
- Consumes: `.slot`/`.imgbox` redesign, `pushUndo/save/render`, `toast`.
- Produces: divider tarik + colW per page, sudut/handle resize, tombol detach → overlay bebas + toast, badge mm.

- [ ] **Step 1: Port pola + colW (adaptasi ke colsFor)**

```js
// tambah p.colW (0.3..0.7, default 0.5) + p.rowH; colsFor pakai colW untuk 2 kolom pertama
// divider vertikal/horizontal di .sheet-inner; drag update p.colW/p.rowH + save/render ringan
// badge .divbadge: mm = fraksi × (fisik − 2×margin); margin redesign px→mm via PAPER_MM + skala render
```

- [ ] **Step 2: Port detach overlay (adaptasi ke slot redesign)**

```js
// tombol detach di .tools (⤢) → slot jadi overlay absolute + toast "Kotak bebas — Ctrl+Z kembalikan"
// ovlResize (8 handle) + ovlMove via .mv; klik naikkan z (ovlTop); tombol ⤺ kembali ke grid
// overlay boleh tumpuk (tanpa pushAside/resolveOverlaps — JANGAN port kedua fungsi itu)
```

- [ ] **Step 3: Verifikasi**

Run: `node --check` + grep `colW\|detachCell\|ovlResize\|divbadge` >0, `alert(/confirm(` = 0.
Buka browser: tambah foto, tarik divider (badge mm muncul), klik ⤢ (overlay bebas + toast), undo kembalikan.

- [ ] **Step 4: Commit**

```bash
git add redesign-ref.html && git commit -m "feat: port divider colW + detach overlay ke redesign"
```

### Task 3: Port buildPrint + pola 3B/3S + preflight + panduan OS + swap final

**Files:**
- Source baca: `index.html` (~buildPrint + printFilter + #print-root CSS @media print, PATTERNS 3B/3S + patOptions, showGuide + GUIDE + #gPreflight + #gSafari + #gMixChoice, IS_ANDROID sheet).
- Modify: `redesign-ref.html`, lalu swap ke `index.html`.

**Interfaces:**
- Consumes: hasil Task 1+2, modal ovPrint redesign, `doPDF`.
- Produces: `index.html` final = redesign + semua fitur; file lama jadi `index-legacy.html`.

- [ ] **Step 1: Port buildPrint + pola 3B/3S**

```js
// buildPrint: render tiap halaman ke #print-root dengan @media print CSS (port CSS print + .sheet print dari asli, sesuaikan class redesign)
// pola 3B/3S: tambah ke patGrid + select pola + colsFor (1 besar + 2 kecil, adaptif orientasi)
// gMixChoice: doPDF redesign SUDAH gabung campur — hanya tambah pilihan cetak-2-tahap di ovPrint bila halaman campur (reuse printFilter+buildPrint)
```

- [ ] **Step 2: Port preflight detail + panduan OS + sheet Android**

```js
// pfPaper/pfTotal tambah: ukuran mm (PAPER_MM), margin, n foto; pfMode: campur P+L / tunggal
// panduan OS (android/iphone/desktop) + safari-note di ovPrint; gHide "jangan tampilkan lagi" opsional — boleh skip bila crowded, minimal safari-note
// IS_ANDROID: btnCam langsung camPick bila bukan Android; sheet srcCam/srcGal bila Android (port srcSheet modal minimal)
```

- [ ] **Step 3: Verifikasi akhir + swap**

Run: `node --check`; `grep -c "alert(\|confirm(" redesign-ref.html` = 0; bandingkan fitur: `grep -c "LINK\|colW\|detachCell\|buildPrint\|3B" redesign-ref.html` semua >0.
Buka browser: tambah foto, divider, detach, undo, preflight, doPDF (file terunduh), window.print (pratinjau benar).
Swap:
```bash
git mv index.html index-legacy.html && git mv redesign-ref.html index.html
git add -A && git commit -m "feat: redesign OpenDesign + port fitur penuh (P2P, divider, detach, print)"
rm -f /tmp/kolase-redesign.html
```

- [ ] **Step 4: Review final**

Dispatch reviewer (code-reviewer skill) atas diff `git diff <base>..HEAD --stat` + smoke test browser. Catat sisa minor ke ledger.
