import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  Search,
  Bell,
  Building2,
  ChevronDown,
  Layers,
  ShieldCheck,
  PlusCircle,
  RotateCcw,
  UserCheck,
  LayoutDashboard,
  Store,
  Shirt,
  Code2
} from 'lucide-react';
import { NotificationDrawer } from '../common/NotificationDrawer';
import { SearchAutocomplete } from '../common/SearchAutocomplete';
import { LaravelInspectorModal } from '../laravel/LaravelInspectorModal';

interface HeaderProps {
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAuth }) => {
  const {
    currentUser,
    allUsers,
    switchUser,
    currentView,
    setCurrentView,
    filters,
    setFilters,
    notifications,
    openRfqModal,
    resetAllToDemoData
  } = useMarketplace();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);
  const [isLaravelModalOpen, setIsLaravelModalOpen] = useState(false);
  const [searchCategory, setSearchCategory] = useState('All');
  const [searchInput, setSearchInput] = useState(filters.searchQuery);

  const unreadCount = notifications.filter(
    n => (n.recipientId === currentUser.id || currentUser.role === 'admin') && !n.isRead
  ).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({
      ...prev,
      searchQuery: searchInput,
      category: searchCategory
    }));
    setCurrentView('products');
  };

  return (
    <>
      {/* Top Utility Bar with Persona Switcher & Direct Demonstration Controls */}
      <div className="bg-slate-900 text-slate-300 text-xs border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-slate-400">
              India's Premier B2B Marketplace for Industrial Goods & Commercial Trade
            </span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% GSTIN Verified Suppliers</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Laravel Hybrid Code Inspector & Live Sandbox Button */}
            <button
              onClick={() => setIsLaravelModalOpen(true)}
              className="flex items-center gap-1.5 bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-500/40 px-3 py-1 rounded transition-colors cursor-pointer text-[11px] font-semibold shadow-xs"
              title="Test exact Blade + Vue 3 Hybrid template and inspect source code"
            >
              <Code2 className="w-3.5 h-3.5 text-red-400" />
              <span>Laravel Blade + Vue 3 (Live Sandbox & Code)</span>
            </button>

            {/* Quick Persona Switcher for Evaluation */}
            <div className="relative">
              <button
                onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1 rounded transition-colors cursor-pointer"
                title="Switch active user role for testing"
              >
                <UserCheck className="w-3.5 h-3.5 text-teal-400" />
                <span className="font-semibold text-[11px]">Role:</span>
                <span className="text-[11px] text-teal-300">{currentUser.name} ({currentUser.role})</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isPersonaMenuOpen && (
                <div className="absolute right-0 mt-1 w-72 bg-white text-slate-900 rounded-lg shadow-xl border border-slate-200 z-50 p-2">
                  <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Switch Test Persona
                  </div>
                  <div className="space-y-1">
                    {allUsers.map(user => (
                      <button
                        key={user.id}
                        onClick={() => {
                          switchUser(user.id);
                          setIsPersonaMenuOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded text-xs flex items-start justify-between cursor-pointer transition-colors ${
                          currentUser.id === user.id
                            ? 'bg-teal-50 text-teal-900 font-semibold'
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div>
                          <div>{user.name}</div>
                          <div className="text-[10px] text-slate-500 font-normal">{user.businessName}</div>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono uppercase ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : user.role === 'manufacturer'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {user.role}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 mt-2 pt-2 flex items-center justify-between">
                    <button
                      onClick={() => {
                        onOpenAuth();
                        setIsPersonaMenuOpen(false);
                      }}
                      className="text-xs text-teal-700 hover:text-teal-800 font-medium cursor-pointer"
                    >
                      + Register Business
                    </button>
                    <button
                      onClick={() => {
                        resetAllToDemoData();
                        setIsPersonaMenuOpen(false);
                      }}
                      className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                      title="Reset database to clean default state"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset Demo
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Top Navigation Header adhering to Top Bar Contract */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-6">
          {/* Zone 1: Single text wordmark */}
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 text-left cursor-pointer shrink-0"
          >
            <div className="w-9 h-9 bg-teal-700 text-white flex items-center justify-center rounded font-bold text-lg shadow-xs">
              BT
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 block leading-tight">
                BharatTrade
              </span>
              <span className="text-[10px] text-teal-700 tracking-wide font-semibold uppercase block">
                B2B Marketplace
              </span>
            </div>
          </button>

          {/* Inline Search Autocomplete with Product Suggestions */}
          <SearchAutocomplete className="hidden md:block flex-1 max-w-xl" />

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-slate-600">
            <button
              onClick={() => {
                setFilters(prev => ({ ...prev, category: 'Textiles, Fabrics & Garments', subcategory: 'All' }));
                setCurrentView('products');
              }}
              className="hover:text-teal-900 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 text-teal-800 font-semibold"
            >
              <Shirt className="w-3.5 h-3.5 text-teal-600" />
              <span>Cloth & Fabrics</span>
            </button>
            <button
              onClick={() => setCurrentView('products')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer ${
                currentView === 'products' ? 'text-teal-700 font-semibold' : ''
              }`}
            >
              All Products
            </button>
            <button
              onClick={() => setCurrentView('categories')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer ${
                currentView === 'categories' ? 'text-teal-700 font-semibold' : ''
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => setIsLaravelModalOpen(true)}
              className="hover:text-red-700 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 text-red-600 font-semibold"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Blade + Vue Demo</span>
            </button>
            <button
              onClick={() => openRfqModal()}
              className="hover:text-teal-900 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 text-teal-800 font-bold"
            >
              <PlusCircle className="w-3.5 h-3.5 text-teal-600" />
              <span>Post Buy RFQ</span>
            </button>
          </nav>

          {/* Zone 3: Account & Primary Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Notification Bell */}
            <button
              onClick={() => setIsNotifOpen(true)}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center font-mono animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dashboard / Workspace Button */}
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                currentView === 'dashboard'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-teal-600" />
              <span className="hidden sm:inline">
                {currentUser.role === 'admin'
                  ? 'Admin Console'
                  : currentUser.role === 'manufacturer'
                  ? 'Manufacturer Workspace'
                  : 'Retailer Dashboard'}
              </span>
              <span className="sm:hidden">Dashboard</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar with Product Suggestions */}
        <div className="md:hidden px-4 pb-3">
          <SearchAutocomplete isMobile className="w-full" />
        </div>
      </header>

      {/* Notification Drawer Popover */}
      <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />

      {/* Laravel Hybrid Architecture Code Inspector Modal */}
      <LaravelInspectorModal isOpen={isLaravelModalOpen} onClose={() => setIsLaravelModalOpen(false)} />
    </>
  );
};
