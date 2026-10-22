-- Used by the admin product routes to decide which removed photos can be deleted from storage.
create or replace function public.product_images_in_use(paths text[])
returns setof text
language sql
stable
as $$
  select p from unnest(paths) as p
  where exists (
      select 1 from public.products x
      where strpos(x.image, p) > 0 or strpos(x.images::text, p) > 0 or strpos(x.color_images::text, p) > 0
    )
    or exists (select 1 from public.banners b where strpos(to_jsonb(b)::text, p) > 0)
    or exists (select 1 from public.orders o where strpos(o.order_items::text, p) > 0);
$$;

revoke execute on function public.product_images_in_use(text[]) from public, anon, authenticated;
grant execute on function public.product_images_in_use(text[]) to service_role;
