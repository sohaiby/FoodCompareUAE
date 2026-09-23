async function inspectDeliverooApp() {
  const sUrl = 'https://deliveroo.ae/_next/static/chunks/pages/_app-c9acf834500843e4.js';
  const res = await fetch(sUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const text = await res.text();
  const matches = text.match(/https?:\/\/[a-zA-Z0-9.-]+\.deliveroo\.[a-z]+[^"']*/g) || [];
  console.log('Deliveroo URLs in app chunk:', [...new Set(matches)]);
}

inspectDeliverooApp();
