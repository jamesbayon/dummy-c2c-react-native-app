# Detox E2E Test Suite — Study Guide (C2C Marketplace)

## Purpose of This Document

This is a self-contained study guide for the Detox end-to-end (E2E) test suite of
a consumer-to-consumer (C2C) marketplace React Native app. It is written so that a
brand-new engineer can read it in NotebookLM and understand, without opening the
code:

- what every single test case does and why it matters to a marketplace business,
- the risk-based prioritization (P0 / P1 / P2) behind which flows were tested,
- how the suite is structured, and how to build and run it.

If you only remember one idea: this suite is **risk-based**, not coverage-by-count.
The question driving it is "Which failures would hurt the marketplace most?" —
not "How do we touch every screen equally?"

---

## Suite at a Glance

There are **5 spec files** in `e2e/`:

| Spec file | Suite focus | Priority | Tests |
| --- | --- | --- | --- |
| `auth-login.test.js` | Login & logout | P0 | 10 executable |
| `auth-registration.test.js` | Account sign-up | P0 | 10 executable |
| `sell-listing.test.js` | Create listing (Sell) | P0 | 5 executable |
| `marketplace-core.test.js` | Browse, search, detail, favorites, seller profile, profile, navigation | P1 / P2 | 9 executable |
| `transaction-payment.test.js` | Buy → pay → payout | P0 (feature absent) | 6 **skipped** placeholders |

**Verified totals:** 4 executable suites = **34 passing tests** (10 + 10 + 5 + 9),
plus 1 placeholder suite = **6 skipped tests** (`it.skip`). The skipped suite is
the canonical #1 P0 of a real marketplace (payment); it is skipped because the
feature does not exist in this build, not because it was overlooked. See the
Transaction / Payment section.

Final verified run of the executable suites:

```sh
npx detox test --configuration ios.sim.debug
```

Result: 4 suites passed, 34 tests passed, 0 failing.

---

## Risk-Based Prioritization (P0 / P1 / P2)

Risk = business impact × likelihood/severity of failure. Effort follows risk:
deepest negative / boundary coverage on P0, moderate on P1, smoke + key state on P2.

### P0 — would block the marketplace from functioning (or move money wrongly)

- **Transaction / Payment** — the single top P0 of any real C2C marketplace
  (money movement, fraud, chargebacks, payouts, PCI/regulatory). **Absent in this
  build**, so encoded as skipped placeholders, not executable tests.
- **Login / Logout** — login gates 100% of authenticated usage. If it breaks the
  app is unusable; a false accept is a security incident.
- **Registration** — the top of the acquisition funnel. No sign-ups, no growth.
  Validation-heavy, so defect-prone.
- **Create Listing (Sell)** — the supply side. A marketplace with no inventory dies.

### P1 — high business value, moderate risk (buyer-side trust and conversion)

- **Browse + Search** — demand-side discovery; buyers must find items.
- **Product Detail (incl. SOLD state)** — the buy-decision point; SOLD accuracy
  protects trust.
- **Favorites** — retention / save-for-later; risk is cross-screen state consistency.

### P2 — supporting trust and navigation

- **Seller Profile** — a trust signal, lower frequency, not transaction-blocking.
- **Profile** — account view; logout is already covered under Auth.
- **Bottom Tab Navigation** — cross-cutting routing, exercised implicitly everywhere.

---

## Per-Spec Test Catalogue

Each test below lists its exact `it(...)` title followed by a plain-English
explanation. Tests are grouped by their `describe` block / priority.

### `auth-login.test.js` — P0 Authentication: Login & Logout (10 tests)

Each test resets to a clean, logged-out state (`device.reloadReactNative()` then
assert the Login screen is visible) so it is fully self-contained.

1. **logs in a seeded user with valid credentials and lands on Home** — the happy
   path: a known user signs in and the authenticated tabs appear. Proves the gate
   to the entire app works.
2. **rejects a valid email with the wrong password and shows an inline error** —
   asserts the exact copy "Invalid email or password" and that the user stays on
   Login. Protects against accidentally accepting bad credentials and against
   error-message regressions.
3. **treats the password as case-sensitive and rejects a wrong-case password** —
   `PASSWORD123` is rejected. A basic security expectation: passwords are not
   case-folded.
4. **rejects an email that does not belong to any user** — unknown accounts cannot
   get in.
5. **rejects a malformed email** — `not-an-email` is rejected (invalid email-format
   class).
6. **rejects empty email and password** — boundary case: both fields empty surface
   an error.
