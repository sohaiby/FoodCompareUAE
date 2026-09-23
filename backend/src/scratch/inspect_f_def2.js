async function inspectFDef2() {
  const sUrl = 'https://food.noon.com/_next/static/chunks/pages/_app-ff6bc53fd7f9f3e3.js';
  const res = await fetch(sUrl);
  const text = await res.text();
  
  const idx = text.indexOf('createAddress:u');
  if (idx !== -1) {
    console.log(text.slice(idx, idx + 300));
  }
}

inspectFDef2();
