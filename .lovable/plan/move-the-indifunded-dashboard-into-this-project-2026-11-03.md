# Move the IndiFunded dashboard into this project

The uploaded app is a prop-trading firm website with a trader dashboard and an admin panel. About 24 pages, 80 server actions and 15 kinds of stored data. It will be rebuilt here in stages, so you can review each stage in the preview.

## What gets moved

**Public site:** Home, About, Challenges (plans + compare + profit calculator), Rules, FAQ, Tools, Leaderboard, Refer, Blog + blog posts, Contact, Trader League, Payout Request, Payouts, Checkout success. Header, footer, live payout counter and weekly highest payout widgets come too, and so do the certificate images.

**Accounts:** Sign up, sign in and sign out with Lovable Cloud. One admin account (admin@indifunded.com by default) gets admin access.

**Trader dashboard (/app):** Overview, trading accounts, payouts, billing, certificates, profile and KYC settings.

**Admin panel (/admin):** Stats, users, orders, plans, coupons, blogs, certificates, leaderboard, leads, referrals, league registrations and config, payout requests, weekly payouts, site settings, image uploads.

**Payments:** Razorpay checkout, payment verification and webhook, plus manual UPI orders and coupon validation. The unused Stripe webhook will be dropped unless you need it.

## Stages
1. Look and feel, public pages, header and footer.
2. Lovable Cloud: data tables, sign-in, roles, image storage.
3. Trader dashboard.
4. Admin panel.
5. Razorpay payments and webhook. I'll ask for your Razorpay keys securely at this step.
6. Bring over your existing users and records, if you have them.

## Your existing data
The ZIP has no data export. Users will move over: on their first visit they verify their email and choose a new password. Old passwords can't be carried over. After stage 4, I'll explain how to export your old database.

## Technical details
- MongoDB collections become Postgres tables with RLS, and admin checks use a user_roles table with has_role().
- FastAPI endpoints become createServerFn handlers. The Razorpay webhook moves to /api/public/webhooks/razorpay and checks its signature.
- CRA pages become TanStack file routes. The existing shadcn UI and index.css styles carry over.
