import fs from 'fs';

async function checkTalabatVendorJs() {
  const url = 'https://prod-website-cdn-2.talabat.com/16cdec22ae1ebf1a0f19868301c4cdd4407bcb59/_next/static/chunks/2895-8268f96da859bcd3.js';
  const res = await fetch(url);
  const text = await res.text();
  console.log('Length:', text.length);

  // Search around /v3/vendor
  const idx = text.indexOf('/v3/vendor');
  if (idx !== -1) {
    console.log('Snippet around /v3/vendor:');
    console.log(text.slice(Math.max(0, idx - 200), idx + 400));
  }

  // Look for any other api paths
  const matches = Array.from(text.matchAll(/https?:\/\/[a-zA-Z0-9.-]+\.talabat\.com[^\s"']*/gi)).map(m => m[0]);
  console.log('API URLs:', Array.from(new Set(matches)));
}

checkTalabatVendorJs();
