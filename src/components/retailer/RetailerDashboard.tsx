import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  FileText,
  ShoppingBag,
  Send,
  MessageSquare,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2,
  Truck,
  Heart,
  ChevronRight,
  X,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { QuotationStatusBadge, OrderStatusBadge } from '../common/Badge';
import { Enquiry, Quotation } from '../../types';
import { SearchAutocomplete } from '../common/SearchAutocomplete';
import { Shirt, Sparkles } from 'lucide-react';

export const RetailerDashboard: React.FC = () => {
  const {
    currentUser,
    enquiries,
    sendEnquiryMessage,
    quotations,
    acceptQuotation,
    rejectQuotation,
    orders,
    products,
    wishlist,
    setSelectedProductId,
    setCurrentView,
    openRfqModal
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'rfqs' | 'compare' | 'orders' | 'wishlist'>('rfqs');
  const [activeNegotiationEnquiry, setActiveNegotiationEnquiry] = useState<Enquiry | null>(null);
  const [negotiationText, setNegotiationText] = useState('');
  const [counterPrice, setCounterPrice] = useState<number | undefined>(undefined);

  // Accepted Order Modal
  const [confirmedOrderModal, setConfirmedOrderModal] = useState<{
    isOpen: boolean;
    orderNumber: string;
    grandTotal: number;
    supplierName: string;
  }>({ isOpen: false, orderNumber: '', grandTotal: 0, supplierName: '' });

  // Filter retailer data
  const myEnquiries = enquiries.filter(e => e.retailerId === currentUser.id);
  const myQuotations = quotations.filter(q => q.retailerId === currentUser.id);
  const myOrders = orders.filter(o => o.retailerId === currentUser.id);
  const myWishlistProducts = products.filter(p => wishlist.includes(p.id));

  const handleSendNegotiationMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeNegotiationEnquiry || !negotiationText.trim()) return;

    sendEnquiryMessage(
      activeNegotiationEnquiry.id,
      negotiationText.trim(),
      counterPrice ? Number(counterPrice) : undefined
    );

    setNegotiationText('');
    setCounterPrice(undefined);

    const updated = enquiries.find(e => e.id === activeNegotiationEnquiry.id);
    if (updated) setActiveNegotiationEnquiry(updated);
  };

  const handleAcceptQuote = (quoteId: string) => {
    try {
      const { order, quotation } = acceptQuotation(quoteId);
      setConfirmedOrderModal({
        isOpen: true,
        orderNumber: order.orderNumber,
        grandTotal: quotation.grandTotal,
        supplierName: quotation.manufacturerName
      });
      setActiveTab('orders');
    } catch (err: any) {
      alert(err.message || 'Error accepting quotation');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Profile Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-emerald-800 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
            {currentUser.businessName.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900">{currentUser.businessName}</h1>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                Verified Retailer / Buyer
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Authorized Representative: {currentUser.name} · {currentUser.city}, {currentUser.state} · GSTIN: <span className="font-mono">{currentUser.gstin}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => openRfqModal()}
          className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Post New Buy Requirement</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium">Submitted RFQs</div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1">{myEnquiries.length}</div>
          <div className="text-[11px] text-teal-700 font-medium mt-1">Direct requirements</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium">Quotations Received</div>
          <div className="text-2xl font-bold text-blue-700 font-mono mt-1">{myQuotations.length}</div>
          <div className="text-[11px] text-blue-800 font-medium mt-1">Factory bids ready to compare</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium">Active Purchase Orders</div>
          <div className="text-2xl font-bold text-emerald-700 font-mono mt-1">{myOrders.length}</div>
          <div className="text-[11px] text-emerald-800 font-medium mt-1">Contracts in progress</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium">Saved Products</div>
          <div className="text-2xl font-bold text-slate-800 font-mono mt-1">{myWishlistProducts.length}</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">Tracked for future RFQs</div>
        </div>
      </div>

      {/* Retailer Sourcing & Product Search Bar with Real-Time Suggestions */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white p-5 rounded-2xl shadow-sm border border-teal-800/40 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Shirt className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Direct Sourcing Search (Retailer Hub)</h2>
              <p className="text-[11px] text-teal-200/80">Search fabrics, sarees, yarn, garments, or equipment with real-time suggestions</p>
            </div>
          </div>
          <span className="text-[11px] bg-teal-500/20 text-teal-300 font-medium px-2.5 py-1 rounded border border-teal-500/30 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-teal-300" />
            <span>Instant Supplier & Product Autocomplete</span>
          </span>
        </div>

        {/* Embedded Autocomplete Component */}
        <div className="max-w-3xl">
          <SearchAutocomplete className="w-full" />
        </div>

        {/* Quick Cloth Industry Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
          <span className="text-slate-400 font-medium">Quick Cloth Filters:</span>
          {[
            { label: 'Cotton Fabrics 180 GSM', query: 'Cotton Jersey Fabric' },
            { label: 'Surat Banarasi Silk Sarees', query: 'Surat Banarasi Silk' },
            { label: '12.5 Oz Denim Twill', query: 'Indigo Denim Twill' },
            { label: 'Tirupur Plain T-Shirts', query: "Men's Combed Cotton Plain T-Shirts" },
            { label: 'Rayon Kurti Sets', query: 'Anarkali Rayon Kurti Set' },
            { label: '30s Cotton Weaving Yarn', query: '30s Combed Cotton Weaving Yarn' }
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                // Navigate to products with this query
                window.location.hash = '#';
                const searchInput = document.querySelector('input[placeholder*="Search fabrics"]') as HTMLInputElement;
                if (searchInput) {
                  searchInput.value = item.query;
                  searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
              }}
              className="px-2 py-0.5 rounded bg-teal-950/80 text-teal-200 border border-teal-700/60 hover:bg-teal-800 transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-6 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('rfqs')}
          className={`pb-3 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'rfqs' ? 'border-teal-700 text-teal-800' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          My RFQs & Enquiries ({myEnquiries.length})
        </button>
        <button
          onClick={() => setActiveTab('compare')}
          className={`pb-3 border-b-2 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'compare' ? 'border-teal-700 text-teal-800' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Quotation Comparison Matrix</span>
          {myQuotations.length > 0 && (
            <span className="bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded-full font-mono text-[10px]">
              {myQuotations.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'orders' ? 'border-teal-700 text-teal-800' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Purchase Orders & Invoices ({myOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('wishlist')}
          className={`pb-3 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'wishlist' ? 'border-teal-700 text-teal-800' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Saved Products ({myWishlistProducts.length})
        </button>
      </div>

      {/* Tab: My RFQs & Enquiries */}
      {activeTab === 'rfqs' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Dispatched Buy Requirements (RFQs)</h3>
            <button
              onClick={() => openRfqModal()}
              className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post Another RFQ</span>
            </button>
          </div>

          <div className="space-y-4">
            {myEnquiries.map(enq => (
              <div key={enq.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{enq.productTitle}</h4>
                    <p className="text-[11px] text-slate-500">
                      Dispatched on: {new Date(enq.createdAt).toLocaleDateString()} · Target: {enq.targetSupplierIds.length} Verified Supplier(s)
                    </p>
                  </div>
                  <span className="bg-slate-200 text-slate-800 font-mono text-xs px-2 py-0.5 rounded font-semibold uppercase">
                    Status: {enq.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-700">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Quantity Required</span>
                    <span className="font-bold font-mono">{enq.quantityRequired} {enq.unit}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Expected Target Price</span>
                    <span className="font-bold font-mono">
                      {enq.targetPricePerUnit ? `₹${enq.targetPricePerUnit.toLocaleString('en-IN')}` : 'Market Competitive'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Delivery Location</span>
                    <span>{enq.deliveryLocation} ({enq.deliveryPincode})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Quotes Available</span>
                    <span className="font-bold text-teal-800 font-mono">
                      {quotations.filter(q => q.enquiryId === enq.id).length} Received
                    </span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => setActiveNegotiationEnquiry(enq)}
                    className="text-xs text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Open Supplier Conversation ({enq.messages.length} messages)</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('compare')}
                    className="px-3 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-800 rounded font-semibold text-xs cursor-pointer flex items-center gap-1"
                  >
                    <span>View Quotes Matrix</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Quotation Comparison Matrix */}
      {activeTab === 'compare' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden p-5 space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Quotation Comparison Matrix</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Compare factory rates, GST 18%, shipping costs, lead time, and payment terms side-by-side.
            </p>
          </div>

          {myQuotations.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium">No quotations received yet.</p>
              <p className="text-xs text-slate-400 mt-1">Manufacturers are reviewing your RFQs and will submit formal bids.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myQuotations.map(quote => (
                <div
                  key={quote.id}
                  className={`rounded-xl border p-5 flex flex-col justify-between space-y-4 ${
                    quote.status === 'accepted'
                      ? 'border-emerald-300 bg-emerald-50/20 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 text-sm">{quote.quotationNumber}</span>
                          <span className="text-[10px] text-slate-500 font-mono">Rev {quote.revisionNumber}</span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm mt-0.5">{quote.manufacturerName}</h4>
                        <span className="text-[11px] text-slate-400 font-mono">GSTIN: {quote.manufacturerGstin}</span>
                      </div>
                      <QuotationStatusBadge status={quote.status} />
                    </div>

                    <div className="text-xs text-slate-700 font-medium border-t border-slate-100 pt-2">
                      {quote.productName}
                    </div>

                    {/* Breakdown sheet */}
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1.5 font-mono">
                      <div className="flex justify-between text-slate-600">
                        <span>Items Subtotal:</span>
                        <span>₹{quote.subtotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>GST @ {quote.taxRate}%:</span>
                        <span>₹{quote.taxAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Road Freight Logistics:</span>
                        <span>₹{quote.shippingCharges.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between font-extrabold text-slate-900 text-sm border-t border-slate-200 pt-1.5">
                        <span>Total (CIF Destination):</span>
                        <span className="text-teal-900">₹{quote.grandTotal.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* Terms */}
                    <div className="space-y-1 text-xs text-slate-600 border-t border-slate-100 pt-2">
                      <div><strong>Lead Time:</strong> {quote.deliveryTimeline}</div>
                      <div><strong>Payment:</strong> {quote.paymentTerms}</div>
                      <div><strong>Validity:</strong> Until {quote.validUntil}</div>
                      {quote.notes && <div className="text-[11px] text-slate-500 italic mt-1">{quote.notes}</div>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                    {quote.status !== 'accepted' && quote.status !== 'rejected' && (
                      <>
                        <button
                          onClick={() => handleAcceptQuote(quote.id)}
                          className="flex-1 py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Accept Quotation & Confirm PO</span>
                        </button>
                        <button
                          onClick={() => rejectQuotation(quote.id)}
                          className="py-2 px-3 border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-semibold rounded-lg cursor-pointer"
                        >
                          Decline
                        </button>
                      </>
                    )}
                    {quote.status === 'accepted' && (
                      <div className="w-full py-2 bg-emerald-100 text-emerald-800 text-center font-bold text-xs rounded-lg flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Accepted · Purchase Order Created</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Purchase Orders & Invoices */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden p-5 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Purchase Orders & Confirmed Contracts</h3>

          {myOrders.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium">No confirmed orders yet.</p>
              <p className="text-xs text-slate-400 mt-1">Accepting a quotation automatically converts it into a formal Purchase Order.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myOrders.map(order => (
                <div key={order.id} className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <div>
                      <span className="font-mono font-bold text-sm text-slate-900">{order.orderNumber}</span>
                      <span className="text-slate-500 ml-2">({order.productTitle})</span>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-700">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Manufacturer Plant</span>
                      <span className="font-bold">{order.manufacturerName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Order Grand Total</span>
                      <span className="font-bold font-mono text-teal-800 text-sm">
                        ₹{order.grandTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Payment Terms</span>
                      <span>{order.paymentTerms}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">PO Issued On</span>
                      <span className="font-mono">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded border border-slate-200 text-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Shipping & Billing Address:</span>
                      <span>{order.shippingAddress}</span>
                    </div>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      <span>E-Way Bill & Compliance Verified</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Saved Products */}
      {activeTab === 'wishlist' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Saved Machinery & Products for Future Procurement</h3>

          {myWishlistProducts.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <Heart className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium">Your wishlist is empty.</p>
              <p className="text-xs text-slate-400 mt-1">Browse products and click the heart icon to save items for future RFQs.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {myWishlistProducts.map(prod => (
                <div key={prod.id} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="h-32 bg-slate-100 rounded-lg overflow-hidden mb-3">
                      <img src={prod.images[0]} alt={prod.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs line-clamp-2">{prod.name}</h4>
                    <div className="font-mono font-bold text-slate-900 text-sm mt-1">
                      ₹{prod.basePrice.toLocaleString('en-IN')} / {prod.unit}
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => openRfqModal(prod)}
                      className="flex-1 py-1.5 px-2 bg-teal-700 hover:bg-teal-800 text-white rounded text-xs font-semibold cursor-pointer"
                    >
                      Request Quote
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProductId(prod.id);
                        setCurrentView('product-detail');
                      }}
                      className="py-1.5 px-2 border border-slate-300 text-slate-700 rounded text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Negotiation Thread Modal */}
      {activeNegotiationEnquiry && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Communicate & Negotiate</h3>
                <p className="text-xs text-slate-500">RFQ: {activeNegotiationEnquiry.productTitle}</p>
              </div>
              <button onClick={() => setActiveNegotiationEnquiry(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2.5 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              {activeNegotiationEnquiry.messages.map(msg => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-lg max-w-[85%] ${
                    msg.senderId === currentUser.id
                      ? 'ml-auto bg-teal-700 text-white'
                      : 'mr-auto bg-white border border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="text-[10px] opacity-75 font-semibold">{msg.senderName} ({msg.senderRole})</div>
                  <div className="mt-1 leading-relaxed">{msg.message}</div>
                  {msg.proposedPrice && (
                    <div className="text-[10px] font-mono mt-1 font-bold">
                      Counter-Offer: ₹{msg.proposedPrice.toLocaleString('en-IN')}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleSendNegotiationMessage} className="space-y-2 text-xs">
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Counter Price (₹ optional)"
                  value={counterPrice !== undefined ? counterPrice : ''}
                  onChange={(e) => setCounterPrice(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-36 px-3 py-2 border border-slate-300 rounded-lg outline-hidden font-mono"
                />
                <input
                  type="text"
                  required
                  value={negotiationText}
                  onChange={(e) => setNegotiationText(e.target.value)}
                  placeholder="Ask for discount, expedited delivery, or terms..."
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg cursor-pointer"
                >
                  Send Counter Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmed Order Modal */}
      {confirmedOrderModal.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">Purchase Order Generated!</h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              Quotation accepted from <strong>{confirmedOrderModal.supplierName}</strong>. Official PO #{confirmedOrderModal.orderNumber} for ₹{confirmedOrderModal.grandTotal.toLocaleString('en-IN')} has been logged in the contract register.
            </p>

            <button
              onClick={() => setConfirmedOrderModal({ isOpen: false, orderNumber: '', grandTotal: 0, supplierName: '' })}
              className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg text-xs cursor-pointer"
            >
              View Order in Register
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
