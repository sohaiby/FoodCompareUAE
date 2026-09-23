"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
async function testDeliverooUrls() {
    const urls = [
        'https://deliveroo.ae/restaurants/ajman/rashidiya',
        'https://deliveroo.ae/en/restaurants/ajman/bustan?fulfillment_method=DELIVERY&geohash=thx2mxb2f9jy',
        'https://deliveroo.ae/en/restaurants/ajman/rashidiya?fulfillment_method=DELIVERY&geohash=wn5r6',
        'https://deliveroo.ae/en/restaurants/dubai/downtown?fulfillment_method=DELIVERY',
        'https://deliveroo.ae/order'
    ];
    for (const url of urls) {
        try {
            console.log(`\n--- Fetching: ${url} ---`);
            const res = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-GB,en;q=0.9'
                }
            });
            console.log(`Status: ${res.status}`);
            const text = await res.text();
            console.log(`Length: ${text.length}`);
            const match = text.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s);
            if (match) {
                const json = JSON.parse(match[1]);
                const keys = Object.keys(json.props?.pageProps || {});
                console.log(`Found __NEXT_DATA__! pageProps keys: ${keys.join(', ')}`);
                // Save snippet to scratch
                fs_1.default.writeFileSync('src/scratch/deliveroo_found.json', JSON.stringify({ url, pageProps: json.props?.pageProps }, null, 2));
            }
            else {
                if (text.includes('cf-mitigated') || text.includes('challenges.cloudflare.com')) {
                    console.log('Blocked by Cloudflare challenge');
                }
                else {
                    console.log('No __NEXT_DATA__, preview:', text.slice(0, 200).replace(/\n/g, ' '));
                }
            }
        }
        catch (err) {
            console.error(`Error for ${url}:`, err.message);
        }
    }
}
testDeliverooUrls();
