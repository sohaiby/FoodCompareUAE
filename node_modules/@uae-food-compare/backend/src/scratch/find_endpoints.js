async function findEndpoints() {
  const sUrl = 'https://food.noon.com/_next/static/chunks/pages/_app-ff6bc53fd7f9f3e3.js';
  const res = await fetch(sUrl);
  const text = await res.text();
  
  const matches = [...text.matchAll(/(?:\.get|\.post)\((?:`|")([^`"]+)(?:`|")/g)].map(m => m[1]);
  console.log('Get/post calls found:', matches.length);
  console.log('Sample calls:', [...new Set(matches)]);
}

findEndpoints();
