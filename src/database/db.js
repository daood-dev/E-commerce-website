// Database Engine for E-Commerce Architecture
// Simulates relational storage (Users, Categories, Products, Cart, Orders, Reviews, Discounts)

const SEED_CATEGORIES = [
  { category_id: "cat-all", name: "All Categories", description: "All available store items" },
  { category_id: "cat-electronics", name: "Electronics", description: "Computers, peripherals, and tech gear" },
  { category_id: "cat-wearables", name: "Wearables", description: "Smartwatches, trackers, and smart glasses" },
  { category_id: "cat-smarthome", name: "Smart Home", description: "Home automation and entertainment" },
  { category_id: "cat-audio", name: "Audio", description: "Headphones, earbuds, and speakers" },
  { category_id: "cat-apparel", name: "Apparel & Fashion", description: "Techwear jackets, streetwear, hoodies, and activewear" }
];

const SEED_PRODUCTS = [
  // Apparel & Fashion
  {
    product_id: "prod-201",
    category_id: "cat-apparel",
    name: "CyberDeck Technical Waterproof Bomber Jacket",
    description: "3-layer breathable GORE-TEX techwear bomber jacket with magnetic utility pockets, weatherproof zippers, and fleece lining.",
    price: 199.00,
    stock_quantity: 35,
    rating: 4.9,
    review_count: 3,
    image_url: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-03-01T10:00:00Z"
  },
  {
    product_id: "prod-202",
    category_id: "cat-apparel",
    name: "Aura Merino Wool Seamless Pullover Hoodie",
    description: "Ultra-soft 100% Australian Merino wool hoodie featuring thermal regulation, odor resistance, and ergonomic thumbhole cuffs.",
    price: 129.00,
    stock_quantity: 42,
    rating: 4.8,
    review_count: 3,
    image_url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-03-03T14:30:00Z"
  },
  {
    product_id: "prod-203",
    category_id: "cat-apparel",
    name: "Titan Performance Athletic Track Pants",
    description: "4-way stretch moisture-wicking joggers with deep zippered phone pockets, reflective trim, and elastic drawstring waistband.",
    price: 79.50,
    stock_quantity: 50,
    rating: 4.7,
    review_count: 3,
    image_url: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-03-05T09:15:00Z"
  },
  {
    product_id: "prod-204",
    category_id: "cat-apparel",
    name: "Nexus Oversized Heavyweight Graphic Tee",
    description: "260 GSM combed cotton drop-shoulder streetwear t-shirt with high-density minimalist chest print and reinforced collar.",
    price: 45.00,
    stock_quantity: 65,
    rating: 4.9,
    review_count: 3,
    image_url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-03-08T11:00:00Z"
  },
  {
    product_id: "prod-205",
    category_id: "cat-apparel",
    name: "Vision Modular Utility Tactical Vest",
    description: "MOLLE system tactical utility vest with modular detachable pouches, mesh ventilation lining, and quick-release buckles.",
    price: 159.00,
    stock_quantity: 20,
    rating: 4.8,
    review_count: 3,
    image_url: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-03-10T16:20:00Z"
  },
  {
    product_id: "prod-206",
    category_id: "cat-apparel",
    name: "Apex Thermal Insulated Subzero Parka",
    description: "800-fill power down winter parka with faux-fur detachable hood, storm flap closure, and polar fleece handwarmer pockets.",
    price: 289.00,
    stock_quantity: 16,
    rating: 5.0,
    review_count: 3,
    image_url: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-03-12T13:45:00Z"
  },
  {
    product_id: "prod-207",
    category_id: "cat-apparel",
    name: "Chrono Tech Stretch Slim Fit Denim Jeans",
    description: "Cordura-reinforced stretch denim jeans featuring hidden zippered travel security pockets and water-repellent finish.",
    price: 99.00,
    stock_quantity: 38,
    rating: 4.7,
    review_count: 3,
    image_url: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-03-15T10:30:00Z"
  },
  {
    product_id: "prod-208",
    category_id: "cat-apparel",
    name: "Vibe Breathable Running Windbreaker",
    description: "Packable ultralight windbreaker jacket with underarm laser perforation, packaway hood, and 360-degree night visibility.",
    price: 89.00,
    stock_quantity: 45,
    rating: 4.6,
    review_count: 3,
    image_url: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-03-18T12:00:00Z"
  },
  {
    product_id: "prod-209",
    category_id: "cat-apparel",
    name: "Minimalist Organic Cotton Crewneck Sweatshirt",
    description: "French terry organic cotton sweatshirt with subtle tonal brand embroidery and rib-knit cuffs for casual everyday wear.",
    price: 65.00,
    stock_quantity: 55,
    rating: 4.8,
    review_count: 3,
    image_url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-03-20T15:10:00Z"
  },
  {
    product_id: "prod-210",
    category_id: "cat-apparel",
    name: "ErgoFlex Performance Compression Top",
    description: "Gradient muscle compression long-sleeve top designed to reduce fatigue and speed up athletic post-workout recovery.",
    price: 55.00,
    stock_quantity: 60,
    rating: 4.8,
    review_count: 3,
    image_url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-03-22T08:50:00Z"
  },

  // Electronics
  {
    product_id: "prod-101",
    category_id: "cat-electronics",
    name: "Aura Pro Wireless ANC Headphones",
    description: "Premium noise-canceling over-ear headphones with 40h battery life, spatial audio, and high-fidelity neodymium drivers.",
    price: 299.99,
    stock_quantity: 45,
    rating: 4.9,
    review_count: 3,
    image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-01-15T10:00:00Z"
  },
  {
    product_id: "prod-103",
    category_id: "cat-electronics",
    name: "CyberDeck M3 Mechanical Keyboard",
    description: "Hot-swappable gasket-mounted mechanical keyboard with RGB per-key illumination, CNC aluminum chassis, and wireless 2.4Ghz.",
    price: 189.00,
    stock_quantity: 30,
    rating: 4.9,
    review_count: 3,
    image_url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-02-10T09:15:00Z"
  },
  {
    product_id: "prod-107",
    category_id: "cat-electronics",
    name: "Apex 27-inch 4K OLED Gaming Monitor",
    description: "240Hz refresh rate OLED display with 0.03ms response time, HDR1000 ultra contrast, and USB-C 90W PD connectivity.",
    price: 799.00,
    stock_quantity: 14,
    rating: 4.9,
    review_count: 3,
    image_url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-02-12T11:00:00Z"
  },
  {
    product_id: "prod-108",
    category_id: "cat-electronics",
    name: "Vortex Pro 4K Web Camera",
    description: "AI-tracked 4K webcam with dual noise-canceling stereo mics, HDR exposure correction, and privacy shutter.",
    price: 149.50,
    stock_quantity: 50,
    rating: 4.7,
    review_count: 3,
    image_url: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-02-15T08:30:00Z"
  },
  {
    product_id: "prod-109",
    category_id: "cat-electronics",
    name: "Titan Blade Ultra Slim Laptop 16\"",
    description: "M3 Max processor, 32GB unified memory, 1TB NVMe SSD, liquid retina XDR display, and 22-hour battery life.",
    price: 1999.00,
    stock_quantity: 9,
    rating: 5.0,
    review_count: 3,
    image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-02-20T14:10:00Z"
  },
  {
    product_id: "prod-110",
    category_id: "cat-electronics",
    name: "OmniDock 12-in-1 Thunderbolt Hub",
    description: "Dual 4K 60Hz HDMI, 10Gbps USB-C ports, SD card reader, 2.5G Ethernet, and 100W power delivery passthrough.",
    price: 129.99,
    stock_quantity: 40,
    rating: 4.8,
    review_count: 3,
    image_url: "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-02-25T16:45:00Z"
  },
  {
    product_id: "prod-111",
    category_id: "cat-electronics",
    name: "SkyRider 4K Obstacle Sensing Drone",
    description: "Compact foldable drone featuring 3-axis gimbal 4K/60fps camera, 10km HD transmission, and 45-minute flight time.",
    price: 649.00,
    stock_quantity: 11,
    rating: 4.8,
    review_count: 3,
    image_url: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-03-01T10:20:00Z"
  },
  {
    product_id: "prod-112",
    category_id: "cat-electronics",
    name: "StudioCast USB Condenser Microphone",
    description: "Professional cardioid studio microphone with gain control, zero-latency headphone monitoring, and shock mount.",
    price: 119.00,
    stock_quantity: 35,
    rating: 4.7,
    review_count: 3,
    image_url: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-03-04T12:00:00Z"
  },

  // Wearables
  {
    product_id: "prod-102",
    category_id: "cat-wearables",
    name: "Chronos Ultra Smartwatch Titanium",
    description: "Aerospace-grade titanium watch with ECG monitoring, dual-band GPS, OLED sapphire glass, and 100m water resistance.",
    price: 399.50,
    stock_quantity: 18,
    rating: 4.8,
    review_count: 3,
    image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-02-01T14:30:00Z"
  },
  {
    product_id: "prod-106",
    category_id: "cat-wearables",
    name: "Vision Glass AR Smart Glasses",
    description: "Lightweight augmented reality glasses displaying notifications, real-time translation, and turn-by-turn HUD navigation.",
    price: 499.00,
    stock_quantity: 12,
    rating: 4.5,
    review_count: 3,
    image_url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-03-05T08:45:00Z"
  },
  {
    product_id: "prod-113",
    category_id: "cat-wearables",
    name: "PulseFit Pro Fitness Tracker",
    description: "Continuous heart rate, SPO2 blood oxygen monitor, sleep analysis, 50m water resistance, and 14-day battery life.",
    price: 79.99,
    stock_quantity: 65,
    rating: 4.6,
    review_count: 3,
    image_url: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-03-06T09:15:00Z"
  },
  {
    product_id: "prod-114",
    category_id: "cat-wearables",
    name: "Ourae Titanium Smart Health Ring",
    description: "Ultralight titanium ring measuring skin temperature, sleep stage readiness score, and cardiac strain without screens.",
    price: 299.00,
    stock_quantity: 22,
    rating: 4.8,
    review_count: 3,
    image_url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-03-08T11:40:00Z"
  },
  {
    product_id: "prod-115",
    category_id: "cat-wearables",
    name: "Holosphere VR Spatial Headset",
    description: "8K micro-OLED dual displays, eye-tracking precision, pancake lenses, and passthrough 6-DOF spatial computing.",
    price: 999.00,
    stock_quantity: 7,
    rating: 4.9,
    review_count: 3,
    image_url: "https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-03-10T15:00:00Z"
  },

  // Smart Home
  {
    product_id: "prod-104",
    category_id: "cat-smarthome",
    name: "Nebula Smart 4K Laser Projector",
    description: "Ultra short throw 3000 ANSI lumen projector with built-in Harman Kardon speakers and Android TV OS.",
    price: 899.00,
    stock_quantity: 8,
    rating: 4.7,
    review_count: 3,
    image_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-02-18T11:00:00Z"
  },
  {
    product_id: "prod-118",
    category_id: "cat-smarthome",
    name: "Lumina RGBWW Smart LED Light Bars",
    description: "Dynamic TV ambient light bars with camera color sync, 16M colors, and Matter/Alexa smart home compatibility.",
    price: 89.99,
    stock_quantity: 55,
    rating: 4.8,
    review_count: 3,
    image_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-03-15T14:15:00Z"
  },
  {
    product_id: "prod-119",
    category_id: "cat-smarthome",
    name: "RoboClean X9 LiDAR Vacuum & Mop",
    description: "Auto-emptying dustbin, 6000Pa cyclone suction, hot-water mop washing, and 3D obstacle avoidance mapping.",
    price: 699.00,
    stock_quantity: 16,
    rating: 4.9,
    review_count: 3,
    image_url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-03-16T11:00:00Z"
  },

  // Audio
  {
    product_id: "prod-105",
    category_id: "cat-audio",
    name: "Vibe Pods Active Wireless Earbuds",
    description: "Compact IPX7 waterproof wireless earbuds featuring transparency mode, wireless charging case, and crystal voice mics.",
    price: 129.99,
    stock_quantity: 60,
    rating: 4.6,
    review_count: 3,
    image_url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-03-01T16:20:00Z"
  },
  {
    product_id: "prod-124",
    category_id: "cat-audio",
    name: "SonicBar 5.1 Dolby Atmos Soundbar",
    description: "Wireless subwoofer, upward-firing height channels, eARC HDMI pass-through, and Bluetooth 5.3 streaming.",
    price: 449.00,
    stock_quantity: 19,
    rating: 4.8,
    review_count: 3,
    image_url: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-03-25T14:00:00Z"
  },
  {
    product_id: "prod-125",
    category_id: "cat-audio",
    name: "Reference 5 Studio Monitor Speakers",
    description: "Pair of bi-amplified active studio monitors with 5-inch Kevlar woofers and silk dome tweeters for acoustic mixing.",
    price: 329.00,
    stock_quantity: 20,
    rating: 4.9,
    review_count: 3,
    image_url: "https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-03-26T11:20:00Z"
  }
];

