alter table public.products
  add column if not exists images jsonb not null default '[]'::jsonb;
