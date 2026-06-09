/* eslint-env detox/detox, jest */

/**
 * P0 — Create Listing (Sell).
 *
 * Business value: marketplace supply is the core seller-side transaction. The
 * highest-risk points are required-field validation and proving that a newly
 * submitted listing enters buyer discovery immediately.
 *
 * Techniques: Use-case testing (create -> appears in Home), Decision table
 * (required fields present/absent), Boundary Value Analysis (empty/zero price),
 * Equivalence Partitioning (numeric and non-numeric price input classes).
 */

const { CreateListingScreen, ListingsScreen, TabBar } = require('./screens');
const { relaunchAndLogin } = require('./support/flows');

const VALID_LISTING = {
  title: 'Detox Ceramic Mug',
  price: '1500',
  category: 'Home',
  condition: 'Like New',
  description: 'QA-created listing with a clean glaze and no chips.',
};

describe('P0 Create Listing - Sell an Item', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await relaunchAndLogin();
    await TabBar.goSell();
    await CreateListingScreen.assertVisible();
  });

  it('creates a valid listing and adds it to the Home feed', async () => {
    await CreateListingScreen.fill(VALID_LISTING);
    await CreateListingScreen.submit();

    await ListingsScreen.assertLoaded();
    await expect(ListingsScreen.cardByTitle(VALID_LISTING.title)).toBeVisible();
  });

  it('shows required-field validation when the seller submits an empty form', async () => {
    await CreateListingScreen.submit();

    await expect(CreateListingScreen.titleError()).toHaveText(
      'Title is required',
    );
    await expect(CreateListingScreen.priceError()).toHaveText(
      'Price is required',
    );
    await expect(CreateListingScreen.categoryError()).toHaveText(
      'Category is required',
    );
    await expect(CreateListingScreen.conditionError()).toHaveText(
      'Condition is required',
    );
  });

  it('rejects a missing title while the other listing fields are valid', async () => {
    await CreateListingScreen.fill({ ...VALID_LISTING, title: '' });
    await CreateListingScreen.submit();

    await expect(CreateListingScreen.titleError()).toHaveText(
      'Title is required',
    );
    await CreateListingScreen.assertVisible();
  });

  it('treats non-numeric price input as empty and blocks submission', async () => {
    await CreateListingScreen.fill({
      ...VALID_LISTING,
      title: 'Detox Non Numeric Price',
      price: 'abc',
    });
    await CreateListingScreen.submit();

    await expect(CreateListingScreen.priceError()).toHaveText(
      'Price is required',
    );
  });

  it('accepts the current boundary value of zero price and publishes the listing', async () => {
    await CreateListingScreen.fill({
      ...VALID_LISTING,
      title: 'Detox Free Pickup Item',
      price: '0',
    });
    await CreateListingScreen.submit();

    await ListingsScreen.assertLoaded();
    await expect(
      ListingsScreen.cardByTitle('Detox Free Pickup Item'),
    ).toBeVisible();
    await expect(element(by.text('¥0'))).toBeVisible();
  });
});
