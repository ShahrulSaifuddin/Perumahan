-- Add sla_due_at column to complaints table
alter table "public"."complaints" add column "sla_due_at" timestamp with time zone;

-- Update existing complaints to have a default SLA (e.g. 3 days from created_at)
update "public"."complaints" 
set "sla_due_at" = "created_at" + interval '3 days' 
where "sla_due_at" is null;
