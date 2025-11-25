🖥️ Personal Budget Tracker — Backend (Node.js + Express)

This is the backend server for the Personal Budget Tracker App.
It handles authentication verification, database operations, transaction management, and caching.

The stack includes Node.js, Express, Neon PostgreSQL, Clerk Authentication, and Upstash Redis.

🚀 Features

REST API built with Node.js + Express

Clerk token verification

Neon PostgreSQL for database

Redis caching for performance

Add + fetch transactions

Secure per-user data separation

🧰 Tech Stack

Node.js

Express.js

Neon PostgreSQL (@neondatabase/serverless)

Clerk Authentication

Upstash Redis

dotenv

📦 Installation
git clone https://github.com/Abhay98-dev/backend-wallet.git
cd backend
npm install


▶️ Running the Server
npm run dev

Server will start on the port defined in .env.

🔗 API Endpoints
➤ GET /api/transactions/total

Returns the user's total balance.

➤ GET /api/transactions/recent

Returns last 5 transactions.

➤ POST /api/transactions/add

Adds a new transaction.

🗄️ Database Schema
transactions table:
------------------------------------
id              SERIAL PRIMARY KEY
user_id         VARCHAR
amount          INT
type            VARCHAR   (income/expense)
description     TEXT
created_at      TIMESTAMP DEFAULT NOW()

⚡ Redis Caching

Caches total balance

Caches recent transactions

Cache auto-clears on new transaction

Improves performance on mobile

🔐 Authentication (Clerk)

Each request must include:

Authorization: Bearer <token>

The backend:

Verifies token → extracts userId

Fetches only that user's transactions