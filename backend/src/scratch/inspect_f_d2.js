async function inspectFD2() {
  const sUrl = 'https://food.noon.com/_next/static/chunks/pages/_app-ff6bc53fd7f9f3e3.js';
  const res = await fetch(sUrl);
  const text = await res.text();
  
  const idx = text.indexOf('getAreaFromLocation:');
  if (idx !== -1) {
    console.log(text.slice(idx - 1600, idx - 600));
  }
}

inspectFD2();
