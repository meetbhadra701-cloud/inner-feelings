// Build src/data/products.json and download product images into public/images.
//
// Source data was gathered from the brand sites the shop stocks (Jockey, U.S.
// Polo Assn., Van Heusen, Enamor) via the browser. Images are downloaded
// server-side here; any that fail fall back to a branded placeholder at runtime
// (image: ""). No prices are stored. Re-runnable: skips images already on disk.
//
// Usage: node scripts/build-data.mjs

import { writeFile, mkdir, access } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const IMG_DIR = path.join(ROOT, 'public', 'images')
const OUT = path.join(ROOT, 'src', 'data', 'products.json')

const J = 'Jockey'
const U = 'U.S. Polo Assn.'
const V = 'Van Heusen'
const E = 'Enamor'

// category => [ [brand, name, imageUrl, descSnippet], ... ]   (img "" => placeholder)
const RAW = {
  'men-undergarments': [
    [J, 'Tactel Microfiber Stretch Printed Trunk - True Navy', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/IC30_TNVPR_0105_S123_JKY_1.webp?v=1700033421', 'Tactel Microfiber Elastane Stretch Printed with Moisture Move'],
    [J, 'Microfiber Mesh Performance Trunk - Ocean Depth', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/MM08_ODEPR_0105_S125_Jky_1_webp.webp?v=1771315741', 'Microfiber Mesh Elastane Stretch with StayDry Technology'],
    [J, 'Tactel Microfiber Stretch Printed Brief - True Navy', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/IC29_TNVPR_0105_S123_JKY_1.webp?v=1700033409', 'Tactel Microfiber Elastane Stretch Printed with Moisture Move'],
    [J, 'Microfiber Mesh Performance Boxer Brief - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/MM06_BLACK_0105_S123_JKY_1.webp?v=1725619829', 'Microfiber Mesh Elastane Stretch with StayDry Technology'],
    [U, 'Striped Waistband Cotton Briefs (Pack of 1)', 'https://cdn.shopify.com/s/files/1/0617/2137/8986/files/1_74aff4b0-fbe9-44d9-a8ea-3872633400f5.jpg', 'Mid-rise, super-soft elasticised waistband, pure cotton'],
    [U, 'Elastic Waistband Ribbed Cotton Trunks (Pack of 2)', 'https://cdn.shopify.com/s/files/1/0617/2137/8986/files/1_4474298f-2a67-49ed-8124-0dd3103ff409.jpg', 'Mid-rise, soft stretch elasticised waistband, ribbed cotton'],
    [V, 'Anti-Bacterial Cotton Boxer Briefs - Quick Dry', 'https://imagescdn.vanheusenindia.com/img/app/product/6/664157-31306058.jpg', 'Anti-bacterial cotton, colour-fresh and quick dry'],
    [V, 'Air Series Active Brief - Swift Dry Mesh', 'https://imagescdn.vanheusenindia.com/img/app/product/8/856236-31413194.jpg', 'Swift-dry high-stretch breathable mesh, active fit'],
  ],
  'men-tshirts-full': [
    [J, 'Super Combed Cotton Round Neck Full Sleeve T-Shirt - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/AM95_BLACK_0103_S223_JKY_1.webp?v=1725619824', 'Super Combed Cotton Rich, Round Neck, Full Sleeve'],
    [J, 'Supima Cotton Round Neck Full Sleeve T-Shirt - Deep Olive', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/IM22_DPOLV_0103_S223_JKY_1.webp?v=1725619832', 'Super Combed Supima Cotton, Round Neck, Full Sleeve'],
    [J, 'Graphic Printed Round Neck Full Sleeve T-Shirt - Deep Olive', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/US82_DPO02_0103_S224_JKY_1_2.webp?v=1744191261', 'Super Combed Cotton Rich, graphic print, full sleeve'],
    [J, 'Oversized Graphic Full Sleeve T-Shirt - Deep Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/MZ13_IPDPBLK_0101_S225_JKY_1.webp?v=1764321636', 'Super Combed Cotton Rich, oversized fit, graphic print'],
    [U, 'Outdoor Muscle Fit Long Sleeve T-Shirt', 'https://cdn.shopify.com/s/files/1/0617/2137/8986/files/1_895e587d-6894-47e9-b3ca-a9fd56f918ff.jpg', 'Turtle neck, long sleeves, solid muscle fit'],
    [U, 'Muscle Fit Striped Long Sleeve T-Shirt', 'https://cdn.shopify.com/s/files/1/0617/2137/8986/files/1_739d2eec-2a98-4705-8fca-dca94cf47ca2.jpg', 'Ribbed crew neck, long sleeves, horizontal stripe'],
  ],
  'men-tshirts-half': [
    [J, 'Super Combed Cotton Round Neck Half Sleeve T-Shirt - White', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/2714_WHITE_0105_S123_JKY_1.webp?v=1700035033', 'Super Combed Cotton Rich, Round Neck, Half Sleeve'],
    [J, 'Super Combed Cotton V Neck Half Sleeve T-Shirt - White', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/2726_WHITE_0105_S123_JKY_1.webp?v=1725619831', 'Super Combed Cotton Rich, V Neck, Half Sleeve'],
    [U, 'Brand Embroidered Motel On The Coast T-Shirt', 'https://cdn.shopify.com/s/files/1/0617/2137/8986/files/1_e700f477-86c2-4c4d-91ba-da88d74e696c.jpg', 'Ribbed crew neck, short sleeves, brand embroidered'],
    [V, 'Men Navy Solid Polo Neck T-Shirt', 'https://imagescdn.vanheusenindia.com/img/app/product/4/40219309-31207217.jpg', 'Polo collar, short sleeves, solid navy'],
  ],
  'men-boxers': [
    [J, 'Mercerized Cotton Woven Boxer Shorts - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/MC10_BLACK_0105_S223_JKY_1.webp?v=1704266597', '100% Super Combed Mercerized Cotton Woven, side pockets'],
    [J, 'Mercerized Cotton Printed Boxer Shorts - Nickel', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/US57_NICKL_0105_S123_JKY_1.webp?v=1725619862', '100% Super Combed Mercerized Cotton Woven, side pockets'],
    [J, 'Cotton Printed Boxer Shorts - Navy & Burnt Olive (Pack of 2)', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/US57_NV-BO_0205_S124_JKY_0.webp?v=1738835851', '100% Super Combed Mercerized Cotton Woven, pack of 2'],
    [J, 'Tencel Lyocell Checkered Boxer Shorts - Poseidon', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/HG18_POSED_0103_S125_Jky_1.webp?v=1744182408', 'Tencel Lyocell Cotton, checkered, side pockets'],
    [U, 'Brand Stripe Dual Pocket Boxers (Pack of 1)', 'https://cdn.shopify.com/s/files/1/0617/2137/8986/files/1_d8ed8796-f4b4-4509-91f9-de07ea6b7d97.jpg', 'Mid-rise, soft inner waistband, dual pockets'],
    [U, 'Mid Rise Pure Cotton Boxers', 'https://cdn.shopify.com/s/files/1/0617/2137/8986/files/1_de9be774-18f2-418a-86f7-b2b24ca3391a.jpg', 'Mid-rise, contrast elasticised waistband, pure cotton'],
    [V, 'Pure Cotton Elasticated Boxer Shorts', 'https://imagescdn.vanheusenindia.com/img/app/product/8/801966-10568345.jpg', 'Pure cotton with elasticated waistband'],
    [V, 'Side Pocket Boxer Shorts (Pack of 2)', 'https://imagescdn.vanheusenindia.com/img/app/product/4/40098330-31486215.jpg', 'Superior lustre cotton, side pockets, pack of 2'],
  ],
  'men-shorts': [
    [J, 'Cotton Rich Regular Fit Shorts with Side Pockets - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/9426_BLACK_0103_S1.25_JKY_1.webp?v=1777025542', 'Super Combed Cotton Rich, regular fit, side pockets'],
    [J, 'Micro Modal Checkered Sleep Shorts - Mid Blue', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/IM02_MDBU1_0103_S223_JKY_1.webp?v=1700021649', 'Tencel Micro Modal Cotton Elastane Stretch, side pockets'],
    [J, 'Lightweight Microfiber Shorts with Zipper Pockets - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/MV23_BLACK_0103_S123_JKY_1.webp?v=1700006725', 'Lightweight breathable microfiber, zipper pockets'],
    [J, 'Cotton Rich Straight Fit Shorts with Zipper Pockets - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/AM14_BLACK_0103_S123_JKY_1.webp?v=1700007218', 'Super Combed Cotton Rich, straight fit, zipper pockets'],
    [U, 'Mid Rise Slim Fit Shorts', 'https://cdn.shopify.com/s/files/1/0617/2137/8986/files/1_1bc2c187-ca88-4d1c-b191-a1a77fe8fe77.jpg', 'Mid-rise, slim fit, four pockets, woven'],
    [U, 'Regular Fit Knitted Shorts', 'https://cdn.shopify.com/s/files/1/0617/2137/8986/files/1_bddbb141-295a-46bc-ab04-daaadc34aa8c.jpg', 'Mid-rise, drawstring, three pockets, knitted'],
    [V, 'Men Beige Solid Casual Shorts', 'https://imagescdn.vanheusenindia.com/img/app/product/3/39894109-17919495.jpg', 'Solid casual shorts, comfortable everyday fit'],
    [V, 'Men Navy Solid Casual Lounge Shorts', 'https://imagescdn.vanheusenindia.com/img/app/product/3/39909950-18332261.jpg', 'Soft solid lounge shorts, relaxed fit'],
  ],
  'men-night-pajamas': [
    [J, 'Micro Modal Cotton Stretch Pyjama - Mid Blue', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/IM03_MDBU1_0103_S223_JKY_1.webp?v=1700021637', 'Tencel Micro Modal Cotton Elastane Stretch, side pockets'],
    [J, 'Micro Modal Cotton Stretch Pyjama - Mid Grey', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/IM03_MDGY1_0103_S223_JKY_1.webp?v=1700021720', 'Tencel Micro Modal Cotton Elastane Stretch, side pockets'],
    [J, 'Micro Modal Cotton Stretch Pyjama - Light Blue', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/IM03_LTBU1_0103_S223_JKY_1.webp?v=1700020166', 'Tencel Micro Modal Cotton Elastane Stretch, side pockets'],
    [J, 'Super Combed Cotton Pyjama - Black Chambray', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/RM09_BLCHY_0103_S225_JKY_1.webp?v=1770831866', '100% Super Combed Cotton, relaxed fit, side pockets'],
    [U, 'Pure Cotton Lounge Pyjama Joggers', 'https://cdn.shopify.com/s/files/1/0617/2137/8986/files/1_16f6b760-6334-4b11-93a1-290e116874f0.jpg', 'Mid-rise, soft elasticised waistband, pure cotton lounge fit'],
    [U, 'Solid Comfort Fit Lounge Joggers', 'https://cdn.shopify.com/s/files/1/0617/2137/8986/files/1_504cbabf-5c30-4de2-9de0-13e99afb1053.jpg', 'Mid-rise, drawcord waist, comfort lounge fit'],
  ],
  'men-joggers': [
    [J, 'Cotton Rich Pique Slim Fit Jogger with Zipper Pockets - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/AM05_BLACK_0103_S223_JKY_1.webp?v=1701684644', 'Super Combed Cotton Rich Pique, slim fit, zipper pockets'],
    [J, 'Cotton Rich Slim Fit Jogger with Zipper Pockets - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/AM02_BLACK_0103_S223_JKY_1.webp?v=1701684844', 'Super Combed Cotton Rich, slim fit, zipper pockets'],
    [J, 'Cotton Rich Jogger with StayFresh Treatment - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/SP31_BLACK_0103_S223_JKY_1.webp?v=1725619859', 'Super Combed Cotton Rich with StayFresh treatment'],
    [J, 'Cotton Rich Slim Fit Jogger with Side Pockets - Cream Melange', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/US90_CRMML_0103_S223_JKY_1.webp?v=1700013742', 'Super Combed Cotton Rich, slim fit, side pockets'],
    [U, 'Regular Fit Active Track Pants', 'https://cdn.shopify.com/s/files/1/0617/2137/8986/files/1_339dd497-cce6-4ca9-807c-7dcc21104a79.jpg', 'Mid-rise, drawstring waist, three-pocket active fit'],
    [U, 'Solid Active Cargo Track Pants', 'https://cdn.shopify.com/s/files/1/0617/2137/8986/files/1_427bf6be-3458-4498-a189-c5d2485a0461.jpg', 'Mid-rise, six-pocket cargo styling, active fit'],
    [V, 'Athleisure City Jogger Pants - Black', 'https://imagescdn.vanheusenindia.com/img/app/product/6/668523-6885727.jpg', 'Athleisure jogger pants, comfortable fit'],
    [V, 'Smart Tech Joggers - Easy Stain Release', 'https://imagescdn.vanheusenindia.com/img/app/product/9/905305-11148584.jpg', 'Smart-tech joggers, easy stain release, anti-stat'],
  ],
  'men-gym-wear': [
    [J, 'Cotton Rib Round Neck Muscle Vest - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/9930_BLACK_0105_S223_JKY_1.webp?v=1700004164', '100% Super Combed Cotton Rib, sleeveless round neck'],
    [J, 'Cotton Rib Round Neck Muscle Vest - Black & Charcoal (Pack of 2)', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/9930_BLACK-CHAML.webp?v=1727929662', '100% Super Combed Cotton Rib, pack of 2'],
    [J, 'Cotton Rib Square Neck Gym Vest - Charcoal Melange', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/US26_CHAML_0105_S123_JKY_1.webp?v=1700011754', '100% Super Combed Cotton Rib, square neck, sleeveless'],
    [J, 'Cotton Rib Square Neck Gym Vest with Graphic Print - White', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/US54_WHITE_0105_S125_JKY_1_webp.webp?v=1771322975', '100% Super Combed Cotton Rib, graphic print'],
    [U, 'Round Neck Cotton Jersey Vest (Pack of 1)', 'https://cdn.shopify.com/s/files/1/0617/2137/8986/files/1_f23e4b71-26c2-4653-97b0-a225ffed23ff.jpg', 'Round neck, sleeveless cotton jersey'],
    [U, 'Scoop Neck Sleeveless Cotton Vests (Pack of 2)', 'https://cdn.shopify.com/s/files/1/0617/2137/8986/files/1_013221a8-b2e7-46c4-a6d7-6fdbe1099f86.jpg', 'Scoop neck, sleeveless, low-cut armhole, pack of 2'],
    [V, 'Swift Dry Vest - Odour Shield', 'https://imagescdn.vanheusenindia.com/img/app/product/8/873183-10411044.jpg', 'Swift-dry with odour shield and anti-stat finish'],
    [V, 'Graphic Print Sleeveless Vest', 'https://imagescdn.vanheusenindia.com/img/app/product/4/40006936-20559487.jpg', 'Sleeveless loose-fit vest with graphic print'],
  ],
  'men-thermals': [
    [J, 'Soft Touch Fleece Thermal Long John - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/2623_BLACK_0103_S123_JKY_1.webp?v=1725619830', 'Ultra Warmth Soft Touch Microfiber Fleece, StayWarm'],
    [J, 'Soft Touch Fleece Full Sleeve Thermal Undershirt - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/2606_BLACK_0103_S123_JKY_1.webp?v=1725619830', 'Ultra Warmth Soft Touch Microfiber Fleece, StayWarm'],
    [J, 'Cotton Rich Full Sleeve Thermal Set - Charcoal Melange', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/2404_CHAML_0105_S123_JKY_1.webp?v=1759985485', 'Extra Warmth Super Combed Cotton Rich, StayWarm'],
    [J, 'Soft Touch Full Sleeve Thermal Undershirt - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/2604_BLACK_0105_S123_JKY_1.webp?v=1700007626', 'Warmth Soft Touch Microfiber Elastane Stretch, StayWarm'],
    [V, 'Anti-Bacterial Low Neck Thermal Top - Ivory', 'https://imagescdn.vanheusenindia.com/img/app/product/3/39708558-14583532.jpg', 'Anti-bacterial low-neck thermal top'],
    [V, 'Anti-Bacterial Thermal Top - Charcoal Melange', 'https://imagescdn.vanheusenindia.com/img/app/product/3/39708575-14585452.jpg', 'Anti-bacterial low-neck thermal top'],
    [U, 'Slim Fit Heathered Thermal T-Shirt', 'https://cdn.shopify.com/s/files/1/0617/2137/8986/files/1_224b2cd7-45a5-4d1e-bd9a-bab535dd9e7b.jpg', 'Scoop neck, long sleeves, slim-fit thermal tee'],
  ],
  'men-accessories': [
    [J, 'Microfiber Cotton Crew Length Thermal Socks - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/7150_BLACK_0110_S126_Jky_0.webp?v=1764578239', 'Microfiber and Compact Cotton Stretch, StayWarm socks'],
    [J, 'Modal Cotton Crew Length Socks - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/7390_BLACK_0110_S223_JKY_0_3bd2fb68-2d45-45ed-b5e8-4f7a5d0b9fed.webp?v=1700038300', 'Modal Cotton Elastane Stretch with StayFresh treatment'],
    [J, 'Modal Cotton Ankle Length Socks - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/7396_BLACK_0110_S223_JKY_0_49f00d61-adf4-4b61-9738-008ecbe89f6b.webp?v=1700037916', 'Compact Cotton Stretch with StayFresh treatment'],
    [J, 'Bamboo Fiber Ankle Length Socks - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/7398_BLACK_0110_S225_Jky_0.webp?v=1761541178', 'Environment-friendly bamboo fiber, 4-way stretch'],
    [J, 'Cotton Handkerchiefs - Assorted (Pack of 3)', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/HK03_ASSTD_0310_S123_JKY_3.webp', '100% Super Combed Cotton with StayFresh treatment'],
    [J, 'Cotton Handkerchiefs - White (Pack of 3)', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/HK01_WHITE_0310_S123_JKY_1.webp', '100% Super Combed Cotton with StayFresh treatment'],
    [V, 'Solid Crew Socks (Pack of 3)', 'https://imagescdn.vanheusenindia.com/img/app/product/4/40074545-21808557.jpg', 'Soft cotton-blend crew socks, pack of 3'],
    [V, 'Navy Warmtech Thermal Socks', 'https://imagescdn.vanheusenindia.com/img/app/product/6/668398-21786791.jpg', 'Warmtech ankle-length thermal socks'],
    [U, 'Pure Cotton Brand Logo Handkerchiefs (Pack of 3)', 'https://cdn.shopify.com/s/files/1/0617/2137/8986/files/1_1f83bcfa-5c31-4306-99ec-247c5f157e1a.jpg', 'Pure cotton, brand-logo embroidered, pack of 3'],
  ],

  'women-undergarments': [
    [J, 'Wirefree Cotton Stretch Everyday Bra - Skin', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/1722_WSKIN_0105_S123_JKY_1.webp?v=1700031758', 'Super Combed Cotton Elastane Stretch, medium coverage'],
    [J, 'Wirefree Cotton Full Coverage Everyday Bra - Mocha', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/1250_MOCHA_0105_S123_JKY_1_725824da-00c5-4b0c-9369-dc636950e7a5.webp?v=1700022545', 'Super Combed Cotton Elastane Stretch, full coverage'],
    [J, 'Wirefree Padded T-Shirt Bra - Light Skin', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/1723_WSKIN_0105_S123_JKY_1.webp?v=1768375145', 'Super Combed Cotton Elastane Stretch, medium coverage'],
    [J, 'Wirefree Cotton Full Coverage Everyday Bra - Mocha', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/FE41_MOCHA_0105_S123_JKY_1_83fc2bd9-f46f-4f36-95bd-89ae63550b05.webp?v=1700022627', 'Super Combed Cotton Elastane Stretch, full coverage'],
    [E, 'Enamor Side Support Shaper Everyday Bra - A042 (Skin)', 'https://cdn.shopify.com/s/files/1/0719/4843/5734/files/1_0dffb7ea-c025-4a60-abf7-90e2d812a496.jpg', 'Non-padded, wirefree, smooth shaper, high coverage'],
    [E, 'Enamor Super Lift Cotton Minimizer Bra - A112 (Pale Skin)', 'https://cdn.shopify.com/s/files/1/0719/4843/5734/files/1_d6a847db-8297-4ba6-8247-eae9cab046d8.jpg', 'Non-padded, wirefree, full coverage, hidden X-frame'],
    [J, 'Bonded Tech Wirefree Padded Lounge Bra - Pomegranate', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/1839_POMGR_0105_S123_JKY_1.webp', 'Soft-touch microfiber bonded tech, 360° stretch, full coverage'],
    [V, 'Van Heusen Cotton Minimizer Bra - Non Padded Wireless', 'https://imagescdn.vanheusenindia.com/img/app/product/4/492002-31306003.jpg', 'High-stretch cotton, wireless, double-lined cups'],
    [V, 'Van Heusen Anti-Bacterial Shaper Bra - Skin', 'https://imagescdn.vanheusenindia.com/img/app/product/7/794764-16705369.jpg', 'Anti-bacterial, non-padded shaper, full coverage'],
  ],
  'women-lingerie': [
    [E, 'Enamor Full Support Non-Padded Wirefree Bra - F097', 'https://cdn.shopify.com/s/files/1/0719/4843/5734/files/1_e093fea4-f890-4463-b1d8-0da9d65b7dd4.jpg', 'M-Frame contour superlift with jiggle control, full support'],
    [E, 'Enamor CloudSoft Invisi Neckline Everyday T-Shirt Bra - A032', 'https://cdn.shopify.com/s/files/1/0719/4843/5734/files/1_6abeb340-96aa-4ca1-8a4c-d4add7fb103a.jpg', 'Cotton everyday padded wirefree bra, medium coverage'],
    [E, 'Enamor Fabcool Breathable Cup T-Shirt Bra - A165 (Pale Skin)', 'https://cdn.shopify.com/s/files/1/0719/4843/5734/files/1_59fbeb2a-53e0-4b96-882d-2793c9d96359.jpg', 'Breathable cooling cotton, padded wirefree, high coverage'],
    [E, 'Enamor Fabcool Breathable Cup T-Shirt Bra - A165 (Black)', 'https://cdn.shopify.com/s/files/1/0719/4843/5734/files/1_d83247f8-089c-4aa2-a82a-8a520eac60c0.jpg', 'Breathable cooling cotton, padded wirefree, high coverage'],
    [V, 'Van Heusen Anti-Bacterial Padded Breathable Bra', 'https://imagescdn.vanheusenindia.com/img/app/product/3/364473-1840448.jpg', 'Anti-bacterial padded bra, no-slip strap, flexi wires'],
    [V, 'Van Heusen Wired Lace-Tipped Anti-Bacterial Bra', 'https://imagescdn.vanheusenindia.com/img/app/product/3/364195-1838256.jpg', 'Anti-bacterial wired bra with lace tipping'],
  ],
  'women-tshirts-full': [
    [J, 'Micro Modal Round Neck Full Sleeve T-Shirt - Pageant Blue', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/RX21_PGTBU_0103_S224_JKY_1.webp?v=1721199690', 'Micro Modal Cotton, relaxed fit, curved hem'],
    [J, 'Cotton Rich Round Neck Full Sleeve T-Shirt - Puce', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/A140_PUCE_0103_S225_JKY_1_9ab41f0b-d6a9-4dc6-934a-a03c78f61670.webp?v=1762849929', 'Super Combed Cotton Rich, relaxed fit, round neck'],
    [J, 'Cotton Rich Oversized Printed Full Sleeve T-Shirt - Abyss', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/WZ17_ABYSS_0101_S225_Jky_1.webp?v=1764565164', 'Super Combed Cotton Rich, oversized fit, printed'],
    [V, 'Van Heusen Women Beige Long Sleeve Shirt', 'https://imagescdn.vanheusenindia.com/img/app/product/4/40225563-25108100.jpg', 'Solid long-sleeve shirt, smart casual'],
    [V, 'Van Heusen Women Red Stripe Long Sleeve Shirt', 'https://imagescdn.vanheusenindia.com/img/app/product/4/40236304-25262589.jpg', 'Striped long-sleeve casual shirt'],
  ],
  'women-tshirts-half': [
    [J, 'Micro Modal V Neck Half Sleeve T-Shirt - Purple Wine', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/RX12_PURWI_0105_S123_JKY_1.webp?v=1701683524', 'Micro Modal Cotton, relaxed fit, V neck'],
    [J, 'Cotton Rich V-Neck Half Sleeve T-Shirt - Red Plum', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/AW89_RDPLM_0105_S123_JKY_1.webp?v=1700029531', 'Super Combed Cotton Rich, relaxed fit, V neck'],
    [V, 'Women Navy Solid Casual Round Neck T-Shirt', 'https://imagescdn.vanheusenindia.com/img/app/product/4/40002638-20460692.jpg', 'Casual round neck tee, solid navy'],
    [V, 'Women Beige Graphic Print Casual Round Neck T-Shirt', 'https://imagescdn.vanheusenindia.com/img/app/product/4/40002635-20460617.jpg', 'Casual round neck tee, beige graphic print'],
  ],
  'women-shorts': [
    [J, 'Cotton Rich Regular Fit Shorts with Side Pockets - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/AW23_BLACK_0103_S123_JKY_1.webp?v=1700006654', 'Super Combed Cotton Rich, regular fit, side pockets'],
    [J, 'Micro Modal Relaxed Fit Printed Shorts - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/RX10_BLACK_0103_S123_JKY_1_4380afdf-0d46-48d7-a3f6-fe55bde5b44b.webp?v=1700004680', 'Micro Modal Cotton, relaxed fit, printed'],
    [J, 'Yarn Dyed Woven Striped Shorts - Iris Blue', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/RX15_IRSBU_0103_S123_JKY_1_3f7f527e-223f-4eee-8dc1-75218d0e1a07.webp?v=1700019614', 'Super Combed Cotton, relaxed fit, side pockets'],
    [J, 'Cotton Relaxed Fit Sleep Shorts - Confetti', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/RX72_CNFTI_0103_S123_JKY_1_ea13ce65-523d-42ed-b8ca-7d55e751e8e7.webp?v=1700013096', 'Super Combed Cotton, relaxed fit, side pockets'],
    [E, 'Enamor Knee Length City Shorts - E044 (Navy)', 'https://cdn.shopify.com/s/files/1/0719/4843/5734/files/1_45185eae-90e7-481c-b69a-72758524c63b.jpg', 'Mid-rise, slim fit, soft breathable cotton'],
    [E, 'Enamor Hangout Shorts - E7A1 (Vintage Bloom)', 'https://cdn.shopify.com/s/files/1/0719/4843/5734/files/2_5b80d228-c981-4e3e-b004-2876ac3429ff.jpg', 'Mid-rise, relaxed fit, soft light cotton'],
    [V, 'Van Heusen Women Beige Stripe Shorts', 'https://imagescdn.vanheusenindia.com/img/app/product/4/40574470-31433397.jpg', 'Striped casual shorts, comfortable everyday fit'],
    [V, 'Van Heusen Women Black Textured Shorts', 'https://imagescdn.vanheusenindia.com/img/app/product/3/39943932-19046384.jpg', 'Textured casual shorts, relaxed fit'],
  ],
  'women-night-pajamas': [
    [J, 'Cotton Woven Striped Pyjama with Side Pockets - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/RX06_BLACK_0103_S223_JKY_1.webp?v=1700004873', '100% Super Combed Cotton Woven, relaxed fit'],
    [J, 'Micro Modal Printed Pyjama - Purple Wine', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/RX09_PURWI_0103_S223_JKY_1.webp?v=1700028785', 'Micro Modal Cotton, relaxed fit, printed'],
    [J, 'Cotton Printed Pyjama with Side Pockets - Orchid Pink', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/RX47_ORPNK_0103_S223_JKY_1_8a84b600-2fe8-4a17-8e1b-c57621566767.webp?v=1700026717', '100% Super Combed Cotton, relaxed fit, side pockets'],
    [J, 'Cotton Printed Pyjama with Side Pockets - Pageant Blue', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/RX88_PGTBU_0103_S224_JKY_1.webp?v=1721908860', '100% Super Combed Cotton, all-over print, relaxed fit'],
    [V, 'Van Heusen Smocked Waist Essential Pyjamas', 'https://imagescdn.vanheusenindia.com/img/app/product/6/655321-6634614.jpg', 'Soft essential pyjamas with smocked waist'],
    [V, 'Van Heusen Printed Cotton Pyjamas with Pockets', 'https://imagescdn.vanheusenindia.com/img/app/product/6/617319-5909311.jpg', 'Printed cotton pyjamas with side pockets'],
  ],
  'women-tracks': [
    [J, 'Cotton Stretch Relaxed Fit Trackpants - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/1302_BLACK_0105_S223_JKY_1_4c38256a-45a1-4169-9bc2-f4dcfe48f9c4.webp?v=1700007718', 'Super Combed Cotton Elastane Stretch, relaxed fit'],
    [J, 'Cotton Stretch Slim Fit Trackpants - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/1301_BLACK_0105_S223_JKY_1.webp?v=1700007705', 'Super Combed Cotton Elastane Stretch, slim fit'],
    [J, 'Microfiber Straight Fit Trackpants with Zipper Pockets - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/MW54_BLACK_0103_S223_JKY_1_18ee0ab5-03b7-4b95-9f14-18574897f3f0.webp?v=1700007816', 'Microfiber, straight fit, side zipper pockets'],
    [J, 'Cotton French Terry Straight Fit Trackpants - Wine Tasting', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/AW60_WINTG_0103_S223_JKY_1_022ded91-fa72-4c42-bcec-5edfea9ec0b2.webp?v=1700036277', 'Super Combed Cotton Elastane French Terry, side pockets'],
    [V, 'Van Heusen Women Brown Solid Casual Trousers', 'https://imagescdn.vanheusenindia.com/img/app/product/4/40198456-25285915.jpg', 'Solid casual trousers, relaxed everyday fit'],
    [V, 'Van Heusen Women Light Blue Stripe Trousers', 'https://imagescdn.vanheusenindia.com/img/app/product/4/40574472-31433408.jpg', 'Striped casual trousers, comfortable fit'],
  ],
  'women-yoga-wear': [
    [J, 'Cotton Rich Thermal Leggings - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/2520_BLACK_0105_S123_JKY_1.webp?v=1700007558', 'Super Combed Cotton Rich, StayWarm leggings'],
    [J, 'Cotton Stretch Leggings with Ultrasoft Waistband - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/AW87_BLACK_0105_S123_JKY_1.webp?v=1700004750', 'Super Combed Cotton Elastane Stretch, ultrasoft waistband'],
    [J, 'Microfiber Performance Leggings - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/MW20_BLACK_0103_S223_JKY_1_f53af55b-5fd3-4d9d-847f-ae0184e5cf82.webp?v=1700004778', 'Microfiber Elastane Stretch, elasticated waistband'],
    [E, 'Enamor Drawstring Lounge Pants', 'https://cdn.shopify.com/s/files/1/0719/4843/5734/files/1_54e5593b-5df8-4206-8740-301432d7ba7d.jpg', 'Yoga-inspired mid-rise drawstring lounge pants'],
    [E, 'Enamor Straight-Leg Lounge Pants', 'https://cdn.shopify.com/s/files/1/0719/4843/5734/files/1_41af5dad-7701-407c-8a65-11998ed02d02.jpg', 'Breathable cotton jersey, full-length straight leg'],
  ],
  'women-gym-wear': [
    [J, 'Cotton Rib Racerback Tank Top - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/1467_BLACK_0105_S123_JKY_1.webp?v=1725619865', '100% Super Combed Cotton Rib, slim fit, racerback'],
    [J, 'Cotton Rib Slim Fit Tank Top - White', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/A113_WHITE_0105_S123_JKY_1.webp?v=1729227098', '100% Super Combed Cotton Rib, slim fit'],
    [J, 'Cotton Rich Curved Hem Tank Top - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/AW77_BLACK_0105_S123_JKY_1.webp?v=1729759531', 'Super Combed Cotton Rich, relaxed fit, curved hem'],
    [J, 'Cotton Printed Racerback Tank Top - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/A155_BLACK_0103_S125_JKY_1.webp?v=1747555894', '100% Super Combed Cotton, relaxed fit, racerback'],
    [E, 'Enamor Medium Impact Racerback Sports Bra - SB08 (Pearl)', 'https://cdn.shopify.com/s/files/1/0719/4843/5734/files/1_613e954b-e447-4182-bb0d-ef6b0b77fc1d.jpg', 'Padded removable cups, wirefree, high coverage'],
    [E, 'Enamor High-Impact Bounce Control Sports Bra - SB25 (Pearl)', 'https://cdn.shopify.com/s/files/1/0719/4843/5734/files/1_db65617e-1dbe-43a6-952e-2f498eb6ff19.jpg', 'Padded, wirefree, full coverage, Y-panel hold'],
    [V, 'Van Heusen Racerback Proactive Sports Bra', 'https://imagescdn.vanheusenindia.com/img/app/product/8/810910-9658724.jpg', 'Anti-bacterial, wireless, lightly padded sports bra'],
  ],
  'women-coord-sets': [
    [J, 'Micro Modal Cotton T-Shirt & Pyjama Sleep Set - Peach Blossom', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/RX85_PBLOS_0103_S224_JKY_1.webp', 'Matching short-sleeve tee and pyjama sleep set'],
    [J, 'Micro Modal Cotton T-Shirt & Printed Shorts Set - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/RX80_BLACK_0103_S124_JKY_1.webp', 'Matching short-sleeve tee and printed shorts set'],
    [J, 'Cotton Printed T-Shirt & Pyjama Sleep Set - Coral', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/RX99-CRLPR_0101_S1.26_JKY_1.webp', 'Matching printed tee and pyjama sleep set'],
    [E, 'Enamor Cotton Terry Co-ord Jogger - Greek Blue', 'https://cdn.shopify.com/s/files/1/0719/4843/5734/products/1_2824_6.jpg', '4-way stretch soft cotton French Terry, slim fit'],
  ],
  'women-thermals': [
    [J, 'Soft Touch Fleece Full Sleeve Thermal Top - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/2540_BLACK_0103_S123_JKY_1.webp?v=1700003857', 'Ultra Warmth Soft Touch Microfiber Fleece, StayWarm'],
    [J, 'Soft Touch Fleece Thermal Leggings - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/2541_BLACK_0103_S123_JKY_1.webp?v=1700007571', 'Ultra Warmth Soft Touch Microfiber Fleece, StayWarm'],
    [J, 'Cotton Rich Three Quarter Sleeve Thermal Set - Charcoal Melange', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/2549_CHAML_0105_S123_JKY_1.webp?v=1759986357', 'Super Combed Cotton Rich, StayWarm thermal set'],
    [J, 'Soft Touch Thermal Leggings - Skin', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/2523_SKIN_0105_S123_JKY_1.webp?v=1700031885', 'Warmth Soft Touch Microfiber Elastane Stretch, StayWarm'],
    [E, 'Enamor HeatSkin Thermal Leggings - TH06', 'https://cdn.shopify.com/s/files/1/0719/4843/5734/files/1_a3b85775-1591-45c6-b267-e9ff668f7c3c.jpg', 'HeatSkin soft heat-generating fabric thermal leggings'],
    [E, 'Enamor HeatSkin Thermal Sleeve Top - TH05', 'https://cdn.shopify.com/s/files/1/0719/4843/5734/files/1_be7f0575-7c34-4f46-8a85-b4cfe6a4e864.jpg', 'HeatSkin three-quarter sleeve thermal top'],
  ],
  'women-accessories': [
    [J, 'Modal Blend Scalloped Crew Length Socks - White', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/7416_WHITE_0105_S126_JKY_0.jpg?v=1782482829', 'Modal blend, scalloped welt, StayFresh treatment'],
    [J, 'Cotton Stretch Ankle Length Socks - Skin (Pack of 2)', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/7046_SKIN_0201_S224_JKY_0.webp?v=1722346763', 'Compact cotton stretch, StayFresh treatment, pack of 2'],
    [J, 'Cotton Stretch Toe Socks - Skin (Pack of 2)', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/7487_SKIN_0205_S123_JKY_0.webp?v=1700042799', 'Compact cotton stretch, StayFresh treatment, pack of 2'],
    [J, 'Cotton Blend Low Show Socks - Charcoal & Grey (Pack of 2)', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/7506_CM-MM_0210_S123_JKY_0.webp?v=1700039115', 'Cotton Nylon blend elastane stretch, StayFresh, pack of 2'],
    [J, 'Cotton Striped-Border Handkerchiefs (Pack of 3)', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/HK02_ASSTD_0310_S123_JKY_3.webp', '100% Super Combed Cotton with StayFresh treatment'],
  ],

  'kids-socks': [
    [J, "Kid's Cotton Stretch Knee Length Socks - White", 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/7902_WHITE_0105_S123_JKY_3_ef9af792-9cee-49eb-8308-5f67d1daf4e3.webp?v=1704956071', 'Compact cotton stretch, knee length, StayFresh treatment'],
    [J, "Kid's Cotton Stretch Knee Length Socks - White (Pack of 2)", 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/7902_WHITE_0205_S123_JKY_0_8ba64a23-b97c-475d-9936-f305612c73aa.webp?v=1736419611', 'Compact cotton stretch, knee length, pack of 2'],
    [J, "Kid's Cotton Stretch Calf Length Socks - White", 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/7800_WHITE_0105_S123_JKY_3_ece6f385-1cf1-410e-8673-2623b02fe003.webp?v=1704955131', 'Compact cotton stretch, calf length, StayFresh treatment'],
    [J, "Kid's Cotton Stretch Calf Length Socks - White (Pack of 2)", 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/7800_WHITE_0205_S123_JKY_00_00ed21c6-412c-44bc-9615-c17a98928d22.webp?v=1736416410', 'Compact cotton stretch, calf length, pack of 2'],
    [U, "Boys Mid-Calf Length Socks (Pack of 3)", 'https://cdn.shopify.com/s/files/1/0617/2137/8986/files/1_1f0c2f54-40ca-4aef-baf8-303e10f8f197.jpg', 'Mid-calf length, ribbed top with branding, pack of 3'],
    [U, "Boys High-Ankle Length Socks (Pack of 3)", 'https://cdn.shopify.com/s/files/1/0617/2137/8986/files/1_ac9d965b-ae66-4bff-92ba-d8ee0df0b167.jpg', 'High-ankle length, ribbed top with branding, pack of 3'],
  ],
}

const BRAND_SLUG = { [J]: 'jockey', [U]: 'uspa', [V]: 'vanheusen', [E]: 'enamor' }

function deptOf(catKey) {
  if (catKey.startsWith('men-')) return 'Men'
  if (catKey.startsWith('women-')) return 'Women'
  return 'Kids'
}

// Request a smaller rendition where the CDN supports it (keeps repo light).
function sizedUrl(url) {
  if (!url) return ''
  if (url.includes('cdn.shopify.com')) return url + (url.includes('?') ? '&' : '?') + 'width=600'
  if (url.includes('imagescdn.vanheusenindia.com')) return url + '?wid=600&qlt=80'
  return url
}

async function download(url, destBase) {
  const sized = sizedUrl(url)
  try {
    const res = await fetch(sized, {
      headers: { 'User-Agent': 'Mozilla/5.0', Referer: new URL(url).origin + '/' },
    })
    if (!res.ok) throw new Error('HTTP ' + res.status)
    const ct = res.headers.get('content-type') || ''
    const ext = ct.includes('png') ? 'png' : ct.includes('webp') ? 'webp' : 'jpg'
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.byteLength < 800) throw new Error('too small')
    const file = `${destBase}.${ext}`
    await writeFile(path.join(IMG_DIR, file), buf)
    return { ok: true, file, bytes: buf.byteLength }
  } catch (e) {
    return { ok: false, error: e.message }
  }
}

async function run() {
  await mkdir(IMG_DIR, { recursive: true })
  const products = []
  let downloaded = 0
  let failed = 0
  let placeholders = 0

  for (const [category, items] of Object.entries(RAW)) {
    const department = deptOf(category)
    let i = 0
    for (const [brand, name, img, desc] of items) {
      i++
      const id = `${category}-${BRAND_SLUG[brand]}-${i}`
      let image = ''
      if (img) {
        // skip if already present
        const existing = ['jpg', 'webp', 'png'].find((e) => existsSync(path.join(IMG_DIR, `${id}.${e}`)))
        if (existing) {
          image = `/images/${id}.${existing}`
          downloaded++
        } else {
          const r = await download(img, id)
          if (r.ok) {
            image = `/images/${r.file}`
            downloaded++
            process.stdout.write('.')
          } else {
            failed++
            process.stdout.write('x')
          }
        }
      } else {
        placeholders++
      }
      products.push({ id, department, category, brand, name, description: desc, image })
    }
  }

  await writeFile(OUT, JSON.stringify(products, null, 2) + '\n')
  console.log('\n\nProducts:', products.length)
  console.log('Images downloaded/cached:', downloaded, '| failed:', failed, '| intentional placeholders:', placeholders)
}

run()
