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
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900&q=80",
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=900&q=80",
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=900&q=80"
    ],
    imageAngles: [
      "Front Dial View",
      "45° Perspective Angle",
      "Crown & Sapphire Glass",
      "On-Wrist Styling"
    ],
    description: "Handcrafted luxury automatic analog watch with premium sapphire crystal glass, surgical-grade stainless steel dial, and water resistance up to 50 meters.",
    specifications: {
      Material: "316L Stainless Steel",
      Movement: "Japanese Automatic Quartz",
      Glass: "Sapphire Crystal",
      WaterResistance: "50m / 5 ATM",
      Warranty: "2 Years International Warranty"
    },
    colors: ["Champagne Gold", "Classic Silver", "Midnight Black"],
    colorMap: {
      "Champagne Gold": { hex: "#D4AF37", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80" },
      "Classic Silver": { hex: "#D1D5DB", image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900&q=80" },
      "Midnight Black": { hex: "#111827", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=900&q=80" }
    },
    sizes: ["38mm Case", "40mm Case", "42mm Case"],
    variants: ["Stainless Steel Bracelet", "Italian Leather Strap"],
    variationMatrix: [
      { color: "Champagne Gold", size: "38mm Case", variant: "Stainless Steel Bracelet", price: 4999, oldPrice: 6999, stock: 12, sku: "KA-TIT-001-GLD-38" },
      { color: "Champagne Gold", size: "40mm Case", variant: "Stainless Steel Bracelet", price: 5499, oldPrice: 7499, stock: 8, sku: "KA-TIT-001-GLD-40" },
      { color: "Champagne Gold", size: "42mm Case", variant: "Stainless Steel Bracelet", price: 5999, oldPrice: 7999, stock: 5, sku: "KA-TIT-001-GLD-42" },
      { color: "Classic Silver", size: "38mm Case", variant: "Stainless Steel Bracelet", price: 4799, oldPrice: 6699, stock: 14, sku: "KA-TIT-001-SLV-38" },
      { color: "Classic Silver", size: "40mm Case", variant: "Stainless Steel Bracelet", price: 5299, oldPrice: 7199, stock: 9, sku: "KA-TIT-001-SLV-40" },
      { color: "Classic Silver", size: "42mm Case", variant: "Stainless Steel Bracelet", price: 5799, oldPrice: 7699, stock: 6, sku: "KA-TIT-001-SLV-42" },
      { color: "Midnight Black", size: "38mm Case", variant: "Stainless Steel Bracelet", price: 5199, oldPrice: 7199, stock: 10, sku: "KA-TIT-001-BLK-38" },
      { color: "Midnight Black", size: "40mm Case", variant: "Stainless Steel Bracelet", price: 5699, oldPrice: 7699, stock: 7, sku: "KA-TIT-001-BLK-40" },
      { color: "Midnight Black", size: "42mm Case", variant: "Stainless Steel Bracelet", price: 6199, oldPrice: 8199, stock: 4, sku: "KA-TIT-001-BLK-42" }
    ]
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
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=900&q=80",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80"
    ],
    imageAngles: [
      "Sunray Royal Blue Dial",
      "Chrono Sub-Dials Angle",
      "Italian Leather Strap Profile",
      "Lifestyle / Wrist Fit"
    ],
    description: "Sophisticated multi-dial chronograph watch featuring a sunray royal blue dial, genuine Italian leather strap, and stop-watch micro-second precision.",
    specifications: {
      Material: "Stainless Steel & Italian Leather",
      Movement: "Multi-Function Chronograph",
      Glass: "Mineral Glass",
      WaterResistance: "50m",
      Warranty: "2 Years International Warranty"
    },
    colors: ["Royal Blue", "Deep Black", "Rose Gold Accent"],
    colorMap: {
      "Royal Blue": { hex: "#1E3A8A", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=900&q=80" },
      "Deep Black": { hex: "#18181B", image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900&q=80" },
      "Rose Gold Accent": { hex: "#B76E79", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&q=80" }
    },
    sizes: ["42mm Case", "44mm Case"],
    variants: ["Genuine Leather Strap", "Solid Steel Bracelet"],
    variationMatrix: [
      { color: "Royal Blue", size: "42mm Case", variant: "Genuine Leather Strap", price: 8999, oldPrice: 11999, stock: 10, sku: "KA-FOS-002-BLU-42" },
      { color: "Royal Blue", size: "44mm Case", variant: "Solid Steel Bracelet", price: 9499, oldPrice: 12499, stock: 8, sku: "KA-FOS-002-BLU-44" },
      { color: "Deep Black", size: "42mm Case", variant: "Genuine Leather Strap", price: 8999, oldPrice: 11999, stock: 9, sku: "KA-FOS-002-BLK-42" },
      { color: "Deep Black", size: "44mm Case", variant: "Solid Steel Bracelet", price: 9499, oldPrice: 12499, stock: 6, sku: "KA-FOS-002-BLK-44" },
      { color: "Rose Gold Accent", size: "42mm Case", variant: "Genuine Leather Strap", price: 9299, oldPrice: 12999, stock: 5, sku: "KA-FOS-002-RSG-42" },
      { color: "Rose Gold Accent", size: "44mm Case", variant: "Solid Steel Bracelet", price: 9799, oldPrice: 13499, stock: 3, sku: "KA-FOS-002-RSG-44" }
    ]
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
    image: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=900&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900&q=80",
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=900&q=80"
    ],
    imageAngles: [
      "Tough Solar Face",
      "Octagonal Bezel Angle",
      "Solar Cell Texture Detail",
      "Outdoor Adventure Fit"
    ],
    description: "High-precision solar chronograph powered by light energy with Bluetooth mobile link and 100m water resistance.",
    specifications: {
      Material: "Solid Stainless Steel",
      Movement: "Tough Solar Quartz",
      Glass: "Sapphire Anti-Reflective",
      WaterResistance: "100m / 10 ATM",
      Warranty: "2 Years International Warranty"
    },
    colors: ["Carbon Black", "Gunmetal Silver", "Solar Blue"],
    colorMap: {
      "Carbon Black": { hex: "#27272A", image: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=900&q=80" },
      "Gunmetal Silver": { hex: "#9CA3AF", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80" },
      "Solar Blue": { hex: "#1D4ED8", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=900&q=80" }
    },
    sizes: ["44mm Case", "46mm Case"],
    variants: ["Solid Steel Bracelet", "Resin Sport Band"],
    variationMatrix: [
      { color: "Carbon Black", size: "44mm Case", variant: "Solid Steel Bracelet", price: 6499, oldPrice: 12999, stock: 8, sku: "KA-CAS-003-BLK-44" },
      { color: "Carbon Black", size: "46mm Case", variant: "Solid Steel Bracelet", price: 6999, oldPrice: 13499, stock: 6, sku: "KA-CAS-003-BLK-46" },
      { color: "Gunmetal Silver", size: "44mm Case", variant: "Solid Steel Bracelet", price: 6499, oldPrice: 12999, stock: 7, sku: "KA-CAS-003-SLV-44" },
      { color: "Gunmetal Silver", size: "46mm Case", variant: "Solid Steel Bracelet", price: 6999, oldPrice: 13499, stock: 5, sku: "KA-CAS-003-SLV-46" },
      { color: "Solar Blue", size: "44mm Case", variant: "Resin Sport Band", price: 6799, oldPrice: 13299, stock: 6, sku: "KA-CAS-003-BLU-44" }
    ]
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
    image: "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=900&q=80",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&q=80",
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=900&q=80"
    ],
    imageAngles: [
      "Cerachrom Bezel & Dial",
      "Oyster Case 45° Angle",
      "Glidelock Clasp & Crown",
      "Diver Elegance Styling"
    ],
    description: "Iconic luxury diver timepiece with black Cerachrom unidirectional rotating bezel, Chromalight display, scratch-resistant sapphire crystal, and Calibre 3235 automatic movement.",
    specifications: {
      Material: "Oystersteel (904L Stainless Steel)",
      Movement: "Perpetual Mechanical Self-Winding (Calibre 3235)",
      Glass: "Cyclops Sapphire Glass",
      WaterResistance: "300m / 30 ATM",
      Warranty: "5 Years International Warranty"
    },
    colors: ["Emerald Green", "Onyx Black", "Two-Tone Gold & Steel"],
    colorMap: {
      "Emerald Green": { hex: "#065F46", image: "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=900&q=80" },
      "Onyx Black": { hex: "#09090B", image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900&q=80" },
      "Two-Tone Gold & Steel": { hex: "#CA8A04", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&q=80" }
    },
    sizes: ["41mm Case"],
    variants: ["Oystersteel Bracelet", "Jubilee Bracelet"],
    variationMatrix: [
      { color: "Emerald Green", size: "41mm Case", variant: "Oystersteel Bracelet", price: 49999, oldPrice: 65999, stock: 4, sku: "KA-ROL-004-GRN-OYS" },
      { color: "Emerald Green", size: "41mm Case", variant: "Jubilee Bracelet", price: 52999, oldPrice: 68999, stock: 2, sku: "KA-ROL-004-GRN-JUB" },
      { color: "Onyx Black", size: "41mm Case", variant: "Oystersteel Bracelet", price: 48999, oldPrice: 64999, stock: 5, sku: "KA-ROL-004-BLK-OYS" },
      { color: "Onyx Black", size: "41mm Case", variant: "Jubilee Bracelet", price: 51999, oldPrice: 67999, stock: 3, sku: "KA-ROL-004-BLK-JUB" },
      { color: "Two-Tone Gold & Steel", size: "41mm Case", variant: "Oystersteel Bracelet", price: 56999, oldPrice: 72999, stock: 2, sku: "KA-ROL-004-TT-OYS" }
    ]
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
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=900&q=80",
      "https://images.unsplash.com/photo-1510519138195-068d828884bb?w=900&q=80",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=900&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80"
    ],
    imageAngles: [
      "1.91'' HD Curved Display",
      "Curved Profile Angle",
      "Sensors & Magnetic Charger",
      "Fitness Workout Wear"
    ],
    description: "1.91'' UltraVU HD Display with single-sync BT Calling, 100+ sports modes, AI voice assistant, and 7-day battery life.",
    specifications: {
      Display: "1.91 inch HD Curved Display",
      Battery: "7 Days Typical Usage",
      Connectivity: "Bluetooth 5.3",
      WaterResistance: "IP68 Water & Dust Resistant",
      Warranty: "1 Year Manufacturer Warranty"
    },
    colors: ["Pitch Black", "Teal Blue", "Olive Green"],
    colorMap: {
      "Pitch Black": { hex: "#18181B", image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=900&q=80" },
      "Teal Blue": { hex: "#0D9488", image: "https://images.unsplash.com/photo-1510519138195-068d828884bb?w=900&q=80" },
      "Olive Green": { hex: "#3F6212", image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=900&q=80" }
    },
    sizes: ["Standard 1.91'' Dial"],
    variants: ["Silicone Sport Strap", "Magnetic Milanese Loop"],
    variationMatrix: [
      { color: "Pitch Black", size: "Standard 1.91'' Dial", variant: "Silicone Sport Strap", price: 2499, oldPrice: 3999, stock: 25, sku: "KA-FAS-005-BLK-SPT" },
      { color: "Pitch Black", size: "Standard 1.91'' Dial", variant: "Magnetic Milanese Loop", price: 2799, oldPrice: 4299, stock: 15, sku: "KA-FAS-005-BLK-MAG" },
      { color: "Teal Blue", size: "Standard 1.91'' Dial", variant: "Silicone Sport Strap", price: 2499, oldPrice: 3999, stock: 18, sku: "KA-FAS-005-TEA-SPT" },
      { color: "Olive Green", size: "Standard 1.91'' Dial", variant: "Silicone Sport Strap", price: 2499, oldPrice: 3999, stock: 12, sku: "KA-FAS-005-OLV-SPT" }
    ]
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
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900&q=80",
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=900&q=80"
    ],
    imageAngles: [
      "Domed Sapphire Crystal",
      "Powermatic 80 Case Back",
      "Embossed Calfskin Strap",
      "Executive Suit Styling"
    ],
    description: "Prestigious Swiss-made vintage automatic timepiece featuring domed sapphire crystal, exhibition case back with engraved rotor, and genuine embossed leather strap.",
    specifications: {
      Material: "316L Stainless Steel & Embossed Calfskin Leather",
      Movement: "Swiss Automatic Powermatic 80",
      Glass: "Domed Scratch-Resistant Sapphire",
      WaterResistance: "100m / 10 ATM",
      Warranty: "2 Years International Warranty"
    },
    colors: ["Silver Dial / Brown Strap", "Black Dial / Black Strap", "Ivory Dial / Tan Strap"],
    colorMap: {
      "Silver Dial / Brown Strap": { hex: "#78350F", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&q=80" },
      "Black Dial / Black Strap": { hex: "#18181B", image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900&q=80" },
      "Ivory Dial / Tan Strap": { hex: "#D97706", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80" }
    },
    sizes: ["40mm Case", "42mm Case"],
    variants: ["Embossed Leather Strap", "Milanese Mesh Bracelet"],
    variationMatrix: [
      { color: "Silver Dial / Brown Strap", size: "40mm Case", variant: "Embossed Leather Strap", price: 18999, oldPrice: 24999, stock: 5, sku: "KA-TIS-006-BRN-40" },
      { color: "Silver Dial / Brown Strap", size: "42mm Case", variant: "Milanese Mesh Bracelet", price: 20499, oldPrice: 26499, stock: 3, sku: "KA-TIS-006-BRN-42" },
      { color: "Black Dial / Black Strap", size: "40mm Case", variant: "Embossed Leather Strap", price: 18999, oldPrice: 24999, stock: 4, sku: "KA-TIS-006-BLK-40" },
      { color: "Black Dial / Black Strap", size: "42mm Case", variant: "Milanese Mesh Bracelet", price: 20499, oldPrice: 26499, stock: 2, sku: "KA-TIS-006-BLK-42" },
      { color: "Ivory Dial / Tan Strap", size: "40mm Case", variant: "Embossed Leather Strap", price: 19499, oldPrice: 25499, stock: 3, sku: "KA-TIS-006-IVR-40" }
    ]
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
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900&q=80",
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=900&q=80",
      "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=900&q=80",
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=900&q=80"
    ],
    imageAngles: [
      "Panda Chrono Dial",
      "Tachymeter Bezel Angle",
      "Screw-Down Pushers Profile",
      "Motorsport Prestige Wear"
    ],
    description: "High-precision luxury chronograph with engraved tachymetric scale bezel, triple sub-dials, Oystersteel bracelet, and certified chronometer mechanical movement.",
    specifications: {
      Material: "Oystersteel 904L & Cerachrom",
      Movement: "Calibre 4130 Perpetual Chronograph",
      Glass: "Scratch-Resistant Sapphire Crystal",
      WaterResistance: "100m / 10 ATM",
      Warranty: "5 Years International Warranty"
    },
    colors: ["Panda White", "Onyx Black", "Rose Gold Sundust"],
    colorMap: {
      "Panda White": { hex: "#F3F4F6", image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900&q=80" },
      "Onyx Black": { hex: "#18181B", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=900&q=80" },
      "Rose Gold Sundust": { hex: "#BE7B72", image: "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=900&q=80" }
    },
    sizes: ["40mm Case"],
    variants: ["Oystersteel Bracelet", "Oysterflex Rubber Strap"],
    variationMatrix: [
      { color: "Panda White", size: "40mm Case", variant: "Oystersteel Bracelet", price: 64999, oldPrice: 79999, stock: 3, sku: "KA-ROL-DAY-WHT-OYS" },
      { color: "Panda White", size: "40mm Case", variant: "Oysterflex Rubber Strap", price: 66999, oldPrice: 81999, stock: 2, sku: "KA-ROL-DAY-WHT-FLX" },
      { color: "Onyx Black", size: "40mm Case", variant: "Oystersteel Bracelet", price: 64999, oldPrice: 79999, stock: 3, sku: "KA-ROL-DAY-BLK-OYS" },
      { color: "Rose Gold Sundust", size: "40mm Case", variant: "Oysterflex Rubber Strap", price: 72999, oldPrice: 88999, stock: 2, sku: "KA-ROL-DAY-RSG-FLX" }
    ]
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
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=900&q=80",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&q=80",
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=900&q=80"
    ],
    imageAngles: [
      "Moonwatch Step Dial",
      "Co-Axial Master Case Back",
      "Double-Beveled Bracelet",
      "Lunar Heritage Styling"
    ],
    description: "Legendary Speedmaster Moonwatch chronograph featuring a black step dial, sapphire crystal, and Master Chronometer certified co-axial movement.",
    specifications: {
      Material: "Stainless Steel Case & Bracelet",
      Movement: "Co-Axial Master Chronometer Calibre 3861",
      Glass: "Sapphire Crystal with Anti-Reflective Treatment",
      WaterResistance: "50m / 5 ATM",
      Warranty: "5 Years International Warranty"
    },
    colors: ["Racing Black", "Meteorite Grey", "Navy Moon"],
    colorMap: {
      "Racing Black": { hex: "#18181B", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=900&q=80" },
      "Meteorite Grey": { hex: "#6B7280", image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900&q=80" },
      "Navy Moon": { hex: "#1E3A8A", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&q=80" }
    },
    sizes: ["42mm Case"],
    variants: ["Stainless Steel Bracelet", "Perforated Racing Leather"],
    variationMatrix: [
      { color: "Racing Black", size: "42mm Case", variant: "Stainless Steel Bracelet", price: 45999, oldPrice: 59999, stock: 6, sku: "KA-OMG-SPD-BLK-STL" },
      { color: "Racing Black", size: "42mm Case", variant: "Perforated Racing Leather", price: 47999, oldPrice: 61999, stock: 4, sku: "KA-OMG-SPD-BLK-LTH" },
      { color: "Meteorite Grey", size: "42mm Case", variant: "Stainless Steel Bracelet", price: 48999, oldPrice: 63999, stock: 3, sku: "KA-OMG-SPD-MET-STL" }
    ]
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
    image: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=900&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900&q=80",
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=900&q=80"
    ],
    imageAngles: [
      "Sunburst Blue Dial",
      "Unidirectional Rotating Bezel",
      "4R36 Movement Exhibition Back",
      "Daily Urban Wrist Fit"
    ],
    description: "Authentic Seiko 5 Sports automatic timepiece, thoroughly crafted with LumiBrite hands, exhibition case back, and tested for precise timekeeping.",
    specifications: {
      Material: "Solid Stainless Steel",
      Movement: "Genuine Seiko 4R36 24-Jewel Automatic",
      Glass: "Hardlex Crystal",
      WaterResistance: "100m / 10 ATM",
      Warranty: "2 Years International Warranty"
    },
    colors: ["Sunburst Silver", "Champagne Gold", "Deep Sea Blue"],
    colorMap: {
      "Sunburst Silver": { hex: "#D1D5DB", image: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=900&q=80" },
      "Champagne Gold": { hex: "#F59E0B", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80" },
      "Deep Sea Blue": { hex: "#1E40AF", image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900&q=80" }
    },
    sizes: ["38mm Case", "42.5mm Case"],
    variants: ["Steel Jubilee Bracelet", "NATO Nylon Strap"],
    variationMatrix: [
      { color: "Sunburst Silver", size: "38mm Case", variant: "Steel Jubilee Bracelet", price: 14299, oldPrice: 19999, stock: 7, sku: "KA-SEI-SPO-SLV-38" },
      { color: "Sunburst Silver", size: "42.5mm Case", variant: "Steel Jubilee Bracelet", price: 14999, oldPrice: 20999, stock: 8, sku: "KA-SEI-SPO-SLV-42" },
      { color: "Deep Sea Blue", size: "42.5mm Case", variant: "Steel Jubilee Bracelet", price: 15499, oldPrice: 21499, stock: 6, sku: "KA-SEI-SPO-BLU-42" }
    ]
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
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&q=80"
    ],
    imageAngles: [
      "Front Leather Profile",
      "Padded Laptop Compartment",
      "Solid Brass Hardware & Locks",
      "Executive Shoulder Carry"
    ],
    description: "Handcrafted vegetable-tanned genuine leather briefcase with padded 15.6-inch laptop compartment, solid brass hardware, and detachable shoulder strap.",
    specifications: {
      Material: "100% Genuine Vegetable-Tanned Leather",
      Capacity: "Fits up to 15.6-inch Laptops + Documents",
      Hardware: "Antique Solid Brass",
      Warranty: "1 Year International"
    },
    colors: ["Rich Cognac Brown", "Classic Black", "Tan Vintage"],
    colorMap: {
      "Rich Cognac Brown": { hex: "#78350F", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&q=80" },
      "Classic Black": { hex: "#18181B", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&q=80" },
      "Tan Vintage": { hex: "#B45309", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&q=80" }
    },
    sizes: ["Standard 15.6-inch", "Executive 17-inch"],
    variants: ["Standard Briefcase", "Slim Profile Edition"],
    variationMatrix: [
      { color: "Rich Cognac Brown", size: "Standard 15.6-inch", variant: "Standard Briefcase", price: 8499, oldPrice: 11999, stock: 8, sku: "KA-HID-007-BRN-STD" },
      { color: "Rich Cognac Brown", size: "Executive 17-inch", variant: "Standard Briefcase", price: 9299, oldPrice: 12999, stock: 4, sku: "KA-HID-007-BRN-17" },
      { color: "Classic Black", size: "Standard 15.6-inch", variant: "Standard Briefcase", price: 8499, oldPrice: 11999, stock: 7, sku: "KA-HID-007-BLK-STD" },
      { color: "Classic Black", size: "Executive 17-inch", variant: "Standard Briefcase", price: 9299, oldPrice: 12999, stock: 3, sku: "KA-HID-007-BLK-17" }
    ]
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
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80"
    ],
    imageAngles: [
      "Front Minimalist Profile",
      "AirMesh Ergonomic Back",
      "Multi-Pocket Storage Interior",
      "Commuter Daily Travel"
    ],
    description: "Weatherproof 32-liter urban travel backpack with ergonomic AirMesh lumbar support, dedicated USB charging port pass-through, and rain cover included.",
    specifications: {
      Material: "High-Density Ballistic Polyester",
      Volume: "32 Litres",
      Compartments: "3 Main + 2 Side Water Bottle Sleeves",
      Warranty: "5 Years"
    },
    colors: ["Charcoal Grey", "Navy Blue", "Olive Tactical"],
    colorMap: {
      "Charcoal Grey": { hex: "#4B5563", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&q=80" },
      "Navy Blue": { hex: "#1E3A8A", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&q=80" },
      "Olive Tactical": { hex: "#3F6212", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&q=80" }
    },
    sizes: ["28 Litres Daily", "32 Litres Pro", "38 Litres Travel"],
    variants: ["Standard Ballistic", "WeatherShield Pro (with Raincover)"],
    variationMatrix: [
      { color: "Charcoal Grey", size: "28 Litres Daily", variant: "Standard Ballistic", price: 2199, oldPrice: 3199, stock: 15, sku: "KA-WIL-008-GRY-28" },
      { color: "Charcoal Grey", size: "32 Litres Pro", variant: "Standard Ballistic", price: 2499, oldPrice: 3499, stock: 20, sku: "KA-WIL-008-GRY-32" },
      { color: "Charcoal Grey", size: "38 Litres Travel", variant: "WeatherShield Pro (with Raincover)", price: 2999, oldPrice: 4199, stock: 10, sku: "KA-WIL-008-GRY-38" },
      { color: "Navy Blue", size: "32 Litres Pro", variant: "Standard Ballistic", price: 2499, oldPrice: 3499, stock: 18, sku: "KA-WIL-008-NVY-32" }
    ]
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
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&q=80"
    ],
    imageAngles: [
      "Monogram Front Silhouette",
      "Interior Zip Pouch & Divider",
      "Leather Trim & Gold Accents",
      "Chic Shoulder Carry"
    ],
    description: "Chic structured tote bag featuring iconic monogram detailing, premium faux-leather trim, magnetic closure, and removable matching zip pouch.",
    specifications: {
      Material: "Premium Jacquard Canvas & Vegan Leather",
      Closure: "Magnetic Snap with Zip Top",
      Dimensions: "38cm x 28cm x 14cm",
      Warranty: "1 Year"
    },
    colors: ["Navy / White Stripe", "Black Jacquard", "Beige Monogram"],
    colorMap: {
      "Navy / White Stripe": { hex: "#1E3A8A", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&q=80" },
      "Black Jacquard": { hex: "#18181B", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&q=80" },
      "Beige Monogram": { hex: "#D4B996", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&q=80" }
    },
    sizes: ["Medium Tote (34cm)", "Large Carryall (42cm)"],
    variants: ["Classic Jacquard", "Vegan Leather Edition"],
    variationMatrix: [
      { color: "Navy / White Stripe", size: "Medium Tote (34cm)", variant: "Classic Jacquard", price: 6999, oldPrice: 9999, stock: 12, sku: "KA-TOM-009-NVY-MED" },
      { color: "Navy / White Stripe", size: "Large Carryall (42cm)", variant: "Classic Jacquard", price: 7999, oldPrice: 10999, stock: 8, sku: "KA-TOM-009-NVY-LRG" },
      { color: "Black Jacquard", size: "Medium Tote (34cm)", variant: "Classic Jacquard", price: 6999, oldPrice: 9999, stock: 10, sku: "KA-TOM-009-BLK-MED" }
    ]
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
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=900&q=80",
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=900&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=900&q=80"
    ],
    imageAngles: [
      "Side Athletic Profile",
      "Engineered Mesh Upper Top",
      "Zoom Air Sole & Waffle Grip",
      "Track Runner In-Action"
    ],
    description: "Responsive cushioning in the Nike Air Zoom Pegasus provides a springy feel for everyday road and track runners with engineered breathable mesh.",
    specifications: {
      Material: "Engineered Mesh Upper",
      Sole: "Zoom Air Foam with Waffle Rubber",
      Weight: "260g",
      Warranty: "6 Months"
    },
    colors: ["Crimson Red", "Triple Black", "Pure White & Royal"],
    colorMap: {
      "Crimson Red": { hex: "#DC2626", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80" },
      "Triple Black": { hex: "#18181B", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=900&q=80" },
      "Pure White & Royal": { hex: "#2563EB", image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=900&q=80" }
    },
    sizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
    variants: ["Standard Width (D)", "Extra Wide (4E)"],
    variationMatrix: [
      { color: "Crimson Red", size: "UK 7", variant: "Standard Width (D)", price: 5499, oldPrice: 7499, stock: 6, sku: "KA-NIK-010-RED-7" },
      { color: "Crimson Red", size: "UK 8", variant: "Standard Width (D)", price: 5499, oldPrice: 7499, stock: 10, sku: "KA-NIK-010-RED-8" },
      { color: "Crimson Red", size: "UK 9", variant: "Standard Width (D)", price: 5499, oldPrice: 7499, stock: 8, sku: "KA-NIK-010-RED-9" },
      { color: "Crimson Red", size: "UK 10", variant: "Standard Width (D)", price: 5699, oldPrice: 7699, stock: 5, sku: "KA-NIK-010-RED-10" },
      { color: "Triple Black", size: "UK 8", variant: "Standard Width (D)", price: 5499, oldPrice: 7499, stock: 9, sku: "KA-NIK-010-BLK-8" },
      { color: "Triple Black", size: "UK 9", variant: "Standard Width (D)", price: 5499, oldPrice: 7499, stock: 7, sku: "KA-NIK-010-BLK-9" }
    ]
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
    image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=900&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=900&q=80",
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=900&q=80"
    ],
    imageAngles: [
      "Primeknit Side Silhouette",
      "BOOST Capsule Midsole",
      "Continental Grip Rubber Sole",
      "Urban Sprint Lifestyle"
    ],
    description: "Experience epic energy return with Light BOOST cushioning technology and an adaptive Primeknit+ textile upper designed for ultimate comfort.",
    specifications: {
      Material: "Primeknit+ Textile",
      Sole: "Light BOOST with Continental Rubber",
      Drop: "10mm",
      Warranty: "6 Months"
    },
    colors: ["Core Black", "Cloud White", "Solar Red / Carbon"],
    colorMap: {
      "Core Black": { hex: "#18181B", image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=900&q=80" },
      "Cloud White": { hex: "#F3F4F6", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80" },
      "Solar Red / Carbon": { hex: "#EF4444", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=900&q=80" }
    },
    sizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
    variants: ["Standard Primeknit+", "Cold.RDY Water-Resistant"],
    variationMatrix: [
      { color: "Core Black", size: "UK 7", variant: "Standard Primeknit+", price: 6999, oldPrice: 9999, stock: 5, sku: "KA-ADI-011-BLK-7" },
      { color: "Core Black", size: "UK 8", variant: "Standard Primeknit+", price: 6999, oldPrice: 9999, stock: 8, sku: "KA-ADI-011-BLK-8" },
      { color: "Core Black", size: "UK 9", variant: "Standard Primeknit+", price: 6999, oldPrice: 9999, stock: 7, sku: "KA-ADI-011-BLK-9" },
      { color: "Cloud White", size: "UK 8", variant: "Standard Primeknit+", price: 6999, oldPrice: 9999, stock: 6, sku: "KA-ADI-011-WHT-8" },
      { color: "Cloud White", size: "UK 9", variant: "Standard Primeknit+", price: 6999, oldPrice: 9999, stock: 5, sku: "KA-ADI-011-WHT-9" }
    ]
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
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=900&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=900&q=80",
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=900&q=80"
    ],
    imageAngles: [
      "Low-Boot Profile",
      "NITRO Foam Heel Angle",
      "PUMAGRIP Rubber Tread",
      "Casual Street Styling"
    ],
    description: "Sleek low-boot street design infused with advanced NITRO foam for featherlight responsiveness and all-day urban walking comfort.",
    specifications: {
      Material: "Synthetic Leather & Mesh",
      Sole: "PUMAGRIP High Traction Rubber",
      Warranty: "6 Months"
    },
    colors: ["White / Black", "All Black", "Electric Lime"],
    colorMap: {
      "White / Black": { hex: "#E5E7EB", image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=900&q=80" },
      "All Black": { hex: "#18181B", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=900&q=80" },
      "Electric Lime": { hex: "#84CC16", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80" }
    },
    sizes: ["UK 7", "UK 8", "UK 9", "UK 10"],
    variants: ["Standard Edition", "Reflective Night Runner"],
    variationMatrix: [
      { color: "White / Black", size: "UK 8", variant: "Standard Edition", price: 3999, oldPrice: 5499, stock: 8, sku: "KA-PUM-012-WHT-8" },
      { color: "White / Black", size: "UK 9", variant: "Standard Edition", price: 3999, oldPrice: 5499, stock: 6, sku: "KA-PUM-012-WHT-9" },
      { color: "All Black", size: "UK 8", variant: "Standard Edition", price: 3999, oldPrice: 5499, stock: 7, sku: "KA-PUM-012-BLK-8" }
    ]
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
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=900&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=900&q=80",
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=900&q=80"
    ],
    imageAngles: [
      "High-Top Leather Profile",
      "Wings Ankle Collar & Swoosh",
      "Tumbled Toe Box & Red Tread",
      "Court-Side Streetwear Fit"
    ],
    description: "Iconic high-top silhouette in premium genuine tumbled leather with encapsulated Air-Sole unit and legendary basketball legacy.",
    specifications: {
      Material: "Full-Grain Genuine Leather",
      Sole: "Rubber Cupsole with Air Cushioning",
      Warranty: "6 Months"
    },
    colors: ["Chicago Red / White / Black", "Shadow Grey", "Royal Blue OG"],
    colorMap: {
      "Chicago Red / White / Black": { hex: "#B91C1C", image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=900&q=80" },
      "Shadow Grey": { hex: "#4B5563", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=900&q=80" },
      "Royal Blue OG": { hex: "#1D4ED8", image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=900&q=80" }
    },
    sizes: ["UK 8", "UK 9", "UK 10", "UK 11"],
    variants: ["Classic High-Top OG"],
    variationMatrix: [
      { color: "Chicago Red / White / Black", size: "UK 8", variant: "Classic High-Top OG", price: 14999, oldPrice: 17999, stock: 3, sku: "KA-JOR-013-CHI-8" },
      { color: "Chicago Red / White / Black", size: "UK 9", variant: "Classic High-Top OG", price: 14999, oldPrice: 17999, stock: 4, sku: "KA-JOR-013-CHI-9" },
      { color: "Chicago Red / White / Black", size: "UK 10", variant: "Classic High-Top OG", price: 15499, oldPrice: 18499, stock: 2, sku: "KA-JOR-013-CHI-10" },
      { color: "Shadow Grey", size: "UK 9", variant: "Classic High-Top OG", price: 14999, oldPrice: 17999, stock: 3, sku: "KA-JOR-013-SHD-9" }
    ]
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
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&q=80",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=900&q=80",
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=900&q=80",
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=900&q=80"
    ],
    imageAngles: [
      "AMOLED Display & S-Pen",
      "Quad 200MP Titanium Camera",
      "Titanium Frame & Stylus Port",
      "Galaxy AI In-Hand Experience"
    ],
    description: "Next-generation titanium design equipped with Galaxy AI, 200MP Quad Telephoto Camera system, S-Pen built-in, and Snapdragon 8 Gen 4 chipset.",
    specifications: {
      Display: "6.8 inch Dynamic AMOLED 2X 120Hz",
      Storage: "256GB / 512GB / 1TB UFS 4.0",
      RAM: "12GB / 16GB LPDDR5X",
      Camera: "200MP + 50MP + 12MP + 10MP",
      Battery: "5000mAh with 45W Fast Charging",
      Warranty: "1 Year Brand Warranty"
    },
    colors: ["Titanium Black", "Titanium Gray", "Titanium Violet"],
    colorMap: {
      "Titanium Black": { hex: "#1C1917", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&q=80" },
      "Titanium Gray": { hex: "#78716C", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=900&q=80" },
      "Titanium Violet": { hex: "#5B21B6", image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=900&q=80" }
    },
    sizes: ["256GB (12GB RAM)", "512GB (12GB RAM)", "1TB (16GB RAM)"],
    variants: ["Standard Edition", "Enterprise AI Security Edition"],
    variationMatrix: [
      { color: "Titanium Black", size: "256GB (12GB RAM)", variant: "Standard Edition", price: 114999, oldPrice: 129999, stock: 6, sku: "KA-SAM-014-BLK-256" },
      { color: "Titanium Black", size: "512GB (12GB RAM)", variant: "Standard Edition", price: 124999, oldPrice: 139999, stock: 4, sku: "KA-SAM-014-BLK-512" },
      { color: "Titanium Black", size: "1TB (16GB RAM)", variant: "Standard Edition", price: 139999, oldPrice: 154999, stock: 2, sku: "KA-SAM-014-BLK-1TB" },
      { color: "Titanium Gray", size: "256GB (12GB RAM)", variant: "Standard Edition", price: 114999, oldPrice: 129999, stock: 5, sku: "KA-SAM-014-GRY-256" },
      { color: "Titanium Gray", size: "512GB (12GB RAM)", variant: "Standard Edition", price: 124999, oldPrice: 139999, stock: 3, sku: "KA-SAM-014-GRY-512" }
    ]
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
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=900&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&q=80",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=900&q=80",
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=900&q=80"
    ],
    imageAngles: [
      "Super Retina XDR Display",
      "48MP Fusion Triple Camera",
      "Grade 5 Titanium & USB-C",
      "Cinematic Video Capture"
    ],
    description: "Forged in grade 5 titanium with Apple Intelligence, revolutionary A18 Pro chip, 48MP Fusion camera with 5x Telephoto, and industry-leading battery longevity.",
    specifications: {
      Display: "6.9 inch Super Retina XDR ProMotion",
      Storage: "256GB / 512GB / 1TB NVMe",
      Chipset: "Apple A18 Pro Bionic",
      Camera: "48MP Main + 48MP Ultra-Wide + 12MP 5x Telephoto",
      Warranty: "1 Year Apple India Warranty"
    },
    colors: ["Desert Titanium", "Natural Titanium", "Black Titanium", "White Titanium"],
    colorMap: {
      "Desert Titanium": { hex: "#C2A68C", image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=900&q=80" },
      "Natural Titanium": { hex: "#9E9A95", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=900&q=80" },
      "Black Titanium": { hex: "#292828", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&q=80" },
      "White Titanium": { hex: "#F5F5F7", image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=900&q=80" }
    },
    sizes: ["256GB", "512GB", "1TB"],
    variants: ["eSIM + Physical SIM"],
    variationMatrix: [
      { color: "Desert Titanium", size: "256GB", variant: "eSIM + Physical SIM", price: 139900, oldPrice: 149900, stock: 4, sku: "KA-APP-015-DST-256" },
      { color: "Desert Titanium", size: "512GB", variant: "eSIM + Physical SIM", price: 159900, oldPrice: 169900, stock: 3, sku: "KA-APP-015-DST-512" },
      { color: "Desert Titanium", size: "1TB", variant: "eSIM + Physical SIM", price: 179900, oldPrice: 189900, stock: 1, sku: "KA-APP-015-DST-1TB" },
      { color: "Natural Titanium", size: "256GB", variant: "eSIM + Physical SIM", price: 139900, oldPrice: 149900, stock: 3, sku: "KA-APP-015-NAT-256" },
      { color: "Natural Titanium", size: "512GB", variant: "eSIM + Physical SIM", price: 159900, oldPrice: 169900, stock: 2, sku: "KA-APP-015-NAT-512" },
      { color: "Black Titanium", size: "256GB", variant: "eSIM + Physical SIM", price: 139900, oldPrice: 149900, stock: 4, sku: "KA-APP-015-BLK-256" }
    ]
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
    image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=900&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&q=80",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=900&q=80",
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=900&q=80"
    ],
    imageAngles: [
      "2K 120Hz ProXDR Screen",
      "Hasselblad Camera Array",
      "100W Fast Charging Port",
      "High-Performance Gaming"
    ],
    description: "Hasselblad 4th Gen Mobile Camera, 100W SUPERVOOC fast charge with 6000mAh silicon-carbon battery and ultra-smooth 2K 120Hz Oriental Screen.",
    specifications: {
      Display: "6.82 inch 2K ProXDR 120Hz",
      Storage: "256GB / 512GB",
      RAM: "16GB / 24GB LPDDR5X",
      Battery: "6000mAh with 100W Charging",
      Warranty: "1 Year"
    },
    colors: ["Emerald Silk", "Midnight Obsidian", "Arctic Silver"],
    colorMap: {
      "Emerald Silk": { hex: "#064E3B", image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=900&q=80" },
      "Midnight Obsidian": { hex: "#18181B", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&q=80" },
      "Arctic Silver": { hex: "#E5E7EB", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=900&q=80" }
    },
    sizes: ["16GB RAM / 256GB", "16GB RAM / 512GB", "24GB RAM / 1TB"],
    variants: ["Standard 100W Edition"],
    variationMatrix: [
      { color: "Emerald Silk", size: "16GB RAM / 256GB", variant: "Standard 100W Edition", price: 64999, oldPrice: 69999, stock: 8, sku: "KA-ONE-016-EMR-256" },
      { color: "Emerald Silk", size: "16GB RAM / 512GB", variant: "Standard 100W Edition", price: 69999, oldPrice: 74999, stock: 5, sku: "KA-ONE-016-EMR-512" },
      { color: "Midnight Obsidian", size: "16GB RAM / 256GB", variant: "Standard 100W Edition", price: 64999, oldPrice: 69999, stock: 7, sku: "KA-ONE-016-BLK-256" }
    ]
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
    image: "https://images.unsplash.com/photo-1542272604-780c96856592?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1542272604-780c96856592?w=900&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&q=80"
    ],
    imageAngles: [
      "Straight Leg Denim Fit",
      "Back Two-Horse Leather Patch",
      "Signature Button Fly & Red Tab",
      "Everyday Denim Streetwear"
    ],
    description: "The iconic straight fit with signature button fly crafted from 100% heavyweight cotton denim that molds uniquely to your body over time.",
    specifications: {
      Material: "100% Premium Cotton Denim",
      Fit: "Original Straight Leg",
      Closure: "Button Fly",
      Care: "Machine Wash Cold"
    },
    colors: ["Dark Indigo", "Light Stone Wash", "Vintage Black"],
    colorMap: {
      "Dark Indigo": { hex: "#1E3A8A", image: "https://images.unsplash.com/photo-1542272604-780c96856592?w=900&q=80" },
      "Light Stone Wash": { hex: "#60A5FA", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&q=80" },
      "Vintage Black": { hex: "#27272A", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&q=80" }
    },
    sizes: ["30W 32L", "32W 32L", "34W 32L", "36W 32L", "38W 32L"],
    variants: ["Original 100% Rigid Cotton", "Stretch Denim Comfort"],
    variationMatrix: [
      { color: "Dark Indigo", size: "30W 32L", variant: "Original 100% Rigid Cotton", price: 2999, oldPrice: 3999, stock: 10, sku: "KA-LEV-017-IND-30" },
      { color: "Dark Indigo", size: "32W 32L", variant: "Original 100% Rigid Cotton", price: 2999, oldPrice: 3999, stock: 14, sku: "KA-LEV-017-IND-32" },
      { color: "Dark Indigo", size: "34W 32L", variant: "Original 100% Rigid Cotton", price: 2999, oldPrice: 3999, stock: 12, sku: "KA-LEV-017-IND-34" },
      { color: "Light Stone Wash", size: "32W 32L", variant: "Original 100% Rigid Cotton", price: 2999, oldPrice: 3999, stock: 8, sku: "KA-LEV-017-STN-32" }
    ]
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
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&q=80",
      "https://images.unsplash.com/photo-1542272604-780c96856592?w=900&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&q=80"
    ],
    imageAngles: [
      "Tailored Slim Silhouette",
      "Peak Lapels & Horn Buttons",
      "Silk Acetate Interior Lining",
      "Evening Formal Business Wear"
    ],
    description: "Modern unstructured slim fit blazer with peak lapels, flap pockets, and breathable stretch wool-blend fabric for business and evening formal wear.",
    specifications: {
      Material: "Wool & Viscose Blend",
      Fit: "Tailored Slim",
      Lining: "100% Acetate Silk",
      Care: "Dry Clean Only"
    },
    colors: ["Navy Blue", "Charcoal Gray", "Camel Tan"],
    colorMap: {
      "Navy Blue": { hex: "#1E3A8A", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&q=80" },
      "Charcoal Gray": { hex: "#374151", image: "https://images.unsplash.com/photo-1542272604-780c96856592?w=900&q=80" },
      "Camel Tan": { hex: "#D97706", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&q=80" }
    },
    sizes: ["38 (M)", "40 (L)", "42 (XL)", "44 (XXL)"],
    variants: ["Wool-Blend Tailored", "Stretch Wool Breathable"],
    variationMatrix: [
      { color: "Navy Blue", size: "38 (M)", variant: "Wool-Blend Tailored", price: 5999, oldPrice: 7999, stock: 5, sku: "KA-ZAR-018-NVY-38" },
      { color: "Navy Blue", size: "40 (L)", variant: "Wool-Blend Tailored", price: 5999, oldPrice: 7999, stock: 6, sku: "KA-ZAR-018-NVY-40" },
      { color: "Navy Blue", size: "42 (XL)", variant: "Wool-Blend Tailored", price: 6299, oldPrice: 8299, stock: 4, sku: "KA-ZAR-018-NVY-42" },
      { color: "Charcoal Gray", size: "40 (L)", variant: "Wool-Blend Tailored", price: 5999, oldPrice: 7999, stock: 5, sku: "KA-ZAR-018-GRY-40" }
    ]
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
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&q=80",
      "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=900&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&q=80"
    ],
    imageAngles: [
      "3.5K OLED InfinityEdge Screen",
      "Carbon Fiber Palmrest & Keyboard",
      "Slim CNC Machined Side Profile",
      "Creative Design Studio Desk"
    ],
    description: "Ultra-premium CNC machined aluminum chassis with 3.5K OLED touchscreen, Intel Core Ultra 9 processor, NVIDIA RTX 4070 Graphics, and 64GB DDR5 RAM.",
    specifications: {
      Processor: "Intel Core Ultra 9 185H (16 Cores)",
      Graphics: "NVIDIA GeForce RTX 4070 8GB GDDR6",
      RAM: "32GB / 64GB DDR5 5600MHz",
      Storage: "1TB / 2TB PCIe Gen4 NVMe SSD",
      Display: "15.6 inch 3.5K (3456x2160) OLED Touch",
      Warranty: "2 Years On-Site Support"
    },
    colors: ["Platinum Silver / Black Carbon", "Frost White / Arctic Palmrest"],
    colorMap: {
      "Platinum Silver / Black Carbon": { hex: "#D1D5DB", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&q=80" },
      "Frost White / Arctic Palmrest": { hex: "#F9FAFB", image: "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=900&q=80" }
    },
    sizes: ["16GB RAM / 512GB SSD", "32GB RAM / 1TB SSD", "64GB RAM / 2TB SSD"],
    variants: ["Intel Core Ultra 7", "Intel Core Ultra 9 + RTX 4070"],
    variationMatrix: [
      { color: "Platinum Silver / Black Carbon", size: "16GB RAM / 512GB SSD", variant: "Intel Core Ultra 7", price: 119999, oldPrice: 134999, stock: 4, sku: "KA-DEL-019-16-512" },
      { color: "Platinum Silver / Black Carbon", size: "32GB RAM / 1TB SSD", variant: "Intel Core Ultra 9 + RTX 4070", price: 134999, oldPrice: 149999, stock: 3, sku: "KA-DEL-019-32-1TB" },
      { color: "Platinum Silver / Black Carbon", size: "64GB RAM / 2TB SSD", variant: "Intel Core Ultra 9 + RTX 4070", price: 154999, oldPrice: 169999, stock: 2, sku: "KA-DEL-019-64-2TB" }
    ]
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
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&q=80",
      "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=900&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&q=80"
    ],
    imageAngles: [
      "Liquid Retina XDR Display",
      "Magic Keyboard & Touch ID",
      "MagSafe & HDMI Port Array",
      "4K Video Editing Workspace"
    ],
    description: "Driven by M3 Max chip with 16-core CPU and 40-core GPU, stunning Liquid Retina XDR display, up to 22 hours battery life, and studio-quality mics.",
    specifications: {
      Processor: "Apple M3 Max Chip",
      RAM: "36GB / 48GB / 128GB Unified Memory",
      Storage: "1TB / 2TB / 4TB NVMe SSD",
      Display: "16.2-inch Liquid Retina XDR (3456x2234)",
      Warranty: "1 Year Official AppleCare"
    },
    colors: ["Space Black", "Silver"],
    colorMap: {
      "Space Black": { hex: "#1F2022", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&q=80" },
      "Silver": { hex: "#E5E7EB", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&q=80" }
    },
    sizes: ["18GB Unified / 512GB SSD", "36GB Unified / 1TB SSD", "48GB Unified / 2TB SSD"],
    variants: ["Apple M3 Pro (12-Core CPU)", "Apple M3 Max (16-Core CPU)"],
    variationMatrix: [
      { color: "Space Black", size: "18GB Unified / 512GB SSD", variant: "Apple M3 Pro (12-Core CPU)", price: 199900, oldPrice: 219900, stock: 3, sku: "KA-APP-020-BLK-18GB" },
      { color: "Space Black", size: "36GB Unified / 1TB SSD", variant: "Apple M3 Max (16-Core CPU)", price: 249900, oldPrice: 269900, stock: 2, sku: "KA-APP-020-BLK-36GB" },
      { color: "Silver", size: "36GB Unified / 1TB SSD", variant: "Apple M3 Max (16-Core CPU)", price: 249900, oldPrice: 269900, stock: 2, sku: "KA-APP-020-SLV-36GB" }
    ]
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
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=900&q=80",
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=900&q=80",
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=900&q=80"
    ],
    imageAngles: [
      "Ergonomic Over-Ear Profile",
      "Leather Cushions & Touch Sensor",
      "Fold-Flat Hard Case Profile",
      "In-Flight Acoustic Immersion"
    ],
    description: "Industry-leading noise cancellation with two processors and eight microphones for unprecedented sound clarity, crystal clear hands-free calls, and 30-hour battery.",
    specifications: {
      BatteryLife: "30 Hours with ANC On (3 min charge = 3 hours playback)",
      Driver: "30mm Precision Engineered Carbon Fiber",
      Connectivity: "Bluetooth 5.2, LDAC High-Res Audio",
      Warranty: "1 Year Brand Warranty"
    },
    colors: ["Silver Grey", "Midnight Black", "Smoky Pink", "Navy Midnight"],
    colorMap: {
      "Silver Grey": { hex: "#D1D5DB", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&q=80" },
      "Midnight Black": { hex: "#18181B", image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=900&q=80" },
      "Smoky Pink": { hex: "#F472B6", image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=900&q=80" },
      "Navy Midnight": { hex: "#1E3A8A", image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=900&q=80" }
    },
    sizes: ["Standard Fit (Adjustable Headband)"],
    variants: ["Headphones + Hard Travel Case", "Pro Travel Bundle (+Flight Adapter & Cable)"],
    variationMatrix: [
      { color: "Silver Grey", size: "Standard Fit (Adjustable Headband)", variant: "Headphones + Hard Travel Case", price: 24990, oldPrice: 29990, stock: 8, sku: "KA-SON-021-SLV-STD" },
      { color: "Silver Grey", size: "Standard Fit (Adjustable Headband)", variant: "Pro Travel Bundle (+Flight Adapter & Cable)", price: 26490, oldPrice: 31490, stock: 4, sku: "KA-SON-021-SLV-PRO" },
      { color: "Midnight Black", size: "Standard Fit (Adjustable Headband)", variant: "Headphones + Hard Travel Case", price: 24990, oldPrice: 29990, stock: 10, sku: "KA-SON-021-BLK-STD" },
      { color: "Smoky Pink", size: "Standard Fit (Adjustable Headband)", variant: "Headphones + Hard Travel Case", price: 25490, oldPrice: 30490, stock: 3, sku: "KA-SON-021-PNK-STD" }
    ]
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
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=900&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=900&q=80",
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=900&q=80"
    ],
    imageAngles: [
      "True Wireless Charging Case",
      "CustomFit Stability Bands",
      "Touch Controls & Microphones",
      "Workout & Focus Listening"
    ],
    description: "Breakthrough immersive spatial audio, world-class active noise cancellation, and CustomTune technology that personalizes sound to the shape of your ears.",
    specifications: {
      Battery: "6 Hours (24 Hours with Case)",
      NoiseCancellation: "CustomTune Active Noise Cancelling",
      WaterResistance: "IPX4 Sweat Resistant",
      Warranty: "1 Year"
    },
    colors: ["Black", "White Smoke", "Lunar Blue"],
    colorMap: {
      "Black": { hex: "#18181B", image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=900&q=80" },
      "White Smoke": { hex: "#F4F4F5", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&q=80" },
      "Lunar Blue": { hex: "#1E3A8A", image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=900&q=80" }
    },
    sizes: ["Standard Fit (Includes S/M/L Kits)"],
    variants: ["Standard Wireless Case", "Wireless Charging Cover Bundle"],
    variationMatrix: [
      { color: "Black", size: "Standard Fit (Includes S/M/L Kits)", variant: "Standard Wireless Case", price: 21999, oldPrice: 25999, stock: 8, sku: "KA-BOS-022-BLK-STD" },
      { color: "Black", size: "Standard Fit (Includes S/M/L Kits)", variant: "Wireless Charging Cover Bundle", price: 23999, oldPrice: 27999, stock: 4, sku: "KA-BOS-022-BLK-BND" },
      { color: "White Smoke", size: "Standard Fit (Includes S/M/L Kits)", variant: "Standard Wireless Case", price: 21999, oldPrice: 25999, stock: 6, sku: "KA-BOS-022-WHT-STD" }
    ]
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
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=900&q=80",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=900&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&q=80"
    ],
    imageAngles: [
      "Chroma RGB Underglow & Layout",
      "Mechanical Switch Stem & Keycaps",
      "Magnetic Plush Leather Wrist Rest",
      "RGB Gaming Battlestation Setup"
    ],
    description: "Command dial with 8 dedicated macro keys, Razer Green clicky mechanical switches, magnetic plush wrist rest with underglow, and 8000Hz polling rate.",
    specifications: {
      Switches: "Razer Green Mechanical Switches (Clicky & Tactile)",
      PollingRate: "Up to 8000 Hz",
      Lighting: "Razer Chroma RGB Per-Key & 3-Side Underglow",
      Warranty: "2 Years"
    },
    colors: ["Classic Matte Black", "Mercury White"],
    colorMap: {
      "Classic Matte Black": { hex: "#18181B", image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=900&q=80" },
      "Mercury White": { hex: "#F3F4F6", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=900&q=80" }
    },
    sizes: ["Full Size (104 Keys + 8 Macro)"],
    variants: ["Green Switches (Clicky & Tactile)", "Yellow Switches (Linear & Silent)", "Orange Switches (Tactile & Quiet)"],
    variationMatrix: [
      { color: "Classic Matte Black", size: "Full Size (104 Keys + 8 Macro)", variant: "Green Switches (Clicky & Tactile)", price: 18499, oldPrice: 21999, stock: 6, sku: "KA-RAZ-023-BLK-GRN" },
      { color: "Classic Matte Black", size: "Full Size (104 Keys + 8 Macro)", variant: "Yellow Switches (Linear & Silent)", price: 18999, oldPrice: 22499, stock: 4, sku: "KA-RAZ-023-BLK-YEL" },
      { color: "Mercury White", size: "Full Size (104 Keys + 8 Macro)", variant: "Green Switches (Clicky & Tactile)", price: 19499, oldPrice: 22999, stock: 3, sku: "KA-RAZ-023-WHT-GRN" }
    ]
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
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=900&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=900&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&q=80"
    ],
    imageAngles: [
      "Classic Pilot Teardrop Lenses",
      "Polished Metal Temples & Logo",
      "Folded Profile & Leather Case",
      "Summer Lifestyle Wear"
    ],
    description: "Timeless teardrop pilot shape in polished gold metal frame with crystal green G-15 polarized lenses providing 100% UV protection and glare elimination.",
    specifications: {
      Frame: "Polished Gold Metal",
      Lens: "Crystal Green Polarized G-15",
      UVProtection: "100% UV400",
      Warranty: "2 Years"
    },
    colors: ["Gold Frame / Green Classic G-15", "Gunmetal Frame / Polarized Grey", "Black Frame / Gradient Blue"],
    colorMap: {
      "Gold Frame / Green Classic G-15": { hex: "#D4AF37", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=900&q=80" },
      "Gunmetal Frame / Polarized Grey": { hex: "#4B5563", image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=900&q=80" },
      "Black Frame / Gradient Blue": { hex: "#1E3A8A", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&q=80" }
    },
    sizes: ["Small (55mm)", "Standard (58mm)", "Large (62mm)"],
    variants: ["Standard Crystal Lens", "Polarized Anti-Glare Lens"],
    variationMatrix: [
      { color: "Gold Frame / Green Classic G-15", size: "Standard (58mm)", variant: "Standard Crystal Lens", price: 7990, oldPrice: 9990, stock: 12, sku: "KA-RAY-024-GLD-58" },
      { color: "Gold Frame / Green Classic G-15", size: "Large (62mm)", variant: "Polarized Anti-Glare Lens", price: 8990, oldPrice: 10990, stock: 8, sku: "KA-RAY-024-GLD-62P" },
      { color: "Gunmetal Frame / Polarized Grey", size: "Standard (58mm)", variant: "Polarized Anti-Glare Lens", price: 8990, oldPrice: 10990, stock: 6, sku: "KA-RAY-024-GUN-58P" }
    ]
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
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=900&q=80",
      "https://images.unsplash.com/photo-1510519138195-068d828884bb?w=900&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=900&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80"
    ],
    imageAngles: [
      "49mm Titanium Case & Action Button",
      "Dual-Frequency GPS & Speakers",
      "Sapphire Crystal Sensor Array",
      "Extreme Mountaineering Wear"
    ],
    description: "Rugged 49mm aerospace-grade titanium casing, dual-frequency precision GPS, up to 72 hours battery life in low power mode, and 100m water resistance.",
    specifications: {
      Case: "49mm Titanium",
      Display: "Always-On Retina 3000 nits",
      Battery: "Up to 36 hours (72h Low Power)",
      WaterResistance: "100m Water Resistance (EN13319)",
      Warranty: "1 Year Official AppleCare"
    },
    colors: ["Titanium / Orange Ocean Band", "Titanium / Midnight Ocean Band", "Titanium / Blue Alpine Loop"],
    colorMap: {
      "Titanium / Orange Ocean Band": { hex: "#F97316", image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=900&q=80" },
      "Titanium / Midnight Ocean Band": { hex: "#18181B", image: "https://images.unsplash.com/photo-1510519138195-068d828884bb?w=900&q=80" },
      "Titanium / Blue Alpine Loop": { hex: "#2563EB", image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=900&q=80" }
    },
    sizes: ["49mm Titanium Case"],
    variants: ["Ocean Band (Water & Dive)", "Alpine Loop (Outdoor Trail)", "Trail Loop (Ultra Lightweight)"],
    variationMatrix: [
      { color: "Titanium / Orange Ocean Band", size: "49mm Titanium Case", variant: "Ocean Band (Water & Dive)", price: 89900, oldPrice: 94900, stock: 6, sku: "KA-APP-025-ORG-OCN" },
      { color: "Titanium / Midnight Ocean Band", size: "49mm Titanium Case", variant: "Ocean Band (Water & Dive)", price: 89900, oldPrice: 94900, stock: 5, sku: "KA-APP-025-MID-OCN" },
      { color: "Titanium / Blue Alpine Loop", size: "49mm Titanium Case", variant: "Alpine Loop (Outdoor Trail)", price: 89900, oldPrice: 94900, stock: 4, sku: "KA-APP-025-BLU-ALP" }
    ]
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
    image: "https://images.unsplash.com/photo-1510519138195-068d828884bb?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1510519138195-068d828884bb?w=900&q=80",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=900&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=900&q=80",
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=900&q=80"
    ],
    imageAngles: [
      "1.4'' Brilliant AMOLED Display",
      "Titanium Bezel & 5-Button Control",
      "Elevate Optical HR & GPS Sensor",
      "Triathlon & Marathon Performance"
    ],
    description: "Brilliant 1.4-inch AMOLED touchscreen display, titanium bezel, advanced training metrics, built-in full-color mapping, and up to 23 days battery life.",
    specifications: {
      Display: "1.4 inch AMOLED Touchscreen",
      Battery: "Up to 23 Days in Smartwatch Mode",
      Bezel: "Titanium Bezel",
      Sensors: "Multi-Band GNSS & Pulse Ox",
      Warranty: "2 Years Garmin Warranty"
    },
    colors: ["Black / Powder Gray", "Whitestone / Powder Gray", "Amp Yellow / Black"],
    colorMap: {
      "Black / Powder Gray": { hex: "#18181B", image: "https://images.unsplash.com/photo-1510519138195-068d828884bb?w=900&q=80" },
      "Whitestone / Powder Gray": { hex: "#E5E7EB", image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=900&q=80" },
      "Amp Yellow / Black": { hex: "#EAB308", image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=900&q=80" }
    },
    sizes: ["47mm Case (Standard Fit)"],
    variants: ["Standard Silicone Band", "Titanium QuickFit Edition (+Extra Band)"],
    variationMatrix: [
      { color: "Black / Powder Gray", size: "47mm Case (Standard Fit)", variant: "Standard Silicone Band", price: 67490, oldPrice: 74990, stock: 6, sku: "KA-GAR-026-BLK-STD" },
      { color: "Black / Powder Gray", size: "47mm Case (Standard Fit)", variant: "Titanium QuickFit Edition (+Extra Band)", price: 71490, oldPrice: 78990, stock: 3, sku: "KA-GAR-026-BLK-TIT" },
      { color: "Whitestone / Powder Gray", size: "47mm Case (Standard Fit)", variant: "Standard Silicone Band", price: 67490, oldPrice: 74990, stock: 4, sku: "KA-GAR-026-WHT-STD" }
    ]
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

  const defaultMap = new Map(defaultProducts.map(p => [Number(p.id), p]));

  // Clean up and merge rich images/variations from default catalog
  const sanitized = list.map(p => {
    const clean = { ...p };
    delete clean.watchType;
    if (clean.specifications && clean.specifications["Quality Type"]) {
      const specs = { ...clean.specifications };
      delete specs["Quality Type"];
      clean.specifications = specs;
    }

    const defaultP = defaultMap.get(Number(p.id));
    if (defaultP) {
      // Ensure multi-angle images and variation matrices are merged
      if (!clean.images || clean.images.length < 3) {
        clean.images = defaultP.images;
      }
      if (!clean.imageAngles || clean.imageAngles.length < 3) {
        clean.imageAngles = defaultP.imageAngles;
      }
      if (!clean.colors || clean.colors.length === 0) {
        clean.colors = defaultP.colors;
      }
      if (!clean.colorMap || Object.keys(clean.colorMap).length === 0) {
        clean.colorMap = defaultP.colorMap;
      }
      if (!clean.sizes || clean.sizes.length === 0) {
        clean.sizes = defaultP.sizes;
      }
      if (!clean.variants || clean.variants.length === 0) {
        clean.variants = defaultP.variants;
      }
      if (!clean.variationMatrix || clean.variationMatrix.length === 0) {
        clean.variationMatrix = defaultP.variationMatrix;
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