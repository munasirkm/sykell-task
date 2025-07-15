# Sykell Dashboard

A full-stack web application for crawling URLs, analyzing internal/external links, detecting login forms, and visualizing results. Built with a Go backend and a React frontend.

---

## Features
- Submit URLs for crawling and analysis
- Detect number of internal/external links, heading tags, broken links and presence of login forms
- Visualize link data and broken links
- Filter, search, and manage crawled URLs
- Real time display of the status
- Responsive UI with PrimeReact components

---

## Prerequisites
- **Node.js**
- **npm**
- **Go**
- **Docker**

---
## How to run
## Using Docker (Prefered)

You can run both frontend and backend using Docker Compose:

1. **From the project root, run:**
   ```sh
   docker compose build
   docker compose up
   ```
2. **Access the app:**
   - Frontend: [http://localhost:8001](http://localhost:8001)
   - Backend API: [http://localhost:8080](http://localhost:8080)

---
---

## Backend Setup (Go)

1. **Navigate to the backend directory:**
   ```sh
   cd backend
   ```
2. **Install Go dependencies:**
   ```sh
   go mod tidy
   ```
3. **Run the backend server:**
   ```sh
   go run main.go
   ```
   The backend will start on the default port (e.g., 8080).

---

## Frontend Setup (React)

1. **Navigate to the frontend directory:**
   ```sh
   cd frontend
   ```
2. **Install npm dependencies:**
   ```sh
   npm install
   ```
3. **Start the React development server:**
   ```sh
   npm start
   ```
   The frontend will start on [http://localhost:3000](http://localhost:3000) by default.



## Project Structure
```
sykell-task/
  backend/      # Go backend API and crawler
  frontend/     # React frontend app
  docker-compose.yml
```

---

## Environment Variables
- The default setup assumes local development. If you need to change API endpoints or database configs, update the relevant files in `backend/` and `frontend/src/Api/axiosInstance.ts`.

---

## Troubleshooting
- Ensure Go and Node.js are installed and in your PATH.
- If ports are in use, change them in the backend or frontend config.
- For Docker issues, ensure Docker Desktop is running and up to date.

---
