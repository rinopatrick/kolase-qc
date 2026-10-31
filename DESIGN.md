---
name: Kolase QC
description: Field documentation tool for QC photo collages ready to print.
colors:
  ink: "#131B21"
  ink-soft: "#55616B"
  paper: "#FFFFFF"
  canvas: "#D5DBDE"
  night-0: "#0D1114"
  night-1: "#13191D"
  night-2: "#1A2228"
  night-3: "#232E36"
  line: "#2A343C"
  line-strong: "#3A4750"
  accent-teal: "#2DD4BF"
  accent-deep: "#0D9488"
  accent-ink: "#04211D"
  warn: "#F59E0B"
  danger: "#F0716F"
  text-light: "#ECEFF1"
  text-dim: "#9AA6B0"
typography:
  display:
    fontFamily: "Segoe UI, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 800
    lineHeight: 1.2
  title:
    fontFamily: "Segoe UI, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Segoe UI, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "Segoe UI, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 400
  mono:
    fontFamily: "ui-monospace, Cascadia Code, monospace"
    fontSize: "11px"
rounded:
  sm: "8px"
  md: "10px"
  lg: "12px"
spacing:
  sm: "8px"
  md: "12px"
  lg: "16px"
components:
  button-primary:
    backgroundColor: "{colors.accent-teal}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.sm}"
    padding: "0 16px"
    height: "38px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-light}"
    rounded: "{rounded.sm}"
    height: "38px"
  input-field:
    backgroundColor: "{colors.night-0}"
    textColor: "{colors.text-light}"
    rounded: "{rounded.sm}"
    padding: "10px"
---

# Design System: Kolase QC

## Overview

**Creative North Star: "Arsip Lapangan"**

Sistem yang terasa seperti map arsip yang terawat: label jelas, grid teratur, semua terbaca sekilas di bawah cahaya menyilaukan lokasi proyek. Malam gelap untuk chrome (hemat baterai AMOLED, tidak menyilaukan), kertas putih jujur untuk kanvas (yang tampil = yang tercetak). Satu aksen teal dipakai hemat: hanya aksi utama dan status penting.

Personality: tenang, presisi, tidak banyak bicara. Kepadatan sedang — panel kaya kontrol tapi tiap grup punya napas. Estetika menolak dekorasi: tanpa kaca, tanpa gradien, tanpa bayangan tebar — kecuali kaca tunggal di topbar lengket yang memang melayang di atas konten.

**Key Characteristics:**
- Chrome malam solid, kanvas kertas terang — dua dunia yang tidak bercampur.
- Radius dua langkah: kecil (8px) untuk kontrol, besar (10-12px) untuk kartu dan kertas.
- Tipografi satu keluarga sans; mono hanya untuk angka/nomor.
- Aksen teal ≤10% layar: tombol utama, status aktif, nomor terpilih.

## Colors

Palet terkendali: malam netral + kertas putih + satu teal hemat.

