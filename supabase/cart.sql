create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users (id) on delete cascade,
  guest_token text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint carts_owner check (user_id is not null or guest_token is not null)
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts (id) on delete cascade,
  product_id text not null references public.products (id) on delete cascade,
  quantity integer not null check (quantity > 0 and quantity <= 20),
  size text not null default '',
  created_at timestamptz not null default now(),
  unique (cart_id, product_id, size)
);

create index if not exists cart_items_cart_idx on public.cart_items (cart_id);

alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
