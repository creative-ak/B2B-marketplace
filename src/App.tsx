import React, { useState } from 'react';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import { ImpersonationBanner } from './components/layout/ImpersonationBanner';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './components/public/HomePage';
import { ProductListingPage } from './components/public/ProductListingPage';
import { ProductDetailPage } from './components/public/ProductDetailPage';
import { CategoriesPage } from './components/public/CategoriesPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ManufacturerDashboard } from './components/manufacturer/ManufacturerDashboard';
import { RetailerDashboard } from './components/retailer/RetailerDashboard';
import { RFQModal } from './components/public/RFQModal';
import { AuthModal } from './components/auth/AuthModal';

const AppContent: React.FC = () => {
  const { currentView, currentUser } = useMarketplace();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage />;
      case 'products':
        return <ProductListingPage />;
      case 'product-detail':
        return <ProductDetailPage />;
      case 'categories':
        return <CategoriesPage />;
      case 'dashboard':
        if (currentUser.role === 'admin') {
          return <AdminDashboard />;
        }
        if (currentUser.role === 'manufacturer') {
          return <ManufacturerDashboard />;
        }
        return <RetailerDashboard />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Impersonation Banner (Top Priority Sticky when Admin Impersonation is Active) */}
      <ImpersonationBanner />

      {/* Top Header */}
      <Header onOpenAuth={() => setIsAuthOpen(true)} />

      {/* Main Viewport Content */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <RFQModal />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <MarketplaceProvider>
      <AppContent />
    </MarketplaceProvider>
  );
}
