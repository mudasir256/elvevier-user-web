alter table public.products
  add column if not exists brand text not null default '';

create index if not exists products_brand_idx on public.products (brand);

update public.products set brand = 'Zara'
where slug like 'zara-lycra-interlock-relaxed-fit-trousers-%';

update public.products set brand = 'Polo Ralph Lauren'
where slug like 'polo-ralph-lauren-interlock-sweatpants-%';

update public.products set brand = 'On'
where category_id = 'shoes' and name like 'On %';
