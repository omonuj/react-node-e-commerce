# React + Node E‑Commerce

A full‑stack e‑commerce application built on the **MERN** stack (MongoDB, Express, React, Node.js). It includes user authentication, an admin dashboard for managing products, categories and orders, product search & filtering, a shopping cart, and checkout powered by Braintree.

> **Status:** This project was originally built against 2019‑era package versions. It runs, but several dependencies and code patterns are now deprecated. See [Modernization Notes](#modernization-notes) before deploying to production.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Reference](#api-reference)
- [Modernization Notes](#modernization-notes)
- [License](#license)

---

## Features

- 🔐 **Authentication & authorization** — JWT‑based sign up / sign in / sign out, with user and admin roles.
- 🛍️ **Product catalog** — browse, search, filter by category and price, and view related products.
- 🖼️ **Image uploads** — product photos stored in MongoDB via multipart form uploads.
- 🛒 **Shopping cart** — add/remove items, adjust quantities, persisted in `localStorage`.
- 💳 **Checkout** — Braintree drop‑in payment integration.
- 📊 **Admin dashboard** — create/update/delete products and categories, manage order statuses.
- 📜 **Order history** — users can view their past purchases.

---

## Tech Stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | React 16, React Router 5, Braintree Web Drop‑in |
| Backend   | Node.js, Express 4, Mongoose 5 |
| Database  | MongoDB |
| Auth      | JSON Web Tokens (`jsonwebtoken`, `express-jwt`) |
| Payments  | Braintree |
| Email     | SendGrid |

---

## Project Structure

```
react-node-ecommerce/
└── final-code-with-improvments/
    ├── ecommerce/            # Backend — Express REST API
    │   ├── app.js            # App entry point & middleware
    │   ├── controllers/      # Route handlers (auth, user, product, category, order, braintree)
    │   ├── models/           # Mongoose schemas
    │   ├── routes/           # Express routers
    │   ├── validator/        # Request validation
    │   └── helpers/          # DB error formatting
    │
    └── ecommerce-front/      # Frontend — Create React App
        ├── server.js         # Static production server (Express + compression)
        └── src/
            ├── auth/          # Auth API calls + route guards
            ├── admin/         # Admin dashboard screens
            ├── core/          # Storefront (home, shop, cart, checkout, product cards)
            └── user/          # User dashboard, profile, sign in/up
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- A running [MongoDB](https://www.mongodb.com/) instance (local or Atlas)
- A [Braintree](https://www.braintreepayments.com/) sandbox account (for checkout)
- A [SendGrid](https://sendgrid.com/) account (optional, for email)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd react-node-ecommerce/final-code-with-improvments

# Backend
cd ecommerce
npm install

# Frontend
cd ../ecommerce-front
npm install   # or: yarn install
```

### 2. Configure environment

Create a `.env` file in **both** `ecommerce/` and `ecommerce-front/` (see [Environment Variables](#environment-variables)).

### 3. Run

```bash
# Terminal 1 — backend (http://localhost:8000)
cd ecommerce
npm start

# Terminal 2 — frontend (http://localhost:3000)
cd ecommerce-front
npm start
```

---

## Environment Variables

**`ecommerce/.env`** (backend)

```env
DATABASE=mongodb://localhost:27017/ecommerce
PORT=8000
JWT_SECRET=your_jwt_secret
BRAINTREE_MERCHANT_ID=your_merchant_id
BRAINTREE_PUBLIC_KEY=your_public_key
BRAINTREE_PRIVATE_KEY=your_private_key
```

**`ecommerce-front/.env`** (frontend)

```env
REACT_APP_API_URL=http://localhost:8000/api
```

> ⚠️ Never commit `.env` files — they are ignored via `.gitignore`.

---

## Available Scripts

### Backend (`ecommerce/`)

| Command | Description |
|---------|-------------|
| `npm start` | Start the API with `nodemon` (auto‑reload) |

### Frontend (`ecommerce-front/`)

| Command | Description |
|---------|-------------|
| `npm start` | Run the development server |
| `npm run build` | Build for production |
| `npm test` | Run tests |

---

## API Reference

All routes are prefixed with `/api`.

### Interactive docs (Swagger / OpenAPI)

An interactive Swagger UI is served by the backend, so you can browse and try every endpoint:

| Environment | Swagger UI | OpenAPI spec (JSON) |
|-------------|-----------|---------------------|
| **Live (Vercel)** | https://react-node-e-commerce-delta.vercel.app/api-docs | https://react-node-e-commerce-delta.vercel.app/api-docs.json |
| **Local** | http://localhost:8000/api-docs | http://localhost:8000/api-docs.json |

The spec is defined in [`ecommerce/docs/openapi.js`](src/ecommerce/docs/openapi.js) and mounted in [`ecommerce/app.js`](src/ecommerce/app.js). Protected routes use a JWT from `POST /signin` — click **Authorize** in Swagger UI and paste the token to try them.

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Register a new user |
| POST | `/signin` | Authenticate and receive a JWT |
| GET  | `/signout` | Clear the auth cookie |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/:userId` | Get a user profile (auth) |
| PUT | `/user/:userId` | Update a user profile (auth) |
| GET | `/orders/by/user/:userId` | Get a user's purchase history (auth) |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | List products (supports `sortBy`, `order`, `limit`) |
| GET | `/product/:productId` | Get a single product |
| GET | `/product/photo/:productId` | Get a product's photo |
| GET | `/products/search` | Search products |
| GET | `/products/related/:productId` | Related products |
| GET | `/products/categories` | Categories that have products |
| POST | `/products/by/search` | Filtered product search |
