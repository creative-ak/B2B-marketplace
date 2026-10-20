import React, { useState } from 'react';
import { X, Code2, FileCode, Check, Copy, ExternalLink, Layers, Database, Sparkles, FolderTree, Play, Terminal, Eye, BookOpen, Shirt, Plus, RotateCcw, Download } from 'lucide-react';
import { SearchAutocomplete } from '../common/SearchAutocomplete';

interface LaravelInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LARAVEL_FILES: Record<string, { lang: string; description: string; code: string }> = {
  'resources/views/welcome.blade.php': {
    lang: 'html',
    description: 'Exact Blade template with @vite and <my-component> mounted inside <div id="app">',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laravel Blade with Vue - BharatTrade B2B</title>

    <!-- Vite ke zariye assets load karein -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-slate-50 text-slate-900 font-sans p-6">

    <!-- Sabse Important: Yeh ID aapke app.js ke .mount('#app') se match honi chahiye -->
    <div id="app" class="max-w-4xl mx-auto space-y-6">

        <!-- 1. Yeh content Laravel Blade SSR se aa raha hai -->
        <div class="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
            <h1 class="text-2xl font-extrabold text-slate-900">
                Yeh content Laravel Blade se aa raha hai
            </h1>
            <p class="text-xs text-slate-600 mt-2">
                Server-side rendered (SSR) Blade template. Yahan Blade direct data output kar raha hai: 
                <strong>{{ config('app.name', 'BharatTrade B2B Marketplace') }}</strong>
            </p>
        </div>

        <!-- 2. Aapka internal Vue template component yahan render hoga -->
        <my-component></my-component>

        <!-- 3. Real B2B Marketplace Vue 3 Search & Cloth Suggestions Component in Blade -->
        <div class="p-6 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
            <h2 class="text-base font-bold text-slate-900">
                Live B2B Product Search & Cloth Suggestions (Vue 3 Component):
            </h2>
            <p class="text-xs text-slate-500">
                Search fabrics, Surat sarees, denim twill, knitwear with real-time suggestions:
            </p>

            <!-- Embedded Vue 3 Search Autocomplete Component -->
            <search-autocomplete
                placeholder="Search cotton fabrics, sarees, yarn, garments..."
                :popular-searches="{{ json_encode($popularClothSearches ?? []) }}"
            ></search-autocomplete>
        </div>

    </div>

</body>
</html>`
  },
  'resources/views/layouts/app.blade.php': {
    lang: 'html',
    description: 'Master B2B Marketplace Blade Layout with Admin Impersonation & Vue 3 Mounting',
    code: `<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>BharatTrade - @yield('title', 'B2B Marketplace')</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-slate-50 text-slate-900 font-sans">
    <div id="app" class="min-h-screen flex flex-col">
        <!-- Vue 3 Impersonation Banner Component (Active when Admin logs in as User) -->
        @if(session()->has('admin_impersonator_id'))
            <impersonation-banner 
                :active="true"
                admin-name="{{ session('admin_impersonator_name') }}"
                target-name="{{ auth()->user()->name }}"
                restore-url="{{ route('admin.impersonate.restore') }}"
                csrf-token="{{ csrf_token() }}"
            ></impersonation-banner>
        @endif

        <!-- Blade Navigation Header with Embedded Vue 3 Search Autocomplete -->
        <header class="bg-white border-b border-slate-200 sticky top-0 z-40">
            <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-6">
                <a href="{{ route('home') }}" class="font-extrabold text-xl text-slate-900">BharatTrade</a>

                <!-- Reactive Vue 3 Search Autocomplete Component -->
                <div class="flex-1 max-w-xl">
                    <search-autocomplete 
                        initial-query="{{ request('search') }}"
                        :products-data="{{ json_encode($popularSearchProducts ?? []) }}"
                    ></search-autocomplete>
                </div>

                <nav class="flex items-center gap-4 text-xs font-medium">
                    <a href="{{ route('products.index') }}">Products</a>
                    <a href="{{ route('categories.index') }}">Categories</a>
                    @auth
                        <a href="{{ route('dashboard') }}">Dashboard ({{ auth()->user()->role }})</a>
                    @else
                        <a href="{{ route('login') }}" class="text-teal-700 font-bold">Sign In</a>
                    @endauth
                </nav>
            </div>
        </header>

        <main class="flex-1">
            @yield('content')
        </main>
    </div>
</body>
</html>`
  },
  'resources/js/app.js': {
    lang: 'javascript',
    description: 'Vue 3 initialization registering SFCs globally on the Blade layout',
    code: `import './bootstrap';
import { createApp } from 'vue';

// Import Vue 3 Hybrid Components
import MyComponent from './components/MyComponent.vue';
import SearchAutocomplete from './components/SearchAutocomplete.vue';
import RfqModal from './components/RfqModal.vue';
import QuotationComparison from './components/QuotationComparison.vue';
import ImpersonationBanner from './components/ImpersonationBanner.vue';

// Initialize Vue 3 App with Hybrid Mount over Laravel Blade
const app = createApp({});

// Register Global Vue 3 Components for use within Blade views
app.component('my-component', MyComponent);
app.component('search-autocomplete', SearchAutocomplete);
app.component('rfq-modal', RfqModal);
app.component('quotation-comparison', QuotationComparison);
app.component('impersonation-banner', ImpersonationBanner);

// Sabse Important: Yeh ID aapke Blade template ke <div id="app"> se match honi chahiye
app.mount('#app');`
  },
  'resources/js/components/MyComponent.vue': {
    lang: 'vue',
    description: 'Vue 3 Single File Component (my-component) demonstrating reactive counter',
    code: `<template>
  <div class="p-6 bg-teal-50 border-2 border-teal-500 rounded-xl my-4 text-slate-900 shadow-sm">
    <div class="flex items-center gap-2 text-teal-800 font-bold text-sm uppercase tracking-wide">
      <span class="w-3 h-3 rounded-full bg-teal-600 animate-pulse"></span>
      <span>Yeh component Vue 3 (resources/js/components/MyComponent.vue) se render ho raha hai!</span>
    </div>

    <p class="text-xs text-slate-700 mt-2 leading-relaxed">
      Aapka Laravel Blade template server-side HTML render karta hai, aur Vite ke zariye Vue 3 component 
      <code class="bg-white px-2 py-0.5 rounded border border-teal-300 font-mono text-teal-900">&lt;my-component&gt;&lt;/my-component&gt;</code> 
      ke taur par reactive ho jata hai.
    </p>

    <!-- Reactive Counter Demo -->
    <div class="mt-4 pt-3 border-t border-teal-200 flex flex-wrap items-center gap-4">
      <div class="text-xs font-semibold text-slate-800">
        Vue 3 Reactive State Counter: <span class="text-base font-mono font-bold text-teal-900">{{ count }}</span>
      </div>
      <button 
        @click="count++" 
        class="px-3 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded text-xs font-semibold shadow-xs cursor-pointer"
      >
        Click to Increment (+1)
      </button>
      <button 
        @click="count = 0" 
        class="px-3 py-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded text-xs cursor-pointer"
      >
        Reset
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const count = ref(0);
</script>`
  },
  'resources/js/components/SearchAutocomplete.vue': {
    lang: 'vue',
    description: 'Vue 3 SFC with instant search suggestions & cloth industry focus',
    code: `<template>
  <div class="relative w-full" ref="containerRef">
    <form @submit.prevent="handleSubmit" class="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-xs">
      <input
        type="text"
        v-model="query"
        @focus="isOpen = true"
        placeholder="Search fabrics, cotton yarn, sarees, machinery..."
        class="w-full px-3 py-2 text-xs outline-none text-slate-900"
      />
      <button type="submit" class="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 text-xs font-semibold">
        Search
      </button>
    </form>

    <!-- Real-Time Suggestions Dropdown -->
    <div v-if="isOpen" class="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 p-3 max-h-96 overflow-y-auto">
      <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
        Product Suggestions (Focus: Cloth & Textile)
      </div>

      <div 
        v-for="product in matchingProducts" 
        :key="product.id" 
        @click="selectProduct(product)" 
        class="p-2 hover:bg-slate-50 rounded-lg flex items-center gap-3 cursor-pointer transition-colors"
      >
        <img :src="product.images[0]" class="w-10 h-10 object-cover rounded border border-slate-200" />
        <div class="flex-1 min-w-0 text-xs">
          <div class="font-bold text-slate-900 truncate">{{ product.name }}</div>
          <div class="text-[11px] text-slate-500">{{ product.manufacturerName }} · MOQ: {{ product.moq }} {{ product.unit }}</div>
        </div>
        <div class="text-right text-xs font-mono font-bold text-teal-800">
          ₹{{ Number(product.basePrice).toLocaleString('en-IN') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  initialQuery: { type: String, default: '' },
  productsData: { type: Array, default: () => [] }
});

const query = ref(props.initialQuery);
const isOpen = ref(false);

const matchingProducts = computed(() => {
  const q = query.value.toLowerCase().trim();
  if (!q) return props.productsData.slice(0, 5);
  return props.productsData.filter(p => 
    p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
  ).slice(0, 6);
});

const selectProduct = (p) => {
  window.location.href = '/products/' + (p.slug || p.id);
};

const handleSubmit = () => {
  window.location.href = '/products?search=' + encodeURIComponent(query.value);
};
</script>`
  },
  'vite.config.js': {
    lang: 'javascript',
    description: 'Vite configuration bundling Vue 3 SFCs and Blade asset directives',
    code: `import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
    ],
    resolve: {
        alias: {
            vue: 'vue/dist/vue.esm-bundler.js',
            '@': '/resources/js',
        },
    },
});`
  },
  'routes/web.php': {
    lang: 'php',
    description: 'Laravel Web Routes connecting Blade views with Vue components',
    code: `<?php

