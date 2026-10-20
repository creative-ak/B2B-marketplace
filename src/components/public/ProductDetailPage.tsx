import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  ShieldCheck,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Send,
  Truck,
  Heart,
  Share2,
  FileCheck,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { VerificationBadge } from '../common/Badge';

export const ProductDetailPage: React.FC = () => {
  const {
    products,
    selectedProductId,
    setSelectedProductId,
    setCurrentView,
    openRfqModal,
    submitEnquiry,
    currentUser,
    wishlist,
    toggleWishlist
  } = useMarketplace();

  const product = products.find(p => p.id === selectedProductId) || products[0];
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  // Quick In-Page Enquiry Form States
  const [inPageQty, setInPageQty] = useState(product?.moq || 1);
  const [deliveryPincode, setDeliveryPincode] = useState('560058');
  const [inPageLocation, setInPageLocation] = useState('Bengaluru, KA');
  const [inPageMessage, setInPageMessage] = useState('');
  const [isEnquirySent, setIsEnquirySent] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-600 text-sm">Product not found.</p>
        <button
          onClick={() => setCurrentView('products')}
          className="mt-4 px-4 py-2 bg-teal-700 text-white rounded-lg text-xs"
        >
          Back to Catalogue
        </button>
      </div>
    );
  }

  const isSaved = wishlist.includes(product.id);
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  const handleQuickEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitEnquiry(
      {
        retailerId: currentUser.id,
        retailerName: currentUser.name,
        retailerBusiness: currentUser.businessName,
        retailerCity: `${currentUser.city}, ${currentUser.state}`,
        retailerPhone: currentUser.phone,
        productId: product.id,
        productTitle: product.name,
        productCategory: product.category,
        targetSupplierIds: [product.manufacturerId],
        primarySupplierId: product.manufacturerId,
        quantityRequired: Number(inPageQty) || product.moq,
        unit: product.unit,
        targetPricePerUnit: product.basePrice,
        deliveryLocation: inPageLocation,
        deliveryPincode,
        specificationsSummary: inPageMessage
      },
      inPageMessage || `In-page RFQ from ${currentUser.businessName} for ${inPageQty} ${product.unit} of ${product.name}. Delivery: ${inPageLocation} (${deliveryPincode}).`
    );

    setIsEnquirySent(true);
    setTimeout(() => setIsEnquirySent(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button onClick={() => setCurrentView('home')} className="hover:text-slate-800 cursor-pointer">Home</button>
          <span>/</span>
          <button onClick={() => setCurrentView('products')} className="hover:text-slate-800 cursor-pointer">Products</button>
          <span>/</span>
          <span className="text-slate-600">{product.category}</span>
          <span>/</span>
          <span className="text-slate-900 font-medium truncate max-w-xs">{product.name}</span>
        </div>
        <button
          onClick={() => setCurrentView('products')}
          className="text-teal-700 hover:text-teal-800 flex items-center gap-1 font-medium cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalogue</span>
        </button>
      </div>

      {/* Main Contiguous Purchase and Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative bg-slate-100 rounded-xl overflow-hidden border border-slate-200 aspect-4/3 flex items-center justify-center">
            <img
              src={product.images[selectedImageIdx] || product.images[0]}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            {/* Top Tag */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="bg-slate-950/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>GSTIN Verified Facility</span>
              </span>
            </div>

            <button
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-md text-slate-700 hover:text-rose-600 transition-colors cursor-pointer"
              title="Save to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                    selectedImageIdx === idx ? 'border-teal-600 ring-2 ring-teal-100' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumb" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Supplier Credibility Scorecard */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Verified Manufacturer
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-0.5">{product.manufacturerName}</h3>
                <p className="text-xs text-slate-500">{product.manufacturerCity}</p>
              </div>
              <VerificationBadge status={product.isVerifiedSupplier ? 'verified' : 'pending'} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-slate-100 text-xs">
              <div>
                <div className="text-slate-400">GSTIN No.</div>
                <div className="font-semibold text-slate-800 font-mono text-[11px]">
                  {product.manufacturerGstin || '27AABCA1234F1Z8'}
                </div>
              </div>
              <div>
                <div className="text-slate-400">Response Rate</div>
                <div className="font-semibold text-emerald-700 font-mono">98.4% (Fast)</div>
              </div>
              <div>
                <div className="text-slate-400">Avg Lead Time</div>
                <div className="font-semibold text-slate-800 font-mono">{product.leadTimeDays} Days</div>
              </div>
              <div>
                <div className="text-slate-400">Trust Score</div>
                <div className="font-semibold text-teal-700 font-mono">96 / 100</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>Factory Audit & ISO 9001 Compliance Verified</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase & RFQ Module */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <div className="text-xs font-semibold text-teal-700 uppercase tracking-wide">
                {product.category} · {product.subcategory}
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mt-1 leading-snug">
                {product.name}
              </h1>
              <div className="text-xs text-slate-400 mt-1 font-mono">
                SKU: {product.sku} · Brand: {product.brand}
              </div>
            </div>

            {/* Price block */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-slate-500">Ex-Factory Wholesale Price</span>
                  <div className="text-3xl font-extrabold text-slate-900 font-mono mt-0.5">
                    ₹{product.basePrice.toLocaleString('en-IN')}{' '}
                    <span className="text-sm font-normal text-slate-500 font-sans">/ {product.unit}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Min. Order (MOQ)</span>
                  <span className="text-base font-bold text-slate-900 font-mono">
                    {product.moq} {product.unit}s
                  </span>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                * Prices exclusive of 18% GST and actual cargo freight. Volume tiers apply automatically.
              </div>
            </div>

            {/* Volume Tier Table */}
            {product.priceTiers.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-900 mb-2 uppercase tracking-wider">
                  Bulk Order Pricing Tiers
                </h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                  <div className="grid grid-cols-2 bg-slate-100 p-2 font-semibold text-slate-700">
                    <div>Order Quantity Range</div>
                    <div className="text-right">Unit Price (INR)</div>
                  </div>
                  {product.priceTiers.map((tier, idx) => (
                    <div
                      key={idx}
                      className={`grid grid-cols-2 p-2 border-t border-slate-100 ${
                        idx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'
                      }`}
                    >
                      <div className="font-medium text-slate-700 font-mono">
                        {tier.minQuantity} {tier.maxQuantity ? `– ${tier.maxQuantity}` : '+'} {product.unit}s
                      </div>
                      <div className="text-right font-bold text-teal-800 font-mono">
                        ₹{tier.unitPrice.toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick In-Page Quotation Form */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
                <span>Instant Quotation Request</span>
                <span className="text-emerald-700 font-semibold lowercase text-[11px] font-sans">
                  Ready stock: {product.availableQuantity} {product.unit}s
                </span>
              </h3>

              {isEnquirySent ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center space-y-1">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                  <div className="text-sm font-bold text-emerald-900">Quotation Request Dispatched!</div>
                  <div className="text-xs text-emerald-700">
                    {product.manufacturerName} has received your requirement. Track status in your Dashboard.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleQuickEnquirySubmit} className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Quantity ({product.unit})
                      </label>
                      <input
                        type="number"
                        min={product.moq}
                        value={inPageQty}
                        onChange={(e) => setInPageQty(Math.max(product.moq, parseInt(e.target.value) || product.moq))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 outline-hidden font-mono font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Delivery Pin Code
                      </label>
                      <input
                        type="text"
                        required
                        value={deliveryPincode}
                        onChange={(e) => setDeliveryPincode(e.target.value)}
                        placeholder="e.g. 411019"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 outline-hidden font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Destination City & Notes
                    </label>
                    <input
                      type="text"
                      value={inPageLocation}
                      onChange={(e) => setInPageLocation(e.target.value)}
                      placeholder="e.g. Bhosari Industrial Area, Pune"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 outline-hidden"
                    />
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="submit"
                      className="flex-1 py-3 px-4 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer text-xs"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send Commercial Enquiry</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => openRfqModal(product)}
                      className="py-3 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg text-xs cursor-pointer"
                    >
                      Detailed RFQ
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Technical Specifications Section */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 space-y-6">
        <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-3">
          Technical Specifications & Engineering Parameters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-xs">
          {product.specifications.map((spec, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-slate-100"
            >
              <span className="text-slate-500 font-medium">{spec.key}</span>
              <span className="font-semibold text-slate-900 font-mono text-right">{spec.value}</span>
            </div>
          ))}
        </div>

        <div className="pt-4 space-y-2">
          <h3 className="text-sm font-bold text-slate-900">Product Description & Application Scope</h3>
          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>
      </div>

      {/* Related Products in Same Category */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">
            Similar Equipment in {product.category}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map(rel => (
              <div
                key={rel.id}
                onClick={() => {
                  setSelectedProductId(rel.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="h-32 bg-slate-100 rounded-lg overflow-hidden mb-3">
                    <img src={rel.images[0]} alt={rel.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs line-clamp-2 hover:text-teal-700">
                    {rel.name}
                  </h4>
                  <div className="mt-2 text-xs font-mono font-bold text-slate-900">
                    ₹{rel.basePrice.toLocaleString('en-IN')} / {rel.unit}
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                  {rel.manufacturerCity}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
