async function testDeliverooRoutes() {
  const urls = [
    'https://deliveroo.ae/restaurants/ajman/al-rashidiya?geohash=wn5r6',
    'https://deliveroo.ae/restaurants/dubai/downtown-dubai?geohash=thk0w',
    'https://deliveroo.ae/restaurants/dubai/dubai-marina'
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });
      console.log(`URL: ${url} -> Status: ${res.status}`);
      if (res.ok) {
        const text = await res.text();
        console.log(`Length: ${text.length}, Has __NEXT_DATA__: ${text.includes('__NEXT_DATA__')}`);
      }
    } catch (e) {
      console.error(e.message);
    }
  }
}

testDeliverooRoutes();
