async function inspectFDef3() {
  const sUrl = 'https://food.noon.com/_next/static/chunks/pages/_app-ff6bc53fd7f9f3e3.js';
  const res = await fetch(sUrl);
  const text = await res.text();
  
  const idx = text.indexOf('createAddress:u');
  if (idx !== -1) {
    // Search backwards for 'f='
    const sub = text.slice(idx - 3000, idx);
    const fIdx = sub.indexOf('f=function');
    const dIdx = sub.indexOf('d=function');
    console.log('fIdx:', fIdx, 'dIdx:', dIdx);
    if (fIdx !== -1) console.log('f def:', sub.slice(fIdx, fIdx + 200));
    if (dIdx !== -1) console.log('d def:', sub.slice(dIdx, dIdx + 200));
  }
}

inspectFDef3();
