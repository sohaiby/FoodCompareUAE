import fs from 'fs';

async function findDpDef() {
  const url = 'https://prod-website-cdn-2.talabat.com/16cdec22ae1ebf1a0f19868301c4cdd4407bcb59/_next/static/chunks/2895-8268f96da859bcd3.js';
  const res = await fetch(url);
  const text = await res.text();

  // Find all matches for .Dp or Dp =
  const matches = Array.from(text.matchAll(/(.{0,100}Dp.{0,100})/g)).map(m => m[0]);
  console.log('Matches for Dp:', matches);
}

findDpDef();