7. **rejects a valid email with an empty password** — single-empty-field partition;
   one missing field still blocks login.
8. **rejects an empty email with a valid password** — the mirror single-empty-field
   partition.
9. **accepts a valid email with surrounding whitespace and different case** —
   `  USER1@TEST.COM  ` is trimmed + lowercased and accepted. Verifies input
   normalization so legitimate users are not locked out by harmless formatting.
10. **logs out from the Profile tab and returns to the Login screen** — the
    state-transition logged-in → logged-out, confirming sessions can be ended.

### `auth-registration.test.js` — P0 Registration (10 tests)

Each test reloads, opens Register from the Login link, then asserts. The app's
validation order is: confirm-match → required fields → email format → password
length (min 6) → email not already used → create + auto-login.

1. **registers a valid new user and signs them in automatically** — happy path: a
   unique valid account is created and the user lands in the app. The acquisition
   funnel works end to end.
2. **accepts a password exactly at the minimum length of 6** — boundary value at
   the minimum; a 6-char password is allowed.
3. **rejects a password just below the minimum length (5 chars)** — boundary value
   below the minimum; asserts "Password must be at least 6 characters".
4. **rejects registration with an email that is already in use** — a seeded email is
   blocked with "An account with this email already exists". Prevents duplicate
   accounts / account takeover confusion.
5. **rejects when the password and confirmation do not match** — asserts "Passwords
   do not match", protecting users from typo'd passwords.
6. **rejects when the name is missing** — required-field rule: "Name, email, and
   password are required".
7. **rejects an invalid email format** — asserts "Enter a valid email address",
   keeping the user table clean.
8. **rejects when the email is missing** — required-field partition for email.
9. **rejects when the password is missing** — required-field partition for password.
10. **creates a real account: the new user can log out and log back in** — the
    integration proof: register → log out → log back in with the new credentials
    in the same session. Confirms the account is genuinely created, not just a
    temporary signed-in state.

### `sell-listing.test.js` — P0 Create Listing / Sell (5 tests)

Each test reloads, logs in as the seeded user, and opens the Sell tab.

1. **creates a valid listing and adds it to the Home feed** — happy path: a seller
   fills the form, submits, and the new listing is immediately discoverable in
   Home. This is the core seller-side transaction (supply creation).
2. **shows required-field validation when the seller submits an empty form** —
   asserts field-level errors for title, price, category, and condition all at
   once (decision-table style). Stops empty/garbage listings.
3. **rejects a missing title while the other listing fields are valid** — isolates
   the title rule; submission is blocked and the seller stays on the form.
4. **treats non-numeric price input as empty and blocks submission** — `abc` is
   filtered to empty and rejected with "Price is required" (invalid price class).
5. **accepts the current boundary value of zero price and publishes the listing** —
   documents current product behavior: a ¥0 listing is accepted and appears in
   Home. Captures the boundary explicitly so a future intentional change is a
   conscious decision, not a silent regression.

### `marketplace-core.test.js` — P1/P2 Buyer Journeys & Navigation (9 tests)

Two describe blocks share one file. Each test reloads and logs in.

**P1 — Browse, Search, Detail, Favorites and Seller Profiles (8 tests):**

1. **browses seeded listings and shows card title, price, and sold state** — the
   Home grid renders a known listing's title and price (¥6,800) and shows a SOLD
   badge on the sold item. A blank feed makes the app look dead, so this is a
   P0-level smoke in practice.
2. **filters search results for partial matches and restores all results when
   cleared** — typing "nike" narrows the grid to matching items and hides
   non-matches; clearing the search restores the full feed. Core discovery logic.
3. **shows the empty state for a no-match search and handles special characters** —
   a nonsense query with special characters shows the empty-state message instead
   of crashing or showing stale results.
4. **keeps sold listings discoverable and marks them as sold in detail** — a SOLD
   item still appears in search, and opening it shows a SOLD banner in detail.
   Sold-state accuracy protects buyer trust.
5. **opens product detail and verifies buyer decision data** — detail shows title,
   price, condition, and seller name — the data a buyer uses to decide.
6. **favorites from Home, shows the item in Favorites, then unfavorites back to
   empty** — favoriting from the grid surfaces the item in the Favorites tab, and
   unfavoriting returns it to empty. State-transition + retention behavior.
7. **keeps favorite state consistent between detail and the Favorites tab** —
   favoriting from the detail screen is reflected in Favorites, proving favorite
   state is shared across screens, not local to one component.
8. **opens the seller profile from detail and shows seller metadata plus listings**
   — from a product, open the seller (Aiko Tanaka), verify the join date and that
   the seller's listing is shown. A trust signal for buyers.

