-- Festive Lighting Pros — leads table
-- Run this once in the Supabase dashboard: SQL Editor → New query → paste → Run.

create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  phone       text default '',
  address     text default '',
  pkg         text default 'classic',
  feet        integer default 0,
  estimate    integer default 0,
  message     text default '',
  received_at timestamptz not null default now()
);

-- The dashboard lists newest first, so index that ordering.
create index if not exists leads_received_at_idx on public.leads (received_at desc);

-- Lock the table down: only the server's service-role key can touch it.
-- (service_role bypasses RLS; the public anon key gets nothing.)
alter table public.leads enable row level security;

-- Sample leads so the dashboard isn't empty on first load. Safe to delete later.
insert into public.leads (name, email, phone, address, pkg, feet, estimate, message, received_at) values
  ('Emily Carter',                'emily.carter@example.com',       '(973) 555-0142', '24 Maplewood Ave, Maplewood, NJ', 'premium',    160, 2880, 'Want the full roofline plus the two front trees wrapped.',        '2026-06-08T15:42:00Z'),
  ('David Thompson',              'dthompson@example.com',          '(214) 555-0198', '1809 Lakeshore Dr, Frisco, TX',   'permanent',  210, 6300, 'Interested in year-round programmable eaves I can control from my phone.', '2026-06-05T19:10:00Z'),
  ('Sarah Nguyen',                'sarah.nguyen@example.com',       '(630) 555-0173', '512 Brookdale Ln, Naperville, IL', 'classic',    120, 1440, 'Just the front of the house for the holidays.',                   '2026-05-30T22:05:00Z'),
  ('Lakeside Plaza (Mgmt Office)', 'ops@lakesideplaza.example.com', '(480) 555-0120', '7400 E Shea Blvd, Scottsdale, AZ', 'commercial',   0,    0, 'Storefront row + main entrance for the holiday season, roughly 400 ft.', '2026-05-22T17:30:00Z');
