import React, { useState, useEffect } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { X, Send, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Product } from '../../types';

export const RFQModal: React.FC = () => {
  const {
    rfqModalState,
    closeRfqModal,
    currentUser,
    categories,
    allUsers,
    submitEnquiry
  } = useMarketplace();

  const { isOpen, preselectedProduct, preselectedCategory } = rfqModalState;

  const [productTitle, setProductTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Industrial Machinery & Equipment');
  const [quantity, setQuantity] = useState(10);
  const [unit, setUnit] = useState('Piece');
  const [targetPrice, setTargetPrice] = useState<number | undefined>(undefined);
  const [deliveryLocation, setDeliveryLocation] = useState('Peenya, Bengaluru');
  const [pincode, setPincode] = useState('560058');
  const [specsMessage, setSpecsMessage] = useState('');
  const [targetAllSuppliers, setTargetAllSuppliers] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (preselectedProduct) {
      setProductTitle(preselectedProduct.name);
      setSelectedCategory(preselectedProduct.category);
      setUnit(preselectedProduct.unit);
      setQuantity(preselectedProduct.moq);
      setTargetPrice(preselectedProduct.basePrice);
      setTargetAllSuppliers(false);
    } else if (preselectedCategory) {
      setSelectedCategory(preselectedCategory);
      setProductTitle('');
      setTargetAllSuppliers(true);
    } else {
      setProductTitle('');
      setTargetAllSuppliers(true);
    }
    setIsSuccess(false);
  }, [isOpen, preselectedProduct, preselectedCategory]);

  if (!isOpen) return null;

  // Determine target suppliers
  const getEligibleSuppliers = () => {
    const manufacturers = allUsers.filter(u => u.role === 'manufacturer' && !u.isSuspended);
    if (preselectedProduct) {
      return [preselectedProduct.manufacturerId];
    }
    if (targetAllSuppliers) {
      return manufacturers.map(m => m.id);
    }
    return manufacturers.slice(0, 2).map(m => m.id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productTitle.trim()) return;

    const targetSupplierIds = getEligibleSuppliers();
    const primarySupplierId = preselectedProduct ? preselectedProduct.manufacturerId : targetSupplierIds[0] || 'user-mfg-1';

    submitEnquiry(
      {
        retailerId: currentUser.id,
        retailerName: currentUser.name,
        retailerBusiness: currentUser.businessName,
        retailerCity: `${currentUser.city}, ${currentUser.state}`,
        retailerPhone: currentUser.phone,
        productId: preselectedProduct?.id,
        productTitle: productTitle.trim(),
        productCategory: selectedCategory,
        targetSupplierIds,
        primarySupplierId,
        quantityRequired: Number(quantity) || 1,
        unit,
        targetPricePerUnit: targetPrice ? Number(targetPrice) : undefined,
        deliveryLocation,
        deliveryPincode: pincode,
        specificationsSummary: specsMessage
      },
      specsMessage || `We require commercial quotation for ${quantity} ${unit} of ${productTitle}. Please share best bulk price.`
    );

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      closeRfqModal();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {preselectedProduct ? 'Request Quotation / Best Price' : 'Post Buy Requirement (RFQ)'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Get competitive, itemized quotes from verified Indian manufacturers
            </p>
          </div>
          <button
            onClick={closeRfqModal}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">RFQ Broadcast Successfully!</h4>
            <p className="text-xs text-slate-600 mt-2 max-w-sm mx-auto">
              Your requirement has been dispatched to {getEligibleSuppliers().length} verified supplier(s). You will receive formal quotations and notifications shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            {/* Product Title */}
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Product / Machinery Requirement <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
                placeholder="e.g. 20 HP 3-Phase Induction Motor, CNC VMC Milling Center"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-hidden"
              />
            </div>

            {/* Category selection if not preselected */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 outline-hidden bg-white"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Quantity & Unit */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Quantity <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Unit</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 outline-hidden bg-white"
                  >
                    <option value="Piece">Piece</option>
                    <option value="Set">Set</option>
                    <option value="Metric Ton">Metric Ton</option>
                    <option value="Meter">Meter</option>
                    <option value="Kg">Kg</option>
                    <option value="Liter">Liter</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Target Price & Delivery */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Target Price / Unit (₹)
                </label>
                <input
                  type="number"
                  placeholder="Optional expectation"
                  value={targetPrice !== undefined ? targetPrice : ''}
                  onChange={(e) => setTargetPrice(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Delivery City / District <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  placeholder="e.g. Pune, MH"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Postal Pin Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="e.g. 411019"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 outline-hidden font-mono"
                />
              </div>
            </div>

            {/* Specifications & Message */}
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Detailed Specifications & Terms
              </label>
              <textarea
                rows={3}
                value={specsMessage}
                onChange={(e) => setSpecsMessage(e.target.value)}
                placeholder="Mention required grade, voltage, test certificates, packaging preferences, or delivery timeline..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 outline-hidden resize-none"
              />
            </div>

            {/* Broadcast Multi-Supplier Toggle */}
            {!preselectedProduct && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900">Broadcast to all verified category suppliers</div>
                  <div className="text-[11px] text-slate-500">Increases competitive quotations and speeds up response time.</div>
                </div>
                <input
                  type="checkbox"
                  checked={targetAllSuppliers}
                  onChange={(e) => setTargetAllSuppliers(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded cursor-pointer"
                />
              </div>
            )}

            {/* Buyer contact reminder */}
            <div className="flex items-center gap-2 text-slate-500 text-[11px] bg-slate-50 p-2.5 rounded">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
              <span>
                Sending as <strong>{currentUser.businessName}</strong> ({currentUser.phone}) · Verified Buyer
              </span>
            </div>

            {/* Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={closeRfqModal}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit RFQ Requirement</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
