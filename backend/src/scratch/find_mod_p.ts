import fs from 'fs';

async function findModuleP() {
  const url = 'https://prod-website-cdn-2.talabat.com/16cdec22ae1ebf1a0f19868301c4cdd4407bcb59/_next/static/chunks/2895-8268f96da859bcd3.js';
  const res = await fetch(url);
  const text = await res.text();

  // Find where p = is defined or require/import
  const pMatch = text.match(/([a-zA-Z0-9_$]+)\s*=\s*n\(([0-9]+)\)/g);
  console.log('Imports in chunk:', pMatch?.slice(0, 15));

  // Search for the number assigned to p
  const idx = text.indexOf('post("/v3/vendor"');
  console.log('Before post:', text.slice(idx - 1500, idx - 1000));
}

findModuleP();
