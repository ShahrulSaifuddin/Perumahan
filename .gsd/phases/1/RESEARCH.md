# Research: Phase 1 (Foundation)

## Architecture

We are building a multi-tenant application using Next.js 14 (App Router) with Supabase (Auth + Postgres).
The tenant is the "Property" (Apartment/Flat).

### Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (SSR)
- **Styling**: Tailwind CSS + generic "claymorphism" utilities (custom config)
- **Components**: shadcn/ui (Radix Primitives)
- **State Management**: Server Actions + useFormStatus/useOptimistic (minimal client state)
- **Date Handling**: date-fns
- **PDF Generation**: @react-pdf/renderer (server-side compatible)

## Database Schema (PostgreSQL)

### Enums

```sql
create type user_role as enum ('DBKL_SUPER_ADMIN', 'DBKL_OFFICER', 'FLAT_LEADER', 'FINANCE_OFFICER', 'RESIDENT');
create type transaction_type as enum ('IN', 'OUT');
create type transaction_status as enum ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED');
create type complaint_status as enum ('OPEN', 'IN_REVIEW', 'ACTIONED', 'RESOLVED', 'CLOSED');
```

### Tables

1. **properties**
   - `id` (uuid, pk)
   - `name` (text, not null)
   - `address` (text)
   - `created_at` (timestamptz)

2. **profiles** (extends auth.users)
   - `id` (uuid, pk, fk auth.users)
   - `email` (text)
   - `full_name` (text)
   - `role` (user_role, default 'RESIDENT')
   - `property_id` (uuid, fk properties, nullable for DBKL roles)
   - `created_at` (timestamptz)

3. **finance_allocations**
   - `id` (uuid, pk)
   - `property_id` (uuid, fk properties)
   - `year` (int, not null)
   - `amount` (decimal, default 5000.00)
   - `created_at` (timestamptz)
   - `updated_at` (timestamptz)
   - Unique constraint on (property_id, year)

4. **transactions**
   - `id` (uuid, pk)
   - `property_id` (uuid, fk properties)
   - `type` (transaction_type)
   - `amount` (decimal)
   - `description` (text)
   - `category` (text)
   - `status` (transaction_status, default 'DRAFT')
   - `transaction_date` (date)
   - `created_by` (uuid, fk profiles)
   - `approved_by` (uuid, fk profiles, nullable)
   - `attachment_path` (text, nullable)
   - `created_at` (timestamptz)

5. **complaints**
   - `id` (uuid, pk)
   - `property_id` (uuid, fk properties)
   - `user_id` (uuid, fk profiles)
   - `title` (text)
   - `description` (text)
   - `category` (text)
   - `status` (complaint_status, default 'OPEN')
   - `created_at` (timestamptz)
   - `updated_at` (timestamptz)

6. **complaint_comments**
   - `id` (uuid, pk)
   - `complaint_id` (uuid, fk complaints)
   - `user_id` (uuid, fk profiles)
   - `comment` (text)
   - `created_at` (timestamptz)

7. **audit_logs**
   - `id` (uuid, pk)
   - `action` (text)
   - `entity_type` (text)
   - `entity_id` (uuid)
   - `performed_by` (uuid, fk profiles)
   - `details` (jsonb)
   - `created_at` (timestamptz)

## RBAC & RLS Policies

**General Rules**:

- DBKL_SUPER_ADMIN: Full access.
- DBKL_OFFICER: Read-only except for complaint comments/status.

**Table Specifics**:

- **properties**:
  - SELECT: authenticated
  - INSERT/UPDATE/DELETE: DBKL_SUPER_ADMIN only

- **profiles**:
  - SELECT: All authenticated (needed to see names on complaints/transactions)
  - UPDATE: Self (name/email), DBKL_SUPER_ADMIN (role/property)

- **transactions**:
  - SELECT:
    - DBKL roles: ALL
    - Property Roles (LEADER, FINANCE_OFFICER): WHERE property_id = user.property_id
    - RESIDENT: None (or Phase 2 summary)? Phase 1 says "none".
  - INSERT: FINANCE_OFFICER
  - UPDATE:
    - FINANCE_OFFICER: if status = 'DRAFT'
    - FLAT_LEADER: status update (approve/reject) only

- **complaints**:
  - SELECT:
    - DBKL roles: ALL
    - Property Roles (LEADER): WHERE property_id = user.property_id
    - RESIDENT: WHERE user_id = auth.uid()
  - INSERT: Any property member
  - UPDATE:
    - DBKL/LEADER: status
    - Reporter: description (if OPEN)?

## Implementation Strategy

1. **Scaffold**: `create-next-app`
2. **Setup**: Supabase CLI project locally
3. **Migration**: Create single migration file for initial schema
4. **Seed**: Seed data for testing roles
5. **UI**: Install shadcn/ui and configure tailwind for claymorphism
6. **Feature**: Auth pages (Login)
7. **Feature**: Dashboard skeleton
