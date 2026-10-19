create table if not exists public.brands (
  slug text primary key,
  name text not null unique,
  created_at timestamptz not null default now()
);

alter table public.brands enable row level security;

insert into public.brands (slug, name) values
  ('bershka', 'Bershka'),
  ('on', 'On'),
  ('polo-ralph-lauren', 'Polo Ralph Lauren'),
  ('zara', 'Zara')
on conflict (slug) do nothing;

alter table public.brands
  add column if not exists types text[] not null default '{}';

update public.brands set types = array['trouser'] where slug = 'bershka';
