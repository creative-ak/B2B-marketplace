import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  Package,
  Plus,
  Send,
  FileText,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Building2,
  ShieldCheck,
  MessageSquare,
  Edit,
  Trash2,
  X,
  PlusCircle,
  ArrowRight
} from 'lucide-react';
import { ProductStatusBadge, QuotationStatusBadge, OrderStatusBadge, VerificationBadge } from '../common/Badge';
import { Product, Enquiry, Quotation, Order, TierPrice, ProductSpecification } from '../../types';

export const ManufacturerDashboard: React.FC = () => {
  const {
    currentUser,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    enquiries,
    sendEnquiryMessage,
    quotations,
    createQuotation,
    reviseQuotation,
    orders,
    updateOrderStatus,
    categories,
    setSelectedProductId,
    setCurrentView
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'products' | 'inbox' | 'quotes' | 'orders' | 'profile'>('products');

  // Add Product Modal State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Industrial Machinery & Equipment',
    subcategory: 'CNC Machining Centers',
    description: '',
    sku: '',
    brand: currentUser.businessName.split(' ')[0] || 'Apex',
    unit: 'Piece',
    moq: 1,
    basePrice: 50000,
    availableQuantity: 20,
    leadTimeDays: 7,
    sampleAvailable: false,
    samplePrice: 0,
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    specifications: [
      { key: 'Operating Voltage', value: '415V 3-Phase' },
      { key: 'Warranty', value: '12 Months' }
    ] as ProductSpecification[],
    priceTiers: [
      { minQuantity: 1, maxQuantity: 5, unitPrice: 50000 },
      { minQuantity: 6, unitPrice: 46000 }
    ] as TierPrice[]
  });

  // Quotation Builder Modal
  const [quoteModal, setQuoteModal] = useState<{
    isOpen: boolean;
    enquiry: Enquiry | null;
    unitPrice: number;
    shippingCharges: number;
    deliveryTimeline: string;
    paymentTerms: string;
    notes: string;
  }>({
    isOpen: false,
    enquiry: null,
    unitPrice: 0,
    shippingCharges: 15000,
    deliveryTimeline: '4 to 6 business days via dedicated road freight',
    paymentTerms: '20% Advance token, 80% upon e-way bill generation',
    notes: 'Includes manufacturer warranty certificate and test bench report.'
  });

  // Active Enquiry Thread Modal
  const [activeThreadEnquiry, setActiveThreadEnquiry] = useState<Enquiry | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  // Products belonging to current manufacturer
  const myProducts = products.filter(p => p.manufacturerId === currentUser.id);

  // Enquiries targeting this manufacturer
  const myEnquiries = enquiries.filter(
    e => e.targetSupplierIds.includes(currentUser.id) || e.primarySupplierId === currentUser.id
  );

  // Quotations created by this manufacturer
  const myQuotes = quotations.filter(q => q.manufacturerId === currentUser.id);

  // Orders won by this manufacturer
  const myOrders = orders.filter(o => o.manufacturerId === currentUser.id);
  const totalRevenue = myOrders.reduce((sum, o) => sum + o.grandTotal, 0);

  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name) return;

    addProduct({
      manufacturerId: currentUser.id,
      manufacturerName: currentUser.businessName,
      manufacturerCity: `${currentUser.city}, ${currentUser.state}`,
      manufacturerGstin: currentUser.gstin,
      isVerifiedSupplier: currentUser.verificationStatus === 'verified',
      name: productForm.name,
      slug: productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: productForm.category,
      subcategory: productForm.subcategory,
      description: productForm.description,
      specifications: productForm.specifications,
      images: [productForm.imageUrl],
      sku: productForm.sku || `SKU-${Date.now().toString().slice(-6)}`,
      brand: productForm.brand,
      unit: productForm.unit,
      moq: Number(productForm.moq) || 1,
      basePrice: Number(productForm.basePrice),
      priceTiers: productForm.priceTiers,
      availableQuantity: Number(productForm.availableQuantity),
      leadTimeDays: Number(productForm.leadTimeDays),
      status: 'pending_approval',
      sampleAvailable: productForm.sampleAvailable,
      samplePrice: productForm.samplePrice
    });

    setIsAddProductOpen(false);
  };

  const handleSendQuotationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteModal.enquiry) return;

    const subtotal = quoteModal.unitPrice * quoteModal.enquiry.quantityRequired;
    const taxRate = 18;
    const taxAmount = Math.round(subtotal * (taxRate / 100));
    const grandTotal = subtotal + taxAmount + Number(quoteModal.shippingCharges);

    createQuotation({
      enquiryId: quoteModal.enquiry.id,
      manufacturerId: currentUser.id,
      manufacturerName: currentUser.businessName,
      manufacturerGstin: currentUser.gstin || '27AABCA1234F1Z8',
      retailerId: quoteModal.enquiry.retailerId,
      retailerName: quoteModal.enquiry.retailerName,
      retailerBusiness: quoteModal.enquiry.retailerBusiness,
      productName: quoteModal.enquiry.productTitle,
      items: [
        {
          description: `${quoteModal.enquiry.productTitle} (${quoteModal.enquiry.specificationsSummary || 'Standard Specifications'})`,
          quantity: quoteModal.enquiry.quantityRequired,
          unitPrice: Number(quoteModal.unitPrice),
          totalPrice: subtotal
        }
      ],
      subtotal,
      taxRate,
      taxAmount,
      shippingCharges: Number(quoteModal.shippingCharges),
      grandTotal,
      deliveryTimeline: quoteModal.deliveryTimeline,
      paymentTerms: quoteModal.paymentTerms,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: quoteModal.notes
    });

    setQuoteModal({ ...quoteModal, isOpen: false, enquiry: null });
    setActiveTab('quotes');
  };

  const handleSendThreadReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeThreadEnquiry || !replyMessage.trim()) return;
    sendEnquiryMessage(activeThreadEnquiry.id, replyMessage.trim());
    setReplyMessage('');
    // Refresh local active thread reference
    const updated = enquiries.find(e => e.id === activeThreadEnquiry.id);
    if (updated) setActiveThreadEnquiry(updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Profile Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-teal-800 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
            {currentUser.businessName.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900">{currentUser.businessName}</h1>
              <VerificationBadge status={currentUser.verificationStatus} />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Plant Location: {currentUser.city}, {currentUser.state} · GSTIN: <span className="font-mono">{currentUser.gstin}</span> · Est. {currentUser.yearEstablished}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddProductOpen(true)}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>List New Product</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium">Published Products</div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1">{myProducts.length}</div>
          <div className="text-[11px] text-teal-700 font-medium mt-1">Active on marketplace</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium">Inbound RFQs / Leads</div>
          <div className="text-2xl font-bold text-teal-800 font-mono mt-1">{myEnquiries.length}</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Direct commercial inquiries</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium">Quotations Sent</div>
          <div className="text-2xl font-bold text-blue-700 font-mono mt-1">{myQuotes.length}</div>
          <div className="text-[11px] text-blue-800 font-medium mt-1">Active proposals</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium">Purchase Orders Won</div>
          <div className="text-2xl font-bold text-emerald-700 font-mono mt-1">{myOrders.length}</div>
          <div className="text-[11px] text-emerald-800 font-medium mt-1">Accepted contracts</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs col-span-2 lg:col-span-1">
          <div className="text-slate-500 text-xs font-medium">Total Orders Value</div>
          <div className="text-xl font-bold text-emerald-800 font-mono mt-1">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">Completed / In Production</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-6 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'products' ? 'border-teal-700 text-teal-800' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Product Catalogue ({myProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('inbox')}
          className={`pb-3 border-b-2 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'inbox' ? 'border-teal-700 text-teal-800' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>RFQ Leads Inbox</span>
          {myEnquiries.length > 0 && (
            <span className="bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded-full font-mono text-[10px]">
              {myEnquiries.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('quotes')}
          className={`pb-3 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'quotes' ? 'border-teal-700 text-teal-800' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Quotations Sent ({myQuotes.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'orders' ? 'border-teal-700 text-teal-800' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Orders & Dispatches ({myOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'profile' ? 'border-teal-700 text-teal-800' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Business Credentials & GSTIN
        </button>
      </div>

      {/* Tab: Products Catalogue */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Listed Equipment & Raw Materials</h3>
            <button
              onClick={() => setIsAddProductOpen(true)}
              className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                  <th className="py-2.5 px-3">Product Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Base Price</th>
                  <th className="py-2.5 px-3">MOQ</th>
                  <th className="py-2.5 px-3">Lead Time</th>
                  <th className="py-2.5 px-3">Listing Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myProducts.map(product => (
                  <tr key={product.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{product.name}</div>
                      <div className="text-slate-400 font-mono text-[11px]">SKU: {product.sku}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{product.category}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      ₹{product.basePrice.toLocaleString('en-IN')} / {product.unit}
                    </td>
                    <td className="py-3 px-3 font-mono">{product.moq} {product.unit}s</td>
                    <td className="py-3 px-3 font-mono">{product.leadTimeDays} Days</td>
                    <td className="py-3 px-3">
                      <ProductStatusBadge status={product.status} />
                      {product.rejectionReason && (
                        <div className="text-[10px] text-rose-600 mt-0.5">{product.rejectionReason}</div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedProductId(product.id);
                            setCurrentView('product-detail');
                          }}
                          className="px-2 py-1 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 cursor-pointer"
                        >
                          View
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: RFQ Leads Inbox */}
      {activeTab === 'inbox' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden p-5 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Inbound Buyer Enquiries & Quotation Requests</h3>

          {myEnquiries.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium">No incoming RFQs yet.</p>
              <p className="text-xs text-slate-400 mt-1">Inquiries from buyers will appear here in real time.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myEnquiries.map(enq => (
                <div key={enq.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{enq.productTitle}</h4>
                      <p className="text-[11px] text-slate-500">
                        Received from: <strong>{enq.retailerBusiness}</strong> ({enq.retailerName}) · {enq.retailerCity}
                      </p>
                    </div>
                    <span className="bg-teal-100 text-teal-800 font-mono text-xs px-2 py-0.5 rounded font-semibold uppercase">
                      Status: {enq.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-700">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Quantity Required</span>
                      <span className="font-bold font-mono">{enq.quantityRequired} {enq.unit}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Target Price</span>
                      <span className="font-bold font-mono">
                        {enq.targetPricePerUnit ? `₹${enq.targetPricePerUnit.toLocaleString('en-IN')} / ${enq.unit}` : 'Open to quote'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Delivery Location</span>
                      <span className="font-medium">{enq.deliveryLocation} ({enq.deliveryPincode})</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Buyer Contact</span>
                      <span className="font-mono">{enq.retailerPhone}</span>
                    </div>
                  </div>

                  {enq.specificationsSummary && (
                    <div className="p-2.5 bg-white rounded border border-slate-200 text-slate-700">
                      <strong>Buyer Notes:</strong> {enq.specificationsSummary}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => setActiveThreadEnquiry(enq)}
                      className="text-xs text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Negotiation Thread ({enq.messages.length} messages)</span>
                    </button>

                    <button
                      onClick={() => setQuoteModal({
                        isOpen: true,
                        enquiry: enq,
                        unitPrice: enq.targetPricePerUnit || 40000,
                        shippingCharges: 15000,
                        deliveryTimeline: '4 to 6 business days',
                        paymentTerms: '20% Advance token, 80% on dispatch',
                        notes: 'Includes manufacturer warranty and test bench report.'
                      })}
                      className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Generate Commercial Quotation</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Quotations Sent */}
      {activeTab === 'quotes' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden p-5 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Commercial Quotations Submitted</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                  <th className="py-2.5 px-3">Quotation #</th>
                  <th className="py-2.5 px-3">Buyer Company</th>
                  <th className="py-2.5 px-3">Product</th>
                  <th className="py-2.5 px-3">Grand Total (incl. GST)</th>
                  <th className="py-2.5 px-3">Payment Terms</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Validity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myQuotes.map(quote => (
                  <tr key={quote.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      {quote.quotationNumber}
                      <span className="text-[10px] text-slate-400 block font-sans">Rev {quote.revisionNumber}</span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-800">{quote.retailerBusiness}</div>
                      <div className="text-slate-500 text-[11px]">{quote.retailerName}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-700 max-w-xs truncate">{quote.productName}</td>
                    <td className="py-3 px-3 font-mono font-extrabold text-teal-800">
                      ₹{quote.grandTotal.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-slate-600 text-[11px]">{quote.paymentTerms}</td>
                    <td className="py-3 px-3">
                      <QuotationStatusBadge status={quote.status} />
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500">{quote.validUntil}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Orders & Dispatches */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden p-5 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Purchase Orders & Production Status</h3>

          {myOrders.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <Truck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium">No confirmed orders yet.</p>
              <p className="text-xs text-slate-400 mt-1">When buyers accept your quotations, orders appear here automatically.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myOrders.map(order => (
                <div key={order.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <div>
                      <span className="font-mono font-bold text-sm text-slate-900">{order.orderNumber}</span>
                      <span className="text-slate-500 ml-2">({order.productTitle})</span>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-700">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Buyer</span>
                      <span className="font-bold">{order.retailerBusiness}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Order Total</span>
                      <span className="font-bold font-mono text-teal-800">₹{order.grandTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Payment Terms</span>
                      <span>{order.paymentTerms}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Shipping Destination</span>
                      <span className="truncate block">{order.shippingAddress}</span>
                    </div>
                  </div>

                  {/* Order Stage Update */}
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500 text-[11px]">Update production & logistics stage:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateOrderStatus(order.id, 'in_production')}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                          order.status === 'in_production' ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        In Production
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'dispatched')}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                          order.status === 'dispatched' ? 'bg-sky-700 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        Dispatched
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                          order.status === 'delivered' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        Delivered
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Business Credentials */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Manufacturer Business Registration & Tax Info</h3>
            <p className="text-xs text-slate-500 mt-0.5">Verified company credentials displayed to authorized retail buyers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-3">
              <div>
                <label className="text-slate-500 font-medium">Business / Legal Entity Name</label>
                <div className="font-bold text-slate-900 text-sm mt-0.5">{currentUser.businessName}</div>
              </div>
              <div>
                <label className="text-slate-500 font-medium">GSTIN Identification Number</label>
                <div className="font-bold font-mono text-slate-900 mt-0.5 flex items-center gap-2">
                  <span>{currentUser.gstin || '27AABCA1234F1Z8'}</span>
                  <VerificationBadge status={currentUser.verificationStatus} />
                </div>
              </div>
              <div>
                <label className="text-slate-500 font-medium">Permanent Account Number (PAN)</label>
                <div className="font-mono text-slate-900 mt-0.5">{currentUser.panNumber || 'AABCA1234F'}</div>
              </div>
              <div>
                <label className="text-slate-500 font-medium">Year Established</label>
                <div className="text-slate-900 mt-0.5">{currentUser.yearEstablished}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-slate-500 font-medium">Annual Turnover</label>
                <div className="font-semibold text-slate-900 mt-0.5">{currentUser.annualTurnover}</div>
              </div>
              <div>
                <label className="text-slate-500 font-medium">Operating City & State</label>
                <div className="text-slate-900 mt-0.5">{currentUser.city}, {currentUser.state}</div>
              </div>
              <div>
                <label className="text-slate-500 font-medium">Manufacturing Plant Scale</label>
                <div className="text-slate-900 mt-0.5">{currentUser.employeeCount}</div>
              </div>
              <div>
                <label className="text-slate-500 font-medium">TrustSEAL Rating</label>
                <div className="font-bold text-emerald-700 font-mono text-sm mt-0.5">{currentUser.trustScore} / 100</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">List New Product / Machinery</h3>
                <p className="text-xs text-slate-500">Listing will be submitted for compliance catalogue moderation</p>
              </div>
              <button onClick={() => setIsAddProductOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProductSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. 15 kW Automatic Plastic Extruder"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">SKU / Model Code</label>
                  <input
                    type="text"
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    placeholder="e.g. APX-EXT-15KW"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden bg-white"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Base Wholesale Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={productForm.basePrice}
                    onChange={(e) => setProductForm({ ...productForm, basePrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Unit</label>
                  <select
                    value={productForm.unit}
                    onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden bg-white"
                  >
                    <option value="Piece">Piece</option>
                    <option value="Set">Set</option>
                    <option value="Metric Ton">Metric Ton</option>
                    <option value="Meter">Meter</option>
                    <option value="Kg">Kg</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Min. Order (MOQ)</label>
                  <input
                    type="number"
                    min="1"
                    value={productForm.moq}
                    onChange={(e) => setProductForm({ ...productForm, moq: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Available Quantity</label>
                  <input
                    type="number"
                    value={productForm.availableQuantity}
                    onChange={(e) => setProductForm({ ...productForm, availableQuantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Lead Time (Days)</label>
                  <input
                    type="number"
                    value={productForm.leadTimeDays}
                    onChange={(e) => setProductForm({ ...productForm, leadTimeDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Technical Description</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Engineered for continuous production, heavy grade steel body, thermal overload protection..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg cursor-pointer shadow-xs"
                >
                  Submit for Moderation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Commercial Quotation Generator Modal */}
      {quoteModal.isOpen && quoteModal.enquiry && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Generate Commercial Quotation</h3>
                <p className="text-xs text-slate-500">Official B2B quotation for {quoteModal.enquiry.retailerBusiness}</p>
              </div>
              <button
                onClick={() => setQuoteModal({ ...quoteModal, isOpen: false, enquiry: null })}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendQuotationSubmit} className="space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="font-bold text-slate-800">{quoteModal.enquiry.productTitle}</div>
                <div className="text-slate-600">
                  Quantity Required: <strong className="font-mono">{quoteModal.enquiry.quantityRequired} {quoteModal.enquiry.unit}</strong>
                </div>
                <div className="text-slate-600">
                  Destination: {quoteModal.enquiry.deliveryLocation} ({quoteModal.enquiry.deliveryPincode})
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Quoted Unit Rate (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={quoteModal.unitPrice}
                    onChange={(e) => setQuoteModal({ ...quoteModal, unitPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden font-mono font-bold text-teal-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Road Freight / Shipping (₹)
                  </label>
                  <input
                    type="number"
                    value={quoteModal.shippingCharges}
                    onChange={(e) => setQuoteModal({ ...quoteModal, shippingCharges: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden font-mono"
                  />
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="p-3 bg-teal-50/50 border border-teal-200 rounded-lg space-y-1 font-mono text-[11px]">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({quoteModal.enquiry.quantityRequired} x ₹{quoteModal.unitPrice}):</span>
                  <span>₹{(quoteModal.unitPrice * quoteModal.enquiry.quantityRequired).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST @ 18%:</span>
                  <span>₹{Math.round(quoteModal.unitPrice * quoteModal.enquiry.quantityRequired * 0.18).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Freight & Handling:</span>
                  <span>₹{quoteModal.shippingCharges.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-bold text-teal-900 border-t border-teal-200 pt-1 text-xs">
                  <span>Grand Total (CIF):</span>
                  <span>
                    ₹{(
                      quoteModal.unitPrice * quoteModal.enquiry.quantityRequired +
                      Math.round(quoteModal.unitPrice * quoteModal.enquiry.quantityRequired * 0.18) +
                      quoteModal.shippingCharges
                    ).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Delivery Timeline</label>
                <input
                  type="text"
                  value={quoteModal.deliveryTimeline}
                  onChange={(e) => setQuoteModal({ ...quoteModal, deliveryTimeline: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Payment Terms</label>
                <input
                  type="text"
                  value={quoteModal.paymentTerms}
                  onChange={(e) => setQuoteModal({ ...quoteModal, paymentTerms: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setQuoteModal({ ...quoteModal, isOpen: false, enquiry: null })}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Official Quotation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Active Enquiry Negotiation Thread Modal */}
      {activeThreadEnquiry && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Enquiry Conversation</h3>
                <p className="text-xs text-slate-500">
                  Buyer: {activeThreadEnquiry.retailerBusiness} · {activeThreadEnquiry.productTitle}
                </p>
              </div>
              <button onClick={() => setActiveThreadEnquiry(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2.5 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              {activeThreadEnquiry.messages.map(msg => (
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
                      Proposed Price: ₹{msg.proposedPrice.toLocaleString('en-IN')}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleSendThreadReply} className="flex gap-2">
              <input
                type="text"
                required
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your commercial reply or price negotiation..."
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg text-xs cursor-pointer shrink-0"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
