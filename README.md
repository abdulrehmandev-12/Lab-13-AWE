# CED-329 Lab 13 — React + Express To-Do App

## Requirements
- Node.js and npm
- Two terminals

## Run the backend
```bash
cd backend
npm install
npm start
```
The API runs at http://localhost:5000.

## Run the frontend
Open a second terminal:
```bash
cd frontend
npm install
npm start
```
The React app runs at http://localhost:3000.

## API routes
- `GET /todos` — list tasks
- `POST /todos` — create task; rejects blank input (400) and case-insensitive duplicates (409)
- `PUT /todos/:id` — update task/completion state (200)
- `DELETE /todos/:id` — delete task (204)

Data is stored in memory and resets when the backend restarts. This is intentional for the lab.
