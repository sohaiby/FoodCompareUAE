import fs from 'fs';

async function findModuleImports() {
  const url = 'https://prod-website-cdn-2.talabat.com/16cdec22ae1ebf1a0f19868301c4cdd4407bcb59/_next/static/chunks/2895-8268f96da859bcd3.js';
  const res = await fetch(url);
  const text = await res.text();

  // Find the exact code line around post("/v3/vendor"
  const idx = text.indexOf('post("/v3/vendor"');
  if (idx !== -1) {
    console.log('Surrounding 600 chars:');
    console.log(text.slice(Math.max(0, idx - 400), idx + 200));
  }
}

findModuleImports();
