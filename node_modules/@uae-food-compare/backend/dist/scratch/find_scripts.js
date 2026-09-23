"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function findDeliverooScripts() {
    const url = 'https://deliveroo.ae/restaurants/ajman/rashidiya';
    const res = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
        }
    });
    const html = await res.text();
    const scripts = Array.from(html.matchAll(/src="([^"]+\.js[^"]*)"/g)).map(m => m[1]);
    console.log(`Found ${scripts.length} scripts:`);
    console.log(scripts.slice(0, 10));
    // Let's also search the HTML for any api URLs
    const apiUrls = Array.from(html.matchAll(/(https?:\/\/[a-zA-Z0-9.-]+(?:api|roo|consumer)[a-zA-Z0-9.-]*[^\s"'>]*)/gi)).map(m => m[1]);
    console.log('API / CDN URLs in HTML:', Array.from(new Set(apiUrls)));
}
findDeliverooScripts();
