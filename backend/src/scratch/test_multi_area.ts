import fs from 'fs';

async function testComprehensiveIngestion() {
  console.log('--- Scraping all Ajman Area IDs on Talabat ---');
  // Ajman delivery area IDs that deliver to Al Rashidiya 3
  const ajmanAreaIds = [
    { areaId: 4179, slug: 'al-rashidiya-3' },
    { areaId: 6782, slug: 'al-rashidiya-3' },
    { areaId: 4178, slug: 'al-nuaimia' },
    { areaId: 4175, slug: 'corniche' },
    { areaId: 4176, slug: 'al-jurf-1' },
    { areaId: 4177, slug: 'al-jurf-2' }
  ];

  const allTalabatVendors = new Map<string, any>();

  for (const { areaId, slug } of ajmanAreaIds) {
    try {
      const url = `https://www.talabat.com/uae/restaurants/${areaId}/${slug}`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });
      if (res.ok) {
        const html = await res.text();
        const match = html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s);
        if (match) {
          const json = JSON.parse(match[1]);
          const vendors = json.props?.pageProps?.data?.vendors || [];
          console.log(`Talabat Area ${areaId} (${slug}): ${vendors.length} vendors`);
          for (const v of vendors) {
            const name = v.name?.trim();
            if (name && !allTalabatVendors.has(name.toLowerCase())) {
              allTalabatVendors.set(name.toLowerCase(), v);
            }
          }
        }
      }
    } catch (e: any) {
      console.error(`Area ${areaId} failed:`, e.message);
    }
  }

  console.log(`Total Unique Talabat Vendors across Ajman areas: ${allTalabatVendors.size}`);
  
  // Check specific requested restaurants
  console.log(`Has Karachi Tarka in Talabat: ${allTalabatVendors.has('karachi tarka restaurant and cafeteria') || Array.from(allTalabatVendors.keys()).some(k => k.includes('karachi'))}`);
  console.log(`Has B 4 Biryani in Talabat: ${Array.from(allTalabatVendors.keys()).some(k => k.includes('b 4') || k.includes('b-4') || k.includes('b4'))}`);
  console.log(`Has Al Rukn in Talabat: ${Array.from(allTalabatVendors.keys()).some(k => k.includes('rukn'))}`);

  // Test Direct Outlet fetch on Noon for Karachi Tarka
  console.log('\n--- Testing Noon specific outlet fetch ---');
  try {
    const noonRes = await fetch('https://food.noon.com/_svc/mp-food-api-catalog/api/outlet/KRCHTRFS2D', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'x-experience': 'food',
        'x-locale': 'en-ae',
        'x-platform': 'web'
      }
    });
    console.log(`Noon outlet KRCHTRFS2D status: ${noonRes.status}`);
    if (noonRes.ok) {
      const data = await noonRes.json();
      console.log('Noon Karachi Tarka Data:', JSON.stringify(data, null, 2).slice(0, 500));
    }
  } catch (e: any) {
    console.error('Noon outlet failed:', e.message);
  }
}

testComprehensiveIngestion();
