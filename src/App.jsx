import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import LegalPage from './components/LegalPage';
import ProductDetail from './components/ProductDetail';
import { supabase } from './supabaseClient';
import './App.css';

const imageModules = import.meta.glob('./assets/images/*', {
  eager: true,
  query: '?url',
  import: 'default',
});

const titleFromPath = (path) => path
  .split('/')
  .pop()
  .replace(/\.[^/.]+$/, '')
  .replace(/[-_]+/g, ' ')
  .replace(/\b\w/g, (letter) => letter.toUpperCase());

const productNameOverrides = {
  'arcade machine.jpg': 'Mini Arcade Game Station',
  'charger brick.jpg': 'Fast Charge Power Brick',
  'cleaning tool.jpg': 'Precision Cleaning Pen',
  'concealer.webp': 'Full-Coverage Concealer',
  'cooler.jpg': 'Portable Cooling Fan',
  'cube camera thingy.jpg': 'Pocket Cube Camera',
  'cup warmer.jpg': 'USB Mug Warmer',
  'digital camera.jpg': 'Compact Digital Camera',
  'fan.jpg': 'Desktop Turbo Fan',
  'globe.jpg': 'Ambient World Globe',
  'good phone.jpg': 'Everyday Smart Phone',
  'grinder for food.jpg': 'Mini Kitchen Grinder',
  'headset.jpg': 'Wireless Gaming Headset',
  'humidifier lava.jpg': 'Lava Mist Humidifier',
  'infinite ball.jpg': 'Infinity Fidget Ball',
  'insane makeup kit.jpg': 'Complete Makeup Collection',
  'ipad arm.jpg': 'Adjustable Tablet Stand',
  'ipod copy.jpg': 'Pocket Music Player',
  'karaoke sett.jpg': 'Portable Karaoke Set',
  'keyboard.jpg': 'RGB Mechanical Keyboard',
  'lamp.jpg': 'Modern Table Lamp',
  'lampe solceller.jpg': 'Solar Garden Lantern',
  'led strip.jpg': 'Color LED Light Strip',
  'magnet game.jpg': 'Magnetic Strategy Game',
  'makeup brown thing.webp': 'Warm-Tone Makeup Palette',
  'makeup brush.webp': 'Soft Touch Makeup Brush Set',
  'mascara.webp': 'Lengthening Black Mascara',
  'massage.jpg': 'Rechargeable Massage Gun',
  'multi use tool.jpg': 'Compact Multi-Tool',
  'night lamp.jpg': 'Motion Sensor Night Light',
  'northern lights.jpg': 'Northern Lights Projector',
  'oculus quest 3.jpg': 'VR Headset Travel Kit',
  'phone case ip17.jpg': 'Protective Phone Case',
  'polaroid camera.jpg': 'Instant Print Camera',
  'potato peeler.jpg': 'Stainless Steel Vegetable Peeler',
  'primer.webp': 'Smooth Finish Face Primer',
  'projector.jpg': 'Pocket Movie Projector',
  'purse.jpg': 'Compact Everyday Handbag',
  'robot vacuum.jpg': 'Smart Floor Robot',
  'roulette.jpg': 'Deluxe Roulette Game',
  'sci fi.jpg': 'Futuristic Desk Light',
  'shaver.jpg': 'Rechargeable Grooming Shaver',
  'smart finder.jpg': 'Bluetooth Item Finder',
  'smart tag.jpg': 'Smart Key Finder Tag',
  'solar gadgets.jpg': 'Solar Powered Gadget Kit',
  'spinning glove led thingy.jpg': 'LED Spinning Party Glove',
  'steering wheel.jpg': 'Racing Wheel Controller',
  'sunglasses.jpg': 'UV Protection Sunglasses',
  'tamagotchi.jpg': 'Virtual Pet Keychain',
  'tech decks.jpg': 'Mini Finger Skateboard Set',
  'time thing and lamp.jpg': 'Clock and Lamp Combo',
  'time thing.jpg': 'Minimal Digital Clock',
  'travel case.jpg': 'Hard Shell Travel Organizer',
  'usb hub.jpg': 'Multi-Port USB Hub',
  'watch.jpg': 'Fitness Tracker Watch',
  'web shooter.jpg': 'Interactive Web Shooter Toy',
  'gamegadget.jpg': 'Handheld Game Console',
  'game device.jpg': 'Portable Game Console',
  'download.webp': 'Compact Tech Accessory',
  'e.l.f.webp': 'e.l.f. Beauty Essential',
  'pal.jpg': 'Portable LED Light',
  'pasma ball.jpg': 'Plasma Ball Lamp',
  'padding thingy.webp': 'Protective Travel Pouch',
  'sci fi.jpg': 'Sci-Fi Desk Decor',
  'time thing and lamp.jpg': 'Digital Clock Lamp',
  'time thing.jpg': 'Digital Desk Clock',
  'vippetang.webp': 'Kitchen Serving Tongs',
};

const categoryRules = [
  ['Beauty', /concealer|e\.l\.f|makeup|mascara|primer|brush|shaver|massage/],
  ['Gaming', /arcade|game|gadget|oculus|pasma|roulette|tamagotchi|tech decks|steering wheel|web shooter/],
  ['Home', /lamp|cooler|fan|humidifier|warmer|vacuum|globe|projector|solar|cleaning/],
  ['Tech', /camera|charger|earbuds|headset|keyboard|phone|ipad|ipod|pc|usb|smart|watch|digital|led|hub/],
  ['Lifestyle', /purse|sunglasses|travel|pens|infinite|magnet|spinning|padding|multi use|grinder|peeler|tongs/],
];

const categoryOverrides = {
  'pal.jpg': 'Tech',
  'download.webp': 'Tech',
  'massage.jpg': 'Lifestyle',
  'sci fi.jpg': 'Home',
  'time thing.jpg': 'Home',
  'time thing and lamp.jpg': 'Home',
};

const categoryFromFilename = (filename) =>
  categoryOverrides[filename] ?? categoryRules.find(([, pattern]) => pattern.test(filename.toLowerCase()))?.[0] ?? 'Trending';

