async function testTalabat() {
  try {
    const res = await fetch('https://www.talabat.com/uae/restaurants/4179/al-rashidiya-3', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    console.log('Status:', res.status);
    const html = await res.text();
    console.log('HTML length:', html.length);
    const hasNextData = html.includes('__NEXT_DATA__');
    console.log('Has __NEXT_DATA__:', hasNextData);

    if (hasNextData) {
      const match = html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s);
      if (match) {
        const json = JSON.parse(match[1]);
        console.log('BuildId:', json.buildId);
        console.log('Page:', json.page);
        console.log('PageProps keys:', Object.keys(json.props?.pageProps || {}));
        const vendors = json.props?.pageProps?.data?.vendors || [];
        console.log('Vendors count:', vendors.length);
        console.log('Total vendors in Al Rashidia 3:', json.props?.pageProps?.data?.totalVendors);
        if (vendors.length > 0) {
          console.log('Sample vendor name:', vendors[0].name);
          console.log('Sample vendor slug:', vendors[0].slug);
          console.log('Sample delivery fee:', vendors[0].deliveryFee);
          console.log('Sample rating:', vendors[0].rating);
          console.log('Sample cuisines:', vendors[0].cuisines?.map(c => c.name));
          console.log('Sample vendor keys:', Object.keys(vendors[0]));
        }
      }
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

testTalabat();
