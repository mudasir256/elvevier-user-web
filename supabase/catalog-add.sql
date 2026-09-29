insert into public.products (
  id, name, slug, price, compare_at_price, category_id, subcategory, color, image, images, description, featured, is_new, active
) values
(
  'shoe-white-court', 'White Court Sneakers', 'white-court-sneakers', 7500, 9200, 'shoes', 'Woman', 'White',
  '/kairo/catalog/shoe-white-court.png', '["/kairo/catalog/shoe-white-court.png"]'::jsonb,
  $d$Smooth white court sneakers with a padded tongue and a clean rubber sole.$d$, false, false, true
),
(
  'shoe-black-derby', 'Black Leather Derby Shoes', 'black-leather-derby-shoes', 11200, 13500, 'shoes', 'Man', 'Black',
  '/kairo/catalog/shoe-black-derby.png', '["/kairo/catalog/shoe-black-derby.png"]'::jsonb,
  $d$Polished black derby shoes with a closed lacing and a leather sole. Made for formal days.$d$, false, false, true
),
(
  'shoe-tan-sandal', 'Tan Strap Sandals', 'tan-strap-sandals', 6900, 8400, 'shoes', 'Woman', 'Tan',
  '/kairo/catalog/shoe-tan-sandal.png', '["/kairo/catalog/shoe-tan-sandal.png"]'::jsonb,
  $d$Tan leather sandals with an adjustable strap and a cushioned footbed.$d$, false, false, true
),
(
  'shoe-grey-runner', 'Grey Running Sneakers', 'grey-running-sneakers', 8600, 10400, 'shoes', 'Man', 'Grey',
  '/kairo/catalog/shoe-grey-runner.png', '["/kairo/catalog/shoe-grey-runner.png"]'::jsonb,
  $d$Lightweight grey runners with a breathable upper and a cushioned midsole.$d$, false, false, true
),
(
  'shoe-burgundy-loafer', 'Burgundy Leather Loafers', 'burgundy-leather-loafers', 9900, 12100, 'shoes', 'Man', 'Burgundy',
  '/kairo/catalog/shoe-burgundy-loafer.png', '["/kairo/catalog/shoe-burgundy-loafer.png"]'::jsonb,
  $d$Burgundy leather loafers with a slim profile and a soft lining.$d$, false, false, true
),
(
  'shoe-olive-trail', 'Olive Trail Sneakers', 'olive-trail-sneakers', 9400, 11400, 'shoes', 'Man', 'Olive',
  '/kairo/catalog/shoe-olive-trail.png', '["/kairo/catalog/shoe-olive-trail.png"]'::jsonb,
  $d$Olive trail sneakers with a grippy sole and a padded collar for longer walks.$d$, false, false, true
),
(
  'trouser-black', 'Black Pleated Trousers', 'black-pleated-trousers', 7100, 8600, 'men', 'Trouser', 'Black',
  '/kairo/catalog/trouser-black.png', '["/kairo/catalog/trouser-black.png"]'::jsonb,
  $d$Black pleated trousers with a straight leg and a sharp crease.$d$, false, false, true
),
(
  'trouser-olive', 'Olive Cotton Trousers', 'olive-cotton-trousers', 6400, 7900, 'men', 'Trouser', 'Olive',
  '/kairo/catalog/trouser-olive.png', '["/kairo/catalog/trouser-olive.png"]'::jsonb,
  $d$Olive cotton trousers with a relaxed thigh and a clean straight hem.$d$, false, false, true
),
(
  'trouser-cream', 'Cream Wide Trousers', 'cream-wide-trousers', 6800, 8300, 'women', 'Trouser', 'Cream',
  '/kairo/catalog/trouser-cream.png', '["/kairo/catalog/trouser-cream.png"]'::jsonb,
  $d$Cream wide-leg trousers in a light cloth. High rise with a soft drape.$d$, false, false, true
),
(
  'trouser-cord', 'Brown Corduroy Trousers', 'brown-corduroy-trousers', 7300, 8900, 'men', 'Trouser', 'Brown',
  '/kairo/catalog/trouser-cord.png', '["/kairo/catalog/trouser-cord.png"]'::jsonb,
  $d$Brown corduroy trousers with a fine rib and a straight leg.$d$, false, false, true
),
(
  'trouser-stone', 'Stone Linen Trousers', 'stone-linen-trousers', 7600, 9200, 'women', 'Trouser', 'Stone',
  '/kairo/catalog/trouser-stone.png', '["/kairo/catalog/trouser-stone.png"]'::jsonb,
  $d$Stone linen trousers with a relaxed fit that breathes in warm weather.$d$, false, false, true
),
(
  'trouser-grey', 'Grey Slim Trousers', 'grey-slim-trousers', 6900, 8400, 'men', 'Trouser', 'Grey',
  '/kairo/catalog/trouser-grey.png', '["/kairo/catalog/trouser-grey.png"]'::jsonb,
  $d$Grey slim trousers in a smooth suiting cloth. Neat through the leg.$d$, false, false, true
),
(
  'trouser-wine', 'Wine Tailored Trousers', 'wine-tailored-trousers', 7400, 9000, 'women', 'Trouser', 'Wine',
  '/kairo/catalog/trouser-wine.png', '["/kairo/catalog/trouser-wine.png"]'::jsonb,
  $d$Wine tailored trousers with a clean front and a gently tapered leg.$d$, false, false, true
),
(
  'sweat-black', 'Black Crew Sweatshirt', 'black-crew-sweatshirt', 4990, 6400, 'men', 'Sweatshirt', 'Black',
  '/kairo/catalog/sweat-black.png', '["/kairo/catalog/sweat-black.png"]'::jsonb,
  $d$A black crewneck sweatshirt in brushed cotton with ribbed cuffs.$d$, false, false, true
),
(
  'sweat-navy', 'Navy Half-Zip Sweatshirt', 'navy-half-zip-sweatshirt', 6490, 7900, 'men', 'Sweatshirt', 'Navy',
  '/kairo/catalog/sweat-navy.png', '["/kairo/catalog/sweat-navy.png"]'::jsonb,
  $d$A navy half-zip sweatshirt with a tall collar and a warm fleece back.$d$, false, false, true
),
(
  'sweat-cream', 'Cream Boxy Sweatshirt', 'cream-boxy-sweatshirt', 5690, 7100, 'women', 'Sweatshirt', 'Cream',
  '/kairo/catalog/sweat-cream.png', '["/kairo/catalog/sweat-cream.png"]'::jsonb,
  $d$A boxy cream sweatshirt with dropped shoulders and a cropped hem.$d$, false, false, true
),
(
  'sweat-olive', 'Olive Vintage Sweatshirt', 'olive-vintage-sweatshirt', 5390, 6800, 'men', 'Sweatshirt', 'Olive',
  '/kairo/catalog/sweat-olive.png', '["/kairo/catalog/sweat-olive.png"]'::jsonb,
  $d$An olive sweatshirt with a washed finish and a relaxed body.$d$, false, false, true
),
(
  'sweat-grey', 'Grey Marle Sweatshirt', 'grey-marle-sweatshirt', 5190, 6600, 'women', 'Sweatshirt', 'Grey',
  '/kairo/catalog/sweat-grey.png', '["/kairo/catalog/sweat-grey.png"]'::jsonb,
  $d$A heather grey sweatshirt in a soft marle knit. Easy with jeans.$d$, false, false, true
),
(
  'sweat-camel', 'Camel Relaxed Sweatshirt', 'camel-relaxed-sweatshirt', 5890, 7300, 'women', 'Sweatshirt', 'Camel',
  '/kairo/catalog/sweat-camel.png', '["/kairo/catalog/sweat-camel.png"]'::jsonb,
  $d$A camel sweatshirt with a roomy fit and a smooth outer face.$d$, false, false, true
),
(
  'sweat-forest', 'Forest Green Sweatshirt', 'forest-green-sweatshirt', 5490, 6900, 'men', 'Sweatshirt', 'Forest',
  '/kairo/catalog/sweat-forest.png', '["/kairo/catalog/sweat-forest.png"]'::jsonb,
  $d$A forest green crew sweatshirt in mid-weight cotton fleece.$d$, false, false, true
),
(
  'jeans-mom', 'Mid Blue Mom Jeans', 'mid-blue-mom-jeans', 6790, 8400, 'women', 'Jeans', 'Mid Blue',
  '/kairo/catalog/jeans-mom.png', '["/kairo/catalog/jeans-mom.png"]'::jsonb,
  $d$High-rise mom jeans in a mid blue wash with a relaxed hip and a tapered ankle.$d$, false, false, true
),
(
  'jeans-ecru', 'Ecru Wide Jeans', 'ecru-wide-jeans', 6990, 8600, 'women', 'Jeans', 'Ecru',
  '/kairo/catalog/jeans-ecru.png', '["/kairo/catalog/jeans-ecru.png"]'::jsonb,
  $d$Ecru wide-leg jeans in undyed denim. A soft drape and a full length.$d$, false, false, true
),
(
  'jeans-grey', 'Dark Grey Jeans', 'dark-grey-jeans', 6290, 7800, 'men', 'Jeans', 'Dark Grey',
  '/kairo/catalog/jeans-grey.png', '["/kairo/catalog/jeans-grey.png"]'::jsonb,
  $d$Dark grey jeans with a straight leg and a clean five-pocket build.$d$, false, false, true
),
(
  'jeans-raw', 'Raw Selvedge Jeans', 'raw-selvedge-jeans', 8900, 10800, 'men', 'Jeans', 'Indigo',
  '/kairo/catalog/jeans-raw.png', '["/kairo/catalog/jeans-raw.png"]'::jsonb,
  $d$Raw selvedge jeans in deep indigo. A firm denim that softens with wear.$d$, false, false, true
),
(
  'jeans-pale', 'Pale Blue Straight Jeans', 'pale-blue-straight-jeans', 6190, 7600, 'women', 'Jeans', 'Pale Blue',
  '/kairo/catalog/jeans-pale.png', '["/kairo/catalog/jeans-pale.png"]'::jsonb,
  $d$Pale blue straight jeans with a light fade and a comfortable rise.$d$, false, false, true
),
(
  'jeans-charcoal', 'Charcoal Relaxed Jeans', 'charcoal-relaxed-jeans', 6490, 8000, 'men', 'Jeans', 'Charcoal',
  '/kairo/catalog/jeans-charcoal.png', '["/kairo/catalog/jeans-charcoal.png"]'::jsonb,
  $d$Charcoal jeans with an easy thigh and a straight opening.$d$, false, false, true
),
(
  'jeans-boot', 'Indigo Bootcut Jeans', 'indigo-bootcut-jeans', 6590, 8100, 'women', 'Jeans', 'Indigo',
  '/kairo/catalog/jeans-boot.png', '["/kairo/catalog/jeans-boot.png"]'::jsonb,
  $d$Indigo bootcut jeans that open slightly over the shoe.$d$, false, false, true
),
(
  'hoodie-navy', 'Navy Pullover Hoodie', 'navy-pullover-hoodie', 5490, 6900, 'men', 'Hoodie', 'Navy',
  '/kairo/catalog/hoodie-navy.png', '["/kairo/catalog/hoodie-navy.png"]'::jsonb,
  $d$A navy pullover hoodie in cotton fleece with a lined hood and front pocket.$d$, false, false, true
),
(
  'hoodie-olive', 'Olive Zip Hoodie', 'olive-zip-hoodie', 6290, 7800, 'men', 'Hoodie', 'Olive',
  '/kairo/catalog/hoodie-olive.png', '["/kairo/catalog/hoodie-olive.png"]'::jsonb,
  $d$An olive zip hoodie with a metal zip and two side pockets.$d$, false, false, true
),
(
  'hoodie-cream', 'Cream Pullover Hoodie', 'cream-pullover-hoodie', 5690, 7100, 'women', 'Hoodie', 'Cream',
  '/kairo/catalog/hoodie-cream.png', '["/kairo/catalog/hoodie-cream.png"]'::jsonb,
  $d$A cream hoodie with a soft brush inside and a relaxed shoulder.$d$, false, false, true
),
(
  'hoodie-forest', 'Forest Green Hoodie', 'forest-green-hoodie', 5490, 6900, 'men', 'Hoodie', 'Forest',
  '/kairo/catalog/hoodie-forest.png', '["/kairo/catalog/hoodie-forest.png"]'::jsonb,
  $d$A forest green pullover hoodie with ribbed cuffs and a roomy hood.$d$, false, false, true
),
(
  'hoodie-stone', 'Stone Oversized Hoodie', 'stone-oversized-hoodie', 5990, 7500, 'women', 'Hoodie', 'Stone',
  '/kairo/catalog/hoodie-stone.png', '["/kairo/catalog/hoodie-stone.png"]'::jsonb,
  $d$An oversized stone hoodie with dropped shoulders and a long hem.$d$, false, false, true
),
(
  'hoodie-wine', 'Wine Pullover Hoodie', 'wine-pullover-hoodie', 5790, 7200, 'women', 'Hoodie', 'Wine',
  '/kairo/catalog/hoodie-wine.png', '["/kairo/catalog/hoodie-wine.png"]'::jsonb,
  $d$A wine pullover hoodie in warm fleece. Simple, soft, and easy to layer.$d$, false, false, true
),
(
  'hoodie-blue', 'Heather Blue Hoodie', 'heather-blue-hoodie', 5390, 6800, 'men', 'Hoodie', 'Blue',
  '/kairo/catalog/hoodie-blue.png', '["/kairo/catalog/hoodie-blue.png"]'::jsonb,
  $d$A heather blue hoodie with a kangaroo pocket and a regular fit.$d$, false, false, true
),
(
  'jacket-navy', 'Navy Harrington Jacket', 'navy-harrington-jacket', 10400, 12800, 'men', 'Jacket', 'Navy',
  '/kairo/catalog/jacket-navy.png', '["/kairo/catalog/jacket-navy.png"]'::jsonb,
  $d$A navy Harrington jacket with a stand collar, zip front, and a short straight hem.$d$, false, false, true
),
(
  'jacket-suede', 'Brown Suede Jacket', 'brown-suede-jacket', 13900, 16800, 'men', 'Jacket', 'Brown',
  '/kairo/catalog/jacket-suede.png', '["/kairo/catalog/jacket-suede.png"]'::jsonb,
  $d$A brown suede jacket with a pointed collar and a lightly worn finish.$d$, false, false, true
),
(
  'jacket-grey', 'Grey Wool Jacket', 'grey-wool-jacket', 12900, 15600, 'women', 'Jacket', 'Grey',
  '/kairo/catalog/jacket-grey.png', '["/kairo/catalog/jacket-grey.png"]'::jsonb,
  $d$A grey wool jacket with a tailored shoulder and a clean front.$d$, false, false, true
),
(
  'jacket-denim', 'Black Denim Jacket', 'black-denim-jacket', 8900, 10900, 'women', 'Jacket', 'Black',
  '/kairo/catalog/jacket-denim.png', '["/kairo/catalog/jacket-denim.png"]'::jsonb,
  $d$A black denim jacket with metal buttons and two chest pockets.$d$, false, false, true
),
(
  'jacket-trench', 'Beige Trench Jacket', 'beige-trench-jacket', 15400, 18600, 'women', 'Jacket', 'Beige',
  '/kairo/catalog/jacket-trench.png', '["/kairo/catalog/jacket-trench.png"]'::jsonb,
  $d$A beige trench jacket with a belt, storm flaps, and a knee length.$d$, false, false, true
),
(
  'jacket-parka', 'Forest Parka Jacket', 'forest-parka-jacket', 14900, 17900, 'men', 'Jacket', 'Forest',
  '/kairo/catalog/jacket-parka.png', '["/kairo/catalog/jacket-parka.png"]'::jsonb,
  $d$A forest parka with a hood and a warm lining for cooler evenings.$d$, false, false, true
),
(
  'jacket-cream', 'Cream Overshirt Jacket', 'cream-overshirt-jacket', 7900, 9800, 'men', 'Jacket', 'Cream',
  '/kairo/catalog/jacket-cream.png', '["/kairo/catalog/jacket-cream.png"]'::jsonb,
  $d$A cream cotton overshirt jacket you can wear open over a tee or hoodie.$d$, false, false, true
);
