import fs from 'fs';

async function testSpecificUrls() {
  const urls = [
    'https://www.talabat.com/uae/restaurant/767354/karachi-tarka-restaurant-and-cafeteria-al-rashidiya-3?aid=6782',
    'https://www.talabat.com/uae/restaurant/689527/b-4-biryani-restaurant?aid=4175',
    'https://www.talabat.com/uae/restaurant/39238/al-rukn-al-arabi?aid=4179'
  ];

  for (const url of urls) {
    try {
      console.log(`\nFetching ${url}...`);
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });
      console.log(`Status: ${res.status}`);
      if (res.ok) {
        const html = await res.text();
        const m = html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s);
        if (m) {
          const json = JSON.parse(m[1]);
          const rest = json.props?.pageProps?.restaurant || json.props?.pageProps?.data?.restaurant || json.props?.pageProps?.initialMenuState?.restaurant;
          console.log(`Found restaurant metadata! Name:`, rest?.name || json.props?.pageProps?.restaurantName || 'Unknown');
          console.log('pageProps keys:', Object.keys(json.props?.pageProps || {}));
        }
      }
    } catch (e: any) {
      console.error(e.message);
    }
  }
}

testSpecificUrls();
