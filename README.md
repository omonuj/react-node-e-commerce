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
