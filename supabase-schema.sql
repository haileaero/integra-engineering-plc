-- Run this in Supabase SQL Editor.
create table if not exists public.site_content (
  id integer primary key,
  content jsonb not null
);
alter table public.site_content enable row level security;
create policy "Public can read site content" on public.site_content for select using (true);
create policy "Authenticated admins can write site content" on public.site_content for insert with check (auth.role() = 'authenticated');
create policy "Authenticated admins can update site content" on public.site_content for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

insert into public.site_content (id, content)
values (1, '{}'::jsonb)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('site-assets','site-assets',true)
on conflict (id) do nothing;

create policy "Public can view site assets" on storage.objects for select using (bucket_id = 'site-assets');
create policy "Authenticated admins can upload site assets" on storage.objects for insert with check (bucket_id = 'site-assets' and auth.role() = 'authenticated');
create policy "Authenticated admins can update site assets" on storage.objects for update using (bucket_id = 'site-assets' and auth.role() = 'authenticated') with check (bucket_id = 'site-assets' and auth.role() = 'authenticated');
create policy "Authenticated admins can delete site assets" on storage.objects for delete using (bucket_id = 'site-assets' and auth.role() = 'authenticated');
