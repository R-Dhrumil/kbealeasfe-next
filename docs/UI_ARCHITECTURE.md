# KB Beverage & Food — UI Architecture & Engineering Specification

**Version:** 1.0.0  
**Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide React  
**Author:** Senior Frontend Architect & Product Designer  

---

## 1. Existing Repository Audit & Findings

A comprehensive inspection of the current workspace reveals:
- **Framework & Version:** Next.js `16.3.5` with React `19.2.8`.
- **CSS Architecture:** Tailwind CSS v4 (`@tailwindcss/postcss` & `tailwindcss` ^4) using CSS-first configuration via `@import "tailwindcss"` in `app/globals.css`.
- **Current State:** Fresh `create-next-app` boilerplate with initial root files:
  - Root `app/layout.tsx` (using Next.js `Geist` font imports)
  - Minimal `app/page.tsx` (`<h1>Hello World</h1>`)
  - No icons installed yet (`lucide-react` is specified in project requirements and will be installed).
  - Clean git tree on `main` branch.

---

## 2. Directory & App Router Architecture

To adhere to Next.js best practices and guarantee clean separation of concerns without route conflicts, we implement a structured root layout utilizing **Route Groups**:

```
src/ (or root-level app structure)
├── app/
│   ├── (storefront)/                  # Storefront Route Group (shares Storefront Layout)
│   │   ├── layout.tsx                 # Customer Header, Navigation, Cart Drawer, Footer
│   │   ├── page.tsx                   # Homepage (commerce-first, brand storytelling)
│   │   ├── shop/
│   │   │   └── page.tsx               # Full Catalog (Filters, Sort, Search, Grid)
│   │   ├── category/
│   │   │   └── [slug]/
│   │   │       └── page.tsx           # Category Landing (One of 4 primary categories)
│   │   ├── product/
│   │   │   └── [slug]/
│   │   │       └── page.tsx           # Product Detail Page (PDP)
│   │   ├── brands/
│   │   │   ├── page.tsx               # All Brands Portfolio
│   │   │   └── [slug]/
│   │   │       └── page.tsx           # Brand Specific Showcase (Vrinda, Sangam, etc.)
│   │   ├── search/
│   │   │   └── page.tsx               # Dedicated Search Experience
│   │   ├── cart/
│   │   │   └── page.tsx               # Dedicated Shopping Cart
│   │   ├── checkout/
│   │   │   └── page.tsx               # Multi-step / Accordion Checkout Flow
│   │   ├── wishlist/
│   │   │   └── page.tsx               # Saved Items Collection
│   │   ├── account/                   # Customer Account Hub
│   │   │   ├── page.tsx               # Profile & Dashboard
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx           # Order History List
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx       # Detailed Order Invoice & Tracking View
│   │   │   ├── addresses/
│   │   │   │   └── page.tsx           # Saved Delivery Addresses
│   │   │   └── settings/
│   │   │       └── page.tsx           # Preferences & Password
│   │   ├── login/
│   │   │   └── page.tsx               # Customer Sign In UI
│   │   ├── register/
│   │   │   └── page.tsx               # Customer Registration UI
│   │   ├── about/
│   │   │   └── page.tsx               # KB Heritage, Philosophy & Quality Craftsmanship
│   │   └── contact/
│   │       └── page.tsx               # Inquiries, Corporate Gifting & Distribution
│   │
│   ├── admin/                         # Admin Operations Route Group (Separate Layout)
│   │   ├── layout.tsx                 # Admin Shell: Collapsible Sidebar, Topbar, Alerts
│   │   ├── page.tsx                   # Admin Dashboard (KPIs, Charts, Recent Activity)
│   │   ├── products/
│   │   │   ├── page.tsx               # Product Catalog Management Table
│   │   │   └── new/
│   │   │       └── page.tsx           # Add Product Form View
│   │   ├── categories/
│   │   │   └── page.tsx               # Primary 4 Categories Manager
│   │   ├── brands/
│   │   │   └── page.tsx               # Brand Portfolio Manager (Vrinda, Sangam, etc.)
│   │   ├── orders/
│   │   │   ├── page.tsx               # Orders List with Status Filters
│   │   │   └── [id]/
│   │   │       └── page.tsx           # Order Fulfillment & Item Inspection
│   │   ├── inventory/
│   │   │   └── page.tsx               # Stock Levels, Reorder Points & Alerts
│   │   ├── customers/
│   │   │   └── page.tsx               # Customer Directory & LTV Insights
│   │   ├── content/
│   │   │   └── page.tsx               # Homepage & Banner CMS Control UI
│   │   ├── coupons/
│   │   │   └── page.tsx               # Discount Codes & Promotions
│   │   ├── reviews/
│   │   │   └── page.tsx               # Product Review Moderation UI
│   │   ├── reports/
│   │   │   └── page.tsx               # Sales & Beverage Category Analytics
│   │   └── settings/
│   │       └── page.tsx               # Store Currency, Tax & Fulfillment Settings
│   │
│   ├── layout.tsx                     # Root Global Layout (Fonts, Global CSS, Providers)
│   ├── globals.css                    # Tailwind CSS v4 Theme Tokens & Utilities
│   └── not-found.tsx                  # Branded 404 Experience
│
├── components/
│   ├── ui/                            # Primitives (Button, Input, Badge, Modal, Skeleton)
│   ├── storefront/                    # Storefront Composed Components
│   │   ├── Header.tsx                 # Sticky Minimal Header & Brand Identity
│   │   ├── MobileNav.tsx              # Slide-over Navigation Drawer
│   │   ├── Footer.tsx                 # Editorial Brand Footer
│   │   ├── ProductCard.tsx            # Clean Product Showcase Card
│   │   ├── CategoryCard.tsx           # 4-Category Heroic Cards
│   │   ├── BrandCard.tsx              # Brand Showcase Card
│   │   ├── FilterPanel.tsx            # Desktop & Drawer Product Filters
│   │   ├── CartDrawer.tsx             # Interactive Slide-over Cart
│   │   ├── QuantitySelector.tsx       # Stepper Component
│   │   └── PriceDisplay.tsx           # Currency & Discount Formatter
│   └── admin/                         # Admin Composed Components
│       ├── AdminSidebar.tsx           # Compact Operations Navigation
│       ├── AdminTopbar.tsx            # Profile, Search, Notifications
│       ├── DataTable.tsx              # Reusable Sortable/Paginated Table
│       ├── StatCard.tsx               # Metric Card with Delta Indicator
│       ├── ChartMock.tsx              # SVG/CSS Trend Visualizer
│       └── StatusBadge.tsx            # Inventory & Order Status Badges
│
├── data/                              # Centralized Mock Data (Single Source of Truth)
│   ├── brands.ts                      # Vrinda, Sangam, Urban Roast, CocoJoy
│   ├── categories.ts                  # Exactly 4 Primary Beverage Categories
│   ├── products.ts                    # Tea Premixes, Iced Teas, Coffees, Specialties
│   ├── orders.ts                      # Customer Orders & Fulfilment States
│   ├── customers.ts                   # Customer Profiles & Purchase History
│   ├── inventory.ts                   # SKU Tracking, Stock Levels, Thresholds
│   └── homepage.ts                    # Hero Slides, Editorial Banners, Brand Values
│
├── context/                           # Lightweight Client State Providers
│   ├── CartContext.tsx                # Cart State (Items, Quantities, Drawer Open/Close)
│   └── WishlistContext.tsx            # Wishlist State (Saved Items, Toggle)
│
├── types/                             # Strict TypeScript Domain Models
│   ├── product.ts
│   ├── category.ts
│   ├── brand.ts
│   ├── order.ts
│   ├── customer.ts
│   ├── cart.ts
│   └── inventory.ts
│
└── lib/
    ├── utils.ts                       # Classnames merger & general helpers
    └── formatters.ts                  # Currency (INR ₹), Date, and Metric formatters
```

