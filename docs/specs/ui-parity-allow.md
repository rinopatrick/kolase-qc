# JS lines changed for UI-only reasons

Every changed JS line (old and new) must appear here verbatim, with a one-line reason. Reviewed by Opus.

## T1 topbar icons

Baru:
```js
function setDrawer(open){document.body.classList.toggle('drawer',!!open);const b=$('#btnMenu');if(!b)return;b.setAttribute('aria-expanded',open?'true':'false');b.innerHTML=open?'<svg class="i" aria-hidden="true"><use href="#i-x"/></svg>':'<svg class="i" aria-hidden="true"><use href="#i-menu"/></svg>';b.setAttribute('aria-label',open?'Tutup pengaturan':'Buka pengaturan');try{if(open){const p=document.querySelector('.panel');if(p)p.scrollTop=0;}else{const f=document.querySelector('#btnMenu');if(f)f.focus({preventScroll:true});}}catch(e){}}
```
Lama:
```js
function setDrawer(open){document.body.classList.toggle('drawer',!!open);const b=$('#btnMenu');if(!b)return;b.setAttribute('aria-expanded',open?'true':'false');b.textContent=open?'✕':'☰';b.setAttribute('aria-label',open?'Tutup pengaturan':'Buka pengaturan');try{if(open){const p=document.querySelector('.panel');if(p)p.scrollTop=0;}else{const f=document.querySelector('#btnMenu');if(f)f.focus({preventScroll:true});}}catch(e){}}
```
Alasan: tombol #btnMenu kini berisi ikon SVG; JS menulis textContent dengan glyph teks sehingga diganti ikon SVG sprite (logika sama).

## T2 kolase editor chrome

Baru:
```js
if(tb&&!tb.querySelector('[data-t=dock]')){const rs=document.createElement('button');rs.className='tbtn';rs.dataset.t='dock';rs.title='Kembalikan ke pola grid';rs.innerHTML='<svg class="i" aria-hidden="true"><use href="#i-dock"/></svg>';
```
Lama:
```js
if(tb&&!tb.querySelector('[data-t=dock]')){const rs=document.createElement('button');rs.className='tbtn';rs.dataset.t='dock';rs.title='Kembalikan ke pola grid';rs.textContent='⤺';
```
Alasan: ikon dock tombol toolbar slot: glyph teks jadi SVG sprite

Baru:
```js
'<button class="mini" data-act="break" title="Paksa halaman baru"><svg class="i" aria-hidden="true"><use href="#i-break"/></svg>Hal.baru</button>'+(gridShape(p)[0]>=2?'<label class="colw" title="Lebar kolom pertama">Kolom <input type="range" min="30" max="70" value="'+Math.round(colWOf(p)*100)+'" data-colw></label>':'')+'<button class="mini" data-act="even" title="Samakan semua baris + kolom (perbaiki simetris)">Samakan</button><button class="mini danger" data-act="delpage" title="Hapus halaman">Hapus</button></div>'+
```
Lama:
```js
'<button class="mini" data-act="break" title="Paksa halaman baru">⤵ Hal.baru</button>'+(gridShape(p)[0]>=2?'<label class="colw" title="Lebar kolom pertama">Kolom <input type="range" min="30" max="70" value="'+Math.round(colWOf(p)*100)+'" data-colw></label>':'')+'<button class="mini" data-act="even" title="Samakan semua baris + kolom (perbaiki simetris)">Samakan</button><button class="mini danger" data-act="delpage" title="Hapus halaman">Hapus</button></div>'+
```
Alasan: ikon tombol Hal.baru: glyph jadi SVG sprite

Baru:
```js
if(p.forceNew)d.querySelector('.pg').insertAdjacentHTML('beforeend','<svg class="i" aria-hidden="true"><use href="#i-break"/></svg>');
```
Lama:
```js
if(p.forceNew)d.querySelector('.pg').textContent+=' ⤵';
```
Alasan: penanda halaman paksa-baru: glyph teks jadi SVG sprite (insertAdjacentHTML, kondisi sama)

