---
name: Kolase QC
description: Field documentation tool for QC photo collages ready to print.
colors:
  chrome: "#F5F6F8"
  surface: "#FFFFFF"
  desk: "#D9DEE5"
  ink: "#151A21"
  ink-soft: "#4B5562"
  ink-faint: "#6B7480"
  line: "#D6DBE2"
  line-strong: "#A8B0BC"
  pen: "#1E3A9E"
  pen-hover: "#172E7E"
  pen-wash: "#E9EDF8"
  pass: "#17663A"
  pass-wash: "#E5F2EA"
  reject: "#B42318"
  reject-wash: "#FBE9E7"
  paper: "#FFFFFF"
  paper-ink: "#131B21"
typography:
  display:
    fontFamily: "Bahnschrift, DIN Alternate, Roboto Condensed, Arial Narrow, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.2
  title:
    fontFamily: "Segoe UI, system-ui, Roboto, sans-serif"
    fontSize: "16px"
    fontWeight: 650
    lineHeight: 1.3
  body:
    fontFamily: "Segoe UI, system-ui, Roboto, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "Segoe UI, system-ui, Roboto, sans-serif"
    fontSize: "12.5px"
    fontWeight: 500
  numeral:
    fontFamily: "Bahnschrift, DIN Alternate, Roboto Condensed, Arial Narrow, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
spacing:
  sm: "8px"
  md: "12px"
  lg: "16px"
components:
  button-primary:
    backgroundColor: "{colors.pen}"
    textColor: "{colors.surface}"
    rounded: "{rounded.sm}"
    padding: "0 14px"
    height: "36px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    height: "36px"
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 10px"
    height: "38px"
---

# Design System: Kolase QC

## Overview

**Creative North Star: "Arsip Terang"**

Map arsip yang terang dan tegas: chrome putih dan abu dingin, garis jelas, terbaca di bawah matahari lokasi proyek. Panel kiri abu muda, meja kerja abu dingin di kanan, kertas putih jujur di atas meja (yang tampil = yang tercetak). Satu biru pulpen untuk aksi utama dan status aktif. Hanya tema terang.

Personality: tenang, presisi, tidak banyak bicara. Kepadatan sedang. Estetika menolak dekorasi: tanpa gradien, tanpa glow, tanpa blur, tanpa kartu bersarang.

**Key Characteristics:**
- Chrome terang solid, kanvas kertas di atas meja abu dingin.
- Radius: 6px kontrol, 8px grup/daftar, 10px modal.
- Angka (nomor slot, halaman, metrik, kode formulir) pakai Bahnschrift, huruf bawaan Windows bergaya DIN. Di Android jatuh ke Roboto Condensed. Tetap offline, tanpa webfont.
- Biru pulpen hanya untuk aksi utama dan status aktif.

## Colors

### Primary
- **Biru Pulpen** (#1E3A9E, hover #172E7E, wash #E9EDF8): tombol Unduh PDF, tab aktif, segmen terpilih, toggle aktif, cincin fokus. Teks di atasnya putih.

### Semantic
- **Passed** (#17663A, wash #E5F2EA) dan **Reject** (#B42318, wash #FBE9E7): khusus status checklist dan penanda bahaya. Terpisah dari aksen.

### Neutral
- **Chrome** (#F5F6F8): panel dan latar umum. **Surface** (#FFFFFF): topbar, input, kartu, modal.
- **Meja** (#D9DEE5): latar kanvas di belakang kertas.
- **Garis** (#D6DBE2, kuat #A8B0BC): pemisah satu-level dan border input.
- **Tinta** (#151A21, lunak #4B5562, samar #6B7480). Kontras teks AA (4.5:1 atau lebih).
- **Kertas** (#FFFFFF) dengan tinta #131B21: dunia cetak, tidak berubah.

### Named Rules
**The Print Honesty Rule.** Kertas selalu solid terang. Tidak ada efek di atas kertas yang tidak ikut tercetak.
**The Pen Rarity Rule.** Biru pulpen hanya untuk aksi utama dan status aktif. Tidak pernah untuk teks statis atau hiasan.

## Typography

**Display/Angka:** Bahnschrift (fallback DIN Alternate, Roboto Condensed, Arial Narrow).
**Body:** Segoe UI (fallback system-ui, Roboto).
**Mono:** hanya kode sesi dan QR.

### Hierarchy
- **Merek** (600, 18px, display): wordmark Kolase dengan stempel QC.
- **Title** (650, 16px): judul kartu modal.
- **Body** (400, 14px, 1.45): label, isi panel, caption.
- **Label** (500, 12.5px): label field, teks bantu.
- **Angka** (600, 15px, tabular-nums): metrik, nomor halaman, nomor slot.

## Layout

Panel 300-308px di kiri + stage fleksibel. Tab mode di topbar. Di 980px ke bawah panel jadi laci geser dengan tombol menu di topbar. Target sentuh 44px di layar sentuh (pointer:coarse). Tidak ada geser ke samping.

## Elevation & Depth

Datar secara default. Bayangan hanya untuk kertas di atas meja (`0 1px 2px rgba(20,30,45,.12), 0 6px 18px rgba(20,30,45,.10)`) dan modal (`0 18px 50px rgba(10,15,25,.35)`).

## Components

### Buttons
- **Primary:** biru pulpen solid, teks putih, tinggi 36px (44px sentuh), radius 6px. Hanya satu per layar (Unduh PDF).
- **Ghost / line:** transparan atau putih dengan border kuat; hover abu muda.
- **Focus:** outline 2px biru pulpen offset 2px.

### Inputs
Putih, border #A8B0BC, radius 6px, tinggi 38px (44px sentuh). Fokus: border dan cincin biru pulpen.

### Segmen, toggle, slider
Segmen terpilih: wash biru + garis bawah 2px. Toggle aktif: track biru, kenop putih. Slider: `accent-color` biru, trek 4px.

### Ikon
Satu set ikon garis (stroke 1.8, ujung bulat, 16px) lewat sprite `<symbol>`. Tanpa emoji atau glyph teks sebagai ikon.

### Slot Foto
Kosong = garis putus-putus di atas abu terang; terisi = foto + toolbar gelap transparan. Nomor selalu terlihat. Geometri kertas tidak diubah.

## Do's and Don'ts

### Do:
- **Do** pakai biru pulpen hanya untuk aksi utama dan status aktif.
- **Do** jaga kertas solid terang.
- **Do** pakai hijau/merah hanya untuk Passed/Reject.
- **Do** tulis angka dengan Bahnschrift tabular.

### Don't:
- **Don't** pakai gradien, glow, atau blur.
- **Don't** pakai kartu bersarang.
- **Don't** pakai eyebrow huruf kapital ber-tracking atau nomor dekoratif 01/02/03.
- **Don't** pakai emoji sebagai ikon.
- **Don't** pakai popup browser (alert/confirm).
