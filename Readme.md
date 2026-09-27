*** E-Commerce Backend API ***

A monolithic e-commerce backend built from scratch with Node.js, Express, PostgreSQL, and Prisma ORM — supporting multi-role users (Customer/Seller), product management, cart operations, and a full checkout-to-order flow with price snapshotting and per-seller delivery calculation.

This project was built to deliberately practice real relational data modeling, transaction-safe checkout logic, and JWT-based authentication with access/refresh tokens — without relying on an ORM's defaults to hide the underlying database design decisions.


*** Tech Stack ***


Runtime = Node.js
Framework = Express
Database = PostgreSQL
ORM = Prisma (prisma-client-js)
Auth = JWT (access + refresh tokens), bcrypt
Cookies = cookie-parser (httpOnly refresh token)


*** Features ***

1.Authentication
Registration with role selection (Customer or Seller)
Role-specific required fields (e.g. shippingAddress required only for Customers)
Password hashing with bcrypt
JWT access token (short-lived) + refresh token (long-lived, stored as an httpOnly cookie)
Refresh token rotation endpoint

2.Products
Sellers can create, update (including restocking inventory), and manage their own products
Ownership-checked updates — a seller can only modify their own listings
Category-based organization
Product image support

3.Cart
One cart per user (enforced at the schema level)
Add / view cart items with live product pricing

4.Checkout & Orders
Partial checkout — customers select specific cart items to order, not necessarily the whole cart
Price snapshotting — OrderItem freezes the product's price at the moment of purchase, so later price changes never retroactively affect past orders

Address snapshotting — each Order stores its own shipping address at time of purchase
Multi-seller order splitting — a single order's items are grouped by seller internally to calculate delivery charges independently per seller

Delivery charge logic: free above a subtotal threshold, flat fee below it (per seller)
Checkout runs as a database transaction — an order and all its items are created atomically, and the corresponding cart items are removed only if the whole operation succeeds

Order status and payment status tracked as independent fields (delivery status ≠ payment status)

5.Reviews
Users can review products
One review per user per product (enforced via a composite unique constraint)


*** Project Strucutre ***

src/
 - controllers/ - Request Handlers
 - db/ - Prisma client instatiation
 - generated/ - Auto-generated Prisma Client (gitignored)
 - middlewares/ - Auth, error middlewares
 - models/ - Data model diagram
 - routes/ - Express routers
 - utils/ - ApiError, password hashing etc
 - app.js - Express app config
 - index.js - Entry point - DB connection + server start

prisma/
 - schema.prisma - Data model define
 - migrations/ - Version controller schema changed history


Getting Started

*** Prerequisites ***

Node.js (v18+)
PostgreSQL running locally (or a hosted instance, e.g. Neon)

Installation cmd:

- git clone <your-repo-url>
- cd <project-folder>
- npm install

*** Environment Variables ***

PORT=port_num
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/e_commerce

DATABASE_PASSWORD=db_password
DATABASE_PORT=db_port
DATABASE_HOST=db_host
DATABASE_USER=db_user
DATABASE_NAME=db_name


ACCESS_TOKEN_SECRET=secret
ACCESS_TOKEN_EXPIRY=30M
REFRESH_TOKEN_SECRET=secret
REFRESH_TOKEN_EXPIRY=10D

CLOUDINARY_API_SECRET=secret
CLOUDINARY_API_KEY=secret
CLOUDINARY_NAME=secret

CLOUDINARY_URL=sercret_url

*** Database Setup ***

- npx prisma migrate dev
- npx prisma generate

Run the server

- npm run dev

### Author ###

Built as a hands-on learning project to move from basic CRUD knowledge to deliberate, from-scratch relational database design, transaction-safe business logic, and production deployment.