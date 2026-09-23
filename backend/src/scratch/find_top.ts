import fs from 'fs';

async function findTopImports() {
  const url = 'https://prod-website-cdn-2.talabat.com/16cdec22ae1ebf1a0f19868301c4cdd4407bcb59/_next/static/chunks/2895-8268f96da859bcd3.js';
  const res = await fetch(url);
  const text = await res.text();

  console.log('Top 1000 characters:');
  console.log(text.slice(0, 1000));
}

findTopImports();
