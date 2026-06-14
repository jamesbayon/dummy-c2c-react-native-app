# C2C Marketplace — E2E Test Strategy (Detox)

> Living document. Authored by **Persona A** (Senior QA Automation Engineer),
> audited by **Persona B** (Coverage Auditor), evaluated by **Persona C**
> (Hiring Manager). Updated feature-by-feature as the suite is built and run
> green on the iOS Simulator.

---

## 1. Goal & approach

Build a **risk-based** Detox E2E suite that protects the most business-critical
journeys of a two-sided C2C marketplace. Detox is gray-box end-to-end, so we test
**real user journeys and feature integration** through the running app on the iOS
Simulator — not isolated unit checks. Every test is executed and must be green on
the simulator before a feature is "done".

Design principles:

- **Stable `testID` selectors** only — no text/coordinate brittleness (text used
  only where it is the assertion itself, e.g. a listing title in the feed).
- **Page-object / screen-helper pattern** (`e2e/screens/*`) + shared flows
  (`e2e/helpers/*`) for readability and maintainability.
- **Given/When/Then** test names and bodies.
- **No brittle sleeps** — use Detox `waitFor(...).withTimeout(...)` and
  synchronization.
- **Explicit assumptions** over silent guessing.

---

## 2. Test environment

| Item           | Value                                                                                                 |
| -------------- | ----------------------------------------------------------------------------------------------------- |
| OS / Xcode     | macOS, **Xcode 26.5**                                                                                 |
| Simulator      | **iPhone 17 Pro**, iOS 26.5 (UDID `8690E321-…`)                                                       |
| Detox          | **20.51.3** (Jest runner, `jest-circus`)                                                              |
| Sim control    | **applesimutils** (Homebrew)                                                                          |
| App under test | `com.c2cmarketplace.app` (display name "C2C Marketplace"; internal Xcode target still `MercariClone`) |
| Build cfg      | `ios.sim.debug` → `ios/build/Build/Products/Debug-iphonesimulator/MercariClone.app`                   |
| Build cmd      | `npx detox build --configuration ios.sim.debug` (or `npm run e2e:build`)                              |
| Run cmd        | `npx detox test --configuration ios.sim.debug [spec]` (or `npm run e2e:test`)                         |
| **Metro**      | Must be running (`npm start`) — debug build loads JS live from Metro.                                 |
| Detox native   | Injected at launch from `~/Library/Detox` — **no Podfile change**.                                    |

---

## 3. Key assumptions

1. **In-memory app, no backend.** Auth, listings, and favorites live in React
   Context. **State resets on every app relaunch / `device.reloadReactNative()`.**
   → Entities created in a test (registered user, new listing, favorites) do
   **not** persist across a reload, so each test fully sets up its own state
   within one app session before asserting.
2. **Seeded fixtures** (from `src/data`):
   - Users `user1@test.com … user10@test.com`, all password `password123`.
     `user1` = **Aiko Tanaka**.
   - ~51 listings, ids `"1"…"51"`. Listing `"1"` = _Nike Air Max Sneakers_
     (¥6,800, Fashion, Good, seller `user1`). Listing `"3"` = _Vintage Denim
     Jacket_ and is **SOLD**.
   - **Sold ids**: `{3, 8, 14, 19, 25, 31, 42, 47}`.
   - **Seller mapping**: `sellerId = user{floor((id-1)/5)+1}` → ids `1–5` belong to
     `user1` (Aiko Tanaka).
3. **No API mocking / push notifications / location / messaging** exist in this
   build. Those items in the generic checklist are **N/A → out of scope**
   (documented in §7), not coverage gaps.
4. **Auth gating is via the navigator.** Authenticated screens are not reachable
   while logged out and there is no deep-linking, so "unauthorized access to an
   authed screen" is **not reachable in-app** → out of scope.
5. **No account lockout, deactivation, password max-length, or email-verification**
   features exist. Those negative cases are **out of scope** (documented), not gaps.

