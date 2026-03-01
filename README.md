### Library Management System

## Project Structure

- `LibraryAPI/LibraryAPI/` — ASP.NET Core Web API
- `library-frontend/` — React + Vite frontend
- `report/` — Report PDF

## Run Backend

```bash
cd LibraryAPI/LibraryAPI
dotnet restore
dotnet run
```

Backend runs on: `http://localhost:5236`

## Run Frontend

```bash
cd library-frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`
