async function checkCatalogChunk() {
  const res = await fetch('https://food.noon.com/uae-en/', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const html = await res.text();
  const scriptRegex = /src="([^"]+\.js)"/g;
  let m;
  const scripts = [];
  while ((m = scriptRegex.exec(html)) !== null) {
    if (m[1].includes('catalog')) scripts.push(m[1]);
  }
  console.log('Catalog chunks:', scripts);
  for (const s of scripts) {
    const sUrl = s.startsWith('http') ? s : 'https://food.noon.com' + s;
    const sRes = await fetch(sUrl);
    const text = await sRes.text();
    console.log('Chunk length:', text.length);
    const apiCalls = text.match(/_svc\/[a-zA-Z0-9/_.-]+/g) || [];
    console.log('API calls in chunk:', [...new Set(apiCalls)]);
  }
}

checkCatalogChunk();
