// src/utils/productStore.js

const PRODUCTS_KEY = "krishna_admin_products";
const CATEGORIES_KEY = "krishna_categories";
const BRANDS_KEY = "krishna_brands";
const WISHLIST_KEY = "krishna_wishlist";
const REVIEWS_KEY = "krishna_product_reviews";

export const defaultCategories = [
  "Watches",
  "Bags & Wallets",
  "Shoes",
  "Mobiles",
  "Clothes & Fashion",
  "Laptops",
  "Electronics",
  "Smart Gadgets",
  "Gaming",
  "Fitness",
  "Fashion Accessories",
];

export const defaultBrands = [
  // Watches
  "Titan",
  "Fossil",
  "Casio",
  "Rolex",
  "Fastrack",
  "Timex",
  "Omega",
  "Tissot",
  "Rado",
  "Seiko",
  // Bags & Wallets
  "Wildcraft",
  "American Tourister",
  "Samsonite",
  "Tommy Hilfiger",
  "Lavie",
  "Hidesign",
  // Shoes
  "Nike",
  "Adidas",
  "Puma",
  "Reebok",
  "Jordan",
  "Woodland",
  "Asics",
  // Mobiles & Tech
  "Apple",
  "Samsung",
  "OnePlus",
  "Google Pixel",
  "Xiaomi",
  "Vivo",
  // Clothes & Fashion
  "Levis",
  "Zara",
  "Tommy Hilfiger",
  "Calvin Klein",
  "Allen Solly",
  "Van Heusen",
  // Laptops
  "Dell",
  "HP",
  "Apple",
  "Asus",
  "Lenovo",
  "Acer",
  // Electronics & Audio
  "Sony",
  "Bose",
  "JBL",
  "Samsung",
  "boAt",
  "Marshall",
  // Smart Gadgets & Fitness
  "Garmin",
  "Noise",
  "Fitbit",
  // Gaming
  "Razer",
  "Logitech",
  "Corsair",
  // Fashion Accessories
  "Ray-Ban",
  "Police",
];

export const categoryBrandMap = {
  "Watches": ["Titan", "Fossil", "Casio", "Rolex", "Fastrack", "Timex", "Omega", "Tissot", "Rado", "Seiko"],
  "Bags & Wallets": ["Wildcraft", "American Tourister", "Samsonite", "Tommy Hilfiger", "Lavie", "Hidesign"],
  "Shoes": ["Nike", "Adidas", "Puma", "Reebok", "Jordan", "Woodland", "Asics"],
  "Mobiles": ["Apple", "Samsung", "OnePlus", "Google Pixel", "Xiaomi", "Vivo"],
  "Clothes & Fashion": ["Levis", "Zara", "Tommy Hilfiger", "Calvin Klein", "Allen Solly", "Van Heusen"],
  "Laptops": ["Dell", "HP", "Apple", "Asus", "Lenovo", "Acer"],
  "Electronics": ["Sony", "Bose", "JBL", "Samsung", "boAt", "Marshall"],
  "Smart Gadgets": ["Apple", "Samsung", "Google Pixel", "Xiaomi", "boAt", "Noise"],
  "Gaming": ["Razer", "Sony", "Logitech", "Asus", "Acer", "Corsair"],
  "Fitness": ["Garmin", "Apple", "Samsung", "Titan", "boAt", "Fitbit"],
  "Fashion Accessories": ["Ray-Ban", "Fossil", "Tommy Hilfiger", "Titan", "Calvin Klein", "Police"],
};

export const WATCH_TYPES = [];
export const WATCH_TYPE_METADATA = {};

export const COLOR_HEX_MAP = {
  "Gold": "#D4AF37",
  "Silver": "#CBD5E1",
  "Midnight Black": "#0F172A",
  "Royal Blue": "#1E3A8A",
  "Deep Black": "#111827",
  "Carbon Black": "#1E293B",
  "Emerald Green": "#065F46",
  "Onyx Black": "#020617",
  "Gold Two-Tone": "#D97706",
  "Pitch Black": "#18181B",
  "Teal Blue": "#0D9488",
  "Olive Green": "#3F6212",
  "Silver Dial / Brown Strap": "#78350F",
  "Black Dial / Black Strap": "#18181B",
  "Panda White": "#F8FAFC",
  "Racing Black": "#1E293B",
  "Blue Accent": "#2563EB",
  "Sunburst Silver": "#CBD5E1",
  "Champagne Gold": "#FDE047",
  "Rich Cognac Brown": "#92400E",
  "Classic Black": "#171717",
  "Charcoal Grey": "#374151",
  "Navy Blue": "#1E3A8A",
  "Olive Tactical": "#4D7C0F",
  "Navy / White Stripe": "#1E3A8A",
  "Black Jacquard": "#18181B",
  "Crimson Red": "#DC2626",
  "Triple Black": "#09090B",
  "Pure White": "#FFFFFF",
  "Core Black": "#18181B",
  "Cloud White": "#F8FAFC",
  "Solar Red": "#EF4444",
  "White / Black": "#F1F5F9",
  "All Black": "#0F172A",
  "Chicago Red / White / Black": "#B91C1C",
  "Shadow Grey": "#6B7280",
  "Titanium Black": "#18181B",
  "Titanium Gray": "#71717A",
  "Titanium Violet": "#6366F1",
  "Desert Titanium": "#C5B39A",
  "Natural Titanium": "#A8A29E",
  "Black Titanium": "#27272A",
  "Emerald Silk": "#059669",
  "Midnight Obsidian": "#0B0F19",
  "Dark Indigo": "#1E1B4B",
  "Light Stone Wash": "#93C5FD",
  "Vintage Black": "#262626",
  "Charcoal Gray": "#4B5563",
  "Platinum Silver with Black Carbon Fiber": "#CBD5E1",
  "Space Black": "#18181B",
  "Silver Grey": "#94A3B8",
  "Smoky Pink": "#F43F5E",
  "White Smoke": "#F1F5F9",
  "Classic Gold": "#D4AF37",
  "Gunmetal / Polarized Grey": "#475569",
  "Gold / Green Classic G-15": "#D4AF37",
  "Titanium / Orange Ocean Band": "#F97316",
  "Titanium / Midnight Ocean Band": "#1E293B",
  "Black / Powder Gray": "#334155",
  "Whitestone / Powder Gray": "#E2E8F0"
};

export function getColorHex(colorName) {
  if (!colorName) return '#94A3B8';
  if (COLOR_HEX_MAP[colorName]) return COLOR_HEX_MAP[colorName];
  const lower = colorName.toLowerCase();
  for (const [key, hex] of Object.entries(COLOR_HEX_MAP)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return hex;
    }
  }
  if (lower.includes('black') || lower.includes('dark')) return '#18181B';
  if (lower.includes('white') || lower.includes('cream')) return '#FFFFFF';
  if (lower.includes('silver') || lower.includes('grey') || lower.includes('gray')) return '#CBD5E1';
  if (lower.includes('gold') || lower.includes('yellow')) return '#D4AF37';
  if (lower.includes('blue') || lower.includes('navy')) return '#1E3A8A';
  if (lower.includes('red') || lower.includes('crimson')) return '#DC2626';
  if (lower.includes('green') || lower.includes('olive') || lower.includes('emerald')) return '#059669';
  if (lower.includes('brown') || lower.includes('cognac') || lower.includes('tan')) return '#92400E';
  if (lower.includes('orange')) return '#EA580C';
  if (lower.includes('purple') || lower.includes('violet')) return '#7C3AED';
  if (lower.includes('pink') || lower.includes('rose')) return '#F43F5E';
  return '#64748B';
}

