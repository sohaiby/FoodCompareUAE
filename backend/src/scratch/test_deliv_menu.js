async function testMenu() {
  const url = 'https://deliveroo.ae/menu/dubai/business-bay/diyar-al-sham-restaurants-and-sweets-business-bay';
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  console.log('Menu status:', res.status);
  const text = await res.text();
  console.log('Length:', text.length);
  const match = text.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s);
  if (match) {
    const json = JSON.parse(match[1]);
    console.log('PageProps keys:', Object.keys(json.props?.pageProps || {}));
    const data = json.props?.pageProps?.initialMenuData || json.props?.pageProps?.data || {};
    console.log('Data keys:', Object.keys(data));
    if (data.restaurant) console.log('Restaurant name:', data.restaurant.name);
  }
}
testMenu();
