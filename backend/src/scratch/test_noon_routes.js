async function testNoonRoutes() {
  const routes = [
    'https://food.noon.com/uae-en/restaurants',
    'https://food.noon.com/uae-en/ajman',
    'https://food.noon.com/uae-en/c/restaurants',
    'https://food.noon.com/uae-en/search?q=shawarma',
    'https://food.noon.com/uae-en/outlets'
  ];

  for (const r of routes) {
    try {
      const res = await fetch(r, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });
      console.log(r, '->', res.status);
      if (res.ok) {
        const text = await res.text();
        const nextData = text.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s);
        if (nextData) {
          const json = JSON.parse(nextData[1]);
          console.log('Page:', json.page, 'Keys in pageProps:', Object.keys(json.props?.pageProps || {}));
          if (json.props?.pageProps?.catalog) console.log('Catalog found!');
          if (json.props?.pageProps?.outlets) console.log('Outlets count:', json.props?.pageProps?.outlets.length);
        }
      }
    } catch (e) {
      console.error(e.message);
    }
  }
}

testNoonRoutes();