Baru:
```js
el.innerHTML='<span class="num">'+String(globalIndex(p,s)).padStart(2,'0')+'</span><div class="ph broken-ph" tabindex="0"><span class="big"><svg class="i" aria-hidden="true"><use href="#i-alert"/></svg></span><b>Foto gagal dimuat</b><span>File tidak pulih setelah reload (slot '+(si+1)+')</span></div><div class="tools"><button class="tbtn" data-t="del" title="Hapus slot rusak"><svg class="i" aria-hidden="true"><use href="#i-trash"/></svg></button></div>';
```
Lama:
```js
el.innerHTML='<span class="num">'+String(globalIndex(p,s)).padStart(2,'0')+'</span><div class="ph broken-ph" tabindex="0"><span class="big">⚠</span><b>Foto gagal dimuat</b><span>File tidak pulih setelah reload (slot '+(si+1)+')</span></div><div class="tools"><button class="tbtn" data-t="del" title="Hapus slot rusak">🗑</button></div>';
```
Alasan: ikon slot rusak + tombol hapus: emoji jadi SVG sprite

Baru:
```js
'<div class="tools"><button class="tbtn" data-t="zin" title="Zoom +"><svg class="i" aria-hidden="true"><use href="#i-zoom"/></svg></button><button class="tbtn zoom"><input type="range" min="50" max="300" value="'+Math.round(s.zoom*100)+'" data-t="zoom"></button><button class="tbtn" data-t="zout" title="Zoom −"><svg class="i" aria-hidden="true"><use href="#i-zoomout"/></svg></button><button class="tbtn" data-t="rot" title="Putar 90°"><svg class="i" aria-hidden="true"><use href="#i-rot"/></svg></button><button class="tbtn" data-t="rep" title="Ganti foto"><svg class="i" aria-hidden="true"><use href="#i-swap"/></svg></button><button class="tbtn" data-t="left" title="Geser kiri"><svg class="i" aria-hidden="true"><use href="#i-left"/></svg></button><button class="tbtn" data-t="right" title="Geser kanan"><svg class="i" aria-hidden="true"><use href="#i-right"/></svg></button><button class="tbtn" data-t="free" title="Lepas jadi kotak bebas"><svg class="i" aria-hidden="true"><use href="#i-expand"/></svg></button><button class="tbtn" data-t="del" title="Hapus foto"><svg class="i" aria-hidden="true"><use href="#i-trash"/></svg></button></div>';
```
Lama:
```js
'<div class="tools"><button class="tbtn" data-t="zin" title="Zoom +">+</button><button class="tbtn zoom"><input type="range" min="50" max="300" value="'+Math.round(s.zoom*100)+'" data-t="zoom"></button><button class="tbtn" data-t="zout" title="Zoom −">-</button><button class="tbtn" data-t="rot" title="Putar 90°">⟳</button><button class="tbtn" data-t="rep" title="Ganti foto">⇄</button><button class="tbtn" data-t="left" title="Geser kiri">←</button><button class="tbtn" data-t="right" title="Geser kanan">→</button><button class="tbtn" data-t="free" title="Lepas jadi kotak bebas">⤢</button><button class="tbtn" data-t="del" title="Hapus foto">🗑</button></div>';
```
Alasan: ikon toolbar slot (zoom/putar/ganti/geser/bebas/hapus): glyph jadi SVG sprite

Baru:
```js
el.innerHTML='<div class="ph" tabindex="0"><span class="num">'+String(globalIndex(p,s)).padStart(2,'0')+'</span><span class="big"><svg class="i" aria-hidden="true"><use href="#i-plus"/></svg></span><b>Slot '+(si+1)+'</b><span>JPG · PNG · WEBP</span></div>';
```
Lama:
```js
el.innerHTML='<div class="ph" tabindex="0"><span class="num">'+String(globalIndex(p,s)).padStart(2,'0')+'</span><span class="big">＋</span><b>Slot '+(si+1)+'</b><span>JPG · PNG · WEBP</span></div>';
```
Alasan: ikon plus placeholder slot kosong: glyph jadi SVG sprite

## T3 checklist QC + penyimpangan

Baru:
```js
  return '<div class="qcseg" data-row="'+idx+'"><button data-v="passed" class="'+(r.st==='passed'?'on-p':'')+'"><svg class="i" aria-hidden="true"><use href="#i-check"/></svg>Passed</button><button data-v="rejected" class="'+(r.st==='rejected'?'on-r':'')+'"><svg class="i" aria-hidden="true"><use href="#i-x"/></svg>Reject</button><button data-v="na" class="'+(r.st==='na'?'on-n':'')+'">N/A</button></div>';
```
Lama:
```js
  return '<div class="qcseg" data-row="'+idx+'"><button data-v="passed" class="'+(r.st==='passed'?'on-p':'')+'">✓ Passed</button><button data-v="rejected" class="'+(r.st==='rejected'?'on-r':'')+'">✕ Reject</button><button data-v="na" class="'+(r.st==='na'?'on-n':'')+'">– N/A</button></div>';
```
Alasan: segmen status: glyph jadi SVG (check/x), teks N/A tanpa tanda minus

