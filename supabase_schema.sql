-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- LEADS TABLE (Users)
create table leads (
  id uuid default uuid_generate_v4() primary key,
  fingerprint text unique not null, -- Browser fingerprint or local storage ID
  name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_seen timestamp with time zone default timezone('utc'::text, now())
);

-- CONVERSATIONS TABLE (Chat History)
create table conversations (
  id uuid default uuid_generate_v4() primary key,
  lead_id uuid references leads(id) on delete cascade not null,
  role text not null check (role in ('user', 'model')),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RESERVATIONS TABLE (Pre-bookings)
create table reservations (
  id uuid default uuid_generate_v4() primary key,
  lead_id uuid references leads(id) on delete cascade not null,
  ticket_id text not null,
  plan text,
  location text,
  payment_method text,
  status text default 'pending', -- pending, confirmed, expired
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone default (now() + interval '24 hours')
);

-- RLS POLICIES (Row Level Security)
-- For this demo, we'll allow public access but ideally, we'd use auth.
-- Since we are using an "anon" key and identifying by fingerprint/ID, 
-- we will allow insert/select for now.

alter table leads enable row level security;
alter table conversations enable row level security;
alter table reservations enable row level security;

-- Allow anyone to create a lead (we identify them by client-side ID)
create policy "Enable insert for all" on leads for insert with check (true);
create policy "Enable select for all" on leads for select using (true);
create policy "Enable update for all" on leads for update using (true);

create policy "Enable insert for all" on conversations for insert with check (true);
create policy "Enable select for all" on conversations for select using (true);

create policy "Enable insert for all" on reservations for insert with check (true);
create policy "Enable select for all" on reservations for select using (true);
create policy "Enable update for all" on reservations for update using (true);
