# Frontend

React + Vite frontend for the GameVault marketplace.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_URL` to the backend API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

## Pages

- `/` home
- `/marketplace`
- `/marketplace/bgmi`
- `/marketplace/free-fire`
- `/account/:id`
- `/login`
- `/register`
- `/dashboard`
- `/payment/:orderId`
- `/refer-earn`
- `/happy-customers`
- `/faq`
- `/admin/login`
- `/admin`
- `/admin/accounts`
- `/admin/orders`
- `/admin/settings`
- `/admin/customer-proofs`
- `/admin/faqs`

## Notes

The frontend uses one generated hero image at `public/hero-marketplace.png` and simple replaceable placeholders under `public/placeholders/`.

All real uploads go through the backend and are stored in ImageKit.
