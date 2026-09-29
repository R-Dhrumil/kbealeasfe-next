import { Product } from "@/types/product";
import { fetchApi } from "@/lib/api";

export const PRODUCTS: Product[] = [
  // VRINDA TEA PREMIXES
  {
    id: "prod-vrinda-cardamom",
    slug: "vrinda-cardamom-tea-premix",
    name: "Royal Cardamom Tea Premix",
    brandId: "brand-vrinda",
    brandName: "Vrinda",
    categoryId: "cat-tea-premixes",
    categoryName: "Tea Premixes",
    tagline: "Fragrant Green Cardamom with Rich Assam CTC",
    description: "An aristocratic blend infused with crushed Idukki green cardamom pods and premium Assam tea. Delivers a heavenly aroma and soothing, balanced sweetness in every sip.",
    details: {
      packaging: "Aroma-Lock Multi-Layer Foil Pouch",
      shelfLife: "12 Months from Manufacturing",
      servingSize: "14g per 100ml hot water",
      netWeight: "1 kg (Approx. 70 cups)",
      form: "Instant Fine Granulated Premix",
      ingredients: ["Assam Black Tea Extract", "Natural Cardamom Essential Extract", "Dairy Milk Solids", "Refined Cane Sugar"],
      preparationNotes: [
        "Add 14g (approx. 1 heaped tablespoon) to your favorite cup.",
        "Pour 100ml of freshly boiled water (90°C - 95°C).",
        "Stir gently for 10 seconds until completely dissolved. Enjoy warm!",
      ],
      storageNotes: "Store in a cool, dry place. Keep pouch zipped or transfer to an airtight canister.",
    },
    price: 440,
    mrp: 520,
    sku: "VRN-ELA-1KG",
    images: [
      "/assets/products/vrinda-cardamom-pouch.png",
      "/assets/products/vrinda-cardamom-cup.png",
    ],
    inStock: true,
    stockCount: 142,
    isBestSeller: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 312,
    flavorNotes: ["Sweet Cardamom Pods", "Malty Assam", "Creamy Finish"],
  },
  {
    id: "prod-vrinda-masala",
    slug: "vrinda-masala-chai-premix",
    name: "Authentic Masala Chai Premix",
    brandId: "brand-vrinda",
    brandName: "Vrinda",
    categoryId: "cat-tea-premixes",
    categoryName: "Tea Premixes",
    tagline: "7-Spice Ayurvedic Formulation",
    description: "A warming symphony of sun-dried ginger, Ceylon cinnamon, black pepper, cloves, and nutmeg. Replicates the comforting vigor of authentic Indian kadak masala chai.",
    details: {
      packaging: "Aroma-Lock Multi-Layer Foil Pouch",
      shelfLife: "12 Months from Manufacturing",
      servingSize: "14g per 100ml hot water",
      netWeight: "1 kg (Approx. 70 cups)",
      form: "Instant Fine Granulated Premix",
      ingredients: ["Black Tea Extract", "Dry Ginger", "Cinnamon", "Cloves", "Black Pepper", "Nutmeg", "Milk Solids", "Sugar"],
      preparationNotes: [
        "Take 1 rounded tablespoon (14g) in a ceramic cup.",
        "Add 100ml steaming hot water.",
        "Stir well and inhale the invigorating aroma of fresh spices.",
      ],
      storageNotes: "Reseal tightly after opening to preserve delicate essential spice oils.",
    },
    price: 430,
    mrp: 510,
    sku: "VRN-MAS-1KG",
    images: [
      "/assets/hero/hero-vrinda-chai.png",
      "/assets/products/vrinda-cardamom-cup.png",
    ],
    inStock: true,
    stockCount: 88,
    isBestSeller: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 264,
    flavorNotes: ["Warm Ginger Kick", "Piquant Clove", "Comforting Cinnamon"],
  },
  {
    id: "prod-vrinda-ginger",
    slug: "vrinda-ginger-tea-premix",
    name: "Zesty Adrak Ginger Tea Premix",
    brandId: "brand-vrinda",
    brandName: "Vrinda",
    categoryId: "cat-tea-premixes",
    categoryName: "Tea Premixes",
    tagline: "Bold Fiery Ginger with Harmonious Warmth",
    description: "Crafted with pure pulverized Sonth ginger root to give your throat an instant soothing balm and your senses an energizing boost.",
    details: {
      packaging: "Aroma-Lock Multi-Layer Foil Pouch",
      shelfLife: "12 Months from Manufacturing",
      servingSize: "14g per 100ml hot water",
      netWeight: "1 kg",
      form: "Instant Premix",
      ingredients: ["Pure Sun-Dried Ginger Extract", "Assam CTC Tea", "Milk Solids", "Cane Sugar"],
      preparationNotes: [
        "Mix 14g into 100ml hot water.",
        "Stir and relish the wholesome soothing heat of genuine ginger.",
      ],
      storageNotes: "Store in a cool dry space away from moisture.",
    },
    price: 420,
    mrp: 495,
    sku: "VRN-GIN-1KG",
    images: [
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80",
    ],
    inStock: true,
    stockCount: 65,
    isBestSeller: false,
    isFeatured: false,
    rating: 4.9,
    reviewCount: 189,
    flavorNotes: ["Peppery Ginger", "Velvety Milk", "Subtle Sweetness"],
  },

  // SANGAM ICED TEAS
  {
    id: "prod-sangam-guava-chilly",
    slug: "sangam-guava-chilly-iced-tea",
    name: "Spiced Guava Chilly Iced Tea",
    brandId: "brand-sangam",
    brandName: "Sangam",
    categoryId: "cat-iced-teas",
    categoryName: "Iced Teas",
    tagline: "Ripe Pink Guava with a Hint of Rock Salt & Red Chilly",
    description: "A tribute to nostalgic street-side fruit vendors. Sweet pink guava pulp meets brisk cold-steeped Darjeeling green tea, finished with a tongue-tingling tickle of mild red chilly.",
    details: {
      packaging: "Moisture-Proof Standup Pouch with Measuring Scoop",
      shelfLife: "9 Months from Manufacturing",
      servingSize: "20g per 200ml iced water",
      netWeight: "500g (Makes 25 Refreshing Glasses)",
      form: "Cold-Soluble Instant Crystals",
      ingredients: ["Green Tea Extract", "Natural Pink Guava Essence", "Rock Salt", "Kashmiri Mild Chilly Dust", "Citric Acid", "Sugar"],
      preparationNotes: [
        "Add 20g (approx. 2 scoops) into a tall glass.",
        "Add 50ml normal water and stir to dissolve.",
        "Top up with 150ml chilled water and generous ice cubes. Garnish with a mint sprig!",
      ],
      storageNotes: "Keep pouch sealed tightly. Contains hygroscopic natural fruit powders.",
    },
    price: 320,
    mrp: 380,
    sku: "SNG-GVA-500G",
    images: [
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
    ],
    inStock: true,
    stockCount: 110,
    isBestSeller: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 420,
    flavorNotes: ["Tropical Guava", "Subtle Piquant Chilly", "Citrus Crispness"],
  },
  {
    id: "prod-sangam-lemon",
    slug: "sangam-classic-lemon-iced-tea",
    name: "Classic Lemon Zest Iced Tea",
    brandId: "brand-sangam",
    brandName: "Sangam",
    categoryId: "cat-iced-teas",
    categoryName: "Iced Teas",
    tagline: "Sun-Drenched Meyer Lemons & Nilgiri Black Tea",
    description: "The timeless summer quencher. Crisp Nilgiri black tea infused with vibrant cold-pressed lemon peel oil and tangy lemon crystals.",
    details: {
      packaging: "Resealable Zip Pouch",
      shelfLife: "9 Months",
      servingSize: "20g per 200ml iced water",
      netWeight: "500g",
      form: "Cold-Soluble Crystals",
      ingredients: ["Nilgiri Black Tea Extract", "Natural Lemon Oil", "Fruit Acid", "Sugar"],
      preparationNotes: [
        "Dissolve 2 scoops in chilled water with ice. Stir for 10 seconds.",
      ],
      storageNotes: "Cool, dry place.",
    },
    price: 290,
    mrp: 350,
    sku: "SNG-LMN-500G",
    images: [
      "/assets/hero/hero-sangam-iced-tea.png",
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
    ],
    inStock: true,
    stockCount: 95,
    isBestSeller: false,
    isFeatured: true,
    rating: 4.7,
    reviewCount: 198,
    flavorNotes: ["Bright Meyer Lemon", "Tannin-Rich Black Tea", "Crisp Clean Finish"],
  },
  {
    id: "prod-sangam-watermelon",
    slug: "sangam-crisp-watermelon-iced-tea",
    name: "Crisp Watermelon Mint Iced Tea",
    brandId: "brand-sangam",
    brandName: "Sangam",
    categoryId: "cat-iced-teas",
    categoryName: "Iced Teas",
    tagline: "Juicy Ruby Watermelon with Peppermint Cool",
    description: "Nothing beats the heat like sweet ruby watermelon paired with organic mountain peppermint and golden pekoe tea.",
    details: {
      packaging: "Resealable Zip Pouch",
      shelfLife: "9 Months",
      servingSize: "20g per 200ml iced water",
      netWeight: "500g",
      form: "Instant Crystals",
      ingredients: ["Black Tea Extract", "Natural Watermelon Flavor", "Peppermint Extract", "Sugar"],
      preparationNotes: [
        "Stir 20g into 200ml chilled water. Add ice cubes and enjoy.",
      ],
      storageNotes: "Airtight seal required.",
    },
    price: 310,
    mrp: 375,
    sku: "SNG-WML-500G",
    images: [
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80",
    ],
    inStock: true,
    stockCount: 78,
    isBestSeller: false,
    isFeatured: false,
    rating: 4.8,
    reviewCount: 156,
    flavorNotes: ["Fresh Watermelon", "Cooling Menthol", "Delicate Tea"],
  },

  // URBAN ROAST ARTISAN COFFEE
  {
    id: "prod-urban-mysore-gold",
    slug: "urban-roast-mysore-gold-coffee",
    name: "Mysore Gold Roast Premix",
    brandId: "brand-urban-roast",
    brandName: "Urban Roast",
    categoryId: "cat-artisan-coffee",
    categoryName: "Artisan Coffee",
    tagline: "80:20 Arabica Plantation 'A' with Velvety Chicory",
    description: "Inspired by traditional South Indian filter decoction. High-altitude estate coffee beans roasted to a rich dark caramel profile, combined with pure spray-dried milk solids.",
    details: {
      packaging: "Degassing Valve Foil Bag",
      shelfLife: "12 Months",
      servingSize: "15g per 120ml hot water",
      netWeight: "1 kg",
      form: "Micro-Ground Premix",
      ingredients: ["Spray Dried Arabica & Robusta Coffee Extract", "Roasted Chicory", "Dairy Creamer", "Sugar"],
      preparationNotes: [
        "Empty 15g premix into your favorite cup.",
        "Add 120ml near-boiling water. Whisk until a lush foam forms.",
      ],
      storageNotes: "Keep sealed in a dark cool cupboard.",
    },
    price: 490,
    mrp: 580,
    sku: "URB-MYS-1KG",
    images: [
      "/assets/hero/hero-urban-roast.png",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    ],
    inStock: true,
    stockCount: 54,
    isBestSeller: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 220,
    flavorNotes: ["Dark Chocolate", "Nutty Chicory", "Caramelized Cream"],
  },
  {
    id: "prod-urban-hazelnut",
    slug: "urban-roast-hazelnut-velvet-latte",
    name: "Hazelnut Velvet Latte Premix",
    brandId: "brand-urban-roast",
    brandName: "Urban Roast",
    categoryId: "cat-artisan-coffee",
    categoryName: "Artisan Coffee",
    tagline: "Toasted Mediterranean Hazelnuts & Smooth Espresso",
    description: "A European cafe classic. Toasted hazelnut notes intertwined with smooth medium-roast Arabica for a luxurious morning indulgence.",
    details: {
      packaging: "Aroma-Sealed Foil Bag",
      shelfLife: "12 Months",
      servingSize: "18g per 150ml hot water or milk",
      netWeight: "500g",
      form: "Instant Premix",
      ingredients: ["Arabica Coffee Extract", "Natural Hazelnut Extract", "Milk Solids", "Cocoa Powder", "Sugar"],
      preparationNotes: [
        "Blend 18g in 150ml hot water or frothed milk for extra decadence.",
      ],
      storageNotes: "Cool, dry spot.",
    },
    price: 360,
    mrp: 425,
    sku: "URB-HZL-500G",
    images: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
    ],
    inStock: true,
    stockCount: 39,
    isBestSeller: false,
    isFeatured: false,
    rating: 4.9,
    reviewCount: 140,
    flavorNotes: ["Roasted Hazelnut", "Toffee", "Smooth Cocoa"],
  },

  // COCOJOY CHOCOLATE DRINKS & COCOA PREMIXES
  {
    id: "prod-cocojoy-classic-hot-chocolate",
    slug: "cocojoy-classic-hot-chocolate-premix",
    name: "Classic Hot Chocolate Premix",
    brandId: "brand-cocojoy",
    brandName: "CocoJoy",
    categoryId: "cat-chocolate-drinks",
    categoryName: "Chocolate Drinks",
    tagline: "Velvety European Dutch Cocoa Indulgence",
    description: "Rich 22% fat European Dutch cocoa and whole milk solids for luxurious winter mugs. Transforms warm milk or water into a thick, velvety hot chocolate with deep cocoa aromas.",
    details: {
      packaging: "Aroma-Lock Resealable Pouch",
      shelfLife: "12 Months",
      servingSize: "25g per 150ml hot milk or water",
      netWeight: "500g (20 Servings)",
      form: "Micro-Granulated Cocoa Premix",
      ingredients: [
        "European Dutch Processed Cocoa (22% fat)",
        "Whole Milk Solids",
        "Raw Cane Sugar",
        "Bourbon Vanilla Extract",
        "Himalayan Pink Salt",
      ],
      preparationNotes: [
        "Add 2 heaped tablespoons (25g) to your favorite mug.",
        "Pour 150ml steaming hot milk or hot water.",
        "Stir briskly for 10 seconds and enjoy rich, velvety chocolate comfort.",
      ],
      storageNotes: "Store in a cool, dry place. Reseal zip lock after each use.",
    },
    price: 440,
    mrp: 520,
    sku: "CJ-HC-500G",
    images: [
      "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=800&q=80",
    ],
    inStock: true,
    stockCount: 88,
    isBestSeller: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 310,
    flavorNotes: ["Dark Dutch Cocoa", "Velvety Cream", "Subtle Vanilla"],
  },
  {
    id: "prod-cocojoy-vadodara-cold-cocoa",
    slug: "cocojoy-thick-cold-cocoa-premix",
    name: "Thick Vadodara Cold Cocoa Premix",
    brandId: "brand-cocojoy",
    brandName: "CocoJoy",
    categoryId: "cat-chocolate-drinks",
    categoryName: "Chocolate Drinks",
    tagline: "Thick, Silky Gujarat Street-Style Chilled Cocoa",
    description: "Inspired by Vadodara and Surat's legendary street-style thick cold cocoas. Dissolves seamlessly into chilled milk to create a thick, glossy chocolate milkshake that coats your glass.",
    details: {
      packaging: "Gourmet Food-Grade Canister",
      shelfLife: "12 Months",
      servingSize: "30g per 180ml chilled milk",
      netWeight: "450g (15 Servings)",
      form: "Fast-Dissolving Chilled Cocoa Blend",
      ingredients: [
        "Alkalized Pure Cocoa Solids",
        "Dairy Milk Solids",
        "Natural Thickening Starches",
        "Unrefined Cane Sugar",
        "Pure Cocoa Butter",
      ],
      preparationNotes: [
        "Mix 2 tablespoons (30g) in a glass with a splash of warm milk to form a glossy chocolate sauce.",
        "Top with 180ml ice-cold milk and ice cubes.",
        "Stir briskly or blend for 10 seconds for ultra-thick street-style cold cocoa.",
      ],
      storageNotes: "Keep lid tightly closed in an ambient pantry.",
    },
    price: 399,
    mrp: 480,
    sku: "CJ-CC-450G",
    images: [
      "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
    ],
    inStock: true,
    stockCount: 65,
    isBestSeller: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 224,
    flavorNotes: ["Thick Chocolate Ganache", "Chilled Cream", "Rich Fudge"],
  },
  {
    id: "prod-cocojoy-jaggery-hot-chocolate",
    slug: "cocojoy-jaggery-hot-chocolate-premix",
    name: "Organic Jaggery Hot Chocolate Premix",
    brandId: "brand-cocojoy",
    brandName: "CocoJoy",
    categoryId: "cat-chocolate-drinks",
    categoryName: "Chocolate Drinks",
    tagline: "Pure Cocoa Naturally Sweetened with Desi Gur",
    description: "Traditional organic Kolhapuri jaggery (gur) blended with dark cocoa powder for a wholesome, iron-rich hot chocolate beverage without refined white sugar.",
    details: {
      packaging: "Eco Kraft Barrier Pouch",
      shelfLife: "9 Months",
      servingSize: "22g per 150ml warm milk",
      netWeight: "400g",
      form: "Granulated Jaggery & Cocoa Blend",
      ingredients: [
        "Organic Desi Jaggery Granules (Gur)",
        "Dark Cocoa Powder (70% solids)",
        "Ceylon Cinnamon Pinch",
        "Whole Milk Solids",
      ],
      preparationNotes: [
        "Add 2 spoonfuls (22g) into warm milk.",
        "Whisk for 10 seconds until the aromatic jaggery dissolves into deep cocoa luxury.",
      ],
      storageNotes: "Keep in an airtight container away from moisture.",
    },
    price: 460,
    mrp: 540,
    sku: "CJ-JAG-400G",
    images: [
      "https://images.unsplash.com/photo-1517578239113-b03992dcdd25?auto=format&fit=crop&w=800&q=80",
    ],
    inStock: true,
    stockCount: 42,
    isBestSeller: false,
    isFeatured: false,
    rating: 4.8,
    reviewCount: 95,
    flavorNotes: ["Caramelized Gur", "Earthy Dark Cocoa", "Warm Cinnamon"],
  },
];