---

## 4. Prioritization matrix (risk = business impact × likelihood/severity of failure)

| Pri    | Feature                     | Business impact                           | Failure likelihood               | Why it ranks here                                                                                      |
| ------ | --------------------------- | ----------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **P0** | **Transaction / Payment (buy → pay → payout)** — _NOT IN BUILD_ | Critical — direct money movement, fraud, chargebacks, payouts, PCI/regulatory | High | In a real C2C marketplace this is the **single top P0** (Persona D cross-check below). **Absent in this build** — no buy/checkout/cart/payment/payout exists; "Sell" only creates a listing. Not testable here; tracked in §7 and as skipped placeholders in `e2e/transaction-payment.test.js`. |
| **P0** | **Auth: Login / Logout**    | Critical — gate to 100% of authed usage   | Med-High (validation surface)    | If login breaks, the entire app is unusable. Highest impact among **implemented** flows.               |
| **P0** | **Registration**            | Critical — top of acquisition funnel      | High (multi-rule validation)     | No sign-ups → no growth. Rich validation (email format, dup, length, confirm) is defect-prone.         |
| **P0** | **Create Listing (Sell)**   | Critical — supply side of the marketplace | Med-High (form + state mutation) | A marketplace with no inventory dies. Must validate required fields and that the item enters the feed. |
| **P1** | **Browse + Search**         | High — demand-side discovery              | Medium (filter + empty state)    | Buyers must find items. Search filtering & empty state are logic that regresses easily.                |
| **P1** | **Product Detail (+ SOLD)** | High — conversion / decision point        | Medium                           | The buy decision happens here. SOLD-state correctness protects trust/UX.                               |
| **P1** | **Favorites**               | High — retention / save-for-later         | Medium (stateful toggle)         | Drives return visits & conversion. Cross-screen state consistency is risky.                            |
| **P2** | **Seller Profiles**         | Medium — trust signal                     | Low-Med                          | Builds buyer confidence; lower frequency, degraded-trust (not txn-blocking) on failure.                |
| **P2** | **Profile**                 | Low-Med — account view + logout           | Low                              | Logout already covered under Auth; mostly display.                                                     |
| **P2** | **Bottom Tab Navigation**   | Medium — cross-cutting routing            | Low                              | Exercised implicitly by every test; explicit smoke for tab routing.                                    |

**Effort allocation:** deepest negative/BVA/EP coverage on **P0**; moderate on
**P1**; smoke/happy + key state on **P2**.

### 4.1 Persona D cross-check — where payment sits, and other prioritization notes

Reviewed by a **15-year C2C-marketplace QA engineer** against domain reality
(money movement, fraud, trust).

- **Payment is the top P0 — and it is not part of "Sell."** Listing an item is
  free; money moves on the **buy** side (buyer pays → platform fee/escrow →
  seller payout). The buy/checkout/payout path is the highest-risk flow in any
  real C2C app (double-charge, failed payout, chargebacks, PCI/regulatory
  exposure) — it ranks **above auth and listing creation**. **This build has no
  payment, checkout, cart, buy button, or payout**, so it is **out of scope
  because the feature is absent**, not deprioritized. Surfaced explicitly so the
  suite isn't read as having ignored the most important flow.
- **Home-feed load is a P0 smoke.** The listings grid is the first authenticated
  screen; a blank feed makes the app look dead. Covered today by the
  marketplace-core "browses seeded listings" test — treated as a P0-level smoke
  even though search *filtering* logic remains P1.
- **SOLD-state correctness is a transaction guard in disguise.** Here it is
  display-only (P1 is correct); in a real app, *blocking purchase of a SOLD item*
  would be a P0 transaction safeguard.
- **Seller trust signals:** ratings/reviews would be a **P1 fraud/trust** signal
  in a real C2C app; this build has only a static bio, so Seller Profiles stay
  P2.

---

## 5. ISTQB techniques applied (per area)

