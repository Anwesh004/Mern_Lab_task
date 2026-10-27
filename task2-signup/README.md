# Sign Up App — React + Express + MongoDB

A responsive sign-up/login starter based on the supplied reference image.

## Stack
- React + Vite
- Express REST API
- MongoDB + Mongoose
- bcryptjs password hashing
- dotenv and CORS

## Requirements
- Node.js 18+
- MongoDB local service or a MongoDB Atlas connection string

## 1. Configure the backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and set `MONGODB_URI`. Example for local MongoDB:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/signup_app
CLIENT_ORIGIN=http://localhost:5173
```

## 2. Install dependencies

Open one terminal:

```bash
cd backend
npm install
npm run dev
```

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## API
- `GET /api/health` — server status
- `POST /api/auth/signup` — body: `{ "email": "...", "password": "..." }`
- `POST /api/auth/login` — body: `{ "email": "...", "password": "..." }`

Successful signup stores a normalized email and a bcrypt password hash. The API never returns the password hash.

## Security notes
This is a learning starter, not a production-ready authentication system. Before production, add HTTPS, rate limiting, email verification, password reset, secure session or token handling, logging/monitoring, and stronger abuse protection. Login currently returns a simple success response; it does not issue a persistent session or JWT.
