export type UserRole = 'admin' | 'manufacturer' | 'retailer';

export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'additional_info_required';

export type ProductStatus = 'draft' | 'pending_approval' | 'published' | 'rejected' | 'suspended';

export type QuotationStatus = 'draft' | 'sent' | 'viewed' | 'under_negotiation' | 'accepted' | 'rejected' | 'expired';

export type OrderStatus = 'placed' | 'confirmed' | 'in_production' | 'dispatched' | 'delivered' | 'cancelled';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  businessName: string;
  businessType: 'Manufacturer' | 'Wholesaler' | 'Retailer' | 'Trader' | 'Exporter';
  city: string;
  state: string;
  gstin?: string;
  panNumber?: string;
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  yearEstablished?: number;
  annualTurnover?: string;
  employeeCount?: string;
  rating: number;
  reviewCount: number;
  trustScore: number;
  isSuspended: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  productCount: number;
  subcategories: string[];
}

export interface TierPrice {
  minQuantity: number;
  maxQuantity?: number;
  unitPrice: number;
}

export interface ProductSpecification {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  manufacturerId: string;
  manufacturerName: string;
  manufacturerCity: string;
  manufacturerGstin?: string;
  isVerifiedSupplier: boolean;
  name: string;
  slug: string;
  category: string;
  subcategory: string;
  description: string;
  specifications: ProductSpecification[];
  images: string[];
  sku: string;
  brand: string;
  unit: string; // e.g. "Piece", "Set", "Metric Ton", "Meter", "Kg"
  moq: number; // Minimum Order Quantity
  basePrice: number;
  priceTiers: TierPrice[];
  availableQuantity: number;
  leadTimeDays: number;
  status: ProductStatus;
  rejectionReason?: string;
  isFeatured?: boolean;
  sampleAvailable: boolean;
  samplePrice?: number;
  viewsCount: number;
  enquiriesCount: number;
  createdAt: string;
}

export interface EnquiryMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  message: string;
  createdAt: string;
  proposedPrice?: number;
}

export interface Enquiry {
  id: string;
  retailerId: string;
  retailerName: string;
  retailerBusiness: string;
  retailerCity: string;
  retailerPhone: string;
  productId?: string;
  productTitle: string;
  productCategory: string;
  targetSupplierIds: string[]; // Supports multi-supplier RFQs
  primarySupplierId: string;
  quantityRequired: number;
  unit: string;
  targetPricePerUnit?: number;
  deliveryLocation: string;
  deliveryPincode: string;
  expectedDate?: string;
  specificationsSummary?: string;
  messages: EnquiryMessage[];
  status: 'open' | 'quoted' | 'negotiating' | 'closed';
  createdAt: string;
}

export interface QuotationItem {
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  enquiryId: string;
  manufacturerId: string;
  manufacturerName: string;
  manufacturerGstin: string;
  retailerId: string;
  retailerName: string;
  retailerBusiness: string;
  productName: string;
  items: QuotationItem[];
  subtotal: number;
  taxRate: number; // e.g., 18 for 18% GST
  taxAmount: number;
  shippingCharges: number;
  grandTotal: number;
  deliveryTimeline: string;
  paymentTerms: string; // e.g., "30% Advance, 70% before dispatch"
  validUntil: string;
  status: QuotationStatus;
  revisionNumber: number;
  notes?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  quotationId: string;
  enquiryId: string;
  retailerId: string;
  retailerName: string;
  retailerBusiness: string;
  manufacturerId: string;
  manufacturerName: string;
  productTitle: string;
  quantity: number;
  unit: string;
  grandTotal: number;
  paymentTerms: string;
  shippingAddress: string;
  status: OrderStatus;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetUserId?: string;
  targetUserName?: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  recipientId: string;
  title: string;
  message: string;
  linkType?: 'enquiry' | 'quotation' | 'order' | 'product' | 'verification';
  linkId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface FilterState {
  searchQuery: string;
  category: string;
  subcategory: string;
  city: string;
  minPrice?: number;
  maxPrice?: number;
  minMoq?: number;
  verifiedOnly: boolean;
  sampleAvailableOnly: boolean;
  sortBy: 'recommended' | 'price_low' | 'price_high' | 'moq_low' | 'newest';
}
