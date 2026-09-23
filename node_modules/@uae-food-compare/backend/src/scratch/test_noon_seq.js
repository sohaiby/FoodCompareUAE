async function testNoonFullSequence() {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'x-experience': 'food',
    'x-locale': 'en-ae',
    'x-platform': 'web'
  };

  let cookies = [];

  function updateCookies(res) {
    const raw = res.headers.get('set-cookie');
    if (raw) {
      // Split multiple cookies if present
      const parts = raw.split(/,(?=[^;]+=[^;]+)/);
      for (const p of parts) {
        const pair = p.split(';')[0].trim();
        cookies.push(pair);
      }
    }
  }

  function getCookieHeader() {
    return cookies.join('; ');
  }

  // Coordinates: Downtown Dubai (Burj Khalifa)
  const coords = { lat: 25.1972, lng: 55.2744 };

  console.log('Step 1: serviceable-geo-info...');
  const geoRes = await fetch('https://food.noon.com/_vs/st/mp-identity-api/serviceable-geo-info/by-location', {
    method: 'POST',
    headers: { ...headers, 'Cookie': getCookieHeader() },
    body: JSON.stringify({ location: coords })
  });
  console.log('Geo status:', geoRes.status);
  updateCookies(geoRes);
  const geoData = await geoRes.json();
  console.log('Geo data:', geoData.area, 'CityId:', geoData.cityId, 'isServiceable:', geoData.isServiceable);

  console.log('Step 2: address/set-location...');
  const setLocRes = await fetch('https://food.noon.com/_vs/st/mp-identity-api/address/set-location', {
    method: 'POST',
    headers: { ...headers, 'Cookie': getCookieHeader() },
    body: JSON.stringify({
      location: geoData.location || coords,
      area: geoData.area,
      cityId: geoData.cityId
    })
  });
  console.log('Set-location status:', setLocRes.status);
  updateCookies(setLocRes);
  const setLocData = await setLocRes.text();
  console.log('Set-location response:', setLocData.slice(0, 300));

  console.log('Step 3: get catalog/api...');
  const catRes = await fetch('https://food.noon.com/_svc/mp-food-api-catalog/api', {
    method: 'GET',
    headers: { ...headers, 'Cookie': getCookieHeader() }
  });
  console.log('Catalog status:', catRes.status);
  updateCookies(catRes);
  const catText = await catRes.text();
  console.log('Catalog response length:', catText.length);
  try {
    const catJson = JSON.parse(catText);
    console.log('Catalog keys:', Object.keys(catJson));
    if (catJson.outlets) console.log('Outlets count:', catJson.outlets.length);
    if (catJson.sections) console.log('Sections count:', catJson.sections.length);
    if (catJson.data) console.log('Data keys:', Object.keys(catJson.data));
    console.log('Sample snippet:', JSON.stringify(catJson).slice(0, 500));
  } catch (e) {
    console.log('Snippet:', catText.slice(0, 500));
  }
}

testNoonFullSequence();
