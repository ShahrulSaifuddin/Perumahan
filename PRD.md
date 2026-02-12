# PRD — DBKL Flat Management & Finance Portal

## 1. Problem

DBKL funds RM 5,000 annually for each apartment/flat. Flat leaders and finance officers currently struggle to track money in/out, generate reports, manage role-based access, and handle resident complaints with full accountability.

## 2. Users

- DBKL Super Admin (HQ) — creates properties and user accounts, oversees all
- DBKL Officer — monitors finance/complaints, communicates with properties
- Flat Leader — approves spending, views finance & reports for their property
- Finance Officer — records transactions, uploads evidence, generates reports
- Resident (Normal User) — view announcements (optional), submit complaints, track status

## 3. Goals (Success)

- Every property has a yearly RM 5,000 fund cycle tracked end-to-end
- Money in/out is recorded with purpose, category, evidence, and audit log
- DBKL can monitor all properties and generate PDF reports per property/period
- Complaint tickets are recorded until resolved, with notifications and timeline
- Works fast on mobile & desktop, cross-browser, with light/dark theme and claymorphism UI

## 4. Must-have Features

Finance

- Yearly allocation RM 5,000 per property
- Transactions: money-in and money-out
- Categories/purpose, amount, date, attachments (receipt/invoice)
- Basic approval flow (recommended): Finance Officer drafts → Flat Leader approves → DBKL view
- Filters by date range, category, status; export PDF report
- Dashboard summary: allocated, spent, remaining

User & Role Access

- DBKL Super Admin creates properties and user accounts
- Role-based access control (RBAC)
- Users belong to exactly one property (except DBKL roles)

Complaints

- Resident can submit complaint with category, description, photos
- Complaint lifecycle: Open → In Review → Actioned → Resolved → Closed
- Comment thread + status history
- Notify DBKL (email + in-app notification)

Audit & Logging

- All important actions recorded (create/update/approve/resolve)

UI/UX

- Claymorphism design
- Responsive and mobile-first
- Light + Dark theme
- Fast loading

## 5. Non-goals (Phase 1)

- Mobile native app
- Complex accounting (double-entry), integrations with bank feeds
- Payment gateway
- Multi-language (can be added later)

## 6. Constraints

- Web app using Next.js
- Prefer free-tier services (hosting + DB + email)
- Expandable architecture (multi-tenant, clear modules)

## 7. Acceptance Criteria (initial)

- DBKL Super Admin can create a Property and invite/create users with roles
- Finance Officer can create a transaction (in/out) with attachment
- Flat Leader can approve/reject an outgoing transaction
- DBKL Officer can view finance summary and download PDF report for a property
- Resident can submit complaint and see status updates until resolved
- Every action above writes an audit log entry
- App is usable on mobile and modern browsers, with light/dark theme
