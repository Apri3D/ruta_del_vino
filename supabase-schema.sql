-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- 1. PROFILES table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  phone text unique,
  tier text check (tier in ('vip', 'test_drive', 'regular')) default 'regular',
  free_charges_remaining int default 0,
  fidelity_points int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- 2. PROMOS table
create table if not exists public.promos (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  discount_pct int,
  code text unique,
  tier_required text check (tier_required in ('vip', 'test_drive', 'regular')) default 'regular',
  valid_from timestamptz,
  valid_until timestamptz,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.promos enable row level security;

create policy "Anyone can read active promos"
  on public.promos for select using (is_active = true);

-- 3. REDEMPTIONS table
create table if not exists public.redemptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  type text check (type in ('charge', 'promo')) not null,
  promo_id uuid references public.promos(id),
  location text,
  created_at timestamptz default now()
);

alter table public.redemptions enable row level security;

create policy "Users can read own redemptions"
  on public.redemptions for select using (auth.uid() = user_id);

create policy "Users can insert own redemptions"
  on public.redemptions for insert with check (auth.uid() = user_id);

-- 4. AUTO-CREATE profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, phone)
  values (
    new.id,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 5. DECREMENT charges (called from dashboard)
create or replace function public.decrement_charges(user_id uuid)
returns void as $$
begin
  update public.profiles
  set free_charges_remaining = free_charges_remaining - 1
  where id = user_id and free_charges_remaining > 0;
end;
$$ language plpgsql security definer;
