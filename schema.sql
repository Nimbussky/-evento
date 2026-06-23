-- Evento Supabase Complete Schema (v2.0)
-- Copy and paste this into your Supabase SQL Editor

-- 1. Enable PostGIS for GPS location features
create extension if not exists postgis schema extensions;

-- ENUM Types
create type user_role as enum ('candidate', 'client', 'admin');
create type language_pref as enum ('en', 'hi');
create type badge_level as enum ('none', 'bronze', 'silver', 'gold', 'platinum');
create type client_tier as enum ('basic', 'verified', 'enterprise');
create type event_category as enum ('corporate_event', 'product_launch', 'expo_exhibition', 'promotion', 'data_entry', 'hospitality', 'security', 'survey', 'other');
create type pay_type as enum ('hourly', 'daily', 'task');
create type event_status as enum ('draft', 'pending', 'active', 'completed', 'cancelled');
create type application_status as enum ('applied', 'shortlisted', 'confirmed', 'rejected', 'checked_in', 'completed', 'no_show');
create type milestone_type as enum ('90d', '180d', 'senior_pro');
create type dispute_status as enum ('open', 'resolved_candidate', 'resolved_client', 'split');

-- 2. Tables

-- users table (extends supabase auth.users)
create table users (
  id uuid references auth.users not null primary key,
  phone varchar unique,
  email varchar,
  role user_role not null default 'candidate',
  lang language_pref default 'en',
  created_at timestamptz default now(),
  last_active timestamptz default now(),
  is_banned boolean default false
);

-- candidate_profiles
create table candidate_profiles (
  user_id uuid references users(id) not null primary key,
  full_name varchar,
  photo_url text,
  city varchar,
  pin_code char(6),
  skills text[],
  aadhaar_path text,
  aadhaar_verified boolean default false,
  total_hours decimal default 0,
  badge_level badge_level default 'none',
  trust_score int default 50,
  is_featured boolean default false,
  bio text
);

-- client_profiles
create table client_profiles (
  user_id uuid references users(id) not null primary key,
  company_name varchar,
  gst_number char(15) unique,
  cin varchar,
  logo_url text,
  verified boolean default false,
  verified_at timestamptz,
  contact_name varchar,
  billing_email varchar,
  tier client_tier default 'basic',
  total_events int default 0
);

-- events
create table events (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references client_profiles(user_id) not null,
  title varchar not null,
  category event_category not null,
  description text,
  location_lat decimal,
  location_lng decimal,
  location_address text,
  geofence_radius int default 200,
  date_start timestamptz not null,
  date_end timestamptz not null,
  pay_rate decimal not null,
  pay_type pay_type not null,
  headcount int not null,
  filled_count int default 0,
  skills_required text[],
  dress_code text,
  special_notes text,
  status event_status default 'pending',
  is_urgent boolean default false,
  created_at timestamptz default now()
);

-- applications
create table applications (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references events(id) not null,
  candidate_id uuid references candidate_profiles(user_id) not null,
  status application_status default 'applied',
  applied_at timestamptz default now(),
  status_updated_at timestamptz default now(),
  client_note text,
  candidate_note text,
  unique(event_id, candidate_id)
);

-- check_ins
create table check_ins (
  id uuid default uuid_generate_v4() primary key,
  application_id uuid references applications(id) not null,
  candidate_id uuid references candidate_profiles(user_id) not null,
  event_id uuid references events(id) not null,
  checkin_photo_url text not null,
  checkin_lat decimal not null,
  checkin_lng decimal not null,
  checkin_time timestamptz not null default now(),
  checkout_photo_url text,
  checkout_lat decimal,
  checkout_lng decimal,
  checkout_time timestamptz,
  hours_worked decimal,
  is_valid boolean default true,
  flagged boolean default false,
  flag_reason text,
  admin_override_by uuid references users(id),
  admin_note text
);

-- experience_ledger
create table experience_ledger (
  id uuid default uuid_generate_v4() primary key,
  candidate_id uuid references candidate_profiles(user_id) not null,
  event_id uuid references events(id) not null,
  check_in_id uuid references check_ins(id) not null,
  hours decimal not null,
  date date not null,
  cumulative_hours decimal not null,
  badge_unlocked badge_level default 'none',
  created_at timestamptz default now()
);

-- experience_letters
create table experience_letters (
  id uuid default uuid_generate_v4() primary key,
  candidate_id uuid references candidate_profiles(user_id) not null,
  issued_at timestamptz default now(),
  pdf_url text not null,
  qr_code text not null,
  milestone_type milestone_type not null,
  verified_hash text not null,
  is_revoked boolean default false,
  revoked_reason text,
  revoked_by uuid references users(id),
  revoked_at timestamptz
);

-- ratings
create table ratings (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references events(id) not null,
  candidate_id uuid references candidate_profiles(user_id) not null,
  client_id uuid references client_profiles(user_id) not null,
  stars int check (stars >= 1 and stars <= 5) not null,
  comment text,
  created_at timestamptz default now()
);

-- notifications
create table notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) not null,
  type varchar not null,
  title varchar not null,
  body text not null,
  action_url text,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- admin_audit_log
create table admin_audit_log (
  id uuid default uuid_generate_v4() primary key,
  admin_id uuid references users(id) not null,
  action varchar not null,
  target_type varchar not null,
  target_id uuid not null,
  before_data jsonb,
  after_data jsonb,
  ip_address varchar,
  created_at timestamptz default now()
);

-- 3. Row Level Security (RLS) Policies

-- Enable RLS
alter table users enable row level security;
alter table candidate_profiles enable row level security;
alter table client_profiles enable row level security;
alter table events enable row level security;
alter table applications enable row level security;
alter table check_ins enable row level security;
alter table experience_ledger enable row level security;
alter table experience_letters enable row level security;

-- Events: Public can read all active events
create policy "Public can view active events" on events
  for select using (status = 'active');

-- Events: Clients can insert and update their own events
create policy "Clients can manage their own events" on events
  for all using (auth.uid() = client_id);

-- Applications: Candidates can view and insert their own applications
create policy "Candidates can manage their applications" on applications
  for select using (auth.uid() = candidate_id);
create policy "Candidates can apply" on applications
  for insert with check (auth.uid() = candidate_id);

-- Applications: Clients can view applications for their events
create policy "Clients can view applications for their events" on applications
  for select using (
    exists (
      select 1 from events where events.id = applications.event_id and events.client_id = auth.uid()
    )
  );

-- Check-ins: Candidates can manage their own
create policy "Candidates can manage their checkins" on check_ins
  for all using (auth.uid() = candidate_id);

-- Check-ins: Clients can view check-ins for their events
create policy "Clients can view check-ins for their events" on check_ins
  for select using (
    exists (
      select 1 from events where events.id = check_ins.event_id and events.client_id = auth.uid()
    )
  );

-- Ledger and Letters: Candidates can read their own
create policy "Candidates can view their ledger" on experience_ledger
  for select using (auth.uid() = candidate_id);
create policy "Candidates can view their letters" on experience_letters
  for select using (auth.uid() = candidate_id);

-- Profile reads (everyone can view basic profiles for matching)
create policy "Public profile read" on candidate_profiles for select using (true);
create policy "Public client profile read" on client_profiles for select using (true);
