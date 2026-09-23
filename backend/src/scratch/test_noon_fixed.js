async function testNoonFixed() {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'x-experience': 'food',
    'x-locale': 'en-ae'
  };

  // Test 1: Geo with location object
  try {
    const geoUrl = 'https://food.noon.com/_vs/st/mp-identity-api/serviceable-geo-info/by-location';
    const geoRes = await fetch(geoUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        location: {
          latitude: 25.3995,
          longitude: 55.4455
        }
      })
    });
    console.log('Geo status:', geoRes.status);
    const geoJson = await geoRes.json();
    console.log('Geo response:', JSON.stringify(geoJson, null, 2));
  } catch (e) {
    console.error('Geo error:', e.message);
  }

  // Test 2: Catalog with GET
  try {
    const catUrl = 'https://food.noon.com/_svc/mp-food-api-catalog/api?latitude=25.3995&longitude=55.4455';
    const catRes = await fetch(catUrl, {
      method: 'GET',
      headers
    });
    console.log('Catalog GET status:', catRes.status);
    const text = await catRes.text();
    console.log('Catalog GET length:', text.length);
    console.log('Catalog GET snippet:', text.slice(0, 500));
  } catch (e) {
    console.error('Catalog error:', e.message);
  }
}

testNoonFixed();
