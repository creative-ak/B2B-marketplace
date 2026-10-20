import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  ShieldCheck,
  Search,
  ArrowRight,
  TrendingUp,
  Award,
  Factory,
  ChevronRight,
  Send,
  Building,
  CheckCircle2,
  FileSpreadsheet,
  Users,
  Shirt,
  Sparkles,
  Scissors,
  Layers
} from 'lucide-react';
import { VerificationBadge } from '../common/Badge';

export const HomePage: React.FC = () => {
  const {
    categories,
    products,
    allUsers,
    setCurrentView,
    setSelectedProductId,
    setFilters,
    openRfqModal
  } = useMarketplace();

  // Quick RFQ form states in Hero
  const [quickTitle, setQuickTitle] = useState('');
  const [quickQty, setQuickQty] = useState(200);
  const [quickUnit, setQuickUnit] = useState('Kg');

  // Cloth Filter Tab state in Pavilion
  const [clothFilterTab, setClothFilterTab] = useState<'all' | 'cotton' | 'sarees' | 'denim' | 'garments' | 'yarn'>('all');

  const publishedProducts = products.filter(p => p.status === 'published');
  
  // Specific cloth & textile products
  const clothProducts = publishedProducts.filter(p => p.category === 'Textiles, Fabrics & Garments');
  const filteredClothProducts = clothProducts.filter(p => {
    if (clothFilterTab === 'cotton') return p.name.includes('Cotton') || p.subcategory.includes('Cotton');
    if (clothFilterTab === 'sarees') return p.name.includes('Saree') || p.subcategory.includes('Saree');
    if (clothFilterTab === 'denim') return p.name.includes('Denim') || p.subcategory.includes('Denim');
    if (clothFilterTab === 'garments') return p.name.includes('T-Shirt') || p.name.includes('Kurti') || p.subcategory.includes('Knitwear') || p.subcategory.includes('Ethnic');
    if (clothFilterTab === 'yarn') return p.name.includes('Yarn') || p.subcategory.includes('Yarn');
    return true;
  });

  // Featured industrial products
  const industrialProducts = publishedProducts.filter(p => p.category !== 'Textiles, Fabrics & Garments').slice(0, 4);
  const manufacturers = allUsers.filter(u => u.role === 'manufacturer' && !u.isSuspended);

  const handleCategorySelect = (categoryName: string) => {
    setFilters(prev => ({ ...prev, category: categoryName, subcategory: 'All' }));
    setCurrentView('products');
  };

  const handleQuickRfqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    openRfqModal(undefined, undefined);
  };

  const viewProductDetails = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView('product-detail');
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section with Quick RFQ Requirement Widget */}
      <section className="relative bg-slate-900 text-white overflow-hidden py-14 px-4 sm:px-6">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Heading and Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-400 bg-teal-950/70 border border-teal-800/80 px-3 py-1 rounded">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>India's Verified B2B Textile & Industrial Marketplace</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Direct Sourcing from Surat Silk Mills, Tirupur Knitwear & Indian Manufacturers
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Source cotton fabrics, Surat Banarasi sarees, indigo denim, bio-washed knitwear, and industrial machinery directly at mill rates. Request itemized quotations, negotiate prices, and contract securely.
            </p>

            {/* Quick Metrics Strip */}
            <div className="pt-2 grid grid-cols-3 gap-4 border-t border-slate-800 text-left">
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-white">4,280+</div>
                <div className="text-xs text-slate-400">Fabrics & Cloth Lots</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-white">100%</div>
                <div className="text-xs text-slate-400">GSTIN Verified Mills</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-white">₹480 Cr+</div>
                <div className="text-xs text-slate-400">Quarterly RFQs</div>
              </div>
            </div>
          </div>

          {/* Right Column: Instant "Get Best Price" RFQ Requirement Box */}
          <div className="lg:col-span-5 bg-white text-slate-900 rounded-xl shadow-2xl p-6 border border-slate-200">
            <div className="border-b border-slate-100 pb-3 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block">
                Instant B2B RFQ Dispatch
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                Tell us your cloth or machinery requirement
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Receive itemized factory rates within 2 business hours.
              </p>
            </div>

            <form onSubmit={handleQuickRfqSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Product / Fabric / Machinery Required
                </label>
                <input
                  type="text"
                  required
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  placeholder="e.g. Cotton Jersey Fabric 180 GSM, Surat Silk Sarees, Denim Twill..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                />
                {/* Instant Quick Fill Cloth Suggestions */}
                <div className="flex flex-wrap items-center gap-1 mt-1.5">
                  <span className="text-[10px] text-slate-400 font-medium">Cloth suggestions:</span>
                  {[
                    'Cotton Jersey 180 GSM',
                    'Surat Banarasi Sarees',
                    'Indigo Denim Twill',
                    'Plain Combed T-Shirts'
                  ].map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setQuickTitle(s)}
                      className="text-[10px] bg-slate-100 hover:bg-teal-50 text-slate-600 hover:text-teal-900 border border-slate-200 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Quantity Required
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quickQty}
                    onChange={(e) => setQuickQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Unit
                  </label>
                  <select
                    value={quickUnit}
                    onChange={(e) => setQuickUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 outline-hidden bg-white"
                  >
                    <option value="Kg">Kg (Yarn / Knitted Fabric)</option>
                    <option value="Meter">Meter (Fabric Yardage)</option>
                    <option value="Piece">Piece (Sarees / T-Shirts)</option>
                    <option value="Set">Set (Kurti Sets / Machines)</option>
                    <option value="Metric Ton">Metric Ton</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer text-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>Request Factory Quotations</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>GSTIN verified suppliers · Pan-India delivery</span>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* CLOTH & TEXTILE SPOTLIGHT PAVILION */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-lg flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-300 bg-white/10 px-2.5 py-0.5 rounded">
              <Shirt className="w-3.5 h-3.5 text-teal-400" />
              <span>Textile & Cloth Wholesale Pavilion</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Sourcing Hub for Indian Fabrics, Sarees & Apparel
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Explore Surat Art Silk Sarees, Tirupur Bio-Washed Cotton Knits, 12.5 Oz Indigo Denim, Jaipur Sanganeri Block Prints, and Combed Ring-Spun Yarns.
            </p>
          </div>

          <button
            onClick={() => handleCategorySelect('Textiles, Fabrics & Garments')}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shrink-0 shadow-xs flex items-center gap-1.5"
          >
            <span>Explore All 4,280+ Fabrics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Cloth Category Sub-Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-200">
          <button
            onClick={() => setClothFilterTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
              clothFilterTab === 'all'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Cloths & Fabrics ({clothProducts.length})
          </button>
          <button
            onClick={() => setClothFilterTab('cotton')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
              clothFilterTab === 'cotton'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Cotton & Knitted Fabrics
          </button>
          <button
            onClick={() => setClothFilterTab('sarees')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
              clothFilterTab === 'sarees'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Surat Banarasi Sarees
          </button>
          <button
            onClick={() => setClothFilterTab('denim')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
              clothFilterTab === 'denim'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Indigo Denim & Twill
          </button>
          <button
            onClick={() => setClothFilterTab('garments')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
              clothFilterTab === 'garments'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            T-Shirts & Kurti Sets
          </button>
          <button
            onClick={() => setClothFilterTab('yarn')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
              clothFilterTab === 'yarn'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Cotton Spun Yarn
          </button>
        </div>

        {/* Cloth Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredClothProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between group"
            >
              <div>
                {/* Image */}
                <div
                  onClick={() => viewProductDetails(product.id)}
                  className="relative h-48 bg-slate-100 cursor-pointer overflow-hidden"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="bg-white/95 text-slate-900 text-[10px] font-semibold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>{product.manufacturerCity.split(',')[0]}</span>
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <span className="bg-teal-900/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded font-mono">
                      MOQ: {product.moq} {product.unit}s
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4">
                  <div className="text-[10px] font-semibold text-teal-700 uppercase tracking-wide">
                    {product.subcategory}
                  </div>
                  <h3
                    onClick={() => viewProductDetails(product.id)}
                    className="font-bold text-slate-900 text-sm mt-1 hover:text-teal-700 cursor-pointer line-clamp-2 leading-snug"
                  >
                    {product.name}
                  </h3>

                  {/* Pricing and MOQ */}
                  <div className="mt-3 flex items-baseline justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400">Wholesale Price</span>
                      <div className="text-base font-extrabold text-slate-900 font-mono">
                        ₹{product.basePrice.toLocaleString('en-IN')}{' '}
                        <span className="text-xs font-normal text-slate-500 font-sans">/ {product.unit}</span>
                      </div>
                    </div>
                    {product.priceTiers.length > 1 && (
                      <div className="text-right">
                        <span className="text-[10px] text-teal-700 font-medium block">Bulk Tier</span>
                        <span className="font-bold text-xs text-teal-800 font-mono">
                          ₹{product.priceTiers[product.priceTiers.length - 1].unitPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Key specs */}
                  <div className="mt-2.5 py-2 border-t border-slate-100 text-[11px] text-slate-600 space-y-0.5">
                    {product.specifications.slice(0, 2).map((s, i) => (
                      <div key={i} className="truncate">
                        <span className="text-slate-400">{s.key}:</span> {s.value}
                      </div>
                    ))}
                  </div>

                  {/* Manufacturer info */}
                  <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 truncate">
                    <span className="font-medium text-slate-800">{product.manufacturerName}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => openRfqModal(product)}
                  className="flex-1 py-1.5 px-3 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Get Best Rate</span>
                </button>
                <button
                  onClick={() => viewProductDetails(product.id)}
                  className="py-1.5 px-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Specs
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Industrial Categories Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 mb-8">
          <div>
            <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider block">
              Market Taxonomy
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              Browse Manufacturing & Trade Verticals
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('categories')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Sectors</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategorySelect(category.name)}
              className="group bg-white p-6 rounded-xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                    {category.name.includes('Textile') ? (
                      <Shirt className="w-5 h-5 text-teal-700" />
                    ) : (
                      <Factory className="w-5 h-5 text-teal-700" />
                    )}
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {category.productCount.toLocaleString()} listings
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base group-hover:text-teal-700 transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                  {category.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                {category.subcategories.slice(0, 3).map((sub, i) => (
                  <span key={i} className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Industrial Machinery */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 mb-8">
          <div>
            <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider block">
              Heavy Engineering
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              Industrial Machinery, Solar & Process Equipment
            </h2>
          </div>
          <button
            onClick={() => {
              setFilters(prev => ({ ...prev, category: 'All' }));
              setCurrentView('products');
            }}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Explore Entire Catalogue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {industrialProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div
                  onClick={() => viewProductDetails(product.id)}
                  className="relative h-40 bg-slate-100 cursor-pointer overflow-hidden group"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute top-2 left-2">
                    <span className="bg-white/95 text-slate-900 text-[10px] font-semibold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>{product.manufacturerCity.split(',')[0]}</span>
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="text-[10px] font-semibold text-teal-700 uppercase tracking-wide">
                    {product.subcategory || product.category}
                  </div>
                  <h3
                    onClick={() => viewProductDetails(product.id)}
                    className="font-bold text-slate-900 text-xs mt-1 hover:text-teal-700 cursor-pointer line-clamp-2"
                  >
                    {product.name}
                  </h3>

                  <div className="mt-3 flex items-baseline justify-between">
                    <div>
                      <div className="text-sm font-extrabold text-slate-900 font-mono">
                        ₹{product.basePrice.toLocaleString('en-IN')}{' '}
                        <span className="text-[10px] font-normal text-slate-500 font-sans">/ {product.unit}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-[11px] text-slate-700 font-mono">
                        MOQ: {product.moq}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => openRfqModal(product)}
                  className="flex-1 py-1.5 px-2.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>Get Quote</span>
                </button>
                <button
                  onClick={() => viewProductDetails(product.id)}
                  className="py-1.5 px-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Specs
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Verified Mills & Manufacturers Showcase */}
      <section className="bg-slate-100/70 py-12 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider block">
              Certified Mills & Factories
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              Top Audited Manufacturers in India
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Direct access to Surat Silk Mills, Tirupur Knitwear Exporters, Jaipur Hand-block artisans, and Pune Precision Machinery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {manufacturers.slice(0, 3).map((mfg) => (
              <div
                key={mfg.id}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-12 h-12 rounded-lg bg-teal-800 text-white flex items-center justify-center font-bold text-lg">
                      {mfg.businessName.substring(0, 2).toUpperCase()}
                    </div>
                    <VerificationBadge status={mfg.verificationStatus} />
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mt-4">{mfg.businessName}</h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {mfg.city}, {mfg.state} · Est. {mfg.yearEstablished}
                  </div>

                  <div className="mt-4 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Turnover:</span>
                      <span className="font-medium text-slate-800 font-mono">{mfg.annualTurnover}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Mill Capacity:</span>
                      <span className="font-medium text-slate-800">{mfg.employeeCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Trust Score:</span>
                      <span className="font-bold text-emerald-700 font-mono">{mfg.trustScore}/100</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setFilters(prev => ({ ...prev, searchQuery: mfg.businessName }));
                      setCurrentView('products');
                    }}
                    className="w-full py-2 border border-slate-300 hover:border-teal-600 text-slate-800 hover:text-teal-700 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>View Mill Catalog</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How BharatTrade Works */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider block">
            Transparent Sourcing
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            How Buyers & Mills Trade on BharatTrade
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            From fabric swatch enquiry to commercial quotations, lab test approvals, and formal purchase order dispatch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-mono font-bold text-sm mb-4">
              01
            </div>
            <h3 className="font-bold text-slate-900 text-base">Submit Requirement (RFQ)</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Specify fabric GSM, yarn count, saree designs, or machinery model with target volume and destination pin code.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-mono font-bold text-sm mb-4">
              02
            </div>
            <h3 className="font-bold text-slate-900 text-base">Compare Official Quotes</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Receive itemized commercial quotations with unit rates, GST calculation, logistics charges, and dispatch timelines.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-mono font-bold text-sm mb-4">
              03
            </div>
            <h3 className="font-bold text-slate-900 text-base">Confirm Purchase Order</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Negotiate price or dispatch terms directly. Accept quote to generate a formal Purchase Order and track production.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
