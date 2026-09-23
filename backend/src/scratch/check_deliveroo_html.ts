import fs from 'fs';

async function checkDeliverooHtml() {
  const url = 'https://deliveroo.ae/restaurants/ajman/rashidiya';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-GB,en;q=0.9'
    }
  });

  const html = await res.text();
  console.log('HTML length:', html.length);

  // Check for JSON-LD schema
  const jsonLdMatches = Array.from(html.matchAll(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs));
  console.log(`Found ${jsonLdMatches.length} application/ld+json blocks`);
  jsonLdMatches.forEach((m, idx) => {
    try {
      const parsed = JSON.parse(m[1]);
      console.log(`JSON-LD [${idx}] @type:`, parsed['@type'] || (Array.isArray(parsed) ? parsed.map(p => p['@type']) : 'none'));
      if (parsed.itemListElement) {
        console.log(`  itemListElement count: ${parsed.itemListElement.length}`);
        console.log(`  Sample 0:`, parsed.itemListElement[0]);
      }
    } catch (e: any) {
      console.log(`JSON-LD [${idx}] parse error:`, e.message);
    }
  });

  // Check for restaurant links
  const restaurantLinks = Array.from(html.matchAll(/href="(\/(?:en\/)?menu\/[^"]+)"/g)).map(m => m[1]);
  console.log(`Found ${restaurantLinks.length} restaurant menu links:`);
  console.log(restaurantLinks.slice(0, 15));

  // Check for names in headings or text
  const hMatches = Array.from(html.matchAll(/<h[234][^>]*>(.*?)<\/h[234]>/g)).map(m => m[1].replace(/<[^>]+>/g, '').trim());
  console.log(`Sample headings:`, hMatches.slice(0, 20));
}

checkDeliverooHtml();
