# Brief eksekusi redesign UI "Arsip Terang" (untuk subagent)

Kamu mengerjakan SATU task dari redesign UI Kolase QC. Baca file ini sampai habis sebelum mengubah apa pun.

## Lokasi
- Worktree: `C:\Users\patri\.t3\projects\kolase-qc-ui` (branch `feat/ui-light`). Kerja HANYA di sini. Jangan sentuh `C:\Users\patri\.t3\projects\kolase-qc` (repo utama/prod).
- App = satu file `index.html` (CSS di `<style>`, markup statis, JS di `<script>` inline).
- Kontrak visual (sudah di-approve user): `docs/ui-redesign/mock-arsip-terang.html`. Baca CSS-nya: token warna, ukuran, font, pola komponen. Ikuti persis. Ikon SVG: pakai set `<symbol>` di mock (stroke 1.8, round, 16px).
- Server lokal (sudah jalan): lama `http://localhost:8765/kolase-qc/index.html`, baru `http://localhost:8765/kolase-qc-ui/index.html`.

## Aturan keras (user trauma fungsi rusak saat refine UI)
1. **Fungsi tidak boleh berubah.** Tiap tombol/input/select/aksi yang ada tetap ada, id sama, `data-*` sama, value/min/max/default sama, urutan & value `<option>` sama. Tidak ada kontrol dihapus, tidak ada fitur baru.
2. **JS (`<script>` inline) jangan diubah.** Satu-satunya pengecualian: mengganti teks/ikon di dalam string HTML template di JS (mis. emoji `⤵` → SVG inline, `'✕'` → SVG) atau selector bila markup statis dipindah. Tiap baris JS yang kamu ubah WAJIB dicatat di `docs/specs/ui-parity-allow.md`: tulis baris barunya persis (satu baris kode per baris, dalam blok ```js) + baris lamanya + alasan satu kalimat. Jangan ubah logika, nama fungsi, urutan, kondisi, event.
3. Sebelum ganti teks tombol statis (mis. `⬇ PDF` → ikon + "Unduh PDF"), grep JS: kalau JS menulis `textContent`/`innerHTML` tombol itu, teks statis boleh diubah tapi pastikan hasil tulisan JS tetap tampil benar. Jangan ubah JS-nya.
4. **Dunia kertas beku**: geometri `.sheet`/`.sheet-inner`/`.slot`/`.doc-head`/grid/gap/padding/aspect, `@media print`, `@page`, `.qcsheet*` jangan diubah. Boleh ubah warna/gaya afordans editor yang tidak ikut cetak: `.num`, toolbar slot (`.tbtn`), placeholder slot kosong, handle, `.divider`, `.divbadge`, border slot (tanpa ubah ukuran/box: pakai `outline` atau border dengan lebar sama). Bayangan kertas boleh.
5. CDN `<script src>` jangan disentuh. Tanpa webfont/dependensi baru. Font: `--font-d` Bahnschrift stack, `--font-b` Segoe UI/system stack (lihat mock). Hapus pemakaian mono untuk label kecil kecuali kode sesi/QR.
6. Nol `alert(`/`confirm(` baru.

## Anti-slop (wajib)
- Tanpa emoji sebagai ikon di mana pun (☰ ↩ ↪ ＋ ⬇ ✓ ⚠ ✕ 🖼 ▯ ▭ ⤵ dll) → SVG garis dari set mock.
- Biru pulpen `#1E3A9E` hanya untuk aksi utama (Unduh PDF) + status aktif (tab aktif, segmen terpilih, toggle on, fokus). Bukan untuk teks statis/dekorasi.
- Passed hijau `#17663A`, Reject merah `#B42318` — warna makna, terpisah dari aksen.
- Tanpa kartu bersarang, tanpa gradien, tanpa glow, tanpa blur (kecuali yang sudah ada fungsinya), tanpa eyebrow ALL-CAPS ber-tracking, tanpa nomor dekoratif 01/02/03.
- Radius: 6px kontrol, 8px grup/list, 10px modal. Tinggi kontrol 36-38px desktop, 44px di `(pointer:coarse)`.
- Kontras teks AA (≥4.5:1). Fokus terlihat: outline 2px biru pulpen offset 2px.

## Gerbang wajib sebelum selesai
1. `node docs/specs/check-ui-parity.js` → harus `GREEN`. Kalau `a)` gagal karena baris JS yang memang kamu ubah sesuai aturan 2, catat di allowlist lalu jalankan ulang. Jangan pernah "memperbaiki" gerbang dengan mengubah skrip gerbang.
2. `grep -c "alert(\|confirm(" index.html` tidak bertambah dari baseline.
3. Kalau tool browser (`mcp__Claude_Browser__*`) tersedia: buka URL baru, cek desktop 1440 dan 375px, pastikan tidak ada yang rusak/bertumpuk/overflow horizontal, dan klik-uji kontrol area kamu (klik tab, toggle, segmen, buka modal) — pastikan aksi tetap jalan dan tidak ada error di console. Reset viewport ke desktop setelahnya.
4. Commit satu kali: `git add -A && git commit -m "style(ui): <task> arsip terang"` dengan baris akhir `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. Jangan push, jangan merge.

## Laporan akhir (singkat)
- Apa yang diubah (selector/area), daftar baris JS yang diallowlist (kalau ada), hasil gerbang (tempel baris GREEN/RED), hasil cek browser, dan hal yang belum beres/ragu.
