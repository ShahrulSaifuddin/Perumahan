
-- Enable UUID extension
-- create extension if not exists "uuid-ossp";

-- Enums
create type user_role as enum ('DBKL_SUPER_ADMIN', 'DBKL_OFFICER', 'FLAT_LEADER', 'FINANCE_OFFICER', 'RESIDENT');
create type transaction_type as enum ('IN', 'OUT');
create type transaction_status as enum ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED');
create type complaint_status as enum ('OPEN', 'IN_REVIEW', 'ACTIONED', 'RESOLVED', 'CLOSED');

-- Tables

-- 1. Properties
create table properties (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  created_at timestamptz default now()
);

-- 2. Profiles
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role user_role default 'RESIDENT',
  property_id uuid references properties(id),
  created_at timestamptz default now()
);

-- 3. Finance Allocations
create table finance_allocations (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) not null,
  year int not null,
  amount decimal(12, 2) default 5000.00,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (property_id, year)
);

-- 4. Transactions
create table transactions (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) not null,
  type transaction_type not null,
  amount decimal(12, 2) not null,
  description text,
  category text,
  status transaction_status default 'DRAFT',
  transaction_date date not null default CURRENT_DATE,
  created_by uuid references profiles(id),
  approved_by uuid references profiles(id),
  attachment_path text,
  created_at timestamptz default now()
);

-- 5. Complaints
create table complaints (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) not null,
  user_id uuid references profiles(id) not null,
  title text not null,
  description text,
  category text,
  status complaint_status default 'OPEN',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 6. Complaint Comments
create table complaint_comments (
  id uuid primary key default gen_random_uuid(),
  complaint_id uuid references complaints(id) on delete cascade not null,
  user_id uuid references profiles(id) not null,
  comment text not null,
  created_at timestamptz default now()
);

-- 7. Audit Logs
create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  performed_by uuid references profiles(id),
  details jsonb,
  created_at timestamptz default now()
);

-- RLS Policies

alter table properties enable row level security;
alter table profiles enable row level security;
alter table finance_allocations enable row level security;
alter table transactions enable row level security;
alter table complaints enable row level security;
alter table complaint_comments enable row level security;
alter table audit_logs enable row level security;

-- Policies for Properties
-- SELECT: authenticated
create policy "Properties are viewable by everyone" on properties
  for select using (auth.role() = 'authenticated');

-- INSERT/UPDATE/DELETE: DBKL_SUPER_ADMIN only
create policy "Properties manageable by Super Admin" on properties
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'DBKL_SUPER_ADMIN')
  );

-- Policies for Profiles
-- SELECT: All authenticated
create policy "Profiles viewable by everyone" on profiles
  for select using (auth.role() = 'authenticated');

-- UPDATE: Self or Super Admin
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

create policy "Super Admin can update profiles" on profiles
  for update using (
    exists (select 1 from profiles where id = auth.uid() and role = 'DBKL_SUPER_ADMIN')
  );

-- Policies for Transactions
-- SELECT: DBKL roles (ALL), Property Roles (Same Property), Residents (None/Phase 1)
create policy "Transactions viewable by DBKL and Property Officers" on transactions
  for select using (
    exists (
      select 1 from profiles 
      where id = auth.uid() 
      and (
        role in ('DBKL_SUPER_ADMIN', 'DBKL_OFFICER') 
        or (role in ('FLAT_LEADER', 'FINANCE_OFFICER') and property_id = transactions.property_id)
      )
    )
  );

-- INSERT: FINANCE_OFFICER only (for their property)
create policy "Finance Officers can create transactions" on transactions
  for insert with check (
    exists (
      select 1 from profiles 
      where id = auth.uid() 
      and role = 'FINANCE_OFFICER' 
      and property_id = transactions.property_id
    )
  );

-- UPDATE: FINANCE_OFFICER (Draft), FLAT_LEADER (Approve/Reject)
create policy "Finance Officers can edit draft transactions" on transactions
  for update using (
    status = 'DRAFT' and exists (
      select 1 from profiles where id = auth.uid() and role = 'FINANCE_OFFICER' and property_id = transactions.property_id
    )
  );

create policy "Flat Leaders can approve transactions" on transactions
  for update using (
    exists (
      select 1 from profiles where id = auth.uid() and role = 'FLAT_LEADER' and property_id = transactions.property_id
    )
  );

-- Policies for Complaints
-- SELECT: DBKL, Leader (Same Property), Reporter (Self)
create policy "Complaints viewable by DBKL, Leader, and Reporter" on complaints
  for select using (
    exists (
      select 1 from profiles 
      where id = auth.uid() 
      and (
        role in ('DBKL_SUPER_ADMIN', 'DBKL_OFFICER') 
        or (role = 'FLAT_LEADER' and property_id = complaints.property_id)
      )
    )
    or user_id = auth.uid()
  );

-- INSERT: Any property member
create policy "Residents can submit complaints" on complaints
  for insert with check (
    exists (
      select 1 from profiles where id = auth.uid() and property_id = complaints.property_id
    )
  );

-- UPDATE: DBKL/Leader (Status), Reporter (Description if Open)
create policy "DBKL and Leaders can update status" on complaints
  for update using (
    exists (
      select 1 from profiles 
      where id = auth.uid() 
      and (
        role in ('DBKL_SUPER_ADMIN', 'DBKL_OFFICER') 
        or (role = 'FLAT_LEADER' and property_id = complaints.property_id)
      )
    )
  );

create policy "Reporters can update open complaints" on complaints
  for update using (
    user_id = auth.uid() and status = 'OPEN'
  );

-- Policies for Complaint Comments
create policy "Comments viewable by complaint viewers" on complaint_comments
  for select using (
    exists (
      select 1 from complaints c 
      left join profiles u on u.id = auth.uid()
      where c.id = complaint_comments.complaint_id
      and (
        u.role in ('DBKL_SUPER_ADMIN', 'DBKL_OFFICER')
        or (u.role = 'FLAT_LEADER' and u.property_id = c.property_id)
        or c.user_id = auth.uid()
      )
    )
  );

create policy "Users can comment on visible complaints" on complaint_comments
  for insert with check (
    exists (
      select 1 from complaints c 
      left join profiles u on u.id = auth.uid()
      where c.id = complaint_comments.complaint_id
      and (
        u.role in ('DBKL_SUPER_ADMIN', 'DBKL_OFFICER')
        or (u.role = 'FLAT_LEADER' and u.property_id = c.property_id)
        or c.user_id = auth.uid()
      )
    )
  );

-- Policies for Finance Allocations
create policy "Allocations viewable by authorized" on finance_allocations
  for select using (
    exists (
      select 1 from profiles 
      where id = auth.uid() 
      and (
         role in ('DBKL_SUPER_ADMIN', 'DBKL_OFFICER')
         or (role in ('FLAT_LEADER', 'FINANCE_OFFICER') and property_id = finance_allocations.property_id)
      )
    )
  );
