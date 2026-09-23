async function findDInstance() {
  const sUrl = 'https://food.noon.com/_next/static/chunks/pages/_app-ff6bc53fd7f9f3e3.js';
  const res = await fetch(sUrl);
  const text = await res.text();
  
  let pos = 0;
  while ((pos = text.indexOf('D(', pos)) !== -1) {
    const chunk = text.slice(pos, pos + 30);
    if (!chunk.includes('null') && !chunk.includes('errors') && !chunk.includes('touched')) {
      console.log('Pos:', pos, text.slice(pos - 100, pos + 200));
    }
    pos += 5;
  }
}

findDInstance();