use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\ProductController;
use App\\Http\\Controllers\\EnquiryController;
use App\\Http\\Controllers\\Admin\\ImpersonationController;

// 1. Exact Hybrid Demo Blade View
Route::get('/hybrid-demo', function () {
    return view('welcome');
})->name('hybrid.demo');

// 2. Public Marketplace Routes
Route::get('/', [ProductController::class, 'home'])->name('home');
Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{product:slug}', [ProductController::class, 'show'])->name('products.show');

// 3. Admin Impersonation Routes (RBAC Protected)
Route::middleware(['auth', 'can:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::post('/impersonate/{user}', [ImpersonationController::class, 'impersonate'])->name('impersonate');
    Route::post('/impersonate/restore', [ImpersonationController::class, 'restore'])->name('impersonate.restore');
});`
  },
  'database/seeders/DatabaseSeeder.php': {
    lang: 'php',
    description: 'Database seeder focused on Surat Silk, Tirupur Knitwear, and Jaipur Cotton',
    code: `<?php

namespace Database\\Seeders;

use Illuminate\\Database\\Seeder;
use App\\Models\\User;
use App\\Models\\Product;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Surat Silk Mills
        $suratMill = User::create([
            'name' => 'Dharmesh Kapadia',
            'email' => 'sales@surattexfab.com',
            'role' => 'manufacturer',
            'business_name' => 'Surat TexFab Mills Pvt. Ltd.',
            'city' => 'Surat',
            'state' => 'Gujarat',
            'gstin' => '24AAACS7890D1Z4',
            'verification_status' => 'verified',
        ]);

        Product::create([
            'user_id' => $suratMill->id,
            'name' => 'Surat Banarasi Jacquard Silk Sarees Wholesale',
            'slug' => 'surat-banarasi-jacquard-silk-sarees',
            'category' => 'Textiles, Fabrics & Garments',
            'base_price' => 850.00,
            'moq' => 50,
            'unit' => 'Piece',
        ]);

        // 2. Seed Tirupur Knitwear
        $tirupur = User::create([
            'name' => 'Murugan Chettiar',
            'email' => 'exports@tirupurknitwear.in',
            'role' => 'manufacturer',
            'business_name' => 'Tirupur Knitwear & Garment Exports',
            'city' => 'Tirupur',
            'gstin' => '33AAACT4567P1Z1',
            'verification_status' => 'verified',
        ]);

        Product::create([
            'user_id' => $tirupur->id,
            'name' => 'Cotton Combed Single Jersey Fabric 180 GSM Bio-Washed',
            'slug' => 'cotton-combed-single-jersey-fabric-180-gsm',
            'category' => 'Textiles, Fabrics & Garments',
            'base_price' => 340.00,
            'moq' => 200,
            'unit' => 'Kg',
        ]);
    }
}`
  },
  'README.md': {
    lang: 'markdown',
    description: 'Instructions to run Laravel 11 + Vue 3 Hybrid with MySQL & Vite',
    code: `# Laravel 11 + Vue 3 Hybrid (Blade + Vue Components via Vite)

