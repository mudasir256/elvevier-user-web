create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  image text not null,
  mobile_image text,
  alt text not null default '',
  href text not null default '',
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists banners_active_sort_idx on public.banners (active, sort_order);

alter table public.banners enable row level security;

insert into public.banners (image, mobile_image, alt, href, sort_order, active)
select
  '/kairo/empulse_banner_same_size_as_reference.png',
  '/kairo/MOBILESCREEN.png',
  'Empulse fashion banner',
  '',
  0,
  true
where not exists (select 1 from public.banners);
