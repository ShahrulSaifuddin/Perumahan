# PLAN — Phase 1 (Foundation)

<wave number="1">
  <task type="auto">
    <name>Initialize Next.js app with Tailwind, shadcn/ui, theme toggle, claymorphism base styles</name>
    <files>package.json, app/layout.tsx, app/page.tsx, components/ui/*, styles/globals.css</files>
    <action>
      Create Next.js app router project.
      Install Tailwind + shadcn/ui.
      Add light/dark theme toggle (next-themes).
      Implement claymorphism utility classes (blur, soft shadows, translucent cards) as reusable components.
      Create AppShell layout with sidebar/header placeholders.
    </action>
    <verify>npm run dev loads home page, toggle switches theme, layout responsive on mobile</verify>
    <done>UI shell + theme + base components exist and are used on home page</done>
  </task>

  <task type="auto">
    <name>Set up Supabase Auth and RBAC scaffolding</name>
    <files>lib/supabase/*, middleware.ts, app/(auth)/*, app/(app)/*</files>
    <action>
      Configure Supabase client (server + browser).
      Implement sign-in page.
      Add protected routes middleware.
      Store user role and property_id mapping (via DB table).
      Enforce role checks in server actions/routes.
    </action>
    <verify>Sign in works; protected route redirects when logged out; logged in user sees app shell</verify>
    <done>Auth works and role/property context loads on session</done>
  </task>

  <task type="auto">
    <name>Create database schema for multi-tenant properties, users, roles, allocations, transactions, complaints, audit logs</name>
    <files>supabase/migrations/* or prisma/schema.prisma (choose one), lib/db/*</files>
    <action>
      Create tables:
      - properties
      - user_profiles (user_id, role, property_id nullable for DBKL roles)
      - allocations (property_id, year, amount)
      - transactions (property_id, type IN/OUT, amount, date, category, purpose, status, created_by, approved_by)
      - complaints (property_id, title, category, description, status, created_by)
      - complaint_comments (complaint_id, message, created_by)
      - audit_logs (entity_type, entity_id, action, actor_id, metadata json)
      Add indexes: property_id, year, status.
      Add RLS policies ensuring tenant isolation (property users only see their property; DBKL sees all).
    </action>
    <verify>Migration applies; basic select works; tenant user cannot read other property rows</verify>
    <done>Schema + RLS policies exist and are validated</done>
  </task>
</wave>

<wave number="2">
  <task type="auto">
    <name>DBKL Super Admin: create property and create users with roles</name>
    <files>app/(app)/admin/*, server/actions/admin.ts</files>
    <action>
      Build admin screens for:
      - Create property
      - Create user (email + role + property)
      Ensure only DBKL_SUPER_ADMIN can access.
      Write audit logs for created entities.
    </action>
    <verify>Create property and user; user can sign in and role is applied</verify>
    <done>Admin can onboard a property and users successfully</done>
  </task>
</wave>
