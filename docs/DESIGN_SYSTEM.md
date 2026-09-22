# KB Beverage & Food — Design System Specification

**Version:** 1.0.0  
**Status:** Approved Architecture Draft  
**Brand:** KB ("Pure Taste, Every Time.")  
**Core Portfolio Brands:** Vrinda, Sangam, Urban Roast, CocoJoy  

---

## 1. Brand Visual Direction & Design Philosophy

KB is a modern, premium beverage and tea premix manufacturer founded on natural ingredients, rich heritage, and authentic taste. The digital storefront reflects a **modern, minimal, premium, natural, warm, and commerce-first** aesthetic.

### Key Tenets
1. **Restraint Over Clutter:** Impress through typography, intentional whitespace, balanced composition, and product photography—not by stacking unnecessary cards, borders, or flashy gradients.
2. **Natural & Earthy Luxury:** Grounded in deep forest greens, warm gold accents, and organic cream tones that evoke tea gardens, slow roasting, and pure refreshment.
3. **Commerce-First Clarity:** Prioritize product imagery, transparent pricing, instant accessibility, and streamlined navigation.
4. **Tailwind CSS v4 Alignment:** Tokens are defined via Tailwind CSS custom theme variables and utility classes, ensuring crisp rendering across all viewports.

---

## 2. Color System & Design Tokens

The color palette is derived directly from the KB brand brochure and natural beverage elements (tea leaves, spices, roasted beans, and sun-drenched botanicals).

### 2.1 Core Palette

| Token Name | Hex Code | Tailwind Token | Intended Usage |
| :--- | :--- | :--- | :--- |
| **Deep Forest Green** | `#143425` | `kb-green-900` | Primary brand color, headers, primary buttons, dominant text |
| **Pine Forest** | `#1C4834` | `kb-green-800` | Hover states for primary actions, dark accent surfaces |
| **Herbal Sage** | `#426B54` | `kb-green-600` | Secondary green, subtle tags, leaf/botanical badges |
| **Warm Gold / Mustard** | `#C89B3C` | `kb-gold-500` | Key accent, star ratings, active indicator, subtle highlights |
| **Antique Gold** | `#A87E28` | `kb-gold-600` | Hover state for gold accents, premium borders |
| **Natural Brown** | `#6E4D38` | `kb-earth-700` | Urban Roast theme, rich cocoa/chai accents, warm borders |
| **Warm Sand / Tan** | `#D9CBB8` | `kb-sand-300` | Subtle dividers, secondary borders, image backdrops |
| **Warm Cream** | `#F9F6F0` | `kb-cream-100` | Default storefront page background, elevated neutral cards |
| **Soft Parchment** | `#F2ECE1` | `kb-cream-200` | Secondary surface background, filter panel container |
| **Off White / Light** | `#FCFCFB` | `kb-neutral-50` | Card interiors, clean modal surfaces |
| **Dark Charcoal** | `#1A1D1A` | `kb-charcoal-900` | High-contrast body copy, footer background |
| **Muted Slate** | `#59635C` | `kb-charcoal-500` | Secondary body text, metadata, SKU labels, breadcrumbs |

### 2.2 Accent Gradient (Restricted Usage)

```css
/* KB Brand Accent Gradient */
background: linear-gradient(135deg, #143425 0%, #1C4834 60%, #C89B3C 100%);
```

> [!IMPORTANT]
> **Strict Gradient Restraint Rule:**
> The brand gradient is reserved exclusively as a selective accent. It must **NEVER** be applied ubiquitously to every card, section heading, or background.
> - **Allowed:** Hero decorative badge, primary checkout CTA button, select promotional banner highlight, small decorative micro-accents.
> - **Prohibited:** Generic product cards, table rows, section containers, full-bleed page backgrounds, or standard form inputs.

### 2.3 Semantic & Functional Tokens

- **Success / In Stock:** `#1E6B47` (Deep Emerald) / Background: `#EBF7F0`
- **Warning / Low Stock:** `#B86B14` (Amber Bronze) / Background: `#FEF6EB`
- **Danger / Destructive:** `#B23B3B` (Crimson Earth) / Background: `#FDF1F1`
- **Information / Notice:** `#2B5876` (Deep Teal) / Background: `#EFF6FA`

