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
  ],
  'men-tshirts-full': [
    [J, 'Super Combed Cotton Round Neck Full Sleeve T-Shirt - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/AM95_BLACK_0103_S223_JKY_1.webp?v=1725619824', 'Super Combed Cotton Rich, Round Neck, Full Sleeve'],
    [J, 'Supima Cotton Round Neck Full Sleeve T-Shirt - Deep Olive', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/IM22_DPOLV_0103_S223_JKY_1.webp?v=1725619832', 'Super Combed Supima Cotton, Round Neck, Full Sleeve'],
    [J, 'Graphic Printed Round Neck Full Sleeve T-Shirt - Deep Olive', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/US82_DPO02_0103_S224_JKY_1_2.webp?v=1744191261', 'Super Combed Cotton Rich, graphic print, full sleeve'],
    [J, 'Oversized Graphic Full Sleeve T-Shirt - Deep Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/MZ13_IPDPBLK_0101_S225_JKY_1.webp?v=1764321636', 'Super Combed Cotton Rich, oversized fit, graphic print'],
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
  ],
  'men-shorts': [
    [J, 'Cotton Rich Regular Fit Shorts with Side Pockets - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/9426_BLACK_0103_S1.25_JKY_1.webp?v=1777025542', 'Super Combed Cotton Rich, regular fit, side pockets'],
    [J, 'Micro Modal Checkered Sleep Shorts - Mid Blue', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/IM02_MDBU1_0103_S223_JKY_1.webp?v=1700021649', 'Tencel Micro Modal Cotton Elastane Stretch, side pockets'],
    [J, 'Lightweight Microfiber Shorts with Zipper Pockets - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/MV23_BLACK_0103_S123_JKY_1.webp?v=1700006725', 'Lightweight breathable microfiber, zipper pockets'],
    [J, 'Cotton Rich Straight Fit Shorts with Zipper Pockets - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/AM14_BLACK_0103_S123_JKY_1.webp?v=1700007218', 'Super Combed Cotton Rich, straight fit, zipper pockets'],
  ],
  'men-night-pajamas': [
    [J, 'Micro Modal Cotton Stretch Pyjama - Mid Blue', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/IM03_MDBU1_0103_S223_JKY_1.webp?v=1700021637', 'Tencel Micro Modal Cotton Elastane Stretch, side pockets'],
    [J, 'Micro Modal Cotton Stretch Pyjama - Mid Grey', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/IM03_MDGY1_0103_S223_JKY_1.webp?v=1700021720', 'Tencel Micro Modal Cotton Elastane Stretch, side pockets'],
    [J, 'Micro Modal Cotton Stretch Pyjama - Light Blue', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/IM03_LTBU1_0103_S223_JKY_1.webp?v=1700020166', 'Tencel Micro Modal Cotton Elastane Stretch, side pockets'],
    [J, 'Super Combed Cotton Pyjama - Black Chambray', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/RM09_BLCHY_0103_S225_JKY_1.webp?v=1770831866', '100% Super Combed Cotton, relaxed fit, side pockets'],
  ],
  'men-joggers': [
    [J, 'Cotton Rich Pique Slim Fit Jogger with Zipper Pockets - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/AM05_BLACK_0103_S223_JKY_1.webp?v=1701684644', 'Super Combed Cotton Rich Pique, slim fit, zipper pockets'],
    [J, 'Cotton Rich Slim Fit Jogger with Zipper Pockets - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/AM02_BLACK_0103_S223_JKY_1.webp?v=1701684844', 'Super Combed Cotton Rich, slim fit, zipper pockets'],
    [J, 'Cotton Rich Jogger with StayFresh Treatment - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/SP31_BLACK_0103_S223_JKY_1.webp?v=1725619859', 'Super Combed Cotton Rich with StayFresh treatment'],
    [J, 'Cotton Rich Slim Fit Jogger with Side Pockets - Cream Melange', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/US90_CRMML_0103_S223_JKY_1.webp?v=1700013742', 'Super Combed Cotton Rich, slim fit, side pockets'],
  ],
  'men-gym-wear': [
    [J, 'Cotton Rib Round Neck Muscle Vest - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/9930_BLACK_0105_S223_JKY_1.webp?v=1700004164', '100% Super Combed Cotton Rib, sleeveless round neck'],
    [J, 'Cotton Rib Round Neck Muscle Vest - Black & Charcoal (Pack of 2)', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/9930_BLACK-CHAML.webp?v=1727929662', '100% Super Combed Cotton Rib, pack of 2'],
    [J, 'Cotton Rib Square Neck Gym Vest - Charcoal Melange', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/US26_CHAML_0105_S123_JKY_1.webp?v=1700011754', '100% Super Combed Cotton Rib, square neck, sleeveless'],
    [J, 'Cotton Rib Square Neck Gym Vest with Graphic Print - White', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/US54_WHITE_0105_S125_JKY_1_webp.webp?v=1771322975', '100% Super Combed Cotton Rib, graphic print'],
  ],
  'men-thermals': [
    [J, 'Soft Touch Fleece Thermal Long John - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/2623_BLACK_0103_S123_JKY_1.webp?v=1725619830', 'Ultra Warmth Soft Touch Microfiber Fleece, StayWarm'],
    [J, 'Soft Touch Fleece Full Sleeve Thermal Undershirt - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/2606_BLACK_0103_S123_JKY_1.webp?v=1725619830', 'Ultra Warmth Soft Touch Microfiber Fleece, StayWarm'],
    [J, 'Cotton Rich Full Sleeve Thermal Set - Charcoal Melange', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/2404_CHAML_0105_S123_JKY_1.webp?v=1759985485', 'Extra Warmth Super Combed Cotton Rich, StayWarm'],
    [J, 'Soft Touch Full Sleeve Thermal Undershirt - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/2604_BLACK_0105_S123_JKY_1.webp?v=1700007626', 'Warmth Soft Touch Microfiber Elastane Stretch, StayWarm'],
  ],
  'men-accessories': [
    [J, 'Microfiber Cotton Crew Length Thermal Socks - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/7150_BLACK_0110_S126_Jky_0.webp?v=1764578239', 'Microfiber and Compact Cotton Stretch, StayWarm socks'],
    [J, 'Modal Cotton Crew Length Socks - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/7390_BLACK_0110_S223_JKY_0_3bd2fb68-2d45-45ed-b5e8-4f7a5d0b9fed.webp?v=1700038300', 'Modal Cotton Elastane Stretch with StayFresh treatment'],
    [J, 'Modal Cotton Ankle Length Socks - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/7396_BLACK_0110_S223_JKY_0_49f00d61-adf4-4b61-9738-008ecbe89f6b.webp?v=1700037916', 'Compact Cotton Stretch with StayFresh treatment'],
    [J, 'Bamboo Fiber Ankle Length Socks - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/7398_BLACK_0110_S225_Jky_0.webp?v=1761541178', 'Environment-friendly bamboo fiber, 4-way stretch'],
  ],

  'women-undergarments': [
    [J, 'Wirefree Cotton Stretch Everyday Bra - Skin', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/1722_WSKIN_0105_S123_JKY_1.webp?v=1700031758', 'Super Combed Cotton Elastane Stretch, medium coverage'],
    [J, 'Wirefree Cotton Full Coverage Everyday Bra - Mocha', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/1250_MOCHA_0105_S123_JKY_1_725824da-00c5-4b0c-9369-dc636950e7a5.webp?v=1700022545', 'Super Combed Cotton Elastane Stretch, full coverage'],
    [J, 'Wirefree Padded T-Shirt Bra - Light Skin', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/1723_WSKIN_0105_S123_JKY_1.webp?v=1768375145', 'Super Combed Cotton Elastane Stretch, medium coverage'],
    [J, 'Wirefree Cotton Full Coverage Everyday Bra - Mocha', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/FE41_MOCHA_0105_S123_JKY_1_83fc2bd9-f46f-4f36-95bd-89ae63550b05.webp?v=1700022627', 'Super Combed Cotton Elastane Stretch, full coverage'],
  ],
  'women-lingerie': [
    [E, 'Enamor Full Support Non-Padded Wirefree Bra - F097', 'https://cdn.shopify.com/s/files/1/0719/4843/5734/files/1_e093fea4-f890-4463-b1d8-0da9d65b7dd4.jpg', 'M-Frame contour superlift with jiggle control, full support'],
    [E, 'Enamor CloudSoft Invisi Neckline Everyday T-Shirt Bra - A032', 'https://cdn.shopify.com/s/files/1/0719/4843/5734/files/1_6abeb340-96aa-4ca1-8a4c-d4add7fb103a.jpg', 'Cotton everyday padded wirefree bra, medium coverage'],
    [E, 'Enamor Fabcool Breathable Cup T-Shirt Bra - A165 (Pale Skin)', 'https://cdn.shopify.com/s/files/1/0719/4843/5734/files/1_59fbeb2a-53e0-4b96-882d-2793c9d96359.jpg', 'Breathable cooling cotton, padded wirefree, high coverage'],
    [E, 'Enamor Fabcool Breathable Cup T-Shirt Bra - A165 (Black)', 'https://cdn.shopify.com/s/files/1/0719/4843/5734/files/1_d83247f8-089c-4aa2-a82a-8a520eac60c0.jpg', 'Breathable cooling cotton, padded wirefree, high coverage'],
  ],
  'women-tshirts-full': [
    [J, 'Micro Modal Round Neck Full Sleeve T-Shirt - Pageant Blue', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/RX21_PGTBU_0103_S224_JKY_1.webp?v=1721199690', 'Micro Modal Cotton, relaxed fit, curved hem'],
    [J, 'Cotton Rich Round Neck Full Sleeve T-Shirt - Puce', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/A140_PUCE_0103_S225_JKY_1_9ab41f0b-d6a9-4dc6-934a-a03c78f61670.webp?v=1762849929', 'Super Combed Cotton Rich, relaxed fit, round neck'],
    [J, 'Cotton Rich Oversized Printed Full Sleeve T-Shirt - Abyss', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/WZ17_ABYSS_0101_S225_Jky_1.webp?v=1764565164', 'Super Combed Cotton Rich, oversized fit, printed'],
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
  ],
  'women-night-pajamas': [
    [J, 'Cotton Woven Striped Pyjama with Side Pockets - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/RX06_BLACK_0103_S223_JKY_1.webp?v=1700004873', '100% Super Combed Cotton Woven, relaxed fit'],
    [J, 'Micro Modal Printed Pyjama - Purple Wine', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/RX09_PURWI_0103_S223_JKY_1.webp?v=1700028785', 'Micro Modal Cotton, relaxed fit, printed'],
    [J, 'Cotton Printed Pyjama with Side Pockets - Orchid Pink', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/RX47_ORPNK_0103_S223_JKY_1_8a84b600-2fe8-4a17-8e1b-c57621566767.webp?v=1700026717', '100% Super Combed Cotton, relaxed fit, side pockets'],
    [J, 'Cotton Printed Pyjama with Side Pockets - Pageant Blue', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/RX88_PGTBU_0103_S224_JKY_1.webp?v=1721908860', '100% Super Combed Cotton, all-over print, relaxed fit'],
  ],
  'women-tracks': [
    [J, 'Cotton Stretch Relaxed Fit Trackpants - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/1302_BLACK_0105_S223_JKY_1_4c38256a-45a1-4169-9bc2-f4dcfe48f9c4.webp?v=1700007718', 'Super Combed Cotton Elastane Stretch, relaxed fit'],
    [J, 'Cotton Stretch Slim Fit Trackpants - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/1301_BLACK_0105_S223_JKY_1.webp?v=1700007705', 'Super Combed Cotton Elastane Stretch, slim fit'],
    [J, 'Microfiber Straight Fit Trackpants with Zipper Pockets - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/MW54_BLACK_0103_S223_JKY_1_18ee0ab5-03b7-4b95-9f14-18574897f3f0.webp?v=1700007816', 'Microfiber, straight fit, side zipper pockets'],
    [J, 'Cotton French Terry Straight Fit Trackpants - Wine Tasting', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/AW60_WINTG_0103_S223_JKY_1_022ded91-fa72-4c42-bcec-5edfea9ec0b2.webp?v=1700036277', 'Super Combed Cotton Elastane French Terry, side pockets'],
  ],
  'women-yoga-wear': [
    [J, 'Cotton Rich Thermal Leggings - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/2520_BLACK_0105_S123_JKY_1.webp?v=1700007558', 'Super Combed Cotton Rich, StayWarm leggings'],
    [J, 'Cotton Stretch Leggings with Ultrasoft Waistband - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/AW87_BLACK_0105_S123_JKY_1.webp?v=1700004750', 'Super Combed Cotton Elastane Stretch, ultrasoft waistband'],
    [J, 'Microfiber Performance Leggings - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/MW20_BLACK_0103_S223_JKY_1_f53af55b-5fd3-4d9d-847f-ae0184e5cf82.webp?v=1700004778', 'Microfiber Elastane Stretch, elasticated waistband'],
  ],
  'women-gym-wear': [
    [J, 'Cotton Rib Racerback Tank Top - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/1467_BLACK_0105_S123_JKY_1.webp?v=1725619865', '100% Super Combed Cotton Rib, slim fit, racerback'],
    [J, 'Cotton Rib Slim Fit Tank Top - White', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/A113_WHITE_0105_S123_JKY_1.webp?v=1729227098', '100% Super Combed Cotton Rib, slim fit'],
    [J, 'Cotton Rich Curved Hem Tank Top - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/AW77_BLACK_0105_S123_JKY_1.webp?v=1729759531', 'Super Combed Cotton Rich, relaxed fit, curved hem'],
    [J, 'Cotton Printed Racerback Tank Top - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/A155_BLACK_0103_S125_JKY_1.webp?v=1747555894', '100% Super Combed Cotton, relaxed fit, racerback'],
  ],
  'women-coord-sets': [
    [E, 'Enamor Drawstring Travel Pants - Jet Black', 'https://cdn.shopify.com/s/files/1/0719/4843/5734/files/1_74d43ee9-3cc0-47d9-88b2-89ed95793b64.jpg', 'Quick dry & 4-way stretch, relaxed fit, antimicrobial'],
    [E, 'Enamor Drawstring Travel Pants - Navy', 'https://cdn.shopify.com/s/files/1/0719/4843/5734/files/1_303ae191-3131-4da5-bb6e-bcb8aa320e92.jpg', 'Quick dry & 4-way stretch, relaxed fit, antimicrobial'],
    [E, 'Enamor Scoop Neck Basic Active T-Shirt', 'https://cdn.shopify.com/s/files/1/0719/4843/5734/products/1_1539_1.jpg', 'Quick dry & 4-way stretch, relaxed fit, antimicrobial'],
    [E, 'Enamor Cotton Terry Jogger - Greek Blue', 'https://cdn.shopify.com/s/files/1/0719/4843/5734/products/1_2824_6.jpg', '4-way stretch soft cotton French Terry, slim fit'],
  ],
  'women-thermals': [
    [J, 'Soft Touch Fleece Full Sleeve Thermal Top - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/2540_BLACK_0103_S123_JKY_1.webp?v=1700003857', 'Ultra Warmth Soft Touch Microfiber Fleece, StayWarm'],
    [J, 'Soft Touch Fleece Thermal Leggings - Black', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/2541_BLACK_0103_S123_JKY_1.webp?v=1700007571', 'Ultra Warmth Soft Touch Microfiber Fleece, StayWarm'],
    [J, 'Cotton Rich Three Quarter Sleeve Thermal Set - Charcoal Melange', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/2549_CHAML_0105_S123_JKY_1.webp?v=1759986357', 'Super Combed Cotton Rich, StayWarm thermal set'],
    [J, 'Soft Touch Thermal Leggings - Skin', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/2523_SKIN_0105_S123_JKY_1.webp?v=1700031885', 'Warmth Soft Touch Microfiber Elastane Stretch, StayWarm'],
  ],
  'women-accessories': [
    [J, 'Modal Blend Scalloped Crew Length Socks - White', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/7416_WHITE_0105_S126_JKY_0.jpg?v=1782482829', 'Modal blend, scalloped welt, StayFresh treatment'],
    [J, 'Cotton Stretch Ankle Length Socks - Skin (Pack of 2)', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/7046_SKIN_0201_S224_JKY_0.webp?v=1722346763', 'Compact cotton stretch, StayFresh treatment, pack of 2'],
    [J, 'Cotton Stretch Toe Socks - Skin (Pack of 2)', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/7487_SKIN_0205_S123_JKY_0.webp?v=1700042799', 'Compact cotton stretch, StayFresh treatment, pack of 2'],
    [J, 'Cotton Blend Low Show Socks - Charcoal & Grey (Pack of 2)', 'https://cdn.shopify.com/s/files/1/0753/1056/3627/products/7506_CM-MM_0210_S123_JKY_0.webp?v=1700039115', 'Cotton Nylon blend elastane stretch, StayFresh, pack of 2'],
  ],

  'kids-socks': [
    [J, "Kid's Cotton Stretch Knee Length Socks - White", 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/7902_WHITE_0105_S123_JKY_3_ef9af792-9cee-49eb-8308-5f67d1daf4e3.webp?v=1704956071', 'Compact cotton stretch, knee length, StayFresh treatment'],
    [J, "Kid's Cotton Stretch Knee Length Socks - White (Pack of 2)", 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/7902_WHITE_0205_S123_JKY_0_8ba64a23-b97c-475d-9936-f305612c73aa.webp?v=1736419611', 'Compact cotton stretch, knee length, pack of 2'],
    [J, "Kid's Cotton Stretch Calf Length Socks - White", 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/7800_WHITE_0105_S123_JKY_3_ece6f385-1cf1-410e-8673-2623b02fe003.webp?v=1704955131', 'Compact cotton stretch, calf length, StayFresh treatment'],
    [J, "Kid's Cotton Stretch Calf Length Socks - White (Pack of 2)", 'https://cdn.shopify.com/s/files/1/0753/1056/3627/files/7800_WHITE_0205_S123_JKY_00_00ed21c6-412c-44bc-9615-c17a98928d22.webp?v=1736416410', 'Compact cotton stretch, calf length, pack of 2'],
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
