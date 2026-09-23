import fs from 'fs';

async function inspectMenuState() {
  const url = 'https://www.talabat.com/uae/restaurant/767354/karachi-tarka-restaurant-and-cafeteria-al-rashidiya-3?aid=6782';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    }
  });

  const html = await res.text();
  const m = html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s);
  if (!m) return;

  const json = JSON.parse(m[1]);
  const menuState = json.props?.pageProps?.initialMenuState;
  console.log('initialMenuState keys:', Object.keys(menuState || {}));
  
  const rest = menuState?.restaurant;
  console.log('Restaurant:', {
    id: rest?.id,
    name: rest?.name,
    rating: rest?.rate,
    totalRatings: rest?.totalRatings,
    deliveryFee: rest?.deliveryFee,
    deliveryFeeType: rest?.deliveryChargesType,
    deliveryMinutes: rest?.deliveryMinutes,
    slug: rest?.slug,
    logo: rest?.logo,
    heroImage: rest?.heroImage,
    cuisines: rest?.cuisineNames || rest?.cuisines
  });

  const menu = menuState?.menu;
  console.log('Menu sections count:', menu?.categories?.length || menu?.sections?.length || 0);
  const categories = menu?.categories || menu?.sections || [];
  categories.slice(0, 3).forEach((cat: any) => {
    console.log(`\nCategory: ${cat.name || cat.title} (${cat.items?.length || 0} items)`);
    (cat.items || []).slice(0, 3).forEach((item: any) => {
      console.log(`  - ${item.name} | AED ${item.price} | ${item.description || ''}`);
    });
  });
}

inspectMenuState();
