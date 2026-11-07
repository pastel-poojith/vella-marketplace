# VELLA — Premium E-Commerce Marketplace

A production-oriented, fully functional multi-category e-commerce marketplace built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Premium storefront** with homepage, hero, featured collections, bestsellers, testimonials and newsletter
- **Product catalog** with 3 categories (Electronics, Fashion, Home & Living) and 2 products per category
- **Product detail pages** with multiple images, quantity selector, add-to-cart, buy-now, wishlist, related products
- **Search, filter and sort** by category, price, stock availability, and relevance/rating
- **Customer authentication** — signup, login, logout, password reset, profile management
- **Shopping cart** — persistent per user, quantity controls, stock validation, subtotal/shipping/tax/total
- **Checkout** — delivery address, saved addresses, payment method selection, order placement
- **Order management** — server-side order creation with stock and price validation, order tracking, order history
- **Admin dashboard** — overview metrics, product CRUD, category CRUD, order management with status updates, customer list, supplier/dropshipping management, store settings
- **Role-based admin access** — enforced via Supabase RLS and JWT `app_metadata.role` check (not just frontend hiding)
- **Supplier & dropshipping** — supplier directory, product-supplier links with cost price, profit margin, fulfilment status and tracking
- **Static pages** — About, Contact, Shipping Policy, Returns, Privacy, Terms, FAQ, Order Tracking, 404
- **Responsive design** — mobile drawer navigation, responsive grids, touch-friendly controls
- **Security** — Row Level Security on all tables, server-side order validation via `place_order()` RPC, admin-only writes

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Routing:** React Router v7
- **Styling:** Tailwind CSS (custom neutral/sand/accent palette, Cormorant Garamond + Inter fonts)
- **Icons:** Lucide React
- **Backend:** Supabase (PostgreSQL, Auth, RLS, Security Definer functions)
- **Database:** PostgreSQL with 12 tables, indexes, constraints, and RLS policies

## Installation

```bash
npm install
npm run dev
```

## Environment Variables

The following are pre-populated in the Bolt environment. For local development, ensure your `.env` file contains:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

The service role key and database URL are used server-side only and should never be exposed in frontend code.

## Database Setup

The database schema and seed data are applied via Supabase migrations. The following migrations are included:

1. **`vella_core_schema`** — Creates all 12 tables (categories, products, product_images, suppliers, product_suppliers, store_settings, profiles, addresses, cart_items, wishlist_items, orders, order_items), RLS policies, the `is_admin()` helper, the `place_order()` SECURITY DEFINER function, the `admin_order_metrics()` helper, and a trigger to auto-create profiles on signup. Seeds store settings.

2. **`vella_seed_catalog`** — Seeds 3 categories, 6 products (2 per category with multiple images each).

These migrations are applied automatically through the Supabase MCP tools. No manual SQL execution is needed.

## Authentication Setup

Authentication uses Supabase Auth with email/password (email confirmation is OFF by default):

- **Sign up:** Users register with email, password, and full name. A profile row is auto-created via a database trigger.
- **Sign in:** Standard email/password login.
- **Password reset:** Uses Supabase's `resetPasswordForEmail()`.
- **Sessions:** Persisted in the browser via Supabase's session management.

## Admin Account Configuration

To grant admin access to a user:

1. Sign up a customer account through the VELLA website.
2. In the Supabase Dashboard, go to **Authentication → Users**.
3. Find the user and edit their `raw_app_meta_data` to add: `{"role": "admin"}`
4. The user will now see the "Admin Dashboard" link in their account dropdown and can access `/admin`.

Admin access is enforced server-side:
- The `is_admin()` SQL function checks `auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'`
- All catalog write policies (products, categories, suppliers, store settings) require `is_admin()`
- Order status updates require `is_admin()`
- The frontend `AdminLayout` component checks `user.app_metadata.role === 'admin'` and redirects non-admins

## Payment Integration Setup

### Cash on Delivery (COD)
Enabled by default. Toggle in **Admin Dashboard → Settings → Payment Settings**.

### Razorpay
Razorpay is prepared but disabled by default. To enable:

1. Create a Razorpay account and obtain your test API keys.
2. In **Admin Dashboard → Settings → Payment Settings**, enable Razorpay and enter your public Key ID (`rzp_test_...`).
3. Configure the Razorpay Key Secret as a Supabase Edge Function secret (never in frontend code).
4. Implement a Razorpay verification edge function to verify payment signatures server-side.
5. Razorpay payments are marked as `unpaid` until verified server-side — the app never marks an order as paid based on a button click alone.

**Important:** Do not enable Razorpay in production until you have valid credentials and the server-side verification flow is implemented and tested.

