
// ==========================================
// 1. DATA ENGINE - GYFTAR GIFT BOXES
// ==========================================

// FOR HIM - Main collection (original products)
const productsForHim = [
  {
    id: "001",
    name: "The Executive Box",
    price: 75000,
    category: "Corporate Prestige",
    image: "https://i0.wp.com/dor.com.ng/wp-content/uploads/2021/02/Men-Gift-Set-Box-S-4.jpeg?fit=600%2C600&ssl=1",
    shortDesc: "Premium cognac, artisan chocolates & hand-stitched leather notebook.",
    whatsInside: [
      "Hennessy VSOP Cognac (70cl)",
      "Bespoke Monogrammed Leather Notebook",
      "Handcrafted Swiss Dark Chocolates",
      "Gold-plated Executive Pen"
    ],
    featured: true,
    bestSeller: true
  },
  {
    id: "002",
    name: "The Milestone",
    price: 120000,
    category: "Celebration",
    image: "https://cdn11.bigcommerce.com/s-perxo2vsd/images/stencil/2560w/products/486/2108/ultimate_indulgence02_1500x1500_1__00650.1756456278.jpg?c=1",
    shortDesc: "Champagne, 24K-touch jewellery & bespoke memory book for defining moments.",
    whatsInside: [
      "Moët & Chandon Impérial Brut",
      "24k Gold Trimmed Champagne Flutes (Pair)",
      "Scented Oud Luxury Candle",
      "Custom Engraved Keepsake Box"
    ],
    featured: true,
    bestSeller: true
  },
  {
    id: "003",
    name: "The Botanica",
    price: 58000,
    category: "Wellness & Calm",
    image: "https://lh3.googleusercontent.com/proxy/GYIdpZqyH6Q3pwAGdHMy4ARf7ei8PQzgs64el1P6rEsZApyf70oJFNEZZJ1BhU5k0wemEirqbEBzTJhzgyX2JquhbFRQZaJXf_PN5wZ1fArabHTivbHnyg",
    shortDesc: "Rare tea leaves, hand-poured soy candle & organic bath salts from the Atlas Mountains.",
    whatsInside: [
      "Atlas Mountain Rose Bath Salts",
      "Kyoto Matcha Green Tea Set",
      "Hand-poured Lavender Soy Candle",
      "Silk Sleep Mask"
    ],
    featured: true,
    bestSeller: true
  }
];

// FOR HER - Curated for women
const productsForHer = [
  {
    id: "101",
    name: "The Silk Robe Luxe",
    price: 95000,
    category: "Elegance & Comfort",
    image: "https://i.pinimg.com/474x/42/d9/4b/42d94b9d51b8deba11eef77206c76071.jpg",
    shortDesc: "Premium silk charmeuse robe, cashmere slippers & luxury skincare collection.",
    whatsInside: [
      "Pure Mulberry Silk Robe (100% silk)",
      "Cashmere-blend Slippers",
      "Cle de Peau Beauté Night Cream",
      "Crystal Scent Diffuser"
    ],
    featured: true,
    bestSeller: false
  },
  {
    id: "102",
    name: "The Pearl Elegance Set",
    price: 135000,
    category: "Timeless Luxury",
    image: "https://chus.vn/images/detailed/283/411442445_781480810662760_3625690820614690180_n.jpg",
    shortDesc: "Freshwater pearl jewellery, premium makeup & hand cream from Paris.",
    whatsInside: [
      "Authentic Freshwater Pearl Necklace",
      "Pearl Stud Earrings (18K Gold)",
      "Tom Ford Lip Color (Rare Carmine)",
      "Crème de la Mer Hand Cream (250ml)"
    ],
    featured: true,
    bestSeller: true
  },
  {
    id: "103",
    name: "The Spa Retreat Box",
    price: 88000,
    category: "Wellness & Rejuvenation",
    image: "https://giftenmarket.com/cdn/shop/files/ultimate-spa-day-gift-box-giften-market-3.png?v=1775196045&width=2200",
    shortDesc: "Luxury spa essentials with organic oils, bath bombs & aromatherapy candles.",
    whatsInside: [
      "Balinese Massage Oil (500ml)",
      "Orzo Bath Bombs (Set of 5)",
      "Jo Malone Candle Collection",
      "Rose Quartz Facial Roller"
    ],
    featured: true,
    bestSeller: false
  }
];

// BESPOKE - Custom creations
const productsBespoke = [
  {
    id: "201",
    name: "Custom Jewelry Box",
    price: 180000,
    category: "Bespoke Craftsmanship",
    image: "https://img.yfisher.com/tos/video-website/1411/file_01743648343723.jpg?x-tos-process=image/resize,m_lfit,w_768/format,webp/quality,q_100",
    shortDesc: "Hand-crafted wooden jewelry box with personalized engraving & velvet lining.",
    whatsInside: [
      "Custom Wooden Jewelry Box",
      "Personalized Engraving (up to 50 chars)",
      "Premium Velvet Interior",
      "Lock & Key Mechanism"
    ],
    featured: true,
    bestSeller: false
  },
  {
    id: "202",
    name: "Private Wine Set",
    price: 250000,
    category: "Experiential Luxury",
    image: "https://brocrates.com/cdn/shop/products/OCT-17-C1-29691_1400x.jpg?v=1666635335",
    shortDesc: "Curated private wine tasting session with sommelier & gourmet charcuterie.",
    whatsInside: [
      "Private Sommelier Session (3 hours)",
      "Premium Wine Selection (5 varieties)",
      "Artisan Charcuterie Board",
      "Personalized Tasting Notes",
      "Certificate of Appreciation"
    ],
    featured: true,
    bestSeller: true
  },
  {
    id: "203",
    name: "Bespoke Skin Care",
    price: 200000,
    category: "Bespoke Personal Care",
    image: "https://m.media-amazon.com/images/I/81HEXhKZDLL.jpg",
    shortDesc: "Fully customized gift experience tailored to recipient's preferences & lifestyle.",
    whatsInside: [
      "Personal Consultation Call",
      "Custom Curated Selection",
      "Luxury Packaging",
      "White Glove Delivery",
      "Unlimited Revisions"
    ],
    featured: true,
    bestSeller: false
  }
];

// Combination array for backward compatibility
const products = [...productsForHim, ...productsForHer, ...productsBespoke];

// ===========================
// HELPER FUNCTIONS
// ===========================

function getProductById(id) {
  // Search across all product arrays
  return (
    productsForHim.find(p => p.id === String(id)) ||
    productsForHer.find(p => p.id === String(id)) ||
    productsBespoke.find(p => p.id === String(id)) ||
    null
  );
}

function getFeaturedProducts() {
  return products.filter(product => product.featured === true).slice(0, 3);
}

function getBestSellers() {
  return products.filter(product => product.bestSeller === true).slice(0, 3);
}

function getAllProducts() {
  return products;
}

// Legacy function names for compatibility
function getFeaturedCars() {
  return getFeaturedProducts();
}

function getDiscountCars() {
  return getBestSellers();
}


