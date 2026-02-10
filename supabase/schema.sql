-- ================================================
-- GlicoHack v3 — Esquema Supabase
-- Tablas + Row Level Security (RLS)
-- ================================================

-- 1. PERFILES DE USUARIO
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null default '',
  peso numeric(5,1),
  objetivo_glucosa_min numeric(5,1) default 70,
  objetivo_glucosa_max numeric(5,1) default 140,
  medicacion text default 'Synjardy',
  onboarding_complete boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trigger para auto-crear perfil al registrarse
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. REGISTROS DE GLUCOSA
create table if not exists public.glucose_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  valor numeric(5,1) not null,
  momento text not null check (momento in ('ayunas','pre_comida','post_comida','pre_cena','post_cena','nocturno')),
  notas text default '',
  created_at timestamptz default now()
);

create index if not exists idx_glucose_logs_user_date
  on public.glucose_logs (user_id, created_at desc);

-- 3. PLANES DE MENÚ DIARIO
create table if not exists public.daily_menus (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  fecha date not null,
  menu_data jsonb not null,
  created_at timestamptz default now(),
  unique (user_id, fecha)
);

create index if not exists idx_daily_menus_user_fecha
  on public.daily_menus (user_id, fecha);

-- 4. TRACKING (comidas realizadas + medicación)
create table if not exists public.tracking (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  fecha date not null,
  tracking_data jsonb not null default '{}',
  updated_at timestamptz default now(),
  unique (user_id, fecha)
);

create index if not exists idx_tracking_user_fecha
  on public.tracking (user_id, fecha);

-- ================================================
-- ROW LEVEL SECURITY (RLS)
-- Cada usuario solo accede a sus propios datos
-- ================================================

-- Profiles
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Glucose Logs
alter table public.glucose_logs enable row level security;

create policy "Users can view own glucose logs"
  on public.glucose_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert own glucose logs"
  on public.glucose_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own glucose logs"
  on public.glucose_logs for delete
  using (auth.uid() = user_id);

-- Daily Menus
alter table public.daily_menus enable row level security;

create policy "Users can view own menus"
  on public.daily_menus for select
  using (auth.uid() = user_id);

create policy "Users can insert own menus"
  on public.daily_menus for insert
  with check (auth.uid() = user_id);

create policy "Users can update own menus"
  on public.daily_menus for update
  using (auth.uid() = user_id);

create policy "Users can delete own menus"
  on public.daily_menus for delete
  using (auth.uid() = user_id);

-- Tracking
alter table public.tracking enable row level security;

create policy "Users can view own tracking"
  on public.tracking for select
  using (auth.uid() = user_id);

create policy "Users can insert own tracking"
  on public.tracking for insert
  with check (auth.uid() = user_id);

create policy "Users can update own tracking"
  on public.tracking for update
  using (auth.uid() = user_id);

create policy "Users can delete own tracking"
  on public.tracking for delete
  using (auth.uid() = user_id);