export const defaultProducts = [
  // ================= WATCHES (100% Genuine Branded Luxury Collection) =================
  {
    id: 1,
    name: "Classic Luxury Automatic Watch",
    brand: "Titan",
    category: "Watches",
    subcategory: "Analog Watches",
    sku: "KA-TIT-001",
    price: 4999,
    oldPrice: 6999,
    discount: 29,
    stock: 25,
    rating: 4.8,
    reviews: 128,
    status: "Active",
    supplier: "Apex Timepieces Ltd.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800",
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800",
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800"
    ],
    description: "Handcrafted luxury automatic analog watch with premium sapphire crystal glass, surgical-grade stainless steel dial, and water resistance up to 50 meters.",
    highlights: [
      "Japanese Automatic Self-Winding Movement",
      "Scratch-Resistant Sapphire Crystal Lens",
      "50M / 5 ATM Water Resistance Rating",
      "Solid 316L Surgical Grade Stainless Steel Case"
    ],
    specifications: {
      "Material": "316L Stainless Steel",
      "Movement": "Japanese Automatic Quartz",
      "Glass": "Sapphire Crystal",
      "Water Resistance": "50m / 5 ATM",
      "Case Diameter": "42 mm",
      "Warranty": "2 Years International Warranty"
    },
    colors: ["Gold", "Silver", "Midnight Black"],
    variants: ["Gold Dial", "Silver Dial", "Black Mesh"],
    variantDetails: {
      "Gold Dial": { priceModifier: 0, skuSuffix: "GLD", stock: 12 },
      "Silver Dial": { priceModifier: 0, skuSuffix: "SLV", stock: 8 },
      "Black Mesh": { priceModifier: 500, skuSuffix: "MSH", stock: 5 }
    }
  },
  {
    id: 2,
    name: "Premium Chronograph Royal Blue",
    brand: "Fossil",
    category: "Watches",
    subcategory: "Chronograph Watches",
    sku: "KA-FOS-002",
    price: 8999,
    oldPrice: 11999,
    discount: 25,
    stock: 18,
    rating: 4.7,
    reviews: 94,
    status: "Active",
    supplier: "Apex Timepieces Ltd.",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800",
    images: [
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"
    ],
    description: "Sophisticated multi-dial chronograph watch featuring a sunray royal blue dial, genuine Italian leather strap, and stop-watch micro-second precision.",
    highlights: [
      "Triple Sub-Dial Chronograph Precision",
      "Sunray Royal Blue Dial Finish with Date Window",
      "Supple Vegetable-Tanned Italian Leather Strap",
      "Stainless Steel Case with Polished Bezel"
    ],
    specifications: {
      "Material": "Stainless Steel & Italian Leather",
      "Movement": "Multi-Function Chronograph",
      "Glass": "Hardened Mineral Crystal",
      "Water Resistance": "50m / 5 ATM",
      "Strap Width": "22 mm",
      "Warranty": "2 Years International Warranty"
    },
    colors: ["Royal Blue", "Deep Black"],
    variants: ["Leather Strap", "Steel Bracelet"],
    variantDetails: {
      "Leather Strap": { priceModifier: 0, skuSuffix: "LEA", stock: 10 },
      "Steel Bracelet": { priceModifier: 1000, skuSuffix: "STL", stock: 8 }
    }
  },
  {
    id: 3,
    name: "Edifice Tough Solar Chronograph",
    brand: "Casio",
    category: "Watches",
    subcategory: "Solar Watches",
    sku: "KA-CAS-003",
    price: 6499,
    oldPrice: 12999,
    discount: 50,
    stock: 14,
    rating: 4.9,
    reviews: 160,
    status: "Active",
    supplier: "Apex Timepieces Ltd.",
    image: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800",
    images: [
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800",
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"
    ],
    description: "High-precision solar chronograph powered by light energy with Bluetooth mobile link and 100m water resistance.",
    highlights: [
      "Tough Solar Technology (Charges via Natural & Indoor Light)",
      "100M / 10 ATM Water Resistance Rating",
      "Anti-Reflective Coated Sapphire Glass",
      "Carbon Fiber Reinforced Dial Base"
    ],
    specifications: {
      "Material": "Solid Stainless Steel",
      "Movement": "Tough Solar Quartz",
      "Glass": "Sapphire Anti-Reflective",
      "Water Resistance": "100m / 10 ATM",
      "Battery Life": "5 Months on Full Solar Charge",
      "Warranty": "2 Years International Warranty"
    },
    colors: ["Carbon Black", "Silver"],
    variants: ["Solar Steel", "Carbon Edition"],
    variantDetails: {
      "Solar Steel": { priceModifier: 0, skuSuffix: "STL", stock: 9 },
      "Carbon Edition": { priceModifier: 800, skuSuffix: "CRB", stock: 5 }
    }
  },
  {
    id: 4,
    name: "Submariner Date 41mm Oystersteel",
    brand: "Rolex",
    category: "Watches",
    subcategory: "Luxury Watches",
    sku: "KA-ROL-004",
    price: 49999,
    oldPrice: 65999,
    discount: 24,
    stock: 8,
    rating: 4.9,
    reviews: 115,
    status: "Active",
    supplier: "Apex Timepieces Ltd.",
    image: "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=800",
    images: [
      "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=800",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800",
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800",
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800"
    ],
    description: "Iconic luxury diver timepiece with black Cerachrom unidirectional rotating bezel, Chromalight display, scratch-resistant sapphire crystal, and Calibre 3235 automatic movement.",
    highlights: [
      "Calibre 3235 Perpetual Self-Winding Movement",
      "Unidirectional 60-Minute Graduated Cerachrom Bezel",
      "Superlative Chronometer Certification (-2/+2 sec/day)",
      "Oysterlock Safety Clasp with Glidelock Extension"
    ],
    specifications: {
      "Material": "Oystersteel (904L High-Corrosion Resistant)",
      "Movement": "Perpetual Mechanical Self-Winding",
      "Glass": "Cyclops Lens over Date Sapphire Crystal",
      "Water Resistance": "300m / 30 ATM / 1,000 ft",
      "Power Reserve": "Approximately 70 Hours",
      "Warranty": "5 Years International Warranty"
    },
    colors: ["Emerald Green", "Onyx Black", "Gold Two-Tone"],
    variants: ["Emerald Green Bezel", "Onyx Black"],
    variantDetails: {
      "Emerald Green Bezel": { priceModifier: 2000, skuSuffix: "GRN", stock: 3 },
      "Onyx Black": { priceModifier: 0, skuSuffix: "BLK", stock: 5 }
    }
  },
  {
    id: 5,
    name: "Limitless FS2 Smartwatch",
    brand: "Fastrack",
    category: "Watches",
    subcategory: "Smart Watches",
    sku: "KA-FAS-005",
    price: 2499,
    oldPrice: 3999,
    discount: 38,
    stock: 45,
    rating: 4.4,
    reviews: 210,
    status: "Active",
    supplier: "Apex Timepieces Ltd.",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800",
    images: [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800",
      "https://images.unsplash.com/photo-1510519138195-068d828884bb?w=800",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"
    ],
    description: "1.91'' UltraVU HD Display with single-sync BT Calling, 100+ sports modes, AI voice assistant, and 7-day battery life.",
    highlights: [
      "1.91'' Curved UltraVU Crisp HD Display",
      "Single-Chip Bluetooth Calling with Noise Filter",
      "100+ Active Sports Tracking Modes",
      "Continuous Heart Rate & SpO2 Monitoring"
    ],
    specifications: {
      "Display": "1.91 inch HD Curved Display (240x296)",
      "Battery": "7 Days Typical Usage (300mAh)",
      "Connectivity": "Bluetooth 5.3",
      "Water Resistance": "IP68 Water & Dust Resistant",
      "Sensors": "HR, SpO2, Accelerometer, Sleep Tracker",
      "Warranty": "1 Year Manufacturer Warranty"
    },
    colors: ["Pitch Black", "Teal Blue", "Olive Green"],
    variants: ["Standard Strap", "Magnetic Strap"],
    variantDetails: {
      "Standard Strap": { priceModifier: 0, skuSuffix: "STD", stock: 30 },
      "Magnetic Strap": { priceModifier: 300, skuSuffix: "MAG", stock: 15 }
    }
  },
  {
    id: 6,
    name: "Heritage Visodate Automatic Chronograph",
    brand: "Tissot",
    category: "Watches",
    subcategory: "Swiss Made Watches",
    sku: "KA-TIS-006",
    price: 18999,
    oldPrice: 24999,
    discount: 24,
    stock: 8,
    rating: 4.9,
    reviews: 58,
    status: "Active",
    supplier: "Apex Timepieces Ltd.",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",
    images: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800",
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800"
    ],
    description: "Prestigious Swiss-made vintage automatic timepiece featuring domed sapphire crystal, exhibition case back with engraved rotor, and genuine embossed leather strap.",
    highlights: [
      "Swiss Powermatic 80 Automatic Movement",
      "80-Hour Power Reserve Engineering",
      "Vintage 1950s Heritage Curved Sapphire Glass",
      "See-Through Exhibition Exhibition Case Back"
    ],
    specifications: {
      "Material": "316L Stainless Steel & Calfskin Leather",
      "Movement": "Swiss Automatic Powermatic 80",
      "Glass": "Domed Scratch-Resistant Sapphire",
      "Water Resistance": "100m / 10 ATM",
      "Power Reserve": "80 Hours",
      "Warranty": "2 Years International Warranty"
    },
    colors: ["Silver Dial / Brown Strap", "Black Dial / Black Strap"],
    variants: ["Leather Strap", "Steel Bracelet"],
    variantDetails: {
      "Leather Strap": { priceModifier: 0, skuSuffix: "LEA", stock: 5 },
      "Steel Bracelet": { priceModifier: 1500, skuSuffix: "STL", stock: 3 }
    }
  },
  {
    id: 101,
    name: "Cosmograph Daytona Chronograph",
    brand: "Rolex",
    category: "Watches",
    subcategory: "Chronograph Watches",
    sku: "KA-ROL-DAY01",
    price: 64999,
    oldPrice: 79999,
    discount: 19,
    stock: 6,
    rating: 4.9,
    reviews: 62,
    status: "Active",
    supplier: "Apex Timepieces Ltd.",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800",
    images: [
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800",
      "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=800",
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800",
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800"
    ],
    description: "High-precision luxury chronograph with engraved tachymetric scale bezel, triple sub-dials, Oystersteel bracelet, and certified chronometer mechanical movement.",
    highlights: [
      "Calibre 4130 Perpetual Chronograph Movement",
      "Monobloc Cerachrom High-Tech Ceramic Bezel",
      "Tachymetric Scale for Speed Measurement",
      "Paraflex Shock Absorbers & Blue Parachrom Hairspring"
    ],
    specifications: {
      "Material": "Oystersteel 904L & Cerachrom",
      "Movement": "Calibre 4130 Perpetual Chronograph",
      "Glass": "Scratch-Resistant Sapphire Crystal",
      "Water Resistance": "100m / 10 ATM",
      "Case Size": "40 mm",
      "Warranty": "5 Years International Warranty"
    },
    colors: ["Panda White", "Onyx Black"],
    variants: ["Panda White Dial", "All Black"],
    variantDetails: {
      "Panda White Dial": { priceModifier: 0, skuSuffix: "WHT", stock: 4 },
      "All Black": { priceModifier: 0, skuSuffix: "BLK", stock: 2 }
    }
  },
  {
    id: 102,
    name: "Speedmaster Professional Co-Axial Chronograph",
    brand: "Omega",
    category: "Watches",
    subcategory: "Chronograph Watches",
    sku: "KA-OMG-SPD02",
    price: 45999,
    oldPrice: 59999,
    discount: 23,
    stock: 10,
    rating: 4.8,
    reviews: 44,
    status: "Active",
    supplier: "Apex Timepieces Ltd.",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800",
    images: [
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
      "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=800"
    ],
    description: "Legendary Speedmaster Moonwatch chronograph featuring a black step dial, sapphire crystal, and Master Chronometer certified co-axial movement.",
    highlights: [
      "Co-Axial Master Chronometer Calibre 3861",
      "Magnetic Resistance up to 15,000 Gauss",
      "Iconic Step Dial with Anodised Aluminum Bezel Ring",
      "Exquisite Micro-Adjust Clasp Bracelet"
    ],
    specifications: {
      "Material": "Stainless Steel Case & Bracelet",
      "Movement": "Co-Axial Master Chronometer Calibre 3861",
      "Glass": "Sapphire Crystal with Anti-Reflective Treatment",
      "Water Resistance": "50m / 5 ATM",
      "Power Reserve": "50 Hours",
      "Warranty": "5 Years International Warranty"
    },
    colors: ["Racing Black", "Blue Accent"],
    variants: ["Steel Bracelet", "Leather Strap"],
    variantDetails: {
      "Steel Bracelet": { priceModifier: 0, skuSuffix: "STL", stock: 6 },
      "Leather Strap": { priceModifier: -1000, skuSuffix: "LEA", stock: 4 }
    }
  },
  {
    id: 103,
    name: "Seiko 5 Sports Automatic Day-Date",
    brand: "Seiko",
    category: "Watches",
    subcategory: "Analog Watches",
    sku: "KA-SEI-SPO03",
    price: 14299,
    oldPrice: 19999,
    discount: 28,
    stock: 15,
    rating: 4.8,
    reviews: 36,
    status: "Active",
    supplier: "Apex Timepieces Ltd.",
    image: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800",
    images: [
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800"
    ],
    description: "Authentic Seiko 5 Sports automatic timepiece, thoroughly crafted with LumiBrite hands, exhibition case back, and tested for precise timekeeping.",
    highlights: [
      "Genuine Seiko 4R36 24-Jewel Automatic Calibre",
      "Day-Date Display Window in English/Roman",
      "LumiBrite Luminescent Glow on Hands and Indices",
      "Hardlex Scratch-Resistant Curved Crystal"
    ],
    specifications: {
      "Material": "Solid Stainless Steel",
      "Movement": "Genuine Seiko 4R36 24-Jewel Automatic",
      "Glass": "Hardlex Crystal",
      "Water Resistance": "100m / 10 ATM",
      "Case Thickness": "13.4 mm",
      "Warranty": "2 Years International Warranty"
    },
    colors: ["Sunburst Silver", "Champagne Gold"],
    variants: ["Steel Jubilee", "Leather Strap"],
    variantDetails: {
      "Steel Jubilee": { priceModifier: 0, skuSuffix: "JUB", stock: 10 },
      "Leather Strap": { priceModifier: -500, skuSuffix: "LEA", stock: 5 }
    }
  },

  // ================= BAGS & WALLETS =================
  {
    id: 7,
    name: "Executive Top-Grain Leather Briefcase",
    brand: "Hidesign",
    category: "Bags & Wallets",
    subcategory: "Leather Briefcases",
    sku: "KA-HID-007",
    price: 8499,
    oldPrice: 11999,
    discount: 29,
    stock: 15,
    rating: 4.8,
    reviews: 72,
    status: "Active",
    supplier: "Vogue Apparel India",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800"
    ],
    description: "Handcrafted vegetable-tanned genuine leather briefcase with padded 15.6-inch laptop compartment, solid brass hardware, and detachable shoulder strap.",
    highlights: [
      "100% Full-Grain Vegetable Tanned Leather",
      "Dedicated High-Density Padded 15.6'' Laptop Sleeve",
      "Heavy-Duty Solid Antiqued Brass Hardware",
      "Organized Multi-Pocket Interior with Key Leash"
    ],
    specifications: {
      "Material": "100% Genuine Vegetable-Tanned Leather",
      "Capacity": "Fits up to 15.6-inch Laptops + Documents",
      "Hardware": "Antique Solid Brass",
      "Dimensions": "40cm x 30cm x 9cm",
      "Weight": "1.2 kg",
      "Warranty": "1 Year International"
    },
    colors: ["Rich Cognac Brown", "Classic Black"],
    variants: ["Standard Briefcase", "Slim Edition"],
    variantDetails: {
      "Standard Briefcase": { priceModifier: 0, skuSuffix: "STD", stock: 10 },
      "Slim Edition": { priceModifier: -500, skuSuffix: "SLM", stock: 5 }
    }
  },
  {
    id: 8,
    name: "Modern Urban Backpack Pro 32L",
    brand: "Wildcraft",
    category: "Bags & Wallets",
    subcategory: "Backpacks",
    sku: "KA-WIL-008",
    price: 2499,
    oldPrice: 3499,
    discount: 29,
    stock: 40,
    rating: 4.6,
    reviews: 190,
    status: "Active",
    supplier: "Vogue Apparel India",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800"
    ],
    description: "Weatherproof 32-liter urban travel backpack with ergonomic AirMesh lumbar support, dedicated USB charging port pass-through, and rain cover included.",
    highlights: [
      "Weather-Resistant High-Density 900D Ballistic Fabric",
      "Integrated Integrated Rain Cover Stowed in Bottom Pocket",
      "Ergonomic AirMesh Lumbar & Shoulder Cushioning",
      "Airport Luggage Pass-Through Strap"
    ],
    specifications: {
      "Material": "High-Density Ballistic Polyester",
      "Volume": "32 Litres",
      "Compartments": "3 Main + 2 Side Water Bottle Sleeves",
      "Laptop Support": "Up to 16-inch MacBook / Laptops",
      "Warranty": "5 Years Manufacturer Warranty"
    },
    colors: ["Charcoal Grey", "Navy Blue", "Olive Tactical"],
    variants: ["32 Litres Standard"],
    variantDetails: {
      "32 Litres Standard": { priceModifier: 0, skuSuffix: "32L", stock: 40 }
    }
  },
  {
    id: 9,
    name: "Signature Monogram Tote Bag",
    brand: "Tommy Hilfiger",
    category: "Bags & Wallets",
    subcategory: "Women Totes",
    sku: "KA-TOM-009",
    price: 6999,
    oldPrice: 9999,
    discount: 30,
    stock: 20,
    rating: 4.7,
    reviews: 84,
    status: "Active",
    supplier: "Vogue Apparel India",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800"
    ],
    description: "Chic structured tote bag featuring iconic monogram detailing, premium faux-leather trim, magnetic closure, and removable matching zip pouch.",
    highlights: [
      "Signature Woven Jacquard Canvas Exterior",
      "Includes Detachable Matching Zippered Pouch",
      "Reinforced Vegan Leather Base & Top Carry Handles",
      "Gold-Plated Hardware Monogram Emblem"
    ],
    specifications: {
      "Material": "Premium Jacquard Canvas & Vegan Leather",
      "Closure": "Magnetic Snap with Zip Top",
      "Dimensions": "38cm x 28cm x 14cm",
      "Handle Drop": "24 cm",
      "Warranty": "1 Year Official Warranty"
    },
    colors: ["Navy / White Stripe", "Black Jacquard"],
    variants: ["Standard Tote Size"],
    variantDetails: {
      "Standard Tote Size": { priceModifier: 0, skuSuffix: "TOT", stock: 20 }
    }
  },

  // ================= SHOES =================
  {
    id: 10,
    name: "Air Zoom Pegasus Performance Running Shoes",
    brand: "Nike",
    category: "Shoes",
    subcategory: "Running Shoes",
    sku: "KA-NIK-010",
    price: 5499,
    oldPrice: 7499,
    discount: 27,
    stock: 32,
    rating: 4.6,
    reviews: 215,
    status: "Active",
    supplier: "Urban Footwear Co.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800"
    ],
    description: "Responsive cushioning in the Nike Air Zoom Pegasus provides a springy feel for everyday road and track runners with engineered breathable mesh.",
    highlights: [
      "Forefoot & Heel Nike Zoom Air Cushioning",
      "Engineered High-Breathability Flymesh Upper",
      "Durable Waffle-Inspired High-Traction Rubber Outsole",
      "Midfoot Band for Secure Dynamic Lockdown"
    ],
    specifications: {
      "Material": "Engineered Mesh Upper",
      "Sole": "Zoom Air Foam with Waffle Rubber",
      "Weight": "260g (UK 8)",
      "Drop": "10 mm",
      "Terrain": "Road & Track",
      "Warranty": "6 Months Brand Warranty"
    },
    colors: ["Crimson Red", "Triple Black", "Pure White"],
    variants: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
    variantDetails: {
      "UK 7": { priceModifier: 0, skuSuffix: "UK07", stock: 6 },
      "UK 8": { priceModifier: 0, skuSuffix: "UK08", stock: 10 },
      "UK 9": { priceModifier: 0, skuSuffix: "UK09", stock: 12 },
      "UK 10": { priceModifier: 0, skuSuffix: "UK10", stock: 4 },
      "UK 11": { priceModifier: 0, skuSuffix: "UK11", stock: 0 }
    }
  },
  {
    id: 11,
    name: "Ultraboost Light Primeknit Sneakers",
    brand: "Adidas",
    category: "Shoes",
    subcategory: "Running Shoes",
    sku: "KA-ADI-011",
    price: 6999,
    oldPrice: 9999,
    discount: 30,
    stock: 22,
    rating: 4.8,
    reviews: 180,
    status: "Active",
    supplier: "Urban Footwear Co.",
    image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800",
    images: [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800"
    ],
    description: "Experience epic energy return with Light BOOST cushioning technology and an adaptive Primeknit+ textile upper designed for ultimate comfort.",
    highlights: [
      "30% Lighter Light BOOST Energy Foam",
      "Primeknit+ Adaptive Sock-Like Foot Hug",
      "Continental™ Natural Rubber All-Weather Grip",
      "Linear Energy Push (LEP) Torsion System"
    ],
    specifications: {
      "Material": "Primeknit+ Textile with Recycled Ocean Yarn",
      "Sole": "Light BOOST with Continental Rubber",
      "Drop": "10mm (Heel: 30mm / Forefoot: 20mm)",
      "Weight": "293g",
      "Warranty": "6 Months Brand Warranty"
    },
    colors: ["Core Black", "Cloud White", "Solar Red"],
    variants: ["UK 7", "UK 8", "UK 9", "UK 10"],
    variantDetails: {
      "UK 7": { priceModifier: 0, skuSuffix: "UK07", stock: 5 },
      "UK 8": { priceModifier: 0, skuSuffix: "UK08", stock: 8 },
      "UK 9": { priceModifier: 0, skuSuffix: "UK09", stock: 7 },
      "UK 10": { priceModifier: 0, skuSuffix: "UK10", stock: 2 }
    }
  },
  {
    id: 12,
    name: "Nitro Velocity Street Sneakers",
    brand: "Puma",
    category: "Shoes",
    subcategory: "Sneakers",
    sku: "KA-PUM-012",
    price: 3999,
    oldPrice: 5499,
    discount: 27,
    stock: 19,
    rating: 4.5,
    reviews: 88,
    status: "Active",
    supplier: "Urban Footwear Co.",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800",
    images: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800"
    ],
    description: "Sleek low-boot street design infused with advanced NITRO foam for featherlight responsiveness and all-day urban walking comfort.",
    highlights: [
      "Nitrogen-Infused Responsive NITRO Foam",
      "PUMAGRIP Durable High-Traction Compound",
      "Engineered Monomesh Breathable Upper",
      "Reflective Accents for Low-Light Night Visibility"
    ],
    specifications: {
      "Material": "Synthetic Leather & Monomesh",
      "Sole": "PUMAGRIP High Traction Rubber",
      "Heel Height": "8 mm Drop",
      "Fastening": "Lace-Up",
      "Warranty": "6 Months Brand Warranty"
    },
    colors: ["White / Black", "All Black"],
    variants: ["UK 7", "UK 8", "UK 9", "UK 10"],
    variantDetails: {
      "UK 7": { priceModifier: 0, skuSuffix: "UK07", stock: 4 },
      "UK 8": { priceModifier: 0, skuSuffix: "UK08", stock: 7 },
      "UK 9": { priceModifier: 0, skuSuffix: "UK09", stock: 6 },
      "UK 10": { priceModifier: 0, skuSuffix: "UK10", stock: 2 }
    }
  },
  {
    id: 13,
    name: "Retro High OG Leather Sneakers",
    brand: "Jordan",
    category: "Shoes",
    subcategory: "High Tops",
    sku: "KA-JOR-013",
    price: 14999,
    oldPrice: 17999,
    discount: 17,
    stock: 10,
    rating: 4.9,
    reviews: 140,
    status: "Active",
    supplier: "Urban Footwear Co.",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800",
    images: [
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800"
    ],
    description: "Iconic high-top silhouette in premium genuine tumbled leather with encapsulated Air-Sole unit and legendary basketball legacy.",
    highlights: [
      "100% Genuine Tumbled Premium Leather Upper",
      "Encapsulated Air-Sole Unit in Heel for Lightweight Cushioning",
      "Solid Rubber Outsole with Deep Forefoot Flex Grooves",
      "Debossed Wings Logo and Classic Padded Collar"
    ],
    specifications: {
      "Material": "Full-Grain Genuine Leather",
      "Sole": "Rubber Cupsole with Air Cushioning",
      "Cut": "High-Top",
      "Insole": "Molded PU Foam",
      "Warranty": "6 Months Authenticity Guarantee"
    },
    colors: ["Chicago Red / White / Black", "Shadow Grey"],
    variants: ["UK 8", "UK 9", "UK 10", "UK 11"],
    variantDetails: {
      "UK 8": { priceModifier: 0, skuSuffix: "UK08", stock: 3 },
      "UK 9": { priceModifier: 0, skuSuffix: "UK09", stock: 4 },
      "UK 10": { priceModifier: 0, skuSuffix: "UK10", stock: 2 },
      "UK 11": { priceModifier: 0, skuSuffix: "UK11", stock: 1 }
    }
  },

  // ================= MOBILES =================
  {
    id: 14,
    name: "Galaxy S26 Ultra 5G (AI Titanium)",
    brand: "Samsung",
    category: "Mobiles",
    subcategory: "Flagship Smartphones",
    sku: "KA-SAM-014",
    price: 114999,
    oldPrice: 129999,
    discount: 12,
    stock: 12,
    rating: 4.9,
    reviews: 340,
    status: "Active",
    supplier: "Global Gadgets Inc.",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800",
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800",
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800"
    ],
    description: "Next-generation titanium design equipped with Galaxy AI, 200MP Quad Telephoto Camera system, S-Pen built-in, and Snapdragon 8 Gen 4 chipset.",
    highlights: [
      "200MP Quad Telephoto Camera with 100x Space Zoom",
      "Galaxy AI (Live Call Translate, Note Assist, Circle to Search)",
      "Built-in Precision S-Pen Stylus with Air Actions",
      "Armor Titanium Frame with Gorilla Glass Armor"
    ],
    specifications: {
      "Display": "6.8 inch Dynamic AMOLED 2X 120Hz (2600 nits)",
      "Storage": "256GB / 512GB UFS 4.0",
      "RAM": "12GB LPDDR5X",
      "Processor": "Snapdragon 8 Gen 4 for Galaxy (3nm)",
      "Camera": "200MP + 50MP + 12MP + 10MP (8K Video)",
      "Battery": "5000mAh with 45W Fast Charging",
      "Warranty": "1 Year Brand Warranty"
    },
    colors: ["Titanium Black", "Titanium Gray", "Titanium Violet"],
    variants: ["12GB / 256GB", "12GB / 512GB"],
    variantDetails: {
      "12GB / 256GB": { priceModifier: 0, skuSuffix: "256GB", stock: 8 },
      "12GB / 512GB": { priceModifier: 15000, skuSuffix: "512GB", stock: 4 }
    }
  },
  {
    id: 15,
    name: "iPhone 16 Pro Max (Grade 5 Titanium)",
    brand: "Apple",
    category: "Mobiles",
    subcategory: "Flagship Smartphones",
    sku: "KA-APP-015",
    price: 139900,
    oldPrice: 149900,
    discount: 7,
    stock: 8,
    rating: 5.0,
    reviews: 520,
    status: "Active",
    supplier: "Global Gadgets Inc.",
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800",
    images: [
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800",
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800"
    ],
    description: "Forged in grade 5 titanium with Apple Intelligence, revolutionary A18 Pro chip, 48MP Fusion camera with 5x Telephoto, and industry-leading battery longevity.",
    highlights: [
      "Aerospace-Grade Grade 5 Titanium Architecture",
      "A18 Pro 3nm Silicon with 6-Core GPU & Hardware Ray Tracing",
      "48MP Fusion Camera with 5x Optical Telephoto Zoom",
      "Dedicated Camera Control Button with Haptic Feedback"
    ],
    specifications: {
      "Display": "6.9 inch Super Retina XDR OLED (120Hz ProMotion)",
      "Storage": "256GB / 512GB / 1TB NVMe",
      "Chipset": "Apple A18 Pro Bionic with 16-Core Neural Engine",
      "Camera": "48MP Main + 48MP Ultra-Wide + 12MP 5x Telephoto",
      "Battery": "Up to 33 hours video playback (USB-C 3.0)",
      "Water Resistance": "IP68 (6m depth for up to 30 mins)",
      "Warranty": "1 Year Official Apple India Warranty"
    },
    colors: ["Desert Titanium", "Natural Titanium", "Black Titanium"],
    variants: ["256GB", "512GB", "1TB"],
    variantDetails: {
      "256GB": { priceModifier: 0, skuSuffix: "256GB", stock: 4 },
      "512GB": { priceModifier: 20000, skuSuffix: "512GB", stock: 3 },
      "1TB": { priceModifier: 40000, skuSuffix: "1TB", stock: 1 }
    }
  },
  {
    id: 16,
    name: "OnePlus 13 5G Hasselblad Edition",
    brand: "OnePlus",
    category: "Mobiles",
    subcategory: "Flagship Smartphones",
    sku: "KA-ONE-016",
    price: 64999,
    oldPrice: 69999,
    discount: 7,
    stock: 15,
    rating: 4.7,
    reviews: 140,
    status: "Active",
    supplier: "Global Gadgets Inc.",
    image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800",
    images: [
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800",
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800"
    ],
    description: "Hasselblad 4th Gen Mobile Camera, 100W SUPERVOOC fast charge with 6000mAh silicon-carbon battery and ultra-smooth 2K 120Hz Oriental Screen.",
    highlights: [
      "Hasselblad Color Calibration with Triple 50MP Sony Sensors",
      "100W SUPERVOOC Flash Charge + 50W AIRVOOC Wireless",
      "6000mAh Massive Glacier Silicon-Carbon Battery",
      "Qualcomm Snapdragon 8 Gen 4 Processor"
    ],
    specifications: {
      "Display": "6.82 inch 2K ProXDR 120Hz (4500 nits peak)",
      "Storage": "256GB / 512GB UFS 4.0",
      "RAM": "16GB / 24GB LPDDR5X",
      "Battery": "6000mAh with 100W Charging (0-100% in 26 min)",
      "Water Resistance": "IP68 & IP69 Extreme Rating",
      "Warranty": "1 Year Brand Warranty"
    },
    colors: ["Emerald Silk", "Midnight Obsidian"],
    variants: ["16GB / 256GB", "16GB / 512GB"],
    variantDetails: {
      "16GB / 256GB": { priceModifier: 0, skuSuffix: "256GB", stock: 10 },
      "16GB / 512GB": { priceModifier: 6000, skuSuffix: "512GB", stock: 5 }
    }
  },

  // ================= CLOTHES & FASHION =================
  {
    id: 17,
    name: "Original 501 Straight Fit Denim Jeans",
    brand: "Levis",
    category: "Clothes & Fashion",
    subcategory: "Denim & Jeans",
    sku: "KA-LEV-017",
    price: 2999,
    oldPrice: 3999,
    discount: 25,
    stock: 36,
    rating: 4.7,
    reviews: 95,
    status: "Active",
    supplier: "Vogue Apparel India",
    image: "https://images.unsplash.com/photo-1542272604-780c96856592?w=800",
    images: [
      "https://images.unsplash.com/photo-1542272604-780c96856592?w=800",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800"
    ],
    description: "The iconic straight fit with signature button fly crafted from 100% heavyweight cotton denim that molds uniquely to your body over time.",
    highlights: [
      "Timeless Signature 5-Pocket Styling with Copper Rivets",
      "Original Straight Leg with Iconic Button Fly",
      "100% Premium Heavyweight Non-Stretch Cotton Denim",
      "Two-Horse Leather Patch on Back Waistband"
    ],
    specifications: {
      "Material": "100% Premium Cotton Denim (14 oz)",
      "Fit": "Original Straight Leg (Sits at Waist)",
      "Closure": "Classic Button Fly",
      "Care": "Machine Wash Cold Inside Out",
      "Warranty": "100% Original Brand Guarantee"
    },
    colors: ["Dark Indigo", "Light Stone Wash", "Vintage Black"],
    variants: ["30W 32L", "32W 32L", "34W 32L", "36W 32L"],
    variantDetails: {
      "30W 32L": { priceModifier: 0, skuSuffix: "30W", stock: 8 },
      "32W 32L": { priceModifier: 0, skuSuffix: "32W", stock: 12 },
      "34W 32L": { priceModifier: 0, skuSuffix: "34W", stock: 10 },
      "36W 32L": { priceModifier: 0, skuSuffix: "36W", stock: 6 }
    }
  },
  {
    id: 18,
    name: "Tailored Slim Fit Italian Blazer",
    brand: "Zara",
    category: "Clothes & Fashion",
    subcategory: "Blazers & Suits",
    sku: "KA-ZAR-018",
    price: 5999,
    oldPrice: 7999,
    discount: 25,
    stock: 14,
    rating: 4.6,
    reviews: 62,
    status: "Active",
    supplier: "Vogue Apparel India",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800",
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800",
      "https://images.unsplash.com/photo-1542272604-780c96856592?w=800",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800"
    ],
    description: "Modern unstructured slim fit blazer with peak lapels, flap pockets, and breathable stretch wool-blend fabric for business and evening formal wear.",
    highlights: [
      "Unstructured Tailored Italian Slim Silhouette",
      "Breathable Stretch Wool & Fine Viscose Weave",
      "Twin Side Vents and Kissing Horn Button Cuffs",
      "100% Breathable Acetate Silk Full Inner Lining"
    ],
    specifications: {
      "Material": "70% Wool, 28% Viscose, 2% Elastane",
      "Fit": "Tailored Slim Fit",
      "Lining": "100% Acetate Silk",
      "Lapel": "Notch Lapel with Boutonniere Hole",
      "Care": "Dry Clean Only",
      "Warranty": "Boutique Quality Guarantee"
    },
    colors: ["Navy Blue", "Charcoal Gray"],
    variants: ["38 (M)", "40 (L)", "42 (XL)"],
    variantDetails: {
      "38 (M)": { priceModifier: 0, skuSuffix: "38M", stock: 5 },
      "40 (L)": { priceModifier: 0, skuSuffix: "40L", stock: 6 },
      "42 (XL)": { priceModifier: 0, skuSuffix: "42XL", stock: 3 }
    }
  },

  // ================= LAPTOPS =================
  {
    id: 19,
    name: "XPS 15 OLED InfinityEdge Laptop",
    brand: "Dell",
    category: "Laptops",
    subcategory: "Professional Laptops",
    sku: "KA-DEL-019",
    price: 134999,
    oldPrice: 149999,
    discount: 10,
    stock: 7,
    rating: 4.8,
    reviews: 110,
    status: "Active",
    supplier: "Optima Tech Solutions",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
      "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"
    ],
    description: "Ultra-premium CNC machined aluminum chassis with 3.5K OLED touchscreen, Intel Core Ultra 9 processor, NVIDIA RTX 4070 Graphics, and 64GB DDR5 RAM.",
    highlights: [
      "15.6'' 3.5K (3456x2160) OLED InfinityEdge Touchscreen",
      "Intel Core Ultra 9 185H (16 Cores / AI Boost NPU)",
      "NVIDIA GeForce RTX 4070 8GB GDDR6 Dedicated Graphics",
      "Carbon Fiber Palm Rest with Seamless Glass Haptic Trackpad"
    ],
    specifications: {
      "Processor": "Intel Core Ultra 9 185H (16 Cores, up to 5.1 GHz)",
      "Graphics": "NVIDIA GeForce RTX 4070 8GB GDDR6",
      "RAM": "32GB / 64GB DDR5 5600MHz Dual Channel",
      "Storage": "1TB / 2TB PCIe Gen4 NVMe SSD",
      "Display": "15.6 inch 3.5K (3456x2160) OLED Touch (100% DCI-P3)",
      "Battery": "86Whr with 130W Type-C Fast Charger",
      "Warranty": "2 Years On-Site Hardware Support"
    },
    colors: ["Platinum Silver with Black Carbon Fiber"],
    variants: ["32GB / 1TB SSD", "64GB / 2TB SSD"],
    variantDetails: {
      "32GB / 1TB SSD": { priceModifier: 0, skuSuffix: "1TB", stock: 4 },
      "64GB / 2TB SSD": { priceModifier: 25000, skuSuffix: "2TB", stock: 3 }
    }
  },
  {
    id: 20,
    name: "MacBook Pro 16'' Liquid Retina XDR",
    brand: "Apple",
    category: "Laptops",
    subcategory: "Flagship Laptops",
    sku: "KA-APP-020",
    price: 199900,
    oldPrice: 219900,
    discount: 9,
    stock: 5,
    rating: 5.0,
    reviews: 92,
    status: "Active",
    supplier: "Optima Tech Solutions",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
      "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"
    ],
    description: "Driven by M3 Max chip with 16-core CPU and 40-core GPU, stunning Liquid Retina XDR display, up to 22 hours battery life, and studio-quality mics.",
    highlights: [
      "Apple M3 Max Chip (16-Core CPU / 40-Core GPU / 128GB Unified Capable)",
      "16.2'' Liquid Retina XDR (1000 nits sustained, 1600 nits peak)",
      "Up to 22 Hours Battery Life with MagSafe 3 Fast Charging",
      "Studio-Quality 6-Speaker Sound System with Spatial Audio"
    ],
    specifications: {
      "Processor": "Apple M3 Max Chip (16 CPU / 40 GPU / 16 Neural)",
      "RAM": "36GB / 48GB Unified Memory",
      "Storage": "1TB / 2TB High-Speed NVMe SSD",
      "Display": "16.2-inch Liquid Retina XDR (3456x2234 at 120Hz)",
      "Ports": "3x Thunderbolt 4, HDMI, SDXC, MagSafe 3",
      "Warranty": "1 Year Official AppleCare Warranty"
    },
    colors: ["Space Black", "Silver"],
    variants: ["36GB / 1TB", "48GB / 2TB"],
    variantDetails: {
      "36GB / 1TB": { priceModifier: 0, skuSuffix: "1TB", stock: 3 },
      "48GB / 2TB": { priceModifier: 40000, skuSuffix: "2TB", stock: 2 }
    }
  },

  // ================= ELECTRONICS =================
  {
    id: 21,
    name: "WH-1000XM5 Noise Cancelling Headphones",
    brand: "Sony",
    category: "Electronics",
    subcategory: "Over-Ear Headphones",
    sku: "KA-SON-021",
    price: 24990,
    oldPrice: 29990,
    discount: 17,
    stock: 20,
    rating: 4.9,
    reviews: 286,
    status: "Active",
    supplier: "Global Gadgets Inc.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800",
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800",
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800"
    ],
    description: "Industry-leading noise cancellation with two processors and eight microphones for unprecedented sound clarity, crystal clear hands-free calls, and 30-hour battery.",
    highlights: [
      "Industry-Leading Active Noise Cancelling with Auto NC Optimizer",
      "Dual Integrated Processors V1 + HD QN1 with 8 Microphones",
      "30-Hour Battery Life (3-minute charge = 3 hours playback)",
      "High-Resolution Audio Wireless with LDAC and DSEE Extreme"
    ],
    specifications: {
      "Battery Life": "30 Hours with ANC On (40h ANC Off)",
      "Driver": "30mm Precision Engineered Carbon Fiber",
      "Connectivity": "Bluetooth 5.2, Multipoint Connection, LDAC, AUX",
      "Microphones": "8 Beamforming Mics with AI Noise Reduction",
      "Weight": "250g",
      "Warranty": "1 Year Official Sony India Warranty"
    },
    colors: ["Silver Grey", "Midnight Black", "Smoky Pink"],
    variants: ["Standard Edition"],
    variantDetails: {
      "Standard Edition": { priceModifier: 0, skuSuffix: "STD", stock: 20 }
    }
  },
  {
    id: 22,
    name: "QuietComfort Ultra Spatial Audio Earbuds",
    brand: "Bose",
    category: "Electronics",
    subcategory: "True Wireless Earbuds",
    sku: "KA-BOS-022",
    price: 21999,
    oldPrice: 25999,
    discount: 15,
    stock: 16,
    rating: 4.8,
    reviews: 142,
    status: "Active",
    supplier: "Global Gadgets Inc.",
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800",
    images: [
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800",
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800"
    ],
    description: "Breakthrough immersive spatial audio, world-class active noise cancellation, and CustomTune technology that personalizes sound to the shape of your ears.",
    highlights: [
      "Bose Immersive Spatial Audio for Natural Soundstage",
      "CustomTune Technology Calibrates Sound to Your Ear Canal",
      "Quiet Mode, Aware Mode with ActiveSense Transparency",
      "3 Sizes of Umbrella Ear Tips and Stability Bands Included"
    ],
    specifications: {
      "Battery": "6 Hours Earbuds + 18 Hours Case (24h total)",
      "Noise Cancellation": "CustomTune Multi-Mic Active ANC",
      "Water Resistance": "IPX4 Sweat & Splash Resistant",
      "Bluetooth": "Bluetooth 5.3 with Snapdragon Sound aptX Lossless",
      "Warranty": "1 Year Brand Warranty"
    },
    colors: ["Black", "White Smoke"],
    variants: ["Single Size with 3 Ear Tip Pairs"],
    variantDetails: {
      "Single Size with 3 Ear Tip Pairs": { priceModifier: 0, skuSuffix: "TWS", stock: 16 }
    }
  },

  // ================= GAMING & ACCESSORIES =================
  {
    id: 23,
    name: "BlackWidow V4 Pro RGB Mechanical Keyboard",
    brand: "Razer",
    category: "Gaming",
    subcategory: "Gaming Peripherals",
    sku: "KA-RAZ-023",
    price: 18499,
    oldPrice: 21999,
    discount: 16,
    stock: 11,
    rating: 4.8,
    reviews: 98,
    status: "Active",
    supplier: "Global Gadgets Inc.",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800",
    images: [
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800"
    ],
    description: "Command dial with 8 dedicated macro keys, Razer Green clicky mechanical switches, magnetic plush wrist rest with underglow, and 8000Hz polling rate.",
    highlights: [
      "Razer Command Dial with 4 Dedicated Custom Macro Buttons",
      "True 8,000Hz HyperPolling Rate (0.125ms Response)",
      "Magnetic Plush Leatherette Wrist Rest with Underglow Lighting",
      "Doubleshot ABS Keycaps with Sound Dampening Internal Foam"
    ],
    specifications: {
      "Switches": "Razer Green (Clicky) / Yellow (Linear) Switches",
      "Polling Rate": "Up to 8,000 Hz",
      "Lighting": "Per-Key Razer Chroma RGB + 38-Zone Underglow",
      "Cable": "Detachable Braided Type-C",
      "Warranty": "2 Years Official Warranty"
    },
    colors: ["Classic Black"],
    variants: ["Green Switches", "Yellow Linear Switches"],
    variantDetails: {
      "Green Switches": { priceModifier: 0, skuSuffix: "GRN", stock: 7 },
      "Yellow Linear Switches": { priceModifier: 0, skuSuffix: "YEL", stock: 4 }
    }
  },
  {
    id: 24,
    name: "Aviator Classic Polarized Sunglasses",
    brand: "Ray-Ban",
    category: "Fashion Accessories",
    subcategory: "Luxury Eyewear",
    sku: "KA-RAY-024",
    price: 7990,
    oldPrice: 9990,
    discount: 20,
    stock: 24,
    rating: 4.9,
    reviews: 175,
    status: "Active",
    supplier: "Vogue Apparel India",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800",
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800"
    ],
    description: "Timeless teardrop pilot shape in polished gold metal frame with crystal green G-15 polarized lenses providing 100% UV protection and glare elimination.",
    highlights: [
      "Original 1937 Pilot Teardrop Metal Frame Design",
      "Crystal G-15 Polarized Lenses (Absorbs 85% Visible Light)",
      "100% UV400 Protection with Glare Elimination",
      "Includes Genuine Leather Ray-Ban Case & Microfiber Cloth"
    ],
    specifications: {
      "Frame Material": "Polished Corrosion-Resistant Metal",
      "Lens Material": "Mineral Glass Crystal Polarized G-15",
      "Bridge Width": "14 mm",
      "Temple Length": "135 mm",
      "UV Protection": "100% UV400 Polarized",
      "Warranty": "2 Years International Warranty"
    },
    colors: ["Gold / Green Classic G-15", "Gunmetal / Polarized Grey"],
    variants: ["Standard 58mm", "Large 62mm"],
    variantDetails: {
      "Standard 58mm": { priceModifier: 0, skuSuffix: "58MM", stock: 16 },
      "Large 62mm": { priceModifier: 500, skuSuffix: "62MM", stock: 8 }
    }
  },
  {
    id: 25,
    name: "Apple Watch Ultra 2 (Titanium GPS + Cellular)",
    brand: "Apple",
    category: "Smart Gadgets",
    subcategory: "Smart Wearables",
    sku: "KA-APP-025",
    price: 89900,
    oldPrice: 94900,
    discount: 5,
    stock: 15,
    rating: 4.9,
    reviews: 130,
    status: "Active",
    supplier: "Global Gadgets Inc.",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800",
    images: [
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800",
      "https://images.unsplash.com/photo-1510519138195-068d828884bb?w=800",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"
    ],
    description: "Rugged 49mm aerospace-grade titanium casing, dual-frequency precision GPS, up to 72 hours battery life in low power mode, and 100m water resistance.",
    highlights: [
      "49mm Aerospace-Grade Titanium Case with Flat Sapphire Front",
      "S9 SiP with Double Tap Gesture & On-Device Siri",
      "3000 nits Always-On Retina Display (Brightest Apple Screen)",
      "Precision Dual-Frequency L1 & L5 GPS Architecture"
    ],
    specifications: {
      "Case": "49mm Natural Aerospace Titanium",
      "Display": "Always-On OLED Retina (3000 nits peak)",
      "Battery": "Up to 36 Hours Normal (72h Low Power Mode)",
      "Water Resistance": "100m Water Resistant / 40m Recreational Dive (EN13319)",
      "Sensors": "ECG, Blood Oxygen, Depth Gauge, Water Temperature, Siren",
      "Warranty": "1 Year Official AppleCare Warranty"
    },
    colors: ["Titanium / Orange Ocean Band", "Titanium / Midnight Ocean Band"],
    variants: ["49mm GPS + Cellular"],
    variantDetails: {
      "49mm GPS + Cellular": { priceModifier: 0, skuSuffix: "ULT", stock: 15 }
    }
  },
  {
    id: 26,
    name: "Forerunner 965 AMOLED Premium Multisport Watch",
    brand: "Garmin",
    category: "Fitness",
    subcategory: "Fitness Trackers",
    sku: "KA-GAR-026",
    price: 67490,
    oldPrice: 74990,
    discount: 10,
    stock: 12,
    rating: 4.8,
    reviews: 86,
    status: "Active",
    supplier: "Global Gadgets Inc.",
    image: "https://images.unsplash.com/photo-1510519138195-068d828884bb?w=800",
    images: [
      "https://images.unsplash.com/photo-1510519138195-068d828884bb?w=800",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"
    ],
    description: "Brilliant 1.4-inch AMOLED touchscreen display, titanium bezel, advanced training metrics, built-in full-color mapping, and up to 23 days battery life.",
    highlights: [
      "1.4'' High-Resolution AMOLED Touchscreen Display",
      "Titanium Bezel with Corning® Gorilla® Glass DX",
      "Full-Color TopoActive Maps with NextFork™ Navigation",
      "Up to 23 Days Battery Life in Smartwatch Mode (31h GPS)"
    ],
    specifications: {
      "Display": "1.4 inch AMOLED (454x454 pixels)",
      "Battery": "Up to 23 Days Smartwatch (31h GPS Mode)",
      "Bezel Material": "Grade 5 Titanium",
      "Sensors": "Multi-Band SatIQ GPS, Elevate Gen 4 HR, Pulse Ox",
      "Water Rating": "5 ATM (50 meters)",
      "Warranty": "2 Years Official Garmin Warranty"
    },
    colors: ["Black / Powder Gray", "Whitestone / Powder Gray"],
    variants: ["Standard Titanium Edition"],
    variantDetails: {
      "Standard Titanium Edition": { priceModifier: 0, skuSuffix: "GAR", stock: 12 }
    }
  }
];

