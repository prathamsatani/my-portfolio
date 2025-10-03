-- 0003_create_public_storage_bucket.sql
-- Creates a public storage bucket for static assets (images, PDFs, etc.)

-- Create the public bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'public',
  'public',
  true,
  52428800, -- 50MB limit
  array[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    -- 'image/svg+xml' removed for security (SVG can contain scripts)
    'application/pdf',
    'video/mp4',
    'video/webm'
  ]
)
on conflict (id) do nothing;

-- Enable public access for reading files
drop policy if exists "Public can view files in public bucket" on storage.objects;
create policy "Public can view files in public bucket"
on storage.objects for select
using (bucket_id = 'public');

-- Allow authenticated users to upload files
drop policy if exists "Authenticated users can upload to public bucket" on storage.objects;
create policy "Authenticated users can upload to public bucket"
on storage.objects for insert
to authenticated
with check (bucket_id = 'public');

-- Allow authenticated users to update their own files
drop policy if exists "Authenticated users can update their own files" on storage.objects;
create policy "Authenticated users can update their own files"
on storage.objects for update
to authenticated
using (bucket_id = 'public' and auth.uid() = owner);

-- Allow authenticated users to delete their own files
drop policy if exists "Authenticated users can delete their own files" on storage.objects;
create policy "Authenticated users can delete their own files"
on storage.objects for delete
to authenticated
using (bucket_id = 'public' and auth.uid() = owner);

-- For admin operations (service role), RLS is bypassed automatically