const baseProducts = Object.entries(imageModules).map(([path, image], index) => {
  const filename = path.split('/').pop();
  const name = productNameOverrides[filename] ?? titleFromPath(path);
  const originalUsdValue = 9.99 + (index % 14) * 3.5;
  const usdValue = 3.99 + (index % 10) * 1.25;

  return {
    id: path,
    name,
    description: `A useful ${name.toLowerCase()} chosen for everyday tech and lifestyle upgrades.`,
    originalUsd: `$${originalUsdValue.toFixed(2)}`,
    usd: `$${usdValue.toFixed(2)}`,
    crypto: `${(usdValue / 3200).toFixed(4)} ETH`,
    image,
    category: categoryFromFilename(filename),
    rating: (4.2 + (index % 8) / 10).toFixed(1),
    sold: 120 + (index * 137) % 980,
  };
});

const realisticTechListings = [
  ['Creator Laptop', 'A slim everyday laptop setup for work, study, and creative projects.', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85', 24.99],
  ['Everyday Smartphone', 'A modern phone-sized essential for messages, photos, and daily browsing.', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=85', 18.49],
  ['Studio Wireless Headphones', 'Over-ear listening comfort for focused work, travel, and music sessions.', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85', 12.99],
  ['DSLR Camera Body', 'A dedicated digital camera body for sharper everyday photos and creative experiments.', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85', 29.99],
  ['Mechanical Keyboard', 'A tactile desktop keyboard for a more focused work and gaming setup.', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85', 10.99],
  ['Minimal Smartwatch', 'A lightweight watch concept for alerts, movement, and everyday routines.', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85', 14.99],
  ['Portable Tablet', 'A bright portable screen for reading, streaming, notes, and casual browsing.', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=85', 19.49],
  ['Compact Bluetooth Speaker', 'A small speaker setup for desks, bedrooms, kitchens, and weekend trips.', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85', 9.99],
  ['Ultrawide Desktop Monitor', 'A wide desktop display for multitasking, creative work, and immersive play.', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=85', 16.49],
  ['Portable Gaming Controller', 'A controller-style essential for relaxed gaming sessions at home or away.', 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?auto=format&fit=crop&w=900&q=85', 13.49],
].map(([name, description, image, usdValue], index) => ({
  id: `real-tech-${index}`,
  name,
  description,
  image,
  category: 'Tech',
  originalUsd: `$${(usdValue + 10).toFixed(2)}`,
  usd: `$${usdValue.toFixed(2)}`,
  crypto: `${(usdValue / 3200).toFixed(4)} ETH`,
  rating: (4.6 + (index % 4) / 10).toFixed(1),
  sold: 180 + (index * 101) % 760,
}));

const marketplaceNames = [
  'Cloud Knit Cardigan', 'Ceramic Matcha Bowl', 'Bamboo Drawer Organizer', 'Rose Gold Hair Clips',
  'Plush Dog Toy', 'Linen Throw Pillow', 'Portable Picnic Blanket', 'Stainless Travel Mug',
  'Velvet Jewelry Tray', 'Mini Herb Garden Kit', 'Waterproof Hiking Backpack', 'Silicone Air Fryer Liners',
  'Satin Sleep Bonnet', 'Foldable Laundry Basket', 'Wooden Serving Board', 'Acrylic Makeup Organizer',
  'Cozy Sherpa Slippers', 'Reusable Produce Bags', 'Candle Making Starter Kit', 'Soft Yoga Mat',
  'Beaded Crossbody Bag', 'Cooling Towel Set', 'Felt Laptop Sleeve', 'Bamboo Bath Caddy',
  'Pressed Flower Bookmark Set', 'Travel Shoe Bags', 'Plush Cloud Blanket', 'Glass Meal Prep Containers',
  'Woven Storage Basket', 'Pearl Hair Barrette', 'Garden Kneeling Pad', 'Silicone Baking Mat',
  'Canvas Weekend Tote', 'Cork Coaster Set', 'Mini Sewing Repair Kit', 'Weighted Sleep Mask',
  'Ribbed Water Bottle', 'Embroidered Baseball Cap', 'Wall Mounted Key Rack', 'Lavender Shower Steamers',
  'Leather Passport Wallet', 'Stackable Spice Jars', 'Boucle Desk Chair Cushion', 'Stainless Lunch Box',
  'Crochet Plant Hanger', 'Travel Jewelry Case', 'Non Slip Bath Mat', 'Handheld Milk Frother',
  'Folding Beach Chair', 'Magnetic Fridge Calendar', 'Rosemary Hair Oil', 'Marble Rolling Pin',
  'Insulated Grocery Tote', 'Cloud Shaped Night Light', 'Pet Grooming Glove', 'Ceramic Incense Holder',
  'Adjustable Resistance Bands', 'Woven Sun Hat', 'Reusable Makeup Rounds', 'Mini Window Planter',
];

const verifiedMarketplaceImages = {
  'Plush Dog Toy': 'https://images.unsplash.com/photo-1591946614720-90a587da4a36?q=80&w=900&auto=format&fit=crop',
  'Canvas Weekend Tote': 'https://images.unsplash.com/photo-1511556820780-d912e42b4980?q=80&w=900&auto=format&fit=crop',
  'Ceramic Matcha Bowl': 'https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=900&auto=format&fit=crop',
};

const bulkMarketplaceListings = marketplaceNames.map((name, index) => {
  const price = 3.49 + (index % 18) * 1.5;
  const category = /pet|grooming|dog|cat/i.test(name) ? 'Lifestyle'
    : /makeup|hair|bonnet|barrette|oil|cap|hat/i.test(name) ? 'Beauty'
      : /garden|herb|planter|spice|baking|meal|kitchen|mug|bowl|board|rolling|lunch|frother/i.test(name) ? 'Home'
        : /yoga|towel|resistance|hiking|beach|sleep|bath/i.test(name) ? 'Lifestyle'
          : /bag|wallet|passport|tote|sleeve|basket|organizer|rack|tray|case/i.test(name) ? 'Lifestyle'
            : 'Trending';
  return {
    id: `marketplace-${index}`,
    name,
    description: `A thoughtfully priced ${name.toLowerCase()} made for everyday routines, gifting, and small upgrades.`,
    image: verifiedMarketplaceImages[name] ?? `https://image.pollinations.ai/prompt/${encodeURIComponent(`realistic ecommerce product photo of a ${name}, ${name.toLowerCase()} clearly visible, clean studio background, professional catalog photography`)}?width=900&height=900&nologo=true&seed=${index + 2000}`,
    category,
    originalUsd: `$${(price + 9).toFixed(2)}`,
    usd: `$${price.toFixed(2)}`,
    crypto: `${(price / 3200).toFixed(4)} ETH`,
    rating: (4.3 + (index % 7) / 10).toFixed(1),
    sold: 70 + (index * 73) % 880,
  };
});

const extraProductDetails = [
  ['Fast Charge Power Brick', 'A compact wall charger for quickly powering everyday devices.', 'Tech'],
  ['Adjustable Tablet Stand', 'Raise a tablet to a comfortable viewing angle.', 'Tech'],
  ['Color LED Light Strip', 'Add colorful accent lighting to a desk or room.', 'Tech'],
  ['Compact Digital Camera', 'A pocket-sized camera for everyday snapshots.', 'Tech'],
  ['Hard Shell Travel Organizer', 'Protect and organize essentials while traveling.', 'Lifestyle'],
  ['Compact Everyday Handbag', 'A small carryall for daily essentials.', 'Lifestyle'],
  ['UV Protection Sunglasses', 'A stylish pair for bright days outdoors.', 'Lifestyle'],
  ['Hard Shell Travel Organizer', 'A second size option for keeping travel essentials protected.', 'Lifestyle'],
  ['Precision Cleaning Pen', 'A small tool for cleaning tight spaces and electronics.', 'Home'],
  ['USB Mug Warmer', 'Keep a favorite drink warm at your desk.', 'Home'],
  ['Modern Table Lamp', 'A simple lamp for a desk, shelf, or bedside table.', 'Home'],
  ['Smart Floor Robot', 'A compact automated helper for everyday floor cleaning.', 'Home'],
  ['Lava Mist Humidifier', 'Add cool mist and colorful atmosphere to a room.', 'Home'],
  ['Desktop Turbo Fan', 'A compact fan for a little extra airflow.', 'Home'],
  ['Northern Lights Projector', 'Fill a room with colorful atmospheric light.', 'Home'],
  ['Ambient World Globe', 'A decorative globe for a desk or shelf.', 'Home'],
  ['Soft Touch Makeup Brush Set', 'A set of soft brushes for smooth makeup application.', 'Beauty'],
  ['Lengthening Black Mascara', 'Define and lengthen lashes with a rich black finish.', 'Beauty'],
  ['Warm-Tone Makeup Palette', 'A warm selection of shades for everyday looks.', 'Beauty'],
  ['Rechargeable Grooming Shaver', 'A cordless shaver for convenient grooming.', 'Beauty'],
  ['Rechargeable Massage Gun', 'A handheld massager for post-workout recovery.', 'Beauty'],
  ['Smooth Finish Face Primer', 'Prepare skin for a smoother makeup finish.', 'Beauty'],
  ['Portable Game Console', 'A handheld device for gaming on the go.', 'Gaming'],
  ['Magnetic Strategy Game', 'A hands-on magnetic game for quick play sessions.', 'Gaming'],
  ['Mini Finger Skateboard Set', 'Tiny skateboards for desk-friendly tricks.', 'Gaming'],
  ['Deluxe Roulette Game', 'A compact roulette set for game nights.', 'Gaming'],
  ['Mini Arcade Game Station', 'Bring classic arcade-style play to a tabletop.', 'Gaming'],
  ['Wireless Gaming Headset', 'Comfortable audio for games, calls, and media.', 'Gaming'],
  ['RGB Mechanical Keyboard', 'A colorful mechanical keyboard for a responsive setup.', 'Tech'],
  ['Multi-Port USB Hub', 'Expand a laptop or desktop with extra USB ports.', 'Tech'],
  ['Protective Phone Case', 'A slim case for everyday phone protection.', 'Tech'],
  ['Pocket Movie Projector', 'Project favorite videos onto a wall or screen.', 'Tech'],
  ['Motion Sensor Night Light', 'A soft automatic light for dark spaces.', 'Home'],
  ['Protective Travel Pouch', 'Keep small essentials protected inside a bag.', 'Lifestyle'],
  ['LED Spinning Party Glove', 'Add colorful motion effects to parties and play.', 'Lifestyle'],
  ['Colorful Gel Pen Set', 'A bright pen set for notes, journals, and crafts.', 'Lifestyle'],
  ['Compact Multi-Tool', 'A handy collection of tools in one small format.', 'Lifestyle'],
  ['Solar Powered Gadget Kit', 'Explore useful outdoor gadgets powered by sunlight.', 'Lifestyle'],
  ['Mini Kitchen Grinder', 'Grind small food ingredients quickly and easily.', 'Home'],
  ['Stainless Steel Vegetable Peeler', 'Peel vegetables with a simple sharp kitchen tool.', 'Home'],
];

const addedImageSources = [
  'charger brick.jpg', 'ipad arm.jpg', 'led strip.jpg', 'digital camera.jpg',
  'travel case.jpg', 'purse.jpg', 'sunglasses.jpg', 'travel case.jpg',
  'cleaning tool.jpg', 'cup warmer.jpg', 'lamp.jpg', 'robot vacuum.jpg',
  'humidifier lava.jpg', 'fan.jpg', 'northern lights.jpg', 'globe.jpg',
  'makeup brush.webp', 'mascara.webp', 'makeup brown thing.webp', 'shaver.jpg',
  'massage.jpg', 'primer.webp', 'game device.jpg', 'magnet game.jpg',
  'tech decks.jpg', 'roulette.jpg', 'arcade machine.jpg', 'headset.jpg',
  'keyboard.jpg', 'usb hub.jpg', 'phone case ip17.jpg', 'projector.jpg',
  'night lamp.jpg', 'padding thingy.webp', 'spinning glove led thingy.jpg', 'pens.jpg',
  'multi use tool.jpg', 'solar gadgets.jpg', 'grinder for food.jpg', 'potato peeler.jpg',
  'watch.jpg', 'smart finder.jpg', 'earbuds.jpg', 'cooler.jpg',
  'karaoke sett.jpg', 'time thing.jpg', 'fan.jpg', 'lamp.jpg',
];

const extraProducts = extraProductDetails.map(([name, description, category], index) => {
  const usdValue = 2.99 + (index % 8) * 1.25;
  return {
    id: `extra-${index}`,
    name,
    description,
    category,
    originalUsd: `$${(usdValue + 7).toFixed(2)}`,
    usd: `$${usdValue.toFixed(2)}`,
    crypto: `${(usdValue / 3200).toFixed(4)} ETH`,
    image: imageModules[`./assets/images/${addedImageSources[index]}`],
    rating: (4.4 + (index % 6) / 10).toFixed(1),
    sold: 80 + (index * 91) % 720,
  };
});

const surpriseProducts = [
  ['Fitness Tracker Watch', 'Track everyday movement with a lightweight wrist watch.', 'Lifestyle', 2.99],
  ['Bluetooth Item Finder', 'Keep track of keys, bags, and everyday essentials.', 'Tech', 4.49],
  ['Wireless Earbuds', 'Compact audio for music, calls, and everyday listening.', 'Tech', 3.49],
  ['Portable Cooling Fan', 'A compact fan for a little extra airflow anywhere.', 'Home', 5.99],
  ['Portable Karaoke Set', 'Bring easy sing-along fun to parties and gatherings.', 'Gaming', 4.99],
  ['Minimal Digital Clock', 'Keep a simple digital time display on your desk.', 'Home', 3.99],
  ['Desktop Turbo Fan', 'A second compact fan for your workspace or bedside table.', 'Home', 4.99],
  ['Modern Table Lamp', 'A warm lamp for a comfortable weekend corner.', 'Home', 3.99],
].map(([name, description, category, usdValue], index) => ({
  id: `surprise-${index}`,
  name,
  description,
  category,
  originalUsd: `$${(usdValue + 8).toFixed(2)}`,
  usd: `$${usdValue.toFixed(2)}`,
  crypto: `${(usdValue / 3200).toFixed(4)} ETH`,
  image: imageModules[`./assets/images/${addedImageSources[index + extraProductDetails.length]}`],
  rating: (4.3 + (index % 7) / 10).toFixed(1),
  sold: 60 + (index * 113) % 650,
}));

const PRODUCTS = [...baseProducts, ...realisticTechListings, ...bulkMarketplaceListings, ...surpriseProducts, ...extraProducts];

const CATEGORIES = ['All', 'Tech', 'Home', 'Beauty', 'Gaming', 'Lifestyle', 'Trending']
  .filter((category) => category === 'All' || PRODUCTS.some((product) => product.category === category));

const PROMOTIONS = [
  {
    kicker: 'Today only',
    title: 'Tiny prices. Big upgrades.',
    body: 'Fresh tech finds are moving fast. Grab a deal before this offer changes.',
    product: PRODUCTS[0],
  },
  {
    kicker: 'New markdowns',
    title: 'Your next favorite gadget is on sale.',
    body: 'Save more on clever devices picked for work, play, and everything between.',
    product: PRODUCTS[12],
  },
  {
    kicker: 'Hot deal alert',
    title: 'The best finds under $10.',
    body: 'Scroll the sale shelf and fill your cart with useful little upgrades.',
    product: PRODUCTS[25],
  },
  {
    kicker: 'Weekend special',
    title: 'Beauty picks, dramatically cheaper.',
    body: 'Treat yourself to a new routine while the red sale tags are still up.',
    product: PRODUCTS[40],
  },
];

const CRYPTO_WALLETS = [
  { name: 'Ethereum', address: '0xdBF220D27cC4D1badeB71E2d0ba4CA9478A11ab8' },
  { name: 'Bitcoin', address: '3NekMgxdGxQV613Nrs8ypiLsAdjmi5QzGK' },
  { name: 'USDC', address: '0xdBF220D27cC4D1badeB71E2d0ba4CA9478A11ab8' },
  { name: 'Sol', address: 'JCV2isfPe56igXagkDDqvdfS2o6M3voUvKZZEZx3r8HP' },
  { name: 'LTC', address: 'ltc1qh2h7ae4drq45fea63426vxqlwre37jf8zfm8z5' },
];

const PAYMENT_MAX_AGE_SECONDS = 30 * 60;

const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
};

const getCryptoUsdRate = async (walletName) => {
  const coinIds = { Ethereum: 'ethereum', Bitcoin: 'bitcoin', USDC: 'usd-coin', Sol: 'solana', LTC: 'litecoin' };
  const response = await fetchWithTimeout(`https://api.coingecko.com/api/v3/simple/price?ids=${coinIds[walletName]}&vs_currencies=usd`);
  if (!response.ok) throw new Error('Could not get the current crypto price. Try again.');
  const data = await response.json();
  return data[coinIds[walletName]].usd;
};

const verifyPayment = async (wallet, transactionId, expectedUsd) => {
  const rate = await getCryptoUsdRate(wallet.name);
  const minimumNativeAmount = expectedUsd / rate;
  const cutoff = Math.floor(Date.now() / 1000) - PAYMENT_MAX_AGE_SECONDS;

  if (wallet.name === 'Bitcoin' || wallet.name === 'LTC') {
    const explorer = wallet.name === 'Bitcoin' ? 'https://mempool.space/api' : 'https://litecoinspace.org/api';
    const response = await fetchWithTimeout(`${explorer}/tx/${transactionId}`);
    if (!response.ok) throw new Error('Transaction ID was not found on the selected network.');
    const transaction = await response.json();
    const received = transaction.vout
      .filter((output) => output.scriptpubkey_address === wallet.address)
      .reduce((total, output) => total + output.value, 0) / 100000000;
    if (!transaction.status.confirmed) {
      throw new Error(`Transaction found, but it is still awaiting ${wallet.name} confirmation. Try again shortly.`);
    }
    if (!transaction.status.block_time || transaction.status.block_time < cutoff) {
      throw new Error('Payment must be less than 30 minutes old.');
    }
    if (received < minimumNativeAmount) throw new Error('The transaction amount is lower than the order total.');
    return true;
  }

  if (wallet.name === 'Sol') {
    const response = await fetchWithTimeout('https://api.mainnet-beta.solana.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'getTransaction', params: [transactionId, { encoding: 'jsonParsed', maxSupportedTransactionVersion: 0 }] }),
    });
    const { result: transaction } = await response.json();
    if (!transaction || transaction.meta?.err || !transaction.blockTime || transaction.blockTime < cutoff) {
      throw new Error('Transaction was not found, confirmed, or recent on Solana.');
    }
    const accountIndex = transaction.transaction.message.accountKeys.findIndex((account) => account.pubkey === wallet.address);
    const received = accountIndex >= 0
      ? (transaction.meta.postBalances[accountIndex] - transaction.meta.preBalances[accountIndex]) / 1000000000
      : 0;
    if (received < minimumNativeAmount) throw new Error('The transaction amount is lower than the order total.');
    return true;
  }

  if (wallet.name === 'USDC') {
    const transactionResponse = await fetchWithTimeout(`https://eth.blockscout.com/api/v2/transactions/${transactionId}`);
    const transferResponse = await fetchWithTimeout(`https://eth.blockscout.com/api/v2/transactions/${transactionId}/token-transfers`);
    if (!transactionResponse.ok || !transferResponse.ok) throw new Error('USDC transaction ID was not found.');
    const transaction = await transactionResponse.json();
    const { items: transfers } = await transferResponse.json();
    const transfer = transfers.find((item) =>
      item.token?.symbol === 'USDC' && item.to?.hash?.toLowerCase() === wallet.address.toLowerCase());
    const timestamp = Math.floor(new Date(transaction.timestamp).getTime() / 1000);
    const received = transfer ? Number(transfer.total.value) / 10 ** Number(transfer.token.decimals) : 0;
    if (transaction.status !== 'ok' || !timestamp || timestamp < cutoff) {
      throw new Error('USDC payment must be confirmed and less than 30 minutes old.');
    }
    if (received < minimumNativeAmount) throw new Error('The USDC amount is lower than the order total.');
    return true;
  }

  const rpcResponse = await fetchWithTimeout('https://cloudflare-eth.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_getTransactionByHash', params: [transactionId] }),
  });
  const { result: transaction } = await rpcResponse.json();
  if (!transaction || transaction.to?.toLowerCase() !== wallet.address.toLowerCase()) {
    throw new Error('Transaction was not found or was not sent to the selected wallet.');
  }
  const receiptResponse = await fetchWithTimeout('https://cloudflare-eth.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_getTransactionReceipt', params: [transactionId] }),
  });
  const { result: receipt } = await receiptResponse.json();
  if (!receipt || receipt.status !== '0x1') throw new Error('Ethereum transaction has not succeeded yet.');
  const blockResponse = await fetchWithTimeout('https://cloudflare-eth.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_getBlockByNumber', params: [transaction.blockNumber, false] }),
  });
  const { result: block } = await blockResponse.json();
  if (!block || parseInt(block.timestamp, 16) < cutoff) throw new Error('Payment must be less than 30 minutes old.');
  if (parseInt(transaction.value, 16) / 1e18 < minimumNativeAmount) throw new Error('The transaction amount is lower than the order total.');
  return true;
};