// Initial default reviews
const defaultProductReviews = {
  1: [
    { id: 101, user: "Anand Verma", rating: 5, date: "24 Aug 2026", title: "Masterpiece craftsmanship", text: "The dial finish and sapphire crystal are spectacular. Received the genuine certificate and Titan warranty booklet in an exquisite wooden case.", verified: true },
    { id: 102, user: "Meera Patel", rating: 5, date: "18 Aug 2026", title: "Luxury feel on wrist", text: "Lightweight yet sturdy surgical steel. Express shipping delivered to Surat within 24 hours.", verified: true }
  ],
  4: [
    { id: 103, user: "Karan Singhania", rating: 5, date: "29 Aug 2026", title: "Pure luxury aesthetic", text: "The ceramic bezel glides smoothly. Super premium weight and luminescence. Worth every rupee.", verified: true }
  ],
  10: [
    { id: 104, user: "Devansh Shah", rating: 5, date: "20 Aug 2026", title: "Exceptional marathon comfort", text: "Zoom Air foam is super responsive. Authentic Nike India barcode confirmed on box.", verified: true }
  ],
  15: [
    { id: 105, user: "Rohan Nair", rating: 5, date: "02 Sep 2026", title: "Desert Titanium is stunning", text: "A18 Pro processing speed is unreal. Battery easily lasts nearly 2 full days. 100% authentic sealed retail packaging.", verified: true }
  ]
};

