
// ==========================================
// 1. DATA ENGINE - GYFTAR GIFT BOXES
// ==========================================

const products = [
  {
    id: "001",
    name: "The Executive Box",
    price: 75000,
    category: "Corporate Prestige",
    image: "./assets/executive.jpg",
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
    image: "./assets/milestone.jpg",
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
  },
  {
    id: "004",
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

// ===========================
// HELPER FUNCTIONS
// ===========================

function getFeaturedProducts() {
  return products.filter(product => product.featured === true).slice(0, 3);
}

function getBestSellers() {
  return products.filter(product => product.bestSeller === true).slice(0, 3);
}

function getAllProducts() {
  return products;
}

function getProductById(id) {
  return products.find(product => product.id === String(id)) || null;
}

// Legacy function names for compatibility
function getFeaturedCars() {
  return getFeaturedProducts();
}

function getDiscountCars() {
  return getBestSellers();
}


