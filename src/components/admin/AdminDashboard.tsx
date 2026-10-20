import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  Users,
  ShieldCheck,
  Package,
  FileText,
  TrendingUp,
  AlertTriangle,
  UserCheck,
  Ban,
  CheckCircle,
  XCircle,
  Download,
  Search,
  ExternalLink,
  ShieldAlert,
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';
import { VerificationBadge, ProductStatusBadge } from '../common/Badge';
import { User, Product } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    allUsers,
    products,
    enquiries,
    quotations,
    orders,
    auditLogs,
    verifyUser,
    toggleUserSuspension,
    moderateProduct,
    startImpersonation,
    setSelectedProductId,
    setCurrentView
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'moderation' | 'rfqs' | 'audit'>('overview');
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'manufacturer' | 'retailer'>('all');

  // Impersonation Modal state
  const [impersonateModal, setImpersonateModal] = useState<{
    isOpen: boolean;
    user: User | null;
    reason: string;
  }>({ isOpen: false, user: null, reason: '' });

  // Moderation Reject Modal state
  const [rejectModal, setRejectModal] = useState<{
    isOpen: boolean;
    product: Product | null;
    reason: string;
  }>({ isOpen: false, product: null, reason: '' });

  // Metrics
  const totalManufacturers = allUsers.filter(u => u.role === 'manufacturer').length;
  const totalRetailers = allUsers.filter(u => u.role === 'retailer').length;
  const pendingVerifications = allUsers.filter(u => u.verificationStatus === 'pending').length;
  const pendingProductApprovals = products.filter(p => p.status === 'pending_approval');
  const totalGmv = orders.reduce((sum, o) => sum + o.grandTotal, 0);

  // Filtered users
  const filteredUsers = allUsers.filter(u => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (userSearch) {
      const q = userSearch.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.businessName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.gstin && u.gstin.toLowerCase().includes(q));
    }
    return true;
  });

  const handleStartImpersonate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!impersonateModal.user) return;
    const success = startImpersonation(impersonateModal.user.id, impersonateModal.reason);
    if (success) {
      setImpersonateModal({ isOpen: false, user: null, reason: '' });
      // Redirect to their dashboard view
      setActiveTab('overview');
    }
  };

  const handleRejectProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModal.product) return;
    moderateProduct(rejectModal.product.id, 'rejected', rejectModal.reason || 'Missing safety certification');
    setRejectModal({ isOpen: false, product: null, reason: '' });
  };

  const exportAuditLogsToCsv = () => {
    const headers = ['Log ID', 'Timestamp', 'Admin Name', 'Action', 'Target User', 'IP Address', 'Details'];
    const rows = auditLogs.map(log => [
      log.id,
      log.timestamp,
      `"${log.adminName}"`,
      log.action,
      `"${log.targetUserName || 'N/A'}"`,
      log.ipAddress,
      `"${log.details.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BharatTrade_Audit_Log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Marketplace Administration</h1>
            <span className="text-xs bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded font-mono">
              Super Admin Control
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Governance, GSTIN business audits, catalogue moderation, and secure impersonation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportAuditLogsToCsv}
            className="px-3.5 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit Trail (CSV)</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium">Manufacturers</div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1">{totalManufacturers}</div>
          <div className="text-[11px] text-teal-700 font-medium mt-1">Verified production plants</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium">Retailers & Buyers</div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1">{totalRetailers}</div>
          <div className="text-[11px] text-teal-700 font-medium mt-1">Commercial wholesale buyers</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium">Pending Verifications</div>
          <div className="text-2xl font-bold text-amber-700 font-mono mt-1">{pendingVerifications}</div>
          <div className="text-[11px] text-amber-800 font-medium mt-1">GSTIN / MCA checks</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium">Listing Moderation</div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1">
            {pendingProductApprovals.length}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Awaiting approval</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs col-span-2 lg:col-span-1">
          <div className="text-slate-500 text-xs font-medium">Confirmed Deals Volume</div>
          <div className="text-xl font-bold text-emerald-700 font-mono mt-1">
            ₹{totalGmv.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-800 font-medium mt-1">{orders.length} Purchase Orders</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-6 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'overview' ? 'border-teal-700 text-teal-800' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Overview & Quick Actions
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 border-b-2 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'users' ? 'border-teal-700 text-teal-800' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Users & Impersonation</span>
          {pendingVerifications > 0 && (
            <span className="bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full font-mono text-[10px]">
              {pendingVerifications}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('moderation')}
          className={`pb-3 border-b-2 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'moderation' ? 'border-teal-700 text-teal-800' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Product Moderation</span>
          {pendingProductApprovals.length > 0 && (
            <span className="bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded-full font-mono text-[10px]">
              {pendingProductApprovals.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('rfqs')}
          className={`pb-3 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'rfqs' ? 'border-teal-700 text-teal-800' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          RFQs & Enquiries Monitor ({enquiries.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'audit' ? 'border-teal-700 text-teal-800' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Security Audit Logs ({auditLogs.length})
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Pending Administrative Actions</h3>

            {pendingVerifications === 0 && pendingProductApprovals.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-medium">All compliance queues are clear!</p>
                <p className="text-xs text-slate-400 mt-1">No pending GSTIN verifications or product reviews.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {allUsers.filter(u => u.verificationStatus === 'pending').map(user => (
                  <div key={user.id} className="p-4 bg-amber-50/50 border border-amber-200 rounded-lg flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{user.businessName}</div>
                      <div className="text-slate-600 mt-0.5">
                        GSTIN: <span className="font-mono">{user.gstin || 'Not provided'}</span> · {user.city}, {user.state}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => verifyUser(user.id, 'verified')}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-semibold cursor-pointer shadow-xs"
                      >
                        Approve GSTIN
                      </button>
                      <button
                        onClick={() => verifyUser(user.id, 'rejected', 'Invalid GSTIN or mismatch with MCA records')}
                        className="px-3 py-1.5 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded font-semibold cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}

                {pendingProductApprovals.map(prod => (
                  <div key={prod.id} className="p-4 bg-teal-50/50 border border-teal-200 rounded-lg flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{prod.name}</div>
                      <div className="text-slate-600 mt-0.5">
                        By {prod.manufacturerName} · ₹{prod.basePrice.toLocaleString('en-IN')} / {prod.unit}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => moderateProduct(prod.id, 'published')}
                        className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded font-semibold cursor-pointer shadow-xs"
                      >
                        Approve Listing
                      </button>
                      <button
                        onClick={() => setRejectModal({ isOpen: true, product: prod, reason: '' })}
                        className="px-3 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded font-semibold cursor-pointer"
                      >
                        Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Impersonation & Security Protocol Card */}
          <div className="bg-slate-900 text-white p-6 rounded-xl space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="font-bold text-sm">Admin "Login-As" Impersonation</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Authorized administrators can enter manufacturer or retailer experiences for support and troubleshooting.
            </p>
            <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
              <li>Displays persistent yellow impersonation banner</li>
              <li>Requires mandatory audit reason</li>
              <li>One-click instant return to admin console</li>
              <li>Strict privilege isolation (no admin-to-admin)</li>
            </ul>
            <div className="pt-2">
              <button
                onClick={() => setActiveTab('users')}
                className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Select User to Impersonate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Users & Impersonation */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user, business name, GSTIN..."
                className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg outline-hidden text-slate-900"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setRoleFilter('all')}
                className={`px-3 py-1.5 rounded cursor-pointer font-medium ${
                  roleFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                All Roles
              </button>
              <button
                onClick={() => setRoleFilter('manufacturer')}
                className={`px-3 py-1.5 rounded cursor-pointer font-medium ${
                  roleFilter === 'manufacturer' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Manufacturers
              </button>
              <button
                onClick={() => setRoleFilter('retailer')}
                className={`px-3 py-1.5 rounded cursor-pointer font-medium ${
                  roleFilter === 'retailer' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Retailers
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                  <th className="py-2.5 px-3">Business / User</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">GSTIN / Status</th>
                  <th className="py-2.5 px-3">Account State</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{user.businessName}</div>
                      <div className="text-slate-500 text-[11px]">{user.name} · {user.email}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono uppercase text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-700">{user.city}, {user.state}</td>
                    <td className="py-3 px-3">
                      <div className="font-mono text-[11px] text-slate-700">{user.gstin || 'None'}</div>
                      <div className="mt-0.5"><VerificationBadge status={user.verificationStatus} /></div>
                    </td>
                    <td className="py-3 px-3">
                      {user.isSuspended ? (
                        <span className="text-rose-700 font-semibold flex items-center gap-1">
                          <Ban className="w-3.5 h-3.5" /> Suspended
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Active
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Impersonation Button */}
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => setImpersonateModal({ isOpen: true, user, reason: '' })}
                            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded text-[11px] shadow-xs cursor-pointer flex items-center gap-1"
                            title="Login-As user to troubleshoot or view their workspace"
                          >
                            <UserCheck className="w-3 h-3" />
                            <span>Login-As</span>
                          </button>
                        )}

                        {/* Verification controls */}
                        {user.verificationStatus === 'pending' && (
                          <button
                            onClick={() => verifyUser(user.id, 'verified')}
                            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-semibold cursor-pointer"
                          >
                            Verify
                          </button>
                        )}

                        {/* Suspension Toggle */}
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => toggleUserSuspension(user.id)}
                            className={`px-2 py-1 rounded text-[11px] font-medium cursor-pointer border ${
                              user.isSuspended
                                ? 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                                : 'border-rose-300 text-rose-700 hover:bg-rose-50'
                            }`}
                          >
                            {user.isSuspended ? 'Activate' : 'Suspend'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Product Moderation */}
      {activeTab === 'moderation' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden p-5 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Product Catalogue Moderation</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                  <th className="py-2.5 px-3">Product Name</th>
                  <th className="py-2.5 px-3">Manufacturer</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Price / MOQ</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map(prod => (
                  <tr key={prod.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{prod.name}</div>
                      <div className="text-slate-400 font-mono text-[11px]">SKU: {prod.sku}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-700">{prod.manufacturerName}</td>
                    <td className="py-3 px-3 text-slate-600">{prod.category}</td>
                    <td className="py-3 px-3 font-mono">
                      ₹{prod.basePrice.toLocaleString('en-IN')} / {prod.unit}
                      <div className="text-[10px] text-slate-400">MOQ: {prod.moq}</div>
                    </td>
                    <td className="py-3 px-3">
                      <ProductStatusBadge status={prod.status} />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedProductId(prod.id);
                            setCurrentView('product-detail');
                          }}
                          className="px-2.5 py-1 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded text-[11px] font-medium cursor-pointer"
                        >
                          View
                        </button>
                        {prod.status !== 'published' && (
                          <button
                            onClick={() => moderateProduct(prod.id, 'published')}
                            className="px-2.5 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded text-[11px] font-semibold cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                        {prod.status !== 'rejected' && (
                          <button
                            onClick={() => setRejectModal({ isOpen: true, product: prod, reason: '' })}
                            className="px-2.5 py-1 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded text-[11px] font-medium cursor-pointer"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: RFQs & Enquiries Monitor */}
      {activeTab === 'rfqs' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden p-5 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Platform RFQs & Commercial Inquiries</h3>

          <div className="space-y-3">
            {enquiries.map(enq => (
              <div key={enq.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-bold text-slate-900 text-sm">
                    {enq.productTitle}
                  </div>
                  <span className="font-mono text-xs bg-slate-200 px-2 py-0.5 rounded text-slate-800 uppercase">
                    Status: {enq.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-slate-600 pt-1">
                  <div>Buyer: <strong>{enq.retailerBusiness}</strong> ({enq.retailerCity})</div>
                  <div>Quantity: <strong className="font-mono">{enq.quantityRequired} {enq.unit}</strong></div>
                  <div>Target Price: <strong className="font-mono">{enq.targetPricePerUnit ? `₹${enq.targetPricePerUnit.toLocaleString('en-IN')}` : 'Open'}</strong></div>
                  <div>Target Suppliers: <strong>{enq.targetSupplierIds.length} Manufacturer(s)</strong></div>
                </div>

                {enq.messages.length > 0 && (
                  <div className="mt-2 p-2.5 bg-white rounded border border-slate-200 text-slate-700 italic">
                    "{enq.messages[enq.messages.length - 1].message}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Security Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Administrative Audit Trail & Security Events</h3>
            <button
              onClick={exportAuditLogsToCsv}
              className="text-xs text-teal-700 font-semibold hover:text-teal-800 flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-sans font-semibold">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Admin</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Details</th>
                  <th className="py-2.5 px-3">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="py-2.5 px-3 font-sans font-semibold text-slate-800 whitespace-nowrap">
                      {log.adminName}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-[10px] font-bold">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-sans text-slate-600 max-w-md truncate">
                      {log.details}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Impersonation Modal */}
      {impersonateModal.isOpen && impersonateModal.user && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Authorize Impersonation Session</h3>
                <p className="text-xs text-slate-500">Security compliance & audit requirement</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
              <div>Target User: <strong>{impersonateModal.user.name}</strong></div>
              <div>Business: <strong>{impersonateModal.user.businessName}</strong></div>
              <div>Role: <strong className="uppercase font-mono">{impersonateModal.user.role}</strong></div>
            </div>

            <form onSubmit={handleStartImpersonate} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Reason for Impersonation <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={impersonateModal.reason}
                  onChange={(e) => setImpersonateModal(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="e.g., Troubleshooting quote generation error, verifying catalog layout for supplier..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden resize-none text-slate-900"
                />
              </div>

              <div className="text-[11px] text-slate-500 bg-amber-50 p-2.5 rounded border border-amber-200">
                Notice: All actions during this impersonated session will be tied to your admin identity ({allUsers.find(u => u.role === 'admin')?.name}) and recorded in audit logs.
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setImpersonateModal({ isOpen: false, user: null, reason: '' })}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg cursor-pointer"
                >
                  Confirm & Enter Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Product Modal */}
      {rejectModal.isOpen && rejectModal.product && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Reject Listing Moderation</h3>
            <p className="text-xs text-slate-500">
              Provide feedback for {rejectModal.product.name} so the manufacturer can address compliance requirements.
            </p>

            <form onSubmit={handleRejectProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Reason for Rejection
                </label>
                <textarea
                  rows={3}
                  value={rejectModal.reason}
                  onChange={(e) => setRejectModal(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="e.g. Please provide BIS test certificate or update specification parameters."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden text-slate-900 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setRejectModal({ isOpen: false, product: null, reason: '' })}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-lg cursor-pointer"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
