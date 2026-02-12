# Switching to Supabase Cloud (No Docker)

Since you prefer not to use Docker, we will host the database on **Supabase Cloud** (free tier available).

## Step 1: Create Cloud Project

1.  Go to [database.new](https://database.new) and create a new project.
2.  Set a database password (save this!).
3.  Wait for the project to finish "Provisioning".

## Step 2: Get Credentials

1.  In your Supabase Project Dashboard, go to **Project Settings** > **API**.
2.  Copy the **Project URL**.
3.  Copy the **anon** public key.

## Step 3: Update Environment

1.  Open `.env.local` in this project.
2.  Replace the values with your new cloud credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
```

## Step 4: Push Schema to Cloud

We need to send your local database structure (tables, roles) to the cloud.

Open your terminal in VS Code and run:

```bash
npx supabase login
# Follow the browser prompt to log in
```

Then link your project:

```bash
npx supabase link --project-ref your-project-id
npx supabase link --project-ref wurthordahbemwwzjotr
# You can find the project ID in your Project URL (e.g., https://xyz.supabase.co -> xyz)
# Enter your database password when prompted.
```

Finally, push the database changes:

```bash
npx supabase db push
```

## Step 5: Seed Data (Optional)

To create the test users (Admin, Resident, etc.) in the cloud:

1.  Go to **SQL Editor** in your Supabase Dashboard.
2.  Open the file `supabase/seed.sql` in VS Code.
3.  Copy the content and paste it into the SQL Editor on the website.
4.  Run the query.

## Step 6: Verify

Run the app locally:

```bash
npm run dev
```

It will now connect to the cloud database instead of Docker.
