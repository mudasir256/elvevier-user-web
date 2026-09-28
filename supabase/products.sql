create table if not exists public.products (
  id text primary key,
  name text not null,
  slug text not null unique,
  price numeric not null,
  compare_at_price numeric,
  category_id text not null,
  subcategory text not null default '',
  color text not null default '',
  image text not null,
  description text not null default '',
  featured boolean not null default false,
  is_new boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create index if not exists products_category_idx on public.products (category_id);
create index if not exists products_active_idx on public.products (active);

alter table public.products enable row level security;

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;