**P2 — Profile and Bottom Tab Navigation (1 test):**

9. **navigates across all bottom tabs and shows the expected primary screens** — a
   smoke test through Sell, Profile (verifying the logged-in user's name/email),
   and Home, confirming cross-cutting tab routing works.

---

## Transaction / Payment — The Missing-Feature P0 (`transaction-payment.test.js`)

This is the most important section to understand the suite's judgment.

**Persona D cross-check.** A 15-year C2C-marketplace QA engineer reviewed the
prioritization against domain reality. Their conclusion: in a real C2C marketplace,
the **buy → pay → seller payout** path is the **single top P0** — above even auth.
It is the only flow that moves real money, and its failure modes (double-charge,
failed or wrong payout, chargebacks, fraud, PCI/regulatory exposure) outrank an
auth outage in business and legal severity. Listing an item is free; money moves on
the **buy** side, which this app does not have.

**Why these 6 tests are skipped, not written as executable.** This build has **no
payment surface** — no buy button, cart, checkout, payment provider, escrow, fees,
or payout. The "Sell" flow only creates a listing; no money changes hands. There is
literally nothing to drive on the simulator. **This is a missing feature, not a
coverage gap.**

**Why they exist as `it.skip` placeholders at all.** Encoding them as skipped (in a
`describe.skip` block) instead of omitting them means:

1. the #1 canonical P0 is **visible in every test report** as "skipped", never
   silently absent;
2. the intended coverage is already specified in Given/When/Then comments and is
   **ready to unskip** the day a payment flow ships;
3. reviewers can see the prioritization was a deliberate, documented decision.

The 6 skipped placeholders (with their intended behavior):

1. **buyer purchases an available listing and payment is captured for the correct
   amount** — happy-path money movement: capture exactly the price (+ fees), mark
   the listing SOLD, show an order confirmation.
2. **blocks purchase of a listing that is already SOLD** — transaction guard: no
   double-sale, no charge for nothing.
3. **handles a declined payment without marking the listing sold** — a declined
   card shows an error, the item stays available, and no funds move.
4. **charges the exact total (price + platform fee) with no rounding error** —
   boundary/integrity on fee math (¥0, ¥1, large amounts) to the smallest unit.
5. **credits the seller payout (price minus fee) after a completed sale** — the
   seller side: payable balance increases by price minus platform fee.
6. **does not double-charge when the buyer retries a timed-out checkout** —
   idempotency: a retried checkout captures funds once.

---

## ISTQB Test-Design Techniques (with concrete examples)

| Technique | What it is | Concrete example in this suite |
| --- | --- | --- |
| **Use-case testing** | Exercise a complete real user journey end to end. | `auth-login`: "logs in a seeded user with valid credentials and lands on Home". |
| **Equivalence Partitioning (EP)** | Pick one representative from each input class (valid / invalid). | `auth-login`: a valid email vs. a malformed email (`not-an-email`) — one per class instead of many. |
| **Boundary Value Analysis (BVA)** | Test the values right at and just past a limit. | `auth-registration`: password length **6** accepted vs. length **5** rejected, around the minimum of 6. |
| **Decision table** | Cover combinations of multiple validation rules. | `sell-listing`: "shows required-field validation when the seller submits an empty form" asserts title/price/category/condition errors together. |
| **State transition** | Verify the system moves correctly between states. | `auth-login`: "logs out from the Profile tab and returns to the Login screen" (logged-in → logged-out); `marketplace-core`: favorite → unfavorite back to empty. |

---

## Test Architecture

```text
e2e/
  auth-login.test.js          # P0 login/logout
  auth-registration.test.js   # P0 registration
  sell-listing.test.js        # P0 create listing
  marketplace-core.test.js    # P1/P2 buyer journeys + navigation
  transaction-payment.test.js # P0 skipped placeholders (feature absent)
  screens/index.js            # page objects (screen helpers)
  support/flows.js            # shared multi-step flows (login setup)
  support/fixtures.js         # stable seeded test data
```

**Page-object pattern (`e2e/screens/index.js`).** Every screen is an object that
exposes element accessors and intent-revealing actions (for example
`LoginScreen.login(email, password)`, `CreateListingScreen.fill(fields)`). Specs
read like user journeys; selectors live in one place, so a `testID` rename is a
one-line change instead of editing every test.

**Shared flows & fixtures (`e2e/support/`).** `flows.js` provides
`relaunchAndLogin()` and `loginAsSeededUser()` so each test starts from a known
state without repeating setup. `fixtures.js` mirrors seeded data (e.g. `SEEDED_USER`
= Aiko Tanaka / `user1@test.com`, the Nike Air Max listing, the sold Vintage Denim
Jacket) so tests reference business concepts instead of magic strings.

**Stable `testID` selectors.** No coordinate taps or brittle text matching (text is
used only where it *is* the assertion, e.g. a listing title). Selectors such as
`email-input`, `listing-card-1`, `product-sold-banner`, and `listing-title-error`
are stable. Some testIDs were added purely for testability — additive, JS-only, no
behavior change.

**Given/When/Then naming & bodies.** Test titles describe the business behavior
being protected ("rejects a password just below the minimum length (5 chars)"), and
bodies are commented in Given/When/Then style. No hard sleeps — synchronization uses
Detox `waitFor(...).withTimeout(...)`.

---

## How to Run

The app is a React Native **debug** build, so Metro must be running (the debug app
loads its JavaScript live from Metro — this is also why adding a testID needs no
native rebuild).

```sh
# 1. Start Metro and leave it running in its own terminal.
npm start

# 2. Build the app for the iOS simulator (once, or after native changes).
npm run e2e:build          # -> detox build --configuration ios.sim.debug

# 3. Run the full executable suite (34 tests).
npm run e2e:test           # -> detox test --configuration ios.sim.debug

# Run a single spec:
npx detox test --configuration ios.sim.debug e2e/auth-login.test.js
npx detox test --configuration ios.sim.debug e2e/marketplace-core.test.js
```

Environment used for the verified runs: macOS, Xcode 26.5, iPhone 17 Pro simulator
(iOS 26.5), Detox 20.51.3 with the Jest runner. Detox native is injected at launch
from `~/Library/Detox`, so **no Podfile change is required**.

---

## Key Challenges & How They Were Solved

A good portion of E2E work is reliability and environment correctness, not product
logic. The notable ones here:

- **In-memory app resets state on reload.** Auth, listings, and favorites live in
  React Context with no backend, so state resets on every
  `device.reloadReactNative()`. Rather than fight this, tests use it: each test
  reloads to a clean state and **sets up its own state within one app session**
  (e.g. register → log out → log back in stays in one session because the account
  would vanish on reload).

- **Soft keyboard covered the bottom tab bar after login.** Waiting for or tapping a
  bottom tab right after typing was flaky because the keyboard / safe-area layout
  could leave the tab not fully hittable. Fixed by asserting a **keyboard-safe,
  top-of-screen** marker instead: `ListingsScreen.assertLoaded()` waits for the Home
  search bar at the top of the screen, which stays visible even while the keyboard
  is still dismissing over the tab bar.

- **Debug builds hot-load JS from Metro.** Because the debug app pulls its JS from
  Metro at launch, the many testIDs added for testability required **no native
  rebuild** — just a Metro reload. This kept the testability work fast and low-risk.

- **Ambiguous text match.** The Sell happy path first asserted the price `¥1,500`,
  which also exists in seeded data, so Detox matched multiple elements. Fixed by
  asserting the **unique created listing title** instead.

- **Offscreen "View Seller Profile" button.** The button was below the fold and
  failed hittability. A `product-seller-row` testID was added to the visible seller
  row and used for navigation instead.

- **Detox 20.51 needs no Podfile change.** Detox native is injected at launch from
  `~/Library/Detox`, avoiding native dependency churn.

---

## Glossary for a New Engineer

- **testID** — a stable, code-assigned identifier on a UI element. Detox finds
  elements by `by.id('...')`. Preferred over matching visible text or screen
  coordinates because it does not break when copy or layout changes.
- **Page object (screen helper)** — an object that wraps one screen's selectors and
  actions (e.g. `LoginScreen.login(...)`). Keeps specs readable and centralizes
  selectors so a UI change is a one-place fix.
- **Flake** — a test that passes sometimes and fails other times without any code
  change, usually due to timing, animations, keyboard, or layout. The fix is
  stable selectors and proper waits, never arbitrary sleeps.
- **P0 / P1 / P2** — risk priority. P0 = breaks the marketplace or moves money
  wrongly (must always pass). P1 = high-value buyer trust/conversion. P2 =
  supporting trust/navigation, lower risk.
- **Gray-box E2E** — testing the running app as a user would (real app, real
  simulator) while still having some internal hooks (like injected testIDs and
  Detox's synchronization), as opposed to pure black-box (no internal knowledge) or
  white-box (unit-level) testing.
