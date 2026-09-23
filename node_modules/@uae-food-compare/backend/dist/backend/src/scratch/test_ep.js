async function testDeliverooEndpoints() {
    const endpoints = [
        'https://deliveroo.ae/orderapp/v1/session',
        'https://deliveroo.ae/consumer/addresses/api/location_routing?lat=25.3995&lon=55.4455',
        'https://deliveroo.ae/consumer/menus/graphql/'
    ];
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-GB,en;q=0.9'
    };
    for (const ep of endpoints) {
        try {
            console.log(`\nTesting ${ep}...`);
            const res = await fetch(ep, { headers });
            console.log(`Status: ${res.status}`);
            const text = await res.text();
            console.log(`Body:`, text.slice(0, 300));
        }
        catch (e) {
            console.error(e.message);
        }
    }
}
testDeliverooEndpoints();
export {};
