import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { X, Building2, ShieldCheck, Factory, ShoppingBag } from 'lucide-react';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { registerUser, setCurrentView } = useMarketplace();

  const [role, setRole] = useState<UserRole>('manufacturer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [gstin, setGstin] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [turnover, setTurnover] = useState('₹10 - 25 Cr');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !businessName || !email) return;

    registerUser({
      name,
      email,
      phone: phone || '+91 98200 00000',
      role,
      businessName,
      businessType: role === 'manufacturer' ? 'Manufacturer' : 'Retailer',
      city: city || 'Pune',
      state,
      gstin: gstin || '27AABCA9999F1Z0',
      panNumber: panNumber || 'AABCA9999F',
      annualTurnover: turnover,
      employeeCount: '50 - 100 Employees',
      yearEstablished: 2020
    });

    onClose();
    setCurrentView('dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Register Enterprise Account</h3>
            <p className="text-xs text-slate-500">Access verified B2B trading, direct RFQs & quotes</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
          <button
            type="button"
            onClick={() => setRole('manufacturer')}
            className={`py-2 px-3 rounded-md flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
              role === 'manufacturer' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Factory className="w-4 h-4 text-teal-700" />
            <span>Manufacturer / Supplier</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('retailer')}
            className={`py-2 px-3 rounded-md flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
              role === 'retailer' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-emerald-700" />
            <span>Retailer / Wholesale Buyer</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">Company / Legal Entity Name *</label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Swastik Precision Tools Ltd."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-800 mb-1">Authorized Contact Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Amit Verma"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">Official Business Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@swastiktools.in"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-800 mb-1">Mobile / Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98220 12345"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">GSTIN Number (15 Digits)</label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
                placeholder="27AABCS1234M1Z2"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden font-mono uppercase"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-800 mb-1">PAN Number</label>
              <input
                type="text"
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                placeholder="AABCS1234M"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden font-mono uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">Operating City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Pune, Ahmedabad, Surat"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-800 mb-1">State</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden bg-white"
              >
                <option value="Maharashtra">Maharashtra</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Delhi">Delhi</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Haryana">Haryana</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg cursor-pointer shadow-xs"
            >
              Complete Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
