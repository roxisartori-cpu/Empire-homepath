# Empire HomePath

A user-friendly web app that simplifies the search for first-time homebuyer assistance programs in New York State.

## Project Structure

- `frontend/`: Vite + React + Tailwind CSS single-page application.
- `backend/`: Node.js/Express bridge server for coordinating with the Live Verification Agent.

## Features

- **Personalized Matching**: Matches users with programs based on income, location, and household size.
- **Live Verification**: Real-time verification of program requirements via agent coordination.
- **Lender Referral**: Direct path to connect with specialized partner lenders.
- **Readiness Checklist**: Interactive tool to help homebuyers prepare for the process.

## Setup & Local Development

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

### Backend
1. `cd backend`
2. `npm install`
3. `npm start`

## Deployment

- **Frontend**: Deploy to Vercel by connecting the `frontend/` directory. Set the environment variable `VITE_API_URL` to your backend's URL.
- **Backend**: Deploy to Render by connecting the `backend/` directory.