| Area            | Techniques                                                                                                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Login           | Use-case (happy), Equivalence Partitioning (valid vs invalid credential classes), BVA (empty/whitespace fields), Error guessing (email case/whitespace), State transition (out→in→out)      |
| Registration    | Decision table (field-validity combinations), EP (valid/invalid email, password-length classes), BVA (password len 5/6/7 around min=6), Negative (duplicate email, mismatch, missing field) |
| Create Listing  | Decision table (required fields present/absent), Use-case (create → appears in feed), EP (price numeric filtering)                                                                          |
| Browse + Search | EP (match/no-match classes), BVA (empty query, 1-char, long query, special chars), State (SOLD item still listed), Result-count partitions (0/1/many)                                       |
| Product Detail  | Use-case (open from grid), State transition (SOLD badge/banner), Navigation (to seller)                                                                                                     |
| Favorites       | State transition (favorite↔unfavorite, empty↔non-empty), Cross-screen consistency                                                                                                           |
| Seller Profile  | Use-case (open from product), data display verification                                                                                                                                     |
| Navigation      | State transition across tabs                                                                                                                                                                |

---

## 6. testID inventory (selectors the suite depends on)

- **Login**: `email-input`, `password-input`, `login-button`, `login-error-message`, `go-to-register-button`
- **Register**: `register-name-input`, `register-email-input`, `register-password-input`, `register-confirm-password-input`, `register-bio-input`, `register-submit-button`, `register-error-message`, `go-to-login-button`
- **Tabs**: `tab-home`, `tab-sell`, `tab-favorites`, `tab-profile`
- **Listings/Search**: `search-input`, `empty-search-message`, `listing-card-<id>`, `listing-title-<id>` _(added)_, `listing-price-<id>` _(added)_, `favorite-button-<id>`, `sold-badge-<id>`
- **Product Detail**: `product-title`, `product-price`, `product-condition`, `product-sold-banner` _(added)_, `favorite-button`, `product-seller-row` _(added)_, `product-seller-name` _(added)_, `view-seller-button`
- **Create Listing**: `listing-title-input`, `listing-price-input`, `category-option-<X>` _(added)_, `condition-option-<X>` _(added)_, `listing-description-input`, `listing-submit-button`, `listing-title-error` _(added)_, `listing-price-error` _(added)_, `listing-category-error` _(added)_, `listing-condition-error` _(added)_
- **Favorites**: `empty-favorites-message`
- **Seller Profile**: `seller-name` _(added)_, `seller-joined-date` _(added)_, `seller-bio` _(added)_
- **Profile**: `profile-name` _(added)_, `profile-email` _(added)_, `profile-joined-date` _(added)_, `profile-bio` _(added)_, `logout-button`

_(added)_ = `testID` introduced for testability (additive, JS-only, no behavior change).

---

## 7. Out-of-scope / known limitations (justified)

- **Transaction / Payment / Checkout (buy → pay → seller payout & fees)** — **the canonical #1 P0 of any real C2C marketplace, but entirely absent in this build.** There is no buy button, cart, checkout, payment provider, escrow, or payout — the "Sell" flow is listing creation only (no money changes hands). Nothing to drive, so it cannot be tested here. This is a missing **feature**, not a coverage gap. Encoded as skipped P0 placeholders in `e2e/transaction-payment.test.js` so it is visible in the test report and ready to unskip when a payment flow ships. See the Persona D cross-check (§4.1).
- **API failure / offline / retry** — no network layer to fault-inject; app is in-memory. N/A.
- **Push notifications & messaging** — feature not present in this build. N/A.
- **Location** — not present. N/A.
- **Account lockout after N attempts / deactivated / deleted user** — no such feature/flow. Cannot reach state.
- **Unauthorized deep-link to authed screens** — navigator-gated, no deep links. Cannot reach state.
- **Password max-length / email verification** — not implemented; only min-length(6), format, required, dup-email are enforced.
- **Image upload** — "Add Photo" is a placeholder (auto-assigns a picsum URL); no native image picker to drive. The create-listing happy path verifies the listing is created without a manual photo.
- **Persistence across relaunch** — by design (in-memory); not a defect.