export function getWatchTypes() {
  return [];
}

export function getProducts() {
  const data = localStorage.getItem(PRODUCTS_KEY);
  let list = defaultProducts;
  if (data) {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        list = parsed;
      }
    } catch {
      list = defaultProducts;
    }
  } else {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts));
    return defaultProducts;
  }

  // Clean up legacy replica data, ensure full image sets & specs for default items
  const sanitized = list.map(p => {
    const clean = { ...p };
    delete clean.watchType;
    if (clean.specifications && clean.specifications["Quality Type"]) {
      const specs = { ...clean.specifications };
      delete specs["Quality Type"];
      clean.specifications = specs;
    }

    // Merge default images/highlights/variants if product matches default ID
    const defaultMatch = defaultProducts.find(dp => Number(dp.id) === Number(clean.id));
    if (defaultMatch) {
      if (!clean.images || clean.images.length <= 1) {
        clean.images = defaultMatch.images;
      }
      if (!clean.highlights || clean.highlights.length === 0) {
        clean.highlights = defaultMatch.highlights;
      }
      if (!clean.variantDetails) {
        clean.variantDetails = defaultMatch.variantDetails;
      }
      if (!clean.colors || clean.colors.length === 0) {
        clean.colors = defaultMatch.colors;
      }
      if (!clean.variants || clean.variants.length === 0) {
        clean.variants = defaultMatch.variants;
      }
    }

    // Fix any old replica product names if stored in localStorage
    if (clean.id === 4 && clean.name?.includes("Tribute")) {
      clean.name = "Submariner Date 41mm Oystersteel";
    }
    if (clean.id === 101 && (clean.name?.includes("Replica") || clean.name?.includes("Lookalike"))) {
      clean.name = "Cosmograph Daytona Chronograph";
    }
    if (clean.id === 102 && clean.name?.includes("Racing Edition Quartz")) {
      clean.name = "Speedmaster Professional Co-Axial Chronograph";
    }
    return clean;
  });

  return sanitized;
}

