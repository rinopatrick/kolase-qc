# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Pekerja lapangan (HP Android, di lokasi, tangan kotor/terburu-buru) dan staf kantor (laptop, merapikan + mencetak). Satu alur: foto di lapangan, dokumen final di kantor.

## Product Purpose
Susun foto dokumentasi QC jadi halaman kolase siap cetak (PDF) dalam hitungan menit. Sukses = dari foto berserakan ke PDF rapi tanpa belajar alat baru.

## Positioning
Satu file HTML, tanpa install, tanpa internet (kecuali kirim HP→laptop via P2P). Kertas fisik (A4/F4/Letter/Legal/A3) sebagai unit kerja, bukan kanvas abstrak.

## Operating Context
Lokasi proyek (debu, cahaya menyilaukan, sarung tangan), lalu meja kantor (printer, arsip). Bahasa Indonesia. Dokumen QC adalah bukti legal — hasil cetak harus persis pratinjau.

## Capabilities and Constraints
Tambah foto (klik/seret/tempel/kamera/QR dari HP), atur per slot (pan/zoom/putar/caption/pindah/hapus), pola 1/2/3B/3S/4/6/8 per halaman, orientasi per halaman, divider tarik, kotak bebas overlay, undo/redo, unduh PDF jsPDF 200DPI (campur P+L gabung), cetak browser fallback, pending-hapus 8 detik, foto persisten IndexedDB. Tanpa alert/confirm. Tanpa akun/server.

Formulir QC: tab Checklist QC (12 baris Passed/Reject/N-A + remarks, kop GML-EG-02-F-01) + tab Penyimpangan (auto-isi dari item REJECT, kop GML-MT-08-F-01). Pratinjau kertas A4 mirip dokumen asli. Unduh .docx via JSZip (struktur tabel + kop/logo persis template) atau PDF/cetak via print browser. State formulir di localStorage `kolase-qc-formulir`. Generate .docx butuh CDN JSZip sekali (online); selebihnya offline.

## Brand Commitments
Nama "Kolase QC", aksen biru pulpen (#1E3A9E). Tidak ada logo/brandbook lain yang mengikat.

## Evidence on Hand
index.html (implementasi berjalan), index-legacy.html (versi sebelum redesign), .impeccable/critique + screenshot fix.

## Product Principles
1. Cepat dan aman: tiap aksi destruktif bisa diurungkan, tiap aksi butuh ≤2 ketuk.
2. Kertas jujur: yang tampil di layar = yang keluar di printer.
3. Lapangan dulu: target sentuh 44px, bisa dipakai satu tangan, HP kentang tetap jalan.
4. Tanpa kejutan: tidak ada popup browser, tidak ada data hilang diam-diam.

## Accessibility & Inclusion
Kontras AA, keyboard bisa dipakai penuh, tombol ≥44px di layar sentuh.
