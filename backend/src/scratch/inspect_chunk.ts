import fs from 'fs';

async function inspectDeliverooChunk() {
  const url = 'https://cwa.roocdn.com/_next/static/chunks/pages/restaurants/%5Bcity%5D/%5Bneighborhood%5D-47a3f5d0a15a88fb.js';
  const res = await fetch(url);
  const code = await res.text();
  console.log('Chunk length:', code.length);

  // Search for endpoints or paths
  const matches = Array.from(code.matchAll(/["'](\/(?:api|consumer|order|feed|restaurants)[^"']+)["']/g)).map(m => m[1]);
  console.log('Found internal paths:', Array.from(new Set(matches)));

  // Search for roocdn / deliveroo hostnames
  const hosts = Array.from(code.matchAll(/https?:\/\/[a-zA-Z0-9.-]+\.roocdn\.com[^\s"']*/g)).map(m => m[0]);
  console.log('Roo CDN endpoints:', Array.from(new Set(hosts)));

  // Look for query params like geohash or city
  const queries = Array.from(code.matchAll(/geohash|fulfillment_method|neighborhood/g)).map(m => m[0]);
  console.log('Found query tokens:', Array.from(new Set(queries)));

  // Search for occurrences of "fetch" or "post" or "get" around endpoint
  const urlMatches = Array.from(code.matchAll(/([a-zA-Z0-9_/.-]+(?:feed|restaurants|layout|menu)[a-zA-Z0-9_/?=&.-]*)/g))
    .map(m => m[0])
    .filter(s => s.length > 5 && s.includes('/'));
  console.log('Candidate endpoints:', Array.from(new Set(urlMatches)).slice(0, 30));
}

inspectDeliverooChunk();