export const getStoredProducts = getProducts;

export function getProductById(id) {
  const products = getProducts();
  return products.find(p => Number(p.id) === Number(id)) || null;
}

export function saveProduct(product) {
  const products = getProducts();
  let updated;
  if (product.id) {
    const index = products.findIndex(p => Number(p.id) === Number(product.id));
    if (index !== -1) {
      updated = products.map(p => Number(p.id) === Number(product.id) ? { ...p, ...product } : p);
    } else {
      updated = [product, ...products];
    }
  } else {
    updated = [{ ...product, id: Date.now() }, ...products];
  }
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('productsUpdated'));
  return updated;
}

export function addStoreProduct(product) {
  return saveProduct(product);
}

export function updateStoreProduct(id, updatedProduct) {
  return saveProduct({ ...updatedProduct, id: Number(id) });
}

export function deleteProduct(id) {
  const products = getProducts();
  const updated = products.filter(p => Number(p.id) !== Number(id));
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('productsUpdated'));
  return updated;
}

export const deleteStoreProduct = deleteProduct;

// ================= CATEGORIES MANAGEMENT =================

export function getCategories() {
  const data = localStorage.getItem(CATEGORIES_KEY);
  if (!data) {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(defaultCategories));
    return defaultCategories;
  }
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultCategories;
  } catch {
    return defaultCategories;
  }
}

