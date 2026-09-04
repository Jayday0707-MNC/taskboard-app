# Rowboard — Trello-style Task Board

A full-stack task management app: boards → lists → cards, with user accounts.

**Stack:** React (Vite) · Node.js/Express · SQLite · JWT authentication

## Project structure

```
taskboard/
  backend/     Express API + SQLite database
  frontend/    React app (Vite)
```

## Running it locally

You'll need [Node.js](https://nodejs.org) (v18+) installed.

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

This starts the API on `http://localhost:4000`. A `taskboard.db` SQLite file is created automatically — no separate database install needed.

### 2. Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

This starts the app on `http://localhost:5173`. Sign up for an account, and you're in.

## What's implemented

- Signup / login with hashed passwords + JWT
- Create/delete boards
- Create/rename/delete lists within a board
- Create/edit/delete cards within a list
- Each user only sees their own boards

## Ideas for extending it (great for your README's "what I'd add next")

- Drag-and-drop reordering of cards/lists (try `@dnd-kit/core`)
- Real-time updates with WebSockets/Socket.IO
- Due dates, labels, and card assignees
- Move cards between lists via a dropdown (the backend already supports this via `PATCH /api/cards/:id` with a new `listId`)

## Deploying

- **Frontend**: deploy `frontend/` to Vercel or Netlify (build command `npm run build`, output dir `dist`)
- **Backend**: deploy `backend/` to Railway or Render. Set the `JWT_SECRET` environment variable there — don't commit your real `.env` file
- Update the frontend's API base URL (in `src/api.js`) to point to your deployed backend URL once both are live
