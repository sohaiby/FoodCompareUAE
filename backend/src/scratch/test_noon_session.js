async function testNoonSession() {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'x-experience': 'food',
    'x-locale': 'en-ae',
    'x-platform': 'web'
  };

  const geoRes = await fetch('https://food.noon.com/_vs/st/mp-identity-api/serviceable-geo-info/by-location', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      location: {
        lat: 25.1972,
        lng: 55.2744
      }
    })
  });
  console.log('Geo status:', geoRes.status);
  console.log('Set-Cookie headers:', geoRes.headers.get('set-cookie'));
  const geoData = await geoRes.json();

  // Try catalog with x-delivery-zone, x-geo, or cookies
  const catRes = await fetch(`https://food.noon.com/_svc/mp-food-api-catalog/api?lat=25.1972&lng=55.2744&area=${encodeURIComponent(geoData.area)}&cityId=${geoData.cityId}`, {
    headers: {
      ...headers,
      'Cookie': geoRes.headers.get('set-cookie') || '',
      'x-area': geoData.area,
      'x-city-id': String(geoData.cityId)
    }
  });
  console.log('Cat with area status:', catRes.status);
  const text = await catRes.text();
  console.log('Cat response:', text.slice(0, 300));
}

testNoonSession();