export function addCategory(category) {
  const categories = getCategories();
  const trimmed = category.trim();
  if (trimmed && !categories.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
    const updated = [...categories, trimmed];
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('categoriesUpdated'));
    return updated;
  }
  return categories;
}

export function deleteCategory(category) {
  const categories = getCategories();
  const updated = categories.filter(item => item !== category);
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('categoriesUpdated'));
  return updated;
}

// ================= BRANDS MANAGEMENT =================

export function getBrands() {
  const data = localStorage.getItem(BRANDS_KEY);
  if (!data) {
    localStorage.setItem(BRANDS_KEY, JSON.stringify(defaultBrands));
    return defaultBrands;
  }
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultBrands;
  } catch {
    return defaultBrands;
  }
}

export function addBrand(brand) {
  const brands = getBrands();
  const trimmed = brand.trim();
  if (trimmed && !brands.some(b => b.toLowerCase() === trimmed.toLowerCase())) {
    const updated = [...brands, trimmed];
    localStorage.setItem(BRANDS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('brandsUpdated'));
    return updated;
  }
  return brands;
}

export function deleteBrand(brand) {
  const brands = getBrands();
  const updated = brands.filter(item => item !== brand);
  localStorage.setItem(BRANDS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('brandsUpdated'));
  return updated;
}