## Development & Deployment

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Type checking
npm run typecheck
```

### Deployment

The app is a standard Vite SPA. Deploy the `dist/` folder to any static hosting provider (Vercel, Netlify, Cloudflare Pages, etc.). Ensure the Supabase environment variables are set in your deployment environment.

## Project Structure

```
src/
  components/
    layout/Layout.tsx        # Header, footer, navigation, mobile drawer
    product/ProductCard.tsx   # Reusable product card
  contexts/
    AuthContext.tsx           # Auth state, sign in/up/out, profile
    CartContext.tsx           # Cart state, add/remove/update, totals
    StoreContext.tsx          # Store settings (shipping, tax, policies)
    WishlistContext.tsx       # Wishlist state, toggle items
  lib/
    supabase.ts               # Supabase client singleton
    types.ts                  # TypeScript interfaces for all DB tables
    utils.ts                  # Price formatting, totals computation, helpers
    constants.ts              # Order/payment status labels and colors
  pages/
    HomePage.tsx              # Hero, categories, featured, bestsellers, testimonials
    ShopPage.tsx              # Catalog with search, filter, sort
    ProductPage.tsx           # Product detail with images, cart, wishlist
    CartPage.tsx              # Cart with quantity controls and totals
    CheckoutPage.tsx          # Address, payment method, order placement
    auth/                     # Login, Signup, Forgot Password
    account/                  # Orders, Order Detail, Wishlist, Addresses, Profile
    admin/                    # Dashboard, Products, Categories, Orders, Customers, Suppliers, Settings
    AboutPage.tsx, ContactPage.tsx, etc.  # Static content pages
  App.tsx                     # Route definitions
  main.tsx                    # App entry with providers
```

## Implementation Report

### Features Completed
- Premium homepage with all required sections
- Full product catalog (3 categories, 6 products, multiple images per product)
- Working search, category filter, price filter, and sorting
- Product detail pages with all required actions (cart, buy now, wishlist, quantity)
- Customer authentication (signup, login, logout, password reset)
- Persistent shopping cart with stock validation
- Server-side order placement with stock and price validation (`place_order()` RPC)
- Order confirmation page with order number
- Customer account with order history, order detail with tracking, wishlist, saved addresses, profile
- Admin dashboard with metrics overview, product CRUD, category CRUD, order management with status/payment updates
- Customer management (view registered customers and order stats)
- Supplier and dropshipping management with profit margin calculation
- Store settings (branding, shipping, tax, payment, policies, social links)
- All static pages (About, Contact, Shipping, Returns, Privacy, Terms, FAQ, Track Order)
- 404 page
- Responsive design with mobile navigation drawer
- Row Level Security on all 12 tables
- Admin role enforced via server-side `is_admin()` function

### Features Tested (build verification)
- Production build passes (`npm run build`)
- TypeScript type checking passes (`npm run typecheck`)
- All routes resolve to existing page components

### Features Requiring External Credentials
- **Razorpay payment integration** — requires valid Razorpay test/live API keys and a server-side verification edge function. The UI and database schema are ready; payment is set to `unpaid` until verified.
- **Production Supabase project** — the app uses the provisioned Supabase instance; for production deployment, ensure environment variables are configured.

### Features Still Incomplete
- **Razorpay online payment flow** — the payment method selection UI exists, but the actual Razorpay checkout SDK integration and server-side webhook verification are not yet implemented (COD is fully functional).
- **Contact form email delivery** — the contact form accepts submissions but does not yet send emails (requires an edge function with an email service).
- **Supabase Storage for product images** — product images currently use URL-based references; a Supabase Storage bucket for admin image uploads can be added.
- **Customer email visibility in admin** — customer emails are protected by Supabase Auth and not exposed to the admin dashboard for privacy; they're managed in the Supabase dashboard.

### Steps Before Production Deployment
1. **Configure admin user:** Set `raw_app_meta_data.role = "admin"` on your admin account via Supabase Dashboard.
2. **Add real store details:** Update store name, email, phone, address, and policies in Admin → Settings.
3. **Set up Razorpay (optional):** Create a Razorpay account, add keys to Supabase secrets, implement the verification edge function, then enable Razorpay in settings.
4. **Add product imagery:** Upload real product images (via URL or Supabase Storage) through the admin product management.
5. **Configure suppliers:** Add real supplier information and product-supplier links for dropshipping.
6. **Test the full customer journey:** Sign up → browse → add to cart → checkout via COD → verify order in admin → update status → verify customer sees update.
7. **Set up custom domain:** Configure your domain in your hosting provider and update Supabase auth redirect URLs accordingly.
```
