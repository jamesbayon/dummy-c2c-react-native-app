/* Seeded test data — mirrors src/data/users.ts and src/data/listings.ts.
 * Centralised so specs read intent, not magic strings. */

const SEEDED_USER = {
  email: 'user1@test.com',
  password: 'password123',
  name: 'Aiko Tanaka',
};

// A second seeded account, used for duplicate-email negative tests etc.
const OTHER_SEEDED_USER = {
  email: 'user2@test.com',
  password: 'password123',
  name: 'Kenji Sato',
};

// Representative listings (ids are stable: listing index + 1).
const LISTINGS = {
  nike: {
    id: '1',
    title: 'Nike Air Max Sneakers',
    price: '6,800',
    condition: 'Good',
    category: 'Fashion',
    seller: 'Aiko Tanaka',
  },
  iphoneCase: {
    id: '2',
    title: 'iPhone 13 Silicone Case',
  },
  // Listing "3" is seeded as SOLD.
  soldJacket: {
    id: '3',
    title: 'Vintage Denim Jacket',
  },
};

// Listing ids seeded as sold (src/data/listings.ts -> soldIds).
const SOLD_IDS = ['3', '8', '14', '19', '25', '31', '42', '47'];

module.exports = {SEEDED_USER, OTHER_SEEDED_USER, LISTINGS, SOLD_IDS};
