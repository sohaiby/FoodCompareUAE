import fs from 'fs';

async function testTalabatVendorApi() {
  const candidateHosts = [
    'https://api.talabat.com',
    'https://www.talabat.com/api',
    'https://services.talabat.com',
    'https://mobile.talabat.com'
  ];

  const payload = {
    latitude: 25.3995,
    longitude: 55.4455,
    country_id: 1,
    limit: 100,
    vertical_ids: [1],
    page_number: 1
  };

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'x-device-source': 'web'
  };

  for (const host of candidateHosts) {
    for (const path of ['/v3/vendor', '/api/v3/vendor', '/v2/vendor', '/v1/vendor']) {
      const url = `${host}${path}`;
      try {
        console.log(`Trying ${url}...`);
        const res = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });
        console.log(`Status: ${res.status}`);
        if (res.ok) {
          const text = await res.text();
          console.log(`SUCCESS! Response length: ${text.length}`);
          const json = JSON.parse(text);
          console.log('Result keys:', Object.keys(json.result || json));
          const vendors = json.result?.vendors || json.vendors || [];
          console.log(`Returned ${vendors.length} vendors!`);
          console.log('Sample 5:', vendors.slice(0, 5).map((v: any) => v.name));
          
          // Check for Karachi Tarka, B 4 Biryani, Al Rukn
          const names = vendors.map((v: any) => v.name?.toLowerCase());
          console.log('Has Karachi Tarka:', names.some((n: string) => n.includes('karachi')));
          console.log('Has B 4 Biryani:', names.some((n: string) => n.includes('biryani')));
          console.log('Has Al Rukn:', names.some((n: string) => n.includes('rukn')));
          return;
        }
      } catch (e: any) {
        console.error(`Error:`, e.message);
      }
    }
  }
}

testTalabatVendorApi();
