# C2C Marketplace

A consumer-to-consumer (C2C) marketplace mobile app built with **React Native**. Browse second-hand listings, search for items, favorite the ones you like, view seller profiles, and list your own items for sale — all backed by in-memory mock data so the app runs without any external services.

> This is a demo/learning app. There is no real backend — authentication, listings, and favorites all live in memory and reset when the app restarts.

---

## Tech Stack

- **React Native** 0.84
- **React** 19
- **React Navigation** 7 (native stack + bottom tabs)
- **TypeScript**
- In-memory React Context for state (Auth, Listings, Favorites)

---

## Prerequisites

Make sure the following are installed before you start. If you're new to React Native, follow the official [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide first.

| Tool               | Notes                                                       |
| ------------------ | ----------------------------------------------------------- |
| **Node.js**        | v20+ (the project's `package.json` recommends `>= 22.11.0`) |
| **npm**            | Comes with Node                                             |
| **Watchman**       | Recommended on macOS: `brew install watchman`               |
| **Ruby + Bundler** | Used to install CocoaPods (`gem install bundler`)           |
| **CocoaPods**      | Installed via Bundler (see below)                           |
| **Xcode**          | 15+ with Command Line Tools, for the iOS Simulator          |

> **iOS only.** These instructions cover running the app on the iOS Simulator (macOS). The project also contains an Android project, but it has not been verified here.

---

## Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/jamesbayon/dummy-c2c-react-native-app-detox.git
cd dummy-c2c-react-native-app-detox
```

### 2. Install JavaScript dependencies

```sh
npm install
```

### 3. Install iOS native dependencies (CocoaPods)

The first time (installs CocoaPods itself via Bundler), then installs the pods:

```sh
bundle install
bundle exec pod install --project-directory=ios
```

> Run `bundle exec pod install` again any time native dependencies change.

### 4. Start Metro (the JS bundler)

In one terminal, from the project root:

```sh
npm start
```

### 5. Build and run the iOS app

In a second terminal, from the project root:

```sh
npm run ios
```

This builds the app, boots the iOS Simulator, installs the app, and launches it. To target a specific simulator:

```sh
npm run ios -- --simulator "iPhone 17 Pro"
```

Once it launches you'll see the **C2C Marketplace** login screen.

---

## Logging In (Sample Users)

There is no sign-up — log in with one of the seeded sample accounts below. **Every account uses the same password:**

```
Password: password123
```

The login form is **pre-filled** with `user1@test.com` / `password123`, so you can simply tap **Login** to get started.

> Prefer to make your own account? Tap **Sign up** on the login screen to register a new user (see the Registration feature below). New accounts live in memory and reset when the app restarts.

| Email             | Password      | Name           |
| ----------------- | ------------- | -------------- |
| `user1@test.com`  | `password123` | Aiko Tanaka    |
| `user2@test.com`  | `password123` | Kenji Sato     |
| `user3@test.com`  | `password123` | Mina Kobayashi |
| `user4@test.com`  | `password123` | Haru Suzuki    |
| `user5@test.com`  | `password123` | Yui Nakamura   |
| `user6@test.com`  | `password123` | Riku Ito       |
| `user7@test.com`  | `password123` | Sora Watanabe  |
| `user8@test.com`  | `password123` | Emi Yamamoto   |
| `user9@test.com`  | `password123` | Daichi Mori    |
| `user10@test.com` | `password123` | Nana Hayashi   |

Each seller owns a slice of the seeded listings, so logging in as different users (and viewing their seller profiles) shows different inventories.

---

## Features

- **Login / Logout** — Email + password authentication against the seeded sample users, with an inline error for invalid credentials. Log out from the Profile tab.
- **Registration** — Create a new account from the login screen's **Sign up** link. The form captures name, email, password (with confirmation) and an optional bio, validates the input (required fields, email format, minimum password length, and duplicate-email check), then signs the new user in automatically.
- **Home / Browse Listings** — A two-column grid of ~50 seeded items (sneakers, electronics, home goods, books, beauty, and more), each showing photo, title, and price.
- **Search** — Filter listings live by title from the search bar; an empty state appears when nothing matches.
- **Product Detail** — Tap any item to see its photo, price, condition, category, description, and the seller. Items that are no longer available show a **SOLD** badge.
- **Favorites** — Tap the heart on a listing or detail screen to favorite/unfavorite it. The **Favorites** tab collects everything you've saved, with an empty state when you have none.
- **Seller Profiles** — From a product, open the seller to view their avatar, name, join date, bio, and all of their other listings.
- **Create Listing (Sell)** — From the **Sell an Item** tab, create a new listing with a title, price, category, condition, and description. The form validates required fields, then adds the listing to the top of the Home feed.
- **Profile** — View the logged-in user's avatar, name, email, join date, and bio, and log out.
- **Bottom Tab Navigation** — Quick access to Home, Sell an Item, Favorites, and Profile.

---

## Project Structure

```
src/
├── components/      # Reusable UI (ListingCard, SearchBar)
├── context/         # In-memory state (AuthContext, ListingsContext, FavoritesContext)
├── data/            # Seeded mock data (users.ts, listings.ts)
├── navigation/      # Navigators (RootNavigator, MainTabs, HomeStack, FavoritesStack)
├── screens/         # App screens (Login, Listings, ProductDetail, CreateListing, etc.)
└── types/           # Shared TypeScript types and category/condition constants
```

---

## Useful Scripts

```sh
npm start        # Start the Metro bundler
npm run ios      # Build & run on the iOS Simulator
npm run android  # Build & run on Android
npm run lint     # Run ESLint
npm test         # Run Jest tests
npm run e2e:build # Build the iOS app for Detox
npm run e2e:test  # Run Detox E2E tests on the iOS Simulator
```

---

## End-to-End Testing (Detox)

The app has an end-to-end test suite built with **[Detox](https://wix.github.io/Detox/)** (gray-box E2E for React Native) using **Jest** as the runner. Tests drive the real app on the iOS Simulator through stable `testID` selectors and page-object helpers.

Current verified coverage: **4 Detox suites, 34 tests passing** on iOS Simulator (`ios.sim.debug`, iPhone 17 Pro).

For the full living strategy, prioritization matrix, feature-level coverage, review gaps, issues found, and final run log, see [`TEST_STRATEGY.md`](./TEST_STRATEGY.md).

### Test strategy summary

The suite is risk-based:

- **P0** protects flows that can block marketplace use or growth: login/logout, registration, and creating a listing.
- **P1** covers buyer discovery and trust: browse/search, product detail, sold state, and favorites.
- **P2** covers supporting trust/account/navigation flows: seller profiles, profile display, and bottom tab smoke.

ISTQB techniques used include use-case testing for real journeys, equivalence partitioning for valid/invalid input classes, boundary value analysis around password and price inputs, decision tables for validation-heavy forms, and state-transition testing for login/logout and favorite/unfavorite behavior.

### Coverage by feature

| Feature               | Spec                            | Coverage summary                                                                                                                                                                                                          |
| --------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Login / Logout        | `e2e/auth-login.test.js`        | Valid seeded login, wrong password, wrong-case password, unknown user, malformed email, empty fields, single-empty-field partitions, email trim/case normalization, logout state transition.                              |
| Registration          | `e2e/auth-registration.test.js` | Valid registration with auto-login, password min boundary, below-min rejection, duplicate email, password mismatch, missing required fields, invalid email, new account logout/relogin within the same in-memory session. |
| Create Listing        | `e2e/sell-listing.test.js`      | Valid listing appears in Home, empty-form validation, missing-title validation, non-numeric price rejection, zero-price boundary/current behavior.                                                                        |
| Browse / Search       | `e2e/marketplace-core.test.js`  | Seeded grid title/price/sold badge, partial search, clear search restore, no-match/special-character empty state.                                                                                                         |
| Product Detail / Sold | `e2e/marketplace-core.test.js`  | Detail title, price, condition, seller, and sold banner for sold listings.                                                                                                                                                |
| Favorites             | `e2e/marketplace-core.test.js`  | Favorite from Home, Favorites tab population, unfavorite back to empty, detail-to-Favorites state consistency.                                                                                                            |
| Seller Profile        | `e2e/marketplace-core.test.js`  | Open seller from product detail, verify seller name/join date and listing presence.                                                                                                                                       |
| Profile / Navigation  | `e2e/marketplace-core.test.js`  | Bottom tab smoke for Sell/Profile/Home and logged-in profile name/email.                                                                                                                                                  |

### Issues found and resolved

- **Ambiguous price assertion**: a created listing price matched seeded data. Resolved by asserting the unique created listing title instead of ambiguous price text.
- **Keyboard/tab hittability**: bottom tab assertions could fail when the keyboard or safe-area frame affected visibility. Resolved by waiting for the Home search input as the authenticated landing signal and removing unnecessary tab round-trips.
- **Offscreen seller button**: the "View Seller Profile" button was below the product detail fold. Resolved by adding `product-seller-row` and tapping the visible seller row.
- **Detox selector gaps**: added additive `testID`s for listing title/price, Sell form errors, seller/profile metadata, and seller-row navigation.
- **Jest unit config**: plain unit Jest was picking up Detox specs without Detox globals. Resolved by excluding `e2e/` from the root Jest config; Detox uses `e2e/jest.config.js`.

### What you need to install

| Tool                               | How                                                                                                           |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Detox** (dev dependency)         | Already in `devDependencies` — installed via `npm install`. It was added with `npm install --save-dev detox`. |
| **applesimutils**                  | Detox uses it to control the iOS Simulator: `brew tap wix/brew && brew install applesimutils`                 |
| **Xcode + a booted iOS Simulator** | Same as for running the app (see Prerequisites above).                                                        |

### What was configured (and what was _not_)

- **`.detoxrc.js`** — Detox configuration. The `ios.sim.debug` config builds the existing **`MercariClone`** Xcode scheme/workspace into `ios/build` and targets an **iPhone 17 Pro** simulator. (The Xcode scheme/target name is still `MercariClone` internally; the user-facing app name is **C2C Marketplace** via `CFBundleDisplayName`.)
- **`e2e/jest.config.js`** — Jest runner wired to Detox's `globalSetup`/`globalTeardown`, `testEnvironment`, and reporter, with `maxWorkers: 1`.
- **`e2e/*.test.js`** — feature specs for auth, registration, sell listing, and marketplace core flows.
- **`e2e/screens/index.js`** — page-object helpers for stable Detox selectors.
- **`e2e/support/*`** — seeded fixture constants and reusable flows.
- **No native/Podfile changes were required.** Detox 20.x injects its own prebuilt test framework into the app at launch (cached under `~/Library/Detox`), so the app's `Podfile` is untouched and you do **not** need to add a Detox pod.

The suite relies on stable `testID`s across login, registration, tabs, listings, product detail, Sell, Favorites, Seller Profile, and Profile. The full selector inventory is documented in [`TEST_STRATEGY.md`](./TEST_STRATEGY.md).

### Running the tests

> The iOS **debug** build loads its JS bundle from Metro, so **Metro must be running** (`npm start`) in a separate terminal before you run the tests.

```sh
# 1. Start Metro (separate terminal, if not already running)
npm start

# 2. Build the app for Detox (once per native/JS-config change)
npm run e2e:build      # = detox build --configuration ios.sim.debug

# 3. Run the E2E tests
npm run e2e:test       # = detox test --configuration ios.sim.debug

# Run a single spec while iterating
npx detox test --configuration ios.sim.debug e2e/auth-login.test.js
npx detox test --configuration ios.sim.debug e2e/auth-registration.test.js
npx detox test --configuration ios.sim.debug e2e/sell-listing.test.js
npx detox test --configuration ios.sim.debug e2e/marketplace-core.test.js
```

Latest verified result:

```
Test Suites: 4 passed, 4 total
Tests:       34 passed, 34 total
```

---

## Troubleshooting

- **Build / red error screen after first clone** — Make sure `npm install` and `bundle exec pod install` both completed, then restart Metro with a clean cache: `npm start -- --reset-cache`.
- **Stale bundle** — Press <kbd>R</kbd> in the iOS Simulator to reload, or stop and restart Metro.
- **CocoaPods errors** — Re-run `bundle install` then `bundle exec pod install --project-directory=ios`.
- For anything else, see the official [Troubleshooting](https://reactnative.dev/docs/troubleshooting) guide.