function mapBackendProductToFrontend(dto: any): Product {
  if (dto.price !== undefined) return dto as Product;

  return {
    id: dto.id,
    slug: dto.slug,
    name: dto.name,
    brandId: dto.brandId,
    brandName: dto.brandName,
    categoryId: dto.categoryId,
    categoryName: dto.categoryName,
    tagline: dto.tagline || "",
    description: dto.shortDescription || dto.fullDescription || "",
    details: {
      packaging: "Standard",
      shelfLife: "12 Months",
      servingSize: "Standard",
      netWeight: "N/A",
      form: "Standard",
      ingredients: [],
      preparationNotes: [],
      storageNotes: ""
    },
    price: dto.basePrice || 0,
    mrp: dto.costPrice || (dto.basePrice ? dto.basePrice * 1.2 : 0),
    sku: dto.sku || "",
    images: dto.images 
      ? dto.images.map((img: any) => img.imageUrl) 
      : (dto.primaryImageUrl ? [dto.primaryImageUrl] : []),
    inStock: dto.inStock !== undefined ? dto.inStock : (dto.totalAvailableQuantity > 0),
    stockCount: dto.totalAvailableQuantity || 0,
    isBestSeller: dto.isBestseller,
    isFeatured: dto.isFeatured,
    rating: 5.0,
    reviewCount: 0,
    flavorNotes: []
  };
}

