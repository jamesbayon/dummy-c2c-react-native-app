/* eslint-env detox/detox, jest */
/* Reusable multi-step flows shared across specs. */

const { LoginScreen, ListingsScreen } = require('../screens');
const { SEEDED_USER } = require('./fixtures');

/** Log in as a seeded user and wait until the authenticated tabs are shown. */
async function loginAsSeededUser(user = SEEDED_USER) {
  await LoginScreen.assertVisible();
  await LoginScreen.login(user.email, user.password);
  await ListingsScreen.assertLoaded();
}

/** Fresh logged-out app, then logged in — the common precondition. */
async function relaunchAndLogin(user = SEEDED_USER) {
  await device.reloadReactNative();
  await loginAsSeededUser(user);
}

module.exports = { loginAsSeededUser, relaunchAndLogin };