---

## 8. Feature logs (cases, run results, Persona B gaps, Persona C feedback)

### P0 — Authentication: Login & Logout ✅ `e2e/auth-login.test.js`

**Cases (10):** valid login → Home (use-case); wrong password (EP-invalid, asserts exact error copy); wrong-case password rejected (security/error-guessing); unknown email; malformed email (EP-invalid format); both fields empty (BVA); valid email + empty password (BVA/EP); empty email + valid password (BVA/EP); whitespace + uppercase email normalized & accepted (error-guessing); logout from Profile → Login (state transition).

**Run:** `npx detox test --configuration ios.sim.debug e2e/auth-login.test.js` → **10 passing, 0 failing** (~92s).

**Persona B gaps found & closed:** GAP-1 password case-sensitivity (added), GAP-2 single-empty-field partitions ×2 (added), GAP-3 assert exact error text (added). Re-ran green.

**Persona C:** Strategy **Strong**, Implementation **Strong**, Problem-solving **Strong**. Minor suggestion (direct `not.toBeVisible(tab-home)` on negatives) noted as future polish.

---

### P0 — Registration ✅ `e2e/auth-registration.test.js`

**Cases (10):** valid registration → auto-login; password exactly at min length 6 accepted (BVA); password length 5 rejected (BVA); duplicate seeded email rejected (state); password confirmation mismatch; missing name; invalid email format; missing email; missing password; registered account can log out and log back in in the same app session (state/integration).

**Run:** `npx detox test --configuration ios.sim.debug e2e/auth-registration.test.js` → **10 passing, 0 failing** (~161s).

**Persona B gaps found & closed:** GAP-R1 separate missing-email and missing-password partitions were added after the initial missing-name-only required-field test. GAP-R2 registration persistence within the same in-memory session was added via register → logout → login with the new account. Remaining gaps: max password/email length and email verification are not implemented, so they are out of scope rather than defects.

**Persona C:** Strategy **Strong** because the validation order is documented and covered with BVA/decision-table cases. Implementation **Strong** after replacing tab-bar visibility waits with `ListingsScreen.assertLoaded()` to avoid keyboard-safe-area flake. Problem-solving **Strong**: full-suite failure exposed a synchronization issue, and the fix moved the helper to a stable landing-screen selector.

---

### P0 — Create Listing / Sell ✅ `e2e/sell-listing.test.js`

**Cases (5):** valid listing is created and appears in Home; empty form shows all required-field errors; missing title is rejected with other fields valid; non-numeric price is filtered to empty and rejected; zero price is accepted and published, documenting current product behavior.

**Run:** `npx detox test --configuration ios.sim.debug e2e/sell-listing.test.js` → **5 passing, 0 failing** (~125s).

**Persona B gaps found & closed:** GAP-S1 field-level error selectors were added for required-field assertions. GAP-S2 non-numeric price input was added as an EP invalid class. GAP-S3 zero price was added as a boundary/current-behavior case. Remaining gap: the suite does not verify created listing sort position as "top of feed" because the app generates IDs with `Date.now()` and the visible user-facing invariant is that the listing appears immediately in Home. A deterministic created-listing ID would make exact ordering cheaper to assert.

**Issues found and resolved:** The first run failed on an ambiguous `¥1,500` text assertion because seeded data also contains that price; the test now asserts the unique created title. A second failure came from waiting for a bottom tab while the keyboard could cover the tab bar; shared login setup now waits for the Home search input instead.

**Persona C:** Strategy **Adequate/Strong**: the core seller transaction and validation rules are covered, with zero-price behavior called out explicitly. Implementation **Strong**: page-object helpers and stable field-level error selectors keep the tests readable. Problem-solving **Strong**: failures were diagnosed as selector/hittability problems and corrected without adding sleeps.

