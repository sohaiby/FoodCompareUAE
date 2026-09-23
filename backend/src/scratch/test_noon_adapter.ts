import { noonAdapter } from '../adapters/noon.adapter';

async function testNoon() {
  console.log('Testing NoonAdapter for Al Rashidiya 3, Ajman (25.3995, 55.4455)...');
  const results = await noonAdapter.getRestaurants('wn5r6', 25.3995, 55.4455);
  console.log(`Noon returned ${results.length} restaurants! isMock: ${noonAdapter.isMock}`);
  console.log('Sample 5:');
  console.log(JSON.stringify(results.slice(0, 5), null, 2));
}

testNoon();
