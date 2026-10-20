import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Product,
  Category,
  Enquiry,
  Quotation,
  Order,
  AuditLog,
  Notification,
  FilterState,
  ProductStatus,
  VerificationStatus,
  OrderStatus
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_ENQUIRIES,
  INITIAL_QUOTATIONS,
  INITIAL_ORDERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';

interface ImpersonationState {
  isImpersonating: boolean;
  realAdmin: User | null;
  targetUser: User | null;
  reason: string;
  startedAt: string;
}

interface MarketplaceContextType {
  // Current user & Impersonation
  currentUser: User;
  allUsers: User[];
  impersonation: ImpersonationState;
  switchUser: (userId: string) => void;
  startImpersonation: (targetUserId: string, reason: string) => boolean;
  stopImpersonation: () => void;
  registerUser: (userData: Partial<User>) => User;
  verifyUser: (userId: string, status: VerificationStatus, notes?: string) => void;
  toggleUserSuspension: (userId: string) => void;

  // Catalogue & Products
  categories: Category[];
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'viewsCount' | 'enquiriesCount'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  moderateProduct: (id: string, status: ProductStatus, reason?: string) => void;

  // Enquiries & RFQs
  enquiries: Enquiry[];
  submitEnquiry: (enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'messages' | 'status'>, initialMessage?: string) => Enquiry;
  sendEnquiryMessage: (enquiryId: string, message: string, proposedPrice?: number) => void;

  // Quotations
  quotations: Quotation[];
  createQuotation: (quotation: Omit<Quotation, 'id' | 'quotationNumber' | 'createdAt' | 'status' | 'revisionNumber'>) => Quotation;
  reviseQuotation: (quotationId: string, newItems: Quotation['items'], shipping: number, deliveryTimeline: string, paymentTerms: string, notes?: string) => Quotation;
  acceptQuotation: (quotationId: string) => { quotation: Quotation; order: Order };
  rejectQuotation: (quotationId: string) => void;

  // Orders
  orders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Notifications & Audit Logs
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  auditLogs: AuditLog[];
  logAuditAction: (action: string, details: string, targetUserId?: string, targetUserName?: string) => void;

  // Navigation & View Routing
  currentView: 'home' | 'products' | 'product-detail' | 'dashboard' | 'categories' | 'contact';
  setCurrentView: (view: 'home' | 'products' | 'product-detail' | 'dashboard' | 'categories' | 'contact') => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;

  // Filters & Search
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  // RFQ Modal Controller
  rfqModalState: {
    isOpen: boolean;
    preselectedProduct?: Product;
    preselectedCategory?: string;
  };
  openRfqModal: (product?: Product, category?: string) => void;
  closeRfqModal: () => void;

  // System
  resetAllToDemoData: () => void;
}

