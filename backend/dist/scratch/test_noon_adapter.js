"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const noon_adapter_1 = require("../adapters/noon.adapter");
async function testNoon() {
    console.log('Testing NoonAdapter for Al Rashidiya 3, Ajman (25.3995, 55.4455)...');
    const results = await noon_adapter_1.noonAdapter.getRestaurants('wn5r6', 25.3995, 55.4455);
    console.log(`Noon returned ${results.length} restaurants! isMock: ${noon_adapter_1.noonAdapter.isMock}`);
    console.log('Sample 5:');
    console.log(JSON.stringify(results.slice(0, 5), null, 2));
}
testNoon();
