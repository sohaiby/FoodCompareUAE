import fs from 'fs';

async function findModuleNum() {
  const url = 'https://prod-website-cdn-2.talabat.com/16cdec22ae1ebf1a0f19868301c4cdd4407bcb59/_next/static/chunks/2895-8268f96da859bcd3.js';
  const res = await fetch(url);
  const text = await res.text();

  const idx = text.indexOf('post("/v3/vendor"');
  // Find the function start before idx
  const funcStart = text.lastIndexOf('function(n,t,e){', idx);
  console.log('Function start at:', funcStart);
  console.log('First 500 chars of that function:');
  console.log(text.slice(funcStart, funcStart + 500));
}

findModuleNum();
