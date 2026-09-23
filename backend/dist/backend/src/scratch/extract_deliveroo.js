async function extractDeliverooDetails() {
    const url = 'https://deliveroo.ae/restaurants/ajman/rashidiya';
    const res = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
        }
    });
    const html = await res.text();
    // Pattern matching each partner block
    // Let's find blocks containing partner-card
    const cardRegex = /"partner-card(?:-[^"]*)?\.accessibility\.screen-reader":"([^"]+)",\s*"partner-card(?:-[^"]*)?\.action":"([^"]+)"/g;
    let match;
    const parsed = [];
    while ((match = cardRegex.exec(html)) !== null) {
        const rawText = match[1];
        const actionUrl = decodeURIComponent(match[2].replace(/\\u0026/g, '&'));
        // Extract restaurant_href
        const hrefMatch = actionUrl.match(/restaurant_href=([^&]+)/);
        const href = hrefMatch ? decodeURIComponent(hrefMatch[1]) : '';
        // Extract partner_drn_id
        const idMatch = actionUrl.match(/partner_drn_id=([^&]+)/);
        const partnerId = idMatch ? idMatch[1] : '';
        // Parse screen-reader text: e.g. "Laffah Restaurant. Delivers at 15. Spend AED 50, get free delivery."
        // Or: "Maraheb Restaurant. 1.0 km. Delivers at 20. Rated 3.7 from 35 reviews."
        const parts = rawText.split('. ');
        const name = parts[0]?.trim();
        let rating = 4.5;
        let reviews = 50;
        let offer = '';
        for (const part of parts.slice(1)) {
            const rateMatch = part.match(/Rated\s+([0-9.]+)(?:\s+from\s+([0-9]+)\s+reviews)?/i);
            if (rateMatch) {
                rating = parseFloat(rateMatch[1]);
                if (rateMatch[2])
                    reviews = parseInt(rateMatch[2], 10);
            }
            else if (part.includes('off') || part.includes('free delivery') || part.includes('Buy 1') || part.includes('Offers')) {
                offer = part.trim();
            }
        }
        parsed.push({
            partnerId,
            name,
            slug: href.replace(/^\/menu\/[^\/]+\/[^\/]+\//, '').replace(/^\/menu\/[^\/]+\//, '').replace(/^\/menu\//, '') || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            href,
            rating,
            reviewCount: reviews,
            offer,
            rawText
        });
    }
    // Deduplicate by name or partnerId
    const unique = new Map();
    for (const item of parsed) {
        if (!unique.has(item.name)) {
            unique.set(item.name, item);
        }
    }
    const results = Array.from(unique.values());
    console.log(`Successfully extracted ${results.length} unique restaurants!`);
    console.log('Sample results:');
    console.log(JSON.stringify(results.slice(0, 10), null, 2));
}
extractDeliverooDetails();
export {};
