# Empire HomePath Pro

A premium professional toolkit for New York mortgage lenders and real estate agents.

## Features

- **Instant Eligibility Engine:** Match clients with statewide assistance programs in seconds.
- **Client PDF Reports:** Generate professional, branded roadmaps for homebuyers.
- **Lead Generation Widget:** Embeddable widget for LO/Agent websites to capture and qualify leads.
- **Professional Dashboard:** Manage leads, customize white-label settings, and access embed codes.

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- Turso (libSQL) database
- Stripe account (for subscriptions)

### Backend Setup

1. Navigate to the `backend` directory.
2. Install dependencies: `npm install`.
3. Create a `.env` file based on `.env.example`:
   - `TURSO_URL`: Your Turso DB URL.
   - `TURSO_AUTH_TOKEN`: Your Turso Auth Token.
   - `JWT_SECRET`: A secure secret for JWT.
   - `STRIPE_SECRET_KEY`: Your Stripe Secret Key.
4. Seed the admin account: `node seed-admin.js`.
5. Start the server: `node server.js`.

### Frontend Setup

1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`.
3. Create a `.env` file:
   - `VITE_API_URL`: URL of your backend (leave empty for proxy in dev).
4. Start the development server: `npm run dev`.

## Environment Variables

| Variable | Description | Location |
| :--- | :--- | :--- |
| `TURSO_URL` | Turso DB connection string | Backend |
| `TURSO_AUTH_TOKEN` | Turso DB authentication token | Backend |
| `JWT_SECRET` | Secret key for JWT signing | Backend |
| `STRIPE_SECRET_KEY` | Stripe secret API key | Backend |
| `VITE_API_URL` | Backend API URL (for production) | Frontend |

## Deployment

### Backend (Render/Heroku)

- Set all backend environment variables.
- Ensure the database is accessible.
- Command: `node server.js`.

### Frontend (Vercel/Netlify)

- Set `VITE_API_URL` to the backend's public URL.
- Build command: `npm run build`.
- Output directory: `dist`.