---

### P1/P2 — Browse, Search, Detail, Favorites, Seller Profile, Profile, Navigation ✅ `e2e/marketplace-core.test.js`

**Cases (9):** Home grid shows seeded listing title/price and sold badge; search partial match filters results and clear restores results; special-character no-match search shows empty state; sold item remains discoverable and shows sold banner in detail; product detail shows title, price, condition, and seller; favorite from Home appears in Favorites and can be unfavorited back to empty; favorite from detail is reflected in Favorites; seller profile opens from detail and shows seller metadata plus seller listing; bottom tab smoke covers Sell, Profile, and Home primary screens.

**Run:** `npx detox test --configuration ios.sim.debug e2e/marketplace-core.test.js` → **9 passing, 0 failing** (~146s).

**Persona B gaps found & closed:** GAP-M1 sold-listing state was added in both grid and detail. GAP-M2 no-match/special-character search was added. GAP-M3 favorite state was tested from both listing card and detail. GAP-M4 seller metadata selectors were added for name/join date and seller listing visibility. Remaining gaps: explicit 1-character and very-long search queries are not separate tests because the partial-match and no-match partitions already exercise the same filter path; they are documented as lower-value future hardening. Deleted/deactivated/expired listings are not modeled in the app.

**Issues found and resolved:** Tab-bar controls were sometimes not 100% hittable under the safe-area frame, so tests were simplified to avoid unnecessary tab round-trips. The offscreen "View Seller Profile" button failed hittability; `product-seller-row` was added to the visible seller row and used for navigation. These are selector/testability fixes, not product logic defects.

**Persona C:** Strategy **Strong** for prioritizing buyer discovery, sold-state trust, favorites retention, and seller trust signals. Implementation **Adequate/Strong**: the suite is maintainable, but the combined marketplace spec could eventually be split by feature if it grows. Problem-solving **Strong**: Detox-specific flake sources were fixed with stable selectors and visible interaction targets.

---

## 9. Final verification

**Build:** `npx detox build --configuration ios.sim.debug` → **BUILD SUCCEEDED**. Initial sandboxed build failed because Xcode/CoreSimulator needed access outside the workspace sandbox; rerunning with approved escalation resolved it.

**Final full-suite run:** `npx detox test --configuration ios.sim.debug` on iPhone 17 Pro (`8690E321-692C-474E-AA17-B386F5D036D2`) → **4 test suites passed, 34 tests passed, 0 failing** (~516s).

Additional static checks:

- `npm run lint -- --quiet` → passed.
- `npx tsc --noEmit` → passed.
- `npm test -- --runInBand --watchman=false` → passed, 1 unit test. Plain `npm test -- --runInBand` failed in the sandbox because Watchman could not write to `~/.local/state/watchman`; adding `--watchman=false` avoids that local sandbox issue.

---

## 10. Holistic Persona C evaluation

| Criterion        | Rating     | Evidence                                                                                                                                                                        | Feedback                                                                                                                        |
| ---------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Testing strategy | **Strong** | P0/P1/P2 prioritization maps to marketplace risk; P0 auth/registration/sell get negative and BVA depth; P1 buyer trust/retention flows are covered through integrated journeys. | Add deterministic data hooks later so order assertions and generated entity IDs can be checked without relying on visible text. |
| Implementation   | **Strong** | Specs use page objects, shared login setup, stable `testID`s, and Detox waits instead of sleeps. Full iOS simulator suite is green.                                             | Split `marketplace-core.test.js` into separate specs if it grows beyond current 9 cases.                                        |
| Problem-solving  | **Strong** | Ambiguous price matcher, keyboard/tab visibility, offscreen seller button, sandboxed Xcode/Watchman issues were diagnosed and fixed or documented.                              | Add CI notes for running with a booted simulator and Metro so future failures are faster to triage.                             |

**Advance recommendation:** Yes. The suite demonstrates senior-level risk selection, practical Detox implementation, and evidence-based debugging.
