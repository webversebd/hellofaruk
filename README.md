# hellofaruk.com: Faruk Hasan portfolio + CMS

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Prisma 6 + PostgreSQL · Cloudinary · Resend.
Every piece of public content is edited from **/admin**; no source edits needed.

## 1. Install
```bash
npm install
cp .env.example .env     # then fill in the values
```
Required: `DATABASE_URL`, `AUTH_SECRET` (`openssl rand -base64 32`), `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL`.
For image uploads: `CLOUDINARY_*`. For email alerts: `RESEND_API_KEY`, `RESEND_FROM`.

## 2. Database
Create a PostgreSQL database (Neon, Supabase, Vercel Postgres, local, etc.), put its URL in `DATABASE_URL`, then:
```bash
npx prisma migrate deploy   # applies prisma/migrations
npm run db:seed             # creates the admin user + starter content
```
The seed adds: your headline/hero copy, the 13 skills, 8 services, 5 project categories, nav, section headings, and "8+ years" as the only visible stat.
It does **not** add projects, brands, testimonials, or client numbers; you add those in the admin.

## 3. Run
```bash
npm run dev     # http://localhost:3000 , admin at /admin
```

## 4. Admin setup (first login)
1. Sign in at `/admin/login` with `ADMIN_EMAIL` / `ADMIN_PASSWORD`. Change the password under **Account**.
2. **Website settings**: phone, WhatsApp (digits with country code), email, SEO, OG image, favicon.
3. **Hero**: upload your portrait. **Profile**: write your About + story.
4. **Statistics**: enter real values and switch them on. **Social links**: add URLs, then enable.
5. Add **Brands**, **Projects** (with real images) and **Testimonials**.
Public registration does not exist; additional admins would be added via the seed script or SQL.

## 5. Deploy to Vercel
1. Push the repo to GitHub, import it in Vercel.
2. Add all environment variables from `.env.example` (Production).
3. Deploy. The build runs `prisma generate && next build`. Run migrations yourself first (`npx prisma migrate deploy`), see step 2.
4. Run the seed once against production: `DATABASE_URL=<prod url> ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run db:seed`.
5. Add the domain `hellofaruk.com` in Vercel → Domains and update DNS.
6. In Resend, verify the hellofaruk.com domain so `RESEND_FROM` works.

## 5b. Deploy to Hostinger (Node.js Web App)
Needs a Business Web Hosting or Cloud plan (Node.js apps are not on single/premium plans). Hostinger has no PostgreSQL on these plans, so use an external Postgres (Supabase or Neon).
1. Create a **new** GitHub repo for this project (not the Instatic one) and push the code.
2. From your PC, with the production `DATABASE_URL` (direct/session connection, port 5432, `?sslmode=require`) in `.env`: `npx prisma migrate deploy` then `npm run db:seed`.
3. Hostinger → Websites → Add Website → Node.js Web App → import the GitHub repo. Confirm the framework is **Next.js** and Node is **22.x**.
4. Add the environment variables from `.env.example` in the dashboard. Set `NEXT_PUBLIC_SITE_URL` **before** the build (it is baked in at build time).
5. Deploy, then connect `hellofaruk.com`. In Resend, add the DNS records it gives you in Hostinger DNS.

## Notes
- **Security**: bcrypt password hashing, signed httpOnly session cookie (8h), every admin page/action re-checks the session server-side, Zod validation, Server Actions' built-in origin (CSRF) check, security headers.
- **Rate limiting** is in-memory per server instance (best-effort on serverless). For a hard global limit, swap `src/lib/rate-limit.ts` for Upstash Ratelimit.
- **Spam**: honeypot + minimum-fill-time + rate limit; add Cloudflare Turnstile keys to enable a CAPTCHA.
- **Uploads** are limited to 4 MB (Vercel request limit is 4.5 MB).
- Brand icons are simplified inline glyphs because lucide-react no longer ships brand logos.
