# SPEC — DBKL Flat Management & Finance Portal

STATUS: FINALIZED ✅

## Vision

A multi-tenant web portal for DBKL and flat/apartment communities to track annual funding (RM 5,000 per property), manage transparent finance records, and handle complaints with full traceability until resolution.

## Tenancy Model

- Tenant = Property (Apartment/Flat)
- Most users belong to exactly 1 Property.
- DBKL roles can access all Properties.

## Roles & Permissions (RBAC)

### System Roles

1. DBKL_SUPER_ADMIN

- Create Properties
- Create users and assign roles
- Full access to all data

2. DBKL_OFFICER

- Read-only access to all Properties’ finance + complaints
- Can comment/respond on complaints
- Can mark complaint statuses

### Property Roles

3. FLAT_LEADER

- View and approve/reject outgoing transactions for their Property
- View reports and dashboard

4. FINANCE_OFFICER

- Create/edit finance records for their Property (draft)
- Upload evidence attachments
- Generate draft reports

5. RESIDENT

- Submit complaints
- View their complaint history and status
- Limited visibility to finance (Phase 1: none; Phase 2: summary-only optional)

## Finance Rules

- Each Property has an annual allocation record:
  - Amount default: RM 5,000
  - Period: Year (e.g., 2026)
- Transactions:
  - Type: IN or OUT
  - Required fields: date, amount, category, purpose/description, created_by
  - OUT transactions must be approved by FLAT_LEADER before counted as “spent”
  - Status: DRAFT → SUBMITTED → APPROVED / REJECTED
- Balance = allocation - sum(OUT approved) + sum(IN approved if used)

## Complaints Rules

- Complaint fields: title, category, description, attachments/photos, submitted_by, property_id
- Status flow:
  OPEN → IN_REVIEW → ACTIONED → RESOLVED → CLOSED
- Each status change is logged and visible in timeline.
- DBKL notified on new complaint and significant status updates (email + in-app).

## Reporting

- DBKL can generate PDF report:
  - By Property
  - By date range or by year
  - Includes: allocation, totals, transaction table, remaining balance, approval summary
- Export formats (Phase 1): PDF only

## Audit Log

Every critical action creates an audit entry:

- entity_type, entity_id, action, performed_by, timestamp, before/after snapshot (optional)

## Non-Functional Requirements

- Performance: fast initial load, responsive UI, pagination for lists
- Security: strong auth, RBAC enforced server-side, tenant isolation
- Compatibility: modern browsers + mobile responsive
- Maintainability: modular domain folders, clear boundaries (auth, finance, complaints, reporting)

## Design Requirements

- Claymorphism UI style
- Light & dark theme toggle
- Mobile-first, accessible components

## Phase 1 Scope (MVP)

- Auth + RBAC
- Property creation + user management (DBKL Super Admin)
- Finance: allocations + transactions (IN/OUT) + approval + basic dashboard
- Complaints: create + status updates + comments + notifications
- PDF report generation for finance
- Audit log
