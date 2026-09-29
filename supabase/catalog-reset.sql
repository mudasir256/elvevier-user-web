delete from public.products;

insert into public.products (
  id, name, slug, price, compare_at_price, category_id, subcategory, color, image, images, description, featured, is_new, active
) values
(
  'shoe-sand-sock',
  'Sand Sock Fit Sneakers',
  'sand-sock-fit-sneakers',
  8900, 10900, 'shoes', 'Man', 'Sand',
  '/kairo/MFW25SK011-SAND-SOCK-SOCK-FIT_CASUAL_SNEAKERS-FIT_CASUAL_SNEAKERS-bab7b2_4_9c71a07a-24c3-43f6-85b6-c96d4c924d2f.webp',
  '["/kairo/MFW25SK011-SAND-SOCK-SOCK-FIT_CASUAL_SNEAKERS-FIT_CASUAL_SNEAKERS-bab7b2_4_9c71a07a-24c3-43f6-85b6-c96d4c924d2f.webp"]'::jsonb,
  $d$A sock-fit sneaker with a soft knit upper and a cushioned sole for all-day wear. Lightweight, breathable, and easy to slip on.$d$,
  true, true, true
),
(
  'shoe-brown-loafer',
  'Brown Leather Loafers',
  'brown-leather-loafers',
  9500, 11500, 'shoes', 'Man', 'Brown',
  '/kairo/l_20221-s2jq53z8-rzh_a2.webp',
  '["/kairo/l_20221-s2jq53z8-rzh_a2.webp"]'::jsonb,
  $d$Polished leather loafers with a clean apron toe and a leather-lined footbed. Made for smart days and easy evenings.$d$,
  true, false, true
),
(
  'shoe-beige-suede',
  'Beige Suede Loafers',
  'beige-suede-loafers',
  9800, 12000, 'shoes', 'Man', 'Beige',
  '/kairo/l_20221-s2mr00z8-sqa_a.webp',
  '["/kairo/l_20221-s2mr00z8-sqa_a.webp"]'::jsonb,
  $d$Soft suede loafers in a warm beige. A flexible sole and a low profile that pairs with trousers or jeans.$d$,
  false, true, true
),
(
  'shoe-navy-knit',
  'Navy Lace-Up Knit Sneakers',
  'navy-lace-up-knit-sneakers',
  7900, 9600, 'shoes', 'Man', 'Navy',
  '/kairo/men_s-sneakers-collection-by-lama-retail.jpg',
  '["/kairo/men_s-sneakers-collection-by-lama-retail.jpg"]'::jsonb,
  $d$Navy knit sneakers with a lace-up front and a padded collar. Built for everyday walking with a light, flexible sole.$d$,
  false, true, true
),
(
  'trouser-khaki',
  'Khaki Pleated Straight Trousers',
  'khaki-pleated-straight-trousers',
  6450, 7900, 'men', 'Trouser', 'Khaki',
  '/kairo/MAW25BT030-KHAKI-PLEATED-STRAIGHT-TROUSERS-9c8b83_3_b2ddc15b-9ac3-4a60-bcb0-3fc3b31f8b84.webp',
  '["/kairo/MAW25BT030-KHAKI-PLEATED-STRAIGHT-TROUSERS-9c8b83_3_b2ddc15b-9ac3-4a60-bcb0-3fc3b31f8b84.webp","/kairo/MAW25BT030-KHAKI-PLEATED-STRAIGHT-TROUSERS-9c8b83_7.webp"]'::jsonb,
  $d$Straight trousers in a soft khaki twill, with a single pleat and a clean hem. Comfortable through the hip with a tailored leg.$d$,
  true, true, true
),
(
  'trouser-charcoal',
  'Charcoal Tailored Trousers',
  'charcoal-tailored-trousers',
  7200, 8600, 'men', 'Trouser', 'Charcoal',
  '/kairo/catalog/trouser-charcoal.png',
  '["/kairo/catalog/trouser-charcoal.png"]'::jsonb,
  $d$Charcoal trousers cut close through the thigh and straight to the ankle. A smooth wool-blend cloth that holds a crease.$d$,
  false, false, true
),
(
  'trouser-navy',
  'Navy Wide-Leg Trousers',
  'navy-wide-leg-trousers',
  6900, 8400, 'women', 'Trouser', 'Navy',
  '/kairo/catalog/trouser-navy.png',
  '["/kairo/catalog/trouser-navy.png"]'::jsonb,
  $d$High-rise navy trousers with a soft pleat and a wide, flowing leg. Light enough for warm days, sharp enough for the office.$d$,
  true, false, true
),
(
  'sweat-ivory',
  'Ivory Cotton Sweatshirt',
  'ivory-cotton-sweatshirt',
  5490, 6900, 'women', 'Sweatshirt', 'Ivory',
  '/kairo/catalog/sweat-ivory.png',
  '["/kairo/catalog/sweat-ivory.png"]'::jsonb,
  $d$A crewneck sweatshirt in brushed ivory cotton. Relaxed through the body, with ribbed cuffs and hem.$d$,
  true, true, true
),
(
  'sweat-burgundy',
  'Burgundy Oversized Sweatshirt',
  'burgundy-oversized-sweatshirt',
  5990, 7500, 'men', 'Sweatshirt', 'Burgundy',
  '/kairo/catalog/sweat-burgundy.png',
  '["/kairo/catalog/sweat-burgundy.png"]'::jsonb,
  $d$An oversized sweatshirt in deep burgundy fleece. Dropped shoulders and a roomy fit made for layering.$d$,
  false, true, true
),
(
  'sweat-sage',
  'Sage Relaxed Sweatshirt',
  'sage-relaxed-sweatshirt',
  5290, 6800, 'women', 'Sweatshirt', 'Sage',
  '/kairo/catalog/sweat-sage.png',
  '["/kairo/catalog/sweat-sage.png"]'::jsonb,
  $d$A relaxed sage sweatshirt with a soft inside brush. Easy to wear with jeans or wide trousers.$d$,
  false, false, true
),
(
  'jeans-indigo',
  'Indigo Straight Jeans',
  'indigo-straight-jeans',
  6490, 8200, 'men', 'Jeans', 'Indigo',
  '/kairo/catalog/jeans-indigo.png',
  '["/kairo/catalog/jeans-indigo.png"]'::jsonb,
  $d$Straight-leg jeans in dark indigo denim. Classic five-pocket construction with a mid rise and a clean hem.$d$,
  true, true, true
),
(
  'jeans-black',
  'Black Slim Jeans',
  'black-slim-jeans',
  6290, 7900, 'women', 'Jeans', 'Black',
  '/kairo/catalog/jeans-black.png',
  '["/kairo/catalog/jeans-black.png"]'::jsonb,
  $d$Slim black jeans with a little stretch for comfort. A sharp leg that sits cleanly over sneakers or loafers.$d$,
  false, false, true
),
(
  'jeans-light',
  'Light Wash Relaxed Jeans',
  'light-wash-relaxed-jeans',
  5990, 7600, 'men', 'Jeans', 'Light Blue',
  '/kairo/catalog/jeans-light.png',
  '["/kairo/catalog/jeans-light.png"]'::jsonb,
  $d$Relaxed jeans in a pale wash. Soft denim with an easy thigh and a straight opening.$d$,
  false, true, true
),
(
  'hoodie-burgundy',
  'Burgundy Pullover Hoodie',
  'burgundy-pullover-hoodie',
  5690, 7200, 'men', 'Hoodie', 'Burgundy',
  '/kairo/catalog/hoodie-burgundy.png',
  '["/kairo/catalog/hoodie-burgundy.png"]'::jsonb,
  $d$A pullover hoodie in burgundy cotton fleece. Kangaroo pocket, lined hood, and a relaxed fit.$d$,
  true, true, true
),
(
  'hoodie-black',
  'Black Everyday Hoodie',
  'black-everyday-hoodie',
  4990, 6500, 'women', 'Hoodie', 'Black',
  '/kairo/catalog/hoodie-black.png',
  '["/kairo/catalog/hoodie-black.png"]'::jsonb,
  $d$A black hoodie cut for everyday wear. Soft fleece, a roomy hood, and ribbing that keeps its shape.$d$,
  false, true, true
),
(
  'hoodie-grey',
  'Grey Zip Hoodie',
  'grey-zip-hoodie',
  6290, 7800, 'men', 'Hoodie', 'Grey',
  '/kairo/catalog/hoodie-grey.png',
  '["/kairo/catalog/hoodie-grey.png"]'::jsonb,
  $d$A heather grey zip hoodie with a metal zip and side pockets. Layer it over a tee or wear it on its own.$d$,
  false, false, true
),
(
  'jacket-olive',
  'Olive Field Jacket',
  'olive-field-jacket',
  11900, 14500, 'men', 'Jacket', 'Olive',
  '/kairo/catalog/jacket-olive.png',
  '["/kairo/catalog/jacket-olive.png"]'::jsonb,
  $d$An olive cotton field jacket with a pointed collar, flap pockets, and a straight hem. Lightweight enough for mild evenings.$d$,
  true, true, true
),
(
  'jacket-black',
  'Black Bomber Jacket',
  'black-bomber-jacket',
  10900, 13200, 'women', 'Jacket', 'Black',
  '/kairo/catalog/jacket-black.png',
  '["/kairo/catalog/jacket-black.png"]'::jsonb,
  $d$A black bomber with a ribbed collar, cuffs, and hem. Smooth outer cloth and a neat, cropped shape.$d$,
  true, false, true
),
(
  'jacket-camel',
  'Camel Wool Jacket',
  'camel-wool-jacket',
  14900, 17800, 'women', 'Jacket', 'Camel',
  '/kairo/catalog/jacket-camel.png',
  '["/kairo/catalog/jacket-camel.png"]'::jsonb,
  $d$A camel wool jacket with a clean lapel and a tailored shoulder. Warm, structured, and easy over knits or shirts.$d$,
  false, true, true
);
