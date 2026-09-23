async function searchApis() {
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
    // Search for api host or gateway
    const apiHostMatches = text.match(/https:\/\/[a-zA-Z0-9.-]+\.noon\.(?:com|delivery)[^"']*/g) || [];
    if (apiHostMatches.length > 0) {
      console.log('Script:', sUrl.slice(-25), 'Api hosts:', [...new Set(apiHostMatches)].slice(0, 10));
    }
  }
}

searchApis();
