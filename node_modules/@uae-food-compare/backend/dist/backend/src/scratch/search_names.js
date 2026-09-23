async function searchRestaurantsInHtml() {
    const url = 'https://deliveroo.ae/restaurants/ajman/rashidiya';
    const res = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
        }
    });
    const html = await res.text();
    const testNames = [
        'KFC', 'McDonald', 'Hardee', 'Subway', 'Pizza', 'Maraheb', 'Laffah',
        'ChicKing', 'Domino', 'Papa John', 'Paul', 'Starbucks', 'Al Farooj', 'Falafil'
    ];
    for (const name of testNames) {
        const idx = html.indexOf(name);
        if (idx !== -1) {
            console.log(`Found "${name}" at index ${idx}:`);
            console.log(html.slice(Math.max(0, idx - 100), idx + 200).replace(/\n/g, ' '));
        }
        else {
            console.log(`Not found: "${name}"`);
        }
    }
}
searchRestaurantsInHtml();
export {};
