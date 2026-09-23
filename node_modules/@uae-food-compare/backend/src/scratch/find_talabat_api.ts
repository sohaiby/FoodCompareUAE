import fs from 'fs';

async function findTalabatApi() {
  const url = 'https://www.talabat.com/uae/restaurants/4179/al-rashidiya-3';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    }
  });

  const html = await res.text();
  const scriptMatches = Array.from(html.matchAll(/src="([^"]+\.js[^"]*)"/g)).map(m => m[1]);
  console.log('Talabat scripts count:', scriptMatches.length);

  // Search for API hostnames or endpoints in HTML
  const apiUrls = Array.from(html.matchAll(/https?:\/\/[a-zA-Z0-9.-]+\.talabat\.com[^\s"'>]*/gi)).map(m => m[0]);
  console.log('Talabat URLs in HTML:', Array.from(new Set(apiUrls)).slice(0, 10));

  // Let's check some chunks
  for (const s of scriptMatches.slice(0, 15)) {
    const fullUrl = s.startsWith('http') ? s : `https://www.talabat.com${s}`;
    try {
      const sRes = await fetch(fullUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
        }
      });
      const sText = await sRes.text();
      const endpoints = Array.from(sText.matchAll(/["'](\/(?:api|v[0-9]|restaurants|delivery)[^"']+)["']/g)).map(m => m[1]);
      if (endpoints.length > 0) {
        console.log(`\nEndpoints in ${s}:`, Array.from(new Set(endpoints)).slice(0, 10));
      }
    } catch (e: any) {}
  }
}

findTalabatApi();