export async function getProducts(): Promise<Product[]> {
  try {
    const data = await fetchApi("/catalog/products?pageSize=100");
    return data?.items ? data.items.map(mapBackendProductToFrontend) : PRODUCTS;
  } catch (e) {
    return PRODUCTS;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    const p = await fetchApi(`/catalog/products/${slug}`);
    return p ? mapBackendProductToFrontend(p) : PRODUCTS.find((p) => p.slug === slug);
  } catch (e) {
    return PRODUCTS.find((p) => p.slug === slug);
  }
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  try {
    const data = await fetchApi(`/catalog/products?categoryId=${categoryId}&pageSize=100`);
    return data?.items ? data.items.map(mapBackendProductToFrontend) : PRODUCTS.filter((p) => p.categoryId === categoryId);
  } catch (e) {
    return PRODUCTS.filter((p) => p.categoryId === categoryId);
  }
}

export async function getProductsByBrand(brandId: string): Promise<Product[]> {
  try {
    const data = await fetchApi(`/catalog/products?brandId=${brandId}&pageSize=100`);
    return data?.items ? data.items.map(mapBackendProductToFrontend) : PRODUCTS.filter((p) => p.brandId === brandId);
  } catch (e) {
    return PRODUCTS.filter((p) => p.brandId === brandId);
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const data = await fetchApi(`/catalog/featured`);
    return data ? data.map(mapBackendProductToFrontend) : PRODUCTS.filter((p) => p.isFeatured || p.isBestSeller);
  } catch (e) {
    return PRODUCTS.filter((p) => p.isFeatured || p.isBestSeller);
  }
}