const SEED_USERS = [
  {
    user_id: "user-1",
    name: "Alex Mercer",
    email: "alex@example.com",
    password: "password123",
    role: "Customer",
    phone: "+1 (555) 234-5678",
    street: "742 Evergreen Terrace",
    city: "Seattle",
    postal_code: "98101",
    country: "United States"
  },
  {
    user_id: "user-admin",
    name: "Sarah Jenkins (System Admin)",
    email: "admin@ecommerce.org",
    password: "adminpass123",
    role: "Admin",
    phone: "+1 (555) 999-0000",
    street: "100 Enterprise Way",
    city: "San Francisco",
    postal_code: "94105",
    country: "United States"
  }
];

const SEED_DISCOUNTS = [
  { discount_id: "disc-1", code: "WELCOME10", percentage: 10, active: true },
  { discount_id: "disc-2", code: "ARCH20", percentage: 20, active: true },
  { discount_id: "disc-3", code: "VIP30", percentage: 30, active: true }
];

// Seed Customer Reviews for ALL product items
const reviewTemplates = [
  { name: "Marcus Vance", rating: 5, comment: "Exceeded my expectations! Build quality is top tier and fit is outstanding." },
  { name: "Elena Rostova", rating: 5, comment: "Fantastic quality material. Shipped super fast and packaging was pristine." },
  { name: "David Kim", rating: 4, comment: "Very satisfied with the purchase. Fits perfectly as described in size chart." },
  { name: "Sophia Chen", rating: 5, comment: "Seamless integration into my wardrobe and style. Highly recommended!" }
];

