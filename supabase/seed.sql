
-- Create test property
INSERT INTO properties (id, name, address)
VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'PPR Pantai Ria', 'Jalan Pantai Dalam, 59200 Kuala Lumpur');

-- Create test Finance Allocation
INSERT INTO finance_allocations (property_id, year, amount)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 2026, 5000.00);

-- NOTE: Auth users must be created via Supabase Auth API or manually in local bucket.
-- Supabase seed.sql runs directly on Postgres, it CANNOT create auth.users easily without tricky hacking.
-- Instead, we will insert into profiles with specific UUIDs, and we assume these UUIDs will be used when creating users.

-- WE WILL USE THESE UUIDs for creating users:
-- Admin: 11111111-1111-1111-1111-111111111111 (admin@dbkl.gov.my)
-- Officer: 22222222-2222-2222-2222-222222222222 (officer@dbkl.gov.my)
-- Leader: 33333333-3333-3333-3333-333333333333 (leader@ppr.com)
-- Finance: 44444444-4444-4444-4444-444444444444 (finance@ppr.com)
-- Resident: 55555555-5555-5555-5555-555555555555 (resident@ppr.com)

-- Since we have a trigger to create profiles typically? NO, we didn't create a trigger in 1.2 plan. 
-- We will insert profiles manually here.

INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES
 ('11111111-1111-1111-1111-111111111111', 'admin@dbkl.gov.my', '{"full_name": "Super Admin"}'),
 ('22222222-2222-2222-2222-222222222222', 'officer@dbkl.gov.my', '{"full_name": "DBKL Officer"}'),
 ('33333333-3333-3333-3333-333333333333', 'leader@ppr.com', '{"full_name": "Flat Leader"}'),
 ('44444444-4444-4444-4444-444444444444', 'finance@ppr.com', '{"full_name": "Finance Officer"}'),
 ('55555555-5555-5555-5555-555555555555', 'resident@ppr.com', '{"full_name": "Resident Ali"}');

INSERT INTO profiles (id, email, full_name, role, property_id)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin@dbkl.gov.my', 'Super Admin', 'DBKL_SUPER_ADMIN', NULL),
  ('22222222-2222-2222-2222-222222222222', 'officer@dbkl.gov.my', 'DBKL Officer', 'DBKL_OFFICER', NULL),
  ('33333333-3333-3333-3333-333333333333', 'leader@ppr.com', 'Flat Leader', 'FLAT_LEADER', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
  ('44444444-4444-4444-4444-444444444444', 'finance@ppr.com', 'Finance Officer', 'FINANCE_OFFICER', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
  ('55555555-5555-5555-5555-555555555555', 'resident@ppr.com', 'Resident Ali', 'RESIDENT', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');
