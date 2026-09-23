import fs from 'fs';

async function testTalabatNextSearch() {
  const url = 'https://www.talabat.com/nextSearchApi/v3/vendor';
  const payload = {
    latitude: 25.3995,
    longitude: 55.4455,
    country_id: 4, // UAE = 4
    limit: 1000,
    vertical_ids: [0], // 0 = restaurant
    page_number: 1,
    query: ''
  };

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'X-Device-Source': '1',
    'appBrand': '1',
    'sourceApp': 'web',
    'Accept-Language': 'en-US'
  };

  console.log('Sending POST to:', url);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    console.log(`Status: ${res.status}`);
    const text = await res.text();
    console.log(`Response length: ${text.length}`);
    const json = JSON.parse(text);
    console.log('JSON keys:', Object.keys(json));
    
    const vendors = json.result?.vendors || json.vendors || [];
    console.log(`Found ${vendors.length} vendors on Talabat via /nextSearchApi/v3/vendor!`);
    
    const names = vendors.map((v: any) => v.name || v.vendor_name);
    console.log('Sample 10:', names.slice(0, 10));

    console.log('\n--- Checking User Requested Restaurants ---');
    const karachi = vendors.find((v: any) => (v.name || v.vendor_name || '').toLowerCase().includes('karachi'));
    console.log('Karachi Tarka:', karachi ? karachi.name || karachi.vendor_name : 'NOT FOUND');

    const b4 = vendors.find((v: any) => (v.name || v.vendor_name || '').toLowerCase().includes('biryani'));
    console.log('Biryani match (e.g. B 4 Biryani):', b4 ? b4.name || b4.vendor_name : 'NOT FOUND');

    const rukn = vendors.find((v: any) => (v.name || v.vendor_name || '').toLowerCase().includes('rukn'));
    console.log('Al Rukn Al Arabi:', rukn ? rukn.name || rukn.vendor_name : 'NOT FOUND');

    fs.writeFileSync('src/scratch/talabat_vendors.json', JSON.stringify({ count: vendors.length, sample: vendors.slice(0, 10) }, null, 2));
  } catch (e: any) {
    console.error('Failed:', e.message);
  }
}

testTalabatNextSearch();