---

## 3. Typography System

The typography marries contemporary geometric precision with classical editorial warmth.

### 3.1 Typeface Families
- **Primary Body & Sans:** `Geist Sans` / `Inter` (neutral, ultra-legible, crisp micro-copy)
- **Display & Editorial Heading:** `Playfair Display` or `Geist Sans Medium` (authoritative, refined, artisanal luxury)
- **Monospace & Data/SKU:** `Geist Mono` (clean tabular numbers, order numbers, pricing)

### 3.2 Type Scale Hierarchy

| Level | Size (Desktop / Mobile) | Weight | Line Height | Letter Spacing | CSS Utility |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Display** | 3.5rem (56px) / 2.25rem (36px) | 600 / SemiBold | 1.15 | `-0.025em` | `text-4xl md:text-6xl font-serif tracking-tight` |
| **H1 Section** | 2.5rem (40px) / 1.875rem (30px) | 600 / SemiBold | 1.2 | `-0.02em` | `text-3xl md:text-4xl font-serif tracking-tight` |
| **H2 Sub-section** | 2rem (32px) / 1.5rem (24px) | 500 / Medium | 1.25 | `-0.015em` | `text-2xl md:text-3xl font-sans tracking-tight` |
| **H3 Card Heading** | 1.25rem (20px) / 1.125rem (18px) | 600 / SemiBold | 1.35 | `-0.01em` | `text-lg md:text-xl font-sans font-semibold` |
| **Body Lead** | 1.125rem (18px) / 1rem (16px) | 400 / Normal | 1.6 | `normal` | `text-base md:text-lg text-kb-charcoal-700` |
| **Body Default** | 1rem (16px) / 0.9375rem (15px) | 400 / Normal | 1.55 | `normal` | `text-base text-kb-charcoal-800` |
| **Body Small** | 0.875rem (14px) / 0.8125rem (13px) | 400 / Normal | 1.5 | `normal` | `text-sm text-kb-charcoal-500` |
| **Caption / Badge** | 0.75rem (12px) / 0.6875rem (11px) | 600 / SemiBold | 1.3 | `+0.05em` | `text-xs uppercase tracking-wider` |
| **Price Display** | 1.25rem (20px) / 1.5rem (24px) | 700 / Bold | 1.2 | `normal` | `font-mono font-bold text-kb-green-900` |

---

## 4. Spacing, Layout & Grid System

### 4.1 Spacing Units (8pt / 4pt Grid)
- `space-1` = `4px`
- `space-2` = `8px`
- `space-3` = `12px`
- `space-4` = `16px` (Standard inner padding)
- `space-6` = `24px` (Card spacing, grid gaps)
- `space-8` = `32px` (Section sub-groupings)
- `space-12` = `48px` (Standard section vertical spacing on mobile)
- `space-20` = `80px` (Storefront section vertical spacing on desktop)
- `space-28` = `112px` (Hero / key transitions on desktop)

### 4.2 Containers & Breakpoints
- **Max Content Container:** `max-w-7xl` (`1280px`) with fluid horizontal padding (`px-4 sm:px-6 lg:px-8`).
- **Narrow Editorial Container:** `max-w-4xl` (`896px`) for Product Details, About narrative, Checkout flow.
- **Admin Fluid Container:** `max-w-screen-2xl` (`1536px`) for multi-column operational tables.
- **Breakpoints:**
  - `sm`: `640px`
  - `md`: `768px` (Tablet / mobile nav collapse)
  - `lg`: `1024px` (Desktop / sidebar reveals)
  - `xl`: `1280px`
  - `2xl`: `1536px`

---

## 5. Component Style Specifications

### 5.1 Button System (Strict Hierarchy)

```
[PRIMARY]   kb-green-900 solid background, white text, subtle hover lift.
[SECONDARY] Off-white background, 1px kb-sand-300 border, kb-green-900 text.
[TERTIARY]  Transparent background, no border, text underline on hover.
[DANGER]    kb-red-700 solid or red border (Admin only).
```

