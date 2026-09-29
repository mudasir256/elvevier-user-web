delete from public.products
where category_id = 'shoes'
  and lower(subcategory) in ('man', 'men');

insert into public.products (
  id, name, slug, price, compare_at_price, category_id, subcategory, color, image, images, description, featured, is_new, active
) values (
  'shoe-on-cloud-6-black',
  'On Cloud 6 All Black',
  'on-cloud-6-all-black',
  42900,
  56900,
  'shoes',
  'Man',
  'Black',
  'https://fvpukvbdvtfqlnvlijqa.supabase.co/storage/v1/object/public/product-images/dcf2eaa0-228f-4c82-ab9c-089c03e377db.png',
  '["https://fvpukvbdvtfqlnvlijqa.supabase.co/storage/v1/object/public/product-images/dcf2eaa0-228f-4c82-ab9c-089c03e377db.png","https://fvpukvbdvtfqlnvlijqa.supabase.co/storage/v1/object/public/product-images/30812c3d-6b58-4420-acc7-d53a41b7429a.png","https://fvpukvbdvtfqlnvlijqa.supabase.co/storage/v1/object/public/product-images/5bd7e7a9-2e44-4c31-8b5c-40a0a5f751e8.png","https://fvpukvbdvtfqlnvlijqa.supabase.co/storage/v1/object/public/product-images/68299cf6-b020-4ac8-b983-562a118d1647.png","https://fvpukvbdvtfqlnvlijqa.supabase.co/storage/v1/object/public/product-images/ad6080ca-ad68-4448-a92d-47ead4ca432e.png","https://fvpukvbdvtfqlnvlijqa.supabase.co/storage/v1/object/public/product-images/253fc880-6fd2-4655-9acf-e370e3966246.png"]'::jsonb,
  $d$A men's On Cloud 6 in all black. The engineered mesh stays light and breathable, the speed laces lock the fit, and the CloudTec sole cushions each step. One black colorway from the heel logo to the outsole, easy with jeans, trousers, or a sweatshirt.$d$,
  false,
  true,
  true
);
