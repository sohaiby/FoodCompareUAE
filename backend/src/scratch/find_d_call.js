async function findDCall() {
  const sUrl = 'https://food.noon.com/_next/static/chunks/pages/_app-ff6bc53fd7f9f3e3.js';
  const res = await fetch(sUrl);
  const text = await res.text();
  
  // Find calls to D(
  const matches = [...text.matchAll(/D\([a-zA-Z0-9_$, ]+\)/g)].map(m => m[0]);
  console.log('Calls to D():', matches);
  const idx = text.indexOf('D(e,t)');
  if (idx !== -1) {
    console.log(text.slice(idx - 300, idx + 300));
  }
}

findDCall();
