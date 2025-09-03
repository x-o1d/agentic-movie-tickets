# Functional Test Cases — Movie Ticket Booking (Azure)

Source of truth: `docs/functional-requirements.md`

Note: Includes happy and unhappy paths. IDs grouped by module for traceability.

## User & Authentication

- __[AUTH-001] Signup (happy path)__
  - Preconditions: New email/phone.
  - Steps:
    1) Open signup
    2) Enter valid details
    3) Submit
    4) Enter OTP from email/SMS (ACS)
  - Expected:
    - Account created via AD B2C
    - OTP delivered ≤ 10s and accepted
    - Session established; profile visible

- __[AUTH-002] Signup with existing email (unhappy)__
  - Preconditions: Email already registered
  - Steps: Attempt signup with same email
  - Expected: Generic error (no enumeration); no duplicate account

- __[AUTH-003] Login (happy path)__
  - Preconditions: Verified account
  - Steps: Enter valid email/password; submit
  - Expected: Login success; access + refresh tokens issued; redirect to home

- __[AUTH-004] Login wrong password (unhappy)__
  - Steps: Valid email + wrong password
  - Expected: Error message; rate-limited after N attempts; no enumeration

- __[AUTH-005] Password reset__
  - Steps: Request reset → receive email/SMS → set new strong password
  - Expected: Token validated; policy enforced; old tokens revoked

- __[AUTH-006] Guest checkout__
  - Steps: Select seats → checkout as guest → pay
  - Expected: Booking created; e-ticket delivered via email/SMS; no account required

- __[AUTH-007] 2FA (OTP) opt-in & challenge__
  - Steps: Enable 2FA → logout → login → OTP challenge → enter OTP
  - Expected: OTP required and validated; resend works; lockout on too many attempts

- __[AUTH-008] Token rotation__
  - Steps: Use app until refresh triggers
  - Expected: Access token rotated; prior token invalidated; session persists

## Discovery & Showtimes

- __[DISC-001] Filtering combinations__
  - Steps: Filter by city, cinema, date, movie, language, format (individually and combined)
  - Expected: Correct results; filters are composable

- __[DISC-002] Movie details completeness__
  - Steps: Open a movie detail page
  - Expected: Title, synopsis, duration, genre, cast, trailer, showtimes, pricing, availability

- __[DISC-003] Pagination/performance__
  - Steps: Query popular city/day with many results
  - Expected: P95 ≤ 2s; paginated/infinite scroll behaves correctly

- __[DISC-004] No results (unhappy)__
  - Steps: Apply filters yielding no matches
  - Expected: Clear empty state; quick “clear filters” action

## Seat Selection

- __[SEAT-001] Real-time map load__
  - Steps: Open seat map for a showtime
  - Expected: Accurate states (available/held/booked); classes indicated; accessibility seats marked

- __[SEAT-002] Hold seats (happy)__
  - Steps: Select multiple seats
  - Expected: Hold created; TTL countdown visible; consistent across devices

- __[SEAT-003] Hold expiry auto-release__
  - Steps: Let TTL expire without checkout
  - Expected: Seats become available ≤ 1s after expiry

- __[SEAT-004] Concurrent selection conflict (unhappy)__
  - Steps: Two users attempt same seat
  - Expected: Later user gets actionable error; alternatives suggested

- __[SEAT-005] Accessibility rule enforcement__
  - Steps: Try selecting accessibility seats without eligibility (if enforced)
  - Expected: Rule enforced; clear messaging

## Pricing & Offers

- __[PRICE-001] Dynamic pricing correctness__
  - Steps: Select seats across classes and time bands
  - Expected: Base + class + time band + taxes/fees; totals correct

- __[PRICE-002] Promo apply (eligible)__
  - Steps: Apply valid promo meeting criteria
  - Expected: Server-side validation; discount applied; audit recorded

- __[PRICE-003] Promo invalid/ineligible (unhappy)__
  - Steps: Apply expired/ineligible promo
  - Expected: Clear error; no discount; audit reason stored

