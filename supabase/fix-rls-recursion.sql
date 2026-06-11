-- ============================================================
-- Fix: Infinite recursion in RLS policies
-- Run this in Supabase → SQL Editor if you already ran schema.sql
-- ============================================================
-- Root cause: policies on `profiles` and `websites` used
--   EXISTS (SELECT 1 FROM public.profiles WHERE ...)
-- which re-evaluates RLS on profiles, causing an infinite loop.
-- Fix: a SECURITY DEFINER function that checks admin status
-- by bypassing RLS entirely.
-- ============================================================

-- 1. Create the helper function (runs as DB owner, skips RLS)
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

-- 2. Fix profiles policies
drop policy if exists "Admins can view all profiles" on public.profiles;
drop policy if exists "Admins can update all profiles" on public.profiles;
drop policy if exists "Admins can insert profiles" on public.profiles;

create policy "Admins can view all profiles"
  on public.profiles for select using (public.is_admin());

create policy "Admins can update all profiles"
  on public.profiles for update using (public.is_admin());

create policy "Admins can insert profiles"
  on public.profiles for insert with check (public.is_admin());

-- 3. Fix websites policies
drop policy if exists "Admins can insert websites" on public.websites;
drop policy if exists "Admins can update websites" on public.websites;
drop policy if exists "Admins can delete websites" on public.websites;

create policy "Admins can insert websites"
  on public.websites for insert with check (public.is_admin());

create policy "Admins can update websites"
  on public.websites for update using (public.is_admin());

create policy "Admins can delete websites"
  on public.websites for delete using (public.is_admin());

-- 4. Promote your first user to admin (change email as needed)
-- update public.profiles set role = 'admin' where email = 'admin@gmail.com';
