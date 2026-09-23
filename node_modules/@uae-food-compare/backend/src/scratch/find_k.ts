import fs from 'fs';

async function findKVar() {
  const url = 'https://prod-website-cdn-2.talabat.com/16cdec22ae1ebf1a0f19868301c4cdd4407bcb59/_next/static/chunks/pages/_app-6b2afe35f0d55d8a.js';
  const res = await fetch(url);
  const text = await res.text();
  const idx = text.indexOf('41043:function');
  const endIdx = text.indexOf('85110:function', idx);
  const modText = text.slice(idx, endIdx);

  // Search for k = or k=
  const matches = Array.from(modText.matchAll(/([a-zA-Z0-9_$]+)\s*=\s*(?:o\.env\.[a-zA-Z0-9_$]+|"[^"]+"|[0-9]+)/g)).map(m => m[0]);
  console.log('Matches in module 41043:');
  console.log(matches);
}

findKVar();
