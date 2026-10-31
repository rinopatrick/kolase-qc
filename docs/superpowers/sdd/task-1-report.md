# Task 1 — Toast inline + kontrol visible: REPORT

Status: DONE
Commit: a7a283e04a80e2c6776ba0e11f150241dab6d55e (`feat: toast inline + kontrol base visible`)
File tersentuh: `index.html` saja (+25 baris, 0 hapus). docs/plans tidak di-commit.

## Perubahan
- CSS `#toast` / `#toast.show` / `#toast button` (verbatim brief).
- Base desktop `.slot .toolbar,.slot .zctl{opacity:.38}` + hover/sel/focus penuh.
- `.slot .hd` base `.38` + hover/sel/focus penuh.
- `.divider::after` base samar + hover/on aksen.
- `<div id="toast" role="status" aria-live="polite" hidden></div>` setelah `#print-root`.
- `window.toast(msg, opts)` global setelah definisi `$` (verbatim, ada action button + auto-hide 4200ms).

## Verifikasi
- Pola `id="toast"` → baris 446; `window.toast` → baris 591; `opacity:.38` → baris 51, 197, 200, 254, 256. Ketiga pola ketemu.
- `node --check` skrip inline gabungan: SYNTAX_OK.
- `pointer:coarse` count tetap 5 — tidak ada duplikat aturan coarse-pointer baru; blok existing (muncul belakangan di baris 256+) tetap menang di HP.
- `git diff --stat`: 1 file, +25/-0; perilaku PDF tidak tersentuh; tidak ada alert/confirm baru.

## Concerns
- Pre-existing: `.divider::after` base lama `background:transparent` kini tertimpa samar — sesuai brief, disengaja.
- Browser render tidak dibuka (headless tidak tersedia); verifikasi sebatas grep pola + cek sintaks.
