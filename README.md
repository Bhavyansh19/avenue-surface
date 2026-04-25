# Avenue Surface — Frontend

React + TypeScript + Tailwind frontend for the Avenue Surface flooring e-commerce store.

**Live on Vercel:** [your-app.vercel.app]  
**Backend repo:** [link to your backend repo]

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.local.example .env.local
# Fill in your values in .env.local

# 3. Start dev server
npm run dev
```
Open http://localhost:5173

---

## Deploy to Vercel

1. Push this folder to a GitHub repo
2. Go to https://vercel.com → New Project → Import your repo
3. Add these Environment Variables in Vercel Project Settings:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | Your Render backend URL e.g. `https://avenue-surface-api.onrender.com` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | From https://dashboard.stripe.com/test/apikeys |
| `VITE_TILESVIEW_STORE_ID` | From https://tilesview.ai/tvdesh |

4. Deploy — Vercel auto-detects Vite and builds it.

> `vercel.json` is already included for SPA routing (so page refresh works).

---

## Pages

| Route | Page |
|-------|------|
| `/` | Homepage |
| `/shop` | All products with filters |
| `/shop/:category` | Category (hybrid, vinyl, timber, laminate, bamboo, tiles, carpet) |
| `/product/:slug` | Product detail + reviews |
| `/cart` | Shopping cart |
| `/checkout` | Stripe checkout (requires login) |
| `/blog` | Blog listing with category tabs |
| `/blog/:slug` | Blog post |
| `/floor-finder` | 5-step recommendation quiz |
| `/visualizer` | TilesView.ai room visualiser |
| `/account` | Orders, profile, wishlist, addresses |
| `/login` | Sign in |
| `/register` | Create account |
| `/about` | About + Australian Standards |
| `/contact` | Contact form |
| `/admin` | Admin dashboard (admin role only) |
| `/admin/products` | Product CMS |
| `/admin/orders` | Order management |
| `/admin/blog` | Blog CMS |
| `/admin/users` | User management |

---

## Key Files to Edit

| File | What to change |
|------|----------------|
| `src/components/layout/Navbar.tsx` | Logo/brand name |
| `src/components/layout/Footer.tsx` | Brand name, ABN, address, social links |
| `src/pages/AboutPage.tsx` | Phone, email, address, hours |
| `src/pages/HomePage.tsx` | Hero headline, stats, copy |
| `src/pages/VisualizerPage.tsx` | TilesView Store ID (or set via env) |
| `src/pages/CheckoutPage.tsx` | Stripe publishable key (or set via env) |
| `index.html` | Site title and meta description |
