async function findDeliverooApis() {
  const res = await fetch('https://deliveroo.ae/en/', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const html = await res.text();
  const scriptRegex = /src="([^"]+\.js)"/g;
  let m;
  const scripts = [];
  while ((m = scriptRegex.exec(html)) !== null) {
    scripts.push(m[1]);
  }
  console.log('Deliveroo scripts:', scripts.length);
  for (const s of scripts) {
    const sUrl = s.startsWith('http') ? s : 'https://deliveroo.ae' + s;
    try {
      const sRes = await fetch(sUrl);
      const text = await sRes.text();
      const apis = text.match(/\/api\/[a-zA-Z0-9/_.-]+/g) || [];
      const consumer = apis.filter(a => a.includes('restaurant') || a.includes('order') || a.includes('consumer') || a.includes('search') || a.includes('location') || a.includes('menu'));
      if (consumer.length > 0) {
        console.log('Script:', sUrl.slice(-25), 'consumer APIs:', [...new Set(consumer)].slice(0, 5));
      }
    } catch (e) {}
  }
}

findDeliverooApis();
