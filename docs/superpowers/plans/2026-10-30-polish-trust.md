# Polish Trust Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Terapkan polish trust A ke `index.html` tanpa rombak pipeline PDF.

**Architecture:** Edit langsung satu file `index.html`; tiap task = CSS/JS terisolasi + verifikasi grep/manual. Undo tetap `snapState` penuh.

**Tech Stack:** HTML/CSS/JS vanilla satu file, jsPDF via CDN, tanpa build step.

## Global Constraints

- Satu file `index.html` saja; tanpa dependensi baru.
- `renderPageCanvas`/`downloadPDF` inti tidak diubah perilakunya.
- Undo cover semua op via `snapState`/`commitHist`.
- Tanpa `alert`/`confirm` baru.

---

### Task 1: Toast inline + CSS kontrol visible

**Files:**
- Modify: `index.html` (tambah `#toast` CSS + div, ubah `.toolbar`/`.zctl`/`.hd`/`.divider::after` base opacity)

**Interfaces:**
- Consumes: CSS existing `.toolbar`, `.zctl`, `.hd`, `.divider::after`.
- Produces: `window.toast(msg, opts)` global; kontrol base visible.

- [ ] **Step 1: Tambah CSS toast + ubah base opacity kontrol**

```css
/* toast inline */
#toast{position:fixed;left:50%;bottom:22px;transform:translateX(-50%) translateY(12px);z-index:200;background:#101828;border:1px solid var(--border2);color:var(--fg);border-radius:12px;padding:10px 14px;font-size:13px;display:flex;gap:10px;align-items:center;opacity:0;pointer-events:none;transition:.2s;max-width:min(92vw,560px)}
#toast.show{opacity:1;transform:translateX(-50%);pointer-events:auto}
#toast button{background:var(--accent);border:0;border-radius:8px;padding:6px 12px;font-weight:800;cursor:pointer;color:var(--accent-ink)}
.slot .toolbar,.slot .zctl{opacity:.38}
.slot:hover .toolbar,.slot.sel .toolbar,.slot:focus-within .toolbar,.slot:hover .zctl,.slot:focus-within .zctl{opacity:1}
.slot .hd{opacity:.38}
.slot:hover .hd,.slot.sel .hd,.slot:focus-within .hd{opacity:1}
.divider::after{background:rgba(13,148,136,.4)}
.divider:hover::after,.divider.on::after{background:var(--accent-d)}
```

- [ ] **Step 2: Tambah div toast + fungsi global**

```html
<div id="toast" role="status" aria-live="polite" hidden></div>
```

```js
let _toastT=null;
window.toast=function(msg,opts){
  const t=document.querySelector("#toast");if(!t)return;
  t.hidden=false;
  t.innerHTML=`<span></span>`;
  t.querySelector("span").textContent=msg;
  if(opts&&opts.action){const b=document.createElement("button");b.textContent=opts.action;b.onclick=()=>{opts.onAction&&opts.onAction();hide()};t.appendChild(b);}
  t.classList.add("show");
  clearTimeout(_toastT);
  _toastT=setTimeout(hide,opts&&opts.ms||4200);
  function hide(){t.classList.remove("show");clearTimeout(_toastT);_toastT=setTimeout(()=>{t.hidden=true;},220);}
};
```

- [ ] **Step 3: Verifikasi**

Run: `grep -n "id=\"toast\"\|window.toast\|opacity:.38" index.html`
Expected: ketiga pola ketemu.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: toast inline + kontrol base visible"
```

### Task 2: Ganti alert/confirm hapus dengan pending + Urungkan

**Files:**
- Modify: `index.html` (handler `#btnClear`, hapus foto strip/slot/actbar, hapus kotak `act-rbox`, `delPage`)

**Interfaces:**
- Consumes: `window.toast` dari Task 1, `commitHist`, `renderAll`, `state`.
- Produces: `pendingDel(label, doFn)` — tunda 8 detik dengan tombol Urungkan.

- [ ] **Step 1: Tambah helper pendingDel**

```js
function pendingDel(label,doFn){
  const pre=snapState();
  const t=setTimeout(()=>{doFn();commitHist();renderAll();},8000);
  toast(label+" — dihapus dalam 8 detik.",{action:"Urungkan",ms:8000,onAction:()=>{clearTimeout(t);applyHist(pre);renderAll();}});
}
```

