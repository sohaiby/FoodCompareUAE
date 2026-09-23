async function inspectNoonApi() {
  const endpoints = [
    'https://food.noon.com/api/catalog',
    'https://food.noon.com/api/outlets',
    'https://food.noon.com/api/restaurants'
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json, text/plain, */*'
        },
        body: JSON.stringify({
          latitude: 25.3995,
          longitude: 55.4455
        })
      });
      console.log('Endpoint:', ep, 'Status:', res.status);
      const text = await res.text();
      console.log('Response length:', text.length);
      try {
        const json = JSON.parse(text);
        console.log('JSON keys:', Object.keys(json));
        if (json.data) console.log('Data keys:', Object.keys(json.data));
        if (json.outlets) console.log('Outlets count:', json.outlets.length);
        if (json.restaurants) console.log('Restaurants count:', json.restaurants.length);
        console.log('Sample snippet:', JSON.stringify(json).slice(0, 300));
      } catch (e) {
        console.log('Raw text snippet:', text.slice(0, 300));
      }
    } catch (err) {
      console.error(err.message);
    }
  }
}

inspectNoonApi();