- **Primary Action:** `h-11 px-6 rounded-lg bg-[#143425] text-white font-medium hover:bg-[#1C4834] transition-colors shadow-sm`
- **Secondary Action:** `h-11 px-6 rounded-lg border border-[#D9CBB8] bg-white text-[#143425] font-medium hover:bg-[#F9F6F0] transition-colors`
- **Ghost / Tertiary:** `h-10 px-4 text-[#143425] font-medium hover:text-[#C89B3C] transition-colors inline-flex items-center gap-1.5`
- **Admin Destructive:** `h-10 px-4 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors`

### 5.2 Product Card Specification
- **Container:** Pure white card with 1px border (`border-stone-200/80`), subtle border-radius (`rounded-xl`), overflow hidden, zero heavy dropshadows by default.
- **Image Aspect Ratio:** `aspect-square` or `aspect-[4/5]` with neutral beige backdrop (`bg-[#F7F4EE]`), object-contain or object-cover with subtle hover zoom (`scale-105 duration-300`).
- **Details Section:**
  - Brand tag: `text-xs uppercase tracking-wider text-[#A87E28] font-semibold`
  - Product title: `text-base font-medium text-[#1A1D1A] line-clamp-1 group-hover:text-[#143425]`
  - Taste notes / Subtitle: `text-xs text-stone-500 line-clamp-1`
  - Price & Action row: `flex items-center justify-between mt-3`
  - Action button: Minimalist icon or understated outline button `Add` instead of a bulky screaming CTA.

### 5.3 Category Card Specification
- Four primary category cards presented with editorial warmth.
- High-quality beverage imagery, dark subtle vignette or gentle gradient wash at bottom.
- Category name in serif typography, product count badge, and clean arrow link.

### 5.4 Form Elements & Inputs
- **Base Input:** `h-11 px-3.5 rounded-lg border border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#143425]/20 focus:border-[#143425] transition-all text-sm`
- **Label:** `text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 block`
- **Error State:** `border-red-500 focus:ring-red-200 text-red-900`
- **Helper text:** `text-xs text-stone-500 mt-1`

### 5.5 Badges & Status Indicators
- **In Stock:** `inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200`
- **Low Stock:** `inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200`
- **Out of Stock:** `inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-600 border border-stone-200`
- **Brand Tag:** `inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wider uppercase bg-[#F2ECE1] text-[#6E4D38]`

### 5.6 Dialogs, Drawers & Modals
- **Backdrop:** `fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity z-50`
- **Cart / Filter Drawer:** Slides in from right (Cart) or left (Filters on mobile), max width `420px`, sticky header with close button, scrollable body, sticky checkout/apply footer.
- **Confirmation Modal:** Centered dialog, `max-w-md rounded-2xl bg-white p-6 shadow-xl border border-stone-100`.

---

## 6. Motion & Micro-Interactions

Motion must feel natural, organic, and calm—never distracting or hyperactive.
- **Duration standard:** `150ms` (hover states, toggle pills), `250ms` (accordion open/close, card lift), `300ms` (drawer slide-in, modal fade).
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (smooth ease-out, no bouncing).
- **Interactions:**
  - Product card hover: Image scales from `1.0` to `1.04`, subtle box-shadow lift (`shadow-sm` -> `shadow-md`).
  - Button press: `active:scale-[0.98]`.
  - Skeleton loading: Subtle pulse with warm beige base (`bg-stone-200/60`).

---

## 7. Responsive Breakpoint Strategy

- **Mobile (< 768px):**
  - Navigation collapses into a full-height slide-over drawer with quick links to Shop, Brands, Categories, Contact.
  - Sticky bottom mobile bar for key storefront actions (Quick Cart preview / Checkout summary).
  - Product grids default to 2 columns with compact metadata to avoid vertical bloat.
  - Filters collapse into a slide-over Filter Drawer.
  - Admin sidebar collapses into an accessible mobile drawer with hamburger trigger.
- **Tablet (768px - 1024px):**
  - Product grids expand to 3 columns.
  - Admin tables gain horizontal scroll containment with fixed headers and frozen primary column.
- **Desktop (1024px+):**
  - Full desktop header with brand logo, primary category links, search bar, and utility icons.
  - 4-column product grid with side-by-side filter sidebar.
  - Admin view features persistent 260px sidebar and multi-metric dashboard grids.