Baru:
```js
      h+='<div class="qcrow"><div><div class="plab"><b>'+esc(r.no)+'</b><span>'+esc(r.label)+'</span></div>'
```
Lama:
```js
      h+='<div class="qcrow"><div><div class="plab"><b>'+esc(r.no)+'</b> · '+esc(r.label)+'</div>'
```
Alasan: nomor dan label baris checklist dipisah jadi <b> + <span> agar bisa jadi kolom nomor

Baru:
```js
    if(rej.length){h+='<div class="qcwarn"><svg class="i" aria-hidden="true"><use href="#i-alert"/></svg><b>'+rej.length+' item REJECTED</b>: '+esc(rej.map(r=>r.no+' '+r.label).join('; '))+'.<br>Form penyimpangan sudah terisi otomatis — buka tab <b>Penyimpangan</b> untuk melengkapi lalu generate Word/PDF.</div>';}
```
Lama:
```js
    if(rej.length){h+='<div class="qcwarn">⚠ <b>'+rej.length+' item REJECTED</b>: '+esc(rej.map(r=>r.no+' '+r.label).join('; '))+'.<br>Form penyimpangan sudah terisi otomatis — buka tab <b>Penyimpangan</b> untuk melengkapi lalu generate Word/PDF.</div>';}
```
Alasan: banner REJECT: emoji peringatan jadi SVG alert

Baru:
```js
    h+='<div class="qcbtnrow"><button class="chipbtn teal" id="q_docx"><svg class="i" aria-hidden="true"><use href="#i-file"/></svg>Word Checklist (.docx)</button><button class="chipbtn" id="q_pdf"><svg class="i" aria-hidden="true"><use href="#i-print"/></svg>PDF / Cetak Checklist</button><button class="chipbtn dangerb" id="q_goto_dev">Lanjut ke Penyimpangan<svg class="i" aria-hidden="true"><use href="#i-right"/></svg></button><button class="chipbtn" id="q_reset">Reset</button></div></div>';
```
Lama:
```js
    h+='<div class="qcbtnrow"><button class="chipbtn teal" id="q_docx">⬇ Word Checklist (.docx)</button><button class="chipbtn" id="q_pdf">🖨 PDF / Cetak Checklist</button><button class="chipbtn dangerb" id="q_goto_dev">Lanjut ke Penyimpangan →</button><button class="chipbtn" id="q_reset">Reset</button></div></div>';
```
Alasan: tombol aksi form checklist: emoji jadi SVG sprite

Baru:
```js
    if(rej.length){h+='<div class="qcwarn"><svg class="i" aria-hidden="true"><use href="#i-alert"/></svg>Terhubung ke checklist: <b>'+rej.length+' REJECT</b> ('+esc(rej.map(r=>r.no+' '+r.label).join('; '))+'). Rincian di bawah terisi otomatis — sesuaikan bila perlu.</div>';}
```
Lama:
```js
    if(rej.length){h+='<div class="qcwarn">Terhubung ke checklist: <b>'+rej.length+' REJECT</b> ('+esc(rej.map(r=>r.no+' '+r.label).join('; '))+'). Rincian di bawah terisi otomatis — sesuaikan bila perlu.</div>';}
```
Alasan: banner penyimpangan: tambah ikon alert SVG

Baru:
```js
    h+='<div class="qcbtnrow"><button class="chipbtn teal" id="d_docx"><svg class="i" aria-hidden="true"><use href="#i-file"/></svg>Word Penyimpangan (.docx)</button><button class="chipbtn" id="d_pdf"><svg class="i" aria-hidden="true"><use href="#i-print"/></svg>PDF / Cetak Penyimpangan</button><button class="chipbtn" id="d_auto"><svg class="i" aria-hidden="true"><use href="#i-undo"/></svg>Isi ulang otomatis dari checklist</button><button class="chipbtn" id="d_back"><svg class="i" aria-hidden="true"><use href="#i-left"/></svg>Kembali ke Checklist</button></div></div>';
```
Lama:
```js
    h+='<div class="qcbtnrow"><button class="chipbtn teal" id="d_docx">⬇ Word Penyimpangan (.docx)</button><button class="chipbtn" id="d_pdf">🖨 PDF / Cetak Penyimpangan</button><button class="chipbtn" id="d_auto">↺ Isi ulang otomatis dari checklist</button><button class="chipbtn" id="d_back">← Kembali ke Checklist</button></div></div>';
```
Alasan: tombol aksi form penyimpangan: emoji/panah jadi SVG sprite
