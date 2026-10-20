<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laravel Blade with Vue 3 (BharatTrade B2B)</title>

    <!-- Vite ke zariye assets load karein -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-slate-50 text-slate-900 font-sans p-6">

    <!-- Sabse Important: Yeh ID aapke app.js ke .mount('#app') se match honi chahiye -->
    <div id="app" class="max-w-4xl mx-auto space-y-6">

        <!-- 1. Content rendered directly by Laravel Blade -->
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

        <!-- 3. Real B2B Marketplace Vue 3 Search & RFQ Component in Blade -->
        <div class="p-6 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
            <h2 class="text-base font-bold text-slate-900">
                Real B2B Marketplace Vue Component in Blade:
            </h2>
            <p class="text-xs text-slate-500">
                Search suggestions component with cloth & industrial data matching in real time:
            </p>

            <!-- Embedded Vue 3 Search Autocomplete Component -->
            <search-autocomplete></search-autocomplete>
        </div>

    </div>

</body>
</html>
