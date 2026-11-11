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