const SEED_REVIEWS = [];
SEED_PRODUCTS.forEach(p => {
  SEED_REVIEWS.push({
    review_id: `rev-${p.product_id}-1`,
    product_id: p.product_id,
    user_name: reviewTemplates[0].name,
    rating: reviewTemplates[0].rating,
    comment: reviewTemplates[0].comment,
    created_at: "2026-02-14T12:00:00Z"
  });
  SEED_REVIEWS.push({
    review_id: `rev-${p.product_id}-2`,
    product_id: p.product_id,
    user_name: reviewTemplates[1].name,
    rating: reviewTemplates[1].rating,
    comment: reviewTemplates[1].comment,
    created_at: "2026-02-20T15:30:00Z"
  });
  SEED_REVIEWS.push({
    review_id: `rev-${p.product_id}-3`,
    product_id: p.product_id,
    user_name: reviewTemplates[2].name,
    rating: reviewTemplates[2].rating,
    comment: reviewTemplates[2].comment,
    created_at: "2026-03-01T09:15:00Z"
  });
});

class DatabaseEngine {
  constructor() {
    this.storageKey = "ECOMMERCE_ARCHITECTURE_DB_V6"; // Upgraded to V6 to force refresh of all verified product image URLs
    this.init();
  }

  init() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.products = parsed.products || SEED_PRODUCTS;
        this.categories = parsed.categories || SEED_CATEGORIES;
        this.users = (parsed.users || SEED_USERS).map(u => ({
          ...u,
          password: u.password || (u.role === 'Admin' ? 'adminpass123' : 'password123')
        }));
        this.discounts = parsed.discounts || SEED_DISCOUNTS;
        this.reviews = parsed.reviews || SEED_REVIEWS;
        this.orders = parsed.orders || [];
        this.queryLogs = parsed.queryLogs || [];
        return;
      } catch (e) {
        console.warn("Failed to load local storage database, resetting seed", e);
      }
    }
    this.products = [...SEED_PRODUCTS];
    this.categories = [...SEED_CATEGORIES];
    this.users = SEED_USERS.map(u => ({ ...u }));
    this.discounts = [...SEED_DISCOUNTS];
    this.reviews = [...SEED_REVIEWS];
    this.orders = [];
    this.queryLogs = [];
    this.save();
  }

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify({
      products: this.products,
      categories: this.categories,
      users: this.users,
      discounts: this.discounts,
      reviews: this.reviews,
      orders: this.orders,
      queryLogs: this.queryLogs.slice(-50)
    }));
  }

  logQuery(operation, entity, details) {
    const logEntry = {
      id: "log-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      timestamp: new Date().toLocaleTimeString(),
      operation,
      entity,
      details
    };
    this.queryLogs.push(logEntry);
    this.save();
    return logEntry;
  }

  resetToDefaults() {
    localStorage.removeItem(this.storageKey);
    this.init();
  }
}

export const db = new DatabaseEngine();
