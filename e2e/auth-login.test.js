/* eslint-env detox/detox, jest */

/**
 * P0 — Authentication: Login & Logout.
 *
 * Business value: login is the gate to 100% of authenticated functionality
 * (browse, sell, favorites, profile). If it breaks, the app is unusable, and a
 * false-accept would be a security incident. This is the highest-priority area.
 *
 * Techniques: Use-case testing (happy path), Equivalence Partitioning (valid vs
 * invalid credential classes), Boundary Value Analysis (empty fields),
 * Error guessing (whitespace + case in email), State-transition (logged-out ->
 * logged-in -> logged-out).
 */

const {LoginScreen, TabBar, ProfileScreen} = require('./screens');
const {SEEDED_USER} = require('./support/fixtures');

describe('P0 Authentication - Login & Logout', () => {
  beforeAll(async () => {
    await device.launchApp({newInstance: true});
  });

  beforeEach(async () => {
    // Reset to a clean, logged-out state for test isolation.
    await device.reloadReactNative();
    await LoginScreen.assertVisible();
  });

  // ---- Happy path (use-case) ----
  it('logs in a seeded user with valid credentials and lands on Home', async () => {
    // When a known user submits valid credentials
    await LoginScreen.login(SEEDED_USER.email, SEEDED_USER.password);
    // Then the authenticated main tabs are shown
    await TabBar.assertVisible();
  });

  // ---- Negative: invalid password (EP - invalid class) ----
  it('rejects a valid email with the wrong password and shows an inline error', async () => {
    await LoginScreen.login(SEEDED_USER.email, 'wrong-password');
    // Assert the exact error copy (GAP-3) to catch message regressions.
    await expect(LoginScreen.errorMessage()).toHaveText('Invalid email or password');
    // And does not navigate away from the login screen
    await expect(LoginScreen.submitButton()).toBeVisible();
  });

  // ---- Negative (security): password is case-sensitive (GAP-1) ----
  it('treats the password as case-sensitive and rejects a wrong-case password', async () => {
    await LoginScreen.login(SEEDED_USER.email, 'PASSWORD123');
    await expect(LoginScreen.errorMessage()).toBeVisible();
    await expect(LoginScreen.submitButton()).toBeVisible();
  });

  // ---- Negative: unknown user (state - user does not exist) ----
  it('rejects an email that does not belong to any user', async () => {
    await LoginScreen.login('nobody@test.com', 'password123');
    await expect(LoginScreen.errorMessage()).toBeVisible();
  });

  // ---- Negative: malformed email (EP - invalid format class) ----
  it('rejects a malformed email', async () => {
    await LoginScreen.login('not-an-email', 'password123');
    await expect(LoginScreen.errorMessage()).toBeVisible();
  });

  // ---- Boundary: empty fields ----
  it('rejects empty email and password', async () => {
    await LoginScreen.email().clearText();
    await LoginScreen.password().clearText();
    await LoginScreen.submit();
    await expect(LoginScreen.errorMessage()).toBeVisible();
  });

  // ---- Boundary/EP: single empty field partitions (GAP-2) ----
  it('rejects a valid email with an empty password', async () => {
    await LoginScreen.email().replaceText(SEEDED_USER.email);
    await LoginScreen.password().clearText();
    await LoginScreen.submit();
    await expect(LoginScreen.errorMessage()).toBeVisible();
  });

  it('rejects an empty email with a valid password', async () => {
    await LoginScreen.email().clearText();
    await LoginScreen.password().replaceText(SEEDED_USER.password);
    await LoginScreen.submit();
    await expect(LoginScreen.errorMessage()).toBeVisible();
  });

  // ---- Error guessing: whitespace + uppercase email is normalised (trim + lowercase) ----
  it('accepts a valid email with surrounding whitespace and different case', async () => {
    await LoginScreen.login('  USER1@TEST.COM  ', SEEDED_USER.password);
    await TabBar.assertVisible();
  });

  // ---- State transition: log out returns to Login ----
  it('logs out from the Profile tab and returns to the Login screen', async () => {
    await LoginScreen.login(SEEDED_USER.email, SEEDED_USER.password);
    await TabBar.assertVisible();

    await TabBar.goProfile();
    await ProfileScreen.assertVisible();
    await ProfileScreen.logout();

    // Back to the logged-out login screen
    await LoginScreen.assertVisible();
  });
});
