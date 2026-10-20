import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Factory, ArrowRight, ShieldCheck, Layers, ChevronRight } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const { categories, setFilters, setCurrentView } = useMarketplace();

  const handleSubcategorySelect = (categoryName: string, subcategoryName: string) => {
    setFilters(prev => ({
      ...prev,
      category: categoryName,
      subcategory: subcategoryName
    }));
    setCurrentView('products');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb & Title */}
      <div className="border-b border-slate-200 pb-4">
        <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-2">
          <button onClick={() => setCurrentView('home')} className="hover:text-slate-800 cursor-pointer">Home</button>
          <span>/</span>
          <span className="text-slate-900 font-medium">Industry Categories Taxonomy</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          Indian Manufacturing & B2B Industry Sectors
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Explore specialized industrial verticals, machinery types, and raw materials across audited manufacturing clusters.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                    <Factory className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-base">{category.name}</h2>
                    <span className="text-xs font-mono text-slate-400">
                      {category.productCount.toLocaleString()} products listed
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {category.description}
              </p>

              {/* Subcategories */}
              <div className="space-y-1.5 border-t border-slate-100 pt-3">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Sub-Sectors & Specialties
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {category.subcategories.map((sub, i) => (
                    <button
                      key={i}
                      onClick={() => handleSubcategorySelect(category.name, sub)}
                      className="text-left p-2 rounded-lg bg-slate-50 hover:bg-teal-50 hover:text-teal-800 text-xs text-slate-700 font-medium flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="truncate">{sub}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setFilters(prev => ({ ...prev, category: category.name, subcategory: 'All' }));
                  setCurrentView('products');
                }}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Browse All {category.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
