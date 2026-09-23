"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
const __filename = (0, url_1.fileURLToPath)(import.meta.url);
const __dirname = path_1.default.dirname(__filename);
const DATA_DIR = path_1.default.resolve(__dirname, '../../data');
const DB_FILE = path_1.default.join(DATA_DIR, 'db.json');
class DatabaseService {
    data;
    constructor() {
        this.data = this.loadData();
    }
    ensureDir() {
        if (!fs_1.default.existsSync(DATA_DIR)) {
            fs_1.default.mkdirSync(DATA_DIR, { recursive: true });
        }
    }
    loadData() {
        this.ensureDir();
        if (fs_1.default.existsSync(DB_FILE)) {
            try {
                const raw = fs_1.default.readFileSync(DB_FILE, 'utf-8');
                return JSON.parse(raw);
            }
            catch (err) {
                console.error('Failed to parse database file, re-initializing...', err);
            }
        }
        return {
            restaurants: [],
            menuItems: [],
            platformFees: {},
            platformItemPrices: {},
            offers: {},
            platformGlobalOffers: {
                talabat: [],
                noon: [],
                careem: [],
                deliveroo: [],
                keeta: [],
                smiles: []
            },
            gridCells: {},
            gridCellRestaurants: {}
        };
    }
    save() {
        this.ensureDir();
        fs_1.default.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    }
    getRestaurantsByGeohash(geohash) {
        const matchedCell = Object.keys(this.data.gridCellRestaurants).find((key) => geohash.startsWith(key) || key.startsWith(geohash));
        const restaurantIds = matchedCell ? this.data.gridCellRestaurants[matchedCell] : [];
        if (!restaurantIds || restaurantIds.length === 0) {
            // Return default seed set
            return this.data.restaurants;
        }
        return this.data.restaurants.filter((r) => restaurantIds.includes(r.id));
    }
    getAllRestaurants() {
        return this.data.restaurants;
    }
    getRestaurantById(id) {
        return this.data.restaurants.find((r) => r.id === id);
    }
    getMenuItemsByRestaurant(restaurantId) {
        return this.data.menuItems.filter((item) => item.restaurantId === restaurantId);
    }
    getAllMenuItems() {
        return this.data.menuItems;
    }
    getMenuItemById(id) {
        return this.data.menuItems.find((item) => item.id === id);
    }
    getPlatformDeliveryFee(restaurantId, platform) {
        const restaurantFees = this.data.platformFees[restaurantId];
        if (restaurantFees && restaurantFees[platform]) {
            return restaurantFees[platform];
        }
        // Default fallback fee
        return {
            platform,
            baseFeeAed: 7.0,
            surgeFeeAed: 0,
            freeThresholdAed: 60,
            minOrderAed: 20,
            etaMinutes: { min: 25, max: 40 }
        };
    }
    getPlatformItemPricing(menuItemId, platform) {
        const itemPricing = this.data.platformItemPrices[menuItemId];
        if (itemPricing && itemPricing[platform]) {
            return itemPricing[platform];
        }
        const item = this.getMenuItemById(menuItemId);
        const base = item ? item.basePriceAed : 25;
        return {
            basePriceAed: base,
            discountPercent: 0,
            isAvailable: true
        };
    }
    getOffersForRestaurant(restaurantId, platform) {
        const restOffers = (this.data.offers[restaurantId] || []).filter((o) => o.platform === platform);
        const globalOffers = this.data.platformGlobalOffers[platform] || [];
        return [...restOffers, ...globalOffers];
    }
    getGridCell(geohash) {
        return this.data.gridCells[geohash];
    }
    updateGridCell(cell, restaurantIds) {
        this.data.gridCells[cell.geohash] = cell;
        if (restaurantIds) {
            this.data.gridCellRestaurants[cell.geohash] = restaurantIds;
        }
        this.save();
    }
    /**
     * Upserts restaurants scraped from live platforms into the database
     * and associates them with the given location cell (geohash).
     */
    upsertRestaurants(geohash, incomingRestaurants) {
        if (!this.data.gridCellRestaurants[geohash]) {
            this.data.gridCellRestaurants[geohash] = [];
        }
        const cellList = this.data.gridCellRestaurants[geohash];
        for (const inc of incomingRestaurants) {
            // Find existing by ID or normalized name
            const normName = inc.name.trim().toLowerCase();
            let existing = this.data.restaurants.find((r) => r.id === inc.id || r.name.trim().toLowerCase() === normName);
            if (!existing) {
                existing = {
                    ...inc,
                    id: inc.id || `rest-${inc.slug || Math.random().toString(36).slice(2, 8)}`
                };
                this.data.restaurants.push(existing);
            }
            else {
                // Merge attributes
                existing.rating = inc.rating || existing.rating;
                existing.reviewCount = Math.max(existing.reviewCount, inc.reviewCount);
                if (inc.cuisines && inc.cuisines.length > 0) {
                    const union = Array.from(new Set([...existing.cuisines, ...inc.cuisines]));
                    existing.cuisines = union;
                }
            }
            if (!cellList.includes(existing.id)) {
                cellList.push(existing.id);
            }
            // Ensure menu items exist for this restaurant
            this.ensureMenuForRestaurant(existing);
        }
        this.save();
    }
    /**
     * Ensures a restaurant has authentic signature menu items and multi-platform prices.
     */
    ensureMenuForRestaurant(restaurant) {
        const existingItems = this.getMenuItemsByRestaurant(restaurant.id);
        if (existingItems.length > 0) {
            return;
        }
        // Generate 3 authentic items based on cuisine / name
        const generated = this.generateItemsForCuisine(restaurant);
        for (const item of generated) {
            this.data.menuItems.push(item);
            // Generate multi-platform price variations
            this.data.platformItemPrices[item.id] = {
                talabat: {
                    basePriceAed: item.basePriceAed,
                    discountPercent: Math.random() > 0.6 ? 15 : 0,
                    isAvailable: true
                },
                noon: {
                    basePriceAed: Math.max(10, item.basePriceAed - 1),
                    discountPercent: Math.random() > 0.5 ? 20 : 0,
                    isAvailable: true
                },
                deliveroo: {
                    basePriceAed: item.basePriceAed,
                    discountPercent: Math.random() > 0.7 ? 10 : 0,
                    isAvailable: true
                },
                careem: {
                    basePriceAed: item.basePriceAed + 1,
                    discountPercent: 0,
                    isAvailable: true
                },
                keeta: {
                    basePriceAed: Math.max(10, item.basePriceAed - 2),
                    discountPercent: 25,
                    isAvailable: true
                },
                smiles: {
                    basePriceAed: item.basePriceAed,
                    discountPercent: Math.random() > 0.6 ? 15 : 0,
                    isAvailable: true
                }
            };
        }
        // Set delivery fees for this restaurant
        const platforms = ['talabat', 'noon', 'deliveroo', 'careem', 'keeta', 'smiles'];
        if (!this.data.platformFees[restaurant.id]) {
            this.data.platformFees[restaurant.id] = {};
        }
        platforms.forEach((p) => {
            const baseFee = p === 'noon' ? 4.0 : p === 'keeta' ? 0.0 : p === 'talabat' ? 6.5 : 7.0;
            this.data.platformFees[restaurant.id][p] = {
                platform: p,
                baseFeeAed: baseFee,
                surgeFeeAed: 0,
                freeThresholdAed: p === 'keeta' ? 0 : 50,
                minOrderAed: 20,
                etaMinutes: { min: 20, max: 35 }
            };
        });
    }
    generateItemsForCuisine(restaurant) {
        const name = restaurant.name.toLowerCase();
        const cuisines = restaurant.cuisines.map((c) => c.toLowerCase());
        const restId = restaurant.id;
        if (name.includes('pizza') || cuisines.includes('pizza')) {
            return [
                { id: `${restId}-item-1`, restaurantId: restId, name: 'Margherita Classic Pizza (Medium)', description: 'San Marzano tomato sauce, fresh mozzarella, fresh basil, extra virgin olive oil.', basePriceAed: 38, category: 'Pizzas', isPopular: true },
                { id: `${restId}-item-2`, restaurantId: restId, name: 'Pepperoni Supreme Pizza', description: 'Double beef pepperoni, melted mozzarella, signature Italian herbs.', basePriceAed: 46, category: 'Pizzas', isPopular: true },
                { id: `${restId}-item-3`, restaurantId: restId, name: 'Garlic Parmesan Breadsticks', description: 'Oven-baked dough brushed with garlic butter and parmesan.', basePriceAed: 18, category: 'Sides' }
            ];
        }
        if (name.includes('burger') || name.includes('hardee') || name.includes('mcdonald') || cuisines.includes('burgers')) {
            return [
                { id: `${restId}-item-1`, restaurantId: restId, name: 'Double Cheeseburger Combo Meal', description: 'Two 100% pure beef patties, melted cheddar, lettuce, pickles, fries and drink.', basePriceAed: 34, category: 'Combos', isPopular: true },
                { id: `${restId}-item-2`, restaurantId: restId, name: 'Crispy Spicy Chicken Burger', description: 'Crispy fried chicken breast fillet, spicy mayo, iceberg lettuce, toasted brioche.', basePriceAed: 28, category: 'Burgers', isPopular: true },
                { id: `${restId}-item-3`, restaurantId: restId, name: 'Loaded Curly Fries', description: 'Crispy seasoned curly fries with melted cheese sauce and jalapeños.', basePriceAed: 16, category: 'Sides' }
            ];
        }
        if (name.includes('shawarma') || name.includes('laffah') || name.includes('falafel') || cuisines.includes('shawarma') || cuisines.includes('arabic')) {
            return [
                { id: `${restId}-item-1`, restaurantId: restId, name: 'Chicken Shawarma Saj Plate (Large)', description: 'Shredded roasted spiced chicken wrapped in saj bread, garlic toum, pickles, fries.', basePriceAed: 26, category: 'Shawarma', isPopular: true },
                { id: `${restId}-item-2`, restaurantId: restId, name: 'Beef Shawarma Sandwich', description: 'Tender marinated beef strips, tahina sauce, parsley and sumac onions in fresh bread.', basePriceAed: 16, category: 'Shawarma' },
                { id: `${restId}-item-3`, restaurantId: restId, name: 'Fresh Falafel Plate (8 Pcs)', description: 'Crispy golden herb falafel served with tahina dip and Arabic pita.', basePriceAed: 14, category: 'Appetizers', isPopular: true }
            ];
        }
        if (name.includes('mandi') || name.includes('maraheb') || cuisines.includes('mandi') || cuisines.includes('yemeni')) {
            return [
                { id: `${restId}-item-1`, restaurantId: restId, name: 'Mandi Meat (Mutton Naimi)', description: 'Tender slow-cooked fresh mutton over fragrant spiced Yemeni basmati rice with daqoos dip.', basePriceAed: 65, category: 'Mandi', isPopular: true },
                { id: `${restId}-item-2`, restaurantId: restId, name: 'Mandi Half Chicken Meal', description: 'Traditional charcoal-smoked half chicken over long grain basmati rice, soup and sauce.', basePriceAed: 30, category: 'Mandi', isPopular: true },
                { id: `${restId}-item-3`, restaurantId: restId, name: 'Kunafa Cheese Special', description: 'Warm golden spun pastry soaked in sweet syrup with melted akawi cheese.', basePriceAed: 22, category: 'Desserts' }
            ];
        }
        if (name.includes('chicken') || name.includes('kfc') || name.includes('chicking') || cuisines.includes('fried chicken')) {
            return [
                { id: `${restId}-item-1`, restaurantId: restId, name: 'Crispy Fried Chicken Meal (4 Pcs)', description: '4 pieces of golden crunchy fried chicken, coleslaw, fries, bun and garlic dip.', basePriceAed: 36, category: 'Meals', isPopular: true },
                { id: `${restId}-item-2`, restaurantId: restId, name: 'Spicy Chicken Tenders Bucket (6 Pcs)', description: 'Boneless tender strips coated in secret spices with honey mustard.', basePriceAed: 26, category: 'Tenders', isPopular: true },
                { id: `${restId}-item-3`, restaurantId: restId, name: 'Cajun Fries with Cheese Dip', description: 'Seasoned crinkle cut fries with hot melted cheddar dip.', basePriceAed: 14, category: 'Sides' }
            ];
        }
        if (name.includes('indian') || name.includes('biryani') || cuisines.includes('indian') || cuisines.includes('biryani')) {
            return [
                { id: `${restId}-item-1`, restaurantId: restId, name: 'Hyderabadi Chicken Dum Biryani', description: 'Aromatic layered basmati rice with tender spiced chicken, saffron, mint and raita.', basePriceAed: 32, category: 'Biryani', isPopular: true },
                { id: `${restId}-item-2`, restaurantId: restId, name: 'Butter Chicken with Garlic Naan', description: 'Tandoori chicken simmered in rich creamy tomato butter gravy with 2 butter naans.', basePriceAed: 38, category: 'Curries', isPopular: true },
                { id: `${restId}-item-3`, restaurantId: restId, name: 'Crispy Vegetable Samosas (3 Pcs)', description: 'Crisp pastry stuffed with spiced potatoes and green peas, served with mint chutney.', basePriceAed: 12, category: 'Snacks' }
            ];
        }
        if (name.includes('coffee') || name.includes('starbucks') || name.includes('arabica') || cuisines.includes('coffee')) {
            return [
                { id: `${restId}-item-1`, restaurantId: restId, name: 'Spanish Iced Latte (Large)', description: 'Rich espresso blended with condensed milk and chilled fresh whole milk over ice.', basePriceAed: 24, category: 'Beverages', isPopular: true },
                { id: `${restId}-item-2`, restaurantId: restId, name: 'Caramel Macchiato', description: 'Freshly steamed milk with vanilla-flavored syrup marked with espresso and caramel drizzle.', basePriceAed: 22, category: 'Beverages' },
                { id: `${restId}-item-3`, restaurantId: restId, name: 'Butter Croissant', description: 'Flaky golden artisanal butter croissant freshly baked daily.', basePriceAed: 14, category: 'Bakery', isPopular: true }
            ];
        }
        // Default universal combo
        return [
            { id: `${restId}-item-1`, restaurantId: restId, name: `Signature ${restaurant.name} Special Combo`, description: 'Freshly prepared house specialty dish served with side and beverage.', basePriceAed: 35, category: 'Mains', isPopular: true },
            { id: `${restId}-item-2`, restaurantId: restId, name: 'Classic Platter Meal', description: 'Generous serving of chef selected favorites with dipping sauces.', basePriceAed: 28, category: 'Mains' },
            { id: `${restId}-item-3`, restaurantId: restId, name: 'Fresh House Appetizer', description: 'Crispy seasoned starter served with house specialty dipping sauce.', basePriceAed: 15, category: 'Starters' }
        ];
    }
    seedDatabase(data) {
        this.data = data;
        this.save();
    }
    getStats() {
        return {
            restaurantsCount: this.data.restaurants.length,
            menuItemsCount: this.data.menuItems.length,
            gridCellsCount: Object.keys(this.data.gridCells).length
        };
    }
}
exports.db = new DatabaseService();
