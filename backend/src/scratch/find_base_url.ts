import fs from 'fs';

async function findTalabatBaseUrl() {
  const url = 'https://prod-website-cdn-2.talabat.com/16cdec22ae1ebf1a0f19868301c4cdd4407bcb59/_next/static/chunks/pages/_app-6b2afe35f0d55d8a.js';
  const res = await fetch(url);
  const text = await res.text();
  console.log('App chunk length:', text.length);

  // Search for baseURL or NEXT_PUBLIC_ or api
  const matches = Array.from(text.matchAll(/https?:\/\/[a-zA-Z0-9.-]+\.talabat\.com[^\s"']*/gi)).map(m => m[0]);
  console.log('Found Talabat domains in _app:', Array.from(new Set(matches)));

  // Search for baseURL:
  const baseMatches = Array.from(text.matchAll(/baseURL\s*:\s*["']([^"']+)["']/g)).map(m => m[1]);
  console.log('baseURL values:', Array.from(new Set(baseMatches)));
}

findTalabatBaseUrl();
