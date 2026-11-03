create table if not exists public.promo_codes (
  code text primary key,
  owner text not null default '',
  type text not null check (type in ('percent', 'fixed')),
  value numeric not null check (value > 0),
  min_order numeric not null default 0,
  max_uses integer,
  once_per_customer boolean not null default false,
  expires_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.promo_codes enable row level security;

alter table public.orders
  add column if not exists promo_code text,
  add column if not exists discount numeric not null default 0;

create index if not exists orders_promo_code_idx on public.orders (promo_code);