---

## 3. Server Components vs. Client Components Boundary

To maintain optimal performance, minimal bundle size, and fast initial page load, we follow strict Next.js App Router boundary guidelines:

### 3.1 Server Components (Default)
All pages and structural shells remain Server Components:
- `(storefront)/page.tsx` (Homepage data assembly)
- `(storefront)/shop/page.tsx` (Catalog grid layout)
- `(storefront)/product/[slug]/page.tsx` (Product metadata & gallery SSR)
- `(storefront)/category/[slug]/page.tsx` (Category info & product list)
- `(storefront)/about/page.tsx` & `contact/page.tsx`
- `(storefront)/layout.tsx` (Layout wrapper)
- `admin/layout.tsx` (Admin layout shell)
- `admin/page.tsx` (Dashboard data presentation)
- UI Primitives that render purely from props: `SectionHeader`, `Badge`, `PriceDisplay`, `Skeleton`.

### 3.2 Client Components (`"use client"` Only Where Necessary)
Client components are isolated to interactive islands:
- `CartDrawer.tsx` & `CartContext.tsx`: Manages cart slide-over, items addition, quantity modifications.
- `WishlistButton.tsx` & `WishlistContext.tsx`: Local storage favorite toggle.
- `FilterPanel.tsx` / `FilterDrawer.tsx`: Dynamic category, brand, and price range selection.
- `SearchBar.tsx`: Live keyword input, quick dropdown suggestions.
- `ProductGallery.tsx`: Thumbnail selector and zoom preview on the Product Details page.
- `QuantitySelector.tsx`: Interactive stepper (+ / -).
- `CheckoutForm.tsx`: Multi-step address input, delivery method toggle, order submission UI.
- `AdminDataTable.tsx`: Client-side search, status filter dropdown, pagination, selection checkboxes.
- `Modal.tsx` & `ConfirmDialog.tsx`: Portal-based dialog visibility management.

