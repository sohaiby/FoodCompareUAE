async function inspectCaller() {
  const sUrl = 'https://food.noon.com/_next/static/chunks/pages/_app-ff6bc53fd7f9f3e3.js';
  const res = await fetch(sUrl);
  const text = await res.text();
  
  const idx = text.indexOf('_svc/mp-food-api-catalog/api');
  if (idx !== -1) {
    console.log('Snippet before and after:');
    console.log(text.slice(idx - 600, idx + 800));
  }
}

inspectCaller();