- [ ] **Step 2: Ganti 7 titik confirm/alert hapus**

```js
// #btnClear: ganti confirm → pendingDel("Semua foto dibersihkan",()=>{state.photos=[]; ...LINK sync...})
// strip .fx, slot .act-del, actbar del: ganti confirm → pendingDel(`Foto ${gi+1} dihapus`,()=>{state.photos.splice(gi,1); ...})
// act-rbox: ganti confirm → pendingDel("Kotak + foto dihapus",()=>{...splice + setCustom null...})
// delPage: ganti confirm + alert halaman-berisi → toast info + pendingDel("Halaman N dihapus",...geser map...)
// total<=1 dan halaman-berisi: toast("Minimal 1 halaman.") / toast("Pindahkan foto dulu.")
```

- [ ] **Step 3: Verifikasi**

Run: `grep -n "confirm(" index.html`
Expected: hanya sisa confirm non-hapus (cetak campur, bila belum Task 3) atau kosong.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: hapus guarded pending + urungkan tanpa confirm"
```

### Task 3: Print trust — preflight + progres + pilihan campur inline

**Files:**
- Modify: `index.html` (`#btnPrint` handler, `downloadPDF` jsPDF-hilang, `#gPreflight` sudah ada — pastikan ringkas)

**Interfaces:**
- Consumes: `window.toast`, `downloadPDF`, `showGuide`, `mixedOrients`.
- Produces: pilihan campur P+L inline di modal; toast ganti alert kosong.

- [ ] **Step 1: Ganti alert kosong + jsPDF hilang dengan toast**

```js
// #btnPrint dan #btnPDF: `if(!state.photos.length){toast("Belum ada foto — tambah dulu.");fokus slot pertama;return;}`
// downloadPDF: `if(!jsPDF){toast("Pustaka PDF belum termuat — coba lagi sebentar.");return;}`
// catch: `toast("Gagal menyusun PDF — coba lagi, atau pakai Cetak.");`
```

- [ ] **Step 2: Pilihan campur inline ganti confirm ganda**

```js
// Di showGuide()/modal: bila mixedOrients>1 tampilkan baris pilihan:
// [Unduh gabung 1 file (disarankan)] [Cetak 2 tahap]
// tanpa confirm(); tombol cetak-2-tahap jalankan portrait lalu landscape via buildPrint+window.print
```

- [ ] **Step 3: Verifikasi**

Run: `grep -n "alert(\|confirm(" index.html`
Expected: kosong.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: print trust tanpa alert confirm"
```

### Task 4: Bebas aman — sudut resize, detach hanya via ⤢ + badge mm

**Files:**
- Modify: `index.html` (`attachGridBits`, `detachCell`, `dragDivider`, badge mm)

**Interfaces:**
- Consumes: `HANDLES`, `gridEdgeHandle`, `pushAside`/`resolveOverlaps` (dihapus), `window.toast`.
- Produces: sudut = resize dalam grid; overlay boleh tumpuk + klik naikkan z.

- [ ] **Step 1: Sudut jadi resize, hapus pushAside/resolveOverlaps**

```js
// attachGridBits: SEMUA handle (sisi+sudut) → gridEdgeHandle (resize via divider terdekat)
// detachCell hanya dipanggil dari tombol .act-free (bareTap)
// hapus fungsi pushAside + resolveOverlaps + pemanggilnya; overlay tumpuk diizinkan
// klik overlay → naikkan z-index max + .sel
```

- [ ] **Step 2: Detach via ⤢ + toast, badge mm**

```js
// af.onclick tetap detachCell bareTap + toast("Kotak bebas — Ctrl+Z kembalikan.")
// dragDivider move(): tampilkan badge `${mm} mm` (mm = fraksi × (W/H − 2*margin))
// badge hilang saat pointerup
```

- [ ] **Step 3: Verifikasi**

Run: `grep -n "pushAside\|resolveOverlaps\|detachCell" index.html`
Expected: `pushAside`/`resolveOverlaps` hilang; `detachCell` hanya dari `.act-free`.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: sudut resize dalam grid, detach eksplisit via tombol"
```
