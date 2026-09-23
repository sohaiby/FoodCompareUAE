import fs from 'fs';

async function investigateTalabat() {
  console.log('--- Testing Talabat pages ---');
  
  // Test pages 1 to 5 for Al Rashidiya 3 (Area 4179 and Area 6782)
  const areaIds = [4179, 6782, 4178, 4175];
  
  for (const aid of areaIds) {
    console.log(`\nChecking Talabat Area ID: ${aid}...`);
    try {
      const url = `https://www.talabat.com/uae/restaurants/${aid}/al-rashidiya-3`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });
      const html = await res.text();
      const match = html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s);
      if (match) {
        const json = JSON.parse(match[1]);
        const vendors = json.props?.pageProps?.data?.vendors || [];
        const totalCount = json.props?.pageProps?.data?.totalCount || vendors.length;
        console.log(`Area ${aid}: status ${res.status}, initial vendors: ${vendors.length}, totalCount: ${totalCount}`);
        
        // Let's check for specific restaurants
        const names = vendors.map((v: any) => v.name);
        console.log(`Sample 5: ${names.slice(0, 5).join(' | ')}`);
        console.log(`Has Karachi Tarka: ${names.some((n: string) => n.toLowerCase().includes('karachi'))}`);
        console.log(`Has B 4 Biryani: ${names.some((n: string) => n.toLowerCase().includes('biryani'))}`);
        console.log(`Has Al Rukn: ${names.some((n: string) => n.toLowerCase().includes('rukn'))}`);
        
        // Let's inspect pageProps keys to see how pagination is handled
        const buildId = json.buildId;
        console.log(`buildId: ${buildId}`);
        
        // Let's test Next.js data route with page=2
        const nextDataUrl = `https://www.talabat.com/_next/data/${buildId}/uae/restaurants/${aid}/al-rashidiya-3.json?page=2`;
        const nextRes = await fetch(nextDataUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'x-nextjs-data': '1'
          }
        });
        console.log(`Next.js Data page=2 status: ${nextRes.status}`);
        if (nextRes.ok) {
          const nextJson = await nextRes.json();
          const p2Vendors = nextJson.pageProps?.data?.vendors || [];
          console.log(`page=2 vendors count: ${p2Vendors.length}`);
          const p2Names = p2Vendors.map((v: any) => v.name);
          console.log(`page 2 sample: ${p2Names.slice(0, 5).join(' | ')}`);
        }
      }
    } catch (e: any) {
      console.error(`Error for area ${aid}:`, e.message);
    }
  }
}

async function investigateNoon() {
  console.log('\n--- Testing Noon Catalog Pagination ---');
  const headers: Record<string, string> = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'x-experience': 'food',
    'x-locale': 'en-ae',
    'x-platform': 'web'
  };
  let cookies: string[] = [];

  const updateCookies = (res: Response) => {
    const raw = res.headers.get('set-cookie');
    if (raw) {
      raw.split(/,(?=[^;]+=[^;]+)/).forEach((p) => {
        cookies.push(p.split(';')[0].trim());
      });
    }
  };

  const geoRes = await fetch('https://food.noon.com/_vs/st/mp-identity-api/serviceable-geo-info/by-location', {
    method: 'POST',
    headers,
    body: JSON.stringify({ location: { lat: 25.3995, lng: 55.4455 } })
  });
  updateCookies(geoRes);
  const geoData = await geoRes.json();

  const setLocRes = await fetch('https://food.noon.com/_vs/st/mp-identity-api/address/set-location', {
    method: 'POST',
    headers: { ...headers, 'Cookie': cookies.join('; ') },
    body: JSON.stringify({
      location: geoData.location || { lat: 25.3995, lng: 55.4455 },
      area: geoData.area,
      cityId: geoData.cityId
    })
  });
  updateCookies(setLocRes);

  // Test catalog with page or limit
  for (const page of [1, 2, 3]) {
    const catUrl = `https://food.noon.com/_svc/mp-food-api-catalog/api?page=${page}&limit=50`;
    const catRes = await fetch(catUrl, {
      headers: { ...headers, 'Cookie': cookies.join('; ') }
    });
    console.log(`Noon catalog page=${page} status: ${catRes.status}`);
    if (catRes.ok) {
      const json = await catRes.json();
      const outlets = (json.results || []).filter((r: any) => r.outletCode && r.name);
      console.log(`Page ${page} outlets: ${outlets.length}, total: ${json.total || json.count || 'N/A'}`);
      const names = outlets.map((o: any) => o.name);
      console.log(`Has Karachi Tarka: ${names.some((n: string) => n.toLowerCase().includes('karachi'))}`);
      if (names.some((n: string) => n.toLowerCase().includes('karachi'))) {
        const found = outlets.find((o: any) => o.name.toLowerCase().includes('karachi'));
        console.log(`Found Karachi Tarka on Noon!`, JSON.stringify(found, null, 2));
      }
    }
  }
}

async function run() {
  await investigateTalabat();
  await investigateNoon();
}

run();
