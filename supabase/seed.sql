-- 1. Enable pgcrypto (required for password hashing)
create extension if not exists "pgcrypto";

-- 2. WIPE EVERYTHING (Fresh Start)
TRUNCATE TABLE 
  audit_logs, 
  complaint_comments, 
  complaints, 
  transactions, 
  finance_allocations, 
  profiles, 
  properties
  CASCADE;

-- 3. Clean up Auth User (Be careful attempting to delete current user if running as that user)
DELETE FROM auth.users WHERE email = 'admin@dbkl.gov.my';

-- 4. Insert Auth User (Password: admin123456)
-- We set confirmation_token to '' (empty string) to avoid "Scan error ... converting NULL to string is unsupported"
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '11111111-1111-1111-1111-111111111111',
  'authenticated',
  'authenticated',
  'admin@dbkl.gov.my',
  crypt('admin123456', gen_salt('bf')),
  now(),
  '',
  '',
  '',
  '',
  '{"provider":"email","providers":["email"]}',
  '{"full_name": "Super Admin"}',
  now(),
  now()
);

-- 5. Insert ONE default property
INSERT INTO properties (id, name, address)
VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'PPR Pantai Ria', 'Jalan Pantai Dalam, 59200 Kuala Lumpur');

-- 6. Insert Profile linked to user
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  role,
  property_id
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'admin@dbkl.gov.my',
  'Super Admin',
  'DBKL_SUPER_ADMIN',
  NULL
);

-- 7. Insert Finance Allocation
INSERT INTO finance_allocations (property_id, year, amount)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 2026, 5000.00);