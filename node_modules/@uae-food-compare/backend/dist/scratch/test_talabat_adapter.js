"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const talabat_adapter_1 = require("../adapters/talabat.adapter");
async function testTalabat() {
    console.log('Testing TalabatAdapter for Al Rashidiya 3, Ajman (wn5r6)...');
    const results = await talabat_adapter_1.talabatAdapter.getRestaurants('wn5r6', 25.3995, 55.4455);
    console.log(`Talabat returned ${results.length} restaurants! isMock: ${talabat_adapter_1.talabatAdapter.isMock}`);
    console.log('Sample 5:');
    console.log(JSON.stringify(results.slice(0, 5), null, 2));
}
testTalabat();
