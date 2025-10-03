-- 0001_create_portfolio_schema.sql
-- Generated for Supabase (PostgreSQL)
-- Defines core portfolio schema, relationships, triggers, and row level security policies.

set check_function_bodies = off;

create extension if not exists "pgcrypto" with schema public;

-- Utility trigger to keep updated_at columns in sync
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- Blogs ---------------------------------------------------------------------
create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text,
  excerpt text,
  cover_image_url text,
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft','published')),
  featured boolean not null default false,
  created_date timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  likes integer not null default 0
);

create table if not exists public.blog_comments (
  id uuid primary key default gen_random_uuid(),
  blog_id uuid not null references public.blogs(id) on delete cascade,
  author text not null,
  message text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists blog_comments_blog_id_idx on public.blog_comments(blog_id);

create trigger set_timestamp_blog
before update on public.blogs
for each row
execute function public.set_updated_at();

-- Portfolio Projects --------------------------------------------------------
create table if not exists public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  technologies text[] not null default '{}',
  github_url text,
  demo_url text,
  image_url text,
  category text not null default 'other' check (category in ('machine_learning','deep_learning','data_science','web_development','other')),
  featured boolean not null default false,
  created_date date not null default current_date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger set_timestamp_portfolio_projects
before update on public.portfolio_projects
for each row
execute function public.set_updated_at();

-- Portfolio Experiences -----------------------------------------------------
create table if not exists public.portfolio_experiences (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  organization text not null,
  start_date date not null,
  end_date date,
  description text,
  type text not null check (type in ('education','work','research')),
  current boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger set_timestamp_portfolio_experiences
before update on public.portfolio_experiences
for each row
execute function public.set_updated_at();

-- Portfolio Profile ---------------------------------------------------------
create table if not exists public.portfolio_profile (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  email text,
  bio text,
  title text,
  location text,
  profile_image_url text,
  github_url text,
  linkedin_url text,
  resume_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists portfolio_profile_singleton on public.portfolio_profile((true));

create trigger set_timestamp_portfolio_profile
before update on public.portfolio_profile
for each row
execute function public.set_updated_at();

-- Row Level Security Policies ----------------------------------------------
alter table public.blogs enable row level security;
alter table public.blog_comments enable row level security;
alter table public.portfolio_projects enable row level security;
alter table public.portfolio_experiences enable row level security;
alter table public.portfolio_profile enable row level security;

drop policy if exists "Public read published blogs" on public.blogs;
create policy "Public read published blogs" on public.blogs
for select
using (status = 'published');

drop policy if exists "Authenticated read blogs" on public.blogs;
create policy "Authenticated read blogs" on public.blogs
for select to authenticated
using (status = 'published');

-- Allow public read access to comments and portfolio sections
drop policy if exists "Public read blog comments" on public.blog_comments;
create policy "Public read blog comments" on public.blog_comments
for select
using (true);

drop policy if exists "Public read projects" on public.portfolio_projects;
create policy "Public read projects" on public.portfolio_projects
for select
using (true);

drop policy if exists "Public read experiences" on public.portfolio_experiences;
create policy "Public read experiences" on public.portfolio_experiences
for select
using (true);

drop policy if exists "Public read profile" on public.portfolio_profile;
create policy "Public read profile" on public.portfolio_profile
for select
using (true);

-- Authenticated role matches anon behaviour for reads
drop policy if exists "Authenticated read blog comments" on public.blog_comments;
create policy "Authenticated read blog comments" on public.blog_comments
for select to authenticated
using (true);

drop policy if exists "Authenticated read projects" on public.portfolio_projects;
create policy "Authenticated read projects" on public.portfolio_projects
for select to authenticated
using (true);

drop policy if exists "Authenticated read experiences" on public.portfolio_experiences;
create policy "Authenticated read experiences" on public.portfolio_experiences
for select to authenticated
using (true);

drop policy if exists "Authenticated read profile" on public.portfolio_profile;
create policy "Authenticated read profile" on public.portfolio_profile
for select to authenticated
using (true);

-- Service role bypasses RLS, so admin routes can perform writes without extra policies.
