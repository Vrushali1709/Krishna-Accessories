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
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800"
    ],
    imageAngles: ["Front Dial View", "45° Side Profile", "On-Wrist Lifestyle", "Caseback & Movement"],
    description: "Handcrafted luxury automatic analog watch with premium sapphire crystal glass, surgical-grade stainless steel dial, and water resistance up to 50 meters.",
    specifications: {
      Material: "316L Stainless Steel",
      Movement: "Japanese Automatic Quartz (Calibre NH35)",
      Glass: "Anti-Reflective Sapphire Crystal",
      WaterResistance: "50m / 5 ATM",
      CaseDiameter: "41mm",
      Warranty: "2 Years International Warranty"
    },
    colors: ["Champagne Gold", "Silver Chrome", "Midnight Black"],
    colorHex: { "Champagne Gold": "#D4AF37", "Silver Chrome": "#E5E7EB", "Midnight Black": "#111827" },
    colorImages: {
      "Champagne Gold": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
      "Silver Chrome": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800",
      "Midnight Black": "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800"
    },
    sizes: ["39mm Case", "41mm Case", "43mm Case"],
    variants: ["Oystersteel Bracelet", "Italian Leather Strap", "Jubilee Mesh"],
    variantPriceDeltas: { "Oystersteel Bracelet": 0, "Italian Leather Strap": -500, "Jubilee Mesh": 800 }
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
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800"
    ],
    imageAngles: ["Front Chrono Dial", "Side Tachymeter Bezel", "Wrist Perspective", "Precision Sub-Dials"],
    description: "Sophisticated multi-dial chronograph watch featuring a sunray royal blue dial, genuine Italian leather strap, and stop-watch micro-second precision.",
    specifications: {
      Material: "316L Stainless Steel & Hand-Stitched Leather",
      Movement: "Multi-Function Japanese Chronograph",
      Glass: "Scratch-Resistant Mineral Crystal",
      WaterResistance: "50m / 5 ATM",
      CaseDiameter: "42mm",
      Warranty: "2 Years International Warranty"
    },
    colors: ["Royal Blue", "Onyx Black", "Sunburst Silver"],
    colorHex: { "Royal Blue": "#1E3A8A", "Onyx Black": "#0F172A", "Sunburst Silver": "#CBD5E1" },
    colorImages: {
      "Royal Blue": "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800",
      "Onyx Black": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800",
      "Sunburst Silver": "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800"
    },
    sizes: ["40mm Case", "42mm Case", "44mm Case"],
    variants: ["Italian Calfskin Strap", "Stainless Steel Bracelet", "All-Black PVD"],
    variantPriceDeltas: { "Italian Calfskin Strap": 0, "Stainless Steel Bracelet": 1000, "All-Black PVD": 1500 }
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
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800",
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800"
    ],
    imageAngles: ["Front Solar Dial", "Side Pushers & Crown", "Lifestyle Wrist Shot", "Solar Cell Close-up"],
    description: "High-precision solar chronograph powered by ambient light energy with Bluetooth smartphone link and 100m water resistance.",
    specifications: {
      Material: "Solid 316L Stainless Steel",
      Movement: "Tough Solar High-Efficiency Quartz",
      Glass: "Sapphire Anti-Reflective Coating",
      WaterResistance: "100m / 10 ATM",
      CaseDiameter: "43mm",
      Warranty: "2 Years International Warranty"
    },
    colors: ["Carbon Black", "Gunmetal Grey", "Brushed Silver"],
    colorHex: { "Carbon Black": "#18181B", "Gunmetal Grey": "#4B5563", "Brushed Silver": "#E2E8F0" },
    colorImages: {
      "Carbon Black": "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800",
      "Gunmetal Grey": "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800",
      "Brushed Silver": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"
    },
    sizes: ["41mm Case", "43mm Case"],
    variants: ["Solar Steel Bracelet", "Carbon Fiber Edition", "Silicone Sport Band"],
    variantPriceDeltas: { "Solar Steel Bracelet": 0, "Carbon Fiber Edition": 1200, "Silicone Sport Band": -600 }
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
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800"
    ],
    imageAngles: ["Cerachrom Bezel Face", "45° Oyster Case Profile", "Executive Wrist Shot", "Cyclops Date & Luminescence"],
    description: "Iconic luxury diver timepiece with Cerachrom unidirectional rotating bezel, Chromalight blue luminescence, scratch-resistant sapphire crystal, and Calibre 3235 automatic mechanical movement.",
    specifications: {
      Material: "Oystersteel (904L Surgical Stainless Steel)",
      Movement: "Perpetual Mechanical Self-Winding (Calibre 3235)",
      Glass: "Cyclops Sapphire Glass with Anti-Reflective Coating",
      WaterResistance: "300m / 30 ATM / 1000 ft",
      CaseDiameter: "41mm",
      Warranty: "5 Years International Guarantee"
    },
    colors: ["Emerald Green", "Onyx Black", "Royal Two-Tone Gold"],
    colorHex: { "Emerald Green": "#065F46", "Onyx Black": "#030712", "Royal Two-Tone Gold": "#B45309" },
    colorImages: {
      "Emerald Green": "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=800",
      "Onyx Black": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800",
      "Royal Two-Tone Gold": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800"
    },
    sizes: ["40mm Case", "41mm Case"],
    variants: ["Oysterlock Glidelock Clasp", "Jubilee Luxury Bracelet", "RubberB Sport Diver"],
    variantPriceDeltas: { "Oysterlock Glidelock Clasp": 0, "Jubilee Luxury Bracelet": 3500, "RubberB Sport Diver": -1500 }
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
    imageAngles: ["HD Display Active Face", "Side Magnetic Crown", "Workout Fitness Tracker", "Charging Interface"],
    description: "1.91'' UltraVU HD Display with single-sync BT Calling, 100+ sports modes, AI voice assistant, and 7-day battery life.",
    specifications: {
      Display: "1.91 inch HD Curved Touchscreen",
      Battery: "7 Days Typical Usage (300mAh)",
      Connectivity: "Bluetooth 5.3",
      WaterResistance: "IP68 Water & Dust Resistant",
      Warranty: "1 Year Manufacturer Warranty"
    },
    colors: ["Pitch Black", "Teal Blue", "Olive Green"],
    colorHex: { "Pitch Black": "#18181B", "Teal Blue": "#0D9488", "Olive Green": "#3F6212" },
    colorImages: {
      "Pitch Black": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800",
      "Teal Blue": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800",
      "Olive Green": "https://images.unsplash.com/photo-1510519138195-068d828884bb?w=800"
    },
    sizes: ["Standard 45mm", "Slim 41mm"],
    variants: ["Silicone Sport Band", "Magnetic Milanese Loop", "Rugged Armor Strap"],
    variantPriceDeltas: { "Silicone Sport Band": 0, "Magnetic Milanese Loop": 499, "Rugged Armor Strap": 299 }
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
    imageAngles: ["Vintage Domed Sapphire Dial", "Side Polished Crown", "On-Wrist Business Look", "Exhibition Sapphire Caseback"],
    description: "Prestigious Swiss-made vintage automatic timepiece featuring domed sapphire crystal, exhibition case back with engraved rotor, and genuine embossed calfskin strap.",
    specifications: {
      Material: "316L Stainless Steel & Embossed Calfskin Leather",
      Movement: "Swiss Automatic Powermatic 80 (80-Hour Reserve)",
      Glass: "Domed Scratch-Resistant Sapphire",
      WaterResistance: "100m / 10 ATM",
      CaseDiameter: "40mm",
      Warranty: "2 Years International Warranty"
    },
    colors: ["Silver Dial / Brown Strap", "Black Dial / Black Strap", "Rose Gold Two-Tone"],
    colorHex: { "Silver Dial / Brown Strap": "#78350F", "Black Dial / Black Strap": "#18181B", "Rose Gold Two-Tone": "#FB7185" },
    colorImages: {
      "Silver Dial / Brown Strap": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",
      "Black Dial / Black Strap": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
      "Rose Gold Two-Tone": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800"
    },
    sizes: ["39mm Case", "40mm Case"],
    variants: ["Embossed Leather Strap", "Stainless Steel Milanese", "Deployant Butterfly Clasp"],
    variantPriceDeltas: { "Embossed Leather Strap": 0, "Stainless Steel Milanese": 1500, "Deployant Butterfly Clasp": 800 }
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
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800",
      "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=800",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800"
    ],
    imageAngles: ["Panda Tachymeter Dial", "Screw-Down Pushers Side", "Racecar Driver Wrist Shot", "Calibre 4130 Movement"],
    description: "High-precision luxury chronograph with engraved tachymetric scale Cerachrom bezel, triple sub-dials, Oystersteel bracelet, and certified chronometer mechanical movement.",
    specifications: {
      Material: "Oystersteel 904L & Black Cerachrom",
      Movement: "Calibre 4130 Perpetual Chronograph",
      Glass: "Scratch-Resistant Sapphire Crystal",
      WaterResistance: "100m / 10 ATM",
      CaseDiameter: "40mm",
      Warranty: "5 Years International Warranty"
    },
    colors: ["Panda White", "Onyx Black", "Yellow Gold Champagne"],
    colorHex: { "Panda White": "#F8FAFC", "Onyx Black": "#0F172A", "Yellow Gold Champagne": "#CA8A04" },
    colorImages: {
      "Panda White": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800",
      "Onyx Black": "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800",
      "Yellow Gold Champagne": "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=800"
    },
    sizes: ["40mm Case"],
    variants: ["Oystersteel Bracelet", "Oysterflex Elastomer Band", "Jubilee Gold Two-Tone"],
    variantPriceDeltas: { "Oystersteel Bracelet": 0, "Oysterflex Elastomer Band": 2000, "Jubilee Gold Two-Tone": 5000 }
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
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"
    ],
    imageAngles: ["Moonwatch Step Dial", "Side Anodised Aluminium Bezel", "Astronaut Wrist Perspective", "Master Chronometer Seal"],
    description: "Legendary Speedmaster Moonwatch chronograph featuring a black step dial, sapphire crystal, and Master Chronometer certified co-axial movement.",
    specifications: {
      Material: "316L Stainless Steel Case & Bracelet",
      Movement: "Co-Axial Master Chronometer Calibre 3861",
      Glass: "Sapphire Crystal with Anti-Reflective Treatment",
      WaterResistance: "50m / 5 ATM",
      CaseDiameter: "42mm",
      Warranty: "5 Years International Warranty"
    },
    colors: ["Moon Black", "Deep Blue Space", "Silver Snoopy Edition"],
    colorHex: { "Moon Black": "#111827", "Deep Blue Space": "#1E3A8A", "Silver Snoopy Edition": "#E2E8F0" },
    colorImages: {
      "Moon Black": "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800",
      "Deep Blue Space": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800",
      "Silver Snoopy Edition": "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800"
    },
    sizes: ["42mm Case"],
    variants: ["Brushed Steel Bracelet", "Nylon NATO Astronaut Strap", "Vintage Leather"],
    variantPriceDeltas: { "Brushed Steel Bracelet": 0, "Nylon NATO Astronaut Strap": -1000, "Vintage Leather": 500 }
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
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800"
    ],
    imageAngles: ["Front Sunburst Dial", "Side 4 O'Clock Crown", "Casual Everyday Wrist View", "Exhibition Day-Date Rotor"],
    description: "Authentic Seiko 5 Sports automatic timepiece, thoroughly crafted with LumiBrite hands, exhibition case back, and tested for precise timekeeping.",
    specifications: {
      Material: "Solid 316L Stainless Steel",
      Movement: "Genuine Seiko 4R36 24-Jewel Automatic",
      Glass: "Hardlex Crystal",
      WaterResistance: "100m / 10 ATM",
      CaseDiameter: "42.5mm",
      Warranty: "2 Years International Warranty"
    },
    colors: ["Sunburst Silver", "Champagne Gold", "Pepsi Red & Blue Bezel"],
    colorHex: { "Sunburst Silver": "#CBD5E1", "Champagne Gold": "#EAB308", "Pepsi Red & Blue Bezel": "#DC2626" },
    colorImages: {
      "Sunburst Silver": "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800",
      "Champagne Gold": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
      "Pepsi Red & Blue Bezel": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800"
    },
    sizes: ["40mm Case", "42.5mm Case"],
    variants: ["Steel Jubilee Bracelet", "Silicone Diver Strap", "Leather Band"],
    variantPriceDeltas: { "Steel Jubilee Bracelet": 0, "Silicone Diver Strap": -400, "Leather Band": 200 }
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
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800"
    ],
    imageAngles: ["Front Exterior Silhouette", "Side Gusset & Strap", "Interior Laptop Compartments", "Solid Brass Hardware Detail"],
    description: "Handcrafted vegetable-tanned genuine leather briefcase with padded 15.6-inch laptop compartment, solid brass hardware, and detachable shoulder strap.",
    specifications: {
      Material: "100% Genuine Full-Grain Vegetable-Tanned Leather",
      Capacity: "Fits up to 15.6-inch Laptops + Documents",
      Hardware: "Antique Solid Brass",
      Dimensions: "40cm x 30cm x 10cm",
      Warranty: "1 Year International Guarantee"
    },
    colors: ["Rich Cognac Brown", "Classic Obsidian Black", "Deep Mahogany"],
    colorHex: { "Rich Cognac Brown": "#92400E", "Classic Obsidian Black": "#111827", "Deep Mahogany": "#451A03" },
    colorImages: {
      "Rich Cognac Brown": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800",
      "Classic Obsidian Black": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
      "Deep Mahogany": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800"
    },
    sizes: ["Standard 15.6-inch", "Slim 14-inch", "Executive 17-inch"],
    variants: ["Single Gusset Classic", "Double Gusset Expandable", "Detachable Shoulder Strap"],
    variantPriceDeltas: { "Single Gusset Classic": 0, "Double Gusset Expandable": 1500, "Detachable Shoulder Strap": 500 }
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
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800"
    ],
    imageAngles: ["Front Ergonomic Profile", "Side Water Bottle Pocket", "Back AirMesh Lumbar Pad", "Rain Cover Deployed"],
    description: "Weatherproof 32-liter urban travel backpack with ergonomic AirMesh lumbar support, dedicated USB charging port pass-through, and rain cover included.",
    specifications: {
      Material: "High-Density Ballistic Polyester & Cordura",
      Volume: "32 Litres",
      Compartments: "3 Main + 2 Side Water Bottle Sleeves",
      Warranty: "5 Years Warranty"
    },
    colors: ["Charcoal Grey", "Navy Blue", "Olive Tactical"],
    colorHex: { "Charcoal Grey": "#4B5563", "Navy Blue": "#1E3A8A", "Olive Tactical": "#365314" },
    colorImages: {
      "Charcoal Grey": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
      "Navy Blue": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800",
      "Olive Tactical": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800"
    },
    sizes: ["26 Litres Compact", "32 Litres Standard", "40 Litres Travel"],
    variants: ["Standard Pack", "With USB Charger Port", "Pro Laptop Edition"],
    variantPriceDeltas: { "Standard Pack": 0, "With USB Charger Port": 300, "Pro Laptop Edition": 600 }
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
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800"
    ],
    imageAngles: ["Front Monogram Silhouette", "Side Profile & Handles", "Interior Zip Compartment", "Gold Plated Logo Plaque"],
    description: "Chic structured tote bag featuring iconic monogram detailing, premium faux-leather trim, magnetic closure, and removable matching zip pouch.",
    specifications: {
      Material: "Premium Jacquard Canvas & Vegan Leather",
      Closure: "Magnetic Snap with Zip Top",
      Dimensions: "38cm x 28cm x 14cm",
      Warranty: "1 Year International Guarantee"
    },
    colors: ["Navy / Red Ribbon", "Black Monogram", "Beige Canvas"],
    colorHex: { "Navy / Red Ribbon": "#1E3A8A", "Black Monogram": "#18181B", "Beige Canvas": "#D6D3D1" },
    colorImages: {
      "Navy / Red Ribbon": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",
      "Black Monogram": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800",
      "Beige Canvas": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800"
    },
    sizes: ["Medium Tote", "Large Shopper Tote"],
    variants: ["Tote Only", "Tote + Matching Wallet Pouch", "With Crossbody Strap"],
    variantPriceDeltas: { "Tote Only": 0, "Tote + Matching Wallet Pouch": 1200, "With Crossbody Strap": 500 }
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
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800"
    ],
    imageAngles: ["Lateral Side Profile", "Top Down Lacing View", "Outsole Waffle Traction", "Heel Cushioning & Collar"],
    description: "Responsive cushioning in the Nike Air Zoom Pegasus provides a springy feel for everyday road and track runners with engineered breathable mesh.",
    specifications: {
      Material: "Engineered Mesh Upper & Flywire Cables",
      Sole: "Zoom Air Forefoot & React Foam Midsole",
      Weight: "260g",
      Drop: "10mm",
      Warranty: "6 Months Brand Warranty"
    },
    colors: ["Crimson Red", "Triple Stealth Black", "Pure Platinum White"],
    colorHex: { "Crimson Red": "#DC2626", "Triple Stealth Black": "#0F172A", "Pure Platinum White": "#F1F5F9" },
    colorImages: {
      "Crimson Red": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
      "Triple Stealth Black": "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800",
      "Pure Platinum White": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800"
    },
    sizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
    variants: ["Standard Running Fit", "Wide Fit (2E)", "FlyEase Slip-On"],
    variantPriceDeltas: { "Standard Running Fit": 0, "Wide Fit (2E)": 200, "FlyEase Slip-On": 500 }
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
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800",
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800"
    ],
    imageAngles: ["Primeknit Lateral View", "Continental Rubber Tread", "On-Foot Street Shot", "Boost Foam Texture"],
    description: "Experience epic energy return with Light BOOST cushioning technology and an adaptive Primeknit+ textile upper designed for ultimate comfort.",
    specifications: {
      Material: "Primeknit+ High Performance Textile",
      Sole: "Light BOOST with Continental Rubber Tread",
      Drop: "10mm",
      Warranty: "6 Months Brand Warranty"
    },
    colors: ["Core Black", "Cloud White", "Solar Flash Red"],
    colorHex: { "Core Black": "#111827", "Cloud White": "#FAFAFA", "Solar Flash Red": "#EF4444" },
    colorImages: {
      "Core Black": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800",
      "Cloud White": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
      "Solar Flash Red": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800"
    },
    sizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
    variants: ["Standard Insole", "Pro Ortholite Performance Insole", "Reflective 3M Edition"],
    variantPriceDeltas: { "Standard Insole": 0, "Pro Ortholite Performance Insole": 400, "Reflective 3M Edition": 800 }
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
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800",
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800"
    ],
    imageAngles: ["Low-Boot Profile", "PUMAGRIP Outsole", "Ankle Collar Fit", "Reflective Heel Clip"],
    description: "Sleek low-boot street design infused with advanced NITRO foam for featherlight responsiveness and all-day urban walking comfort.",
    specifications: {
      Material: "Engineered Mesh & Synthetic Overlays",
      Sole: "PUMAGRIP High-Traction Rubber Compound",
      Weight: "250g",
      Warranty: "6 Months Brand Warranty"
    },
    colors: ["Puma White / Black", "Triple Stealth Black", "Neon Lime"],
    colorHex: { "Puma White / Black": "#E2E8F0", "Triple Stealth Black": "#18181B", "Neon Lime": "#84CC16" },
    colorImages: {
      "Puma White / Black": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800",
      "Triple Stealth Black": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
      "Neon Lime": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800"
    },
    sizes: ["UK 7", "UK 8", "UK 9", "UK 10"],
    variants: ["Classic Lacing", "Speed Laces + Extra Insole"],
    variantPriceDeltas: { "Classic Lacing": 0, "Speed Laces + Extra Insole": 350 }
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
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800"
    ],
    imageAngles: ["High-Top Ankle Collar", "Perforated Leather Toe Box", "Wings Logo Detail", "Encapsulated Air Sole"],
    description: "Iconic high-top silhouette in premium genuine tumbled leather with encapsulated Air-Sole unit and legendary basketball legacy.",
    specifications: {
      Material: "100% Genuine Full-Grain Tumbled Leather",
      Sole: "Solid Rubber Cupsole with Encapsulated Air",
      AnkleHeight: "High-Top",
      Warranty: "6 Months Brand Warranty"
    },
    colors: ["Chicago Red / White / Black", "Shadow Grey / Black", "University Blue"],
    colorHex: { "Chicago Red / White / Black": "#B91C1C", "Shadow Grey / Black": "#4B5563", "University Blue": "#38BDF8" },
    colorImages: {
      "Chicago Red / White / Black": "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800",
      "Shadow Grey / Black": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
      "University Blue": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800"
    },
    sizes: ["UK 7.5", "UK 8.5", "UK 9.5", "UK 10.5", "UK 11.5"],
    variants: ["Collector Edition Box", "Standard Retail Box"],
    variantPriceDeltas: { "Collector Edition Box": 1000, "Standard Retail Box": 0 }
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
    imageAngles: ["Front 2K Dynamic AMOLED", "Back 200MP Quad Camera", "Built-In S-Pen Ejected", "Grade 5 Titanium Frame"],
    description: "Next-generation titanium design equipped with Galaxy AI, 200MP Quad Telephoto Camera system, S-Pen built-in, and Snapdragon 8 Gen 4 chipset.",
    specifications: {
      Display: "6.8 inch Dynamic AMOLED 2X 120Hz (2600 nits)",
      Processor: "Snapdragon 8 Gen 4 for Galaxy",
      Storage: "256GB / 512GB / 1TB UFS 4.0",
      RAM: "12GB / 16GB LPDDR5X",
      Camera: "200MP + 50MP 5x Tele + 12MP UW + 10MP 3x Tele",
      Battery: "5000mAh with 45W Fast Charging",
      Warranty: "1 Year Samsung India Warranty"
    },
    colors: ["Titanium Black", "Titanium Gray", "Titanium Violet"],
    colorHex: { "Titanium Black": "#1E293B", "Titanium Gray": "#64748B", "Titanium Violet": "#7C3AED" },
    colorImages: {
      "Titanium Black": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
      "Titanium Gray": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800",
      "Titanium Violet": "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800"
    },
    sizes: ["256GB (12GB RAM)", "512GB (12GB RAM)", "1TB (16GB RAM)"],
    variants: ["Device Only", "Device + 45W SuperCharger Bundle", "With Samsung Care+ (2 Years)"],
    variantPriceDeltas: { "256GB (12GB RAM)": 0, "512GB (12GB RAM)": 15000, "1TB (16GB RAM)": 35000 }
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
    imageAngles: ["Super Retina XDR Display", "Triple 48MP Fusion Camera", "Camera Control Button Side", "Grade 5 Titanium Bevel"],
    description: "Forged in grade 5 titanium with Apple Intelligence, revolutionary A18 Pro chip, 48MP Fusion camera with 5x Telephoto, and industry-leading battery longevity.",
    specifications: {
      Display: "6.9 inch Super Retina XDR ProMotion 120Hz",
      Chipset: "Apple A18 Pro Bionic with 6-Core GPU",
      Storage: "256GB / 512GB / 1TB NVMe",
      Camera: "48MP Main + 48MP Ultra-Wide + 12MP 5x Telephoto",
      Battery: "Up to 33 Hours Video Playback",
      Warranty: "1 Year Apple India Official Warranty"
    },
    colors: ["Desert Titanium", "Natural Titanium", "Black Titanium", "White Titanium"],
    colorHex: { "Desert Titanium": "#D4B996", "Natural Titanium": "#A8A29E", "Black Titanium": "#1C1917", "White Titanium": "#F5F5F4" },
    colorImages: {
      "Desert Titanium": "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800",
      "Natural Titanium": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
      "Black Titanium": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800",
      "White Titanium": "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800"
    },
    sizes: ["256GB Storage", "512GB Storage", "1TB Storage"],
    variants: ["Device Only", "Device + 30W USB-C Adapter", "With AppleCare+ (2 Years)"],
    variantPriceDeltas: { "256GB Storage": 0, "512GB Storage": 20000, "1TB Storage": 40000 }
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
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800"
    ],
    imageAngles: ["2K ProXDR 120Hz Screen", "Hasselblad Camera Island", "Alert Slider & Side Bezel", "100W SUPERVOOC Charging"],
    description: "Hasselblad 4th Gen Mobile Camera, 100W SUPERVOOC fast charge with 6000mAh silicon-carbon battery and ultra-smooth 2K 120Hz Oriental Screen.",
    specifications: {
      Display: "6.82 inch 2K ProXDR 120Hz Oriental Display",
      Storage: "256GB / 512GB UFS 4.0",
      RAM: "16GB / 24GB LPDDR5X",
      Battery: "6000mAh with 100W Wired & 50W Wireless Charging",
      Warranty: "1 Year Manufacturer Warranty"
    },
    colors: ["Emerald Silk", "Midnight Obsidian", "Arctic Dawn"],
    colorHex: { "Emerald Silk": "#047857", "Midnight Obsidian": "#0F172A", "Arctic Dawn": "#F8FAFC" },
    colorImages: {
      "Emerald Silk": "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800",
      "Midnight Obsidian": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
      "Arctic Dawn": "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800"
    },
    sizes: ["16GB / 256GB", "16GB / 512GB", "24GB / 1TB"],
    variants: ["Standard Edition", "Aramid Fiber Case Bundle"],
    variantPriceDeltas: { "16GB / 256GB": 0, "16GB / 512GB": 8000, "24GB / 1TB": 18000 }
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
      "https://images.unsplash.com/photo-1542272604-780c96856592?w=800"
    ],
    imageAngles: ["Full Straight Leg View", "Back Pocket Two-Horse Patch", "Button Fly Close-up", "Denim Weave Texture"],
    description: "The iconic straight fit with signature button fly crafted from 100% heavyweight cotton denim that molds uniquely to your body over time.",
    specifications: {
      Material: "100% Heavyweight Cotton Denim (14oz)",
      Fit: "Original Straight Leg",
      Closure: "Iconic Signature Button Fly",
      Care: "Machine Wash Cold Inside Out"
    },
    colors: ["Dark Indigo Wash", "Light Vintage Stonewash", "Obsidian Black"],
    colorHex: { "Dark Indigo Wash": "#1E3A8A", "Light Vintage Stonewash": "#60A5FA", "Obsidian Black": "#111827" },
    colorImages: {
      "Dark Indigo Wash": "https://images.unsplash.com/photo-1542272604-780c96856592?w=800",
      "Light Vintage Stonewash": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800",
      "Obsidian Black": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800"
    },
    sizes: ["30W x 32L", "32W x 32L", "34W x 32L", "36W x 32L"],
    variants: ["Standard Hem", "Custom Selvedge Edge"],
    variantPriceDeltas: { "Standard Hem": 0, "Custom Selvedge Edge": 700 }
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
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800"
    ],
    imageAngles: ["Formal Front Profile", "Peak Lapel & Pocket Square", "Silk Inner Lining", "Horn Button Cuffs"],
    description: "Modern unstructured slim fit blazer with peak lapels, flap pockets, and breathable stretch wool-blend fabric for business and evening formal wear.",
    specifications: {
      Material: "Italian Wool & Viscose Blend",
      Fit: "Tailored Slim Fit",
      Lining: "100% Breathable Acetate Silk",
      Care: "Dry Clean Only"
    },
    colors: ["Navy Blue", "Charcoal Gray", "Midnight Black"],
    colorHex: { "Navy Blue": "#1E3A8A", "Charcoal Gray": "#475569", "Midnight Black": "#0F172A" },
    colorImages: {
      "Navy Blue": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800",
      "Charcoal Gray": "https://images.unsplash.com/photo-1542272604-780c96856592?w=800",
      "Midnight Black": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800"
    },
    sizes: ["38 (Small)", "40 (Medium)", "42 (Large)", "44 (XL)"],
    variants: ["Blazer Only", "Complete 2-Piece Suit with Trousers"],
    variantPriceDeltas: { "Blazer Only": 0, "Complete 2-Piece Suit with Trousers": 3500 }
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
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800"
    ],
    imageAngles: ["3.5K OLED InfinityEdge Screen", "Backlit Keyboard & Glass Trackpad", "CNC Aluminum Chassis Profile", "Thunderbolt 4 Ports"],
    description: "Ultra-premium CNC machined aluminum chassis with 3.5K OLED touchscreen, Intel Core Ultra 9 processor, NVIDIA RTX 4070 Graphics, and 64GB DDR5 RAM.",
    specifications: {
      Processor: "Intel Core Ultra 9 185H (16 Cores, 22 Threads)",
      Graphics: "NVIDIA GeForce RTX 4070 8GB GDDR6",
      RAM: "32GB / 64GB DDR5 5600MHz",
      Storage: "1TB / 2TB PCIe Gen4 NVMe SSD",
      Display: "15.6 inch 3.5K (3456x2160) OLED Touch (400 nits)",
      Warranty: "2 Years Dell ProSupport On-Site"
    },
    colors: ["Platinum Silver / Black Carbon Fiber", "Frost White"],
    colorHex: { "Platinum Silver / Black Carbon Fiber": "#CBD5E1", "Frost White": "#F8FAFC" },
    colorImages: {
      "Platinum Silver / Black Carbon Fiber": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
      "Frost White": "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800"
    },
    sizes: ["32GB RAM / 1TB SSD", "64GB RAM / 2TB SSD"],
    variants: ["Standard Windows 11 Pro", "Pro Workstation Bundle + Dell Dock"],
    variantPriceDeltas: { "32GB RAM / 1TB SSD": 0, "64GB RAM / 2TB SSD": 25000 }
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
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800"
    ],
    imageAngles: ["Liquid Retina XDR Display Open", "Magic Keyboard & Force Touch Trackpad", "MagSafe 3 & HDMI Ports", "Space Black Anodised Shell"],
    description: "Driven by M3 Max chip with 16-core CPU and 40-core GPU, stunning Liquid Retina XDR display, up to 22 hours battery life, and studio-quality mics.",
    specifications: {
      Processor: "Apple M3 Max Chip (16-Core CPU, 40-Core GPU)",
      RAM: "36GB / 48GB / 128GB Unified Memory",
      Storage: "1TB / 2TB / 4TB NVMe SSD",
      Display: "16.2-inch Liquid Retina XDR (3456x2234, 1600 nits peak)",
      Warranty: "1 Year Official AppleCare Support"
    },
    colors: ["Space Black", "Silver Metallic"],
    colorHex: { "Space Black": "#18181B", "Silver Metallic": "#E2E8F0" },
    colorImages: {
      "Space Black": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
      "Silver Metallic": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800"
    },
    sizes: ["36GB RAM / 1TB SSD", "48GB RAM / 2TB SSD", "128GB RAM / 4TB SSD"],
    variants: ["Device Only", "With 140W Fast Charger & MagSafe 3 Cable", "With AppleCare+ (3 Years)"],
    variantPriceDeltas: { "36GB RAM / 1TB SSD": 0, "48GB RAM / 2TB SSD": 45000, "128GB RAM / 4TB SSD": 120000 }
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
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"
    ],
    imageAngles: ["Over-Ear Headphone Profile", "Synthetic Soft Fit Leather Ear Cups", "Carrying Case Packed", "Touch Sensor Controls Side"],
    description: "Industry-leading noise cancellation with two processors and eight microphones for unprecedented sound clarity, crystal clear hands-free calls, and 30-hour battery.",
    specifications: {
      BatteryLife: "30 Hours with ANC On (3 min charge = 3 hours playback)",
      Driver: "30mm Precision Engineered Carbon Fiber Dome",
      Connectivity: "Bluetooth 5.2, LDAC High-Res Wireless Audio",
      Weight: "250g",
      Warranty: "1 Year Official Brand Warranty"
    },
    colors: ["Silver Grey", "Midnight Black", "Smoky Pink"],
    colorHex: { "Silver Grey": "#CBD5E1", "Midnight Black": "#0F172A", "Smoky Pink": "#F472B6" },
    colorImages: {
      "Silver Grey": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
      "Midnight Black": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800",
      "Smoky Pink": "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800"
    },
    sizes: ["Standard Adjustable Over-Ear"],
    variants: ["Headphones + Hard Case", "With Hi-Res Gold-Plated Audio Cable"],
    variantPriceDeltas: { "Headphones + Hard Case": 0, "With Hi-Res Gold-Plated Audio Cable": 990 }
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
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800"
    ],
    imageAngles: ["In-Ear Ergonomic Buds", "Wireless Charging Case Opened", "CustomFit Silicone Bands", "Spatial Audio Mesh Drivers"],
    description: "Breakthrough immersive spatial audio, world-class active noise cancellation, and CustomTune technology that personalizes sound to the shape of your ears.",
    specifications: {
      Battery: "6 Hours (24 Hours with Wireless Charging Case)",
      NoiseCancellation: "CustomTune World-Class Active Noise Cancelling",
      WaterResistance: "IPX4 Sweat & Weather Resistant",
      Warranty: "1 Year Official Bose Warranty"
    },
    colors: ["Triple Black", "White Smoke", "Moonstone Blue"],
    colorHex: { "Triple Black": "#111827", "White Smoke": "#F8FAFC", "Moonstone Blue": "#60A5FA" },
    colorImages: {
      "Triple Black": "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800",
      "White Smoke": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
      "Moonstone Blue": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800"
    },
    sizes: ["Single Universal Fit (3 Tip Sizes)"],
    variants: ["Standard Charging Case", "Wireless Qi Charging Case Cover Bundle"],
    variantPriceDeltas: { "Standard Charging Case": 0, "Wireless Qi Charging Case Cover Bundle": 1200 }
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
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800",
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800"
    ],
    imageAngles: ["Per-Key RGB Lighting Profile", "Command Dial & 8 Macro Keys", "Magnetic Plush Wrist Rest with Underglow", "Mechanical Switches Exposed"],
    description: "Command dial with 8 dedicated macro keys, Razer Green clicky mechanical switches, magnetic plush wrist rest with underglow, and 8000Hz polling rate.",
    specifications: {
      Switches: "Razer Green Mechanical (Clicky & Tactile)",
      PollingRate: "HyperPolling up to 8000 Hz",
      Lighting: "Razer Chroma RGB Per-Key & 3-Side Underglow",
      Warranty: "2 Years Manufacturer Warranty"
    },
    colors: ["Classic Black"],
    colorHex: { "Classic Black": "#0F172A" },
    colorImages: {
      "Classic Black": "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800"
    },
    sizes: ["Full-Size 104-Key + Macro Bank"],
    variants: ["Green Switches (Clicky)", "Yellow Switches (Linear & Silent)"],
    variantPriceDeltas: { "Green Switches (Clicky)": 0, "Yellow Switches (Linear & Silent)": 500 }
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
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800"
    ],
    imageAngles: ["Teardrop Front Lens View", "Thin Gold Metal Temple Arms", "Silicon Nose Pads & Bridge", "Etched Ray-Ban Logo & Case"],
    description: "Timeless teardrop pilot shape in polished gold metal frame with crystal green G-15 polarized lenses providing 100% UV protection and glare elimination.",
    specifications: {
      Frame: "Polished Gold Monel Metal Frame",
      Lens: "Crystal Green Polarized G-15 Glass",
      UVProtection: "100% UV400 Protection",
      Warranty: "2 Years International Warranty"
    },
    colors: ["Polished Gold / Green G-15", "Gunmetal / Polarized Grey", "Matte Black / Blue Gradient"],
    colorHex: { "Polished Gold / Green G-15": "#D4AF37", "Gunmetal / Polarized Grey": "#475569", "Matte Black / Blue Gradient": "#0F172A" },
    colorImages: {
      "Polished Gold / Green G-15": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800",
      "Gunmetal / Polarized Grey": "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800",
      "Matte Black / Blue Gradient": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800"
    },
    sizes: ["Standard 58mm Lens", "Large 62mm Lens"],
    variants: ["G-15 Polarized", "Chromance Color-Enhancing Lens"],
    variantPriceDeltas: { "G-15 Polarized": 0, "Chromance Color-Enhancing Lens": 1500 }
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
      "https://images.unsplash.com/photo-1510519138195-068d828884bb?w=800",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"
    ],
    imageAngles: ["49mm 3000-Nit Retina Display", "Action Button & Dual Speakers", "Ocean Band Wrist Fit", "Ceramic & Sapphire Sensor Back"],
    description: "Rugged 49mm aerospace-grade titanium casing, dual-frequency precision GPS, up to 72 hours battery life in low power mode, and 100m water resistance.",
    specifications: {
      Case: "49mm Aerospace-Grade Titanium",
      Display: "Always-On Retina 3000 nits Peak",
      Battery: "Up to 36 hours (72h Low Power)",
      WaterResistance: "100m Water Resistance (EN13319)",
      Warranty: "1 Year Official AppleCare Support"
    },
    colors: ["Titanium / Orange Ocean Band", "Titanium / Midnight Ocean Band", "Titanium / Alpine White Loop"],
    colorHex: { "Titanium / Orange Ocean Band": "#EA580C", "Titanium / Midnight Ocean Band": "#0F172A", "Titanium / Alpine White Loop": "#F8FAFC" },
    colorImages: {
      "Titanium / Orange Ocean Band": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800",
      "Titanium / Midnight Ocean Band": "https://images.unsplash.com/photo-1510519138195-068d828884bb?w=800",
      "Titanium / Alpine White Loop": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800"
    },
    sizes: ["49mm Titanium Case"],
    variants: ["Ocean Band (Water Sports)", "Alpine Loop (Outdoor Endurance)", "Trail Loop (Running & Fitness)"],
    variantPriceDeltas: { "Ocean Band (Water Sports)": 0, "Alpine Loop (Outdoor Endurance)": 0, "Trail Loop (Running & Fitness)": 0 }
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
      "https://images.unsplash.com/photo-1510519138195-068d828884bb?w=800"
    ],
    imageAngles: ["1.4'' AMOLED Color Map Face", "Titanium Bezel & 5 Control Buttons", "Marathon Runner Wrist View", "Pulse Ox & Elevate Optical Heart Sensor"],
    description: "Brilliant 1.4-inch AMOLED touchscreen display, titanium bezel, advanced training metrics, built-in full-color mapping, and up to 23 days battery life.",
    specifications: {
      Display: "1.4 inch AMOLED Touchscreen (454x454)",
      Battery: "Up to 23 Days in Smartwatch Mode",
      Bezel: "Lightweight Titanium Bezel",
      Sensors: "Multi-Band GNSS, Pulse Ox, Elevate v4 HR",
      Warranty: "2 Years Garmin Warranty"
    },
    colors: ["Black / Powder Gray", "Whitestone / Powder Gray", "Amp Yellow / Black"],
    colorHex: { "Black / Powder Gray": "#18181B", "Whitestone / Powder Gray": "#E2E8F0", "Amp Yellow / Black": "#EAB308" },
    colorImages: {
      "Black / Powder Gray": "https://images.unsplash.com/photo-1510519138195-068d828884bb?w=800",
      "Whitestone / Powder Gray": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800",
      "Amp Yellow / Black": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800"
    },
    sizes: ["Standard 47mm Case"],
    variants: ["Silicone QuickFit Band", "With HRM-Pro Plus Heart Rate Chest Strap"],
    variantPriceDeltas: { "Silicone QuickFit Band": 0, "With HRM-Pro Plus Heart Rate Chest Strap": 8500 }
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

  // Ensure every product is enriched with 4-angle images and variation maps from defaultProducts, and clean up any legacy replica data
  const sanitized = list.map(p => {
    const fallback = defaultProducts.find(d => Number(d.id) === Number(p.id)) || {};
    const clean = {
      ...fallback,
      ...p,
      images: (p.images && p.images.length >= 4) ? p.images : (fallback.images || [p.image, p.image, p.image, p.image]),
      imageAngles: p.imageAngles || fallback.imageAngles || ["Front View", "Side Profile (45°)", "On-Body / Lifestyle", "Detail & Caseback"],
      colors: p.colors || fallback.colors || ["Classic Black"],
      colorHex: p.colorHex || fallback.colorHex || { "Classic Black": "#111827" },
      colorImages: p.colorImages || fallback.colorImages || {},
      sizes: p.sizes || fallback.sizes || ["Standard Fit"],
      variants: p.variants || fallback.variants || ["Standard Edition"],
      variantPriceDeltas: p.variantPriceDeltas || fallback.variantPriceDeltas || {}
    };

    delete clean.watchType;
    if (clean.specifications && clean.specifications["Quality Type"]) {
      const specs = { ...clean.specifications };
      delete specs["Quality Type"];
      clean.specifications = specs;
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

// Dynamic Subcategory / Product Type finder for specific category
export function getSubcategoriesByCategory(categoryName) {
  const products = getProducts();
  let filtered = products;
  if (categoryName && categoryName !== 'All') {
    filtered = products.filter(p => p.category?.toLowerCase() === categoryName.toLowerCase());
  }
  const subcats = new Set(filtered.map(p => p.subcategory).filter(Boolean));
  return Array.from(subcats);
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