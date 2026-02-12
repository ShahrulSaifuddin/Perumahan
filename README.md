This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

Phase 1 (Foundation) execution is complete.

Summary:

UI: Next.js app scaffolded with "Claymorphism" theme (Tailwind v3 + Shadcn). Includes Sidebar, Header, and Layout.
Database: Supabase schema defined (migrations/0000_initial_schema.sql) and seed data prepared (seed.sql).
Auth: Authentication logic implemented (Client, Server, Middleware, Login Page).
API: Data fetching utilities created for Properties and Users.
⚠️ Action Required: The local Supabase database could not be started because Docker Desktop is not running.

Please start Docker Desktop.
Run npx supabase start followed by npx supabase db reset in your terminal to initialize the database and auth.
Once running, you can log in at /auth/login using the seed credentials (e.g., admin@dbkl.gov.my / password if you set one, or create a user in Supabase Studio).
Ready for Phase 2: Finance MVP.
