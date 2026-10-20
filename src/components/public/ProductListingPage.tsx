import React, { useMemo } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  Filter,
  Search,
  ShieldCheck,
  Send,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  Package,
  Layers
} from 'lucide-react';
import { VerificationBadge } from '../common/Badge';

export const ProductListingPage: React.FC = () => {
  const {
    products,
    categories,
    filters,
    setFilters,
    resetFilters,
    setSelectedProductId,
    setCurrentView,
    openRfqModal
  } = useMarketplace();

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Must be published for public view
      if (product.status !== 'published') return false;

      // Search Query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesCat = product.category.toLowerCase().includes(query);
        const matchesSubcat = product.subcategory.toLowerCase().includes(query);
        const matchesMfg = product.manufacturerName.toLowerCase().includes(query);
        const matchesSku = product.sku.toLowerCase().includes(query);
        if (!matchesName && !matchesCat && !matchesSubcat && !matchesMfg && !matchesSku) {
          return false;
        }
      }

      // Category
      if (filters.category && filters.category !== 'All' && product.category !== filters.category) {
        return false;
      }

      // Subcategory
      if (filters.subcategory && filters.subcategory !== 'All' && product.subcategory !== filters.subcategory) {
        return false;
      }

      // City
      if (filters.city && filters.city !== 'All' && !product.manufacturerCity.includes(filters.city)) {
        return false;
      }

      // Verified Only
      if (filters.verifiedOnly && !product.isVerifiedSupplier) {
        return false;
      }

      // Sample Available Only
      if (filters.sampleAvailableOnly && !product.sampleAvailable) {
        return false;
      }

      // Max MOQ
      if (filters.minMoq && product.moq > filters.minMoq) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price_low') return a.basePrice - b.basePrice;
      if (filters.sortBy === 'price_high') return b.basePrice - a.basePrice;
      if (filters.sortBy === 'moq_low') return a.moq - b.moq;
      if (filters.sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return b.viewsCount - a.viewsCount; // recommended default
    });
  }, [products, filters]);

  const handleProductClick = (id: string) => {
    setSelectedProductId(id);
    setCurrentView('product-detail');
  };

  const cities = ['All', 'Surat', 'Tirupur', 'Jaipur', 'Ludhiana', 'Pune', 'Ahmedabad', 'Bengaluru'];

  const selectedCategoryObj = categories.find(c => c.name === filters.category);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb & Search Header */}
      <div className="mb-6">
        <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-2">
          <button onClick={() => setCurrentView('home')} className="hover:text-slate-800 cursor-pointer">Home</button>
          <span>/</span>
          <span className="text-slate-900 font-medium">Product Catalogue & Suppliers</span>
          {filters.category !== 'All' && (
            <>
              <span>/</span>
              <span className="text-teal-700 font-semibold">{filters.category}</span>
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {filters.category !== 'All' ? filters.category : 'All Industrial Products & Machinery'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Showing <span className="font-semibold text-slate-800 font-mono">{filteredProducts.length}</span> verified product listings matching your criteria
            </p>
          </div>

          <button
            onClick={() => openRfqModal(undefined, filters.category !== 'All' ? filters.category : undefined)}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Post RFQ for this Category</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filter Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <SlidersHorizontal className="w-4 h-4 text-teal-700" />
                <span>Filters</span>
              </div>
              <button
                onClick={resetFilters}
                className="text-[11px] text-teal-700 hover:text-teal-900 font-medium flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Keyword Search inside filters */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Keyword or Model
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={filters.searchQuery}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                  placeholder="Filter by keyword..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-hidden text-slate-800"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Industry Category
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, category: 'All', subcategory: 'All' }))}
                  className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors cursor-pointer flex items-center justify-between ${
                    filters.category === 'All'
                      ? 'bg-teal-50 text-teal-900 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>All Categories</span>
                  <span className="font-mono text-[10px] text-slate-400">{products.length}</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFilters(prev => ({ ...prev, category: cat.name, subcategory: 'All' }))}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors cursor-pointer flex items-center justify-between ${
                      filters.category === cat.name
                        ? 'bg-teal-50 text-teal-900 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Subcategories (Especially useful for Textiles & Garments) */}
            {selectedCategoryObj && selectedCategoryObj.subcategories.length > 0 && (
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Sub-Sectors & Specialties
                </label>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, subcategory: 'All' }))}
                    className={`w-full text-left px-2 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                      filters.subcategory === 'All'
                        ? 'bg-slate-900 text-white font-medium'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    All Subcategories
                  </button>
                  {selectedCategoryObj.subcategories.map((sub, i) => (
                    <button
                      key={i}
                      onClick={() => setFilters(prev => ({ ...prev, subcategory: sub }))}
                      className={`w-full text-left px-2 py-1 rounded text-[11px] transition-colors cursor-pointer truncate ${
                        filters.subcategory === sub
                          ? 'bg-slate-900 text-white font-medium'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Supplier Location City */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Supplier Hub City
              </label>
              <div className="flex flex-wrap gap-1.5">
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => setFilters(prev => ({ ...prev, city }))}
                    className={`px-2.5 py-1 text-xs rounded border transition-colors cursor-pointer ${
                      filters.city === city
                        ? 'bg-slate-900 text-white border-slate-900 font-medium'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Verification & Sample Checkboxes */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.verifiedOnly}
                  onChange={(e) => setFilters(prev => ({ ...prev, verifiedOnly: e.target.checked }))}
                  className="w-4 h-4 text-teal-600 rounded cursor-pointer"
                />
                <span className="text-xs font-medium text-slate-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>GSTIN Verified Suppliers Only</span>
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.sampleAvailableOnly}
                  onChange={(e) => setFilters(prev => ({ ...prev, sampleAvailableOnly: e.target.checked }))}
                  className="w-4 h-4 text-teal-600 rounded cursor-pointer"
                />
                <span className="text-xs font-medium text-slate-700">
                  Sample Unit Available
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Product Grid */}
        <div className="lg:col-span-3 space-y-4">
          {/* Sorting toolbar */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="text-slate-600">
              Showing <strong>{filteredProducts.length}</strong> products
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Sort by:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                className="border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 outline-hidden bg-white cursor-pointer font-medium"
              >
                <option value="recommended">Recommended & Views</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="moq_low">Lowest Minimum Order (MOQ)</option>
                <option value="newest">Recently Added</option>
              </select>
            </div>
          </div>

          {/* Product Cards */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">No Matching Products Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try loosening your filters or search keywords, or submit a custom RFQ requirement so manufacturers can quote directly.
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Reset All Filters
                </button>
                <button
                  onClick={() => openRfqModal()}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Post Buy Requirement
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Image */}
                    <div
                      onClick={() => handleProductClick(product.id)}
                      className="relative h-44 bg-slate-100 cursor-pointer overflow-hidden group"
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
                          <span>{product.manufacturerCity}</span>
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="text-[10px] font-semibold text-teal-700 uppercase tracking-wide">
                        {product.subcategory || product.category}
                      </div>

                      <h3
                        onClick={() => handleProductClick(product.id)}
                        className="font-bold text-slate-900 text-sm mt-1 hover:text-teal-700 cursor-pointer line-clamp-2"
                      >
                        {product.name}
                      </h3>

                      {/* Pricing block */}
                      <div className="mt-3 flex items-baseline justify-between">
                        <div>
                          <div className="text-base font-extrabold text-slate-900 font-mono">
                            ₹{product.basePrice.toLocaleString('en-IN')}{' '}
                            <span className="text-xs font-normal text-slate-500 font-sans">/ {product.unit}</span>
                          </div>
                          {product.priceTiers.length > 1 && (
                            <div className="text-[10px] text-teal-700 font-medium">
                              Volume discounts up to ₹{product.priceTiers[product.priceTiers.length - 1].unitPrice.toLocaleString('en-IN')}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] text-slate-400 block">MOQ</span>
                          <span className="font-semibold text-xs text-slate-800 font-mono">
                            {product.moq} {product.unit}s
                          </span>
                        </div>
                      </div>

                      {/* Specifications snapshot */}
                      <div className="mt-3 py-2 border-t border-slate-100 grid grid-cols-2 gap-1 text-[11px] text-slate-600">
                        {product.specifications.slice(0, 2).map((s, i) => (
                          <div key={i} className="truncate">
                            <span className="text-slate-400">{s.key}:</span> {s.value}
                          </div>
                        ))}
                      </div>

                      {/* Supplier info */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                        <div className="truncate font-medium">{product.manufacturerName}</div>
                        <span className="text-[11px] text-emerald-700 font-mono shrink-0">
                          {product.leadTimeDays}d lead
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => openRfqModal(product)}
                      className="flex-1 py-1.5 px-3 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Get Best Price</span>
                    </button>
                    <button
                      onClick={() => handleProductClick(product.id)}
                      className="py-1.5 px-3 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
