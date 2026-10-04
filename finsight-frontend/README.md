# FinSight Frontend

FinSight is a personal finance tracker for expenses, income, monthly budgets, savings goals, analytics, forecasts, and account settings.

## Run locally

1. Start the API from the repository root:

	```powershell
	Push-Location backend-v1
	npm install
	npm run dev
	Pop-Location
	```

	Configure the backend environment and MongoDB connection before starting it. The API should be available at `http://localhost:5000/api`.

2. In another terminal, start the frontend:

	```powershell
	Push-Location finsight-frontend
	npm install
	npm run dev
	Pop-Location
	```

	Open the Vite URL printed in the terminal. Requests to `/api` are proxied to the local backend.

## Available commands

- `npm run dev` starts the Vite development server.
- `npm run build` creates the production bundle in `dist/`.
- `npm run preview` serves the production bundle locally.
- `npm run lint` runs Oxlint.

## App routes

- Public: `/`, `/login`, `/register`, `/forgot-password`, `/verify-otp`, `/reset-password`
- Protected: `/app/dashboard`, `/app/expenses`, `/app/income`, `/app/budgets`, `/app/goals`, `/app/analytics`, `/app/predictions`, `/app/ai-insights`, `/app/profile`

Password recovery uses the backend's 90-second email OTP flow. Financial data requires a valid bearer token from the API.