- __[PRICE-004] Price change during session__
  - Steps: Keep cart open through price update; proceed
  - Expected: Price refresh before payment; user informed if total changes

## Checkout & Payments

- __[PAY-001] Idempotent order creation__
  - Steps: Submit with idempotency key; retry same request
  - Expected: Same order returned; no duplicates

- __[PAY-002] Payment success (happy)__
  - Steps: Complete payment (card/UPI/wallet)
  - Expected: Exactly-once seat commit after success; order = paid; redirect to confirmation

- __[PAY-003] Payment failure (unhappy)__
  - Steps: Simulate gateway decline
  - Expected: Clear failure; order unpaid; seats released or hold kept per policy

- __[PAY-004] Payment pending/timeout__
  - Steps: Simulate pending/timeout
  - Expected: Pending UI; safe retry; no double-charge; final status updates via webhook/sync

- __[PAY-005] Double-submit protection__
  - Steps: Double-click pay rapidly
  - Expected: One transaction; button disables; idempotency preserved

## Tickets & Notifications

- __[TIX-001] Ticket generation & storage__
  - Steps: After payment, open booking
  - Expected: PNR/QR generated; stored in Blob; secure link works

- __[TIX-002] Email/SMS delivery__
  - Steps: Complete booking; check inbox/SMS
  - Expected: Delivered via ACS ≤ 10s; includes PNR/QR

- __[TIX-003] Resend ticket__
  - Steps: Click Resend
  - Expected: Message re-sent; rate-limited

- __[TIX-004] Booking history (logged-in)__
  - Steps: View My bookings
  - Expected: Complete list with statuses; access e-tickets

## Cancellations & Refunds

- __[REF-001] Policy-based cancellation (happy)__
  - Steps: Cancel within window
  - Expected: Accepted; refund initiated per policy; status updated

- __[REF-002] Cancellation after cutoff (unhappy)__
  - Steps: Cancel after window
  - Expected: Clear policy message; no refund

- __[REF-003] Partial refund rules__
  - Steps: Partial cancellation (if allowed)
  - Expected: Correct proration; audit logged

- __[REF-004] Refund status tracking__
  - Steps: Check refund status
  - Expected: Initiated/processing/completed/failed with timestamps

## Admin & Reporting

- __[ADMIN-001] Admin CRUD entities__
  - Steps: Create/update/delete movie, cinema, screen, showtime, pricing, promo
  - Expected: Validation; success messages; audit entries

- __[ADMIN-002] Discovery reflection latency__
  - Steps: Create/modify showtime
  - Expected: Visible in discovery within 5 minutes

- __[ADMIN-003] Reporting accuracy & export__
  - Steps: Generate sales/occupancy/refund reports; export CSV
  - Expected: Accurate data; CSV downloads

## Cloud & Ops (functional verifications)

- __[OPS-001] Observability & correlation__
  - Steps: Perform end-to-end booking
  - Expected: Correlation-ID across services; traces/metrics/logs in App Insights

- __[OPS-002] Security controls__
  - Steps: Verify TLS/WAF/rate limiting; inspect network
  - Expected: TLS 1.2+; WAF headers; rate-limited endpoints; secrets not exposed

- __[OPS-003] DR readiness (tabletop/simulated)__
  - Steps: Execute DR scenario
  - Expected: RPO ≤ 15 min; RTO ≤ 1 hr; data integrity

---

## Traceability Matrix (FR → Tests)

- __Auth__: AUTH-001..008
- __Discovery__: DISC-001..004
- __Seat Selection__: SEAT-001..005
- __Pricing & Offers__: PRICE-001..004
- __Checkout & Payments__: PAY-001..005
- __Tickets/Notifications__: TIX-001..004
- __Cancellations/Refunds__: REF-001..004
- __Admin/Reporting__: ADMIN-001..003
- __Ops__: OPS-001..003
