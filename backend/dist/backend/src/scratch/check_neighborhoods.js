"use strict";
async function checkDeliverooNeighborhoods() {
    const tests = [
        'https://deliveroo.ae/restaurants/dubai/downtown-dubai',
        'https://deliveroo.ae/restaurants/dubai/downtown',
        'https://deliveroo.ae/restaurants/dubai/dubai-marina',
        'https://deliveroo.ae/restaurants/dubai/business-bay',
        'https://deliveroo.ae/restaurants/dubai/jumeirah-lakes-towers',
        'https://deliveroo.ae/restaurants/sharjah/al-majaz',
        'https://deliveroo.ae/restaurants/abu-dhabi/corniche',
        'https://deliveroo.ae/restaurants/abu-dhabi/al-danah'
    ];
    for (const url of tests) {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
            }
        });
        console.log(`${url} => Status: ${res.status}`);
    }
}
checkDeliverooNeighborhoods();
