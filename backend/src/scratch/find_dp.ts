import fs from 'fs';

async function findDpFunction() {
  const url = 'https://prod-website-cdn-2.talabat.com/16cdec22ae1ebf1a0f19868301c4cdd4407bcb59/_next/static/chunks/2895-8268f96da859bcd3.js';
  const res = await fetch(url);
  const text = await res.text();
  
  // Search for Dp = or Dp:
  const dpMatches = Array.from(text.matchAll(/Dp\s*[:=]\s*([^,}]+)/g)).map(m => m[0]);
  console.log('Dp occurrences:', dpMatches.slice(0, 10));

  // Search for axios.create or similar
  const axiosMatches = Array.from(text.matchAll(/create\s*\(\s*\{[^}]+\}/g)).map(m => m[0]);
  console.log('Axios create configs:', axiosMatches.slice(0, 5));
}

findDpFunction();
