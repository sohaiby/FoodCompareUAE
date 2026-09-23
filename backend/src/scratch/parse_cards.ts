import fs from 'fs';

async function parseAllDeliverooCards() {
  const url = 'https://deliveroo.ae/restaurants/ajman/rashidiya';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    }
  });

  const html = await res.text();
  
  // Find all partner-card screen-reader matches
  const regex = /"partner-card(?:-[^"]*)?\.accessibility\.screen-reader":"([^"]+)"/g;
  const cards = [];
  let m;
  while ((m = regex.exec(html)) !== null) {
    cards.push(m[1]);
  }

  console.log(`Found ${cards.length} restaurant cards via screen-reader attribute!`);
  console.log('Sample cards:');
  cards.slice(0, 20).forEach((c, i) => console.log(`${i + 1}. ${c}`));

  // Let's also inspect the surrounding attributes for slugs, links, or IDs
  const snippetIdx = html.indexOf('"partner-card');
  if (snippetIdx !== -1) {
    console.log('\nSample surrounding JSON snippet:');
    console.log(html.slice(snippetIdx - 200, snippetIdx + 600));
  }
}

parseAllDeliverooCards();
