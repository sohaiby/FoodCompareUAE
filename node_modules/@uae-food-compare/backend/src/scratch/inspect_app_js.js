import fs from 'fs';

async function inspectAppJs() {
  const sUrl = 'https://food.noon.com/_next/static/chunks/pages/_app-ff6bc53fd7f9f3e3.js';
  const res = await fetch(sUrl);
  const text = await res.text();
  
  // Find strings with 'http' or 'noon' or 'api'
  const matches = text.match(/"[^"]*(?:gateway|catalog|api|food)[^"]*"/g) || [];
  console.log('Matches count:', matches.length);
  const unique = [...new Set(matches)].filter(m => m.length > 5 && m.length < 80);
  console.log('Sample matches:', unique.slice(0, 30));
}

inspectAppJs();
