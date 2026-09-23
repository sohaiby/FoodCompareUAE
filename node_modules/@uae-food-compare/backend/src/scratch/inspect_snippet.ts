import fs from 'fs';

async function inspectHtmlSnippet() {
  const url = 'https://deliveroo.ae/restaurants/ajman/rashidiya';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-GB,en;q=0.9'
    }
  });

  const html = await res.text();
  // Find where "Popular brands" appears
  const idx = html.indexOf('Popular brands');
  if (idx !== -1) {
    console.log('Snippet around Popular brands:');
    console.log(html.slice(idx, idx + 2000));
  } else {
    console.log('Not found');
  }

  // Also look for links with /menu/
  const menuLinks = Array.from(html.matchAll(/href="([^"]*menu[^"]*)"/g)).map(m => m[1]);
  console.log('All links with "menu":', menuLinks.slice(0, 10));

  // Look for any links with /restaurants/
  const restLinks = Array.from(html.matchAll(/href="(\/(?:en\/)?restaurants\/[^"]+)"/g)).map(m => m[1]);
  console.log('All links with "/restaurants/":', restLinks.slice(0, 20));
}

inspectHtmlSnippet();
