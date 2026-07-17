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
| POST | `/product/create/:userId` | Create a product (admin) |
| PUT | `/product/:productId/:userId` | Update a product (admin) |
| DELETE | `/product/:productId/:userId` | Delete a product (admin) |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/categories` | List categories |
| GET | `/category/:categoryId` | Get a category |
| POST | `/category/create/:userId` | Create a category (admin) |
| PUT | `/category/:categoryId/:userId` | Update a category (admin) |
| DELETE | `/category/:categoryId/:userId` | Delete a category (admin) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/order/create/:userId` | Create an order (auth) |
| GET | `/order/list/:userId` | List all orders (admin) |
| GET | `/order/status-values/:userId` | Allowed order statuses (admin) |
| PUT | `/order/:orderId/status/:userId` | Update order status (admin) |

### Payments (Braintree)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/braintree/getToken/:userId` | Get a client token (auth) |
| POST | `/braintree/payment/:userId` | Process a payment (auth) |

---

## Modernization Notes

This codebase relies on several libraries and patterns that are **deprecated or end‑of‑life**. Everything still functions on the pinned versions in `package.json`, but the following should be addressed before treating this as production‑ready. They are intentionally *not* changed automatically, because most require code migration.

### Backend

| Item | Issue | Recommended action |
|------|-------|--------------------|
| `mongoose@5` + `useNewUrlParser` / `useCreateIndex` | These connection options are no‑ops / removed in Mongoose 6+. Callback‑style queries (`Model.find(query, cb)`, `doc.save(cb)`) were **removed in Mongoose 7**. | Upgrade to Mongoose 8 and convert all queries to `async/await` + promises. |
| `body-parser` | Deprecated as a separate package. | Remove it and use the built‑in `express.json()` / `express.urlencoded()`. |
| `express-validator@5` | Uses the legacy `req.check()` / `req.validationErrors()` API removed in v6+. | Upgrade to `express-validator@7` and use the `body()`/`validationResult()` middleware API. |
| `express-jwt@5` | The `userProperty` option and default HS256 handling changed in v6+; v5 is unmaintained. | Upgrade to `express-jwt@8` (`{ secret, algorithms: ['HS256'] }`, `requestProperty`). |
| `uuid@3` (`require('uuid/v1')`) | The deep‑import path was removed in uuid v7+. | Upgrade to `uuid@9+` and use `import { v1 as uuidv1 } from 'uuid'`. |
| Password hashing with `crypto.createHmac('sha1', …)` | SHA‑1 is cryptographically weak for password storage. | Replace with `bcrypt` or `argon2`. |
| `@sendgrid/mail@6` | Several major versions behind; older API surface. | Upgrade to the latest `@sendgrid/mail`. |
| `moment@2` | In maintenance mode; the Moment team recommends alternatives. | Replace with `date-fns` or `Day.js`. |
| `nodemon@1` | Major versions behind. | Upgrade to `nodemon@3` (dev dependency). |
| `braintree@2` | Braintree is now maintained under the PayPal SDK; the classic `braintree.connect()` API is legacy. | Consider migrating to the current Braintree/PayPal SDK. |

### Frontend

| Item | Issue | Recommended action |
|------|-------|--------------------|
| `react@16` / `react-dom@16` + `ReactDOM.render` | `ReactDOM.render` is deprecated in React 18. | Upgrade to React 18 and switch to `createRoot`. |
| `react-scripts@3` (Create React App) | CRA is no longer maintained. | Migrate to [Vite](https://vitejs.dev/) or Next.js. |
| `react-router-dom@5` (`Switch`, `component=`) | The `Switch` component and `component` prop were replaced in v6. | Upgrade to React Router 6+ (`Routes`, `element=`). |
| `query-string@6` | Several majors behind. | Upgrade, or use the native `URLSearchParams`. |
| `pm2` as a project dependency | Process managers belong in the deployment environment, not in `dependencies`. | Remove from `dependencies`; install on the server instead. |

> A safe upgrade path is to tackle these one package at a time, run the app after each change, and add tests around auth, checkout and product CRUD before starting.

---

## License

ISC. This project is provided for educational purposes.
