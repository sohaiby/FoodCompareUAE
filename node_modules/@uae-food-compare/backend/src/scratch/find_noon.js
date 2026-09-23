async function findNoon() {
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

  console.log('Scripts found:', scripts.length);
  for (const s of scripts) {
    const sUrl = s.startsWith('http') ? s : 'https://food.noon.com' + s;
    try {
      const sRes = await fetch(sUrl);
      const text = await sRes.text();
      // Look for api endpoints
      const matches = text.match(/["'](\/(?:api|_next|gateway|catalog)[^"']+)["']/g) || [];
      const interesting = matches.filter(url => url.includes('outlet') || url.includes('restaurant') || url.includes('search') || url.includes('feed') || url.includes('catalog'));
      if (interesting.length > 0) {
        console.log('Script:', sUrl.slice(-30), 'Matches:', [...new Set(interesting)].slice(0, 5));
      }
      const fullUrlMatches = text.match(/["'](https:\/\/[^"']*(?:noon|api)[^"']*(?:food|outlet|restaurant)[^"']*)["']/g) || [];
      if (fullUrlMatches.length > 0) {
        console.log('Full URLs in script:', sUrl.slice(-30), [...new Set(fullUrlMatches)].slice(0, 5));
      }
    } catch (e) {}
  }
}

findNoon();
