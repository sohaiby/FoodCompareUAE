import { talabatAdapter } from '../adapters/talabat.adapter';
async function testTalabat() {
    console.log('Testing TalabatAdapter for Al Rashidiya 3, Ajman (wn5r6)...');
    const results = await talabatAdapter.getRestaurants('wn5r6', 25.3995, 55.4455);
    console.log(`Talabat returned ${results.length} restaurants! isMock: ${talabatAdapter.isMock}`);
    console.log('Sample 5:');
    console.log(JSON.stringify(results.slice(0, 5), null, 2));
}
testTalabat();
