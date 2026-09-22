# KB Beverage & Food — Complete Page Map & Route Hierarchy

**Version:** 1.0.0  
**Framework:** Next.js App Router  
**Scope:** Storefront (Customer-Facing) + Admin Panel (Operations UI)  

---

## 1. Storefront Page Map (`app/(storefront)/`)

The storefront provides an editorial, commerce-first journey for discovery, purchasing, and customer account management.

```
/ (Home)
├── /shop (Catalog with dynamic filters)
├── /category/[slug] (Category-focused product list)
│   ├── /category/tea-premixes
│   ├── /category/iced-teas
│   ├── /category/artisan-coffee
│   └── /category/plant-based-specialties
├── /brands (Brand portfolio)
│   ├── /brands/vrinda
│   ├── /brands/sangam
│   ├── /brands/urban-roast
│   └── /brands/cocojoy
├── /product/[slug] (Product detail page)
├── /search (Dedicated search with suggestions)
├── /cart (Dedicated cart view)
├── /checkout (Multi-step checkout UI)
├── /wishlist (Customer saved items)
├── /account (Customer hub)
│   ├── /account/orders (Order history)
│   │   └── /account/orders/[id] (Invoice & status tracking)
│   ├── /account/addresses (Saved shipping addresses)
│   └── /account/settings (Profile preferences)
├── /login (Customer sign in)
├── /register (Customer account creation)
├── /about (Brand story & craftsmanship)
└── /contact (Customer service & distributor inquiries)
```

---

### 1.1 Detailed Storefront Route Breakdown

#### `GET /` — Homepage
- **Purpose:** Brand introduction, direct path to 4 primary categories, top-selling products, and brand values.
- **Key Sections:**
  1. **Minimal Top Banner:** Promotional message ("Free shipping on orders above ₹499 • Crafted with pure natural ingredients").
  2. **Storefront Header:** Brand logo, primary category links, brand portfolio dropdown, search trigger, wishlist counter, and cart badge.
  3. **Hero Section:** High-impact editorial layout with tagline: *"Pure Taste, Every Time."* Primary CTA ("Shop Products"), secondary CTA ("Explore Categories").
  4. **The Four Categories Showcase:** Visual cards for Tea Premixes, Iced Teas, Artisan Coffee, and Plant-Based Specialties.
  5. **Featured Products Grid:** Handpicked flagship items (Vrinda Cardamom, Sangam Guava Chilly, etc.) with price, ratings, and instant add-to-cart.
  6. **Brand Portfolio Grid:** 4 distinct brand cards (Vrinda, Sangam, Urban Roast, CocoJoy) highlighting their specific heritage.
  7. **Taste & Purity Promise:** 3-pillar editorial layout (Authentic Recipes, Premium Leaf & Bean Selection, Hygienic High-Barrier Packaging).
  8. **Editorial Story Section:** "The KB Philosophy" with warm imagery and natural aesthetics.
  9. **Final Shopping Call to Action:** Minimalist banner prompting exploration.
  10. **Storefront Footer:** Navigation links, customer service, distributor inquiries, newsletter subscribe mock, copyright notice.

#### `GET /shop` — All Products Catalog
- **Purpose:** Full e-commerce catalog with multi-dimensional filtering and sorting.
- **Key Sections:**
  - Page header with breadcrumbs and active item count.
  - **Desktop Filter Sidebar / Mobile Filter Drawer:**
    - Categories (4 primary options with checkboxes and counts)
    - Brands (Vrinda, Sangam, Urban Roast, CocoJoy)
    - Price Range slider / range presets (Under ₹250, ₹250–₹500, Above ₹500)
    - Availability toggle (In Stock only)
  - **Toolbar:** Sort dropdown (Featured, Price: Low to High, Price: High to Low, Customer Rating, Newest).
  - **Product Grid:** Responsive 3-4 column grid displaying `ProductCard` components.
  - **Empty State:** Clean illustration with "Reset All Filters" button when no items match.

#### `GET /category/[slug]` — Primary Category View
- **Purpose:** Dedicated deep-dive into one of the 4 primary categories (`tea-premixes`, `iced-teas`, `artisan-coffee`, `plant-based-specialties`).
- **Key Sections:**
  - Editorial category banner with category title, tagline, and natural background tone.
  - Brand filter pills within the category.
  - Category product grid.
  - Related recipe or brewing advice teaser.

#### `GET /product/[slug]` — Product Detail Page (PDP)
- **Purpose:** Showcase beverage details, ingredients, sensory profile, pricing, and purchase actions.
- **Key Sections:**
  - **Breadcrumbs:** Home / Category / Brand / Product Name.
  - **Product Gallery:** Multi-image preview with active thumbnail selection.
  - **Product Info:**
    - Brand link (e.g. *Vrinda*)
    - Title (*Cardamom Tea Premix*)
    - Star rating & verified review count
    - Pricing with MRP strikethrough & calculated discount percentage
    - Pack size / variant selector
    - Stock availability badge (In Stock / Low Stock)
    - Interactive quantity stepper
    - Primary CTA: **Add to Cart** (with visual feedback)
    - Secondary CTA: **Buy Now** (instant redirect to checkout)
    - Wishlist favorite toggle button
  - **Product Tabs / Accordion:**
    - Description & Taste Notes
    - Preparation / Brewing Guide (Step-by-step)
    - Ingredients & Natural Sourcing
    - Packaging & Shelf Life Specifications
  - **Related Products Carousel:** Complementary beverages from the same brand or category.

