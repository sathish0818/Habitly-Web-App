-- Habitly database schema
-- Run this once in Supabase Dashboard -> SQL Editor -> New query -> Run.

-- 1. Profiles: one row per user, created automatically on signup.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles: select own" on public.profiles;
create policy "profiles: select own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "profiles: insert own" on public.profiles;
create policy "profiles: insert own" on public.profiles
  for insert with check (auth.uid() = id);

-- Auto-create a profile row whenever someone signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Habits
create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  icon text not null,
  frequency text not null default 'daily' check (frequency in ('daily', 'weekly', 'custom')),
  reminder text,
  quantified_target numeric,
  quantified_unit text check (quantified_unit in ('ml', 'hrs', 'steps')),
  created_at date not null default (now() at time zone 'utc')::date,
  inserted_at timestamptz not null default now()
);

alter table public.habits enable row level security;

drop policy if exists "habits: all own" on public.habits;
create policy "habits: all own" on public.habits
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists habits_user_id_idx on public.habits (user_id);

-- 3. Habit completions (one row per habit per completed day; logged_value for quantified habits)
create table if not exists public.habit_completions (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  logged_value numeric,
  completed boolean not null default true,
  unique (habit_id, date)
);

alter table public.habit_completions enable row level security;

drop policy if exists "habit_completions: all own" on public.habit_completions;
create policy "habit_completions: all own" on public.habit_completions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists habit_completions_user_id_idx on public.habit_completions (user_id);
create index if not exists habit_completions_habit_id_idx on public.habit_completions (habit_id);

-- 4. Moods (one row per user per day)
create table if not exists public.moods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  mood text not null check (mood in ('great', 'okay', 'rough')),
  unique (user_id, date)
);

alter table public.moods enable row level security;

drop policy if exists "moods: all own" on public.moods;
create policy "moods: all own" on public.moods
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 5. Wellbeing profile (one row per user)
create table if not exists public.wellbeing_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  height_cm numeric not null,
  weight_kg numeric not null,
  age integer not null,
  sex text not null check (sex in ('female', 'male', 'unspecified')),
  activity_level text not null check (activity_level in ('sedentary', 'moderate', 'active')),
  updated_at timestamptz not null default now()
);

alter table public.wellbeing_profiles enable row level security;

drop policy if exists "wellbeing_profiles: all own" on public.wellbeing_profiles;
create policy "wellbeing_profiles: all own" on public.wellbeing_profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
