"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function parseDeliveroo() {
    const url = 'https://deliveroo.ae/restaurants/ajman/rashidiya';
    console.log('Fetching:', url);
    const res = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-GB,en;q=0.9'
        }
    });
    const text = await res.text();
    const match = text.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s);
    if (!match) {
        console.log('No next data found');
        return;
    }
    const json = JSON.parse(match[1]);
    console.log('BuildId:', json.buildId);
    console.log('page:', json.page);
    console.log('pageProps keys:', Object.keys(json.props?.pageProps || {}));
    const pp = json.props?.pageProps;
    // Let's search inside pp for restaurant arrays
    function findArrays(obj, path = '') {
        if (!obj || typeof obj !== 'object')
            return;
        if (Array.isArray(obj)) {
            if (obj.length > 0 && typeof obj[0] === 'object') {
                const sampleKeys = Object.keys(obj[0]).join(', ');
                console.log(`Found array at [${path}] with length ${obj.length}. Item keys: ${sampleKeys.slice(0, 100)}`);
                if (obj[0].name || obj[0].title || obj[0].id || obj[0].uname) {
                    console.log(`  Sample 0:`, JSON.stringify(obj[0]).slice(0, 250));
                }
            }
            return;
        }
        for (const [k, v] of Object.entries(obj)) {
            if (path.split('.').length < 6) {
                findArrays(v, path ? `${path}.${k}` : k);
            }
        }
    }
    findArrays(pp);
}
parseDeliveroo();
