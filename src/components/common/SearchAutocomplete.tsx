import React, { useState, useEffect, useRef } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Search, Sparkles, ArrowRight, Package, Tag, Building2, X } from 'lucide-react';
import { Product } from '../../types';

interface SearchAutocompleteProps {
  className?: string;
  isMobile?: boolean;
}

const POPULAR_CLOTH_SEARCHES = [
  { term: 'Cotton Jersey Fabric 180 GSM', category: 'Cotton Fabrics & Greige Cloth', tag: 'Cloth / Fabric' },
  { term: 'Surat Banarasi Silk Sarees', category: 'Surat Art Silk & Georgette Sarees', tag: 'Sarees / Ethnic' },
  { term: 'Indigo Denim Twill 12.5 Oz', category: 'Denim & Twill Fabrics', tag: 'Denim' },
  { term: 'Jaipur Block Print Cambric Cotton', category: 'Cotton Fabrics & Greige Cloth', tag: 'Pure Cotton' },
  { term: "Men's Combed Cotton Plain T-Shirts", category: 'Tirupur Knitwear & T-Shirts', tag: 'Garments' },
  { term: 'Anarkali Rayon Kurti Set', category: 'Kurtis & Ethnic Wear', tag: 'Ready Garments' },
  { term: '30s Combed Cotton Weaving Yarn', category: 'Cotton & Polyester Spun Yarn', tag: 'Yarn Spinning' },
  { term: 'CNC Milling Center', category: 'CNC Machining Centers', tag: 'Machinery' }
];

