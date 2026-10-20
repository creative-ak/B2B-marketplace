<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'BharatTrade') }} - @yield('title', 'B2B Marketplace')</title>

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">

    <!-- Vite Assets (CSS & Vue 3 Hybrid Runtime) -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-slate-50 text-slate-900 font-sans antialiased">
    <!-- Vue 3 Root Mount Wrapper for Hybrid Architecture -->
    <div id="app" class="min-h-screen flex flex-col">
        
        <!-- Vue 3 Impersonation Banner (Reactive Session Switcher) -->
        @if(session()->has('admin_impersonator_id'))
            <impersonation-banner 
                :active="true"
                admin-name="{{ session('admin_impersonator_name', 'Administrator') }}"
                target-name="{{ auth()->user()->name }}"
                target-role="{{ auth()->user()->role }}"
                reason="{{ session('impersonation_reason', 'Support verification') }}"
                restore-url="{{ route('admin.impersonate.restore') }}"
                csrf-token="{{ csrf_token() }}"
            ></impersonation-banner>
        @endif

        <!-- Blade Header -->
        <header class="bg-white border-b border-slate-200 sticky top-0 z-40">
            <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-6">
                <!-- Brand Wordmark -->
                <a href="{{ route('home') }}" class="flex items-center gap-2 text-left shrink-0">
                    <div class="w-9 h-9 bg-teal-700 text-white flex items-center justify-center rounded font-bold text-lg">
                        BT
                    </div>
                    <div>
                        <span class="text-xl font-extrabold tracking-tight text-slate-900 block leading-tight">
                            BharatTrade
                        </span>
                        <span class="text-[10px] text-teal-700 tracking-wide font-semibold uppercase block">
                            B2B Marketplace
                        </span>
                    </div>
                </a>

                <!-- Embedded Vue 3 Search Autocomplete with Cloth & Product Suggestions -->
                <div class="hidden md:block flex-1 max-w-xl">
                    <search-autocomplete 
                        initial-query="{{ request('search') }}"
                        :products-data="{{ json_encode($popularSearchProducts ?? []) }}"
                    ></search-autocomplete>
                </div>

                <!-- Navigation Links -->
                <nav class="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-600">
                    <a href="{{ route('products.index') }}" class="hover:text-slate-900 transition-colors">Products & Suppliers</a>
                    <a href="{{ route('categories.index') }}" class="hover:text-slate-900 transition-colors">Textiles & Categories</a>
                </nav>

                <!-- Auth & Dashboard Actions -->
                <div class="flex items-center gap-3 shrink-0">
                    @auth
                        @if(auth()->user()->isAdmin())
                            <a href="{{ route('admin.dashboard') }}" class="px-3.5 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg">
                                Admin Console
                            </a>
                        @elseif(auth()->user()->isManufacturer())
                            <a href="{{ route('manufacturer.dashboard') }}" class="px-3.5 py-2 bg-teal-700 text-white text-xs font-semibold rounded-lg">
                                Mill Workspace
                            </a>
                        @else
                            <a href="{{ route('retailer.dashboard') }}" class="px-3.5 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-lg">
                                Buyer Dashboard
                            </a>
                        @endif
                    @else
                        <a href="{{ route('login') }}" class="text-xs font-semibold text-slate-700 hover:text-slate-900">Sign In</a>
                        <a href="{{ route('register') }}" class="px-3.5 py-2 bg-teal-700 text-white text-xs font-semibold rounded-lg">
                            Register Business
                        </a>
                    @endauth
                </div>
            </div>

            <!-- Mobile Search Bar (Vue Component) -->
            <div class="md:hidden px-4 pb-3">
                <search-autocomplete :is-mobile="true"></search-autocomplete>
            </div>
        </header>

        <!-- Main Page Content from Blade -->
        <main class="flex-1">
            @yield('content')
        </main>

        <!-- Blade Footer -->
        <footer class="bg-slate-900 text-slate-300 py-10 border-t border-slate-800 text-xs">
            <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p>© {{ date('Y') }} BharatTrade B2B Marketplace. Hybrid Laravel 11 Blade + Vue 3 Architecture.</p>
                <div class="flex items-center gap-4 text-slate-400">
                    <span>Surat Silk Hub</span>
                    <span>·</span>
                    <span>Tirupur Knitwear</span>
                    <span>·</span>
                    <span>GSTIN Audits</span>
                </div>
            </div>
        </footer>

    </div>
</body>
</html>
