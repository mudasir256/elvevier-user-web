alter table public.products
  add column if not exists variants jsonb not null default '[]'::jsonb;

alter table public.cart_items
  add column if not exists color text not null default '';

do $$
declare
  existing_name text;
begin
  for existing_name in
    select conname
    from pg_constraint
    where conrelid = 'public.cart_items'::regclass
      and contype = 'u'
      and conname <> 'cart_items_variant_key'
  loop
    execute format('alter table public.cart_items drop constraint %I', existing_name);
  end loop;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.cart_items'::regclass
      and conname = 'cart_items_variant_key'
  ) then
    alter table public.cart_items
      add constraint cart_items_variant_key unique (cart_id, product_id, size, color);
  end if;
end $$;