This project implements the requested hybrid architecture:
- Server-side rendered (SSR) Blade templates for blazing-fast SEO, routing, and access control.
- Vue 3 Composition API SFCs mounted onto \`<div id="app">\` via Vite.
- Instant search suggestions with cloth industry focus.

## Quick Start Commands

\`\`\`bash
# 1. Install PHP dependencies
composer install

# 2. Setup environment
cp .env.example .env
php artisan key:generate

# 3. Run database migrations & seeders (Cloth & Industrial data)
php artisan migrate --seed

# 4. Install Node dependencies (Vue 3, Vite, Tailwind CSS)
npm install

# 5. Start development servers
# Terminal 1:
php artisan serve

# Terminal 2:
npm run dev
\`\`\`

Access the hybrid template at: \`http://127.0.0.1:8000/hybrid-demo\`
`
  }
};

export const LaravelInspectorModal: React.FC<LaravelInspectorModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [selectedFile, setSelectedFile] = useState<string>('resources/views/welcome.blade.php');
  const [copied, setCopied] = useState(false);

  // Vue reactive counter demo state inside preview
  const [vueCounter, setVueCounter] = useState(0);

  if (!isOpen) return null;

  const currentFileData = LARAVEL_FILES[selectedFile] || LARAVEL_FILES['resources/views/welcome.blade.php'];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFileData.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-2xl max-w-5xl w-full overflow-hidden flex flex-col h-[88vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center font-bold">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">Laravel 11 Hybrid (Blade + Vue 3 via Vite)</h3>
                <span className="text-[10px] bg-red-500/20 text-red-300 font-mono px-2 py-0.5 rounded border border-red-500/30">
                  Laravel 11 + Vue 3 SFC
                </span>
                <span className="text-[10px] bg-teal-500/20 text-teal-300 font-mono px-2 py-0.5 rounded border border-teal-500/30">
                  Cloth Focused
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Exact structure: <code className="text-slate-200 font-mono">@vite(['resources/css/app.css', 'resources/js/app.js'])</code> & <code className="text-slate-200 font-mono">&lt;div id="app"&gt;</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="bg-slate-800 p-0.5 rounded-lg border border-slate-700 flex items-center text-xs">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'preview' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Hybrid Preview</span>
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'code' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Source Files ({Object.keys(LARAVEL_FILES).length})</span>
              </button>
            </div>

            {/* Download Project ZIP Button */}
            <a
              href="/bharattrade-b2b-marketplace-laravel.zip"
              download="bharattrade-b2b-marketplace-laravel.zip"
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              title="Download complete Laravel 11 project with MySQL migrations, seeders, and setup README in ZIP"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download Project ZIP</span>
              <span className="sm:hidden">ZIP</span>
            </a>

            {activeTab === 'code' && (
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            )}

            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab 1: Live Hybrid Preview Sandbox */}
        {activeTab === 'preview' ? (
          <div className="flex-1 bg-slate-100 p-4 sm:p-6 overflow-y-auto text-slate-900">
            <div className="max-w-4xl mx-auto space-y-6">
              
              {/* Architecture Banner */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold">
                    @
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Blade Template: <span className="font-mono text-teal-700">resources/views/welcome.blade.php</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Vite Bundle loaded: <span className="font-mono text-slate-700">@vite(['resources/css/app.css', 'resources/js/app.js'])</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedFile('resources/views/welcome.blade.php');
                    setActiveTab('code');
                  }}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded cursor-pointer transition-colors"
                >
                  View Blade Source
                </button>
              </div>

              {/* Exact HTML Container matching user request */}
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 bg-slate-50 relative space-y-6">
                <div className="absolute -top-3 left-4 bg-slate-800 text-slate-200 text-[10px] font-mono px-2 py-0.5 rounded shadow-xs">
                  &lt;div id="app"&gt; (Mounted by Vue 3 in app.js)
                </div>

                {/* 1. Content rendered directly by Laravel Blade */}
                <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-teal-700 mb-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                    <span>1. Laravel Blade Server-Side Content</span>
                  </div>
                  <h1 className="text-2xl font-extrabold text-slate-900">
                    Yeh content Laravel Blade se aa raha hai
                  </h1>
                  <p className="text-xs text-slate-600 mt-2">
                    Yeh HTML server par Blade engine generate kar raha hai. Blade template ke andar aap normal PHP variables aur directives (<code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800">{"{{ config('app.name') }}"}</code>) use kar sakte hain.
                  </p>
                </div>

                {/* 2. Internal Vue template component <my-component></my-component> */}
                <div className="p-6 bg-teal-50 border-2 border-teal-500 rounded-xl text-slate-900 shadow-xs relative">
                  <div className="absolute -top-2.5 right-4 bg-teal-600 text-white text-[10px] font-mono px-2 py-0.5 rounded shadow-xs">
                    &lt;my-component&gt;&lt;/my-component&gt;
                  </div>

                  <div className="flex items-center gap-2 text-teal-800 font-bold text-sm uppercase tracking-wide">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse"></span>
                    <span>2. Yeh internal Vue component (resources/js/components/MyComponent.vue) se render ho raha hai!</span>
                  </div>

                  <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                    Blade template ke andar yeh custom HTML tag <code className="bg-white px-2 py-0.5 rounded border border-teal-300 font-mono text-teal-900">&lt;my-component&gt;&lt;/my-component&gt;</code> ke roop mein likha gaya hai. Vite ke runtime compiler se Vue 3 isey reactive component bana deta hai.
                  </p>

                  {/* Reactive Counter */}
                  <div className="mt-4 pt-3 border-t border-teal-200 flex flex-wrap items-center gap-4">
                    <div className="text-xs font-semibold text-slate-800">
                      Vue 3 Reactive State Counter: <span className="text-base font-mono font-bold text-teal-900">{vueCounter}</span>
                    </div>
                    <button 
                      onClick={() => setVueCounter(prev => prev + 1)} 
                      className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Click to Increment (+1)</span>
                    </button>
                    <button 
                      onClick={() => setVueCounter(0)} 
                      className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs cursor-pointer flex items-center gap-1 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>

                {/* 3. B2B Search Autocomplete Component with Cloth Focus */}
                <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3 relative">
                  <div className="absolute -top-2.5 right-4 bg-slate-800 text-white text-[10px] font-mono px-2 py-0.5 rounded shadow-xs">
                    &lt;search-autocomplete&gt;&lt;/search-autocomplete&gt;
                  </div>

                  <div className="flex items-center gap-2">
                    <Shirt className="w-4 h-4 text-teal-700" />
                    <h2 className="text-sm font-bold text-slate-900">
                      3. Live B2B Search & Cloth Suggestions (Vue 3 Component in Blade)
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500">
                    Test typing to see instant suggestions for Surat Sarees, Cotton Jersey 180 GSM, Indigo Denim, and Yarn:
                  </p>

                  <SearchAutocomplete className="w-full" />
                </div>

              </div>

            </div>
          </div>
        ) : (
          /* Tab 2: Code Explorer */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* File Explorer Sidebar */}
            <div className="w-full md:w-80 bg-slate-950/80 border-r border-slate-800 p-3 overflow-y-auto space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
                <FolderTree className="w-3.5 h-3.5 text-teal-400" />
                <span>Laravel Hybrid Source Files</span>
              </div>

              {Object.keys(LARAVEL_FILES).map((fileName) => (
                <button
                  key={fileName}
                  onClick={() => setSelectedFile(fileName)}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-mono transition-colors cursor-pointer flex flex-col ${
                    selectedFile === fileName
                      ? 'bg-teal-900/50 text-teal-300 border border-teal-600/40'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <FileCode className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                    <span className="truncate">{fileName}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-sans mt-0.5 line-clamp-1">
                    {LARAVEL_FILES[fileName].description}
                  </span>
                </button>
              ))}

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 px-2 space-y-2">
                <div className="font-semibold text-slate-300">Architecture Summary:</div>
                <p className="leading-relaxed text-[11px]">
                  1. Blade provides SSR markup for SEO and layout structure.<br/>
                  2. Vite bundles Vue 3 components into <code className="text-teal-300 font-mono">resources/js/app.js</code>.<br/>
                  3. Vue mounts on <code className="text-teal-300 font-mono">&lt;div id="app"&gt;</code> and hydrates interactive SFCs.
                </p>
              </div>
            </div>

            {/* Code Viewer */}
            <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-teal-400 font-semibold">{selectedFile}</span>
                  <span className="text-slate-500 text-[11px]">({currentFileData.lang})</span>
                </div>
                <span className="text-slate-400 text-[11px] truncate max-w-sm">{currentFileData.description}</span>
              </div>

              <pre className="flex-1 p-4 overflow-auto text-xs font-mono text-slate-300 leading-relaxed bg-slate-950/90 selection:bg-teal-500 selection:text-white">
                <code>{currentFileData.code}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
