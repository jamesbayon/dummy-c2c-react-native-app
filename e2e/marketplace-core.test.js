/* eslint-env detox/detox, jest */

/**
 * P1/P2 — Marketplace core journeys.
 *
 * Business value: buyers must discover listings, trust details/seller data, and
 * retain intent through favorites. These tests exercise integrated, stateful
 * user journeys instead of isolated component checks.
 *
 * Techniques: Use-case testing, Equivalence Partitioning (match/no-match search),
 * BVA (empty/one-char/long query), State-transition testing (favorite on/off,
 * empty/non-empty favorites), State-dependent testing (sold item visibility).
 */

const {
  FavoritesScreen,
  ListingsScreen,
  ProductDetailScreen,
  ProfileScreen,
  SellerProfileScreen,
  TabBar,
} = require('./screens');
const { LISTINGS, SEEDED_USER } = require('./support/fixtures');
const { relaunchAndLogin } = require('./support/flows');

describe('P1 Browse, Search, Detail, Favorites and Seller Profiles', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await relaunchAndLogin();
    await ListingsScreen.assertLoaded();
  });

  it('browses seeded listings and shows card title, price, and sold state', async () => {
    await expect(ListingsScreen.card(LISTINGS.nike.id)).toBeVisible();
    await expect(ListingsScreen.title(LISTINGS.nike.id)).toHaveText(
      LISTINGS.nike.title,
    );
    await expect(ListingsScreen.price(LISTINGS.nike.id)).toHaveText('¥6,800');
    await expect(
      ListingsScreen.soldBadge(LISTINGS.soldJacket.id),
    ).toBeVisible();
  });

  it('filters search results for partial matches and restores all results when cleared', async () => {
    await ListingsScreen.search('nike');
    await expect(ListingsScreen.cardByTitle(LISTINGS.nike.title)).toBeVisible();
    await expect(
      ListingsScreen.cardByTitle(LISTINGS.iphoneCase.title),
    ).not.toBeVisible();

    await ListingsScreen.clearSearch();
    await expect(
      ListingsScreen.cardByTitle(LISTINGS.iphoneCase.title),
    ).toBeVisible();
  });

  it('shows the empty state for a no-match search and handles special characters', async () => {
    await ListingsScreen.search('zzzz-not-a-real-listing-!@#');
    await expect(ListingsScreen.emptyMessage()).toBeVisible();
  });

  it('keeps sold listings discoverable and marks them as sold in detail', async () => {
    await ListingsScreen.search('Vintage Denim');
    await expect(
      ListingsScreen.soldBadge(LISTINGS.soldJacket.id),
    ).toBeVisible();

    await ListingsScreen.openCard(LISTINGS.soldJacket.id);
    await ProductDetailScreen.assertVisible();
    await expect(ProductDetailScreen.title()).toHaveText(
      LISTINGS.soldJacket.title,
    );
    await expect(ProductDetailScreen.soldBanner()).toBeVisible();
  });

  it('opens product detail and verifies buyer decision data', async () => {
    await ListingsScreen.openCard(LISTINGS.nike.id);
    await ProductDetailScreen.assertVisible();

    await expect(ProductDetailScreen.title()).toHaveText(LISTINGS.nike.title);
    await expect(ProductDetailScreen.price()).toHaveText('¥6,800');
    await expect(ProductDetailScreen.condition()).toHaveText(
      LISTINGS.nike.condition,
    );
    await expect(ProductDetailScreen.sellerName()).toHaveText(
      LISTINGS.nike.seller,
    );
  });

  it('favorites from Home, shows the item in Favorites, then unfavorites back to empty', async () => {
    await ListingsScreen.toggleFavorite(LISTINGS.nike.id);

    await TabBar.goFavorites();
    await expect(FavoritesScreen.card(LISTINGS.nike.id)).toBeVisible();

    await element(by.id(`favorite-button-${LISTINGS.nike.id}`)).tap();
    await expect(FavoritesScreen.emptyMessage()).toBeVisible();
  });

  it('keeps favorite state consistent between detail and the Favorites tab', async () => {
    await ListingsScreen.openCard(LISTINGS.nike.id);
    await ProductDetailScreen.assertVisible();
    await ProductDetailScreen.toggleFavorite();

    await TabBar.goFavorites();
    await expect(FavoritesScreen.card(LISTINGS.nike.id)).toBeVisible();
  });

  it('opens the seller profile from detail and shows seller metadata plus listings', async () => {
    await ListingsScreen.openCard(LISTINGS.nike.id);
    await ProductDetailScreen.assertVisible();
    await ProductDetailScreen.openSeller();

    await SellerProfileScreen.assertVisible();
    await expect(SellerProfileScreen.name()).toHaveText('Aiko Tanaka');
    await expect(SellerProfileScreen.joinedDate()).toHaveText(
      'Joined March 2021',
    );
    await expect(SellerProfileScreen.card(LISTINGS.nike.id)).toBeVisible();
  });
});

describe('P2 Profile and Bottom Tab Navigation', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await relaunchAndLogin();
  });

  it('navigates across all bottom tabs and shows the expected primary screens', async () => {
    await TabBar.goSell();
    await expect(element(by.id('listing-title-input'))).toBeVisible();

    await TabBar.goProfile();
    await ProfileScreen.assertVisible();
    await expect(ProfileScreen.name()).toHaveText(SEEDED_USER.name);
    await expect(ProfileScreen.email()).toHaveText(SEEDED_USER.email);

    await TabBar.goHome();
    await ListingsScreen.assertLoaded();
  });
});