#### `GET /cart` — Shopping Cart Page
- **Purpose:** Comprehensive review of selected items before proceeding to checkout.
- **Key Sections:**
  - Itemized table/list with product thumbnail, brand, title, unit price, quantity stepper, line total, and remove icon.
  - Special Delivery Instructions / Order Note input.
  - Promo code discount input with validation feedback.
  - **Order Summary Card:**
    - Subtotal
    - Estimated Shipping (or Free shipping threshold progress bar)
    - Tax estimate
    - Grand Total (in bold large typography)
    - Primary CTA: **Proceed to Checkout**
  - **Empty Cart State:** Elegant graphic with "Explore Best Sellers" CTA button.

#### `GET /checkout` — Checkout UI Experience
- **Purpose:** Clean, distraction-free checkout flow designed for maximum conversion.
- **Key Sections:**
  - Streamlined header with brand logo and secure checkout badge.
  - **Step 1: Contact Information:** Email / Phone input with guest checkout option.
  - **Step 2: Shipping Address:** Full name, address line 1 & 2, city, state, pin code, phone.
  - **Step 3: Delivery Options:** Standard Delivery (3-5 days, Free above ₹499) vs Express Delivery.
  - **Step 4: Payment Method (Mock):** UPI (Google Pay, PhonePe), Credit/Debit Card, Net Banking, Cash on Delivery (COD).
  - **Sticky Order Review Sidebar:** Collapsed items summary with item thumbnails, discounts, and total payable.
  - **Place Order Button:** Includes loading spinner state and transitions to order success confirmation modal/view.

#### `GET /account` — Customer Account Hub
- **Purpose:** Personal profile, saved addresses, and quick access to recent orders.
- **Child Views:**
  - `/account/orders`: Historical order cards with status badges and reorder triggers.
  - `/account/orders/[id]`: Detailed order view with tracking timeline and printable invoice layout.
  - `/account/addresses`: Saved address cards with "Add New Address" modal.
  - `/account/settings`: Profile details, password reset UI, communication preferences.

#### `GET /about` — Brand Heritage & Craftsmanship
- **Purpose:** Build trust by narrating KB's journey, ingredient sourcing standards, and manufacturing excellence.
- **Sections:**
  - The Story of KB: Pure taste philosophy.
  - The Four Pillars: Quality, Heritage, Hygiene, Innovation.
  - Sourcing from premier tea estates and spice gardens.
  - Quality assurance and vacuum-sealed aroma retention.

#### `GET /contact` — Inquiries & B2B Distribution
- **Purpose:** Direct point of contact for customer support, corporate gifting, and wholesale distribution.
- **Sections:**
  - Contact Form with Inquiry Type dropdown (Customer Support, Wholesale & B2B, Corporate Gifting, Feedback).
  - Corporate Office Address & Factory Location details.
  - Email, Customer Care phone number, and operating hours.

---

## 2. Admin Panel Page Map (`app/admin/`)

The Admin Panel is an operational workspace characterized by dense data presentation, rapid filtering, and clear visual hierarchy.

```
/admin (Dashboard)
├── /admin/products (Product catalog table)
│   └── /admin/products/new (Add product form)
├── /admin/categories (4 Primary categories manager)
├── /admin/brands (Brand portfolio manager)
├── /admin/orders (Orders list)
│   └── /admin/orders/[id] (Order fulfillment details)
├── /admin/inventory (Stock monitoring & low stock alerts)
├── /admin/customers (Customer database & history)
├── /admin/content (Homepage CMS mockup)
├── /admin/coupons (Promotions & discount codes)
├── /admin/reviews (Customer review moderation)
├── /admin/reports (Sales & beverage trends)
└── /admin/settings (Store preferences)
```

---

### 2.1 Detailed Admin Route Breakdown

#### `GET /admin` — Operational Dashboard
- **Key Metrics (5 Stat Cards):**
  1. Total Revenue (`₹1,42,850` • +14.2% from last month)
  2. Total Orders (`384 Orders` • +8.1%)
  3. Total Customers (`1,290 Registered` • +19.5%)
  4. Active SKUs (`32 Products across 4 brands`)
  5. Low Stock Alert (`4 SKUs require restocking`)
- **Visual Analytics:**
  - Sales Trend (Interactive monthly SVG bar/line chart)
  - Category Share (Tea Premixes 48%, Iced Teas 28%, Coffee 16%, Plant-Based 8%)
- **Actionable Tables:**
  - Recent Orders (Last 5 orders with quick status update dropdown)
  - Critical Stock Alerts (SKUs with < 20 units remaining)

