async function parseNoonModules() {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'x-experience': 'food',
    'x-locale': 'en-ae',
    'x-platform': 'web'
  };
  let cookies = [];
  function update(res) {
    const raw = res.headers.get('set-cookie');
    if (raw) raw.split(/,(?=[^;]+=[^;]+)/).forEach(p => cookies.push(p.split(';')[0].trim()));
  }
  const coords = { lat: 25.3995, lng: 55.4455 };
  const geoRes = await fetch('https://food.noon.com/_vs/st/mp-identity-api/serviceable-geo-info/by-location', {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ location: coords })
  });
  update(geoRes);
  const geoData = await geoRes.json();
  const setRes = await fetch('https://food.noon.com/_vs/st/mp-identity-api/address/set-location', {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json', 'Cookie': cookies.join('; ') },
    body: JSON.stringify({ location: geoData.location || coords, area: geoData.area, cityId: geoData.cityId })
  });
  update(setRes);
  const catRes = await fetch('https://food.noon.com/_svc/mp-food-api-catalog/api', {
    headers: { ...headers, 'Cookie': cookies.join('; ') }
  });
  const catJson = await catRes.json();
  const modules = catJson.results[0]?.modules || [];
  console.log('Total modules in result 0:', modules.length);
  for (const m of modules) {
    console.log('Module type:', m.type, 'name:', m.name, 'keys:', Object.keys(m));
    if (m.data) {
      console.log('  Data length:', m.data.length, 'first item:', m.data[0]?.name || m.data[0]?.title);
    }
  }
}
parseNoonModules();
