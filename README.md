# GameVault Gaming Account Marketplace

GameVault is a small MERN marketplace for admin-listed BGMI and Free Fire accounts. Customers browse accounts, create an order, pay manually through UPI, upload the payment proof, and wait for manual WhatsApp delivery after admin verification.

The app does not include automatic payment verification, account delivery, sellers, chat, bidding, wallets, or game API integrations.

## Tech Stack

- Frontend: React, Vite, JavaScript, React Router, CSS, Axios
- Backend: Node.js, Express.js, JavaScript, MongoDB, Mongoose, JWT, bcrypt
- Image storage: ImageKit for uploaded account images, payment screenshots, QR codes, and customer proof screenshots

## Folder Structure

```text
gaming-marketplace/
|-- frontend/
|   |-- public/
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- layouts/
|   |   |-- services/
|   |   |-- hooks/
|   |   |-- utils/
|   |   |-- assets/
|   |   |-- App.jsx
|   |   `-- main.jsx
|   |-- .env.example
|   |-- package.json
|   `-- README.md
|-- backend/
|   |-- src/
|   |   |-- controllers/
|   |   |-- routes/
|   |   |-- models/
|   |   |-- middleware/
|   |   |-- config/
|   |   |-- services/
|   |   |-- utils/
|   |   `-- server.js
|   |-- .env.example
|   |-- package.json
|   `-- README.md
|-- README.md
`-- .gitignore
```

## Environment Variables

Copy the examples before running:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Backend:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/gaming-marketplace
JWT_SECRET=replace_with_a_long_random_secret
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=
FRONTEND_URL=http://localhost:5173
```

Frontend:

```env
VITE_API_URL=http://localhost:5000/api
```

Never put real ImageKit credentials in Git.

## MongoDB Setup

Install and start MongoDB locally, or use a MongoDB Atlas connection string in `backend/.env`.

Example local URI:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/gaming-marketplace
```

## ImageKit Setup

Create an ImageKit account and copy these values into `backend/.env`:

- `IMAGEKIT_PUBLIC_KEY`
- `IMAGEKIT_PRIVATE_KEY`
- `IMAGEKIT_URL_ENDPOINT`

The frontend never receives the private key. Uploads are sent to the backend and then stored in ImageKit.

## Installation

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Seed Data

From `backend/`:

```bash
npm run seed
```

This creates:

- 3 BGMI dummy accounts
- 3 Free Fire dummy accounts
- One admin user
- A few FAQs
- A few customer proof records
- Default UPI ID and QR placeholder

Seeded admin login:

```text
Email: admin@gamingmarket.test
Password: Admin@12345
```

Change the admin password immediately after first setup.

## Running

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend:

```bash
cd frontend
npm run dev
```

Open the Vite URL, usually `http://localhost:5173`.

## Main Customer Flow

Register, login, browse the marketplace, choose a BGMI or Free Fire account, click Buy Now, pay manually with UPI, submit the UTR and screenshot, then wait for admin verification and WhatsApp contact.

## Main Admin Flow

Login at `/admin/login`, manage accounts, view payment submissions, verify or reject orders, update the UPI ID and QR code, manage customer proofs, and manage FAQs.

## Adding Accounts

Use `/admin/accounts`. The account form accepts:

- Game
- Title
- Price
- Level
- Description
- Specifications as flexible JSON
- Images
- Featured
- Status

Uploaded account images are stored in ImageKit and the returned URLs are saved in MongoDB.

## Replacing The QR Code

Use `/admin/settings`. Upload a new QR image and update the UPI ID if needed. The payment page automatically uses the latest saved values.

## Replacing Placeholder Images

Seed data uses files under `frontend/public/placeholders/`. You can replace those files for local placeholders, or upload real images through the admin panel so ImageKit URLs are stored in MongoDB.
