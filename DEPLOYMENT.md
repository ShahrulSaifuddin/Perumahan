# Deployment Guide

This project is built with **Next.js 14+ (App Router)** and **Supabase**.

## 1. Prerequisites

- **GitHub Repository**: Ensure your code is pushed to GitHub.
- **Supabase Project**: You need a live Supabase project (separate from local dev is recommended for production).
- **Hosting Account**: Vercel is recommended for Next.js, but you can use Netlify, Docker, or any Node.js host.

## 2. Environment Variables

You must set the following environment variables in your production environment (e.g., Vercel Project Settings):

| Variable                        | Description                                |
| :------------------------------ | :----------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Your production Supabase Project URL       |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your production Supabase Anon (Public) Key |

> **Note**: Do **NOT** expose `SUPABASE_SERVICE_ROLE_KEY` in your client-side variables. It is only needed if you have specific server-side admin scripts (not currently used in standard app flow).

## 3. Database Migrations

Production databases do not automatically sync with your local schema. You must apply migrations.

### Option A: Link and Push (Recommended)

1.  Login to Supabase CLI:
    ```bash
    npx supabase login
    ```
2.  Link your production project:
    ```bash
    npx supabase link --project-ref your-project-id
    ```
3.  Push local migrations to remote:
    ```bash
    npx supabase db push
    ```

### Option B: Manual SQL

1.  Go to `supabase/migrations` folder.
2.  Copy the content of the SQL files (in order).
3.  Run them in your Supabase Dashboard > SQL Editor.

## 4. Deploying to Vercel (Recommended)

1.  Go to [Vercel Dashboard](https://vercel.com/new).
2.  Import your GitHub repository.
3.  Vercel will auto-detect Next.js.
4.  Expand **Environment Variables** and add the keys from Section 2.
5.  Click **Deploy**.

## 5. Deploying with Docker (Self-Hosted)

1.  Build the image:
    ```bash
    docker build -t perumahan-app .
    ```
2.  Run the container:
    ```bash
    docker run -p 3000:3000 \
      -e NEXT_PUBLIC_SUPABASE_URL=... \
      -e NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
      perumahan-app
    ```

## 6. Post-Deployment Checks

1.  **Auth**: Ensure "Site URL" and "Redirect URLs" in Supabase Auth Settings match your production domain (e.g., `https://your-app.vercel.app/auth/callback`).
2.  **Storage**: Ensure Storage Buckets (e.g., `complaints`, `finance`) exist and have correct policies (Public/Private) if you strictly separated them.
