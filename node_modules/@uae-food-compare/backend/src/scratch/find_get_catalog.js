async function findGetCatalog() {
  const sUrl = 'https://food.noon.com/_next/static/chunks/pages/_app-ff6bc53fd7f9f3e3.js';
  const res = await fetch(sUrl);
  const text = await res.text();
  
  let pos = 0;
  while ((pos = text.indexOf('getCatalog', pos)) !== -1) {
    console.log('Found getCatalog at:', pos);
    console.log(text.slice(pos - 100, pos + 250));
    pos += 10;
  }
}

findGetCatalog();
