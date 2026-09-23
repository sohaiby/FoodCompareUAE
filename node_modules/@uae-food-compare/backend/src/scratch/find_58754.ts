import fs from 'fs';

async function findModule58754() {
  const url = 'https://www.talabat.com/uae/restaurants/4179/al-rashidiya-3';
  const res = await fetch(url);
  const html = await res.text();
  const scripts = Array.from(html.matchAll(/src="([^"]+\.js[^"]*)"/g)).map(m => m[1]);

  for (const s of scripts) {
    const fullUrl = s.startsWith('http') ? s : `https://www.talabat.com${s}`;
    try {
      const sRes = await fetch(fullUrl);
      const sText = await sRes.text();
      const idx = sText.indexOf('58754:');
      if (idx !== -1) {
        console.log(`Found 58754 in ${s}!`);
        console.log(sText.slice(idx, idx + 600));
      }
    } catch (e: any) {}
  }
}

findModule58754();
