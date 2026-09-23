"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function findDeliverooApiEndpoints() {
    const appChunkUrl = 'https://cwa.roocdn.com/_next/static/chunks/pages/_app-3f6c278d87b28a47.js';
    const mainChunkUrl = 'https://cwa.roocdn.com/_next/static/chunks/main-4517ca0479508901.js';
    for (const url of [appChunkUrl, mainChunkUrl]) {
        const res = await fetch(url);
        const code = await res.text();
        console.log(`\nChecked ${url} (${code.length} chars)`);
        const endpoints = Array.from(code.matchAll(/["'](\/(?:orderapp|consumer|api)\/[^"']+)["']/g)).map(m => m[1]);
        console.log('Endpoints found:', Array.from(new Set(endpoints)).slice(0, 20));
    }
}
findDeliverooApiEndpoints();
