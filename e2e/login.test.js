/* eslint-env detox/detox, jest */

/**
 * Sample E2E: Authentication — Login (happy path).
 *
 * Business value: login is the gate to every authenticated flow (browsing,
 * selling, favorites, profile). If it breaks, the whole app is unusable, so
 * this is the highest-priority smoke test for the suite.
 *
 * Technique: use-case testing of the primary success scenario, driven through
 * stable testID selectors (email-input / password-input / login-button) and
 * asserting arrival on an authenticated surface (the Home tab).
 */
describe('Authentication - Login', () => {
  beforeAll(async () => {
    await device.launchApp({newInstance: true});
  });

  beforeEach(async () => {
    // Reset JS state so each test starts from the logged-out Login screen.
    await device.reloadReactNative();
  });

  it('logs in an existing user with valid credentials and lands on Home', async () => {
    // Given: the login screen is shown
    await expect(element(by.id('login-button'))).toBeVisible();

    // When: a known seeded user submits valid credentials
    await element(by.id('email-input')).replaceText('user1@test.com');
    await element(by.id('password-input')).replaceText('password123');
    await element(by.id('login-button')).tap();

    // Then: the authenticated main tabs are shown (Home tab visible)
    await waitFor(element(by.id('tab-home')))
      .toBeVisible()
      .withTimeout(10000);
  });
});
