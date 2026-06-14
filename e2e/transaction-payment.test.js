/* eslint-env detox/detox, jest */

/**
 * P0 — Transaction / Payment (buy → pay → seller payout).
 *
 * ⚠️ NOT IMPLEMENTED IN THIS BUILD. These tests are intentionally SKIPPED.
 *
 * Persona D (15-yr C2C QA) cross-check: in a real consumer-to-consumer
 * marketplace the buy/checkout/payment path is the SINGLE TOP P0 — it is the
 * only flow that moves real money, and its failure modes (double-charge, failed
 * or wrong payout, chargebacks, fraud, PCI/regulatory exposure) outrank even an
 * auth outage in business and legal severity.
 *
 * This app has NO payment surface: no buy button, cart, checkout, payment
 * provider, escrow, fees, or payout. The "Sell" flow only creates a listing —
 * no money changes hands. There is therefore nothing to drive on the simulator,
 * so these cases CANNOT be executed here.
 *
 * They are encoded as `it.skip` (rather than omitted) so that:
 *   1. the #1 canonical P0 is VISIBLE in every test report as "skipped", not
 *      silently absent;
 *   2. the intended coverage is specified and ready to UNSKIP the day a payment
 *      flow ships;
 *   3. reviewers can see the prioritization decision was deliberate.
 *
 * See TEST_STRATEGY.md §4.1 (Persona D cross-check) and §7 (out of scope).
 */
describe.skip('P0 Transaction / Payment (NOT IN BUILD — feature absent)', () => {
  // Happy path — the core money movement.
  it.skip('buyer purchases an available listing and payment is captured for the correct amount', async () => {
    // GIVEN an authenticated buyer viewing an available listing
    // WHEN they complete checkout with a valid payment method
    // THEN payment is captured for exactly the listing price (+ any fees shown)
    //  AND the listing transitions to SOLD
    //  AND the buyer sees an order confirmation.
  });

  // Transaction guard — must not be able to buy something already sold.
  it.skip('blocks purchase of a listing that is already SOLD', async () => {
    // GIVEN a listing already marked SOLD
    // WHEN the buyer attempts to check out
    // THEN checkout is prevented and the buyer is told the item is unavailable
    //  AND no payment is captured (no double-sale / no charge for nothing).
  });

  // Negative — declined / failed payment must not mark the item sold.
  it.skip('handles a declined payment without marking the listing sold', async () => {
    // GIVEN a buyer at checkout
    // WHEN the payment is declined
    // THEN a clear error is shown, the listing stays available, and no funds move.
  });

  // BVA / integrity — amount and fee math at the boundaries.
  it.skip('charges the exact total (price + platform fee) with no rounding error', async () => {
    // BVA around fee rounding (e.g. ¥0, ¥1, large amounts) — the total charged
    // must equal price + fee to the smallest currency unit.
  });

  // Seller side — payout after a completed sale.
  it.skip('credits the seller payout (price minus fee) after a completed sale', async () => {
    // GIVEN a completed purchase
    // THEN the seller's payable balance increases by price minus the platform fee.
  });

  // State / idempotency — no duplicate charge on retry.
  it.skip('does not double-charge when the buyer retries a timed-out checkout', async () => {
    // Idempotency: a retried/duplicated checkout request must capture funds once.
  });
});
