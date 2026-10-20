@extends('layouts.app')

@section('title', 'Surat Silk Mills, Tirupur Knitwear & B2B Machinery')

@section('content')
<div class="space-y-12 pb-16">
    <!-- Hero Section -->
    <section class="bg-slate-900 text-white py-14 px-4">
        <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div class="lg:col-span-7 space-y-6">
                <span class="inline-block text-xs font-semibold uppercase tracking-wider text-teal-400 bg-teal-950/70 border border-teal-800 px-3 py-1 rounded">
                    India's Verified B2B Textile & Industrial Marketplace
                </span>
                <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                    Source Direct from Surat Silk Mills & Tirupur Knitwear Exporters
                </h1>
                <p class="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                    Access over 4,280+ wholesale fabrics, combed cotton jersey, Banarasi sarees, and heavy denim at direct mill rates.
                </p>
                <div class="grid grid-cols-3 gap-4 border-t border-slate-800 pt-4 text-xs">
                    <div><span class="font-bold text-white text-lg block font-mono">4,280+</span> Fabric Lots</div>
                    <div><span class="font-bold text-white text-lg block font-mono">100%</span> GSTIN Audited</div>
                    <div><span class="font-bold text-white text-lg block font-mono">₹480 Cr+</span> Quarterly RFQs</div>
                </div>
            </div>

            <!-- Embedded Vue 3 RFQ Modal Box directly mounted in Blade -->
            <div class="lg:col-span-5 bg-white text-slate-900 rounded-xl shadow-2xl p-6 border border-slate-200">
                <h2 class="text-base font-bold text-slate-900">Post Immediate Cloth / Equipment Requirement</h2>
                <p class="text-xs text-slate-500 mb-4">Receive competitive quotations from verified suppliers.</p>
                
                <rfq-modal 
                    :show-trigger-button="false"
                    csrf-token="{{ csrf_token() }}"
                    submit-url="{{ route('enquiries.store') }}"
                ></rfq-modal>
            </div>
        </div>
    </section>

    <!-- Cloth & Textile Spotlight Section in Blade -->
    <section class="max-w-7xl mx-auto px-4">
        <div class="flex items-end justify-between mb-6">
            <div>
                <span class="text-xs font-bold text-teal-700 uppercase tracking-wider">Featured Textile Mill Listings</span>
                <h2 class="text-2xl font-bold text-slate-900 mt-1">Wholesale Fabrics, Silk Sarees & Knitwear</h2>
            </div>
            <a href="{{ route('products.index', ['category' => 'Textiles, Fabrics & Garments']) }}" class="text-xs font-semibold text-teal-700 hover:text-teal-800">
                View All Fabrics →
            </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            @foreach($clothProducts ?? [] as $product)
                <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
                    <div>
                        <div class="h-44 bg-slate-100 overflow-hidden relative">
                            <img src="{{ $product->images[0] ?? '' }}" alt="{{ $product->name }}" class="w-full h-full object-cover" />
                            <span class="absolute top-2 left-2 bg-white/95 text-slate-900 text-[10px] font-semibold px-2 py-0.5 rounded shadow-xs">
                                {{ $product->manufacturer->city ?? 'Surat' }}
                            </span>
                        </div>
                        <div class="p-4">
                            <span class="text-[10px] font-semibold text-teal-700 uppercase tracking-wide block">{{ $product->subcategory }}</span>
                            <a href="{{ route('products.show', $product->slug) }}" class="font-bold text-slate-900 text-sm mt-1 hover:text-teal-700 block line-clamp-2">
                                {{ $product->name }}
                            </a>
                            <div class="mt-3 flex items-baseline justify-between">
                                <span class="font-bold text-base text-slate-900 font-mono">₹{{ number_format($product->base_price) }} / {{ $product->unit }}</span>
                                <span class="text-xs text-slate-500 font-mono">MOQ: {{ $product->moq }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="p-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                        <a href="{{ route('products.show', $product->slug) }}" class="w-full py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-lg text-center">
                            Get Best Price
                        </a>
                    </div>
                </div>
            @endforeach
        </div>
    </section>
</div>
@endsection
