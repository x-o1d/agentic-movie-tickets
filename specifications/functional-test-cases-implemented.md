# Functional Test Cases — Implemented Scope

Source of truth for implemented features: `specifications/specification.md`
Scope covers the current demo app behavior in `frontend/src/pages/Home.jsx` and API in `backend/src/routes/`.

## Legend
- Modal A: Now Showing booking dialog (details → seats → success)
- Modal B: Coming Soon info-only dialog

## API

- __[API-001] GET /api/images returns list__
  - Steps: GET `/api/images`
  - Expected: HTTP 200; JSON array of 9 items; each has `id`, `url`, `title`.

- __[API-002] GET /api/images2 returns list__
  - Steps: GET `/api/images2`
  - Expected: HTTP 200; JSON array of 9 items; each has `id`, `url`, `title`.

## Home — Now Showing Grid

- __[HOME-001] Grid renders posters__
  - Steps: Load Home
  - Expected: 3-column grid rendered; up to 9 posters visible.

- __[HOME-002] Broken image fallback__
  - Preconditions: Temporarily set a poster URL to an invalid link
  - Steps: Refresh; observe image element
  - Expected: Image `onError` replaces `src` with `https://placehold.co/400x600?text=Poster`.

## Modal A — Booking (Details)

- __[BOOK-001] Open dialog__
  - Steps: Click any poster in Now Showing
  - Expected: Modal A opens; background scroll locked; ESC key closes.

- __[BOOK-002] Prefill date as today__
  - Steps: Open Modal A
  - Expected: Date input prefilled with today (YYYY-MM-DD).

- __[BOOK-003] Continue disabled until time selected__
  - Steps: Open Modal A; do not select a time
  - Expected: Continue button is disabled
  - Steps: Select any time slot
  - Expected: Continue becomes enabled; active state applied to chosen slot.

- __[BOOK-004] Proceed to seats__
  - Steps: From details, select a time → click Continue
  - Expected: Modal A shows Seats step.

## Modal A — Booking (Seats)

- __[BOOK-005] Seat grid renders__
  - Steps: Reach Seats step
  - Expected: 4×6 grid (A1–D6) displayed.

- __[BOOK-006] Confirm disabled until seat__
  - Steps: On Seats step without selecting seat
  - Expected: Confirm button disabled
  - Steps: Select seat (e.g., B3)
  - Expected: Confirm enabled; selected seat highlighted.

- __[BOOK-007] Back navigates to details__
  - Steps: Click Back on Seats step
  - Expected: Returns to Details step keeping previously chosen time.

- __[BOOK-008] Confirm shows success__
  - Steps: Select seat → Confirm
  - Expected: Success step visible with summary: movie title, date, time, seat.

## Modal A — Booking (Success)

- __[BOOK-009] Done closes modal__
  - Steps: On Success step, click Done
  - Expected: Modal closes; body scroll restored; internal step resets to Details for next open.

## Modal B — Coming Soon (Info Only)

- __[INFO-001] Open info dialog__
  - Steps: Click any poster in Coming Soon grid
  - Expected: Modal B opens with poster and description; background scroll locked; ESC closes.

- __[INFO-002] No booking controls__
  - Steps: Inspect Modal B
  - Expected: No date, time, or seats UI; only Close button.

- __[INFO-003] Broken image fallback__
  - Preconditions: Temporarily set a coming-soon poster URL to invalid
  - Steps: Refresh; open Modal B
  - Expected: Image replaced by placeholder via `onError`.

## Accessibility & UI Behavior

- __[A11Y-001] Dialog semantics__
  - Steps: Inspect DOM of open modal(s)
  - Expected: Container has `role="dialog"` and `aria-modal="true"`.

- __[UI-001] Disabled button styles__
  - Steps: Observe disabled Continue/Confirm buttons
  - Expected: Distinct disabled visual style as per `.css` (`button:disabled`, `button.secondary:disabled`).

## Negative Paths

- __[NEG-001] Try proceeding without time__
  - Steps: Open Modal A; do not select time; try to Continue
  - Expected: Continue remains disabled; no navigation.

- __[NEG-002] Try confirming without seat__
  - Steps: Modal A Seats step; no seat selected; click Confirm
  - Expected: Confirm disabled; no navigation.

## Regression/Integration

- __[REG-001] ESC closes regardless of step__
  - Steps: Open Modal A; verify at Details/Seats/Success; press ESC
  - Expected: Modal closes in all steps.

- __[REG-002] Scroll lock while any modal open__
  - Steps: Open Modal A or Modal B; attempt to scroll body
  - Expected: Body scroll disabled; restored on close.
