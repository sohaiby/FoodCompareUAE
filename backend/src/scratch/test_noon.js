async function testNoonFood() {
  const urls = [
    'https://food.noon.com/uae-en/',
    'https://api.noon.com/food/restaurants',
    'https://food.noon.com/_next/data'
  ];

  try {
    const res = await fetch('https://food.noon.com/uae-en/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    console.log('Noon Food home status:', res.status, 'Url:', res.url);
    const html = await res.text();
    console.log('HTML length:', html.length);
    console.log('Has __NEXT_DATA__:', html.includes('__NEXT_DATA__'));

    if (html.includes('__NEXT_DATA__')) {
      const match = html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s);
      if (match) {
        const json = JSON.parse(match[1]);
        console.log('Noon BuildId:', json.buildId);
        console.log('Noon page:', json.page);
        console.log('Noon PageProps keys:', Object.keys(json.props?.pageProps || {}));
      }
    }
  } catch (err) {
    console.error('Noon error:', err.message);
  }
}

testNoonFood();