---

## 4. State Management Strategy

1. **Cart & Wishlist State:** Handled via custom React Context (`CartProvider` and `WishlistProvider`) wrapped around the Storefront layout. Items persist to `localStorage` when available, enabling seamless transitions across pages without any backend.
2. **Filter & Search State:** URL-driven where appropriate (e.g. `?category=tea-premix&brand=vrinda&sort=price-asc`) so filters are shareable, complemented by local state for instantaneous UI response.
3. **Admin Panel State:** Interactive tables use local component state for filters (status, category), search queries, and selected row batches. No complex store is required.

---

## 5. Domain Models & TypeScript Schema

All mock data adheres to strongly typed interfaces.

```typescript
// types/category.ts
export interface Category {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  productCount: number;
  featured: boolean;
}

// types/brand.ts
export interface Brand {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  logo: string;
  accentColor: string;
  productCount: number;
}

// types/product.ts
export interface Product {
  id: string;
  slug: string;
  name: string;
  brandId: string;
  brandName: string;
  categoryId: string;
  categoryName: string;
  tagline: string;
  description: string;
  details: {
    packaging: string;
    shelfLife: string;
    servingSize: string;
    ingredients?: string[];
    preparationNotes?: string[];
  };
  price: number;
  mrp: number;
  sku: string;
  images: string[];
  inStock: boolean;
  stockCount: number;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  rating: number;
  reviewCount: number;
}
```

---

## 6. Future Backend Integration Strategy

1. **Zero Component-to-Mock Coupling:** Components never import mock data directly within their rendering logic. Pages retrieve data via centralized helper functions (e.g., `getProducts()`, `getProductBySlug(slug)`, `getCategories()`, `getOrders()`).
2. **Seamless API Drop-in:** When a real backend (e.g. REST, Supabase, Postgres, or GraphQL) is introduced later:
   - Only the data retrieval functions in `src/data/` or `src/lib/api/` need to be swapped for `fetch('/api/products')` or database queries.
   - UI components will receive identical TypeScript interfaces without requiring a redesign.
3. **Form Actions Ready:** Forms (Checkout, Contact, Add Product) are built with clean standard event handlers that map 1:1 with Next.js Server Actions or API routes.

---

## 7. Accessibility, Performance & SEO Guidelines

- **Next.js Image Optimization:** All product and category images leverage `next/image` with explicit aspect ratios, modern formats (WebP/AVIF), and blur placeholders where appropriate.
- **Semantic Markup:** Every page features a distinct single `h1`, proper landmark elements (`header`, `main`, `nav`, `aside`, `footer`), accessible ARIA attributes on modals and drawers (`aria-expanded`, `aria-label`, `role="dialog"`).
- **Keyboard Navigation:** Drawers and modals trap focus and close on `Escape`. Form fields have clearly associated `<label>` elements.
- **Dynamic SEO Metadata:** Storefront pages export Next.js `generateMetadata` hooks with brand-consistent titles (e.g. `Cardamom Tea Premix | Vrinda | KB Beverage`).
