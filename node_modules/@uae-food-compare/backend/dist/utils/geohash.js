"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeGeohash = encodeGeohash;
exports.calculateDistanceKm = calculateDistanceKm;
exports.resolveLocationCell = resolveLocationCell;
const shared_1 = require("@uae-food-compare/shared");
const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';
/**
 * Encodes latitude and longitude into a geohash string.
 * Precision 6 produces a cell roughly 1.2km x 0.6km.
 * Precision 5 produces a cell roughly 4.9km x 4.9km.
 */
function encodeGeohash(latitude, longitude, precision = 5) {
    let isEven = true;
    let latMin = -90;
    let latMax = 90;
    let lonMin = -180;
    let lonMax = 180;
    let geohash = '';
    let bits = 0;
    let charIdx = 0;
    while (geohash.length < precision) {
        if (isEven) {
            const lonMid = (lonMin + lonMax) / 2;
            if (longitude >= lonMid) {
                charIdx = (charIdx << 1) | 1;
                lonMin = lonMid;
            }
            else {
                charIdx = (charIdx << 1) | 0;
                lonMax = lonMid;
            }
        }
        else {
            const latMid = (latMin + latMax) / 2;
            if (latitude >= latMid) {
                charIdx = (charIdx << 1) | 1;
                latMin = latMid;
            }
            else {
                charIdx = (charIdx << 1) | 0;
                latMax = latMid;
            }
        }
        isEven = !isEven;
        bits++;
        if (bits === 5) {
            geohash += BASE32[charIdx];
            bits = 0;
            charIdx = 0;
        }
    }
    return geohash;
}
/**
 * Calculates distance in kilometers between two GPS coordinates using Haversine formula.
 */
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(2));
}
/**
 * Resolves a coordinate to a named location or nearest seed location.
 */
function resolveLocationCell(lat, lng, requestedGeohash) {
    if (requestedGeohash) {
        const matched = shared_1.SEED_LOCATIONS.find((loc) => loc.geohash.startsWith(requestedGeohash) || requestedGeohash.startsWith(loc.geohash));
        if (matched)
            return matched;
    }
    if (typeof lat === 'number' && typeof lng === 'number') {
        // Find closest seed location
        let closestLoc = shared_1.DEFAULT_LOCATION;
        let minDistance = Infinity;
        for (const loc of shared_1.SEED_LOCATIONS) {
            const dist = calculateDistanceKm(lat, lng, loc.lat, loc.lng);
            if (dist < minDistance) {
                minDistance = dist;
                closestLoc = loc;
            }
        }
        if (minDistance <= 3.5) {
            return closestLoc;
        }
        const calculatedGeohash = encodeGeohash(lat, lng, 5);
        return {
            geohash: calculatedGeohash,
            name: `Custom Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
            emirate: 'UAE',
            lat,
            lng,
            status: 'cached',
            restaurantCount: 20
        };
    }
    return shared_1.DEFAULT_LOCATION;
}
