import fs from 'fs';

async function printModule41043() {
  const url = 'https://prod-website-cdn-2.talabat.com/16cdec22ae1ebf1a0f19868301c4cdd4407bcb59/_next/static/chunks/pages/_app-6b2afe35f0d55d8a.js';
  const res = await fetch(url);
  const text = await res.text();
  const idx = text.indexOf('41043:function');
  console.log(text.slice(idx, idx + 1500));
}

printModule41043();
