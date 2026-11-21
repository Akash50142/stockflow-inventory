# StockFlow - Inventory Management MVP

A simple multi-tenant SaaS inventory app built as part of a technical assessment.

**Live demo:** https://YAHAN-APNA-VERCEL-LINK

## Features
- Sign up / login with email, password and organization name
- Each organization's data is separate (multi-tenant)
- Product CRUD (name, SKU, quantity, prices, low stock threshold)
- Search products by name or SKU
- Dashboard with total products, total quantity and low stock items
- Settings page for default low stock threshold

## Tech Stack
- Next.js (App Router, JavaScript)
- PostgreSQL (Neon)
- Tailwind CSS
- bcrypt for password hashing, JWT cookie for sessions
- Deployed on Vercel

## Run locally
1. Clone the repo and run `npm install`
2. Create a `.env.local` file with:
   - `DATABASE_URL=your_postgres_connection_string`
   - `JWT_SECRET=any_long_random_string`
3. Run `npm run dev` and open http://localhost:3000

## Notes
- Every database query is filtered by organization id, so one organization cannot see another's data.
- Low stock rule: quantity <= product threshold (or the default threshold if the product has none).