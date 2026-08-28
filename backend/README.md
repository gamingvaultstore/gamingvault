# Backend

Express + MongoDB API for the GameVault marketplace.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Environment

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/gaming-marketplace
JWT_SECRET=replace_with_a_long_random_secret
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=
FRONTEND_URL=http://localhost:5173
```

## Seed

```bash
npm run seed
```

Seeded admin:

```text
Email: admin@gamingmarket.test
Password: Admin@12345
```

Change the admin password immediately.

## API Routes

Public:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/accounts`
- `GET /api/accounts/:id`
- `GET /api/faqs`
- `GET /api/customer-proofs`
- `GET /api/settings/payment`

Customer:

- `GET /api/orders`
- `POST /api/orders`
- `GET /api/orders/:id`
- `PATCH /api/orders/:id/payment`

Admin:

- `GET /api/admin/dashboard`
- `GET /api/admin/accounts`
- `POST /api/admin/accounts`
- `PUT /api/admin/accounts/:id`
- `DELETE /api/admin/accounts/:id`
- `GET /api/admin/orders`
- `PATCH /api/admin/orders/:id/status`
- `GET /api/admin/settings/payment`
- `PUT /api/admin/settings/payment`
- `GET /api/admin/faqs`
- `POST /api/admin/faqs`
- `PUT /api/admin/faqs/:id`
- `DELETE /api/admin/faqs/:id`
- `GET /api/admin/customer-proofs`
- `POST /api/admin/customer-proofs`
- `DELETE /api/admin/customer-proofs/:id`

## ImageKit Uploads

Uploads use memory storage, validate JPG/PNG/WebP files, limit files to 5 MB, upload to ImageKit through the backend, and store only the returned URL in MongoDB.
