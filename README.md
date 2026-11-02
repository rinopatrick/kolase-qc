# Kolase QC — Dokumentasi Foto + Formulir QC

Web app satu file (`index.html`, logo di `assets/qc-doc/`). Tiga mode di tab atas:
**Kolase** (foto siap cetak), **Checklist QC** (GML-EG-02-F-01), **Penyimpangan**
(GML-MT-08-F-01). Tanpa install. Generate Word (.docx) butuh internet sekali
(CDN JSZip); selebihnya offline.

## Cara pakai (semudah mungkin)
1. Buka `index.html` di Chrome/Edge (HP atau laptop).
2. Pilih jumlah foto per halaman (1/2/4/6/8) — slot kosong langsung tampil.
3. **Seret foto dari Explorer langsung ke slot bernomor.**
   Alternatif: klik slot, atau tempel dengan Ctrl+V.
4. Atur tiap foto langsung di selnya:
   - seret foto untuk geser posisi (pan),
   - scroll / slider ＋/− untuk zoom, klik 2× untuk reset,
   - toolbar: keterangan ✎, geser ←/→, putar ⟳, ganti ⇄, hapus ×,
   - grip ⠿ untuk seret pindah posisi antar slot.
   - ↶↷ undo/redo di topbar (atau Ctrl+Z / Ctrl+Y): tambah, hapus, susun,
     caption, zoom, putar, geser foto (maks 50 langkah).
5. Atur kertas (A4/F4/Letter/Legal/A3), portrait/landscape, margin, judul.
6. Klik **Cetak / Simpan PDF** → printer "Save as PDF",
   samakan ukuran kertas & orientasi.

## Formulir QC (baru)
1. Buka tab **Checklist QC** — isi NAMA s/d TTD, centang Passed / Reject / N/A
   per baris + remarks.
2. Tiap ada REJECT → banner muncul + form **Penyimpangan** terisi otomatis
   (nama barang, no form, item reject jadi rincian). Buka tab Penyimpangan,
   lengkapi sebab + tindakan.
3. Unduh **Word (.docx)** — struktur tabel + kop/logo persis dokumen asli —
   atau **PDF / Cetak** lewat dialog print browser (hasil = pratinjau kertas).
4. Data formulir tersimpan otomatis di browser (localStorage).

Dibuat dengan OpenDesign (agent pi) + audit Impeccable detector.
