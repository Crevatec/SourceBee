// ============================================================
//  products.js  —  STARTER CATALOGUE
//  These are fallback products shown before admin uploads via Firestore.
//  Once LOAD_PRODUCTS_FROM_DB = true and products are in Firestore,
//  these are overwritten by db.js after load.
// ============================================================

const PRODUCTS_LOCAL = [
  // Fashion
  { id:1,  name:'Ankara Print Midi Dress',              brand:'SourceBee Fashion', price:12500, old:16000,  emoji:'👗', badge:'sale', cat:'fashion',   rating:4.8, reviews:320,  isNew:false },
  { id:2,  name:"Men's Corporate Shirt (3-Pack)",        brand:'SourceBee Fashion', price:15000, old:null,   emoji:'👔', badge:'new',  cat:'fashion',   rating:4.6, reviews:210,  isNew:true  },
  { id:3,  name:'High-Waist Palazzo Trousers',           brand:'SourceBee Fashion', price:8500,  old:11000,  emoji:'👖', badge:'sale', cat:'fashion',   rating:4.5, reviews:180,  isNew:false },
  { id:4,  name:'Boubou Lace Gown Set',                  brand:'SourceBee Fashion', price:22000, old:null,   emoji:'👘', badge:'new',  cat:'fashion',   rating:4.9, reviews:410,  isNew:true  },
  // Shoes & Bags
  { id:5,  name:"Women's Block Heel Sandals",            brand:'SourceBee Shoes',   price:9800,  old:13000,  emoji:'👡', badge:'sale', cat:'shoes',     rating:4.7, reviews:270,  isNew:false },
  { id:6,  name:'Leather Tote Bag — Chocolate Brown',   brand:'SourceBee Bags',    price:14500, old:null,   emoji:'👜', badge:'new',  cat:'shoes',     rating:4.8, reviews:190,  isNew:true  },
  { id:7,  name:"Men's Suede Chelsea Boots",             brand:'SourceBee Shoes',   price:18000, old:24000,  emoji:'👞', badge:'sale', cat:'shoes',     rating:4.6, reviews:155,  isNew:false },
  { id:8,  name:'Mini Crossbody Bag — Nude Pink',        brand:'SourceBee Bags',    price:7500,  old:null,   emoji:'👛', badge:'new',  cat:'shoes',     rating:4.7, reviews:340,  isNew:true  },
  // Wigs & Hair
  { id:9,  name:'13x4 Lace Front Wig — 20 inch',        brand:'SourceBee Hair',    price:45000, old:58000,  emoji:'💇', badge:'sale', cat:'hair',      rating:4.9, reviews:520,  isNew:false },
  { id:10, name:'Kinky Curly Human Hair Wig — 18 inch', brand:'SourceBee Hair',    price:38000, old:null,   emoji:'💆', badge:'new',  cat:'hair',      rating:4.8, reviews:390,  isNew:true  },
  { id:11, name:'Frontal Closure 4x4 — Straight',       brand:'SourceBee Hair',    price:22000, old:28000,  emoji:'✂️', badge:'sale', cat:'hair',      rating:4.7, reviews:280,  isNew:false },
  { id:12, name:'Braiding Hair Pack — Black (×3)',       brand:'SourceBee Hair',    price:4500,  old:null,   emoji:'🧵', badge:'new',  cat:'hair',      rating:4.5, reviews:670,  isNew:true  },
  // Electronics
  { id:13, name:'Bluetooth Earbuds TWS Pro',             brand:'Oraimo',            price:8500,  old:12000,  emoji:'🎧', badge:'sale', cat:'electronics',rating:4.6,reviews:810,  isNew:false },
  { id:14, name:'Power Bank 20000mAh Fast Charge',       brand:'Anker',             price:18000, old:null,   emoji:'🔋', badge:'new',  cat:'electronics',rating:4.8,reviews:430,  isNew:true  },
  { id:15, name:'Smart Watch Fitness Tracker',           brand:'Xiaomi',            price:15000, old:20000,  emoji:'⌚', badge:'sale', cat:'electronics',rating:4.7,reviews:360,  isNew:false },
  { id:16, name:'Ring Light 10" with Tripod Stand',      brand:'SourceBee Tech',    price:12500, old:null,   emoji:'💡', badge:'new',  cat:'electronics',rating:4.8,reviews:240,  isNew:true  },
  // Kitchen & Home
  { id:17, name:'Non-Stick Fry Pan Set (3-piece)',       brand:'Tefal',             price:16500, old:22000,  emoji:'🍳', badge:'sale', cat:'home',      rating:4.7, reviews:295,  isNew:false },
  { id:18, name:'Multipurpose Kitchen Organiser',        brand:'SourceBee Home',    price:6800,  old:null,   emoji:'🏠', badge:'new',  cat:'home',      rating:4.5, reviews:180,  isNew:true  },
  { id:19, name:'Throw Pillow Set (4 pieces)',           brand:'SourceBee Home',    price:9500,  old:13000,  emoji:'🛋️', badge:'sale', cat:'home',      rating:4.6, reviews:210,  isNew:false },
  { id:20, name:'Electric Kettle 1.8L Stainless',        brand:'Binatone',          price:8200,  old:null,   emoji:'☕', badge:'new',  cat:'home',      rating:4.7, reviews:320,  isNew:true  },
  // Books
  { id:21, name:'Rich Dad Poor Dad — Robert Kiyosaki',  brand:'Books',             price:3500,  old:5000,   emoji:'📚', badge:'sale', cat:'books',     rating:4.9, reviews:1200, isNew:false },
  { id:22, name:'Atomic Habits — James Clear',           brand:'Books',             price:4000,  old:null,   emoji:'📖', badge:'new',  cat:'books',     rating:4.9, reviews:980,  isNew:true  },
  { id:23, name:'The 48 Laws of Power',                  brand:'Books',             price:3800,  old:5500,   emoji:'📕', badge:'sale', cat:'books',     rating:4.8, reviews:760,  isNew:false },
  // Pet Items
  { id:24, name:'Dog Collar & Leash Set',                brand:'PetCare',           price:4500,  old:null,   emoji:'🐕', badge:'new',  cat:'pets',      rating:4.6, reviews:140,  isNew:true  },
  { id:25, name:'Cat Toy Bundle (6 pieces)',             brand:'PetCare',           price:3200,  old:4500,   emoji:'🐱', badge:'sale', cat:'pets',      rating:4.7, reviews:190,  isNew:false },
  // Accessories
  { id:27, name:"Women's Pearl Necklace Set",           brand:'SourceBee Style',   price:4500,  old:6000,   emoji:'📿', badge:'sale', cat:'accessories', rating:4.7, reviews:180, isNew:false },
  { id:28, name:'Stainless Steel Watch — Gold Edition', brand:'SourceBee Style',   price:8500,  old:null,   emoji:'⌚', badge:'new',  cat:'accessories', rating:4.8, reviews:210, isNew:true  },
  { id:29, name:'Silk Headscarf Set (3 colours)',       brand:'SourceBee Style',   price:3200,  old:4500,   emoji:'🧣', badge:'sale', cat:'accessories', rating:4.5, reviews:145, isNew:false },
  { id:30, name:'Sunglasses UV400 — Oversized Frame',  brand:'SourceBee Style',   price:4200,  old:null,   emoji:'🕶️', badge:'new',  cat:'accessories', rating:4.6, reviews:290, isNew:true  },
  { id:26, name:'Custom Sourcing Request',               brand:'SourceBee',         price:0,     old:null,   emoji:'🔍', badge:'new',  cat:'sourcing',  rating:5.0, reviews:890,  isNew:true  },
];

let allProducts = [...PRODUCTS_LOCAL];