// Dynamic brand finder for specific category
export function getBrandsByCategory(categoryName) {
  if (!categoryName || categoryName === 'All') {
    return getBrands();
  }
  if (categoryBrandMap[categoryName]) {
    return categoryBrandMap[categoryName];
  }
  const products = getProducts();
  const brandsInCat = new Set(
    products.filter(p => p.category?.toLowerCase() === categoryName.toLowerCase()).map(p => p.brand).filter(Boolean)
  );
  return brandsInCat.size > 0 ? Array.from(brandsInCat) : getBrands().slice(0, 6);
}

// ================= WISHLIST MANAGEMENT =================

export function getWishlist() {
  try {
    const data = localStorage.getItem(WISHLIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function isInWishlist(productId) {
  const list = getWishlist();
  return list.some(item => Number(item.id) === Number(productId));
}

export function toggleWishlist(product) {
  const list = getWishlist();
  const exists = list.some(item => Number(item.id) === Number(product.id));
  let updated;
  if (exists) {
    updated = list.filter(item => Number(item.id) !== Number(product.id));
  } else {
    updated = [{
      id: product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      oldPrice: product.oldPrice,
      discount: product.discount,
      rating: product.rating,
      image: product.image || product.images?.[0],
      stock: product.stock
    }, ...list];
  }
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('wishlistUpdated'));
  return !exists;
}

export function removeFromWishlist(productId) {
  const list = getWishlist();
  const updated = list.filter(item => Number(item.id) !== Number(productId));
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('wishlistUpdated'));
  return updated;
}

export function clearWishlist() {
  localStorage.removeItem(WISHLIST_KEY);
  window.dispatchEvent(new Event('wishlistUpdated'));
}

// ================= REVIEWS MANAGEMENT =================

export function getProductReviews(productId) {
  try {
    const data = localStorage.getItem(REVIEWS_KEY);
    const allReviews = data ? JSON.parse(data) : defaultProductReviews;
    return allReviews[productId] || defaultProductReviews[productId] || [];
  } catch {
    return defaultProductReviews[productId] || [];
  }
}

export function addProductReview(productId, review) {
  try {
    const data = localStorage.getItem(REVIEWS_KEY);
    const allReviews = data ? JSON.parse(data) : { ...defaultProductReviews };
    const current = allReviews[productId] || [];
    const newReview = {
      id: Date.now(),
      user: review.user || "Verified Customer",
      rating: Number(review.rating) || 5,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      title: review.title || "Excellent quality",
      text: review.text || "",
      verified: true
    };
    allReviews[productId] = [newReview, ...current];
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(allReviews));
    window.dispatchEvent(new Event('reviewsUpdated'));
    return allReviews[productId];
  } catch (err) {
    console.error('Error adding review:', err);
    return [];
  }
}