#### `GET /admin/products` — Catalog Management
- **Components:** Filter bar (Search by name/SKU, filter by Brand, Category, Status), "Add New Product" button.
- **Data Table Columns:**
  - Image thumbnail
  - Product Name & SKU
  - Brand (Vrinda / Sangam / Urban Roast / CocoJoy)
  - Category (1 of 4)
  - Price & MRP
  - Current Stock
  - Status (Active / Draft / Out of Stock)
  - Actions (Edit, Duplicate, Delete)

#### `GET /admin/products/new` — Add / Edit Product Form
- **Sections:**
  - Basic Information: Title, Brand, Category, Short Tagline.
  - Pricing & Inventory: Selling Price, MRP, SKU Code, Initial Stock, Safety Stock Threshold.
  - Product Specifications: Serving size, Shelf life, Packaging format.
  - Preparation Instructions: Step-by-step text fields.
  - Image Upload Zone: Drag-and-drop file uploader preview.
  - Status Toggle: Published vs. Draft.

#### `GET /admin/categories` — Four Primary Categories Manager
- **Enforces the strict 4-category structure:**
  - Tea Premixes
  - Iced Teas
  - Artisan Coffee
  - Plant-Based & Coconut Specialties
- **Table / Card Grid:** Category hero image, Name, Tagline, Description, Product count, Active status toggle, Edit modal.

#### `GET /admin/brands` — Brand Portfolio Manager
- **Portfolio Brands:**
  - **Vrinda:** Authentic traditional tea premixes (Cardamom, Masala, Ginger).
  - **Sangam:** Modern botanical iced teas (Guava Chilly, Lemon, Watermelon).
  - **Urban Roast:** Premium crafted coffees and specialty blends.
  - **CocoJoy:** Pure coconut water & tropical plant-based beverages.
- **Controls:** Brand logo, tagline, description, product count, status, action menu.

#### `GET /admin/orders` — Orders Fulfillment
- **Filter Tabs:** All, Pending, Confirmed, Shipped, Delivered, Cancelled.
- **Table Columns:** Order ID, Customer Name, Date & Time, Item Count, Total Value, Payment Status (Paid / COD / Pending), Fulfillment Status Badge, Action (View Details).

#### `GET /admin/orders/[id]` — Order Detail & Packing Slip
- **Header:** Order ID (`#KB-8924`), Order timestamp, Current status updater select.
- **Customer Card:** Name, phone, email, shipping address, billing address.
- **Itemized Table:** Product thumbnail, SKU, Unit price, Quantity, Line total.
- **Financial Summary:** Subtotal, shipping fee, tax, discount applied, grand total.
- **Fulfillment Stepper:** Interactive timeline (Order Placed -> Payment Verified -> Packed -> Dispatched -> Delivered).

#### `GET /admin/inventory` — Stock Health Monitor
- **Key Elements:** Stock status overview counters (Healthy, Low Stock, Out of Stock).
- **Table:** SKU, Product, Brand, Warehouse location, Stock on hand, Reserved in cart, Available, Reorder point, Status badge, "Quick Restock" button.

#### `GET /admin/content` — Homepage & Banner CMS UI
- **Control Modules:**
  - Hero Slide Manager (Headline, Tagline, Background Image, CTA link).
  - Category Order and featured category highlight.
  - Promotional Banner Strip (Announcement message, Active status).
  - Brand Values & Story Content block editor.

#### `GET /admin/coupons` — Promotions & Discounts
- **Table:** Coupon Code (`KBWELCOME10`, `MONSOONTEA`), Discount Value (10%, ₹100 Off), Minimum Spend, Start/End Dates, Total Redemptions, Status, "Create Coupon" modal.

#### `GET /admin/reviews` — Customer Review Moderation
- **Table:** Customer Name, Product Name, Star Rating (1-5), Review Headline & Comments, Date, Moderation Action (Approve, Hide, Delete).

#### `GET /admin/reports` — Sales Analytics
- **Visuals:** Revenue by Brand breakdown, Best-performing beverage categories, Average Order Value (AOV) trend, Repeat customer rate.

#### `GET /admin/settings` — Store Settings
- **Sections:** Store Identity (Legal name, Support email, Phone), Currency & Tax rules (GST calculation display), Shipping rules (Free shipping threshold), Notification preferences.

---

## 3. UI States Matrix Across All Pages

Every page and component must rigorously support these five standardized UI states:

| UI State | Storefront Implementation | Admin Panel Implementation |
| :--- | :--- | :--- |
| **Default / Ready** | Full visual layout with real mock data, clean typography, hover transitions | Dense data table, stat cards, metric indicators |
| **Loading / Skeleton** | Warm beige animated skeleton blocks matching exact card & text dimensions | Table row skeletons, stat card pulse loaders |
| **Empty State** | Branded illustration, warm friendly copy, direct action CTA (e.g. "Browse Shop") | Clean operational empty banner with "Create Item" or "Reset Filters" action |
| **Error / Failed** | Non-disruptive inline error alert with "Try Again" retry action | Danger toast notification and form field validation error highlights |
| **Success State** | Subtle checkmark toast, order confirmation modal with confetti/animation | Green confirmation toast (e.g., "Product saved successfully") |