const STORAGE_KEYS = {
  USERS: 'bharattrade_users_v3',
  PRODUCTS: 'bharattrade_products_v3',
  ENQUIRIES: 'bharattrade_enquiries_v3',
  QUOTATIONS: 'bharattrade_quotations_v3',
  ORDERS: 'bharattrade_orders_v3',
  AUDIT_LOGS: 'bharattrade_audit_logs_v3',
  NOTIFICATIONS: 'bharattrade_notifs_v3',
  CURRENT_USER_ID: 'bharattrade_current_uid_v3',
  WISHLIST: 'bharattrade_wishlist_v3'
};

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  category: 'All',
  subcategory: 'All',
  city: 'All',
  verifiedOnly: false,
  sampleAvailableOnly: false,
  sortBy: 'recommended'
};

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load persistent or default state
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    return saved || 'user-mfg-tex-1'; // Default as Dharmesh Kapadia (Surat TexFab Mills)
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
    return saved ? JSON.parse(saved) : INITIAL_ENQUIRIES;
  });

  const [quotations, setQuotations] = useState<Quotation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.QUOTATIONS);
    return saved ? JSON.parse(saved) : INITIAL_QUOTATIONS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    return saved ? JSON.parse(saved) : ['prod-cnc-1', 'prod-motor-1'];
  });

  // Navigation and Filter state
  const [currentView, setCurrentView] = useState<'home' | 'products' | 'product-detail' | 'dashboard' | 'categories' | 'contact'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // Impersonation state
  const [impersonation, setImpersonation] = useState<ImpersonationState>({
    isImpersonating: false,
    realAdmin: null,
    targetUser: null,
    reason: '',
    startedAt: ''
  });

  // RFQ Modal State
  const [rfqModalState, setRfqModalState] = useState<{
    isOpen: boolean;
    preselectedProduct?: Product;
    preselectedCategory?: string;
  }>({ isOpen: false });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));
  }, [enquiries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(quotations));
  }, [quotations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
  }, [currentUserId]);

  // Determine effective current user (impersonated or real)
  const currentUser = impersonation.isImpersonating && impersonation.targetUser
    ? impersonation.targetUser
    : users.find(u => u.id === currentUserId) || users[0];

  const logAuditAction = (action: string, details: string, targetUserId?: string, targetUserName?: string) => {
    const adminUser = impersonation.isImpersonating && impersonation.realAdmin
      ? impersonation.realAdmin
      : currentUser.role === 'admin' ? currentUser : users.find(u => u.role === 'admin') || users[0];

    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      adminId: adminUser.id,
      adminName: adminUser.name,
      action,
      targetUserId,
      targetUserName,
      details,
      ipAddress: '103.21.244.18',
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const switchUser = (userId: string) => {
    if (impersonation.isImpersonating) {
      stopImpersonation();
    }
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUserId(target.id);
    }
  };

  // Secure Admin Impersonation
  const startImpersonation = (targetUserId: string, reason: string): boolean => {
    const activeAdmin = currentUser.role === 'admin' ? currentUser : users.find(u => u.role === 'admin');
    if (!activeAdmin) return false;

    const target = users.find(u => u.id === targetUserId);
    if (!target) return false;

    // Prevent impersonating another administrator
    if (target.role === 'admin') {
      alert('Security policy prohibits impersonating another Administrator.');
      return false;
    }

    setImpersonation({
      isImpersonating: true,
      realAdmin: activeAdmin,
      targetUser: target,
      reason: reason.trim() || 'Troubleshooting and support verification',
      startedAt: new Date().toISOString()
    });

    logAuditAction(
      'IMPERSONATION_SESSION_STARTED',
      `Admin initiated impersonation of ${target.name} (${target.businessName}, ${target.role}). Stated reason: "${reason}"`,
      target.id,
      target.name
    );

    return true;
  };

  const stopImpersonation = () => {
    if (!impersonation.isImpersonating || !impersonation.realAdmin) return;

    logAuditAction(
      'IMPERSONATION_SESSION_ENDED',
      `Admin concluded impersonation session of ${impersonation.targetUser?.name}. Session duration started at ${impersonation.startedAt}.`,
      impersonation.targetUser?.id,
      impersonation.targetUser?.name
    );

    setCurrentUserId(impersonation.realAdmin.id);
    setImpersonation({
      isImpersonating: false,
      realAdmin: null,
      targetUser: null,
      reason: '',
      startedAt: ''
    });
  };

  const registerUser = (userData: Partial<User>): User => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name || 'New Enterprise User',
      email: userData.email || '',
      phone: userData.phone || '',
      role: userData.role || 'retailer',
      businessName: userData.businessName || 'Enterprise Trades',
      businessType: userData.businessType || 'Retailer',
      city: userData.city || 'Mumbai',
      state: userData.state || 'Maharashtra',
      gstin: userData.gstin,
      panNumber: userData.panNumber,
      verificationStatus: 'pending',
      rating: 5.0,
      reviewCount: 0,
      trustScore: 75,
      isSuspended: false,
      createdAt: new Date().toISOString()
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUserId(newUser.id);

    // Notify admins of new registration requiring verification
    const adminUser = users.find(u => u.role === 'admin');
    if (adminUser) {
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          recipientId: adminUser.id,
          title: `New ${newUser.role} Registration`,
          message: `${newUser.businessName} (${newUser.city}) registered and submitted GSTIN for verification.`,
          linkType: 'verification',
          linkId: newUser.id,
          isRead: false,
          createdAt: new Date().toISOString()
        },
        ...prev
      ]);
    }

    logAuditAction('USER_REGISTERED', `New account registered: ${newUser.businessName} (${newUser.role})`);
    return newUser;
  };

  const verifyUser = (userId: string, status: VerificationStatus, notes?: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          verificationStatus: status,
          verificationNotes: notes,
          trustScore: status === 'verified' ? Math.max(u.trustScore, 95) : u.trustScore
        };
      }
      return u;
    }));

    // Update verified badge on products of this user
    setProducts(prev => prev.map(p => {
      if (p.manufacturerId === userId) {
        return { ...p, isVerifiedSupplier: status === 'verified' };
      }
      return p;
    }));

    // Notification to user
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        recipientId: userId,
        title: status === 'verified' ? 'Account Verified by Compliance' : 'Verification Update',
        message: status === 'verified'
          ? 'Your GSTIN and business credentials have been verified. You now enjoy TrustSEAL visibility.'
          : `Verification status updated: ${status}. Notes: ${notes || 'Please update documents.'}`,
        isRead: false,
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);

    const target = users.find(u => u.id === userId);
    logAuditAction('USER_VERIFICATION_UPDATED', `Set verification status to ${status} for ${target?.name} (${target?.businessName}). Notes: ${notes || 'None'}`, userId, target?.name);
  };

  const toggleUserSuspension = (userId: string) => {
    let newSuspended = false;
    let targetName = '';
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        newSuspended = !u.isSuspended;
        targetName = u.name;
        return { ...u, isSuspended: newSuspended };
      }
      return u;
    }));

    logAuditAction(
      newSuspended ? 'USER_SUSPENDED' : 'USER_REACTIVATED',
      `Admin toggled suspension state to ${newSuspended ? 'SUSPENDED' : 'ACTIVE'} for user ${targetName}.`,
      userId,
      targetName
    );
  };

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'viewsCount' | 'enquiriesCount'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      viewsCount: 1,
      enquiriesCount: 0,
      slug: productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    };

    setProducts(prev => [newProduct, ...prev]);

    // Send notification to Admin for moderation if status is pending_approval
    if (newProduct.status === 'pending_approval') {
      const admin = users.find(u => u.role === 'admin');
      if (admin) {
        setNotifications(prev => [
          {
            id: `notif-${Date.now()}`,
            recipientId: admin.id,
            title: 'New Product Listing for Moderation',
            message: `${newProduct.manufacturerName} submitted "${newProduct.name}" for catalogue review.`,
            linkType: 'product',
            linkId: newProduct.id,
            isRead: false,
            createdAt: new Date().toISOString()
          },
          ...prev
        ]);
      }
    }

    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const moderateProduct = (id: string, status: ProductStatus, reason?: string) => {
    const prod = products.find(p => p.id === id);
    if (!prod) return;

    setProducts(prev => prev.map(p => p.id === id ? { ...p, status, rejectionReason: reason } : p));

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        recipientId: prod.manufacturerId,
        title: status === 'published' ? 'Listing Approved & Live' : 'Listing Status Updated',
        message: status === 'published'
          ? `Your product "${prod.name}" has been approved and is now live on BharatTrade catalogue.`
          : `Listing "${prod.name}" status changed to ${status}. Reason: ${reason || 'Compliance check'}`,
        linkType: 'product',
        linkId: prod.id,
        isRead: false,
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);

    logAuditAction('PRODUCT_MODERATION', `Product "${prod.name}" status updated to ${status}. Reason: ${reason || 'Approved by admin'}`);
  };

  // RFQ Submission (Supports targeting multiple suppliers simultaneously)
  const submitEnquiry = (
    enquiryData: Omit<Enquiry, 'id' | 'createdAt' | 'messages' | 'status'>,
    initialMessage?: string
  ): Enquiry => {
    const newEnquiry: Enquiry = {
      ...enquiryData,
      id: `enq-${Date.now()}`,
      status: 'open',
      createdAt: new Date().toISOString(),
      messages: initialMessage ? [
        {
          id: `msg-${Date.now()}`,
          senderId: enquiryData.retailerId,
          senderName: enquiryData.retailerName,
          senderRole: 'retailer',
          message: initialMessage,
          createdAt: new Date().toISOString(),
          proposedPrice: enquiryData.targetPricePerUnit
        }
      ] : []
    };

    setEnquiries(prev => [newEnquiry, ...prev]);

    // Increment enquiriesCount on product if attached
    if (newEnquiry.productId) {
      setProducts(prev => prev.map(p => p.id === newEnquiry.productId ? { ...p, enquiriesCount: p.enquiriesCount + 1 } : p));
    }

    // Send notifications to all target suppliers
    newEnquiry.targetSupplierIds.forEach(supplierId => {
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}-${supplierId}`,
          recipientId: supplierId,
          title: 'Direct RFQ / Commercial Lead Received',
          message: `${newEnquiry.retailerBusiness} (${newEnquiry.deliveryLocation}) requested quote for ${newEnquiry.quantityRequired} ${newEnquiry.unit} of "${newEnquiry.productTitle}".`,
          linkType: 'enquiry',
          linkId: newEnquiry.id,
          isRead: false,
          createdAt: new Date().toISOString()
        },
        ...prev
      ]);
    });

    return newEnquiry;
  };

  const sendEnquiryMessage = (enquiryId: string, message: string, proposedPrice?: number) => {
    const enq = enquiries.find(e => e.id === enquiryId);
    if (!enq) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      message,
      createdAt: new Date().toISOString(),
      proposedPrice
    };

    setEnquiries(prev => prev.map(e => {
      if (e.id === enquiryId) {
        return {
          ...e,
          status: proposedPrice ? 'negotiating' : e.status,
          messages: [...e.messages, newMessage]
        };
      }
      return e;
    }));

    // Notify the other party
    const recipientId = currentUser.id === enq.retailerId ? enq.primarySupplierId : enq.retailerId;
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        recipientId,
        title: `Message from ${currentUser.name}`,
        message: `New message on RFQ for "${enq.productTitle}": "${message.slice(0, 60)}..."`,
        linkType: 'enquiry',
        linkId: enquiryId,
        isRead: false,
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);
  };

  // Quotation Generator
  const createQuotation = (
    quotationData: Omit<Quotation, 'id' | 'quotationNumber' | 'createdAt' | 'status' | 'revisionNumber'>
  ): Quotation => {
    const newQuote: Quotation = {
      ...quotationData,
      id: `quote-${Date.now()}`,
      quotationNumber: `QT-2026-${Math.floor(100 + Math.random() * 900)}`,
      status: 'sent',
      revisionNumber: 1,
      createdAt: new Date().toISOString()
    };

    setQuotations(prev => [newQuote, ...prev]);

    // Update enquiry status to quoted
    setEnquiries(prev => prev.map(e => e.id === newQuote.enquiryId ? { ...e, status: 'quoted' } : e));

    // Notify retailer
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        recipientId: newQuote.retailerId,
        title: `Quotation Received: ${newQuote.quotationNumber}`,
        message: `${newQuote.manufacturerName} sent formal quote for ₹${newQuote.grandTotal.toLocaleString('en-IN')}.`,
        linkType: 'quotation',
        linkId: newQuote.id,
        isRead: false,
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);

    return newQuote;
  };

  const reviseQuotation = (
    quotationId: string,
    newItems: Quotation['items'],
    shipping: number,
    deliveryTimeline: string,
    paymentTerms: string,
    notes?: string
  ): Quotation => {
    const subtotal = newItems.reduce((acc, item) => acc + item.totalPrice, 0);
    const taxRate = 18;
    const taxAmount = Math.round(subtotal * (taxRate / 100));
    const grandTotal = subtotal + taxAmount + shipping;

    let updatedQuote: Quotation | undefined;

    setQuotations(prev => prev.map(q => {
      if (q.id === quotationId) {
        updatedQuote = {
          ...q,
          items: newItems,
          subtotal,
          taxAmount,
          shippingCharges: shipping,
          grandTotal,
          deliveryTimeline,
          paymentTerms,
          notes: notes || q.notes,
          revisionNumber: q.revisionNumber + 1,
          status: 'sent'
        };
        return updatedQuote;
      }
      return q;
    }));

    if (updatedQuote) {
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          recipientId: (updatedQuote as Quotation).retailerId,
          title: `Quotation Revised (Rev ${(updatedQuote as Quotation).revisionNumber})`,
          message: `${(updatedQuote as Quotation).manufacturerName} submitted revised price: ₹${(updatedQuote as Quotation).grandTotal.toLocaleString('en-IN')}.`,
          linkType: 'quotation',
          linkId: (updatedQuote as Quotation).id,
          isRead: false,
          createdAt: new Date().toISOString()
        },
        ...prev
      ]);
    }

    return updatedQuote as Quotation;
  };

  const acceptQuotation = (quotationId: string): { quotation: Quotation; order: Order } => {
    const quote = quotations.find(q => q.id === quotationId);
    if (!quote) throw new Error('Quotation not found');

    // Mark quotation accepted
    const updatedQuote: Quotation = { ...quote, status: 'accepted' };
    setQuotations(prev => prev.map(q => q.id === quotationId ? updatedQuote : q));

    // Update enquiry status
    setEnquiries(prev => prev.map(e => e.id === quote.enquiryId ? { ...e, status: 'closed' } : e));

    // Automatically convert to Purchase Order
    const newOrder: Order = {
      id: `po-${Date.now()}`,
      orderNumber: `PO-BT-${Math.floor(10000 + Math.random() * 90000)}`,
      quotationId: quote.id,
      enquiryId: quote.enquiryId,
      retailerId: quote.retailerId,
      retailerName: quote.retailerName,
      retailerBusiness: quote.retailerBusiness,
      manufacturerId: quote.manufacturerId,
      manufacturerName: quote.manufacturerName,
      productTitle: quote.productName,
      quantity: quote.items.reduce((acc, i) => acc + i.quantity, 0),
      unit: 'Units',
      grandTotal: quote.grandTotal,
      paymentTerms: quote.paymentTerms,
      shippingAddress: 'Buyer Verified Factory / Warehouse Address',
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);

    // Send notifications to Manufacturer
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        recipientId: quote.manufacturerId,
        title: `Deal Confirmed! Quotation Accepted`,
        message: `${quote.retailerBusiness} accepted quote ${quote.quotationNumber}. Purchase Order ${newOrder.orderNumber} generated for ₹${quote.grandTotal.toLocaleString('en-IN')}.`,
        linkType: 'order',
        linkId: newOrder.id,
        isRead: false,
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);

    logAuditAction(
      'ORDER_CONFIRMED',
      `Buyer ${quote.retailerBusiness} accepted Quotation ${quote.quotationNumber} from ${quote.manufacturerName}. PO #${newOrder.orderNumber} for ₹${quote.grandTotal.toLocaleString('en-IN')} created.`
    );

    return { quotation: updatedQuote, order: newOrder };
  };

  const rejectQuotation = (quotationId: string) => {
    setQuotations(prev => prev.map(q => q.id === quotationId ? { ...q, status: 'rejected' } : q));
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const openRfqModal = (product?: Product, category?: string) => {
    setRfqModalState({
      isOpen: true,
      preselectedProduct: product,
      preselectedCategory: category
    });
  };

  const closeRfqModal = () => {
    setRfqModalState({ isOpen: false });
  };

  const resetAllToDemoData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setProducts(INITIAL_PRODUCTS);
    setEnquiries(INITIAL_ENQUIRIES);
    setQuotations(INITIAL_QUOTATIONS);
    setOrders(INITIAL_ORDERS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentUserId('user-mfg-1');
    setWishlist(['prod-cnc-1', 'prod-motor-1']);
    setImpersonation({
      isImpersonating: false,
      realAdmin: null,
      targetUser: null,
      reason: '',
      startedAt: ''
    });
    setFilters(DEFAULT_FILTERS);
    setCurrentView('home');
    setSelectedProductId(null);
  };

  return (
    <MarketplaceContext.Provider
      value={{
        currentUser,
        allUsers: users,
        impersonation,
        switchUser,
        startImpersonation,
        stopImpersonation,
        registerUser,
        verifyUser,
        toggleUserSuspension,

        categories: INITIAL_CATEGORIES,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        moderateProduct,

        enquiries,
        submitEnquiry,
        sendEnquiryMessage,

        quotations,
        createQuotation,
        reviseQuotation,
        acceptQuotation,
        rejectQuotation,

        orders,
        updateOrderStatus,

        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        auditLogs,
        logAuditAction,

        currentView,
        setCurrentView,
        selectedProductId,
        setSelectedProductId,

        filters,
        setFilters,
        resetFilters,

        wishlist,
        toggleWishlist,

        rfqModalState,
        openRfqModal,
        closeRfqModal,

        resetAllToDemoData
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
