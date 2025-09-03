# Full-Stack Boilerplate: Express + SQLite + React (Vite)

## Structure
- `backend/`: Node.js Express API with SQLite
- `frontend/`: React app via Vite with proxy to backend

## Prerequisites
- Node.js 18+

## Setup

### Backend
```bash
# In backend/
cp .env.example .env
npm install
npm run dev
```
- Server: http://localhost:4000
- Health: GET http://localhost:4000/health
- API base: `/api`

### Frontend
```bash
# In frontend/
npm install
npm run dev
```
- App: http://localhost:5173
- Dev server proxies `/api/*` to `http://localhost:4000`

## API
- `GET /api/todos` — list
- `POST /api/todos` — body: `{ title: string }`
- `PATCH /api/todos/:id` — body: `{ title?: string, completed?: boolean }`
- `DELETE /api/todos/:id`

## Configuration
- `backend/.env`
  - `PORT=4000`
  - `DATABASE_PATH=./data/app.db`
  - `CORS_ORIGIN=http://localhost:5173`

## Notes
- SQLite DB file stored at `backend/data/app.db` (gitignored).
- Adjust CORS_ORIGIN if you change the frontend port.
- For production, serve the frontend from a static host and point it to the backend URL.
