"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSeedData = generateSeedData;
exports.runSeed = runSeed;
const shared_1 = require("@uae-food-compare/shared");
const index_1 = require("./index");
function generateSeedData() {
    // 1. Al Rashidiya 3, Ajman (wn5r6) Authentic Restaurants
    const ajmanRestaurants = [
        {
            id: 'rest-laffah',
            name: 'Laffah Restaurant',
            slug: 'laffah-restaurant-ajman',
            cuisines: ['Shawarma', 'Arabic', 'Fast Food', 'Middle Eastern'],
            rating: 4.8,
            reviewCount: 3840,
            addressSummary: 'Al Rashidia 3, Near Fish Market Roundabout, Ajman',
            phone: '+971 6 747 7000'
        },
        {
            id: 'rest-albaik',
            name: 'ALBAIK',
            slug: 'albaik-uae',
            cuisines: ['Fried Chicken', 'Fast Food', 'Seafood', 'Burgers'],
            rating: 4.9,
            reviewCount: 9210,
            addressSummary: 'City Centre Ajman / Al Rashidia Zone',
            phone: '+971 4 320 1200'
        },
        {
            id: 'rest-maraheb',
            name: 'Maraheb Restaurant',
            slug: 'maraheb-mandi',
            cuisines: ['Mandi', 'Yemeni', 'Khaleeji', 'Grills'],
            rating: 4.7,
            reviewCount: 4120,
            addressSummary: 'Al Nuaimia / Al Rashidia Border, Ajman',
            phone: '+971 6 744 5555'
        },
        {
            id: 'rest-hardees',
            name: "Hardee's",
            slug: 'hardees-uae',
            cuisines: ['Burgers', 'American', 'Fast Food', 'Fries'],
            rating: 4.3,
            reviewCount: 2150,
            addressSummary: 'Sheikh Khalifa Bin Zayed St, Al Rashidia 3, Ajman',
            phone: '+971 600 569 000'
        },
        {
            id: 'rest-cafeteria-alhara',
            name: 'Al Hara Cafeteria',
            slug: 'al-hara-cafeteria',
            cuisines: ['Cafeteria', 'Sandwiches', 'Juices', 'Karak Chai'],
            rating: 4.6,
            reviewCount: 1890,
            addressSummary: 'Al Rashidia 3, Ajman',
            phone: '+971 6 741 2345'
        },
        {
            id: 'rest-papajohns',
            name: "Papa John's Pizza",
            slug: 'papa-johns-pizza',
            cuisines: ['Pizza', 'Italian', 'Wings', 'Fast Food'],
            rating: 4.4,
            reviewCount: 2980,
            addressSummary: 'Near Ajman Stadium, Al Rashidia, Ajman',
            phone: '+971 600 520 001'
        },
        {
            id: 'rest-kfc',
            name: 'KFC',
            slug: 'kfc-ajman-rashidiya',
            cuisines: ['Fried Chicken', 'Burgers', 'Fast Food'],
            rating: 4.2,
            reviewCount: 5400,
            addressSummary: 'Rashidiya Towers, Al Rashidia 3, Ajman',
            phone: '+971 600 522 252'
        },
        {
            id: 'rest-mcdonalds',
            name: "McDonald's",
            slug: 'mcdonalds-ajman-club',
            cuisines: ['Burgers', 'American', 'Fast Food', 'Breakfast'],
            rating: 4.5,
            reviewCount: 6800,
            addressSummary: 'Near Ajman Club, Al Rashidia 3, Ajman',
            phone: '+971 600 540 000'
        },
        {
            id: 'rest-pizzahut',
            name: 'Pizza Hut',
            slug: 'pizza-hut-mall-ajman',
            cuisines: ['Pizza', 'Italian', 'Pasta', 'Wings'],
            rating: 4.3,
            reviewCount: 3200,
            addressSummary: 'Al Rashidia 3, Ajman',
            phone: '+971 600 540 005'
        },
        {
            id: 'rest-subway',
            name: 'Subway',
            slug: 'subway-ajman-rashidiya',
            cuisines: ['Sandwiches', 'Healthy Food', 'Salads', 'Fast Food'],
            rating: 4.4,
            reviewCount: 1750,
            addressSummary: 'Sheikh Rashid Bin Humaid St, Al Rashidia 3, Ajman',
            phone: '+971 6 742 8800'
        },
        {
            id: 'rest-chicking',
            name: 'ChicKing',
            slug: 'chicking-ajman-rashidiya',
            cuisines: ['Fried Chicken', 'Burgers', 'Fast Food', 'Grills'],
            rating: 4.7,
            reviewCount: 1980,
            addressSummary: 'Al Rashidia 3, Ajman',
            phone: '+971 600 545 457'
        },
        {
            id: 'rest-thepizzapiefactory',
            name: 'The Pizza Pie Factory',
            slug: 'the-pizza-pie-factory-ajman',
            cuisines: ['Pizza', 'Fast Food', 'Sandwiches', 'Italian'],
            rating: 4.6,
            reviewCount: 1450,
            addressSummary: 'Al Rashidia 2/3, Ajman',
            phone: '+971 6 748 1122'
        },
        {
            id: 'rest-dominos',
            name: "Domino's Pizza",
            slug: 'dominos-pizza-ajman',
            cuisines: ['Pizza', 'Italian', 'Chicken Wings', 'Desserts'],
            rating: 4.3,
            reviewCount: 3600,
            addressSummary: 'Al Rashidia 3, Ajman',
            phone: '+971 600 541 111'
        },
        {
            id: 'rest-chandnichowk',
            name: 'Chandni Chowk Vegetarian',
            slug: 'chandni-chowk-ajman',
            cuisines: ['Indian', 'Vegetarian', 'Chaat', 'Sweets', 'Thali'],
            rating: 4.6,
            reviewCount: 1820,
            addressSummary: 'Near Lulu Center, Al Rashidia 3, Ajman',
            phone: '+971 6 747 4422'
        },
        {
            id: 'rest-chinchin',
            name: 'Chin Chin',
            slug: 'chin-chin-chinese-ajman',
            cuisines: ['Chinese', 'Asian', 'Noodles', 'Dim Sum'],
            rating: 4.5,
            reviewCount: 2200,
            addressSummary: 'Al Rashidia / Meshairef Zone, Ajman',
            phone: '+971 6 743 3311'
        },
        {
            id: 'rest-falafelmoqren',
            name: 'Falafel Al Moqren',
            slug: 'falafel-al-moqren-ajman',
            cuisines: ['Arabic', 'Falafel', 'Breakfast', 'Sandwiches'],
            rating: 4.5,
            reviewCount: 2400,
            addressSummary: 'Al Rashidia 3, Ajman',
            phone: '+971 6 744 8833'
        },
        {
            id: 'rest-starbucks',
            name: 'Starbucks',
            slug: 'starbucks-ajman-rashidiya',
            cuisines: ['Coffee', 'Beverages', 'Bakery', 'Desserts'],
            rating: 4.6,
            reviewCount: 3100,
            addressSummary: 'Rashidiya Central, Ajman',
            phone: '+971 6 740 5500'
        },
        {
            id: 'rest-baskinrobbins',
            name: 'Baskin Robbins',
            slug: 'baskin-robbins-ajman',
            cuisines: ['Desserts', 'Ice Cream', 'Cakes', 'Shakes'],
            rating: 4.7,
            reviewCount: 1650,
            addressSummary: 'Al Rashidia 3, Ajman',
            phone: '+971 6 746 9911'
        },
        {
            id: 'rest-burgerking',
            name: 'Burger King',
            slug: 'burger-king-ajman',
            cuisines: ['Burgers', 'American', 'Fast Food'],
            rating: 4.3,
            reviewCount: 2900,
            addressSummary: 'Al Rashidia 3, Ajman',
            phone: '+971 600 522 224'
        },
        {
            id: 'rest-erbil-kebab',
            name: 'Kabab Erbil Iraqi Restaurant',
            slug: 'kabab-erbil-iraqi',
            cuisines: ['Iraqi', 'Grills', 'Kebab', 'Middle Eastern'],
            rating: 4.7,
            reviewCount: 2750,
            addressSummary: 'Al Ittihad St, Ajman / Sharjah Border',
            phone: '+971 6 745 6789'
        },
        {
            id: 'rest-filli',
            name: 'FiLLi Tea & Cafe',
            slug: 'filli-cafe-ajman',
            cuisines: ['Karak Chai', 'Cafe', 'Sandwiches', 'Snacks'],
            rating: 4.8,
            reviewCount: 3100,
            addressSummary: 'Al Rashidia 3, Ajman',
            phone: '+971 6 741 8900'
        },
        {
            id: 'rest-albait-almalaki',
            name: 'Al Bait Al Malaki Mandi',
            slug: 'al-bait-al-malaki-mandi',
            cuisines: ['Mandi', 'Yemeni', 'Madfoon', 'Grills'],
            rating: 4.8,
            reviewCount: 3950,
            addressSummary: 'Al Rashidia 3, Sheikh Rashid St, Ajman',
            phone: '+971 6 749 0011'
        },
        {
            id: 'rest-falafil-alrabiah',
            name: 'Falafil Al Rabiah',
            slug: 'falafil-al-rabiah-ajman',
            cuisines: ['Falafel', 'Arabic', 'Hummus', 'Foul'],
            rating: 4.6,
            reviewCount: 1720,
            addressSummary: 'Al Rashidia 3, Ajman',
            phone: '+971 6 744 1212'
        },
        {
            id: 'rest-koshary-elsayed',
            name: 'Koshary El Sayed',
            slug: 'koshary-el-sayed-ajman',
            cuisines: ['Egyptian', 'Koshary', 'Mahshi', 'Fast Food'],
            rating: 4.5,
            reviewCount: 1420,
            addressSummary: 'Al Rashidia 3, Ajman',
            phone: '+971 6 748 9988'
        },
        {
            id: 'rest-arabica',
            name: '% Arabica Coffee',
            slug: 'arabica-coffee-uae',
            cuisines: ['Specialty Coffee', 'Bakery', 'Desserts'],
            rating: 4.9,
            reviewCount: 3400,
            addressSummary: 'Ajman Corniche & Downtown Hubs',
            phone: '+971 6 740 9800'
        },
        {
            id: 'rest-paul',
            name: 'PAUL Bakery & Restaurant',
            slug: 'paul-bakery-ajman',
            cuisines: ['French', 'Bakery', 'Breakfast', 'Pastas', 'Salads'],
            rating: 4.8,
            reviewCount: 2100,
            addressSummary: 'City Centre Ajman / Al Rashidia Zone',
            phone: '+971 6 748 6600'
        },
        {
            id: 'rest-sfc-plus',
            name: 'SFC Plus',
            slug: 'sfc-plus-ajman',
            cuisines: ['Fried Chicken', 'Pizza', 'Burgers', 'Fast Food'],
            rating: 4.4,
            reviewCount: 1850,
            addressSummary: 'Al Rashidia 3, Ajman',
            phone: '+971 600 566 004'
        }
    ];
    // 2. Downtown Dubai (thk0w) Authentic Restaurants
    const dubaiRestaurants = [
        {
            id: 'rest-zuma-dubai',
            name: 'Zuma Dubai',
            slug: 'zuma-dubai',
            cuisines: ['Japanese', 'Sushi', 'Fine Dining', 'Asian'],
            rating: 4.9,
            reviewCount: 8400,
            addressSummary: 'Gate Village 06, DIFC / Downtown Dubai',
            phone: '+971 4 425 5660'
        },
        {
            id: 'rest-czn-burak',
            name: 'CZN Burak Dubai',
            slug: 'czn-burak-dubai',
            cuisines: ['Turkish', 'Middle Eastern', 'Grills', 'Steak'],
            rating: 4.8,
            reviewCount: 7200,
            addressSummary: 'Boulevard Point, Downtown Dubai',
            phone: '+971 800 296 28725'
        },
        {
            id: 'rest-fiveguys-downtown',
            name: 'Five Guys',
            slug: 'five-guys-dubai-mall',
            cuisines: ['Burgers', 'American', 'Fries', 'Milkshakes'],
            rating: 4.7,
            reviewCount: 5600,
            addressSummary: 'The Dubai Mall, Lower Ground, Downtown Dubai',
            phone: '+971 4 380 4117'
        },
        {
            id: 'rest-alhallab-dubai',
            name: 'Al Hallab Restaurant & Sweets',
            slug: 'al-hallab-dubai-mall',
            cuisines: ['Lebanese', 'Grills', 'Arabic Sweets', 'Middle Eastern'],
            rating: 4.7,
            reviewCount: 4900,
            addressSummary: 'The Dubai Mall, Level 2, Downtown Dubai',
            phone: '+971 4 330 8828'
        },
        {
            id: 'rest-dintaifung-downtown',
            name: 'Din Tai Fung',
            slug: 'din-tai-fung-dubai-mall',
            cuisines: ['Taiwanese', 'Dim Sum', 'Dumplings', 'Noodles'],
            rating: 4.9,
            reviewCount: 9100,
            addressSummary: 'The Dubai Mall, Chinatown Level 1, Downtown Dubai',
            phone: '+971 4 362 7500'
        },
        {
            id: 'rest-shakeshack-downtown',
            name: 'Shake Shack',
            slug: 'shake-shack-dubai-mall',
            cuisines: ['Burgers', 'American', 'Frozen Custard', 'Crinkle Fries'],
            rating: 4.6,
            reviewCount: 6100,
            addressSummary: 'The Dubai Mall, 1st Floor, Downtown Dubai',
            phone: '+971 4 419 0370'
        },
        {
            id: 'rest-texasroadhouse',
            name: 'Texas Roadhouse',
            slug: 'texas-roadhouse-dubai-mall',
            cuisines: ['Steakhouse', 'American', 'Ribs', 'Burgers'],
            rating: 4.8,
            reviewCount: 6800,
            addressSummary: 'The Dubai Mall, Lower Ground, Downtown Dubai',
            phone: '+971 4 419 0266'
        }
    ];
    // 3. Dubai Marina (thk0s) Authentic Restaurants
    const marinaRestaurants = [
        {
            id: 'rest-operation-falafel-marina',
            name: 'Operation: Falafel',
            slug: 'operation-falafel-jbr-marina',
            cuisines: ['Arabic', 'Street Food', 'Falafel', 'Shawarma', 'Manakeesh'],
            rating: 4.8,
            reviewCount: 4700,
            addressSummary: 'The Beach, JBR / Dubai Marina',
            phone: '+971 4 424 3000'
        },
        {
            id: 'rest-catch22-marina',
            name: 'Catch 22',
            slug: 'catch22-jbr-marina',
            cuisines: ['Seafood', 'Burgers', 'American', 'International'],
            rating: 4.6,
            reviewCount: 3800,
            addressSummary: 'The Beach, JBR, Dubai Marina',
            phone: '+971 4 424 3057'
        },
        {
            id: 'rest-cheesecakefactory-marina',
            name: 'The Cheesecake Factory',
            slug: 'the-cheesecake-factory-jbr',
            cuisines: ['American', 'Desserts', 'Cheesecake', 'Pasta', 'Steaks'],
            rating: 4.8,
            reviewCount: 8900,
            addressSummary: 'The Beach, JBR, Dubai Marina',
            phone: '+971 4 419 0223'
        },
        {
            id: 'rest-wagamama-marina',
            name: 'Wagamama',
            slug: 'wagamama-marina-mall',
            cuisines: ['Japanese', 'Asian', 'Ramen', 'Katsu Curry', 'Noodles'],
            rating: 4.6,
            reviewCount: 3200,
            addressSummary: 'Dubai Marina Mall, Promenade Level, Dubai Marina',
            phone: '+971 4 430 4220'
        }
    ];
    const allRestaurants = [
        ...ajmanRestaurants,
        ...dubaiRestaurants,
        ...marinaRestaurants
    ];
    // Menu items with authentic items
    const menuItems = [
        // Laffah
        { id: 'item-laffah-shawarma-chicken', restaurantId: 'rest-laffah', name: 'Chicken Shawarma Saj Plate (Large)', description: 'Crispy charcoal toasted saj bread filled with shredded roasted chicken, garlic toum, pickles, and crispy spiced fries.', basePriceAed: 24, category: 'Shawarma', isPopular: true },
        { id: 'item-laffah-shawarma-beef', restaurantId: 'rest-laffah', name: 'Beef Shawarma Sandwich', description: 'Tender marinated beef strips, fresh parsley, onions, sumac, and rich tahina in Lebanese bread.', basePriceAed: 15, category: 'Shawarma', isPopular: true },
        { id: 'item-laffah-broasted-4pc', restaurantId: 'rest-laffah', name: 'Crispy Broasted Chicken (4 Pcs)', description: 'Golden crunchy fried chicken, seasoned fries, creamy garlic sauce, coleslaw, and fresh bun.', basePriceAed: 32, category: 'Broasted Chicken', isPopular: true },
        // ALBAIK
        { id: 'item-albaik-chicken-4pc', restaurantId: 'rest-albaik', name: 'ALBAIK Chicken Meal (4 Pcs)', description: 'World-famous 4-piece broasted chicken with proprietary 18-spice blend, signature garlic sauce, fries, and fresh bun.', basePriceAed: 20, category: 'Chicken Meals', isPopular: true },
        { id: 'item-albaik-nuggets-10pc', restaurantId: 'rest-albaik', name: 'Spicy Chicken Nuggets (10 Pcs)', description: 'Crispy spicy chicken breast nuggets served with famous ALBAIK nugget dip and french fries.', basePriceAed: 18, category: 'Nuggets', isPopular: true },
        { id: 'item-albaik-shrimp-10pc', restaurantId: 'rest-albaik', name: 'Jumbo Shrimp Meal (10 Pcs)', description: 'Crispy breaded jumbo gulf shrimp, cocktail sauce, garlic paste, fries, and bun.', basePriceAed: 32, category: 'Seafood', isPopular: true },
        // Maraheb
        { id: 'item-maraheb-mandi-meat', restaurantId: 'rest-maraheb', name: 'Mandi Meat (Mutton Naimi Fresh)', description: 'Tender slow-cooked fresh mutton over fragrant spiced Yemeni basmati rice with daqoos spicy tomato sauce.', basePriceAed: 68, category: 'Mandi Rice', isPopular: true },
        { id: 'item-maraheb-madfoon-chicken', restaurantId: 'rest-maraheb', name: 'Madfoon Half Chicken', description: 'Aluminium-wrapped slow-cooked tender chicken infused with aromatic spices, served with mandi rice.', basePriceAed: 32, category: 'Madfoon & Grills', isPopular: true },
        { id: 'item-maraheb-kunafa-cheese', restaurantId: 'rest-maraheb', name: 'Maraheb Special Cheese Kunafa', description: 'Warm golden spun pastry soaked in sweet syrup with melted premium akawi cheese and crushed pistachios.', basePriceAed: 22, category: 'Desserts', isPopular: true },
        // Hardee's
        { id: 'item-hardees-super-star', restaurantId: 'rest-hardees', name: 'Super Star Burger Combo', description: 'Two charbroiled 100% all-beef patties, American cheese, lettuce, tomato, onions, dill pickles, special sauce, curly fries and drink.', basePriceAed: 39, category: 'Combos', isPopular: true },
        { id: 'item-hardees-mushroom-swiss', restaurantId: 'rest-hardees', name: 'Mushroom & Swiss Angus Burger', description: 'Thick charbroiled 100% Angus beef patty smothered in rich mushroom sauce and melted Swiss cheese.', basePriceAed: 34, category: 'Angus Burgers', isPopular: true },
        { id: 'item-hardees-curly-fries', restaurantId: 'rest-hardees', name: 'Loaded Curly Fries with Cheese & Jalapeño', description: 'Crispy seasoned spiral curly fries topped with hot cheddar cheese sauce and jalapeño slices.', basePriceAed: 18, category: 'Sides' },
        // Al Hara Cafeteria
        { id: 'item-alhara-burger-hassan-mathar', restaurantId: 'rest-cafeteria-alhara', name: 'Hassan Mathar Paratha Wrap', description: 'Special crispy chicken strips with melted cheddar, chips Oman, and spicy cocktail sauce in buttery layered paratha.', basePriceAed: 12, category: 'Special Wraps', isPopular: true },
        { id: 'item-alhara-karak-flask', restaurantId: 'rest-cafeteria-alhara', name: 'Special Zafran Karak Chai (Flask)', description: 'Traditional slow-brewed strong spiced tea with evaporated milk and pure saffron strands.', basePriceAed: 10, category: 'Hot Beverages', isPopular: true },
        // Papa John's
        { id: 'item-papajohns-super-papa', restaurantId: 'rest-papajohns', name: 'Super Papa Pizza (Large)', description: 'Pepperoni, Italian sausage, Canadian beef bacon, fresh mushrooms, crunchy green peppers, onions, and black olives.', basePriceAed: 58, category: 'Pizzas', isPopular: true },
        { id: 'item-papajohns-garlic-knots', restaurantId: 'rest-papajohns', name: 'Special Garlic Knots with Dipping Sauce (8 Pcs)', description: 'Fresh dough baked golden, tossed in special garlic Parmesan sauce, with signature garlic and pizza sauce.', basePriceAed: 19, category: 'Sides', isPopular: true },
        // KFC
        { id: 'item-kfc-super-dinner', restaurantId: 'rest-kfc', name: 'Super Dinner Meal (4 Pcs)', description: '4 pieces of Original Recipe or Spicy Fried Chicken, coleslaw, large fries, fresh bun, and Pepsi.', basePriceAed: 38, category: 'Meals', isPopular: true },
        { id: 'item-kfc-twister', restaurantId: 'rest-kfc', name: 'Twister Sandwich (Spicy)', description: 'Two crispy chicken tenders, sliced tomatoes, shredded lettuce and pepper mayo wrapped in a toasted tortilla.', basePriceAed: 20, category: 'Sandwiches', isPopular: true },
        // McDonald's
        { id: 'item-mcd-bigmac-meal', restaurantId: 'rest-mcdonalds', name: 'Big Mac Medium Meal', description: 'Two 100% pure beef patties, Big Mac sauce, lettuce, cheese, pickles, onions on a sesame seed bun, medium fries and drink.', basePriceAed: 27, category: 'Meals', isPopular: true },
        { id: 'item-mcd-spicy-mcnuggets', restaurantId: 'rest-mcdonalds', name: 'Spicy Chicken McNuggets (9 Pcs)', description: 'Tender, juicy chicken breast McNuggets with spicy breading, served with barbecue and sweet and sour sauce.', basePriceAed: 22, category: 'Nuggets', isPopular: true },
        // Pizza Hut
        { id: 'item-pizzahut-pan-super-supreme', restaurantId: 'rest-pizzahut', name: 'Super Supreme Pan Pizza (Medium)', description: 'Classic pan crust with marinara sauce, beef pepperoni, Italian sausage, mushrooms, green peppers, black olives and mozzarella.', basePriceAed: 44, category: 'Pizzas', isPopular: true },
        // Subway
        { id: 'item-subway-chicken-teriyaki', restaurantId: 'rest-subway', name: 'Chicken Teriyaki 6-Inch Sub', description: 'Glazed tender chicken strips in savory sweet onion teriyaki sauce with your choice of freshly baked bread and garden veggies.', basePriceAed: 25, category: 'Subs', isPopular: true },
        // ChicKing
        { id: 'item-chicking-royal-crunch', restaurantId: 'rest-chicking', name: 'Royal Crunch Chicken Meal (3 Pcs)', description: '3 pieces of spicy golden crunchy chicken, French fries, coleslaw, bun, and garlic sauce.', basePriceAed: 29, category: 'Meals', isPopular: true },
        // The Pizza Pie Factory
        { id: 'item-pizzapiefactory-meatlovers', restaurantId: 'rest-thepizzapiefactory', name: 'All-Meat Factory Special (Medium)', description: 'Ground beef, spicy pepperoni, smoked sausage, mozzarella, and house savory tomato sauce.', basePriceAed: 36, category: 'Pizzas', isPopular: true },
        // Domino's
        { id: 'item-dominos-extravaganzza', restaurantId: 'rest-dominos', name: 'ExtravaganZZa Pizza (Medium)', description: 'Pepperoni, ham, Italian sausage, beef, fresh onions, green peppers, mushrooms and black olives with extra mozzarella.', basePriceAed: 42, category: 'Pizzas', isPopular: true },
        // Chandni Chowk Vegetarian
        { id: 'item-chandnichowk-delhi-chaat', restaurantId: 'rest-chandnichowk', name: 'Special Delhi Papdi Chaat Platter', description: 'Crisp fried dough wafers with boiled potatoes, chickpeas, sweet yogurt, tamarind chutney, and fresh mint.', basePriceAed: 18, category: 'Chaat', isPopular: true },
        { id: 'item-chandnichowk-paneer-thali', restaurantId: 'rest-chandnichowk', name: 'Royal Paneer Butter Masala Thali', description: 'Paneer butter masala, dal makhani, jeera rice, 2 butter rotis, gulab jamun, and salad.', basePriceAed: 28, category: 'Thali', isPopular: true },
        // Chin Chin
        { id: 'item-chinchin-chicken-hakka-noodles', restaurantId: 'rest-chinchin', name: 'Chicken Hakka Noodles & Manchurian Combo', description: 'Wok-tossed thin egg noodles with shredded chicken and crunchy veggies served with spicy Manchurian chicken gravy.', basePriceAed: 35, category: 'Combos', isPopular: true },
        // Falafel Al Moqren
        { id: 'item-falafelmoqren-plate', restaurantId: 'rest-falafelmoqren', name: 'Falafel Deluxe Plate (12 Pcs)', description: 'Fresh hot herb falafel, creamy hummus, pickled turnip, tahina sauce, and 4 fresh Arabic breads.', basePriceAed: 16, category: 'Breakfast & Plates', isPopular: true },
        // Starbucks
        { id: 'item-starbucks-iced-shaken-white-mocha', restaurantId: 'rest-starbucks', name: 'Iced Shaken White Chocolate Mocha (Venti)', description: 'Espresso with rich white chocolate sauce, chilled milk, shaken with ice and topped with sweetened whipped cream.', basePriceAed: 26, category: 'Cold Coffee', isPopular: true },
        // Baskin Robbins
        { id: 'item-baskinrobbins-pralines-pint', restaurantId: 'rest-baskinrobbins', name: 'Pralines & Cream Hand-Packed Pint (500ml)', description: 'Vanilla flavored ice cream with praline-coated pecan pieces and caramel ribbon.', basePriceAed: 35, category: 'Ice Cream Tubs', isPopular: true },
        // Burger King
        { id: 'item-burgerking-double-whopper', restaurantId: 'rest-burgerking', name: 'Double Whopper Meal with Cheese', description: 'Two 1/4 lb savory flame-grilled beef patties with American cheese, juicy tomatoes, fresh lettuce, mayo, pickles and onions, large fries and drink.', basePriceAed: 36, category: 'Meals', isPopular: true },
        // Kabab Erbil Iraqi Restaurant
        { id: 'item-erbil-kebab-mix-grill', restaurantId: 'rest-erbil-kebab', name: 'Iraqi Charcoal Mixed Grill (1 Kg Platter)', description: 'Authentic spiced lamb kebab, tikka meat, shish tawook, grilled tomatoes, sumac onions, fresh tanoor bread.', basePriceAed: 95, category: 'Grills Platter', isPopular: true },
        // FiLLi Tea & Cafe
        { id: 'item-filli-zafran-large', restaurantId: 'rest-filli', name: 'FiLLi Signature Zafran Tea (Large Flask)', description: 'Signature saffron-infused spiced black tea with rich condensed milk, served piping hot.', basePriceAed: 14, category: 'Beverages', isPopular: true },
        // Al Bait Al Malaki Mandi
        { id: 'item-albait-mandi-lamb', restaurantId: 'rest-albait-almalaki', name: 'Royal Mandi Lamb Shank Special', description: 'Fall-off-the-bone tender braised lamb shank over fragrant golden Yemeni spiced rice with maraq broth and spicy salsa.', basePriceAed: 72, category: 'Mandi', isPopular: true },
        // Falafil Al Rabiah
        { id: 'item-falafil-rabiah-sandwich', restaurantId: 'rest-falafil-alrabiah', name: 'Falafil Rabiah Special Sandwich with Hummus', description: 'Crispy crushed falafels, tahina, diced salad, and hummus in toasted Lebanese bread.', basePriceAed: 10, category: 'Sandwiches', isPopular: true },
        // Koshary El Sayed
        { id: 'item-koshary-elsayed-mega', restaurantId: 'rest-koshary-elsayed', name: 'Egyptian Koshary Mega Bowl with Dakka', description: 'Layered rice, macaroni, brown lentils, spiced chickpeas, topped with crispy caramelized onions, garlic vinegar dakka, and hot shatta.', basePriceAed: 22, category: 'Koshary', isPopular: true },
        // % Arabica Coffee
        { id: 'item-arabica-spanish-latte-iced', restaurantId: 'rest-arabica', name: 'Iced Kyoto Drip Spanish Latte (16oz)', description: 'Slow-extracted single-origin Kyoto cold brew with condensed milk and whole milk over crystal artisanal ice cubes.', basePriceAed: 28, category: 'Coffee', isPopular: true },
        // PAUL Bakery
        { id: 'item-paul-french-breakfast', restaurantId: 'rest-paul', name: 'PAUL Parisien Breakfast Set', description: 'Freshly baked croissant, baguette slices with artisanal French butter and jam, scrambled eggs, freshly squeezed orange juice, and cafe latte.', basePriceAed: 54, category: 'Breakfast', isPopular: true },
        // Zuma Dubai
        { id: 'item-zuma-black-cod', restaurantId: 'rest-zuma-dubai', name: 'Marinated Black Cod in Saikyo Miso', description: 'Signature Alaskan black cod marinated in sweet saikyo miso wrapped in hoba leaf.', basePriceAed: 195, category: 'Signature Mains', isPopular: true },
        // CZN Burak Dubai
        { id: 'item-czn-salted-beef', restaurantId: 'rest-czn-burak', name: 'CZN Burak Special Roasted Rib in Salt Crust', description: 'Whole beef short rib baked inside flaming sea salt crust with Turkish spiced pilaf rice.', basePriceAed: 240, category: 'Chef Specials', isPopular: true },
        // Operation Falafel Marina
        { id: 'item-operation-falafel-stuffed', restaurantId: 'rest-operation-falafel-marina', name: 'Stuffed Falafel Plate (Shattab & Sumac Onions)', description: 'Crispy falafels stuffed with spicy chili paste and sumac onions, served with tahina dip and warm pita.', basePriceAed: 26, category: 'Street Food', isPopular: true }
    ];
    // Multi-platform price variations
    const platformFees = {};
    const platformItemPrices = {};
    const offers = {};
    allRestaurants.forEach((rest) => {
        platformFees[rest.id] = {
            talabat: { platform: 'talabat', baseFeeAed: 6.5, surgeFeeAed: 0, freeThresholdAed: 50, minOrderAed: 20, etaMinutes: { min: 25, max: 40 } },
            noon: { platform: 'noon', baseFeeAed: 4.0, surgeFeeAed: 0, freeThresholdAed: 30, minOrderAed: 15, etaMinutes: { min: 20, max: 35 } },
            careem: { platform: 'careem', baseFeeAed: 7.0, surgeFeeAed: 0, freeThresholdAed: 60, minOrderAed: 25, etaMinutes: { min: 30, max: 45 } },
            deliveroo: { platform: 'deliveroo', baseFeeAed: 7.0, surgeFeeAed: 0, freeThresholdAed: 50, minOrderAed: 25, etaMinutes: { min: 20, max: 35 } },
            keeta: { platform: 'keeta', baseFeeAed: 0.0, surgeFeeAed: 0, freeThresholdAed: 0, minOrderAed: 10, etaMinutes: { min: 18, max: 30 } },
            smiles: { platform: 'smiles', baseFeeAed: 6.0, surgeFeeAed: 0, freeThresholdAed: 45, minOrderAed: 20, etaMinutes: { min: 25, max: 40 } }
        };
        offers[rest.id] = [
            { id: `offer-noon-${rest.id}`, platform: 'noon', type: 'percent_discount', badgeText: '20% OFF with Noon One', description: 'Get 20% discount on food orders with Noon One.', discountPercent: 20, maxDiscountAed: 25, isAutoApplied: true },
            { id: `offer-keeta-${rest.id}`, platform: 'keeta', type: 'flat_discount', badgeText: 'AED 15 OFF New User', description: 'AED 15 flat discount for new app users.', flatDiscountAed: 15, minOrderAed: 30, isAutoApplied: false },
            { id: `offer-deliv-${rest.id}`, platform: 'deliveroo', type: 'free_delivery', badgeText: 'FREE Delivery over AED 50', description: 'Free delivery on orders over AED 50.', minOrderAed: 50, isAutoApplied: true }
        ];
    });
    menuItems.forEach((item) => {
        platformItemPrices[item.id] = {
            talabat: { basePriceAed: item.basePriceAed, discountPercent: item.isPopular ? 10 : 0, isAvailable: true },
            noon: { basePriceAed: Math.max(8, item.basePriceAed - 1), discountPercent: 15, isAvailable: true },
            careem: { basePriceAed: item.basePriceAed + 1, discountPercent: 0, isAvailable: true },
            deliveroo: { basePriceAed: item.basePriceAed, discountPercent: 0, isAvailable: true },
            keeta: { basePriceAed: Math.max(8, item.basePriceAed - 2), discountPercent: 25, isAvailable: true },
            smiles: { basePriceAed: item.basePriceAed, discountPercent: 10, isAvailable: true }
        };
    });
    const platformGlobalOffers = {
        talabat: [
            { id: 'global-talabat-pro', platform: 'talabat', type: 'free_delivery', badgeText: 'tPro FREE Delivery', description: 'Free delivery on thousands of restaurants with tPro subscription.', minOrderAed: 30, isAutoApplied: true }
        ],
        noon: [
            { id: 'global-noon-one', platform: 'noon', type: 'free_delivery', badgeText: 'Noon One FREE Delivery', description: 'Enjoy zero delivery fees on food orders over AED 30.', minOrderAed: 30, isAutoApplied: true },
            { id: 'global-noon-fifteen', platform: 'noon', type: 'percent_discount', badgeText: 'FLAT 15% OFF Food', description: 'Use promo code NOONFOOD for 15% off.', discountPercent: 15, maxDiscountAed: 20, isAutoApplied: false }
        ],
        careem: [
            { id: 'global-careem-plus', platform: 'careem', type: 'free_delivery', badgeText: 'Careem Plus Zero Delivery', description: 'Careem Plus members get free delivery on eligible restaurants.', minOrderAed: 35, isAutoApplied: true }
        ],
        deliveroo: [
            { id: 'global-deliveroo-plus', platform: 'deliveroo', type: 'free_delivery', badgeText: 'Deliveroo Plus Free Delivery', description: 'Free delivery on qualifying orders with Deliveroo Plus.', minOrderAed: 40, isAutoApplied: true }
        ],
        keeta: [
            { id: 'global-keeta-free-del', platform: 'keeta', type: 'free_delivery', badgeText: 'AED 0 Delivery Fee', description: 'All orders get free delivery across UAE during launch promotion.', minOrderAed: 0, isAutoApplied: true },
            { id: 'global-keeta-fifty', platform: 'keeta', type: 'percent_discount', badgeText: '50% OFF First Order', description: 'Get 50% discount on your first order on Keeta.', discountPercent: 50, maxDiscountAed: 30, isAutoApplied: true }
        ],
        smiles: [
            { id: 'global-smiles-points', platform: 'smiles', type: 'percent_discount', badgeText: 'Double Smiles Points + 15% OFF', description: 'Earn 2x Smiles points with e& plus 15% discount.', discountPercent: 15, maxDiscountAed: 20, isAutoApplied: true }
        ]
    };
    const gridCells = {};
    const gridCellRestaurants = {};
    const ajmanIds = ajmanRestaurants.map((r) => r.id);
    const dubaiIds = dubaiRestaurants.map((r) => r.id);
    const marinaIds = marinaRestaurants.map((r) => r.id);
    shared_1.SEED_LOCATIONS.forEach((loc) => {
        let assignedIds = ajmanIds;
        if (loc.geohash.startsWith('thk0w') || loc.geohash.startsWith('thk0y') || loc.geohash.startsWith('thk1r')) {
            assignedIds = dubaiIds;
        }
        else if (loc.geohash.startsWith('thk0s') || loc.geohash.startsWith('thk0m')) {
            assignedIds = marinaIds;
        }
        gridCells[loc.geohash] = {
            ...loc,
            lastRefreshedAt: new Date().toISOString(),
            restaurantCount: assignedIds.length
        };
        gridCellRestaurants[loc.geohash] = assignedIds;
    });
    return {
        restaurants: allRestaurants,
        menuItems,
        platformFees,
        platformItemPrices,
        offers,
        platformGlobalOffers,
        gridCells,
        gridCellRestaurants
    };
}
function runSeed() {
    console.log('Seeding UAE Food Compare database...');
    const seedData = generateSeedData();
    index_1.db.seedDatabase(seedData);
    const stats = index_1.db.getStats();
    console.log(`Database successfully seeded!`, stats);
}
if (process.argv[1]?.endsWith('seed.ts')) {
    runSeed();
}
