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

export const defaultProducts = [
  // ================= WATCHES =================
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
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=700",
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=700"
    ],
    description: "Handcrafted luxury automatic analog watch with premium sapphire crystal glass, surgical-grade stainless steel dial, and water resistance up to 50 meters.",
    specifications: {
      Material: "316L Stainless Steel",
      Movement: "Japanese Automatic Quartz",
      Glass: "Sapphire Crystal",
      WaterResistance: "50m / 5 ATM",
      Warranty: "2 Years International"
    },
    colors: ["Gold", "Silver", "Midnight Black"],
    variants: ["Gold Dial", "Silver Dial", "Black Mesh"]
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
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=700",
    images: [
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=700",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=700"
    ],
    description: "Sophisticated multi-dial chronograph watch featuring a sunray royal blue dial, genuine Italian leather strap, and stop-watch micro-second precision.",
    specifications: {
      Material: "Stainless Steel & Italian Leather",
      Movement: "Multi-Function Chronograph",
      Glass: "Mineral Glass",
      WaterResistance: "50m",
      Warranty: "2 Years"
    },
    colors: ["Royal Blue", "Deep Black"],
    variants: ["Leather Strap", "Steel Bracelet"]
  },
  {
    id: 3,
    name: "Edifice Tough Solar Chronograph",
    brand: "Casio",
    category: "Watches",
    subcategory: "Solar Watches",
    sku: "KA-CAS-003",
    price: 9499,
    oldPrice: 12999,
    discount: 27,
    stock: 14,
    rating: 4.9,
    reviews: 160,
    status: "Active",
    supplier: "Apex Timepieces Ltd.",
    image: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=700",
    images: [
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=700",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700"
    ],
    description: "High-octane automotive inspired chronograph powered by light and solar energy with Bluetooth mobile link and 100m water resistance.",
    specifications: {
      Material: "Solid Stainless Steel",
      Movement: "Tough Solar Quartz",
      Glass: "Sapphire Anti-Reflective",
      WaterResistance: "100m / 10 ATM",
      Warranty: "2 Years"
    },
    colors: ["Carbon Black", "Silver"],
    variants: ["Solar Steel", "Carbon Edition"]
  },
  {
    id: 4,
    name: "Submariner Luxury Tribute Edition",
    brand: "Rolex",
    category: "Watches",
    subcategory: "Luxury Watches",
    sku: "KA-ROL-004",
    price: 18999,
    oldPrice: 24999,
    discount: 24,
    stock: 6,
    rating: 4.9,
    reviews: 75,
    status: "Active",
    supplier: "Apex Timepieces Ltd.",
    image: "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=700",
    images: [
      "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=700",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=700"
    ],
    description: "Ultimate luxury diver aesthetic with ceramic rotating bezel, luminescent hour markers, and automatic perpetual self-winding caliber.",
    specifications: {
      Material: "Oystersteel 904L",
      Movement: "Perpetual Mechanical Automatic",
      Glass: "Cyclops Sapphire Glass",
      WaterResistance: "300m / 30 ATM",
      Warranty: "5 Years"
    },
    colors: ["Emerald Green", "Onyx Black", "Gold Two-Tone"],
    variants: ["Emerald Green Bezel", "Onyx Black"]
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
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=700",
    images: [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=700"
    ],
    description: "1.91'' UltraVU HD Display with single-sync BT Calling, 100+ sports modes, AI voice assistant, and 7-day battery life.",
    specifications: {
      Display: "1.91 inch HD Curved Display",
      Battery: "7 Days Typical Usage",
      Connectivity: "Bluetooth 5.3",
      WaterResistance: "IP68 Water & Dust Resistant",
      Warranty: "1 Year"
    },
    colors: ["Pitch Black", "Teal Blue", "Olive Green"],
    variants: ["Standard Strap", "Magnetic Strap"]
  },
  {
    id: 6,
    name: "Heritage Chrono Automatic 1853",
    brand: "Tissot",
    category: "Watches",
    subcategory: "Swiss Made Watches",
    sku: "KA-TIS-006",
    price: 34999,
    oldPrice: 42999,
    discount: 19,
    stock: 8,
    rating: 4.9,
    reviews: 58,
    status: "Active",
    supplier: "Apex Timepieces Ltd.",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=700",
    images: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=700",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700"
    ],
    description: "Swiss-made automatic caliber with Powermatic 80 technology delivering up to 80 hours of power reserve with scratch-resistant sapphire crystal.",
    specifications: {
      Material: "316L Stainless Steel & Alligator Embossed Leather",
      Movement: "Swiss Powermatic 80 Automatic",
      Glass: "Domed Scratch-Resistant Sapphire",
      WaterResistance: "100m",
      Warranty: "2 Years International"
    },
    colors: ["Silver Dial / Brown Strap", "Black Dial / Black Strap"],
    variants: ["Leather Strap", "Steel Bracelet"]
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
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=700",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=700",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700"
    ],
    description: "Handcrafted vegetable-tanned genuine leather briefcase with padded 15.6-inch laptop compartment, solid brass hardware, and detachable shoulder strap.",
    specifications: {
      Material: "100% Genuine Vegetable-Tanned Leather",
      Capacity: "Fits up to 15.6-inch Laptops + Documents",
      Hardware: "Antique Solid Brass",
      Warranty: "1 Year International"
    },
    colors: ["Rich Cognac Brown", "Classic Black"],
    variants: ["Standard Briefcase", "Slim Edition"]
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
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700"
    ],
    description: "Weatherproof 32-liter urban travel backpack with ergonomic AirMesh lumbar support, dedicated USB charging port pass-through, and rain cover included.",
    specifications: {
      Material: "High-Density Ballistic Polyester",
      Volume: "32 Litres",
      Compartments: "3 Main + 2 Side Water Bottle Sleeves",
      Warranty: "5 Years"
    },
    colors: ["Charcoal Grey", "Navy Blue", "Olive Tactical"],
    variants: ["32 Litres Standard"]
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
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=700",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=700"
    ],
    description: "Chic structured tote bag featuring iconic monogram detailing, premium faux-leather trim, magnetic closure, and removable matching zip pouch.",
    specifications: {
      Material: "Premium Jacquard Canvas & Vegan Leather",
      Closure: "Magnetic Snap with Zip Top",
      Dimensions: "38cm x 28cm x 14cm",
      Warranty: "1 Year"
    },
    colors: ["Navy / White Stripe", "Black Jacquard"],
    variants: ["Standard Tote Size"]
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
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=700"
    ],
    description: "Responsive cushioning in the Nike Air Zoom Pegasus provides a springy feel for everyday road and track runners with engineered breathable mesh.",
    specifications: {
      Material: "Engineered Mesh Upper",
      Sole: "Zoom Air Foam with Waffle Rubber",
      Weight: "260g",
      Warranty: "6 Months"
    },
    colors: ["Crimson Red", "Triple Black", "Pure White"],
    variants: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]
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
    image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=700",
    images: [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=700",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700"
    ],
    description: "Experience epic energy return with Light BOOST cushioning technology and an adaptive Primeknit+ textile upper designed for ultimate comfort.",
    specifications: {
      Material: "Primeknit+ Textile",
      Sole: "Light BOOST with Continental Rubber",
      Drop: "10mm",
      Warranty: "6 Months"
    },
    colors: ["Core Black", "Cloud White", "Solar Red"],
    variants: ["UK 7", "UK 8", "UK 9", "UK 10"]
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
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=700",
    images: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=700"
    ],
    description: "Sleek low-boot street design infused with advanced NITRO foam for featherlight responsiveness and all-day urban walking comfort.",
    specifications: {
      Material: "Synthetic Leather & Mesh",
      Sole: "PUMAGRIP High Traction Rubber",
      Warranty: "6 Months"
    },
    colors: ["White / Black", "All Black"],
    variants: ["UK 7", "UK 8", "UK 9", "UK 10"]
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
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=700",
    images: [
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=700"
    ],
    description: "Iconic high-top silhouette in premium genuine tumbled leather with encapsulated Air-Sole unit and legendary basketball legacy.",
    specifications: {
      Material: "Full-Grain Genuine Leather",
      Sole: "Rubber Cupsole with Air Cushioning",
      Warranty: "6 Months"
    },
    colors: ["Chicago Red / White / Black", "Shadow Grey"],
    variants: ["UK 8", "UK 9", "UK 10", "UK 11"]
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
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=700",
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=700",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=700"
    ],
    description: "Next-generation titanium design equipped with Galaxy AI, 200MP Quad Telephoto Camera system, S-Pen built-in, and Snapdragon 8 Gen 4 chipset.",
    specifications: {
      Display: "6.8 inch Dynamic AMOLED 2X 120Hz",
      Storage: "256GB / 512GB UFS 4.0",
      RAM: "12GB LPDDR5X",
      Camera: "200MP + 50MP + 12MP + 10MP",
      Battery: "5000mAh with 45W Fast Charging",
      Warranty: "1 Year Brand Warranty"
    },
    colors: ["Titanium Black", "Titanium Gray", "Titanium Violet"],
    variants: ["12GB / 256GB", "12GB / 512GB"]
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
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=700",
    images: [
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=700",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=700"
    ],
    description: "Forged in grade 5 titanium with Apple Intelligence, revolutionary A18 Pro chip, 48MP Fusion camera with 5x Telephoto, and industry-leading battery longevity.",
    specifications: {
      Display: "6.9 inch Super Retina XDR ProMotion",
      Storage: "256GB / 512GB / 1TB NVMe",
      Chipset: "Apple A18 Pro Bionic",
      Camera: "48MP Main + 48MP Ultra-Wide + 12MP 5x Telephoto",
      Warranty: "1 Year Apple India Warranty"
    },
    colors: ["Desert Titanium", "Natural Titanium", "Black Titanium"],
    variants: ["256GB", "512GB", "1TB"]
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
    image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=700",
    images: [
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=700"
    ],
    description: "Hasselblad 4th Gen Mobile Camera, 100W SUPERVOOC fast charge with 6000mAh silicon-carbon battery and ultra-smooth 2K 120Hz Oriental Screen.",
    specifications: {
      Display: "6.82 inch 2K ProXDR 120Hz",
      Storage: "256GB / 512GB",
      RAM: "16GB LPDDR5X",
      Battery: "6000mAh with 100W Charging",
      Warranty: "1 Year"
    },
    colors: ["Emerald Silk", "Midnight Obsidian"],
    variants: ["16GB / 256GB", "16GB / 512GB"]
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
    image: "https://images.unsplash.com/photo-1542272604-780c96856592?w=700",
    images: [
      "https://images.unsplash.com/photo-1542272604-780c96856592?w=700"
    ],
    description: "The iconic straight fit with signature button fly crafted from 100% heavyweight cotton denim that molds uniquely to your body over time.",
    specifications: {
      Material: "100% Premium Cotton Denim",
      Fit: "Original Straight Leg",
      Closure: "Button Fly",
      Care: "Machine Wash Cold"
    },
    colors: ["Dark Indigo", "Light Stone Wash", "Vintage Black"],
    variants: ["30W 32L", "32W 32L", "34W 32L", "36W 32L"]
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
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=700",
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=700"
    ],
    description: "Modern unstructured slim fit blazer with peak lapels, flap pockets, and breathable stretch wool-blend fabric for business and evening formal wear.",
    specifications: {
      Material: "Wool & Viscose Blend",
      Fit: "Tailored Slim",
      Lining: "100% Acetate Silk",
      Care: "Dry Clean Only"
    },
    colors: ["Navy Blue", "Charcoal Gray"],
    variants: ["38 (M)", "40 (L)", "42 (XL)"]
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
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=700",
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=700",
      "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=700"
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
    colors: ["Platinum Silver with Black Carbon Fiber"],
    variants: ["32GB / 1TB SSD", "64GB / 2TB SSD"]
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
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=700",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=700"
    ],
    description: "Driven by M3 Max chip with 16-core CPU and 40-core GPU, stunning Liquid Retina XDR display, up to 22 hours battery life, and studio-quality mics.",
    specifications: {
      Processor: "Apple M3 Max Chip",
      RAM: "36GB Unified Memory",
      Storage: "1TB NVMe SSD",
      Display: "16.2-inch Liquid Retina XDR (3456x2234)",
      Warranty: "1 Year Official AppleCare"
    },
    colors: ["Space Black", "Silver"],
    variants: ["36GB / 1TB", "48GB / 2TB"]
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
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=700"
    ],
    description: "Industry-leading noise cancellation with two processors and eight microphones for unprecedented sound clarity, crystal clear hands-free calls, and 30-hour battery.",
    specifications: {
      BatteryLife: "30 Hours with ANC On (3 min charge = 3 hours playback)",
      Driver: "30mm Precision Engineered Carbon Fiber",
      Connectivity: "Bluetooth 5.2, LDAC High-Res Audio",
      Warranty: "1 Year Brand Warranty"
    },
    colors: ["Silver Grey", "Midnight Black", "Smoky Pink"],
    variants: ["Standard Edition"]
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
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=700",
    images: [
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=700"
    ],
    description: "Breakthrough immersive spatial audio, world-class active noise cancellation, and CustomTune technology that personalizes sound to the shape of your ears.",
    specifications: {
      Battery: "6 Hours (24 Hours with Case)",
      NoiseCancellation: "CustomTune Active Noise Cancelling",
      WaterResistance: "IPX4 Sweat Resistant",
      Warranty: "1 Year"
    },
    colors: ["Black", "White Smoke"],
    variants: ["Single Size with 3 Ear Tip Pairs"]
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
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=700",
    images: [
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=700"
    ],
    description: "Command dial with 8 dedicated macro keys, Razer Green clicky mechanical switches, magnetic plush wrist rest with underglow, and 8000Hz polling rate.",
    specifications: {
      Switches: "Razer Green Mechanical Switches (Clicky & Tactile)",
      PollingRate: "Up to 8000 Hz",
      Lighting: "Razer Chroma RGB Per-Key & 3-Side Underglow",
      Warranty: "2 Years"
    },
    colors: ["Classic Black"],
    variants: ["Green Switches", "Yellow Linear Switches"]
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
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=700",
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=700"
    ],
    description: "Timeless teardrop pilot shape in polished gold metal frame with crystal green G-15 polarized lenses providing 100% UV protection and glare elimination.",
    specifications: {
      Frame: "Polished Gold Metal",
      Lens: "Crystal Green Polarized G-15",
      UVProtection: "100% UV400",
      Warranty: "2 Years"
    },
    colors: ["Gold / Green Classic G-15", "Gunmetal / Polarized Grey"],
    variants: ["Standard 58mm", "Large 62mm"]
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

// ================= PRIMARY GETTERS & STATE =================

export function getProducts() {
  const data = localStorage.getItem(PRODUCTS_KEY);
  if (!data) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts));
    return defaultProducts;
  }
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultProducts;
  } catch {
    return defaultProducts;
  }
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