export const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({ className = '', isMobile = false }) => {
  const {
    products,
    categories,
    allUsers,
    filters,
    setFilters,
    setCurrentView,
    setSelectedProductId
  } = useMarketplace();

  const [query, setQuery] = useState(filters.searchQuery);
  const [selectedCategory, setSelectedCategory] = useState(filters.category || 'All');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync external filter changes
  useEffect(() => {
    setQuery(filters.searchQuery);
  }, [filters.searchQuery]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute product suggestions
  const productSuggestions = React.useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      // Prioritize cloth & textile products when empty
      return products
        .filter(p => p.status === 'published')
        .sort((a, b) => (b.category.includes('Textile') ? 1 : 0) - (a.category.includes('Textile') ? 1 : 0))
        .slice(0, 4);
    }

    return products.filter(p => {
      if (p.status !== 'published') return false;
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;

      const nameMatch = p.name.toLowerCase().includes(trimmed);
      const catMatch = p.category.toLowerCase().includes(trimmed);
      const subcatMatch = p.subcategory.toLowerCase().includes(trimmed);
      const mfgMatch = p.manufacturerName.toLowerCase().includes(trimmed);
      const skuMatch = p.sku.toLowerCase().includes(trimmed);

      return nameMatch || catMatch || subcatMatch || mfgMatch || skuMatch;
    }).slice(0, 5);
  }, [products, query, selectedCategory]);

  // Compute matching category/subcategory suggestions
  const categorySuggestions = React.useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    const matches: { title: string; category: string }[] = [];
    categories.forEach(cat => {
      if (cat.name.toLowerCase().includes(trimmed)) {
        matches.push({ title: cat.name, category: cat.name });
      }
      cat.subcategories.forEach(sub => {
        if (sub.toLowerCase().includes(trimmed)) {
          matches.push({ title: sub, category: cat.name });
        }
      });
    });
    return matches.slice(0, 3);
  }, [categories, query]);

  // Compute matching suppliers
  const supplierSuggestions = React.useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];
    return allUsers.filter(u =>
      u.role === 'manufacturer' &&
      (u.businessName.toLowerCase().includes(trimmed) || u.city.toLowerCase().includes(trimmed))
    ).slice(0, 2);
  }, [allUsers, query]);

  const totalMatchesCount = React.useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return products.length;
    return products.filter(p =>
      p.status === 'published' &&
      (p.name.toLowerCase().includes(trimmed) ||
       p.category.toLowerCase().includes(trimmed) ||
       p.subcategory.toLowerCase().includes(trimmed) ||
       p.manufacturerName.toLowerCase().includes(trimmed))
    ).length;
  }, [products, query]);

  const handleSelectProduct = (product: Product) => {
    setSelectedProductId(product.id);
    setCurrentView('product-detail');
    setIsOpen(false);
  };

  const handleSelectQuery = (searchTerm: string, categoryFilter?: string) => {
    setQuery(searchTerm);
    setFilters(prev => ({
      ...prev,
      searchQuery: searchTerm,
      category: categoryFilter || prev.category
    }));
    setCurrentView('products');
    setIsOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({
      ...prev,
      searchQuery: query,
      category: selectedCategory
    }));
    setCurrentView('products');
    setIsOpen(false);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, productSuggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0 && selectedIndex < productSuggestions.length) {
      e.preventDefault();
      handleSelectProduct(productSuggestions[selectedIndex]);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form
        onSubmit={handleSearchSubmit}
        className="flex items-center border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-teal-600 focus-within:border-transparent transition-all bg-white"
      >
        {!isMobile && (
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setFilters(prev => ({ ...prev, category: e.target.value }));
            }}
            className="bg-slate-50 text-slate-700 text-xs font-medium px-3 py-2.5 border-r border-slate-300 outline-hidden cursor-pointer shrink-0 max-w-[170px] truncate"
          >
            <option value="All">All Categories</option>
            <option value="Textiles, Fabrics & Garments">Textiles & Garments</option>
            <option value="Industrial Machinery & Equipment">Industrial Machinery</option>
            <option value="Electrical, Motors & Solar">Electrical & Solar</option>
            <option value="Packaging & Material Handling">Packaging</option>
            <option value="Chemical & Pharma Processing">Chemical & Pharma</option>
            <option value="Construction & Building Hardware">Construction</option>
          </select>
        )}

        <div className="relative flex-1 flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setSelectedIndex(-1);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={isMobile ? "Search cotton fabrics, sarees, machinery..." : "Search fabrics, cotton yarn, sarees, T-shirts, machinery, or suppliers..."}
            className="w-full px-3 py-2 text-xs text-slate-900 outline-hidden placeholder:text-slate-400"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setFilters(prev => ({ ...prev, searchQuery: '' }));
              }}
              className="p-1 mr-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          type="submit"
          className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2.5 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </form>

      {/* Autocomplete & Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden divide-y divide-slate-100 max-h-[480px] overflow-y-auto">
          {/* Section: Matching Products */}
          <div className="p-3">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 pb-2 flex items-center justify-between">
              <span>{query.trim() ? 'Product Suggestions' : 'Popular & Featured Cloth / Products'}</span>
              {query.trim() && (
                <span className="text-[10px] text-teal-700 font-mono font-medium">
                  {totalMatchesCount} matches
                </span>
              )}
            </div>

            {productSuggestions.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-500">
                No direct product matches for "{query}". Try checking category suggestions below.
              </div>
            ) : (
              <div className="space-y-1">
                {productSuggestions.map((prod, idx) => (
                  <div
                    key={prod.id}
                    onClick={() => handleSelectProduct(prod)}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                      selectedIndex === idx
                        ? 'bg-teal-50 text-teal-900'
                        : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="w-10 h-10 rounded-md bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-900 truncate flex items-center gap-1.5">
                        <span className="truncate">{prod.name}</span>
                        {prod.category.includes('Textile') && (
                          <span className="text-[9px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.2 rounded shrink-0">
                            Cloth
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="truncate">{prod.manufacturerName} ({prod.manufacturerCity.split(',')[0]})</span>
                        <span>·</span>
                        <span className="font-mono text-slate-600 font-medium">MOQ: {prod.moq} {prod.unit}s</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-teal-900 font-mono">
                        ₹{prod.basePrice.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-slate-400 font-sans">/ {prod.unit}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Category & Subcategory suggestions if searching */}
          {categorySuggestions.length > 0 && (
            <div className="p-3 bg-slate-50/70">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 pb-1.5 flex items-center gap-1">
                <Tag className="w-3 h-3 text-teal-600" />
                <span>Matching Categories & Verticals</span>
              </div>
              <div className="space-y-1">
                {categorySuggestions.map((cat, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectQuery(cat.title, cat.category)}
                    className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-white text-xs font-medium text-slate-700 hover:text-teal-900 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span>{cat.title} in <strong className="text-teal-800">{cat.category}</strong></span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section: Supplier Matches */}
          {supplierSuggestions.length > 0 && (
            <div className="p-3 bg-white">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 pb-1.5 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-teal-600" />
                <span>Verified Manufacturers</span>
              </div>
              <div className="space-y-1">
                {supplierSuggestions.map(sup => (
                  <button
                    key={sup.id}
                    onClick={() => handleSelectQuery(sup.businessName)}
                    className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-50 text-xs font-medium text-slate-800 flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{sup.businessName}</div>
                      <div className="text-[10px] text-slate-500">{sup.city}, {sup.state} · GSTIN: {sup.gstin}</div>
                    </div>
                    <span className="text-[11px] text-teal-700 font-semibold">View Products</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section: Trending Cloth & Textile Searches */}
          <div className="p-3 bg-slate-50">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 pb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Trending in Fabrics, Cloths & Industry</span>
            </div>
            <div className="flex flex-wrap gap-1.5 px-2">
              {POPULAR_CLOTH_SEARCHES.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectQuery(item.term)}
                  className="px-2.5 py-1 rounded bg-white border border-slate-200 text-xs text-slate-700 hover:border-teal-600 hover:text-teal-900 transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <span>{item.term}</span>
                  <span className="text-[9px] text-slate-400 font-mono">({item.tag})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Action: View all search results */}
          {query.trim() && (
            <div className="p-2.5 bg-white text-center">
              <button
                onClick={handleSearchSubmit}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>View all {totalMatchesCount} results for "{query}"</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
