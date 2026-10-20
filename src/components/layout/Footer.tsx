import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { ShieldCheck, Building2, PhoneCall, Mail, MapPin, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, setFilters } = useMarketplace();

  const handleCategoryClick = (catName: string) => {
    setFilters(prev => ({ ...prev, category: catName, subcategory: 'All' }));
    setCurrentView('products');
  };

  const handleCityFilter = (city: string) => {
    setFilters(prev => ({ ...prev, city }));
    setCurrentView('products');
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Trust Strip */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-10 border-b border-slate-800">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded bg-slate-800 flex items-center justify-center text-teal-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Verified GSTIN Suppliers</h4>
              <p className="text-slate-400 text-xs mt-0.5">Strict compliance checks on PAN, GSTIN & manufacturing facilities.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded bg-slate-800 flex items-center justify-center text-teal-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Direct Manufacturer Rates</h4>
              <p className="text-slate-400 text-xs mt-0.5">Zero middlemen commissions. Negotiate commercial terms directly.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded bg-slate-800 flex items-center justify-center text-teal-400 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Pan-India Freight Logistics</h4>
              <p className="text-slate-400 text-xs mt-0.5">Direct integration with industrial transport hubs across all states.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded bg-slate-800 flex items-center justify-center text-teal-400 shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Enterprise Support</h4>
              <p className="text-slate-400 text-xs mt-0.5">Dedicated desk for high-volume RFQs, dispute resolution & audits.</p>
            </div>
          </div>
        </div>

        {/* Directory Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10">
          <div>
            <h5 className="font-semibold text-white uppercase tracking-wider mb-3 text-[11px]">Industrial Hubs</h5>
            <ul className="space-y-2">
              <li><button onClick={() => handleCityFilter('Pune')} className="hover:text-white transition-colors cursor-pointer">Manufacturers in Pune, MH</button></li>
              <li><button onClick={() => handleCityFilter('Ahmedabad')} className="hover:text-white transition-colors cursor-pointer">Engineering in Ahmedabad, GJ</button></li>
              <li><button onClick={() => handleCityFilter('Surat')} className="hover:text-white transition-colors cursor-pointer">Solar & Textiles in Surat, GJ</button></li>
              <li><button onClick={() => handleCityFilter('Coimbatore')} className="hover:text-white transition-colors cursor-pointer">Pumps & Motors in Coimbatore, TN</button></li>
              <li><button onClick={() => handleCityFilter('Bengaluru')} className="hover:text-white transition-colors cursor-pointer">Precision Tools in Bengaluru, KA</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white uppercase tracking-wider mb-3 text-[11px]">Key Categories</h5>
            <ul className="space-y-2">
              <li><button onClick={() => handleCategoryClick('Industrial Machinery & Equipment')} className="hover:text-white transition-colors cursor-pointer">CNC & Lathe Machines</button></li>
              <li><button onClick={() => handleCategoryClick('Electrical, Motors & Solar')} className="hover:text-white transition-colors cursor-pointer">Electric Motors & Solar Panels</button></li>
              <li><button onClick={() => handleCategoryClick('Chemical & Pharma Processing')} className="hover:text-white transition-colors cursor-pointer">SS Chemical Batch Reactors</button></li>
              <li><button onClick={() => handleCategoryClick('Packaging & Material Handling')} className="hover:text-white transition-colors cursor-pointer">Automatic Strapping & Conveyors</button></li>
              <li><button onClick={() => handleCategoryClick('Construction & Building Hardware')} className="hover:text-white transition-colors cursor-pointer">TMT Rebars & Hardware</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white uppercase tracking-wider mb-3 text-[11px]">For Businesses</h5>
            <ul className="space-y-2">
              <li><button onClick={() => setCurrentView('dashboard')} className="hover:text-white transition-colors cursor-pointer">Manufacturer Workspace</button></li>
              <li><button onClick={() => setCurrentView('dashboard')} className="hover:text-white transition-colors cursor-pointer">Retailer Enquiry Tracker</button></li>
              <li><button onClick={() => setCurrentView('dashboard')} className="hover:text-white transition-colors cursor-pointer">Admin Governance & Audit</button></li>
              <li><span className="text-slate-400">GSTIN Verification Policy</span></li>
              <li><span className="text-slate-400">Escrow & Payment Terms</span></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white uppercase tracking-wider mb-3 text-[11px]">Compliance & Support</h5>
            <div className="space-y-2 text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>Connaught Place, New Delhi - 110001</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>compliance@bharattrade.in</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>+91 11 4982 0000 (Toll Free)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
          <div>
            © {new Date().getFullYear()} BharatTrade B2B Marketplace Platform. Built strictly with enterprise RBAC, multi-party RFQs, and secure admin impersonation.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span>·</span>
            <span className="hover:text-slate-300 cursor-pointer">Security Audits</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
