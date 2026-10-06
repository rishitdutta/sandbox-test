# Full Stack Coding Challenge

This repository contains a simple full-stack starter app with:
- **frontend**: React (Vite)
- **backend**: Node.js + Express + PostgreSQL
- **.devcontainer**: Codespaces/devcontainer setup with app + Postgres containers

## Project Structure

```text
.
├── .devcontainer/
│   ├── devcontainer.json
│   └── docker-compose.yml
├── backend/
│   ├── .env
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── package.json
│   └── src/
└── README.md
```

## Features

- Backend auto-creates and seeds an `items` table at startup.
- Frontend displays items in a table view (no search).
- Add item form to insert new rows.
- Refresh button to reload data.

## Run Locally

1. Install dependencies:
   - `npm install --prefix backend`
   - `npm install --prefix frontend`
2. Start backend:
   - `cd backend && npm start`
3. Start frontend:
   - `cd frontend && npm run dev`
4. Open the frontend URL shown by Vite (usually `http://localhost:3000`).

## Codespaces / Dev Container

1. Open this repository on GitHub.
2. Create a Codespace on the default branch.
3. Wait for setup to complete (`postCreateCommand` installs frontend/backend dependencies).
4. In terminals:
   - Backend: `cd backend && npm start`
   - Frontend: `cd frontend && npm run dev`