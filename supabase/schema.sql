create extension if not exists pgcrypto;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  first_name text not null,
  last_name text not null,
  address text not null,
  apartment text not null default '',
  city text not null,
  state text not null default '',
  postal_code text not null default '',
  phone text not null,
  order_items jsonb not null default '[]'::jsonb,
  subtotal numeric not null,
  shipping text not null default 'Free',
  total numeric not null,
  payment_method text not null default 'cod',
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create table if not exists public.order_notes (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  text text not null,
  created_at timestamptz not null default now()
);

create index if not exists orders_email_idx on public.orders (email);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists order_notes_order_id_idx on public.order_notes (order_id);

alter table public.orders enable row level security;
alter table public.order_notes enable row level security;
