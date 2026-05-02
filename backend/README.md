# Karigar Backend API

## Setup
- Copy `.env.example` to `.env`.
- Install dependencies: `npm install`.
- Start API: `npm run dev`.
- Seed sample data: `npm run seed`.

## Auth Endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh-token`
- `POST /api/auth/logout`
- `POST /api/auth/logout-all`
- `GET /api/auth/me`

## Product Endpoints
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)

## Cart Endpoints
- `GET /api/cart`
- `PUT /api/cart/item`
- `DELETE /api/cart/item/:productId/:size`
- `DELETE /api/cart`

## Order Endpoints
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/:id`
- `GET /api/orders/admin/all` (admin)
- `PATCH /api/orders/:id/status` (admin)

## Discount Endpoints
- `POST /api/discounts/validate`
- `POST /api/discounts` (admin)
- `GET /api/discounts` (admin)
