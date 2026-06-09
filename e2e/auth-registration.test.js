/* eslint-env detox/detox, jest */

/**
 * P0 — Registration.
 *
 * Business value: the top of the acquisition funnel. If sign-up breaks or
 * accepts bad data, growth stalls and the user table is polluted. This is the
 * most validation-dense form in the app, so it gets decision-table depth.
 *
 * Validation order (from AuthContext.register + RegisterScreen):
 *   1. password === confirmPassword  (screen)            -> "Passwords do not match"
 *   2. name & email & password required (trimmed)        -> "Name, email, and password are required"
 *   3. email format                                      -> "Enter a valid email address"
 *   4. password length >= 6                              -> "Password must be at least 6 characters"
 *   5. email not already in use                          -> "An account with this email already exists"
 *   6. otherwise: create + auto-login -> main tabs
 *
 * Techniques: Decision table (validation rules), EP (valid/invalid email,
 * password-length classes), BVA (length 5 / 6 around the min of 6),
 * State-dependent (duplicate of a seeded email), Use-case (happy auto-login).
 */

const {
  ListingsScreen,
  LoginScreen,
  RegisterScreen,
  TabBar,
} = require('./screens');
const { SEEDED_USER } = require('./support/fixtures');

const VALID_NEW = {
  name: 'New Buyer',
  email: 'newbuyer@test.com',
  password: 'password123',
  confirmPassword: 'password123',
};

describe('P0 Registration', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    // Fresh, logged-out app -> open the Register screen from the Login link.
    await device.reloadReactNative();
    await LoginScreen.assertVisible();
    await LoginScreen.goToRegister();
    await RegisterScreen.assertVisible();
  });

  // ---- Happy path (use-case): unique valid user is created and auto-signed-in ----
  it('registers a valid new user and signs them in automatically', async () => {
    await RegisterScreen.fill(VALID_NEW);
    await RegisterScreen.submit();
    await TabBar.assertVisible();
  });

  // ---- BVA: password exactly at the minimum length (6) is accepted ----
  it('accepts a password exactly at the minimum length of 6', async () => {
    await RegisterScreen.fill({
      name: 'Edge User',
      email: 'edge6@test.com',
      password: 'abc123',
      confirmPassword: 'abc123',
    });
    await RegisterScreen.submit();
    await TabBar.assertVisible();
  });

  // ---- BVA: password just below the minimum (5) is rejected ----
  it('rejects a password just below the minimum length (5 chars)', async () => {
    await RegisterScreen.fill({
      name: 'Edge User',
      email: 'edge5@test.com',
      password: 'abc12',
      confirmPassword: 'abc12',
    });
    await RegisterScreen.submit();
    await expect(RegisterScreen.errorMessage()).toHaveText(
      'Password must be at least 6 characters',
    );
  });

  // ---- State-dependent: email already in use (seeded user) ----
  it('rejects registration with an email that is already in use', async () => {
    await RegisterScreen.fill({
      name: 'Impostor',
      email: SEEDED_USER.email, // user1@test.com is seeded
      password: 'password123',
      confirmPassword: 'password123',
    });
    await RegisterScreen.submit();
    await expect(RegisterScreen.errorMessage()).toHaveText(
      'An account with this email already exists',
    );
  });

  // ---- Negative (screen rule): password confirmation mismatch ----
  it('rejects when the password and confirmation do not match', async () => {
    await RegisterScreen.fill({
      name: 'Mismatch User',
      email: 'mismatch@test.com',
      password: 'password123',
      confirmPassword: 'password124',
    });
    await RegisterScreen.submit();
    await expect(RegisterScreen.errorMessage()).toHaveText(
      'Passwords do not match',
    );
  });

  // ---- Negative (required field): missing name ----
  it('rejects when the name is missing', async () => {
    await RegisterScreen.fill({
      name: '',
      email: 'noname@test.com',
      password: 'password123',
      confirmPassword: 'password123',
    });
    await RegisterScreen.submit();
    await expect(RegisterScreen.errorMessage()).toHaveText(
      'Name, email, and password are required',
    );
  });

  // ---- EP (invalid email format class) ----
  it('rejects an invalid email format', async () => {
    await RegisterScreen.fill({
      name: 'Bad Email',
      email: 'not-an-email',
      password: 'password123',
      confirmPassword: 'password123',
    });
    await RegisterScreen.submit();
    await expect(RegisterScreen.errorMessage()).toHaveText(
      'Enter a valid email address',
    );
  });

  // ---- Negative (required field): missing email (GAP-R1) ----
  it('rejects when the email is missing', async () => {
    await RegisterScreen.fill({
      name: 'No Email',
      email: '',
      password: 'password123',
      confirmPassword: 'password123',
    });
    await RegisterScreen.submit();
    await expect(RegisterScreen.errorMessage()).toHaveText(
      'Name, email, and password are required',
    );
  });

  // ---- Negative (required field): missing password (GAP-R1) ----
  it('rejects when the password is missing', async () => {
    await RegisterScreen.fill({
      name: 'No Password',
      email: 'nopass@test.com',
      password: '',
      confirmPassword: '',
    });
    await RegisterScreen.submit();
    await expect(RegisterScreen.errorMessage()).toHaveText(
      'Name, email, and password are required',
    );
  });

  // ---- State/integration: a registered account is real and reusable (GAP-R2) ----
  // Proves register() actually creates the account, not just a fake session:
  // register -> log out -> log back in with the NEW credentials (same session).
  it('creates a real account: the new user can log out and log back in', async () => {
    const account = {
      name: 'Repeat Login',
      email: 'repeat@test.com',
      password: 'password123',
      confirmPassword: 'password123',
    };
    await RegisterScreen.fill(account);
    await RegisterScreen.submit();
    await TabBar.assertVisible();

    // Log out
    await TabBar.goProfile();
    const { ProfileScreen } = require('./screens');
    await ProfileScreen.assertVisible();
    await ProfileScreen.logout();
    await LoginScreen.assertVisible();

    // Log back in with the newly created credentials (no reload in between)
    await LoginScreen.login(account.email, account.password);
    await ListingsScreen.assertLoaded();
  });
});