export default function App() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [promoIndex, setPromoIndex] = useState(0);
  const [selectedWallet, setSelectedWallet] = useState(CRYPTO_WALLETS[0]);
  const [paymentError, setPaymentError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [cookieConsent, setCookieConsent] = useState(() => localStorage.getItem('temo-cookie-consent'));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('featured');
  const [visibleProductCount, setVisibleProductCount] = useState(50);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('temo-theme') === 'dark');
  const [legalPage, setLegalPage] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [savedProducts, setSavedProducts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('temo-saved-products') || '[]');
    } catch {
      return [];
    }
  });
  const previousFocusRef = useRef(null);
  const overlayWasOpenRef = useRef(false);
  const hydratedCartKeyRef = useRef(null);

  const cartStorageKey = user ? `temo-cart-${user.id || user.email}` : 'temo-cart-guest';
  const isOverlayOpen = isAuthOpen || isCartOpen || isPromoOpen;

  useEffect(() => {
    if (!supabase) return;

    // Check for an existing session on app load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth state changes (sign in, sign out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const storedCart = localStorage.getItem(cartStorageKey);
    if (!storedCart) {
      setCart([]);
      hydratedCartKeyRef.current = cartStorageKey;
      return;
    }

    try {
      const parsedCart = JSON.parse(storedCart);
      setCart(Array.isArray(parsedCart) ? parsedCart : []);
      hydratedCartKeyRef.current = cartStorageKey;
    } catch (error) {
      console.warn('Failed to restore saved cart:', error);
      setCart([]);
      hydratedCartKeyRef.current = cartStorageKey;
    }
  }, [user, cartStorageKey]);

  useEffect(() => {
    if (hydratedCartKeyRef.current !== cartStorageKey) return;
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
  }, [cart, cartStorageKey]);

  useEffect(() => {
    const openPromotion = () => {
      if (isAuthOpen || isCartOpen || isPromoOpen) return;
      setPromoIndex((currentIndex) => (currentIndex + 1) % PROMOTIONS.length);
      setIsPromoOpen(true);
    };
    const initialPromoTimer = setTimeout(openPromotion, 5000);
    const recurringPromoTimer = setInterval(openPromotion, 15000);
    return () => {
      clearTimeout(initialPromoTimer);
      clearInterval(recurringPromoTimer);
    };
  }, [isAuthOpen, isCartOpen, isPromoOpen]);

  useEffect(() => {
    const closeOverlaysWithEscape = (event) => {
      if (event.key !== 'Escape') return;
      if (isAuthOpen) setIsAuthOpen(false);
      if (isCartOpen) {
        setIsCartOpen(false);
        setIsCheckoutOpen(false);
      }
      if (isPromoOpen) setIsPromoOpen(false);
    };
    document.addEventListener('keydown', closeOverlaysWithEscape);
    return () => document.removeEventListener('keydown', closeOverlaysWithEscape);
  }, [isAuthOpen, isCartOpen, isPromoOpen, isCheckoutOpen]);

  useEffect(() => {
    if (isOverlayOpen && !overlayWasOpenRef.current) {
      previousFocusRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
    }
    if (!isOverlayOpen && overlayWasOpenRef.current) {
      document.body.style.overflow = '';
      previousFocusRef.current?.focus?.();
      previousFocusRef.current = null;
    }
    overlayWasOpenRef.current = isOverlayOpen;
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOverlayOpen]);

  useEffect(() => {
    const activeDialog = isAuthOpen
      ? document.querySelector('.modal-content')
      : isPromoOpen
        ? document.querySelector('.promo-popup')
        : isCartOpen
          ? document.querySelector('.cart-drawer')
          : null;
    if (!activeDialog) return;

    const focusableSelector = 'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])';
    const focusable = [...activeDialog.querySelectorAll(focusableSelector)].filter((element) => !element.disabled);
    focusable[0]?.focus();
    const trapFocus = (event) => {
      if (event.key !== 'Tab' || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', trapFocus);
    return () => document.removeEventListener('keydown', trapFocus);
  }, [isAuthOpen, isCartOpen, isPromoOpen, isCheckoutOpen]);

  useEffect(() => {
    document.documentElement.dataset.theme = isDarkMode ? 'dark' : 'light';
    localStorage.setItem('temo-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) => item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, change) => {
    setCart((prev) => prev
      .map((item) => item.product.id === productId
        ? { ...item, quantity: item.quantity + change }
        : item)
      .filter((item) => item.quantity > 0));
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) =>
    total + Number(item.product.usd.slice(1)) * item.quantity, 0);

  const handleCheckout = async (event) => {
    event.preventDefault();
    if (!user) {
      setIsCheckoutOpen(false);
      setIsAuthOpen(true);
      return;
    }
    setPaymentError('');
    setIsVerifying(true);
    const formData = new FormData(event.currentTarget);
    const transactionId = formData.get('transactionId').trim();
    const address = {
      name: formData.get('shippingName').trim(),
      address: formData.get('shippingAddress').trim(),
      city: formData.get('shippingCity').trim(),
      region: formData.get('shippingRegion').trim(),
      postalCode: formData.get('shippingPostalCode').trim(),
      country: formData.get('shippingCountry').trim(),
      email: formData.get('email').trim(),
    };
    try {
      await verifyPayment(selectedWallet, transactionId, cartTotal);
      setShippingAddress(address);
      setOrderPlaced(true);
      setCart([]);
    } catch (error) {
      setPaymentError(error.name === 'AbortError'
        ? 'Payment verification timed out. Please try again.'
        : error.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const activePromotion = PROMOTIONS[promoIndex];
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const searchableText = `${product.name} ${product.description} ${product.category}`.toLowerCase();
    return matchesCategory && searchableText.includes(searchQuery.trim().toLowerCase());
  }).sort((firstProduct, secondProduct) => {
    if (sortOrder === 'price-low') return Number(firstProduct.usd.slice(1)) - Number(secondProduct.usd.slice(1));
    if (sortOrder === 'price-high') return Number(secondProduct.usd.slice(1)) - Number(firstProduct.usd.slice(1));
    if (sortOrder === 'rating') return Number(secondProduct.rating) - Number(firstProduct.rating);
    if (sortOrder === 'name') return firstProduct.name.localeCompare(secondProduct.name);
    return secondProduct.sold - firstProduct.sold;
  });

  const visibleProducts = filteredProducts.slice(0, visibleProductCount);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setVisibleProductCount(50);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setVisibleProductCount(50);
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
    setVisibleProductCount(50);
  };

  const handleLogout = async () => {
    if (!supabase) {
      setUser(null);
      return;
    }

    await supabase.auth.signOut();
    setUser(null);
    setCart([]);
  };

  const chooseCookiePreference = (preference) => {
    localStorage.setItem('temo-cookie-consent', preference);
    setCookieConsent(preference);
  };

  const toggleSavedProduct = (productId) => {
    setSavedProducts((currentSaved) => {
      const nextSaved = currentSaved.includes(productId)
        ? currentSaved.filter((savedId) => savedId !== productId)
        : [...currentSaved, productId];
      localStorage.setItem('temo-saved-products', JSON.stringify(nextSaved));
      return nextSaved;
    });
  };

  const dismissPromotion = () => {
    sessionStorage.setItem('temo-promo-dismissed', 'true');
    setIsPromoOpen(false);
  };

  const closeCart = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(false);
  };
  const beginCheckout = () => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    setIsCheckoutOpen(true);
  };
  const openLegalPage = (page) => {
    setIsAuthOpen(false);
    closeCart();
    setLegalPage(page);
  };

  return (
    <div className="app-shell">
      <a className="skip-link" href="#products-heading">Skip to products</a>
      <Navbar 
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        user={user} 
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      {legalPage ? <LegalPage page={legalPage} onBack={() => setLegalPage(null)} onOpenLegal={setLegalPage} /> : selectedProduct ? <ProductDetail product={selectedProduct} onBack={() => setSelectedProduct(null)} onAddToCart={(product) => { addToCart(product); setIsCartOpen(true); }} /> : <main className="main-content" id="main-content">
        {!searchQuery.trim() && (
          <section className="hero-banner">
            <div className="hero-copy">
              <p className="hero-eyebrow">THE SMALL STUFF THAT MAKES A BIG DIFFERENCE</p>
              <h1>Good finds.<br /><em>Better prices.</em></h1>
              <p className="hero-description">A daily edit of clever tech, home upgrades, and little luxuries that earn their place in your life.</p>
              <button className="hero-cta" onClick={() => document.querySelector('.product-grid')?.scrollIntoView({ behavior: 'smooth' })}>Explore today's picks <span aria-hidden="true">-&gt;</span></button>
              <div className="hero-proof"><strong>5.0</strong><span>average shopper rating</span><i aria-hidden="true" /> <strong>Free</strong><span>shipping on every deal</span></div>
            </div>
            <div className="hero-art">
              <span className="hero-sticker">UNDER<br />$10</span>
              <img src={PRODUCTS[0].image} alt={PRODUCTS[0].name} />
              <div className="hero-product-label"><span>FEATURED FIND</span><strong>{PRODUCTS[0].name}</strong><b>{PRODUCTS[0].usd}</b></div>
            </div>
          </section>
        )}

        <section className="deal-strip" aria-label="Shopping benefits">
          <div><strong>01 / DAILY DROPS</strong><span>Fresh finds, tiny prices, no filler.</span></div>
          <div><strong>02 / FREE DELIVERY</strong><span>Every deal ships free, every time.</span></div>
          <div><strong>03 / PAY YOUR WAY</strong><span>Five crypto networks accepted.</span></div>
        </section>

        <nav className="category-tabs" aria-label="Product categories">
          {CATEGORIES.map((category) => (
            <button className={selectedCategory === category ? 'category-tab active' : 'category-tab'} key={category} onClick={() => handleCategoryChange(category)}>
              {category}
            </button>
          ))}
        </nav>

        <div className="catalog-heading" aria-live="polite">
          <h2 id="products-heading" tabIndex="-1">{selectedCategory === 'All' ? 'Shop all deals' : `${selectedCategory} deals`}</h2>
          <div className="catalog-tools"><span>{filteredProducts.length} items · showing {Math.min(visibleProductCount, filteredProducts.length)}</span><select aria-label="Sort products" value={sortOrder} onChange={(event) => handleSortChange(event.target.value)}><option value="featured">Featured</option><option value="rating">Top rated</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name: A to Z</option></select></div>
        </div>

        {filteredProducts.length > 0 ? <section className="product-grid" aria-label="Products">
          {visibleProducts.map((prod) => (
            <article
              key={prod.id}
              className="product-card"
              role="button"
              tabIndex="0"
              onClick={() => setSelectedProduct(prod)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelectedProduct(prod);
                }
              }}
              aria-label={`View details for ${prod.name}`}
            >
              <div className="product-image-wrap">
                <img
                  src={prod.image}
                  alt={prod.name}
                  loading="lazy"
                  decoding="async"
                  data-generated-fallback={`https://image.pollinations.ai/prompt/${encodeURIComponent(`realistic ecommerce product photo of ${prod.name}, ${prod.description}, single product centered, clean studio background`)}?width=900&height=900&nologo=true&seed=${prod.id}`}
                  onError={(event) => {
                    const generatedFallback = event.currentTarget.dataset.generatedFallback;
                    if (event.currentTarget.src !== generatedFallback) {
                      event.currentTarget.src = generatedFallback;
                      return;
                    }
                    event.currentTarget.style.display = 'none';
                    event.currentTarget.parentElement.classList.add('image-unavailable');
                  }}
                />
                <span className="product-category">{prod.category}</span>
                <button
                  className={savedProducts.includes(prod.id) ? 'quick-save saved' : 'quick-save'}
                  aria-label={savedProducts.includes(prod.id) ? `Remove ${prod.name} from saved items` : `Save ${prod.name}`}
                  aria-pressed={savedProducts.includes(prod.id)}
                  onClick={(event) => { event.stopPropagation(); toggleSavedProduct(prod.id); }}
                >
                  {savedProducts.includes(prod.id) ? '♥' : '♡'}
                </button>
              </div>
              <div className="product-copy">
                <span className="sale-badge">DEAL PRICE</span>
                <h3>{prod.name}</h3>
                <p>{prod.description}</p>
                <div className="product-meta"><span>★ {prod.rating}</span><span>{prod.sold}+ sold</span></div>
              </div>
              <span className="shipping-note">Free shipping on this deal</span>
              <div className="price-tag">
                <span className="crypto-price">Crypto checkout</span>
                <span className="usd-price"><s>{prod.originalUsd}</s> {prod.usd}</span>
              </div>
              <button className="add-cart-btn" aria-label={`Add ${prod.name} to cart`} onClick={(event) => { event.stopPropagation(); addToCart(prod); setIsCartOpen(true); }}>
                Add to cart <span aria-hidden="true">+</span>
              </button>
            </article>
          ))}
        </section> : <div className="no-results"><h2>No products found</h2><p>Try another search or browse a different category.</p></div>}

        {visibleProductCount < filteredProducts.length && (
          <div className="load-more-wrap">
            <button className="load-more-btn" type="button" onClick={() => setVisibleProductCount((count) => Math.min(count + 50, filteredProducts.length))}>
              Load {Math.min(50, filteredProducts.length - visibleProductCount)} more products
            </button>
            <span>More finds are ready when you are.</span>
          </div>
        )}
      </main>}

      {!legalPage && <footer className="site-footer">
        <span>TeMo</span>
        <nav aria-label="Footer links">
          <button type="button" onClick={() => setLegalPage('privacy')}>Privacy Policy</button>
          <button type="button" onClick={() => setLegalPage('terms')}>Terms and Conditions</button>
          <button type="button" onClick={() => setLegalPage('refunds')}>No-Refund Policy</button>
        </nav>
      </footer>}

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onUserLogin={(loggedInUser) => setUser(loggedInUser)} 
        onOpenLegal={openLegalPage}
      />

      {isCartOpen && (
        <div className="cart-overlay" role="presentation" onClick={closeCart}>
          <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" onClick={(event) => event.stopPropagation()}>
            <div className="cart-header">
              <h2 id="cart-title">Your cart</h2>
              <button className="icon-button" onClick={closeCart} aria-label="Close cart">X</button>
            </div>
            {orderPlaced ? (
              <div className="order-success">
                <h3>Order received</h3>
                <p>Your confirmed blockchain payment was accepted. We will send updates to {shippingAddress?.email} and ship your order to {shippingAddress?.name} at {shippingAddress?.address}, {shippingAddress?.city}.</p>
                <button className="add-cart-btn" onClick={() => { setOrderPlaced(false); closeCart(); }}>Continue shopping</button>
              </div>
            ) : cart.length === 0 ? (
              <p className="empty-cart">Your cart is empty.</p>
            ) : isCheckoutOpen ? (
              <form className="checkout-form" onSubmit={handleCheckout}>
                <h3>Secure checkout</h3>
                <h3 className="form-section-title">Shipping address</h3>
                <label htmlFor="shipping-name">Full name<input id="shipping-name" name="shippingName" required autoComplete="shipping name" placeholder="Full name" /></label>
                <label htmlFor="shipping-address">Street address<input id="shipping-address" name="shippingAddress" required autoComplete="shipping street-address" placeholder="Street and house number" /></label>
                <div className="form-row"><label htmlFor="shipping-city">City<input id="shipping-city" name="shippingCity" required autoComplete="shipping address-level2" placeholder="City" /></label><label htmlFor="shipping-region">State / region<input id="shipping-region" name="shippingRegion" required autoComplete="shipping address-level1" placeholder="State or region" /></label></div>
                <div className="form-row"><label htmlFor="shipping-postal-code">Postal code<input id="shipping-postal-code" name="shippingPostalCode" required autoComplete="shipping postal-code" placeholder="Postal code" /></label><label htmlFor="shipping-country">Country<input id="shipping-country" name="shippingCountry" required autoComplete="shipping country-name" placeholder="Country" /></label></div>
                <h3 className="form-section-title">Payment details</h3>
                <label htmlFor="checkout-email">Email<input id="checkout-email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" /></label>
                <label htmlFor="crypto-wallet">Crypto wallet<select id="crypto-wallet" value={selectedWallet.name} onChange={(event) => setSelectedWallet(CRYPTO_WALLETS.find((wallet) => wallet.name === event.target.value))}>{CRYPTO_WALLETS.map((wallet) => <option key={wallet.name} value={wallet.name}>{wallet.name}</option>)}</select></label>
                <div className="wallet-address"><strong>Send to {selectedWallet.name}</strong><code>{selectedWallet.address}</code></div>
                <p className="wallet-note">Send your payment to the selected wallet, then enter your transaction reference below.</p>
                {paymentError && <p className="payment-error" role="alert" aria-live="assertive">{paymentError}</p>}
                <label htmlFor="transaction-reference">Transaction reference<input id="transaction-reference" name="transactionId" required placeholder="Transaction ID or hash" /></label>
                <label className="consent-label" htmlFor="checkout-consent">
                  <input id="checkout-consent" type="checkbox" required />
                  <span>I agree to the <button type="button" onClick={() => openLegalPage('terms')}>Terms and Conditions</button> and understand that completed purchases follow the <button type="button" onClick={() => openLegalPage('refunds')}>No-Refund Policy</button>.</span>
                  onOpenLegal={openLegalPage}
                </label>
                <button className="add-cart-btn" type="submit" disabled={isVerifying}>{isVerifying ? 'Verifying transaction...' : `Verify payment $${cartTotal.toFixed(2)}`}</button>
                <button className="text-button" type="button" onClick={() => setIsCheckoutOpen(false)}>Back to cart</button>
              </form>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map(({ product, quantity }) => (
                    <div className="cart-item" key={product.id}>
                      <img src={product.image} alt={product.name} />
                      <div><strong>{product.name}</strong><span>{product.usd}</span><div className="quantity-controls"><button aria-label={`Remove one ${product.name}`} onClick={() => updateQuantity(product.id, -1)}>-</button><span aria-label={`${quantity} in cart`}>{quantity}</span><button aria-label={`Add one ${product.name}`} onClick={() => updateQuantity(product.id, 1)}>+</button></div></div>
                    </div>
                  ))}
                </div>
                <div className="cart-total"><span>Total</span><strong>${cartTotal.toFixed(2)}</strong></div>
                <button className="add-cart-btn" onClick={beginCheckout}>Proceed to payment</button>
              </>
            )}
          </aside>
        </div>
      )}

      {isPromoOpen && (
        <div className="promo-overlay" role="presentation" onClick={dismissPromotion}>
          <section className="promo-popup" role="dialog" aria-modal="true" aria-labelledby="promo-title" onClick={(event) => event.stopPropagation()}>
            <button className="promo-close" onClick={dismissPromotion} aria-label="Close offer">X</button>
            <div className="promo-image-wrap">
              <img src={activePromotion.product.image} alt={activePromotion.product.name} />
              <span>FLASH<br />SALE</span>
            </div>
            <div className="promo-content">
              <p className="promo-kicker">{activePromotion.kicker}</p>
              <h2 id="promo-title">{activePromotion.title}</h2>
              <p>{activePromotion.body}</p>
              <button className="add-cart-btn" onClick={() => { setIsPromoOpen(false); document.querySelector('.product-grid')?.scrollIntoView({ behavior: 'smooth' }); }}>
                Shop the sale
              </button>
              <button className="promo-later" onClick={dismissPromotion}>Maybe later</button>
            </div>
          </section>
        </div>
      )}

      {!cookieConsent && (
        <aside className="cookie-banner" aria-label="Cookie preferences">
          <div>
            <strong>Cookies on TeMo</strong>
            <p>We use essential cookies to keep your cart and sign-in working. Optional cookies are off unless you choose to allow them.</p>
          </div>
          <div className="cookie-actions">
            <button className="cookie-reject" onClick={() => chooseCookiePreference('rejected')}>Reject optional</button>
            <button className="cookie-accept" onClick={() => chooseCookiePreference('accepted')}>Accept optional</button>
          </div>
        </aside>
      )}

      <button
        className="theme-toggle"
        type="button"
        onClick={() => setIsDarkMode((currentMode) => !currentMode)}
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <span aria-hidden="true">{isDarkMode ? '☀' : '☾'}</span>
        {isDarkMode ? 'Light mode' : 'Dark mode'}
      </button>
    </div>
  );
}