### Primary
- **Teal Lapangan** (#2DD4BF): aksi utama (Unduh PDF, tambah), status aktif, nomor slot terpilih. Latar selalu gelap; teks di atasnya hijau-tinta (#04211D).

### Neutral
- **Malam 0-3** (#0D1114 → #232E36): latar chrome, bertingkat dari luar ke dalam. Topbar paling gelap, panel satu tingkat di atasnya, kartu seksi di atas panel.
- **Garis** (#2A343C, kuat #3A4750): pemisah satu-level, bukan dekorasi.
- **Kertas** (#FFFFFF) dan **Meja Kanvas** (#D5DBDE): dunia cetak. Teks di atasnya tinta (#131B21, lunak #55616B).
- **Teks Terang** (#ECEFF1, redup #9AA6B0): di atas malam.

### Named Rules
**The Print Honesty Rule.** Kanvas dan kertas selalu solid terang. Tidak ada efek di atas kertas yang tidak ikut tercetak.
**The Teal Rarity Rule.** Teal hanya untuk aksi yang bisa ditekan dan status yang berubah. Tidak pernah untuk teks statis, ikon pasif, atau hiasan.

## Typography

**Display Font:** Segoe UI semibold-bold (with system-ui fallback)
**Body Font:** Segoe UI (with system-ui, Roboto fallback)
**Label/Mono Font:** ui-monospace, Cascadia Code (hanya angka, nomor slot, kode sesi)

**Character:** Satu keluarga sans untuk semua; hierarki dari bobot dan ukuran, bukan dari jenis huruf.

### Hierarchy
- **Display** (800, 22px, 1.2): kop dokumen di kertas (nama laporan).
- **Title** (700, 15px, 1.3): nama aplikasi, judul kartu modal.
- **Body** (400, 13px, 1.45): label, isi panel, caption foto.
- **Label** (400, 11px): teks bantu, meta halaman, hint.
- **Mono/Data** (monospace, 11px, tabular-nums): nomor slot, metrik topbar, kode sesi P2P, badge ukuran.

### Named Rules
**The One Family Rule.** Tidak ada display face terpisah. Penekanan lewat bobot (700/800) dan ukuran, bukan ganti huruf.

## Layout

Grid aplikasi: panel 308px + stage fleksibel; ≤980px panel jadi laci geser (transform, bukan display) dengan tombol ☰ di topbar. Kanvas: lembar max 860px rata tengah, jarak antar halaman 26px, padding stage 26px/20px. Ritme vertikal: grup rapat (6-10px), antar-seksi renggang (12px+), judul selalu lebih dekat ke isinya daripada ke grup atasnya.

## Elevation & Depth

Sistem flat dengan tonal layering; bayangan tunggal halus hanya untuk memisahkan kertas dari meja dan kartu modal dari malam. Panel, seksi, tombol dalam keadaan diam tidak berbayang.

### Shadow Vocabulary
- **Kertas** (`0 2px 12px rgba(10,22,28,.18)`): lembar di atas meja kanvas.
- **Modal** (`0 12px 40px rgba(0,0,0,.5)`): kartu dialog di atas malam.

### Named Rules
**The Flat-By-Default Rule.** Permukaan diam itu datar. Bayangan hanya muncul sebagai respons (kertas terangkat, modal terbuka, tombol ditekan).

## Shapes

Dua langkah radius: kecil 8px (tombol, input, badge, chip), besar 10-12px (seksi, kartu modal, lembar kertas). Slot foto mengikuti grid kertas: sudut 10px menyatu dengan lembar. Tidak ada pil penuh kecuali toggle switch; tidak ada lingkaran kecuali handle sudut overlay.

## Components

### Buttons
- **Shape:** radius kecil (8px) di semua varian.
- **Primary:** teal solid (#2DD4BF), teks hijau-tinta, padding 0 16px, tinggi 38px (44px di sentuh kasar). Hover: #5EEAD4.
- **Ghost:** transparan, border garis; hover isi panel + border kuat. Tombol topbar biasa ghost; hanya aksi utama yang primary.
- **Focus:** outline 2px teal offset 2px. **Active:** tanpa scale (menghindari goyang layout); umpan balik lewat warna.

### Chips
- **Style:** nomor slot = mono putih di atas pil gelap transparan; badge halaman = teal solid dengan teks tinta.
- **State:** terpilih = teal; default = gelap.

### Cards / Containers
- **Corner Style:** besar (10-12px).
- **Background:** malam-2 di atas malam-1; modal malam-1 solid.
- **Shadow Strategy:** hanya modal dan kertas (lihat Elevation).
- **Border:** garis satu-level (#2A343C); kuat (#3A4750) untuk input.
- **Internal Padding:** 12-13px seksi, 16-18px modal.

### Inputs / Fields
- **Style:** malam-0, border garis kuat, radius kecil, padding 10px, teks 13px.
- **Focus:** border jadi teal; tanpa glow.
- **Error / Disabled:** merah (#F0716F) untuk error; opacity .35 untuk disabled.

### Navigation
Topbar lengket 56px: kaca tunggal (blur 14px di atas konten scroll), tombol ☰ hanya ≤980px, metrik ringkas tanpa boks, grup aksi ghost + satu primary. Panel: seksi lipat vertikal, judul 13px tebal + deskripsi 11px redup; drawer di HP (geser, scrim gelap, fokus kembali ke tombol saat tutup).

### Slot Foto (signature component)
Kotak bernomor: kosong = garis putus-putus di atas terang; terisi = foto gelap + toolbar kaca gelap + caption putih. Nomor mono selalu terlihat. Zoom/pan/putar inline; hapus selalu dengan Urungkan 8 detik, tanpa popup.

## Do's and Don'ts

### Do:
- **Do** pakai teal hanya untuk aksi dan status (The Teal Rarity Rule).
- **Do** jaga kertas solid terang — pratinjau harus jujur (The Print Honesty Rule).
- **Do** samakan radius dalam satu keluarga: 8px kontrol, 10-12px kartu/kertas.
- **Do** samakan tinggi tombol 38px (44px layar sentuh) di semua tempat.
- **Do** tulis angka/nomor/kode dengan mono tabular.

### Don't:
- **Don't** tambah blur/kaca di luar topbar lengket.
- **Don't** pakai gradien untuk teks, tombol, atau latar.
- **Don't** pakai glow/b neon dalam keadaan diam.
- **Don't** pakai huruf serif/display/dekoratif di UI.
- **Don't** pakai emoji sebagai ikon aksi (📷 📲 🗑 adalah teks sementara, bukan ikon).
- **Don't** pakai popup browser (alert/confirm) untuk aksi apa pun.
