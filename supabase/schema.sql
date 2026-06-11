-- ============================================================
-- Desun Technology CMS — Supabase Schema
-- Run this in your Supabase SQL Editor (Project > SQL Editor)
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES (extends Supabase Auth users)
-- ============================================================
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Helper: check if the calling user is an admin.
-- SECURITY DEFINER bypasses RLS on profiles, preventing infinite recursion
-- in policies that need to check admin status by querying this same table.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Profiles: users can read their own, admins can read all
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.is_admin());

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins can update all profiles"
  on public.profiles for update
  using (public.is_admin());

create policy "Admins can insert profiles"
  on public.profiles for insert
  with check (public.is_admin());

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'editor')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- WEBSITES
-- ============================================================
create table public.websites (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  domain text,
  logo_url text,
  api_key uuid not null default uuid_generate_v4(),
  deploy_hook_url text,
  revalidate_url text,
  revalidate_secret text,
  preview_url text,
  preview_secret text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.websites enable row level security;

create policy "Authenticated users can view websites"
  on public.websites for select
  using (auth.role() = 'authenticated');

create policy "Admins can insert websites"
  on public.websites for insert
  with check (public.is_admin());

create policy "Admins can update websites"
  on public.websites for update
  using (public.is_admin());

create policy "Admins can delete websites"
  on public.websites for delete
  using (public.is_admin());

create trigger websites_updated_at
  before update on public.websites
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- PAGES
-- ============================================================
create table public.pages (
  id uuid primary key default uuid_generate_v4(),
  website_id uuid not null references public.websites(id) on delete cascade,
  title text not null,
  slug text not null,
  meta_title text,
  meta_description text,
  og_image text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(website_id, slug)
);

alter table public.pages enable row level security;

create policy "Authenticated users can view pages"
  on public.pages for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can insert pages"
  on public.pages for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can update pages"
  on public.pages for update
  using (auth.role() = 'authenticated');

create policy "Admins can delete pages"
  on public.pages for delete
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create trigger pages_updated_at
  before update on public.pages
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- SECTIONS
-- ============================================================
create table public.sections (
  id uuid primary key default uuid_generate_v4(),
  page_id uuid not null references public.pages(id) on delete cascade,
  section_type text not null,
  label text,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.sections enable row level security;

create policy "Authenticated users can view sections"
  on public.sections for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can insert sections"
  on public.sections for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can update sections"
  on public.sections for update
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete sections"
  on public.sections for delete
  using (auth.role() = 'authenticated');

create trigger sections_updated_at
  before update on public.sections
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- SECTION FIELDS (stores content values)
-- ============================================================
create table public.section_fields (
  id uuid primary key default uuid_generate_v4(),
  section_id uuid not null references public.sections(id) on delete cascade,
  field_key text not null,
  field_type text not null check (field_type in ('text', 'textarea', 'richtext', 'image', 'url', 'boolean', 'number')),
  field_value text,
  field_label text,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(section_id, field_key)
);

alter table public.section_fields enable row level security;

create policy "Authenticated users can view section_fields"
  on public.section_fields for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can insert section_fields"
  on public.section_fields for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can update section_fields"
  on public.section_fields for update
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete section_fields"
  on public.section_fields for delete
  using (auth.role() = 'authenticated');

create trigger section_fields_updated_at
  before update on public.section_fields
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- BLOGS
-- ============================================================
create table public.blogs (
  id uuid primary key default uuid_generate_v4(),
  website_id uuid not null references public.websites(id) on delete cascade,
  title text not null,
  slug text not null,
  excerpt text,
  content text,
  cover_image text,
  author_id uuid references public.profiles(id) on delete set null,
  published_at timestamptz,
  status text not null default 'draft' check (status in ('draft', 'published')),
  meta_title text,
  meta_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(website_id, slug)
);

alter table public.blogs enable row level security;

create policy "Authenticated users can view blogs"
  on public.blogs for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can insert blogs"
  on public.blogs for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can update blogs"
  on public.blogs for update
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete blogs"
  on public.blogs for delete
  using (auth.role() = 'authenticated');

create trigger blogs_updated_at
  before update on public.blogs
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- MEDIA
-- ============================================================
create table public.media (
  id uuid primary key default uuid_generate_v4(),
  website_id uuid not null references public.websites(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  file_size integer,
  mime_type text,
  uploaded_by uuid references public.profiles(id) on delete set null,
  uploaded_at timestamptz not null default now()
);

alter table public.media enable row level security;

create policy "Authenticated users can view media"
  on public.media for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can insert media"
  on public.media for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can delete media"
  on public.media for delete
  using (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKET (run separately in Storage > New Bucket)
-- Or use this SQL:
-- ============================================================
insert into storage.buckets (id, name, public)
values ('cms-media', 'cms-media', true)
on conflict (id) do nothing;

create policy "Authenticated users can upload media"
  on storage.objects for insert
  with check (bucket_id = 'cms-media' and auth.role() = 'authenticated');

create policy "Public can view media"
  on storage.objects for select
  using (bucket_id = 'cms-media');

create policy "Authenticated users can delete media"
  on storage.objects for delete
  using (bucket_id = 'cms-media' and auth.role() = 'authenticated');

-- ============================================================
-- ACTIVITY LOG (audit trail for all CMS actions)
-- ============================================================
create table public.activity_log (
  id uuid primary key default uuid_generate_v4(),
  website_id uuid references public.websites(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  user_email text not null default '',
  action text not null,
  entity_type text,
  entity_id text,
  entity_label text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

alter table public.activity_log enable row level security;

create policy "Authenticated users can read activity logs"
  on public.activity_log for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can insert activity logs"
  on public.activity_log for insert
  with check (auth.role() = 'authenticated');

-- ============================================================
-- INDEXES for performance
-- ============================================================
create index idx_pages_website_id on public.pages(website_id);
create index idx_sections_page_id on public.sections(page_id);
create index idx_section_fields_section_id on public.section_fields(section_id);
create index idx_blogs_website_id on public.blogs(website_id);
create index idx_blogs_status on public.blogs(status);
create index idx_media_website_id on public.media(website_id);
