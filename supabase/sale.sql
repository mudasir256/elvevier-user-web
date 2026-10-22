alter table public.products
  add column if not exists sale_percent integer not null default 0;

alter table public.products
  drop constraint if exists products_sale_percent_range;

alter table public.products
  add constraint products_sale_percent_range check (sale_percent between 0 and 90);
