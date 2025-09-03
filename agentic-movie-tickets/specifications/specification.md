# Agentic Movie Tickets – Product Specification

## 1. Overview
- Purpose: A lightweight demo movie ticketing app with a gallery of current and upcoming movies and a simple booking flow.
- Tech Stack:
  - Frontend: Vite + React (`frontend/`)
  - Backend: Express API (`backend/`)
- Primary Users: Moviegoers browsing posters and booking tickets.

## 2. Goals & Non-Goals
- Goals:
  - Display “Now Showing” and “Coming Soon” posters.
  - Allow a user to open a movie, pick a date, pick a time slot, select a seat, and confirm booking.
  - Show info-only dialog for “Coming Soon” items.
- Non-Goals:
  - Payments, user accounts, real inventory, or persistence beyond in-memory demo data.

## 3. User Stories
- As a user, I can browse “Now Showing” posters in a 3-column grid.
- As a user, clicking a “Now Showing” poster opens a booking dialog prefilled with today’s date.
- As a user, I must select a time slot before continuing to seat selection.
- As a user, I can select a seat from a grid and confirm, then see a success screen.
- As a user, I can browse “Coming Soon” posters, click one, and view a poster + description (no booking).
- As a user, broken images are replaced automatically with a placeholder.

## 4. Information Architecture & Navigation
- Top navbar with links: Home, Buy Tickets, Login, Book (demo links).
- Home shows two sections:
  - Now Showing: interactive booking flow.
  - Coming Soon: info-only dialog.

## 5. Booking Flow (Now Showing)
- Step 1 – Details
  - Prefilled date (today).
  - Time slot selection (required to continue).
  - Continue disabled until a time is selected.
- Step 2 – Seats
  - 4 rows × 6 columns seat grid (A1–D6).
  - Back/Confirm; Confirm disabled until a seat is selected.
- Step 3 – Success
  - Summary of movie, date, time, and seat.
  - Done closes the dialog and resets state.

Accessibility & UX
- Modal uses `role="dialog"`, `aria-modal="true"`.
- ESC closes dialog(s); body scroll locked while open.
- Buttons have clear disabled styles; time-slot selection has active state.

## 6. Coming Soon Flow
- Clicking a poster opens an info-only dialog with:
  - Poster image
  - Short description paragraph
  - Close button
- No time slots, seats, or booking.

## 7. APIs
Base URL from frontend: `/api`

- GET `/api/images`
  - Returns an array of current movies.
  - Shape:
    ```json
    [
      { "id": 1, "url": "<posterUrl>", "title": "<movieName>" },
      ...
    ]
    ```
  - Notes: Uses a mix of reliable placeholder images and a few fixed poster URLs.

- GET `/api/images2`
  - Returns an array of upcoming movies.
  - Same shape as `/api/images`.

Error Handling
- Network/load errors surface as messages on the page (e.g., “Failed to load images”).
- Image element has `onError` fallback to a placeholder poster.

## 8. Data Model (frontend)
- Movie: `{ id: number, url: string, title: string }`
- Booking UI State:
  - `open: boolean`, `selected: Movie | null`
  - `selectedDate: YYYY-MM-DD string`
  - `selectedTime: '10:00' | '13:00' | '16:00' | '19:00' | '22:00' | ''`
  - `step: 'details' | 'seats' | 'success'`
  - `selectedSeat: string` (e.g., `"B3"`)
- Coming Soon UI State:
  - `infoOpen: boolean`, `infoSelected: Movie | null`

## 9. State Management
- Local component state via React `useState`.
- Data retrieved via `fetch` calls on mount in `Home.jsx`.

## 10. Styling & Responsiveness
- Global styles in `frontend/src/styles.css`.
- Grids switch to 2 columns under 800px.
- Distinct disabled styles for primary/secondary buttons.

## 11. Performance
- Minimal payloads (9 items per list).
- Placeholder images sized to 400×600.

## 12. Security
- No authentication/authorization for demo.
- No sensitive data stored.

## 13. Logging & Monitoring
- N/A for demo. DevTools/browser console for debugging.

## 14. Test Plan (lightweight)
- API: Verify `/api/images` and `/api/images2` return 200 + expected shape.
- UI:
  - Broken image fallback swaps to placeholder.
  - Booking flow: Continue disabled until time; Confirm disabled until seat.
  - Success step shows correct summary and closes with Done.
  - Coming Soon dialog opens/closes and shows poster + text.

## 15. Future Enhancements
- Real showtime/seat availability from backend.
- Logged-in users, reservations, and payment integration.
- Search and filters (by date, genre, cinema).
- Seat types/pricing, multiple tickets, and concessions.
- Persisted bookings and email confirmations.
