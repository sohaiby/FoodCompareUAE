async function extractClientCalls() {
  const res = await fetch('https://food.noon.com/uae-en/', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const html = await res.text();
  const scriptRegex = /src="([^"]+\.js)"/g;
  let m;
  const scripts = [];
  while ((m = scriptRegex.exec(html)) !== null) {
    scripts.push(m[1]);
  }

  for (const s of scripts) {
    const sUrl = s.startsWith('http') ? s : 'https://food.noon.com' + s;
    const sRes = await fetch(sUrl);
    const text = await sRes.text();
    const calls = text.match(/https?:\/\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9_.-]+/g) || [];
    const filtered = calls.filter(c => !c.includes('nooncdn') && !c.includes('w3.org') && !c.includes('google'));
    if (filtered.length > 0) {
      console.log('Script:', sUrl.slice(-20), 'Found calls:', [...new Set(filtered)]);
    }
  }
}

extractClientCalls();
