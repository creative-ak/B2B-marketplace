# BharatTrade B2B Marketplace - Laravel Hybrid (Blade + Vue 3 via Vite)

A scalable, secure, and production-ready B2B marketplace platform modeled after IndiaMART, built using the **Laravel 11 Hybrid Architecture** combining the SEO power and simplicity of **Blade Templates** with reactive **Vue 3 Single File Components (SFCs)** mounted via Vite.

---

## 1. Hybrid Architecture: Blade + Vue 3

### Why Hybrid?
- **Server-Side Rendered (SSR) Blade:** Search engines immediately crawl rich product catalogues, category taxonomies, structured schema, and meta tags with zero JavaScript hydration delays.
- **Client-Side Vue 3 Components:** Interactive experiences like **real-time product search suggestions**, **multi-supplier RFQ modals**, **quotation comparison matrices**, and **admin impersonation** run reactively with instant UI feedback.
- **Single Runtime Mount:** Vue 3 mounts cleanly to `<div id="app">` in `resources/views/layouts/app.blade.php`, allowing any Blade file to embed custom Vue components with standard props (`:products-data`, `csrf-token`).

```html
<!-- Example: Inside resources/views/home.blade.php -->
<search-autocomplete 
    initial-query="{{ request('search') }}"
    :products-data="{{ json_encode($popularSearchProducts) }}"
></search-autocomplete>

<rfq-modal 
    csrf-token="{{ csrf_token() }}"
    submit-url="{{ route('enquiries.store') }}"
></rfq-modal>
```

---

## 2. Directory Structure

```
laravel/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── HomeController.php
│   │   │   ├── ProductController.php
│   │   │   ├── EnquiryController.php
│   │   │   ├── QuotationController.php
│   │   │   ├── OrderController.php
│   │   │   └── Admin/
│   │   │       ├── AdminController.php
│   │   │       └── ImpersonationController.php   # Login-As with audit logging
│   ├── Models/
│   │   ├── User.php
│   │   ├── Product.php
│   │   ├── Category.php
│   │   ├── Enquiry.php
│   │   ├── Quotation.php
│   │   ├── Order.php
│   │   └── AuditLog.php
├── database/
│   ├── migrations/
│   │   └── 2026_01_01_000001_create_b2b_marketplace_tables.php
│   └── seeders/
│       └── DatabaseSeeder.php                      # Rich cloth & industrial seed data
├── resources/
│   ├── css/
│   │   └── app.css
│   ├── js/
│   │   ├── app.js                                  # Vue 3 createApp & component registration
│   │   └── components/
│   │       ├── SearchAutocomplete.vue              # Real-time search suggestions with cloth focus
│   │       ├── RfqModal.vue                        # Buy requirement RFQ dispatcher
│   │       ├── QuotationComparison.vue             # Side-by-side quote evaluation
│   │       └── ImpersonationBanner.vue             # Admin session switcher banner
│   └── views/
│       ├── layouts/
│       │   └── app.blade.php                       # Master Blade layout with Vite & Vue mount
│       ├── home.blade.php                          # Homepage with Cloth & Textile Pavilion
│       ├── products/
│       │   ├── index.blade.php                     # Filterable catalogue
│       │   └── show.blade.php                      # Product details & RFQ form
│       ├── admin/
│       │   └── dashboard.blade.php                 # Super Admin & User Governance
│       ├── manufacturer/
│       │   └── dashboard.blade.php                 # Mill Workspace & Quotation Generator
│       └── retailer/
│           └── dashboard.blade.php                 # Retailer Purchase Orders & RFQ Tracker
├── routes/
│   └── web.php
├── composer.json
├── package.json
└── vite.config.js                                  # Laravel Vite plugin + @vitejs/plugin-vue
```

---

## 3. Installation & Setup

### Prerequisites
- PHP 8.2 or 8.3
- Composer
- Node.js (v18+) & NPM
- MySQL 8.0+

### Step-by-Step Instructions

1. **Clone & Setup Environment:**
   ```bash
   cp .env.example .env
   # Configure DB_DATABASE, DB_USERNAME, DB_PASSWORD in .env
   ```

2. **Install PHP Dependencies:**
   ```bash
   composer install
   ```

3. **Generate Application Key:**
   ```bash
   php artisan key:generate
   ```

4. **Run Database Migrations & Seeders:**
   ```bash
   php artisan migrate --seed
   ```
   *Seeds cloth mills (Surat TexFab Mills, Tirupur Knitwear, Jaipur Royal Prints, Vardhman Spinning) and sample RFQs & quotations.*

5. **Install Node Packages & Start Vite Dev Server:**
   ```bash
   npm install
   npm run dev
   ```

6. **Start Laravel Server:**
   ```bash
   php artisan serve
   ```
   *Access the application at `http://127.0.0.1:8000`.*

---

## 4. Key Functional Workflows

1. **Cloth & Fabric Wholesale Focus:**
   - Pre-populated with 100% Combed Cotton Single Jersey (180 GSM), Surat Banarasi Silk Sarees, Indigo Denim Twill (12.5 Oz), Sanganeri Block Prints, and Combed Weaving Yarn.
2. **Instant Search Suggestions:**
   - Real-time product previews in `SearchAutocomplete.vue` matching by keyword, sub-sector, or mill city.
3. **Admin "Login-As" Impersonation:**
   - Super admins can enter any user's session with a mandatory reason in `ImpersonationController.php`. A persistent `ImpersonationBanner.vue` displays on every page with one-click restoration.
4. **Quotation & Order Pipeline:**
   - Retailers request RFQs $\rightarrow$ Manufacturers create itemized quotes with automatic GST $\rightarrow$ Retailer accepts quote $\rightarrow$ System automatically issues formal Purchase Order (PO).
